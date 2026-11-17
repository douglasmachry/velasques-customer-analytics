import { expect, test } from '@playwright/test';

test('dashboard loads the complete synthetic legacy API dataset', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible();
  await expect(page.getByText('API externa').first()).toBeVisible();

  const statValues = page.locator('.stat-card .stat-value');
  await expect(statValues.nth(0)).toContainText('€');
  await expect(statValues.nth(1)).toHaveText('10');
  await expect(statValues.nth(2)).toHaveText('30');
});

test('dashboard recalculates indicators when a year is selected', async ({ page }) => {
  await page.goto('/');

  const purchaseCount = page.locator('.stat-card').nth(2).locator('.stat-value');
  await expect(purchaseCount).toHaveText('30');

  await page.getByLabel('Ano').selectOption('2025');
  await expect(purchaseCount).toHaveText('12');

  await page.getByLabel('Ano').selectOption('2026');
  await expect(purchaseCount).toHaveText('18');
});

test('dashboard filters purchases by a month interval', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('textbox', { name: 'De' }).fill('2026-03');
  await page.getByRole('textbox', { name: 'Até' }).fill('2026-04');

  const purchaseCount = page.locator('.stat-card').nth(2).locator('.stat-value');
  await expect(purchaseCount).toHaveText('4');
});