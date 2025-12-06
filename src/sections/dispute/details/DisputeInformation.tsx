import {Fragment} from "react";
import momentClient from "../../../lib/moment.ts";
import {Download, FileText } from "lucide-react";
import { formatFileSize } from "../../../util/index.util.ts";
import { ATTACHMENT_TYPE } from "../../../util/constants.util.ts";
import type {MessageAttachment} from "../../../types/transaction.types.ts";

interface DisputeInformationProps {
  reason: string;
  createdAt: Date;
  updatedAt: Date;
  attachments: MessageAttachment[];
  adminNotes: string;
}

const DisputeInformation = ({ reason, createdAt, updatedAt, attachments, adminNotes }: DisputeInformationProps) => {
  return (
    <Fragment>
      {/* Dispute Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dispute Information
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Reason</p>
            <p className="text-sm text-gray-900 max-h-96 overflow-y-scroll">{reason}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Created</p>
              <p className="text-sm text-gray-900">
                {momentClient.formatToTransactionInitiationDate(createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Last Updated</p>
              <p className="text-sm text-gray-900">
                {momentClient.formatToTransactionInitiationDate(updatedAt)}
              </p>
            </div>
          </div>
          
          {/* Initial Attachments */}
          {attachments && attachments.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">
                Initial Attachments ({attachments.length})
              </p>
              <div className="space-y-2 max-h-[400px] overflow-y-scroll">
                {attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {attachment.type === ATTACHMENT_TYPE.IMAGE ? (
                      <img
                        src={attachment.url}
                        alt={attachment.filename}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-gray-200">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {attachment.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Admin Notes */}
          {adminNotes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-900 mb-1">
                Admin Notes
              </p>
              <p className="text-sm text-blue-800">{adminNotes}</p>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default DisputeInformation;
