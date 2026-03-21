import {useBankQuery} from "../../../../queries/bank.query.ts";
import {useEffect, useState} from "react";
import type {UserBankAccountResponse} from "../../../../types/response.payload.types.ts";
import type {TradeType} from "../../../../types/trade.types.ts";
import {useDispatch} from "react-redux";
import {clearSelectedBankAccountId, setSelectedBankAccountId} from "../../../../redux/bank.slice.ts";

type ViewState =
  | "select-bank"
  | "create-bank"
  | "bank-details";

export const useConfirmBankDetailsModal = (
  bankAccounts: UserBankAccountResponse[] | undefined,
  tradeType: TradeType,
  onProceed: (value: number) => void,
  setShowConfirmBankDetails: (showConfirmBankDetails: boolean) => void
) => {
  const dispatch = useDispatch();
  const { createUserBankAccountMutation } = useBankQuery();

  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<UserBankAccountResponse | null>()
  const [viewState, setViewState] = useState<ViewState>("select-bank");

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
      dispatch(clearSelectedBankAccountId());
      dispatch(setSelectedBankAccountId(firstBank.id));
    }
  }, [tradeType, bankAccounts, selectedBankId, dispatch]);

  /** ---------------- BANK LOGIC ---------------- */
  const handleBankSelection = (bankId: string) => {
    setSelectedBankId(bankId);
    setSelectedBank(bankAccounts && bankAccounts.length > 0 ? bankAccounts.find(
      (bank) => bank.id === bankId
    ) : null);
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

  /** ---------------- COMMON ---------------- */
  const handleProceed = () => {
    onProceed(3);
    setShowConfirmBankDetails(false);
  };

  return {
    // Values
    selectedBankId,
    selectedBank,
    viewState,

    // Functions
    handleBankSelection,
    setViewState,
    handleSubmitBankDetails,
    handleViewSelectedBankDetails,
    handleProceed,
  }
}