const { test, expect } = require('@playwright/test');
const { AdminLoginPage } = require('./pages/AdminLoginPage');

test('Design hub login: An error message should be displayed when trying to log in using incorrect password', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    // Attempt to log in with a WRONG password ('@admin')
    await loginPage.login('admin', '@admin', 'Design');

    // Assert using our new locator!
    await expect(loginPage.errorMessage).toBeVisible();
});

test('Print hub login: An error message should be displayed when trying to log in using incorrect password', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();

    await loginPage.login('admin', '@admin', 'Print');
    await expect(loginPage.errorMessage).toBeVisible();
});
