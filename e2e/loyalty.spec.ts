import { expect, test } from '@playwright/test';

test('loyalty ranking responds to year filters using the complete legacy API dataset', async ({ page }) => {
  await page.goto('/loyalty');

  await expect(page.getByRole('heading', { name: 'Fidelização' })).toBeVisible();
  await expect(page.getByText('API externa').first()).toBeVisible();
  await expect(page.getByText(/30 compras analisadas/)).toBeVisible();

  await page.getByLabel('Ano').selectOption('2026');
  await expect(page.getByText(/18 compras analisadas/)).toBeVisible();
});