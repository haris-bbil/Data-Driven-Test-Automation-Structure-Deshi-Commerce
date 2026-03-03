import { Page, expect, Locator } from "@playwright/test";
import { DataLoader } from "../utils/data-loader";
import { EmailLoginData } from "../utils/types/email-login.types";

export class LoginWithEmailPage {
  readonly page: Page;
  readonly data: EmailLoginData;

  readonly popupRoot: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly continueButton: Locator;
  readonly accountSettingsButton: Locator;
  readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;

    const data = DataLoader.load<EmailLoginData>("auth/email_login_data.json");
    this.data = data;

    const ui = data.ui;

    // Popup root
    this.popupRoot = page
      .getByRole("heading", { name: ui.popupTitle })
      .locator("..");

    this.emailInput = this.popupRoot.getByRole("textbox", {
      name: ui.emailLabel,
    });

    this.passwordInput = this.popupRoot.getByRole("textbox", {
      name: ui.passwordLabel,
    });

    this.continueButton = this.popupRoot.getByRole("button", {
      name: ui.continueButton,
    });

    this.accountSettingsButton = page.getByRole("button", {
      name: ui.accountSettingsButton,
    });

    this.logoutMenuItem = page.getByRole("menuitem", {
      name: ui.logoutMenuItem,
    });
  }

  async verifyPopupVisible() {
    await expect(this.popupRoot).toBeVisible();
  }

  async enterEmail(email: string) {
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
  }

  async clickContinue() {
    await expect(this.continueButton).toBeVisible();
    await this.continueButton.click();
  }

  async verifyEmailIsDisabled() {
    await expect(this.emailInput).toBeDisabled();
  }

  async enterPassword(password: string) {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
  }

  async verifyLoginSuccess() {
    await expect(this.popupRoot).not.toBeVisible();
  }

  async logout() {
    await expect(this.accountSettingsButton).toBeVisible();
    await this.accountSettingsButton.click();

    await expect(this.logoutMenuItem).toBeVisible();
    await this.logoutMenuItem.click();
  }
}
