"use client";

import React, { useCallback, useState } from "react";
import { SpellCheckResult, useSpellChecker } from "../../hooks/useSpellChecker";
import styles from "./SpellChecker.module.css";

interface SpellCheckerProps {
  editorRef: React.RefObject<any>;
  onCorrection?: (originalWord: string, correctedWord: string) => void;
}

interface SuggestionPopup {
  word: string;
  suggestions: string[];
  position: { x: number; y: number };
  originalPosition: { start: number; end: number };
}

const SpellChecker: React.FC<SpellCheckerProps> = ({
  editorRef,
  onCorrection,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<SpellCheckResult[]>([]);
  const [suggestionPopup, setSuggestionPopup] =
    useState<SuggestionPopup | null>(null);
  const [enableRealTime, setEnableRealTime] = useState(true); // Enable by default
  const [customWords, setCustomWords] = useState<string[]>([]);
  const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);
  const lastContent = React.useRef<string>("");

  const { spellCheck, addCustomWord, isLoading } = useSpellChecker({
    enableRealTime,
    customWords,
    ignoreCapitalized: false,
    ignoreNumbers: true,
  });

  // Real-time spell checking effect
  React.useEffect(() => {
    if (!enableRealTime || isLoading || !editorRef.current?.editor) return;

    const checkSpellingWithDelay = () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        const currentText = getEditorText();
        if (currentText !== lastContent.current && currentText.trim()) {
          lastContent.current = currentText;
          performRealTimeSpellCheck();
        }
      }, 1000); // 1 second delay
    };

    const performRealTimeSpellCheck = () => {
      const text = getEditorText();
      if (!text.trim()) return;

      const spellCheckResults = spellCheck(text);
      setResults(spellCheckResults);
      highlightMisspelledWords(spellCheckResults);
    };

    // Set up event listeners for editor changes
    const editor = editorRef.current.editor;
    if (editor) {
      editor.events.on("change", checkSpellingWithDelay);
      editor.events.on("keyup", checkSpellingWithDelay);

      // Initial check
      checkSpellingWithDelay();
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (editor) {
        editor.events.off("change", checkSpellingWithDelay);
        editor.events.off("keyup", checkSpellingWithDelay);
      }
    };
  }, [
    enableRealTime,
    isLoading,
    editorRef,
    spellCheck,
    getEditorText,
    highlightMisspelledWords,
  ]);

  // Get text content from Jodit editor
  const getEditorText = useCallback((): string => {
    if (!editorRef.current?.editor) return "";
    return editorRef.current.editor.text || "";
  }, [editorRef]);

  // Get HTML content from Jodit editor
  const getEditorHTML = useCallback((): string => {
    if (!editorRef.current?.editor) return "";
    return editorRef.current.editor.value || "";
  }, [editorRef]);

  // Set HTML content to Jodit editor
  const setEditorHTML = useCallback(
    (html: string) => {
      if (editorRef.current?.editor) {
        editorRef.current.editor.value = html;
      }
    },
    [editorRef]
  );

  // Clear all highlights from the editor
  const clearHighlights = useCallback(() => {
    if (!editorRef.current?.editor) return;

    const editorElement = editorRef.current.editor.editor;
    if (editorElement) {
      const highlightedSpans = editorElement.querySelectorAll(
        `.${styles.misspelledWord}`
      );
      highlightedSpans.forEach((span: HTMLElement) => {
        const parent = span.parentNode;
        if (parent) {
          while (span.firstChild) {
            parent.insertBefore(span.firstChild, span);
          }
          parent.removeChild(span);
          parent.normalize();
        }
      });
    }
  }, [editorRef]);

  // Handle clicking on a misspelled word
  const handleWordClick = useCallback((event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const word = target.getAttribute("data-word") || "";
    const suggestionsStr = target.getAttribute("data-suggestions") || "";
    const suggestions = suggestionsStr ? suggestionsStr.split(",") : [];

    // Get position for popup
    const rect = target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    setSuggestionPopup({
      word,
      suggestions,
      position: {
        x: rect.left + scrollLeft,
        y: rect.bottom + scrollTop + 5,
      },
      originalPosition: { start: 0, end: 0 }, // We'll handle this differently for HTML content
    });
  }, []);

  // Highlight misspelled words in the editor
  const highlightMisspelledWords = useCallback(
    (spellCheckResults: SpellCheckResult[]) => {
      if (!editorRef.current?.editor) return;

      clearHighlights();

      const editorElement = editorRef.current.editor.editor;
      if (!editorElement) return;

      const misspelledWords = spellCheckResults.filter(
        (result) => !result.isCorrect
      );

      if (misspelledWords.length === 0) return;

      // Get current HTML content
      let currentHTML = editorElement.innerHTML;

      // Sort by position (descending) to avoid position shifts when replacing
      const sortedWords = [...misspelledWords].sort(
        (a, b) => b.position.start - a.position.start
      );

      sortedWords.forEach((result) => {
        const regex = new RegExp(
          `\\b(${result.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`,
          "gi"
        );
        currentHTML = currentHTML.replace(regex, (match) => {
          return `<span class="${styles.misspelledWord}" data-word="${
            result.word
          }" data-suggestions="${result.suggestions.join(
            ","
          )}">${match}</span>`;
        });
      });

      editorElement.innerHTML = currentHTML;

      // Add click event listeners to highlighted words
      const highlightedSpans = editorElement.querySelectorAll(
        `.${styles.misspelledWord}`
      );
      highlightedSpans.forEach((span: HTMLElement) => {
        span.addEventListener("click", handleWordClick);
      });
    },
    [editorRef, clearHighlights, handleWordClick]
  );

  // Handle spell check button click
  const handleSpellCheck = useCallback(async () => {
    if (isLoading) {
      alert("Spell checker is still loading. Please wait.");
      return;
    }

    setIsChecking(true);

    try {
      const text = getEditorText();
      if (!text.trim()) {
        alert("No text to check.");
        setIsChecking(false);
        return;
      }

      const spellCheckResults = spellCheck(text);
      setResults(spellCheckResults);

      const misspelledCount = spellCheckResults.filter(
        (r) => !r.isCorrect
      ).length;

      if (misspelledCount === 0) {
        alert("No spelling mistakes found!");
        clearHighlights();
      } else {
        highlightMisspelledWords(spellCheckResults);
        alert(
          `Found ${misspelledCount} spelling mistake(s). Click on highlighted words to see suggestions.`
        );
      }
    } catch (error) {
      console.error("Spell check error:", error);
      alert("An error occurred during spell check.");
    } finally {
      setIsChecking(false);
    }
  }, [
    isLoading,
    getEditorText,
    spellCheck,
    clearHighlights,
    highlightMisspelledWords,
  ]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    (suggestion: string) => {
      if (!suggestionPopup || !editorRef.current?.editor) return;

      const editorElement = editorRef.current.editor.editor;
      if (!editorElement) return;

      // Find and replace the word
      const spans = editorElement.querySelectorAll(
        `.${styles.misspelledWord}[data-word="${suggestionPopup.word}"]`
      );
      spans.forEach((span: HTMLElement) => {
        span.textContent = suggestion;
        span.classList.remove(styles.misspelledWord);
        span.removeAttribute("data-word");
        span.removeAttribute("data-suggestions");
      });

      setSuggestionPopup(null);

      if (onCorrection) {
        onCorrection(suggestionPopup.word, suggestion);
      }
    },
    [suggestionPopup, editorRef, onCorrection]
  );

  // Handle adding word to dictionary
  const handleAddToDictionary = useCallback(() => {
    if (!suggestionPopup) return;

    addCustomWord(suggestionPopup.word);
    setCustomWords((prev) => [...prev, suggestionPopup.word]);

    // Remove highlights for this word
    if (editorRef.current?.editor) {
      const editorElement = editorRef.current.editor.editor;
      if (editorElement) {
        const spans = editorElement.querySelectorAll(
          `.${styles.misspelledWord}[data-word="${suggestionPopup.word}"]`
        );
        spans.forEach((span: HTMLElement) => {
          span.classList.remove(styles.misspelledWord);
          span.removeAttribute("data-word");
          span.removeAttribute("data-suggestions");
        });
      }
    }

    setSuggestionPopup(null);
  }, [suggestionPopup, addCustomWord, editorRef]);

  // Handle ignore word
  const handleIgnoreWord = useCallback(() => {
    if (!suggestionPopup || !editorRef.current?.editor) return;

    const editorElement = editorRef.current.editor.editor;
    if (editorElement) {
      const spans = editorElement.querySelectorAll(
        `.${styles.misspelledWord}[data-word="${suggestionPopup.word}"]`
      );
      spans.forEach((span: HTMLElement) => {
        span.classList.remove(styles.misspelledWord);
        span.removeAttribute("data-word");
        span.removeAttribute("data-suggestions");
      });
    }

    setSuggestionPopup(null);
  }, [suggestionPopup, editorRef]);

  // Close suggestion popup
  const closeSuggestionPopup = useCallback(() => {
    setSuggestionPopup(null);
  }, []);

  return (
    <div className={styles.spellCheckerContainer}>
      <div className={styles.controlsContainer}>
        <button
          onClick={handleSpellCheck}
          disabled={isChecking || isLoading}
          className={styles.spellCheckButton}
        >
          {isChecking
            ? "Checking..."
            : isLoading
            ? "Loading..."
            : "Check Spelling"}
        </button>

        <button
          onClick={clearHighlights}
          className={styles.clearButton}
          disabled={isLoading}
        >
          Clear Highlights
        </button>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={enableRealTime}
            onChange={(e) => setEnableRealTime(e.target.checked)}
            disabled={isLoading}
          />
          Real-time spell checking
        </label>
      </div>

      {suggestionPopup && (
        <>
          <div className={styles.overlay} onClick={closeSuggestionPopup} />
          <div
            className={styles.suggestionPopup}
            style={{
              left: suggestionPopup.position.x,
              top: suggestionPopup.position.y,
            }}
          >
            <div className={styles.popupHeader}>
              <strong>"{suggestionPopup.word}"</strong>
            </div>

            {suggestionPopup.suggestions.length > 0 && (
              <div className={styles.suggestionsSection}>
                <div className={styles.sectionTitle}>Suggestions:</div>
                {suggestionPopup.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className={styles.suggestionButton}
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div className={styles.actionsSection}>
              <button
                className={styles.actionButton}
                onClick={handleAddToDictionary}
              >
                Add to Dictionary
              </button>
              <button
                className={styles.actionButton}
                onClick={handleIgnoreWord}
              >
                Ignore
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SpellChecker;
