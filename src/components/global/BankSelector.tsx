import { ChevronDown } from "lucide-react"
import { useState, useId } from "react"
import type {AllBanksResponse} from "../../types/response.payload.types.ts";

interface BankSelectorProps {
  label: string
  placeholder?: string
  options: AllBanksResponse[] | undefined;
  value?: string // value is the option id
  onValueChange: (value: string) => void
  error?: string
  className?: string
}

const BankSelector = ({ label, placeholder = "Select option", options, value, onValueChange, error, className = "" }: BankSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const selectId = useId()

  const selectedOption = options?.find((opt) => opt.id === value)

  const handleSelect = (option: AllBanksResponse) => {
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
            ${
            isLabelFloating
              ? "top-0 -translate-y-1/2 text-sm text-body"
              : "top-1/2 -translate-y-1/2 text-placeholder"
          }
            ${error ? "text-red-500" : ""}
            ${isFocused && !error ? "text-primary-500" : ""}
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
            ${error ? "border-red focus:border" : "border-border"}
            ${className}`}
        >
          {selectedOption ? (
            <span className="flex items-center gap-2 text-sm text-primary">
              {selectedOption.logoUrl && (
                <img
                  src={selectedOption.logoUrl}
                  alt={selectedOption.name}
                  className="w-5 h-5 rounded-full object-contain"
                />
              )}
              {selectedOption.name}
            </span>
          ) : (
            <span className="text-placeholder text-sm">{placeholder}</span>
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen && "rotate-180"
            }`}
          />
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
            {options && options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors flex items-center gap-2
                  ${
                  value === option.id
                    ? "bg-blue-50 text-primary"
                    : "text-black"
                }
                `}
              >
                {option.logoUrl && (
                  <img
                    src={option.logoUrl}
                    alt={option.name}
                    className="w-5 h-5 rounded-full object-contain"
                  />
                )}
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

export default BankSelector;
