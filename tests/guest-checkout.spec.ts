import { expect, test, type Page } from "@playwright/test";
import { loadLocalAgentCredentials } from "./support/localCredentials";
import { randomUUID } from "node:crypto";

test.use({
  channel: "chrome",
  storageState: { cookies: [], origins: [] },
});

const API_BASE_URL = process.env.VITE_BASE_URL || "http://localhost:3000/api/v1/crypto-now";
const credentials = loadLocalAgentCredentials();

const guestEmail = credentials.guest?.email?.trim();
const guestWalletAddress = credentials.guest?.walletAddress?.trim();
const guestBankId = credentials.guest?.bankAccount?.bankId?.trim();
const guestBankAccountNumber = credentials.guest?.bankAccount?.accountNumber?.trim();
const guestBankName = credentials.guest?.bankAccount?.bankName?.trim();

if (!guestEmail || !guestWalletAddress || !guestBankId || !guestBankAccountNumber || !guestBankName) {
  throw new Error(
    "Missing guest credentials in .agents/agent-credentials.json. Required: guest.email, guest.walletAddress, guest.bankAccount.bankId, guest.bankAccount.accountNumber, guest.bankAccount.bankName.",
  );
}

type SupportedBank = {
  id: string;
  name: string;
};

async function mockSellExchangeRate(page: Page) {
  await page.route(/\/rate\/crypto-rate\/.+\/SELL$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "OK",
        data: {
          fiatRate: 1000,
          coinGeckoRate: 1000,
          currency: "NGN",
          platformRate: 1000,
          usdRate: 1,
        },
        error: null,
      }),
    });
  });
}

async function mockGuestSupportedCryptos(page: Page) {
  await page.route(/\/crypto\/supported-cryptos$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "Supported cryptos loaded",
        data: [
          {
            id: "crypto-sol",
            code: "SOL",
            symbol: "Solana",
            name: "Solana",
            logoUrl: "",
            minTradeAmountForAnonymous: 1,
            maxTradeAmountForAnonymous: 1000000,
          },
        ],
        error: null,
      }),
    });
  });
}

async function mockGuestSupportedCurrencies(page: Page) {
  await page.route(/\/currency\/supported-currency$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "Supported currencies loaded",
        data: [
          {
            id: "currency-ngn",
            code: "NGN",
            symbol: "₦",
            name: "Nigerian Naira",
          },
        ],
        error: null,
      }),
    });
  });
}

async function mockGuestSellWalletAllocation(page: Page) {
  await page.route(/\/custodial-wallet\/guest\/allocate$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "Guest wallet allocated successfully",
        data: {
          id: "guest-wallet-playwright",
          userId: null,
          cryptocurrencyId: "crypto-sol",
          network: "SOLANA",
          blockchainEnvironment: "testnet",
          walletAddress: "FpX5pGgSfzeYde3zUjqdrdTBL5s5USrcGczX92FP7ToU",
          derivationIndex: 1,
          isActive: true,
          createdAt: new Date().toISOString(),
          walletPurpose: "GUEST",
          leasedTransactionId: "guest-session-playwright",
        },
        error: null,
      }),
    });
  });
}

async function mockGuestBankLookup(page: Page) {
  await page.route(/\/bank\/bank\/lookup$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "Account verified",
        data: {
          accountName: "Guest Test Account",
        },
        error: null,
      }),
    });
  });
}

async function mockGuestAnonymousBankAccountCreation(page: Page) {
  await page.route(/\/bank\/anonymous-user\/create$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "Bank account created",
        data: {
          id: "guest-bank-account-playwright",
        },
        error: null,
      }),
    });
  });
}

async function mockGuestAnonymousTransactionInitiation(page: Page) {
  await page.route(/\/transaction\/initiate\/anonymous$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "Transaction initiated",
        data: {
          sessionId: "guest-session-playwright",
        },
        error: null,
      }),
    });
  });
}

