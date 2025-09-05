
import { ChevronDown } from "lucide-react"
import {useState, useId} from "react";

interface CustomSelectProps {
    label: string
    placeholder?: string
    options: string[]
    value: string
    onValueChange: (value: string) => void
    error?: string
    className?: string
}

export function CustomSelect({
                                 label,
                                 placeholder = "Select option",
                                 options,
                                 value,
                                 onValueChange,
                                 error,
                                 className = "",
                             }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const selectId = useId()

    const handleSelect = (option: string) => {
        onValueChange(option)
        setIsOpen(false)
        setIsFocused(false)
    }

    const handleFocus = () => {
        setIsFocused(true)
        setIsOpen(true)
    }

    const handleBlur = () => {
        setIsFocused(false)
        // Delay closing to allow option selection
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
                        ${isLabelFloating
                        ? 'top-0 -translate-y-1/2 text-sm text-body'
                        : 'top-1/2 -translate-y-1/2 text-placeholder'
                    }
                        ${error ? 'text-red-500' : ''}
                        ${isFocused && !error ? 'text-primary-500' : ''}
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
                        ${error
                        ? "border-red focus:border"
                        : "border-border"
                    }
                        ${className}`}
                >
                    <span className={`${value ? "text-primary" : "text-transparent"} text-sm`}>
                        {value || placeholder}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen && "rotate-180"}`} />
                </button>

                {/* Dropdown Options */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors
                                    ${value === option ? 'bg-blue-50 text-primary' : 'text-black'}
                                `}
                            >
                                {option}
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