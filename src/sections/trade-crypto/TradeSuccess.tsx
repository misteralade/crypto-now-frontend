import CompleteIcon from "../../assets/icons/done.svg"
import DetailDisplay from "./DetailDisplay.tsx";
import type {TradeType} from "../../types/trade.types.ts";
import {Link} from "@tanstack/react-router";

interface TradeStepProps {
    type: TradeType;
    amount: number;
    status: string;
    dateTime: string;
    token: string;
    orderId: string;
}

export default function TradeSuccess ({type, amount, status, dateTime, token, orderId}: TradeStepProps) {
    return(
        <div className="space-y-14 md:space-y-10 w-full md:w-3xl mx-auto">
            {/*Heading & info*/}
            <div className={`space-y-7 md:space-y-3 text-center`}>
                <img src={CompleteIcon} alt={"complete icon"} className={`mx-auto`} />

                <h4 className={`text-2xl font-medium`}>Transaction completed successfully</h4>
                <p className={`text-xl text-desc`}>Your trade has been processed and your account has been updated.</p>

                <div className={`bg-formGroupBg rounded-lg space-y-2 p-5`}>
                    <DetailDisplay title={`Order ID`} value={orderId} />
                    <DetailDisplay title={`Type`} value={`${type} ${token}`} />
                    <DetailDisplay title={`Amount`} value={amount} />
                    <DetailDisplay title={`Status`} value={status} />
                    <DetailDisplay title={`Date/Time`} value={dateTime} />

                    <hr />

                    <p className={`text-grey3`}>A receipt has been sent to your email. You can also download it from your transaction history at any time.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-4/5 mx-auto">
                <button
                    type="button"
                    // onClick={handleChangeAccount}
                    className="flex-1 h-12 rounded-full text-primary cursor-pointer"
                >
                    Download receipt
                </button>

                <Link
                    to={`/dashboard`}
                    type="button"
                    className={`py-2 rounded-full order-first md:order-2 w-full md:w-1/2 text-lg text-center font-semibold bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500`}
                >
                    Go to Wallet Dashboard
                </Link>
            </div>
        </div>
    )
}