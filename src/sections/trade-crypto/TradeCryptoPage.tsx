import Navbar from "../../components/global/navbar/Navbar.tsx";
import Footer from "../../components/global/Footer.tsx";
import TradeCryptoLayout from "./TradeCryptoLayout.tsx";
import { useSearch } from "@tanstack/react-router";

type tradeType = "buy" | "sell";


export default function TradeCryptoPage() {
    const searchParams: {option: string, currency: string, token: string} = useSearch({ strict: false });
    const { option, currency, token } = searchParams;

    return (
        <div className={`space-y-20`}>
            <Navbar />
            <TradeCryptoLayout option={option as tradeType} currency={currency} token={token} />
            <Footer />
        </div>
    )
}