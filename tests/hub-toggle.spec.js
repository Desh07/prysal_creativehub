const { test, expect } = require('@playwright/test');
const { DesignHubPage } = require('./pages/DesignHubPage');
const { PrintHubPage } = require('./pages/PrintHubPage');

test('User can successfully switch from design hub to print hub', async ({ page }) => {
    const designHubPage = new DesignHubPage(page);
    await designHubPage.goto();
    await designHubPage.switchToPrintHub();
    await expect(page).toHaveURL(/.*print/);
});

test('User can successfully switch from printhub to design hub', async ({ page }) => {
    const printHubPage = new PrintHubPage(page);
    await printHubPage.goto();
    await printHubPage.switchToDesignHub();
    await expect(page).toHaveURL(/.*design/);
});