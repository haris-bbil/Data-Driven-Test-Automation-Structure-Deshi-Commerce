import { Locator, Page, test } from "@playwright/test";
import { DataLoader } from "../../../utils/data-loader";
import {
  ExistingCustomerOrderCreateScenario,
  NewCustomerOrderCreateScenario,
  OrderCreateData,
  OrderCreateScenario,
} from "../../../utils/types/order-create.types";
import { withRandomSuffix } from "../../../utils/random-value";
import { buildOrderCreationSummary } from "../../../utils/logSummary/orderCreateSummary";
import { faker } from "@faker-js/faker";

export class OrderCreatePage {
  readonly page: Page;
  readonly data: OrderCreateData;

  // Login
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly continueButton: Locator;
  readonly loginButton: Locator;

  // Navigation
  readonly ordersLink: Locator;
  readonly createOrderButton: Locator;

  // Product modal
  readonly browseButton: Locator;
  readonly allProductsText: Locator;
  readonly productCheckboxes: Locator;
  readonly addProductsButton: Locator;

  // Order form
  readonly quantityInput: Locator;
  readonly numberInputs: Locator;
  readonly noteInput: Locator;
  readonly saveOrderButton: Locator;

  // Customer
  readonly customerDropdown: Locator;
  readonly customerSelectInput: Locator;
  readonly fullNameInput: Locator;
  readonly requiredPhoneInput: Locator;
  readonly customerEmailInput: Locator;
  readonly shippingAddressInput: Locator;
  readonly districtSelector: Locator;
  readonly upazilaSelector: Locator;
  readonly saveCustomerButton: Locator;
  readonly phoneNumberInput: Locator;
  readonly customerSavedMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    const data = DataLoader.loadWithEnvCreds<OrderCreateData>(
      "merchantPanelData/orders/order_create_data.json",
      {
        emailEnvKey: "DASHBOARD_EMAIL",
        passwordEnvKey: "DASHBOARD_PASSWORD",
        scenarioPath: "testData",
        requireCreds: true,
      },
    );
    this.data = data;
    const ui = data.ui;

    // Login
    this.emailInput = page.getByRole("textbox", { name: ui.emailLabel });
    this.passwordInput = page.getByRole("textbox", { name: ui.passwordLabel });
    this.continueButton = page.getByRole("button", { name: ui.continueButton });
    this.loginButton = page.getByRole("button", { name: ui.loginButton });

    // Navigation
    this.ordersLink = page.getByRole("link", { name: ui.ordersLink });
    this.createOrderButton = page.locator(`i:has-text("add")`);

    // Product modal
    this.browseButton = page.getByRole("button", { name: ui.browseButton });
    this.allProductsText = page.getByText(ui.allProductsText, { exact: true });
    this.productCheckboxes = page.locator(
      ".md-table-cell > .md-table-cell-container > .md-checkbox > .md-checkbox-container",
    );
    this.addProductsButton = page.getByRole("button", { name: ui.addButton });

    // Order form
    this.quantityInput = page.locator("tbody tr").first().getByRole("spinbutton").first();
    this.numberInputs = page.locator('input[type="number"]');
    this.noteInput = page.getByRole("textbox", { name: ui.noteLabel });
    this.saveOrderButton = page.getByRole("button", { name: ui.saveOrderButton });

