import { useState } from "react";
import { createPortal } from "react-dom";
import { useTradeCryptoCurrenciesButton } from "../../../hooks/components/useTradeCryptoCurrenciesButton.ts";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import TradeModal from "./TradeModal.tsx";

interface BadgeGridProps {
  label: string;
  items: SupportedCryptoOrCurrencyResponse[] | undefined;
}

const BadgeGrid = ({ label, items }: BadgeGridProps) => (
  <div className="flex flex-col gap-2 pointer-events-none">
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
    {!items || items.length === 0 ? (
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 w-[68px] h-[72px] rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    ) : (
      <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 flex flex-col items-center justify-center w-[68px] py-3 px-1 rounded-xl border border-gray-200 bg-gray-50 gap-1.5"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {item.logoUrl ? (
                <img src={item.logoUrl} alt={item.code} className="w-7 h-7 object-contain" />
              ) : (
                <span className="text-lg font-bold text-gray-400">
                  {item.symbol?.charAt(0) || item.code?.charAt(0) || "?"}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-[#0E0F0C] leading-none">
              {item.code || item.symbol}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AppSimCard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { supportedCryptoCurrencies, supportedCurrencies } = useTradeCryptoCurrenciesButton();

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="relative bg-white rounded-t-[2rem] cursor-pointer select-none group flex flex-col"
        style={{
          width: "min(360px, calc(100vw - 48px))",
          boxShadow: "0 -4px 48px rgba(148,142,238,0.16), 0 0 24px rgba(0,0,0,0.07)",
        }}
      >
        {/* Hover ring */}
        <div className="absolute inset-0 rounded-t-[2rem] border-2 border-transparent group-hover:border-[#948EEE]/30 transition-all pointer-events-none" />

        {/* Phone notch */}
        <div className="flex justify-center pt-4 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-gray-200" />
        </div>

        <div className="px-5 pb-8 pt-2 flex flex-col gap-5">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <div className="flex-1 py-3 text-sm font-semibold text-[#0E0F0C] border-b-2 border-[#948EEE] text-center">
              🟰 Buy Crypto
            </div>
            <div className="flex-1 py-3 text-sm font-semibold text-gray-400 border-b-2 border-transparent text-center">
              ✦ Sell Crypto
            </div>
          </div>

          {/* Token badges */}
          <BadgeGrid label="Token" items={supportedCryptoCurrencies} />

          {/* Currency badges */}
          <BadgeGrid label="Currency" items={supportedCurrencies} />

          {/* Amount row — display only */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">You Pay</span>
            <div className="flex items-center gap-2 border-2 border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50">
              <span className="text-gray-400 text-sm font-medium">$</span>
              <span className="text-gray-300 font-semibold text-lg">0.00</span>
            </div>
            <div className="flex gap-2">
              {[5, 10, 50, 100].map((chip) => (
                <div
                  key={chip}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-400 text-center bg-white"
                >
                  ${chip}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            className="w-full py-3.5 rounded-2xl font-bold text-base text-white border-none pointer-events-none"
            style={{ background: "#948EEE" }}
            tabIndex={-1}
          >
            Start Trading
          </button>

          <p className="text-center text-xs text-gray-400 -mt-2">
            Tap to start a trade
          </p>
        </div>
      </div>

      {modalOpen && createPortal(
        <TradeModal onClose={() => setModalOpen(false)} />,
        document.body
      )}
    </>
  );
};

export default AppSimCard;
