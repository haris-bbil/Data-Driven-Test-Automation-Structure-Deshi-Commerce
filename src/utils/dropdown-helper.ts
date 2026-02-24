import { Page, Locator, expect } from "@playwright/test";

export async function selectFromMuiDropdown(
  page: Page,
  dropdown: Locator,
  searchBox: Locator,
  value: string,
) {
  await expect(dropdown).toBeVisible();
  await dropdown.click();

  await expect(searchBox).toBeVisible();
  await searchBox.fill(value);

  await page.getByText(value, { exact: true }).click();
}
