const { test, expect } = require('@playwright/test');
// 1. Import our new Page Object!
const { AdminLoginPage } = require('./pages/AdminLoginPage');

test('Admin can log in to Print Hub successfully', async ({ page }) => {
    // 2. Instantiate (create) the Page Object
    const loginPage = new AdminLoginPage(page);

    // 3. Command the Page Object to do the heavy lifting!
    await loginPage.goto();

    // Pass in the username, password, and the portal name!
    await loginPage.login('admin', process.env.ADMIN_PASSWORD || '', 'Print');

    // 4. Assertion
    await expect(page).toHaveURL(/.*admin\?site=print/);
});

test('Admin can log in to Design Hub successfully', async ({ page }) => {
    const loginPage = new AdminLoginPage(page);

    await loginPage.goto();
    // Same exact code, just pass 'Design' instead of 'Print'!
    await loginPage.login('admin', process.env.ADMIN_PASSWORD || '', 'Design');

    await expect(page).toHaveURL(/.*admin\?site=design/);
});
