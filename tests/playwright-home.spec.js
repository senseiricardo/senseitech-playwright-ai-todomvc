// @ts-check
import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

test('abre la guía de instalación desde la página inicial', async ({ page }) => {
  const homePage = new PlaywrightHomePage(page);

  await homePage.goto();
  await expect(page).toHaveTitle(/Playwright/);
  await expect(homePage.getStartedLink).toBeVisible();

  await homePage.openGettingStarted();
  await expect(page).toHaveURL(/\/docs\/intro\/?$/);
  await expect(homePage.installationHeading).toBeVisible();
});
