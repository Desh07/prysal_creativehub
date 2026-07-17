const { test, expect } = require('@playwright/test');
const { PrintHubPage } = require('./pages/PrintHubPage');
const { DesignHubPage } = require('./pages/DesignHubPage');

test('User can successfully navigate to the design hub from the printhub', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X dimensions
    const printHubPage = new PrintHubPage(page);
    await printHubPage.goto();
    await printHubPage.switchToDesignHub();
    await expect(page).toHaveURL(/.*design/);
});

test('User can successfully navigate to the print hub from the design hub', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X dimensions
    const designHubPage = new DesignHubPage(page);
    await designHubPage.goto();
    await designHubPage.switchToPrintHub();
    await expect(page).toHaveURL(/.*print/);
});