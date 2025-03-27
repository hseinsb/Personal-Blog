import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// Types
export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  date: Timestamp;
  slug: string;
  category:
    | "religion"
    | "morals"
    | "philosophy"
    | "personal-growth"
    | "classified";
  likes?: number; // Optional likes count
}

export interface Comment {
  id?: string;
  name: string;
  message: string;
  date: Timestamp;
  postId: string;
}

// Posts CRUD operations
export async function getAllPosts() {
  try {
    console.log("Fetching all posts...");
    const postsRef = collection(db, "posts");
    // Use a more reliable ordering by date and exclude classified posts
    const postsSnapshot = await getDocs(
      query(
        postsRef,
        where("category", "!=", "classified"),
        orderBy("category"),
        orderBy("date", "desc")
      )
    );

    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];

    console.log(`Retrieved ${posts.length} posts`);
    return posts;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

export async function getPostsByCategory(category: BlogPost["category"]) {
  try {
    console.log(`Fetching posts for category: ${category}`);
    const postsRef = collection(db, "posts");
    const postsSnapshot = await getDocs(
      query(
        postsRef,
        where("category", "==", category),
        orderBy("date", "desc")
      )
    );

    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];

    console.log(`Retrieved ${posts.length} posts for category: ${category}`);
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for category ${category}:`, error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  const postsRef = collection(db, "posts");
  const postsSnapshot = await getDocs(
    query(postsRef, where("slug", "==", slug))
  );

  if (postsSnapshot.empty) {
    return null;
  }

  const postDoc = postsSnapshot.docs[0];
  return {
    id: postDoc.id,
    ...postDoc.data(),
  } as BlogPost;
}

export async function createPost(post: Omit<BlogPost, "id" | "date">) {
  return addDoc(collection(db, "posts"), {
    ...post,
    date: serverTimestamp(),
    likes: 0, // Initialize likes count to 0
  });
}

export async function updatePost(id: string, data: Partial<BlogPost>) {
  const postRef = doc(db, "posts", id);
  return updateDoc(postRef, {
    ...data,
    // Only update timestamp if content is being changed
    ...(data.content && { date: serverTimestamp() }),
  });
}

export async function deletePost(id: string) {
  return deleteDoc(doc(db, "posts", id));
}

// Comments operations
export async function getCommentsByPostId(postId: string) {
  const commentsRef = collection(db, "comments");
  const commentsSnapshot = await getDocs(
    query(commentsRef, where("postId", "==", postId), orderBy("date", "desc"))
  );

  return commentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[];
}

export async function addComment(comment: Omit<Comment, "id" | "date">) {
  return addDoc(collection(db, "comments"), {
    ...comment,
    date: serverTimestamp(),
  });
}

export async function deleteComment(id: string) {
  return deleteDoc(doc(db, "comments", id));
}

// Function to get classified posts only
export async function getClassifiedPosts() {
  try {
    console.log("Fetching classified posts...");
    const postsRef = collection(db, "posts");
    const postsSnapshot = await getDocs(
      query(
        postsRef,
        where("category", "==", "classified"),
        orderBy("date", "desc")
      )
    );

    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];

    console.log(`Retrieved ${posts.length} classified posts`);
    return posts;
  } catch (error) {
    console.error("Error fetching classified posts:", error);
    return [];
  }
}

// Function to get all posts including classified ones (for admin use only)
export async function getAllPostsAdmin() {
  try {
    console.log("Fetching all posts for admin...");
    const postsRef = collection(db, "posts");
    // Get all posts including classified ones, ordered by date
    const postsSnapshot = await getDocs(
      query(postsRef, orderBy("category"), orderBy("date", "desc"))
    );

    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];

    console.log(`Retrieved ${posts.length} posts for admin`);
    return posts;
  } catch (error) {
    console.error("Error fetching all posts for admin:", error);
    return [];
  }
}

// Helper function to serialize blog posts for client components
export function serializeBlogPosts(posts: BlogPost[]): any[] {
  return posts.map((post) => ({
    ...post,
    date: post.date
      ? {
          seconds: post.date.seconds,
          nanoseconds: post.date.nanoseconds,
          toMillis: undefined, // Remove the function reference
        }
      : null,
  }));
}
