import { expect, test } from '@playwright/test';

test('customer directory opens a customer profile and purchase history', async ({ page }) => {
  await page.goto('/customers');

  await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible();
  await expect(page.getByText('API externa').first()).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(10);

  await page.getByRole('link', { name: /Ana Martins/ }).click();

  await expect(page.getByRole('heading', { name: 'Ana Martins' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Histórico de compras' })).toBeVisible();
  await expect(page.getByText(/legacy-2025-01-12-customer-001/)).toBeVisible();
});

test('customer directory searches by name', async ({ page }) => {
  await page.goto('/customers');

  await page.getByRole('textbox', { name: 'Pesquisar clientes' }).fill('Bruno Costa');

  await expect(page.getByText('Bruno Costa')).toBeVisible();
  await expect(page.getByText('Ana Martins')).toHaveCount(0);
});