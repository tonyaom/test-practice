# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-tests.spec.ts >> Admin — Test Management >> admin can add a multiple choice question
- Location: e2e/admin-tests.spec.ts:94:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('What is 2 + 2?')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('What is 2 + 2?')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e6]:
        - link "PrepStream" [ref=e7] [cursor=pointer]:
          - /url: /admin
          - img [ref=e9]
          - generic [ref=e11]: PrepStream
        - generic [ref=e12]:
          - navigation [ref=e13]:
            - link "Dashboard" [ref=e14] [cursor=pointer]:
              - /url: /admin/dashboard
              - img [ref=e15]
              - text: Dashboard
            - link "Manage Tests" [ref=e20] [cursor=pointer]:
              - /url: /admin
              - img [ref=e21]
              - text: Manage Tests
            - link "Users" [ref=e23] [cursor=pointer]:
              - /url: /admin/users
              - img [ref=e24]
              - text: Users
            - link "Practice Tests" [ref=e29] [cursor=pointer]:
              - /url: /tests
              - img [ref=e30]
              - text: Practice Tests
            - link "History" [ref=e32] [cursor=pointer]:
              - /url: /tests/history
              - img [ref=e33]
              - text: History
          - generic [ref=e37]:
            - button "Open profile settings" [ref=e38] [cursor=pointer]:
              - img [ref=e40]
              - generic [ref=e43]:
                - generic [ref=e44]: Admin
                - generic [ref=e45]: admin
            - button "Logout" [ref=e46] [cursor=pointer]:
              - img
              - generic [ref=e47]: Logout
    - main [ref=e48]:
      - generic [ref=e49]:
        - generic [ref=e50]:
          - link "My Tests" [ref=e51] [cursor=pointer]:
            - /url: /admin
            - img [ref=e52]
            - text: My Tests
          - generic [ref=e54]: /
          - generic [ref=e55]: E2E QTest 1778288309608
        - generic [ref=e56]:
          - generic [ref=e57]:
            - heading "E2E QTest 1778288309608" [level=1] [ref=e58]
            - paragraph [ref=e59]: 1 question
          - button "Add Question" [ref=e60] [cursor=pointer]:
            - img
            - text: Add Question
        - generic [ref=e61]:
          - generic [ref=e62]:
            - generic [ref=e63]:
              - img [ref=e64]
              - heading "Sections" [level=2] [ref=e68]
              - generic [ref=e69]: (0)
            - button "Add Section" [ref=e70] [cursor=pointer]:
              - img
              - text: Add Section
          - list [ref=e71]:
            - listitem [ref=e72]:
              - button "Uncategorised Questions not assigned to any section" [ref=e73] [cursor=pointer]:
                - paragraph [ref=e74]: Uncategorised
                - paragraph [ref=e75]: Questions not assigned to any section
              - generic [ref=e76]: 1 question
    - contentinfo [ref=e77]:
      - paragraph [ref=e79]:
        - text: © 2026. Built with love using
        - link "caffeine.ai" [ref=e80] [cursor=pointer]:
          - /url: https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=localhost
  - region "Notifications alt+T"
