import {getNetworkConfig} from "../../../util/crypto.util.ts";
import momentClient from "../../../lib/moment.ts";

interface CryptoWalletCardProps {
  id: string;
  symbol: string;
  network: string;
  walletLabel: string;
  isPrimary: boolean;
  isVerified: boolean;
  walletAddress: string;
  createdAt: Date;
  index: number;
  onMakePrimary: (id: string) => void;
  onDelete: (id: string) => void;
}

const CryptoWalletCard = ({ id, symbol, network, walletLabel, isPrimary, isVerified, walletAddress, createdAt, index, onMakePrimary, onDelete }: CryptoWalletCardProps) => {
  // Truncate wallet address for display (show first 6 and last 4 characters)
  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Get network configuration based on network name
  const networkConfig = getNetworkConfig(network);
  
  return (
    <section className="relative p-6 rounded-2xl border border-[#ECECEC] bg-white shadow-sm overflow-hidden">
      {/* Network Color Accent */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: networkConfig.color }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#0E0F0C]">
              {walletLabel || `Wallet ${index + 1}`}
            </h3>
            {isPrimary && (
              <span className="inline-block mt-1 text-xs font-semibold text-[#03034D]">
                Primary
              </span>
            )}
          </div>
          {isVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-xs text-[#828282] mb-1">Wallet Address</div>
            <div className="text-sm text-[#101828] font-medium font-mono">
              {truncateAddress(walletAddress)}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-[#828282] mb-1">Crypto</div>
            <div className="text-sm text-[#101828] font-semibold">
              {symbol}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-[#828282] mb-1">Network</div>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: networkConfig.color }}
              />
              <span className="text-sm text-[#101828] font-semibold">
                {networkConfig.displayName}
              </span>
            </div>
          </div>
          
          <div>
            <div className="text-xs text-[#828282] mb-1">Added On</div>
            <div className="text-sm text-[#101828] font-medium">
              {momentClient.formatToNormalisedDateAndTime(createdAt)}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-[#F0F0F0] flex items-center justify-between gap-3">
          {!isPrimary && (
            <button
              className="text-[#03034D] text-sm font-semibold hover:opacity-80 transition-opacity"
              onClick={() => onMakePrimary(id)}
            >
              Mark as primary
            </button>
          )}
          <button
            className="text-[#EB5757] text-sm font-semibold hover:opacity-80 transition-opacity ml-auto"
            onClick={() => onDelete(id)}
          >
            Delete
          </button>
        </div>
      </div>
    </section>
  );
};

export default CryptoWalletCard;