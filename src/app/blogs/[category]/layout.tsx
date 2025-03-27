import { generateMetadata } from "./metadata";

export { generateMetadata };

// More frequent revalidation for category pages
export const revalidate = 60; // Revalidate every minute

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
