export class LandingPage {
    constructor(page) {
        this.page = page;
        this.designHubLink = page.getByRole('link', { name: 'Design Hub Web Design, UI/UX' });
        this.printHubLink = page.getByRole('link', { name: 'Print Shop Printouts,' });
    }

    async goto() {
        await this.page.goto('/');
    }

    async navigateToDesignHub() {
        await this.designHubLink.click();
    }

    async navigateToPrintHub() {
        await this.printHubLink.click();
    }
}
