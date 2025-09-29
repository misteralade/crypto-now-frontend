import {useNavigate} from "@tanstack/react-router";
import {useCryptoQuery} from "../../queries/crypto.query.ts";
import {useCurrencyQuery} from "../../queries/currency.query.ts";
import {useState, useEffect} from "react";
import type {TradeOption} from "../../types/navbar.types.ts";

export const useNavbarDropdown = (handleMenuItemClick?: (() => void) | undefined, isMobile?: boolean | undefined) => {
    const navigate = useNavigate()
    const {supportedCryptoCurrencies} = useCryptoQuery();
    const {supportedCurrencies} = useCurrencyQuery();
    const [activeDropOption, setActiveDropOption] = useState<TradeOption>("")
    const [dropStep, setDropStep] = useState<number>(0);
    const [selectedToken, setSelectedToken] = useState<string>("");
    const [showTradeDrop, setShowTradeDrop] = useState<boolean>(false);

    useEffect(() => {
        if (supportedCryptoCurrencies?.length && !selectedToken) {
            setSelectedToken(supportedCryptoCurrencies[0].id);
        }
    }, [supportedCryptoCurrencies, selectedToken]);

    const handleDropClick = (option: TradeOption) => {
        if (activeDropOption === option) {
            setShowTradeDrop(!showTradeDrop);
        } else {
            setActiveDropOption(option);
            setShowTradeDrop(true);
            setDropStep(1);
        }

        setSelectedToken(supportedCryptoCurrencies?.[0]?.id || "");
    }

    const handleNextStep = (token: string) => {
        setSelectedToken(token);
        setDropStep(2);
    }

    const handleRouting = (currency?: string) => {
        const defaultCurrency = currency ? currency : supportedCurrencies?.[0]?.id;

        navigate({to: `/trade-crypto?option=${activeDropOption}&currency=${defaultCurrency}&token=${selectedToken}`})

        if (isMobile && handleMenuItemClick) {
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