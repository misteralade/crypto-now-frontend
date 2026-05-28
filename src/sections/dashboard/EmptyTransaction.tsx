import WalletIcon from "../../assets/icons/Wallet_04.svg"
import {Link} from "@tanstack/react-router";
import { ROUTES } from "../../util/constants.util.ts";

export default function EmptyTransaction() {
    return(
        <div className={`bg-greyBg max-w-7xl mx-auto md:px-6 md:-mt-5 rounded-2xl flex items-center justify-center min-h-[650px]`}>
            <div className={`space-y-3 px-5`}>
                <img src={WalletIcon} alt="Wallet" className={`block mx-auto`} />

                <div className={`flex flex-col gap-7 items-center justify-center text-center`}>
                    <h2 className={`text-primary text-[40px] font-semibold w-4/5 leading-12`}>No transaction had been performed yet</h2>

                    <Link
                        to={ROUTES.DASHBOARD_TRADE}
                        type="button"
                        className={`py-4 md:py-2 rounded-full block md:order-2 w-full md:w-1/2 text-lg text-center font-semibold bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500`}
                    >
                        Buy / Sell Crypto
                    </Link>
                </div>
            </div>
        </div>
    )
}
