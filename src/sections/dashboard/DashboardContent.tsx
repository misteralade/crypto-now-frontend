import DashboardDataUI from "./DashboardDataUI.tsx";
import OrderIcon from "../../assets/icons/fluent_tag-multiple-16-filled.svg";
import EmptyPendingTransaction from "./EmptyPendingTransaction.tsx";
import {TransactionDashboard} from "./TransactionHistory/TransactionDashboard.tsx";
import {useDashboardContent} from "../../hooks/components/dashboard/useDashboardContent.ts";
import type {TransactionSummaryResponseEntity} from "../../types/response.payload.types.ts";
import { convertToMillify } from "../../util/index.util.ts";

export default function DashboardContent(){
  const {
    // Values
    transactionSummary,
    loadingTransactionSummary,
    
    // Functions
  } = useDashboardContent()
  
  const pendingTransaction = []
  
  const orderTotal = !loadingTransactionSummary && transactionSummary ? transactionSummary?.total?.reduce((acc, item) => acc + Number(item.totalUsdAmount), 0) : 0;
  
  return (
    <div className="w-full md:w-[90%] 2xl:max-w-7xl mx-auto md:-mt-10 px-3 md:px-0 space-y-10 ">
      {/*Overview*/}
      <div className="grid md:grid-cols-3 gap-5">
        {!loadingTransactionSummary && transactionSummary && transactionSummary?.summary?.map((item: TransactionSummaryResponseEntity, index) => (
          <DashboardDataUI
            key={`${item.cryptoCurrencyId}-${item.cryptoCurrencyImageUrl}-${index}`}
            imgSrc={item.cryptoCurrencyImageUrl}
            Data={[
              { title: `${item.cryptoCurrencySymbol} Bought`, value: `$ ${convertToMillify(Number(item.usdSpentOnBuying))}` },
              { title: `${item.cryptoCurrencySymbol} Sold`, value: `$ ${convertToMillify(Number(item.usdReceivedFromSelling))}` }
            ]}
          />
        ))}
        <DashboardDataUI imgSrc={OrderIcon} Data={[
          { title: 'Total Completed Orders', value: `$ ${convertToMillify(Number(orderTotal))}` }
        ]} />
      </div>
      
      {/*Pending Transaction*/}
      { !loadingTransactionSummary && transactionSummary && transactionSummary?.summary?.length > 0 && <div></div>}
      {pendingTransaction.length === 0 && <EmptyPendingTransaction />}
      
      <TransactionDashboard />
    </div>
  )
}