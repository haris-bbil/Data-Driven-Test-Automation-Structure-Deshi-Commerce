import path from "path";
import { Page, Locator, expect } from "@playwright/test";
import { ProductCreateData, ProductCreateScenario } from "../utils/types/product-create.types";
import { withRandomSuffix } from "../utils/random-value";

export class ProductCreatePage {
  readonly page: Page;
  readonly ui: ProductCreateData["ui"];

  // Login
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly continueButton: Locator;
  readonly loginButton: Locator;

  // Navigation
  readonly productsLink: Locator;
  readonly addProductButton: Locator;

  // Product form
  readonly titleInput: Locator;
  readonly subTitleInput: Locator;
  readonly categoryDropdown: Locator;
  readonly videoUrlInput: Locator;
  readonly priceInput: Locator;
  readonly skuInput: Locator;
  readonly availableInput: Locator;
  readonly productWeightInput: Locator;
  readonly saveButton: Locator;

  readonly successMessage: Locator;

  constructor(page: Page, data: ProductCreateData) {
    this.page = page;
    this.ui = data.ui;

    // Login
    this.emailInput = page.getByRole("textbox", { name: this.ui.emailLabel });
    this.passwordInput = page.getByRole("textbox", { name: this.ui.passwordLabel });
    this.continueButton = page.getByRole("button", { name: this.ui.continueButton });
    this.loginButton = page.getByRole("button", { name: this.ui.loginButton });

    // Navigation
    this.productsLink = page.getByRole("link", { name: this.ui.productsLink });
    this.addProductButton = page.locator(`i:has-text("add")`);

    // Product form
    this.titleInput = page.getByRole("textbox", { name: this.ui.titleLabel });
    this.subTitleInput = page.getByRole("textbox", { name: this.ui.subTitleLabel });

    // Your current selector is fragile; keep it for now but isolate it here.
    this.categoryDropdown = page.getByRole("textbox").nth(2);

    this.videoUrlInput = page.getByRole("textbox", { name: this.ui.videoUrlLabel });
    this.priceInput = page.getByRole("spinbutton", { name: this.ui.priceLabel, exact: true });
    this.skuInput = page.getByRole("textbox", { name: this.ui.skuLabel });
    this.availableInput = page.getByRole("spinbutton", { name: this.ui.availableLabel });
    this.productWeightInput = page.getByRole("spinbutton", { name: this.ui.productWeightLabel });

    this.saveButton = page.getByRole("button", { name: this.ui.saveButton });

    this.successMessage = page.getByText("Product created", { exact: true });
  }

  async navigateToDashboard() {
    await this.page.goto(this.ui.dashboardUrl);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.continueButton.click();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async navigateToAddProduct() {
    await this.productsLink.click();
    await this.page.waitForLoadState("networkidle");
    await this.addProductButton.click();
  }

  async fillBasicInfo(scenario: ProductCreateScenario) {
    const uniqueTitle = withRandomSuffix(scenario.title, " ");
    const uniqueSubTitle = withRandomSuffix(scenario.subTitle, " ");

    await this.titleInput.fill(uniqueTitle);
    await this.subTitleInput.fill(uniqueSubTitle);

    await this.categoryDropdown.click();
    await this.page.getByText(scenario.category, { exact: true }).click();
  }

  async uploadImage(imagePathFromJson: string) {
    // JSON: "product_image/mash_hammer.jpg"
    // Resolve to absolute path so Playwright always finds it.
    const abs = path.resolve(process.cwd(), imagePathFromJson);
    await this.page.locator('input[type="file"]').setInputFiles(abs);
  }

  async fillVideoUrl(videoUrl: string) {
    if (!videoUrl) return;
    await this.videoUrlInput.fill(videoUrl);
  }

  async fillPricingAndInventory(scenario: ProductCreateScenario) {
    await this.priceInput.fill(scenario.price);
    await this.skuInput.fill(scenario.sku);
    await this.availableInput.fill(scenario.available);
    await this.productWeightInput.fill(scenario.weight);
  }

  async saveProduct() {
    await this.saveButton.click();
  }

  async assertCreated() {
    await expect(this.successMessage).toBeVisible({ timeout: 10000 });
  }

  async createProduct(scenario: ProductCreateScenario) {
    await this.navigateToDashboard();
    await this.login(scenario.email, scenario.password);
    await this.navigateToAddProduct();
    await this.fillBasicInfo(scenario);

    if (scenario.imagePath) {
      await this.uploadImage(scenario.imagePath);
    }

    await this.fillVideoUrl(scenario.videoUrl);
    await this.fillPricingAndInventory(scenario);
    await this.saveProduct();
    await this.assertCreated();
  }
}