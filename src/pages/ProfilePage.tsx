import {Fragment, useEffect} from "react";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout.tsx";
import {useProfilePage} from "../hooks/pages/useProfilePage.ts";
import ProfilePersonalInfoSection from "../components/pages/profile/ProfilePersonalInfoSection.tsx";
import ProfileBankDetailsSection from "../components/pages/profile/ProfileBankDetailsSection.tsx";
import ProfileAddressDetailsSection from "../components/pages/profile/ProfileAddressDetailsSection.tsx";
import CustomButton from "../components/global/Button.tsx";
import ProfileSecuritySettingsSection from "../components/pages/profile/ProfileSecuritySection.tsx";
import TwoFactorModal from "../components/pages/profile/TwoFactorModal.tsx";
import {LoadingSpinner} from "../components/global/LoadingSpinner.tsx";
import NewBankAccountModal from "../components/pages/profile/modals/NewBankAccountModal.tsx";
import NewCryptoWalletModal from "../components/pages/profile/modals/NewCryptoWalletModal.tsx";

const ProfilePage = () => {
  const {
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
  } = useProfilePage();
  
  useEffect(() => {
    if (!loadingUserProfile) {
      handlePersonalInfoProfileFieldUpdate("firstName", userProfileData?.profile?.firstName || "");
      handlePersonalInfoProfileFieldUpdate("lastName", userProfileData?.profile?.lastName || "");
      // setEmail(userProfileData?.email || "");
      handlePersonalInfoProfileFieldUpdate("phoneNumber", userProfileData?.profile?.phoneNumber || "");
    }
  }, [loadingUserProfile]);
  
  return (
    <AuthenticatedLayout>
      <div className="w-full md:w-[90%] 2xl:max-w-7xl mx-auto md:-mt-10 px-3 md:px-0 space-y-10 ">
        <div className="space-y-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-titleColor">
            Account settings
          </h1>
          
          {loadingUserProfile ? (
            <div
              className={`w-full min-h-[60vh] flex items-center justify-center`}
            >
              <LoadingSpinner fullScreen={true} size={"xl"} message={`Loading user profile...`} />
            </div>
          ) : (
            <Fragment>
              <div className={`space-y-10`}>
                <ProfilePersonalInfoSection
                  firstName={userProfileData?.profile?.firstName || ''}
                  lastName={userProfileData?.profile?.lastName || ''}
                  email={userProfileData?.email || ''}
                  phoneNumber={userProfileData?.profile?.phoneNumber || ''}
                  handleFieldChange={handlePersonalInfoProfileFieldUpdate}
                />
                
                <div className="space-y-6">
                  <h3 className="text-lg">Bank details</h3>
                  
                  {!loadingUserBankAccounts && !userBankAccounts ? (
                    <div className="w-full flex items-center justify-center">
                      <CustomButton
                        buttonText="Add Bank account"
                        onClick={toggleShowCreateNewBankAccount}
                      />
                    </div>
                  ) : (
                    <ProfileBankDetailsSection
                      banks={userBankAccounts}
                      createNewBankModal={toggleShowCreateNewBankAccount}
                      makeBankAccountDefault={handleDefaultBankAccount}
                      handleDeleteBank={handleDeleteBankAccount}
                    />
                  )}
                </div>
                
                
                <div className="space-y-6">
                  <h3 className="text-lg">Wallet details</h3>
                  
                  {!loadingAllUserCryptoWallets && !allUserCryptoWallets ? (
                    <div className="w-full flex items-center justify-center">
                      <CustomButton
                        buttonText="Add Crypto Wallet"
                        onClick={toggleShowCreateNewWallet}
                      />
                    </div>
                  ) : (
                    <ProfileAddressDetailsSection
                      wallets={allUserCryptoWallets ? allUserCryptoWallets : []}
                      createNewWalletModal={toggleShowCreateNewWallet}
                      makePrimaryWallet={handleMakeWalletDefault}
                      deleteWallet={handleDeleteWallet}
                    />
                  )}
                </div>
                
                <div className="flex flex-col-reverse md:flex-row gap-4 md:justify-end pt-4">
                  <button
                    onClick={handleCancel}
                    className="h-12 px-8 rounded-full text-gray-700 font-semibold text-base hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <CustomButton
                    buttonText="Save Changes"
                    onClick={handleSaveChanges}
                  />
                </div>
              </div>
              
              <ProfileSecuritySettingsSection
                onEnableTwoFactor={handleEnableTwoFactor}
                onChangePassword={handleChangePassword}
              />
            </Fragment>
          )}
        </div>
      </div>
      
      <TwoFactorModal
        isOpen={isTwoFactorModalOpen}
        onClose={toggleTwoFactorModal}
        onConfirm={handleTwoFactorConfirm}
      />
      
      <NewBankAccountModal
        isOpen={showCreateNewBankAccount}
        banks={!loadingAllBanks && allBanks ? allBanks : []}
        selectedBankId={selectedBank}
        handleChangeField={handleNewBankAccountField}
        onClose={toggleShowCreateNewBankAccount}
        onSubmit={handleCreateBankAccount}
      />
      
      <NewCryptoWalletModal
        isOpen={showCreateWallet}
        supportedCryptoWallet={!loadingSupportedCryptocurrencies && supportedCryptoCurrencies !== undefined ? supportedCryptoCurrencies : []}
        selectedWalletId={selectedWallet}
        onClose={toggleShowCreateNewWallet}
        onSubmit={handleCreateWallet}
        handleChangeField={handleNewWalletField}
      />
    </AuthenticatedLayout>
  )
}

export default ProfilePage;
