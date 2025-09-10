import EmptyTransaction from "./EmptyTransaction.tsx";

export default function DashboardContent(){
    const transactionHistory = []

    console.log(transactionHistory.length)

    if(transactionHistory.length === 0){
        return(
            <EmptyTransaction />
        )
    }
    return (
        <div className="content">

        </div>
    )
}