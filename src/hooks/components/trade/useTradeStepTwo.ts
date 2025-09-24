import {useState, type FormEvent} from "react";
import {useQuery} from "@tanstack/react-query";
import {QUERY_KEYS} from "../../../queries/query.keys.ts";
import type {TradeType} from "../../../types/trade.types.ts";
import {bankServiceApi} from "../../../api/bank.api.ts";
import type {
  SupportedCryptoOrCurrencyResponse,
  SupportedPlatformBankAccountResponse,
  SupportedPlatformCryptoWalletResponse
} from "../../../types/response.payload.types.ts";
import {cryptoServiceApi} from "../../../api/crypto.api.ts";
import type {TradeAdditionalInfoInterface} from "../../../types/trade.types.ts";

interface UseTradeStepTwoProps {
  tradeType: TradeType;
  exchangeRateId: string;
  amountToBuy: number;
  numberOfToken: number;
  selectedToken?: SupportedCryptoOrCurrencyResponse;
  selectedCurrency?: SupportedCryptoOrCurrencyResponse;
  setShowModal: (value: boolean) => void;
  setShowBankDetailsModal: (value: boolean) => void;
  setStep?: (value: number) => void;
  onSubmitPaymentProof?: (files: File[], transactionHash?: string) => void;
}

export const useTradeStepTwo = ({ tradeType, exchangeRateId, amountToBuy, numberOfToken, selectedToken, selectedCurrency, setShowModal, setShowBankDetailsModal, setStep, onSubmitPaymentProof }: UseTradeStepTwoProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | undefined>();
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [bankDetails, setBankDetails] = useState<SupportedPlatformBankAccountResponse[] | null>(null);
  const [walletDetails, setWalletDetails] = useState<SupportedPlatformCryptoWalletResponse[] | null>(null);

  // Fetch payment details based on trade type
  const {isLoading: paymentDetailsLoading, error: paymentDetailsError} = useQuery({
    queryKey: [QUERY_KEYS.BANK.PLATFORM_BANK_DETAILS, QUERY_KEYS.CRYPTO.PLATFORM_CRYPTO_WALLET, exchangeRateId, tradeType],
    queryFn: async () => {
      if (tradeType === "buy") {
        const { data } = await bankServiceApi.getPlatformBankDetails();
        setBankDetails(data);
        return data;
      } else {
        const { data } = await cryptoServiceApi.getPlatformWallets();
        setWalletDetails(data);
        return data;
      }
    },
    enabled: !!exchangeRateId
  });

  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (files.length === 0 || !uploadedFileUrl) {
      alert("Please upload a file before proceeding.");
      return;
    }

    setShowModal(true);

    try {
      // Create submission data
      const submissionData = {
        exchangeRateId,
        tradeType,
        fileUrl: uploadedFileUrl,
        fileName: files[0]?.name,
        ...(tradeType === "sell" && { transactionHash })
      };

      console.log('Submitting payment proof:', submissionData);

      // Call centralized submit handler
      if (onSubmitPaymentProof) {
        onSubmitPaymentProof(files, tradeType === "sell" ? transactionHash : undefined);
      }

      setTimeout(() => {
        setShowModal(false);
        setShowBankDetailsModal(true);
        if (setStep) {
          setStep(3);
        }
      }, 1000);

    } catch (error) {
      console.error("[TradeStep2] Error submitting payment proof:", error);
      setShowModal(false);
      alert("Failed to submit payment proof. Please try again.");
    }
  };

  // Validation based on trade type
  const submitInvalid = tradeType === "sell"
    ? (transactionHash.trim() === "" || !uploadedFileUrl)
    : (!uploadedFileUrl);

  // Generate account details based on API response
  const generateAccountDetails = (): TradeAdditionalInfoInterface[] => {
    if (tradeType === "buy" && bankDetails && bankDetails.length > 0) {

      // Show all bank accounts if multiple exist
      const bank = bankDetails[0]; // Use first bank account
      return [
        {
          title: "Bank Account Number",
          value: bank.accountNumber
        },
        {
          title: "Account Name",
          value: bank.accountHolderName
        },
        {
          title: "Bank Name",
          value: bank.bankName
        },
        {
          title: "Amount to Pay",
          value: `${amountToBuy.toLocaleString()} ${selectedCurrency?.code}`
        }
      ];
    }

    if (tradeType === "sell" && walletDetails && walletDetails.length > 0) {
      const wallet = walletDetails[0]; // Use first wallet
      return [
        {
          title: "Wallet Address",
          value: wallet.walletAddress
        },
        {
          title: "Network",
          value: wallet.network
        },
        {
          title: "Coin Type",
          value: `${selectedToken?.name} (${selectedToken?.symbol})`
        },
        {
          title: "Amount to Send",
          value: `${numberOfToken} ${selectedToken?.symbol}`
        }
      ];
    }

    return [];
  };

  const oldGenerateAccountDetails = (): { title: string, value: string }[] => {
    if (tradeType === "buy" && bankDetails && bankDetails.length > 0) {
      // Return the nested details directly
      return bankDetails.map((bank, index) => ([
        {
          title: `Bank Account Number ${bankDetails.length > 1 ? index + 1 : ''}`.trim(),
          value: bank.accountNumber
        },
        {
          title: `Account Name ${bankDetails.length > 1 ? index + 1 : ''}`.trim(),
          value: bank.accountHolderName
        },
        {
          title: `Bank Name ${bankDetails.length > 1 ? index + 1 : ''}`.trim(),
          value: bank.bankName
        }
      ])).flat().concat([{
        title: "Amount to Pay",
        value: `${amountToBuy} ${selectedCurrency?.code}`
      }]);
    }

    if (tradeType === "sell" && walletDetails && walletDetails.length > 0) {
      // Return the nested details directly
      return walletDetails.map((wallet, index) => ([
        {
          title: `Wallet Address ${walletDetails.length > 1 ? index + 1 : ''}`.trim(),
          value: wallet.walletAddress
        },
        {
          title: `Network ${walletDetails.length > 1 ? index + 1 : ''}`.trim(),
          value: wallet.network
        }
      ])).flat().concat([
        {
          title: "Coin Type",
          value: `${selectedToken?.name} (${selectedToken?.symbol})`
        },
        {
          title: "Amount to Send",
          value: `${numberOfToken} ${selectedToken?.symbol}`
        }
      ]);
    }

    return [];
  };

  const accountDetails = generateAccountDetails();

  return {
    // Values
    files,
    uploadedFileUrl,
    transactionHash,
    bankDetails,
    walletDetails,
    paymentDetailsLoading,
    paymentDetailsError,
    submitInvalid,
    accountDetails,

    // Functions
    setFiles,
    setTransactionHash,
    handleSubmit,
    setUploadedFileUrl,
    oldGenerateAccountDetails,
  };
};