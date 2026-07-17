const { test, expect } = require('@playwright/test');
const { DesignHubPage } = require('./pages/DesignHubPage');

test('Design Hub page should load successfully', async ({ page }) => {
    const designHubPage = new DesignHubPage(page);
    await designHubPage.goto();
    await expect(page).toHaveURL(/.*design/);
});
