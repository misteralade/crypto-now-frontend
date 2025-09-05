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
        <div className={`space-y-5 flex justify-between md:block px-3 md:px-0`}>
            {TradeSteps.map((item, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center justify-center md:items-start gap-2 space-y-1 md:space-y-0`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold 
                         ${step >= item.id ? "bg-accent1 text-white": "bg-fadeBg text-fadeText"}`}
                    >
                        {item.id}
                    </div>

                    <div className={`basis-4/5 text-center md:text-left`}>
                        <h2 className={`text-black font-semibold text-xs md:text-base`}>{item.heading}</h2>
                        <p className={`text-body text-[8px] md:text-sm`}>{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}