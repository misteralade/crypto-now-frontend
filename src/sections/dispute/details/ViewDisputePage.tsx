import {Fragment} from "react";
import {useViewDisputeDetailsPage} from "../../../hooks/pages/useViewDisputeDetailsPage.ts";
import {LoadingSpinner} from "../../../components/global/LoadingSpinner.tsx";
import {AlertCircle, CheckCircle, Clock, HelpCircle, Loader, X, Zap} from "lucide-react";
import Navbar from "../../../components/global/navbar/Navbar.tsx";
import TransactionDisputeInfo from "./TransactionDisputeInfo.tsx";
import DisputeInformation from "./DisputeInformation.tsx";
import DisputeMessage from "./DisputeMessage.tsx";

const ViewDisputePage = () => {
  const {
    // 🧩 Values
    disputeMessages,
    loadingDisputeMessages,
    disputeDetails,
    loadingDisputeDetails,
    
    // ⚙️ Functions
    getDisputeStatusColor,
    userSendDisputeMutation,
  } = useViewDisputeDetailsPage();
  
  const getStatusIcon = (status: | 'OPEN' | 'UNDER_REVIEW' | 'AWAITING_EVIDENCE' | 'AWAITING_USER_RESPONSE' | 'AWAITING_ADMIN_RESPONSE' | 'ESCALATED' | 'RESOLVED' | 'REJECTED' | 'CLOSED') => {
    switch (status) {
      case "OPEN":
        return <Clock className="w-4 h-4" />; // Pending action
      case "UNDER_REVIEW":
        return <Loader className="w-4 h-4 animate-spin" />; // In progress
      case "AWAITING_EVIDENCE":
        return <HelpCircle className="w-4 h-4" />; // Waiting for info
      case "AWAITING_USER_RESPONSE":
        return <Zap className="w-4 h-4" />; // Needs user action
      case "AWAITING_ADMIN_RESPONSE":
        return <AlertCircle className="w-4 h-4" />; // Needs admin review
      case "ESCALATED":
        return <X className="w-4 h-4 text-red-600" />; // Urgent/critical
      case "RESOLVED":
        return <CheckCircle className="w-4 h-4 text-green-600" />; // Success
      case "REJECTED":
        return <X className="w-4 h-4 text-gray-600" />; // Declined
      case "CLOSED":
        return <CheckCircle className="w-4 h-4 text-gray-500" />; // Closed
      default:
        return <Clock className="w-4 h-4" />; // Fallback
    }
  };
  
  return (
    <Fragment>
      {loadingDisputeDetails ? (
        <LoadingSpinner fullScreen={true} message="Loading dispute details..." />
      ) : disputeDetails && (
        <Fragment>
          <div className={`space-y-10 md:space-y-20 min-h-screen bg-gray-50`}>
            <Navbar />
            
            <div className="mx-auto">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dispute Details</h1>
                        <p className="text-sm text-gray-500">Dispute ID: {disputeDetails.id}</p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm ${getDisputeStatusColor(disputeDetails.status)}`}
                    >
                      {getStatusIcon(disputeDetails.status)}
                      {disputeDetails.status.replace("_", " ")}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Transaction & Dispute Info */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Transaction Details */}
                    <TransactionDisputeInfo
                      sessionId={disputeDetails.transaction?.sessionId || ''}
                      transactionType={disputeDetails.transaction?.type || 'BUY'}
                      status={disputeDetails.transaction?.status || 'INITIATED'}
                      cryptoAmount={disputeDetails.transaction?.amountCrypto || ''}
                      cryptoCurrency={disputeDetails.transaction?.cryptocurrency?.symbol || ''}
                      fiatAmount={disputeDetails.transaction?.amountFiat || ''}
                      fiatCurrency={disputeDetails.transaction?.currency || ''}
                      rate={disputeDetails.transaction?.stableToFiatRate || ''}
                    />
                    
                    <DisputeInformation
                      reason={disputeDetails.disputeReason || ''}
                      createdAt={disputeDetails.createdAt}
                      updatedAt={disputeDetails.updatedAt}
                      attachments={disputeDetails.attachments}
                      adminNotes={disputeDetails?.resolutionNotes || ''}
                    />
                  </div>
                  
                  {/* Right Column - Dispute Messages */}
                  <div className="lg:col-span-2">
                    <DisputeMessage
                      loading={loadingDisputeMessages}
                      messages={disputeMessages || []}
                      sendMessageMutation={userSendDisputeMutation}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default ViewDisputePage;