import {Fragment, useEffect, useState, type ChangeEvent} from "react";
import {AlertCircle, X} from "lucide-react";
import type {AllBanksResponse} from "../../../../types/response.payload.types.ts";
import type {CreateBankAccountRequestPayload} from "../../../../types/request.payload.types.ts";
import BankSelector from "../../../global/BankSelector.tsx";
import { Form, Formik } from "formik";

// Custom input component matching theme
const CustomInput = ({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  inputMode,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  type?: string;
  inputMode?: string;
  error?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        inputMode={inputMode as any}
        value={value}
        onChange={onChange}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        onFocus={() => setIsFocused(true)}
        className={`
          w-full h-14 px-4 pt-4 pb-2
          rounded-2xl
          border transition-all
          bg-white
          text-sm text-[#0E0F0C]
          placeholder-transparent
          focus:outline-none
          ${error
            ? 'border-[#EB5757] ring-2 ring-[#EB5757]/10'
            : isFocused 
              ? 'border-[#03034D] ring-2 ring-[#03034D]/10' 
              : 'border-[#EEEEEE] hover:border-[#BDBDBD]'
          }
        `}
        placeholder={label}
      />
      <label
        className={`
          absolute left-4 transition-all pointer-events-none
          ${hasValue || isFocused
            ? 'top-2 text-[10px] font-semibold'
            : 'top-1/2 -translate-y-1/2 text-sm'
          }
          ${error
            ? 'text-[#EB5757]'
            : isFocused
              ? 'text-[#03034D]'
              : 'text-[#9A9A9A]'
          }
        `}
      >
        {label}
      </label>
    </div>
  );
};

interface NewBankAccountModalProps {
  isOpen: boolean;
  banks: AllBanksResponse[]
  selectedBankId: string;
  onClose: () => void;
  onSubmit: () => void;
  handleChangeField: (field: keyof CreateBankAccountRequestPayload, value: any) => void;
}

const NewBankAccountModal = ({ isOpen, banks, selectedBankId, onClose, onSubmit, handleChangeField }: NewBankAccountModalProps) => {
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
    console.log("Selected Bank: ", selectedBankId);
    onSubmit();
  }

  const iniitalState = {
    bankId: null,
    accountName: null,
    accountNumber: null,
    isDefault: true,
  }
  
  if (!isOpen) return null

  return (
    <Fragment>
      <div 
        className="z-50 fixed inset-0 flex items-center justify-center p-4 bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0" 
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal */}
        <div className="max-w-2xl relative bg-white rounded-3xl shadow-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 
                id="modal-title"
                className="text-2xl font-bold text-[#0E0F0C]"
              >
                Create New Bank
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#03034D] focus:ring-offset-2"
              >
                <X className="w-5 h-5" style={{ color: "#6B6E6B" }} />
              </button>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm text-amber-900 font-semibold leading-relaxed">
                  Important: Account holder name must match your profile name
                </p>
                <p className="text-xs text-amber-700 mt-1.5 leading-relaxed">
                  Ensure the name on your bank account matches the name registered on your profile. Any mismatch may result in verification failure.
                </p>
              </div>
            </div>
            
            <Formik initialValues={iniitalState} onSubmit={handleSubmit}>
              {({ values, handleChange, handleBlur, touched, errors, isValid, isSubmitting }) => (
                <Form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Bank Selector */}
                    <div className="flex flex-col gap-1">
                      <BankSelector
                        label="Select Bank"
                        options={banks}
                        value={values.bankId as unknown as string}
                        onValueChange={(value) => {
                          handleChange("bankId")(value)
                          handleChangeField("bankId", value)
                        }}
                      />
                      {touched.bankId && errors.bankId && (
                        <p className="text-red-500 text-xs mt-1 ml-3" role="alert">{errors.bankId}</p>
                      )}
                    </div>
                    
                    {/* Account Holder Name */}
                    <div className="flex flex-col gap-1">
                      <CustomInput
                        label="Account Holder name"
                        type="text"
                        value={values.accountName as unknown as string}
                        onChange={(e) => {
                          handleChange("accountName")(e.target.value);
                          handleChangeField("accountName", e.target.value);
                        }}
                        onBlur={handleBlur("accountName")}
                        error={!!(touched.accountName && errors.accountName)}
                      />
                      {touched.accountName && errors.accountName && (
                        <p className="text-[#EB5757] text-xs mt-1 ml-3" role="alert">{errors.accountName}</p>
                      )}
                    </div>

                    {/* Account Number */}
                    <div className="flex flex-col gap-1">
                      <CustomInput
                        label="Account number"
                        type="text"
                        inputMode="numeric"
                        value={values.accountNumber as unknown as string}
                        onChange={(e) => {
                          handleChange("accountNumber")(e.target.value);
                          handleChangeField("accountNumber", e.target.value);
                        }}
                        onBlur={handleBlur("accountNumber")}
                        error={!!(touched.accountNumber && errors.accountNumber)}
                      />
                      {touched.accountNumber && errors.accountNumber && (
                        <p className="text-[#EB5757] text-xs mt-1 ml-3" role="alert">{errors.accountNumber}</p>
                      )}
                    </div>
                    
                    {/* Default Bank Toggle */}
                    <div className="flex flex-col justify-center gap-2">
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            id="isDefault"
                            type="checkbox"
                            className="sr-only peer"
                            onChange={(e) => {
                              handleChangeField("isDefault", e.target.checked)
                              handleChange("isDefault")(e.target.checked as unknown as string)
                            }}
                            onBlur={handleBlur("isDefault")}
                            defaultChecked={values.isDefault as unknown as boolean}
                            aria-describedby="default-bank-description"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#03034D] peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#03034D]"></div>
                        </label>
                        <label 
                          htmlFor="isDefault"
                          className="text-sm font-semibold text-[#0E0F0C] cursor-pointer"
                        >
                          Set as Default Bank
                        </label>
                      </div>
                      <p 
                        id="default-bank-description"
                        className="text-xs text-[#9A9A9A] ml-14"
                      >
                        This bank will be used for all transactions by default
                      </p>

                      {touched.isDefault && errors.isDefault && (
                        <p className="text-red-500 text-xs mt-1 ml-3" role="alert">{errors.isDefault}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-gray-100">
                    <button
                      onClick={onClose}
                      type="button"
                      className="flex-1 h-12 rounded-2xl text-[#6B6E6B] font-semibold text-sm bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#03034D] focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!isValid || isSubmitting}
                      type="submit"
                      className="flex-1 h-12 rounded-2xl font-semibold text-sm bg-[#03034D] transition-all text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-[#02022d] focus:outline-none focus:ring-2 focus:ring-[#03034D] focus:ring-offset-2 shadow-sm hover:shadow-md"
                    >
                      {isSubmitting ? "Creating..." : "Confirm"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default NewBankAccountModal;
