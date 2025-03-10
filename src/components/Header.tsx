"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll detection for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Skip rendering header on home page
  if (pathname === "/") {
    return null;
  }

  // Determine if current route is admin to show different navigation
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md
      ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 shadow-md py-2"
          : "bg-white/70 dark:bg-gray-900/70 py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-lg md:text-xl font-bold tracking-tighter text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Hussein&apos;s Philosophy
          </Link>
        </div>

        <nav className="flex items-center space-x-1 md:space-x-4">
          {!isAdminPage ? (
            // Regular user navigation
            <>
              <Link
                href="/blogs"
                className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm md:text-base"
              >
                Blogs
              </Link>

              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 shadow-sm">
                <ThemeToggle variant="compact" />
              </div>

              <Link
                href="/admin"
                className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Admin
              </Link>
            </>
          ) : (
            // Admin navigation
            <>
              <Link
                href="/"
                className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm md:text-base"
              >
                View Site
              </Link>

              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 shadow-sm">
                <ThemeToggle variant="compact" />
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
