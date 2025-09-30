import type React from "react"

import {X, Copy} from "lucide-react"
import {useState, useRef, useEffect} from "react"

interface TwoFactorModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (code: string) => void
}

export default function TwoFactorModal({isOpen, onClose, onConfirm}: TwoFactorModalProps) {
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
    const [secretKey] = useState("ZPFIY52GITG7WOWJ44")
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Lock body scroll when modal is open
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

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return

        const newCode = [...verificationCode]
        newCode[index] = value
        setVerificationCode(newCode)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(secretKey)
    }

    const handleConfirm = () => {
        const code = verificationCode.join("")
        if (code.length === 6) {
            onConfirm(code)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose}/>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 md:p-10 space-y-8">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <h2 className="text-3xl font-semibold text-titleColor">Setup Authenticator App</h2>
                        <button onClick={onClose}>
                            <X className="w-6 h-6"/>
                        </button>
                    </div>

                    {/* Description */}
                    <p className="text-titleColor">
                        Each time you log in, in addition to your password, you'll use an authenticator app to generate
                        a one-time
                        code
                    </p>

                    {/* Step 1: Scan QR Code */}
                    <div className="space-y-10">
                        <div className={`space-y-5`}>
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center border border-accent2 w-28 h-12 rounded-full bg-accentBg text-primary font-semibold">
                                Step 1
                              </span>
                                <h3 className="text-xl font-medium text-titleColor">Scan QR code</h3>
                            </div>

                            <p className="w-4/5">
                                Scan the QR code below or manually enter the secret key into your authenticator app.
                            </p>
                        </div>


                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* QR Code */}
                            <div className="flex-shrink-0">
                                <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg p-2">
                                    <img src="img/qr-placeholder.png" alt="QR Code" className="w-full h-full"/>
                                </div>
                            </div>

                            {/* Secret Key */}
                            <div className="flex-1 space-y-4 w-full">
                                <p className="text-lg font-semibold text-titleColor">Can't scan QR code?</p>
                                <p className="text-titleColor">Enter this secret instead:</p>

                                    <input
                                        type="text"
                                        value={secretKey}
                                        readOnly
                                        className="flex-1 px-4 py-3 w-full bg-accentBg border border-accent2 rounded-2xl text-sm text-desc"
                                    />
                                    <button
                                        onClick={handleCopyCode}
                                        className="flex items-center rounded-full gap-2 px-4 py-3 bg-primary text-white  text-sm font-medium"
                                    >
                                        <Copy className="w-4 h-4"/>
                                        Copy code
                                    </button>

                            </div>
                        </div>
                    </div>

                    {/* Step 2: Verification Code */}
                    <div className="space-y-5">
                        <div className={`space-y-5`}>
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center border border-accent2 w-28 h-12 rounded-full bg-accentBg text-primary font-semibold">
                                Step 2
                              </span>
                                <h3 className="text-xl font-medium text-titleColor">Get verification Code</h3>
                            </div>

                            <p className="w-4/5">
                                Enter the 6-digit code you see in your authenticator app.
                            </p>
                        </div>


                        <div>
                            <label className="block text-lg font-semibold text-titleColor mb-3">Enter verification
                                code</label>
                            <div className="flex gap-2 md:gap-3">
                                {verificationCode.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el
                                        }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        placeholder={"-"}
                                        className="w-12 h-12 text-center text-xl font-semibold border-2 placeholder:text-placeholder border-border rounded-lg  focus:outline-none bg-greyBg"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 h-12 rounded-full text-gray-700 font-semibold text-base hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={verificationCode.join("").length !== 6}
                            className="flex-1 h-12 rounded-full font-semibold text-base bg-[#1a1f5c] text-white disabled:bg-gray-300 disabled:text-gray-500 hover:bg-[#151842] transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
