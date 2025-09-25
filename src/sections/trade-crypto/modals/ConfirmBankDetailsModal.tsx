import type {TradeType, WalletDetailsData} from "../../../types/trade.types.ts";
import WalletDetails from "../WalletDetails.tsx";
import CustomButton from "../../../components/global/Button.tsx";
import {useState, useEffect} from "react";
import ChangeBankDetails from "../ChangeBankDetails.tsx";
import ChangeWalletDetails from "../ChangeWalletDetails.tsx";
import {useBankQuery} from "../../../queries/bank.query.ts";
import type {UserBankAccountResponse} from "../../../types/response.payload.types.ts";

interface ConfirmBankDetailsModalProps {
  isOpen: boolean;
  tradeType: TradeType;
  walletData?: WalletDetailsData;
  bankAccounts: UserBankAccountResponse[];
  onProceed: (value: number) => void
  setShowConfirmBankDetails: (showConfirmBankDetails: boolean) => void
}

type ViewState = 'select-bank' | 'create-bank' | 'bank-details' | 'wallet-details' | 'create-wallet';

export default function ConfirmBankDetailsModal({ isOpen, tradeType, walletData, bankAccounts, onProceed, setShowConfirmBankDetails }: ConfirmBankDetailsModalProps) {
  const { createUserBankAccountMutation } = useBankQuery();

  // Local state to track current data and view
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [currentWalletData, setCurrentWalletData] = useState<WalletDetailsData | undefined>(walletData);
  const [viewState, setViewState] = useState<ViewState>('select-bank');

  // Update local state when props change
  useEffect(() => {
    setCurrentWalletData(walletData);
  }, [walletData]);

  // Determine initial view state based on trade type and data availability
  useEffect(() => {
    if (tradeType === "sell") {
      if (bankAccounts.length === 0) {
        setViewState('create-bank');
      } else {
        setViewState('select-bank');
      }
    } else if (tradeType === "buy") {
      if (!currentWalletData) {
        setViewState('create-wallet');
      } else {
        setViewState('wallet-details');
      }
    }
  }, [tradeType, currentWalletData, bankAccounts]);

  // Set default selected bank to first item in bankAccounts
  useEffect(() => {
    if (bankAccounts.length > 0) {
      setSelectedBankId(bankAccounts[0].id);
    }
  }, [bankAccounts]);

  const handleBankSelection = (bankId: string) => {
    setSelectedBankId(bankId);
  };

  const handleAddNewBank = () => {
    setViewState('create-bank');
  };

  const handleSubmitBankDetails = () => {
    createUserBankAccountMutation.mutate();
    // After creating bank, go to selection if there are existing banks
    if (bankAccounts.length > 0) {
      setViewState('select-bank');
    }
  };

  const handleGoBackToBankList = () => {
    setViewState('select-bank');
  };

  const handleViewSelectedBankDetails = () => {
    if (selectedBankId) {
      setViewState('bank-details');
    }
  };

  const handleGoBackToBankSelection = () => {
    setViewState('select-bank');
  };

  const handleSubmitWalletDetails = (data: WalletDetailsData) => {
    console.log(data);
    setCurrentWalletData(data);
    setViewState('wallet-details');
  };

  const handleGoBackToWallet = () => {
    if (currentWalletData) {
      setViewState('wallet-details');
    }
  };

  const handleChangeWallet = () => {
    setViewState('create-wallet');
  };

  const handleProceed = () => {
    onProceed(3);
    setShowConfirmBankDetails(false);
  };

  if (!isOpen) return null;

  const selectedBank = bankAccounts.find(bank => bank.id === selectedBankId);

  const renderBankList = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-4">Select Bank Account</h3>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {bankAccounts.map((bank) => (
          <div
            key={bank.id}
            onClick={() => handleBankSelection(bank.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedBankId === bank.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
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
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'flex';
                  }}
                />
                <div
                  className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center text-blue-600 font-semibold text-sm hidden"
                >
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
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
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
        onClick={handleAddNewBank}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
        </svg>
        <span>Add New Bank Account</span>
      </button>
    </div>
  );

  const renderCreateBank = () => (
    <div className="space-y-4">
      <ChangeBankDetails
        onConfirm={handleSubmitBankDetails}
        onGoBack={handleGoBackToBankList}
        canGoBack={bankAccounts.length > 0}
      />
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
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h4 className="font-semibold text-gray-900">{selectedBank.bankName}</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name:</span>
                <span className="font-medium">{selectedBank.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-mono font-medium">{selectedBank.accountNumber}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderWalletDetails = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-4">Wallet Details</h3>
      {currentWalletData && <WalletDetails walletData={currentWalletData} />}
    </div>
  );

  const renderCreateWallet = () => (
    <div className="space-y-4">
      <ChangeWalletDetails
        onGoBack={handleGoBackToWallet}
        onConfirm={handleSubmitWalletDetails}
        canGoBack={!!currentWalletData}
      />
    </div>
  );

  const renderContent = () => {
    if (tradeType === "sell") {
      switch (viewState) {
        case 'create-bank':
          return renderCreateBank();
        case 'bank-details':
          return renderBankDetails();
        case 'select-bank':
        default:
          return renderBankList();
      }
    }

    if (tradeType === "buy") {
      switch (viewState) {
        case 'create-wallet':
          return renderCreateWallet();
        case 'wallet-details':
        default:
          return renderWalletDetails();
      }
    }

    return null;
  };

  const showActionButtons = () => {
    if (tradeType === "sell") {
      if (viewState === 'select-bank') {
        return selectedBankId && bankAccounts.length > 0;
      }
      if (viewState === 'bank-details') {
        return !!selectedBank;
      }
    }
    if (tradeType === "buy" && viewState === 'wallet-details') {
      return !!currentWalletData;
    }
    return false;
  };

  const getActionButtonText = () => {
    if (tradeType === "sell") {
      if (viewState === 'select-bank') {
        return "View Details & Proceed";
      }
      return "Proceed with This Bank";
    }
    return "Proceed";
  };

  const handleMainAction = () => {
    if (tradeType === "sell" && viewState === 'select-bank') {
      handleViewSelectedBankDetails();
    } else {
      handleProceed();
    }
  };

  const handleChangeAction = () => {
    if (tradeType === "buy") {
      handleChangeWallet();
    } else if (tradeType === "sell") {
      if (viewState === 'bank-details') {
        handleGoBackToBankSelection();
      } else {
        handleAddNewBank();
      }
    }
  };

  const getChangeButtonText = () => {
    if (tradeType === "buy") {
      return "Change Wallet";
    }
    if (tradeType === "sell") {
      if (viewState === 'bank-details') {
        return bankAccounts.length > 1 ? "Change Bank" : "Back to Selection";
      }
      return "Add Bank Account";
    }
    return "Change";
  };

  const showChangeButton = () => {
    if (tradeType === "buy" && viewState === 'wallet-details') {
      return true;
    }
    if (tradeType === "sell") {
      if (viewState === 'select-bank') {
        return true;
      }
      if (viewState === 'bank-details') {
        return bankAccounts.length > 0;
      }
    }
    return false;
  };

  return (
    <div className="fixed inset-0 h-full bg-black/20 bg-opacity-50 flex items-center justify-center z-50 px-2 md:px-0">
      <div className="bg-white rounded-lg md:px-8 px-3 pt-6 pb-5 w-full md:max-w-lg max-h-[90vh] overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => setShowConfirmBankDetails(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
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
                className={`${showChangeButton() ? "flex-1" : "w-full"} h-12`}
                buttonText={getActionButtonText()}
                type="button"
                onClick={handleMainAction}
              />
            </div>

            {/* Selected Bank Summary for Sell Orders */}
            {tradeType === "sell" && selectedBank && viewState === 'select-bank' && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedBank.bankLogo}
                    alt={`${selectedBank.bankName} logo`}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900">
                      Selected: {selectedBank.bankName}
                    </p>
                    <p className="text-xs text-blue-700 truncate">
                      {selectedBank.accountName} - {selectedBank.accountNumber}
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