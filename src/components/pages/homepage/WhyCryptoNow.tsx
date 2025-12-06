import VerifiedIcon from "../../../assets/icons/verified.svg";
import BitCoinIcon from "../../../assets/icons/bitcoin.svg";
import LightIcon from "../../../assets/icons/lightning.svg";

const WhyCryptoNow = () => {
  return (
    <section className="py-14 px-4 bg-[#F5F5FF] sm:mt-24 mt-16 md:mt-40">
      <div className="max-w-6xl mx-auto">
        <h2 className="sm:text-4xl text-3xl md:text-5xl font-normal text-center text-[#0E0F0C] mb-10">
          Why CryptoNow?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Admin-Verified Transactions */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img src={VerifiedIcon} alt="" />
            </div>

            <h3 className="text-xl font-medium text-[#0E0F0C] mb-2 text-center">
              Admin-Verified Transactions
            </h3>
            <p className="text-[#454745] text-lg leading-normal font-normal text-center">
              Every single transaction is checked and verified by our team for accuracy and efficiency.
            </p>
          </div>

          {/* Fixed Exchange Rates */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img src={BitCoinIcon} alt="" />
            </div>

            <h3 className="text-xl font-medium text-[#0E0F0C] mb-2 text-center">
              Fixed Exchange Rates
            </h3>
            <p className="text-[#454745] text-lg leading-normal font-normal text-center">
              Your rate is locked and  fixed for several minutes, giving you ample time to complete the transaction without any slippage or surprises.
            </p>
          </div>

          {/* Lightning-Fast Processing */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img src={LightIcon} alt="" />
            </div>

            <h3 className="text-xl font-medium text-[#0E0F0C] mb-2 text-center">
              Lightning-Fast Processing
            </h3>
            <p className="text-[#454745] text-lg leading-normal font-normal text-center">
              Trades execute at lightning speed , zero delays , fast processing
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyCryptoNow;
