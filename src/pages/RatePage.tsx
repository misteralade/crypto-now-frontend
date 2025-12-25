import {Fragment, useState} from "react";
import Navbar from "../components/global/navbar/Navbar.tsx";
import Footer from "../components/global/Footer.tsx";
import {useCryptoQuery} from "../queries/crypto.query.ts";
import {convertToMillify, formatCurrency} from "../util/index.util.ts";
import type {SupportedCryptoOrCurrencyResponse} from "../types/response.payload.types.ts";
import {LoadingSpinner} from "../components/global/LoadingSpinner.tsx";

const RatePage = () => {
  const { supportedCryptoCurrencies, loadingSupportedCrypto } = useCryptoQuery();
  const [isRegistered, setIsRegistered] = useState(false)

  return (
    <Fragment>
      <Navbar />
      
      <main className="w-full md:w-[90%] 2xl:max-w-7xl mx-auto px-4 md:px-0 mt-[34px] mb-[30px] text-lg text-[#454745] flex flex-col gap-x-8 lg:gap-[51px] md:mt-24">
        <section className="w-full px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cryptocurrency Rates
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Real-time buy and sell rates for all supported cryptocurrencies
            </p>
          </div>
        </section>
        
        {/* Controls Section */}
        <section className="w-full pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {/* User Type Toggle */}
              <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setIsRegistered(false)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                    !isRegistered
                      ? "bg-white text-[#6366f1] shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:cursor-pointer"
                  }`}
                >
                  Guest
                </button>
                <button
                  onClick={() => setIsRegistered(true)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                    isRegistered
                      ? "bg-white text-[#6366f1] shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:cursor-pointer"
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
              <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-2xl p-6 text-white">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Cryptocurrency
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      We Sell At
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      We Buy At
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Min Trade
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Max Trade
                    </th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {!loadingSupportedCrypto && supportedCryptoCurrencies ? supportedCryptoCurrencies?.map((crypto: SupportedCryptoOrCurrencyResponse) => (
                    <tr key={crypto.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                            <img src={crypto.logoUrl} alt={crypto.name} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{crypto.name}</div>
                            <div className="text-sm text-gray-500">{crypto.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(Number(crypto.buyRate))}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(Number(crypto.sellRate))}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="text-gray-600">
                          {convertToMillify(isRegistered ? Number(crypto.minTransactionLimit) : Number(crypto.minTradeAmountForAnonymous), 10)}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="text-gray-600">
                          {convertToMillify(isRegistered ? Number(crypto.maxTransactionLimit) : Number(crypto.maxTradeAmountForAnonymous), 10)}
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
              <div className="lg:hidden divide-y divide-gray-200">
                {!loadingSupportedCrypto && supportedCryptoCurrencies ? supportedCryptoCurrencies?.map((crypto: SupportedCryptoOrCurrencyResponse) => (
                  <div key={crypto.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          <img src={crypto.logoUrl} alt={crypto.name} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{crypto.name}</div>
                          <div className="text-sm text-gray-500">{crypto.symbol}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">We Sell At</div>
                        <div className="font-semibold text-gray-900">{formatCurrency(Number(crypto.buyRate))}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">We Buy At</div>
                        <div className="font-semibold text-gray-900">{formatCurrency(Number(crypto.sellRate))}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Min Trade</div>
                        <div className="text-gray-600">
                          {convertToMillify(isRegistered ? Number(crypto.minTransactionLimit) : Number(crypto.minTradeAmountForAnonymous))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Max Trade</div>
                        <div className="text-gray-600">
                          {convertToMillify(isRegistered ? Number(crypto.maxTransactionLimit) : Number(crypto.maxTradeAmountForAnonymous))}
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
      
      <Footer />
    </Fragment>
  )
}

export default RatePage;