import { ArrowDown } from "lucide-react";
import type { SearchTransactionsResponse } from "../../../types/response.payload.types";

interface TransactionContextCardProps {
  transaction: SearchTransactionsResponse;
}

const TransactionContextCard = ({ transaction }: TransactionContextCardProps) => {
  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div
      className={`rounded-3xl p-5 ${className}`}
      style={{ background: "#FFFFFF", border: "1px solid #F0F0F0" }}
    >
      {children}
    </div>
  );

  const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <p
      className="text-[10px] font-bold tracking-widest uppercase mb-4"
      style={{ color: "#9A9A9A" }}
    >
      {children}
    </p>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "#9A9A9A" }}>
        {label}
      </p>
      <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>
        {value}
      </p>
    </div>
  );

  if (transaction.type === "BUY") {
    return (
      <Card>
        <CardTitle>Transaction Flow</CardTitle>

        <div className="space-y-4">
          {/* From: User's Bank */}
          {transaction.userBankAccount && (
            <div className="space-y-2 pb-4 border-b border-[#F0F0F0]">
              <p className="text-xs font-medium" style={{ color: "#9A9A9A" }}>
                FROM (Your Bank)
              </p>
              <InfoRow label="Bank Name" value={transaction.userBankAccount.bank?.name || "—"} />
              <InfoRow label="Account Name" value={transaction.userBankAccount.accountName || "—"} />
            </div>
          )}

          {/* Arrow */}
          <div className="flex justify-center py-2">
            <ArrowDown className="w-4 h-4" style={{ color: "#D0D0D0" }} />
          </div>

          {/* To: Admin Bank (where user sent fiat) */}
          {transaction.adminBankAccount && (
            <div className="space-y-2 pb-4 border-b border-[#F0F0F0]">
              <p className="text-xs font-medium" style={{ color: "#9A9A9A" }}>
                RECEIVED AT (Platform Bank)
              </p>
              <InfoRow label="Bank Name" value={transaction.adminBankAccount.bank?.name || "—"} />
              <InfoRow label="Account Holder" value={transaction.adminBankAccount.accountHolderName || "—"} />
            </div>
          )}

          {/* Arrow */}
          <div className="flex justify-center py-2">
            <ArrowDown className="w-4 h-4" style={{ color: "#D0D0D0" }} />
          </div>

          {/* To: User's Crypto Wallet */}
          {transaction.userCryptoWallet && (
            <div className="space-y-2">
              <p className="text-xs font-medium" style={{ color: "#9A9A9A" }}>
                YOUR CRYPTO WALLET
              </p>
              <InfoRow label="Network" value={transaction.userCryptoWallet.network || "—"} />
              <div className="pt-2">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "#9A9A9A" }}>
                  Wallet Address
                </p>
                <p
                  className="text-xs break-all font-mono"
                  style={{ color: "#0E0F0C" }}
                >
                  {transaction.userCryptoWallet.walletAddress || "—"}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (transaction.type === "SELL") {
    return (
      <Card>
        <CardTitle>Transaction Flow</CardTitle>

        <div className="space-y-4">
          {/* From: User's Crypto Wallet */}
          {transaction.userCryptoWallet && (
            <div className="space-y-2 pb-4 border-b border-[#F0F0F0]">
              <p className="text-xs font-medium" style={{ color: "#9A9A9A" }}>
                FROM (Your Crypto)
              </p>
              <InfoRow label="Network" value={transaction.userCryptoWallet.network || "—"} />
              <div className="pt-2">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "#9A9A9A" }}>
                  Wallet Address
                </p>
                <p
                  className="text-xs break-all font-mono"
                  style={{ color: "#0E0F0C" }}
                >
                  {transaction.userCryptoWallet.walletAddress || "—"}
                </p>
              </div>
            </div>
          )}

          {/* Arrow */}
          <div className="flex justify-center py-2">
            <ArrowDown className="w-4 h-4" style={{ color: "#D0D0D0" }} />
          </div>

          {/* To: Admin Wallet (custodial) */}
          {transaction.adminCryptoWallet && (
            <div className="space-y-2 pb-4 border-b border-[#F0F0F0]">
              <p className="text-xs font-medium" style={{ color: "#9A9A9A" }}>
                RECEIVED AT (Platform Custodial)
              </p>
              <InfoRow label="Network" value={transaction.adminCryptoWallet.network || "—"} />
              <div className="pt-2">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "#9A9A9A" }}>
                  Wallet Address
                </p>
                <p
                  className="text-xs break-all font-mono"
                  style={{ color: "#0E0F0C" }}
                >
                  {transaction.adminCryptoWallet.walletAddress || "—"}
                </p>
              </div>
            </div>
          )}

          {/* Arrow */}
          <div className="flex justify-center py-2">
            <ArrowDown className="w-4 h-4" style={{ color: "#D0D0D0" }} />
          </div>

          {/* To: User's Bank (where they receive fiat) */}
          {transaction.userBankAccount && (
            <div className="space-y-2">
              <p className="text-xs font-medium" style={{ color: "#9A9A9A" }}>
                PAID TO (Your Bank)
              </p>
              <InfoRow label="Bank Name" value={transaction.userBankAccount.bank?.name || "—"} />
              <InfoRow label="Account Name" value={transaction.userBankAccount.accountName || "—"} />
            </div>
          )}
        </div>
      </Card>
    );
  }

  return null;
};

export default TransactionContextCard;
