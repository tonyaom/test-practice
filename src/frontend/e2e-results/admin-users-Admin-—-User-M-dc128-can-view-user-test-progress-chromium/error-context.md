# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-users.spec.ts >> Admin — User Management >> admin can view user test progress
- Location: e2e/admin-users.spec.ts:100:3

# Error details

```
Error: Channel closed
```

```
Error: page.waitForSelector: Target page, context or browser has been closed
Call log:
  - waiting for locator('[data-ocid="login.username.input"]') to be visible

```

```
Error: browserContext.close: Test ended.
Browser logs:

<launching> /home/ubuntu/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --enable-automation --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/tmp/playwright_chromiumdev_profile-ZI86iQ --remote-debugging-pipe --no-startup-window
<launched> pid=25311
[pid=25311][err] [0509/005849.220736:ERROR:base/files/file_path_watcher_inotify.cc:922] Failed to read /proc/sys/fs/inotify/max_user_watches
[pid=25311][err] [0509/005849.220746:ERROR:base/files/file_path_watcher_inotify.cc:922] Failed to read /proc/sys/fs/inotify/max_user_watches
[pid=25311][err] [0509/005849.222967:ERROR:dbus/bus.cc:405] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[pid=25311][err] [0509/005849.225843:ERROR:dbus/bus.cc:405] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[pid=25311][err] [0509/005849.226201:ERROR:dbus/bus.cc:405] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[pid=25311][err] [0509/005849.226531:ERROR:base/files/file_path_watcher_inotify.cc:922] Failed to read /proc/sys/fs/inotify/max_user_watches
[pid=25311][err] [0509/005849.225973:ERROR:net/base/address_tracker_linux.cc:243] Could not bind NETLINK socket: Operation not supported (95)
[pid=25311][err] [0509/005849.242985:WARNING:device/bluetooth/dbus/bluez_dbus_manager.cc:209] Floss manager service not available, cannot set Floss enable/disable.
[pid=25311][err] [0509/005849.246909:WARNING:sandbox/policy/linux/sandbox_linux.cc:405] InitializeSandbox() called with multiple threads in process gpu-process.
[pid=25311][err] [0509/005849.264586:ERROR:base/files/file_path_watcher_inotify.cc:922] Failed to read /proc/sys/fs/inotify/max_user_watches
[pid=25311][err] [0509/005849.350870:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005849.429436:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005849.674254:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005849.814972:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005849.815044:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005849.815056:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005849.815068:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005850.746428:INFO:CONSOLE:334] "Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.", source: http://localhost:5173/node_modules/.vite/deps/@radix-ui_react-dialog.js?v=39ba9bcb (334)
[pid=25311][err] [0509/005850.921082:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005850.921101:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005851.603698:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005851.603728:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005851.722076:INFO:CONSOLE:334] "Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.", source: http://localhost:5173/node_modules/.vite/deps/@radix-ui_react-dialog.js?v=39ba9bcb (334)
[pid=25311][err] [0509/005852.361210:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005852.439395:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005852.676103:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005852.858884:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005852.858914:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005852.860242:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005852.860260:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005853.310336:INFO:CONSOLE:334] "Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.", source: http://localhost:5173/node_modules/.vite/deps/@radix-ui_react-dialog.js?v=39ba9bcb (334)
[pid=25311][err] [0509/005854.087472:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005854.090137:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005854.157212:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005854.157231:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005854.331666:INFO:CONSOLE:334] "Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.", source: http://localhost:5173/node_modules/.vite/deps/@radix-ui_react-dialog.js?v=39ba9bcb (334)
[pid=25311][err] [0509/005854.856128:INFO:CONSOLE:334] "Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent}.", source: http://localhost:5173/node_modules/.vite/deps/@radix-ui_react-dialog.js?v=39ba9bcb (334)
[pid=25311][err] [0509/005855.270761:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005855.270787:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005855.598091:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005855.606133:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005855.749655:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005855.948922:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005855.948952:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005855.948959:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005855.948965:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005856.649001:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005856.750679:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005856.819489:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005856.910670:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005856.910688:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005856.913708:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005856.913862:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005857.212201:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005857.232413:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005857.360470:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005857.439654:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005857.439679:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005857.442991:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005857.443005:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005858.455119:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005858.455142:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005858.816273:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005858.826273:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005900.301620:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005900.448673:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005900.528458:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005900.528624:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005900.528639:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005901.317629:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005901.327400:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005901.380554:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005901.456409:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005901.456453:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005901.457687:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005901.457724:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005901.927288:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005901.955633:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005902.100725:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005902.183106:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005902.183125:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005902.183131:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005902.183153:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005903.269567:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005903.277787:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005903.330283:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005903.399263:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005903.406288:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005903.406331:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005903.406338:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005904.241749:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005904.409951:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005905.015212:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005905.178366:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005905.178501:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005905.251937:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005905.251957:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005905.955362:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005905.968205:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005906.018886:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005906.088903:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005906.088921:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005906.092039:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005906.092089:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005907.118787:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005907.132711:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005907.266016:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005907.342754:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005907.343710:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005907.343731:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005907.343737:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005907.786639:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005907.869705:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005907.987979:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311][err] [0509/005908.060014:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005908.060047:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005908.060492:INFO:CONSOLE:474] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (474)
[pid=25311][err] [0509/005908.060501:INFO:CONSOLE:489] "CANISTER_ID_BACKEND is not set", source: http://localhost:5173/node_modules/.vite/deps/@caffeineai_core-infrastructure.js?v=39ba9bcb (489)
[pid=25311][err] [0509/005908.850228:INFO:CONSOLE:495] "[vite] connecting...", source: http://localhost:5173/@vite/client (495)
[pid=25311][err] [0509/005908.854403:INFO:CONSOLE:618] "[vite] connected.", source: http://localhost:5173/@vite/client (618)
[pid=25311][err] [0509/005909.012542:INFO:CONSOLE:17995] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=39ba9bcb (17995)
[pid=25311] <gracefully close start>
```