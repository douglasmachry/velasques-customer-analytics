import { expect, test } from '@playwright/test';

test('customer directory opens a customer profile and purchase history', async ({ page }) => {
  await page.goto('/customers');

  await expect(page.getByRole('heading', { name: 'Clientes' })).toBeVisible();
  await page.getByRole('link', { name: /Ana Martins/ }).click();

  await expect(page.getByRole('heading', { name: 'Ana Martins' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Histórico de compras' })).toBeVisible();
  await expect(page.getByText('PUR-1001')).toBeVisible();
});

test('customer directory searches by city', async ({ page }) => {
  await page.goto('/customers');

  await page.getByRole('textbox', { name: 'Pesquisar clientes' }).fill('Matosinhos');

  await expect(page.getByText('Bruno Costa')).toBeVisible();
  await expect(page.getByText('Gabriela Santos')).toBeVisible();
  await expect(page.getByText('Ana Martins')).toHaveCount(0);
});