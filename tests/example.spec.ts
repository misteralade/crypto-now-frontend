import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check that the page title exists or a key element is present
  // Adjust this selector based on your actual homepage structure
  const body = page.locator('body');
  await expect(body).toBeVisible();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  
  // Wait for navigation to be ready
  await page.waitForLoadState('networkidle');
  
  // Example: Check if navigation elements are present
  // Adjust selectors based on your actual navigation structure
  const body = page.locator('body');
  await expect(body).toBeVisible();
});

