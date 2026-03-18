/**
 * DashboardTrade — full buy/sell flow inside the dashboard AuthenticatedLayout.
 *
 * BUY:  Step 1 (crypto grid) → Step 1b (amount + wallet + network) → Step 2 (bank payment) → Step 3 (confirm account) → Step 4 (success)
 * SELL: Step 1 (crypto grid) → Step 2 (unique wallet + monitoring) → Step 3 (confirm account) → Step 4 (success)
 *       Note: Sell skips Step 1b entirely — goes straight to wallet screen after crypto selection.
 */
import { useState, useEffect, useRef } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import type { TradeType } from "../../../types/trade.types.ts";
import { useTradeStepDisplay } from "../../../hooks/components/trade/useTradeStepDisplay.ts";
import { useAppSelector } from "../../../hooks.ts";
import {
  clearTradeProgress, loadTradeProgress, saveTradeProgress,
} from "../../../util/tradeProgress.storage.util.ts";
import { LoadingSpinner } from "../../../components/global/LoadingSpinner.tsx";
import EmailModal from "../../trade-crypto/modals/EmailModal.tsx";
import DashboardTradeStep1 from "./DashboardTradeStep1.tsx";
import DashboardTradeStep1b from "./DashboardTradeStep1b.tsx";
import DashboardTradeStep2 from "./DashboardTradeStep2.tsx";
import DashboardTradeStep3 from "./DashboardTradeStep3.tsx";
import DashboardTradeSuccess from "./DashboardTradeSuccess.tsx";

