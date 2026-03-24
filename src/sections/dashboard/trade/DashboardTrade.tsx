/**
 * DashboardTrade — full buy/sell flow inside the dashboard AuthenticatedLayout.
 *
 * BUY:  Step 1 (crypto grid + amount + wallet) → Step 2 (bank payment) → Step 3 (confirm wallet) → Step 4
 * SELL: Step 1 (crypto grid + payout bank) → Step 2 (unique wallet + monitoring) → Step 4
 */
import { useState, useEffect, useRef } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import type { TradeType } from "../../../types/trade.types.ts";
import { useTradeStepDisplay } from "../../../hooks/components/trade/useTradeStepDisplay.ts";
import {
  clearTradeProgress, loadTradeProgress, saveTradeProgress,
} from "../../../util/tradeProgress.storage.util.ts";
import { LoadingSpinner } from "../../../components/global/LoadingSpinner.tsx";
import EmailModal from "../../trade-crypto/modals/EmailModal.tsx";
import DashboardTradeStep1, { type BuyRateInfo } from "./DashboardTradeStep1.tsx";
import DashboardTradeStep2 from "./DashboardTradeStep2.tsx";
import DashboardTradeStep3 from "./DashboardTradeStep3.tsx";
import DashboardTradeSuccess from "./DashboardTradeSuccess.tsx";
import { clearExchangeRateId, clearAmountToSend, clearInitiateTransactionField, setInitiateTransactionField } from "../../../redux/transaction.slice.ts";
import { useDispatch } from "react-redux";
import { LOCAL_STORAGE_KEYS } from "../../../util/constants.util.ts";

