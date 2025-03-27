"use client";

import { useState, useEffect } from "react";
import { createPost, updatePost, BlogPost } from "@/lib/firestore";
import dynamic from "next/dynamic";

// Import TinyMCE dynamically to avoid SSR issues
const Editor = dynamic(
  async () => {
    const { Editor } = await import("@tinymce/tinymce-react");
    return Editor;
  },
  {
    ssr: false,
    loading: () => (
      <div className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800 min-h-[300px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading editor...</p>
      </div>
    ),
  }
);

type AdminPostFormProps = {
  post: BlogPost | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function AdminPostForm({
  post,
  onSuccess,
  onCancel,
}: AdminPostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<BlogPost["category"]>("philosophy");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Populate form if editing existing post
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setSlug(post.slug);
      setCategory(post.category);
    }
  }, [post]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Only auto-generate slug if we're creating a new post
    // or if slug hasn't been manually edited yet
    if (!post || slug === generateSlug(post.title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Manual slug editing
    setSlug(generateSlug(e.target.value));
  };

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim() || !slug.trim()) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);

    try {
      if (post) {
        // Update existing post
        await updatePost(post.id!, {
          title,
          content,
          slug,
          category,
        });
      } else {
        // Create new post
        await createPost({
          title,
          content,
          slug,
          category,
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving post:", error);
      setError("Failed to save post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={submitting}
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Slug (URL)
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={handleSlugChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={submitting}
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as BlogPost["category"])}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          disabled={submitting}
        >
          <option value="religion">Religion</option>
          <option value="morals">Morals</option>
          <option value="philosophy">Philosophy</option>
          <option value="personal-growth">Personal Growth</option>
          <option value="classified">Classified</option>
        </select>
      </div>

      <div className="mb-6">
        <label
          htmlFor="content"
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          Content
        </label>
        {typeof window !== "undefined" && (
          <Editor
            tinymceScriptSrc={"/tinymce/tinymce.min.js"}
            value={content}
            onEditorChange={handleEditorChange}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              skin: "oxide",
              content_css: "default",
              content_style: `
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                  font-size: 16px;
                  line-height: 1.6;
                }
                p { margin: 0 0 1.5em 0; }
                h1, h2, h3, h4, h5, h6 { margin: 1.5em 0 0.5em 0; }
                ul, ol { margin: 0 0 1em 0; padding: 0 0 0 2.5em; }
                ul { list-style-type: disc; }
                ol { list-style-type: decimal; }
                li { margin: 0.5em 0; }
              `,
              element_format: "html",
              forced_root_block: "p",
              force_br_newlines: false,
              force_p_newlines: true,
              end_container_on_empty_block: true,
              remove_trailing_brs: false,
              advlist_bullet_styles: "default",
              advlist_number_styles: "default",
              formats: {
                p: { block: "p", styles: { "margin-bottom": "1.5em" } },
              },
              fix_list_elements: true,
              indent_use_margin: false,
              paste_merge_formats: false,
            }}
          />
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Use the formatting toolbar to style your content. Format text, add
          lists, insert links, and more.
        </p>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          disabled={submitting}
        >
          {submitting
            ? post
              ? "Updating..."
              : "Creating..."
            : post
            ? "Update Post"
            : "Create Post"}
        </button>
      </div>
    </form>
  );
}
