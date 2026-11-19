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
  CHECK_EMAIL: "/check-email",
  TWO_FACTOR_VERIFY: "/sign-in/verify",
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  ORGANIZATIONS: "/dashboard/organizations",
  PROFILE: '/dashboard/profile',
  DASHBOARD_BUY: "/dashboard/buy",
  DASHBOARD_SELL: "/dashboard/sell",
  TRANSACTION: '/dashboard/transactions',
  TRANSACTION_DETAILS: '/dashboard/transactions/$id',
  DASHBOARD_WALLETS: '/dashboard/wallets',
  DASHBOARD_KYC: '/dashboard/kyc',
  NOTIFICATIONS: '/dashboard/notifications',
  KYC: '/kyc',
  DISPUTE_DETAILS: '/dashboard/disputes/$id',
  DISPUTE_LEGACY: '/dispute/$id',


  ABOUT: "/about",
  HOW_IT_WORKS: "/how-it-works",
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
    WHATSAPP: "https://wa.link/hvuyx7"
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

export const BUY_PAYMENT_PENDING_STATUSES = {
  INITIATED: "INITIATED",
  AWAITING_PAYMENT: "AWAITING_PAYMENT",
} as const;

import { TRANSACTION_STATUS_CONFIG } from "./transaction.util.ts";

export const transactionStatusMessages: Record<string, { title: string; message: string }> =
  Object.fromEntries(
    Object.entries(TRANSACTION_STATUS_CONFIG).map(([status, config]) => [
      status,
      { title: config.title, message: config.message },
    ])
  );

export const transactionStatusStyles: Record<
  string,
  { text: string; bg: string; dot: string; textColor: string; message: string }
> = Object.fromEntries(
  Object.entries(TRANSACTION_STATUS_CONFIG).map(([status, config]) => [
    status,
    {
      text: config.displayName,
      bg: config.bgColor,
      dot: config.dotColor,
      textColor: config.textColor,
      message: config.message,
    },
  ])
);

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
