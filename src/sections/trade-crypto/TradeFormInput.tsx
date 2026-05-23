import type {TradeType} from "../../types/trade.types.ts";
import type {ChangeEvent, ReactNode, KeyboardEvent} from "react";

interface TradeFormInputProps {
    label: string;
    name: string;
    value: string | ReactNode;
    onInputChange?: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    isReadOnly?: boolean
    tradeType: TradeType
    children: ReactNode
}

export default function TradeFormInput({ label, name, value, onInputChange, onFocus, onBlur, children, isReadOnly, }: TradeFormInputProps) {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const sanitizedValue = rawValue.replace(/,/g, "").replace(/^-/, "");

        // Allow intermediate decimal states like "0.", ".5", and trailing zeros.
        // Reject any other non-numeric input while keeping the user's exact string.
        if (sanitizedValue === "" || sanitizedValue === "." || /^\d*\.?\d*$/.test(sanitizedValue)) {
            onInputChange?.(sanitizedValue);
        }
    }
    
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Prevent minus key
        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
            e.preventDefault();
        }
    }
    
    const handleFocus = () => {
        if(onFocus){
            onFocus();
        }
    }
    
    const handleBlur = () => {
        if(onBlur){
            onBlur();
        }
    }

    return (
        <div className={`bg-formGroupBg rounded-lg p-5 space-y-3 border border-border`}>
            <label htmlFor={name} className={`text-grey uppercase text-sm block`}>{label}</label>

            <div className={`flex items-center justify-between gap-2 min-w-0 w-full`}>
                <div className="flex-1 min-w-0 overflow-hidden max-w-full">
                    {isReadOnly && typeof value !== 'string' ? (
                        <div className={`font-semibold text-xl sm:text-2xl md:text-3xl text-black w-full overflow-hidden break-all ${isReadOnly && "cursor-not-allowed"}`}>
                            {value}
                        </div>
                    ) : (
                        <input
                            type="text"
                            inputMode="decimal"
                            name={name}
                            id={name}
                            value={typeof value === 'string' ? value : ''}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            min="0"
                            step="any"
                            className={`font-semibold text-xl sm:text-2xl md:text-3xl text-black outline-none border-none w-full ${isReadOnly && "cursor-not-allowed"}`}
                            placeholder={`0`}
                            readOnly={isReadOnly}
                            style={{
                                maxWidth: '100%',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        />
                    )}
                </div>

                <div className="flex-shrink-0">
                    {children}
                </div>
            </div>
        </div>
    )
}
