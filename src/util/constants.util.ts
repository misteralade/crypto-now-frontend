export const TIME_IN_MILLISECONDS = {
  THREE_SECONDS: 3 * 1000,
  FIVE_HUNDRED_MILLISECONDS: 500,
  ONE_SECOND: 1000,
  FIVE_SECONDS: 5 * 1000,
  TEN_SECONDS: 10 * 1000,
  ONE_HUNDRED_TWENTY_SECONDS: 120 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
}

export const ROUTES = {
  HOMEPAGE: "/",
  SIGNIN: "/sign-in",
  FORGOT_PASSWORD: "forgot-password",
  SIGNUP: "/sign-up",
  TWO_FACTOR_VERIFY: "/sign-in/verify",
  DASHBOARD: "/dashboard",
  ORGANIZATIONS: "/dashboard/organizations",
  PROFILE: '/dashboard/profile',
  DASHBOARD_TRADE: "/dashboard",
  DASHBOARD_TRADE_SESSION: "/dashboard",
  TRANSACTION: '/dashboard/transactions',
  TRANSACTION_DETAILS: '/dashboard/transactions/$id',
  DASHBOARD_WALLETS: '/dashboard/wallets',
  DASHBOARD_KYC: '/dashboard/kyc',
  NOTIFICATIONS: '/dashboard/notifications',
  KYC: '/kyc',
  DISPUTE_DETAILS: '/dispute/$id',


  ABOUT: "/about",
  CONTACT: "/contact",
  TERMS_OF_SERVICES: "/terms-of-service",
  PRIVACY_POLICY: "/privacy-policy",
  AML_POLICY: "aml-policy",
  RATES: "/rates",
  SECURITY_POLICY: "/security-policy",
  
  SOCIALS: {
    FACEBOOK: "https://www.facebook.com/share/1DhKLD85Ho/",
    TIK_TOK: "https://www.tiktok.com/@cryptonownaija?_r=1&_t=ZS-91QM2DxOqpO",
    INSTAGRAM: "https://www.instagram.com/cryptonow.ng?igsh=MTZqZWk5enRiMjQ2Zg==",
    TWITTER: "https://x.com/cryptonownaija?t=wQ23QgGSUyB9YH5fPFXrBw&s=09",
    WHATSAPP: "https://wa.me/message/FASHZ7NI2RSJA1"
  },
  HOMEPAGE_TAG_IDS: {
    FAQ: "faq",
    HOW_IT_WORKS: "how-it-works",
  }
}

export const QUERY_KEYS = {
  LOGIN: "admin-login",
}

export const SESSION_STORAGE_KEYS = {
  SESSION_ID: "transactionSessionId",
  YOU_PAY_VALUE: "youPayValue",
  YOU_RECEIVE_VALUE: "youReceiveValue"
}

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  TRADE_PROGRESS: "TRADE_PROGRESS_V1",
  LAST_TRADE_TOKEN: "LAST_TRADE_TOKEN_V1",
}

