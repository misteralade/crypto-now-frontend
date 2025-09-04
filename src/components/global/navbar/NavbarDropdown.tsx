import type {DropItem, TradeOption} from "../../../types/navbar.types.ts";
import {ChevronRight} from "lucide-react";
import {useState} from "react";
import NavTokenDrop from "./NavTradeDrop.tsx";
import {useNavigate} from "@tanstack/react-router";
import {availableCurrency, availableTokens} from "../../../types/global.type.tsx";

interface NavbarDropdownProp {
    dropItems: DropItem[];
    isMobile?: boolean;
    isDropdownOpen?: boolean;
    handleMenuItemClick?: () => void;
}

export default function NavbarDropdown({dropItems, isMobile, isDropdownOpen, handleMenuItemClick}: NavbarDropdownProp) {
    const navigate = useNavigate()
    const [activeDropOption, setActiveDropOption] = useState<TradeOption>("")
    const [dropStep, setDropStep] = useState<number>(0);
    const [selectedToken, setSelectedToken] = useState<string>("");
    const [showTradeDrop, setShowTradeDrop] = useState<boolean>(false);

    const handleDropClick = (option: TradeOption) => {
        if (activeDropOption === option) {
            setShowTradeDrop(!showTradeDrop);
        } else {
            setActiveDropOption(option);
            setShowTradeDrop(true);
            setDropStep(1);
        }

        setSelectedToken("");
    }

    const handleNextStep = (token: string) => {
        setSelectedToken(token);
        setDropStep(2);
    }

    const handleRouting = (currency: string) => {
        navigate({to: `/trade-crypto?option=${activeDropOption}&currency=${currency}&token=${selectedToken}`})

        if(isMobile && handleMenuItemClick){
            handleMenuItemClick();
        }
    }

    if(isMobile){
        return (
            <div
                className={`relative overflow-visible transition-all duration-300 ease-in-out ${
                    isDropdownOpen ? "max-h-90 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="ml-4 pb-2 flex flex-col space-y-2">
                    {dropItems.map((item, index) => (
                        <span key={index}
                                className="text-gray-600 relative capitalize hover:text-gray-900 py-1 transition-colors duration-200"
                               onClick={() => handleDropClick(item.text)}
                        >
                            {item.text}

                            {activeDropOption === item.text && showTradeDrop && (
                                <>
                                    {dropStep === 1 && <NavTokenDrop items={availableTokens} action={handleNextStep} isMobile={isMobile}/>}

                                    {dropStep === 2 && <NavTokenDrop items={availableCurrency}  action={handleRouting} isMobile={isMobile}/>}
                                </>
                            )}
                        </span>
                    ))}
                </div>
            </div>
        )
    }

    return(
        <div className="absolute top-full left-0 mt-2 bg-greyBg border border-gray-200 rounded-md shadow-lg z-10 px-1 py-2 space-y-2">
            {dropItems.map((item, index) => (
                <div key={index} className={`flex gap-10 justify-between items-center 
                cursor-pointer p-2 rounded-lg relative ${activeDropOption === item.text && "bg-accent"}`}
                     onClick={() => handleDropClick(item.text)}
                >
                    <button className="capitalize font-medium text-lg">{item.text}</button>
                    <ChevronRight className={`w-5 h-5 text-black/70`} />

                    {activeDropOption === item.text && showTradeDrop && (
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