export interface CategoryCreateUI {
  dashboardUrl: string;
  emailLabel: string;
  passwordLabel: string;
  continueButton: string;
  loginButton: string;
  productsLink: string;
  categoriesLink: string;
  addCategoryButton: string;
  titleLabel: string;
  descriptionLabel: string;
  pageTitleLabel: string;
  saveButton: string;
  successMessage: string;
  backupText: string;
  advancedButton: string;
  proceedLink: string;
}

export interface CategoryCreateData {
  ui: CategoryCreateUI;
  testData: CategoryCreateScenario[];
}

export interface CategoryCreateScenario {
  title: string;
  description?: string;
  pageTitle?: string;
  imagePath?: string;
  email: string;
  password: string;
}
