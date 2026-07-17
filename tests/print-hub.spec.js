const { test, expect } = require('@playwright/test');
const { PrintHubPage } = require('./pages/PrintHubPage');

test('Print Hub page should load successfully', async ({ page }) => {
    const printHubPage = new PrintHubPage(page);
    await printHubPage.goto();
    await expect(page).toHaveURL(/.*print/);
});
