"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  // Use a ref to track if the component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);
  // Keep track of the last successful like state
  const lastLikeState = useRef<boolean | null>(null);

  // Function to save like state to local storage
  const saveLikeToStorage = useCallback(
    (liked: boolean) => {
      try {
        if (typeof window !== "undefined") {
          if (liked) {
            localStorage.setItem(`post_like_${postId}`, "true");
            console.log(`Saved liked state to localStorage for post ${postId}`);
          } else {
            localStorage.removeItem(`post_like_${postId}`);
            console.log(
              `Removed liked state from localStorage for post ${postId}`
            );
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

  // Handle like/unlike
  const toggleLike = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    const newLikedState = !userLiked;
    console.log(
      `Toggle like - new state: ${newLikedState ? "liked" : "unliked"}`
    );

    // Update UI immediately for better UX (optimistic update)
    setUserLiked(newLikedState);
    setLikeCount((prevCount) =>
      newLikedState ? prevCount + 1 : Math.max(0, prevCount - 1)
    );

    try {
      // Update the database
      if (newLikedState) {
        console.log(`Incrementing like for post ${postId}...`);
        await incrementLikes(postId);
        console.log(`Successfully incremented like for post ${postId}`);
      } else {
        if (likeCount > 0) {
          console.log(`Decrementing like for post ${postId}...`);
          await decrementLikes(postId);
          console.log(`Successfully decremented like for post ${postId}`);
        }
      }

      // If successful, save to localStorage and update the ref
      if (isMounted.current) {
        saveLikeToStorage(newLikedState);
        lastLikeState.current = newLikedState;
        console.log(`Like operation successful, saved state: ${newLikedState}`);
      }
    } catch (error) {
      console.error(`Failed to update like for post ${postId}:`, error);

      // Revert UI changes if database update failed
      if (isMounted.current) {
        setUserLiked(!newLikedState);
        setLikeCount((prevCount) =>
          !newLikedState ? prevCount + 1 : Math.max(0, prevCount - 1)
        );
        console.log(`Reverted UI state due to error`);
      }
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
        console.log(`Finished processing, button available again`);
      }
    }
  };

  // Effect to sync state with localStorage on window focus
  useEffect(() => {
    const syncStateFromStorage = () => {
      try {
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem(`post_like_${postId}`);
          const shouldBeLiked = saved === "true";

          // Only update if the state differs from what's in storage
          if (shouldBeLiked !== userLiked) {
            console.log(
              `Syncing state from storage on window focus: ${
                shouldBeLiked ? "liked" : "not liked"
              }`
            );
            setUserLiked(shouldBeLiked);
          }
        }
      } catch (e) {
        console.error("Error syncing from localStorage:", e);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("focus", syncStateFromStorage);
      return () => {
        window.removeEventListener("focus", syncStateFromStorage);
      };
    }
  }, [postId, userLiked]);

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
