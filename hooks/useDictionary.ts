"use client";

import { useState, useEffect } from "react";

// আমাদের ডিকশনারি অবজেক্টের জন্য একটি টাইপ 정의 করছি
export interface IMyDictionary {
  check: (word: string) => boolean;
  suggest: (word: string) => string[];
}

const useDictionary = () => {
  const [dictionary, setDictionary] = useState<IMyDictionary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDictionary = async () => {
      // এই কোড শুধুমাত্র ক্লায়েন্ট-সাইডে চলবে
      if (typeof window !== "undefined") {
        try {
          const TypoClass = (await import("typo-js")).default;

          // স্ট্যান্ডার্ড ডিকশনারি ফাইল লোড করা
          const affResponse = await fetch("/dictionaries/en_US.aff");
          const affData = await affResponse.text();
          const dicResponse = await fetch("/dictionaries/en_US.dic");
          const dicData = await dicResponse.text();

          // কাস্টম ডিকশনারি লোড করা
          const customWordsResponse = await fetch("/api/dictionary");
          const { words: customWords } = await customWordsResponse.json();
          const customWordsSet = new Set(
            customWords.map((w: string) => w.toLowerCase())
          );

          const typoInstance = new TypoClass("en_US", affData, dicData);

          // দুটি ডিকশনারি মিলিয়ে একটি অবজেক্ট তৈরি করা
          const combinedChecker: IMyDictionary = {
            check: (word) => {
              const lowerCaseWord = word.toLowerCase();
              return (
                typoInstance.check(lowerCaseWord) ||
                customWordsSet.has(lowerCaseWord)
              );
            },
            suggest: (word) => {
              // সাজেশন শুধু স্ট্যান্ডার্ড ডিকশনারি থেকেই আসবে
              return typoInstance.suggest(word);
            },
          };

          setDictionary(combinedChecker);
        } catch (error) {
          console.error("Failed to initialize dictionary:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeDictionary();
  }, []);

  return { dictionary, isLoading };
};

export default useDictionary;
