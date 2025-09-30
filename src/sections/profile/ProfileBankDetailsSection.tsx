import {CustomInput} from "../../components/global/CustomInput.tsx";
import BankSelector from "../../components/global/BankSelector.tsx";
import type {AllBanksResponse} from "../../types/response.payload.types.ts";

interface ProfileBankDetailsSectionProps {
    selectedBank: string
    accountHolderName: string
    accountNumber: string
    banks?: AllBanksResponse[]
    onBankChange: (value: string) => void
    onAccountHolderNameChange: (value: string) => void
    onAccountNumberChange: (value: string) => void
}

export default function ProfileBankDetailsSection({
                                               selectedBank,
                                               accountHolderName,
                                               accountNumber,
                                               banks,
                                               onBankChange,
                                               onAccountHolderNameChange,
                                               onAccountNumberChange,
                                           }: ProfileBankDetailsSectionProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg">Bank details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <BankSelector
                    label="Select Bank"
                    options={banks}
                    value={selectedBank}
                    onValueChange={onBankChange}
                />
                <CustomInput
                    label="Account Holder name"
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => onAccountHolderNameChange(e.target.value)}
                />
            </div>
            <CustomInput
                label="Account number"
                type="text"
                value={accountNumber}
                onChange={(e) => onAccountNumberChange(e.target.value)}
                className="md:w-1/2 md:pr-3"
            />
        </div>
    )
}
