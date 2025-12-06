import { ChevronDown } from "lucide-react"
import { useState, useId } from "react"

interface Option {
    id: string
    name: string
    icon?: string
}

interface CustomSelectorProps {
    label: string
    placeholder?: string
    options: Option[]
    value?: string
    onValueChange: (value: string) => void
    error?: string
    className?: string
}

export default function CustomSelector({
                                           label,
                                           placeholder = "Select option",
                                           options,
                                           value,
                                           onValueChange,
                                           error,
                                           className = "",
                                       }: CustomSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const selectId = useId()

    const selectedOption = options?.find((opt) => opt.id === value)

    const handleSelect = (option: Option) => {
        onValueChange(option.id)
        setIsOpen(false)
        setIsFocused(false)
    }

    const handleFocus = () => {
        setIsFocused(true)
        setIsOpen(true)
    }

    const handleBlur = () => {
        setIsFocused(false)
        setTimeout(() => setIsOpen(false), 150)
    }

    const isLabelFloating = isFocused || isOpen || value

    return (
        <div className="space-y-2">
            <div className="relative">
                {/* Floating Label */}
                <label
                    htmlFor={selectId}
                    className={`absolute left-3 bg-white px-1 text-sm font-medium transition-all duration-200 pointer-events-none z-10
            ${
                        isLabelFloating
                            ? "top-0 -translate-y-1/2 text-sm text-gray-700"
                            : "top-1/2 -translate-y-1/2 text-gray-400"
                    }
            ${error ? "text-red-500" : ""}
            ${isFocused && !error ? "text-[#1a1f5c]" : ""}
          `}
                >
                    {label}
                </label>

                {/* Select Button */}
                <button
                    type="button"
                    id={selectId}
                    onClick={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full h-14 px-4 border rounded-full bg-white text-left flex items-center justify-between focus:outline-none transition-colors
            ${error ? "border-red-500" : "border-gray-300"}
            ${isFocused && !error ? "border-[#1a1f5c]" : ""}
            ${className}`}
                >
                    {selectedOption ? (
                        <span className="flex items-center gap-2 text-sm text-gray-900">
              {selectedOption.icon && <span className="text-lg">{selectedOption.icon}</span>}
                            {selectedOption.name}
            </span>
                    ) : (
                        <span className="text-gray-400 text-sm">{placeholder}</span>
                    )}
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen && "rotate-180"}`} />
                </button>

                {/* Dropdown Options */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                        {options?.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors flex items-center gap-2
                  ${value === option.id ? "bg-blue-50 text-[#1a1f5c]" : "text-gray-900"}
                `}
                            >
                                {option.icon && <span className="text-lg">{option.icon}</span>}
                                {option.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red-500 mt-1 ml-3">{error}</p>}
        </div>
    )
}