    // Customer
    this.customerDropdown = page.locator(".multiselect__select").first();
    this.customerSelectInput = page.getByRole("textbox", {
      name: ui.customerSelectLabel,
    });
    this.fullNameInput = page.getByRole("textbox", { name: ui.fullNameLabel });
    this.requiredPhoneInput = page.getByRole("textbox", {
      name: ui.phoneNumberRequiredLabel,
    });
    this.customerEmailInput = page.getByRole("textbox", {
      name: ui.customerEmailLabel,
    });
    this.shippingAddressInput = page.getByRole("textbox", {
      name: ui.shippingAddressLabel,
    });
    this.districtSelector = page.getByText(ui.searchDistrictLabel);
    this.upazilaSelector = page.locator(
      "div:nth-child(2) > .md-field > .multiselect > .multiselect__tags",
    );
    this.saveCustomerButton = page.getByRole("button", {
      name: ui.saveCustomerButton,
    });
    this.phoneNumberInput = page.getByRole("textbox", {
      name: ui.phoneNumberLabel,
    });
    this.customerSavedMessage = page.getByText(ui.customerSavedMessage, {
      exact: true,
    });
  }

  async navigateToDashboard() {
    await this.page.goto(this.data.ui.dashboardUrl);
  }

  async login(email: string, password: string) {
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.continueButton.click();

    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async navigateToCreateOrder() {
    await this.ordersLink.click();
    await this.page.waitForLoadState("networkidle");
    await this.createOrderButton.click();
  }

  async addProducts(productSelectionCount: number) {
    await this.browseButton.click();
    await this.allProductsText.click();

    if (productSelectionCount < 1) {
      throw new Error(
        `Invalid productSelectionCount: ${productSelectionCount}. It must be at least 1.`,
      );
    }

    const availableProductCount = await this.productCheckboxes.count();
    if (productSelectionCount > availableProductCount) {
      throw new Error(
        `Invalid productSelectionCount: requested ${productSelectionCount}, but only ${availableProductCount} product(s) are available.`,
      );
    }

    const count = productSelectionCount;
    for (let index = 0; index < count; index += 1) {
      await this.productCheckboxes.nth(index).click();
    }

    await this.addProductsButton.click();
  }

  async fillOrderInfo(scenario: OrderCreateScenario) {
    await this.quantityInput.click();
    await this.quantityInput.fill(scenario.quantity);

    const existingCustomerNameForNote =
      scenario.customerFlow === "existing" ? scenario.existingCustomerName.trim() : "";
    const noteValue = existingCustomerNameForNote
      ? `${scenario.note} - ${existingCustomerNameForNote}`
      : scenario.note;

    await this.noteInput.click();
    await this.noteInput.fill(noteValue);
    scenario.note = noteValue;

    // Recorded flow had additional numeric fields selected by dynamic IDs.
    // We keep them index-based so locators remain stable across runs.
    await this.numberInputs.nth(2).fill(scenario.discount);
    await this.numberInputs.nth(3).fill(scenario.shippingCharge);
  }

  async selectExistingCustomer(scenario: ExistingCustomerOrderCreateScenario) {
    const isSelected = await this.trySelectExistingCustomer(scenario);
    if (!isSelected) {
      throw new Error(`Existing customer not found: ${scenario.existingCustomerName}`);
    }
  }

  async trySelectExistingCustomer(
    scenario: ExistingCustomerOrderCreateScenario,
  ): Promise<boolean> {
    await this.customerDropdown.click();
    await this.page.getByText(this.data.ui.customerTypePrompt, { exact: true }).click();

    await this.customerSelectInput.click();
    await this.customerSelectInput.fill(scenario.customerKeyword);

    const customerOption = this.page.locator(`//li[@class='multiselect__element']`);
    try {
      await customerOption.first().waitFor({ state: "visible", timeout: 5000 });
    } catch {
      const optionCount = await customerOption.count();
      if (optionCount === 0) {
        throw new Error(`No customer options found for keyword: ${scenario.customerKeyword}`);
      }

      throw new Error(
        `Customer options did not become visible for keyword: ${scenario.customerKeyword}`,
      );
    }
    const expectedFullName = scenario.existingCustomerName.trim();
    const customerFirstName = expectedFullName.split(/\s+/)[0] ?? "";
    if (!customerFirstName) {
      throw new Error(`Missing expected first name for: ${scenario.existingCustomerName}`);
    }

    const expectedFullNameLower = expectedFullName.toLowerCase();
    const customerFirstNameLower = customerFirstName.toLowerCase();
    const optionCount = await customerOption.count();
    let fullNameMatchIndex = -1;
    let firstNameMatchIndex = -1;
    for (let index = 0; index < optionCount; index += 1) {
      const optionText = ((await customerOption.nth(index).textContent()) ?? "").toLowerCase();
      if (fullNameMatchIndex < 0 && optionText.includes(expectedFullNameLower)) {
        fullNameMatchIndex = index;
        continue;
      }

      if (firstNameMatchIndex < 0 && optionText.includes(customerFirstNameLower)) {
        firstNameMatchIndex = index;
      }
    }

    const matchIndex = fullNameMatchIndex >= 0 ? fullNameMatchIndex : firstNameMatchIndex;
    if (matchIndex < 0) {
      throw new Error(
        `Customer option does not contain expected first name for: ${scenario.existingCustomerName}`,
      );
    }

    await customerOption.nth(matchIndex).click();
    return true;
  }

  private applyFakerDataForNewFlow(scenario: NewCustomerOrderCreateScenario) {
    const fullName = faker.person.fullName();
    const keyword = `${fullName} ${faker.string.alphanumeric(4).toLowerCase()}`;
    const customerPhoneWithoutPrefix = `${faker.string.numeric(8)}`;

    scenario.customerKeyword = keyword;
    scenario.customerName = fullName;
    scenario.customerPhoneWithoutPrefix = customerPhoneWithoutPrefix;
    scenario.customerPhone = `016${customerPhoneWithoutPrefix}`;
    scenario.customerEmail = faker.internet.email().toLowerCase();
    scenario.shippingAddress = faker.location.streetAddress();
  }

  async createNewCustomer(scenario: NewCustomerOrderCreateScenario) {
    this.applyFakerDataForNewFlow(scenario);

    await this.customerDropdown.click();
    await this.page.getByText(this.data.ui.customerTypePrompt, { exact: true }).click();

    await this.customerSelectInput.click();
    await this.customerSelectInput.fill(scenario.customerKeyword);
    await this.page
      .getByText(`${this.data.ui.createCustomerPrefix} ${scenario.customerKeyword}`, {
        exact: true,
      })
      .click();

    const uniqueCustomerName = withRandomSuffix(scenario.customerName, " ");
    scenario.customerName = uniqueCustomerName;

    await this.fullNameInput.click();
    await this.fullNameInput.fill(uniqueCustomerName);

    await this.requiredPhoneInput.click();
    await this.requiredPhoneInput.fill(scenario.customerPhoneWithoutPrefix);

    await this.customerEmailInput.click();
    await this.customerEmailInput.fill(scenario.customerEmail);

    await this.shippingAddressInput.click();
    await this.shippingAddressInput.fill(scenario.shippingAddress);

    await this.districtSelector.click();
    await this.page.locator("span").filter({ hasText: scenario.district }).first().click();

    await this.upazilaSelector.click();
    await this.page.locator("span").filter({ hasText: scenario.upazila }).first().click();

    await this.saveCustomerButton.click();

    await this.phoneNumberInput.click();
    await this.phoneNumberInput.fill(scenario.customerPhone);
    await this.saveCustomerButton.click();
    await this.customerSavedMessage.waitFor({ state: "visible" });
  }

  async saveOrder() {
    await this.saveOrderButton.click();
    await this.verifyOrderCreationSuccess();
  }

  async verifyOrderCreationSuccess() {
    await this.page.waitForLoadState("networkidle");
    try {
      await this.saveOrderButton.waitFor({ state: "hidden", timeout: 15000 });
    } catch {
      throw new Error(
        'Order creation did not complete successfully: "Save order" is still visible after submit.',
      );
    }
  }

  async createOrderByCustomerFlow(scenario: OrderCreateScenario) {
    await this.navigateToDashboard();
    await this.login(scenario.email, scenario.password);
    await this.navigateToCreateOrder();
    await this.addProducts(scenario.productSelectionCount);
    await this.fillOrderInfo(scenario);

    if (scenario.customerFlow === "existing") {
      await this.selectExistingCustomer(scenario);
    } else if (scenario.customerFlow === "new") {
      await this.createNewCustomer(scenario);
    } else {
      const runtimeFlow = (scenario as { customerFlow?: unknown }).customerFlow;
      throw new Error(`Unsupported customerFlow: ${String(runtimeFlow)}`);
    }

    await this.saveOrder();
  }

  getCurrentOrderUrl(): string {
    return this.page.url();
  }

  async logOrderCreationSummary(scenario: OrderCreateScenario, orderUrl: string) {
    const summary = buildOrderCreationSummary(scenario, orderUrl);

    console.log("\n===== Created Order Data =====");
    console.log(summary);
    console.log("==============================\n");

    await test.info().attach("Created Order Data", {
      body: summary,
      contentType: "text/plain",
    });
  }

  async createOrderWithExistingCustomer(scenario: ExistingCustomerOrderCreateScenario) {
    await this.createOrderByCustomerFlow(scenario);
  }

  async createOrderWithNewCustomer(scenario: NewCustomerOrderCreateScenario) {
    await this.createOrderByCustomerFlow(scenario);
  }
}
