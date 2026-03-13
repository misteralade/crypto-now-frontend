/**
 * DashboardTrade — the full buy/sell flow embedded inside the dashboard AuthenticatedLayout.
 *
 * Step 1  — crypto selection grid (DashboardTradeStep1)
 * Step 1b — amount entry (DashboardTradeStep1b) — happens BEFORE initiating transaction
 * Step 2  — payment / wallet monitoring (DashboardTradeStep2)
 * Step 3  — confirm receiving account (DashboardTradeStep3)
 * Step 4  — success (DashboardTradeSuccess)
 *
 * All API/state logic is unchanged — reuses useTradeStepDisplay + useTradeStepTwo exactly.
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

// Step progress indicator
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i}
          className="rounded-full transition-all"
          style={{
            width: current === i + 1 ? "20px" : "6px",
            height: "6px",
            background: current >= i + 1 ? "#948EEE" : "#EEEEEE",
          }} />
      ))}
    </div>
  );
}

const STEP_LABELS: Record<number, string> = {
  1: "Select Crypto",
  2: "Make Payment",
  3: "Confirm Account",
  4: "Done",
};

export default function DashboardTrade() {
  const navigate = useNavigate();
  const searchParams: { option?: string; currency?: string; token?: string; sessionId?: string } =
    useSearch({ strict: false });

  const routeOption = searchParams.option;
  const currency = searchParams.currency ?? "";
  const token = searchParams.token ?? "";
  const sessionId = searchParams.sessionId;

  const [step, setStep] = useState<number>(1);
  // sub-step within step 1: 0 = crypto selection, 1 = amount entry
  const [subStep, setSubStep] = useState<0 | 1>(0);
  const [activeTab, setActiveTab] = useState<TradeType>(
    routeOption?.toLowerCase() === "sell" ? "sell" : "buy"
  );

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

  // Persist step changes
  useEffect(() => {
    if (step === 3) { clearTradeProgress(); return; }
    saveTradeProgress({ step, activeTab });
  }, [step, activeTab]);

  // Cleanup on unmount
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
    exchangeRateId, isInitiatingTrade, transactionSessionId,
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

  // When the hook's modal opens (step 3), we navigate to our step 3
  useEffect(() => {
    if (showPaymentReceivingModal) setStep(3);
  }, [showPaymentReceivingModal]);

  const handleInitiate = () => {
    initiateTransaction();
  };

  const handleReset = () => {
    clearTradeProgress();
    setStep(1);
    setSubStep(0);
    navigate({ to: "/dashboard/trade", search: {}, replace: true });
  };

  // When navigating to step 1 with a pre-selected token (from URL), skip to 1b
  useEffect(() => {
    if (token && supportedCryptoCurrencies && step === 1 && subStep === 0) {
      const found = supportedCryptoCurrencies.find((t) => t.id === token);
      if (found) {
        setSelectedToken(found);
        setSubStep(1);
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

  const totalSteps = 4;
  // Display step: step 1 sub 0 = 1, sub 1 = 2 (but visual progress 1 of 4), step 2 = 3, step 3 = 4
  const displayStep = step === 1 ? (subStep === 0 ? 1 : 2) : step === 2 ? 3 : step >= 3 ? 4 : step;

  const isBuy = activeTab === "buy";

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100dvh" }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[22px] font-extrabold" style={{ color: "#0E0F0C", fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
              {isBuy ? "Buy Crypto" : "Sell Crypto"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#9A9A9A" }}>
              {STEP_LABELS[step] ?? ""}
            </p>
          </div>
          <StepDots current={displayStep} total={totalSteps} />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-32">
        <AnimatePresence mode="wait">
          {/* STEP 1 — crypto grid */}
          {step === 1 && subStep === 0 && (
            <motion.div key="s1-crypto"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              <DashboardTradeStep1
                tradeType={activeTab}
                setActiveTab={(t) => { setActiveTab(t); setSubStep(0); }}
                availableTokens={(!loadingSupportedCryptocurrencies && supportedCryptoCurrencies) || []}
                selectedToken={selectedToken}
                setSelectedToken={(t) => { setSelectedToken(t); setSubStep(1); }}
                isInitiatingTrade={isInitiatingTrade}
                onProceed={() => selectedToken && setSubStep(1)}
              />
            </motion.div>
          )}

          {/* STEP 1b — amount entry */}
          {step === 1 && subStep === 1 && selectedToken && (
            <motion.div key="s1-amount"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
              <DashboardTradeStep1b
                tradeType={activeTab}
                selectedToken={selectedToken}
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
                onProceed={handleInitiate}
                onBack={() => setSubStep(0)}
              />
            </motion.div>
          )}

          {/* STEP 2 — payment */}
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
                onBack={() => { setStep(1); setSubStep(1); }}
              />
            </motion.div>
          )}

          {/* STEP 3 — confirm account */}
          {step === 3 && !loadingUserCryptoWallets && !loadingUserBankAccounts && (
            <motion.div key="s3"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
              <DashboardTradeStep3
                tradeType={activeTab}
                bankAccounts={userBankAccounts}
                cryptoAccounts={userCryptoWallets}
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
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email modal for anonymous users */}
      <EmailModal
        open={showUserEnterEmail && !isLoadingPingUser}
        onClose={toggleShowUserEnterEmail}
        onConfirm={handleAnonymousUserEmailInput}
      />
    </div>
  );
}
