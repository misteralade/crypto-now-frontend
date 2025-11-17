import {useState} from "react";
import {useDispatch} from "react-redux";
import {useUserQuery} from "../../queries/user.query.ts";
import {useBankQuery} from "../../queries/bank.query.ts";
import {clearProfilePersonalInfoField, setProfilePersonalInfoField} from "../../redux/user.slice.ts";
import {useAuthQuery} from "../../queries/auth.query.ts";
import type {CreateBankAccountRequestPayload} from "../../types/request.payload.types.ts";
import {
  clearNewBankAccount,
  clearUpdateSelectedBankAccountId,
  setNewBankAccountField,
  setUpdateSelectedBankAccountId
} from "../../redux/bank.slice.ts";

export const useProfilePage = () => {
  const dispatch = useDispatch();
  const { userRequestPasswordChangeMutation } = useAuthQuery();
  const { userProfileData, loadingUserProfile } = useUserQuery();
  const { allBanks, loadingAllBanks } = useBankQuery();
  const { userBankAccounts, loadingUserBankAccounts, createUserBankAccountMutation, updateDefaultBankAccountMutation, deleteBankAccountMutation } = useBankQuery();
  
  const [selectedBank, setSelectedBank] = useState("");
  
  const [selectedCoin, setSelectedCoin] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [showCreateNewBankAccount, setShowCreateNewBankAccount] = useState(false);
  
  const handleAddAddress = () => {
    console.log("Add address clicked");
    // Implement add address logic here
  };
  
  const handleSaveChanges = () => {
    console.log("Saving changes...");
    // Implement save logic here
  };
  
  const handleCancel = () => {
    console.log("Cancelling changes...");
    // reset form
    dispatch(clearProfilePersonalInfoField());
    
    // clear bank details
    setSelectedBank("");
    dispatch(clearNewBankAccount())
    
    // clear wallet details
    setSelectedCoin("");
    setWalletAddress("");
    setSelectedNetwork("");
  };
  
  const handleEnableTwoFactor = () => {
    setIsTwoFactorModalOpen(true);
  };
  
  const handleTwoFactorConfirm = (code: string) => {
    console.log("Two-factor code:", code);
    setIsTwoFactorModalOpen(false);
    // Implement two-factor setup logic here
  };
  
  const handlePersonalInfoProfileFieldUpdate = (field: 'firstName' | 'lastName' | 'phoneNumber', value: string) => {
    dispatch(setProfilePersonalInfoField({
      field,
      value,
    }))
  }
  
  const handleNewBankAccountField = (field: keyof CreateBankAccountRequestPayload, value: any) => {
    if (field === 'bankId') {
      setSelectedBank(value)
    }
    dispatch(setNewBankAccountField({
      field,
      value,
    }))
  }
  
  // Mutation Functions
  const handleChangePassword = () => {
    userRequestPasswordChangeMutation.mutate();
  };
  
  const handleCreateBankAccount = async () => {
    const { success } = await createUserBankAccountMutation.mutateAsync();
    if (success) {
      toggleShowCreateNewBankAccount();
      dispatch(clearNewBankAccount())
    }
  }
  
  const handleDefaultBankAccount = async (id: string) => {
    dispatch(setUpdateSelectedBankAccountId(id));
    const { success } = await updateDefaultBankAccountMutation.mutateAsync();
    
    if (success) {
      dispatch(clearUpdateSelectedBankAccountId());
    }
  }
  
  const handleDeleteBankAccount = async (id: string) => {
    dispatch(setUpdateSelectedBankAccountId(id));
    const { success } = await deleteBankAccountMutation.mutateAsync();
    
    if (success) {
      dispatch(clearUpdateSelectedBankAccountId());
    }
  }
  
  const toggleTwoFactorModal = () => setIsTwoFactorModalOpen(!isTwoFactorModalOpen);
  
  const toggleShowCreateNewBankAccount = () => setShowCreateNewBankAccount(!showCreateNewBankAccount);
  
  return {
    // Values
    userProfileData,
    loadingUserProfile,
    allBanks,
    loadingAllBanks,
    isTwoFactorModalOpen,
    userBankAccounts,
    loadingUserBankAccounts,
    selectedBank,
    showCreateNewBankAccount,
    
    // Functions
    handleChangePassword,
    handlePersonalInfoProfileFieldUpdate,
    handleCancel,
    handleSaveChanges,
    handleAddAddress,
    handleEnableTwoFactor,
    handleTwoFactorConfirm,
    toggleTwoFactorModal,
    handleNewBankAccountField,
    handleCreateBankAccount,
    toggleShowCreateNewBankAccount,
    handleDefaultBankAccount,
    handleDeleteBankAccount,
  }
}