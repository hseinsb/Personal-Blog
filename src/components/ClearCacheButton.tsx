"use client";

import { useState } from "react";

export default function ClearCacheButton() {
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState("");

  const clearCache = async () => {
    try {
      setIsClearing(true);
      setMessage("Clearing cache...");

      // Call the API route to clear the cache
      const response = await fetch("/api/clear-cache", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Cache cleared successfully! Reloading page...");

        // Force reload CSS
        const links = document.getElementsByTagName("link");
        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          if (link.rel === "stylesheet") {
            const href = link.href.split("?")[0];
            link.href = href + "?v=" + Date.now();
          }
        }

        // Clear localStorage cache markers
        localStorage.removeItem("lastCssReload");

        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage(`Failed to clear cache: ${data.message}`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      setMessage("Error clearing cache. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={clearCache}
        disabled={isClearing}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isClearing ? "Clearing..." : "Refresh Site"}
      </button>
      {message && (
        <div className="mt-2 p-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-md text-sm">
          {message}
        </div>
      )}
    </div>
  );
}
