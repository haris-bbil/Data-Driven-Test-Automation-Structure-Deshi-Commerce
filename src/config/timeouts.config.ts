import DataLoader from "../utils/data-loader";
import { TimeoutConfig } from "../utils/types/timeouts.types";

/**
 * Loads timeout configuration from data/timeouts.json
 * This is synchronous because DataLoader.load() is synchronous.
 */
const loadedTimeouts = DataLoader.load<TimeoutConfig[]>("timeouts.json");

/**
 * Validate configuration immediately at import time.
 */
if (!loadedTimeouts || !Array.isArray(loadedTimeouts) || loadedTimeouts.length === 0) {
  throw new Error("Timeouts config is empty or invalid. Check data/timeouts.json");
}

const timeouts: TimeoutConfig = loadedTimeouts[0];

/**
 * Optional helper to get timeout by key
 */
export function getTimeout(key: keyof TimeoutConfig): number {
  return timeouts[key];
}

export { timeouts };