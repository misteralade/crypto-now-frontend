import DetailDisplay from "./DetailDisplay.tsx";
import type {UserCryptoWalletResponse} from "../../types/response.payload.types.ts";

interface WalletDetailsProps {
    walletData: UserCryptoWalletResponse;
}

const WalletDetails = ({walletData}: WalletDetailsProps) => {
    return (
        <div className={`space-y-7`}>
            <h2 className="text-2xl font-medium text-center">Confirm your Wallet details</h2>

            <div className="space-y-4">
                <DetailDisplay title={`Wallet address`} value={walletData.walletAddress} />
                <DetailDisplay title={'network type'} value={walletData.network} />
            </div>
        </div>
    )
}

export default WalletDetails;