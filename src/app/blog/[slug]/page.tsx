import Link from "next/link";
import { getPostBySlug, getCommentsByPostId } from "@/lib/firestore";
import { FiCalendar, FiMessageSquare } from "react-icons/fi";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CommentForm from "@/components/CommentForm";
import CommentList from "@/components/CommentList";

// Revalidate once per hour
export const revalidate = 3600;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Await the params object before accessing its properties
  const { slug } = await props.params;

  // Fetch the post data
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} - Hussein's Philosophy Blog`,
    description: post.content.substring(0, 160), // First 160 chars as description
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  // Await the params object before accessing its properties
  const { slug } = await props.params;

  // Fetch the post data
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const comments = await getCommentsByPostId(post.id!);

  // Format the date nicely
  const formattedDate = post.date
    ? new Date(post.date.toMillis()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date unavailable";

  // Format category
  const formattedCategory = post.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Get category-specific color
  const getCategoryColor = () => {
    switch (post.category) {
      case "religion":
        return "text-red-700 dark:text-red-300";
      case "morals":
        return "text-green-700 dark:text-green-300";
      case "philosophy":
        return "text-blue-700 dark:text-blue-300";
      case "personal-growth":
        return "text-purple-700 dark:text-purple-300";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen p-6 pt-20 md:p-12 md:pt-24 bg-gradient-to-br from-gray-50 to-purple-100/30 dark:from-gray-900 dark:to-purple-900/20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
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
            <Link
              href={`/blogs/${post.category}`}
              className={`${getCategoryColor()} hover:underline inline-block`}
            >
              {formattedCategory}
            </Link>
          </div>
        </header>

        <article className="mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8 transition-colors">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between mb-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <FiCalendar className="mr-1" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <div className="flex items-center">
                <FiMessageSquare className="mr-1" />
                <span>{comments.length} comments</span>
              </div>
            </div>
          </div>

          <div
            className="prose dark:prose-invert prose-lg max-w-none text-gray-700 dark:text-gray-200 
              prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:my-6
              prose-ul:list-disc prose-ol:list-decimal
              prose-ul:pl-10 prose-ol:pl-10"
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n\s*\n/g, "</p><p>&nbsp;</p><p>"),
            }}
          />
        </article>

        <section className="mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8 transition-colors">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Comments ({comments.length})
          </h2>

          <CommentForm postId={post.id!} />

          <div className="mt-8">
            <CommentList comments={comments} />
          </div>
        </section>

        <div className="flex justify-center mb-12">
          <Link
            href={`/blogs/${post.category}`}
            className={`px-4 py-2 ${
              post.category === "religion"
                ? "bg-red-600"
                : post.category === "morals"
                ? "bg-green-600"
                : post.category === "philosophy"
                ? "bg-blue-600"
                : "bg-purple-600"
            } text-white rounded-lg hover:opacity-90 transition-colors shadow-sm`}
          >
            ← Back to {formattedCategory}
          </Link>
        </div>
      </div>
    </div>
  );
}
