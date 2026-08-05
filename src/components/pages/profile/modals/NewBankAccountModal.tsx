import { Fragment, useEffect } from "react";
import { X } from "lucide-react";
import type { AllBanksResponse } from "../../../../types/response.payload.types.ts";
import type { CreateBankAccountRequestPayload } from "../../../../types/request.payload.types.ts";
import BankAccountForm from "../../bank/BankAccountForm.tsx";

interface NewBankAccountModalProps {
  isOpen: boolean;
  banks: AllBanksResponse[];
  selectedBankId: string;
  onClose: () => void;
  onSubmit: () => void;
  handleChangeField: (
    field: keyof CreateBankAccountRequestPayload,
    value: any,
  ) => void;
}

const NewBankAccountModal = ({
  isOpen,
  banks,
  onClose,
  onSubmit,
  handleChangeField,
}: NewBankAccountModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

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

            <BankAccountForm
              banks={banks}
              onSubmit={onSubmit}
              onCancel={onClose}
              handleChangeField={handleChangeField}
              submitLabel="Save Bank Account"
              showCancelButton
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NewBankAccountModal;
