import type {UserBankAccountResponse} from "../../../types/response.payload.types.ts";

interface BankAccountCardProps {
  account: UserBankAccountResponse;
  index: number
  onMakeDefault: (id: string) => void
  onDelete: (index: string) => void
}

const BankAccountCard = ({
  account,
  index,
  onMakeDefault,
  onDelete,
}: BankAccountCardProps) => {
  return (
    <section className="relative p-5 rounded-2xl border border-[#ECECEC] bg-white shadow-sm overflow-hidden">
      {/* Translucent Bank Logo Background */}
      {account.bankLogo && (
        <div
          className="absolute inset-0 opacity-5 bg-no-repeat bg-right bg-contain pointer-events-none"
          style={{
            backgroundImage: `url(${account.bankLogo})`,
            backgroundPosition: 'right 20px center',
          }}
        />
      )}

      {/* Content - positioned above the background */}
      <div className="relative z-10">
        <div className="text-[20px] md:text-2xl font-medium text-[#0E0F0C]">
          {account.label || `Account ${index + 1}`}{' '}
          {account.isDefault ? '– Default' : ''}
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[#828282]">Account Name</div>
            <div className="text-[#101828] font-medium">
              {account.accountName || '--'}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[#828282]">Account Number</div>
            <div className="text-[#101828] font-medium">
              {account.accountNumber || '--'}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[#828282]">Bank Name</div>
            <div className="text-[#101828] font-medium">
              {account.bankName || '--'}
            </div>
          </div>
        </div>
        <div className="mt-[68px] flex items-center justify-end gap-x-4">
          <div className="flex items-center gap-4">
            {!account.isDefault && (
              <button
                className="text-[#03034D] text-sm font-semibold hover:opacity-80"
                onClick={() => onMakeDefault(account.id || '')}
              >
                Make as default
              </button>
            )}
            <button
              className="text-[#EB5757] text-sm font-semibold hover:opacity-80"
              onClick={() => onDelete(account.id)}
            >
              Delete
            </button>
          </div>
          {/*<button*/}
          {/*  className="px-4 py-2 rounded-full bg-[#03034D] text-white text-sm font-semibold hover:opacity-80"*/}
          {/*  onClick={() => onEdit(index)}*/}
          {/*>*/}
          {/*  Edit*/}
          {/*</button>*/}
        </div>
      </div>
    </section>
  )
}

export default BankAccountCard
