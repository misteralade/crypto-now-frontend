import type {TradeAdditionalInfoInterface} from "../../../types/trade.types.ts";
import {useEffect, useState} from "react";
import TradeAdditionalInfo from "../TradeAdditionalInfo.tsx";
import CustomButton from "../../../components/global/Button.tsx";
import TradePaymentUpload from "../TradePaymentUpload.tsx";
import {formatTime} from "../../../util/utils.ts";
import MakeDispute from "../MakeDispute.tsx";

interface TradeStep2Props{
    additionalInfo: TradeAdditionalInfoInterface[],
    accountDetails: TradeAdditionalInfoInterface[],
    setShowModal: (value: boolean) => void,
    setShowBankDetailsModal: (value: boolean) => void,
    useStep3: boolean,
    setStep?: (value: number) => void,
}

export default function TradeStep2({setStep, additionalInfo, accountDetails, setShowModal, setShowBankDetailsModal, useStep3}: TradeStep2Props){
    const [files, setFiles] = useState<File[]>([])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setShowModal(true)

        try {
            // Create FormData to handle file uploads
            const formData = new FormData()

            // Add files to FormData
            files.forEach((file, index) => {
                formData.append(`file_${index}`, file)
            })

            // Add other form data as needed
            formData.append("fileCount", files.length.toString())

            console.log(formData)

            setTimeout(() => {
                setShowModal(false)
                setShowBankDetailsModal(true)
            }, 1000)

        } catch (error) {
            console.error("[v0] Error uploading files:", error)
        }
    }

    const submitInvalid = files.length === 0 ;

    const [countdown, setCountdown] = useState(600) // 3 minutes in seconds

    useEffect(() => {
        if (!useStep3) return

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
    }, [useStep3])

    return(
        <div className={`space-y-7`}>
            {useStep3 &&
                <h4 className={`text-2xl text-body font-medium`}>
                    You'll receive payment withing {" "}
                    <span className={`text-accent3`}>
                        {formatTime(countdown)}
                    </span>
                </h4>
            }

            {/*Info*/}
            <div className={`space-y-3`}>
                <TradeAdditionalInfo heading={`account details`} additionalInfo={accountDetails} />
                <TradeAdditionalInfo heading={"Order details"} additionalInfo={additionalInfo} />
            </div>

            {/*form*/}
            {!useStep3 &&  <form className={`space-y-10`} onSubmit={handleSubmit}>
                {/*Image input*/}
                <div className={`w-full md:w-3/4 mx-auto`}>
                    <TradePaymentUpload onFilesChange={setFiles} maxFiles={5} acceptedTypes={[".jpg", ".png", ".pdf"]} />
                </div>


                <div className={`md:w-1/2 w-full mx-auto px-5 md:px-0`}>
                    <CustomButton
                        className="w-full"
                        buttonText="Proceed to payment"
                        type="submit"
                        disabled={submitInvalid}
                    />
                </div>
            </form>}

            {useStep3 &&
                <div className={`flex flex-col md:flex-row gap-5 items-center justify-between`}>
                    <MakeDispute />

                    <CustomButton
                        className="w-full md:w-1/2 order-first md:order-2"
                        buttonText="I've received payment"
                        type="button"
                        onClick={() => {
                            if(setStep) {
                                setStep(4)
                            }
                        }}
                    />
                </div>
            }
        </div>
    )
}