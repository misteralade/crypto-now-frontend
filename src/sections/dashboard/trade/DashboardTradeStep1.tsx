import { useState } from "react";
import { CheckCircle, ChevronDown, X, Wallet, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import type {
  SupportedCryptoOrCurrencyResponse,
  UserBankAccountResponse,
  UserCryptoWalletResponse,
  CustodialWalletResponse,
} from "../../../types/response.payload.types.ts";
import type { TradeType, TradeAdditionalInfoInterface } from "../../../types/trade.types.ts";
import { useDispatch } from "react-redux";
import { setInitiateTransactionField } from "../../../redux/transaction.slice.ts";
import { setSelectedCryptoId } from "../../../redux/crypto.slice.ts";
import { ROUTES } from "../../../util/constants.util.ts";

// ── Quick NGN chips ──────────────────────────────────────────────────────────
const QUICK_AMOUNTS = [5000, 10000, 20000, 50000];

// ── Network labels ────────────────────────────────────────────────────────────
const NETWORK_LABELS: Record<string, string> = {
  TRC20: "TRC20 (Tron)",
  ERC20: "ERC20 (Ethereum)",
  BEP20: "BEP20 (BSC)",
  BTC: "Bitcoin (BTC)",
  SOLANA: "Solana (SOL)",
};

// ── Icons ─────────────────────────────────────────────────────────────────────
function CryptoIcon({ symbol, icon }: { symbol: string; icon?: string }) {
  if (icon) return <img src={icon} alt={symbol} className="w-10 h-10 rounded-full object-cover" />;
  const colors: Record<string, string> = {
    BTC: "#F7931A", ETH: "#627EEA", SOL: "#9945FF", USDT: "#26A17B",
  };
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black"
      style={{ background: colors[symbol] ?? "#948EEE" }}
    >
      {symbol.slice(0, 2)}
    </div>
  );
}

