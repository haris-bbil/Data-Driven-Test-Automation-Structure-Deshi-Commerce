import { test, expect } from "@playwright/test";
import { ProductCreatePage } from "../../../pages/merchantPanelCoreModulePages/productPage/productCreate.page";
import { DataLoader } from "../../../utils/data-loader";
import {
  ProductCreateData,
  ProductCreateScenario,
} from "../../../utils/types/product-create.types";

const data = DataLoader.loadWithEnvCreds<ProductCreateData>(
  "merchantPanelData/product/product_create_data.json",
  {
    emailEnvKey: "DASHBOARD_EMAIL",
    passwordEnvKey: "DASHBOARD_PASSWORD",
    scenarioPath: "testData",
    requireCreds: true,
  },
);

type ProductTestScenario = {
  id: string;
  scenario: string;
  type: "regular";
  testTag: string;
} & ProductCreateScenario;

const scenarios: ProductTestScenario[] = data.testData.map((item, index) => {
  const serial = String(index + 1).padStart(3, "0");

  return {
    id: `PC-${serial}`,
    scenario: `Create product - ${item.title}`,
    type: "regular",
    testTag: `@pc${serial}`,
    ...item,
  };
});

test.describe("Product Creation:", () => {
  test.describe.configure({ mode: "parallel" });

  scenarios.forEach((scenario) => {
    test(`${scenario.id} [${scenario.id}] ${scenario.scenario} @product-create ${scenario.testTag} @${scenario.type} @${scenario.id}`, async ({
      page,
    }) => {
      const productCreate = new ProductCreatePage(page);
      const scenarioWithEnvCreds: ProductCreateScenario = {
        ...scenario,
        email: process.env.DASHBOARD_EMAIL ?? scenario.email,
        password: process.env.DASHBOARD_PASSWORD ?? scenario.password,
      };

      await productCreate.navigateToDashboard();
      await productCreate.login(
        scenarioWithEnvCreds.email,
        scenarioWithEnvCreds.password,
      );
      await productCreate.navigateToAddProduct();
      await productCreate.fillBasicInfo(scenarioWithEnvCreds);

      if (scenarioWithEnvCreds.imagePath) {
        await productCreate.uploadImage(scenarioWithEnvCreds.imagePath);
      }

      await productCreate.fillVideoUrl(scenarioWithEnvCreds.videoUrl);
      await productCreate.fillPricingAndInventory(scenarioWithEnvCreds);
      await productCreate.saveProduct();

      await expect(productCreate.successMessage).toBeVisible({ timeout: 10000 });

      const productUrl = productCreate.getCurrentProductUrl();
      await productCreate.logProductCreationSummary(
        scenarioWithEnvCreds,
        productUrl,
      );
    });
  });
});