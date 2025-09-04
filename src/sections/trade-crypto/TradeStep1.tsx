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
}

export default function TradeStep1({token, currency, tradeType}: TradeStep1Props) {
    const [numberOfToken, setNumberOfToken] = useState<string | number>("");
    const [amountToBuy, setAmountToBuy] = useState<string | number>("");
    const [selectedToken, setSelectedToken] = useState<TradeParamDisplay>(availableTokens.find((item) => item.name === token) as TradeParamDisplay)
    const [selectedCurrency, setSelectedCurrency] = useState<TradeParamDisplay>( availableCurrency?.find((item) => item.name === currency) as TradeParamDisplay)
    const rates = [
        {
            currency: "USD",
            rate: 1,
        },
        {
            currency: "NGN",
            rate: 1528
        }
    ];

    const [rate, setRate] = useState<number>(0)

    useEffect(() => {
        const foundRateObject = rates.find((item) => item.currency === selectedCurrency.name);

        setRate(foundRateObject?.rate as number)
    }, [selectedCurrency]);


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
        if(tradeType === "sell"){
            setAmountToBuy(Number(numberOfToken) * rate);
        } else {
            setNumberOfToken(Number(amountToBuy) / rate);
        }
    }, [numberOfToken, amountToBuy, tradeType, rate]);

    const submitInvalid = numberOfToken === "" || amountToBuy === "" || rate === 0;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

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