"use client";

import dynamic from "next/dynamic";

// Dynamically import the SimpleEditor to avoid SSR issues
const SimpleEditor = dynamic(() => import("../components/SimpleEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function Home() {
  return (
    <main>
      <SimpleEditor />
    </main>
  );
}
