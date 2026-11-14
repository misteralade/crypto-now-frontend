import { Fragment } from "react";
import { useViewDisputeDetailsPage } from "../../../hooks/pages/useViewDisputeDetailsPage.ts";
import { LoadingSpinner } from "../../../components/global/LoadingSpinner.tsx";
import { ArrowLeft, Check, Copy, AlertTriangle } from "lucide-react";
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
        <div className="max-w-6xl mx-auto px-4 pb-12 pt-2 sm:px-6 space-y-6">
          {/* ── Top Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                aria-label="Back"
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-95 hover:bg-gray-100 shrink-0"
                style={{
                  background: "#F7F7F9",
                  border: "1px solid #EEEEEE",
                  color: "#0E0F0C",
                }}
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <h1
                  className="text-xl sm:text-2xl font-extrabold"
                  style={{
                    color: "#0E0F0C",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Dispute Details
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono" style={{ color: "#9A9A9A" }}>
                    ID: {disputeDetails.id.slice(0, 14)}...
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(disputeDetails.id, "disputeId")}
                    aria-label="Copy dispute ID"
                    className="p-1 rounded-md text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {copiedField === "disputeId" ? (
                      <Check size={12} className="text-emerald-600" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2">
              {priorityConfig && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    background: priorityConfig.bg,
                    color: priorityConfig.text,
                    borderColor: priorityConfig.border,
                  }}
                >
                  Priority: {priorityConfig.label}
                </span>
              )}

              <span
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border"
                style={{
                  background: statusConfig.bg,
                  color: statusConfig.text,
                  borderColor: statusConfig.border,
                }}
              >
                <StatusIcon size={13} strokeWidth={2.5} />
                <span>{statusConfig.label}</span>
              </span>
            </div>
          </div>

          {/* ── Status Explanation Banner ── */}
          <div
            className="rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 border"
            style={{
              background: statusConfig.bg,
              borderColor: statusConfig.border,
            }}
          >
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: "#FFFFFF",
                color: statusConfig.text,
              }}
            >
              <StatusIcon size={18} strokeWidth={2.2} />
            </div>

            <div className="flex-1 min-w-0">
              <h4
                className="text-xs sm:text-sm font-bold mb-0.5"
                style={{ color: statusConfig.text }}
              >
                Status: {statusConfig.label}
              </h4>
              <p
                className="text-xs sm:text-sm leading-relaxed"
                style={{ color: "#0E0F0C", opacity: 0.88 }}
              >
                {statusConfig.description}
              </p>
            </div>
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
