import {useNavigate} from "@tanstack/react-router";
import {useCryptoQuery} from "../../queries/crypto.query.ts";
import {useCurrencyQuery} from "../../queries/currency.query.ts";
import {useState} from "react";
import type {TradeOption} from "../../types/navbar.types.ts";

export const useNavbarDropdown = (handleMenuItemClick: (() => void) | undefined, isMobile: boolean | undefined) => {
  const navigate = useNavigate()
  const { supportedCryptoCurrencies } = useCryptoQuery();
  const { supportedCurrencies } = useCurrencyQuery();
  const [activeDropOption, setActiveDropOption] = useState<TradeOption>("")
  const [dropStep, setDropStep] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [showTradeDrop, setShowTradeDrop] = useState<boolean>(false);

  const handleDropClick = (option: TradeOption) => {
    if (activeDropOption === option) {
      setShowTradeDrop(!showTradeDrop);
    } else {
      setActiveDropOption(option);
      setShowTradeDrop(true);
      setDropStep(1);
    }

    setSelectedToken("");
  }

  const handleNextStep = (token: string) => {
    setSelectedToken(token);
    setDropStep(2);
  }

  const handleRouting = (currency: string) => {
    navigate({to: `/trade-crypto?option=${activeDropOption}&currency=${currency}&token=${selectedToken}`})

    if(isMobile && handleMenuItemClick){
      handleMenuItemClick();
    }
  }

  return {
    // Values
    supportedCurrencies,
    supportedCryptoCurrencies,
    dropStep,
    activeDropOption,
    showTradeDrop,

    // Functions
    handleDropClick,
    handleNextStep,
    handleRouting,
  }
}