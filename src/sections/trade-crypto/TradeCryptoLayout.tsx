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
        <div className="max-w-6xl mx-auto md:px-6 grid md:grid-cols-10 md:gap-4">
            <div className={`col-span-3`}>
                <TradeSteps step={1} />
            </div>

            <div className={`col-span-7`}>
                <TradeStepDisplay step={1} tradeType={option} currency={currency} token={token} />
            </div>
        </div>
    )
}