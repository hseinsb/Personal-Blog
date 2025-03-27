"use client";

import dynamic from "next/dynamic";
import { BlogPost } from "@/lib/firestore";

// Use dynamic import with ssr: false in this client component
const ClassifiedSection = dynamic(() => import("./ClassifiedSection"), {
  ssr: false,
});

export default function ClientClassifiedSection({
  posts,
}: {
  posts: BlogPost[];
}) {
  return <ClassifiedSection posts={posts} />;
}
