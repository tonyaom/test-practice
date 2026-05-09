import { expect, test } from '@playwright/test';
import {
  loginAs,
  loginAsAdmin,
} from './helpers/auth';

/**
 * Admin User Management tests
 * 
 * These tests use pre-seeded mock users rather than creating new ones across
 * browser contexts (which would not share client-side mock state):
 *   alice  — active user
 *   charlie — inactive user (pre-seeded as deactivated)
 *   bob    — active user
 */

test.describe('Admin — User Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('admin can navigate to user list', async ({ page }) => {
    await page.locator('[data-ocid="admin.tests.view_users_button"]').click();
    await page.waitForURL('**/admin/users', { timeout: 10_000 });
    await expect(page).toHaveURL(/\/admin\/users/);
    // Users page heading
    await expect(page.locator('[data-ocid="admin.users.page"]')).toBeVisible();
  });

  test('admin can see user list entries', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForURL('**/admin/users');
    await page.waitForSelector('[data-ocid="admin.users.page"]', { state: 'visible' });
    // Should show at least the admin themselves
    await page.waitForSelector('[data-ocid^="admin.users.item."]', { timeout: 10_000 });
    const items = page.locator('[data-ocid^="admin.users.item."]');
    await expect(items.first()).toBeVisible();
  });

  test('admin can deactivate a user', async ({ page }) => {
    // Use pre-seeded active user 'alice'
    await page.goto('/admin/users');
    await page.waitForSelector('[data-ocid="admin.users.page"]', { state: 'visible' });

    // Find alice's row (she is pre-seeded as active)
    const userRow = page.locator('[data-ocid^="admin.users.item."]').filter({ hasText: 'alice' }).first();
    await userRow.waitFor({ state: 'visible', timeout: 10_000 });
    await userRow.locator('[data-ocid^="admin.users.deactivate_button."]').click();

    // Confirm if there's a confirm dialog
    const confirmBtn = page.locator('[data-ocid="admin.users.deactivate_confirm_button"]');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await confirmBtn.waitFor({ state: 'hidden' });
    }

    // The user's status badge should change to Inactive
    await expect(userRow.getByText(/deactivated|inactive/i)).toBeVisible({ timeout: 10_000 });

    // Restore alice for other tests
    await userRow.locator('[data-ocid^="admin.users.activate_button."]').click();
    await expect(userRow.getByText(/active/i)).toBeVisible({ timeout: 5_000 });
  });

  test('deactivated user cannot login', async ({ page }) => {
    // charlie is pre-seeded as inactive — try to login and expect error
    // First navigate to login page and try logging in as charlie
    await page.goto('/login');
    await page.locator('[data-ocid="login.username.input"]').fill('charlie');
    await page.locator('[data-ocid="login.password.input"]').fill('password');
    await page.locator('[data-ocid="login.submit_button"]').click();
    // Should see an error about account being deactivated
    await expect(page.locator('[data-ocid="login.error_state"]')).toBeVisible({ timeout: 10_000 });
    const errorText = await page.locator('[data-ocid="login.error_state"]').innerText();
    // Charlie is deactivated — should show account deactivated message
    expect(errorText.toLowerCase()).toMatch(/deactivated|account/);
  });

  test('admin can reactivate a user', async ({ page }) => {
    // charlie is pre-seeded as inactive
    await page.goto('/admin/users');
    await page.waitForSelector('[data-ocid="admin.users.page"]', { state: 'visible' });
    const userRow = page.locator('[data-ocid^="admin.users.item."]').filter({ hasText: 'charlie' }).first();
    await userRow.waitFor({ state: 'visible', timeout: 10_000 });

    // Charlie should be inactive — activate
    await userRow.locator('[data-ocid^="admin.users.activate_button."]').click();
    await expect(userRow.getByText(/active/i)).toBeVisible({ timeout: 10_000 });

    // Restore charlie to inactive for other tests
    await userRow.locator('[data-ocid^="admin.users.deactivate_button."]').click();
    const confirmBtn = page.locator('[data-ocid="admin.users.deactivate_confirm_button"]');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await confirmBtn.waitFor({ state: 'hidden' });
    }
    await expect(userRow.getByText(/deactivated|inactive/i)).toBeVisible({ timeout: 5_000 });
  });

  test('admin can view user test progress', async ({ page }) => {
    // Use pre-seeded user 'bob'
    await page.goto('/admin/users');
    await page.waitForSelector('[data-ocid="admin.users.page"]', { state: 'visible' });
    const userRow = page.locator('[data-ocid^="admin.users.item."]').filter({ hasText: 'bob' }).first();
    await userRow.waitFor({ state: 'visible', timeout: 10_000 });

    // Click the progress/view button
    await userRow.locator('[data-ocid^="admin.users.progress_button."]').click();
    // Progress modal should open
    await expect(page.locator('[data-ocid="admin.users.progress.dialog"]')).toBeVisible({ timeout: 10_000 });
    // Close the dialog
    await page.locator('[data-ocid="admin.users.progress.close_button"]').click();
    await expect(page.locator('[data-ocid="admin.users.progress.dialog"]')).not.toBeVisible({ timeout: 5_000 });
  });

  test('admin dashboard shows key stats', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForURL('**/admin/dashboard');
    await expect(page.locator('[data-ocid="admin.dashboard.page"]')).toBeVisible();
    // Should show some stat cards
    const statCards = page.locator('[data-ocid^="admin.dashboard.stat."]');
    await expect(statCards.first()).toBeVisible({ timeout: 10_000 });
  });
});
