import { CategoryOption } from "@/types";

export function normalizeCategory(
  category:
    | string
    | { value?: string; label?: string; slug?: string; name?: string }
): CategoryOption {
  if (typeof category === "string") {
    return { value: category, label: category };
  }

  if (category && typeof category === "object") {
    const value =
      category.value ??
      category.slug ??
      String(category.name ?? category.label ?? "");
    const label = category.name ?? category.label ?? value;
    return { value: String(value), label: String(label) };
  }

  return { value: String(category), label: String(category) };
}

export function normalizeCategories(
  categories: Array<
    string | { value?: string; label?: string; slug?: string; name?: string }
  >
): CategoryOption[] {
  return categories.map(normalizeCategory);
}

export function formatCategoryLabel(category: string): string {
  return category
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
