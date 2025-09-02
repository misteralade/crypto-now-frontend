import type {TradeParamDisplay} from "../../../types/global.type.ts";

interface NavTokenTradeProps {
    items: TradeParamDisplay[];
    action: (value: string) => void;
}

export default function NavTradeDrop({items, action}: NavTokenTradeProps) {
    const handleClick = (selectedItem: string) => {
        setTimeout(() => {
            action(selectedItem);
        }, 50);
    }

    return(
        <div className={`bg-grey absolute w-28 max-h-52 top-0 -right-32 rounded-lg px-1 py-2`}>
            {items.map((item, index) => (
                <button key={index} className="flex items-center w-full gap-2
                justify-center py-2 rounded-lg hover:bg-accent/50"
                        onClick={() => handleClick(item.name)}
                >
                    {item.symbol}
                    <span className="text-lg font-medium">{item.name}</span>
                </button>
            ))}
        </div>
    )
}