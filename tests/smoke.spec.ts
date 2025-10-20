import { test, expect } from '@playwright/test';

test('landing page has call-to-action', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Staff sign-in' })).toBeVisible();
});
