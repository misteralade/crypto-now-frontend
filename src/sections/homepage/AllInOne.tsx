import CustomButton from "../../components/global/Button";
import allInOneImage from "../../assets/illustrations/all-in-one.png";

interface AllInOneProps {
  tradeCrypto: () => void;
}

const AllInOne = ({ tradeCrypto }: AllInOneProps) => {
  return (
    <section className="sm:mt-24 mt-16 md:mt-40 max-md:px-4 w-full md:w-[90%] 2xl:max-w-7xl mx-auto">
      <div className="max-w-6xl mx-auto md:px-4">
        <div className="grid gap-12 items-start lg:grid-cols-[minmax(0,420px)_1fr]">
          <div className="max-md:w-full max-md:flex items-start justify-center flex-col">
            <h2 className="text-2xl sm:text-3xl max-md:text-left lg:text-4xl max-w-[378px] font-normal text-[#0E0F0C] md:tracking-[0.8px] mb-8">
              Your All-in-One Wallet Dashboard
            </h2>

            <div className="max-md:px-1 space-y-6 mb-10">
              <div>
                <h3 className="text-xl font-normal text-[#0E0F0C] mb-1">
                  Do more with basic
                </h3>
                <p className="text-[#454745] max-w-[360px]">
                  See your BTC, USDT, and USD equivalent at a glance. Track your
                  last transactions instantly.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-normal text-[#0E0F0C] mb-1">
                  Transaction Receipts{" "}
                </h3>
                <p className="text-[#454745] max-w-[360px]">
                  Download PDF statements, complete with digital
                  signatures.{" "}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-normal text-[#0E0F0C] mb-1">
                  Status Tracking
                </h3>
                <p className="text-[#454745] max-w-[360px]">
                  Know exactly where your trade stands, pending, processing, or
                  completed.
                </p>
              </div>
            </div>

            <CustomButton
              onClick={tradeCrypto}
              buttonText="Buy & sell crypto now"
            />
          </div>

          <div className="">
            <div className="bg-[#F5F5FF] max-w-[589px] h-[300px] lg:h-[461px] rounded-2xl overflow-hidden">
              <img
                src={allInOneImage}
                alt="all-in-one-img"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllInOne;
