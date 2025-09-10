import EmptyTransaction from "./EmptyTransaction.tsx";
import type {TradeData} from "../../types/dashboard.types.ts";
import DashboardDataUI from "./DashboardDataUI.tsx";
import TokenBTC from "../../assets/icons/btc_icon.svg";
import TokenUSDT from "../../assets/icons/cryptocurrency-color_usdt.svg"
import OrderIcon from "../../assets/icons/fluent_tag-multiple-16-filled.svg";
import EmptyPendingTransaction from "./EmptyPendingTransaction.tsx";
import {TransactionDashboard} from "./TransactionHistory/TransactionDashboard.tsx";

export default function DashboardContent(){
    const transactionHistory = ["data"]
    const pendingTransaction = []

    const BTCData: TradeData[] = [
        {
            title: "BTC Bought",
            value: 0.0015
        },
        {
            title: "BTC Sold",
            value: 0.025
        }
    ]

    const USDTData: TradeData[] = [
        {
            title: "USDT Bought",
            value: 120
        },
        {
            title: "USDT Sold",
            value: 500
        }
    ]

    const OrderData: TradeData[] = [
        {
            title: "Total Orders",
            value: '$ 625'
        },
    ]

    if(transactionHistory.length === 0){
        return(
            <EmptyTransaction />
        )
    }

    return (
        <div className="max-w-7xl mx-auto md:-mt-10 px-3 md:px-0 space-y-10">
            {/*Overview*/}
            <div className="grid md:grid-cols-3 gap-5">
                <DashboardDataUI imgSrc={TokenBTC} Data={BTCData} />
                <DashboardDataUI imgSrc={TokenUSDT} Data={USDTData} />
                <DashboardDataUI imgSrc={OrderIcon} Data={OrderData} />
            </div>

            {/*Pending Transaction*/}
            { pendingTransaction.length > 0 && <div></div>}
            {pendingTransaction.length === 0 && <EmptyPendingTransaction />}

            <TransactionDashboard />
        </div>
    )
}