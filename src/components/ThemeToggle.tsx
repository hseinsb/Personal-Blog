"use client";

import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "./ThemeProvider";
import { useEffect } from "react";

type ThemeToggleProps = {
  variant?: "default" | "compact";
};

export default function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Force dark mode to correct value based on actual class presence
  useEffect(() => {
    const htmlElement = document.documentElement;
    const hasDarkClass = htmlElement.classList.contains("dark");

    // Fix any mismatch between state and actual class
    if (isDark && !hasDarkClass) {
      htmlElement.classList.add("dark");
      console.log("Fixed dark mode: Added missing dark class");
    } else if (!isDark && hasDarkClass) {
      htmlElement.classList.remove("dark");
      console.log("Fixed dark mode: Removed erroneous dark class");
    }
  }, [isDark, theme]);

  const handleToggle = () => {
    console.log("Toggle button clicked");

    // Direct DOM manipulation as a backup
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#1a202c";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f8f9fa";
    }

    // Call the context's toggle function
    toggleTheme();
  };

  // Compact version for header
  if (variant === "compact") {
    return (
      <button
        onClick={handleToggle}
        className="relative w-12 h-6 rounded-full overflow-hidden flex items-center bg-white dark:bg-gray-800 transition-colors focus:outline-none shadow-inner"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <div
          className={`absolute inset-0 flex items-center transition-transform duration-300 ${
            isDark ? "translate-x-0" : "translate-x-6"
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-purple-600 dark:bg-purple-400 flex items-center justify-center transform transition-transform shadow-md">
            {isDark ? (
              <FiMoon className="text-white text-xs" />
            ) : (
              <FiSun className="text-white text-xs" />
            )}
          </div>
        </div>
      </button>
    );
  }

  // Default version with more details
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <div className="text-center mb-4">
        <span
          className={`font-bold text-lg ${
            isDark ? "text-purple-300" : "text-purple-700"
          }`}
        >
          {isDark ? "Dark Mode Active" : "Light Mode Active"}
        </span>
      </div>

      <button
        onClick={handleToggle}
        className="flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 dark:from-purple-600 dark:to-indigo-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <FiSun className="text-3xl animate-pulse" />
        ) : (
          <FiMoon className="text-3xl animate-pulse" />
        )}
      </button>

      <p className="text-sm mt-4 text-center">Click to toggle theme</p>
    </div>
  );
}
