/*import { test } from "@playwright/test";
import { dc030 } from "../features/ticket/dc-030.core";
import { dc031 } from "../features/ticket/dc-031.core";
import { dc033 } from "../features/ticket/dc-033.core";

import { Dc030Scenario } from "../utils/types/dc-030.types";
import { Dc031Scenario } from "../utils/types/dc-031.types";
import { Dc033Scenario } from "../utils/types/dc-033.types";
import { dc034 } from "../features/ticket/dc-034.core";
import { loadScenarios } from "../utils/scenario-loader";

const dc030Scenarios = loadScenarios<Dc030Scenario>([
  "auth/dc030.regular.json",
  "auth/dc030.edge.json",
]);

const dc031Scenarios = loadScenarios<Dc031Scenario>([
  "auth/dc031.regular.json",
  "auth/dc031.edge.json",
]);

const dc033Scenarios = loadScenarios<Dc033Scenario>([
  "auth/dc033.regular.json",
  "auth/dc033.edge.json",
]);

test.describe("DC-030 Phone Login Validation (JSON Controlled)", () => {
  dc030Scenarios.forEach((scenario) => {
    test(`DC-030 [${scenario.id}] ${scenario.scenario}`, async ({ page }) => {
      await dc030(page, scenario);
    });
  });
});

test.describe("DC-031 OTP Verification Flow (JSON Controlled)", () => {
  dc031Scenarios.forEach((scenario) => {
    test(`DC-031 [${scenario.id}] ${scenario.scenario}`, async ({ page }) => {
      await dc031(page, scenario);
    });
  });
});

test.describe("DC-033 Invalid OTP Validation (JSON Controlled)", () => {
  dc033Scenarios.forEach((scenario) => {
    test(`DC-033 [${scenario.id}] ${scenario.scenario}`, async ({ page }) => {
      await dc033(page, scenario);
    });
  });
});

test.describe("DC-034: Login with Email (Happy Path)", () => {
  test("DC-034: User can login and logout successfully", async ({ page }) => {
    await dc034(page);
  });
});
*/