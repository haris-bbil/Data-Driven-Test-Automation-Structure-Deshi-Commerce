import { ProductCreateScenario } from "../types/product-create.types";

type ProductCreateSummaryScenario = ProductCreateScenario & {
  description?: string;
  comparePrice?: string;
  stockQuantity?: string;
  publishStatus?: string;
};

export function buildProductCreationSummary(
  scenario: ProductCreateSummaryScenario,
  productUrl: string,
): string {
  const summaryLines = [
    `Enter Product Name: ${scenario.title}`,
    `Enter Description: ${scenario.description ?? scenario.subTitle}`,
    `Upload Product Images: ${scenario.imagePath ?? "N/A"}`,
    `Set Price: ${scenario.price}`,
    `Set Compare Price: ${scenario.comparePrice ?? "N/A"}`,
    `Set SKU: ${scenario.sku}`,
    `Set Stock Quantity: ${scenario.stockQuantity ?? scenario.available}`,
    `Assigned Category: ${scenario.category}`,
    `Product URL: ${productUrl}`,
  ];

  return summaryLines.join("\n");
}
