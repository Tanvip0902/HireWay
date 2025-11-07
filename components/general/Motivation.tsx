// components/Motivation.tsx
"use client";

import { quotes } from "@/lib/quotes";
import { Sparkles } from "lucide-react";

function getDailyQuote() {
  const today = new Date().toDateString();
  const hash = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return quotes[hash % quotes.length];
}

export default function Motivation() {
  const quote = getDailyQuote();

  return (
    <div className="p-4 rounded-xl shadow-sm border border-border bg-indigo-100/70 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-200 mt-4">
      <div className="flex items-start gap-3">
        <Sparkles className="text-yellow-500 dark:text-yellow-400 mt-1" />
        <div>
          <h2 className="font-bold text-lg mb-1">Quote of the Day</h2>
          <p className="italic">“{quote}”</p>
        </div>
      </div>
    </div>
  );
}
