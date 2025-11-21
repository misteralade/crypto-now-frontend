import { Fragment } from "react";
import Navbar from "../../components/global/navbar/Navbar.tsx";
import HeroSection from "./HeroSection.tsx";
import InstantTradeSection from "./InstantTradeSection.tsx";
import StepsSection from "./StepsSection.tsx";
import WhyCryptoNow from "./WhyCryptoNow.tsx";
import AllInOne from "./AllInOne.tsx";
import Testimonials from "./Testimonials.tsx";
import CustomButton from "../../components/global/Button.tsx";
import Footer from "../../components/global/Footer.tsx";
import FAQs from "./FAQs.tsx";
import {useTradeCryptoCurrenciesButton} from "../../hooks/components/useTradeCryptoCurrenciesButton.ts";

const HomePage = () => {
  const {
    // Values
    supportedCryptoCurrencies,
    supportedCurrencies,
    selectedCrypto,
    supportedCurrency,
    selectedAction,
    
    
    // Functions
    setSelectedCrypto,
    setSupportedCurrency,
    setSelectedAction,
    handleTradeCrypto,
  } = useTradeCryptoCurrenciesButton()

  return (
    <Fragment>
      <div>
        <Navbar />

        <HeroSection tradeCrypto={handleTradeCrypto} />

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

        <StepsSection tradeCrypto={handleTradeCrypto} />

        <WhyCryptoNow />

        <AllInOne tradeCrypto={handleTradeCrypto} />

        <Testimonials />

        <FAQs />

        <div className="max-w-[960px] my-20 mx-auto text-center">
          <div className="text-5xl sm:text-7xl md:tex-8xl lg:text-9xl font-semibold">
            Your crypto,
          </div>

          <div className="text-5xl sm:text-7xl md:tex-8xl lg:text-9xl text-[#BDBDBD] font-semibold md:-mt-4 mb-6">
            your way
          </div>

          <CustomButton
            onClick={handleTradeCrypto}
            buttonText="Buy & sell crypto now"
          />
        </div>

        <Footer />
      </div>
    </Fragment>
  );
};

export default HomePage;
