import {useState} from "react";
import PublicNavbar from "../components/global/navbar/PublicNavbar.tsx";
import FooterNew from "../components/pages/homepage/FooterNew.tsx";
import {useCryptoQuery} from "../queries/crypto.query.ts";
import {formatForDisplayLocalized, formatCompact} from "../util/asset-precision.ts";
import type {SupportedCryptoOrCurrencyResponse} from "../types/response.payload.types.ts";
import {LoadingSpinner} from "../components/global/LoadingSpinner.tsx";

const RatePage = () => {
  const { supportedCryptoCurrencies, loadingSupportedCrypto } = useCryptoQuery();
  const [isRegistered, setIsRegistered] = useState(false)

  return (
    <div style={{ background: "#FAF9F7", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <PublicNavbar />

      <main className="w-full md:w-[90%] 2xl:max-w-7xl mx-auto px-4 md:px-0 mt-[34px] mb-[30px] text-lg text-[#454745] flex flex-col gap-x-8 lg:gap-[51px] md:mt-24">
        <section className="w-full px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0E0F0C] mb-4">
              Cryptocurrency Rates
            </h1>
            <p className="text-lg md:text-xl text-[#454745] max-w-2xl mx-auto">
              Real-time buy and sell rates for all supported cryptocurrencies
            </p>
          </div>
        </section>

        {/* Controls Section */}
        <section className="w-full pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center bg-white rounded-2xl p-6 shadow-sm border border-[#EEEEEE]">
              {/* User Type Toggle */}
              <div className="flex items-center gap-3 bg-[#F7F7F9] rounded-full p-1">
                <button
                  onClick={() => setIsRegistered(false)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                    !isRegistered
                      ? "bg-white text-[#948EEE] shadow-sm"
                      : "text-[#6B6E6B] hover:text-[#0E0F0C] hover:cursor-pointer"
                  }`}
                >
                  Guest
                </button>
                <button
                  onClick={() => setIsRegistered(true)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                    isRegistered
                      ? "bg-white text-[#948EEE] shadow-sm"
                      : "text-[#6B6E6B] hover:text-[#0E0F0C] hover:cursor-pointer"
                  }`}
                >
                  Registered
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Info Banner */}
        {!isRegistered && (
          <section className="pb-8 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg, #948EEE, #575AE5)" }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Get Higher Limits!</h3>
                    <p className="text-white/90 text-sm">
                      Register now to enjoy lower minimum trade amounts and higher maximum limits.
                      Plus get access to exclusive features and better rates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Rates Table */}
        <section className="pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-[#EEEEEE] overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F7F7F9] border-b border-[#EEEEEE]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#454745] uppercase tracking-wider">
                      Cryptocurrency
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[#454745] uppercase tracking-wider">
                      We Sell At
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[#454745] uppercase tracking-wider">
                      We Buy At
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[#454745] uppercase tracking-wider">
                      Min Trade
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-[#454745] uppercase tracking-wider">
                      Max Trade
                    </th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEEEEE]">
                  {!loadingSupportedCrypto && supportedCryptoCurrencies ? supportedCryptoCurrencies?.map((crypto: SupportedCryptoOrCurrencyResponse) => (
                    <tr key={crypto.id} className="hover:bg-[#F7F7F9] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                            <img src={crypto.logoUrl} alt={crypto.name} />
                          </div>
                          <div>
                            <div className="font-semibold text-[#0E0F0C]">{crypto.name}</div>
                            <div className="text-sm text-[#9A9A9A]">{crypto.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="font-semibold text-[#0E0F0C]">
                          ₦{formatForDisplayLocalized(Number(crypto.buyRate), "NGN")}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="font-semibold text-[#0E0F0C]">
                          ₦{formatForDisplayLocalized(Number(crypto.sellRate), "NGN")}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="text-[#454745]">
                          {formatCompact(isRegistered ? Number(crypto.minTransactionLimit) : Number(crypto.minTradeAmountForAnonymous), crypto.symbol, 10)} {crypto.symbol}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="text-[#454745]">
                          {formatCompact(isRegistered ? Number(crypto.maxTransactionLimit) : Number(crypto.maxTradeAmountForAnonymous), crypto.symbol, 10)} {crypto.symbol}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <LoadingSpinner size={"lg"} message="Loading..." />
                  )}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-[#EEEEEE]">
                {!loadingSupportedCrypto && supportedCryptoCurrencies ? supportedCryptoCurrencies?.map((crypto: SupportedCryptoOrCurrencyResponse) => (
                  <div key={crypto.id} className="p-4 hover:bg-[#F7F7F9] transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          <img src={crypto.logoUrl} alt={crypto.name} />
                        </div>
                        <div>
                          <div className="font-semibold text-[#0E0F0C]">{crypto.name}</div>
                          <div className="text-sm text-[#9A9A9A]">{crypto.symbol}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-[#9A9A9A] mb-1">We Sell At</div>
                        <div className="font-semibold text-[#0E0F0C]">₦{formatForDisplayLocalized(Number(crypto.buyRate), "NGN")}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#9A9A9A] mb-1">We Buy At</div>
                        <div className="font-semibold text-[#0E0F0C]">₦{formatForDisplayLocalized(Number(crypto.sellRate), "NGN")}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#9A9A9A] mb-1">Min Trade (token)</div>
                        <div className="text-[#454745]">
                          {formatCompact(isRegistered ? Number(crypto.minTransactionLimit) : Number(crypto.minTradeAmountForAnonymous), crypto.symbol, 10)} {crypto.symbol}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#9A9A9A] mb-1">Max Trade (token)</div>
                        <div className="text-[#454745]">
                          {formatCompact(isRegistered ? Number(crypto.maxTransactionLimit) : Number(crypto.maxTradeAmountForAnonymous), crypto.symbol, 10)} {crypto.symbol}
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <LoadingSpinner size={"sm"} message="Loading..." />
                )}
              </div>
            </div>
          
          
          </div>
        </section>
      </main>

      <FooterNew />
    </div>
  )
}

export default RatePage;
