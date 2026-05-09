/**
 * Backend service factory.
 *
 * Reads the backendType from appConfig and instantiates the correct
 * BackendService implementation:
 *
 *   backendType === "rest"  → createRestBackendService(restApiUrl)
 *   backendType === "icp"   → caller must use useBackend() (ICP needs the
 *                             actor hook; factory only handles REST here)
 *
 * Usage:
 *   import { createBackendService } from "./backendServiceFactory";
 *   const svc = createBackendService();  // returns REST service if configured
 *
 * To switch between backends, update env.json:
 *   { "backend_type": "rest", "rest_api_url": "http://localhost:3000" }
 *   { "backend_type": "icp" }   ← default
 */

import { appConfig } from "../config";
import type { BackendService } from "./backendService";
import { createRestBackendService } from "./restBackendService";

/**
 * Creates a BackendService based on the configured backendType.
 * Returns null when backendType is "icp" (the caller must use the actor
 * hook via useBackend() to get the ICP-backed service).
 */
export function createBackendServiceIfRest(): BackendService | null {
  if (appConfig.backendType === "rest") {
    const url = appConfig.restApiUrl;
    if (!url) {
      console.warn(
        "[backendServiceFactory] backendType is 'rest' but restApiUrl is not set in env.json. Falling back to ICP.",
      );
      return null;
    }
    return createRestBackendService(url);
  }
  return null;
}
