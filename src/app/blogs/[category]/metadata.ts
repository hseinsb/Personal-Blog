import { Metadata } from "next";

// Validate if it's a valid category
const isValidCategory = (category: string): boolean => {
  return [
    "religion",
    "morals",
    "philosophy",
    "personal-growth",
    "classified",
  ].includes(category);
};

export async function generateMetadata(props: {
  params: { category: string };
}): Promise<Metadata> {
  const { category } = props.params;

  if (!isValidCategory(category)) {
    return {
      title: "Category Not Found",
    };
  }

  const formattedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${formattedCategory} - Hussein's Philosophy Blog`,
    description: `Explore Hussein's philosophical thoughts on ${formattedCategory.toLowerCase()}`,
  };
}
