import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useCombobox } from "downshift";
import type { AllBanksResponse, SupportedCryptoOrCurrencyResponse } from "../../types/response.payload.types.ts";

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
  placeholder = "Search bank...",
  options = [],
  value,
  onValueChange,
  error,
  className = "",
}: BankSelectorProps) => {
  const [items, setItems] = useState<any[]>(options || []);

  // Sync items when options prop changes
  useEffect(() => {
    setItems(options || []);
  }, [options]);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item.name : "";
    },
    onInputValueChange({ inputValue }) {
      const filtered = (options || []).filter((item: any) =>
          item.name.toLowerCase().includes(inputValue?.toLowerCase() || "")
      );
      setItems(filtered);
    },
    onSelectedItemChange({ selectedItem }) {
      if (selectedItem) {
        onValueChange(selectedItem.id);
      }
    },
    selectedItem: (options as any[]).find((opt: any) => opt.id === value) || null,
  });

  const isLabelFloating = isOpen || value || getInputProps().value;

  return (
    <div className="space-y-2 relative">
      <div className="relative">
        {/* Floating Label */}
        <label
          {...getLabelProps()}
          className={`absolute left-3 bg-white px-1 text-sm font-medium transition-all duration-200 pointer-events-none z-10
            ${
              isLabelFloating
                ? "top-0 -translate-y-1/2 text-sm text-[#03034D]"
                : "top-1/2 -translate-y-1/2 text-[#9A9A9A]"
            }
            ${error ? "text-red-500" : ""}
          `}
        >
          {label}
        </label>

        {/* Input Container */}
        <div
          className={`w-full h-14 px-4 border rounded-2xl bg-white flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#03034D]/10 transition-all
            ${error ? "border-red-500" : "border-[#EEEEEE] focus-within:border-[#03034D]"}
            ${className}`}
        >
          {selectedItem && !isOpen && (
             <div className="flex shrink-0 items-center justify-center w-6 h-6">
                <img
                  src={selectedItem.logoUrl}
                  alt=""
                  className="w-5 h-5 rounded-full object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
             </div>
          )}
          
          <input
            {...getInputProps({
               onFocus: () => {
                 if (!isOpen) {
                   // Optional: clear input on focus to allow fresh search
                   // setInputValue("");
                 }
               }
            })}
            placeholder={isLabelFloating ? placeholder : ""}
            className="flex-1 h-full bg-transparent text-sm text-[#0E0F0C] focus:outline-none placeholder-[#9A9A9A]"
          />

          <button
            type="button"
            {...getToggleButtonProps()}
            aria-label="toggle menu"
            className="p-1 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen && "rotate-180"
              }`}
            />
          </button>
        </div>

        {/* Dropdown Options */}
        <ul
          {...getMenuProps()}
          className={`absolute top-full left-0 right-0 mt-2 bg-white border border-[#EEEEEE] rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto transition-all
            ${isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}
          `}
        >
          {isOpen && (
            <>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <li
                    key={`${item.id}${index}`}
                    {...getItemProps({ item, index })}
                    className={`px-4 py-3 cursor-pointer text-sm flex items-center gap-3 transition-colors
                      ${
                        highlightedIndex === index
                          ? "bg-gray-50 text-[#03034D]"
                          : value === item.id
                            ? "bg-[#03034D]/5 text-[#03034D] font-semibold"
                            : "text-[#0E0F0C] hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                      <img
                        src={item.logoUrl}
                        alt=""
                        className="w-full h-full object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <span className="flex-1 truncate">{item.name}</span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 text-center text-sm text-[#9A9A9A] italic">
                  No banks found for "{getInputProps().value}"
                </li>
              )}
            </>
          )}
        </ul>
      </div>

      {/* Error Message */}
      {error && <p className="text-xs text-red-500 mt-1 ml-3" role="alert">{error}</p>}
    </div>
  );
};

export default BankSelector;
