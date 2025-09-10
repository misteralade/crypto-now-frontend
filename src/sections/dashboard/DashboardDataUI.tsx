import type {TradeData} from "../../types/dashboard.types.ts";

interface DashboardDataUIProps {
    imgSrc: string;
    Data: TradeData[];
}

export default function DashboardDataUI({imgSrc, Data}: DashboardDataUIProps) {
    return(
        <div className={`bg-dataColum rounded-2xl p-5 flex items-center gap-3 border border-border`}>
            <img src={imgSrc} alt="data" className={`w-10 h-10 block`} />
            {Data.map((item, index) => (
                <div key={index} className={`flex flex-col gap-1`}>
                    <p className={`text-sm text-desc font-semibold`}>{item.title}</p>
                    <h4 className={`text-black text-2xl font-medium`}>{item.value}</h4>
                </div>
            ))}
        </div>
    )
}