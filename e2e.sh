#!/usr/bin/env sh
# Convenience wrapper — run Playwright e2e tests from the frontend directory.
# Usage:
#   ./e2e.sh                  — run all tests
#   ./e2e.sh --list           — list all tests without running
#   ./e2e.sh --headed         — run in headed mode (see browser)
#   ./e2e.sh --ui             — open Playwright's interactive UI
#   ./e2e.sh --grep "pattern" — run tests matching a pattern
#
# Override the base URL:
#   BASE_URL=http://localhost:5173 ./e2e.sh

cd "$(dirname "$0")/src/frontend" || exit 1

# Install Playwright browsers if not already installed
if ! node_modules/.bin/playwright --version > /dev/null 2>&1; then
  echo "Installing Playwright browsers (one-time setup)..."
  node_modules/.bin/playwright install chromium
fi

node_modules/.bin/playwright test "$@"
