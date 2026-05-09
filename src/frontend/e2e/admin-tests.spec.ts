import { expect, test } from '@playwright/test';
import { loginAsAdmin, uniqueUsername } from './helpers/auth';

const TIMESTAMP = Date.now();

test.describe('Admin — Test Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('admin can see Manage Tests link in header', async ({ page }) => {
    await expect(page.locator('[data-ocid="nav.manage_tests.link"]')).toBeVisible();
  });

  test('admin can create a new test', async ({ page }) => {
    const testName = `E2E Test ${TIMESTAMP}`;

    // Open create dialog
    await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
    await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
    await page.locator('[data-ocid="admin.create_test.name_input"]').fill(testName);
    await page.locator('[data-ocid="admin.create_test.description_input"]').fill('Created by e2e test');
    await page.locator('[data-ocid="admin.create_test.submit_button"]').click();

    // Modal should close and test should appear in the grid
    await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });
    await expect(page.getByText(testName)).toBeVisible();
  });

  test('admin can edit a test name', async ({ page }) => {
    // Create a test first
    const original = `E2E EditMe ${TIMESTAMP}`;
    const updated = `E2E Edited ${TIMESTAMP}`;

    await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
    await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
    await page.locator('[data-ocid="admin.create_test.name_input"]').fill(original);
    await page.locator('[data-ocid="admin.create_test.submit_button"]').click();
    await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });

    // Click the edit button on the first matching test card
    const card = page.locator('[data-ocid^="admin.tests.item."]').filter({ hasText: original }).first();
    await card.locator('[data-ocid^="admin.tests.edit_button."]').click();

    // Update the name
    await page.locator('[data-ocid="admin.edit_test.name_input"]').waitFor({ state: 'visible' });
    await page.locator('[data-ocid="admin.edit_test.name_input"]').clear();
    await page.locator('[data-ocid="admin.edit_test.name_input"]').fill(updated);
    await page.locator('[data-ocid="admin.edit_test.submit_button"]').click();
    await page.locator('[data-ocid="admin.edit_test.submit_button"]').waitFor({ state: 'hidden' });

    await expect(page.getByText(updated)).toBeVisible();
  });

  test('admin can delete a test', async ({ page }) => {
    const testName = `E2E Delete ${TIMESTAMP}`;

    // Create it
    await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
    await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
    await page.locator('[data-ocid="admin.create_test.name_input"]').fill(testName);
    await page.locator('[data-ocid="admin.create_test.submit_button"]').click();
    await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });

    // Click delete on the matching card
    const card = page.locator('[data-ocid^="admin.tests.item."]').filter({ hasText: testName }).first();
    await card.locator('[data-ocid^="admin.tests.delete_button."]').click();

    // Confirm deletion
    await page.locator('[data-ocid="admin.delete_test.confirm_button"]').waitFor({ state: 'visible' });
    await page.locator('[data-ocid="admin.delete_test.confirm_button"]').click();
    await page.locator('[data-ocid="admin.delete_test.confirm_button"]').waitFor({ state: 'hidden' });

    await expect(page.getByText(testName)).not.toBeVisible();
  });

  test('admin can navigate to test detail page', async ({ page }) => {
    // Create a test to navigate into
    const testName = `E2E Detail ${TIMESTAMP}`;
    await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
    await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
    await page.locator('[data-ocid="admin.create_test.name_input"]').fill(testName);
    await page.locator('[data-ocid="admin.create_test.submit_button"]').click();
    await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });

    // Click the Manage button
    const card = page.locator('[data-ocid^="admin.tests.item."]').filter({ hasText: testName }).first();
    await card.locator('[data-ocid^="admin.tests.manage."]').click();

    await page.waitForURL('**/admin/tests/**', { timeout: 10_000 });
    await expect(page).toHaveURL(/\/admin\/tests\/.+/);
  });

  test('admin can add a multiple choice question', async ({ page }) => {
    // Navigate to an existing test or create one
    const testName = `E2E QTest ${TIMESTAMP}`;
    await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
    await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
    await page.locator('[data-ocid="admin.create_test.name_input"]').fill(testName);
    await page.locator('[data-ocid="admin.create_test.submit_button"]').click();
    await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });

    const card = page.locator('[data-ocid^="admin.tests.item."]').filter({ hasText: testName }).first();
    await card.locator('[data-ocid^="admin.tests.manage."]').click();
    await page.waitForURL('**/admin/tests/**');

    // Click the Add Question button
    await page.locator('[data-ocid="admin.question.add_button"]').click();
    await page.locator('[data-ocid="admin.question.text_input"]').waitFor({ state: 'visible' });

    // Type question text into Quill rich text editor (contenteditable)
    const textEditor = page.locator('[data-ocid="admin.question.text_input"] .ql-editor');
    await textEditor.waitFor({ state: 'visible' });
    await textEditor.click();
    await page.keyboard.type('What is 2 + 2?');

    // Fill option 1 as correct answer
    await page.locator('[data-ocid="admin.question.option_input.1"]').fill('4');
    await page.locator('[data-ocid="admin.question.option_input.2"]').fill('3');

    // Submit
    await page.locator('[data-ocid="admin.question.submit_button"]').click();
    await page.locator('[data-ocid="admin.question.submit_button"]').waitFor({ state: 'hidden' });

    // Question should appear in the list
    await expect(page.getByText('What is 2 + 2?')).toBeVisible();
  });

  test('admin can add a section', async ({ page }) => {
    const testName = `E2E Sections ${TIMESTAMP}`;
    await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
    await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
    await page.locator('[data-ocid="admin.create_test.name_input"]').fill(testName);
    await page.locator('[data-ocid="admin.create_test.submit_button"]').click();
    await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });

    const card = page.locator('[data-ocid^="admin.tests.item."]').filter({ hasText: testName }).first();
    await card.locator('[data-ocid^="admin.tests.manage."]').click();
    await page.waitForURL('**/admin/tests/**');

    // Add a section
    await page.locator('[data-ocid="admin.section.add_button"]').click();
    await page.locator('[data-ocid="admin.section.name_input"]').waitFor({ state: 'visible' });
    await page.locator('[data-ocid="admin.section.name_input"]').fill('Chapter 1');
    await page.locator('[data-ocid="admin.section.save_button"]').click();
    await page.locator('[data-ocid="admin.section.save_button"]').waitFor({ state: 'hidden' });

    await expect(page.getByText('Chapter 1')).toBeVisible();
  });

  test('admin can delete a section with confirmation phrase', async ({ page }) => {
    const testName = `E2E DelSection ${TIMESTAMP}`;
    await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
    await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
    await page.locator('[data-ocid="admin.create_test.name_input"]').fill(testName);
    await page.locator('[data-ocid="admin.create_test.submit_button"]').click();
    await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });

    const card = page.locator('[data-ocid^="admin.tests.item."]').filter({ hasText: testName }).first();
    await card.locator('[data-ocid^="admin.tests.manage."]').click();
    await page.waitForURL('**/admin/tests/**');

    // Create a section to delete
    await page.locator('[data-ocid="admin.section.add_button"]').click();
    await page.locator('[data-ocid="admin.section.name_input"]').waitFor({ state: 'visible' });
    await page.locator('[data-ocid="admin.section.name_input"]').fill('ToDelete');
    await page.locator('[data-ocid="admin.section.save_button"]').click();
    await page.locator('[data-ocid="admin.section.save_button"]').waitFor({ state: 'hidden' });
    await expect(page.getByText('ToDelete')).toBeVisible();

    // Delete it
    await page.locator('[data-ocid="admin.section.delete_button.1"]').click();
    await page.locator('[data-ocid="admin.section.delete_confirm_input"]').waitFor({ state: 'visible' });
    // Type wrong phrase first — button should remain disabled
    await page.locator('[data-ocid="admin.section.delete_confirm_input"]').fill('wrong phrase');
    const confirmBtn = page.locator('[data-ocid="admin.section.delete_confirm_button"]');
    await expect(confirmBtn).toBeDisabled();

    // Type correct phrase
    await page.locator('[data-ocid="admin.section.delete_confirm_input"]').clear();
    await page.locator('[data-ocid="admin.section.delete_confirm_input"]').fill('I want to delete');
    await expect(confirmBtn).toBeEnabled();
    await confirmBtn.click();
    await confirmBtn.waitFor({ state: 'hidden' });

    await expect(page.getByText('ToDelete')).not.toBeVisible();
  });

  test('admin dashboard is accessible', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForURL('**/admin/dashboard');
    // Dashboard should show some stats
    await expect(page.locator('[data-ocid="admin.dashboard.page"]')).toBeVisible();
  });
});
