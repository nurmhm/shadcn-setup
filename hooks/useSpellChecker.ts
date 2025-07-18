"use client";

import { useCallback, useEffect, useState } from "react";

export interface SpellCheckResult {
  word: string;
  isCorrect: boolean;
  suggestions: string[];
  position: { start: number; end: number };
}

export interface SpellCheckerConfig {
  enableRealTime: boolean;
  customWords: string[];
  ignoreCapitalized: boolean;
  ignoreNumbers: boolean;
}

// Comprehensive dictionary of common English words
const COMMON_WORDS = new Set([
  "the",
  "be",
  "to",
  "of",
  "and",
  "a",
  "in",
  "that",
  "have",
  "i",
  "it",
  "for",
  "not",
  "on",
  "with",
  "he",
  "as",
  "you",
  "do",
  "at",
  "this",
  "but",
  "his",
  "by",
  "from",
  "they",
  "we",
  "say",
  "her",
  "she",
  "or",
  "an",
  "will",
  "my",
  "one",
  "all",
  "would",
  "there",
  "their",
  "what",
  "so",
  "up",
  "out",
  "if",
  "about",
  "who",
  "get",
  "which",
  "go",
  "me",
  "when",
  "make",
  "can",
  "like",
  "time",
  "no",
  "just",
  "him",
  "know",
  "take",
  "people",
  "into",
  "year",
  "your",
  "good",
  "some",
  "could",
  "them",
  "see",
  "other",
  "than",
  "then",
  "now",
  "look",
  "only",
  "come",
  "its",
  "over",
  "think",
  "also",
  "back",
  "after",
  "use",
  "two",
  "how",
  "our",
  "work",
  "first",
  "well",
  "way",
  "even",
  "new",
  "want",
  "because",
  "any",
  "these",
  "give",
  "day",
  "most",
  "us",
  "is",
  "was",
  "are",
  "been",
  "has",
  "had",
  "were",
  "said",
  "each",
  "much",
  "where",
  "hello",
  "world",
  "love",
  "life",
  "home",
  "family",
  "friend",
  "friends",
  "school",
  "job",
  "money",
  "food",
  "water",
  "house",
  "car",
  "book",
  "read",
  "write",
  "learn",
  "study",
  "teach",
  "student",
  "teacher",
  "class",
  "room",
  "door",
  "window",
  "table",
  "chair",
  "bed",
  "sleep",
  "eat",
  "drink",
  "walk",
  "run",
  "play",
  "game",
  "music",
  "song",
  "movie",
  "watch",
  "listen",
  "talk",
  "speak",
  "tell",
  "ask",
  "answer",
  "question",
  "problem",
  "solution",
  "help",
  "need",
  "buy",
  "sell",
  "pay",
  "cost",
  "price",
  "cheap",
  "expensive",
  "free",
  "open",
  "close",
  "start",
  "stop",
  "begin",
  "end",
  "finish",
  "complete",
  "done",
  "ready",
  "wait",
  "fast",
  "slow",
  "quick",
  "easy",
  "hard",
  "difficult",
  "simple",
  "big",
  "small",
  "large",
  "little",
  "long",
  "short",
  "tall",
  "high",
  "low",
  "wide",
  "narrow",
  "thick",
  "thin",
  "heavy",
  "light",
  "strong",
  "weak",
  "hot",
  "cold",
  "warm",
  "cool",
  "wet",
  "dry",
  "clean",
  "dirty",
  "old",
  "new",
  "young",
  "nice",
  "beautiful",
  "ugly",
  "good",
  "bad",
  "best",
  "worst",
  "better",
  "worse",
  "right",
  "wrong",
  "true",
  "false",
  "real",
  "sure",
  "maybe",
  "yes",
  "no",
  "ok",
  "okay",
  "computer",
  "internet",
  "website",
  "email",
  "phone",
  "mobile",
  "app",
  "software",
  "program",
  "code",
  "data",
  "file",
  "save",
  "delete",
  "copy",
  "paste",
  "print",
  "download",
  "upload",
  "online",
  "offline",
  "network",
  "wifi",
  "password",
  "user",
  "account",
  "login",
  "logout",
  "go",
  "come",
  "see",
  "look",
  "watch",
  "hear",
  "listen",
  "feel",
  "touch",
  "smell",
  "taste",
  "think",
  "know",
  "understand",
  "remember",
  "forget",
  "learn",
  "teach",
  "study",
  "read",
  "write",
  "speak",
  "talk",
  "say",
  "tell",
  "ask",
  "answer",
  "call",
  "meet",
  "visit",
  "travel",
  "move",
  "stay",
  "live",
  "die",
  "grow",
  "change",
  "become",
  "turn",
  "keep",
  "hold",
  "carry",
  "bring",
  "take",
  "give",
  "receive",
  "send",
  "buy",
  "sell",
  "pay",
  "spend",
  "save",
  "earn",
  "work",
  "play",
  "rest",
  "sleep",
  "wake",
  "eat",
  "drink",
  "cook",
  "clean",
  "wash",
  "wear",
  "dress",
  "happy",
  "sad",
  "angry",
  "excited",
  "tired",
  "hungry",
  "sick",
  "healthy",
  "smart",
  "funny",
  "serious",
  "kind",
  "mean",
  "nice",
  "rude",
  "polite",
  "friendly",
  "shy",
  "brave",
  "scared",
  "worried",
  "calm",
  "nervous",
  "proud",
  "surprised",
  "confused",
  "clear",
  "dark",
  "bright",
  "loud",
  "quiet",
  "soft",
  "hard",
  "smooth",
  "rough",
  "sharp",
  "sweet",
  "sour",
  "bitter",
  "salty",
  "today",
  "yesterday",
  "tomorrow",
  "now",
  "then",
  "soon",
  "later",
  "early",
  "late",
  "morning",
  "afternoon",
  "evening",
  "night",
  "day",
  "week",
  "month",
  "year",
  "hour",
  "minute",
  "second",
  "time",
  "clock",
  "calendar",
  "date",
  "birthday",
  "holiday",
  "weekend",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
  "hundred",
  "thousand",
  "million",
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "last",
  "next",
  "many",
  "few",
  "some",
  "all",
  "none",
  "every",
  "each",
  "both",
  "more",
  "less",
  "most",
  "least",
  "enough",
  "too",
  "very",
  "quite",
  "here",
  "there",
  "where",
  "home",
  "house",
  "building",
  "room",
  "kitchen",
  "bedroom",
  "bathroom",
  "office",
  "school",
  "hospital",
  "store",
  "shop",
  "restaurant",
  "hotel",
  "park",
  "street",
  "road",
  "city",
  "town",
  "country",
  "world",
  "north",
  "south",
  "east",
  "west",
  "left",
  "right",
  "up",
  "down",
  "front",
  "back",
  "inside",
  "outside",
  "above",
  "below",
  "under",
  "over",
  "between",
  "near",
  "far",
  "close",
  "away",
  "hello",
  "hi",
  "goodbye",
  "bye",
  "thanks",
  "thank",
  "please",
  "sorry",
  "excuse",
  "welcome",
  "congratulations",
  "luck",
  "care",
  "later",
  "meet",
  "fine",
  "great",
  "wonderful",
  "amazing",
  "awesome",
  "cool",
  "interesting",
  "boring",
  "strange",
  "weird",
  "normal",
  "special",
  "important",
]);

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
  for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

