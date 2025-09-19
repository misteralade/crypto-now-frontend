import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import type {SupportedCryptoOrCurrencyResponse} from "../../types/response.api.types.ts";

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

    return (
        <div className="relative basis-1/10">
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                type={`button`}
                className="flex cursor-pointer items-center gap-3 px-2 border-2 border-placeholder rounded-full transition-colors min-w-[120px]"
            >
                <img src={currentValue?.logoUrl} alt={currentValue?.logoUrl} width={20} height={20}/>
                <span className="font-medium text-black text-lg">{currentValue?.name}</span>
                {!isOpen ? (
                    <ChevronDown className="w-12 h-12 text-gray-600 ml-auto" />
                ) : (
                    <ChevronUp className="w-12 h-12 text-gray-600 ml-auto" />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-greyBg rounded-2xl shadow-lg overflow-y-scroll z-10">
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
