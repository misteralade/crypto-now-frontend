import {useNavigate} from "@tanstack/react-router";
import {useCryptoQuery} from "../../queries/crypto.query.ts";
import {useCurrencyQuery} from "../../queries/currency.query.ts";
import {useEffect, useState} from "react";
import {LOCAL_STORAGE_KEYS, ROUTES} from "../../util/constants.util.ts";
import { useUserQuery } from "../../queries/user.query.ts";
import { type RootState, store } from "../../store.ts";

export const useTradeCryptoCurrenciesButton = () => {
  const navigate = useNavigate();
  useUserQuery();
  const { supportedCryptoCurrencies, loadingSupportedCrypto } = useCryptoQuery();
  const { supportedCurrencies, loadingSupportedCurrencies } = useCurrencyQuery();
  const rootState = store.getState() as RootState;
  
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [supportedCurrency, setSupportedCurrency] = useState("");
  const [selectedAction, setSelectedAction] = useState<"BUY" | "SELL">("BUY");
  const [isRegisteredUser, setIsRegisteredUser] = useState(false);
  
  useEffect(() => {
    if (supportedCryptoCurrencies && supportedCryptoCurrencies.length > 0) {
      setSelectedCrypto(supportedCryptoCurrencies[0].id);
    }
  }, [loadingSupportedCrypto, supportedCryptoCurrencies]);

  useEffect(() => {
    if ((rootState.user.trade.anonymous.isAnonymousUser !== undefined && rootState.user.trade.anonymous.isAnonymousUser) || (localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN) === undefined)) {
      setIsRegisteredUser(true);
    }
  }, [rootState.user.trade.anonymous.isAnonymousUser])
  
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
    isRegisteredUser,
    
    // Functions
    setSelectedCrypto,
    setSupportedCurrency,
    setSelectedAction,
    handleTradeCrypto,
  }
}