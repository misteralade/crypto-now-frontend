import DetailDisplay from "./DetailDisplay.tsx";
import type {UserCryptoWalletResponse} from "../../types/response.payload.types.ts";

interface WalletDetailsProps {
    walletData: UserCryptoWalletResponse;
}

export default function WalletDetails({walletData}: WalletDetailsProps) {
    return (
        <div className={`space-y-7`}>
            <h2 className="text-2xl font-medium text-center">Confirm your Address details</h2>

            <div className="space-y-4">
                <DetailDisplay title={`Address`} value={walletData.walletAddress} />
                <DetailDisplay title={'network type'} value={walletData.network} />
            </div>
        </div>
    )
}