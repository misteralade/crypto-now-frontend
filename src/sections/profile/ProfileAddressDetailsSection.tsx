import { Plus } from "lucide-react"
import {CustomInput} from "../../components/global/CustomInput.tsx";
import CustomSelector from  "../../components/global/CustomSelector.tsx"

interface ProfileAddressDetailsSectionProps {
    selectedCoin: string
    walletAddress: string
    selectedNetwork: string
    onCoinChange: (value: string) => void
    onWalletAddressChange: (value: string) => void
    onNetworkChange: (value: string) => void
    onAddAddress: () => void
}

const coinOptions = [
    { id: "btc", name: "Bitcoin (BTC)", icon: "₿" },
    { id: "eth", name: "Ethereum (ETH)", icon: "Ξ" },
    { id: "usdt", name: "Tether (USDT)", icon: "₮" },
    { id: "bnb", name: "Binance Coin (BNB)", icon: "🔶" },
]

const networkOptions = [
    { id: "mainnet", name: "Mainnet" },
    { id: "testnet", name: "Testnet" },
    { id: "bep20", name: "BEP20 (BSC)" },
    { id: "erc20", name: "ERC20 (Ethereum)" },
]

export default function ProfileAddressDetailsSection({
                                                  selectedCoin,
                                                  walletAddress,
                                                  selectedNetwork,
                                                  onCoinChange,
                                                  onWalletAddressChange,
                                                  onNetworkChange,
                                                  onAddAddress,
                                              }: ProfileAddressDetailsSectionProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-base font-medium text-gray-900">Wallet details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <CustomSelector
                    label="Select coin type"
                    options={coinOptions}
                    value={selectedCoin}
                    onValueChange={onCoinChange}
                />
                <CustomInput
                    label="Wallet address"
                    type="text"
                    value={walletAddress}
                    onChange={(e) => onWalletAddressChange(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <CustomSelector
                    label="Network type"
                    placeholder="Select option"
                    options={networkOptions}
                    value={selectedNetwork}
                    onValueChange={onNetworkChange}
                />
                <button
                    onClick={onAddAddress}
                    className="flex items-center gap-2 text-primary font-medium text-sm hover:underline"
                >
                    Add wallet
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