export default function DashboardTrade() {
  const navigate = useNavigate();
  const searchParams: { option?: string; currency?: string; token?: string; sessionId?: string } =
    useSearch({ strict: false });

  const routeOption = searchParams.option;
  const currency = searchParams.currency ?? "";
  const token = searchParams.token ?? "";
  const sessionId = searchParams.sessionId;

  const [step, setStep] = useState<number>(1);
  // sub-step within step 1: 0 = crypto selection, 1 = amount entry (buy only)
  const [subStep, setSubStep] = useState<0 | 1>(0);
  const [activeTab, setActiveTab] = useState<TradeType>(
    routeOption?.toLowerCase() === "sell" ? "sell" : "buy"
  );
  const [hasChosenMode, setHasChosenMode] = useState<boolean>(!!routeOption);
  // Local pending token for sell flow (the hook's useEffect resets selectedToken so we track locally)
  const [pendingSellToken, setPendingSellToken] = useState<import("../../../types/response.payload.types.ts").SupportedCryptoOrCurrencyResponse | undefined>();
  // Ref to hold the last token selected for buy (persists across hook-triggered re-renders)
  const pendingBuyTokenRef = useRef<import("../../../types/response.payload.types.ts").SupportedCryptoOrCurrencyResponse | undefined>();

  const anonymousUserEmail = useAppSelector((state) => state.user.trade.anonymous.email);
  const hasRestoredRef = useRef<string | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

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
    exchangeRateId, isInitiatingTrade, loadingExchangeRate, transactionSessionId,
    showPaymentReceivingModal, userBankAccounts, userCryptoWallets,
    showUserEnterEmail, isLoadingPingUser,
    loadingSupportedCryptocurrencies, loadingUserCryptoWallets, loadingUserBankAccounts,
    setAmountToBuy, setNumberOfToken, setSelectedCurrency, setSelectedToken,
    handleReceiptUrl, handleTransactionHash, initiateTransaction,
    makePaymentTransaction, handleConfirmBankDetails,
    handleAnonymousUserEmailInput, toggleShowUserEnterEmail,
    togglePaymentReceivingModal, formatReceiveAmount, formatSendAmount,
    handleFocusNumberOfToken, handleFocusAmountToBuy,
    handleBlurNumberOfToken, handleBlurAmountToBuy,
  } = useTradeStepDisplay(token, activeTab, currency, setStep, setActiveTab, undefined, step, sessionId);

  useEffect(() => {
    if (showPaymentReceivingModal) setStep(3);
  }, [showPaymentReceivingModal]);

  const handleReset = () => {
    clearTradeProgress();
    setStep(1);
    setSubStep(0);
    navigate({ to: "/dashboard/trade", search: {}, replace: true });
  };

  // Handle initial selection between BUY and SELL entry modes.
  const handleChooseMode = (mode: TradeType) => {
    setActiveTab(mode);
    setHasChosenMode(true);
    navigate({
      to: "/dashboard/trade",
      search: { ...searchParams, option: mode },
      replace: true,
    });
  };

  // When navigating to step 1 with a pre-selected token (from URL), pre-select it
  useEffect(() => {
    if (token && supportedCryptoCurrencies && step === 1 && subStep === 0) {
      const found = supportedCryptoCurrencies.find((t) => t.id === token);
      if (found) {
        setSelectedToken(found);
        // Buy: go to step 1b; Sell: stay on step 1 with token selected (user must press CTA)
        if (activeTab === "buy") {
          setSubStep(1);
        }
      }
    }
  }, [token, supportedCryptoCurrencies]);

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
          {/* STEP 1 — crypto grid */}
          {step === 1 && subStep === 0 && (
            <motion.div key="s1-crypto"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              <DashboardTradeStep1
                tradeType={activeTab}
                availableTokens={(!loadingSupportedCryptocurrencies && supportedCryptoCurrencies) || []}
                selectedToken={activeTab === "sell" ? pendingSellToken : selectedToken}
                setSelectedToken={(t) => {
                  if (activeTab === "buy") {
                    // Store in ref immediately (survives hook re-render resets)
                    pendingBuyTokenRef.current = t;
                    setSelectedToken(t);
                    setSubStep(1);
                  } else {
                    // Sell: store locally so hook's effect can't clobber it
                    setPendingSellToken(t);
                    setSelectedToken(t);
                  }
                }}
                isInitiatingTrade={isInitiatingTrade}
                isRateLoading={activeTab === "sell" && loadingExchangeRate}
                onProceed={() => {
                  if (activeTab === "sell") {
                    if (!pendingSellToken) return;
                    setSelectedToken(pendingSellToken);
                    initiateTransaction();
                  } else {
                    if (!selectedToken) return;
                    setSubStep(1);
                  }
                }}
              />
            </motion.div>
          )}

          {/* STEP 1b — BUY ONLY: amount + wallet + network */}
          {step === 1 && subStep === 1 && isBuy && (
            <motion.div key="s1-amount"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
              {(selectedToken ?? pendingBuyTokenRef.current) ? (
              <DashboardTradeStep1b
                tradeType={activeTab}
                selectedToken={(selectedToken ?? pendingBuyTokenRef.current)!}
                availableCurrencies={supportedCurrencies || []}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                amountToBuy={amountToBuy}
                setAmountToBuy={setAmountToBuy}
                numberOfToken={numberOfToken}
                setNumberOfToken={setNumberOfToken}
                handleFocusAmountToBuy={handleFocusAmountToBuy}
                handleBlurAmountToBuy={handleBlurAmountToBuy}
                handleFocusNumberOfToken={handleFocusNumberOfToken}
                handleBlurNumberOfToken={handleBlurNumberOfToken}
                orderDetails={AdditionalInfo}
                isInitiatingTrade={isInitiatingTrade}
                onProceed={initiateTransaction}
                onBack={() => setSubStep(0)}
              />) : null}
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
                numberOfToken={typeof numberOfToken === "string" ? (numberOfToken ? Number(numberOfToken) : 0) : (numberOfToken || 0)}
                selectedToken={selectedToken}
                selectedCurrency={selectedCurrency}
                exchangeRateId={exchangeRateId}
                transactionRef={transactionSessionId}
                additionalInfo={AdditionalInfo}
                handleReceiptUrl={handleReceiptUrl}
                handleTransactionHash={handleTransactionHash}
                handleSubmitPaymentProof={makePaymentTransaction}
                formatReceiveAmount={formatReceiveAmount}
                formatSendAmount={formatSendAmount}
                onBack={() => {
                  if (isBuy) {
                    setStep(1); setSubStep(1);
                  } else {
                    setStep(1); setSubStep(0);
                  }
                }}
              />
            </motion.div>
          )}

          {/* STEP 3 — confirm receiving account */}
          {step === 3 && !loadingUserCryptoWallets && !loadingUserBankAccounts && (
            <motion.div key="s3"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
              <DashboardTradeStep3
                tradeType={activeTab}
                bankAccounts={userBankAccounts}
                cryptoAccounts={userCryptoWallets}
                selectedTokenNetworks={selectedToken?.networks}
                onProceed={handleConfirmBankDetails}
                onBack={() => { togglePaymentReceivingModal(false); setStep(2); }}
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
