"use client";

import Image from "next/image";
import Link from "next/link";
import { FiInstagram } from "react-icons/fi";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode status to ensure UI syncs with theme
  useEffect(() => {
    // Initial check
    setIsDarkMode(document.documentElement.classList.contains("dark"));

    // Set up observer to watch for class changes on HTML element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const newIsDark = document.documentElement.classList.contains("dark");
          setIsDarkMode(newIsDark);
          console.log(`Dark mode observed change: ${newIsDark}`);
        }
      });
    });

    // Start observing HTML element for class attribute changes
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`min-h-screen p-6 md:p-12 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <header className="max-w-6xl mx-auto flex flex-col items-center mb-12">
        <div
          className={`relative w-32 h-32 rounded-full overflow-hidden mb-4 shadow-lg ${
            isDarkMode
              ? "border-4 border-purple-500"
              : "border-4 border-purple-400"
          }`}
        >
          <Image
            src="/profile.jpg"
            alt="Hussein's Profile"
            width={128}
            height={128}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        <h1 className="text-4xl md:text-5xl text-center font-bold mb-2 fade-in">
          Hussein&apos;s Philosophy
        </h1>
        <p
          className={`text-lg text-center mb-4 max-w-2xl fade-in ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Exploring the depths of thought on religion, morals, philosophy, and
          personal growth
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Dark/Light Mode Toggle */}
          <div
            className={`rounded-2xl p-4 shadow-lg flex items-center justify-center transition-all ${
              isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
            }`}
          >
            <ThemeToggle />
          </div>

          {/* Instagram Link */}
          <div
            className={`rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center transition-all ${
              isDarkMode
                ? "bg-pink-900 hover:bg-pink-800"
                : "bg-pink-100 hover:bg-pink-200"
            }`}
          >
            <Link
              href="https://instagram.com/hseinsbeiti"
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <FiInstagram className="text-4xl text-pink-500 mb-2" />
              <span className="text-lg">@hseinsbeiti</span>
            </Link>
          </div>

          {/* About Section */}
          <div
            className={`rounded-2xl p-6 shadow-lg sm:col-span-2 transition-all ${
              isDarkMode ? "bg-teal-900" : "bg-teal-100"
            }`}
          >
            <h2 className="text-xl font-bold mb-2">About My Philosophy</h2>
            <p className="text-sm mb-3">
              I explore the fundamental questions of existence, morality, and
              purpose. My writings are reflections on the connections between
              religious thought, ethical principles, and personal development.
            </p>
            <Link
              href="/blogs"
              className={`font-semibold hover:underline inline-block ${
                isDarkMode ? "text-purple-300" : "text-purple-700"
              }`}
            >
              Start Reading →
            </Link>
          </div>

          {/* Section Shortcuts */}
          <div
            className={`rounded-2xl p-4 shadow-lg transition-all ${
              isDarkMode
                ? "bg-red-900 hover:bg-red-800"
                : "bg-red-100 hover:bg-red-200"
            }`}
          >
            <Link href="/blogs/religion" className="block h-full">
              <h3 className="text-lg font-bold mb-1">Religion</h3>
              <p className="text-sm">
                Explorations of faith, spirituality, and divine purpose
              </p>
            </Link>
          </div>

          <div
            className={`rounded-2xl p-4 shadow-lg transition-all ${
              isDarkMode
                ? "bg-green-900 hover:bg-green-800"
                : "bg-green-100 hover:bg-green-200"
            }`}
          >
            <Link href="/blogs/morals" className="block h-full">
              <h3 className="text-lg font-bold mb-1">Morals</h3>
              <p className="text-sm">
                Investigations into ethics, principles, and living virtuously
              </p>
            </Link>
          </div>

          <div
            className={`rounded-2xl p-4 shadow-lg transition-all ${
              isDarkMode
                ? "bg-blue-900 hover:bg-blue-800"
                : "bg-blue-100 hover:bg-blue-200"
            }`}
          >
            <Link href="/blogs/philosophy" className="block h-full">
              <h3 className="text-lg font-bold mb-1">Philosophy</h3>
              <p className="text-sm">
                Thoughts on meaning, knowledge, and the human condition
              </p>
            </Link>
          </div>

          <div
            className={`rounded-2xl p-4 shadow-lg transition-all ${
              isDarkMode
                ? "bg-violet-900 hover:bg-violet-800"
                : "bg-violet-100 hover:bg-violet-200"
            }`}
          >
            <Link href="/blogs/personal-growth" className="block h-full">
              <h3 className="text-lg font-bold mb-1">Personal Growth</h3>
              <p className="text-sm">
                Reflections on mindset, development, and self-improvement
              </p>
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/admin"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </main>
    </div>
  );
}
