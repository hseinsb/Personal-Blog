"use client";

import { useState, useEffect } from "react";
import { getAllPosts, debugLikeCount } from "@/lib/firestore";
import { BlogPost } from "@/lib/firestore";
import Link from "next/link";

export default function LikeDebugPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadPosts() {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);

        // Check localStorage for likes
        const likedStatus: Record<string, boolean> = {};
        allPosts.forEach((post) => {
          if (typeof window !== "undefined" && post.id) {
            const isLiked =
              localStorage.getItem(`post_like_${post.id}`) === "true";
            likedStatus[post.id] = isLiked;
          }
        });
        setLikedPosts(likedStatus);
      } catch (err) {
        console.error("Error loading posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  async function checkLikeCount(postId: string) {
    if (postId) {
      await debugLikeCount(postId);
    }
  }

  return (
    <div className="container mx-auto p-8 pt-24">
      <h1 className="text-3xl font-bold mb-6">Like System Debugging</h1>

      <Link href="/" className="text-purple-600 hover:underline mb-8 block">
        ← Back to Home
      </Link>

      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-6">
          <p className="text-lg mb-4">
            This page helps diagnose like button issues.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">
            Posts and Their Like Status
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border p-2 text-left">Post Title</th>
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">Likes (DB)</th>
                <th className="border p-2 text-left">User Liked?</th>
                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="border p-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-500 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="border p-2 font-mono text-sm">{post.id}</td>
                  <td className="border p-2">{post.likes}</td>
                  <td className="border p-2">
                    {post.id && likedPosts[post.id] ? (
                      <span className="text-green-500">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => post.id && checkLikeCount(post.id)}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200"
                    >
                      Check Likes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            LocalStorage Items
          </h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
            <pre className="text-sm">
              {typeof window !== "undefined"
                ? JSON.stringify(
                    Object.keys(localStorage)
                      .filter((key) => key.startsWith("post_like_"))
                      .reduce((obj, key) => {
                        return {
                          ...obj,
                          [key]: localStorage.getItem(key),
                        };
                      }, {}),
                    null,
                    2
                  )
                : "LocalStorage not available"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
