// tests/pages/AdminDashboardPage.js

export class AdminDashboardPage {
    constructor(page) {
        this.page = page;
        // The only thing we do on the dashboard right now is sign out!
        this.signOutButton = page.getByRole('button', { name: 'Sign Out' });
    }

    /**
     * Action: Click the sign out button and confirm in the modal
     */
    async logout() {
        // Click the first Sign Out button (in the nav bar)
        await this.page.getByRole('button', { name: 'Sign Out' }).first().click();
        
        // Click the second Sign Out button (inside the confirmation modal)
        await this.page.getByRole('button', { name: 'Sign Out' }).last().click();
    }
}
