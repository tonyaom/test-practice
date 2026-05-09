import type { Page } from '@playwright/test';

export const ADMIN_USERNAME = 'adbc';
export const ADMIN_PASSWORD = 'abcd';

/**
 * Fill in the login form and submit.
 * Does NOT assert success — caller decides what to expect next.
 */
export async function loginAs(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  await page.goto('/login');
  await page.waitForSelector('[data-ocid="login.username.input"]', { state: 'visible' });
  await page.locator('[data-ocid="login.username.input"]').fill(username);
  await page.locator('[data-ocid="login.password.input"]').fill(password);
  await page.locator('[data-ocid="login.submit_button"]').click();
}

/** Login as the seeded admin account and wait for redirect. */
export async function loginAsAdmin(page: Page): Promise<void> {
  await loginAs(page, ADMIN_USERNAME, ADMIN_PASSWORD);
  // Admin is redirected to /admin
  await page.waitForURL('**/admin', { timeout: 15_000 });
}

/** Login as a regular user and wait for redirect. */
export async function loginAsUser(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  await loginAs(page, username, password);
  // Regular users are redirected to /tests
  await page.waitForURL('**/tests', { timeout: 15_000 });
}

/**
 * Register a new account via the registration form.
 * Does NOT assert success — caller decides what to expect next.
 */
export async function registerUser(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  await page.goto('/register');
  await page.waitForSelector('[data-ocid="register.username.input"]', { state: 'visible' });
  await page.locator('[data-ocid="register.username.input"]').fill(username);
  await page.locator('[data-ocid="register.password.input"]').fill(password);
  await page.locator('[data-ocid="register.confirm_password.input"]').fill(password);
  await page.locator('[data-ocid="register.submit_button"]').click();
}

/** Click the logout button and wait for redirect to /login. */
export async function logout(page: Page): Promise<void> {
  await page.locator('[data-ocid="nav.logout_button"]').click();
  await page.waitForURL('**/login', { timeout: 10_000 });
}

/** Generate a unique username using a timestamp suffix. */
export function uniqueUsername(prefix = 'e2euser'): string {
  return `${prefix}${Date.now()}`;
}
