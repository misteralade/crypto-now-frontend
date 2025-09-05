import TradeFormInput from '../TradeFormInput.tsx'
import CustomButton from "../../../components/global/Button.tsx";
import type {TradeType, TradeAdditionalInfoInterface} from "../../../types/trade.types.ts";
import SwapIcon from "../../../assets/icons/fluent_arrow-swap-20-regular.png"
import {type FormEvent} from "react";
import {availableCurrency, availableTokens, type TradeParamDisplay} from "../../../types/global.type.tsx";
import TradeInputDropdown from "../TradeInputDropdown.tsx";
import TradeAdditionalInfo from "../TradeAdditionalInfo.tsx";


interface TradeStep1Props {
    token: string;
    currency: string;
    tradeType: TradeType;
    setStep: (value: number) => void
    orderDetails: TradeAdditionalInfoInterface[],
    selectedToken: TradeParamDisplay,
    setSelectedToken: (token: TradeParamDisplay) => void,
    selectedCurrency: TradeParamDisplay,
    setSelectedCurrency: (currency: TradeParamDisplay) => void
    numberOfToken: string | number;
    amountToBuy: string | number;
    rate: number;
    fee: number;
    amountToReceive: number;
    setNumberOfToken: (token: string | number) => void;
    setAmountToBuy: (amountToBuy: string | number) => void;
}

export default function TradeStep1({setAmountToBuy, fee, amountToReceive, rate, numberOfToken, setNumberOfToken, amountToBuy,selectedCurrency, setSelectedCurrency, setSelectedToken,selectedToken, tradeType, setStep, orderDetails}: TradeStep1Props) {

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
                <TradeAdditionalInfo heading={"Order details"} additionalInfo={orderDetails} />
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