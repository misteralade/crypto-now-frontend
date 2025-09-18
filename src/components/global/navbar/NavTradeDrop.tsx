import type {MouseEvent} from "react";
import type {
    SupportedCryptoOrCurrencyResponse,
} from "../../../types/response.api.types.ts";

interface NavTokenTradeProps {
    items: SupportedCryptoOrCurrencyResponse[];
    action: (value: string) => void;
    isMobile?: boolean;
}

export default function NavTradeDrop({items, action, isMobile}: NavTokenTradeProps) {
    const handleClick = (selectedItem: string, e:   MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        setTimeout(() => {
            action(selectedItem);
        }, 50);
    }

    const positionClasses = isMobile
        ? "absolute left-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        : "bg-white border border-gray-200 absolute w-32 max-h-52 top-0 -right-36 rounded-lg shadow-lg z-20";

    return(
        <div className={`${positionClasses} px-1 py-2`}>
            {items.map((item, index) => (
                <button key={index} className="flex items-center w-full gap-2
                justify-center py-2 rounded-lg hover:bg-accent/50"
                        onClick={(e: MouseEvent<HTMLButtonElement>) => handleClick(item.id, e)}
                >
                    <img src={item.logoUrl} alt={item.logoUrl} width={25} height={25}/>
                    <span className="text-lg font-medium">{item.code || item.symbol}</span>
                </button>
            ))}
        </div>
    )
}