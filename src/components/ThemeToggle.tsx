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

    // Special fix for iOS Safari
    if (isDark) {
      // Force text styles to be visible in dark mode on iOS
      const style = document.createElement("style");
      style.innerHTML = `
        .dark .dark\\:text-white, 
        .dark .dark\\:text-gray-100,
        .dark .dark\\:text-gray-200,
        .dark .dark\\:text-gray-300 {
          color: white !important;
        }
        .dark .dark\\:bg-gray-800 {
          background-color: #1f2937 !important;
        }
      `;
      style.id = "ios-dark-mode-fix";

      const existingStyle = document.getElementById("ios-dark-mode-fix");
      if (!existingStyle) {
        document.head.appendChild(style);
      }
    } else {
      // Remove the iOS fix in light mode
      const existingStyle = document.getElementById("ios-dark-mode-fix");
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }, [isDark, theme]);

  const handleToggle = () => {
    console.log("Toggle button clicked");

    // Direct DOM manipulation as a backup
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#1a202c";
      document.body.style.color = "#e2e8f0";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f8f9fa";
      document.body.style.color = "#2d3748";
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
