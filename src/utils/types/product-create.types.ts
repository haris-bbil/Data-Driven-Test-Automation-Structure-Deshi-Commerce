export interface ProductCreateUI {
  dashboardUrl: string;
  emailLabel: string;
  passwordLabel: string;
  continueButton: string;
  loginButton: string;
  productsLink: string;
  addProductButton: string;
  titleLabel: string;
  subTitleLabel: string;
  videoUrlLabel: string;
  priceLabel: string;
  skuLabel: string;
  availableLabel: string;
  productWeightLabel: string;
  saveButton: string;
  viewText: string;
  advancedButton: string;
  proceedLink: string;
}

export interface ProductCreateData {
  ui: ProductCreateUI;
  testData: ProductCreateScenario[];
}

export interface ProductCreateScenario {
  title: string;
  subTitle: string;
  category: string;
  imagePath?: string;
  videoUrl: string;
  price: string;
  sku: string;
  available: string;
  weight: string;
  email: string;
  password: string;
}
