import {useBankQuery} from "../../../../queries/bank.query.ts";
import {useCryptoQuery} from "../../../../queries/crypto.query.ts";
import {useEffect, useState} from "react";
import type {UserBankAccountResponse, UserCryptoWalletResponse} from "../../../../types/response.payload.types.ts";
import type {TradeType} from "../../../../types/trade.types.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../store.ts";
import {clearSelectedBankAccountId, setSelectedBankAccountId} from "../../../../redux/bank.slice.ts";
import {
  clearSelectedWalletId,
  setSelectedWalletId as setSelectedWalletAccountId
} from "../../../../redux/crypto.slice.ts";

type ViewState =
  | "select-bank"
  | "create-bank"
  | "bank-details"
  | "select-wallet"
  | "wallet-details"
  | "create-wallet";

export const useConfirmBankDetailsModal = (
  cryptoAccounts: UserCryptoWalletResponse[] | undefined,
  bankAccounts: UserBankAccountResponse[] | undefined,
  tradeType: TradeType,
  onProceed: (value: number) => void,
  setShowConfirmBankDetails: (showConfirmBankDetails: boolean) => void
) => {
  const dispatch = useDispatch();
  const { createUserBankAccountMutation } = useBankQuery();
  const { createUserCryptoWalletMutation } = useCryptoQuery()
  const newCryptoWallet: any = useSelector((state: RootState) => state.crypto.tradeCrypto.userCreateCrypto)
  
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<UserBankAccountResponse | null>()
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");
  const [selectedWallet, setSelectedWallet] = useState<UserCryptoWalletResponse | null>()
  const [viewState, setViewState] = useState<ViewState>(tradeType === "sell" ? "select-bank" : "select-wallet");
  
  // Track if we've initialized to prevent resets
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Single initialization effect
  useEffect(() => {
    if (hasInitialized) return;
    
    if (tradeType === "sell") {
      if (!bankAccounts || bankAccounts.length === 0) {
        setViewState("create-bank");
      } else {
        setViewState("select-bank");
        setSelectedBankId(bankAccounts[0].id);
      }
    } else if (tradeType === "buy") {
      if (!cryptoAccounts || cryptoAccounts.length === 0) {
        setViewState("create-wallet");
      } else {
        setViewState("select-wallet");
        setSelectedWalletId(cryptoAccounts[0].id);
      }
    }
    
    if (bankAccounts && bankAccounts.length > 0) {
      setSelectedBankId(bankAccounts[0].id);
      setSelectedBank(bankAccounts[0]);
      dispatch(clearSelectedWalletId())
      dispatch(setSelectedBankAccountId(bankAccounts[0].id))
    }
    
    if (cryptoAccounts && cryptoAccounts.length > 0) {
      setSelectedWalletId(cryptoAccounts[0].id);
      setSelectedWallet(cryptoAccounts[0]);
      dispatch(clearSelectedBankAccountId())
      dispatch(setSelectedWalletAccountId(cryptoAccounts[0].id))
    }
    
    setHasInitialized(true);
  }, [tradeType, bankAccounts, cryptoAccounts, hasInitialized]);
  
  // Update selected IDs when new accounts are added (but don't reset view)
  useEffect(() => {
    if (hasInitialized && bankAccounts && bankAccounts.length > 0 && !selectedBankId) {
      setSelectedBankId(bankAccounts[0].id);
    }
  }, [bankAccounts, selectedBankId, hasInitialized]);
  
  useEffect(() => {
    if (hasInitialized && cryptoAccounts && cryptoAccounts.length > 0 && !selectedWalletId) {
      setSelectedWalletId(cryptoAccounts[0].id);
    }
  }, [cryptoAccounts, selectedWalletId, hasInitialized]);
  
  /** ---------------- BANK LOGIC ---------------- */
  const handleBankSelection = (bankId: string) => {
    setSelectedBankId(bankId);
    setSelectedBank(bankAccounts && bankAccounts.length > 0 ? bankAccounts.find(
      (bank) => bank.id === bankId
    ) : null);
    dispatch(clearSelectedWalletId())
    dispatch(setSelectedBankAccountId(bankId))
  };
  
  const handleSubmitBankDetails = async () => {
    await createUserBankAccountMutation.mutateAsync();
    // Explicitly set view state after successful creation
    setViewState("select-bank");
  };
  
  const handleViewSelectedBankDetails = () => {
    if (selectedBankId) {
      setViewState("bank-details");
    }
  };
  
  /** ---------------- WALLET LOGIC ---------------- */
  const handleWalletSelection = (walletId: string) => {
    setSelectedWalletId(walletId);
    setSelectedWallet(cryptoAccounts && cryptoAccounts.length > 0 ? cryptoAccounts.find(
      (wallet) => wallet.id === walletId
    ) : null);
    dispatch(clearSelectedBankAccountId())
    dispatch(setSelectedWalletAccountId(walletId))
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