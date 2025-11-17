export const TIME_IN_MILLISECONDS = {
  FIVE_HUNDRED_MILLISECONDS: 500,
  ONE_SECOND: 1000,
  TEN_SECONDS: 10 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
}

export const ROUTES = {
  HOMEPAGE: "/",
  SIGNIN: "/sign-in",
  SIGNUP: "/sign-up",
  TWO_FACTOR_VERIFY: "/sign-in/verify",
  DASHBOARD: "/dashboard",
  ORGANIZATIONS: "/dashboard/organizations",
  TRANSACTION_DETAILS: '/dashboard/transactions/$id',
  PROFILE: '/dashboard/profile',
  TRADE_CRYPTO: "/trade-crypto",
  
  ABOUT: "/about",
  CONTACT: "/contact",
}

export const QUERY_KEYS = {
  LOGIN: "admin-login",
}

export const SESSION_STORAGE_KEYS = {
  SESSION_ID: "transactionSessionId"
}

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  TRADE_PROGRESS: "TRADE_PROGRESS_V1",
}

export const transactionStatusMessages: Record<string, { title: string, message: string }> = {
  INITIATED: {
    title: 'Transaction Initiated',
    message: 'Your transaction has been initiated. Please proceed to make the payment using the provided details.'
  },
  PENDING: {
    title: 'Payment Pending',
    message: 'Your transaction is pending. We are waiting to receive your payment.'
  },
  AWAITING_PAYMENT: {
    title: 'Payment Account Confirmed',
    message: 'Your transaction is pending admin confirmation. You\'ll receive an email notification once it\'s been verified.'
  },
  PAYMENT_RECEIVED: {
    title: 'Payment Received',
    message: 'We have received your payment. It is currently under verification.'
  },
  PAYMENT_CONFIRMED: {
    title: 'Payment Confirmed',
    message: 'Your payment has been confirmed. We are now processing your transaction.'
  },
  PROCESSING: {
    title: 'Processing Transaction',
    message: 'Your transaction is being processed. This may take a few moments.'
  },
  AWAITING_CRYPTO: {
    title: 'Awaiting Crypto Transfer',
    message: 'We are awaiting the cryptocurrency transfer to complete your transaction.'
  },
  CRYPTO_SENT: {
    title: 'Crypto Sent',
    message: 'The cryptocurrency has been sent. We are waiting for it to be received and confirmed.'
  },
  CRYPTO_RECEIVED: {
    title: 'Crypto Received',
    message: 'The cryptocurrency has been received. It is currently under confirmation.'
  },
  CRYPTO_CONFIRMED: {
    title: 'Crypto Confirmed',
    message: 'The cryptocurrency transfer has been confirmed. Your transaction is now complete.'
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
    message: 'Your transaction is currently under dispute. Our support team will review the case and get back to you shortly.'
  },
  REFUNDING: {
    title: 'Refund In Process',
    message: 'Your refund is being processed. This may take a few business days to reflect in your account.'
  },
  REFUNDED: {
    title: 'Refund Completed',
    message: 'Your refund has been successfully processed. Please check your account for the refunded amount.'
  },
  PAYMENT_ACCOUNT_CONFIRMED: {
    title: 'Payment Account Confirmed',
    message: 'Your payment account has been confirmed. You can now proceed with your transactions.'
  }
}

export const transactionStatusStyles: Record<
  string,
  { text: string; bg: string; dot: string; textColor: string, message: string }
> = {
  INITIATED: {
    text: 'Initiated',
    bg: 'bg-orange-50',
    dot: 'bg-orange-400',
    textColor: 'text-orange-600',
    message: `Your transaction has been initiated. Please proceed to make the payment using the provided details.`
  },
  PENDING: {
    text: 'Pending',
    bg: 'bg-orange-50',
    dot: 'bg-orange-400',
    textColor: 'text-orange-600',
    message: `Your transaction is pending. We are waiting to receive your payment.`
  },
  AWAITING_PAYMENT: {
    text: 'Awaiting Payment',
    bg: 'bg-yellow-50',
    dot: 'bg-yellow-400',
    textColor: 'text-yellow-600',
    message: `We are awaiting your payment. Please ensure to complete the payment within the stipulated time.`
  },
  PAYMENT_RECEIVED: {
    text: 'Payment Received',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
    message: `We have received your payment. It is currently under verification.`
  },
  PAYMENT_CONFIRMED: {
    text: 'Payment Confirmed',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
    message: `Your payment has been confirmed. We are now processing your transaction.`
  },
  PROCESSING: {
    text: 'Processing',
    bg: 'bg-blue-50',
    dot: 'bg-blue-500',
    textColor: 'text-blue-600',
    message: `Your transaction is being processed. This may take a few moments.`
  },
  AWAITING_CRYPTO: {
    text: 'Awaiting Crypto',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
    message: `We are awaiting the cryptocurrency transfer to complete your transaction.`
  },
  CRYPTO_SENT: {
    text: 'Crypto Sent',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
    message: `The cryptocurrency has been sent. We are waiting for it to be received and confirmed.`
  },
  CRYPTO_RECEIVED: {
    text: 'Crypto Received',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
    message: `The cryptocurrency has been received. It is currently under confirmation.`
  },
  CRYPTO_CONFIRMED: {
    text: 'Crypto Confirmed',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
    message: `The cryptocurrency transfer has been confirmed. Your transaction is now complete.`
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
  EXPIRED: {
    text: 'Expired',
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
  REFUNDING: {
    text: 'Refunding',
    bg: 'bg-yellow-50',
    dot: 'bg-yellow-400',
    textColor: 'text-yellow-600',
    message: `Your refund is being processed. This may take a few business days to reflect in your account.`
  },
  REFUNDED: {
    text: 'Refunded',
    bg: 'bg-green-50',
    dot: 'bg-green-400',
    textColor: 'text-green-600',
    message: `Your refund has been successfully processed. Please check your account for the refunded amount.`
  },
  PAYMENT_ACCOUNT_CONFIRMED: {
    text: 'Payment Account Confirmed',
    bg: 'bg-blue-50',
    dot: 'bg-blue-400',
    textColor: 'text-blue-600',
    message: `Your payment account has been confirmed. You can now proceed with your transactions.`
  },
}

export const cryptoNetworkTypes = [
  "BTC",
  "ERC20",
  "TRC20",
  "BEP20",
  "SOLANA",
  "POLYGON",
  "ARBITRUM",
  "OPTIMISM",
  "AVALANCHE",
  "FANTOM",
  "BSC",
  "CARDANO",
  "POLKADOT",
  "COSMOS",
  "TERRA",
  "NEAR",
  "HARMONY",
  "MOONBEAM",
  "CRONOS",
  "KCC",
  "HECO",
  "XDAI",
  "CELO",
  "ALGORAND",
  "TEZOS",
  "ELROND",
  "KLAYTN",
  "OKEX",
]
