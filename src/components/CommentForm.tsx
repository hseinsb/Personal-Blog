"use client";

import { useState } from "react";
import { addComment } from "@/lib/firestore";

type CommentFormProps = {
  postId: string;
};

export default function CommentForm({ postId }: CommentFormProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      setFormStatus({
        type: "error",
        message: "Please fill in all fields.",
      });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: null, message: "" });

    try {
      await addComment({
        name,
        message,
        postId,
      });

      // Reset form
      setName("");
      setMessage("");

      setFormStatus({
        type: "success",
        message: "Your comment was added successfully!",
      });

      // Refresh the page to show the new comment
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "There was an error posting your comment. Please try again.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Leave a Comment
      </h3>

      {formStatus.type && (
        <div
          className={`p-3 rounded-md mb-4 ${
            formStatus.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          }`}
        >
          {formStatus.message}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="message"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          Comment
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          disabled={isSubmitting}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
