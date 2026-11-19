import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test.use({ channel: "chrome", storageState: { cookies: [], origins: [] }, trace: "retain-on-failure" });
test.setTimeout(180_000);
const api = process.env.GUEST_API_URL || "http://localhost:3000/api/v1/crypto-now";
type Transaction = { id: string; type: string; status: string; amountCrypto: string; amountFiatNGN: string; receiptImageUrl: string | null; depositAddress: string | null; rateSnapshot: { fiatRate: number } };
async function details(page: Page): Promise<Transaction> {
  const session = new URL(page.url()).searchParams.get("sessionId");
  expect(session).toBeTruthy();
  const response = await page.request.get(`${api}/transaction/details/${session}`);
  expect(response.ok()).toBeTruthy();
  return (await response.json()).data as Transaction;
}
async function start(page: Page) {
  await page.getByRole("button", { name: "Select USDT" }).click();
  await page.getByPlaceholder("0", { exact: true }).fill("5");
  const next = page.getByRole("button", { name: "Continue", exact: true });
  await expect(next).toBeEnabled({ timeout: 30_000 });
  await next.click();
}
function checkAmounts(transaction: Transaction) {
  expect(Number(transaction.amountCrypto)).toBe(5);
  expect(Number(transaction.amountFiatNGN)).toBeCloseTo(5 * transaction.rateSnapshot.fiatRate, 0);
}
test("guest buy then sell to waiting stages", async ({ page }) => {
  test.skip(process.env.GUEST_LIVE_E2E !== "1", "Set GUEST_LIVE_E2E=1 to create transactions and submit a test image.");
  const { guest } = JSON.parse(readFileSync(resolve(process.cwd(), "../playwrite/auth.json"), "utf8")) as { guest: { email: string; bankAccount: { bankName: string; accountNumber: string } } };
  await page.goto("/");
  await start(page);
  await page.getByPlaceholder("you@email.com", { exact: true }).fill(guest.email);
  await page.getByLabel("NETWORK").selectOption({ label: "ERC20 (Ethereum)" });
  await page.getByPlaceholder(/e\.g\. TQmBY4Mn/).fill("0x91d2c7645ef80a3b9c620f417e58d0a673bc82f1");
  await page.getByRole("button", { name: "See Payment Details" }).click();
  await expect(page.getByText("Transfer to this account", { exact: false })).toBeVisible({ timeout: 30_000 });
  const buy = await details(page);
  console.log(`Guest buy transaction: ${buy.id}`);
  expect(buy.type).toBe("BUY");
  checkAmounts(buy);
  await page.reload();
  await expect(page.getByText("Transfer to this account", { exact: false })).toBeVisible();
  expect((await details(page)).id).toBe(buy.id);
  await page.locator('input[type="file"]').setInputFiles(resolve(process.cwd(), "public/decorations/btc-coin.png"));
  await page.getByRole("button", { name: "Submit & Track Order" }).click();
  await expect(page.getByText("Payment Submitted!", { exact: true })).toBeVisible({ timeout: 60_000 });
  await expect.poll(async () => (await details(page)).receiptImageUrl, { timeout: 30_000 }).toBeTruthy();
  expect((await details(page)).status).not.toBe("AWAITING_PAYMENT");
  await page.getByRole("button", { name: "Sell Crypto" }).click();
  await start(page);
  await page.getByPlaceholder(/for payout updates/).fill(guest.email);
  await page.getByRole("combobox", { name: "Your Bank" }).fill(guest.bankAccount.bankName);
  await page.getByRole("option", { name: guest.bankAccount.bankName, exact: true }).click();
  await page.getByPlaceholder("0000000000").fill(guest.bankAccount.accountNumber);
  await expect(page.getByPlaceholder("Will auto-fill after verification")).toHaveValue(/.+/, { timeout: 30_000 });
  await page.getByRole("button", { name: "Get My Deposit Wallet" }).click();
  await expect(page.getByText("Send to this wallet", { exact: false })).toBeVisible({ timeout: 60_000 });
  const sell = await details(page);
  console.log(`Guest sell transaction: ${sell.id}`);
  expect(sell.type).toBe("SELL");
  expect(sell.status).toBe("AWAITING_CRYPTO");
  checkAmounts(sell);
  expect(sell.depositAddress).toBeTruthy();
  await page.reload();
  await expect(page.getByText("Send to this wallet", { exact: false })).toBeVisible();
  expect((await details(page)).id).toBe(sell.id);
});
