import {useNavigate} from "@tanstack/react-router";
import {useCryptoQuery} from "../../queries/crypto.query.ts";
import {useCurrencyQuery} from "../../queries/currency.query.ts";
import {useEffect, useState} from "react";
import {ROUTES} from "../../util/constants.util.ts";

export const useTradeCryptoCurrenciesButton = () => {
  const navigate = useNavigate();
  const { supportedCryptoCurrencies, loadingSupportedCrypto } =
    useCryptoQuery();
  const { supportedCurrencies, loadingSupportedCurrencies } =
    useCurrencyQuery();
  
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [supportedCurrency, setSupportedCurrency] = useState("");
  const [selectedAction, setSelectedAction] = useState<"BUY" | "SELL">("BUY");
  
  useEffect(() => {
    if (supportedCryptoCurrencies && supportedCryptoCurrencies.length > 0) {
      setSelectedCrypto(supportedCryptoCurrencies[0].id);
    }
  }, [loadingSupportedCrypto, supportedCryptoCurrencies]);
  
  useEffect(() => {
    if (supportedCurrencies && supportedCurrencies.length > 0) {
      setSupportedCurrency(supportedCurrencies[0].id);
    }
  }, [loadingSupportedCurrencies, supportedCurrencies]);
  
  const handleTradeCrypto = () => {
    navigate({
      to: `${ROUTES.TRADE_CRYPTO}?option=${selectedAction.toLowerCase()}&currency=${supportedCurrency}&token=${selectedCrypto}`,
    });
  };
  
  return {
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
  }
}