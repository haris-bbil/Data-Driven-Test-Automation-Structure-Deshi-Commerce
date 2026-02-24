import type { Page } from '@playwright/test';
/**
Generate random integer in the range [min, max] (inclusive).
  Minimum value (default: 1)
  Maximum value (default: 99999)
  getRandomNumber() // e.g. 48291
  getRandomNumber(1, 100) // e.g. 42
  
 **/
export function getRandomNumber(min = 1, max = 99_999): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Generate random numeric suffix, for unique dynamic input.
export function withRandomSuffix(prefix: string, separator = ' '): string {
  return `${prefix}${separator}${getRandomNumber()}`; //withRandomSuffix("haris-store", "-") // "haris-store-48291"
}

/**
 * Waits for the specified number of milliseconds.
 * Use sparingly – prefer Playwright's built-in waits when possible.
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Waits for the page to reach a load state.
 * @param page - Playwright page
 * @param state - 'load' | 'domcontentloaded' | 'networkidle'
 */
export async function waitForLoadState(
  page: Page,
  state: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'
): Promise<void> {
  await page.waitForLoadState(state);
}

/**
 * Waits for an element matching the selector to be visible.
 * @param page - Playwright page
 * @param selector - CSS selector or getBy* locator string
 * @param timeout - Max wait time in ms (default: 10000)
 */
export async function waitForSelector(
  page: Page,
  selector: string,
  timeout = 10000
): Promise<void> {
  await page.locator(selector).first().waitFor({ state: 'visible', timeout });
}

/**
 * Waits for an element matching the selector to be hidden or removed.
 */
export async function waitForSelectorHidden(
  page: Page,
  selector: string,
  timeout = 10000
): Promise<void> {
  await page.locator(selector).first().waitFor({ state: 'hidden', timeout });
}

/**
 * Waits for the page URL to match the given string, regex, or predicate.
 */
export async function waitForURL(
  page: Page,
  url: string | RegExp | ((url: URL) => boolean),
  timeout = 10000
): Promise<void> {
  await page.waitForURL(url, { timeout });
}

/**
 * Waits for a network response matching the URL or predicate.
 * Useful when waiting for API calls to complete.
 */
export async function waitForResponse(
  page: Page,
  urlOrPredicate: string | RegExp | ((response: { url: () => string }) => boolean),
  timeout = 10000
): Promise<unknown> {
  return page.waitForResponse(urlOrPredicate, { timeout });
}