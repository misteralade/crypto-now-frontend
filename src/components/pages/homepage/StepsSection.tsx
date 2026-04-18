import CustomButton from "../../global/Button.tsx";
import stepsImage from "../../../assets/illustrations/steps-img.png";
import {ROUTES} from "../../../util/constants.util.ts";
import { useNavigate } from "@tanstack/react-router";
interface StepsSectionProps {
  tradeCrypto: () => void;
  isAuthenticated: boolean | null;
}

const StepsSection = ({ tradeCrypto, isAuthenticated }: StepsSectionProps) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // If user is authenticated, route to signup, otherwise use tradeCrypto
    if (isAuthenticated === false) {
      navigate({ to: ROUTES.SIGNUP });
    } else {
      tradeCrypto();
    }
  };

  const buttonText = isAuthenticated === false 
    ? "Set up an account now" 
    : "Buy & sell crypto now";



  return (
    <section className="sm:mt-20 mt-14 md:mt-40 max-md:px-4 w-full md:w-[90%] 2xl:max-w-7xl mx-auto" id={ROUTES.HOMEPAGE_TAG_IDS.HOW_IT_WORKS}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="max-md:order-2">
            <div className="bg-[#F5F5FF] max-w-[589px] h-[300px] sm:h-[461px] rounded-2xl">
              <img src={stepsImage} alt="steps-img" />
            </div>
          </div>

          <div className="max-md:w-full max-md:flex items-center justify-center flex-col">
            <h2 className="text-2xl sm:text-3xl max-md:text-center lg:text-4xl max-w-[378px] font-normal text-[#0E0F0C] md:tracking-[0.8px] mb-8">
              Make your trade in 3 simple steps
            </h2>

            <div className="relative mb-8">
              {/* Connecting lines */}
              <div className="absolute left-5 top-10 bottom-16 w-[5px] bg-[#F5F5FF] hidden sm:block"></div>

              {/* Step 1 */}
              <div className="flex items-start gap-6 mb-12 max-lg:w-full">
                <div className="relative z-10 w-12 h-12 bg-[#F5F5FF] rounded-full flex items-center justify-center text-xl font-normal text-[#120D59]">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-normal text-[#0E0F0C] mb-1">
                    Create Your Account
                  </h3>
                  <p className="text-[#454745] max-w-[360px]">
                    Sign up using your email and password. Enable 2FA for extra security.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-6 mb-12">
                <div className="relative z-10 w-12 h-12 bg-[#F5F5FF] rounded-full flex items-center justify-center text-xl font-normal text-[#120D59]">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-normal text-[#0E0F0C] mb-1">
                    Choose Buy or Sell
                  </h3>
                  <p className="text-[#454745] max-w-[360px]">
                    Select your currency, enter an amount, and review the transaction details.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-6">
                <div className="relative z-10 w-12 h-12 bg-[#F5F5FF] rounded-full flex items-center justify-center text-xl font-normal text-[#120D59]">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-normal text-[#0E0F0C] mb-1">
                    Confirm & Complete
                  </h3>
                  <p className="text-[#454745] max-w-[360px]">
                    Follow the payment instructions. We'll instantly verify and process your transaction.
                  </p>
                </div>
              </div>
            </div>

            <CustomButton
              onClick={handleButtonClick}
              buttonText={buttonText}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
