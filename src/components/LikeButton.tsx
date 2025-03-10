"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FiThumbsUp } from "react-icons/fi";
import { incrementLikes } from "@/lib/firestore";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  // Create state for likes and liked status
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [userLiked, setUserLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isMounted = useRef(true);

  // Function to save like state to local storage
  const saveLikeToStorage = useCallback(
    (liked: boolean) => {
      try {
        if (typeof window !== "undefined") {
          if (liked) {
            localStorage.setItem(`post_like_${postId}`, "true");
            console.log(`Saved liked state to localStorage for post ${postId}`);
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
    isMounted.current = true;

    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(`post_like_${postId}`);
        console.log(`Initial localStorage state for post ${postId}:`, saved);

        if (saved === "true") {
          setUserLiked(true);
          console.log(`Setting initial liked state to true for post ${postId}`);
        }
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }

    return () => {
      isMounted.current = false;
    };
  }, [postId]);

  // Handle like
  const handleLike = async () => {
    // If already liked or processing, don't do anything
    if (userLiked || isProcessing) return;

    setIsProcessing(true);

    // Update UI immediately for better UX
    setUserLiked(true);
    setLikeCount((prevCount) => prevCount + 1);

    try {
      // Update the database
      console.log(`Incrementing like for post ${postId}...`);
      await incrementLikes(postId);
      console.log(`Successfully incremented like for post ${postId}`);

      // Save to localStorage
      if (isMounted.current) {
        saveLikeToStorage(true);
        console.log(`Like operation successful, saved state`);
      }
    } catch (error) {
      console.error(`Failed to update like for post ${postId}:`, error);

      // Revert UI changes if database update failed
      if (isMounted.current) {
        setUserLiked(false);
        setLikeCount((prevCount) => Math.max(0, prevCount - 1));
        console.log(`Reverted UI state due to error`);
      }
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
        console.log(`Finished processing, button available again`);
      }
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isProcessing || userLiked}
      aria-pressed={userLiked}
      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 ${
        userLiked
          ? "bg-purple-100 text-purple-700 cursor-default"
          : "bg-purple-600 text-white hover:bg-purple-700"
      } ${isProcessing ? "opacity-70 cursor-wait" : ""}`}
    >
      <FiThumbsUp
        className={`transition-all ${userLiked ? "fill-purple-600" : ""}`}
      />
      <span>
        {userLiked ? "Liked!" : "Like"} ({likeCount})
      </span>
    </button>
  );
}
