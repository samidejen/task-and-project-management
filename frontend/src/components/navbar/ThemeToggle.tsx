"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const darkMode = saved === "dark" || (!saved && prefersDark);
    setIsDark(darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      aria-label="Toggle theme"
    >
      <Sun
        className={`absolute w-5 h-5 text-gray-900 transition-all duration-300 ${
          isDark
            ? "opacity-0 scale-0 rotate-90"
            : "opacity-100 scale-100 rotate-0"
        }`}
      />
      <Moon
        className={`absolute w-5 h-5 text-gray-200 transition-all duration-300 ${
          isDark
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-0 -rotate-90"
        }`}
      />
    </button>
  );
}
