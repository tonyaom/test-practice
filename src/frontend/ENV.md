# Frontend Environment Configuration

This project uses `src/frontend/env.json` for runtime configuration. This file is **gitignored** and must never be committed with real values.

## Getting Started

1. Copy the example file to create your local config:
   ```bash
   cp src/frontend/env.example.json src/frontend/env.json
   ```
2. Fill in the real values for your environment (see field descriptions below).
3. Never commit `env.json` — it is listed in `.gitignore`.

## Fields

| Field | Required | Description |
|---|---|---|
| `backend_host` | Yes | The URL of the ICP replica or Caffeine host. Use `http://localhost:4943` for local development. |
| `backend_canister_id` | Yes | The principal ID of the deployed backend canister. Found in `.dfx/local/canister_ids.json` or the Caffeine dashboard. |
| `project_id` | Yes | Your Caffeine project ID. Found in the Caffeine dashboard. |
| `ii_derivation_origin` | Yes | The Internet Identity derivation origin. Use `http://localhost:4943` for local development; use your production URL in production. |
| `backend_type` | Yes | Which backend service to use. Set to `"icp"` to connect to an ICP canister backend (default), or `"rest"` to connect to a REST API backend. |
| `rest_api_url` | Conditional | Base URL for the REST backend (e.g. `https://api.example.com`). Only required when `backend_type` is `"rest"`. Leave empty when using `"icp"`. |

## Example

```json
{
  "backend_host": "http://localhost:4943",
  "backend_canister_id": "YOUR_CANISTER_ID_HERE",
  "project_id": "YOUR_PROJECT_ID_HERE",
  "ii_derivation_origin": "http://localhost:4943",
  "backend_type": "icp",
  "rest_api_url": ""
}
```

> **Tip:** To switch to a REST backend, set `backend_type` to `"rest"` and fill in `rest_api_url`. No other code changes are needed.
