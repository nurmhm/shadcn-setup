"use client";

import JoditEditor from "jodit-react";
import { useMemo, useRef, useState } from "react";
import styles from "./CustomEditor.module.css";
import SpellChecker from "./SpellChecker";

const CustomEditor = () => {
  const editor = useRef<any>(null);
  const [content, setContent] = useState(
    "<p>Hello, this is some textt. My name is akas ami tumi. I love NextJS and Jodit.</p>"
  );

  const config = useMemo(
    () => ({
      spellcheck: false,
      readonly: false,
      placeholder: "Start typing here...",
      height: 400,
    }),
    []
  );

  const handleCorrection = (originalWord: string, correctedWord: string) => {
    console.log(`Word corrected: "${originalWord}" → "${correctedWord}"`);
  };

  return (
    <div className={styles.editorContainer}>
      <h1>Custom Spellchecker with Jodit & Next.js</h1>

      <SpellChecker editorRef={editor} onCorrection={handleCorrection} />

      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={(newContent) => setContent(newContent)}
      />
    </div>
  );
};

export default CustomEditor;
