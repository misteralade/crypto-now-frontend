import ForgotPasswordLayout from "./ForgotPasswordLayout.tsx";
import PadlockIcon from "../../../assets/icons/fluent-arrow-reset.svg";
import {useState} from "react";
import CustomPasswordInput from "./CustomPassworsInput.tsx";
import {useNavigate} from "@tanstack/react-router";

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);

    const handlePasswordChange = (value: string)=> {
        setNewPassword(value)
    }

    const handleConfirmPasswordChange = (value: string)=> {
        if (value !== newPassword) {
            setIsPasswordMatch(false)
        } else {
            setIsPasswordMatch(true)
        }

        setConfirmPassword(value)
    }

    const handleNewPassword = () => {
        setIsPasswordChanged(true)
    }

    const navigateToLogin = () => {
        navigate({ to: '/sign-in' })
    }

    return (
        <ForgotPasswordLayout
            icon={<img src={PadlockIcon} alt="" />}
            heading={isPasswordChanged ? "Password reset!": "Set a new password"}
            description={ isPasswordChanged?
                "You’ve successfully created a new password, click below to login":
                "Your new password must be different from previously used passwords"
            }
            handleSubmit={isPasswordChanged ? navigateToLogin: handleNewPassword}
            submitInvalid={!isPasswordValid || !isPasswordMatch || newPassword === "" || confirmPassword === ""}
        >
             <CustomPasswordInput
                 label={"password"}
                 placeholder={"Password"}
                 value={newPassword}
                 onInputChange={handlePasswordChange}
                 setIsValidPassword={setIsPasswordValid}
             />

             <div className={`space-y-2`}>
                 <CustomPasswordInput
                     label={"confirm-password"}
                     placeholder={"Confirm Password"}
                     value={confirmPassword}
                     onInputChange={handleConfirmPasswordChange}
                 />
                 {!isPasswordValid && <p className={`text-desc max-w-sm text-sm text-left`}>Password must be at least 8 characters, uppercase and lowercase letters, a number, and a special symbol.</p> }
                 {!isPasswordMatch && <p className={`text-desc max-w-sm text-sm text-left`}>Password must be match.</p> }
             </div>
        </ForgotPasswordLayout>
    );
}