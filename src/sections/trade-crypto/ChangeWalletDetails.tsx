import { useState } from "react"
import {CustomInput} from "../../components/global/CustomInput.tsx";
import {CustomSelect} from "../../components/global/CustomSelect.tsx";
import type {WalletDetailsData} from "../../types/trade.types.ts";

interface WalletDetailsProps {
    onConfirm: (data: WalletDetailsData) => void
    onGoBack: () => void
    canGoBack?: boolean // Optional prop to control go back availability
}

const coinTypes = ["USDT", "BTC", "ETH", "BNB", "USDC"]

const networkTypes = ["BEP20", "ERC20", "TRC20", "Bitcoin Network", "Ethereum Network"]

export default function ChangeWalletDetails({ onConfirm, onGoBack, canGoBack = true }: WalletDetailsProps) {
    const [selectedCoin, setSelectedCoin] = useState("")
    const [walletAddress, setWalletAddress] = useState("")
    const [selectedNetwork, setSelectedNetwork] = useState("")

    const handleConfirm = () => {
        if (selectedCoin && walletAddress && selectedNetwork) {
            onConfirm?.({
                coinType: selectedCoin,
                walletAddress,
                networkType: selectedNetwork,
            })
        }
    }

    const isFormValid = selectedCoin && walletAddress && selectedNetwork

    return (
        <div className="space-y-10">
            <h2 className="text-xl font-semibold text-center mb-8">Address details</h2>

            <div className="space-y-7">
                <CustomSelect
                    label="Select coin type"
                    placeholder="Select option"
                    options={coinTypes}
                    value={selectedCoin}
                    onValueChange={setSelectedCoin}
                />

                <CustomInput
                    label="Wallet address"
                    type="text"
                    placeholder="0x0000000000000000000000000000000000000000"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="font-mono text-sm"
                />

                <CustomSelect
                    label="Network type"
                    placeholder="Select option"
                    options={networkTypes}
                    value={selectedNetwork}
                    onValueChange={setSelectedNetwork}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
                {canGoBack && (
                    <button
                        type="button"
                        onClick={onGoBack}
                        className="flex-1 h-12 rounded-full text-primary font-semibold text-lg hover:bg-gray-50"
                    >
                        Go back
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!isFormValid}
                    className={`${canGoBack ? 'flex-1' : 'w-full'} h-12 rounded-full text-lg font-semibold bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500`}
                >
                    Confirm
                </button>
            </div>
        </div>
    )
}