import DataLoader from "../utils/data-loader";
import { TimeoutConfig } from "../utils/types/timeouts.types";

/**
 * Loads timeout configuration from data/timeouts.json
 * This is synchronous because DataLoader.load() is synchronous.
 */
const timeouts = DataLoader.load<TimeoutConfig[]>("timeouts.json");

/**
 * Validate configuration immediately at import time.
 */
if (!timeouts || !Array.isArray(timeouts) || timeouts.length === 0) {
  throw new Error("Timeouts config is empty or invalid. Check data/timeouts.json");
}

/**
 * Optional helper to get timeout by key
 */
export function getTimeout(key: string): number {
  const found = timeouts.find((t) => t.key === key);

  if (!found) {
    throw new Error(`Timeout key "${key}" not found in timeouts.json`);
  }

  return found.timeout;
}

export { timeouts };