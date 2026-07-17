const { test, expect } = require('@playwright/test');

test('WhatsApp link redirects correctly', async ({ page }) => {

    // 1. Go to the page where the link is
    await page.goto('/design');

    // 2. Click the WhatsApp link
    // (If this locator is still failing, let me know!)
    await page.getByRole('link').filter({ hasText: /^$/ }).nth(3).click();

    // 3. Assert that the current page changed to WhatsApp
    await expect(page).toHaveURL(/.*whatsapp.com.*/i);
});
