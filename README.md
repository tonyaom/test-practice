# 📚 Test Practice Platform

A web application for creating and practising tests — with multiple question types, section-based organisation, mastery tracking, two-factor authentication, and an admin dashboard. Built on the Internet Computer blockchain for permanent, decentralised storage.

---

## Table of Contents

1. [What This App Does](#1-what-this-app-does)
2. [Prerequisites — Software to Install First](#2-prerequisites--software-to-install-first)
3. [Running the App Locally](#3-running-the-app-locally)
4. [Running Unit Tests](#4-running-unit-tests)
5. [Deploying to the Internet Computer (Mainnet)](#5-deploying-to-the-internet-computer-mainnet)
6. [Switching Between ICP and REST Backends](#6-switching-between-icp-and-rest-backends)
7. [Admin Account](#7-admin-account)
8. [Key Features Guide](#8-key-features-guide)
9. [Troubleshooting](#9-troubleshooting)
10. [Running E2E Tests (Playwright)](#10-running-e2e-tests-playwright)

---

## 1. What This App Does

Test Practice Platform lets you **create, manage, and practise tests** — all in a clean, easy-to-use web interface.

### For Admins
- Create and edit tests with multiple question types
- Organise questions into **sections** (e.g. "Chapter 1", "Module A")
- Upload images for any question
- **Manage users** — activate or deactivate accounts, see each user's test progress
- View how far each user has progressed through every test

### For Users
- Browse all available tests and pick sections to practise
- Answer questions one at a time, in random or fixed order
- Take **up to 5 tests simultaneously** with independent progress tracking
- Track your mastery — questions you answer correctly 5 times in a row are marked as **mastered** and won't be shown again
- See a detailed results breakdown after each test, including scores per section
- Enable **two-factor authentication (2FA)** for extra account security

### Question Types Supported

| Type | Description |
|------|-------------|
| Multiple Choice (single answer) | Pick the one correct option |
| Multiple Choice (multi answer) | Pick all correct options |
| Short Text | Type in your answer |
| Drag-and-Drop Ordering | Arrange items in the correct sequence |

---

## 2. Prerequisites — Software to Install First

You need to install four pieces of software before you can run the app. Follow the steps below for your operating system.

> **Don't worry** — you only do this once. After the first setup, starting the app only takes a few seconds.

---

### Step 1 — Install Node.js

Node.js is a runtime that lets your computer run JavaScript programs (the app's build tools need it).

**Download from:** https://nodejs.org

- Choose the version labelled **LTS** (Long Term Support) — it's the most stable.
- Run the installer and follow the prompts.

**Verify it worked** — open a terminal (macOS: Spotlight → "Terminal"; Windows: Start → "Command Prompt"; Linux: your system terminal) and type:

```bash
node --version
```

You should see something like `v20.12.0`. Any version 18 or above is fine.

---

### Step 2 — Install pnpm

pnpm is a fast package manager (it downloads the app's code dependencies).

In your terminal, type:

```bash
npm install -g pnpm
```

**Verify it worked:**

```bash
pnpm --version
```

You should see something like `9.0.0`.

---

### Step 3 — Install dfx (Internet Computer CLI)

dfx is the command-line tool that runs a local copy of the Internet Computer on your machine and deploys the app's backend.

**macOS / Linux** — paste this into your terminal:

```bash
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

When prompted, press Enter to accept the default installation path.

**Windows** — the dfx tool runs natively on Linux. On Windows, use **WSL 2** (Windows Subsystem for Linux):
1. Open PowerShell as Administrator and run:
   ```powershell
   wsl --install
   ```
2. Restart your computer.
3. Open the "Ubuntu" app from the Start Menu.
4. In the Ubuntu terminal, paste the macOS/Linux command above.

> From this point on, Windows users should run all commands inside the **Ubuntu (WSL)** terminal, not Command Prompt or PowerShell.

**Verify it worked:**

```bash
dfx --version
```

You should see something like `dfx 0.24.0`.

---

### Step 4 — Install mops (Motoko package manager)

mops downloads the backend's code dependencies (written in the Motoko language).

```bash
npm install -g mops
```

**Verify it worked:**

```bash
mops --version
```

You should see a version number.

---

## 3. Running the App Locally

Running the app locally means everything runs on your own computer — no internet connection to the live network is needed. It's perfect for development and testing.

> **Important:** You will need **three terminal windows open at the same time**. Each one runs a different part of the system. Don't close any of them while using the app.

---

### Step 1 — Get the Source Code

If you received the code as a ZIP file, unzip it to a folder on your computer.

If you're using Git, clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd <folder-name>
```

---

### Step 2 — Install Backend Dependencies

Open **Terminal 1** and navigate to the backend folder:

```bash
cd src/backend
mops install
```

This downloads the Motoko libraries the backend needs. You'll see packages being downloaded — wait until it finishes.

---

### Step 3 — Install Frontend Dependencies

Open **Terminal 2** and navigate to the frontend folder:

```bash
cd src/frontend
pnpm install --prefer-offline
```

This downloads the React/TypeScript libraries the frontend needs. Wait until it finishes.

---

### Step 4 — Create Your Local Configuration File

The app needs a configuration file called `env.json` to know where to find the backend. There's a template ready for you.

From the root folder of the project, run:

```bash
cp src/frontend/env.example.json src/frontend/env.json
```

> **What this does:** It copies the example config into a real config file. The real file is never committed to git, so your local settings stay private.

---

### Step 5 — Start the Local Internet Computer (Terminal 1)

In **Terminal 1** (from the project root folder), start a local replica of the Internet Computer:

```bash
dfx start --background --clean
```

- `--background` keeps it running silently in the background.
- `--clean` starts fresh — wipes any old local data.

You should see a message like:

```
Running dfx start for version 0.24.0
Starting up the replica and boundary node...
...
Dashboard: http://localhost:4943/_/dashboard
```

> **Keep this running.** If you stop dfx, the backend will go offline.

---

### Step 6 — Deploy the Backend (Terminal 1)

In **Terminal 1**, deploy the backend canister to your local network:

```bash
dfx deploy backend --network local
```

This compiles and deploys the Motoko backend. It takes 30–60 seconds the first time. At the end you'll see something like:

```
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    backend: http://127.0.0.1:4943/?canisterId=...
Candid:
  backend: http://localhost:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
```

**Copy the canister ID** — it's the long string after `id=`, like `bkyz2-fmaaa-aaaaa-qaaaq-cai`. You need this in the next step.

---

### Step 7 — Update Your Configuration File

Open `src/frontend/env.json` in any text editor (Notepad, TextEdit, VS Code, etc.) and update it:

```json
{
  "backend_host": "http://localhost:4943",
  "backend_canister_id": "PASTE_YOUR_CANISTER_ID_HERE",
  "project_id": "local",
  "ii_derivation_origin": "http://localhost:4943",
  "backend_type": "icp",
  "rest_api_url": ""
}
```

Replace `PASTE_YOUR_CANISTER_ID_HERE` with the canister ID you copied in Step 6.

---

### Step 8 — Generate Type Bindings (Terminal 1)

This step generates the TypeScript types that let the frontend talk to the backend. Run this from the **project root folder**:

```bash
pnpm bindgen
```

> **Whenever you change backend code**, run this command again to keep the frontend in sync.

---

### Step 9 — Start the Frontend Server (Terminal 2)

In **Terminal 2**, navigate to the frontend folder and start the server:

```bash
cd src/frontend
pnpm dev
```

You should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 10 — Open the App

Open your web browser and go to:

```
http://localhost:5173
```

You should see the Test Practice Platform login page.

**Log in with the admin account:**
- Username: `adbc`
- Password: `abcd`

---

### Summary: What the Two Terminals Are Doing

| Terminal | What it runs | Can you close it? |
|----------|-------------|-------------------|
| Terminal 1 | Local Internet Computer replica + backend | ❌ No — the app breaks |
| Terminal 2 | Frontend development server | ❌ No — the app breaks |

---

## 4. Running Unit Tests

Unit tests automatically check that every feature of the app works correctly. Run them any time you want to verify nothing is broken — especially before deploying.

### Run All Tests

Open a terminal, go to the frontend folder, and run:

```bash
cd src/frontend
pnpm vitest run
```

### What to Expect

A successful run looks like this:

```
 RUN  v2.x.x  src/frontend

 ✓  src/frontend/src/__tests__/authLogic.test.ts (18 tests) 42ms
 ✓  src/frontend/src/__tests__/adminApi.test.ts (27 tests) 35ms
 ✓  src/frontend/src/__tests__/userApi.test.ts (25 tests) 38ms
 ✓  src/frontend/src/__tests__/masteryLogic.test.ts (22 tests) 31ms
 ✓  src/frontend/src/__tests__/offlineCache.test.ts (19 tests) 44ms
 ✓  src/frontend/src/__tests__/takeTestLogic.test.ts (31 tests) 52ms
 ✓  src/frontend/src/__tests__/testResultLogic.test.ts (20 tests) 29ms
 ✓  src/frontend/src/__tests__/twoFactorLogic.test.ts (18 tests) 33ms
 ...

 Test Files  20 passed (20)
 Tests       400+ passed (400+)
 Duration    8.00s
```

All lines should say **passed**. If any say **failed**, see the [Troubleshooting](#9-troubleshooting) section.

### What the Tests Check

In plain English, the tests verify:

- **Login and registration** work correctly, including wrong password handling
- **Admin-only actions** (managing users, creating tests) are blocked for regular users
- **Question mastery logic** — 5 correct answers marks as mastered, wrong answer resets counter
- **Offline cache** — questions save to the device and refresh when a test is updated
- **Test-taking flow** — questions appear in the right order, answers are evaluated correctly
- **Two-factor authentication** — enabling, disabling, and verifying codes works
- **Multi-session support** — up to 5 tests can run simultaneously with independent progress
- **Results calculation** — section scores and overall totals are accurate
- **User management** — admins can activate and deactivate accounts

---

## 5. Deploying to the Internet Computer (Mainnet)

Deploying to mainnet means your app will be publicly accessible anywhere in the world, stored permanently on the Internet Computer blockchain.

---

### Step 1 — Create an Internet Identity

Internet Identity is your login for the Internet Computer ecosystem (like a developer account).

1. Go to: https://identity.internetcomputer.org
2. Click **Create New Internet Identity**
3. Follow the prompts to register (you can use a hardware key, your phone's biometrics, or a passphrase)
4. **Save your anchor number** — you'll need it to log in again

---

### Step 2 — Get Free Cycles (Deployment Fuel)

Cycles are the "fuel" used to run canisters on the Internet Computer. You need a small amount to deploy.

1. Go to: https://faucet.dfinity.org
2. Log in with your Internet Identity
3. Follow the instructions to claim free cycles
4. You'll receive enough to deploy and run the app for months

---

### Step 3 — Set Up Your dfx Identity

```bash
dfx identity new my-identity
dfx identity use my-identity
```

Then follow the specific redemption instructions from the faucet site to transfer your cycles to a new canister wallet.

---

### Step 4 — Deploy the Backend to Mainnet

From the project root:

```bash
dfx deploy backend --network ic
```

This compiles and uploads the backend to the live Internet Computer. It may take 1–3 minutes.

At the end you'll see your **canister ID** — copy it:

```
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    backend: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=YOUR_CANISTER_ID
```

---

### Step 5 — Update env.json for Mainnet

Open `src/frontend/env.json` and update it with your mainnet values:

```json
{
  "backend_host": "https://ic0.app",
  "backend_canister_id": "YOUR_MAINNET_CANISTER_ID",
  "project_id": "YOUR_PROJECT_ID",
  "ii_derivation_origin": "https://YOUR_CANISTER_ID.icp0.io",
  "backend_type": "icp",
  "rest_api_url": ""
}
```

Replace:
- `YOUR_MAINNET_CANISTER_ID` — the canister ID from Step 4
- `YOUR_PROJECT_ID` — your Caffeine project ID (found in the Caffeine dashboard)
- `https://YOUR_CANISTER_ID.icp0.io` — your app's public URL (use the same canister ID)

---

### Step 6 — Build the Frontend

```bash
cd src/frontend
pnpm build
```

This compiles the React app into static files ready for deployment. You'll see a `dist/` folder created.

---

### Step 7 — Deploy the Frontend to Mainnet

From the project root:

```bash
dfx deploy frontend --network ic
```

At the end you'll see your app's public URL:

```
URLs:
  Frontend canister via browser:
    frontend: https://YOUR_FRONTEND_CANISTER_ID.icp0.io
```

---

### Step 8 — Open Your Live App

Go to:

```
https://YOUR_FRONTEND_CANISTER_ID.icp0.io
```

Your app is now live, publicly accessible, and permanently stored on the Internet Computer. 🎉

---

## 6. Switching Between ICP and REST Backends

The app supports two backend modes. You can switch between them by editing `src/frontend/env.json` — no code changes needed.

### Mode 1: ICP Backend (Default)

This is the default mode. All data is stored on the Internet Computer blockchain.

```json
{
  "backend_host": "http://localhost:4943",
  "backend_canister_id": "YOUR_CANISTER_ID",
  "project_id": "YOUR_PROJECT_ID",
  "ii_derivation_origin": "http://localhost:4943",
  "backend_type": "icp",
  "rest_api_url": ""
}
```

### Mode 2: REST Backend

If you have a separate REST API server (e.g. Express.js, Django, or any HTTP API), you can point the frontend at it instead.

```json
{
  "backend_host": "https://api.example.com",
  "backend_canister_id": "",
  "project_id": "YOUR_PROJECT_ID",
  "ii_derivation_origin": "https://yourapp.example.com",
  "backend_type": "rest",
  "rest_api_url": "https://api.example.com"
}
```

**Key differences:**

| Setting | ICP Backend | REST Backend |
|---------|------------|--------------|
| `backend_type` | `"icp"` | `"rest"` |
| `backend_host` | ICP replica URL | Your API server URL |
| `backend_canister_id` | Required | Leave empty |
| `rest_api_url` | Leave empty | Your API server URL |

After editing `env.json`, restart the frontend server (`pnpm dev`) for changes to take effect.

---

## 7. Admin Account

### Default Admin Credentials

| Field | Value |
|-------|-------|
| Username | `adbc` |
| Password | `abcd` |

> **Security tip:** Change the default password immediately after your first login.

### Changing the Admin Password

1. Log in as `adbc`
2. Click the **profile icon** in the top-right corner
3. Select **Profile Settings**
4. Under "Change Password", enter your current password and your new password
5. Click **Save Changes**

### Managing Users (Activate / Deactivate)

As admin, you can control who can access the app:

1. Log in as `adbc`
2. Go to **Admin → Manage Users** (or navigate to `/admin/users`)
3. You'll see a list of all registered users with their status
4. Click **Deactivate** next to a user to block their access
5. Click **Activate** to restore their access

Deactivated users will see an error when they try to log in.

### Viewing User Test Progress

1. Log in as `adbc`
2. Go to **Admin → Manage Users** (or `/admin/users`)
3. Click on a user's name to see their test progress
4. You can see which tests they've started, how far they've progressed, and their mastery levels per question

### Important Notes

- Only the `adbc` account has admin privileges
- Newly registered users are always regular users — they cannot give themselves admin access
- There is only one admin account

---

## 8. Key Features Guide

### Question Mastery System

The mastery system helps you focus on questions you haven't fully learnt yet.

**How it works:**

| Event | Effect |
|-------|--------|
| Answer correctly | Correct-answer counter goes up by 1 |
| Answer correctly 5 times in a row | Question is **mastered** — never shown again |
| Answer **incorrectly** | Counter resets to 0 — you start over for that question |

**Why this matters:** Once you've proven you know a question 5 times consecutively, the app stops testing you on it. This lets you focus your time on what you still need to learn.

**Reset to Near-Mastered (set all to 4):**

Both admins and users have the option to reset all questions' correct-answer count to **4**. This means:
- All questions are one correct answer away from being mastered
- It's a quick way to do a final review pass across everything
- Find this button in the test settings or practice options screen

**Full Reset (set all to 0):**

You can also reset all counters back to 0 to start fresh.

---

### Offline-First Caching

The app downloads all questions and answers to your device when you first load a test. This means:

- Tests load instantly after the first visit (even on slow connections)
- You can start answering without waiting for network requests

**How the cache stays up to date:**

When a test is updated (questions added, answers changed, sections modified, etc.), the backend records a new `updated_at` timestamp. When you visit the test next time, the app compares this timestamp against what's stored on your device:

- **Timestamps match** → Use the cached version (fast)
- **Timestamps differ** → Clear the old cache, download the new version

**Manually clearing the cache:**

Both admins and regular users can manually clear the local cache at any time. Look for the **Clear Cache** button in:
- The test detail page (clears that test's cache)
- The profile/settings area (clears all cached data)

**When to clear the cache manually:**
- If you see outdated questions after an admin updated a test
- If the app seems to be loading old data
- Before a fresh start or when switching devices

---

### Two-Factor Authentication (2FA)

2FA adds a second layer of security to your account. After entering your password, you'll also need to enter a 6-digit code from your phone.

**Setting up 2FA:**

1. Log in to your account
2. Click the **profile icon** → **Profile Settings**
3. Find the **Two-Factor Authentication** section
4. Click **Enable 2FA**
5. You'll see a QR code — open **Google Authenticator** (or any TOTP app like Authy) on your phone
6. Tap the **+** button in the app and choose **Scan a QR code**
7. Point your phone at the QR code on screen
8. The app will show a 6-digit code — enter it in the confirmation box on screen
9. Click **Verify and Enable**

> **Can't scan the QR code?** Tap "Copy secret key" instead, then in Google Authenticator choose "Enter a setup key" and paste it manually.

**Logging in with 2FA enabled:**

1. Enter your username and password as usual
2. A second screen will appear asking for your **authentication code**
3. Open Google Authenticator on your phone
4. Enter the 6-digit code shown (it changes every 30 seconds)
5. Click **Verify**

**Disabling 2FA:**

1. Go to **Profile Settings → Two-Factor Authentication**
2. Click **Disable 2FA**
3. Enter your password and a current 6-digit code to confirm

---

### Sections

Tests can be divided into sections (like chapters or modules). During practice:

1. On the pre-test screen, you'll see checkboxes for each section
2. Tick the sections you want to practise (or leave them all ticked for the full test)
3. Questions from all selected sections are pooled together
4. If you enable **Randomize**, questions shuffle across all selected sections

Results show a score for each section you practised, plus a combined total.

---

### Multiple Simultaneous Tests

You can take up to **5 tests at the same time**, each with independent progress:

- Start any test; your progress is automatically saved
- Switch to a different test any time — your place in the first test is preserved
- A **Tests in Progress** indicator shows how many active sessions you have
- End any test at any time to see its results without affecting your other tests

---

## 9. Troubleshooting

### "Port 4943 is already in use"

Another dfx process is already running. Stop it first:

```bash
dfx stop
dfx start --background --clean
```

---

### "Cannot connect to backend" / Blank screen with errors

The frontend can't find the backend canister. Check:

1. Open `src/frontend/env.json`
2. Make sure `backend_canister_id` matches the ID shown when you ran `dfx deploy backend --network local`
3. Make sure dfx is still running (`dfx start --background`)
4. Restart the frontend: press `Ctrl+C` in Terminal 2, then run `pnpm dev` again

---

### Blank / white screen with no error message

The development server may have crashed or got confused.

1. In Terminal 2, press `Ctrl+C` to stop the server
2. Run `pnpm dev` again
3. Refresh the browser

---

### "Module not found" or missing packages error

The dependencies weren't installed correctly. Delete them and reinstall:

```bash
cd src/frontend
rm -rf node_modules
pnpm install --prefer-offline
```

---

### Tests fail with "cannot read backend" or type errors

The TypeScript type bindings are out of sync with the backend. Regenerate them:

```bash
# From the project root
pnpm bindgen
```

Then run the tests again:

```bash
cd src/frontend
pnpm vitest run
```

---

### "Insufficient cycles" when deploying to mainnet

Your canister has run out of fuel. Top up at:

https://faucet.dfinity.org

---

### "Invalid credentials" on login

- For the admin account: username is **adbc** (not "admin"), password is **abcd**
- For regular accounts: double-check the username (it's case-sensitive) and password
- Try resetting your browser's stored passwords in case autofill is filling the wrong value

---

### "Your account has been deactivated"

An admin has deactivated your account. Contact the person who manages the platform and ask them to reactivate you from the **Admin → Manage Users** page.

---

### 2FA QR code is blank or not scanning

Use the manual entry method instead:

1. On the 2FA setup screen, click **Copy secret key**
2. Open Google Authenticator on your phone
3. Tap **+** → **Enter a setup key**
4. Enter a name (e.g. "Test Practice") and paste the secret key
5. Tap **Add**
6. Continue with the 6-digit code as usual

---

### "Permission denied" when running commands (macOS / Linux)

Add `sudo` before the command:

```bash
sudo npm install -g pnpm
sudo npm install -g mops
```

> Only use `sudo` for global install commands — never for `dfx deploy` or `pnpm dev`.

---

### "Port 5173 is already in use"

Another process is using the frontend's default port. Kill it:

**macOS / Linux:**

```bash
lsof -ti:5173 | xargs kill -9
```

**Windows (WSL):**

```bash
fuser -k 5173/tcp
```

Then run `pnpm dev` again.

---

### "Data disappeared after restarting dfx"

This is expected behaviour. When you run `dfx start --clean`, it wipes the local blockchain and all data on it. This is useful for a fresh start but means any tests, users, or questions you created locally are gone.

**To keep data between restarts:** Remove the `--clean` flag:

```bash
dfx start --background
```

**Note:** Data in production (deployed with `--network ic`) **never disappears** — it is stored permanently on the Internet Computer blockchain.

---

### Still stuck?

If none of the above solutions help:

1. **Check the browser console** — press `F12` (or `Cmd+Option+I` on Mac), click the **Console** tab, and look for red error messages
2. **Check the terminal** — look for error messages in Terminal 1 (dfx) and Terminal 2 (pnpm dev)
3. **Try a full reset:**
   ```bash
   dfx stop
   cd src/frontend && rm -rf node_modules && pnpm install --prefer-offline
   cd ../..
   dfx start --background --clean
   dfx deploy backend --network local
   pnpm bindgen
   cd src/frontend && pnpm dev
   ```

---

## Quick Reference

### Local Development Commands

```bash
# Start local IC replica (Terminal 1)
dfx start --background --clean

# Deploy backend locally (Terminal 1)
dfx deploy backend --network local

# Generate type bindings — run from project root after any backend change
pnpm bindgen

# Start frontend dev server (Terminal 2)
cd src/frontend && pnpm dev

# Run all unit tests
cd src/frontend && pnpm vitest run
```

### Mainnet Deployment Commands

```bash
# Deploy backend to mainnet
dfx deploy backend --network ic

# Build frontend
cd src/frontend && pnpm build

# Deploy frontend to mainnet
dfx deploy frontend --network ic
```

### Default Admin Credentials

| Username | Password |
|----------|----------|
| `adbc` | `abcd` |

### App URLs

| Environment | URL |
|-------------|-----|
| Local development | http://localhost:5173 |
| Mainnet | https://YOUR_FRONTEND_CANISTER_ID.icp0.io |

---

*Built with ❤️ using [caffeine.ai](https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral)*

---

## 10. Running E2E Tests (Playwright)

This project includes a complete Playwright end-to-end test suite that exercises the real app UI across all features — authentication, admin test management, user management, test-taking, mastery, progress tracking, and UX features.

### What are E2E tests?

Unlike unit tests (which test small pieces of code in isolation), **end-to-end tests open a real browser, navigate through the app exactly like a user would**, and verify everything works together from login to results. You can watch them run or review a visual HTML report.

---

### Prerequisites

Before running E2E tests, you need:

1. **Node.js 18+** — [Download here](https://nodejs.org/)
2. **pnpm** — install with `npm install -g pnpm`
3. **The app running locally** — follow [Section 3: Running the App Locally](#3-running-the-app-locally) first
4. **The seeded admin account must exist** — username `adbc`, password `abcd` (created automatically on first startup)

---

### Step-by-Step: First-Time Setup

#### Step 1 — Install dependencies (if not done already)

Open a terminal, navigate to the frontend folder, and run:

```bash
cd src/frontend
pnpm install
```

#### Step 2 — Install Playwright browsers

This downloads Chromium (the browser Playwright uses). You only need to do this once:

```bash
# Install Playwright browsers
cd src/frontend
node_modules/.bin/playwright install chromium
```

Expected output: `Downloading Chromium ... done`

---

### Running the Tests

#### Step 3 — Start the app

In a **separate terminal window**, start the local app (keep it running while tests execute):

```bash
# From the project root
dfu start --clean
# Then in another terminal:
dfx deploy
cd src/frontend && pnpm dev
```

Wait until you see `Local: http://localhost:5173` (or similar) — the app must be accessible before running tests.

> **Using a different port?** Set the `BASE_URL` environment variable:
> ```bash
> BASE_URL=http://localhost:3000 pnpm e2e
> ```

#### Step 4 — Run all E2E tests

**Option A — Shell script (works without modifying package.json):**

```bash
# From the project root
chmod +x e2e.sh
./e2e.sh
```

**Option B — Direct Playwright command from frontend folder:**

```bash
cd src/frontend
node_modules/.bin/playwright test
```

Expected output:
```
Running 45 tests using 1 worker
  ✓ Authentication > can navigate to login page (1.2s)
  ✓ Authentication > admin can login with correct credentials (3.1s)
  ...
  45 passed
```

#### Step 5 — View the HTML report

After the tests finish, open the visual report in your browser:

```bash
# Option A — Shell script
./e2e-report.sh

# Option B — Direct command
cd src/frontend
node_modules/.bin/playwright show-report e2e-report
```

This opens a detailed report showing each test, its status (pass/fail), screenshots on failure, and video replays.

---

### Running Tests with a Visual Browser (Recommended for First-Time)

To watch the tests run in a real browser window:

```bash
# Option A — Shell script
./e2e.sh --ui

# Option B — Direct command
cd src/frontend
node_modules/.bin/playwright test --ui
```

This opens Playwright's interactive UI where you can:
- Click any test to run it individually
- Watch the browser navigate through the app in real time
- Inspect what each step did
- See timeline traces for failures

---

### Test Files Overview

| File | What it tests |
|------|---------------|
| `e2e/auth.spec.ts` | Login, register, logout, 2FA, redirect guards |
| `e2e/admin-tests.spec.ts` | Create/edit/delete tests, add questions, add/delete sections |
| `e2e/admin-users.spec.ts` | User management, activate/deactivate, view progress, dashboard |
| `e2e/test-taking.spec.ts` | Start test, answer questions, wrong answer feedback, end test, results |
| `e2e/mastery.spec.ts` | Reset mastery, mastery badge, mastery confirmation dialog |
| `e2e/progress.spec.ts` | Progress tracking, history page, lifetime time, admin progress view |
| `e2e/ui-features.spec.ts` | Font size slider, bookmarks, timer, section progress bars, streak badge |

---

### Admin Account Requirement

Many tests log in as the seeded admin (`adbc` / `abcd`). This account is created automatically when the app starts for the first time. If you wiped your local canister state, restart it — the admin account will be re-seeded on the first backend call.

**Do not change the admin username** while E2E tests are set up — the tests rely on `adbc`/`abcd`.

---

### Troubleshooting

| Problem | Fix |
|---------|-----|
| `Error: page.goto: net::ERR_CONNECTION_REFUSED` | The app is not running. Start it first (Step 3). |
| `Timeout waiting for selector` | The app is loading slowly — increase `timeout` in `playwright.config.ts` or wait longer before running. |
| `Admin login failed` | The `adbc`/`abcd` admin account was not seeded. Restart your local canister or check backend logs. |
| `Tests pass locally but fail in CI` | Set `CI=true` — Playwright automatically increases retries to 1 in CI. |
| `Cannot find module '@playwright/test'` | Run `pnpm e2e:install` from `src/frontend/` first. |
| `Wrong base URL` | Set `BASE_URL=http://localhost:YOUR_PORT pnpm e2e` to match where your app is running. |
| Tests are slow | The Internet Computer local replica can be slow. Increase `actionTimeout` in `playwright.config.ts`. |

---

### Running a Single Test File

```bash
# Run only auth tests
cd src/frontend
node_modules/.bin/playwright test e2e/auth.spec.ts

# Or from project root:
./e2e.sh e2e/auth.spec.ts

# Run tests matching a name pattern
cd src/frontend && node_modules/.bin/playwright test --grep "admin can create"

# Run in headed mode (see browser)
cd src/frontend && node_modules/.bin/playwright test --headed
```

---

### Configuration

The Playwright config is at `src/frontend/playwright.config.ts`. Key settings:

| Setting | Default | Description |
|---------|---------|-------------|
| `baseURL` | `http://localhost:3000` | Where the app is running |
| `timeout` | `30000ms` | Max time per test step |
| `retries` | `0` (1 in CI) | Automatic retries on failure |
| `outputDir` | `e2e-results/` | Screenshots and videos on failure |
| `reporter` | `html` + `list` | HTML report + console output |

To change the base URL without editing the file:
```bash
BASE_URL=http://localhost:5173 pnpm e2e
```

