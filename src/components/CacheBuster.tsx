"use client";

import { useEffect } from "react";

export default function CacheBuster() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Function to force reload CSS files
    const reloadCSS = () => {
      console.log("Reloading CSS files to bust cache");
      const links = document.getElementsByTagName("link");
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.rel === "stylesheet") {
          const href = link.href.split("?")[0];
          link.href = href + "?v=" + Date.now();
        }
      }
      // Store the last reload time
      localStorage.setItem("lastCssReload", Date.now().toString());
    };

    // Check if we need to reload CSS
    const lastCssReload = localStorage.getItem("lastCssReload");
    const now = Date.now();

    // If no record of last reload or it was more than 1 hour ago
    if (!lastCssReload || now - parseInt(lastCssReload) > 3600000) {
      reloadCSS();
    }

    // Also add a listener for when the page becomes visible again
    // This helps with refreshing CSS when a user returns to the tab
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        const lastReload = localStorage.getItem("lastCssReload");
        const currentTime = Date.now();
        // If it's been more than 5 minutes since last reload
        if (!lastReload || currentTime - parseInt(lastReload) > 300000) {
          reloadCSS();
        }
      }
    });

    // Clean up the event listener
    return () => {
      document.removeEventListener("visibilitychange", () => {});
    };
  }, []);

  // This component doesn't render anything
  return null;
}
