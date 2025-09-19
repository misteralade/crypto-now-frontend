import type {TradeType} from "../../types/trade.types.ts";
import type {ChangeEvent, ReactNode} from "react";

interface TradeFormInputProps {
    label: string;
    name: string;
    value: string;
    onInputChange?: (value: string) => void;
    isReadOnly?: boolean
    tradeType: TradeType
    children: ReactNode
}

export default function TradeFormInput({ label, name, value, onInputChange, children, isReadOnly, }: TradeFormInputProps) {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target

        if(onInputChange){
            onInputChange(value);
        }
    }

    return (
        <div className={`bg-formGroupBg rounded-lg p-5 space-y-3 border border-border`}>
            <label htmlFor={name} className={`text-grey uppercase text-sm block`}>{label}</label>

            <div className={`flex items-center justify-between gap-2`}>
                <input
                    type={`number`}
                    name={name}
                    id={name}
                    value={value}
                    onChange={handleInputChange}
                    className={`font-semibold text-4xl text-black outline-none border-none w-full ${isReadOnly && "cursor-not-allowed"}`}
                    placeholder={`0`}
                    readOnly={isReadOnly}
                />

                {children}
            </div>
        </div>
    )
}