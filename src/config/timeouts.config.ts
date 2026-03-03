import { DataLoader } from "../utils/data-loader";
import { TimeoutConfig } from "../utils/types/timeouts.types";

const [timeouts] = DataLoader.load<TimeoutConfig[]>("timeouts.json");

if (!timeouts) {
  throw new Error("Timeouts config is empty");
}

export { timeouts };
