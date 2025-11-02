import {Fragment, useEffect, useState} from "react";
import Navbar from "../../components/global/navbar/Navbar.tsx";
import HeroSection from "./HeroSection.tsx";
import InstantTradeSection from "./InstantTradeSection.tsx";
import StepsSection from "./StepsSection.tsx";
import WhyCryptoNow from "./WhyCryptoNow.tsx";
import AllInOne from "./AllInOne.tsx";
import Testimonials from "./Testimonials.tsx";
import CustomButton from "../../components/global/Button.tsx";
import Footer from "../../components/global/Footer.tsx";
import {useCryptoQuery} from "../../queries/crypto.query.ts";
import {useCurrencyQuery} from "../../queries/currency.query.ts";
import {ROUTES} from "../../util/constants.util.ts";
import {useNavigate} from "@tanstack/react-router";

const HomePage = () => {
  const navigate = useNavigate();
  const {supportedCryptoCurrencies, loadingSupportedCrypto} = useCryptoQuery();
  const { supportedCurrencies, loadingSupportedCurrencies} = useCurrencyQuery()
  
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [supportedCurrency, setSupportedCurrency] = useState('')
  const [selectedAction, setSelectedAction] = useState<'BUY' | 'SELL'>('BUY');
  
  useEffect(() => {
    setSelectedAction('BUY')
    if (supportedCryptoCurrencies && supportedCryptoCurrencies.length > 0) {
      setSelectedCrypto(supportedCryptoCurrencies[0].id)
    }
  }, [loadingSupportedCrypto]);
  
  useEffect(() => {
    if (supportedCurrencies && supportedCurrencies.length > 0) {
      setSupportedCurrency(supportedCurrencies[0].id)
    }
  }, [loadingSupportedCurrencies]);
  
  const handleTradeCrypto = () => {
    navigate({ to: `${ROUTES.TRADE_CRYPTO}?option=${selectedAction.toLowerCase()}&currency=${supportedCurrency}&token=${selectedCrypto}` });
  }
  
  return (
    <Fragment>
      <div>
        <Navbar />
        
        <HeroSection
          tradeCrypto={handleTradeCrypto}
        />
        
        <InstantTradeSection
          cryptoCurrencies={supportedCryptoCurrencies || undefined}
          currencies={supportedCurrencies || undefined}
          selectedCryptoId={selectedCrypto}
          selectedCurrencyId={supportedCurrency}
          selectedAction={selectedAction}
          onCryptoChange={setSelectedCrypto}
          onCurrencyChange={setSupportedCurrency}
          onActionChange={setSelectedAction}
        />
        
        <StepsSection
          tradeCrypto={handleTradeCrypto}
        />
        
        <WhyCryptoNow />
        
        <AllInOne
          tradeCrypto={handleTradeCrypto}
        />
        
        <Testimonials/>
        
        <div className="max-w-[960px] my-20 mx-auto text-center">
          <div className="text-5xl sm:text-7xl md:tex-8xl lg:text-9xl font-semibold">
            Your crypto,
          </div>
          
          <div className="text-5xl sm:text-7xl md:tex-8xl lg:text-9xl text-[#BDBDBD] font-semibold md:-mt-4 mb-6">
            your way
          </div>
          
          <CustomButton onClick={handleTradeCrypto} buttonText="Buy & sell crypto now" />
        </div>
        
        <Footer />
      </div>
    </Fragment>
  )
}

export default HomePage;