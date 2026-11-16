import { expect, test } from '@playwright/test';

test('dashboard recalculates indicators when a year is selected', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible();
  await expect(page.getByText('Receita total')).toBeVisible();

  const purchaseCount = page.locator('.stat-card').nth(2).locator('.stat-value');
  await expect(purchaseCount).toHaveText('30');

  await page.getByLabel('Ano').selectOption('2025');
  await expect(purchaseCount).toHaveText('21');
});

test('dashboard filters purchases by a month interval', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('De').fill('2026-03');
  await page.getByLabel('Até').fill('2026-04');

  const purchaseCount = page.locator('.stat-card').nth(2).locator('.stat-value');
  await expect(purchaseCount).toHaveText('2');
});