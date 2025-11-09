import { Fragment } from "react";
import Navbar from "../../../components/global/navbar/Navbar.tsx";
import {useTransactionDetailsPage} from "../../../hooks/pages/useTransactionDetailsPage.ts";
import {LoadingSpinner} from "../../../components/global/LoadingSpinner.tsx";
import {TransactionStatus} from "../../../hooks/components/transaction/TransactionStatusIcon.tsx";
import {transactionStatusMessages, transactionStatusStyles} from "../../../util/constants.util.ts";
import { formatNumber } from "../../../util/index.util.ts";
import {AlertTriangle, CheckCircle, Clock, Copy} from "lucide-react";
import momentClient from "../../../lib/moment.ts";
import DisputeTransactionModal from "./modals/DisputeTransactionModal.tsx";

const TransactionDetailsPage = () => {
  const {
    // 🧩 Values
    transactionDetails: transaction,
    loadingTransactionDetails,
    showDisputeTransaction,
    copiedField,
    
    // ⚙️ Functions
    toggleDisputeTransaction,
    copyToClipboard,
    handleSubmitDispute,
  } = useTransactionDetailsPage();
  
  
  const transactionColorScheme = transactionStatusStyles[transaction?.status as keyof typeof transactionStatusStyles];
  const transactionMessage = transactionStatusMessages[transaction?.status as keyof typeof transactionStatusStyles];
  
  const CopyButton = ({ text, field }: { text: string, field: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="ml-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors"
      title="Copy to clipboard"
    >
      {copiedField === field ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
  
  return (
    <Fragment>
      {loadingTransactionDetails ? (
        <LoadingSpinner fullScreen={true}/>
      ) : transaction ? (
        <Fragment>
          <div className={`space-y-10 md:space-y-20 min-h-screen bg-gray-50`}>
            <Navbar />
            
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Transaction Details</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    View your transaction information and status
                  </p>
                </div>
                
                <button
                  onClick={toggleDisputeTransaction}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors hover:cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Dispute Transaction
                </button>
              </div>
              
              {/* Status Alert */}
              <div className={`mb-6 p-4 rounded-lg border ${transactionColorScheme?.bg}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <TransactionStatus status={transaction.status}/>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">
                      {transactionMessage.title}
                    </h3>
                    <p className="mt-1 text-sm opacity-90">
                      {transactionMessage.message}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Side */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Transaction Overview */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Crypto Amount</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatNumber(transaction.amountCrypto)} {transaction.cryptocurrency?.symbol}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Fiat Amount</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {transaction.currency} {formatNumber(transaction.amountFiat)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Exchange Rate</p>
                        <p className="text-lg font-semibold text-gray-900">{transaction.stableToFiatRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Transaction Type</p>
                        <p className="text-lg font-semibold text-gray-900">{transaction.type}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cryptocurrency Details */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Cryptocurrency Details</h2>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <img src={transaction.cryptocurrency?.logoUrl} alt={transaction.cryptocurrency?.logoUrl}/>
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">{transaction.cryptocurrency?.name}</p>
                        <p className="text-sm text-gray-500">{transaction.cryptocurrency?.symbol}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Crypto Wallet */}
                  {transaction.userCryptoWallet && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Crypto Wallet</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Wallet Address</p>
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                            <p className="text-sm font-mono text-gray-900 break-all">
                              {transaction.userCryptoWallet.walletAddress}
                            </p>
                            <CopyButton text={transaction.userCryptoWallet.walletAddress} field={"Wallet Address"}/>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Network</p>
                            <p className="text-sm font-medium text-gray-900">{transaction.userCryptoWallet.network}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Coin</p>
                            <p className="text-sm font-medium text-gray-900">{transaction.cryptocurrency?.symbol}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Bank Account Details */}
                  {transaction.userBankAccount && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Bank Account</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Account Name</p>
                          <p className="text-base font-medium text-gray-900">{transaction.userBankAccount.accountName}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Account Number</p>
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                            <p className="text-base font-semibold text-gray-900">{transaction.userBankAccount.accountNumber}</p>
                            <CopyButton text={transaction.userBankAccount.accountNumber} field="account" />
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Bank Name</p>
                          <p className="text-base font-medium text-gray-900">{transaction.userBankAccount.bankName}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* What Happens Next */}
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                    <h3 className="text-base font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="mr-2">ℹ️</span>
                      What Happens Next?
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Our admin team will verify your payment within the next few hours</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>You'll receive an email notification once your payment is confirmed</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Your transaction will be processed immediately after confirmation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>You can check your transaction status anytime via this page</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Sidebar - Right Side */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Timeline */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Created</p>
                          <p className="text-xs text-gray-500 mt-1">{momentClient.formatToTransactionInitiationDate(transaction.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="ml-4 border-l-2 border-gray-200 h-4"></div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Last Updated</p>
                          <p className="text-xs text-gray-500 mt-1">{momentClient.formatToTransactionInitiationDate(transaction.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Session Info */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Info</h2>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Session ID</p>
                      <div className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
                        <p className="text-xs font-mono text-gray-900 break-all mr-2">
                          {transaction.sessionId}
                        </p>
                        <CopyButton text={transaction.sessionId} field="session" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Reference IDs */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Reference IDs</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Transaction ID</p>
                        <div className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
                          <p className="text-xs font-mono text-gray-900 break-all mr-2">
                            {transaction.id}
                          </p>
                          <CopyButton text={transaction.id} field="transaction" />
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-2">User Email</p>
                        <div className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-900 break-all mr-2">
                            {transaction?.user ? transaction.user.email : transaction.email}
                          </p>
                          <CopyButton text={(transaction?.user ? transaction.user.email : transaction.email) || ''} field="email" />
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Exchange Rate ID</p>
                        <div className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
                          <p className="text-xs font-mono text-gray-900 break-all mr-2">
                            {transaction.exchangeRateId}
                          </p>
                          <CopyButton text={transaction.exchangeRateId} field="exchange" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Support */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      If you have any questions about your transaction, feel free to contact our support team.
                    </p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Footer Note */}
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>We appreciate your patience as we process your transaction.</p>
              </div>
            </div>
          </div>
          
          {showDisputeTransaction && (
            <DisputeTransactionModal
              transactionId={transaction.sessionId}
              
              onClose={toggleDisputeTransaction}
              onSubmit={handleSubmitDispute}
            />
          )}
        </Fragment>
      ) : (
        <Fragment></Fragment>
      )}
    </Fragment>
  )
}

export default TransactionDetailsPage;
