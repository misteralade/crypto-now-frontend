import type {CreateBankAccountRequestPayload} from "../../types/request.payload.types.ts";

export const createBankInitialState: CreateBankAccountRequestPayload = {
  bankId: null,
  accountName: null,
  accountNumber: null,
  isDefault: true,
}