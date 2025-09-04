import type {TradeType} from "../../types/trade.types.ts";
import TradeStepDisplayHeading from "./TradeStepDisplayHeading.tsx";
import TradeStep1 from "./TradeStep1.tsx";
import {useState} from "react";

interface TradeCryptoPageProps {
    tradeType: TradeType;
    step: number;
    currency: string;
    token: string;
    setStep: (value: number) => void
}

export default function TradeStepDisplay({ tradeType, step, currency, token, setStep }: TradeCryptoPageProps) {
    const [activeTab, setActiveTab] = useState<TradeType>(tradeType);

    return (
        <div className={`bg-greyBg rounded-2xl p-5 space-y-5`}>
            {/*heading*/}
            <TradeStepDisplayHeading step={step} tradeType={tradeType} activeTab={activeTab} setActiveTab={setActiveTab} />

           {/* Content*/}
            {step === 1 && <TradeStep1 token={token} currency={currency} tradeType={activeTab} setStep={setStep} />}
        </div>
    )
}