import type {ReactNode} from "react";
import TokenBTC from "../../src/assets/icons/cryptocurrency-color_btc.png";
import TokenUSDT from "../../src/assets/icons/cryptocurrency-color_usdt.png";
import NGNIcon from "../../src/assets/icons/ngn-icon.png";
import USDIcon from "../../src/assets/icons/usd-icon.png";

export interface TradeParamDisplay {
    symbol: ReactNode,
    name: string,
}

export const availableTokens: TradeParamDisplay[] = [
    {
        symbol: <img src={TokenBTC} alt="BTC icon" className="w-6 h-6" />,
        name: "BTC"
    },
    {
        symbol: <img src={TokenUSDT} alt="USDT icon" className="w-6 h-6" />,
        name: "USDT"
    },
]

export const availableCurrency: TradeParamDisplay[] = [
    {
        symbol: <img src={NGNIcon} alt="NGN icon" className="w-6 h-6" />,
        name: "NGN"
    },
    {
        symbol: <img src={USDIcon} alt="USD icon" className="w-6 h-6" />,
        name: "USD"
    },
]