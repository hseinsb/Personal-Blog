"use client";

import { useState, useEffect, useCallback } from "react";
import { FiThumbsUp } from "react-icons/fi";
import { incrementLikes, decrementLikes } from "@/lib/firestore";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  // Create state for likes and liked status
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [userLiked, setUserLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to save like state to local storage
  const saveLikeToStorage = useCallback(
    (liked: boolean) => {
      try {
        if (liked) {
          localStorage.setItem(`post_like_${postId}`, "true");
        } else {
          localStorage.removeItem(`post_like_${postId}`);
        }
      } catch (e) {
        console.error("Error accessing localStorage:", e);
      }
    },
    [postId]
  );

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`post_like_${postId}`);
      if (saved === "true") {
        setUserLiked(true);
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
  }, [postId]);

  // Handle like/unlike
  const toggleLike = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    const newLikedState = !userLiked;

    // Update UI immediately (optimistic update)
    setUserLiked(newLikedState);
    setLikeCount((prev) => (newLikedState ? prev + 1 : Math.max(0, prev - 1)));
    saveLikeToStorage(newLikedState);

    try {
      // Update the database
      if (newLikedState) {
        await incrementLikes(postId);
      } else {
        await decrementLikes(postId);
      }
    } catch (error) {
      console.error("Failed to update like:", error);

      // Revert the optimistic update on failure
      setUserLiked(!newLikedState);
      setLikeCount((prev) =>
        !newLikedState ? prev + 1 : Math.max(0, prev - 1)
      );
      saveLikeToStorage(!newLikedState);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isProcessing}
      className={`flex items-center gap-2 px-6 py-3 rounded-full transition ${
        userLiked
          ? "bg-purple-100 text-purple-700"
          : "bg-purple-600 text-white hover:bg-purple-700"
      } ${isProcessing ? "opacity-70 cursor-wait" : ""}`}
    >
      <FiThumbsUp className={userLiked ? "fill-purple-600" : ""} />
      <span>
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </span>
    </button>
  );
}
