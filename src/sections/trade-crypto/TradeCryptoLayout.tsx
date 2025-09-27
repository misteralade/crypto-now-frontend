import TradeSteps from "./TradeSteps.tsx";
import TradeStepDisplay from "./TradeStepDisplay.tsx";
import type { TradeType } from "../../types/trade.types.ts";
import {Fragment, useState} from "react";
import TradeSuccess from "./TradeSuccess.tsx";

interface TradeCryptoLayoutProps {
    option: TradeType;
    currency: string;
    token: string;
}

export default function TradeCryptoLayout({ currency, token, option }: TradeCryptoLayoutProps) {
    const [step, setStep] = useState<number>(1)
    const [activeTab, setActiveTab] = useState<TradeType>(option);


    return (
        <Fragment>
            <div className="max-w-6xl mx-auto md:px-6 flex flex-col md:flex-row gap-14 md:gap-7 items-start">
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
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        </div>
                    </>
                }
            </div>
        </Fragment>
    )
}