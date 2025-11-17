import {useState} from "react";
import {useDispatch} from "react-redux";
import {useUserQuery} from "../../queries/user.query.ts";
import {useBankQuery} from "../../queries/bank.query.ts";
import {clearProfilePersonalInfoField, setProfilePersonalInfoField} from "../../redux/user.slice.ts";
import {useAuthQuery} from "../../queries/auth.query.ts";
import type {
  CreateBankAccountRequestPayload,
  UserCreateCryptoWalletRequestPayload
} from "../../types/request.payload.types.ts";
import {
  clearNewBankAccount,
  clearUpdateSelectedBankAccountId,
  setNewBankAccountField,
  setUpdateSelectedBankAccountId
} from "../../redux/bank.slice.ts";
import {useCryptoQuery} from "../../queries/crypto.query.ts";
import {
  clearCreateCryptoWalletField,
  clearUpdateCryptoWalletField,
  setCreateCryptoWalletField,
  setUpdateCryptoWalletId,
} from "../../redux/crypto.slice.ts";

export const useProfilePage = () => {
  const dispatch = useDispatch();
  const { userRequestPasswordChangeMutation } = useAuthQuery();
  const { userProfileData, loadingUserProfile } = useUserQuery();
  const { allBanks, loadingAllBanks } = useBankQuery();
  const { supportedCryptoCurrencies, loadingSupportedCryptocurrencies, allUserCryptoWallets, loadingAllUserCryptoWallets, createUserWalletMutation, makeWalletPrimaryMutation, deleteUserWalletMutation } = useCryptoQuery();
  const { userBankAccounts, loadingUserBankAccounts, createUserBankAccountMutation, updateDefaultBankAccountMutation, deleteBankAccountMutation } = useBankQuery();
  
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [showCreateNewBankAccount, setShowCreateNewBankAccount] = useState(false);
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  
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
    setSelectedWallet('')
    dispatch(clearCreateCryptoWalletField())
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
 
  const handleNewWalletField = (field: keyof UserCreateCryptoWalletRequestPayload, value: any) => {
    if (field === 'cryptoId') {
      setSelectedWallet(value);
    }
    dispatch(setCreateCryptoWalletField({
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
  
  const handleCreateWallet = async () => {
    const { success } = await createUserWalletMutation.mutateAsync();
    if (success) {
      toggleShowCreateNewWallet();
      dispatch(clearCreateCryptoWalletField());
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
  
  const handleMakeWalletDefault = async (id: string) => {
    dispatch(setUpdateCryptoWalletId(id))
    const { success } = await makeWalletPrimaryMutation.mutateAsync()
    if (success) {
      dispatch(clearUpdateCryptoWalletField())
    }
  }
  
  const handleDeleteWallet = async (id: string) => {
    dispatch(setUpdateCryptoWalletId(id))
    const { success } = await deleteUserWalletMutation.mutateAsync()
    if (success) {
      dispatch(clearUpdateCryptoWalletField())
    }
  }
  
  const toggleTwoFactorModal = () => setIsTwoFactorModalOpen(!isTwoFactorModalOpen);
  
  const toggleShowCreateNewBankAccount = () => setShowCreateNewBankAccount(!showCreateNewBankAccount);
  
  const toggleShowCreateNewWallet = () => setShowCreateWallet(!showCreateWallet);
  
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
    supportedCryptoCurrencies,
    loadingSupportedCryptocurrencies,
    allUserCryptoWallets,
    loadingAllUserCryptoWallets,
    showCreateWallet,
    selectedWallet,
    
    // Functions
    handleChangePassword,
    handlePersonalInfoProfileFieldUpdate,
    handleCancel,
    handleSaveChanges,
    handleEnableTwoFactor,
    handleTwoFactorConfirm,
    toggleTwoFactorModal,
    handleNewBankAccountField,
    handleCreateBankAccount,
    toggleShowCreateNewBankAccount,
    handleDefaultBankAccount,
    handleDeleteBankAccount,
    toggleShowCreateNewWallet,
    handleCreateWallet,
    handleNewWalletField,
    handleMakeWalletDefault,
    handleDeleteWallet,
  }
}