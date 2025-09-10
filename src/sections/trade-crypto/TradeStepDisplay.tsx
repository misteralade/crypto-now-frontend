import {useEffect, useState} from "react";
import type {TradeType, TradeAdditionalInfoInterface} from "../../types/trade.types.ts";
import TradeStepDisplayHeading from "./TradeStepDisplayHeading.tsx";
import TradeStep1 from "./trade-steps/TradeStep1.tsx";
import TradeStep2 from "./trade-steps/TradeStep2.tsx";
import {availableCurrency, availableTokens, type TradeParamDisplay} from "../../types/global.type.tsx";
import CopyAccountDetails from "./CopyAccountDetails.tsx";

interface TradeCryptoPageProps {
    tradeType: TradeType;
    step: number;
    currency: string;
    token: string;
    setStep: (value: number) => void
    setShowModal: (value: boolean) => void
    setShowBankDetailsModal: (value: boolean) => void;
    activeTab: TradeType;
    setActiveTab: (value: TradeType) => void;
}

export default function TradeStepDisplay({activeTab, setActiveTab, tradeType, step, currency, token, setStep, setShowModal, setShowBankDetailsModal }: TradeCryptoPageProps) {
    const [selectedToken, setSelectedToken] = useState<TradeParamDisplay>(
        availableTokens.find((item) => item.name === token) || availableTokens[0]
    );
    const [selectedCurrency, setSelectedCurrency] = useState<TradeParamDisplay>(
        availableCurrency.find((item) => item.name === currency) || availableCurrency[0]
    );
    const [numberOfToken, setNumberOfToken] = useState<string | number>("");
    const [amountToBuy, setAmountToBuy] = useState<string | number>("");


    const rates = [
        {
            currency: "USD",
            token: "USDT",
            rate: 1,
        },
        {
            currency: "NGN",
            token: "USDT",
            rate: 1528,
        },
        {
            currency: "NGN",
            token: "BTC",
            rate: 170251147.66,
        },
        {
            currency: "USD",
            token: "BTC",
            rate: 111464.60,
        },
    ];

    const [rate, setRate] = useState<number>(0)

    useEffect(() => {
        if (selectedCurrency && selectedToken) {
            const foundRateObject = rates.find(
                (item) => item.currency.toLowerCase() === selectedCurrency.name.toLowerCase() && item.token.toLowerCase() === selectedToken.name.toLowerCase()
            );

            if (foundRateObject) {
                setRate(foundRateObject.rate);
            } else {
                setRate(0);
            }
        }
    }, [selectedCurrency, selectedToken]);

    const fee: number = 0.1
    const amountToReceive: number = tradeType === "sell" ? Number(numberOfToken) * rate: Number(amountToBuy) / rate;

    useEffect(() => {
        if (activeTab === "sell" && numberOfToken !== "" && rate !== 0) {
            setAmountToBuy((Number(numberOfToken) * rate).toFixed(5));
        }

        if(activeTab === "buy" && amountToBuy !== "" && rate !== 0) {
            setNumberOfToken((Number(amountToBuy) / rate).toFixed(5));
        }
    }, [numberOfToken, amountToBuy, tradeType, rate]);

    const AdditionalInfo: TradeAdditionalInfoInterface[] = [
        {
            title: "Rate",
            value: `1 ${selectedToken.name} = ${rate} ${selectedCurrency.name}`,
        },
        {
            title: "Estimated fee",
            value: `${fee} ${tradeType === "sell"? `${selectedToken.name}`: `${selectedCurrency.name}`}`,
        },
        {
            title: "You will receive",
            value: `${amountToReceive} ${tradeType === "sell"? `${selectedCurrency.name}`: `${selectedToken.name}`}`,
        }
    ]
    const buyAccountDetails: TradeAdditionalInfoInterface[] = [
        {
            title: "Address",
            value: <CopyAccountDetails accountNumber={`0xdAC17F958D2ee523a2206206994597C13D831ec7`} /> ,
        },
        {
            title: "Coin type",
            value: `${selectedToken.name}`,
        },
        {
            title: "Network type",
            value: "BEP20"
        },
        {
            title: "Amount",
            value: `${numberOfToken} ${selectedToken.name}`
        }
    ]

    const sellAccountDetails: TradeAdditionalInfoInterface[] = [
        {
            title: "Account number",
            value:  <CopyAccountDetails accountNumber={`0003450953`} />
        },
        {
            title: "Account name",
            value: "CrytoNow Limited"
        },
        {
            title: "Bank name",
            value: "Sterling Bank"
        },
        {
            title: "Amount",
            value: `${amountToBuy} ${selectedCurrency.name}`
        }
    ]
    const AccountDetails: TradeAdditionalInfoInterface[] = tradeType === "sell" ? buyAccountDetails : sellAccountDetails;

    return (
        <div className={`bg-greyBg rounded-2xl p-5 space-y-5`}>
            {/*heading*/}
            <TradeStepDisplayHeading step={step} activeTab={activeTab} setActiveTab={setActiveTab} />

           {/* Content*/}
            {step === 1 &&
                <TradeStep1
                    token={token}
                    currency={currency}
                    tradeType={activeTab}
                    setStep={setStep}
                    orderDetails={AdditionalInfo}
                    rate={rate}
                    fee={fee}
                    numberOfToken={numberOfToken}
                    amountToBuy={amountToBuy}
                    setAmountToBuy={setAmountToBuy}
                    setNumberOfToken={setNumberOfToken}
                    setSelectedCurrency={setSelectedCurrency}
                    setSelectedToken={setSelectedToken}
                    selectedCurrency={selectedCurrency}
                    selectedToken={selectedToken}
                    amountToReceive={amountToReceive}
                />
            }
            {step === 2 &&
                <TradeStep2
                    additionalInfo={AdditionalInfo}
                    accountDetails={AccountDetails}
                    setShowModal={setShowModal}
                    setShowBankDetailsModal={setShowBankDetailsModal}
                    useStep3={false}
                />
            }
            {step === 3 &&
                <TradeStep2
                    additionalInfo={AdditionalInfo}
                    accountDetails={AccountDetails}
                    setShowModal={setShowModal}
                    setShowBankDetailsModal={setShowBankDetailsModal}
                    useStep3={true}
                    setStep={setStep}
                />
            }
        </div>
    )
}