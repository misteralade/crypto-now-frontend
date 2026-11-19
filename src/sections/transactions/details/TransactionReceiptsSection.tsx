import ReceiptViewer from "../../../components/global/ReceiptViewer.tsx";

export default function TransactionReceiptsSection({ receiptImageUrl, adminPaymentReceiptUrl }: { receiptImageUrl?: string | null; adminPaymentReceiptUrl?: string | null }) {
  if (!receiptImageUrl && !adminPaymentReceiptUrl) return null;
  return <div className="rounded-3xl border border-gray-100 bg-white p-5">
    <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment receipts</p>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {receiptImageUrl && <ReceiptViewer url={receiptImageUrl} label="Your receipt" />}
      {adminPaymentReceiptUrl && <ReceiptViewer url={adminPaymentReceiptUrl} label="Payment confirmation" />}
    </div>
  </div>;
}
