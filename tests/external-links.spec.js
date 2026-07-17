const { test, expect } = require('@playwright/test');
const { DesignHubPage } = require('./pages/DesignHubPage');

test('WhatsApp link redirects correctly', async ({ page }) => {
    const designHubPage = new DesignHubPage(page);
    await designHubPage.goto();
    await designHubPage.clickWhatsappLink();
    await expect(page).toHaveURL(/.*whatsapp.com.*/i);
});
