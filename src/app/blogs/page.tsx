import Link from "next/link";
import {
  getAllPosts,
  getClassifiedPosts,
  serializeBlogPosts,
} from "@/lib/firestore";
import BlogPostCard from "@/components/BlogPostCard";
import ClientClassifiedSection from "@/components/ClientClassifiedSection";

// More frequent revalidation for the main blog page
export const revalidate = 60; // Revalidate every minute

export default async function BlogsPage() {
  const posts = await getAllPosts();
  const classifiedPosts = await getClassifiedPosts();

  // Serialize posts for client components
  const serializedClassifiedPosts = serializeBlogPosts(classifiedPosts);

  // Generate a unique key based on the current time to help debug caching issues
  const timestamp = new Date().toISOString();

  return (
    <div className="min-h-screen p-6 pt-20 md:p-12 md:pt-24 bg-gradient-to-br from-gray-50 to-purple-100/50 dark:from-gray-900 dark:to-purple-900/30 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700 hover:underline mb-4 inline-block dark:text-purple-400"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Hussein&apos;s Philosophy Blog
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Explore all my thoughts and theories across various topics
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              href="/blogs/religion"
              className="px-4 py-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors shadow-sm"
            >
              Religion
            </Link>
            <Link
              href="/blogs/morals"
              className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors shadow-sm"
            >
              Morals
            </Link>
            <Link
              href="/blogs/philosophy"
              className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors shadow-sm"
            >
              Philosophy
            </Link>
            <Link
              href="/blogs/personal-growth"
              className="px-4 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors shadow-sm"
            >
              Personal Growth
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.length > 0 ? (
            posts.map((post) => (
              <BlogPostCard key={`${post.id}-${timestamp}`} post={post} />
            ))
          ) : (
            <div className="col-span-full text-center p-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white/80 dark:bg-gray-800/60">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No blog posts yet. Check back soon!
              </p>
            </div>
          )}
        </div>

        {/* Classified Section */}
        <ClientClassifiedSection posts={serializedClassifiedPosts} />

        {/* Hidden timestamp for debugging */}
        <div className="hidden">{timestamp}</div>
      </div>
    </div>
  );
}
