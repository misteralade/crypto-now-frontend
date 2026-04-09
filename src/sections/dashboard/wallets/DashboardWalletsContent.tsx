import { useEffect, useRef, useState } from "react";
import { Copy, Check, Wallet } from "lucide-react";
import { useCryptoQuery } from "../../../queries/crypto.query.ts";
import type { CustodialWalletResponse } from "../../../types/response.payload.types.ts";
import { useBankQuery } from "../../../queries/bank.query.ts";
import { toast } from "react-toastify";

// Shortens long addresses while preserving the first and last parts.
function truncateAddress(addr: string) {
  if (addr.length <= 20) return addr;
  return `${addr.slice(0, 10)}…${addr.slice(-8)}`;
}

// Displays a full wallet address, truncating only when overflow is detected.
function AdaptiveWalletAddress({ address }: { address: string }) {
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [shouldTruncate, setShouldTruncate] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    // Checks if rendered content overflows the available horizontal space.
    const checkOverflow = () => {
      setShouldTruncate(element.scrollWidth > element.clientWidth + 1);
    };

    checkOverflow();

    // Re-checks truncation when the text container resizes.
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(element);
    window.addEventListener("resize", checkOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkOverflow);
    };
  }, [address]);

  return (
    <p ref={textRef} className="text-xs font-mono truncate flex-1" style={{ color: "#0E0F0C" }}>
      {shouldTruncate ? truncateAddress(address) : address}
    </p>
  );
}

