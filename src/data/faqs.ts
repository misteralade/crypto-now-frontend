export type FAQ = {
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    question: "How is your rate different from other exchanges?",
    answer:
      "We don't charge a separate percentage fee on top of a market rate. The buy/sell rate you see on the Rates page is the rate you get — and it locks for 5 minutes the moment you start a trade, so a price swing mid-transaction doesn't cost you.",
  },
  {
    question: "Why should I trust a rate lock instead of a live market price?",
    answer:
      "Because a live price that keeps moving while your bank transfer is in flight isn't a price you can actually plan around. Locking it for 5 minutes means the number you agreed to is the number you get paid — checked by a human before funds move, not just an algorithm.",
  },
  {
    question: "How fast does payout actually land?",
    answer:
      "Selling crypto for Naira is fully automated once your transfer confirms on-chain — most payouts land in minutes. Buying crypto with Naira is reviewed and fulfilled by our team, typically the same day.",
  },
  {
    question: "Do you hold my crypto or funds?",
    answer:
      "When you sell, your crypto moves to a secure custodial wallet only for the duration of that transaction, and Naira is paid out as soon as it clears — we don't hold balances long-term. When you buy, funds move directly to the wallet address you provide.",
  },
  {
    question: "Is CryptoNow for beginners or experienced traders?",
    answer:
      "Both, but the rate lock and fast payout mainly matter if you already trade — new users get the same simple flow, higher-volume traders get KYC Tier 2 limits and priority review.",
  },
  {
    question: "What happens if a transaction doesn't go well?",
    answer:
      "Every transaction is logged and traceable. If something goes wrong — a bank delay, a network issue — you can open a dispute directly from your dashboard and a person on our team resolves it, not a bot.",
  },
  {
    question: "Is CryptoNow available outside Nigeria?",
    answer:
      "Yes — you can trade from anywhere, but every transaction settles in Naira only.",
  },
];
