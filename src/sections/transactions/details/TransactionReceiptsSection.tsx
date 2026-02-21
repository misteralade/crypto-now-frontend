import { Download, FileText } from "lucide-react";

interface TransactionReceiptsSectionProps {
  receiptImageUrl?: string | null;
  adminPaymentReceiptUrl?: string | null;
}

/** Renders user and admin payment receipts when viewing transaction details. */
const TransactionReceiptsSection = ({
  receiptImageUrl,
  adminPaymentReceiptUrl,
}: TransactionReceiptsSectionProps) => {
  const hasAnyReceipt = receiptImageUrl || adminPaymentReceiptUrl;
  if (!hasAnyReceipt) return null;

  const handleDownload = (url: string, filename?: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename ?? "receipt";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isPdf = (url: string) =>
    url.toLowerCase().endsWith(".pdf") || url.toLowerCase().includes(".pdf?");

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Receipts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {receiptImageUrl && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Your receipt</p>
            <div className="relative group rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
              <img
                src={receiptImageUrl}
                alt="Your payment receipt"
                className="w-full h-48 object-contain rounded-lg cursor-pointer hover:border-teal-500 transition-colors"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 group-hover:bg-black/20 transition-all">
                <button
                  type="button"
                  onClick={() => handleDownload(receiptImageUrl, "my-receipt.jpg")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/90 hover:bg-white shadow-md"
                  title="Download receipt"
                >
                  <Download className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        )}
        {adminPaymentReceiptUrl && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Payment confirmation receipt</p>
            {isPdf(adminPaymentReceiptUrl) ? (
              <a
                href={adminPaymentReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-3 h-48 rounded-lg border-2 border-gray-200 bg-gray-50 hover:border-teal-500 hover:bg-teal-50/50 transition-colors p-4 group"
              >
                <FileText className="w-12 h-12 text-gray-500 group-hover:text-teal-600" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-teal-700">
                  View receipt (PDF)
                </span>
                <span className="text-xs text-gray-500">Opens in new tab</span>
              </a>
            ) : (
              <div className="relative group rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
                <img
                  src={adminPaymentReceiptUrl}
                  alt="Payment confirmation receipt"
                  className="w-full h-48 object-contain rounded-lg cursor-pointer hover:border-teal-500 transition-colors"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 group-hover:bg-black/20 transition-all">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(adminPaymentReceiptUrl, "payment-confirmation-receipt.jpg")
                    }
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/90 hover:bg-white shadow-md"
                    title="Download receipt"
                  >
                    <Download className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionReceiptsSection;
