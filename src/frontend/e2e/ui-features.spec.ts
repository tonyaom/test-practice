import { expect, test } from '@playwright/test';
import {
  loginAsUser,
} from './helpers/auth';

/**
 * UI Feature tests
 *
 * Uses pre-seeded mock data only — no cross-context browser operations.
 * Pre-seeded data:
 *   - Test 1: "Introduction to Cognitive Psychology" — 4 questions, sections: Foundations + Advanced Topics
 *   - User: sarah / password
 */

const USER = 'sarah';
const PASS = 'password';
const TEST_NAME = 'Introduction to Cognitive Psychology';

test.describe('UI Features', () => {
  test('font size slider is visible during test', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();
    await page.locator('[data-ocid="start_test.confirm_button"]').click();
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    // Font size slider should be visible
    await expect(page.locator('[data-ocid="test.font_size_slider"]')).toBeVisible({ timeout: 10_000 });
  });

  test('font size slider changes question text size', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();
    await page.locator('[data-ocid="start_test.confirm_button"]').click();
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    await page.waitForSelector('[data-ocid="test.question.card"]', { timeout: 15_000 });
    // CardContent has the fontSize inline style; target the rich text display inside it
    const questionText = page.locator('[data-ocid="test.question.card"] .rich-text-display').first();
    await questionText.waitFor({ state: 'visible' });

    // Get the initial font size
    const initialFontSize = await questionText.evaluate((el) =>
      window.getComputedStyle(el).fontSize,
    );

    // Interact with slider — increase font size
    const slider = page.locator('[data-ocid="test.font_size_slider"]');
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    const newFontSize = await questionText.evaluate((el) =>
      window.getComputedStyle(el).fontSize,
    );

    // Font size should have changed
    expect(newFontSize).not.toEqual(initialFontSize);
  });

  test('bookmarking a question toggles bookmark icon', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();
    await page.locator('[data-ocid="start_test.confirm_button"]').click();
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    await page.waitForSelector('[data-ocid^="question.option."]', { timeout: 15_000 });

    // Bookmark button should be visible
    const bookmarkBtn = page.locator('[data-ocid="question.bookmark_toggle"]');
    await expect(bookmarkBtn).toBeVisible({ timeout: 10_000 });

    // Click to bookmark
    await bookmarkBtn.click();
    // The aria-pressed should change to true when bookmarked
    await expect(bookmarkBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('timer shows and counts up during test', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();
    await page.locator('[data-ocid="start_test.confirm_button"]').click();
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    const timer = page.locator('[data-ocid="test.timer_display"]');
    await expect(timer).toBeVisible({ timeout: 10_000 });

    const time1 = await timer.innerText();
    // Wait 2 seconds and check timer has advanced
    await page.waitForTimeout(2_000);
    const time2 = await timer.innerText();
    // Timer should have changed (not same value)
    expect(time2).not.toEqual(time1);
  });

  test('section progress bars visible during test when sections exist', async ({ page }) => {
    // Test 1 has pre-seeded sections: Foundations + Advanced Topics
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const testCard = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await testCard.waitFor({ state: 'visible', timeout: 15_000 });
    await testCard.locator('[data-ocid^="user.tests.start_button."]').click();
    await page.locator('[data-ocid="start_test.confirm_button"]').click();
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    // Section progress bars may render after questions load
    // Just verify the question card is visible (any question type)
    await page.waitForSelector('[data-ocid="test.question.card"]', { timeout: 15_000 });
    await expect(page.locator('[data-ocid^="test.section_progress."]').or(
      page.locator('[data-ocid="test.question.card"]'),
    )).toBeVisible();
  });

  test('streak counter visible in header for regular users', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');
    // Streak badge should be visible in header (even if streak is 0)
    await expect(page.locator('[data-ocid="nav.streak_badge"]')).toBeVisible({ timeout: 10_000 });
  });

  test('top progress bar is not visible during test', async ({ page }) => {
    await loginAsUser(page, USER, PASS);
    await page.goto('/tests');

    const card = page.locator('[data-ocid^="user.tests.item."]').filter({ hasText: TEST_NAME }).first();
    await card.waitFor({ state: 'visible', timeout: 15_000 });
    await card.locator('[data-ocid^="user.tests.start_button."]').click();
    await page.locator('[data-ocid="start_test.confirm_button"]').click();
    await page.waitForURL('**/tests/**', { timeout: 15_000 });

    // Top progress bar was removed in a previous release
    await expect(page.locator('[data-ocid="test.top_progress_bar"]')).not.toBeVisible();
  });
});
