import DataLoader from "./data-loader";
import { resolveScenarioType, ScenarioType } from "./types/scenario-types";

type ScenarioFile<T> = {
  cases: T[];
};

export type ScenarioWithType<T> = T & {
  type: ScenarioType;
};

export function loadScenarios<T>(paths: string[]): ScenarioWithType<T>[] {
  return paths.flatMap((path) => {
    const data = DataLoader.load<ScenarioFile<T>>(path);
    const type = resolveScenarioType(path);

    return data.cases.map((scenario) => ({
      ...scenario,
      type,
    }));
  });
}
