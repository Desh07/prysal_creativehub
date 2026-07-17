// tests/pages/AdminDashboardPage.js

export class AdminDashboardPage {
    constructor(page) {
        this.page = page;
        // The only thing we do on the dashboard right now is sign out!
        this.signOutButton = page.getByRole('button', { name: 'Sign Out' });
    }

    /**
     * Action: Click the sign out button
     */
    async logout() {
        await this.signOutButton.click();
    }
}
