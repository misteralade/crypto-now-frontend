export const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,}$/;

// Wallet address regex pattern
// Supports:
// - Ethereum/EVM chains: 0x followed by 40 hex characters (0x[a-fA-F0-9]{40})
// - Bitcoin: Starts with 1 or 3, followed by 25-34 alphanumeric characters (excluding 0, O, I, l)
// - Solana and other Base58: 32-44 alphanumeric characters (excluding 0, O, I, l)
// - General crypto addresses: 26-95 alphanumeric characters
export const walletAddressRegex = /^(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|[A-HJ-NP-Za-km-z1-9]{26,95})$/;
