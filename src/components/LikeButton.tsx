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
        if (typeof window !== "undefined") {
          if (liked) {
            localStorage.setItem(`post_like_${postId}`, "true");
          } else {
            localStorage.removeItem(`post_like_${postId}`);
          }
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
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(`post_like_${postId}`);
        if (saved === "true") {
          setUserLiked(true);
        }
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

    // Update UI immediately for better UX (optimistic update)
    setUserLiked(newLikedState);
    setLikeCount((prevCount) =>
      newLikedState ? prevCount + 1 : Math.max(0, prevCount - 1)
    );

    try {
      // Update the database
      if (newLikedState) {
        await incrementLikes(postId);
      } else {
        if (likeCount > 0) {
          await decrementLikes(postId);
        }
      }

      // If successful, save to localStorage
      saveLikeToStorage(newLikedState);

      console.log(
        `Like ${newLikedState ? "added" : "removed"}, new count: ${
          newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1)
        }`
      );
    } catch (error) {
      console.error("Failed to update like:", error);

      // Revert UI changes if database update failed
      setUserLiked(!newLikedState);
      setLikeCount((prevCount) =>
        !newLikedState ? prevCount + 1 : Math.max(0, prevCount - 1)
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isProcessing}
      aria-pressed={userLiked}
      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 ${
        userLiked
          ? "bg-purple-100 text-purple-700"
          : "bg-purple-600 text-white hover:bg-purple-700"
      } ${isProcessing ? "opacity-70 cursor-wait" : ""}`}
    >
      <FiThumbsUp
        className={`transition-all ${userLiked ? "fill-purple-600" : ""}`}
      />
      <span>
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </span>
    </button>
  );
}