export const transactionStatusMessages: Record<string, { title: string, message: string }> = {
  INITIATED: {
    title: 'Transaction Initiated',
    message: 'Your transaction has been initiated. Please proceed to make the payment using the provided details.'
  },
  AWAITING_PAYMENT: {
    title: 'Payment Account Confirmed',
    message: 'Your transaction is pending admin confirmation. You\'ll receive an email notification once it\'s been verified.'
  },
  IN_REVIEW: {
    title: 'In Review',
    message: 'Your payment receipt has been submitted and is now being reviewed by our team.'
  },
  PROCESSING: {
    title: 'Processing Transaction',
    message: 'Your transaction is being processed. This may take a few moments.'
  },
  AWAITING_CRYPTO: {
    title: 'Awaiting Crypto Transfer',
    message: 'We are awaiting the cryptocurrency transfer to complete your transaction.'
  },
  COMPLETED: {
    title: 'Transaction Completed',
    message: 'Your transaction has been successfully completed. Thank you for using our service!'
  },
  FAILED: {
    title: 'Transaction Failed',
    message: 'Unfortunately, your transaction has failed. Please contact support for further assistance.'
  },
  EXPIRED: {
    title: 'Transaction Expired',
    message: 'Your transaction has expired due to non-payment. Please initiate a new transaction to proceed.'
  },
  CANCELLED: {
    title: 'Transaction Cancelled',
    message: 'Your transaction has been cancelled. If this was a mistake, please start a new transaction.'
  },
  DISPUTED: {
    title: 'Transaction Disputed',
    message: 'Your transaction is currently under dispute. Our support team will review the case and the reason will be shown with the transaction details.'
  },
  REFUNDED: {
    title: 'Refund Completed',
    message: 'Your refund has been processed successfully and the funds have been returned to your original payment method.'
  },
  DEPOSIT_DETECTED: {
    title: 'Deposit Detected',
    message: 'We have detected your deposit on the blockchain. Waiting for network confirmations.'
  },
  PENDING_CONFIRMATION: {
    title: 'Pending Confirmation',
    message: 'We detected your deposit and are rechecking it until the network confirms it.'
  },
  DEPOSIT_PENDING_MINIMUM: {
    title: 'Deposit Pending Minimum',
    message: 'We received your deposit, but the total is still below the minimum required amount. Send the remaining amount to the same wallet and we will continue automatically.'
  },
  DEPOSIT_CONFIRMED: {
    title: 'Deposit Confirmed',
    message: 'Your deposit has been confirmed. We are now processing your payout to your bank account.'
  },
  NO_OWNER: {
    title: 'Deposit Recorded Without Owner',
    message: 'We received a deposit on a guest wallet, but no transaction owner was linked. The wallet has been retired and the deposit is held for accounting review.'
  },
  PAYOUT_INITIATED: {
    title: 'Payout Initiated',
    message: 'Your payout has been initiated and is currently being processed by the bank.'
  },
  PAYOUT_FAILED: {
    title: 'Payout Failed',
    message: 'The payout to your bank account failed. This usually happens if bank details are incorrect or missing.'
  }
}

export const transactionStatusStyles: Record<
  string,
  { text: string; bg: string; dot: string; textColor: string, message: string }
> = {
  INITIATED: {
    text: 'Pending',
    bg: 'bg-orange-50',
    dot: 'bg-orange-400',
    textColor: 'text-orange-600',
    message: `Your transaction has been initiated. Please proceed to make the payment using the provided details.`
  },
  AWAITING_PAYMENT: {
    text: 'Pending',
    bg: 'bg-yellow-50',
    dot: 'bg-yellow-400',
    textColor: 'text-yellow-600',
    message: `We are awaiting your payment. Please ensure to complete the payment within the stipulated time.`
  },
  IN_REVIEW: {
    text: 'In Review',
    bg: 'bg-amber-50',
    dot: 'bg-amber-500',
    textColor: 'text-amber-700',
    message: `Your payment receipt has been submitted and is now being reviewed by our team.`
  },
  PROCESSING: {
    text: 'Pending',
    bg: 'bg-blue-50',
    dot: 'bg-blue-500',
    textColor: 'text-blue-600',
    message: `Your transaction is being processed. This may take a few moments.`
  },
  AWAITING_CRYPTO: {
    text: 'Pending',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
    message: `We are awaiting the cryptocurrency transfer to complete your transaction.`
  },
  DEPOSIT_DETECTED: {
    text: 'Pending',
    bg: 'bg-amber-50',
    dot: 'bg-amber-400',
    textColor: 'text-amber-600',
    message: `We have detected your deposit on the blockchain. Waiting for network confirmations.`
  },
  PENDING_CONFIRMATION: {
    text: 'Pending',
    bg: 'bg-amber-50',
    dot: 'bg-amber-400',
    textColor: 'text-amber-600',
    message: `We detected your deposit and are rechecking it until the network confirms it.`
  },
  DEPOSIT_PENDING_MINIMUM: {
    text: 'Pending',
    bg: 'bg-orange-50',
    dot: 'bg-orange-400',
    textColor: 'text-orange-600',
    message: `We received your deposit, but it is still below the minimum required amount.`
  },
  DEPOSIT_CONFIRMED: {
    text: 'Pending',
    bg: 'bg-green-50',
    dot: 'bg-green-400',
    textColor: 'text-green-600',
    message: `Your deposit has been confirmed. We are now processing your payout to your bank account.`
  },
  NO_OWNER: {
    text: 'No Owner',
    bg: 'bg-amber-50',
    dot: 'bg-amber-500',
    textColor: 'text-amber-700',
    message: `We received a deposit on a guest wallet, but no transaction owner was linked. The wallet has been retired and the deposit is held for accounting review.`
  },
  PAYOUT_INITIATED: {
    text: 'Pending',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
    message: `Your payout has been initiated and is currently being processed by the bank.`
  },
  COMPLETED: {
    text: 'Completed',
    bg: 'bg-green-50',
    dot: 'bg-green-500',
    textColor: 'text-green-600',
    message: `Your transaction has been successfully completed. Thank you for using our service!`
  },
  FAILED: {
    text: 'Failed',
    bg: 'bg-red-50',
    dot: 'bg-red-400',
    textColor: 'text-red-600',
    message: `Unfortunately, your transaction has failed. Please contact support for further assistance.`
  },
  PAYOUT_FAILED: {
    text: 'Failed',
    bg: 'bg-red-50',
    dot: 'bg-red-400',
    textColor: 'text-red-600',
    message: `The payout to your bank account failed. This usually happens if bank details are incorrect or missing.`
  },
  EXPIRED: {
    text: 'Failed',
    bg: 'bg-gray-100',
    dot: 'bg-gray-500',
    textColor: 'text-gray-700',
    message: `Your transaction has expired due to non-payment. Please initiate a new transaction to proceed.`
  },
  CANCELLED: {
    text: 'Cancelled',
    bg: 'bg-gray-100',
    dot: 'bg-gray-500',
    textColor: 'text-gray-700',
    message: `Your transaction has been cancelled. If this was a mistake, please start a new transaction.`
  },
  DISPUTED: {
    text: 'Disputed',
    bg: 'bg-red-50',
    dot: 'bg-red-400',
    textColor: 'text-red-600',
    message: `Your transaction is currently under dispute. Our support team will review the case and get back to you shortly.`
  },
  REFUNDED: {
    text: 'Refunded',
    bg: 'bg-emerald-50',
    dot: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    message: `Your refund has been processed successfully and the funds have been returned to your original payment method.`
  },
  
}

