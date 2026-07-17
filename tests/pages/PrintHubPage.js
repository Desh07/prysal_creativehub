export class PrintHubPage {
    constructor(page) {
        this.page = page;
        this.switchToDesignHubLink = page.getByRole('link', { name: 'Switch to Design Hub' });
    }

    async goto() {
        await this.page.goto('/print');
    }

    async switchToDesignHub() {
        await this.switchToDesignHubLink.click();
    }
}
