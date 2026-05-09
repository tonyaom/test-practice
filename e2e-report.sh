# Show HTML report from the last test run (opens in browser)
# Usage: ./e2e-report.sh
cd "$(dirname "$0")/src/frontend" || exit 1
node_modules/.bin/playwright show-report e2e-report
