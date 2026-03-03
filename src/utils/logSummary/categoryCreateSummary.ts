import { CategoryCreateScenario } from "../types/category-create.types";

export function buildCategoryCreationSummary(
  scenario: CategoryCreateScenario,
  categoryUrl: string,
): string {
  const summaryLines = [
    `Enter Category Name: ${scenario.title}`,
    `Enter Description: ${scenario.description ?? "N/A"}`,
    `Enter Page Title: ${scenario.pageTitle ?? "N/A"}`,
    `Upload Category Image: ${scenario.imagePath ?? "N/A"}`,
    `Category URL: ${categoryUrl}`,
  ];

  return summaryLines.join("\n");
}
