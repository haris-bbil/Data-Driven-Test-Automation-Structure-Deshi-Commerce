# Deshi Commerce — Data-Driven Test Automation Framework

A robust, scalable, and maintainable end-to-end test automation framework built with **Playwright** and **TypeScript** for the **Deshi Commerce** e-commerce platform. It follows industry best practices including the **Page Object Model (POM)** pattern and a **Data-Driven Testing (DDT)** approach where all test inputs, UI selectors, and expected outcomes are externalized into JSON files.
---
## Key Features
- **Data-Driven**: Test data, UI labels, and selectors are stored in JSON files under `data/` — change inputs without touching test code.
- **Page Object Model**: Each page/screen has a dedicated class in `src/pages/` encapsulating locators and actions.
- **Typed Everything**: TypeScript interfaces in `src/utils/types/` enforce the shape of every JSON data file.
- **Environment Variable Overrides**: Credentials can be supplied via `.env` so secrets never live in version control.
- **Configurable Timeouts**: All timeout values (test, expect, action, navigation) are loaded from `data/timeouts.json`.
- **Cross-Browser Support**: Preconfigured projects for Chromium, Firefox, and WebKit with parallel execution.
- **Random Suffixes**: Product titles and subtitles are auto-suffixed with random numbers to avoid duplicate-name collisions.
- **Caching DataLoader**: JSON files are read once and cached in memory for fast repeated access.
---
## Table of Contents
- [Key Features](#key-features) - [Tech Stack](#tech-stack) - [Project Structure](#project-structure) - [Prerequisites](#prerequisites) - [Installation](#installation) 
- [Environment Setup](#environment-setup) - [Running Tests](#running-tests) - [Configuration](#configuration) - [Data-Driven Testing](#data-driven-testing) 
- [Page Object Model](#page-object-model) - [Utility Modules](#utility-modules) - [Adding a New Test](#adding-a-new-test)
---


## Tech Stack

| Tool | Purpose |
| --- | --- |
| [Playwright](https://playwright.dev/) `^1.58.0` | Browser automation & test runner |
| [TypeScript](https://www.typescriptlang.org/) `^5.9.3` | Static typing |
| [dotenv](https://github.com/motdotla/dotenv) `^17.2.3` | Load `.env` variables |
| [npm-run-all](https://github.com/mysticatea/npm-run-all) `^4.1.5` | Run multiple npm scripts in parallel |

---

## Project Structure

```
├── data/                          # All test data (JSON)
│   ├── category/
│   │   └── category.json
│   ├── product/
│   │   └── product_create_data.json
│   ├── search/
│   │   ├── dc013.regular.json    # Regular (happy-path) scenarios
│   │   ├── dc013.edge.json       # Edge-case scenarios
│   │   └── ...
│   ├── sidebar/
│   │   └── sidebar_page_data.json
│   └── timeouts.json              # Global timeout configuration
│
├── product_image/                 # Static assets used by tests
│   ├── Pliers.jpg
│   ├── drill.png
│   └── ...
│
├── src/
│   ├── config/                    # Runtime configuration modules
│   │   ├── browser.config.ts      # Viewport & locale
│   │   ├── execution.config.ts    # Headless toggle
│   │   ├── section.filter.config.ts
│   │   ├── timeouts.config.ts     # Loads data/timeouts.json
│   │   └── urls.config.ts         # URL constants
│   │
│   ├── pages/                     # Page Object classes
│   │   ├── productCreate.page.ts  # Product creation page actions & locators
│   │   └── categoryCreate.ts      # Category creation (draft/reference)
│   │
│   ├── tests/                     # Playwright test specs
│   │   ├── productCreate.spec.ts  # Product creation E2E test
│   │   └── user.spec.ts           # User auth flow tests (commented out)
│   │
│   └── utils/                     # Shared utilities
│       ├── types/                 # TypeScript interfaces for JSON data
│       │   ├── product-create.types.ts
│       │   ├── timeouts.types.ts
│       │   ├── scenario-types.ts
│       │   └── ...
│       ├── data-loader.ts         # Generic JSON loader with caching & env override
│       ├── dropdown-helper.ts     # MUI dropdown interaction helper
│       ├── category-helper.ts     # Category name normalization
│       └── random-value.ts        # Random numbers, suffixes, and wait helpers
│
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json
├── package.json
└── .env                           # (create locally — not committed)
```

---

## Prerequisites

- **Node.js** >= 18
- **npm** (comes with Node.js)

---

## Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd Data-Driven-Test-Automation-Structure-Deshi-Commerce

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install
```

---

## Environment Setup

Create a `.env` file in the project root with the following variables:

```env
# Base URL of the application under test
BASE_URL=https://haris-dashboard.bbil.org

# Dashboard login credentials (overrides empty values in JSON data files)
DASHBOARD_EMAIL=your-email@example.com
DASHBOARD_PASSWORD=your-password
```

> **Note:** If credentials are already present in the JSON data files, the `.env` values will take precedence. If both are empty and `requireCreds` is `true`, the framework will throw a clear error at runtime.

---

## Running Tests

| Command | Description |
| --- | --- |
| `npm test` | Run all tests (default browser) |
| `npm run test:chromium` | Run on Chromium with 9 workers |
| `npm run test:firefox` | Run on Firefox with 9 workers |
| `npm run test:webkit` | Run on WebKit with 9 workers |
| `npm run test:all-parallel` | Run all three browsers in parallel |
| `npm run test:chromium:headed` | Chromium in headed (visible) mode |
| `npm run test:firefox:headed` | Firefox in headed mode |
| `npm run test:webkit:headed` | WebKit in headed mode |
| `npm run test:all-parallel:headed` | All browsers in parallel, headed |

After a test run, open the HTML report:

```bash
npx playwright show-report
```

---

## Configuration

### Timeouts (`data/timeouts.json`)

All timeout values are centralized and loaded at startup:

```json
[
  {
    "testTimeout": 7200000,
    "expectTimeout": 15000,
    "actionTimeout": 30000,
    "navigationTimeout": 60000
  }
]
```

| Key | Default | Description |
| --- | --- | --- |
| `testTimeout` | 7 200 000 ms (2 h) | Maximum time per test |
| `expectTimeout` | 15 000 ms | Timeout for `expect` assertions |
| `actionTimeout` | 30 000 ms | Timeout for individual actions (click, fill, etc.) |
| `navigationTimeout` | 60 000 ms | Timeout for page navigations |

### Browser (`src/config/browser.config.ts`)

```ts
viewport: { width: 1440, height: 900 }
locale: "en-US"
```

### Execution (`src/config/execution.config.ts`)

```ts
headless: true   // Set to false for visual debugging
```

---

## Data-Driven Testing

The core idea: **test logic lives in code, test data lives in JSON**.

### How It Works

1. JSON files under `data/` contain two sections:
   - **`ui`** — UI labels and selectors used to locate elements (e.g., button text, input labels).
   - **`testData`** — The actual input values for the test scenario (e.g., product title, price, credentials).

2. `DataLoader.load<T>(relativePath)` reads and parses the JSON, caches it, and optionally overrides credentials from `.env`.

3. Test specs import the data and pass it to Page Object classes.

### Example — Product Create Data (`data/product/product_create_data.json`)

```json
{
  "ui": {
    "dashboardUrl": "https://haris-dashboard.bbil.org/login",
    "emailLabel": "Enter your email address",
    "saveButton": "Save"
  },
  "testData": {
    "title": "Item",
    "category": "backup",
    "price": "1000",
    "email": "",
    "password": ""
  }
}
```

> Empty `email`/`password` fields are automatically filled from `DASHBOARD_EMAIL` and `DASHBOARD_PASSWORD` environment variables.

### Scenario File Naming Convention

Data files follow the pattern `<ticket-id>.<type>.json`:
- `dc013.regular.json` — happy-path / regular scenarios
- `dc013.edge.json` — edge-case scenarios

The `resolveScenarioType()` utility automatically classifies a file as `"regular"` or `"edge"` based on its filename.

---

## Page Object Model

Each page is represented by a class in `src/pages/` that:

1. **Receives data in the constructor** — locators are built from `ui` labels in the JSON, not hard-coded strings.
2. **Exposes action methods** — `login()`, `fillBasicInfo()`, `saveProduct()`, etc.
3. **Contains assertions** — `assertCreated()` checks for a success message.

### Example — `ProductCreatePage`

```ts
const data = DataLoader.load<ProductCreateData>("product/product_create_data.json", {
  scenarioPath: "testData",
  requireCreds: true,
});

const productCreate = new ProductCreatePage(page, data);
await productCreate.createProduct(data.testData);
```

The `createProduct()` method orchestrates the full flow: navigate → login → fill form → upload image → save → assert success.

---

## Utility Modules

| Module | Purpose |
| --- | --- |
| `data-loader.ts` | Load & cache JSON from `data/`, with `.env` credential override support |
| `random-value.ts` | `getRandomNumber()`, `withRandomSuffix()`, and various Playwright wait helpers |
| `dropdown-helper.ts` | Select a value from a MUI autocomplete dropdown |
| `category-helper.ts` | Normalize category names (trim + lowercase) |

---

## Adding a New Test

1. **Create a JSON data file** in `data/<feature>/` with `ui` and `testData` sections.
2. **Define TypeScript interfaces** in `src/utils/types/` matching the JSON shape.
3. **Create a Page Object** in `src/pages/` that accepts the data and exposes action methods.
4. **Write a spec file** in `src/tests/` that loads data via `DataLoader.load<T>()` and calls the page object.

```
data/order/order_create_data.json      ← test data
src/utils/types/order-create.types.ts  ← interfaces
src/pages/orderCreate.page.ts          ← page object
src/tests/orderCreate.spec.ts          ← test spec
```

---
