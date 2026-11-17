import { expect, test } from "@playwright/test";

test.use({ channel: "chrome", storageState: { cookies: [], origins: [] } });

test("guest coin choices follow the trade direction", async ({ page }) => {
  await page.route(/\/crypto\/supported-cryptos$/, (route) => route.fulfill({
    json: { success: true, data: [
      { id: "buy-only", name: "Litecoin", symbol: "LTC", code: "LTC", buyEnabled: true, sellEnabled: false, networks: ["LTC"], networkOptions: [{ id: "LTC", label: "Litecoin network" }], minTradeAmountForAnonymous: "1", maxTradeAmountForAnonymous: "100" },
      { id: "both", name: "Bitcoin", symbol: "BTC", code: "BTC", buyEnabled: true, sellEnabled: true, networks: ["BTC"], networkOptions: [{ id: "BTC", label: "Bitcoin" }], minTradeAmountForAnonymous: "1", maxTradeAmountForAnonymous: "100" },
    ] },
  }));
  await page.route(/\/currency\/supported-currency$/, (route) => route.fulfill({ json: { success: true, data: [{ id: "ngn", code: "NGN", name: "Naira", symbol: "NGN" }] } }));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /^Buy Crypto$/i }).first().click();
  await expect(page.getByRole("button", { name: /Select Litecoin/i }).first()).toBeVisible();
  await page.getByRole("button", { name: /^Sell Crypto$/i }).first().click();
  await expect(page.getByRole("button", { name: /Select Litecoin/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Select Bitcoin/i }).first()).toBeVisible();
});
