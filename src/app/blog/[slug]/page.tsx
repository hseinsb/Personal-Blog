"use client";

import { useEffect, useState } from "react";
import { getPostBySlug, BlogPost } from "@/lib/firestore";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClientPasswordProtection from "@/components/ClientPasswordProtection";

// Type for post props
type PostPageProps = {
  params: { slug: string };
};

// Simple loading component
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-20 md:p-12 md:pt-24 bg-gradient-to-br from-gray-50 to-purple-100/20 dark:from-gray-900 dark:to-purple-900/20">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}

// Client-side loading component
function ClientBlogPost({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClassified, setIsClassified] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const postData = await getPostBySlug(slug);

        if (!postData) {
          notFound();
        }

        setPost(postData);

        // Check if this is a classified post
        if (postData.category === "classified") {
          setIsClassified(true);
          // Check if user has access
          const accessGranted =
            sessionStorage.getItem("classifiedAccess") === "granted";
          setHasAccess(accessGranted);
          setShowPasswordPrompt(!accessGranted);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading post:", error);
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  const handlePasswordSuccess = () => {
    setHasAccess(true);
    setShowPasswordPrompt(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (!post) {
    return notFound();
  }

  // Show password prompt if needed
  if (isClassified && !hasAccess) {
    return (
      <div className="min-h-screen p-6 pt-20 md:p-12 md:pt-24">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blogs"
            className="text-purple-600 hover:text-purple-700 hover:underline mb-6 inline-block"
          >
            ← Back to Blogs
          </Link>

          <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
            <h1 className="text-2xl font-bold mb-4">
              Password Protected Content
            </h1>
            <p className="mb-6">
              This blog post is classified and requires a password to view.
            </p>
            <button
              onClick={() => setShowPasswordPrompt(true)}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Enter Password
            </button>
          </div>

          {showPasswordPrompt && (
            <ClientPasswordProtection
              onSuccess={handlePasswordSuccess}
              onCancel={() => setShowPasswordPrompt(false)}
            />
          )}
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = post.date
    ? post.date.toMillis
      ? new Date(post.date.toMillis()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date(post.date.seconds * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
    : "Date unavailable";

  return (
    <div className="min-h-screen p-6 pt-20 md:p-12 md:pt-24 bg-gradient-to-br from-gray-50 to-purple-100/20 dark:from-gray-900 dark:to-purple-900/20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/blogs"
          className="text-purple-600 hover:text-purple-700 hover:underline mb-6 inline-block dark:text-purple-400"
        >
          ← Back to Blogs
        </Link>

        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 transition-colors duration-300">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span
                className={`px-3 py-1 rounded-md text-xs uppercase ${
                  post.category === "religion"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    : post.category === "morals"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : post.category === "philosophy"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    : post.category === "personal-growth"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                    : post.category === "classified"
                    ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                }`}
              >
                {post.category.replace("-", " ")}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formattedDate}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {post.title}
            </h1>
          </header>

          <div
            className="prose dark:prose-invert prose-lg max-w-none text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}

// This becomes the default export
export default function BlogPostPage({ params }: PostPageProps) {
  return <ClientBlogPost slug={params.slug} />;
}
