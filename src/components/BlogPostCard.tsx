import Link from "next/link";
import { FiCalendar } from "react-icons/fi";
import { BlogPost } from "@/lib/firestore";

type BlogPostCardProps = {
  post: BlogPost;
};

export default function BlogPostCard({ post }: BlogPostCardProps) {
  // Format the date nicely
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

  // Strip HTML tags and truncate content for preview
  const stripHtml = (html: string) => {
    // Create a temporary DOM element
    if (typeof document !== "undefined") {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || "";
    }
    // Fallback for server-side rendering
    return html.replace(/<[^>]*>?/g, "");
  };

  const plainContent = stripHtml(post.content);
  const truncatedContent =
    plainContent.length > 150
      ? `${plainContent.substring(0, 150)}...`
      : plainContent;

  // Determine category style - keep consistent styles regardless of dark/light mode
  const getCategoryStyle = () => {
    switch (post.category) {
      case "religion":
        return "bg-red-900 text-red-100";
      case "morals":
        return "bg-green-900 text-green-100";
      case "philosophy":
        return "bg-blue-900 text-blue-100";
      case "personal-growth":
        return "bg-purple-900 text-purple-100";
      case "classified":
        return "bg-pink-900 text-pink-100";
      default:
        return "bg-gray-800 text-gray-100";
    }
  };

  return (
    <article className="bento-card flex flex-col h-full bg-gray-800 p-5 rounded-xl shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span
          className={`px-2 py-1 rounded-md text-xs ${getCategoryStyle()} transition-colors duration-300`}
        >
          {post.category.replace("-", " ")}
        </span>
      </div>

      <h2 className="text-xl font-bold mb-2 text-white transition-colors duration-300">
        {post.title}
      </h2>

      <p className="text-sm flex-grow mb-4 text-gray-200 transition-colors duration-300">
        {truncatedContent}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-300 transition-colors duration-300">
          <FiCalendar className="mr-1" />
          <span>{formattedDate}</span>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}
