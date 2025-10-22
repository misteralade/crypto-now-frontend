import { useState } from 'react'

interface EmailModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (email: string) => void
}

const EmailModal = ({ open, onClose, onConfirm }: EmailModalProps) => {
  const [email, setEmail] = useState('')
  
  if (!open) return null
  
  const handleConfirm = () => {
    if (email) {
      onConfirm(email)
    }
  }
  
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/30 transition-opacity opacity-100"
        onClick={onClose}
      />
      
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-sm border border-[#ECECEC]">
          <div className="px-6 pt-6 pb-2 text-center text-[20px] font-semibold text-[#0E0F0C]">
            Transaction Updates
          </div>
          
          <div className="px-6 pb-6 space-y-4 mt-4">
            <div className="text-sm text-[#667085] text-center">
              Enter your email to receive updates about your transaction
            </div>
            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border border-[#ECECEC] text-[16px] focus:outline-none focus:border-[#03034D]"
            />
          </div>
          
          <div className="px-6 pb-6 flex flex-col md:flex-row items-center justify-center gap-4 border-t border-[#ECECEC] pt-4">
            <button
              className="text-[#03034D] text-lg hover:bg-[#FF8B5A] rounded-full hover:text-white px-12 py-4 font-semibold w-full md:w-fit"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="rounded-full bg-[#03034D] hover:bg-[#FF8B5A] text-white px-12 py-4 text-lg font-semibold w-full md:w-fit disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleConfirm}
              disabled={!email}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailModal