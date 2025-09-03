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
        <div className={`space-y-5`}>
            {TradeSteps.map((item, index) => (
                <div key={index} className={`flex gap-2`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold 
                         ${step >= item.id ? "bg-accent1 text-white": "bg-fadeBg text-fadeText"}`}
                    >
                        {item.id}
                    </div>

                    <div className={`basis-3/5`}>
                        <h2 className={`text-black font-semibold`}>{item.heading}</h2>
                        <p className={`text-body text-sm`}>{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}