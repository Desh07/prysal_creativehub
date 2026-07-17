const { test, expect } = require('@playwright/test');

test('User can successfully select the service - Design hub', async ({ page }) => {
    // 1. Load the base url
    await page.goto('/');

    // 2. Selecting the Design Hub from the landing page
    await page.getByRole('link', { name: 'Design Hub Web Design, UI/UX' }).click();

    // 3. Assertion: User should be redirected to the Design hub page
    await expect(page).toHaveURL(/.*design/);

});

test('User can successfully select the service - Print hub', async ({ page }) => {
    // 1. Load the base url
    await page.goto('/');

    // 2. Selecting the Print Hub from the landing page
    await page.getByRole('link', { name: 'Print Shop Printouts,' }).click();

    // 3. Assertion: User should be redirected to the Print hub page
    await expect(page).toHaveURL(/.*print/);

});

