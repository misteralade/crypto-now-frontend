import type { TradeCryptoPageProps } from "../../types/trade.types.ts";
import TradeStepDisplayHeading from "./TradeStepDisplayHeading.tsx";
import TradeStepOne from "./trade-steps/TradeStepOne.tsx";
import TradeStepTwo from "./trade-steps/TradeStepTwo.tsx";
import { useTradeStepDisplay } from "../../hooks/components/trade/useTradeStepDisplay.ts";
import ConfirmBankDetailsModal from "./modals/ConfirmBankDetailsModal.tsx";
import { Fragment, useEffect, useRef } from "react";
import {
  clearTradeProgress,
  loadTradeProgress,
  saveTradeProgress,
} from "../../util/tradeProgress.storage.util.ts";
import EmailModal from "./modals/EmailModal.tsx";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { LoadingSpinner } from "../../components/global/LoadingSpinner.tsx";
import { useAppSelector } from "../../hooks.ts";

const TradeStepDisplay = ({
  activeTab,
  setActiveTab,
  step,
  currency,
  token,
  setStep,
  sessionId,
}: TradeCryptoPageProps) => {
  const navigate = useNavigate();
  // Read ?amount and ?sessionId from query to prefill from guest flow or restore transaction
  const searchParams: { amount?: string; sessionId?: string; option?: string } =
    useSearch({ strict: false });
  const initialAmount = searchParams?.amount;
  const sessionIdFromQuery = sessionId || searchParams?.sessionId;

  // Get anonymous user email from Redux
  const anonymousUserEmail = useAppSelector(
    (state) => state.user.trade.anonymous.email,
  );

  // Track if restoration has already happened for current sessionId to prevent re-restoration
  const hasRestoredRef = useRef<string | null>(null);
  // Track if we reached step 3 from a continuing transaction to prevent reset
  const reachedStep3FromContinuingRef = useRef<boolean>(false);
  // Track if we've initialized on mount to prevent reset logic from running on step changes
  const hasInitializedRef = useRef<boolean>(false);

  // 1) On mount: only keep progress if navigation type is "reload", and not step 3
  // If sessionId is present, skip clearing to allow restoration and set step to 2
  useEffect(() => {
    // If we're already on step 3 and reached it from continuing a transaction, don't reset
    if (step === 3 && reachedStep3FromContinuingRef.current) {
      return;
    }

    // If sessionId is present and hasn't been restored yet for this sessionId,
    // don't set step here - let the restoration logic in useTradeStepDisplay determine the step
    // based on transaction status (INITIATED -> step 2, AWAITING_CRYPTO/AWAITING_PAYMENT -> step 1)
    if (sessionIdFromQuery && hasRestoredRef.current !== sessionIdFromQuery) {
      hasRestoredRef.current = sessionIdFromQuery;
      hasInitializedRef.current = true;
      // Step will be set by the restoration logic in useTradeStepDisplay based on transaction status
      return;
    }

    // If sessionId is present but already restored for this sessionId, don't do anything
    if (sessionIdFromQuery && hasRestoredRef.current === sessionIdFromQuery) {
      hasInitializedRef.current = true;
      return;
    }

    // Only run reset/restore logic on initial mount, not on every step change
    if (hasInitializedRef.current) {
      return;
    }

    const nav = performance?.getEntriesByType?.("navigation")?.[0] as
      | PerformanceNavigationTiming
      | undefined;

    const isReload = nav?.type === "reload";
    const saved = loadTradeProgress();

    // If step 3 is saved, always clear progress and reset to step 1
    // BUT: if we just reached step 3 from continuing a transaction, don't reset
    if (saved?.step === 3 && !reachedStep3FromContinuingRef.current) {
      clearTradeProgress();
      setStep(1);
      hasInitializedRef.current = true;
      return;
    }

    // If not a reload, clear progress and start fresh
    // BUT: if we're on step 3 from continuing a transaction, don't reset
    if (!isReload && step !== 3) {
      clearTradeProgress();
      setStep(1);
      hasInitializedRef.current = true;
      return;
    }

    // Only restore if it's a reload and step is not 3
    if (saved) {
      if (
        typeof saved.step === "number" &&
        saved.step !== step &&
        saved.step !== 3
      ) {
        setStep(saved.step);
      }
      if (saved.activeTab && saved.activeTab !== activeTab) {
        setActiveTab(saved.activeTab);
      }
    }

    hasInitializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionIdFromQuery, step]);

  // Persist whenever step / activeTab change
  useEffect(() => {
    // Don't save step 3 to progress
    if (step === 3) {
      clearTradeProgress();

      // If we reached step 3 from continuing a transaction, mark it
      if (sessionIdFromQuery) {
        reachedStep3FromContinuingRef.current = true;
      }

      // Clear sessionId from query parameters when step 3 is reached
      if (sessionIdFromQuery) {
        const currentSearch = { ...searchParams };
        delete currentSearch.sessionId;
        navigate({
          to: "/trade-crypto",
          search: currentSearch,
          replace: true,
        });
      }
      return;
    }
    // Reset the flag when leaving step 3
    if (step !== 3) {
      reachedStep3FromContinuingRef.current = false;
    }
    saveTradeProgress({ step, activeTab });
  }, [step, activeTab, sessionIdFromQuery, searchParams, navigate]);

  const {
    // Values
    selectedToken,
    numberOfToken,
    AdditionalInfo,
    amountToBuy,
    selectedCurrency,
    supportedCurrencies,
    supportedCryptoCurrencies,
    isInitiatingTrade,
    transactionSessionId,
    showPaymentReceivingModal,
    userBankAccounts,
    showUserEnterEmail,
    isLoadingPingUser,
    loadingSupportedCryptocurrencies,
    loadingUserBankAccounts,
    sellDepositWallet,

    // Functions
    setAmountToBuy,
    setNumberOfToken,
    setSelectedCurrency,
    setSelectedToken,
    handleReceiptUrl,
    handleTransactionHash,
    initiateTransaction,
    makePaymentTransaction,
    handleConfirmBankDetails,
    handleAnonymousUserEmailInput,
    toggleShowUserEnterEmail,
    togglePaymentReceivingModal,
    formatReceiveAmount,
    formatSendAmount,
    handleFocusNumberOfToken,
    handleFocusAmountToBuy,
    handleBlurNumberOfToken,
    handleBlurAmountToBuy,
  } = useTradeStepDisplay(
    token,
    activeTab,
    currency,
    setStep,
    setActiveTab,
    initialAmount,
    step,
    sessionIdFromQuery,
  );

  // prefill amt on first load if provided in the URL and fields are empty
  useEffect(() => {
    if (!initialAmount) return;
    const amount = Number(initialAmount);
    if (!isFinite(amount) || amount <= 0) return;

    if (activeTab === "buy") {
      if (amountToBuy === "" || Number(amountToBuy) === 0) {
        setAmountToBuy(String(amount));
        saveTradeProgress({ amountToBuy: String(amount) });
      }
    } else {
      if (numberOfToken === "" || Number(numberOfToken) === 0) {
        setAmountToBuy(String(amount));
        saveTradeProgress({ numberOfToken: String(amount) });
      }
    }
  }, []);

  // 2) On unmount: clear progress for SPA route changes, but keep it for reloads
  useEffect(() => {
    let isReloading = false;
    const onBeforeUnload = () => {
      // Fires for both reloads and full navigations away.
      // We only care here to prevent clearing on reload.
      isReloading = true;
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      // If component unmounted without beforeunload (SPA route change),
      // or beforeunload didn’t run (some SPA transitions), clear progress.
      if (!isReloading) {
        clearTradeProgress();
      }
    };
  }, []);

  return (
    <>
      {isLoadingPingUser ? (
        <LoadingSpinner
          fullScreen={true}
          message="Checking authentication status..."
        />
      ) : (
        <Fragment>
          <div className={`bg-greyBg rounded-2xl p-5 space-y-5`}>
            {/*heading*/}
            <TradeStepDisplayHeading
              step={step}
              setStep={setStep}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              sessionId={sessionIdFromQuery}
            />

            {/* Content*/}
            {step === 1 && (
              <TradeStepOne
                token={token}
                currency={currency}
                tradeType={activeTab}
                handleProceedToPayment={initiateTransaction}
                orderDetails={AdditionalInfo}
                numberOfToken={numberOfToken}
                amountToBuy={amountToBuy}
                setAmountToBuy={setAmountToBuy}
                setNumberOfToken={setNumberOfToken}
                setSelectedCurrency={setSelectedCurrency}
                setSelectedToken={setSelectedToken}
                selectedCurrency={selectedCurrency}
                selectedToken={selectedToken}
                availableCurrencies={supportedCurrencies || []}
                availableTokens={
                  (!loadingSupportedCryptocurrencies &&
                    supportedCryptoCurrencies) ||
                  []
                }
                isInitiatingTrade={isInitiatingTrade}
                setActiveTab={setActiveTab}
                handleFocusNumberOfToken={handleFocusNumberOfToken}
                handleFocusAmountToBuy={handleFocusAmountToBuy}
                handleBlurNumberOfToken={handleBlurNumberOfToken}
                handleBlurAmountToBuy={handleBlurAmountToBuy}
                anonymousUserEmail={anonymousUserEmail}
                onChangeEmail={toggleShowUserEnterEmail}
              />
            )}
            {step === 2 && (
              <TradeStepTwo
                amountToBuy={
                  typeof amountToBuy === "string"
                    ? amountToBuy
                      ? Number(amountToBuy)
                      : 0
                    : amountToBuy || 0
                }
                tradeType={activeTab}
                numberOfToken={
                  typeof numberOfToken === "string"
                    ? numberOfToken
                      ? Number(numberOfToken)
                      : 0
                    : numberOfToken || 0
                }
                additionalInfo={AdditionalInfo}
                selectedToken={selectedToken}
                selectedCurrency={selectedCurrency}
                handleReceiptUrl={handleReceiptUrl}
                transactionRef={transactionSessionId}
                handleTransactionHash={handleTransactionHash}
                handleSubmitPaymentProof={makePaymentTransaction}
                formatReceiveAmount={formatReceiveAmount}
                formatSendAmount={formatSendAmount}
                sellDepositWallet={sellDepositWallet}
                sellNetwork={sellNetwork}
              />
            )}
          </div>

          {/*<PaymentConfirmationModal isOpen={showPaymentReceivingModal} />*/}
          {!loadingUserBankAccounts && (
            <ConfirmBankDetailsModal
              isOpen={showPaymentReceivingModal}
              bankAccounts={userBankAccounts}
              tradeType={activeTab}
              onProceed={handleConfirmBankDetails}
              setShowConfirmBankDetails={togglePaymentReceivingModal}
            />
          )}

          <EmailModal
            open={showUserEnterEmail && !isLoadingPingUser}
            onClose={toggleShowUserEnterEmail}
            onConfirm={handleAnonymousUserEmailInput}
          />
        </Fragment>
      )}
    </>
  );
};

export default TradeStepDisplay;
