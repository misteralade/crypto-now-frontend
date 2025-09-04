import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import type {TradeParamDisplay} from "../../types/global.type.tsx";

interface CurrencyDropdownProps {
    currentValue: TradeParamDisplay
    setCurrentValue: (value: TradeParamDisplay) => void
    items: TradeParamDisplay[],
}

export default function TradeInputDropdown({ currentValue, setCurrentValue, items }: CurrencyDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleSelect = (item: TradeParamDisplay) => {
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
                {currentValue.symbol}
                <span className="font-medium text-black text-lg">{currentValue.name}</span>
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
                            {item.symbol}
                            <span className="font-semibold text-gray-900">{item.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
