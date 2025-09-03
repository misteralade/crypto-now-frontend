import { createFileRoute } from "@tanstack/react-router";
import TradeCryptoPage from "../sections/trade-crypto/TradeCryptoPage.tsx";

export const Route = createFileRoute("/trade-crypto")({
    component: TradeCryptoPage,
});
