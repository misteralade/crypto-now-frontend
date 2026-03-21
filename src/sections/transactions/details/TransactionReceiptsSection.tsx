import { Download, ExternalLink, FileText } from "lucide-react";

interface TransactionReceiptsSectionProps {
  receiptImageUrl?: string | null;
  adminPaymentReceiptUrl?: string | null;
}

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
    <div className="rounded-3xl p-5" style={{ background: "#FFFFFF", border: "1px solid #F0F0F0" }}>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#9A9A9A" }}>Payment Receipts</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {receiptImageUrl && (
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "#6B6E6B" }}>Your receipt</p>
            <div
              className="relative group rounded-2xl overflow-hidden"
              style={{ border: "1px solid #EEEEEE", background: "#F7F7F9" }}
            >
              <img
                src={receiptImageUrl}
                alt="Your payment receipt"
                className="w-full h-44 object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all rounded-2xl">
                <button
                  type="button"
                  onClick={() => handleDownload(receiptImageUrl, "my-receipt.jpg")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl shadow-md"
                  style={{ background: "#FFFFFF" }}
                  title="Download"
                >
                  <Download size={16} style={{ color: "#0E0F0C" }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {adminPaymentReceiptUrl && (
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "#6B6E6B" }}>Payment confirmation</p>
            {isPdf(adminPaymentReceiptUrl) ? (
              <a
                href={adminPaymentReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-3 h-44 rounded-2xl transition-all"
                style={{ border: "1px solid #EEEEEE", background: "#F7F7F9" }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#F0EFFD" }}>
                  <FileText size={20} style={{ color: "#948EEE" }} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold" style={{ color: "#0E0F0C" }}>View PDF Receipt</p>
                  <p className="text-[11px] mt-0.5 flex items-center justify-center gap-1" style={{ color: "#9A9A9A" }}>
                    Opens in new tab <ExternalLink size={10} />
                  </p>
                </div>
              </a>
            ) : (
              <div
                className="relative group rounded-2xl overflow-hidden"
                style={{ border: "1px solid #EEEEEE", background: "#F7F7F9" }}
              >
                <img
                  src={adminPaymentReceiptUrl}
                  alt="Payment confirmation receipt"
                  className="w-full h-44 object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all rounded-2xl">
                  <button
                    type="button"
                    onClick={() => handleDownload(adminPaymentReceiptUrl, "confirmation-receipt.jpg")}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl shadow-md"
                    style={{ background: "#FFFFFF" }}
                    title="Download"
                  >
                    <Download size={16} style={{ color: "#0E0F0C" }} />
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
