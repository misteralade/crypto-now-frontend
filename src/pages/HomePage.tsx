import { Fragment, useEffect, useState } from "react";
import Navbar from "../components/global/navbar/Navbar.tsx";
import HeroSection from "../components/pages/homepage/HeroSection.tsx";
import InstantTradeSection from "../components/pages/homepage/InstantTradeSection.tsx";
import StepsSection from "../components/pages/homepage/StepsSection.tsx";
import WhyCryptoNow from "../components/pages/homepage/WhyCryptoNow.tsx";
import AllInOne from "../components/pages/homepage/AllInOne.tsx";
import Testimonials from "../components/pages/homepage/Testimonials.tsx";
import Footer from "../components/global/Footer.tsx";
import FAQs from "../components/pages/homepage/FAQs.tsx";
import {useTradeCryptoCurrenciesButton} from "../hooks/components/useTradeCryptoCurrenciesButton.ts";
import { userServiceApi } from "../api/user.api.ts";
import { LOCAL_STORAGE_KEYS } from "../util/constants.util.ts";

const HomePage = () => {
  const {
    // Values
    supportedCryptoCurrencies,
    supportedCurrencies,
    selectedCrypto,
    supportedCurrency,
    selectedAction,
    isRegisteredUser,
    
    
    // Functions
    setSelectedCrypto,
    setSupportedCurrency,
    setSelectedAction,
    handleTradeCrypto,
  } = useTradeCryptoCurrenciesButton()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication status using pingUser
  useEffect(() => {
    const checkAuthentication = async () => {
      const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      
      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const { success } = await userServiceApi.pingUser();
        setIsAuthenticated(success);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <Fragment>
      <div>
        <Navbar />

        <HeroSection tradeCrypto={handleTradeCrypto} isAuthenticated={isAuthenticated} />

        {isRegisteredUser && (
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
        )}

        <StepsSection tradeCrypto={handleTradeCrypto} isAuthenticated={isAuthenticated} />

        <WhyCryptoNow />

        <AllInOne tradeCrypto={handleTradeCrypto} isAuthenticated={isAuthenticated} />

        <Testimonials />

        <FAQs />

        <div className="max-w-[960px] my-20 mx-auto text-center">
          <div className="text-5xl sm:text-7xl md:tex-8xl lg:text-9xl font-semibold">
            Your crypto,
          </div>

          <div className="text-5xl sm:text-7xl md:tex-8xl lg:text-9xl text-[#BDBDBD] font-semibold md:-mt-4 mb-6">
            your way
          </div>
        </div>

        <Footer />
      </div>
    </Fragment>
  );
};

export default HomePage;
