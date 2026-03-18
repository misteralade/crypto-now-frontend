import {useState} from "react"
import { useDispatch } from "react-redux"
import { CustomInput } from "../../components/global/CustomInput.tsx"
import { CustomSelect } from "../../components/global/CustomSelect.tsx"
import { setUserCreateCrypto } from "../../redux/crypto.slice.ts"
import {cryptoNetworkTypes} from "../../util/constants.util.ts";
import { walletAddressRegex } from "../../util/regex.util.ts";

interface CryptoWalletDetailsProps {
  onConfirm: () => void
  onGoBack: () => void
  canGoBack: boolean
  availableNetworks?: string[]
}


// const networkTypes = [
//   "BEP20", "ERC20", "TRC20", "Bitcoin Network", "Ethereum Network",
//   "Polygon", "Arbitrum", "Optimism", "Avalanche", "Fantom", "BSC",
//   "Solana", "Cardano", "Polkadot", "Cosmos", "Terra", "Near Protocol",
//   "Harmony", "Moonbeam", "Cronos", "KuCoin Community Chain", "Heco",
//   "xDai", "Celo", "Algorand", "Tezos", "Elrond", "Klaytn", "Matic",
//   "Binance Smart Chain", "Huobi ECO Chain", "OKEx Chain"
// ]

const ChangeCryptoWalletDetails = ({ onConfirm, onGoBack, canGoBack = true, availableNetworks }: CryptoWalletDetailsProps) => {
  const dispatch = useDispatch()

  const networkOptions = availableNetworks && availableNetworks.length > 0 ? availableNetworks : cryptoNetworkTypes;
  const [walletAddress, setWalletAddress] = useState("")
  const [walletAddressError, setWalletAddressError] = useState("")
  const [network, setNetwork] = useState(networkOptions.length === 1 ? networkOptions[0] : "")
  const [isVerified, setIsVerified] = useState(false)

  const validateWalletAddress = (address: string) => {
    if (!address || address.trim() === "") {
      setWalletAddressError("Wallet address is required");
      return false;
    }
    
    const trimmedAddress = address.trim();
    if (!walletAddressRegex.test(trimmedAddress)) {
      setWalletAddressError("Please enter a valid wallet address");
      return false;
    }
    
    setWalletAddressError("");
    return true;
  }

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWalletAddress(value);
    
    // Only validate if user has started typing (not empty)
    if (value.trim() !== "") {
      validateWalletAddress(value);
    } else {
      setWalletAddressError("");
    }
  }

  const handleWalletAddressBlur = () => {
    validateWalletAddress(walletAddress);
  }

  const handleConfirm = () => {
    if (walletAddress && network && validateWalletAddress(walletAddress)) {
      dispatch(
        setUserCreateCrypto({
          walletAddress: walletAddress.trim(),
          network,
          isVerified,
          isPrimary: false,
        })
      )

      onConfirm()
    }
  }

  const isFormValid = walletAddress && network && !walletAddressError && isVerified

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-semibold text-center">Wallet details</h2>

      <div className="space-y-7">
        <CustomInput
          label="Wallet address"
          placeholder="0x0000000000000000000000000000000000000000"
          value={walletAddress}
          onChange={handleWalletAddressChange}
          onBlur={handleWalletAddressBlur}
          error={walletAddressError}
          className="font-mono text-sm"
        />

        {networkOptions.length === 1 ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Network type</p>
            <div className="h-12 px-4 flex items-center rounded-2xl text-sm font-semibold"
              style={{ background: "#F7F7F9", border: "1px solid #EEEEEE", color: "#0E0F0C" }}>
              {networkOptions[0]}
            </div>
          </div>
        ) : (
          <CustomSelect
            label="Network type"
            placeholder="Select network"
            options={networkOptions}
            value={network}
            onValueChange={setNetwork}
          />
        )}
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isVerified}
            onChange={(e) => setIsVerified(e.target.checked)}
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700">
            I confirm I own this wallet
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 w-4/5 mx-auto">
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
          className={`${canGoBack ? "flex-1" : "w-full"} h-12 rounded-full font-semibold text-lg bg-primary text-white disabled:bg-gray-300 hover:cursor-pointer`}
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

export default ChangeCryptoWalletDetails;
