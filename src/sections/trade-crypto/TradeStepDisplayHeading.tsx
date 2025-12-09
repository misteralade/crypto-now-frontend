import type { TradeType } from "../../types/trade.types.ts";
import { clearTradeProgress } from "../../util/tradeProgress.storage.util.ts";

interface TradeStepDisplayHeadingProps {
  step: number;
  activeTab: TradeType;
  setActiveTab: (activeTab: TradeType) => void;
  setStep: (step: number) => void;
}

const TradeStepDisplayHeading = ({ step, activeTab, setStep,setActiveTab,}: TradeStepDisplayHeadingProps) => {
  const description = (): string => {
    if (step === 2) {
      switch (activeTab) {
        case "buy":
          return "To process order make payment to the bank account details provided below, please upload your payment Receipt for quicker processing.\n\nImportant Notice for buy crypto, pls note the network fee will be deducted from the crypto purchases: we do not cover the fee."
        case "sell":
          return "To process your order, send crypto to the wallet address provided, after sending crypto, please upload your proof for quicker processing."
        default:
          return ""
      }
    } else {
      return `Your order is been processed. You’ll get notified when we make your ${activeTab === "buy" ? "payment" : "crypto"} into your ${activeTab === "buy" ? "account" : "wallet"} via email.`
    }
  }

  const handleCancel = () => {
    clearTradeProgress();
    setStep(1); // reset step
    setActiveTab("buy"); // optional: always reset tab to buy
  };

  return (
    <div className={`space-y-2`}>
      {/*heading*/}
      <div className={`flex justify-between items-center`}>
        <h2 className={`capitalize text-2xl font-semibold`}>
          {activeTab} crypto
        </h2>

        {step === 1 ? (
          <div className=" flex items-center justify-center">
            <div className="flex bg-greyBg2 rounded-full gap-1">
              <button
                onClick={() => setActiveTab("buy")}
                className={`
                                "px-6 py-2 w-16 cursor-pointer text-center rounded-full text-sm font-medium transition-all duration-200"
                                ${activeTab === "buy" ? "bg-primary text-white shadow-sm" : "text-fade"}
                            `}
              >
                Buy
              </button>

              <button
                onClick={() => setActiveTab("sell")}
                className={`"px-6 py-2 w-16 cursor-pointer rounded-full text-sm font-medium transition-all duration-200"
                                ${activeTab === "sell" ? "bg-primary text-white shadow-sm" : "text-fade"}
                            `}
              >
                Sell
              </button>
            </div>
          </div>
        ) : step === 3 ? (
          <button
            onClick={handleCancel}
            className={`text-accent1 hover:text-accent1/80 font-semibold hover:underline cursor-pointer transition-colors`}
          >
            New Transaction
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className={`text-red hover:underline cursor-pointer`}
          >
            Cancel order
          </button>
        )}
      </div>

      {/*description*/}
      {step > 1 && <p className="mt-4 mb-5 whitespace-pre-line">{description()}</p>}
    </div>
  );
}

export default TradeStepDisplayHeading;