// Renders a copy button with temporary copied state feedback.
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
      style={{
        background: copied ? "#E8F8F0" : "#F7F7F9",
        color: copied ? "#037847" : "#6B6E6B",
        border: `1px solid ${copied ? "#B6E8D0" : "#EEEEEE"}`,
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// Renders one wallet card with network, address, and copy action.
function WalletCard({
  wallet,
  cryptoName,
  cryptoSymbol,
  cryptoLogo,
}: {
  wallet: CustodialWalletResponse;
  cryptoName: string;
  cryptoSymbol: string;
  cryptoLogo?: string;
}) {
  const networkColors: Record<string, { bg: string; text: string; border: string }> = {
    TRC20:  { bg: "#FFF4F0", text: "#C94B00", border: "#FFD4BE" },
    ERC20:  { bg: "#EEF0FF", text: "#575AE5", border: "#C7CAFF" },
    BTC:    { bg: "#FFFBF0", text: "#A07000", border: "#FFE4A0" },
    SOLANA: { bg: "#F0F9FF", text: "#0077CC", border: "#BAE0FF" },
    BEP20:  { bg: "#FFFBF0", text: "#A07000", border: "#FFE4A0" },
  };
  const nc = networkColors[wallet.network] ?? { bg: "#F7F7F9", text: "#6B6E6B", border: "#EEEEEE" };

  return (
    <div
      className="rounded-3xl p-5 flex flex-col gap-4"
      style={{ border: "1px solid #F0F0F0", background: "#FAFAFA" }}
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        {cryptoLogo ? (
          <img src={cryptoLogo} alt={cryptoSymbol} className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
            style={{ background: "linear-gradient(135deg,#948EEE,#575AE5)" }}
          >
            {cryptoSymbol.slice(0, 2)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold leading-snug" style={{ color: "#0E0F0C" }}>{cryptoName}</p>
          <p className="text-[11px] leading-snug" style={{ color: "#9A9A9A" }}>{cryptoSymbol}</p>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0"
          style={{ background: nc.bg, color: nc.text, border: `1px solid ${nc.border}` }}
        >
          {wallet.network}
        </span>
      </div>

      {/* Address */}
      <div
        className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
        style={{ background: "#FFFFFF", border: "1px solid #EEEEEE" }}
      >
        <AdaptiveWalletAddress address={wallet.walletAddress} />
        <CopyButton text={wallet.walletAddress} />
      </div>

      {/* Info blurb */}
      <p className="text-[11px] leading-relaxed" style={{ color: "#9A9A9A" }}>
        Send <strong>{cryptoSymbol}</strong> to this address ({wallet.network}) and we'll automatically credit your account.
      </p>
    </div>
  );
}

// Shows the dashboard wallets section with loading, empty, and wallet states.
export default function DashboardWalletsContent() {
  const {
    custodialWallets,
    loadingCustodialWallets,
    supportedCryptoCurrencies,
    generateAllCustodialWalletsMutation,
  } = useCryptoQuery();
  
  const { userBankAccounts, loadingUserBankAccounts } = useBankQuery();
  const hasBankAccounts = userBankAccounts && userBankAccounts.length > 0;

  const cryptoMap = new Map(
    (supportedCryptoCurrencies ?? []).map((c) => [c.id, c])
  );

  const isGenerating = generateAllCustodialWalletsMutation.isPending;

  // One-shot generate when user has no wallets (addresses are stable after creation).
  const handleGenerateAll = () => {
    if (!hasBankAccounts) {
      toast.error("Please link a bank account before generating wallets.");
      return;
    }
    generateAllCustodialWalletsMutation.mutate();
  };

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100dvh" }}>
      <div className="px-5 pt-6 pb-32 lg:px-0 lg:pt-0 lg:pb-0">

        {/* Header */}
        <div className="mb-6">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-0.5" style={{ color: "#9A9A9A" }}>
            Deposit Wallets
          </p>
          <h2 className="text-xl font-extrabold" style={{ color: "#0E0F0C", letterSpacing: "-0.02em" }}>
            Your Crypto Wallets
          </h2>
          <p className="text-xs mt-1 max-w-sm" style={{ color: "#9A9A9A" }}>
            Send crypto to any address below and receive NGN instantly to your bank account — no extra steps needed.
          </p>
        </div>

        {/* How it works banner */}
        <div
          className="mb-6 flex items-start gap-2.5 px-4 py-3 rounded-2xl"
          style={{ background: "#FFFBF0", border: "1px solid #FFE9A0" }}
        >
          <span className="text-sm shrink-0 mt-0.5">⚡</span>
          <p className="text-[11px] leading-relaxed" style={{ color: "#7A6000" }}>
            <strong>How it works:</strong> Copy a wallet address, send crypto from any exchange or wallet app,
            and our system auto-detects your transfer and pays out NGN to your linked bank account within minutes.
          </p>
        </div>

        {/* Wallet cards */}
        {loadingCustodialWallets || loadingUserBankAccounts ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-3xl p-5 animate-pulse"
                style={{ border: "1px solid #F0F0F0", background: "#FAFAFA", height: "160px" }}
              />
            ))}
          </div>
        ) : !hasBankAccounts ? (
          <div
            className="rounded-3xl px-6 py-14 flex flex-col items-center gap-4 text-center"
            style={{ border: "1px solid #F0F0F0" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "#FEE2E2" }}
            >
              <Wallet size={24} style={{ color: "#EF4444" }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>Action Required</p>
              <p className="text-xs mt-1" style={{ color: "#9A9A9A" }}>Please link a bank account before generating or viewing your wallets.</p>
            </div>
            <button
              type="button"
              onClick={() => toast.error("Please add a bank account first")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold opacity-50 cursor-not-allowed"
              style={{ background: "#948EEE", color: "#FFFFFF" }}
            >
              Generate Wallets
            </button>
          </div>
        ) : !custodialWallets || custodialWallets.length === 0 ? (
          <div
            className="rounded-3xl px-6 py-14 flex flex-col items-center gap-4 text-center"
            style={{ border: "1px solid #F0F0F0" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "#F0EFFD" }}
            >
              <Wallet size={24} style={{ color: "#948EEE" }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>No wallets yet</p>
              <p className="text-xs mt-1" style={{ color: "#9A9A9A" }}>Generate your deposit wallets to get started</p>
            </div>
            <button
              type="button"
              onClick={handleGenerateAll}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: "#948EEE", color: "#FFFFFF" }}
            >
              {isGenerating ? "Generating…" : "Generate Wallets"}
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {custodialWallets.map((wallet) => {
              const crypto = cryptoMap.get(wallet.cryptocurrencyId);
              return (
                <WalletCard
                  key={wallet.id}
                  wallet={wallet}
                  cryptoName={crypto?.name ?? "Unknown"}
                  cryptoSymbol={crypto?.symbol ?? "?"}
                  cryptoLogo={crypto?.logoUrl}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
