import { useState } from "react";
import { useTradeCryptoCurrenciesButton } from "../../../hooks/components/useTradeCryptoCurrenciesButton.ts";
import type { SupportedCryptoOrCurrencyResponse } from "../../../types/response.payload.types.ts";
import TradeModal from "./TradeModal.tsx";

// ---- Display-only currency badge grid ----
interface BadgeGridProps {
  label: string;
  items: SupportedCryptoOrCurrencyResponse[] | undefined;
}

const BadgeGrid = ({ label, items }: BadgeGridProps) => {
  return (
    <div className="flex flex-col gap-1.5 pointer-events-none">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      {!items || items.length === 0 ? (
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-[64px] h-[68px] rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 flex flex-col items-center justify-between w-[64px] py-2 px-1 rounded-xl border border-gray-200 bg-white gap-1"
            >
              <div className="w-7 h-7 flex items-center justify-center">
                {item.logoUrl ? (
                  <img src={item.logoUrl} alt={item.code} className="w-6 h-6 object-contain" />
                ) : (
                  <span className="text-base font-bold text-gray-400">
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
};

// ---- Main display card ----
const AppSimCard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { supportedCryptoCurrencies, supportedCurrencies } = useTradeCryptoCurrenciesButton();

  return (
    <>
      {/* Clickable display card */}
      <div
        onClick={() => setModalOpen(true)}
        className="relative bg-white rounded-3xl w-[300px] p-5 flex flex-col gap-4 cursor-pointer select-none group"
        style={{ boxShadow: "0 8px 48px rgba(148,142,238,0.18), 0 2px 12px rgba(0,0,0,0.08)" }}
      >
        {/* Hover ring hint */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#948EEE]/40 transition-all pointer-events-none" />

        {/* Fake tabs — display only */}
        <div className="flex border-b border-gray-100">
          <div className="flex-1 py-2.5 text-sm font-semibold text-[#0E0F0C] border-b-2 border-[#948EEE] text-center">
            🟰 Buy Crypto
          </div>
          <div className="flex-1 py-2.5 text-sm font-semibold text-gray-400 border-b-2 border-transparent text-center">
            ✦ Sell Crypto
          </div>
        </div>

        {/* Token badges */}
        <BadgeGrid label="Token" items={supportedCryptoCurrencies} />

        {/* Currency badges */}
        <BadgeGrid label="Currency" items={supportedCurrencies} />

        {/* CTA */}
        <button
          className="w-full py-3 rounded-2xl font-bold text-base text-white border-none pointer-events-none"
          style={{ background: "#948EEE" }}
          tabIndex={-1}
        >
          Start Trading
        </button>

        {/* Click prompt */}
        <p className="text-center text-xs text-gray-400 -mt-2">
          Tap to start a trade
        </p>
      </div>

      {/* Trade modal */}
      {modalOpen && <TradeModal onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default AppSimCard;
