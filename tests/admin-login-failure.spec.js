const { test, expect } = require('@playwright/test');

test('Design hub login: An error message should be displayed when trying to log in using incorrect password', async ({ page }) => {
    // 1. Navigate to the admin login page
    await page.goto('/admin/login');

    // 2. Enter valid username
    await page.getByRole('textbox', { name: 'Enter username' }).fill('admin');

    // 3. Enter incorrect password
    await page.getByRole('textbox', { name: 'Enter password' }).fill('@admin');

    // 4. Select the portal: Design Hub
    await page.getByRole('button', { name: 'Design Hub' }).click();

    // 5. Click Signin
    await page.getByRole('button', { name: 'Sign In' }).click()

    // 6. Assertion: Verify error message displays
    await expect(page.getByText('Invalid username or password')).toBeVisible();
});

test('Print hub login: An error message should be displayed when trying to log in using incorrect password', async ({ page }) => {
    // 1. Navigate to the admin login page
    await page.goto('/admin/login');

    // 2. Enter valid username
    await page.getByRole('textbox', { name: 'Enter username' }).fill('admin');

    // 3. Enter incorrect password
    await page.getByRole('textbox', { name: 'Enter password' }).fill('@admin');

    // 4. Select the portal: Print Hub
    await page.getByRole('button', { name: 'Print Hub' }).click();

    // 5. Click Signin
    await page.getByRole('button', { name: 'Sign In' }).click()

    // 6. Assertion: Verify error message displays
    await expect(page.getByText('Invalid username or password')).toBeVisible();
});
