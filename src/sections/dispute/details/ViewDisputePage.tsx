import { Fragment } from "react";
import { useViewDisputeDetailsPage } from "../../../hooks/pages/useViewDisputeDetailsPage.ts";
import { LoadingSpinner } from "../../../components/global/LoadingSpinner.tsx";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import TransactionDisputeInfo from "./TransactionDisputeInfo.tsx";
import DisputeInformation from "./DisputeInformation.tsx";
import DisputeMessage from "./DisputeMessage.tsx";
import {
  getDisputeStatusConfig,
  DISPUTE_PRIORITY_CONFIG,
  type DisputePriorityType,
} from "../../../util/dispute.util.ts";

const ViewDisputePage = () => {
  const {
    disputeDetails,
    loadingDisputeDetails,
    disputeMessages,
    loadingDisputeMessages,
    copiedField,
    onBack,
    copyToClipboard,
    userSendDisputeMutation,
  } = useViewDisputeDetailsPage();

  const statusConfig = getDisputeStatusConfig(disputeDetails?.status);
  const StatusIcon = statusConfig.icon;

  const priorityConfig = disputeDetails?.priority
    ? DISPUTE_PRIORITY_CONFIG[disputeDetails.priority as DisputePriorityType]
    : null;

  return (
    <Fragment>
      {loadingDisputeDetails && !disputeDetails ? (
        <LoadingSpinner fullScreen={true} />
      ) : !disputeDetails ? (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#FEECEC", color: "#EB5757" }}
          >
            <AlertTriangle size={24} />
          </div>
          <h2
            className="text-xl font-extrabold mb-2"
            style={{ color: "#0E0F0C", letterSpacing: "-0.02em" }}
          >
            Dispute Not Found
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6B6E6B" }}>
            We could not find the dispute you requested. It may have been removed or you may have entered an incorrect link.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white transition-all active:scale-95"
            style={{ background: "#03034D" }}
          >
            Go Back
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 pb-12 pt-2 sm:px-6 space-y-4 sm:space-y-6">
          {/* ── Top Header ── */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={onBack}
                aria-label="Back"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all active:scale-95 hover:bg-gray-100 shrink-0"
                style={{
                  background: "#F7F7F9",
                  border: "1px solid #EEEEEE",
                  color: "#0E0F0C",
                }}
              >
                <ArrowLeft size={16} />
              </button>

              <h1
                className="text-sm sm:text-lg font-bold sm:font-extrabold truncate whitespace-nowrap"
                style={{
                  color: "#0E0F0C",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                Dispute Details
              </h1>
            </div>
          </div>

          {/* ── Status & Explanation Banner (Compressed) ── */}
          <div
            className="rounded-2xl px-4 py-3 border flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3"
            style={{
              background: statusConfig.bg,
              borderColor: statusConfig.border,
            }}
          >
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{
                  background: "#FFFFFF",
                  color: statusConfig.text,
                  border: `1px solid ${statusConfig.border}`,
                }}
              >
                <StatusIcon size={12} strokeWidth={2.5} />
                <span>{statusConfig.label}</span>
              </span>
              {priorityConfig && (
                <span
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{
                    background: priorityConfig.bg,
                    color: priorityConfig.text,
                    border: `1px solid ${priorityConfig.border}`,
                  }}
                >
                  Priority: {priorityConfig.label}
                </span>
              )}
            </div>

            <p
              className="text-xs sm:text-sm leading-relaxed font-medium"
              style={{ color: statusConfig.text }}
            >
              {statusConfig.description}
            </p>
          </div>

          {/* ── 2-Column Responsive Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Transaction + Dispute Details */}
            <div className="lg:col-span-5 space-y-6">
              <TransactionDisputeInfo
                transaction={disputeDetails.transaction}
                copiedField={copiedField}
                onCopy={copyToClipboard}
              />

              <DisputeInformation
                reason={disputeDetails.disputeReason}
                createdAt={disputeDetails.createdAt}
                updatedAt={disputeDetails.updatedAt}
                attachments={disputeDetails.attachments}
                resolutionNotes={disputeDetails.resolutionNotes}
              />
            </div>

            {/* Right Column: Live Support Conversation */}
            <div className="lg:col-span-7">
              <DisputeMessage
                loading={loadingDisputeMessages}
                messages={disputeMessages}
                sendMessageMutation={userSendDisputeMutation}
                disputeStatus={disputeDetails.status}
              />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ViewDisputePage;
