import { useEffect, useState } from "react";
import type { AllBanksResponse } from "../../../types/response.payload.types.ts";
import type { CreateBankAccountRequestPayload } from "../../../types/request.payload.types.ts";
import BankSelector from "../../global/BankSelector.tsx";
import BankAccountFormInput from "./BankAccountFormInput.tsx";
import { Form, Formik } from "formik";

interface BankAccountFormProps {
  banks: AllBanksResponse[];
  onSubmit: () => void;
  onCancel?: () => void;
  handleChangeField: (
    field: keyof CreateBankAccountRequestPayload,
    value: any,
  ) => void;
  submitLabel?: string;
  showCancelButton?: boolean;
}

const BankAccountForm = ({
  banks,
  onSubmit,
  onCancel,
  handleChangeField,
  submitLabel = "Save Bank Account",
  showCancelButton = true,
}: BankAccountFormProps) => {
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Every bank account added here is the default — there's no per-account
  // toggle, so make sure the parent's state reflects that explicitly rather
  // than relying on its own initial value matching.
  useEffect(() => {
    handleChangeField("isDefault", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLookup = async (
    accountNumber: string,
    bankId: string,
    setFieldValue: any,
  ) => {
    setIsLookingUp(true);
    setLookupError(null);
    try {
      const { bankServiceApi } = await import("../../../api/bank.api.ts");
      const { data, success, message } = await bankServiceApi.lookupAccountName(
        accountNumber,
        bankId,
      );
      if (success && data.accountName) {
        setFieldValue("accountName", data.accountName);
        handleChangeField("accountName", data.accountName);
        return data.accountName;
      } else {
        setLookupError(message || "Couldn't find an account with this bank. Please check and try again.");
        setFieldValue("accountName", "");
        handleChangeField("accountName", "");
        return "";
      }
    } catch {
      setLookupError("Couldn't find an account with this bank. Please check and try again.");
      setFieldValue("accountName", "");
      handleChangeField("accountName", "");
      return "";
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = () => {
    onSubmit();
  };

  const initialState = {
    bankId: "",
    accountName: "",
    accountNumber: "",
    isDefault: true,
  };

  return (
    <Formik initialValues={initialState} onSubmit={handleSubmit}>
      {({
        values,
        handleBlur,
        touched,
        errors,
        isValid,
        isSubmitting,
        setFieldValue,
      }) => (
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
                  const selectedBank = banks.find(
                    (b) => b.id === value,
                  );
                  if (selectedBank) {
                    handleChangeField("bankLogo", selectedBank.logoUrl);
                    handleChangeField("bankCode", selectedBank.bankCode);
                    handleChangeField("bankName", selectedBank.name);

                    if (values.accountNumber.length === 10) {
                      handleLookup(
                        values.accountNumber,
                        selectedBank.id,
                        setFieldValue,
                      );
                    }
                  }
                }}
              />
              {touched.bankId && errors.bankId && (
                <p
                  className="text-red-500 text-xs mt-1 ml-3"
                  role="alert"
                >
                  {errors.bankId}
                </p>
              )}
            </div>

            {/* Account Number */}
            <div className="flex flex-col gap-1">
              <BankAccountFormInput
                label="Account number"
                type="text"
                inputMode="numeric"
                value={values.accountNumber}
                onChange={(e) => {
                  const val = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  setFieldValue("accountNumber", val);
                  handleChangeField("accountNumber", val);

                  if (val.length === 10 && values.bankId) {
                    const selectedBank = banks.find(
                      (b) => b.id === values.bankId,
                    );
                    if (selectedBank) {
                      handleLookup(val, selectedBank.id, setFieldValue);
                    }
                  }
                }}
                onBlur={handleBlur("accountNumber")}
                error={
                  !!(touched.accountNumber && errors.accountNumber)
                }
              />
              {touched.accountNumber && errors.accountNumber && (
                <p
                  className="text-[#EB5757] text-xs mt-1 ml-3"
                  role="alert"
                >
                  {errors.accountNumber}
                </p>
              )}
            </div>

            {/* Derived Account Holder Name */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <div
                className={`
                w-full h-14 px-4 flex flex-col justify-center
                rounded-2xl border bg-gray-50 transition-colors
                ${values.accountName ? "border-green-200 bg-green-50/30" : "border-[#EEEEEE]"}
              `}
              >
                <label className="text-[10px] font-semibold text-[#9A9A9A] mb-0.5">
                  Account Holder
                </label>
                <div className="text-sm font-medium text-[#0E0F0C] min-h-[1.25rem]">
                  {isLookingUp ? (
                    <span className="text-[#03034D] animate-pulse">
                      Verifying details...
                    </span>
                  ) : (
                    values.accountName || (
                      <span className="text-[#9A9A9A] italic">
                        Enter bank and account number to verify
                      </span>
                    )
                  )}
                </div>
              </div>
              {lookupError && (
                <p
                  className="text-[#EB5757] text-xs mt-1 ml-3"
                  role="alert"
                >
                  {lookupError}
                </p>
              )}
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-5 border-t border-gray-100">
            {showCancelButton && (
              <button
                onClick={onCancel}
                type="button"
                className="flex-1 h-12 rounded-2xl text-[#6B6E6B] font-semibold text-sm bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              disabled={
                !isValid ||
                isSubmitting ||
                !values.accountName ||
                isLookingUp
              }
              type="submit"
              className="flex-1 h-12 rounded-2xl font-semibold text-sm bg-[#03034D] transition-all text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#02022d] shadow-sm"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BankAccountForm;
