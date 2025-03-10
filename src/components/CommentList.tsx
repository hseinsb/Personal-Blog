import { Comment } from "@/lib/firestore";
import { FiUser, FiClock } from "react-icons/fi";

type CommentListProps = {
  comments: Comment[];
};

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800/60">
        <p className="text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <FiUser className="text-purple-600 dark:text-purple-400 mr-2" />
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {comment.name}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <FiClock className="mr-1" />
              <span>
                {comment.date
                  ? new Date(comment.date.toMillis()).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )
                  : "Date unavailable"}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {comment.message}
          </p>
        </div>
      ))}
    </div>
  );
}
