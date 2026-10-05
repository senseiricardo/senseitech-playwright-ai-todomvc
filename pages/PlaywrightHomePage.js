// @ts-check

export class PlaywrightHomePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.getStartedLink = page.getByRole('link', { name: 'Get started', exact: true });
    this.installationHeading = page.getByRole('heading', { name: 'Installation', exact: true });
  }

  async goto() {
    await this.page.goto('https://playwright.dev/');
  }

  async openGettingStarted() {
    await this.getStartedLink.click();
  }
}
