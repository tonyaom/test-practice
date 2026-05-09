import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { backendInterface } from "../backend";
import { appConfig } from "../config";
import { mockBackendService } from "../mocks/backend";
import type { BackendService } from "../services/backendService";
import { createBackendServiceIfRest } from "../services/backendServiceFactory";
import { createIcpBackendService } from "../services/icpBackendService";

// A singleton REST service instance (created once when backendType === "rest")
const restService = createBackendServiceIfRest();

/**
 * Returns a BackendService instance.
 *
 * When VITE_USE_MOCK=true (set in the environment for e2e testing), returns
 * the mock backend service immediately — no ICP canister required.
 *
 * When backendType is "rest" (set in env.json), returns the REST service
 * immediately — no actor loading delay.
 *
 * When backendType is "icp" (default), returns a service backed by the real
 * ICP actor, or null while the actor is still loading.
 *
 * To switch backends, update env.json:
 *   { "backend_type": "rest", "rest_api_url": "http://localhost:3000" }
 */
export function useBackend(): BackendService | null {
  // useActor must be called unconditionally (Rules of Hooks).
  // When using the mock we don't need the actor, but hooks must be called.
  const { actor, isFetching } = useActor(createActor);

  // In e2e / local-dev mock mode, return the mock backend immediately.
  // VITE_USE_MOCK is injected by the Vite environment plugin.
  if (import.meta.env.VITE_USE_MOCK === "true") {
    return mockBackendService;
  }

  if (appConfig.backendType === "rest") {
    // REST path — actor is unused; return singleton REST service.
    return restService;
  }

  // ICP path — wait for actor to be ready.
  if (isFetching || !actor) return null;
  return createIcpBackendService(actor as unknown as backendInterface);
}
