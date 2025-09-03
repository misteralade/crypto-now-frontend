import {type ChangeEvent, useState} from "react";
import {EyeOff, Eye} from "lucide-react";
import {passwordValidation} from "../../../util/constants.regex.ts";

interface CustomPasswordInputProps {
    label: string;
    placeholder: string;
    value: string;
    onInputChange: (value: string) => void;
    setIsValidPassword?: (value: boolean) => void;
}

export default function CustomPasswordInput({label, placeholder, value, onInputChange, setIsValidPassword}: CustomPasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const validatePassword = (password: string): boolean => {
        return passwordValidation.test(password);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onInputChange(e.target.value);

        if(setIsValidPassword) {
            setIsValidPassword(validatePassword(e.target.value))
        }
    }

    return(
        <div className={`relative`}>
            <input
                id={label}
                name={label}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={handleInputChange}
                className="w-full h-[52px] px-4 py-3 border-[1.5px] border-[#E5E7EB] rounded-[26px] focus:ring-2 focus:ring-FormFocusRing focus:border-FormFocusRing outline-none transition-all duration-200 text-[16px] placeholder-[#9CA3AF]"
                placeholder={placeholder}
                required
            />

            <div className={`absolute right-3 top-3`}>
                {showPassword ?
                    <Eye className={`h-6 w-6 text-fade cursor-pointer`} onClick={handleShowPassword} />
                    :
                    <EyeOff className={`h-6 w-6 text-fade cursor-pointer`} onClick={handleShowPassword}/>
                }
            </div>
        </div>
    )
}