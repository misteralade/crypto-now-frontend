interface TransactionContextCardProps {
  transaction: {
    type: string;
    userBankAccount?: { bank?: { name?: string } | null; accountName?: string } | null;
    adminBankAccount?: { bank?: { name?: string } | null; accountHolderName?: string } | null;
    walletAddress?: string | null;
  };
}

const TransactionContextCard = ({ transaction }: TransactionContextCardProps) => {
  const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="py-2">
      <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#9A9A9A" }}>
        {label}
      </p>
      <p className="text-sm font-semibold mt-0.5" style={{ color: "#0E0F0C" }}>
        {value || "—"}
      </p>
    </div>
  );

  const WalletRow = ({ address }: { address?: string }) => (
    <div className="py-2">
      <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#9A9A9A" }}>
        Wallet Address
      </p>
      <p className="text-xs break-all font-mono mt-0.5" style={{ color: "#0E0F0C" }}>
        {address || "—"}
      </p>
    </div>
  );

  const isBuy = transaction.type === "BUY";

  return (
    <div className="rounded-3xl p-5" style={{ background: "#FFFFFF", border: "1px solid #F0F0F0" }}>
      <div className="space-y-4">
        {isBuy && transaction.userBankAccount && (
          <>
            <div className="pb-3 border-b border-[#F0F0F0]">
              <p className="text-xs font-medium mb-2" style={{ color: "#9A9A9A" }}>
                MONEY FROM
              </p>
              <InfoRow label="Bank" value={transaction.userBankAccount.bank?.name} />
              <InfoRow label="Account" value={transaction.userBankAccount.accountName} />
            </div>
          </>
        )}

        {isBuy && transaction.adminBankAccount && (
          <>
            <div className="pb-3 border-b border-[#F0F0F0]">
              <p className="text-xs font-medium mb-2" style={{ color: "#9A9A9A" }}>
                RECEIVED AT
              </p>
              <InfoRow label="Bank" value={transaction.adminBankAccount.bank?.name} />
              <InfoRow label="Account" value={transaction.adminBankAccount.accountHolderName} />
            </div>
          </>
        )}

        {isBuy && transaction.walletAddress && (
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: "#9A9A9A" }}>
              CRYPTO TO
            </p>
            <WalletRow address={transaction.walletAddress} />
          </div>
        )}

        {!isBuy && transaction.walletAddress && (
          <>
            <div className="pb-3 border-b border-[#F0F0F0]">
              <p className="text-xs font-medium mb-2" style={{ color: "#9A9A9A" }}>
                CRYPTO FROM
              </p>
              <WalletRow address={transaction.walletAddress} />
            </div>
          </>
        )}

        {!isBuy && transaction.userBankAccount && (
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: "#9A9A9A" }}>
              PAID TO
            </p>
            <InfoRow label="Bank" value={transaction.userBankAccount.bank?.name} />
            <InfoRow label="Account" value={transaction.userBankAccount.accountName} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionContextCard;
