import CustomButton from "../../components/global/Button";

export default function StepsSection() {
  return (
    <section className="mt-40">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="">
            <div className="bg-[#F5F5FF] max-w-[589px] h-[461px] rounded-2xl"></div>
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl max-w-[378px] font-normal text-[#0E0F0C] tracking-[0.8px] mb-8">
              Make your trade in 3 simple steps
            </h2>

            <div className="relative mb-8">
              {/* Connecting lines */}
              <div className="absolute left-5 top-10 bottom-16 w-[5px] bg-[#F5F5FF] hidden sm:block"></div>

              {/* Step 1 */}
              <div className="flex items-start gap-6 mb-12">
                <div className="relative z-10 w-12 h-12 bg-[#F5F5FF] rounded-full flex items-center justify-center text-xl font-normal text-[#120D59]">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-normal text-[#0E0F0C] mb-1">
                    Create Your Account
                  </h3>
                  <p className="text-[#454745] max-w-[360px]">
                    Sign up with just your email and password. Secure your
                    account with 2FA if you like.
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
                    Pick your currency, enter your amount, and review the
                    details
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
                    Follow our payment or deposit instructions. We'll verify and
                    process your transaction
                  </p>
                </div>
              </div>
            </div>

            <CustomButton buttonText="Buy & sell crypto now" />
          </div>
        </div>
      </div>
    </section>
  );
}
