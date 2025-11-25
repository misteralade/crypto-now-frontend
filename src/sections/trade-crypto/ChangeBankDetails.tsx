import { useState } from "react"
import { CustomInput } from "../../components/global/CustomInput.tsx";
import {useBankQuery} from "../../queries/bank.query.ts";
import BankSelector from "../../components/global/BankSelector.tsx";
import {useDispatch} from "react-redux";
import {setNewBankAccount} from "../../redux/bank.slice.ts";

interface BankDetailsProps {
  onConfirm: () => void
  onGoBack: () => void
  canGoBack?: boolean // Optional prop to control go back availability
}

export default function ChangeBankDetails({ onConfirm, onGoBack, canGoBack = true }: BankDetailsProps) {
  const dispatch = useDispatch();

  const { allBanks, loadingAllBanks } = useBankQuery();

  const [selectedBank, setSelectedBank] = useState("")
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")

  const handleConfirm = () => {
    if (selectedBank && accountName && accountNumber) {
      dispatch(setNewBankAccount({
        bankId: selectedBank,
        accountName,
        accountNumber,
        isDefault: false,
      }));

      onConfirm()
    }
  }

  const isFormValid = selectedBank && accountName && accountNumber

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-semibold text-center">Bank details</h2>

      <div className="space-y-7">
        <BankSelector
          label="Select Bank"
          placeholder="Select option"
          options={!loadingAllBanks ? allBanks : []}
          value={selectedBank}
          onValueChange={setSelectedBank}
        />

        <CustomInput
          label="Account name"
          type="text"
          placeholder="e.g John doe"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />

        <CustomInput
          label="Account number"
          type="number"
          placeholder="0000000000"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 w-4/5 rounded-full mx-auto">
        {canGoBack && (
          <button
            type="button"
            onClick={onGoBack}
            className="flex-1 h-12 rounded-full text-primary font-semibold text-lg hover:bg-gray-50"
          >
            Go back
          </button>
        )}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!isFormValid}
          className={`${canGoBack ? 'flex-1' : 'w-full'} h-12 rounded-full font-semibold text-lg bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500`}
        >
          Confirm
        </button>
      </div>
    </div>
  )
}