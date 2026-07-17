// tests/pages/AdminLoginPage.js

export class AdminLoginPage {

    /**
   * The constructor is the first thing that runs when we create this object.
   * We pass it the Playwright `page` so this class knows which browser tab to control.
   */

    constructor(page) {
        this.page = page;


        // Locators: We define all the elements on the page HERE and only here.

        this.usernameInput = page.getByRole('textbox', { name: 'Enter username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Enter password' });

        this.printHubToggle = page.getByRole('button', { name: 'Print Hub' });
        this.designHubToggle = page.getByRole('button', { name: 'Design Hub' });

        this.loginButton = page.getByRole('button', { name: 'Sign In' });

        this.errorMessage = page.getByText('Invalid username or password');

    }

    async goto() {
        await this.page.goto('/admin/login');
    }

    /**
   * Action: Perform the login flow
   */

    async login(username, password, portalName) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);

        // Select the correct portal
        if (portalName === 'Print') {
            await this.printHubToggle.click();
        } else if (portalName === 'Design') {
            await this.designHubToggle.click();
        }

        // Wait for React to hydrate (as per your original test)

        await this.page.waitForTimeout(1000);
        await this.loginButton.click();
    }




}
