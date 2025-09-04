import TradeSteps from "./TradeSteps.tsx";
import TradeStepDisplay from "./TradeStepDisplay.tsx";
import type {TradeType} from "../../types/trade.types.ts";

interface TradeCryptoLayoutProps {
    option: TradeType;
    currency: string;
    token: string;
}

export default function TradeCryptoLayout({ currency, token, option }: TradeCryptoLayoutProps) {
    return (
        <div className="max-w-6xl mx-auto md:px-6 flex flex-col md:flex-row gap-7 items-start">
            <div className={`md:basis-1/4 w-full`}>
                <TradeSteps step={1} />
            </div>

            <div className={`md:basis-3/4 w-full`}>
                <TradeStepDisplay step={1} tradeType={option} currency={currency} token={token} />
            </div>
        </div>
    )
}