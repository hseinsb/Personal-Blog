"use client";

import { useState } from "react";
import { BlogPost } from "@/lib/firestore";
import BlogPostCard from "./BlogPostCard";
import ClientPasswordProtection from "./ClientPasswordProtection";
import { useClassifiedAccess } from "@/lib/useClassifiedAccess";
import { LockIcon } from "lucide-react";

interface ClassifiedSectionProps {
  posts: BlogPost[];
}

export default function ClassifiedSection({ posts }: ClassifiedSectionProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { hasAccess, isChecking, grantAccess } = useClassifiedAccess();

  if (isChecking) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="mt-8 mb-12">
      <div
        className={`p-4 border-2 border-dashed rounded-lg ${
          hasAccess
            ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
            : "border-gray-300 bg-gray-50 dark:bg-gray-800/50"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400 flex items-center">
            <LockIcon className="mr-2 h-5 w-5" />
            Classified Content
          </h2>

          {hasAccess && (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-sm text-pink-600 dark:text-pink-400 underline"
            >
              Re-enter password
            </button>
          )}
        </div>

        {!hasAccess ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This section contains private content meant for special eyes only.
            </p>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors shadow-sm"
            >
              Enter Password
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Welcome to your special place - these thoughts are just for you.
            </p>

            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed border-pink-300 dark:border-pink-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400">
                  No classified posts yet. The secret thoughts are still
                  forming.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {showPasswordModal && (
        <ClientPasswordProtection
          onSuccess={() => {
            grantAccess();
            setShowPasswordModal(false);
          }}
          onCancel={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
}
