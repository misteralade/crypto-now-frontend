import {type ComponentProps, useId, useState} from "react";

interface CustomInputProps extends ComponentProps<"input"> {
  label: string
  error?: string
}

export const CustomInput = ({ label, error, className = "", id, ...props }: CustomInputProps) => {
  const inputId = useId()
  const finalId = id || inputId
  const [isFocused, setIsFocused] = useState(false)

  // Check if label should be floating (focused, has value, has defaultValue, or has placeholder)
  const hasValue = props.value !== undefined && props.value !== null && String(props.value).length > 0
  const hasDefaultValue = props.defaultValue !== undefined && props.defaultValue !== null && String(props.defaultValue).length > 0
  const hasPlaceholder = props.placeholder !== undefined && props.placeholder !== null && String(props.placeholder).length > 0
  // Always float the label if there's a placeholder, value, or when focused to prevent overlap
  const isLabelFloating = isFocused || hasValue || hasDefaultValue || hasPlaceholder

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
        {/* Floating Label - Always visible at top when placeholder exists or when there's a value/focus */}
        <label
          htmlFor={finalId}
          className={`absolute left-4 px-2 font-medium transition-all duration-200 pointer-events-none z-10
                        ${isLabelFloating
            ? '-top-0.5 text-xs bg-white text-gray-600'
            : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
          }
                        ${error ? 'text-red-500' : ''}
                        ${isFocused && !error ? 'text-blue-600' : ''}
                    `}
        >
          {label}
        </label>

        {/* Input Field */}
        <input
          id={finalId}
          className={`w-full h-14 px-4 border rounded-full bg-white focus:outline-none transition-colors
                        ${isLabelFloating ? 'pt-5 pb-1' : 'py-0'}
                        ${error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-blue-500"
          }
                        ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-500 mt-1 ml-3">{error}</p>}
    </div>
  )
}
