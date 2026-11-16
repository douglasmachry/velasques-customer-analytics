import { expect, test } from '@playwright/test';

test('loyalty ranking responds to the selected year using legacy API fixtures', async ({ page }) => {
  await page.goto('/loyalty');

  await expect(page.getByRole('heading', { name: 'Fidelização' })).toBeVisible();
  await expect(page.getByText('API externa').first()).toBeVisible();
  await expect(page.getByText(/3 compras analisadas/)).toBeVisible();

  await page.getByLabel('Ano').selectOption('2026');
  await expect(page.getByText(/1 compras analisadas/)).toBeVisible();
});