import type {TradeType, WalletDetailsData, BankDetailsData} from "../../../types/trade.types.ts";
import BankDetails from "../BankDetails.tsx";
import WalletDetails from "../WalletDetails.tsx";
import CustomButton from "../../../components/global/Button.tsx";
import {useState, useEffect} from "react";
import ChangeBankDetails from "../ChangeBankDetails.tsx";
import ChangeWalletDetails from "../ChangeWalletDetails.tsx";

interface ConfirmBankDetailsModalProps {
    isOpen: boolean;
    tradeType: TradeType;
    bankData?: BankDetailsData;
    walletData?: WalletDetailsData;
    onProceed: (value: number) => void
    setShowConfirmBankDetails: (showConfirmBankDetails: boolean) => void
}

type ViewState = 'details' | 'change';

export default function ConfirmBankDetailsModal({
                                                    isOpen,
                                                    tradeType,
                                                    bankData,
                                                    walletData,
                                                    onProceed,
                                                    setShowConfirmBankDetails
                                                }: ConfirmBankDetailsModalProps) {

    // Local state to track current data and view
    const [currentBankData, setCurrentBankData] = useState<BankDetailsData | undefined>(bankData);
    const [currentWalletData, setCurrentWalletData] = useState<WalletDetailsData | undefined>(walletData);
    const [viewState, setViewState] = useState<ViewState>('details');

    // Update local state when props change
    useEffect(() => {
        setCurrentBankData(bankData);
        setCurrentWalletData(walletData);
    }, [bankData, walletData]);

    // Determine initial view state based on data availability
    useEffect(() => {
        if (tradeType === "sell" && !currentBankData) {
            setViewState('change');
        } else if (tradeType === "buy" && !currentWalletData) {
            setViewState('change');
        } else {
            setViewState('details');
        }
    }, [tradeType, currentBankData, currentWalletData]);

    const handleSubmitBankDetails = (data: BankDetailsData) => {
        console.log(data);
        setCurrentBankData(data);
        setViewState('details');
    }

    const handleSubmitWalletDetails = (data: WalletDetailsData) => {
        console.log(data);
        setCurrentWalletData(data);
        setViewState('details');
    }

    const handleGoBack = () => {
        // Only allow going back if data exists (not in initial setup mode)
        if (tradeType === "sell" && currentBankData) {
            setViewState('details');
        } else if (tradeType === "buy" && currentWalletData) {
            setViewState('details');
        }
        // If no data exists, user can't go back (they must fill the form first)
    }

    const handleChangeAccount = () => {
        setViewState('change');
    }

    const handleProceed = () => {
        onProceed(3);
        setShowConfirmBankDetails(false);
    }

    if (!isOpen) return null;

    const renderContent = () => {
        // Handle sell trade type
        if (tradeType === "sell") {
            if (viewState === 'change') {
                return (
                    <ChangeBankDetails
                        onConfirm={handleSubmitBankDetails}
                        onGoBack={handleGoBack}
                        canGoBack={!!currentBankData} // Only allow going back if data exists
                    />
                );
            } else if (currentBankData) {
                return <BankDetails bankData={currentBankData} />;
            }
        }

        // Handle buy trade type
        if (tradeType === "buy") {
            if (viewState === 'change') {
                return (
                    <ChangeWalletDetails
                        onGoBack={handleGoBack}
                        onConfirm={handleSubmitWalletDetails}
                        canGoBack={!!currentWalletData} // Only allow going back if data exists
                    />
                );
            } else if (currentWalletData) {
                return <WalletDetails walletData={currentWalletData} />;
            }
        }

        return null;
    }

    const showActionButtons = () => {
        // Show action buttons only when viewing details (not when changing)
        if (viewState === 'details') {
            if (tradeType === "sell" && currentBankData) return true;
            if (tradeType === "buy" && currentWalletData) return true;
        }
        return false;
    }

    return (
        <div className="fixed inset-0 h-full bg-black/20 bg-opacity-50 flex items-center justify-center z-50 px-2 md:px-0">
            <div className="bg-white rounded-lg md:px-8 px-3 pt-14 pb-5 w-full md:min-w-md relative space-y-10">
                {renderContent()}

                {/* Action Buttons - only show when viewing details */}
                {showActionButtons() && (
                    <div className="flex gap-4 w-full md:w-4/5 mx-auto">
                        <button
                            type="button"
                            onClick={handleChangeAccount}
                            className="flex-1 h-12 rounded-full text-primary cursor-pointer"
                        >
                            Change Account
                        </button>

                        <CustomButton
                            className="basis-1/2 py-2 px-4"
                            buttonText="Proceed"
                            type="button"
                            onClick={handleProceed}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}