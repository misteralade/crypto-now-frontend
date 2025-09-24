import type { TradeCryptoPageProps} from "../../types/trade.types.ts";
import TradeStepDisplayHeading from "./TradeStepDisplayHeading.tsx";
import TradeStep1 from "./trade-steps/TradeStep1.tsx";
import TradeStep2 from "./trade-steps/TradeStep2.tsx";
import {useTradeStepDisplay} from "../../hooks/components/trade/useTradeStepDisplay.ts";

export default function TradeStepDisplay({activeTab, setActiveTab, tradeType, step, currency, token, setStep, setShowModal, setShowBankDetailsModal }: TradeCryptoPageProps) {
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

    // Mutations
    initiateTransactionMutation,

    // Functions
    setAmountToBuy,
    setNumberOfToken,
    setSelectedCurrency,
    setSelectedToken,
  } = useTradeStepDisplay(token, tradeType, activeTab, currency, setStep);

  // const buyAccountDetails: TradeAdditionalInfoInterface[] = [
  //   {
  //     title: "Address",
  //     value: <CopyAccountDetails accountNumber={`0xdAC17F958D2ee523a2206206994597C13D831ec7`} /> ,
  //   },
  //   {
  //     title: "Coin type",
  //     value: `${selectedToken?.name}`,
  //   },
  //   {
  //     title: "Network type",
  //     value: "BEP20"
  //   },
  //   {
  //     title: "Amount",
  //     value: `${numberOfToken} ${selectedToken?.name}`
  //   }
  // ]
  //
  // const sellAccountDetails: TradeAdditionalInfoInterface[] = [
  //   {
  //     title: "Account number",
  //     value:  <CopyAccountDetails accountNumber={`0003450953`} />
  //   },
  //   {
  //     title: "Account name",
  //     value: "CrytoNow Limited"
  //   },
  //   {
  //     title: "Bank name",
  //     value: "Sterling Bank"
  //   },
  //   {
  //     title: "Amount",
  //     value: `${amountToBuy} ${selectedCurrency?.name}`
  //   }
  // ]
  // const AccountDetails: TradeAdditionalInfoInterface[] = tradeType === "sell" ? buyAccountDetails : sellAccountDetails;

  return (
    <div className={`bg-greyBg rounded-2xl p-5 space-y-5`}>
      {/*heading*/}
      <TradeStepDisplayHeading step={step} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content*/}
      {step === 1 &&
        <TradeStep1
          token={token}
          currency={currency}
          tradeType={activeTab}
          handleProceedToPayment={() => initiateTransactionMutation.mutate()}
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
        <TradeStep2
          amountToBuy={Number(amountToBuy)}
          tradeType={activeTab}
          numberOfToken={Number(numberOfToken)}
          additionalInfo={AdditionalInfo}
          setShowModal={setShowModal}
          setShowBankDetailsModal={setShowBankDetailsModal}
          setStep={(value) => console.log(value)}
          selectedToken={selectedToken}
          selectedCurrency={selectedCurrency}
          exchangeRateId={exchangeRateId}
          // accountDetails={AccountDetails}
          // useStep3={false}
        />
      }
    </div>
  )
}