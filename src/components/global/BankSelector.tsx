import { ChevronDown } from "lucide-react";
import { useState, useId, useRef, useEffect, type KeyboardEvent } from "react";
import type {AllBanksResponse, SupportedCryptoOrCurrencyResponse} from "../../types/response.payload.types.ts";

interface BankSelectorProps {
  label: string;
  placeholder?: string;
  options: AllBanksResponse[] | SupportedCryptoOrCurrencyResponse[] | undefined;
  value?: string; // value is the option id
  onValueChange: (value: string) => void;
  error?: string;
  className?: string;
}

const BankSelector = ({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  error,
  className = "",
}: BankSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const selectId = useId();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const selectedOption = options?.find((opt) => opt.id === value);

  // filter options by search query
  const filteredOptions = (options || []).filter((option) =>
    option.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // handles clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: AllBanksResponse | SupportedCryptoOrCurrencyResponse) => {
    onValueChange(option.id);
    setIsOpen(false);
    setIsFocused(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((previous) =>
        previous < filteredOptions.length - 1 ? previous + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((previous) =>
        previous > 0 ? previous - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // scroll highlighted option into view smoothly
  useEffect(() => {
    if (dropdownRef.current && highlightedIndex >= 0) {
      const item =
        dropdownRef.current.querySelectorAll<HTMLButtonElement>(
          "[data-option-item]"
        )[highlightedIndex];
      item?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlightedIndex]);

  const isLabelFloating = isFocused || isOpen || value;

  return (
    <div className="space-y-2 relative" onKeyDown={handleKeyDown} tabIndex={0}>
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
          ref={buttonRef}
          onClick={handleFocus}
          // onBlur={handleBlur}
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
          <div
            ref={dropdownRef}
            role="listbox"
            aria-labelledby={selectId}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {/* search input */}
            <div className="sticky top-0 bg-white p-2 border-b border-border z-10">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="Search banks"
                className="w-full h-10 px-3 border rounded-md text-sm focus:outline-none border-border"
                autoFocus
              />
            </div>

            {/* options or empty state */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.id}
                  data-option-item
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-3 text-left text-sm flex items-center gap-2 transition-colors
                      ${
                        highlightedIndex === index
                          ? "bg-blue-50 text-primary"
                          : value === option.id
                            ? "bg-blue-50 text-primary"
                            : "text-black hover:bg-gray-50"
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
                  <span>{option.name}</span>
                </button>
              ))
            ) : (
              <div className="py-4 text-center text-sm text-gray-400">
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-500 mt-1 ml-3">{error}</p>}
    </div>
  );
};

export default BankSelector;
