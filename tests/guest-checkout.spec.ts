import { test, expect, type Page } from "@playwright/test";

test.use({
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

const GUEST_EMAIL = `guest-checkout+${Date.now()}@example.com`;
const GUEST_WALLET = "So11111111111111111111111111111111111111112";

async function resetHomepage(page: Page) {
  await page.context().clearCookies();

  await page.goto("/", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  await page.waitForLoadState("load", { timeout: 15000 });

  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  await page.reload({
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  await page.waitForLoadState("load", { timeout: 15000 });
}

async function openGuestTradeWidget(page: Page) {
  const heroWidget = page
    .locator("section")
    .filter({ hasText: /Try a guest trade right now/i })
    .first();

  await expect(heroWidget).toBeVisible({ timeout: 10000 });
  return heroWidget;
}

async function selectGuestBuyCrypto(page: Page) {
  const solanaButton = page
    .getByRole("button", { name: /Select Solana/i })
    .first();

  await expect(solanaButton).toBeVisible({ timeout: 10000 });
  await solanaButton.click();
}

test.describe("Landing Page Guest Checkout", () => {
  test.beforeEach(async ({ page }) => {
    await resetHomepage(page);
  });

  test("renders the guest checkout widget on the landing page", async ({
    page,
  }) => {
    const heroWidget = await openGuestTradeWidget(page);

    await expect(
      heroWidget.getByRole("button", { name: /^Buy Crypto$/i }),
    ).toBeVisible();
    await expect(
      heroWidget.getByRole("button", { name: /^Sell Crypto$/i }),
    ).toBeVisible();
    await expect(
      heroWidget.getByRole("button", { name: /Select Solana/i }),
    ).toBeVisible();
    await expect(
      heroWidget.getByRole("button", { name: /Select Bitcoin/i }),
    ).toBeVisible();
    await expect(
      heroWidget.getByRole("button", { name: /Select USDT/i }),
    ).toBeVisible();
    await expect(
      heroWidget.getByRole("button", { name: /Select crypto & enter amount/i }),
    ).toBeVisible();
  });

  test("continues the guest buy checkout into the payment-details step", async ({
    page,
  }) => {
    const heroWidget = await openGuestTradeWidget(page);

    await selectGuestBuyCrypto(page);

    const amountInput = heroWidget.locator('input[placeholder="0"]').first();
    await expect(amountInput).toBeVisible({ timeout: 10000 });
    await amountInput.fill("10000");

    const continueButton = heroWidget.getByRole("button", {
      name: /Continue/i,
    });
    await expect(continueButton).toBeEnabled({ timeout: 10000 });
    await continueButton.click();

    await expect(
      page.getByText(/Step 2 of 3 · Enter your wallet/i),
    ).toBeVisible({ timeout: 15000 });

    await page.getByPlaceholder("you@email.com").fill(GUEST_EMAIL);
    await page.getByPlaceholder(/e\.g\. TQmBY4Mn/i).fill(GUEST_WALLET);

    const emailContinue = page.getByRole("button", {
      name: /See Payment Details/i,
    });
    await expect(emailContinue).toBeEnabled({ timeout: 10000 });
    await emailContinue.click();

    await expect(
      page.getByText(/Step 3 of 3 · Buy crypto with Naira/i),
    ).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/Transfer to this account/i)).toBeVisible();
    await expect(page.getByText(/Send exactly/i)).toBeVisible();
    await expect(page.getByText(/Network/i)).toBeVisible();
  });

  test("keeps the guest buy checkout state after refresh", async ({ page }) => {
    const heroWidget = await openGuestTradeWidget(page);

    await selectGuestBuyCrypto(page);

    const amountInput = heroWidget.locator('input[placeholder="0"]').first();
    await amountInput.fill("10000");

    await heroWidget.getByRole("button", { name: /Continue/i }).click();
    await expect(
      page.getByText(/Step 2 of 3 · Enter your wallet/i),
    ).toBeVisible({ timeout: 15000 });

    await page.getByPlaceholder("you@email.com").fill(GUEST_EMAIL);
    await page.getByPlaceholder(/e\.g\. TQmBY4Mn/i).fill(GUEST_WALLET);
    await page.getByRole("button", { name: /See Payment Details/i }).click();

    await expect(
      page.getByText(/Step 3 of 3 · Buy crypto with Naira/i),
    ).toBeVisible({ timeout: 20000 });

    await page.reload({
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForLoadState("load", { timeout: 15000 });

    await expect(
      page.getByText(/Step 3 of 3 · Buy crypto with Naira/i),
    ).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/Transfer to this account/i)).toBeVisible();
    await expect(page.getByText(/Solana|Bitcoin|USDT/i)).toBeVisible();
  });
});
