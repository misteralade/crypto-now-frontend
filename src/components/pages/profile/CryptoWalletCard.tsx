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
    <section className="relative p-5 rounded-2xl border border-[#ECECEC] bg-white shadow-sm overflow-hidden">
      {/* Network Color Accent */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: networkConfig.color }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="text-[20px] md:text-2xl font-medium text-[#0E0F0C]">
            {walletLabel || `Wallet ${index + 1}`}{' '}
            {isPrimary ? '– Primary' : ''}
          </div>
          {isVerified && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
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
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[#828282]">Wallet Address</div>
            <div className="text-[#101828] font-medium font-mono text-sm">
              {truncateAddress(walletAddress)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-[#828282]">Cryto</div>
            <div className="text-[#101828] font-medium font-mono text-sm">
              {symbol}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-[#828282]">Network</div>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: networkConfig.color }}
              />
              <span className="text-[#101828] font-medium">
                {networkConfig.displayName}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-[#828282]">Added On</div>
            <div className="text-[#101828] font-medium">
              {momentClient.formatToNormalisedDateAndTime(createdAt)}
            </div>
          </div>
        </div>
        
        <div className="mt-[68px] flex items-center justify-end gap-x-4">
          <div className="flex items-center gap-4">
            {!isPrimary && (
              <button
                className="text-[#03034D] text-sm font-semibold hover:opacity-80 hover:cursor-pointer"
                onClick={() => onMakePrimary(id)}
              >
                Mark as primary
              </button>
            )}
            <button
              className="text-[#EB5757] text-sm font-semibold hover:opacity-80 hover:cursor-pointer"
              onClick={() => onDelete(id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CryptoWalletCard;