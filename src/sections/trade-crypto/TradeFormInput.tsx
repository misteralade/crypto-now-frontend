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
        let {value} = e.target

        // Prevent negative numbers
        // Remove minus sign if present
        value = value.replace(/^-/, '');
        
        // If value is empty or just a decimal point, allow it
        if (value === '' || value === '.') {
            if(onInputChange){
                onInputChange(value);
            }
            return;
        }

        // Parse the value and ensure it's not negative
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= 0) {
            if(onInputChange){
                onInputChange(value);
            }
        } else if (value === '') {
            // Allow empty string
            if(onInputChange){
                onInputChange(value);
            }
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

            <div className={`flex items-center justify-between gap-2`}>
                {isReadOnly && typeof value !== 'string' ? (
                    <div className={`font-semibold text-4xl text-black w-full ${isReadOnly && "cursor-not-allowed"}`}>
                        {value}
                    </div>
                ) : (
                    <input
                        type="number"
                        name={name}
                        id={name}
                        value={typeof value === 'string' ? value : ''}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        min="0"
                        step="any"
                        className={`font-semibold text-4xl text-black outline-none border-none w-full ${isReadOnly && "cursor-not-allowed"}`}
                        placeholder={`0`}
                        readOnly={isReadOnly}
                    />
                )}

                {children}
            </div>
        </div>
    )
}