export interface OrderCreateUI {
  dashboardUrl: string;
  emailLabel: string;
  passwordLabel: string;
  continueButton: string;
  loginButton: string;
  ordersLink: string;
  browseButton: string;
  allProductsText: string;
  addButton: string;
  noteLabel: string;
  saveOrderButton: string;
  customerTypePrompt: string;
  customerSelectLabel: string;
  createCustomerPrefix: string;
  fullNameLabel: string;
  phoneNumberRequiredLabel: string;
  customerEmailLabel: string;
  shippingAddressLabel: string;
  searchDistrictLabel: string;
  saveCustomerButton: string;
  phoneNumberLabel: string;
  customerSavedMessage: string;
}

export interface OrderCreateData {
  ui: OrderCreateUI;
  testData: OrderCreateScenario[];
}

export type OrderCustomerFlow = "existing" | "new";

interface OrderCreateScenarioBase {
  productSelectionCount: number;
  quantity: string;
  discount: string;
  shippingCharge: string;
  note: string;
  customerKeyword: string;
  existingCustomerName?: string;
  customerName: string;
  customerPhoneWithoutPrefix: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  district: string;
  upazila: string;
  email: string;
  password: string;
}

export interface ExistingCustomerOrderCreateScenario extends OrderCreateScenarioBase {
  customerFlow: "existing";
  customerKeyword: string;
  existingCustomerName: string;
}

export interface NewCustomerOrderCreateScenario extends OrderCreateScenarioBase {
  customerFlow: "new";
  customerKeyword: string;
  existingCustomerName?: string;
}

export type OrderCreateScenario =
  | ExistingCustomerOrderCreateScenario
  | NewCustomerOrderCreateScenario;
