"use client";

import { useState, useEffect } from "react";
import { FiThumbsUp } from "react-icons/fi";
import { incrementLikes, decrementLikes } from "@/lib/firestore";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Check localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasUserLiked = localStorage.getItem(`liked-${postId}`) === "true";
      setHasLiked(hasUserLiked);
    }
  }, [postId]);

  const handleLikeToggle = async () => {
    if (isUpdating) return; // Prevent multiple clicks while request is in progress

    setIsUpdating(true);

    try {
      if (hasLiked) {
        // Unlike
        setLikes((prev) => Math.max(0, prev - 1));
        setHasLiked(false);

        // Update in Firestore
        await decrementLikes(postId);

        // Remove from localStorage
        localStorage.removeItem(`liked-${postId}`);
      } else {
        // Like
        setLikes((prev) => prev + 1);
        setHasLiked(true);

        // Update in Firestore and ensure we wait for the operation to complete
        await incrementLikes(postId);

        // Save liked state in localStorage
        localStorage.setItem(`liked-${postId}`, "true");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
      // Revert optimistic update
      if (hasLiked) {
        setLikes((prev) => prev + 1);
        setHasLiked(true);
        localStorage.setItem(`liked-${postId}`, "true");
      } else {
        setLikes((prev) => Math.max(0, prev - 1));
        setHasLiked(false);
        localStorage.removeItem(`liked-${postId}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isUpdating}
      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
        hasLiked
          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
          : "bg-purple-600 hover:bg-purple-700 text-white hover:shadow-md"
      } ${isUpdating ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      <FiThumbsUp
        className={hasLiked ? "fill-purple-600 dark:fill-purple-400" : ""}
      />
      <span>
        {likes} {likes === 1 ? "Like" : "Likes"}
      </span>
    </button>
  );
}
