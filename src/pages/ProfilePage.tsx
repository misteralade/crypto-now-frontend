import { Fragment, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowLeft, CheckCircle } from "lucide-react";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout.tsx";
import { useProfilePage } from "../hooks/pages/useProfilePage.ts";
import ProfilePersonalInfoSection from "../components/pages/profile/ProfilePersonalInfoSection.tsx";
import ProfileBankDetailsSection from "../components/pages/profile/ProfileBankDetailsSection.tsx";
import ProfileSecuritySettingsSection from "../components/pages/profile/ProfileSecuritySection.tsx";
import ProfileAddressDetailsSection from "../components/pages/profile/ProfileAddressDetailsSection.tsx";
import CustomButton from "../components/global/Button.tsx";
import { LoadingSpinner } from "../components/global/LoadingSpinner.tsx";
import NewBankAccountModal from "../components/pages/profile/modals/NewBankAccountModal.tsx";
import NewCryptoWalletModal from "../components/pages/profile/modals/NewCryptoWalletModal.tsx";
import { LOCAL_STORAGE_KEYS, ROUTES } from "../util/constants.util.ts";
import { useNavigate } from "@tanstack/react-router";
import { useTransactionQuery } from "../queries/transaction.query.ts";
import { convertToMillify, formatCurrency } from "../util/index.util.ts";

type Section = "personal" | "bank" | "wallets" | "security" | null;

const getInitials = (first?: string, last?: string) =>
  ((first?.[0] ?? "") + (last?.[0] ?? "")).toUpperCase() || "U";

