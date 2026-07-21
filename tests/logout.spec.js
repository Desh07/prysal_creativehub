const { test, expect } = require('@playwright/test');
const { AdminLoginPage } = require('./pages/AdminLoginPage');
const { AdminDashboardPage } = require('./pages/AdminDashboardPage');

test('Admin can successfully logout of the system', async ({ page }) => {
    // 1. Initialize both Page Objects
    const loginPage = new AdminLoginPage(page);
    const dashboardPage = new AdminDashboardPage(page);

    // 2. Perform the Login Page Actions
    await loginPage.goto();
    await loginPage.login('admin', process.env.ADMIN_PASSWORD || '', 'Print');
    await expect(page).toHaveURL(/.*admin\?site=print/);

    // 3. Perform the Dashboard Page Actions
    await dashboardPage.logout();
    await expect(page).toHaveURL(/.*admin\/login/);

    // 4. Security Check: Try to force your way back into the dashboard!
    await page.goto('/admin');
    // 5. Assert that the server kicks you back to the login page
    await expect(page).toHaveURL(/.*admin\/login/);
});
