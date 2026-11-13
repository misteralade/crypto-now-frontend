import {useNavigate} from "@tanstack/react-router";
import {useCryptoQuery} from "../../queries/crypto.query.ts";
import {useCurrencyQuery} from "../../queries/currency.query.ts";
import {useEffect, useState} from "react";
import {ROUTES} from "../../util/constants.util.ts";

export const useTradeCryptoCurrenciesButton = () => {
  const navigate = useNavigate();
  const { supportedCryptoCurrencies, loadingSupportedCryptocurrencies, errorSupportedCryptocurrencies } = useCryptoQuery();
  const { supportedCurrencies, loadingSupportedCurrencies } = useCurrencyQuery();
  
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [supportedCurrency, setSupportedCurrency] = useState("");
  const [selectedAction, setSelectedAction] = useState<"BUY" | "SELL">("BUY");
  
  useEffect(() => {
    if (supportedCryptoCurrencies && supportedCryptoCurrencies.length > 0) {
      setSelectedCrypto(supportedCryptoCurrencies[0].id);
    }
  }, [loadingSupportedCryptocurrencies, supportedCryptoCurrencies]);

  useEffect(() => {
    if (supportedCurrencies && supportedCurrencies.length > 0) {
      setSupportedCurrency(supportedCurrencies[0].id);
    }
  }, [loadingSupportedCurrencies, supportedCurrencies]);
  
  const handleTradeCrypto = () => {
    navigate({
      to: ROUTES.DASHBOARD,
    });
  };
  
  return {
    // Values
    supportedCryptoCurrencies,
    loadingSupportedCrypto: loadingSupportedCryptocurrencies,
    errorSupportedCrypto: errorSupportedCryptocurrencies,
    supportedCurrencies,
    loadingSupportedCurrencies,
    selectedCrypto,
    supportedCurrency,
    selectedAction,
    // Functions
    setSelectedCrypto,
    setSupportedCurrency,
    setSelectedAction,
    handleTradeCrypto,
  }
}
