import type { TradeCryptoPageProps} from "../../types/trade.types.ts";
import TradeStepDisplayHeading from "./TradeStepDisplayHeading.tsx";
import TradeStepOne from "./trade-steps/TradeStepOne.tsx";
import TradeStepTwo from "./trade-steps/TradeStepTwo.tsx";
import {useTradeStepDisplay} from "../../hooks/components/trade/useTradeStepDisplay.ts";
import ConfirmBankDetailsModal from "./modals/ConfirmBankDetailsModal.tsx";
import {Fragment} from "react";

export default function TradeStepDisplay({activeTab, setActiveTab, tradeType, step, currency, token, setStep }: TradeCryptoPageProps) {
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
    WalletDetails,
    userBankAccounts,

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
  } = useTradeStepDisplay(token, tradeType, activeTab, currency, setStep);

  return (
    <Fragment>
      <div className={`bg-greyBg rounded-2xl p-5 space-y-5`}>
        {/*heading*/}
        <TradeStepDisplayHeading step={step} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content*/}
        {step === 1 &&
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
        }
        {step === 2 &&
          <TradeStepTwo
            amountToBuy={Number(amountToBuy)}
            tradeType={activeTab}
            numberOfToken={Number(numberOfToken)}
            additionalInfo={AdditionalInfo}
            // setShowModal={setShowModal}
            // setShowBankDetailsModal={setShowBankDetailsModal}
            // setStep={(value) => console.log(value)}
            selectedToken={selectedToken}
            selectedCurrency={selectedCurrency}
            exchangeRateId={exchangeRateId}
            handleReceiptUrl={handleReceiptUrl}
            transactionRef={transactionSessionId}
            handleTransactionHash={handleTransactionHash}
            handleSubmitPaymentProof={makePaymentTransaction}
          />
        }
      </div>

      {/*<PaymentConfirmationModal isOpen={showPaymentReceivingModal} />*/}
      <ConfirmBankDetailsModal
        isOpen={showPaymentReceivingModal}
        bankAccounts={userBankAccounts || []}
        tradeType={activeTab}
        walletData={WalletDetails}
        onProceed={setStep}
        setShowConfirmBankDetails={toggleConfirmBankDetails}
      />
    </Fragment>
  )
}