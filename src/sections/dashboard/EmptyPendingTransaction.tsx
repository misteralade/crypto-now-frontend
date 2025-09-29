import {useNavbarDropdown} from "../../hooks/components/useNavbarDropdown.ts";

export default function EmptyPendingTransaction() {
    const {
        handleRouting,
    } = useNavbarDropdown();

    const navigateToTradeCrypto = () => {
        handleRouting()
    }

    return(
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-border bg-accent4 px-3 py-5`}>
            <h4 className={`text-2xl font-medium`}>No pending transactions</h4>

            <button
                onClick={navigateToTradeCrypto}
                type="button"
                className={`py-4 px-3 md:py-2 cursor-pointer rounded-full block md:order-2 text-lg text-center font-semibold bg-primary text-white disabled:bg-gray-300 disabled:text-gray-500`}
            >
                Buy / Sell Crypto
            </button>
        </div>
    )
}