async function mockGuestSellWalletLimitExceeded(page: Page) {
  await page.route(/\/custodial-wallet\/guest\/allocate$/, async (route) => {
    await route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        message:
          "You already have 2 active guest sell wallets. Complete or close one before creating another.",
        error: {
          type: "guest_wallet_limit_exceeded",
          limit: 2,
        },
      }),
    });
  });
}

async function resolveBankName(page: Page, bankId: string): Promise<string> {
  const response = await page.request.get(`${API_BASE_URL}/bank/supported-bank/all`);
  expect(response.ok(), "bank list request should succeed").toBeTruthy();

  const payload = (await response.json()) as {
    success?: boolean;
    data?: SupportedBank[];
    message?: string;
  };

  expect(payload.success, payload.message || "bank list should be successful").toBeTruthy();
  const bank = payload.data?.find((item) => item.id === bankId);

  if (!bank?.name) {
    throw new Error(`Bank ID ${bankId} was not found in the supported bank list.`);
  }

  return bank.name;
}

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

function buildGuestEmail() {
  return `guest-checkout+${randomUUID()}@example.com`;
}

async function openGuestTradeWidget(page: Page) {
  const heroWidget = page
    .locator("section")
    .filter({ hasText: /Try a guest trade right now/i })
    .first();

  await expect(heroWidget).toBeVisible({ timeout: 15000 });
  return heroWidget;
}

async function selectGuestBuyCrypto(page: Page) {
  const solanaButton = page.getByRole("button", { name: /^Select Solana$/i }).first();
  await expect(solanaButton).toBeVisible({ timeout: 15000 });
  await solanaButton.click();
}

async function selectGuestSellCrypto(page: Page) {
  const sellButton = page.getByRole("button", { name: /^Sell Crypto$/i }).first();
  await expect(sellButton).toBeVisible({ timeout: 15000 });
  await sellButton.click();

  const solanaButton = page.getByRole("button", { name: /^Select Solana$/i }).first();
  await expect(solanaButton).toBeVisible({ timeout: 15000 });
  await solanaButton.click();
}

async function completeGuestBuyStepTwo(page: Page, email = buildGuestEmail()) {
  await page.getByPlaceholder("you@email.com").fill(email);
  await page.getByPlaceholder(/e\.g\. TQmBY4Mn/i).fill(guestWalletAddress);

  const continueButton = page.getByRole("button", {
    name: /See Payment Details/i,
  });
  await expect(continueButton).toBeEnabled({ timeout: 10000 });
  await continueButton.click();
}

async function completeGuestSellStepTwo(page: Page, bankName: string, email = buildGuestEmail()) {
  await page.getByPlaceholder("you@email.com — for payout updates").fill(email);

  const bankInput = page.getByRole("combobox", { name: /Your Bank/i }).first();
  await expect(bankInput).toBeVisible({ timeout: 15000 });
  await bankInput.click();
  await bankInput.fill(bankName);
  await page.getByText(bankName, { exact: true }).click();

  const accountNumberInput = page.getByPlaceholder("0000000000").first();
  await expect(accountNumberInput).toBeVisible({ timeout: 15000 });
  await accountNumberInput.fill(guestBankAccountNumber);

  const accountNameInput = page
    .locator('input[placeholder="Will auto-fill after verification"]')
    .first();
  await expect(accountNameInput).toHaveValue(/.+/, { timeout: 20000 });

  const continueButton = page.getByRole("button", {
    name: /Get My Deposit Wallet/i,
  });
  await expect(continueButton).toBeEnabled({ timeout: 10000 });
  await continueButton.click();
}

