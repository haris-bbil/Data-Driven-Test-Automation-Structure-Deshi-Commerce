export interface EmailLoginUI {
  popupTitle: string;
  emailLabel: string;
  passwordLabel: string;
  continueButton: string;
  accountSettingsButton: string;
  logoutMenuItem: string;
}

export interface EmailLoginData {
  ui: EmailLoginUI;
}
