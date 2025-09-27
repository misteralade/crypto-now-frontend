import {type ChangeEvent, useState} from "react";
import ForgotPasswordLayout from "./ForgotPasswordLayout.tsx";
import ArrowIcon from "../../../assets/icons/fluent-arrow.svg";
import {emailValidation} from "../../../util/constants.regex.ts";

interface ForgotPasswordPageProp {
    setStep: (value: number) => void;
}

export default function ForgotPasswordPage({setStep}: ForgotPasswordPageProp) {
  const [email, setEmail] = useState("");

    const validateEmail = (password: string): boolean => {
        return emailValidation.test(password);
    }

  const handleResetPassword = () => {
    // Handle reset password logic
    setStep(1);
  };

  return (
    <ForgotPasswordLayout
        icon={<img src={ArrowIcon} alt="" />}
        heading={"Forgot your password?"}
        description={"A reset link will be sent to the email provided below. Open your mailbox and follow the retrieval steps."}
        handleSubmit={handleResetPassword}
        submitInvalid={email === "" || !validateEmail(email)}
    >
            {/* Email Field */}
            <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement> ) => setEmail(e.target.value)}
                className="w-full h-[52px] px-4 py-3 border-[1.5px] border-[#E5E7EB] rounded-[26px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all duration-200 text-[16px] placeholder-[#9CA3AF]"
                placeholder="jonas@gmail.com"
                required
            />
    </ForgotPasswordLayout>
  );
}
