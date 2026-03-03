import { test } from "@playwright/test";
import { CategoryCreatePage } from "../../../pages/merchantPanelCoreModulePages/productPage/categoryCreate.page";
import { DataLoader } from "../../../utils/data-loader";
import {
  CategoryCreateData,
  CategoryCreateScenario,
} from "../../../utils/types/category-create.types";

const data = DataLoader.loadWithEnvCreds<CategoryCreateData>(
  "merchantPanelData/category/category_create_data.json",
  {
    emailEnvKey: "DASHBOARD_EMAIL",
    passwordEnvKey: "DASHBOARD_PASSWORD",
    scenarioPath: "testData",
    requireCreds: true,
  },
);

type CategoryTestScenario = {
  id: string;
  scenario: string;
  type: "regular";
  testTag: string;
} & CategoryCreateScenario;

const scenarios: CategoryTestScenario[] = data.testData.map((item, index) => {
  const serial = String(index + 1).padStart(3, "0");

  return {
    id: `CC-${serial}`,
    scenario: `Create category - ${item.title}`,
    type: "regular",
    testTag: `@cc${serial}`,
    ...item,
  };
});

test.describe("Category Creation:", () => {
  test.describe.configure({ mode: "parallel" });

  scenarios.forEach((scenario) => {
    test(`${scenario.id} [${scenario.id}] ${scenario.scenario} @category-create ${scenario.testTag} @${scenario.type} @${scenario.id}`, async ({
      page,
    }) => {
      const categoryPage = new CategoryCreatePage(page);
      const scenarioWithEnvCreds: CategoryCreateScenario = {
        ...scenario,
        email: process.env.DASHBOARD_EMAIL ?? scenario.email,
        password: process.env.DASHBOARD_PASSWORD ?? scenario.password,
      };

      await categoryPage.createCategory(scenarioWithEnvCreds);

      const categoryUrl = categoryPage.getCurrentCategoryUrl();
      await categoryPage.logCategoryCreationSummary(
        scenarioWithEnvCreds,
        categoryUrl,
      );
    });
  });
});
