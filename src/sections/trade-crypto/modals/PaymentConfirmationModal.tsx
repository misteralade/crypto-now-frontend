import { useState, useEffect } from "react"
import MakeDispute from "../MakeDispute.tsx";
import {formatTime} from "../../../util/index.util.ts";

interface PaymentConfirmationModalProps {
    isOpen: boolean
}

export function PaymentConfirmationModal({ isOpen, }: PaymentConfirmationModalProps) {
    const [countdown, setCountdown] = useState(180) // 3 minutes in seconds

    useEffect(() => {
        if (!isOpen) return

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 h-full bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg px-8 pt-14 pb-5 w-sm relative space-y-10">
                <div className={`space-y-5`}>
                    {/* Loading spinner */}
                    <div className="flex justify-center">
                        <div className="w-12 h-12 border-4 border-accent2/20 border-t-accent2 rounded-full animate-spin"></div>
                    </div>

                    {/* Main message */}
                    <div className="text-center">
                        <h2 className="text-xl font-medium">Please, wait while we confirm your payment</h2>
                    </div>

                    {/* Countdown */}
                    <div className="text-center">
                        <p className="text-lg ">
                            Confirmation countdown: <span className="text-accent3">{formatTime(countdown)}</span>
                        </p>
                    </div>
                </div>

                {/* Dispute link */}
                <div className="text-center">
                    <MakeDispute />
                </div>
            </div>
        </div>
    )
}
