export class DesignHubPage {
    constructor(page) {
        this.page = page;
        this.switchToPrintHubLink = page.getByRole('link', { name: 'Switch to Print Hub' });
        // The WhatsApp link locator used in the external-links test
        this.whatsappLink = page.getByRole('link').filter({ hasText: /^$/ }).nth(3);
    }

    async goto() {
        await this.page.goto('/design');
    }

    async switchToPrintHub() {
        await this.switchToPrintHubLink.click();
    }

    async clickWhatsappLink() {
        await this.whatsappLink.click();
    }
}
