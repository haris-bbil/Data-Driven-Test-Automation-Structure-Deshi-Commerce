import { Page, expect, Locator } from "@playwright/test";
import { DataLoader } from "../utils/data-loader";
import { LoginPageData } from "../utils/types/login.types";

export class LoginPage {
  readonly page: Page;
  readonly data: LoginPageData;

  readonly popupRoot: Locator;
  readonly tabToPhoneLogin: Locator;
  readonly phoneInput: Locator;
  readonly continueButton: Locator;
  readonly errorText: Locator;
  readonly otpInput: Locator;
  readonly otpErrorText: Locator;
  readonly resendOtpButton: Locator;

  constructor(page: Page) {
    this.page = page;

    const data = DataLoader.load<LoginPageData>("auth/login_page_data.json");
    this.data = data;

    // Popup root
    this.popupRoot = page
      .getByRole("heading", { name: data.ui.popupTitle })
      .locator("..");

    this.tabToPhoneLogin = this.popupRoot.getByRole("tab", {
      name: data.ui.phoneTab,
    });

    this.phoneInput = this.popupRoot.getByRole("textbox", {
      name: data.ui.phoneLabel,
    });

    this.continueButton = this.popupRoot.getByRole("button", {
      name: data.ui.continueButton,
    });

    this.errorText = this.popupRoot.locator(
      ".MuiFormHelperText-root.Mui-error",
    );

    this.otpInput = this.popupRoot.getByRole("spinbutton", {
      name: data.ui.otpLabel,
    });

    this.otpErrorText = this.popupRoot.locator(
      ".MuiFormHelperText-root.Mui-error",
    );

    this.resendOtpButton = this.popupRoot.getByRole("button", {
      name: data.ui.resendOtpButton,
    });
  }

  async verifyLoginPopupVisible() {
    await expect(this.popupRoot).toBeVisible();
  }

  async switchToPhoneLoginTab() {
    await this.tabToPhoneLogin.click();
  }

  async verifyPhoneInputVisible() {
    await expect(this.phoneInput).toBeVisible();
  }

  async verifyContinueButtonVisible() {
    await expect(this.continueButton).toBeVisible();
  }

  async enterPhoneNumber(phone: string) {
    await this.phoneInput.fill(phone);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async verifyPhoneValidationError(expected: string) {
    await expect(this.errorText).toBeVisible();
    await expect(this.errorText).toHaveText(expected);
  }

  async verifyPhoneInputInErrorState() {
    await expect(this.phoneInput).toHaveAttribute("aria-invalid", "true");
  }

  async verifyErrorMessageDoesNotMatch(unexpected: string) {
    await expect(this.errorText).toBeVisible();
    await expect(this.errorText).not.toHaveText(unexpected);
  }

  async verifyOtpFieldVisible() {
    await expect(this.otpInput).toBeVisible();
  }

  async verifyOtpFieldFocused() {
    await expect(this.otpInput).toBeFocused();
  }

  async verifyOtpIsNumericOnly() {
    await expect(this.otpInput).toHaveAttribute("type", "number");
  }

  async enterOtp(otp: string) {
    await this.otpInput.fill(otp);
  }

  async verifyResendOtpVisible() {
    await expect(this.resendOtpButton).toBeVisible();
  }

  async verifyOtpErrorAlertVisible(expectedText: string) {
    const alert = this.page.locator(
      `.MuiSnackbarContent-root[role='${this.data.ui.snackbarRole}']`,
    );

    await expect(alert).toBeVisible();
    await expect(alert).toContainText(expectedText);
  }
}
