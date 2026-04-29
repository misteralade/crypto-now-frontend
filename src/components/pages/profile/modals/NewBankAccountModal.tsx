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

const NewBankAccountModal = ({ isOpen, banks, onClose, onSubmit, handleChangeField }: NewBankAccountModalProps) => {
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

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

  const handleLookup = async (accountNumber: string, bankCode: string, setFieldValue: any) => {
    setIsLookingUp(true);
    setLookupError(null);
    try {
      const { bankServiceApi } = await import("../../../../api/bank.api.ts");
      const { data, success, message } = await bankServiceApi.lookupAccountName(accountNumber, bankCode);
      if (success && data.accountName) {
        setFieldValue("accountName", data.accountName);
        handleChangeField("accountName", data.accountName);
        return data.accountName;
      } else {
        setLookupError(message || "Could not verify account details.");
        setFieldValue("accountName", "");
        handleChangeField("accountName", "");
        return "";
      }
    } catch (e) {
      setLookupError("Verification failed. Please try again.");
      setFieldValue("accountName", "");
      handleChangeField("accountName", "");
      return "";
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = () => {
    onSubmit();
  }

  const initialState = {
    bankId: "",
    accountName: "",
    accountNumber: "",
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
          <div className="p-5 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
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
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5 mb-4 items-start">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-xs text-amber-900 font-bold">
                  Automated Verification
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5 leading-snug">
                  Account name will be automatically derived from your bank details.
                </p>
              </div>
            </div>
            
            <Formik initialValues={initialState} onSubmit={handleSubmit}>
              {({ values, handleChange, handleBlur, touched, errors, isValid, isSubmitting, setFieldValue }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bank Selector */}
                    <div className="flex flex-col gap-1">
                      <BankSelector
                        label="Select Bank"
                        options={banks}
                        value={values.bankId}
                        onValueChange={(value) => {
                          setFieldValue("bankId", value);
                          handleChangeField("bankId", value);
                          
                          // Track logo as well
                          const selectedBank = banks.find(b => b.id === value);
                          if (selectedBank) {
                            handleChangeField("bankLogo", selectedBank.logoUrl);
                            handleChangeField("bankCode", selectedBank.code);
                            handleChangeField("bankName", selectedBank.name);
                            
                            if (values.accountNumber.length === 10) {
                              handleLookup(values.accountNumber, selectedBank.code, setFieldValue);
                            }
                          }
                        }}
                      />
                      {touched.bankId && errors.bankId && (
                        <p className="text-red-500 text-xs mt-1 ml-3" role="alert">{errors.bankId}</p>
                      )}
                    </div>
                    
                    {/* Account Number */}
                    <div className="flex flex-col gap-1">
                      <CustomInput
                        label="Account number"
                        type="text"
                        inputMode="numeric"
                        value={values.accountNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFieldValue("accountNumber", val);
                          handleChangeField("accountNumber", val);
                          
                          if (val.length === 10 && values.bankId) {
                            const selectedBank = banks.find(b => b.id === values.bankId);
                            if (selectedBank) {
                              handleLookup(val, selectedBank.code, setFieldValue);
                            }
                          }
                        }}
                        onBlur={() => { handleBlur("accountNumber")(undefined as any); }}
                        error={!!(touched.accountNumber && errors.accountNumber)}
                      />
                      {touched.accountNumber && errors.accountNumber && (
                        <p className="text-[#EB5757] text-xs mt-1 ml-3" role="alert">{errors.accountNumber}</p>
                      )}
                    </div>

                    {/* Derived Account Holder Name */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <div className={`
                        w-full h-14 px-4 flex flex-col justify-center
                        rounded-2xl border bg-gray-50 transition-colors
                        ${values.accountName ? 'border-green-200 bg-green-50/30' : 'border-[#EEEEEE]'}
                      `}>
                        <label className="text-[10px] font-semibold text-[#9A9A9A] mb-0.5">
                          Verified Account Holder Name
                        </label>
                        <div className="text-sm font-medium text-[#0E0F0C] min-h-[1.25rem]">
                          {isLookingUp ? (
                            <span className="text-[#03034D] animate-pulse">Verifying details...</span>
                          ) : (
                            values.accountName || <span className="text-[#9A9A9A] italic">Enter bank and account number to verify</span>
                          )}
                        </div>
                      </div>
                      {lookupError && (
                        <p className="text-[#EB5757] text-xs mt-1 ml-3" role="alert">{lookupError}</p>
                      )}
                    </div>
                    
                    {/* Default Bank Toggle */}
                    <div className="flex flex-col justify-center gap-2 md:col-span-2">
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            id="isDefault"
                            type="checkbox"
                            className="sr-only peer"
                            onChange={(e) => {
                              handleChangeField("isDefault", e.target.checked)
                              setFieldValue("isDefault", e.target.checked)
                            }}
                            onBlur={handleBlur("isDefault")}
                            checked={values.isDefault}
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
                      <p className="text-xs text-[#9A9A9A] ml-14">
                        This bank will be used for all transactions by default
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-5 border-t border-gray-100">
                    <button
                      onClick={onClose}
                      type="button"
                      className="flex-1 h-12 rounded-2xl text-[#6B6E6B] font-semibold text-sm bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!isValid || isSubmitting || !values.accountName || isLookingUp}
                      type="submit"
                      className="flex-1 h-12 rounded-2xl font-semibold text-sm bg-[#03034D] transition-all text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#02022d] shadow-sm"
                    >
                      {isSubmitting ? "Saving..." : "Save Bank Account"}
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
