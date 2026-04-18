import CustomButton from "../../global/Button.tsx";
import type {SupportedCryptoOrCurrencyResponse} from "../../../types/response.payload.types.ts";
import CurrencySelector from "../../global/CurrencySelector.tsx";
import { useState } from "react";
import {useNavigate} from "@tanstack/react-router";
import { ROUTES} from "../../../util/constants.util.ts";

interface InstantTradeSectionProps {
  cryptoCurrencies: Array<SupportedCryptoOrCurrencyResponse> | undefined;
  currencies: Array<SupportedCryptoOrCurrencyResponse> | undefined;
  selectedCryptoId: string;
  selectedCurrencyId: string;
  selectedAction: 'BUY' | 'SELL';
  onCryptoChange: (cryptoId: string) => void;
  onCurrencyChange: (currencyId: string) => void;
  onActionChange: (action: 'BUY' | 'SELL') => void;
}

const  InstantTradeSection = ({ cryptoCurrencies, currencies, selectedCryptoId, selectedCurrencyId, selectedAction, onCryptoChange, onCurrencyChange, onActionChange }: InstantTradeSectionProps) => {
  const navigate = useNavigate();

  const [fiatAmount, setFiatAmount] = useState(0)

  
  const handleSubmit = () => {
    navigate({ to: `${ROUTES.TRADE_CRYPTO}?option=${selectedAction.toLowerCase()}&currency=${selectedCurrencyId}&token=${selectedCryptoId}&amount=${fiatAmount}` });
  }

  
  return (
    <section className="max-md:px-4">
      <div className="max-w-6xl mx-auto mt-24">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal md:tracking-[1px] text-[#0E0F0C] mb-3">
            Instant trade as a Guest
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            Buy and sell crypto instantly without signing up. Fast, secure, and hassle-free.
          </p>
        </div>

        {/* Trading Form */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-5xl mx-auto">
          {/* I want to text */}
          <span className="text-black font-normal text-base">I want to</span>

          {/* First bordered container: Buy + Bitcoin */}
          <div className="flex items-center max-md:w-full bg-white rounded-[100px] border border-[#ECECEC] p-2">
            {/* Buy dropdown */}
            <div className="flex items-center gap-3 px-4 py-2">
              <select
                value={selectedAction}
                onChange={(e) => onActionChange(e.target.value as 'BUY' | 'SELL')}
                className="bg-transparent border-none outline-none font-medium text-gray-900 cursor-pointer"
              >
                <option value="BUY">Buy</option>
                <option value='SELL'>Sell</option>
              </select>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300"></div>

            {/* Crypto Currency Selector */}
            <div className="flex items-center gap-3 px-4 py-2">
              <CurrencySelector
                currencies={cryptoCurrencies}
                selectedCurrency={cryptoCurrencies ? cryptoCurrencies?.find(c => c.id === selectedCryptoId) : undefined}
                handleSelectedCurrencyIdChange={onCryptoChange}
              />
            </div>
          </div>

          {/* For text */}
          <span className="text-black font-normal text-base">for</span>

          {/* Second bordered container: Amount + Naira */}
          <div className="flex items-center bg-white rounded-[100px] border border-[#ECECEC] p-2">
            {/* Amount input */}
            <div className="px-4 py-2">
              <input
                type="text"
                placeholder="Amount"
                className="bg-transparent border-none outline-none font-medium text-gray-900 placeholder-gray-500 w-[200px]"
                onChange={(e) => setFiatAmount(Number(e.target.value))}
              />
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300"></div>

            {/* Naira dropdown */}
            <div className="flex items-center gap-3 px-4 py-2">
              <CurrencySelector
                currencies={currencies}
                selectedCurrency={currencies ? currencies?.find(c => c.id === selectedCurrencyId) : undefined}
                handleSelectedCurrencyIdChange={onCurrencyChange}
              />
            </div>
          </div>

          {/* Buy Button */}
          <CustomButton onClick={handleSubmit} buttonText={`${selectedAction === "BUY" ? "Buy" : "Sell"} crypto now`} />
        </div>
      </div>
    </section>
  );
}

export default InstantTradeSection;
