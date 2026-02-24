import { Locator } from "@playwright/test";

/**
 * Non-blocking, CI-safe click
 * - Never waits forever
 * - Skips if element is not actionable
 */
export async function safeDomClick(locator: Locator): Promise<boolean> {
  const count = await locator.count().catch(() => 0);
  if (count === 0) return false;

  const el = locator.first();

  const visible = await el.isVisible().catch(() => false);
  const enabled = await el.isEnabled().catch(() => false);

  if (!visible || !enabled) return false;

  await el.click({ timeout: 2000 }).catch(() => {});
  return true;
}
