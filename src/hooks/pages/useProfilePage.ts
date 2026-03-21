import {useState} from "react";
import {useDispatch} from "react-redux";
import {useUserQuery} from "../../queries/user.query.ts";
import {useBankQuery} from "../../queries/bank.query.ts";
import { clearProfilePersonalInfoField, setProfilePersonalInfoField } from "../../redux/user.slice.ts";
import {useAuthQuery} from "../../queries/auth.query.ts";
import type {
  CreateBankAccountRequestPayload,
} from "../../types/request.payload.types.ts";
import {
  clearNewBankAccount,
  clearUpdateSelectedBankAccountId,
  setNewBankAccountField,
  setUpdateSelectedBankAccountId
} from "../../redux/bank.slice.ts";

export const useProfilePage = () => {
  const dispatch = useDispatch();
  const { userRequestPasswordChangeMutation, userToggleTwoFactorAuthenticationMutation } = useAuthQuery();
  const { userProfileData, loadingUserProfile, updateProfileMutation, removeProfilePictureMutation } = useUserQuery();
  const { allBanks, loadingAllBanks } = useBankQuery();
  const { userBankAccounts, loadingUserBankAccounts, createUserBankAccountMutation, updateDefaultBankAccountMutation, deleteBankAccountMutation } = useBankQuery();

  const [selectedBank, setSelectedBank] = useState("");

  const [showCreateNewBankAccount, setShowCreateNewBankAccount] = useState(false);
  
  const handleSaveChanges = async () => {
    await updateProfileMutation.mutateAsync()
    
    dispatch(clearProfilePersonalInfoField());
  };
  
  const handleEnableTwoFactor = async () => {
    await userToggleTwoFactorAuthenticationMutation.mutateAsync();
  };
  
  const handlePersonalInfoProfileFieldUpdate = (field: 'firstName' | 'lastName' | 'phoneNumber' | 'dob' | 'profileImg', value: string) => {
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
      setSelectedBank('')
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
  
  const handleRemoveProfilePicture = () => {
    removeProfilePictureMutation.mutate();
  }
  
  const toggleShowCreateNewBankAccount = () => setShowCreateNewBankAccount(!showCreateNewBankAccount);

  return {
    // Values
    userProfileData,
    loadingUserProfile,
    allBanks,
    loadingAllBanks,
    userBankAccounts,
    loadingUserBankAccounts,
    selectedBank,
    showCreateNewBankAccount,

    // Functions
    handleChangePassword,
    handlePersonalInfoProfileFieldUpdate,
    handleSaveChanges,
    handleEnableTwoFactor,
    handleNewBankAccountField,
    handleCreateBankAccount,
    toggleShowCreateNewBankAccount,
    handleDefaultBankAccount,
    handleDeleteBankAccount,
    handleRemoveProfilePicture,
  }
}