import type { Locator, Page } from '@playwright/test';

export class AdminTestDetailPageObject {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to the admin test detail page for a given test ID. */
  async goto(testId: string): Promise<void> {
    await this.page.goto(`/admin/tests/${testId}`);
    await this.page.waitForSelector('[data-ocid="admin.test_detail.page"]', {
      state: 'visible',
      timeout: 15_000,
    }).catch(() => {
      // The page may not have a root data-ocid; wait for an add-question button instead
    });
  }

  /** Click the Add Section button. */
  async clickAddSection(): Promise<void> {
    await this.page.locator('[data-ocid="admin.section.add_button"]').click();
  }

  /** Fill in and submit the Create Section form. */
  async createSection(name: string, description = ''): Promise<void> {
    await this.clickAddSection();
    await this.page.locator('[data-ocid="admin.section.name_input"]').fill(name);
    if (description) {
      await this.page.locator('[data-ocid="admin.section.description_input"]').fill(description);
    }
    await this.page.locator('[data-ocid="admin.section.save_button"]').click();
    // Wait for modal to close
    await this.page.locator('[data-ocid="admin.section.save_button"]').waitFor({ state: 'hidden' });
  }

  /** Click the Add Question button (global or section-level). */
  async clickAddQuestion(ocid = 'admin.question.add_button'): Promise<void> {
    await this.page.locator(`[data-ocid="${ocid}"]`).click();
  }

  /** Get the question count shown in the section header badge. */
  async getSectionQuestionCount(sectionIndex: number): Promise<number> {
    const badge = this.page.locator(`[data-ocid="admin.section.question_count.${sectionIndex}"]`);
    const text = await badge.innerText();
    return parseInt(text.replace(/\D/g, ''), 10);
  }

  /** Delete a section using the required confirmation phrase. */
  async deleteSection(sectionIndex: number): Promise<void> {
    await this.page
      .locator(`[data-ocid="admin.section.delete_button.${sectionIndex}"]`)
      .click();
    // Type the confirmation phrase
    await this.page.locator('[data-ocid="admin.section.delete_confirm_input"]').fill('I want to delete');
    await this.page.locator('[data-ocid="admin.section.delete_confirm_button"]').click();
    await this.page.locator('[data-ocid="admin.section.delete_confirm_button"]').waitFor({ state: 'hidden' });
  }
}
