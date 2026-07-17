const { test, expect } = require('@playwright/test');

test('User can successfully switch from design hub to print hub', async ({ page }) => {
    // 1. Navigate to the correct design page
    await page.goto('/design');

    // 2. Click the toggle button
    await page.getByRole('link', { name: 'Switch to Print Hub' }).click();

    //3. Assertion: Wait for the page to switch to printhub
    await expect(page).toHaveURL(/.*print/)

})

test('User can successfully switch from printhub to design hub', async ({ page }) => {
    // 1. Navigate to the correct print page
    await page.goto('/print');

    // 2. Click the toogle button
    await page.getByRole('link', { name: 'Switch to Design Hub' }).click();

    //3. Assertion: Wait for the page to switch to designhub
    await expect(page).toHaveURL(/.*design/)
})