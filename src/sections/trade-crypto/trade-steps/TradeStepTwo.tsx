import type {TradeAdditionalInfoInterface, TradeType} from "../../../types/trade.types.ts";
import TradeAdditionalInfo from "../TradeAdditionalInfo.tsx";
import CustomButton from "../../../components/global/Button.tsx";
import {useTradeStepTwo} from "../../../hooks/components/trade/useTradeStepTwo.ts";
import type {SupportedCryptoOrCurrencyResponse} from "../../../types/response.payload.types.ts";
import TradePaymentUpload from "../TradePaymentUpload.tsx";
import CopyAccountDetails from "../CopyAccountDetails.tsx";

interface TradeStepTwoProps {
  amountToBuy: number;
  tradeType: TradeType;
  numberOfToken: number;
  additionalInfo: TradeAdditionalInfoInterface[];
  handleReceiptUrl: (value: string) => void;
  selectedToken?: SupportedCryptoOrCurrencyResponse;
  selectedCurrency?: SupportedCryptoOrCurrencyResponse;
  exchangeRateId: string;
  transactionRef: string | undefined;
  handleTransactionHash: (string: string) => void;
  handleSubmitPaymentProof: () => void;
}

export default function TradeStepTwo({ amountToBuy, tradeType, numberOfToken, additionalInfo, handleReceiptUrl, selectedToken, selectedCurrency, exchangeRateId, transactionRef, handleTransactionHash, handleSubmitPaymentProof }: TradeStepTwoProps) {
  const {
    // Values
    // files,
    transactionHash,
    paymentDetailsLoading,
    paymentDetailsError,
    submitInvalid,
    accountDetails,
    walletDetails,

    // Functions
    setTransactionHash,
    setUploadedFileUrl,
  } = useTradeStepTwo({tradeType, exchangeRateId, amountToBuy, numberOfToken, selectedToken, selectedCurrency });
  
  // Loading state
  if (paymentDetailsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading payment details...</span>
      </div>
    );
  }

  // Error state
  if (paymentDetailsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <h3 className="font-semibold text-red-800 mb-2">Error Loading Payment Details</h3>
        <p className="text-red-700 text-sm mb-4">
          {paymentDetailsError?.message || 'Failed to load payment details'}
        </p>
        <CustomButton
          buttonText="Retry"
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700"
        />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Trade Type Specific Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        {tradeType === "buy" ? (
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">
              💳 Payment Instructions (Buy Order)
            </h3>
            <p className="text-blue-700 text-sm">
              Please transfer <strong>{amountToBuy} {selectedCurrency?.code}</strong> to the bank account details below,
              then upload your payment receipt/proof.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-orange-800 mb-2">
              🔗 Crypto Transfer Instructions (Sell Order)
            </h3>
            <p className="text-orange-700 text-sm">
              Please send <strong>{numberOfToken} {selectedToken?.symbol}</strong> to the wallet address below
              on the <strong>{walletDetails?.network}</strong> network, then upload proof and provide the transaction hash.
            </p>
          </div>
        )}
      </div>

      {/* Transaction Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="font-semibold text-gray-800">Transaction Summary</h4>
        {tradeType === "buy" ? (
          <>
            <p className="text-sm">
              <span className="text-gray-600">You pay:</span>
              <span className="font-semibold ml-2">{amountToBuy.toLocaleString()} {selectedCurrency?.code}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">You receive:</span>
              <span className="font-semibold ml-2">{numberOfToken} {selectedToken?.symbol}</span>
            </p>
          </>
        ) : (
          <>
            <p className="text-sm">
              <span className="text-gray-600">You send:</span>
              <span className="font-semibold ml-2">{numberOfToken} {selectedToken?.symbol}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">You receive:</span>
              <span className="font-semibold ml-2">{amountToBuy} {selectedCurrency?.code}</span>
            </p>
          </>
        )}
      </div>

      {/* Account Details & Order Info */}
      <div className="space-y-3">
        <div className="flex w-full justify-between">
          <h1>Transaction Ref:</h1>

          <CopyAccountDetails accountNumber={transactionRef || ''}/>
        </div>

        <TradeAdditionalInfo
          heading={tradeType === "buy" ? "Bank Account Details" : "Crypto Wallet Details"}
          additionalInfo={accountDetails}
        />
        <TradeAdditionalInfo heading="Order Details" additionalInfo={additionalInfo} />
      </div>

      {/* Form */}
      <div className="space-y-10">
        {/* Transaction Hash Input for Sell Orders */}
        {tradeType === "sell" && (
          <div className="w-full md:w-3/4 mx-auto">
            <label htmlFor="transactionHash" className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Hash *
            </label>
            <input
              type="text"
              id="transactionHash"
              value={transactionHash}
              onChange={(e) => {
                setTransactionHash(e.target.value)
                handleTransactionHash(e.target.value)
              }}
              placeholder="Enter blockchain transaction hash (e.g., 0x123abc...)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide the transaction hash from your crypto wallet after sending the {selectedToken?.symbol}
            </p>
          </div>
        )}

        {/* Payment Proof Upload */}
        <div className="w-full md:w-3/4 mx-auto">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {tradeType === "buy" ? "Payment Receipt/Proof *" : "Transaction Proof *"}
            </label>
            <p className="text-xs text-gray-500">
              {tradeType === "buy"
                ? "Upload bank transfer receipt, screenshot, or payment confirmation"
                : "Upload screenshot of transaction confirmation from your wallet or block explorer"
              }
            </p>
          </div>
          <TradePaymentUpload
            maxFiles={1}
            acceptedTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
            onFileUploaded={handleReceiptUrl}
            setUploadedFileUrl={setUploadedFileUrl}
          />
        </div>

        {/* Submit Button */}
        <div className="md:w-1/2 w-full mx-auto px-5 md:px-0">
          <CustomButton
            className="w-full"
            buttonText={tradeType === "buy" ? "Submit Payment Proof" : "Submit Transaction Proof"}
            disabled={submitInvalid}
            onClick={handleSubmitPaymentProof}
          />
          {submitInvalid && (
            <p className="text-xs text-red-500 mt-2 text-center">
              {tradeType === "sell"
                ? "Please provide transaction hash and upload proof (file must be successfully uploaded)"
                : "Please upload payment proof (file must be successfully uploaded)"
              }
            </p>
          )}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notice</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          {tradeType === "buy" ? (
            <>
              <li>• Double-check the bank details before making the transfer</li>
              <li>• Use the exact amount: <strong>{amountToBuy.toLocaleString()} {selectedCurrency?.code}</strong></li>
              <li>• Include your order reference if requested by your bank</li>
              <li>• Keep your payment receipt for verification</li>
            </>
          ) : (
            <>
              <li>• Verify the wallet address and network before sending</li>
              <li>• Send exactly: <strong>{numberOfToken} {selectedToken?.symbol}</strong></li>
              <li>• Use the <strong>{walletDetails?.network}</strong> network only</li>
              <li>• Double-check the transaction hash before submitting</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}