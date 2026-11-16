import { expect, test } from '@playwright/test';

test('customer directory opens a customer profile and purchase history', async ({ page }) => {
  await page.goto('/customers');

  await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible();
  await page.getByRole('link', { name: /Ana Demonstração/ }).click();

  await expect(page.getByRole('heading', { name: 'Ana Demonstração' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Histórico de compras' })).toBeVisible();
  await expect(page.getByText(/legacy-2025-01-12-customer-001/)).toBeVisible();
});

test('customer directory searches by name', async ({ page }) => {
  await page.goto('/customers');

  await page.getByRole('textbox', { name: 'Pesquisar clientes' }).fill('Bruno Demonstração');

  await expect(page.getByText('Bruno Demonstração')).toBeVisible();
  await expect(page.getByText('Ana Demonstração')).toHaveCount(0);
});