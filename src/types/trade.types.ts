import type {ReactNode} from "react";

// Interfaces
export interface TradeCryptoPageProps {
    tradeType: TradeType;
    step: number;
    currency: string;
    token: string;
    setStep: (value: number) => void
    activeTab: TradeType;
    setActiveTab: (value: TradeType) => void;
}

export interface TradeStep {
    id: number;
    heading: string;
    description: string;
}

export type TradeType = "buy" | "sell";

export interface TradeAdditionalInfoInterface {
    title: string;
    value: string | ReactNode;
}

export interface WalletDetailsData {
    coinType: string
    walletAddress: string
    networkType: string
}