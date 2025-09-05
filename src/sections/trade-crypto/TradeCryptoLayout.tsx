import TradeSteps from "./TradeSteps.tsx";
import TradeStepDisplay from "./TradeStepDisplay.tsx";
import type {TradeType, BankDetailsData, WalletDetailsData} from "../../types/trade.types.ts";
import {useState} from "react";
import {PaymentConfirmationModal} from "./modals/PaymentConfirmationModal.tsx";
import ConfirmBankDetailsModal from "./modals/ConfirmBankDetailsModal.tsx";
import TradeSuccess from "./TradeSuccess.tsx";

interface TradeCryptoLayoutProps {
    option: TradeType;
    currency: string;
    token: string;
}

export default function TradeCryptoLayout({ currency, token, option }: TradeCryptoLayoutProps) {
    const [step, setStep] = useState<number>(1)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showConfirmBankDetails, setShowConfirmBankDetails] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<TradeType>(option);
    const BankDetails: BankDetailsData = {
        bankName: "Providus Bank",
        accountName: "JCole Adeniyi",
        accountNumber: "2411793421"
    }

    const WalletDetails: WalletDetailsData = {
        coinType: "USDT",
        walletAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        networkType: "BEP20"
    }


    return (
        <>
            <div className="max-w-6xl mx-auto md:px-6 flex flex-col md:flex-row gap-7 items-start">
                {step === 4 ?
                    <TradeSuccess
                        type={activeTab}
                        amount={250}
                        status={'Completed'}
                        dateTime={`16 Aug 2025, 10:42 AM`}
                        token={'USDT'}
                        orderId={'7a2e2225-1a4b-4557'}
                    />
                    :
                    <>
                        <div className={`md:basis-1/4 w-full`}>
                            <TradeSteps step={step} />
                        </div>

                        <div className={`md:basis-3/4 w-full`}>
                            <TradeStepDisplay
                                step={step}
                                tradeType={option}
                                currency={currency}
                                token={token}
                                setStep={setStep}
                                setShowModal={setShowModal}
                                setShowBankDetailsModal={setShowConfirmBankDetails}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </div>
                    </>
                }

            </div>

            <PaymentConfirmationModal isOpen={showModal} />
            <ConfirmBankDetailsModal
                isOpen={showConfirmBankDetails}
                tradeType={activeTab}
                bankData={BankDetails}
                walletData={WalletDetails}
                onProceed={setStep}
                setShowConfirmBankDetails={setShowConfirmBankDetails}
            />
        </>
    )
}