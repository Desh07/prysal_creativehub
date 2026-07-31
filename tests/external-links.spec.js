const { test, expect } = require('@playwright/test');
const { DesignHubPage } = require('./pages/DesignHubPage');

test('WhatsApp link redirects correctly', async ({ page }) => {
    const designHubPage = new DesignHubPage(page);
    await designHubPage.goto();
    // Wait for the new tab to open before clicking
    const popupPromise = page.waitForEvent('popup');
    await designHubPage.clickWhatsappLink();
    const popup = await popupPromise;
    
    // Check the URL of the new tab
    await expect(popup).toHaveURL(/.*whatsapp.com.*/i);
});
