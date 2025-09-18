import type {DropItem} from "../../../types/navbar.types.ts";
import {ChevronRight} from "lucide-react";
import NavTokenDrop from "./NavTradeDrop.tsx";
import {useNavbarDropdown} from "../../../hooks/components/useNavbarDropdown.ts";

interface NavbarDropdownProp {
    dropItems: DropItem[];
    isMobile?: boolean;
    isDropdownOpen?: boolean;
    handleMenuItemClick?: () => void;
}

export default function NavbarDropdown({dropItems, isMobile, isDropdownOpen, handleMenuItemClick}: NavbarDropdownProp) {
    const {
        // Values
        supportedCurrencies,
        supportedCryptoCurrencies,
        dropStep,
        activeDropOption,
        showTradeDrop,

        // Functions
        handleDropClick,
        handleNextStep,
        handleRouting,
    } = useNavbarDropdown(handleMenuItemClick, isMobile);

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
                                    {dropStep === 1 && <NavTokenDrop items={supportedCryptoCurrencies || []} action={handleNextStep} isMobile={isMobile}/>}

                                    {dropStep === 2 && <NavTokenDrop items={supportedCurrencies || []}  action={handleRouting} isMobile={isMobile}/>}
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
                            {dropStep === 1 && <NavTokenDrop items={supportedCryptoCurrencies || []} action={handleNextStep}/>}

                            {dropStep === 2 && <NavTokenDrop items={supportedCurrencies || []}  action={handleRouting}/>}
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}