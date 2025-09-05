
import {useId, useState} from "react";
import type {ComponentProps} from "react";

interface CustomInputProps extends ComponentProps<"input"> {
    label: string
    error?: string
}

export function CustomInput({ label, error, className = "", id, ...props }: CustomInputProps) {
    const inputId = useId()
    const finalId = id || inputId
    const [isFocused, setIsFocused] = useState(false)

    // Check if label should be floating (focused, has value, or has placeholder being shown)
    const isLabelFloating = isFocused || (props.value && String(props.value).length > 0) || (props.defaultValue && String(props.defaultValue).length > 0)

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true)
        props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false)
        props.onBlur?.(e)
    }

    return (
        <div className="space-y-2">
            <div className="relative">
                {/* Floating Label */}
                <label
                    htmlFor={finalId}
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

                {/* Input Field */}
                <input
                    id={finalId}
                    className={`w-full h-14 px-4 border rounded-full bg-white focus:outline-none transition-colors
                        ${error
                        ? "border-red focus:border-red"
                        : "border-border"
                    }
                        ${className}`}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red mt-1 ml-3">{error}</p>}
        </div>
    )
}