```

# Test source

```ts
  26  |     await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });
  27  |     await expect(page.getByText(testName)).toBeVisible();
  28  |   });
  29  | 
  30  |   test('admin can edit a test name', async ({ page }) => {
  31  |     // Create a test first
  32  |     const original = `E2E EditMe ${TIMESTAMP}`;
  33  |     const updated = `E2E Edited ${TIMESTAMP}`;
  34  | 
  35  |     await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
  36  |     await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
  37  |     await page.locator('[data-ocid="admin.create_test.name_input"]').fill(original);
  38  |     await page.locator('[data-ocid="admin.create_test.submit_button"]').click();
  39  |     await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });
  40  | 
  41  |     // Click the edit button on the first matching test card
  42  |     const card = page.locator('[data-ocid^="admin.tests.item."]').filter({ hasText: original }).first();
  43  |     await card.locator('[data-ocid^="admin.tests.edit_button."]').click();
  44  | 
  45  |     // Update the name
  46  |     await page.locator('[data-ocid="admin.edit_test.name_input"]').waitFor({ state: 'visible' });
  47  |     await page.locator('[data-ocid="admin.edit_test.name_input"]').clear();
  48  |     await page.locator('[data-ocid="admin.edit_test.name_input"]').fill(updated);
  49  |     await page.locator('[data-ocid="admin.edit_test.submit_button"]').click();
  50  |     await page.locator('[data-ocid="admin.edit_test.submit_button"]').waitFor({ state: 'hidden' });
  51  | 
  52  |     await expect(page.getByText(updated)).toBeVisible();
  53  |   });
  54  | 
  55  |   test('admin can delete a test', async ({ page }) => {
  56  |     const testName = `E2E Delete ${TIMESTAMP}`;
  57  | 
  58  |     // Create it
  59  |     await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
  60  |     await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
  61  |     await page.locator('[data-ocid="admin.create_test.name_input"]').fill(testName);
  62  |     await page.locator('[data-ocid="admin.create_test.submit_button"]').click();
  63  |     await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });
  64  | 
  65  |     // Click delete on the matching card
  66  |     const card = page.locator('[data-ocid^="admin.tests.item."]').filter({ hasText: testName }).first();
  67  |     await card.locator('[data-ocid^="admin.tests.delete_button."]').click();
  68  | 
  69  |     // Confirm deletion
  70  |     await page.locator('[data-ocid="admin.delete_test.confirm_button"]').waitFor({ state: 'visible' });
  71  |     await page.locator('[data-ocid="admin.delete_test.confirm_button"]').click();
  72  |     await page.locator('[data-ocid="admin.delete_test.confirm_button"]').waitFor({ state: 'hidden' });
  73  | 
  74  |     await expect(page.getByText(testName)).not.toBeVisible();
  75  |   });
  76  | 
  77  |   test('admin can navigate to test detail page', async ({ page }) => {
  78  |     // Create a test to navigate into
  79  |     const testName = `E2E Detail ${TIMESTAMP}`;
  80  |     await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
  81  |     await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
  82  |     await page.locator('[data-ocid="admin.create_test.name_input"]').fill(testName);
  83  |     await page.locator('[data-ocid="admin.create_test.submit_button"]').click();
  84  |     await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });
  85  | 
  86  |     // Click the Manage button
  87  |     const card = page.locator('[data-ocid^="admin.tests.item."]').filter({ hasText: testName }).first();
  88  |     await card.locator('[data-ocid^="admin.tests.manage."]').click();
  89  | 
  90  |     await page.waitForURL('**/admin/tests/**', { timeout: 10_000 });
  91  |     await expect(page).toHaveURL(/\/admin\/tests\/.+/);
  92  |   });
  93  | 
  94  |   test('admin can add a multiple choice question', async ({ page }) => {
  95  |     // Navigate to an existing test or create one
  96  |     const testName = `E2E QTest ${TIMESTAMP}`;
  97  |     await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
  98  |     await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
  99  |     await page.locator('[data-ocid="admin.create_test.name_input"]').fill(testName);
  100 |     await page.locator('[data-ocid="admin.create_test.submit_button"]').click();
  101 |     await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });
  102 | 
  103 |     const card = page.locator('[data-ocid^="admin.tests.item."]').filter({ hasText: testName }).first();
  104 |     await card.locator('[data-ocid^="admin.tests.manage."]').click();
  105 |     await page.waitForURL('**/admin/tests/**');
  106 | 
  107 |     // Click the Add Question button
  108 |     await page.locator('[data-ocid="admin.question.add_button"]').click();
  109 |     await page.locator('[data-ocid="admin.question.text_input"]').waitFor({ state: 'visible' });
  110 | 
  111 |     // Type question text into Quill rich text editor (contenteditable)
  112 |     const textEditor = page.locator('[data-ocid="admin.question.text_input"] .ql-editor');
  113 |     await textEditor.waitFor({ state: 'visible' });
  114 |     await textEditor.click();
  115 |     await page.keyboard.type('What is 2 + 2?');
  116 | 
  117 |     // Fill option 1 as correct answer
  118 |     await page.locator('[data-ocid="admin.question.option_input.1"]').fill('4');
  119 |     await page.locator('[data-ocid="admin.question.option_input.2"]').fill('3');
  120 | 
  121 |     // Submit
  122 |     await page.locator('[data-ocid="admin.question.submit_button"]').click();
  123 |     await page.locator('[data-ocid="admin.question.submit_button"]').waitFor({ state: 'hidden' });
  124 | 
  125 |     // Question should appear in the list
