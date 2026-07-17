// We import 'test' and 'expect' from the Playwright library.
// 'test' is used to declare a test block, and 'expect' is used for assertions (checking if things are true).
const { test, expect } = require('@playwright/test');

// This is our test block. We give it a descriptive name.
test('Print Hub page should load successfully', async ({ page }) => {

    // 1. Navigate to the Print Hub using our configured baseURL
    await page.goto('/print');

    // 2. We assert (expect) that the URL of the page actually contains '/print'
    await expect(page).toHaveURL(/.*print/);

});