test.describe("Landing Page Guest Checkout", () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page }) => {
    await resetHomepage(page);
  });

  test("renders the guest checkout widget on the landing page", async ({
    page,
  }) => {
    const heroWidget = await openGuestTradeWidget(page);

    await expect(heroWidget.getByRole("button", { name: /^Buy Crypto$/i })).toBeVisible();
    await expect(heroWidget.getByRole("button", { name: /^Sell Crypto$/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Select Solana$/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /^Select Bitcoin$/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /^Select USDT$/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Select crypto & enter amount/i })).toBeVisible();
  });

  test("continues the guest buy checkout into the payment-details step", async ({
    page,
  }) => {
    await openGuestTradeWidget(page);
    await selectGuestBuyCrypto(page);

    const amountInput = page.locator('input[placeholder="0"]').first();
    await expect(amountInput).toBeVisible({ timeout: 10000 });
    await amountInput.fill("10000");

    const continueButton = page.getByRole("button", {
      name: /Continue/i,
    }).first();
    await expect(page.getByText(/You receive/i)).toBeVisible({ timeout: 30000 });
    await expect(continueButton).toBeEnabled({ timeout: 10000 });
    await continueButton.click();

    await expect(page.getByText(/Step 2 of 3 · Enter your wallet/i)).toBeVisible({ timeout: 15000 });

    await completeGuestBuyStepTwo(page);

    await expect(page.getByText(/Step 3 of 3 · Buy crypto with Naira/i)).toBeVisible({ timeout: 25000 });
  await expect(page.getByText(/Transfer to this account/i)).toBeVisible();
  await expect(page.getByText(/Send exactly/i)).toBeVisible();
  await expect(page.getByText(/^Network$/i)).toBeVisible();
  });

  test("keeps the guest buy checkout state after refresh", async ({ page }) => {
    await openGuestTradeWidget(page);
    await selectGuestBuyCrypto(page);

    const amountInput = page.locator('input[placeholder="0"]').first();
    await amountInput.fill("10000");

    await expect(page.getByText(/You receive/i)).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("button", { name: /Continue/i }).first()).toBeEnabled({ timeout: 30000 });
    await page.getByRole("button", { name: /Continue/i }).first().click();
    await expect(page.getByText(/Step 2 of 3 · Enter your wallet/i)).toBeVisible({ timeout: 15000 });

    await completeGuestBuyStepTwo(page, buildGuestEmail());

    await expect(page.getByText(/Step 3 of 3 · Buy crypto with Naira/i)).toBeVisible({ timeout: 25000 });

    await page.reload({
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForLoadState("load", { timeout: 15000 });

    await expect(page.getByText(/Step 3 of 3 · Buy crypto with Naira/i)).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/Transfer to this account/i)).toBeVisible();
    await expect(page.getByText(/Solana|Bitcoin|USDT/i)).toBeVisible();
  });

  test("continues the guest sell checkout into the deposit-wallet step", async ({
    page,
  }) => {
    test.setTimeout(180000);

    const bankName = await resolveBankName(page, guestBankId);
    const email = buildGuestEmail();
    await mockSellExchangeRate(page);
    await mockGuestSellWalletAllocation(page);
    await openGuestTradeWidget(page);
    await selectGuestSellCrypto(page);

    const amountInput = page.locator('input[placeholder="0"]').first();
    await expect(amountInput).toBeVisible({ timeout: 10000 });
    await amountInput.fill("1");

    const continueButton = page.getByRole("button", {
      name: /Continue/i,
    }).first();
    await expect(page.getByText(/Calculating preview/i)).toBeHidden({ timeout: 60000 });
    await expect(continueButton).toBeEnabled({ timeout: 60000 });
    await continueButton.click();

    await expect(page.getByText(/Step 2 of 2 · Payment details/i)).toBeVisible({ timeout: 60000 });

    await completeGuestSellStepTwo(page, bankName, email);

    await expect(page.getByText(/Step 3 of 2 · Send to this wallet/i)).toBeVisible({ timeout: 60000 });
    await expect(page.getByText(/Your unique/i)).toBeVisible();
    await expect(page.getByText(/Send & forget/i)).toBeVisible();
    await expect(page.getByText(/Payout Bank/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /I've Sent Already/i })).toBeVisible();

    await page.getByRole("button", { name: /I've Sent Already/i }).click();

    const recheckDialog = page.getByRole("dialog", {
      name: /Confirm manual deposit check/i,
    });
    await expect(recheckDialog).toBeVisible({ timeout: 10000 });
    await expect(
      recheckDialog.getByText(
        /We will read the live wallet balance and compare it against the cached wallet state/i,
      ),
    ).toBeVisible();

    const manualRecheckResponse = page.waitForResponse((response) => {
      return (
        response.request().method() === "POST" &&
        response.url().includes(
          "/transaction/manual-recheck-sell-deposit/anonymous/",
        )
      );
    });

    await recheckDialog.getByRole("button", { name: /Yes, check now/i }).click();

    const response = await manualRecheckResponse;
    expect(response.ok(), "manual recheck request should succeed").toBeTruthy();
    await expect(recheckDialog).toBeHidden({ timeout: 15000 });
  });

  test("keeps the guest sell checkout state after refresh", async ({ page }) => {
    test.setTimeout(180000);

    const bankName = await resolveBankName(page, guestBankId);
    const email = buildGuestEmail();
    await mockSellExchangeRate(page);
    await mockGuestSellWalletAllocation(page);
    await openGuestTradeWidget(page);
    await selectGuestSellCrypto(page);

    const amountInput = page.locator('input[placeholder="0"]').first();
    await amountInput.fill("1");

    const continueButton = page.getByRole("button", { name: /Continue/i }).first();
    await expect(page.getByText(/Calculating preview/i)).toBeHidden({ timeout: 60000 });
    await expect(continueButton).toBeEnabled({ timeout: 60000 });
    await continueButton.click();
    await expect(page.getByText(/Step 2 of 2 · Payment details/i)).toBeVisible({ timeout: 60000 });

    await completeGuestSellStepTwo(page, bankName, email);

    await expect(page.getByText(/Step 3 of 2 · Send to this wallet/i)).toBeVisible({ timeout: 60000 });

    await page.reload({
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForLoadState("load", { timeout: 15000 });

    await expect(page.getByText(/Step 3 of 2 · Send to this wallet/i)).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/Your unique/i)).toBeVisible();
    await expect(page.getByText(/Send & forget/i)).toBeVisible();
  });

  test("shows the guest wallet quota error when allocation is rate-limited", async ({
    page,
  }) => {
    test.setTimeout(180000);

    const bankName = guestBankName;
    const email = buildGuestEmail();
    const quotaMessage =
      "You already have 2 active guest sell wallets. Complete or close one before creating another.";

    await mockGuestSupportedCryptos(page);
    await mockGuestSupportedCurrencies(page);
    await mockSellExchangeRate(page);
    await mockGuestBankLookup(page);
    await mockGuestAnonymousBankAccountCreation(page);
    await mockGuestAnonymousTransactionInitiation(page);
    await mockGuestSellWalletLimitExceeded(page);
    await openGuestTradeWidget(page);
    await selectGuestSellCrypto(page);

    const amountInput = page.locator('input[placeholder="0"]').first();
    await amountInput.fill("1");

    const continueButton = page.getByRole("button", { name: /Continue/i }).first();
    await expect(page.getByText(/Calculating preview/i)).toBeHidden({ timeout: 60000 });
    await expect(continueButton).toBeEnabled({ timeout: 60000 });
    await continueButton.click();
    await expect(page.getByText(/Step 2 of 2 · Payment details/i)).toBeVisible({ timeout: 60000 });

    await completeGuestSellStepTwo(page, bankName, email);

    await expect(page.getByText(/Step 2 of 2 · Payment details/i)).toBeVisible({ timeout: 60000 });
    await expect(page.getByRole("alert").filter({ hasText: quotaMessage })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(quotaMessage)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Step 3 of 2 · Send to this wallet/i)).toBeHidden({ timeout: 15000 });
  });
});
