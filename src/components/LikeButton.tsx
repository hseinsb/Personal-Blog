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

  // Check localStorage on mount to determine if user has already liked this post
  useEffect(() => {
    const likedStatus = localStorage.getItem(`liked-${postId}`);
    if (likedStatus === "true") {
      setHasLiked(true);
    }
  }, [postId]);

  const handleLike = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      if (!hasLiked) {
        // First update state and localStorage (optimistic update)
        setLikes((prevLikes) => prevLikes + 1);
        setHasLiked(true);
        localStorage.setItem(`liked-${postId}`, "true");

        // Then update in database
        await incrementLikes(postId);
        console.log("Like added successfully");
      } else {
        // First update state and localStorage (optimistic update)
        setLikes((prevLikes) => Math.max(0, prevLikes - 1));
        setHasLiked(false);
        localStorage.removeItem(`liked-${postId}`);

        // Then update in database
        await decrementLikes(postId);
        console.log("Like removed successfully");
      }
    } catch (error) {
      console.error("Error toggling like:", error);

      // If there was an error, revert to the previous state
      if (hasLiked) {
        setLikes((prevLikes) => prevLikes + 1);
        setHasLiked(true);
        localStorage.setItem(`liked-${postId}`, "true");
      } else {
        setLikes((prevLikes) => Math.max(0, prevLikes - 1));
        setHasLiked(false);
        localStorage.removeItem(`liked-${postId}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isUpdating}
      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all 
        ${
          hasLiked
            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            : "bg-purple-600 hover:bg-purple-700 text-white hover:shadow-md"
        } 
        ${isUpdating ? "opacity-70 cursor-not-allowed" : ""}`}
      aria-label={hasLiked ? "Unlike this post" : "Like this post"}
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
