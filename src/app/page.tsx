"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import the SimpleEditor to avoid SSR issues
const SimpleEditor = dynamic(() => import("../components/SimpleEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function Home() {
  return (
    <main>
      <Link href="/spalling_cheker">Spaling cheker</Link>
      <Link href="create_pdf">pdf</Link>
    </main>
  );
}
