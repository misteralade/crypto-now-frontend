import type {ReactNode} from "react";
import {ArrowLeft} from "lucide-react";
import AuthLayout from "../../../layouts/AuthLayout.tsx";
import {useNavigate} from "@tanstack/react-router";
import CustomButton from "../../../components/global/Button.tsx";
import {ROUTES} from "../../../util/constants.util.ts";

interface ForgotPasswordLayoutProp{
    children: ReactNode;
    icon: ReactNode;
    heading: string;
    description: string;
    handleSubmit: () => void
    submitInvalid: boolean
    loading: boolean
}

export default function ForgotPasswordLayout({children, loading, icon, heading, description, handleSubmit, submitInvalid}: ForgotPasswordLayoutProp){
    const navigate = useNavigate();

    return (
        <AuthLayout layoutType={1}>
            <div className="text-center">
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    {icon}
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="md:text-[40px] text-3xl md:leading-[48px] font-semibold text-[#0E0F0C] mb-4">
                        {heading}
                    </h1>
                    <p className="md:text-[18px] text-base md:leading-[24px] text-[#6B7280] font-normal max-w-[520px]">
                        {description}
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6">
                    {children}

                    <CustomButton
                        className="w-full"
                        buttonText={`${loading ? "loading...": "Reset password"}`}
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitInvalid}
                    />
                </form>

                {/* Back to Login Link */}
                <div className="mt-5">
                    <button
                        type="button"
                        onClick={() =>  navigate({ to: ROUTES.SIGNIN })}
                        className="inline-flex items-center text-[16px] font-medium text-[#6B7280] cursor-pointer hover:text-[#1E1B4B] transition-colors duration-200"
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        Back to Login
                    </button>
                </div>
            </div>
        </AuthLayout>
    )
}