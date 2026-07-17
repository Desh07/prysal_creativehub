const { test, expect } = require('@playwright/test');

test('User can successfully navigate to the design hub from the printhub', async ({ page }) => {

    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X dimensions

    // Load the print hub page
    await page.goto('/print');

    // Click the switch button
    await page.getByRole('link', { name: 'Switch to Design Hub' }).click();

    // Assertion: Verify that the page has loaded successfully
    await expect(page).toHaveURL(/.*design/);

});

test('User can successfully navigate to the print hub from the design hub', async ({ page }) => {

    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X dimensions

    // Load the design hub page
    await page.goto('/design');

    // Click the switch button
    await page.getByRole('link', { name: 'Switch to Print Hub' }).click();

    // Assertion: Verify that the page has loaded successfully
    await expect(page).toHaveURL(/.*print/);


});