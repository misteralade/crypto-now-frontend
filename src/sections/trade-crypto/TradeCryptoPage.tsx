import Navbar from "../../components/global/navbar/Navbar.tsx";
import Footer from "../../components/global/Footer.tsx";
import TradeCryptoLayout from "./TradeCryptoLayout.tsx";
import { useSearch } from "@tanstack/react-router";

type tradeType = "buy" | "sell";


export default function TradeCryptoPage() {
    const searchParams: {option?: string, currency: string, token: string} = useSearch({ strict: false });
    const { option: routeOption, currency, token } = searchParams;

    const option: tradeType = (routeOption?.toLowerCase() === 'sell' ? 'sell' : 'buy') as tradeType;

    return (
        <div className={`space-y-10 md:space-y-20`}>
            <Navbar />
            <TradeCryptoLayout option={option} currency={currency} token={token} />
            <Footer />
        </div>
    )
}