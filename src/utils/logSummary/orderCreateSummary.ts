import { OrderCreateScenario } from "../types/order-create.types";

export function buildOrderCreationSummary(
  scenario: OrderCreateScenario,
  orderUrl: string,
): string {
  const summaryLines = [
    `Selected Product Count: ${scenario.productSelectionCount}`,
    `Product Quantity: ${scenario.quantity}`,
    `Discount: ${scenario.discount}`,
    `Shipping Charge: ${scenario.shippingCharge}`,
    `Order Note: ${scenario.note}`,
    `Customer Name: ${scenario.customerName}`,
    `Customer Phone: ${scenario.customerPhone ? "[REDACTED]" : ""}`,
    `Customer Email: ${scenario.customerEmail ? "[REDACTED]" : ""}`,
    `Shipping Address: ${scenario.shippingAddress ? "[REDACTED]" : ""}`,
    `District: ${scenario.district}`,
    `Upazila: ${scenario.upazila}`,
    `Order URL: ${orderUrl}`,
  ];

  return summaryLines.join("\n");
}
