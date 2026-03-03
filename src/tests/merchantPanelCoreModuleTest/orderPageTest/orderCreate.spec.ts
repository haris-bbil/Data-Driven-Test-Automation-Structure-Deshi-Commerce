import { test } from "@playwright/test";
import { OrderCreatePage } from "../../../pages/merchantPanelCoreModulePages/ordersPage/orderCreate.page";
import { DataLoader } from "../../../utils/data-loader";
import {
  OrderCreateData,
  OrderCustomerFlow,
  OrderCreateScenario,
} from "../../../utils/types/order-create.types";

const data = DataLoader.loadWithEnvCreds<OrderCreateData>(
  "merchantPanelData/orders/order_create_data.json",
  {
    emailEnvKey: "DASHBOARD_EMAIL",
    passwordEnvKey: "DASHBOARD_PASSWORD",
    scenarioPath: "testData",
    requireCreds: true,
  },
);

type OrderTestScenario = {
  id: string;
  scenario: string;
  type: "regular";
  testTag: string;
} & OrderCreateScenario;

function getScenarioTitle(flow: OrderCustomerFlow, item: OrderCreateScenario): string {
  if (flow === "existing") {
    return `Create order using existing customer - ${item.existingCustomerName ?? item.customerKeyword}`;
  }

  const newCustomerLabel =
    item.customerKeyword.trim() || item.customerName.trim() || item.note.trim() || "new-customer";
  return `Create order by creating new customer - ${newCustomerLabel}`;
}

const scenarios: OrderTestScenario[] = data.testData.map((item, index) => {
  const serial = String(index + 1).padStart(3, "0");

  return {
    id: `OC-${serial}`,
    scenario: getScenarioTitle(item.customerFlow, item),
    type: "regular",
    testTag: `@oc${serial}`,
    ...item,
  };
});

test.describe("Order Creation Flow", () => {
  test.describe.configure({ mode: "parallel" });

  scenarios.forEach((scenario) => {
    test(`${scenario.id} [${scenario.id}] ${scenario.scenario} @order-create ${scenario.testTag} @${scenario.type} @${scenario.id}`, async ({
      page,
    }) => {
      const orderCreate = new OrderCreatePage(page);

      await orderCreate.createOrderByCustomerFlow(scenario);

      const orderUrl = orderCreate.getCurrentOrderUrl();
      await orderCreate.logOrderCreationSummary(scenario, orderUrl);
    });
  });
});