export const useSpellChecker = (
  config: SpellCheckerConfig = {
    enableRealTime: false,
    customWords: [],
    ignoreCapitalized: false,
    ignoreNumbers: true,
  }
) => {
  const [dictionary, setDictionary] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const combinedWords = new Set([
      ...COMMON_WORDS,
      ...config.customWords.map((word) => word.toLowerCase()),
    ]);
    setDictionary(combinedWords);
    setIsLoading(false);
    console.log(`Dictionary initialized with ${combinedWords.size} words`);
  }, [config.customWords]);

  const checkWord = useCallback(
    (word: string): boolean => {
      if (!word || word.trim() === "") return true;

      const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
      if (cleanWord.length === 0) return true;

      if (config.ignoreNumbers && /^\d+$/.test(cleanWord)) return true;
      if (config.ignoreCapitalized && word[0] === word[0].toUpperCase())
        return true;

      const isCorrect = dictionary.has(cleanWord);
      if (!isCorrect) {
        console.log(`Misspelled: "${word}" -> "${cleanWord}"`);
      }
      return isCorrect;
    },
    [dictionary, config.ignoreNumbers, config.ignoreCapitalized]
  );

  const getSuggestions = useCallback(
    (word: string): string[] => {
      if (!word || dictionary.has(word.toLowerCase())) return [];

      const suggestions: Array<{ word: string; distance: number }> = [];
      const maxDistance = Math.min(3, Math.floor(word.length / 2));

      dictionary.forEach((dictWord) => {
        if (Math.abs(dictWord.length - word.length) <= maxDistance) {
          const distance = levenshteinDistance(word.toLowerCase(), dictWord);
          if (distance <= maxDistance) {
            suggestions.push({ word: dictWord, distance });
          }
        }
      });

      return suggestions
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5)
        .map((s) => s.word);
    },
    [dictionary]
  );

  const extractWords = useCallback(
    (text: string): Array<{ word: string; start: number; end: number }> => {
      const words: Array<{ word: string; start: number; end: number }> = [];
      const regex = /\b\w+\b/g;
      let match;

      while ((match = regex.exec(text)) !== null) {
        words.push({
          word: match[0],
          start: match.index,
          end: match.index + match[0].length,
        });
      }
      return words;
    },
    []
  );

  const spellCheck = useCallback(
    (text: string): SpellCheckResult[] => {
      if (!text || isLoading) return [];

      const words = extractWords(text);
      const results: SpellCheckResult[] = [];

      words.forEach(({ word, start, end }) => {
        const isCorrect = checkWord(word);
        const suggestions = isCorrect ? [] : getSuggestions(word);

        results.push({
          word,
          isCorrect,
          suggestions,
          position: { start, end },
        });
      });

      return results;
    },
    [isLoading, extractWords, checkWord, getSuggestions]
  );

  return {
    spellCheck,
    checkWord,
    getSuggestions,
    isLoading,
    addCustomWord: (word: string) => {
      setDictionary((prev) => new Set([...prev, word.toLowerCase()]));
    },
  };
};
