import { Fragment, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, User, Shield, CreditCard, LogOut, CheckCircle } from "lucide-react";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout.tsx";
import { useProfilePage } from "../hooks/pages/useProfilePage.ts";
import ProfilePersonalInfoSection from "../components/pages/profile/ProfilePersonalInfoSection.tsx";
import ProfileBankDetailsSection from "../components/pages/profile/ProfileBankDetailsSection.tsx";
import ProfileSecuritySettingsSection from "../components/pages/profile/ProfileSecuritySection.tsx";
import CustomButton from "../components/global/Button.tsx";
import { LoadingSpinner } from "../components/global/LoadingSpinner.tsx";
import NewBankAccountModal from "../components/pages/profile/modals/NewBankAccountModal.tsx";
import NewCryptoWalletModal from "../components/pages/profile/modals/NewCryptoWalletModal.tsx";
import { LOCAL_STORAGE_KEYS, ROUTES } from "../util/constants.util.ts";
import { useNavigate } from "@tanstack/react-router";
import { useTransactionQuery } from "../queries/transaction.query.ts";
import { convertToMillify, formatCurrency } from "../util/index.util.ts";

type Section = "personal" | "bank" | "security" | null;

const getInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return "U";
  return `${(firstName?.[0] || "").toUpperCase()}${(lastName?.[0] || "").toUpperCase()}` || "U";
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>(null);

  const {
    userProfileData,
    loadingUserProfile,
    allBanks,
    loadingAllBanks,
    userBankAccounts,
    loadingUserBankAccounts,
    selectedBank,
    showCreateNewBankAccount,
    supportedCryptoCurrencies,
    loadingSupportedCryptocurrencies,
    showCreateWallet,
    selectedWallet,
    handleChangePassword,
    handlePersonalInfoProfileFieldUpdate,
    handleSaveChanges,
    handleEnableTwoFactor,
    handleNewBankAccountField,
    handleCreateBankAccount,
    toggleShowCreateNewBankAccount,
    handleDefaultBankAccount,
    handleDeleteBankAccount,
    toggleShowCreateNewWallet,
    handleCreateWallet,
    handleNewWalletField,
    handleRemoveProfilePicture,
  } = useProfilePage();

  const { transactionSummary, loadingTransactionSummary } = useTransactionQuery();

  useEffect(() => {
    if (!loadingUserProfile) {
      handlePersonalInfoProfileFieldUpdate("firstName", userProfileData?.profile?.firstName || "");
      handlePersonalInfoProfileFieldUpdate("lastName", userProfileData?.profile?.lastName || "");
      handlePersonalInfoProfileFieldUpdate("phoneNumber", userProfileData?.profile?.phoneNumber || "");
    }
  }, [loadingUserProfile]);

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    navigate({ to: ROUTES.HOMEPAGE });
  };

  const initials = getInitials(
    userProfileData?.profile?.firstName,
    userProfileData?.profile?.lastName
  );

  const fullName = userProfileData?.profile?.firstName
    ? `${userProfileData.profile.firstName} ${userProfileData.profile.lastName || ""}`.trim()
    : "";

  const totalFiat =
    !loadingTransactionSummary && transactionSummary?.total?.[0]
      ? Number(transactionSummary.total[0].totalFiatAmount)
      : 0;

  const totalOrders =
    !loadingTransactionSummary && transactionSummary?.total?.[0]
      ? transactionSummary.total[0].transactionCount
      : "0";

  const buyCount =
    !loadingTransactionSummary && transactionSummary?.total?.[0]
      ? transactionSummary.total[0].buyCount
      : "0";

  const sellCount =
    !loadingTransactionSummary && transactionSummary?.total?.[0]
      ? transactionSummary.total[0].sellCount
      : "0";

  const menuItems = [
    {
      id: "personal" as Section,
      icon: User,
      label: "Edit Profile",
      sub: "Name, email, phone number",
      color: "#948EEE",
    },
    {
      id: "bank" as Section,
      icon: CreditCard,
      label: "Bank Details",
      sub: `${userBankAccounts?.length || 0} account${(userBankAccounts?.length || 0) === 1 ? "" : "s"} saved`,
      color: "#F7A600",
    },
    {
      id: "security" as Section,
      icon: Shield,
      label: "Security",
      sub: "2FA, password",
      color: "#037847",
    },
  ];

  return (
    <AuthenticatedLayout>
      <div className="max-w-2xl mx-auto">

        {/* ── Profile header card ── */}
        <div
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #03034D 0%, #0a0a6b 60%, #1a0a5c 100%)" }}
        >
          {/* Decorative circle */}
          <div
            className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full"
            style={{ background: "rgba(148,142,238,0.12)" }}
          />

          <div className="relative px-4 pt-8 pb-6 text-center">
            {/* Avatar */}
            {loadingUserProfile ? (
              <div className="w-20 h-20 rounded-full bg-white/20 animate-pulse mx-auto mb-3" />
            ) : userProfileData?.profile?.profileImg ? (
              <img
                src={userProfileData.profile.profileImg}
                alt={fullName}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white border-4"
                style={{ background: "#948EEE", borderColor: "rgba(255,255,255,0.2)" }}
              >
                {initials}
              </div>
            )}

            <h2 className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {loadingUserProfile ? (
                <span className="block h-5 w-32 bg-white/20 rounded animate-pulse mx-auto" />
              ) : (
                fullName || "Account"
              )}
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {userProfileData?.email || ""}
            </p>

            {/* TODO: Connect to KYC API — show real verification status */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-3"
              style={{ background: "rgba(3,120,71,0.2)", color: "#4ade80", border: "1px solid rgba(3,120,71,0.3)" }}
            >
              <CheckCircle size={11} />
              KYC Verified
            </div>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-4 px-4 pb-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {[
              { label: "Total Volume", value: loadingTransactionSummary ? "..." : `₦${convertToMillify(totalFiat)}` },
              { label: "Orders", value: loadingTransactionSummary ? "..." : totalOrders },
              { label: "Buys", value: loadingTransactionSummary ? "..." : buyCount },
              { label: "Sells", value: loadingTransactionSummary ? "..." : sellCount },
            ].map((stat) => (
              <div key={stat.label} className="text-center pt-4">
                <p className="text-base font-bold text-white">{stat.value}</p>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-4 pt-5 pb-8 space-y-4">

          {loadingUserProfile ? (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size="xl" message="Loading profile..." />
            </div>
          ) : (
            <Fragment>

              {/* Menu list */}
              {activeSection === null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
                  >
                    {menuItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.id}>
                          <button
                            className="w-full flex items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
                            onClick={() => setActiveSection(item.id)}
                          >
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: item.color + "18" }}
                            >
                              <Icon size={18} style={{ color: item.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>{item.label}</p>
                              <p className="text-xs" style={{ color: "#9A9A9A" }}>{item.sub}</p>
                            </div>
                            <ChevronRight size={16} style={{ color: "#9A9A9A" }} />
                          </button>
                          {index < menuItems.length - 1 && (
                            <div style={{ height: "1px", background: "#F4F5F7", marginLeft: "64px" }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Support link */}
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
                  >
                    <a
                      href={ROUTES.CONTACT}
                      className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-gray-50"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(3,120,71,0.1)" }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#037847" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>Support</p>
                        <p className="text-xs" style={{ color: "#9A9A9A" }}>Get help from our team</p>
                      </div>
                      <ChevronRight size={16} style={{ color: "#9A9A9A" }} />
                    </a>
                  </div>

                  {/* Log out */}
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-red-50 active:bg-red-100"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(235,87,87,0.1)" }}
                      >
                        <LogOut size={18} style={{ color: "#EB5757" }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: "#EB5757" }}>Log Out</p>
                        <p className="text-xs" style={{ color: "#9A9A9A" }}>Sign out of account</p>
                      </div>
                      <ChevronRight size={16} style={{ color: "#EB5757" }} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Personal info section ── */}
              {activeSection === "personal" && (
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setActiveSection(null)}
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: "#948EEE" }}
                  >
                    ← Back
                  </button>
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
                  >
                    <ProfilePersonalInfoSection
                      firstName={userProfileData?.profile?.firstName || ""}
                      lastName={userProfileData?.profile?.lastName || ""}
                      email={userProfileData?.email || ""}
                      phoneNumber={userProfileData?.profile?.phoneNumber || ""}
                      dob={userProfileData?.profile?.dateOfBirth}
                      profileImg={userProfileData?.profile?.profileImg}
                      handleFieldChange={handlePersonalInfoProfileFieldUpdate}
                      handleRemoveProfilePicture={handleRemoveProfilePicture}
                    />
                  </div>
                  <div className="flex justify-center">
                    <CustomButton buttonText="Save Changes" onClick={handleSaveChanges} />
                  </div>
                </motion.div>
              )}

              {/* ── Bank details section ── */}
              {activeSection === "bank" && (
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <button
                    onClick={() => setActiveSection(null)}
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: "#948EEE" }}
                  >
                    ← Back
                  </button>

                  {!loadingUserBankAccounts && !userBankAccounts ? (
                    <div
                      className="rounded-2xl p-8 flex flex-col items-center gap-4"
                      style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
                    >
                      <p className="text-sm text-center" style={{ color: "#6B6E6B" }}>
                        No bank accounts saved yet
                      </p>
                      <CustomButton buttonText="Add Bank Account" onClick={toggleShowCreateNewBankAccount} />
                    </div>
                  ) : (
                    <div
                      className="rounded-2xl p-5"
                      style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
                    >
                      <ProfileBankDetailsSection
                        banks={userBankAccounts}
                        createNewBankModal={toggleShowCreateNewBankAccount}
                        makeBankAccountDefault={handleDefaultBankAccount}
                        handleDeleteBank={handleDeleteBankAccount}
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Security section ── */}
              {activeSection === "security" && (
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <button
                    onClick={() => setActiveSection(null)}
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: "#948EEE" }}
                  >
                    ← Back
                  </button>
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
                  >
                    <ProfileSecuritySettingsSection
                      isTwoFactorEnabled={userProfileData?.twoFactorEnabled || false}
                      onEnableTwoFactor={handleEnableTwoFactor}
                      onChangePassword={handleChangePassword}
                    />
                  </div>
                </motion.div>
              )}

            </Fragment>
          )}
        </div>
      </div>

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
        supportedCryptoWallet={
          !loadingSupportedCryptocurrencies && supportedCryptoCurrencies !== undefined
            ? supportedCryptoCurrencies
            : []
        }
        selectedWalletId={selectedWallet}
        onClose={toggleShowCreateNewWallet}
        onSubmit={handleCreateWallet}
        handleChangeField={handleNewWalletField}
      />
    </AuthenticatedLayout>
  );
};

export default ProfilePage;
