import type {UserCreateCryptoWalletRequestPayload} from "../../types/request.payload.types.ts";

export const userCreateWalletInitialState: UserCreateCryptoWalletRequestPayload = {
  walletAddress: "",
  network: "",
  isVerified: false,
  isPrimary: false,
  walletLabel: null,
}

export const userCreateWalletFromProfileInitialState: UserCreateCryptoWalletRequestPayload = {
  walletAddress: "",
  network: "",
  isVerified: false,
  isPrimary: false,
  cryptoId: '',
  walletLabel: null,
}