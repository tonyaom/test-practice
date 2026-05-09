import type { Locator, Page } from '@playwright/test';

export class LoginPageObject {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-ocid="login.username.input"]');
    this.passwordInput = page.locator('[data-ocid="login.password.input"]');
    this.submitButton = page.locator('[data-ocid="login.submit_button"]');
    this.errorMessage = page.locator('[data-ocid="login.error_state"]');
    this.registerLink = page.locator('[data-ocid="login.register.link"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async fillCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillCredentials(username, password);
    await this.submit();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return this.errorMessage.innerText();
  }
}
