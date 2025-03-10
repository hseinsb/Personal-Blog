"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiLogOut } from "react-icons/fi";
import {
  getAllPosts,
  deletePost,
  BlogPost,
  getCommentsByPostId,
  deleteComment,
  Comment,
} from "@/lib/firestore";
import { signOut, isAdminUser } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { ADMIN_UID } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import dynamic from "next/dynamic";

// Dynamically import AdminPostForm component to avoid rendering issues
const AdminPostForm = dynamic(
  () => import("../../../components/AdminPostForm"),
  {
    ssr: false,
    loading: () => <div className="text-center p-8">Loading editor...</div>,
  }
);

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
  const [comments, setComments] = useState<(Comment & { postTitle: string })[]>(
    []
  );
  const [commentsLoading, setCommentsLoading] = useState(false);
  const router = useRouter();

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Dashboard - User UID:", user.uid);
        console.log("Dashboard - ADMIN_UID:", ADMIN_UID);
        console.log("Dashboard - Is admin?", user.uid === ADMIN_UID);
        console.log("Dashboard - isAdminUser() result:", isAdminUser(user));
      }

      // Allow the hardcoded admin UID to access the dashboard regardless of the isAdminUser check
      if (user && user.uid === ADMIN_UID) {
        setAuthorized(true);
        fetchPosts();
      } else {
        router.push("/admin");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllComments = async () => {
    setCommentsLoading(true);
    try {
      const fetchedPosts = await getAllPosts();
      let allComments: (Comment & { postTitle: string })[] = [];

      // Fetch comments for each post
      for (const post of fetchedPosts) {
        const postComments = await getCommentsByPostId(post.id!);
        allComments = [
          ...allComments,
          ...postComments.map((comment) => ({
            ...comment,
            postTitle: post.title,
          })),
        ];
      }

      // Sort by date (newest first)
      allComments.sort((a, b) => {
        return b.date.toMillis() - a.date.toMillis();
      });

      setComments(allComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments. Please try again.");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post. Please try again.");
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreatePost = () => {
    setIsCreating(true);
    setIsEditing(false);
    setEditingPost(null);
  };

  const handlePostUpdated = () => {
    setIsCreating(false);
    setIsEditing(false);
    setEditingPost(null);
    fetchPosts();
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment. Please try again.");
    }
  };

  useEffect(() => {
    if (authorized) {
      if (activeTab === "posts") {
        fetchPosts();
      } else if (activeTab === "comments") {
        fetchAllComments();
      }
    }
  }, [activeTab, authorized]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/admin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse text-accent">
          Checking authorization...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-background to-accent-light/20 dark:from-gray-900 dark:to-purple-900/20 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your philosophy blog posts
            </p>
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              onClick={handleCreatePost}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiPlus /> New Post
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiLogOut /> Sign Out
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "posts"
                ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Blog Posts
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "comments"
                ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
        </div>

        {isCreating || isEditing ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              {isCreating ? "Create New Post" : "Edit Post"}
            </h2>
            <AdminPostForm
              post={editingPost}
              onSuccess={handlePostUpdated}
              onCancel={() => {
                setIsCreating(false);
                setIsEditing(false);
              }}
            />
          </div>
        ) : activeTab === "posts" ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Your Blog Posts
            </h2>

            {loading ? (
              <div className="text-center p-12">
                <div className="animate-pulse text-accent">
                  Loading posts...
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-4">
                  No blog posts yet. Create your first post!
                </p>
                <button
                  onClick={handleCreatePost}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors mx-auto"
                >
                  <FiPlus /> Create Post
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-200">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-200">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-200">
                        Date
                      </th>
                      <th className="px-4 py-3 text-center text-gray-700 dark:text-gray-200">
                        Likes
                      </th>
                      <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr
                        key={post.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="font-medium hover:text-purple-600 dark:hover:text-purple-400"
                            target="_blank"
                          >
                            {post.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 capitalize text-gray-700 dark:text-gray-300">
                          {post.category.replace("-", " ")}
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {post.date
                            ? new Date(
                                post.date.toMillis()
                              ).toLocaleDateString()
                            : "No date"}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                          {post.likes}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              aria-label={`Edit ${post.title}`}
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id!)}
                              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              aria-label={`Delete ${post.title}`}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Comments Management
            </h2>

            {commentsLoading ? (
              <div className="text-center p-12">
                <div className="animate-pulse text-purple-600 dark:text-purple-400">
                  Loading comments...
                </div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-4">No comments yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-200">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-200">
                        Comment
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-200">
                        Post
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-200">
                        Date
                      </th>
                      <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((comment) => (
                      <tr
                        key={comment.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                          {comment.name}
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">
                          {comment.message}
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          <Link
                            href={`/blog/${comment.postId}`}
                            className="hover:text-purple-600 dark:hover:text-purple-400 hover:underline"
                            target="_blank"
                          >
                            {comment.postTitle}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {comment.date
                            ? new Date(
                                comment.date.toMillis()
                              ).toLocaleDateString()
                            : "No date"}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDeleteComment(comment.id!)}
                              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              aria-label={`Delete comment by ${comment.name}`}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-accent hover:underline">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
