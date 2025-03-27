"use client";

import { useState } from "react";

interface PasswordProtectionProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PasswordProtection({
  onSuccess,
  onCancel,
}: PasswordProtectionProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // The correct password - in production, this should be handled more securely
  // This is just for demonstration purposes
  const CORRECT_PASSWORD = "loveletters"; // You can change this to your preferred password

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple timeout to simulate verification
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        // Set a session storage flag to remember the user is authenticated for this session
        sessionStorage.setItem("classifiedAccess", "granted");
        onSuccess();
      } else {
        setError("Incorrect password. Please try again.");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Password Protected
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          This section contains private content. Please enter the password to
          continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter password"
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Access"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
