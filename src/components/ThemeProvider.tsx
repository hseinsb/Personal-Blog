"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light", // Default value
  toggleTheme: () => {}, // Dummy function
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Function to apply theme to document
  const applyTheme = (newTheme: Theme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Force a repaint - void evaluates the expression and returns undefined
    void document.documentElement.offsetHeight;
    console.log(
      `Applied ${newTheme} theme, HTML has dark class:`,
      document.documentElement.classList.contains("dark")
    );
  };

  // Initialize theme when component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedTheme = localStorage.getItem("theme") as Theme | null;
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
        setTheme(initialTheme);

        // Apply theme to document
        applyTheme(initialTheme);
      } catch (e) {
        console.error("Failed to initialize theme:", e);
      }
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log(`Toggling theme from ${theme} to ${newTheme}`);

    setTheme(newTheme);
    applyTheme(newTheme);

    // Store in localStorage
    try {
      localStorage.setItem("theme", newTheme);
    } catch (e) {
      console.error("Failed to save theme to localStorage:", e);
    }
  };

  // Context value
  const contextValue = {
    theme,
    toggleTheme,
  };

  // Return provider with children
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  return useContext(ThemeContext);
}
