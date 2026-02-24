export type ScenarioType = "regular" | "edge";

export function resolveScenarioType(path: string): ScenarioType {
  if (path.includes(".edge.")) return "edge";
  if (path.includes(".regular.")) return "regular";

  throw new Error(`Cannot resolve scenario type from path: ${path}`);
}
