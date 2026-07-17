const { test, expect } = require('@playwright/test');
const { LandingPage } = require('./pages/LandingPage');

test('User can successfully select the service - Design hub', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.goto();
    await landingPage.navigateToDesignHub();
    await expect(page).toHaveURL(/.*design/);
});

test('User can successfully select the service - Print hub', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.goto();
    await landingPage.navigateToPrintHub();
    await expect(page).toHaveURL(/.*print/);
});