export const ATTACHMENT_TYPE = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  PDF: 'PDF',
  DOCUMENT: 'DOCUMENT',
  AUDIO: 'AUDIO',
  SPREADSHEET: 'SPREADSHEET',
  OTHER: 'OTHER',
} as const;

// Type derived from the const object
export type AttachmentType = typeof ATTACHMENT_TYPE[keyof typeof ATTACHMENT_TYPE];

// Legacy FileType as const object (keep for backward compatibility if needed)
export const FileType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  PDF: 'PDF',
  DOCUMENT: 'DOCUMENT',
  AUDIO: 'AUDIO',
  SPREADSHEET: 'SPREADSHEET',
} as const;

// Type derived from FileType
export type FileTypeValue = typeof FileType[keyof typeof FileType];

// Other constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_PER_DISPUTE = 5;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'] as const;
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo'] as const;
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
] as const;
export const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg'] as const;
export const ALLOWED_SPREADSHEET_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
] as const;

export const TESTIMONIAL_CONTENT_TYPES = {
  VIDEO: 'VIDEO',
  IMAGE: 'IMAGE',
  TEXT: 'TEXT',
} as const;

export type TestimonialContentType = typeof TESTIMONIAL_CONTENT_TYPES[keyof typeof TESTIMONIAL_CONTENT_TYPES];

export const cryptoNetworkTypes = [
  "BTC",
  "ERC20",
  "TRC20",
  // "BEP20",
  "SOLANA",
  // "POLYGON",
  // "ARBITRUM",
  // "OPTIMISM",
  // "AVALANCHE",
  // "FANTOM",
  // "BSC",
  // "CARDANO",
  // "POLKADOT",
  // "COSMOS",
  // "TERRA",
  // "NEAR",
  // "HARMONY",
  // "MOONBEAM",
  // "CRONOS",
  // "KCC",
  // "HECO",
  // "XDAI",
  // "CELO",
  // "ALGORAND",
  // "TEZOS",
  // "ELROND",
  // "KLAYTN",
  // "OKEX",
]
