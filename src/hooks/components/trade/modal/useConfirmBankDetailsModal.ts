import {useBankQuery} from "../../../../queries/bank.query.ts";
import {useCryptoQuery} from "../../../../queries/crypto.query.ts";
import {useEffect, useState} from "react";
import type {UserBankAccountResponse, UserCryptoWalletResponse} from "../../../../types/response.payload.types.ts";
import type {TradeType} from "../../../../types/trade.types.ts";
import {useSelector} from "react-redux";
import type {RootState} from "../../../../store.ts";

type ViewState =
  | "select-bank"
  | "create-bank"
  | "bank-details"
  | "select-wallet"
  | "wallet-details"
  | "create-wallet";

export const useConfirmBankDetailsModal = (cryptoAccounts: UserCryptoWalletResponse[] | undefined, bankAccounts: UserBankAccountResponse[] | undefined, tradeType: TradeType, onProceed: (value: number) => void, setShowConfirmBankDetails: (showConfirmBankDetails: boolean) => void) => {
  const { createUserBankAccountMutation } = useBankQuery();
  const { createUserCryptoWalletMutation } = useCryptoQuery()
  const newCryptoWallet: any = useSelector((state: RootState) => state.crypto.tradeCrypto.userCreateCrypto)

  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");

  const [viewState, setViewState] = useState<ViewState>(tradeType === "sell" ? "select-bank" : "select-wallet");

  // Default selected bank
  useEffect(() => {
    if (bankAccounts && bankAccounts.length > 0) {
      setSelectedBankId(bankAccounts[0].id);
    }
  }, [bankAccounts]);

  // Default selected wallet
  useEffect(() => {
    if (cryptoAccounts && cryptoAccounts.length > 0) {
      setSelectedWalletId(cryptoAccounts[0].id);
    }
  }, [cryptoAccounts]);

  // Determine initial view
  useEffect(() => {
    if (tradeType === "sell") {
      if (!bankAccounts || bankAccounts.length === 0) {
        setViewState("create-bank");
      } else {
        setViewState("select-bank");
      }
    } else if (tradeType === "buy") {
      if (!cryptoAccounts || cryptoAccounts.length === 0) {
        setViewState("create-wallet");
      } else {
        setViewState("select-wallet");
      }
    }
  }, [tradeType, bankAccounts, cryptoAccounts]);

  /** ---------------- BANK LOGIC ---------------- */
  const handleBankSelection = (bankId: string) => {
    setSelectedBankId(bankId);
  };

  const handleSubmitBankDetails = async () => {
    await createUserBankAccountMutation.mutateAsync();
    if (bankAccounts && bankAccounts.length > 0) {
      setViewState("select-bank");
    }
  };

  const handleViewSelectedBankDetails = () => {
    if (selectedBankId) {
      setViewState("bank-details");
    }
  };

  /** ---------------- WALLET LOGIC ---------------- */
  const handleWalletSelection = (walletId: string) => {
    setSelectedWalletId(walletId);
  };

  const handleSubmitWalletDetails = () => {
    if (newCryptoWallet) {
      createUserCryptoWalletMutation.mutate(newCryptoWallet)
      setViewState("select-wallet")
    }
  }

  const handleViewSelectedWalletDetails = () => {
    if (selectedWalletId) {
      setViewState("wallet-details");
    }
  };

  /** ---------------- COMMON ---------------- */
  const handleProceed = () => {
    onProceed(3);
    setShowConfirmBankDetails(false);
  };

  const selectedBank = bankAccounts && bankAccounts.length > 0 ? bankAccounts.find(
    (bank) => bank.id === selectedBankId
  ) : null;

  const selectedWallet = cryptoAccounts && cryptoAccounts.length > 0 ? cryptoAccounts.find(
    (wallet) => wallet.id === selectedWalletId
  ) : null;

  return {
    // Values
    selectedBankId,
    selectedBank,
    selectedWalletId,
    selectedWallet,
    viewState,

    // Functions
    handleBankSelection,
    setViewState,
    handleWalletSelection,
    handleSubmitBankDetails,
    handleSubmitWalletDetails,
    handleViewSelectedBankDetails,
    handleViewSelectedWalletDetails,
    handleProceed,
  }
}