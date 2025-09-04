import TradeFormInput from './TradeFormInput'
import CustomButton from "../../components/global/Button.tsx";
import type {AdditionalInfo} from "../../types/trade.types.ts";
import type {TradeType} from "../../types/trade.types.ts";
import SwapIcon from "../../assets/icons/fluent_arrow-swap-20-regular.png"
import {useState, useEffect, type FormEvent} from "react";
import {availableCurrency, availableTokens, type TradeParamDisplay} from "../../types/global.type.tsx";
import TradeInputDropdown from "./TradeInputDropdown.tsx";

interface TradeStep1Props {
    token: string;
    currency: string;
    tradeType: TradeType;
    setStep: (value: number) => void
}

export default function TradeStep1({token, currency, tradeType, setStep}: TradeStep1Props) {
    const [numberOfToken, setNumberOfToken] = useState<string | number>("");
    const [amountToBuy, setAmountToBuy] = useState<string | number>("");
    const [selectedToken, setSelectedToken] = useState<TradeParamDisplay>(
        availableTokens.find((item) => item.name === token) || availableTokens[0]
    );
    const [selectedCurrency, setSelectedCurrency] = useState<TradeParamDisplay>(
        availableCurrency.find((item) => item.name === currency) || availableCurrency[0]
    );
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

    const AdditionalInfo: AdditionalInfo[] = [
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

    useEffect(() => {
        if (tradeType === "sell" && numberOfToken !== "" && rate !== 0) {
            setAmountToBuy(Number(numberOfToken) * rate);
        }

        if(tradeType === "buy" && amountToBuy !== "" && rate !== 0) {
            setNumberOfToken(Number(amountToBuy) / rate);
        }
    }, [numberOfToken, amountToBuy, tradeType, rate]);

    const submitInvalid = numberOfToken === "" || amountToBuy === "" || rate === 0;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        setStep(2)

        const data = {
            token: selectedToken.name,
            currency: selectedCurrency.name,
            amount: tradeType === "sell"? numberOfToken: amountToBuy,
            rate: rate,
            fee: fee,
            amountToReceive: amountToReceive,
        }

        console.log("Data to be submitted", data)
    }

    return (
        <form className={`space-y-20`} onSubmit={handleSubmit}>
            {/*Inputs && Additional info*/}
            <div className="space-y-5">
                {/*Inputs*/}
                <div className="space-y-2">
                    {/*Token*/}
                    <div className={``}>
                        <TradeFormInput
                            name={`${tradeType === "sell" ? "token": "currency"}`}
                            label={`enter amount`}
                            value={`${tradeType === "sell" ? numberOfToken: amountToBuy}`}
                            onInputChange={tradeType === "sell"? setNumberOfToken: setAmountToBuy}
                            tradeType={tradeType}
                            isReadOnly={false}
                        >
                            {tradeType === "sell" ?
                                <TradeInputDropdown currentValue={selectedToken} setCurrentValue={setSelectedToken} items={availableTokens} /> :
                                <TradeInputDropdown currentValue={selectedCurrency} setCurrentValue={setSelectedCurrency} items={availableCurrency} />
                            }
                        </TradeFormInput>
                    </div>

                    <img src={SwapIcon} alt="Swap icon" className={`block mx-auto`}/>

                    {/*Currency*/}
                    <div className={``}>
                        <TradeFormInput
                            name={`${tradeType === "sell" ? "currency": "token"}`}
                            label={`You will receive`}
                            value={`${tradeType === "sell" ? amountToBuy: numberOfToken}`}
                            isReadOnly={true}
                            tradeType={tradeType}
                        >
                            {tradeType === "sell" ?
                                <TradeInputDropdown currentValue={selectedCurrency} setCurrentValue={setSelectedCurrency} items={availableCurrency} />
                                 :
                                <TradeInputDropdown currentValue={selectedToken} setCurrentValue={setSelectedToken} items={availableTokens} />
                            }
                        </TradeFormInput>
                    </div>
                </div>

                {/*Additional Info*/}
                <div className={`bg-formGroupBg rounded-lg space-y-2 p-5 border border-border`}>
                    {AdditionalInfo.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <h3 className={`text-grey2 font-medium`}>{item.title}</h3>
                            <p className={`text-black`}>{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`w-1/2 mx-auto`}>
                <CustomButton
                    className="w-full"
                    buttonText="Proceed to payment"
                    type="submit"
                    disabled={submitInvalid}
                />

            </div>
        </form>
    )
}