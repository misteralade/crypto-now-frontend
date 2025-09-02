import type {DropItem, TradeOption} from "../../../types/navbar.types.ts";
import {ChevronRight} from "lucide-react";
import {useState} from "react";
import NavTokenDrop from "./NavTradeDrop.tsx";
import type {TradeParamDisplay} from "../../../types/global.type.ts";
import {TokenBTC, TokenUSDT} from "@web3icons/react";
import {useNavigate} from "@tanstack/react-router";

interface NavbarDropdownProp {
    dropItems: DropItem[];
}

export default function NavbarDropdown({dropItems}: NavbarDropdownProp) {
    const navigate = useNavigate()
    const [activeDropOption, setActiveDropOption] = useState<TradeOption>("")
    const [dropStep, setDropStep] = useState<number>(0);
    const [selectedToken, setSelectedToken] = useState<string>("");
    const [selectedCurrency, setSelectedCurrency] = useState<string>("");

    const availableTokens: TradeParamDisplay[] = [
        {
            symbol: <TokenBTC variant="branded" size="20"  />,
            name: "BTC"
        },
        {
            symbol: <TokenUSDT variant="branded" size="20"  />,
            name: "USDT"
        },
    ]
    const availableCurrency: TradeParamDisplay[] = [
        {
            symbol: <TokenBTC variant="branded" size="20"  />,
            name: "NGN"
        },
        {
            symbol: <TokenUSDT variant="branded" size="20"  />,
            name: "USD"
        },
    ]

    console.log("selectedToken", selectedToken);
    console.log("selectedCurrency", selectedCurrency);

    const handleDropClick = (option: TradeOption) => {
        if(activeDropOption !== option) {
            setActiveDropOption(option);
        }

        setSelectedToken("");
        setSelectedCurrency("");

        setDropStep(1)
    }

    const handleRouting = (currency: string) => {
        setSelectedCurrency(currency);
        navigate({to: `/trade-crypto?option=${activeDropOption}&&currency=${selectedCurrency}&&token=${selectedToken}`})
    }

    const handleNextStep = (token: string) => {
        setSelectedToken(token);
        setDropStep(2);
    }

    return(
        <div className="absolute top-full left-0 mt-2 bg-grey border border-gray-200 rounded-md shadow-lg z-10 px-1 py-2 space-y-2">
            {dropItems.map((item, index) => (
                <div key={index} className={`flex gap-10 justify-between items-center 
                cursor-pointer p-2 rounded-lg relative ${activeDropOption === item.text && "bg-accent"}`}
                     onClick={() => handleDropClick(item.text)}
                >
                    <button className="capitalize font-medium text-lg">{item.text}</button>
                    <ChevronRight className={`w-5 h-5 text-black/70`} />

                    {activeDropOption === item.text && (
                        <>
                            {dropStep === 1 && <NavTokenDrop items={availableTokens} action={handleNextStep}/>}

                            {dropStep === 2 && <NavTokenDrop items={availableCurrency}  action={handleRouting}/>}
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}