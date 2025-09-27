import type { TradeType } from "../../../types/trade.types.ts";
import WalletDetails from "../WalletDetails.tsx";
import CustomButton from "../../../components/global/Button.tsx";
import ChangeBankDetails from "../ChangeBankDetails.tsx";
import ChangeWalletDetails from "../ChangeWalletDetails.tsx";
import type {
  UserBankAccountResponse,
  UserCryptoWalletResponse,
} from "../../../types/response.payload.types.ts";
import {useConfirmBankDetailsModal} from "../../../hooks/components/trade/modal/useConfirmBankDetailsModal.ts";

interface ConfirmBankDetailsModalProps {
  isOpen: boolean;
  tradeType: TradeType;
  cryptoAccounts: UserCryptoWalletResponse[] | undefined;
  bankAccounts: UserBankAccountResponse[] | undefined;
  onProceed: (value: number) => void;
  setShowConfirmBankDetails: (showConfirmBankDetails: boolean) => void;
}

export default function ConfirmBankDetailsModal({ isOpen, tradeType, cryptoAccounts = [], bankAccounts = [], onProceed, setShowConfirmBankDetails }: ConfirmBankDetailsModalProps) {
  const {
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
  } = useConfirmBankDetailsModal(cryptoAccounts, bankAccounts, tradeType, onProceed, setShowConfirmBankDetails);

  /** ---------------- RENDERERS ---------------- */
  const renderBankList = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-4">
        Select Bank Account
      </h3>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {bankAccounts && bankAccounts.length > 0 && bankAccounts.map((bank) => (
          <div
            key={bank.id}
            onClick={() => handleBankSelection(bank.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedBankId === bank.id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Bank Logo */}
              <div className="flex-shrink-0">
                <img
                  src={bank.bankLogo}
                  alt={`${bank.bankName} logo`}
                  className="w-12 h-12 rounded-full object-cover bg-gray-100"
                  onError={(e: any) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling!.style.display = "flex";
                  }}
                />
                <div className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center text-blue-600 font-semibold text-sm hidden">
                  {bank.bankName.substring(0, 2).toUpperCase()}
                </div>
              </div>

              {/* Bank Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {bank.bankName}
                  </h4>
                  {selectedBankId === bank.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{bank.accountName}</p>
                <p className="text-xs text-gray-500 font-mono">
                  {bank.accountNumber}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Bank Button */}
      <button
        onClick={() => setViewState("create-bank")}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Add New Bank Account</span>
      </button>
    </div>
  );

  const renderBankDetails = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-4">Bank Details</h3>
      {selectedBank && (
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={selectedBank.bankLogo}
                alt={`${selectedBank.bankName} logo`}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <h4 className="font-semibold text-gray-900">
                {selectedBank.bankName}
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name:</span>
                <span className="font-medium">
                  {selectedBank.accountName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-mono font-medium">
                  {selectedBank.accountNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderWalletList = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-4">Select Wallet</h3>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {cryptoAccounts && cryptoAccounts.length > 0 && cryptoAccounts.map((wallet) => (
          <div
            key={wallet.id}
            onClick={() => handleWalletSelection(wallet.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedWalletId === wallet.id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {wallet.network}
                </h4>
                <p className="text-xs text-gray-600 font-mono">
                  {wallet.walletAddress}
                </p>
                {wallet.walletLabel && (
                  <p className="text-xs text-gray-500">
                    {wallet.walletLabel}
                  </p>
                )}
              </div>
              {selectedWalletId === wallet.id && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setViewState("create-wallet")}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Add New Wallet</span>
      </button>
    </div>
  );

  const renderWalletDetails = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-4">Wallet Details</h3>
      {selectedWallet && <WalletDetails walletData={selectedWallet} />}
    </div>
  );

  const renderContent = () => {
    if (tradeType === "sell") {
      switch (viewState) {
        case "create-bank":
          return (
            <ChangeBankDetails
              onConfirm={handleSubmitBankDetails}
              onGoBack={() => setViewState("select-bank")}
              canGoBack={bankAccounts && bankAccounts.length > 0}
            />
          );
        case "bank-details":
          return renderBankDetails();
        case "select-bank":
        default:
          return renderBankList();
      }
    }

    if (tradeType === "buy") {
      switch (viewState) {
        case "create-wallet":
          return (
            <ChangeWalletDetails
              onGoBack={() => setViewState("select-wallet")}
              onConfirm={handleSubmitWalletDetails}
              canGoBack={cryptoAccounts && cryptoAccounts.length > 0}
            />
          );
        case "wallet-details":
          return renderWalletDetails();
        case "select-wallet":
        default:
          return renderWalletList();
      }
    }

    return null;
  };

  /** ---------------- ACTIONS ---------------- */
  const showActionButtons = () => {
    if (tradeType === "sell") {
      if (viewState === "select-bank") {
        return selectedBankId && bankAccounts && bankAccounts.length > 0;
      }
      if (viewState === "bank-details") {
        return !!selectedBank;
      }
    }
    if (tradeType === "buy") {
      if (viewState === "select-wallet") {
        return selectedWalletId && cryptoAccounts && cryptoAccounts.length > 0;
      }
      if (viewState === "wallet-details") {
        return !!selectedWallet;
      }
    }
    return false;
  };

  const getActionButtonText = () => {
    if (tradeType === "sell") {
      if (viewState === "select-bank") return "View Details & Proceed";
      return "Proceed with This Bank";
    }
    if (tradeType === "buy") {
      if (viewState === "select-wallet") return "View Details & Proceed";
      return "Proceed with This Wallet";
    }
    return "Proceed";
  };

  const handleMainAction = () => {
    if (tradeType === "sell" && viewState === "select-bank") {
      handleViewSelectedBankDetails();
    } else if (tradeType === "buy" && viewState === "select-wallet") {
      handleViewSelectedWalletDetails();
    } else {
      handleProceed();
    }
  };

  const handleChangeAction = () => {
    if (tradeType === "buy") {
      if (viewState === "wallet-details") {
        setViewState("select-wallet");
      } else {
        setViewState("create-wallet");
      }
    } else if (tradeType === "sell") {
      if (viewState === "bank-details") {
        setViewState("select-bank");
      } else {
        setViewState("create-bank");
      }
    }
  };

  const getChangeButtonText = () => {
    if (tradeType === "buy") {
      if (viewState === "wallet-details") return "Change Wallet";
      return "Add Wallet";
    }
    if (tradeType === "sell") {
      if (viewState === "bank-details")
        return bankAccounts && bankAccounts.length > 1 ? "Change Bank" : "Back to Selection";
      return "Add Bank Account";
    }
    return "Change";
  };

  const showChangeButton = () => {
    if (tradeType === "buy") {
      if (viewState === "wallet-details" || viewState === "select-wallet") {
        return true;
      }
    }
    if (tradeType === "sell") {
      if (viewState === "select-bank") {
        return true;
      }
      if (viewState === "bank-details") {
        return bankAccounts && bankAccounts.length > 0;
      }
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 h-full bg-black/20 bg-opacity-50 flex items-center justify-center z-50 px-2 md:px-0">
      <div className="bg-white rounded-lg md:px-8 px-3 pt-6 pb-5 w-full md:max-w-lg max-h-[90vh] overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => setShowConfirmBankDetails(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {renderContent()}
        </div>

        {/* Action Buttons */}
        {showActionButtons() && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex gap-3">
              {showChangeButton() && (
                <button
                  type="button"
                  onClick={handleChangeAction}
                  className="flex-1 h-12 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  {getChangeButtonText()}
                </button>
              )}

              <CustomButton
                className={`${
                  showChangeButton() ? "flex-1" : "w-full"
                } h-12`}
                buttonText={getActionButtonText()}
                type="button"
                onClick={handleMainAction}
              />
            </div>

            {/* Selected Summary */}
            {tradeType === "sell" &&
              selectedBank &&
              viewState === "select-bank" && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedBank.bankLogo}
                      alt={`${selectedBank.bankName} logo`}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-900">
                        Selected: {selectedBank.bankName}
                      </p>
                      <p className="text-xs text-blue-700 truncate">
                        {selectedBank.accountName} -{" "}
                        {selectedBank.accountNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {tradeType === "buy" &&
              selectedWallet &&
              viewState === "select-wallet" && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-900">
                        Selected: {selectedWallet.network}
                      </p>
                      <p className="text-xs text-blue-700 truncate font-mono">
                        {selectedWallet.walletAddress}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}