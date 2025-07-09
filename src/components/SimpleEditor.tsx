"use client";

import JoditEditor from "jodit-react";
import { useRef, useState, useMemo } from "react";

const SimpleEditor = () => {
  const editor = useRef<any>(null);
  const [content, setContent] = useState(
    "<p>Hello world. This is some textt. My name is akas ami tumi dsfds asdfdsa.</p>"
  );

  const config = useMemo(
    () => ({
      spellcheck: false,
      readonly: false,
      placeholder: "Start typing here...",
    }),
    []
  );

  // Simple word list for testing
  const correctWords = [
    'hello', 'world', 'this', 'is', 'some', 'my', 'name', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'akas', 'ami', 'tumi', 'nextjs', 'jodit', 'react', 'javascript', 'typescript'
  ];

  const isWordCorrect = (word: string) => {
    const lowerWord = word.toLowerCase();
    return correctWords.includes(lowerWord);
  };

  const handleSpellCheck = () => {
    console.log("=== SPELL CHECK STARTED ===");
    
    if (!editor.current) {
      alert("Editor not ready");
      return;
    }

    try {
      const joditInstance = editor.current.editor;
      if (!joditInstance) {
        alert("Jodit instance not found");
        return;
      }

      // Get text
      const plainText = joditInstance.text || "";
      console.log("Text:", plainText);

      // Clear previous highlights
      const editorElement = joditInstance.editor;
      if (editorElement) {
        const spans = editorElement.querySelectorAll('.misspelled-word');
        spans.forEach((span: any) => {
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

      // Extract words
      const words = plainText.match(/\b[a-zA-Z]+\b/g) || [];
      console.log("Words found:", words);

      // Check each word
      const misspelledWords: string[] = [];
      words.forEach((word: string) => {
        const isCorrect = isWordCorrect(word);
        console.log(`"${word}" -> ${isCorrect ? 'CORRECT' : 'MISSPELLED'}`);
        if (!isCorrect) {
          misspelledWords.push(word);
        }
      });

      console.log("Misspelled words:", misspelledWords);

      if (misspelledWords.length === 0) {
        alert("No spelling mistakes found!");
        return;
      }

      // Highlight misspelled words
      if (editorElement) {
        misspelledWords.forEach((word) => {
          const currentContent = editorElement.innerHTML;
          const regex = new RegExp(`\\b(${word})\\b`, "gi");
          const newContent = currentContent.replace(
            regex,
            '<span class="misspelled-word" style="background-color: #ffcccc; border-bottom: 2px wavy red;">$1</span>'
          );
          editorElement.innerHTML = newContent;
        });
      }

      alert(`Found ${misspelledWords.length} spelling mistakes: ${misspelledWords.join(', ')}`);

    } catch (error) {
      console.error("Error:", error);
      alert("Spell check failed. Check console.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>Simple Spell Checker Test</h1>
      
      <button
        onClick={handleSpellCheck}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        Check Spelling
      </button>

      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={(newContent) => setContent(newContent)}
      />

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <p><strong>Correct words:</strong> {correctWords.join(', ')}</p>
        <p><strong>Test words:</strong> "textt", "dsfds", "asdfdsa" should be marked as misspelled</p>
        <p><strong>Custom words:</strong> "akas", "ami", "tumi" should be marked as correct</p>
      </div>
    </div>
  );
};

export default SimpleEditor;
