import type {WalletDetailsData} from "../../types/trade.types.ts";
import DetailDisplay from "./DetailDisplay.tsx";

interface WalletDetailsProps {
    walletData: WalletDetailsData;
}

export default function WalletDetails({walletData}: WalletDetailsProps) {
    return (
        <div className={`space-y-7`}>
            <h2 className="text-2xl font-medium text-center">Confirm your Address details</h2>

            <div className="space-y-4">
                <DetailDisplay title={`Address`} value={walletData.walletAddress} />
                <DetailDisplay title={'coin type'} value={walletData.coinType} />
                <DetailDisplay title={'network type'} value={walletData.networkType} />
            </div>
        </div>
    )
}