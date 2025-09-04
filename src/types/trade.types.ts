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