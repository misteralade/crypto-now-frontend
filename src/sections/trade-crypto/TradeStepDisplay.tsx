import type {TradeType} from "../../types/trade.types.ts";
import TradeStepDisplayHeading from "./TradeStepDisplayHeading.tsx";

interface TradeCryptoPageProps {
    tradeType: TradeType;
    step: number;
    currency: string;
    token: string;
}

export default function TradeStepDisplay({ tradeType, step, currency, token }: TradeCryptoPageProps) {
    console.log("TradeStepDisplay", tradeType, step, currency, token);

    return (
        <div className={`bg-greyBg rounded-2xl p-5 h-96`}>
            {/*heading*/}
            <TradeStepDisplayHeading step={step} tradeType={tradeType} />
        </div>
    )
}