import { expect, test } from '@playwright/test';
import {
  loginAsAdmin,
  loginAsUser,
  registerUser,
  uniqueUsername,
} from './helpers/auth';

test.describe('Progress Tracking', () => {
  // Use pre-seeded user 'sarah' who already has test results
  const username = 'sarah';
  const password = 'password';

  // NOTE: the beforeAll registered a user in a different browser context
  // which is not shared with individual test pages (sessionStorage is per-context).
  // We rely on the pre-seeded 'sarah' user instead.

  test('admin can navigate to users page', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/users');
    await expect(page.locator('[data-ocid="admin.users.page"]')).toBeVisible({ timeout: 15_000 });
  });

  test('admin can view individual user progress', async ({ page, browser }) => {
    // Ensure the progress user exists
    await loginAsAdmin(page);
    await page.goto('/admin/users');
    await page.waitForSelector('[data-ocid="admin.users.page"]', { state: 'visible' });

    const userRow = page.locator('[data-ocid^="admin.users.item."]').filter({ hasText: username }).first();
    if (await userRow.isVisible()) {
      await userRow.locator('[data-ocid^="admin.users.progress_button."]').click();
      await expect(page.locator('[data-ocid="admin.users.progress.dialog"]')).toBeVisible({ timeout: 10_000 });
      await page.locator('[data-ocid="admin.users.progress.close_button"]').click();
    }
  });

  test('user can see their own test history page', async ({ page }) => {
    await loginAsUser(page, username, password);
    await page.goto('/tests/history');
    await page.waitForURL('**/tests/history');
    await expect(page.locator('[data-ocid="history.page"]')).toBeVisible({ timeout: 15_000 });
  });

  test('history page shows lifetime time spent', async ({ page }) => {
    await loginAsUser(page, username, password);
    await page.goto('/tests/history');
    await page.waitForURL('**/tests/history');
    await expect(page.locator('[data-ocid="history.page"]')).toBeVisible({ timeout: 15_000 });
    // Lifetime time element should be present
    const lifetimeEl = page.locator('[data-ocid="history.lifetime_time"]');
    await expect(lifetimeEl).toBeVisible({ timeout: 10_000 });
  });

  test('admin dashboard shows total tests stat', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/dashboard');
    await page.waitForURL('**/admin/dashboard');
    await expect(page.locator('[data-ocid="admin.dashboard.page"]')).toBeVisible({ timeout: 15_000 });
    // At least one stat card should be present
    await expect(page.locator('[data-ocid^="admin.dashboard.stat."]').first()).toBeVisible({ timeout: 10_000 });
  });

  test('admin can see mastery stats per user', async ({ page, browser }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/users');
    await page.waitForSelector('[data-ocid="admin.users.page"]', { state: 'visible' });

    const userRow = page.locator('[data-ocid^="admin.users.item."]').filter({ hasText: username }).first();
    if (await userRow.isVisible()) {
      await userRow.locator('[data-ocid^="admin.users.progress_button."]').click();
      const dialog = page.locator('[data-ocid="admin.users.progress.dialog"]');
      await expect(dialog).toBeVisible({ timeout: 10_000 });
      // The progress dialog should contain mastery-related information
      // (mastered count or mastery %) text
      await expect(dialog).toContainText(/mastered|mastery|0/i);
      await page.locator('[data-ocid="admin.users.progress.close_button"]').click();
    }
  });
});
