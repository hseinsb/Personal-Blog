"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { ADMIN_UID } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // Display admin UID for debugging
  useEffect(() => {
    console.log("Admin UID from config:", ADMIN_UID);
    console.log("Admin UID type:", typeof ADMIN_UID);
    console.log("Admin UID length:", ADMIN_UID.length);
  }, []);

  // Check if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Current user UID:", user.uid);
        console.log("Is admin?", user.uid === ADMIN_UID);
      }

      if (user && user.uid === ADMIN_UID) {
        router.push("/admin/dashboard");
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await signIn(email, password);
      console.log("Logged in user UID:", user.uid);
      console.log("Expected admin UID:", ADMIN_UID);
      console.log("UIDs match?", user.uid === ADMIN_UID);

      if (user.uid !== ADMIN_UID) {
        setError("You are not authorized to access the admin panel.");
        return;
      }

      router.push("/admin/dashboard");
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const firebaseError = error as { code: string };
        if (
          firebaseError.code === "auth/user-not-found" ||
          firebaseError.code === "auth/wrong-password"
        ) {
          setError("Invalid email or password.");
        } else {
          setError("Failed to log in. Please try again.");
          console.error(error);
        }
      } else {
        setError("An unexpected error occurred.");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse text-accent">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-background to-accent-light/20 dark:from-background dark:to-accent-light/10 flex justify-center items-center">
      <div className="max-w-md w-full bg-card-bg p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-gray-500">
            Sign in to manage your philosophy blog
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-accent text-white rounded-md hover:bg-accent-light transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-accent hover:underline">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
