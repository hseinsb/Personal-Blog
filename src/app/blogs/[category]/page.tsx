import Link from "next/link";
import { getPostsByCategory } from "@/lib/firestore";
import BlogPostCard from "@/components/BlogPostCard";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 3600; // Revalidate data every hour

interface CategoryParams {
  params: {
    category: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

// Validate and format the category for display
function formatCategory(category: string): string {
  // Convert hyphenated names to title case
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Validate the category is among our valid options
function isValidCategory(
  category: string
): category is "religion" | "morals" | "philosophy" | "personal-growth" {
  return ["religion", "morals", "philosophy", "personal-growth"].includes(
    category
  );
}

export async function generateMetadata({
  params,
}: CategoryParams): Promise<Metadata> {
  const { category } = params;

  if (!isValidCategory(category)) {
    return {
      title: "Category Not Found",
    };
  }

  const formattedCategory = formatCategory(category);

  return {
    title: `${formattedCategory} - Hussein's Philosophy Blog`,
    description: `Explore Hussein's philosophical thoughts on ${formattedCategory.toLowerCase()}`,
  };
}

export default async function CategoryPage({ params }: CategoryParams) {
  const { category } = params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const posts = await getPostsByCategory(category);
  const formattedCategory = formatCategory(category);

  // Get category-specific styles
  const getCategoryStyles = () => {
    switch (category) {
      case "religion":
        return "text-red-800 dark:text-red-200";
      case "morals":
        return "text-green-800 dark:text-green-200";
      case "philosophy":
        return "text-blue-800 dark:text-blue-200";
      case "personal-growth":
        return "text-purple-800 dark:text-purple-200";
      default:
        return "text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen p-6 pt-20 md:p-12 md:pt-24 bg-gradient-to-br from-gray-50 to-purple-100/50 dark:from-gray-900 dark:to-purple-900/30 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4 text-sm">
            <Link
              href="/"
              className="text-purple-600 hover:text-purple-700 hover:underline inline-block"
            >
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <Link
              href="/blogs"
              className="text-purple-600 hover:text-purple-700 hover:underline inline-block"
            >
              Blogs
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-600 dark:text-gray-400">
              {formattedCategory}
            </span>
          </div>

          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${getCategoryStyles()}`}
          >
            {formattedCategory}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Exploring the depths of {formattedCategory.toLowerCase()} through my
            personal perspective
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.length > 0 ? (
            posts.map((post) => <BlogPostCard key={post.id} post={post} />)
          ) : (
            <div className="col-span-full text-center p-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white/80 dark:bg-gray-800/60">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No posts in this category yet. Check back soon!
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Link
            href="/blogs"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            ← Back to All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}