export default function DashboardTrade() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams: { option?: string; sessionId?: string } =
    useSearch({ strict: false });

  const routeOption = searchParams.option;
  const sessionId = searchParams.sessionId;

  const [step, setStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<TradeType>(
    routeOption?.toLowerCase() === "sell" ? "sell" : "buy"
  );
  const [hasChosenMode, setHasChosenMode] = useState<boolean>(!!routeOption);

  // Local pending token for sell flow (hook's useEffect resets selectedToken so we track locally)
  const [pendingSellToken, setPendingSellToken] = useState<import("../../../types/response.payload.types.ts").SupportedCryptoOrCurrencyResponse | undefined>();
  // State + ref to hold the token selected for buy
  const [pendingBuyToken, setPendingBuyToken] = useState<import("../../../types/response.payload.types.ts").SupportedCryptoOrCurrencyResponse | undefined>();
  const pendingBuyTokenRef = useRef<import("../../../types/response.payload.types.ts").SupportedCryptoOrCurrencyResponse | undefined>(undefined);
  // Lifted wallet+network state so Step 3 can show a read-only summary
  const [buyWalletAddress, setBuyWalletAddress] = useState("");
  const [buyNetwork, setBuyNetwork] = useState("");
  // Sell payout account selection
  const [sellPayoutAccountId, setSellPayoutAccountId] = useState<string | undefined>();
  // Sell network selection (for multi-network tokens like USDT)
  const [sellNetwork, setSellNetwork] = useState<string | undefined>();
  // BUY local-first rate (fetched at Step 1, used at Step 2 for submission)
  const [buyRateInfo, setBuyRateInfo] = useState<BuyRateInfo | null>(null);

  const hasRestoredRef = useRef<string | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // For BUY local-first flow: wipe any stale exchangeRateId / amountToSend from Redux
  // and tradeProgress on mount so the global calculateAmountToReceive query never
  // fires with an expired rate ID.
  useEffect(() => {
    if (activeTab === "buy") {
      dispatch(clearExchangeRateId());
      dispatch(clearAmountToSend());
      dispatch(clearInitiateTransactionField("exchangeRateId"));
      dispatch(clearInitiateTransactionField("amountToSend"));
      saveTradeProgress({ exchangeRateId: undefined });
    }
  }, [activeTab]);

  // Restore / clear progress on mount
  useEffect(() => {
    if (sessionId && hasRestoredRef.current !== sessionId) {
      hasRestoredRef.current = sessionId;
      hasInitializedRef.current = true;
      return;
    }
    if (sessionId && hasRestoredRef.current === sessionId) {
      hasInitializedRef.current = true;
      return;
    }
    if (hasInitializedRef.current) return;

    const nav = performance?.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
    const isReload = nav?.type === "reload";
    const saved = loadTradeProgress();

    if (saved?.step === 3) { clearTradeProgress(); setStep(1); hasInitializedRef.current = true; return; }
    if (!isReload) { clearTradeProgress(); setStep(1); hasInitializedRef.current = true; return; }
    if (saved && typeof saved.step === "number" && saved.step !== 3) setStep(saved.step);
    if (saved?.activeTab) setActiveTab(saved.activeTab as TradeType);
    hasInitializedRef.current = true;
  }, [sessionId]);

  useEffect(() => {
    if (step === 3) { clearTradeProgress(); return; }
    saveTradeProgress({ step, activeTab });
  }, [step, activeTab]);

  useEffect(() => {
    let isReloading = false;
    const onBeforeUnload = () => { isReloading = true; };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      if (!isReloading) clearTradeProgress();
    };
  }, []);

  const {
    selectedToken, numberOfToken, AdditionalInfo, amountToBuy,
    selectedCurrency, supportedCurrencies, supportedCryptoCurrencies,
    exchangeRateId, countdown, isInitiatingTrade, loadingExchangeRate, transactionSessionId,
    userBankAccounts,
    showUserEnterEmail, isLoadingPingUser,
    loadingSupportedCryptocurrencies, loadingUserBankAccounts,
    setAmountToBuy, setSelectedCurrency, setSelectedToken,
    handleReceiptUrl, handleTransactionHash, initiateTransaction,
    makePaymentTransaction, handleConfirmBankDetails,
    handleAnonymousUserEmailInput, toggleShowUserEnterEmail,
    togglePaymentReceivingModal, formatReceiveAmount, formatSendAmount,
    handleFocusAmountToBuy,
    sellDepositWallet, isGeneratingDepositWallet,
  } = useTradeStepDisplay("", activeTab, "", setStep, setActiveTab, undefined, step, sessionId, sellNetwork, true);

  // For SELL: after initiateTransaction creates the INITIATED record and sets step=2,
  // immediately jump to step 4 (success). The deposit wallet is shown inline on Step 1.
  useEffect(() => {
    if (step === 2 && activeTab === "sell") setStep(4);
  }, [step, activeTab]);

  // Auto-initialize sellPayoutAccountId from default bank
  useEffect(() => {
    if (activeTab === "sell" && userBankAccounts?.length) {
      const def = userBankAccounts.find(b => b.isDefault) ?? userBankAccounts[0];
      if (def && !sellPayoutAccountId) setSellPayoutAccountId(def.id);
    }
  }, [userBankAccounts, activeTab]);

  const handleReset = () => {
    clearTradeProgress();
    setStep(1);
    navigate({ to: "/dashboard/trade", search: {}, replace: true });
  };

  const handleChooseMode = (mode: TradeType) => {
    setActiveTab(mode);
    setHasChosenMode(true);
    navigate({ to: "/dashboard/trade", search: { option: mode }, replace: true });
  };

  // Restore the last-used token from localStorage when the supported list loads
  useEffect(() => {
    if (!supportedCryptoCurrencies || step !== 1) return;
    const savedId = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_TRADE_TOKEN);
    if (!savedId) return;
    const found = supportedCryptoCurrencies.find((t) => t.id === savedId);
    if (!found) return;
    setSelectedToken(found);
    if (activeTab === "buy") {
      setPendingBuyToken(found);
      pendingBuyTokenRef.current = found;
      const firstNetwork = found.networks?.[0] ?? "";
      if (firstNetwork) setBuyNetwork(firstNetwork);
    } else {
      setPendingSellToken(found);
      setSellNetwork(found.networks?.[0] ?? undefined);
    }
  }, [supportedCryptoCurrencies]);

  if (isLoadingPingUser) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner fullScreen={false} message="Checking authentication…" />
      </div>
    );
  }

  const isBuy = activeTab === "buy";

  if (!hasChosenMode) {
    return (
      <div style={{ background: "#FFFFFF", minHeight: "100dvh" }}>
        <div className="px-5 pt-6 pb-32 max-w-4xl mx-auto">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-400">
              Start a new trade
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900">
              What would you like to do?
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-xl">
              Choose whether you want to buy or sell crypto. You can always switch
              later in the flow.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleChooseMode("buy")}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50/70 px-4 py-4 text-left shadow-sm hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <span className="inline-flex items-center rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-purple-700">
                Buy Crypto
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Pay local currency, receive crypto
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Best when you want to load your wallet or take a position.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleChooseMode("sell")}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
            >
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                Sell Crypto
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Send crypto, receive cash
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Ideal when you need NGN quickly from your crypto balance.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100dvh" }}>
      <div className="px-5 pt-5 pb-32">
        <AnimatePresence mode="wait">
          {/* STEP 1 — combined crypto grid + buy fields or sell payout bank */}
          {step === 1 && (
            <motion.div key="s1"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              <DashboardTradeStep1
                tradeType={activeTab}
                availableTokens={(!loadingSupportedCryptocurrencies && supportedCryptoCurrencies) || []}
                selectedToken={activeTab === "sell" ? pendingSellToken : pendingBuyToken}
                setSelectedToken={(t) => {
                  // Persist so the next visit pre-selects this token
                  localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_TRADE_TOKEN, t.id);
                  if (activeTab === "buy") {
                    setPendingBuyToken(t);
                    pendingBuyTokenRef.current = t;
                    setSelectedToken(t);
                    const firstNetwork = t.networks?.[0] ?? "";
                    if (firstNetwork) setBuyNetwork(firstNetwork);
                    setBuyRateInfo(null); // reset rate when token changes
                  } else {
                    setPendingSellToken(t);
                    setSelectedToken(t);
                    setSellNetwork(t.networks?.[0] ?? undefined);
                  }
                }}
                isInitiatingTrade={isInitiatingTrade}
                isRateLoading={activeTab === "sell" && loadingExchangeRate}
                buyRateInfo={activeTab === "buy" ? buyRateInfo : undefined}
                onRateResolved={activeTab === "buy" ? setBuyRateInfo : undefined}
                onProceed={() => {
                  if (activeTab === "sell") {
                    if (!pendingSellToken) return;
                    setSelectedToken(pendingSellToken);
                    // Attach the selected payout accountId before initiating
                    if (sellPayoutAccountId) {
                      dispatch(setInitiateTransactionField({ field: "accountId", value: sellPayoutAccountId }));
                    }
                    initiateTransaction();
                  } else {
                    // BUY: local-first — no server call yet, just advance to step 2
                    if (!pendingBuyToken || !buyRateInfo) return;
                    setSelectedToken(pendingBuyToken);
                    setStep(2);
                  }
                }}
                // BUY-specific props
                availableCurrencies={supportedCurrencies || []}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                amountToBuy={amountToBuy}
                setAmountToBuy={setAmountToBuy}
                handleFocusAmountToBuy={handleFocusAmountToBuy}
                walletAddress={buyWalletAddress}
                onWalletAddressChange={setBuyWalletAddress}
                selectedNetwork={buyNetwork}
                onNetworkChange={setBuyNetwork}
                orderDetails={AdditionalInfo}
                // SELL-specific props
                userBankAccounts={userBankAccounts}
                selectedPayoutAccountId={sellPayoutAccountId}
                onPayoutAccountChange={setSellPayoutAccountId}
                sellDepositWallet={sellDepositWallet}
                isGeneratingDepositWallet={isGeneratingDepositWallet}
                sellNetwork={sellNetwork}
                onSellNetworkChange={setSellNetwork}
              />
            </motion.div>
          )}

          {/* STEP 2 — payment / wallet */}
          {step === 2 && (
            <motion.div key="s2"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
              <DashboardTradeStep2
                tradeType={activeTab}
                amountToBuy={typeof amountToBuy === "string" ? (amountToBuy ? Number(amountToBuy) : 0) : (amountToBuy || 0)}
                numberOfToken={isBuy && buyRateInfo ? buyRateInfo.cryptoAmount : (typeof numberOfToken === "string" ? (numberOfToken ? Number(numberOfToken) : 0) : (numberOfToken || 0))}
                selectedToken={selectedToken}
                selectedCurrency={selectedCurrency}
                exchangeRateId={exchangeRateId}
                rateLockCountdown={countdown}
                transactionRef={transactionSessionId}
                additionalInfo={AdditionalInfo}
                handleReceiptUrl={handleReceiptUrl}
                handleTransactionHash={handleTransactionHash}
                handleSubmitPaymentProof={makePaymentTransaction}
                formatReceiveAmount={formatReceiveAmount}
                formatSendAmount={formatSendAmount}
                buyWalletAddress={buyWalletAddress}
                buyNetwork={buyNetwork}
                buyRateInfo={isBuy ? buyRateInfo : undefined}
                onBuySubmitSuccess={() => setStep(4)}
                payoutBank={!isBuy ? (userBankAccounts?.find(b => b.id === sellPayoutAccountId) ?? userBankAccounts?.[0]) : undefined}
                onBack={() => setStep(1)}
              />
            </motion.div>
          )}

          {/* STEP 3 — confirm receiving wallet (BUY only) */}
          {step === 3 && isBuy && !loadingUserBankAccounts && (
            <motion.div key="s3"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
              <DashboardTradeStep3
                tradeType={activeTab}
                bankAccounts={userBankAccounts}
                selectedTokenNetworks={selectedToken?.networks}
                selectedToken={selectedToken ?? pendingBuyTokenRef.current}
                selectedCurrency={selectedCurrency}
                amountToBuy={amountToBuy}
                numberOfToken={numberOfToken}
                buyWalletAddress={buyWalletAddress}
                buyNetwork={buyNetwork}
                onProceed={handleConfirmBankDetails}
                onBack={() => { togglePaymentReceivingModal(); setStep(2); }}
              />
            </motion.div>
          )}

          {/* STEP 4 — success */}
          {step === 4 && (
            <motion.div key="s4"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}>
              <DashboardTradeSuccess
                tradeType={activeTab}
                selectedTokenSymbol={selectedToken?.symbol}
                amount={activeTab === "sell" ? numberOfToken : undefined}
                transactionRef={transactionSessionId}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <EmailModal
        open={showUserEnterEmail && !isLoadingPingUser}
        onClose={toggleShowUserEnterEmail}
        onConfirm={handleAnonymousUserEmailInput}
      />
    </div>
  );
}
