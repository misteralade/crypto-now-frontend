import {useState} from "react";
import type {TradeType} from "../../types/trade.types.ts";

interface TradeStepDisplayHeadingProps {
    tradeType: TradeType;
    step: number;
}

export default function TradeStepDisplayHeading({ tradeType, step }: TradeStepDisplayHeadingProps) {
    const [activeTab, setActiveTab] = useState<TradeType>(tradeType);

    return (
        <div className={`flex justify-between items-center`}>
            <h2 className={`capitalize text-2xl font-semibold`}>{tradeType} crypto</h2>

            {step === 1 ?
                <div className=" flex items-center justify-center">
                    <div className="flex bg-greyBg2 rounded-full gap-1">
                        <button
                            onClick={() => setActiveTab("buy")}
                            className={`
                                "px-6 py-2 w-16 text-center rounded-full text-sm font-medium transition-all duration-200"
                                ${activeTab === "buy" ? "bg-primary text-white shadow-sm" : "text-fade"}
                            `}
                        >
                            Buy
                        </button>

                        <button
                            onClick={() => setActiveTab("sell")}
                            className={`"px-6 py-2 w-16 rounded-full text-sm font-medium transition-all duration-200"
                                ${activeTab === "sell" ? "bg-primary text-white shadow-sm" : "text-fade"}
                            `}
                        >
                            Sell
                        </button>
                    </div>
                </div>
                : <button className={`text-red`}>Cancel order</button>
            }
        </div>
    )
}