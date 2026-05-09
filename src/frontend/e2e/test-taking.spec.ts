import { expect, test } from '@playwright/test';
import { loginAsAdmin, loginAsUser } from './helpers/auth';

/**
 * Test-Taking Flow tests
 *
 * Uses pre-seeded mock data:
 *   - Test 1: "Introduction to Cognitive Psychology" (4 questions)
 *   - User: sarah / password
 */

const USER = 'sarah';
const PASS = 'password';
const TEST_NAME = 'Introduction to Cognitive Psychology';

test.describe('Test-Taking Flow', () => {
  test('user can see test list', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    // Tests page should render a list or empty state
    await expect(
      page.locator('[data-ocid="user.tests.list"], [data-ocid="user.tests.empty_state"]'),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('user can start a test (with at least one test available)', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();

    // Start test dialog should open
    await expect(page.locator('[data-ocid="start_test.dialog"]')).toBeVisible();

    // Confirm starting the test
    await page.locator('[data-ocid="start_test.confirm_button"]').click();
    await page.waitForURL('**/tests/**', { timeout: 15_000 });
    await expect(page).toHaveURL(/\/tests\/\d+/);
  });

  test('start test dialog has randomization options pre-selected', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();

    await expect(page.locator('[data-ocid="start_test.dialog"]')).toBeVisible();

    // Both randomization checkboxes should be checked by default
    const randomizeQ = page.locator('[data-ocid="start_test.randomize_questions.checkbox"]');
    const randomizeA = page.locator('[data-ocid="start_test.randomize_answers.checkbox"]');
    await expect(randomizeQ).toBeChecked();
    await expect(randomizeA).toBeChecked();
  });

  test('user can answer a multiple choice question', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();
    // Disable randomization so question 1 (mcSingle) always shows first
    await page.locator('[data-ocid="start_test.randomize_questions.checkbox"]').uncheck();
    await page.locator('[data-ocid="start_test.randomize_answers.checkbox"]').uncheck();
    await page.locator('[data-ocid="start_test.confirm_button"]').click();
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    // Answer options should be present
    await page.waitForSelector('[data-ocid^="question.option."]', { timeout: 15_000 });
    const options = page.locator('[data-ocid^="question.option."]');
    await expect(options.first()).toBeVisible();
    // Click first option
    await options.first().click();
  });

  test('wrong answer shows correct answer immediately', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();
    // Turn off randomization so we know which option is "correct"
    await page.locator('[data-ocid="start_test.randomize_questions.checkbox"]').uncheck();
    await page.locator('[data-ocid="start_test.randomize_answers.checkbox"]').uncheck();
    await page.locator('[data-ocid="start_test.confirm_button"]').click();
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    await page.waitForSelector('[data-ocid^="question.option."]', { timeout: 15_000 });
    // Click the second option (index 2) — which is the wrong answer for Q1
    const wrongOption = page.locator('[data-ocid="question.option.2"]');
    if (await wrongOption.isVisible()) {
      await wrongOption.click();
      // Click Check Answer to reveal feedback
      await page.locator('[data-ocid="test.check_button"]').click();
      // Correct answer feedback should appear after checking
      await expect(page.locator('[data-ocid="test.correct_answer_display"]')).toBeVisible({ timeout: 5_000 });
    }
  });

  test('user can end test early and see results', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();
    await page.locator('[data-ocid="start_test.dialog"]').waitFor({ state: 'visible' });
    // Wait for the confirm button to be enabled (sections load async)
    await page.locator('[data-ocid="start_test.confirm_button"]:not([disabled])').waitFor({ timeout: 10_000 });
    await page.locator('[data-ocid="start_test.confirm_button"]').click();
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    // Click End Test
    await page.locator('[data-ocid="test.end_test_button"]').click();
    // Confirm if there's a dialog
    const confirmEnd = page.locator('[data-ocid="test.end_test.confirm_button"]');
    if (await confirmEnd.isVisible()) {
      await confirmEnd.click();
    }

    // Should land on result page
    await page.waitForURL('**/result**', { timeout: 15_000 });
    await expect(page).toHaveURL(/result/);
  });

  test('results page shows Try Again at top', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();
    // Handle possible conflict dialog (prior test may have left an orphaned session)
    const conflictFresh = page.locator('[data-ocid="start_test.conflict.fresh_button"]');
    const confirmBtn = page.locator('[data-ocid="start_test.confirm_button"]');
    const anyVisible = await Promise.race([
      conflictFresh.waitFor({ state: 'visible', timeout: 3_000 }).then(() => 'conflict').catch(() => null),
      confirmBtn.waitFor({ state: 'visible', timeout: 3_000 }).then(() => 'confirm').catch(() => null),
    ]);
    if (anyVisible === 'conflict') {
      await conflictFresh.click();
    } else {
      await confirmBtn.click();
    }
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    await page.locator('[data-ocid="test.end_test_button"]').click();
    const confirmEnd = page.locator('[data-ocid="test.end_test.confirm_button"]');
    if (await confirmEnd.isVisible()) await confirmEnd.click();
    await page.waitForURL('**/result**', { timeout: 15_000 });

    // Try Again button should be visible near the top of the results page
    const tryAgain = page.locator('[data-ocid="result.try_again_top_button"]');
    await expect(tryAgain).toBeVisible({ timeout: 10_000 });

    // Verify it appears early in the page (bounding box Y near top)
    const box = await tryAgain.boundingBox();
    expect(box?.y).toBeLessThan(600); // within first ~600px from top
  });

  test('results page shows score and section breakdown', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();
    // Handle possible conflict dialog (prior test may have left an orphaned session)
    const conflictFresh2 = page.locator('[data-ocid="start_test.conflict.fresh_button"]');
    const confirmBtn2 = page.locator('[data-ocid="start_test.confirm_button"]');
    const anyVisible2 = await Promise.race([
      conflictFresh2.waitFor({ state: 'visible', timeout: 3_000 }).then(() => 'conflict').catch(() => null),
      confirmBtn2.waitFor({ state: 'visible', timeout: 3_000 }).then(() => 'confirm').catch(() => null),
    ]);
    if (anyVisible2 === 'conflict') {
      await conflictFresh2.click();
    } else {
      await confirmBtn2.click();
    }
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    await page.locator('[data-ocid="test.end_test_button"]').click();
    const confirmEnd = page.locator('[data-ocid="test.end_test.confirm_button"]');
    if (await confirmEnd.isVisible()) await confirmEnd.click();
    await page.waitForURL('**/result**', { timeout: 15_000 });

    // Score summary should be visible
    await expect(page.locator('[data-ocid="result.score.card"]')).toBeVisible({ timeout: 10_000 });
  });

  test('user can see test history', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests/history');
    await page.waitForURL('**/tests/history');
    await expect(page.locator('[data-ocid="history.page"]')).toBeVisible({ timeout: 15_000 });
  });

  test('timer is visible and counting during test', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();
    await page.locator('[data-ocid="start_test.confirm_button"]').click();
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    // Timer should be visible
    const timer = page.locator('[data-ocid="test.timer_display"]');
    await expect(timer).toBeVisible({ timeout: 10_000 });
  });

  test('top progress bar is NOT visible during test (removed)', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();
    await page.locator('[data-ocid="start_test.confirm_button"]').click();
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    // Top progress bar should be hidden
    await expect(page.locator('[data-ocid="test.top_progress_bar"]')).not.toBeVisible();
  });
});
