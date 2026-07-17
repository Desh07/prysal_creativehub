const { test, expect } = require('@playwright/test');

test('Admin can log in to Print Hub successfully', async ({ page }) => {
    // 1. Navigate to the correct admin login page
    await page.goto('/admin/login');

    // 2. Fill in the username
    // (Note: Playwright's .fill() automatically clicks the box first, so we don't need a separate .click() step!)
    await page.getByRole('textbox', { name: 'Enter username' }).fill('admin');

    // 3. SECURE LOGIN: Pull the password from the .env vault!
    // (Make sure your .env file says ADMIN_PASSWORD=***********)
    await page.getByRole('textbox', { name: 'Enter password' }).fill(process.env.ADMIN_PASSWORD || '');

    // 4. Select the portal
    await page.getByRole('button', { name: 'Print Hub' }).click();

    // FORCE WEBKIT TO WAIT FOR REACT TO HYDRATE (1000 milliseconds = 1 second)
    await page.waitForTimeout(1000);

    // 5. Click the Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 6. Assertion: Wait for the dashboard to load (Update this if the URL is different!)
    await expect(page).toHaveURL(/.*admin\?site=print/);
});

test('Admin can log in to Design Hub successfully', async ({ page }) => {
    // 1. Navigate to the correct admin login page
    await page.goto('/admin/login');

    // 2. Fill in the username
    // (Note: Playwright's .fill() automatically clicks the box first, so we don't need a separate .click() step!)
    await page.getByRole('textbox', { name: 'Enter username' }).fill('admin');

    // 3. SECURE LOGIN: Pull the password from the .env vault!
    // (Make sure your .env file says ADMIN_PASSWORD=***********)
    await page.getByRole('textbox', { name: 'Enter password' }).fill(process.env.ADMIN_PASSWORD || '');

    // 4. Select the portal
    await page.getByRole('button', { name: 'Design Hub' }).click();

    // FORCE WEBKIT TO WAIT FOR REACT TO HYDRATE (1000 milliseconds = 1 second)
    await page.waitForTimeout(1000);

    // 5. Click the Sign In button
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 6. Assertion: Wait for the dashboard to load (Update this if the URL is different!)
    await expect(page).toHaveURL(/.*admin\?site=design/);
});
