# Test Practice Platform — Requirements Document

> **Who this document is for:** Anyone involved in the project — whether you're a developer, project manager, business owner, or stakeholder. No technical background is required to understand most of this document. Technical sections are clearly marked.

---

## Table of Contents

**Part 1 — Agile Format**
1. [Project Overview](#1-project-overview)
2. [Epic 1 — User Authentication & Security](#epic-1--user-authentication--security)
3. [Epic 2 — Test Management (Admin)](#epic-2--test-management-admin)
4. [Epic 3 — Test Taking (User Experience)](#epic-3--test-taking-user-experience)
5. [Epic 4 — Mastery Tracking](#epic-4--mastery-tracking)
6. [Epic 5 — Admin Analytics & User Management](#epic-5--admin-analytics--user-management)
7. [Epic 6 — Content Quality & Rich Editing](#epic-6--content-quality--rich-editing)

**Part 2 — Waterfall Format**
8. [System Overview](#8-system-overview)
9. [Functional Requirements](#9-functional-requirements)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Data Model Summary](#11-data-model-summary-plain-english)
12. [Deployment Guide](#12-deployment-guide)

---

# PART 1 — AGILE FORMAT

---

## 1. Project Overview

### What Is This App?

Test Practice Platform is a web application that helps people study and prepare for exams or assessments. Think of it like digital flashcards — but far more powerful.

- **Students / Users** can take practice tests, see where they went wrong, and track their progress until they've truly mastered each topic.
- **Admins** can create tests, write questions, organise content into sections, and see how students are performing.

### Why Does It Exist?

Traditional paper-based practice tests don't adapt to what a student already knows. This platform is smarter: once you've proven you know something (by answering correctly 5 times in a row), the system stops testing you on it. You spend your study time where it's needed most.

### Who Uses It?

| Role | What They Do |
|------|-------------|
| **Admin** | Creates and manages tests, questions, and sections. Manages user accounts. |
| **User (Student)** | Takes practice tests, tracks mastery, reviews results. |

### Technology in Plain English

The app is built on the **Internet Computer** — a blockchain-based hosting platform. This means:
- **No server to maintain** — the app runs on a decentralised network
- **Data is permanent** — nothing is lost; data persists even after updates
- **Secure by design** — all data is cryptographically protected

### Release History Summary

| Version | Major Features Added |
|---------|--------------------|
| v1–v10 | Basic test creation, question types, test-taking, results |
| v11–v12 | Sections — organise tests into chapters/modules |
| v13 | Section-specific question views |
| v14 | Two-factor authentication (2FA) |
| v15 | Seeded admin account; regular users lose admin rights |
| v16 | Mobile navigation fix; admin UI hidden from regular users |
| v17–v18 | Clean architecture; backend switching via config file |
| v19 | Feature folder restructure; REST backend support |
| v20–v22 | Rich text editor; math formula support |
| v23 | Login bug fix; test isolation for editor |
| v24 | Admin user management; mastery system; offline-first caching |

---

## Epic 1 — User Authentication & Security

**Goal:** Users can securely create accounts, log in, and protect their data. Admins have a dedicated account with elevated privileges.

---

### Story 1.1 — User Registration

> **As a** new visitor,
> **I want** to create an account with a username and password,
> **So that** I can access the platform and start practising tests.

**Acceptance Criteria:**
- [ ] A registration form accepts a username and password
- [ ] The username must be unique — if it already exists, an error message is shown
- [ ] The password must meet a minimum length requirement (at least 6 characters)
- [ ] After successful registration, the user is automatically logged in and redirected to the home page
- [ ] Newly registered accounts are always regular users (never admin)
- [ ] Registration errors (e.g. duplicate username) are displayed clearly without refreshing the page

---

### Story 1.2 — User Login

> **As a** registered user,
> **I want** to log in with my username and password,
> **So that** I can access my account and test progress.

**Acceptance Criteria:**
- [ ] A login form accepts username and password
- [ ] Correct credentials redirect to the user's home page
- [ ] Incorrect credentials show a clear error message (do not reveal which field is wrong for security reasons)
- [ ] Deactivated accounts show a specific message explaining the account is inactive
- [ ] Logging out returns the user to the login page and clears the session
- [ ] The session persists if the browser is refreshed (user stays logged in)

---

### Story 1.3 — Two-Factor Authentication (2FA) Setup

> **As a** security-conscious user,
> **I want** to enable two-factor authentication on my account,
> **So that** my account is protected even if someone steals my password.

**Acceptance Criteria:**
- [ ] A "Two-Factor Authentication" section exists in Profile Settings
- [ ] Clicking "Enable 2FA" displays a QR code and a text-based secret key
- [ ] The QR code can be scanned with Google Authenticator, Authy, or any TOTP-compatible app
- [ ] The user must enter a valid 6-digit code from their app to confirm setup is working before 2FA is saved
- [ ] If the confirmation code is wrong, 2FA is NOT saved and an error is shown
- [ ] Once enabled, a confirmation message confirms 2FA is active

---

### Story 1.4 — Login With 2FA

> **As a** user with 2FA enabled,
> **I want** to be prompted for my authentication code after entering my password,
> **So that** my account has two layers of protection.

**Acceptance Criteria:**
- [ ] After correct password entry, a second screen asks for the 6-digit code
- [ ] The code is validated against the user's TOTP secret
- [ ] A valid code grants access; an invalid code shows an error and does not log the user in
- [ ] Users without 2FA enabled see no second step — they log in with password only

---

### Story 1.5 — Disable 2FA

> **As a** user with 2FA enabled,
> **I want** to be able to turn off 2FA,
> **So that** I can remove it if I no longer want it or change my device.

**Acceptance Criteria:**
- [ ] A "Disable 2FA" button appears in Profile Settings when 2FA is active
- [ ] Disabling requires both the current password and a current 6-digit authentication code
- [ ] After disabling, the user logs in with password only — no code required

---

### Story 1.6 — Update Profile / Change Password

> **As a** logged-in user,
> **I want** to update my display name and change my password,
> **So that** I can keep my account information current and secure.

**Acceptance Criteria:**
- [ ] Profile Settings allows changing the display name
- [ ] Password change requires entering the current password first (to prevent accidental or unauthorised changes)
- [ ] Mismatched or incorrect current password shows a clear error
- [ ] Successful updates show a confirmation message

---

### Story 1.7 — Seeded Admin Account

> **As a** platform administrator,
> **I want** a pre-created admin account to exist from day one,
> **So that** I can immediately start creating tests without needing to promote any account manually.

**Acceptance Criteria:**
- [ ] On first launch, an account with username `adbc` and password `abcd` exists with admin privileges
- [ ] This account's password can be changed via Profile Settings
- [ ] No other account (existing or newly registered) has admin privileges
- [ ] Admin-only UI elements (e.g. "Manage Tests", "Admin Dashboard") are hidden from all non-admin accounts

---

## Epic 2 — Test Management (Admin)

**Goal:** Admins can create, edit, and organise tests with multiple question types, sections, and rich content.

---

### Story 2.1 — Create and Edit Tests

> **As an** admin,
> **I want** to create tests with a title and description,
> **So that** users have content to practise.

**Acceptance Criteria:**
- [ ] A "Create Test" form accepts a test title and optional description
- [ ] Tests appear immediately in the admin test list after creation
- [ ] Tests can be edited — title and description can be updated
- [ ] Tests can be deleted (with a confirmation prompt to prevent accidents)
- [ ] All tests are visible to all logged-in users on the user home page

---

### Story 2.2 — Add and Edit Questions

> **As an** admin,
> **I want** to add questions to a test with multiple question types,
> **So that** tests can cover content in different ways.

**Acceptance Criteria:**
- [ ] Four question types are supported: Multiple Choice (single answer), Multiple Choice (multiple answers), Short Text, Drag-and-Drop Ordering
- [ ] Multiple Choice questions have at least 2 answer options; correct answers are marked
- [ ] Short Text questions accept a correct answer string for auto-grading
- [ ] Drag-and-Drop questions accept a list of items in the correct order
- [ ] Questions can be edited and deleted at any time
- [ ] Questions can be assigned to a section during creation or editing
- [ ] Images can be uploaded for any question and display above the question text

---

### Story 2.3 — Manage Sections

> **As an** admin,
> **I want** to divide a test into named sections,
> **So that** content is organised by topic and users can focus their practice.

**Acceptance Criteria:**
- [ ] Sections can be created, renamed, and deleted on any test
- [ ] Questions can be assigned to a section
- [ ] Clicking a section shows only its questions (not all test questions)
- [ ] Sections can be created on new and existing tests
- [ ] Deleting a section that contains questions requires the user to type `I want to delete` as a confirmation phrase
- [ ] Confirming deletion removes the section and all questions inside it
- [ ] The section list screen does not show questions — only section names

---

### Story 2.4 — Question Rich Text Editing

> **As an** admin,
> **I want** to format question text with bold, colours, links, and math formulas,
> **So that** questions can be presented clearly and professionally.

**Acceptance Criteria:**
- [ ] The question editor is a rich text editor (not a plain text box)
- [ ] Toolbar includes: Bold, Italic, Underline, Text colour, Background colour, Bullet list, Numbered list, Insert link, Insert math formula
- [ ] A math symbol palette allows inserting common symbols (fractions, exponents, Greek letters, integrals, etc.) without needing to type LaTeX manually
- [ ] Saved questions with math formulas render the formulas correctly in both the test-taking view and the results view
- [ ] Existing plain-text questions continue to display correctly after the editor is introduced

---

## Epic 3 — Test Taking (User Experience)

**Goal:** Users can take tests with flexible options, navigate questions, and receive clear results.

---

### Story 3.1 — Browse and Start a Test

> **As a** user,
> **I want** to see all available tests and choose which one to take,
> **So that** I can practise the content I need.

**Acceptance Criteria:**
- [ ] All tests are listed on the user home page with title and description
- [ ] Each test card has a "Start Test" button
- [ ] Clicking "Start Test" takes the user to a pre-test configuration screen
- [ ] No admin-only buttons or links are shown to regular users

---

### Story 3.2 — Pre-Test Configuration

> **As a** user,
> **I want** to choose which sections to practise and whether to randomise questions,
> **So that** I can tailor my study session.

**Acceptance Criteria:**
- [ ] Pre-test screen shows checkboxes for each section (all pre-ticked by default)
- [ ] An "Entire Test" option selects all sections at once
- [ ] Toggle options for "Randomise question order" and "Randomise answer order" (both off by default)
- [ ] The "Start" button is disabled until at least one section is selected
- [ ] When randomisation is on, questions from all selected sections are shuffled together

---

### Story 3.3 — Answering Questions

> **As a** user taking a test,
> **I want** to answer questions one at a time with clear feedback,
> **So that** I know whether I got each one right.

**Acceptance Criteria:**
- [ ] Questions are shown one at a time
- [ ] Multiple choice questions show radio buttons (single answer) or checkboxes (multiple answers)
- [ ] Short text questions show a text input box
- [ ] Drag-and-drop questions show draggable items the user can reorder
- [ ] After submitting an answer, immediate feedback shows whether the answer was correct or incorrect
- [ ] For incorrect answers, the correct answer is revealed
- [ ] Rich text and math formulas in questions and answers render correctly
- [ ] An image (if attached to the question) displays above the question text

---

### Story 3.4 — Navigation and Review Mode

> **As a** user,
> **I want** to navigate between questions during a test using Previous and Next buttons,
> **So that** I can review my earlier answers before finishing.

**Acceptance Criteria:**
- [ ] A "Next" button advances to the next question
- [ ] A "Previous" button returns to the prior question
- [ ] Already-answered questions show the user's prior answer when revisited
- [ ] A question counter (e.g. "Question 4 of 12") shows progress
- [ ] An "End Test" button is always visible and allows ending early

---

### Story 3.5 — End Test and View Results

> **As a** user who has finished (or chosen to end) a test,
> **I want** to see a detailed results breakdown,
> **So that** I know exactly where I went wrong and can focus my revision.

**Acceptance Criteria:**
- [ ] Results show a score per section (e.g. "Chapter 1: 8/10") and a combined total
- [ ] Incorrectly answered questions are listed with the user's answer and the correct answer
- [ ] Correctly answered questions are not listed in the breakdown (to keep it focused)
- [ ] Rich text and math formulas render correctly in the results view
- [ ] A "Retry" button allows starting the test again
- [ ] A "Back to Tests" button returns to the test list

---

### Story 3.6 — Multiple Simultaneous Tests

> **As a** user,
> **I want** to take more than one test at a time,
> **So that** I can switch between topics without losing my progress.

**Acceptance Criteria:**
- [ ] Up to 5 tests can be in progress at the same time
- [ ] Each active test has independently saved progress
- [ ] A "Tests in Progress" indicator in the header shows the count of active sessions
- [ ] Switching to a different test resumes exactly where the user left off
- [ ] Starting a 6th test shows a message explaining the limit and prompts finishing one first

---

## Epic 4 — Mastery Tracking

**Goal:** Questions a user has truly mastered are removed from future practice. This keeps study sessions efficient.

---

### Story 4.1 — Question Mastery Logic

> **As a** user,
> **I want** questions I've answered correctly 5 times in a row to stop appearing,
> **So that** I spend my study time on things I haven't fully learnt yet.

**Acceptance Criteria:**
- [ ] Each question tracks a "correct streak" counter per user
- [ ] Answering a question correctly increases the counter by 1
- [ ] When the counter reaches 5, the question is marked **mastered**
- [ ] Mastered questions do not appear in future test sessions for that user
- [ ] Answering a question **incorrectly** resets the counter to 0 (even if it was at 4)
- [ ] A visual indicator (e.g. a badge or icon) shows mastered questions in the test management view

---

### Story 4.2 — Reset Mastery Counters

> **As a** user or admin,
> **I want** to reset mastery counters for all questions,
> **So that** I can do a fresh review or a final-pass review.

**Acceptance Criteria:**
- [ ] Users can reset all their own question counters to **0** (full reset) or **4** (near-mastered reset)
- [ ] Admins can reset counters for any user
- [ ] A reset to 4 means every question is one correct answer away from being mastered — useful for a final review pass
- [ ] Both reset options are accessible from the test settings or practice options screen
- [ ] A confirmation prompt is shown before resetting (to prevent accidents)

---

### Story 4.3 — Mastery Progress Visibility

> **As a** user,
> **I want** to see how many questions I've mastered in each test,
> **So that** I can understand my overall progress.

**Acceptance Criteria:**
- [ ] The test card or test detail screen shows how many questions are mastered vs. total (e.g. "12 / 30 mastered")
- [ ] The mastery count updates immediately after a test session ends
- [ ] Mastered questions are clearly distinguished from unmastered ones when browsing questions in admin view

---

## Epic 5 — Admin Analytics & User Management

**Goal:** Admins can see platform usage statistics and control who has access.

---

### Story 5.1 — Admin Dashboard

> **As an** admin,
> **I want** to see key statistics at a glance,
> **So that** I can understand how the platform is being used.

**Acceptance Criteria:**
- [ ] Admin dashboard shows: total number of users, total tests, total questions, total sections
- [ ] Shows number of currently active users (accounts not deactivated)
- [ ] Shows total mastery events (questions mastered across all users)
- [ ] Shows tests in progress (active test sessions across all users)
- [ ] Dashboard is only accessible to the admin account
- [ ] Stats are refreshed every time the dashboard is opened

---

### Story 5.2 — User Account Management

> **As an** admin,
> **I want** to activate and deactivate user accounts,
> **So that** I can control who has access to the platform.

**Acceptance Criteria:**
- [ ] Admin can view a list of all registered users with their username, status (active/inactive), and registration date
- [ ] Admin can deactivate an account with a single click (plus confirmation)
- [ ] Deactivated users cannot log in and see a clear message explaining why
- [ ] Admin can reactivate a deactivated account
- [ ] The admin's own account cannot be deactivated

---

### Story 5.3 — View User Test Progress

> **As an** admin,
> **I want** to see each user's test progress and mastery levels,
> **So that** I can monitor how students are performing.

**Acceptance Criteria:**
- [ ] Clicking a user's name shows their test progress overview
- [ ] Progress view shows which tests the user has started, how many questions they've answered, and how many they've mastered
- [ ] Progress view is read-only for admins — they cannot change a user's answers

---

## Epic 6 — Content Quality & Rich Editing

**Goal:** Questions are clear, well-formatted, and support advanced content like math and media.

---

### Story 6.1 — Math Formula Support

> **As an** admin creating a science or maths test,
> **I want** to insert mathematical formulas into questions and answers,
> **So that** equations are displayed professionally, not as raw text.

**Acceptance Criteria:**
- [ ] The question editor has a "Math" button in the toolbar
- [ ] Clicking it opens a math symbol palette with common symbols (fractions, roots, exponents, integrals, Greek letters, etc.)
- [ ] Formulas inserted from the palette render as proper typeset math (not raw LaTeX code) in the editor
- [ ] Saved formulas render correctly when users view questions during a test
- [ ] Formulas render correctly in the results breakdown view

---

### Story 6.2 — Image Upload for Questions

> **As an** admin,
> **I want** to attach an image to any question,
> **So that** diagram-based questions can be asked visually.

**Acceptance Criteria:**
- [ ] Each question has an optional image upload field
- [ ] Supported formats: JPG, PNG, GIF, WebP
- [ ] The image displays above the question text in the test-taking view
- [ ] The image does not overlap or obscure the question text
- [ ] Images can be removed or replaced when editing a question

---

### Story 6.3 — Offline-First Caching

> **As a** user on a slow or unreliable connection,
> **I want** questions to load instantly from my device after the first visit,
> **So that** my study session is not interrupted by network delays.

**Acceptance Criteria:**
- [ ] All questions and answers for a test are saved to the user's device (local storage) on first load
- [ ] Subsequent visits load questions from the local cache without making a network request
- [ ] When a test is updated, the backend records a new `updated_at` timestamp
- [ ] The app compares this timestamp against the locally cached version; if different, the cache is cleared and re-downloaded
- [ ] Both admins and users have a "Clear Cache" button to manually force a fresh download
- [ ] The cache does not persist between different user accounts

---

### Story 6.4 — Question Review Mode

> **As a** user reviewing results,
> **I want** to navigate through answered questions using Previous and Next buttons,
> **So that** I can review my session question by question without losing context.

**Acceptance Criteria:**
- [ ] Results screen includes a review mode with Previous / Next navigation
- [ ] Each question in review mode shows: the question text, the user's submitted answer, the correct answer, and whether it was marked correct or incorrect
- [ ] Review mode works for all question types (multiple choice, text, drag-and-drop)
- [ ] Rich text and math formulas render correctly in review mode

---

# PART 2 — WATERFALL FORMAT

---

## 8. System Overview

### What the System Does

Test Practice Platform is a complete web application for creating and taking practice tests. It has two main components:

1. **The Backend (Server Logic)** — Stores all data (users, tests, questions, progress) permanently. Written in Motoko, running on the Internet Computer blockchain. Think of it like a database and a web server combined, but hosted on a decentralised network instead of a single company's servers.

2. **The Frontend (User Interface)** — The website you see in your browser. Built with React (a modern web framework). Communicates with the backend to read and save data.

### System Boundaries

| What's Inside the System | What's Outside the System |
|--------------------------|---------------------------|
| User registration and login | Email delivery |
| Test and question management | SMS notifications |
| Test-taking and scoring | External learning management systems |
| Mastery tracking | Payment processing |
| Admin dashboard | Mobile native apps |
| Offline caching | Third-party analytics |
| 2FA (TOTP via Google Authenticator) | Social login (Google, Facebook) |

### Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Local development | Development and testing | http://localhost:5173 |
| Production (mainnet) | Live, publicly accessible | https://[canister-id].icp0.io |

---

## 9. Functional Requirements

This section lists every feature the system must have. Each requirement has a unique number so it can be tracked and referenced.

---

### 9.1 — Authentication

| # | Requirement | Priority |
|---|-------------|----------|
| FR-1.1 | The system shall allow new users to register with a unique username and password | Must Have |
| FR-1.2 | The system shall validate that usernames are unique at registration time | Must Have |
| FR-1.3 | The system shall allow registered users to log in with their username and password | Must Have |
| FR-1.4 | The system shall show a specific error message when login credentials are incorrect | Must Have |
| FR-1.5 | The system shall maintain a user session across browser refreshes until the user logs out | Must Have |
| FR-1.6 | The system shall log users out and clear their session when they click "Logout" | Must Have |
| FR-1.7 | The system shall allow users to enable TOTP-based two-factor authentication (2FA) via a QR code | Must Have |
| FR-1.8 | The system shall require users with 2FA enabled to enter a valid 6-digit code at each login | Must Have |
| FR-1.9 | The system shall allow users to disable 2FA by verifying both their password and a valid 6-digit code | Must Have |
| FR-1.10 | The system shall seed an admin account (adbc/abcd) on first launch | Must Have |
| FR-1.11 | The system shall ensure no newly registered user has admin privileges | Must Have |
| FR-1.12 | The system shall allow users to change their display name and password from Profile Settings | Should Have |
| FR-1.13 | The system shall require the current password before allowing a password change | Must Have |
| FR-1.14 | The system shall show a clear message when a deactivated user attempts to log in | Must Have |

---

### 9.2 — Test Management

| # | Requirement | Priority |
|---|-------------|----------|
| FR-2.1 | The system shall allow admins to create tests with a title and optional description | Must Have |
| FR-2.2 | The system shall allow admins to edit and delete tests | Must Have |
| FR-2.3 | The system shall display all tests to all logged-in users | Must Have |
| FR-2.4 | The system shall allow admins to add questions to any test | Must Have |
| FR-2.5 | The system shall support four question types: Multiple Choice (single), Multiple Choice (multiple), Short Text, and Drag-and-Drop Ordering | Must Have |
| FR-2.6 | The system shall allow admins to mark one or more answer options as correct for multiple-choice questions | Must Have |
| FR-2.7 | The system shall allow admins to upload an image for any question | Must Have |
| FR-2.8 | The system shall display uploaded question images above the question text | Must Have |
| FR-2.9 | The system shall allow admins to edit and delete any question | Must Have |
| FR-2.10 | The system shall record an updated_at timestamp on a test whenever any change is made | Must Have |

---

### 9.3 — Section Management

| # | Requirement | Priority |
|---|-------------|----------|
| FR-3.1 | The system shall allow admins to create named sections within any test | Must Have |
| FR-3.2 | The system shall allow admins to rename and delete sections | Must Have |
| FR-3.3 | The system shall allow questions to be assigned to a section at creation or via editing | Must Have |
| FR-3.4 | The system shall show only the questions belonging to a selected section when browsing sections | Must Have |
| FR-3.5 | The section list page shall display section names only — not questions | Must Have |
| FR-3.6 | The system shall require the admin to type "I want to delete" before deleting a section that contains questions | Must Have |
| FR-3.7 | Deleting a section shall delete all questions assigned to that section | Must Have |

---

### 9.4 — Test Taking

| # | Requirement | Priority |
|---|-------------|----------|
| FR-4.1 | The system shall display a pre-test configuration screen before starting a test | Must Have |
| FR-4.2 | The pre-test screen shall show checkboxes for each section; all are ticked by default | Must Have |
| FR-4.3 | The pre-test screen shall include toggles for randomising question order and answer order | Must Have |
| FR-4.4 | The system shall prevent starting a test unless at least one section is selected | Must Have |
| FR-4.5 | The system shall show questions one at a time during a test session | Must Have |
| FR-4.6 | The system shall provide immediate feedback (correct/incorrect) after each answer is submitted | Must Have |
| FR-4.7 | The system shall reveal the correct answer when the user answers incorrectly | Must Have |
| FR-4.8 | The system shall support navigation between questions using Previous and Next buttons | Must Have |
| FR-4.9 | The system shall show a question counter (e.g. "Question 4 of 12") | Must Have |
| FR-4.10 | The system shall allow a user to end a test early at any time via an "End Test" button | Must Have |
| FR-4.11 | The system shall allow up to 5 simultaneous active test sessions per user | Must Have |
| FR-4.12 | The system shall preserve each session's progress independently when a user switches tests | Must Have |
| FR-4.13 | The system shall display a "Tests in Progress" indicator showing the count of active sessions | Should Have |
| FR-4.14 | The system shall prevent a user from starting more than 5 simultaneous test sessions | Must Have |

---

### 9.5 — Results and Review

| # | Requirement | Priority |
|---|-------------|----------|
| FR-5.1 | The system shall display a results breakdown after a test session ends | Must Have |
| FR-5.2 | Results shall include a score per section and a combined total | Must Have |
| FR-5.3 | Results shall list only incorrectly answered questions with the user's answer and the correct answer | Must Have |
| FR-5.4 | The system shall provide a review mode with Previous/Next navigation through all answered questions | Should Have |
| FR-5.5 | Review mode shall show the user's submitted answer, the correct answer, and whether it was marked correct | Should Have |
| FR-5.6 | Rich text and math formulas in results and review mode shall render correctly | Must Have |
| FR-5.7 | A "Retry" button shall allow starting the same test configuration again | Should Have |

---

### 9.6 — Mastery System

| # | Requirement | Priority |
|---|-------------|----------|
| FR-6.1 | The system shall track a per-user correct-streak counter for each question | Must Have |
| FR-6.2 | The system shall increment the counter by 1 when a user answers a question correctly | Must Have |
| FR-6.3 | The system shall mark a question as mastered when the counter reaches 5 | Must Have |
| FR-6.4 | The system shall exclude mastered questions from future test sessions for that user | Must Have |
| FR-6.5 | The system shall reset the counter to 0 when a user answers a question incorrectly | Must Have |
| FR-6.6 | The system shall allow users to reset all their counters to 0 (full reset) | Must Have |
| FR-6.7 | The system shall allow users to reset all their counters to 4 (near-mastered reset) | Must Have |
| FR-6.8 | The system shall show mastery progress (mastered / total) on test cards or detail screens | Should Have |
| FR-6.9 | Both admins and users shall have access to the reset controls | Must Have |

---

### 9.7 — Offline-First Caching

| # | Requirement | Priority |
|---|-------------|----------|
| FR-7.1 | The system shall save all questions and answers for a test to the user's device on first load | Must Have |
| FR-7.2 | Subsequent loads of a cached test shall serve questions from local storage without a network request | Must Have |
| FR-7.3 | The system shall compare the cached updated_at timestamp with the backend's current value before each session | Must Have |
| FR-7.4 | If timestamps differ, the system shall clear the old cache and download the new version | Must Have |
| FR-7.5 | Both admins and users shall have access to a "Clear Cache" button that forces a fresh download | Must Have |
| FR-7.6 | Cached data shall be scoped per user — User A's cache is not visible to User B | Must Have |

---

### 9.8 — Admin Dashboard & User Management

| # | Requirement | Priority |
|---|-------------|----------|
| FR-8.1 | The admin dashboard shall display: total users, total tests, total questions, total sections | Must Have |
| FR-8.2 | The admin dashboard shall display: active users, total mastery events, active test sessions | Should Have |
| FR-8.3 | The admin shall be able to view a list of all registered users with their username and status | Must Have |
| FR-8.4 | The admin shall be able to deactivate a user account | Must Have |
| FR-8.5 | Deactivated users shall be unable to log in | Must Have |
| FR-8.6 | The admin shall be able to reactivate a deactivated user account | Must Have |
| FR-8.7 | The admin shall be unable to deactivate their own account | Must Have |
| FR-8.8 | The admin shall be able to view each user's test progress and mastery levels | Should Have |
| FR-8.9 | All admin features shall be hidden from non-admin users in the UI | Must Have |

---

### 9.9 — Rich Text and Math

| # | Requirement | Priority |
|---|-------------|----------|
| FR-9.1 | The question editor shall be a full rich text editor supporting bold, italic, underline, text colour, background colour, bullet lists, numbered lists, and hyperlinks | Must Have |
| FR-9.2 | The editor shall include a math formula insertion tool | Must Have |
| FR-9.3 | A math symbol palette shall provide common symbols (fractions, exponents, roots, integrals, Greek letters, etc.) | Must Have |
| FR-9.4 | Math formulas shall render as typeset equations (not raw LaTeX) in the test-taking view | Must Have |
| FR-9.5 | Math formulas shall render correctly in the results breakdown and review mode | Must Have |
| FR-9.6 | Plain-text questions from before the rich text editor was introduced shall continue to display correctly | Must Have |

---

## 10. Non-Functional Requirements

These requirements describe **how well** the system must work — not just what it must do.

### 10.1 — Performance

| # | Requirement |
|---|-------------|
| NFR-1.1 | Page load time (first visit) shall be under 3 seconds on a standard broadband connection |
| NFR-1.2 | Cached test loads shall feel near-instant (under 200ms from local storage) |
| NFR-1.3 | The system shall support at least 100 concurrent users without performance degradation |
| NFR-1.4 | Test results shall be calculated and displayed within 1 second of the user ending the test |

### 10.2 — Security

| # | Requirement |
|---|-------------|
| NFR-2.1 | Passwords shall be stored as cryptographic hashes — never in plain text |
| NFR-2.2 | Admin-only endpoints shall reject requests from non-admin accounts at the backend level |
| NFR-2.3 | 2FA codes shall use the TOTP standard (RFC 6238) and be valid for 30-second windows |
| NFR-2.4 | Session tokens shall be invalidated on logout |
| NFR-2.5 | All API calls shall be made over HTTPS in production |

### 10.3 — Reliability

| # | Requirement |
|---|-------------|
| NFR-3.1 | All unit tests shall pass before any production deployment |
| NFR-3.2 | The system shall have 400+ automated unit tests covering all major features |
| NFR-3.3 | Production data (users, tests, progress) shall never be lost during updates or redeployments |
| NFR-3.4 | The local development environment shall be reproducible by following the README setup steps |

### 10.4 — Usability

| # | Requirement |
|---|-------------|
| NFR-4.1 | The interface shall be fully usable on desktop, tablet, and mobile screen sizes |
| NFR-4.2 | Navigation menus shall be accessible via a hamburger menu on mobile screens |
| NFR-4.3 | Profile icon and navigation elements shall appear immediately after login without requiring a page refresh |
| NFR-4.4 | Error messages shall be written in plain language — no technical codes or jargon |
| NFR-4.5 | Destructive actions (delete, deactivate, reset) shall require confirmation before executing |

### 10.5 — Maintainability

| # | Requirement |
|---|-------------|
| NFR-5.1 | The backend host and canister ID shall be configurable via src/frontend/env.json without code changes |
| NFR-5.2 | The system shall support switching between ICP and REST backends via the backend_type setting in env.json |
| NFR-5.3 | Frontend pages shall be organised into feature folders (auth, admin, user) |
| NFR-5.4 | Business logic and UI code shall be cleanly separated |
| NFR-5.5 | The codebase shall not commit sensitive configuration (credentials, canister IDs) to version control |

### 10.6 — Accessibility

| # | Requirement |
|---|-------------|
| NFR-6.1 | All interactive elements shall be keyboard-navigable |
| NFR-6.2 | Focus states shall be visually distinct |
| NFR-6.3 | All images shall have descriptive alternative text |
| NFR-6.4 | Colour contrast shall meet WCAG AA standards |

---

## 11. Data Model Summary (Plain English)

This section describes what information the system stores. Think of each item as a type of record kept in a filing cabinet.

---

### User

A record for each person who has an account.

| Field | What it stores |
|-------|----------------|
| Username | The unique name used to log in |
| Password hash | A scrambled version of the password (never the real password) |
| Display name | The name shown in the interface |
| Is admin | Yes or No — only the seeded admin account has Yes |
| Is active | Yes or No — admins can set this to No to block access |
| 2FA secret | The secret key for the TOTP authenticator (if 2FA is enabled) |
| 2FA enabled | Whether 2FA is currently turned on |
| Created at | The date and time the account was registered |

---

### Test

A record for each practice test.

| Field | What it stores |
|-------|----------------|
| ID | A unique identifier for the test |
| Title | The test's name (e.g. "Biology Chapter 3") |
| Description | Optional longer description |
| Created at | When the test was created |
| Updated at | When the test was last changed — used by the offline cache to know if a refresh is needed |

---

### Section

A named group of questions within a test.

| Field | What it stores |
|-------|----------------|
| ID | Unique identifier |
| Test ID | Which test this section belongs to |
| Name | The section's name (e.g. "Chapter 1", "Module A") |
| Order | The display order of sections within a test |

---

### Question

A single question in a test.

| Field | What it stores |
|-------|----------------|
| ID | Unique identifier |
| Test ID | Which test this question belongs to |
| Section ID | Which section this question belongs to (optional) |
| Type | One of: multiple-choice-single, multiple-choice-multi, short-text, drag-order |
| Question text | The question itself (stored as rich HTML, including math formulas) |
| Answer options | The list of possible answers (for multiple choice and drag-order questions) |
| Correct answer | Which answer(s) are correct |
| Image URL | The address of an uploaded image (if any) |
| Order | The display order of questions within a test or section |

---

### User Progress

Tracks how far each user has got in each test.

| Field | What it stores |
|-------|----------------|
| User ID | Which user |
| Test ID | Which test |
| Current question index | Where the user is in the question sequence |
| Answers given | The answers the user has submitted so far in this session |
| Session started at | When this test session began |
| Is complete | Whether the user has finished or ended this session |

---

### Mastery Record

Tracks each user's mastery progress per question.

| Field | What it stores |
|-------|----------------|
| User ID | Which user |
| Question ID | Which question |
| Correct streak | How many times in a row this user has answered this question correctly (0–5) |
| Is mastered | Whether the streak has reached 5 |
| Last answered at | When the user last answered this question |

---

### Local Cache Entry (client-side only)

Stored in the user's browser, not on the server.

| Field | What it stores |
|-------|----------------|
| Test ID | Which test is cached |
| User ID | Which user's cache this is |
| Questions | The full list of questions and answers downloaded from the backend |
| Updated at snapshot | The updated_at value from the backend at the time of download |
| Cached at | When the download happened |

---

## 12. Deployment Guide

This section provides a complete, step-by-step guide for setting up and deploying the application. It is written for people with no prior technical experience.

---

### 12.1 — What You Need Before You Start

You will need:
- A computer running **macOS**, **Linux**, or **Windows 10/11**
- An internet connection
- About **30 minutes** for the initial setup (subsequent runs take only a few seconds)

> **Windows users:** This app requires a Linux environment to run. Windows 10/11 includes a free tool called WSL 2 (Windows Subsystem for Linux) that handles this. You will set it up in Step 1.

---

### 12.2 — Phase 1: Install Required Software

This only needs to be done once on your computer.

#### Step 1 — Windows Only: Enable WSL 2

*Skip this step if you are on macOS or Linux.*

1. Click the **Start** button and search for **PowerShell**
2. Right-click **Windows PowerShell** and choose **Run as administrator**
3. Paste this command and press Enter:
   ```
   wsl --install
   ```
4. Wait for it to complete, then **restart your computer**
5. After restarting, open the **Ubuntu** app from the Start menu
6. Set a username and password when prompted (remember these!)
7. From now on, run all commands in the **Ubuntu** window

---

#### Step 2 — Install Node.js

Node.js is a program that lets your computer run the build tools.

1. Go to **https://nodejs.org**
2. Click the big green button labelled **LTS** (this is the stable version)
3. Download and run the installer — click **Next** through all the prompts
4. When it finishes, open a terminal and type:
   ```
   node --version
   ```
5. You should see something like `v20.12.0` — any version starting with 18 or higher is fine

---

#### Step 3 — Install pnpm

pnpm is a tool that downloads the app's code dependencies.

1. In your terminal, paste:
   ```
   npm install -g pnpm
   ```
2. When it finishes, verify by typing:
   ```
   pnpm --version
   ```
3. You should see a number like `9.0.0`

---

#### Step 4 — Install dfx (Internet Computer Developer Tools)

dfx is the tool that runs and deploys the app's backend.

**macOS / Linux / WSL:**
1. In your terminal, paste this and press Enter:
   ```
   sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
   ```
2. When asked about the installation path, press Enter to accept the default
3. Close and reopen your terminal (so the new tools are recognised)
4. Verify by typing:
   ```
   dfx --version
   ```
5. You should see something like `dfx 0.24.0`

---

#### Step 5 — Install mops (Motoko Package Manager)

mops downloads the backend's code libraries.

1. In your terminal, paste:
   ```
   npm install -g mops
   ```
2. Verify by typing:
   ```
   mops --version
   ```
3. You should see a version number

---

### 12.3 — Phase 2: Set Up the Project

#### Step 6 — Get the Source Code

**Option A — You received a ZIP file:**
1. Unzip the file to a folder on your computer (e.g. Desktop)
2. In your terminal, navigate to that folder:
   ```
   cd ~/Desktop/test-practice-platform
   ```

**Option B — You have a Git repository URL:**
1. In your terminal:
   ```
   git clone YOUR_REPOSITORY_URL
   cd test-practice-platform
   ```
   Replace `YOUR_REPOSITORY_URL` with the actual URL.

---

#### Step 7 — Install Backend Libraries

From the project root folder:
```
cd src/backend
mops install
```

You will see packages downloading. Wait until it finishes, then return to the project root:
```
cd ../..
```

---

#### Step 8 — Install Frontend Libraries

```
cd src/frontend
pnpm install --prefer-offline
```

Wait for it to finish, then return to the project root:
```
cd ../..
```

---

#### Step 9 — Create Your Configuration File

```
cp src/frontend/env.example.json src/frontend/env.json
```

This copies the example config into a real config file. You will fill in values in later steps.

---

### 12.4 — Phase 3: Run the App Locally

You will need **two terminal windows open at the same time**.

#### Step 10 — Start the Local Blockchain (Terminal 1)

```
dfx start --background --clean
```

Wait until you see `Dashboard: http://localhost:4943/_/dashboard`. Do not close this terminal.

---

#### Step 11 — Deploy the Backend (Terminal 1)

```
dfx deploy backend --network local
```

Wait 30–60 seconds. At the end, you will see a canister ID (e.g. `bkyz2-fmaaa-aaaaa-qaaaq-cai`). **Copy it.**

---

#### Step 12 — Update the Configuration File

1. Open `src/frontend/env.json` in any text editor
2. Replace the placeholder canister ID with the one you copied:
   ```json
   {
     "backend_host": "http://localhost:4943",
     "backend_canister_id": "YOUR_CANISTER_ID_HERE",
     "project_id": "local",
     "ii_derivation_origin": "http://localhost:4943",
     "backend_type": "icp",
     "rest_api_url": ""
   }
   ```
3. Save the file

---

#### Step 13 — Generate Type Bindings (Terminal 1)

```
pnpm bindgen
```

This generates the files that let the frontend communicate with the backend. No errors means success.

---

#### Step 14 — Start the Frontend (Terminal 2)

```
cd src/frontend
pnpm dev
```

Wait until you see `Local: http://localhost:5173/`. Do not close this terminal.

---

#### Step 15 — Open the App

1. Open your browser and go to **http://localhost:5173**
2. Log in with the default admin account:
   - **Username:** `adbc`
   - **Password:** `abcd`

The app is now running locally. Change the default password immediately from Profile Settings.

---

### 12.5 — Phase 4: Run Unit Tests

```
cd src/frontend
pnpm vitest run
```

All tests must show **passed**. Run this before every deployment.

---

### 12.6 — Phase 5: Deploy to Production (Internet Computer Mainnet)

#### Step 17 — Create an Internet Identity

1. Go to **https://identity.internetcomputer.org**
2. Click **Create New Internet Identity** and follow the prompts
3. Write down your anchor number

#### Step 18 — Get Free Deployment Credits (Cycles)

1. Go to **https://faucet.dfinity.org**
2. Log in and follow the instructions to claim free cycles

#### Step 19 — Set Up a Developer Identity

```
dfx identity new my-identity
dfx identity use my-identity
```

#### Step 20 — Deploy Backend to Mainnet

```
dfx deploy backend --network ic
```

Copy the canister ID shown at the end.

#### Step 21 — Update env.json for Mainnet

```json
{
  "backend_host": "https://ic0.app",
  "backend_canister_id": "YOUR_MAINNET_CANISTER_ID",
  "project_id": "YOUR_CAFFEINE_PROJECT_ID",
  "ii_derivation_origin": "https://YOUR_CANISTER_ID.icp0.io",
  "backend_type": "icp",
  "rest_api_url": ""
}
```

#### Step 22 — Build and Deploy Frontend

```
cd src/frontend && pnpm build
cd ../.. && dfx deploy frontend --network ic
```

Your app's public URL will be shown: `https://YOUR_FRONTEND_CANISTER_ID.icp0.io`

---

### 12.7 — Switching the Backend (Advanced)

Edit `src/frontend/env.json` and change `backend_type`:

| `backend_type` value | What it does |
|---------------------|--------------|
| `"icp"` | Uses the Internet Computer blockchain backend (default) |
| `"rest"` | Uses a REST API server (e.g. Express.js, Django, any HTTP API) |

For REST mode, also set `rest_api_url` to your server's address. Restart the frontend server after saving.

---

### 12.8 — Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| "Port 4943 is already in use" | Run `dfx stop` then `dfx start --background --clean` |
| Blank screen / cannot connect | Check env.json has the correct canister ID; ensure dfx is running |
| "Module not found" errors | Run `cd src/frontend && pnpm install --prefer-offline` |
| Tests fail with type errors | Run `pnpm bindgen` from the project root, then re-run tests |
| "Invalid credentials" login error | Username is `adbc` (not "admin"), password is `abcd` |
| "Your account has been deactivated" | Ask the admin to reactivate your account from Manage Users |
| 2FA QR code won't scan | Use "Copy secret key" in Google Authenticator instead |
| "Insufficient cycles" on mainnet | Top up at https://faucet.dfinity.org |
| Data disappeared after restart | Remove `--clean` flag from `dfx start` to preserve local data |

---

### 12.9 — All Commands Quick Reference

```bash
# LOCAL DEVELOPMENT

# Install backend libraries (from src/backend/)
mops install

# Install frontend libraries (from src/frontend/)
pnpm install --prefer-offline

# Start local blockchain (from project root)
dfx start --background --clean

# Deploy backend locally (from project root)
dfx deploy backend --network local

# Generate type bindings (from project root)
pnpm bindgen

# Start frontend dev server (from src/frontend/)
pnpm dev

# Run all unit tests (from src/frontend/)
pnpm vitest run

# PRODUCTION DEPLOYMENT

# Build frontend (from src/frontend/)
pnpm build

# Deploy backend to mainnet (from project root)
dfx deploy backend --network ic

# Deploy frontend to mainnet (from project root)
dfx deploy frontend --network ic
```

---

### 12.10 — Default Credentials

| Account | Username | Password | Role |
|---------|----------|----------|------|
| Admin | `adbc` | `abcd` | Administrator |
| Any new registration | (your choice) | (your choice) | Regular User |

> **Security reminder:** Change the default admin password immediately after first login in production.

---

*This document was prepared for the Test Practice Platform project. Last updated: May 2026.*
*Built with love using [caffeine.ai](https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral)*
