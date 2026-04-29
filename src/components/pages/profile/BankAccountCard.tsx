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
    <section className="relative p-5 rounded-2xl border border-[#ECECEC] bg-white shadow-sm overflow-hidden flex flex-col h-full w-full max-w-[330px] mx-auto sm:mx-0">
      {/* Translucent Bank Logo Background */}
      {account.bankLogo && (
        <div
          className="absolute inset-0 opacity-5 bg-no-repeat bg-right bg-contain pointer-events-none"
          style={{
            backgroundImage: `url(${account.bankLogo})`,
            backgroundPosition: 'right 16px center',
          }}
        />
      )}

      {/* Content - positioned above the background */}
      <div className="relative z-10 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#0E0F0C]">
            {account.label || `Account ${index + 1}`}
          </h3>
          {account.isDefault && (
            <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#03034D]">
              Default
            </span>
          )}
        </div>
        
        <div className="space-y-3 flex-1">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[#828282] mb-0.5">Account Name</div>
            <div className="text-sm text-[#101828] font-semibold">
              {account.accountName || '--'}
            </div>
          </div>
          
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[#828282] mb-0.5">Account Number</div>
            <div className="text-sm text-[#101828] font-medium font-mono">
              {account.accountNumber || '--'}
            </div>
          </div>
          
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[#828282] mb-0.5">Bank Name</div>
            <div className="text-sm text-[#101828] font-semibold">
              {account.bankName || '--'}
            </div>
          </div>
        </div>
        
        <div className="mt-5 pt-3 border-t border-[#F0F0F0] flex items-center justify-between gap-3">
          {!account.isDefault && (
            <button
              className="text-[#03034D] text-xs font-semibold hover:opacity-80 transition-opacity"
              onClick={() => onMakeDefault(account.id || '')}
            >
              Make as default
            </button>
          )}
          <button
            className="text-[#EB5757] text-xs font-semibold hover:opacity-80 transition-opacity ml-auto"
            onClick={() => onDelete(account.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </section>
  )
}

export default BankAccountCard
