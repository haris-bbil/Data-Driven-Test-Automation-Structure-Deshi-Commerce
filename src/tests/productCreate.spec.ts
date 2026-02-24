import { test } from "@playwright/test";
import DataLoader from "../utils/data-loader";
import { ProductCreatePage } from "../pages/productCreate.page";
import { ProductCreateData } from "../utils/types/product-create.types";

test.describe("Product Create — Dashboard", () => {
  test("Create a new product with valid details", async ({ page }) => {
    const data = DataLoader.load<ProductCreateData>("product/product_create_data.json", {
      scenarioPath: "testData",
      emailEnvKey: "DASHBOARD_EMAIL",
      passwordEnvKey: "DASHBOARD_PASSWORD",
      requireCreds: true,
    });

    const productCreate = new ProductCreatePage(page, data);
    await productCreate.createProduct(data.testData);
  });
});