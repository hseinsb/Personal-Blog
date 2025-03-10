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
  increment,
  Timestamp,
} from "firebase/firestore";

// Types
export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  date: Timestamp;
  likes: number;
  slug: string;
  category: "religion" | "morals" | "philosophy" | "personal-growth";
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
  const postsRef = collection(db, "posts");
  const postsSnapshot = await getDocs(query(postsRef, orderBy("date", "desc")));
  return postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogPost[];
}

export async function getPostsByCategory(category: BlogPost["category"]) {
  const postsRef = collection(db, "posts");
  const postsSnapshot = await getDocs(
    query(postsRef, where("category", "==", category), orderBy("date", "desc"))
  );
  return postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogPost[];
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

export async function createPost(
  post: Omit<BlogPost, "id" | "date" | "likes">
) {
  return addDoc(collection(db, "posts"), {
    ...post,
    date: serverTimestamp(),
    likes: 0,
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

// Likes operations
export async function incrementLikes(postId: string) {
  const postRef = doc(db, "posts", postId);
  return updateDoc(postRef, {
    likes: increment(1),
  });
}

export async function decrementLikes(postId: string) {
  const postRef = doc(db, "posts", postId);
  // Using increment(-1) and ensuring likes don't go below 0 is handled in the LikeButton component
  return updateDoc(postRef, {
    likes: increment(-1),
  });
}
