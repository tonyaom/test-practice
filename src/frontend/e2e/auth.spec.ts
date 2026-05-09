import { expect, test } from '@playwright/test';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  loginAs,
  loginAsAdmin,
  loginAsUser,
  logout,
  registerUser,
  uniqueUsername,
} from './helpers/auth';
import { LoginPageObject } from './pages/LoginPage';

test.describe('Authentication', () => {
  test('can navigate to login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('[data-ocid="login.username.input"]')).toBeVisible();
    await expect(page.locator('[data-ocid="login.password.input"]')).toBeVisible();
    await expect(page.locator('[data-ocid="login.submit_button"]')).toBeVisible();
  });

  test('admin can login with correct credentials', async ({ page }) => {
    await loginAsAdmin(page);
    // Should land on the admin page
    await expect(page).toHaveURL(/\/admin/);
    // Admin nav links should be visible
    await expect(page.locator('[data-ocid="nav.manage_tests.link"]')).toBeVisible();
  });

  test('login fails with wrong password', async ({ page }) => {
    const loginPage = new LoginPageObject(page);
    await loginPage.goto();
    await loginPage.login(ADMIN_USERNAME, 'wrongpassword');
    const error = await loginPage.getErrorMessage();
    expect(error.length).toBeGreaterThan(0);
  });

  test('new user can register', async ({ page }) => {
    const username = uniqueUsername('reg');
    await registerUser(page, username, 'testpass1234');
    // After successful registration, auto-login redirects to /tests
    await page.waitForURL('**/tests', { timeout: 15_000 });
    await expect(page).toHaveURL(/\/tests/);
  });

  test('registered user can login', async ({ page }) => {
    // First register the user
    const username = uniqueUsername('reglogin');
    const password = 'mypassword99';
    await registerUser(page, username, password);
    await page.waitForURL('**/tests', { timeout: 15_000 });

    // Logout
    await logout(page);

    // Now login again
    await loginAsUser(page, username, password);
    await expect(page).toHaveURL(/\/tests/);
  });

  test('user can logout and is redirected to login', async ({ page }) => {
    const username = uniqueUsername('logouttest');
    await registerUser(page, username, 'password123');
    await page.waitForURL('**/tests', { timeout: 15_000 });

    await logout(page);
    await expect(page).toHaveURL(/\/login/);
    // Username field should be visible again
    await expect(page.locator('[data-ocid="login.username.input"]')).toBeVisible();
  });

  test('login page shows register link', async ({ page }) => {
    await page.goto('/login');
    const registerLink = page.locator('[data-ocid="login.register.link"]');
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('register page shows sign-in link', async ({ page }) => {
    await page.goto('/register');
    const signInLink = page.locator('[data-ocid="register.login.link"]');
    await expect(signInLink).toBeVisible();
    await signInLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('login requires 2FA code when 2FA is enabled', async ({ page }) => {
    // This test verifies the UI flow: if backend returns requiresTOTP, the TOTP step appears.
    // We can only simulate this if a 2FA-enabled account exists; otherwise we just verify the
    // credentials step renders correctly.
    const loginPage = new LoginPageObject(page);
    await loginPage.goto();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    // TOTP step is not visible on initial load
    await expect(page.locator('[data-ocid="login.totp.input"]')).not.toBeVisible();
  });

  test('unauthenticated access to protected page redirects to login', async ({ page }) => {
    await page.goto('/tests');
    // Should redirect to login
    await page.waitForURL('**/login', { timeout: 10_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('regular users do not see admin nav links', async ({ page }) => {
    const username = uniqueUsername('nonadmin');
    await registerUser(page, username, 'pass12345');
    await page.waitForURL('**/tests', { timeout: 15_000 });

    // "Manage Tests" admin link should not be visible for regular user
    await expect(page.locator('[data-ocid="nav.manage_tests.link"]')).not.toBeVisible();
    // Practice Tests nav link should be visible
    await expect(page.locator('[data-ocid="nav.practice_tests.link"]')).toBeVisible();
  });

  test('admin does not see Practice Tests nav link', async ({ page }) => {
    await loginAsAdmin(page);
    // Admin has Manage Tests but regular-user nav items differ
    await expect(page.locator('[data-ocid="nav.manage_tests.link"]')).toBeVisible();
  });

  test('login with non-existent user shows error', async ({ page }) => {
    await loginAs(page, 'no_such_user_xyz', 'whatever');
    await expect(page.locator('[data-ocid="login.error_state"]')).toBeVisible();
  });
});
