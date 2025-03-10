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
  getDoc,
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
  try {
    console.log(`Starting increment operation for post ID: ${postId}`);
    const postRef = doc(db, "posts", postId);

    // Use an atomic operation for incrementing
    const result = await updateDoc(postRef, {
      likes: increment(1),
    });

    console.log(`Successfully incremented likes for post ID: ${postId}`);
    return result;
  } catch (error) {
    console.error(`Error incrementing likes for post ID: ${postId}`, error);
    throw error; // Re-throw to handle in the component
  }
}

export async function decrementLikes(postId: string) {
  try {
    console.log(`Starting decrement operation for post ID: ${postId}`);
    const postRef = doc(db, "posts", postId);

    // Use an atomic operation for decrementing
    const result = await updateDoc(postRef, {
      likes: increment(-1),
    });

    console.log(`Successfully decremented likes for post ID: ${postId}`);
    return result;
  } catch (error) {
    console.error(`Error decrementing likes for post ID: ${postId}`, error);
    throw error; // Re-throw to handle in the component
  }
}

// Debug helper (can be called from browser console)
export async function debugLikeCount(postId: string) {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const data = postDoc.data();
      console.log(`Post ID: ${postId}`);
      console.log(`Current likes: ${data.likes}`);
      console.log(`Post title: ${data.title}`);
      return data.likes;
    } else {
      console.log(`Post ID ${postId} does not exist`);
      return null;
    }
  } catch (error) {
    console.error(`Error debugging like count:`, error);
    return null;
  }
}
