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
  cryptoAccounts: UserCryptoWalletResponse[] | null,
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
  
  // Track if we've initialized view state to prevent resets
  const [hasInitializedView, setHasInitializedView] = useState(false);
  
  // Initialize view state based on trade type and account availability
  useEffect(() => {
    if (hasInitializedView) return;
    
    if (tradeType === "sell") {
      if (!bankAccounts || bankAccounts.length === 0) {
        setViewState("create-bank");
      } else {
        setViewState("select-bank");
      }
    } else if (tradeType === "buy") {
      // For buy transactions, always show create-wallet view (don't retrieve old wallets)
      setViewState("create-wallet");
    }
    
    setHasInitializedView(true);
  }, [tradeType, bankAccounts, hasInitializedView]);
  
  // Always select the first bank account when available (for SELL transactions)
  // This ensures Redux state is updated even if accounts load after component mount
  useEffect(() => {
    if (tradeType === "sell" && bankAccounts && bankAccounts.length > 0 && !selectedBankId) {
      const firstBank = bankAccounts[0];
      setSelectedBankId(firstBank.id);
      setSelectedBank(firstBank);
      dispatch(clearSelectedWalletId());
      dispatch(setSelectedBankAccountId(firstBank.id));
    }
  }, [tradeType, bankAccounts, selectedBankId, dispatch]);
  
  // For buy transactions, we no longer auto-select wallets since we always show create-wallet view
  
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
  
  const handleSubmitWalletDetails = async (overrideWallet?: { walletAddress: string; network: string; isVerified?: boolean; isPrimary?: boolean }) => {
    const walletPayload = overrideWallet ?? newCryptoWallet;
    if (walletPayload) {
      const response = await createUserCryptoWalletMutation.mutateAsync(overrideWallet ?? undefined)
      if (response.success && response.data) {
        // Capture the wallet ID from the API response
        const walletId = response.data;
        // Set the wallet ID in Redux state
        dispatch(setSelectedWalletAccountId(walletId));
        dispatch(clearSelectedBankAccountId());
        // Now proceed to confirm payment with the wallet ID
        handleProceed();
      }
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