/* ─── 2×2 stat card ─── */
function StatCard({ label, value, sub, loading }: { label: string; value: string; sub?: string; loading: boolean }) {
  return (
    <div className="rounded-3xl p-4" style={{ background: "#FAFAFA", border: "1px solid #F0F0F0" }}>
      <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#BDBDBD" }}>{label}</p>
      {loading ? (
        <div className="mt-1.5 h-5 w-24 rounded-lg animate-pulse" style={{ background: "#EEEEEE" }} />
      ) : (
        <p className="text-xl font-extrabold mt-0.5" style={{ color: "#037847", fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
          {value}
        </p>
      )}
      {sub && <p className="text-[10px] mt-0.5" style={{ color: "#9A9A9A" }}>{sub}</p>}
    </div>
  );
}

/* ─── menu row ─── */
function MenuRow({
  icon, label, sub, color = "#948EEE", onClick, danger = false,
}: {
  icon: React.ReactNode; label: string; sub: string;
  color?: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
    >
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: color + "18" }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: danger ? "#EB5757" : "#0E0F0C" }}>{label}</p>
        <p className="text-[11px] mt-0.5" style={{ color: "#9A9A9A" }}>{sub}</p>
      </div>
      <ChevronRight size={16} style={{ color: danger ? "#EB5757" : "#BDBDBD" }} />
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   PROFILE PAGE
══════════════════════════════════════════════════════════ */
const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>(null);

  const {
    userProfileData, loadingUserProfile,
    allBanks, loadingAllBanks,
    userBankAccounts, loadingUserBankAccounts,
    selectedBank, showCreateNewBankAccount,
    supportedCryptoCurrencies, loadingSupportedCryptocurrencies,
    allUserCryptoWallets, loadingAllUserCryptoWallets,
    showCreateWallet, selectedWallet,
    handleChangePassword, handlePersonalInfoProfileFieldUpdate,
    handleSaveChanges, handleEnableTwoFactor,
    handleNewBankAccountField, handleCreateBankAccount,
    toggleShowCreateNewBankAccount, handleDefaultBankAccount,
    handleDeleteBankAccount, toggleShowCreateNewWallet,
    handleCreateWallet, handleNewWalletField,
    handleMakeWalletDefault, handleDeleteWallet,
    handleRemoveProfilePicture,
  } = useProfilePage();

  const { transactionSummary, loadingTransactionSummary } = useTransactionQuery();

  useEffect(() => {
    if (!loadingUserProfile) {
      handlePersonalInfoProfileFieldUpdate("firstName", userProfileData?.profile?.firstName || "");
      handlePersonalInfoProfileFieldUpdate("lastName",  userProfileData?.profile?.lastName  || "");
      handlePersonalInfoProfileFieldUpdate("phoneNumber", userProfileData?.profile?.phoneNumber || "");
    }
  }, [loadingUserProfile]);

  const initials  = getInitials(userProfileData?.profile?.firstName, userProfileData?.profile?.lastName);
  const fullName  = userProfileData?.profile?.firstName
    ? `${userProfileData.profile.firstName} ${userProfileData.profile.lastName ?? ""}`.trim()
    : "";

  const totalFiat    = transactionSummary?.total?.[0] ? Number(transactionSummary.total[0].totalFiatAmount)    : 0;
  const thisMonthFiat= transactionSummary?.total?.[0] ? Number(transactionSummary.total[0].totalFiatAmount)    : 0;
  const totalOrders  = transactionSummary?.total?.[0] ? transactionSummary.total[0].transactionCount           : "0";
  const buyCount     = transactionSummary?.total?.[0] ? transactionSummary.total[0].buyCount                   : "0";
  const sellCount    = transactionSummary?.total?.[0] ? transactionSummary.total[0].sellCount                  : "0";
  const successRate  = transactionSummary?.total?.[0]
    ? Math.round((Number(transactionSummary.total[0].buyCount) + Number(transactionSummary.total[0].sellCount)) /
        Math.max(Number(transactionSummary.total[0].transactionCount), 1) * 100)
    : 0;

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    navigate({ to: ROUTES.HOMEPAGE });
  };

  const loading = loadingTransactionSummary;

  return (
    <AuthenticatedLayout>
      <div style={{ background: "#FFFFFF", minHeight: "100dvh" }}>

        <AnimatePresence mode="wait">

          {/* ════════ MENU HOME ════════ */}
          {activeSection === null && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── Avatar + name + badges ── */}
              <div className="flex flex-col items-center pt-10 pb-6 px-5">
                {loadingUserProfile ? (
                  <div className="w-20 h-20 rounded-full animate-pulse" style={{ background: "#EEEEEE" }} />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white"
                    style={{
                      background: "linear-gradient(135deg, #6DD5FA 0%, #2980B9 40%, #948EEE 75%, #575AE5 100%)",
                      boxShadow: "0 8px 24px rgba(87,90,229,0.28)",
                    }}
                  >
                    {initials}
                  </div>
                )}

                <h2 className="text-xl font-extrabold mt-3" style={{ color: "#0E0F0C", fontFamily: "'DM Sans',sans-serif" }}>
                  {loadingUserProfile
                    ? <span className="block h-5 w-36 rounded animate-pulse" style={{ background: "#EEEEEE" }} />
                    : fullName || "Account"
                  }
                </h2>
                <p className="text-sm mt-0.5" style={{ color: "#9A9A9A" }}>{userProfileData?.email ?? ""}</p>

                {/* Badges */}
                <div className="flex items-center gap-2 mt-3">
                  {/* TODO: connect to real KYC status */}
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "#E8F8F0", color: "#037847" }}>
                    <CheckCircle size={11} /> KYC Verified
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: "#FFFBF0", color: "#A07000" }}>
                    🤝 Non-Custodial
                  </span>
                </div>
              </div>

              {/* ── 2×2 Stats grid ── */}
              <div className="px-5 mb-5">
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="Total Traded"
                    value={`₦${convertToMillify(totalFiat, 0)}`}
                    sub="Lifetime volume"
                    loading={loading}
                  />
                  <StatCard
                    label="Total Orders"
                    value={totalOrders}
                    sub={`${buyCount} buy · ${sellCount} sell`}
                    loading={loading}
                  />
                  <StatCard
                    label="This Month"
                    value={`₦${convertToMillify(thisMonthFiat, 0)}`}
                    sub={new Date().toLocaleString("default", { month: "long", year: "numeric" })}
                    loading={loading}
                  />
                  <StatCard
                    label="Success Rate"
                    value={`${successRate}%`}
                    sub={`${buyCount} of ${totalOrders} done`}
                    loading={loading}
                  />
                </div>
              </div>

              {/* ── Menu list ── */}
              <div className="px-5 space-y-3 pb-8">
                {/* Profile & bank */}
                <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
                  <MenuRow
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#948EEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                    label="Edit Profile"
                    sub="Name, email, bank details"
                    color="#948EEE"
                    onClick={() => setActiveSection("personal")}
                  />
                  <div style={{ height: "1px", background: "#F7F7F9", margin: "0 16px" }} />
                  <MenuRow
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7A600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
                    label="Bank Details"
                    sub={`${userBankAccounts?.length ?? 0} account(s) saved`}
                    color="#F7A600"
                    onClick={() => setActiveSection("bank")}
                  />
                  <div style={{ height: "1px", background: "#F7F7F9", margin: "0 16px" }} />
                  <MenuRow
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9945FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>}
                    label="External Wallets"
                    sub={`${allUserCryptoWallets?.length ?? 0} wallet(s) saved`}
                    color="#9945FF"
                    onClick={() => setActiveSection("wallets")}
                  />
                </div>

                {/* Security */}
                <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
                  {/* TODO: Connect KYC verification to real API */}
                  <MenuRow
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#575AE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                    label="KYC Verification"
                    sub="Identity fully verified"
                    color="#575AE5"
                    onClick={() => {}}
                  />
                  <div style={{ height: "1px", background: "#F7F7F9", margin: "0 16px" }} />
                  <MenuRow
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#037847" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>}
                    label="Security"
                    sub="2FA & password settings"
                    color="#037847"
                    onClick={() => setActiveSection("security")}
                  />
                </div>

                {/* Support */}
                <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid #F0F0F0" }}>
                  <MenuRow
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
                    label="Support"
                    sub="Get help from our team"
                    color="#0EA5E9"
                    onClick={() => navigate({ to: ROUTES.CONTACT })}
                  />
                </div>

                {/* Log out */}
                <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid #FEE2E2" }}>
                  <MenuRow
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EB5757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}
                    label="Log Out"
                    sub="Sign out of account"
                    color="#EB5757"
                    onClick={handleLogout}
                    danger
                  />
                </div>
              </div>

              {/* KYC pill floating above bottom nav (mobile only) */}
              {/* TODO: hide when KYC is not verified */}
              <div className="lg:hidden flex justify-center pb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
                  style={{ background: "#03034D", color: "#FFFFFF" }}>
                  <CheckCircle size={12} />
                  KYC is fully verified ✓
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════ SECTION VIEWS ════════ */}
          {activeSection !== null && (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.22 }}
              className="px-5 pb-10"
            >
              {/* Back header */}
              <div className="flex items-center gap-3 pt-6 pb-5">
                <button
                  onClick={() => setActiveSection(null)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
                  style={{ border: "1px solid #F0F0F0" }}
                >
                  <ArrowLeft size={16} style={{ color: "#0E0F0C" }} />
                </button>
                <h2 className="text-lg font-bold" style={{ color: "#0E0F0C" }}>
                  {activeSection === "personal" ? "Edit Profile"
                   : activeSection === "bank"     ? "Bank Details"
                   : activeSection === "wallets"  ? "External Wallets"
                   :                                "Security"}
                </h2>
              </div>

              {loadingUserProfile ? (
                <div className="flex items-center justify-center py-16">
                  <LoadingSpinner size="xl" message="Loading..." />
                </div>
              ) : (
                <Fragment>
                  {activeSection === "personal" && (
                    <div className="space-y-5">
                      <div className="rounded-3xl p-5" style={{ border: "1px solid #F0F0F0" }}>
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
                    </div>
                  )}

                  {activeSection === "bank" && (
                    <div className="space-y-4">
                      {!loadingUserBankAccounts && !userBankAccounts ? (
                        <div className="rounded-3xl p-10 flex flex-col items-center gap-4"
                          style={{ border: "1px solid #F0F0F0" }}>
                          <p className="text-sm" style={{ color: "#9A9A9A" }}>No bank accounts saved yet</p>
                          <CustomButton buttonText="Add Bank Account" onClick={toggleShowCreateNewBankAccount} />
                        </div>
                      ) : (
                        <div className="rounded-3xl p-5" style={{ border: "1px solid #F0F0F0" }}>
                          <ProfileBankDetailsSection
                            banks={userBankAccounts}
                            createNewBankModal={toggleShowCreateNewBankAccount}
                            makeBankAccountDefault={handleDefaultBankAccount}
                            handleDeleteBank={handleDeleteBankAccount}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {activeSection === "wallets" && (
                    <div className="space-y-4">
                      {loadingAllUserCryptoWallets ? (
                        <div className="flex items-center justify-center py-16">
                          <LoadingSpinner size="xl" message="Loading wallets..." />
                        </div>
                      ) : !allUserCryptoWallets || allUserCryptoWallets.length === 0 ? (
                        <div className="rounded-3xl p-10 flex flex-col items-center gap-4"
                          style={{ border: "1px solid #F0F0F0" }}>
                          <p className="text-sm" style={{ color: "#9A9A9A" }}>No external wallets saved yet</p>
                          <CustomButton buttonText="Add Wallet" onClick={toggleShowCreateNewWallet} />
                        </div>
                      ) : (
                        <div className="rounded-3xl p-5" style={{ border: "1px solid #F0F0F0" }}>
                          <ProfileAddressDetailsSection
                            wallets={allUserCryptoWallets}
                            createNewWalletModal={toggleShowCreateNewWallet}
                            makePrimaryWallet={handleMakeWalletDefault}
                            deleteWallet={handleDeleteWallet}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {activeSection === "security" && (
                    <div className="rounded-3xl p-5" style={{ border: "1px solid #F0F0F0" }}>
                      <ProfileSecuritySettingsSection
                        isTwoFactorEnabled={userProfileData?.twoFactorEnabled ?? false}
                        onEnableTwoFactor={handleEnableTwoFactor}
                        onChangePassword={handleChangePassword}
                      />
                    </div>
                  )}
                </Fragment>
              )}
            </motion.div>
          )}

        </AnimatePresence>
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
        supportedCryptoWallet={!loadingSupportedCryptocurrencies && supportedCryptoCurrencies ? supportedCryptoCurrencies : []}
        selectedWalletId={selectedWallet}
        onClose={toggleShowCreateNewWallet}
        onSubmit={handleCreateWallet}
        handleChangeField={handleNewWalletField}
      />
    </AuthenticatedLayout>
  );
};

export default ProfilePage;
