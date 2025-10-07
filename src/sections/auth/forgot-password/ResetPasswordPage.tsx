import ForgotPasswordLayout from "./ForgotPasswordLayout.tsx";
import PadlockIcon from "../../../assets/icons/fluent-arrow-reset.svg";
import CustomPasswordInput from "./CustomPassworsInput.tsx";
import {useResetPasswordPage} from "../../../hooks/pages/useResetPasswordPage.ts";

export default function ResetPasswordPage() {
  const {
    // Values
    isPasswordChanged,
    newPassword,
    confirmPassword,
    isPasswordValid,
    isPasswordMatch,
    isLoading,
    error,
    
    
    // Functions
    setIsPasswordValid,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleNewPassword,
    navigateToLogin,
  } = useResetPasswordPage();
  
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
      loading={isLoading}
    >
      <p className="text-red-500 mb-2 text-left">{error}</p>
      
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