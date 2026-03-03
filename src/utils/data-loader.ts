import fs from "fs";
import path from "path";

type EnvOverrideOptions = {
  /** Dot-path in the loaded JSON where the scenario object lives. Default: "testData" */
  scenarioPath?: string;
  /** Environment variable names for email/password. Defaults shown below */
  emailEnvKey?: string;
  passwordEnvKey?: string;
  /** If true, throws when env vars are missing. Default: true */
  requireCreds?: boolean;
};

export class DataLoader {
  static load<T>(relativePath: string): T {
    const fullPath = path.resolve(process.cwd(), "data", relativePath);
    return JSON.parse(fs.readFileSync(fullPath, "utf-8")) as T;
  }

  /**
   * Loads JSON from /data and overrides scenario email/password from environment variables.
   * Keeps everything else in JSON.
   */
  static loadWithEnvCreds<T extends Record<string, any>>(
    relativePath: string,
    options: EnvOverrideOptions = {},
  ): T {
    const {
      scenarioPath = "testData",
      emailEnvKey = "DASHBOARD_EMAIL",
      passwordEnvKey = "DASHBOARD_PASSWORD",
      requireCreds = true,
    } = options;

    const data = this.load<T>(relativePath);

    const email = process.env[emailEnvKey];
    const password = process.env[passwordEnvKey];

    if (requireCreds && (!email || !password)) {
      const missing: string[] = [];
      if (!email) missing.push(emailEnvKey);
      if (!password) missing.push(passwordEnvKey);
      throw new Error(
        `Missing required environment variable(s): ${missing.join(
          ", ",
        )}. Add them to your .env file.`,
      );
    }

    // Override scenario creds for both object and array shapes.
    const scenario = DataLoader.getByPath(data, scenarioPath);
    if (!Array.isArray(scenario) && (!scenario || typeof scenario !== "object")) {
      const resolvedType = scenario === null ? "null" : typeof scenario;
      throw new Error(
        `Invalid scenarioPath "${scenarioPath}" in data/${relativePath}. Expected object or array, got ${resolvedType}.`,
      );
    }

    if (Array.isArray(scenario)) {
      for (const entry of scenario) {
        if (entry && typeof entry === "object") {
          if (email) entry.email = email;
          if (password) entry.password = password;
        }
      }
    } else if (scenario && typeof scenario === "object") {
      if (email) scenario.email = email;
      if (password) scenario.password = password;
    }

    return data;
  }

  private static getByPath(obj: any, dotPath: string): any {
    return dotPath.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  }
}