import {useRef, useState} from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import type {SupportedCryptoOrCurrencyResponse} from "../../types/response.payload.types.ts";
import useClickOutside from "../../hooks/useClickOutside.ts";

interface CurrencyDropdownProps {
    currentValue: SupportedCryptoOrCurrencyResponse | undefined;
    setCurrentValue: (value: SupportedCryptoOrCurrencyResponse) => void
    items: SupportedCryptoOrCurrencyResponse[],
}

export default function TradeInputDropdown({ currentValue, setCurrentValue, items }: CurrencyDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleSelect = (item: SupportedCryptoOrCurrencyResponse) => {
        setCurrentValue(item)
        setIsOpen(false)
    }

    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => setIsOpen(false));

    return (
        <div className="relative basis-1/10" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                type={`button`}
                className={`flex cursor-pointer items-center gap-2 md:gap-3 py-2 px-3 md:px-4 border-2 border-placeholder rounded-full transition-colors ${isOpen ? 'min-w-[120px]' : 'min-w-[70px] md:min-w-[120px]'}`}
            >
                <img src={currentValue?.logoUrl} alt={currentValue?.logoUrl} width={20} height={20} className="flex-shrink-0"/>
                <span className={`font-medium text-black text-lg ${isOpen ? 'inline' : 'hidden md:inline'}`}>{currentValue?.name}</span>
                {!isOpen ? (
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gray-600 ml-auto flex-shrink-0" />
                ) : (
                    <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-gray-600 ml-auto flex-shrink-0" />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-greyBg rounded-2xl shadow-lg overflow-y-scroll z-50">
                    {items.map((item, index) => (
                        <button
                            type={`button`}
                            key={index}
                            onClick={() => handleSelect(item)}
                            className={`w-full flex items-center gap-3 py-3 px-5 hover:bg-formGroupBg transition-colors`}
                        >
                          <img src={item.logoUrl} alt={item.logoUrl} width={20} height={20}/>
                          <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
