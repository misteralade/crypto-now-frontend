import type {ReactNode} from "react";

export interface TradeStep {
    id: number;
    heading: string;
    description: string;
}

export type TradeType = "buy" | "sell";

export interface AdditionalInfo {
    title: string;
    value: string;
}

export interface TradeAdditionalInfoInterface {
    title: string;
    value: string | ReactNode;
}

export interface BankDetailsData {
    bankName: string
    accountName: string
    accountNumber: string
}

export interface WalletDetailsData {
    coinType: string
    walletAddress: string
    networkType: string
}