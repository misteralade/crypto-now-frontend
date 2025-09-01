import AuthLayout from "../../../layouts/AuthLayout";
import Email from "../../../assets/illustrations/email-illustration.svg";
import CustomButton from "../../../components/global/Button";

const OtpSent = () => {
  return (
    <AuthLayout layoutType={1}>
      <div className="flex items-center justify-center max-lg:mt-10">
        <img src={Email} alt="" />
      </div>

      {/* Header */}
      <div className="mt-5">
        <h1 className="md:text-[40px] text-center text-3xl md:leading-[48px] font-semibold text-[#0E0F0C] mb-4">
          Check your email
        </h1>
        <p className="md:text-[18px] text-center text-base md:leading-[28px] text-[#454745] font-normal max-w-[585px] mx-auto">
          We've sent a verification link to your email. Please check your inbox
          (and spam folder) to activate your account.
        </p>
      </div>

      <div className="flex gap-3 mt-10 max-md:flex-col">
        <CustomButton className="w-full" buttonText="Open mailapp" />
        <CustomButton
          variant="link"
          to="/"
          className="w-full"
          buttonText="Resend verification link"
        />
      </div>
    </AuthLayout>
  );
};

export default OtpSent;
