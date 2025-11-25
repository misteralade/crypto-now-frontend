import {Fragment, useEffect, useState} from "react";
import {AlertCircle, X} from "lucide-react";
import type {AllBanksResponse} from "../../../../types/response.payload.types.ts";
import type {CreateBankAccountRequestPayload} from "../../../../types/request.payload.types.ts";
import BankSelector from "../../../global/BankSelector.tsx";
import { CustomInput } from "../../../global/CustomInput.tsx";

interface NewBankAccountModalProps {
  isOpen: boolean;
  banks: AllBanksResponse[]
  selectedBankId: string;
  onClose: () => void;
  onSubmit: () => void;
  handleChangeField: (field: keyof CreateBankAccountRequestPayload, value: any) => void;
}

const NewBankAccountModal = ({ isOpen, banks, selectedBankId, onClose, onSubmit, handleChangeField }: NewBankAccountModalProps) => {
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleSubmit = () => {
    setAccountNumber('');
    setAccountName('');
    onSubmit();
  }
  
  if (!isOpen) return null

  return (
    <Fragment>
      <div className="z-50 fixed inset-0 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
        
        {/* Modal */}
        <div className="max-w-2xl relative bg-white rounded-2xl shadow-xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-8 md:p-10">
            {/* Header */}
            <div className="flex items-start justify-between">
              <h2 className="text-3xl font-semibold text-titleColor">Create New Bank</h2>
              <button onClick={onClose}>
                <X className="w-6 h-6"/>
              </button>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-amber-800 font-medium">
                  Important: Account holder name must match your profile name
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Ensure the name on your bank account matches the name registered on your profile. Any mismatch may result in verification failure.
                </p>
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <BankSelector
                  label="Select Bank"
                  options={banks}
                  value={selectedBankId}
                  onValueChange={(value) => {
                    handleChangeField("bankId", value)
                  }}
                />
                
                <CustomInput
                  label="Account Holder name"
                  type="text"
                  value={accountName}
                  onChange={(e) => {
                    handleChangeField("accountName", e.target.value)
                    setAccountName(e.target.value)
                  }}
                />
                
                <CustomInput
                  label="Account number"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value)
                    handleChangeField("accountNumber", e.target.value)
                  }}
                />
                
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="isActive"
                      type="checkbox"
                      className="sr-only peer"
                      onChange={(e) => handleChangeField("isDefault", e.target.checked)}
                      defaultChecked={false}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c7c97] peer-checked:after:bg-[#03034D]"></div>
                  </label>
                  <span className="text-[16px] font-semibold text-[#454745]">Default Bank</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-full text-gray-700 font-semibold text-base hover:bg-gray-100 transition-colors hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 h-12 rounded-full font-semibold text-base bg-[#1a1f5c] transition-colors text-white disabled:bg-gray-300 disabled:text-gray-500 hover:bg-[#151842] hover:cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default NewBankAccountModal;
