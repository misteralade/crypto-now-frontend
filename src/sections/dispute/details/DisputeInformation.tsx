import { FileText, Download, CheckCircle } from "lucide-react";
import momentClient from "../../../lib/moment.ts";
import { formatFileSize } from "../../../util/index.util.ts";
import { ATTACHMENT_TYPE, ROUTES } from "../../../util/constants.util.ts";
import { formatDisputeReason } from "../../../util/dispute.util.ts";
import type { MessageAttachment } from "../../../types/transaction.types.ts";
import { FaWhatsapp } from "react-icons/fa6";

interface DisputeInformationProps {
  reason: string;
  createdAt: Date;
  updatedAt: Date;
  attachments?: MessageAttachment[];
  resolutionNotes?: string | null;
}

const DisputeInformation = ({
  reason,
  createdAt,
  updatedAt,
  attachments = [],
  resolutionNotes,
}: DisputeInformationProps) => {
  const formattedReason = formatDisputeReason(reason);

  return (
    <div
      className="rounded-3xl p-5 sm:p-6 space-y-5"
      style={{ background: "#FFFFFF", border: "1px solid #F0F0F0" }}
    >
      <div>
        <p
          className="text-[10px] font-bold tracking-widest uppercase mb-1"
          style={{ color: "#9A9A9A" }}
        >
          Dispute Reason
        </p>
        <h3
          className="text-base sm:text-lg font-bold"
          style={{ color: "#0E0F0C", letterSpacing: "-0.01em" }}
        >
          {formattedReason}
        </h3>
      </div>

      {/* Description / Statement */}
      <div>
        <p
          className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
          style={{ color: "#9A9A9A" }}
        >
          Submitted Details
        </p>
        <div
          className="rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap"
          style={{ background: "#F7F7F9", border: "1px solid #EEEEEE", color: "#0E0F0C" }}
        >
          {reason}
        </div>
      </div>

      {/* Resolution Notes (if available) */}
      {resolutionNotes && (
        <div
          className="rounded-2xl p-4"
          style={{ background: "#E8F8F0", border: "1px solid #B7EAD0" }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle size={15} style={{ color: "#037847" }} />
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "#037847" }}
            >
              Resolution Notes
            </p>
          </div>
          <p
            className="text-xs sm:text-sm leading-relaxed"
            style={{ color: "#0E0F0C" }}
          >
            {resolutionNotes}
          </p>
        </div>
      )}

      {/* Attachments */}
      {attachments && attachments.length > 0 && (
        <div>
          <p
            className="text-[10px] font-bold tracking-widest uppercase mb-2"
            style={{ color: "#9A9A9A" }}
          >
            Initial Attachments ({attachments.length})
          </p>
          <div className="space-y-2">
            {attachments.map((att, idx) => {
              const isImg = att.type === ATTACHMENT_TYPE.IMAGE;
              return (
                <a
                  key={idx}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-2xl transition-all hover:bg-gray-50 active:scale-[0.99]"
                  style={{ background: "#F7F7F9", border: "1px solid #EEEEEE" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ background: "#FFFFFF", border: "1px solid #EAEAEA" }}
                  >
                    {isImg ? (
                      <img
                        src={att.url}
                        alt={att.filename}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If preview fails due to signed url, fallback to icon
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <FileText size={18} style={{ color: "#575AE5" }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{ color: "#0E0F0C" }}
                    >
                      {att.filename}
                    </p>
                    <p className="text-[11px]" style={{ color: "#9A9A9A" }}>
                      {formatFileSize(att.size)}
                    </p>
                  </div>

                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#FFFFFF", color: "#6B6E6B" }}
                  >
                    <Download size={14} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Direct WhatsApp Contact */}
      <div
        className="rounded-2xl p-4 flex items-center justify-between gap-3"
        style={{ background: "#F7FBF8", border: "1px solid #D6EFE0" }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#25D366", color: "#FFFFFF" }}
          >
            <FaWhatsapp size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold" style={{ color: "#0E0F0C" }}>
              Direct Support on WhatsApp
            </p>
            <p className="text-[11px]" style={{ color: "#6B6E6B" }}>
              +234 701 6568 181
            </p>
          </div>
        </div>

        <a
          href={ROUTES.SOCIALS.WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all active:scale-95 hover:opacity-90 shrink-0"
          style={{ background: "#03034D" }}
        >
          <span>Chat now</span>
        </a>
      </div>

      {/* Timestamps */}
      <div
        className="pt-4 grid grid-cols-2 gap-3 text-xs"
        style={{ borderTop: "1px solid #F0F0F0" }}
      >
        <div>
          <span style={{ color: "#9A9A9A" }}>Opened</span>
          <p className="font-semibold mt-0.5" style={{ color: "#0E0F0C" }}>
            {momentClient.formatToTransactionInitiationDate(createdAt)}
          </p>
        </div>
        <div>
          <span style={{ color: "#9A9A9A" }}>Last update</span>
          <p className="font-semibold mt-0.5" style={{ color: "#0E0F0C" }}>
            {momentClient.formatToTransactionInitiationDate(updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisputeInformation;
