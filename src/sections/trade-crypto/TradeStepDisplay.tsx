import type { TradeCryptoPageProps } from "../../types/trade.types.ts";
import TradeStepDisplayHeading from "./TradeStepDisplayHeading.tsx";
import TradeStepOne from "./trade-steps/TradeStepOne.tsx";
import TradeStepTwo from "./trade-steps/TradeStepTwo.tsx";
import { useTradeStepDisplay } from "../../hooks/components/trade/useTradeStepDisplay.ts";
import ConfirmBankDetailsModal from "./modals/ConfirmBankDetailsModal.tsx";
import { Fragment, useEffect } from "react";
import {
  clearTradeProgress,
  loadTradeProgress,
  saveTradeProgress,
} from "../../util/tradeProgress.storgae.ts";

export default function TradeStepDisplay({
  activeTab,
  setActiveTab,
  tradeType,
  step,
  currency,
  token,
  setStep,
}: TradeCryptoPageProps) {
  // Restore step/activeTab on mount
  useEffect(() => {
    const saved = loadTradeProgress();
    if (!saved) return;
    if (typeof saved.step === "number" && saved.step !== step) {
      setStep(saved.step);
    }
    if (saved.activeTab && saved.activeTab !== activeTab) {
      setActiveTab(saved.activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist whenever step / activeTab change
  useEffect(() => {
    saveTradeProgress({ step, activeTab });
  }, [step, activeTab]);

  const {
    // Values
    selectedToken,
    numberOfToken,
    AdditionalInfo,
    amountToBuy,
    selectedCurrency,
    supportedCurrencies,
    supportedCryptoCurrencies,
    exchangeRateId,
    transactionSessionId,
    showPaymentReceivingModal,
    userBankAccounts,
    userCryptoWallets,

    // Functions
    setAmountToBuy,
    setNumberOfToken,
    setSelectedCurrency,
    setSelectedToken,
    handleReceiptUrl,
    handleTransactionHash,
    toggleConfirmBankDetails,
    initiateTransaction,
    makePaymentTransaction,
    handleConfirmBankDetails,
  } = useTradeStepDisplay(token, tradeType, activeTab, currency, setStep);

  // 1) On mount: only keep progress if navigation type is "reload"
  useEffect(() => {
    const nav = performance?.getEntriesByType?.("navigation")?.[0] as
      | PerformanceNavigationTiming
      | undefined;

    const isReload = nav?.type === "reload";
    if (!isReload) {
      // Not a refresh: ensure we start clean
      clearTradeProgress();
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
    <Fragment>
      <div className={`bg-greyBg rounded-2xl p-5 space-y-5`}>
        {/*heading*/}
        <TradeStepDisplayHeading
          step={step}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
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
            availableTokens={supportedCryptoCurrencies || []}
          />
        )}
        {step === 2 && (
          <TradeStepTwo
            amountToBuy={Number(amountToBuy)}
            tradeType={activeTab}
            numberOfToken={Number(numberOfToken)}
            additionalInfo={AdditionalInfo}
            selectedToken={selectedToken}
            selectedCurrency={selectedCurrency}
            exchangeRateId={exchangeRateId}
            handleReceiptUrl={handleReceiptUrl}
            transactionRef={transactionSessionId}
            handleTransactionHash={handleTransactionHash}
            handleSubmitPaymentProof={makePaymentTransaction}
          />
        )}
      </div>

      {/*<PaymentConfirmationModal isOpen={showPaymentReceivingModal} />*/}
      <ConfirmBankDetailsModal
        isOpen={showPaymentReceivingModal}
        bankAccounts={userBankAccounts}
        cryptoAccounts={userCryptoWallets}
        tradeType={activeTab}
        onProceed={handleConfirmBankDetails}
        setShowConfirmBankDetails={toggleConfirmBankDetails}
      />
    </Fragment>
  );
}
