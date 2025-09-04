import type {TradeStep} from "../../types/trade.types.ts";

interface TradeStepProps {
    step: number;
}

export default function TradeSteps({ step }: TradeStepProps) {
    const TradeSteps: TradeStep[] = [
        {
            id: 1,
            heading: "Transaction Info",
            description: "Choose your preferred action, and input amount",
        },
        {
            id: 2,
            heading: "Make payment",
            description: "Make the transfer to provided account or address",
        },
        {
            id: 3,
            heading: "Confirm payment",
            description: "Confirm when you receive your payment,",
        }
    ]

    return (
        <div className={`space-y-5 flex justify-between md:block`}>
            {TradeSteps.map((item, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center md:items-start gap-2 space-y-1 md:space-y-0`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold 
                         ${step >= item.id ? "bg-accent1 text-white": "bg-fadeBg text-fadeText"}`}
                    >
                        {item.id}
                    </div>

                    <div className={`basis-4/5`}>
                        <h2 className={`text-black font-semibold`}>{item.heading}</h2>
                        <p className={`text-body text-sm`}>{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}