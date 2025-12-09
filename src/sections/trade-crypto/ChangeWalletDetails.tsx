import {Fragment, useState} from "react"
import { useDispatch } from "react-redux"
import { CustomInput } from "../../components/global/CustomInput.tsx"
import { CustomSelect } from "../../components/global/CustomSelect.tsx"
import { setUserCreateCrypto } from "../../redux/crypto.slice.ts"
import {type RootState, store} from "../../store.ts";
import {cryptoNetworkTypes} from "../../util/constants.util.ts";
import { walletAddressRegex } from "../../util/regex.util.ts";

interface CryptoWalletDetailsProps {
  onConfirm: () => void
  onGoBack: () => void
  canGoBack: boolean
}


// const networkTypes = [
//   "BEP20", "ERC20", "TRC20", "Bitcoin Network", "Ethereum Network",
//   "Polygon", "Arbitrum", "Optimism", "Avalanche", "Fantom", "BSC",
//   "Solana", "Cardano", "Polkadot", "Cosmos", "Terra", "Near Protocol",
//   "Harmony", "Moonbeam", "Cronos", "KuCoin Community Chain", "Heco",
//   "xDai", "Celo", "Algorand", "Tezos", "Elrond", "Klaytn", "Matic",
//   "Binance Smart Chain", "Huobi ECO Chain", "OKEx Chain"
// ]

const ChangeCryptoWalletDetails = ({ onConfirm, onGoBack, canGoBack = true }: CryptoWalletDetailsProps) => {
  const dispatch = useDispatch()
  const rootState = store.getState() as RootState;
  const userEmail = rootState.user.trade.anonymous.email;

  const [walletLabel, setWalletLabel] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [walletAddressError, setWalletAddressError] = useState("")
  const [network, setNetwork] = useState("")
  const [isPrimary, setIsPrimary] = useState(false)
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
    if (walletLabel && walletAddress && network && validateWalletAddress(walletAddress)) {
      dispatch(
        setUserCreateCrypto({
          walletLabel,
          walletAddress: walletAddress.trim(),
          network,
          isPrimary,
          isVerified,
        })
      )

      onConfirm()
    }
  }

  const isFormValid = walletLabel && walletAddress && network && !walletAddressError

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-semibold text-center">Wallet details</h2>

      <div className="space-y-7">
        <CustomInput
          label="Wallet Nickname"
          placeholder="e.g My USDT Wallet"
          value={walletLabel}
          onChange={(e) => setWalletLabel(e.target.value)}
        />

        <CustomInput
          label="Wallet address"
          placeholder="0x0000000000000000000000000000000000000000"
          value={walletAddress}
          onChange={handleWalletAddressChange}
          onBlur={handleWalletAddressBlur}
          error={walletAddressError}
          className="font-mono text-sm"
        />

        <CustomSelect
          label="Network type"
          placeholder="Select network"
          options={cryptoNetworkTypes}
          value={network}
          onValueChange={setNetwork}
        />
        
        {!userEmail && (
          <Fragment>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Make this my primary wallet
              </label>
            </div>
            
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
          </Fragment>
        )}
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
