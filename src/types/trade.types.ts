import type {ReactNode} from "react";

// Interfaces
export interface TradeCryptoPageProps {
    step: number;
    currency: string;
    token: string;
    setStep: (value: number) => void
    activeTab: TradeType;
    setActiveTab: (value: TradeType) => void;
    sessionId?: string;
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
