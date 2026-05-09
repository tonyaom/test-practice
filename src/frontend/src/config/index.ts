/**
 * Application configuration — the ONE place to change backend settings.
 *
 * Values are injected from env.json at build time via vite-plugin-environment.
 * To point to a different backend, update env.json:
 *   backend_host        — e.g. "http://localhost:4943" or "https://icp0.io"
 *   backend_canister_id — the backend canister principal
 *   project_id          — Caffeine project ID
 *   ii_derivation_origin — Internet Identity derivation origin
 */

declare const process: { env: Record<string, string | undefined> };

function readEnvVar(key: string): string {
  // vite-plugin-environment exposes vars as process.env.VAR_NAME
  try {
    const val = process.env[key];
    return val !== undefined ? val : "";
  } catch {
    return "";
  }
}

export interface AppConfig {
  /** Base URL for the ICP backend host */
  backendHost: string;
  /** Canister principal ID of the backend */
  backendCanisterId: string;
  /** Caffeine project ID */
  projectId: string;
  /** Internet Identity derivation origin */
  iiDerivationOrigin: string;
  /**
   * Which backend implementation to use.
   * "icp"  — ICP actor via useBackend() hook (default)
   * "rest" — REST API via createRestBackendService(restApiUrl)
   */
  backendType: "icp" | "rest";
  /**
   * Base URL for the REST backend, used when backendType === "rest".
   * Example: "http://localhost:3000"
   * Set this in env.json: { "rest_api_url": "http://localhost:3000" }
   */
  restApiUrl: string;
}

/**
 * Singleton config object — import this wherever backend configuration is needed.
 * All values originate from env.json; change that file to switch backend targets.
 */
export const appConfig: AppConfig = {
  backendHost: readEnvVar("VITE_BACKEND_HOST") || readEnvVar("backend_host"),
  backendCanisterId:
    readEnvVar("VITE_BACKEND_CANISTER_ID") || readEnvVar("backend_canister_id"),
  projectId: readEnvVar("VITE_PROJECT_ID") || readEnvVar("project_id"),
  iiDerivationOrigin:
    readEnvVar("VITE_II_DERIVATION_ORIGIN") ||
    readEnvVar("ii_derivation_origin"),
  backendType:
    ((readEnvVar("VITE_BACKEND_TYPE") || readEnvVar("backend_type")) as
      | "icp"
      | "rest") || "icp",
  restApiUrl:
    readEnvVar("VITE_REST_API_URL") || readEnvVar("rest_api_url") || "",
};
