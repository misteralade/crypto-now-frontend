import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass,
  Bank,
  UploadSimple,
  Eye,
  Wallet,
  ArrowsLeftRight,
  CoinVertical,
  PaperPlaneTilt,
  CheckCircle,
  ChatCircleDots,
} from "@phosphor-icons/react";
import PublicNavbar from "../components/global/navbar/PublicNavbar.tsx";
import FooterNew from "../components/pages/homepage/FooterNew.tsx";
import CustomButton from "../components/global/Button.tsx";
import { useTradeCryptoCurrenciesButton } from "../hooks/components/useTradeCryptoCurrenciesButton.ts";

type FlowKey = "buy" | "sell";

type Step = {
  icon: typeof MagnifyingGlass;
  label: string;
  title: string;
  body: string;
  actor: "You" | "CryptoNow";
};

const BUY_STEPS: Step[] = [
  {
    icon: MagnifyingGlass,
    label: "Step 1",
    title: "Check the current rate",
    body: "Select your cryptocurrency and amount to see the current exchange rate and the amount you will pay.",
    actor: "You",
  },
  {
    icon: Bank,
    label: "Step 2",
    title: "Pay by bank transfer",
    body: "Transfer the naira amount to the platform bank account displayed on your transaction screen.",
    actor: "You",
  },
  {
    icon: UploadSimple,
    label: "Step 3",
    title: "Upload your receipt",
    body: "Attach your payment receipt so our team can verify the transfer.",
    actor: "You",
  },
  {
    icon: Eye,
    label: "Step 4",
    title: "Payment verification",
    body: "Our team verifies your transfer against the submitted receipt.",
    actor: "CryptoNow",
  },
  {
    icon: Wallet,
    label: "Step 5",
    title: "Receive your crypto",
    body: "Once payment is verified, we send your crypto to the wallet address you provided.",
    actor: "CryptoNow",
  },
];

const SELL_STEPS: Step[] = [
  {
    icon: MagnifyingGlass,
    label: "Step 1",
    title: "Enter your sell amount",
    body: "Choose the cryptocurrency you want to sell, enter the amount, and provide your Nigerian bank account.",
    actor: "You",
  },
  {
    icon: PaperPlaneTilt,
    label: "Step 2",
    title: "Send your crypto",
    body: "We assign a dedicated deposit address for your transaction so you can send your crypto.",
    actor: "You",
  },
  {
    icon: ArrowsLeftRight,
    label: "Step 3",
    title: "Network confirmation",
    body: "Our system detects your deposit on the blockchain and monitors the required network confirmations.",
    actor: "CryptoNow",
  },
  {
    icon: CoinVertical,
    label: "Step 4",
    title: "Automated bank payout",
    body: "As soon as your crypto deposit confirms, our system automatically initiates the bank transfer to your account.",
    actor: "CryptoNow",
  },
  {
    icon: CheckCircle,
    label: "Step 5",
    title: "Naira in your bank account",
    body: "The payout completes directly into your Nigerian bank account with full status tracking.",
    actor: "CryptoNow",
  },
];

const StepRow = ({ step, index, isLast }: { step: Step; index: number; isLast: boolean }) => {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-start gap-5 pb-10"
    >
      {!isLast && (
        <div
          className="absolute left-6 top-14 bottom-0 w-px"
          style={{ background: "rgba(148,142,238,0.18)" }}
        />
      )}

      <div
        className="relative z-10 shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: "#F3F2FD", border: "1px solid rgba(148,142,238,0.25)" }}
      >
        <Icon size={22} weight="duotone" color="#6F63E8" />
      </div>

      <div className="flex-1 pt-1">
        <div className="flex items-center gap-2 mb-1.5">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "#8C87E6", fontFamily: "'DM Sans', sans-serif" }}
          >
            {step.label}
          </p>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              color: step.actor === "You" ? "#0E0F0C" : "#6F63E8",
              background: step.actor === "You" ? "#F0F0F0" : "#F3F2FD",
            }}
          >
            {step.actor === "You" ? "You do this" : "We do this"}
          </span>
        </div>
        <h3
          className="text-lg sm:text-xl font-semibold mb-1.5 leading-snug"
          style={{ color: "#0E0F0C", fontFamily: "'DM Sans', sans-serif" }}
        >
          {step.title}
        </h3>
        <p
          className="text-sm sm:text-[15px] leading-relaxed max-w-md"
          style={{ color: "#6B6E6B", fontFamily: "'DM Sans', sans-serif" }}
        >
          {step.body}
        </p>
      </div>
    </motion.div>
  );
};

const HowItWorksPage = () => {
  const [flow, setFlow] = useState<FlowKey>("buy");
  const { handleTradeCrypto } = useTradeCryptoCurrenciesButton();
  const steps = flow === "buy" ? BUY_STEPS : SELL_STEPS;

  return (
    <div style={{ background: "#FAF9F7", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <PublicNavbar />

      <main className="w-full md:w-[90%] 2xl:max-w-5xl mx-auto px-4 md:px-0 mt-[48px] mb-[80px]">
        {/* Intro */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em] mb-3"
            style={{ color: "#8C87E6" }}
          >
            How it works
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4"
            style={{ color: "#0E0F0C" }}
          >
            What actually happens<br />when you trade.
          </h1>
          <p className="text-base" style={{ color: "#6B6E6B" }}>
            Here is how buying and selling works on CryptoNow, step by step.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-14">
          <div
            className="inline-flex p-1 rounded-full"
            style={{ background: "#F0EFFB", border: "1px solid rgba(148,142,238,0.2)" }}
          >
            {(["buy", "sell"] as FlowKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFlow(key)}
                className="relative px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200"
                style={{ color: flow === key ? "#fff" : "#6B6E6B" }}
              >
                {flow === key && (
                  <motion.div
                    layoutId="flow-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "#03034D" }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
                <span className="relative z-10">
                  {key === "buy" ? "Buying crypto" : "Selling crypto"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-xl mx-auto mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={flow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {steps.map((step, i) => (
                <StepRow key={step.title} step={step} index={i} isLast={i === steps.length - 1} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Trust / dispute note */}
        <div
          className="max-w-xl mx-auto rounded-2xl p-6 sm:p-8 mb-16 flex items-start gap-5"
          style={{ background: "#0E0F0C" }}
        >
          <div
            className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(148,142,238,0.15)" }}
          >
            <ChatCircleDots size={20} weight="duotone" color="#948EEE" />
          </div>
          <div>
            <h3 className="text-base font-semibold mb-1.5" style={{ color: "#fff" }}>
              If something looks off, you're not stuck.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Open a dispute from your dashboard for any transaction. It goes to a
              real person on our team, with a message thread you can follow until
              it's resolved.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center text-center">
          <p className="text-sm mb-4" style={{ color: "#6B6E6B" }}>
            Ready to see your rate?
          </p>
          <CustomButton onClick={handleTradeCrypto} buttonText="Buy & sell crypto now" />
        </div>
      </main>

      <FooterNew />
    </div>
  );
};

export default HowItWorksPage;