function CryptoIconSmall({ symbol, icon }: { symbol: string; icon?: string }) {
  if (icon) return <img src={icon} alt={symbol} className="w-6 h-6 rounded-full object-cover" />;
  const colors: Record<string, string> = {
    BTC: "#F7931A", ETH: "#627EEA", SOL: "#9945FF", USDT: "#26A17B",
  };
  return (
    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-black"
      style={{ background: colors[symbol] ?? "#948EEE" }}>
      {symbol.slice(0, 2)}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface DashboardTradeStep1Props {
  tradeType: TradeType;
  availableTokens: SupportedCryptoOrCurrencyResponse[];
  selectedToken: SupportedCryptoOrCurrencyResponse | undefined;
  setSelectedToken: (t: SupportedCryptoOrCurrencyResponse) => void;
  isInitiatingTrade: boolean;
  isRateLoading?: boolean;
  onProceed: () => void;

  // BUY-specific (from Step 1b)
  availableCurrencies?: SupportedCryptoOrCurrencyResponse[];
  selectedCurrency?: SupportedCryptoOrCurrencyResponse;
  setSelectedCurrency?: (c: SupportedCryptoOrCurrencyResponse) => void;
  amountToBuy?: string | number;
  setAmountToBuy?: (v: string | number) => void;
  handleFocusAmountToBuy?: () => void;
  handleBlurAmountToBuy?: () => void;
  walletAddress?: string;
  onWalletAddressChange?: (v: string) => void;
  selectedNetwork?: string;
  onNetworkChange?: (v: string) => void;
  orderDetails?: TradeAdditionalInfoInterface[];
  savedWallets?: UserCryptoWalletResponse[] | null;

  // SELL-specific (payout bank)
  userBankAccounts?: UserBankAccountResponse[] | null;
  selectedPayoutAccountId?: string;
  onPayoutAccountChange?: (id: string) => void;

  // SELL-specific (deposit wallet shown inline)
  sellDepositWallet?: CustodialWalletResponse | null;
  isGeneratingDepositWallet?: boolean;
  sellNetwork?: string;
  onSellNetworkChange?: (network: string) => void;
}

// ── BUY extra fields ──────────────────────────────────────────────────────────
function BuyFields({
  selectedToken,
  availableCurrencies,
  selectedCurrency,
  setSelectedCurrency,
  amountToBuy,
  setAmountToBuy,
  handleFocusAmountToBuy,
  handleBlurAmountToBuy,
  walletAddress,
  onWalletAddressChange,
  selectedNetwork,
  onNetworkChange,
  savedWallets,
}: {
  selectedToken: SupportedCryptoOrCurrencyResponse;
  availableCurrencies?: SupportedCryptoOrCurrencyResponse[];
  selectedCurrency?: SupportedCryptoOrCurrencyResponse;
  setSelectedCurrency?: (c: SupportedCryptoOrCurrencyResponse) => void;
  amountToBuy?: string | number;
  setAmountToBuy?: (v: string | number) => void;
  handleFocusAmountToBuy?: () => void;
  handleBlurAmountToBuy?: () => void;
  walletAddress?: string;
  onWalletAddressChange?: (v: string) => void;
  selectedNetwork?: string;
  onNetworkChange?: (v: string) => void;
  savedWallets?: UserCryptoWalletResponse[] | null;
}) {
  const dispatch = useDispatch();
  const accentColor = "#948EEE";
  const tokenNetworks: string[] = selectedToken.networks ?? [];
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const [showSavedWallets, setShowSavedWallets] = useState(false);

  const matchingSavedWallets = (savedWallets ?? []).filter(w => tokenNetworks.includes(w.network));
  const filteredWallets = walletAddress?.trim()
    ? matchingSavedWallets.filter(w => w.walletAddress.toLowerCase().includes((walletAddress ?? "").toLowerCase()))
    : matchingSavedWallets;

  const handleWalletChange = (val: string) => {
    onWalletAddressChange?.(val);
    dispatch(setInitiateTransactionField({ field: "walletAddress" as any, value: val }));
    if (val.trim()) setShowSavedWallets(true);
  };

  const handleNetworkSelect = (net: string) => {
    setNetworkDropdownOpen(false);
    onNetworkChange?.(net);
    dispatch(setInitiateTransactionField({ field: "network" as any, value: net }));
  };

  const handleSelectSavedWallet = (wallet: UserCryptoWalletResponse) => {
    handleWalletChange(wallet.walletAddress);
    handleNetworkSelect(wallet.network);
    setShowSavedWallets(false);
  };

  // Auto-set currency to NGN
  if (availableCurrencies && !selectedCurrency) {
    const ngn = availableCurrencies.find(c => c.code === "NGN" || c.symbol === "NGN");
    if (ngn) {
      setSelectedCurrency?.(ngn);
      dispatch(setInitiateTransactionField({ field: "currencyId", value: ngn.id }));
    }
  }

  // Sync token + first network into redux
  dispatch(setSelectedCryptoId(selectedToken.id));
  dispatch(setInitiateTransactionField({ field: "tokenId", value: selectedToken.id }));

  return (
    <div className="flex flex-col gap-3 mt-1">
      {/* Amount input */}
      <div className="rounded-2xl px-4 pt-3 pb-4" style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#9A9A9A" }}>
          Amount in NGN (₦)
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            inputMode="decimal"
            value={String(amountToBuy ?? "")}
            onChange={(e) => setAmountToBuy?.(e.target.value)}
            onFocus={handleFocusAmountToBuy}
            onBlur={handleBlurAmountToBuy}
            placeholder="0.00"
            className="flex-1 bg-transparent text-3xl font-black outline-none"
            style={{ color: "#0E0F0C", minWidth: 0 }}
          />
          <span className="text-sm font-bold shrink-0 px-3 py-1.5 rounded-xl"
            style={{ background: "#FFFFFF", border: "1px solid #E0E0E0", color: "#6B6E6B" }}>
            NGN
          </span>
        </div>
        {/* Quick chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {QUICK_AMOUNTS.map((a) => {
            const isActive = String(amountToBuy) === String(a);
            return (
              <button key={a} type="button"
                onClick={() => setAmountToBuy?.(String(a))}
                className="shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all"
                style={{
                  background: isActive ? accentColor : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#6B6E6B",
                  border: `1px solid ${isActive ? accentColor : "#E0E0E0"}`,
                }}>
                ₦{a.toLocaleString()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wallet address */}
      <div className="relative">
        <div className="rounded-2xl px-4 py-3" style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#9A9A9A" }}>
              Your Wallet Address
            </p>
            {matchingSavedWallets.length > 0 && !walletAddress && (
              <button type="button" onClick={() => setShowSavedWallets(!showSavedWallets)}
                className="text-[10px] font-bold" style={{ color: accentColor }}>
                {showSavedWallets ? "Hide" : `${matchingSavedWallets.length} saved`}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={walletAddress ?? ""}
              onChange={(e) => handleWalletChange(e.target.value)}
              onFocus={() => matchingSavedWallets.length > 0 && setShowSavedWallets(true)}
              placeholder="Paste your wallet address here"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "#0E0F0C", minWidth: 0 }}
            />
            {walletAddress && (
              <button type="button" onClick={() => { handleWalletChange(""); setShowSavedWallets(false); }}
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "#E0E0E0" }}>
                <X size={10} style={{ color: "#6B6E6B" }} />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showSavedWallets && filteredWallets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 z-20 mt-1 rounded-2xl overflow-hidden max-h-64 overflow-y-auto"
              style={{ background: "#FFFFFF", border: "1px solid #EEEEEE", boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
            >
              {filteredWallets.map((wallet, idx) => {
                const shortAddr = wallet.walletAddress.length > 30
                  ? `${wallet.walletAddress.slice(0, 16)}…${wallet.walletAddress.slice(-12)}`
                  : wallet.walletAddress;
                return (
                  <button key={wallet.id} type="button"
                    onClick={() => handleSelectSavedWallet(wallet)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                    style={{ borderBottom: idx < filteredWallets.length - 1 ? "1px solid #F7F7F9" : "none" }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#F0EFFD" }}>
                      <Wallet size={14} style={{ color: accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "#0E0F0C" }}>
                        {wallet.walletLabel || shortAddr}
                      </p>
                      <p className="text-[10px] font-mono truncate mt-0.5" style={{ color: "#9A9A9A" }}>
                        {shortAddr} · {wallet.network}
                      </p>
                    </div>
                    {wallet.isPrimary && (
                      <span className="shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "#E8F8F0", color: "#037847" }}>
                        PRIMARY
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Network selector */}
      <div className="relative">
        <div className="rounded-2xl px-4 py-3" style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "#9A9A9A" }}>
            Network
          </p>
          {tokenNetworks.length <= 1 ? (
            <p className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>
              {(NETWORK_LABELS[selectedNetwork ?? ""] ?? selectedNetwork) || "—"}
            </p>
          ) : (
            <button type="button" onClick={() => setNetworkDropdownOpen(v => !v)}
              className="flex items-center justify-between w-full">
              <span className="text-sm font-semibold" style={{ color: "#0E0F0C" }}>
                {NETWORK_LABELS[selectedNetwork ?? ""] ?? selectedNetwork}
              </span>
              <ChevronDown size={16} style={{
                color: "#9A9A9A",
                transform: networkDropdownOpen ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.2s",
              }} />
            </button>
          )}
        </div>

        {tokenNetworks.length > 1 && (
          <AnimatePresence>
            {networkDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 z-20 mt-1 rounded-2xl overflow-hidden"
                style={{ background: "#FFFFFF", border: "1px solid #EEEEEE", boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}>
                {tokenNetworks.map((net) => (
                  <button key={net} type="button" onClick={() => handleNetworkSelect(net)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-gray-50"
                    style={{ color: selectedNetwork === net ? accentColor : "#0E0F0C", borderBottom: "1px solid #F7F7F9" }}>
                    {NETWORK_LABELS[net] ?? net}
                    {selectedNetwork === net && <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ── SELL deposit wallet (inline) ──────────────────────────────────────────────
function SellDepositWalletSection({
  depositWallet,
  isGenerating,
  selectedToken,
  sellNetwork,
  onSellNetworkChange,
}: {
  depositWallet?: CustodialWalletResponse | null;
  isGenerating?: boolean;
  selectedToken?: SupportedCryptoOrCurrencyResponse;
  sellNetwork?: string;
  onSellNetworkChange?: (network: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const accentColor = "#F7A600";
  const tokenNetworks = selectedToken?.networks ?? [];
  const hasMultipleNetworks = tokenNetworks.length > 1;
  const activeNetwork = sellNetwork ?? tokenNetworks[0];

  const handleCopy = () => {
    if (!depositWallet?.walletAddress) return;
    navigator.clipboard.writeText(depositWallet.walletAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleNetworkSelect = (net: string) => {
    setNetworkDropdownOpen(false);
    onSellNetworkChange?.(net);
  };

  if (!selectedToken) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#9A9A9A" }}>
        Send {selectedToken.symbol} To
      </p>

      {/* Network selector (only for multi-network tokens) */}
      {hasMultipleNetworks && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setNetworkDropdownOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl"
            style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-left" style={{ color: "#9A9A9A" }}>Network</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: "#0E0F0C" }}>
                {NETWORK_LABELS[activeNetwork] ?? activeNetwork}
              </p>
            </div>
            <ChevronDown size={16} style={{
              color: "#9A9A9A",
              transform: networkDropdownOpen ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.2s",
            }} />
          </button>

          <AnimatePresence>
            {networkDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 z-20 mt-1 rounded-2xl overflow-hidden"
                style={{ background: "#FFFFFF", border: "1px solid #EEEEEE", boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}>
                {tokenNetworks.map((net) => (
                  <button key={net} type="button" onClick={() => handleNetworkSelect(net)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-gray-50"
                    style={{ color: activeNetwork === net ? accentColor : "#0E0F0C", borderBottom: "1px solid #F7F7F9" }}>
                    {NETWORK_LABELS[net] ?? net}
                    {activeNetwork === net && <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="rounded-2xl px-4 py-3" style={{ background: "#FFFBF0", border: `1.5px solid ${accentColor}44` }}>
        {isGenerating ? (
          <div className="flex items-center gap-2 py-1">
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${accentColor} transparent transparent transparent` }} />
            <p className="text-xs" style={{ color: "#A07000" }}>Generating deposit address…</p>
          </div>
        ) : depositWallet ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {!hasMultipleNetworks && (
                  <p className="text-[10px] font-bold mb-1" style={{ color: "#A07000" }}>
                    {NETWORK_LABELS[depositWallet.network] ?? depositWallet.network}
                  </p>
                )}
                <p className="text-xs font-mono break-all leading-relaxed" style={{ color: "#0E0F0C" }}>
                  {depositWallet.walletAddress}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all"
                style={{
                  background: copied ? "#E8F8F0" : "#FFF3D0",
                  color: copied ? "#037847" : "#A07000",
                  border: `1px solid ${copied ? "#A8E6C8" : "#FFD980"}`,
                }}>
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-[10px] mt-2" style={{ color: "#A07000" }}>
              Only send {selectedToken.symbol} on {NETWORK_LABELS[depositWallet.network] ?? depositWallet.network}. Wrong network = lost funds.
            </p>
          </>
        ) : (
          <p className="text-xs py-1" style={{ color: "#A07000" }}>
            Select a crypto above to see your deposit address.
          </p>
        )}
      </div>
    </div>
  );
}

// ── SELL payout bank section ──────────────────────────────────────────────────
function BankAccountRow({
  account,
  selected,
  accentColor,
  onSelect,
}: {
  account: UserBankAccountResponse;
  selected: boolean;
  accentColor: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-2xl px-4 py-3 text-left transition-all"
      style={{
        background: selected ? "#FFFBF0" : "#FAFAFA",
        border: selected ? `2px solid ${accentColor}` : "1.5px solid #F0F0F0",
      }}
    >
      <div className="flex items-center gap-3">
        {account.bankLogo ? (
          <img src={account.bankLogo} alt={account.bankName}
            className="w-8 h-8 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: selected ? "#FFE4A0" : "#F0F0F0" }}>
            <span className="text-[10px] font-black"
              style={{ color: selected ? "#A07000" : "#9A9A9A" }}>
              {account.bankName.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate" style={{ color: "#0E0F0C" }}>
            {account.bankName}
          </p>
          <p className="text-[11px] font-mono" style={{ color: "#6B6E6B" }}>
            ****{account.accountNumber.slice(-4)} · {account.accountName}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {account.isDefault && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#E8F8F0", color: "#037847" }}>
              DEFAULT
            </span>
          )}
          {/* Radio dot */}
          <div className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{ border: `2px solid ${selected ? accentColor : "#D0D0D0"}` }}>
            {selected && (
              <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function SellPayoutBank({
  userBankAccounts,
  selectedPayoutAccountId,
  onPayoutAccountChange,
}: {
  userBankAccounts?: UserBankAccountResponse[] | null;
  selectedPayoutAccountId?: string;
  onPayoutAccountChange?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const accentColor = "#F7A600";

  const accounts = userBankAccounts ?? [];
  const selectedId = selectedPayoutAccountId
    ?? accounts.find(b => b.isDefault)?.id
    ?? accounts[0]?.id;

  if (accounts.length === 0) {
    return (
      <div className="rounded-2xl px-4 py-4 flex flex-col gap-2"
        style={{ background: "#FFFBF0", border: "1px solid #FFE4A0" }}>
        <p className="text-xs font-bold" style={{ color: "#A07000" }}>No bank account linked</p>
        <p className="text-[11px]" style={{ color: "#A07000" }}>
          You need a bank account to receive NGN from your sale.
        </p>
        <button type="button"
          onClick={() => navigate({ to: ROUTES.PROFILE, search: { section: "bank" } })}
          className="self-start text-[11px] font-bold underline"
          style={{ color: "#F7A600" }}>
          Add a bank account →
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#9A9A9A" }}>
        Payout Account
      </p>

      {/* All accounts as a radio list */}
      {accounts.map((acct) => (
        <BankAccountRow
          key={acct.id}
          account={acct}
          selected={acct.id === selectedId}
          accentColor={accentColor}
          onSelect={() => onPayoutAccountChange?.(acct.id)}
        />
      ))}

      {/* Manage accounts link */}
      <button type="button"
        onClick={() => navigate({ to: ROUTES.PROFILE, search: { section: "bank" } })}
        className="text-[11px] font-semibold text-left"
        style={{ color: "#9A9A9A" }}>
        Manage bank accounts →
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DashboardTradeStep1({
  tradeType, availableTokens, selectedToken, setSelectedToken,
  isInitiatingTrade, isRateLoading, onProceed,
  availableCurrencies, selectedCurrency, setSelectedCurrency,
  amountToBuy, setAmountToBuy,
  handleFocusAmountToBuy, handleBlurAmountToBuy,
  walletAddress, onWalletAddressChange,
  selectedNetwork, onNetworkChange,
  orderDetails: _orderDetails,
  savedWallets,
  userBankAccounts, selectedPayoutAccountId, onPayoutAccountChange,
  sellDepositWallet, isGeneratingDepositWallet, sellNetwork, onSellNetworkChange,
}: DashboardTradeStep1Props) {
  const isBuy = tradeType === "buy";
  const accentColor = isBuy ? "#948EEE" : "#F7A600";

  const hasBankAccounts = (userBankAccounts?.length ?? 0) > 0;
  const noBankAccounts = !isBuy && !hasBankAccounts;

  const buySubmitDisabled = isBuy && (!amountToBuy || Number(amountToBuy) <= 0 || !walletAddress?.trim());
  const activeNetwork = (!isBuy && selectedToken)
    ? (sellNetwork ?? selectedToken.networks?.[0])
    : undefined;
  const sellWalletLoading = !isBuy && !!selectedToken && (
    isGeneratingDepositWallet ||
    !sellDepositWallet ||
    (activeNetwork && sellDepositWallet?.network !== activeNetwork)
  );

  const isCtaBusy = isInitiatingTrade || (!!selectedToken && isRateLoading) || sellWalletLoading;
  const ctaLabel = isInitiatingTrade
    ? "Processing…"
    : (isRateLoading && selectedToken)
      ? "Loading rate…"
      : sellWalletLoading
        ? "Getting deposit address…"
        : noBankAccounts
          ? "Add a bank account first"
          : selectedToken
            ? `${isBuy ? "Buy" : "Sell"} ${selectedToken.symbol} — Continue`
            : "Select a Crypto to Continue";

  const ctaDisabled = !selectedToken || isCtaBusy || noBankAccounts || buySubmitDisabled;

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="mb-1">
        <h2 className="text-lg font-extrabold" style={{ color: "#0E0F0C" }}>
          {isBuy ? "Buy Crypto" : "Sell Crypto"}
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "#9A9A9A" }}>
          {isBuy ? "Choose what to buy" : "Choose what to sell"}
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-2xl px-4 py-3"
        style={{ background: isBuy ? "#EEF0FF" : "#FFFBF0", border: `1px solid ${isBuy ? "#C7CAFF" : "#FFE4A0"}` }}>
        <span className="text-base leading-none mt-0.5">{isBuy ? "💳" : "📤"}</span>
        <p className="text-xs leading-relaxed" style={{ color: isBuy ? "#5B5EA6" : "#A07000" }}>
          {isBuy
            ? "Pay with NGN bank transfer. We verify your payment and send crypto directly to your wallet within 5 minutes."
            : "Send crypto to your unique wallet. We auto-detect receipt and instantly send NGN to your bank. Zero action needed after sending."}
        </p>
      </div>

      {/* Crypto grid — 2×2 */}
      <div className="grid grid-cols-2 gap-3">
        {availableTokens.map((token) => {
          const selected = selectedToken?.id === token.id;
          const rate = isBuy ? token.buyRate : token.sellRate;
          const rateLabel = rate ? `${isBuy ? "Buy" : "Sell"}: ₦${Number(rate).toLocaleString()}` : "";
          return (
            <motion.button key={token.id} type="button"
              onClick={() => setSelectedToken(token)}
              whileTap={{ scale: 0.97 }}
              className="relative flex flex-col items-center gap-2.5 rounded-2xl p-4 transition-all"
              style={{
                background: selected ? (isBuy ? "#EEF0FF" : "#FFFBF0") : "#FAFAFA",
                border: selected ? `2px solid ${accentColor}` : "2px solid #F0F0F0",
              }}>
              {selected && (
                <span className="absolute top-2.5 right-2.5">
                  <CheckCircle size={15} style={{ color: accentColor }} />
                </span>
              )}
              <CryptoIcon symbol={token.symbol} icon={token.logoUrl} />
              <div className="text-center">
                <p className="text-sm font-extrabold" style={{ color: "#0E0F0C" }}>{token.symbol}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#9A9A9A" }}>{token.name}</p>
                {rateLabel && (
                  <p className="text-[10px] font-bold mt-1" style={{ color: accentColor }}>{rateLabel}</p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* BUY: amount + wallet fields (shown when token is selected) */}
      {isBuy && selectedToken && (
        <BuyFields
          selectedToken={selectedToken}
          availableCurrencies={availableCurrencies}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          amountToBuy={amountToBuy}
          setAmountToBuy={setAmountToBuy}
          handleFocusAmountToBuy={handleFocusAmountToBuy}
          handleBlurAmountToBuy={handleBlurAmountToBuy}
          walletAddress={walletAddress}
          onWalletAddressChange={onWalletAddressChange}
          selectedNetwork={selectedNetwork}
          onNetworkChange={onNetworkChange}
          savedWallets={savedWallets}
        />
      )}

      {/* SELL: payout bank selector */}
      {!isBuy && (
        <SellPayoutBank
          userBankAccounts={userBankAccounts}
          selectedPayoutAccountId={selectedPayoutAccountId}
          onPayoutAccountChange={onPayoutAccountChange}
        />
      )}

      {/* SELL: deposit wallet address (shown when token selected) */}
      {!isBuy && selectedToken && (
        <SellDepositWalletSection
          depositWallet={sellDepositWallet}
          isGenerating={isGeneratingDepositWallet}
          selectedToken={selectedToken}
          sellNetwork={sellNetwork}
          onSellNetworkChange={onSellNetworkChange}
        />
      )}

      {/* CTA */}
      <button
        type="button"
        disabled={ctaDisabled}
        onClick={() => !ctaDisabled && onProceed()}
        className="w-full py-4 rounded-2xl text-sm font-bold transition-all mt-1"
        style={{
          background: !ctaDisabled
            ? `linear-gradient(135deg, ${accentColor}, ${isBuy ? "#6B45D0" : "#E09000"})`
            : "#F0F0F0",
          color: !ctaDisabled ? "#FFFFFF" : "#9A9A9A",
          boxShadow: !ctaDisabled ? `0 6px 20px ${accentColor}44` : "none",
        }}>
        {ctaLabel}
      </button>
    </div>
  );
}
