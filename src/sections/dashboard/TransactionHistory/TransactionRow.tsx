import {ArrowDownToLine} from "lucide-react"

interface Transaction {
    id: string
    date: string
    type: string
    amount: string
    rate: string
    fee: string
    status: string
}

interface TransactionRowProps {
    transaction: Transaction
    isLast: boolean
}

export function TransactionRow({transaction, isLast}: TransactionRowProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "text-success bg-bgSuccess"
            case "expired":
                return "text-expired bg-bgExpired"
            case "failed":
                return "text-red bg-bgFailed"
            default:
                return "text-desc"
        }
    }

    const getStatusDot = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-600"
            case "expired":
                return "bg-expired"
            case "failed":
                return "bg-red"
            default:
                return "bg-desc"
        }
    }

    return (
        <tr className={`hover:bg-muted/30 transition-colors ${!isLast ? "border-b border-border" : ""}`}>
            <td className="p-4 text-sm text-foreground font-mono">{transaction.id}</td>
            <td className="p-4 text-sm text-muted-foreground">{transaction.date}</td>
            <td className="p-4 text-sm text-foreground">{transaction.type}</td>
            <td className="p-4 text-sm text-foreground font-medium">{transaction.amount}</td>
            <td className="p-4 text-sm text-foreground">{transaction.rate}</td>
            <td className="p-4 text-sm text-foreground">{transaction.fee}</td>
            <td className="p-4">
                <span
                    className={`flex items-center w-fit gap-2 py-1 px-3 rounded-3xl text-xs ${getStatusColor(transaction.status)}`}>
                    <span className={`w-2 h-2 rounded-full ${getStatusDot(transaction.status)}`}></span>
                    <span className={`text-sm capitalize`}>{transaction.status}</span>
                </span>
            </td>
            <td className="p-4">
                <button className="p-2 rounded-lg transition-colors" disabled={transaction.status === "failed"}>
                    <ArrowDownToLine
                        className={`w-6 h-6 
                        ${transaction.status === "completed" || transaction.status === "failed" ? 
                            "text-accent1 cursor-pointer" : "text-grey4 cursor-not-allowed"}`}
                    />
                </button>
            </td>
        </tr>
    )
}
