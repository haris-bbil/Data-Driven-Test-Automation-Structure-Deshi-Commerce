export interface LoginUIData {
  popupTitle: string;
  phoneTab: string;
  phoneLabel: string;
  continueButton: string;
  otpLabel: string;
  resendOtpButton: string;
  snackbarRole: string;
}

export interface LoginEdgeData {
  mobileNumber: string;
  expectedError: string;
  shouldMatch: boolean;
}

export interface OtpEdgeData {
  phone: string;
}

export interface InvalidOtpData {
  otp: string;
  expectedError: string;
}

export interface LoginPageData {
  ui: LoginUIData;
  phoneValidation: LoginEdgeData[];
  otpEmpty: OtpEdgeData[];
  otpInvalid: InvalidOtpData[];
}