> 126 |     await expect(page.getByText('What is 2 + 2?')).toBeVisible();
      |                                                    ^ Error: expect(locator).toBeVisible() failed
  127 |   });
  128 | 
  129 |   test('admin can add a section', async ({ page }) => {
  130 |     const testName = `E2E Sections ${TIMESTAMP}`;
  131 |     await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
  132 |     await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
  133 |     await page.locator('[data-ocid="admin.create_test.name_input"]').fill(testName);
  134 |     await page.locator('[data-ocid="admin.create_test.submit_button"]').click();
  135 |     await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });
  136 | 
  137 |     const card = page.locator('[data-ocid^="admin.tests.item."]').filter({ hasText: testName }).first();
  138 |     await card.locator('[data-ocid^="admin.tests.manage."]').click();
  139 |     await page.waitForURL('**/admin/tests/**');
  140 | 
  141 |     // Add a section
  142 |     await page.locator('[data-ocid="admin.section.add_button"]').click();
  143 |     await page.locator('[data-ocid="admin.section.name_input"]').waitFor({ state: 'visible' });
  144 |     await page.locator('[data-ocid="admin.section.name_input"]').fill('Chapter 1');
  145 |     await page.locator('[data-ocid="admin.section.save_button"]').click();
  146 |     await page.locator('[data-ocid="admin.section.save_button"]').waitFor({ state: 'hidden' });
  147 | 
  148 |     await expect(page.getByText('Chapter 1')).toBeVisible();
  149 |   });
  150 | 
  151 |   test('admin can delete a section with confirmation phrase', async ({ page }) => {
  152 |     const testName = `E2E DelSection ${TIMESTAMP}`;
  153 |     await page.locator('[data-ocid="admin.create_test.open_modal_button"]').click();
  154 |     await page.locator('[data-ocid="admin.create_test.name_input"]').waitFor({ state: 'visible' });
  155 |     await page.locator('[data-ocid="admin.create_test.name_input"]').fill(testName);
  156 |     await page.locator('[data-ocid="admin.create_test.submit_button"]').click();
  157 |     await page.locator('[data-ocid="admin.create_test.submit_button"]').waitFor({ state: 'hidden' });
  158 | 
  159 |     const card = page.locator('[data-ocid^="admin.tests.item."]').filter({ hasText: testName }).first();
  160 |     await card.locator('[data-ocid^="admin.tests.manage."]').click();
  161 |     await page.waitForURL('**/admin/tests/**');
  162 | 
  163 |     // Create a section to delete
  164 |     await page.locator('[data-ocid="admin.section.add_button"]').click();
  165 |     await page.locator('[data-ocid="admin.section.name_input"]').waitFor({ state: 'visible' });
  166 |     await page.locator('[data-ocid="admin.section.name_input"]').fill('ToDelete');
  167 |     await page.locator('[data-ocid="admin.section.save_button"]').click();
  168 |     await page.locator('[data-ocid="admin.section.save_button"]').waitFor({ state: 'hidden' });
  169 |     await expect(page.getByText('ToDelete')).toBeVisible();
  170 | 
  171 |     // Delete it
  172 |     await page.locator('[data-ocid="admin.section.delete_button.1"]').click();
  173 |     await page.locator('[data-ocid="admin.section.delete_confirm_input"]').waitFor({ state: 'visible' });
  174 |     // Type wrong phrase first — button should remain disabled
  175 |     await page.locator('[data-ocid="admin.section.delete_confirm_input"]').fill('wrong phrase');
  176 |     const confirmBtn = page.locator('[data-ocid="admin.section.delete_confirm_button"]');
  177 |     await expect(confirmBtn).toBeDisabled();
  178 | 
  179 |     // Type correct phrase
  180 |     await page.locator('[data-ocid="admin.section.delete_confirm_input"]').clear();
  181 |     await page.locator('[data-ocid="admin.section.delete_confirm_input"]').fill('I want to delete');
  182 |     await expect(confirmBtn).toBeEnabled();
  183 |     await confirmBtn.click();
  184 |     await confirmBtn.waitFor({ state: 'hidden' });
  185 | 
  186 |     await expect(page.getByText('ToDelete')).not.toBeVisible();
  187 |   });
  188 | 
  189 |   test('admin dashboard is accessible', async ({ page }) => {
  190 |     await page.goto('/admin/dashboard');
  191 |     await page.waitForURL('**/admin/dashboard');
  192 |     // Dashboard should show some stats
  193 |     await expect(page.locator('[data-ocid="admin.dashboard.page"]')).toBeVisible();
  194 |   });
  195 | });
  196 | 
```