import type {BankDetailsData} from "../../types/trade.types.ts";
import DetailDisplay from "./DetailDisplay.tsx";

interface BankDetailsProps {
    bankData: BankDetailsData
}

export default function BankDetails ({bankData}: BankDetailsProps) {
    return(
        <div className={`space-y-7`}>
            <h2 className="text-2xl font-medium text-center">Confirm your bank details</h2>

            <div className="space-y-4">
                <DetailDisplay title={`Account Name`} value={bankData.bankName} />
                <DetailDisplay title={'account number'} value={bankData.accountNumber} />
                <DetailDisplay title={'bank name'} value={bankData.bankName} />
            </div>
        </div>
    )
}