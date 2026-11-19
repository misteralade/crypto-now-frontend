export type FAQ = {
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    question: "How are your exchange rates calculated?",
    answer:
      "We quote live rates for supported cryptocurrencies against the naira. What you see during the quote is the rate used for your transaction, with no hidden percentage markups.",
  },
  {
    question: "How long does a bank payout take?",
    answer:
      "When selling crypto for naira, our system initiates your bank transfer as soon as your deposit confirms on the blockchain. Most payouts arrive in your Nigerian bank account within minutes.",
  },
  {
    question: "How does buying crypto with naira work?",
    answer:
      "When buying crypto, you transfer naira to our designated platform bank account and upload your payment receipt. Our team verifies the transfer and sends the crypto directly to your wallet address.",
  },
  {
    question: "Do you hold custody of my funds long term?",
    answer:
      "No. For sell orders, your crypto is held only for the duration of the exchange until network confirmations clear and the bank payout is sent. For buy orders, the crypto is delivered directly to your external wallet.",
  },
  {
    question: "Can I trade without creating an account?",
    answer:
      "Yes. You can complete a guest trade with just your email and payout details. If you want higher transaction limits and full transaction history, you can create and verify a registered account.",
  },
  {
    question: "What happens if there is an issue with my transaction?",
    answer:
      "Every transaction has a traceable session ID. If a transfer is delayed or an error occurs, you can open a dispute directly from the transaction page to get help from our support team.",
  },
  {
    question: "Can I use CryptoNow from outside Nigeria?",
    answer:
      "You can initiate transactions from anywhere, but bank payouts and fiat payments settle in naira through Nigerian bank accounts.",
  },
];
