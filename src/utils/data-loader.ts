import fs from "fs";
import path from "path";

/**
 * Options for overriding scenario credentials with environment variables.
 */
type EnvOverrideOptions = {
  /** Path (dot notation) inside JSON where scenario lives. Default: "testData" */
  scenarioPath?: string;

  /** Environment variable key for email. Default: "DASHBOARD_EMAIL" */
  emailEnvKey?: string;

  /** Environment variable key for password. Default: "DASHBOARD_PASSWORD" */
  passwordEnvKey?: string;

  requireCreds?: boolean;
};

function getByDotPath(obj: any, dotPath: string): any {
  return dotPath.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function setByDotPath(obj: any, dotPath: string, value: any): void {
  const keys = dotPath.split(".");
  const last = keys.pop()!;
  const target = keys.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, obj);
  target[last] = value;
}

export default class DataLoader {
  private static cache = new Map<string, any>();

  /**
   * Load JSON from /data folder (relative path).
   * Example: DataLoader.load<ProductCreateData>("product/product_create_data.json")
   */
  static load<T>(relativePath: string, options?: EnvOverrideOptions): T {
    const fullPath = path.resolve(process.cwd(), "data", relativePath);

    if (!fs.existsSync(fullPath)) {
      // Helpful error: show what exists under /data
      const dataDir = path.resolve(process.cwd(), "data");
      let available = "";
      try {
        available = fs
          .readdirSync(dataDir, { withFileTypes: true })
          .map((d) => (d.isDirectory() ? `${d.name}/` : d.name))
          .join(", ");
      } catch {
        available = "(could not read /data directory)";
      }

      throw new Error(
        `DataLoader Error: File not found: ${fullPath}\n` +
          `Tip: Pass a path relative to /data, e.g. "product/product_create_data.json"\n` +
          `Available in /data: ${available}`
      );
    }

    // cache
    if (this.cache.has(fullPath)) {
      const cached = structuredClone(this.cache.get(fullPath));
      return this.applyEnvOverrides<T>(cached, options);
    }

    const raw = fs.readFileSync(fullPath, "utf-8");
    let parsed: any;

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new Error(`DataLoader Error: Invalid JSON in ${fullPath}`);
    }

    this.cache.set(fullPath, parsed);
    const cloned = structuredClone(parsed);
    return this.applyEnvOverrides<T>(cloned, options);
  }

  /**
   * Backward-compatible callable style (so your old usage still works):
   * const data = DataLoaderFn<ProductCreateData>("product/product_create_data.json");
   */
  static fn<T>(relativePath: string, options?: EnvOverrideOptions): T {
    return DataLoader.load<T>(relativePath, options);
  }

  private static applyEnvOverrides<T>(data: any, options?: EnvOverrideOptions): T {
    const scenarioPath = options?.scenarioPath ?? "testData";
    const emailEnvKey = options?.emailEnvKey ?? "DASHBOARD_EMAIL";
    const passwordEnvKey = options?.passwordEnvKey ?? "DASHBOARD_PASSWORD";
    const requireCreds = options?.requireCreds ?? true;

    const scenario = getByDotPath(data, scenarioPath);

    // If file doesn't have scenarioPath, just return as-is
    if (!scenario || typeof scenario !== "object") return data as T;

    const envEmail = process.env[emailEnvKey];
    const envPassword = process.env[passwordEnvKey];

    const hasJsonEmail = typeof scenario.email === "string" && scenario.email.trim().length > 0;
    const hasJsonPassword =
      typeof scenario.password === "string" && scenario.password.trim().length > 0;

    // Override ONLY if env values exist
    if (envEmail) scenario.email = envEmail;
    if (envPassword) scenario.password = envPassword;

    const finalHasEmail =
      typeof scenario.email === "string" && scenario.email.trim().length > 0;
    const finalHasPassword =
      typeof scenario.password === "string" && scenario.password.trim().length > 0;

    // If JSON has empty creds and env missing -> error (default)
    if (requireCreds && !finalHasEmail && !hasJsonEmail) {
      throw new Error(
        `DataLoader Error: Missing email. Provide it in .env (${emailEnvKey}) or JSON (${scenarioPath}.email).`
      );
    }

    if (requireCreds && !finalHasPassword && !hasJsonPassword) {
      throw new Error(
        `DataLoader Error: Missing password. Provide it in .env (${passwordEnvKey}) or JSON (${scenarioPath}.password).`
      );
    }

    // write back in case scenario is not a reference (safe)
    setByDotPath(data, scenarioPath, scenario);

    return data as T;
  }
}

/**
 * Optional convenience export to keep your old import style working:
 * import DataLoader from "../utils/data-loader";
 * const data = DataLoader<ProductCreateData>("product/...");
 */
export function DataLoaderFn<T>(relativePath: string, options?: EnvOverrideOptions): T {
  return DataLoader.load<T>(relativePath, options);
}