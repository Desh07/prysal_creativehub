const { test, expect } = require('@playwright/test');

test('API should return 200 OK for valid admin credentials', async ({ request }) => {

    // 1. Send the POST request directly to the API
    const response = await request.post('/api/auth', {
        data: {
            username: 'admin',
            password: 'prysaladmin' // Use your real password here (or process.env.ADMIN_PASSWORD)
        }
    });

    // 2. Assert that the status code is exactly 200
    expect(response.status()).toBe(200);

    // 3. Assert that the response body contains "success: true"
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
});


test('API should return 401 for invalid admin credentials', async ({ request }) => {

    // 1. Send the POST request directly to the API
    const response = await request.post('/api/auth', {
        data: {
            username: 'admin',
            password: 'wrongpassword'
        }
    });

    // 2. Assert that the status code is exactly 401
    expect(response.status()).toBe(401);

    // 3. Assert that the response body contains "success: true"
    const responseBody = await response.json();
    expect(responseBody.success).toBe(false);
});
