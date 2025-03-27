"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPostsByCategory, BlogPost } from "@/lib/firestore";
import BlogPostCard from "@/components/BlogPostCard";
import { notFound } from "next/navigation";
import { useClassifiedAccess } from "@/lib/useClassifiedAccess";
import ClientPasswordProtection from "@/components/ClientPasswordProtection";
import { Metadata } from "next";

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

// More frequent revalidation for category pages
export const revalidate = 60; // Revalidate every minute

// Type for category props
type CategoryPageProps = {
  params: { category: string };
};

// Validate if it's a valid category
const isValidCategory = (category: string): boolean => {
  return [
    "religion",
    "morals",
    "philosophy",
    "personal-growth",
    "classified",
  ].includes(category);
};

function ClientCategoryPage({ category }: { category: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasAccess, isChecking, grantAccess } = useClassifiedAccess();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      try {
        // Check if this is a valid category
        if (!isValidCategory(category)) {
          notFound();
        }

        // For classified category, check access
        if (category === "classified") {
          const accessGranted =
            sessionStorage.getItem("classifiedAccess") === "granted";
          if (!accessGranted) {
            setLoading(false);
            return;
          }
        }

        const postsData = await getPostsByCategory(
          category as BlogPost["category"]
        );
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading posts:", error);
        setLoading(false);
      }
    }

    loadPosts();
  }, [category, hasAccess]);

  if (loading || isChecking) {
    return <Loading />;
  }

  // For classified category, check access
  if (category === "classified" && !hasAccess) {
    return (
      <div className="min-h-screen p-6 pt-20 md:p-12 md:pt-24">
        <div className="max-w-6xl mx-auto">
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
            <p className="mb-6">This section requires a password to view.</p>
            <button
              onClick={() => setShowPasswordPrompt(true)}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Enter Password
            </button>
          </div>

          {showPasswordPrompt && (
            <ClientPasswordProtection
              onSuccess={() => {
                grantAccess();
                setShowPasswordPrompt(false);
              }}
              onCancel={() => setShowPasswordPrompt(false)}
            />
          )}
        </div>
      </div>
    );
  }

  // Format category for display
  const formattedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Get category-specific styles
  const getCategoryStyle = () => {
    switch (category) {
      case "religion":
        return {
          bgClass:
            "from-red-50 to-red-100/30 dark:from-gray-900 dark:to-red-900/20",
          textClass: "text-red-800 dark:text-red-300",
          borderClass: "border-red-300 dark:border-red-700",
        };
      case "morals":
        return {
          bgClass:
            "from-green-50 to-green-100/30 dark:from-gray-900 dark:to-green-900/20",
          textClass: "text-green-800 dark:text-green-300",
          borderClass: "border-green-300 dark:border-green-700",
        };
      case "philosophy":
        return {
          bgClass:
            "from-blue-50 to-blue-100/30 dark:from-gray-900 dark:to-blue-900/20",
          textClass: "text-blue-800 dark:text-blue-300",
          borderClass: "border-blue-300 dark:border-blue-700",
        };
      case "personal-growth":
        return {
          bgClass:
            "from-purple-50 to-purple-100/30 dark:from-gray-900 dark:to-purple-900/20",
          textClass: "text-purple-800 dark:text-purple-300",
          borderClass: "border-purple-300 dark:border-purple-700",
        };
      case "classified":
        return {
          bgClass:
            "from-pink-50 to-pink-100/30 dark:from-gray-900 dark:to-pink-900/20",
          textClass: "text-pink-800 dark:text-pink-300",
          borderClass: "border-pink-300 dark:border-pink-700",
        };
      default:
        return {
          bgClass:
            "from-gray-50 to-gray-100/30 dark:from-gray-900 dark:to-gray-800/20",
          textClass: "text-gray-800 dark:text-gray-300",
          borderClass: "border-gray-300 dark:border-gray-700",
        };
    }
  };

  const { bgClass, textClass, borderClass } = getCategoryStyle();

  return (
    <div
      className={`min-h-screen p-6 pt-20 md:p-12 md:pt-24 bg-gradient-to-br ${bgClass} transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Link
            href="/blogs"
            className="text-purple-600 hover:text-purple-700 hover:underline mb-4 inline-block dark:text-purple-400"
          >
            ← Back to All Blogs
          </Link>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${textClass}`}>
            {formattedCategory}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {category === "religion"
              ? "Exploring faith, spirituality, and the search for meaning"
              : category === "morals"
              ? "Reflecting on ethics, values, and living a good life"
              : category === "philosophy"
              ? "Diving into the fundamental questions of existence and knowledge"
              : category === "personal-growth"
              ? "Journeys of self-improvement, development, and transformation"
              : category === "classified"
              ? "Private thoughts, meant for special eyes only"
              : ""}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.length > 0 ? (
            posts.map((post) => <BlogPostCard key={post.id} post={post} />)
          ) : (
            <div
              className={`col-span-full text-center p-12 border border-dashed ${borderClass} rounded-lg bg-white/80 dark:bg-gray-800/60`}
            >
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No posts in this category yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// This becomes the default export
export default function CategoryPage({ params }: CategoryPageProps) {
  return <ClientCategoryPage category={params.category} />;
}

export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  // Await the params object before accessing its properties
  const { category } = await props.params;

  if (!isValidCategory(category)) {
    return {
      title: "Category Not Found",
    };
  }

  const formattedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedCategory} - Hussein's Philosophy Blog`,
    description: `Explore Hussein's philosophical thoughts on ${formattedCategory.toLowerCase()}`,
  };
}
