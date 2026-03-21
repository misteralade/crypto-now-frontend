import { ArrowUpFromLine, ChevronDown, FileText, Table } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useTransactionQuery } from "../../../queries/transaction.query.ts";

const ExportTransaction = () => {
  const { downloadAllTransactionMutation } = useTransactionQuery();
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleExport = (fileType: "CSV" | "PDF") => {
    setShowDropdown(false);
    downloadAllTransactionMutation.mutate(fileType);
  };

  const isLoading = downloadAllTransactionMutation.isPending;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setShowDropdown((v) => !v)}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all active:scale-[0.97] disabled:opacity-60"
        style={{
          background: "#0E0F0C",
          color: "#FFFFFF",
          border: "none",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontWeight: 600,
          fontSize: "13px",
          whiteSpace: "nowrap",
        }}
      >
        <ArrowUpFromLine size={15} className={isLoading ? "animate-bounce" : ""} />
        <span>{isLoading ? "Sending…" : "Export"}</span>
        <ChevronDown
          size={14}
          style={{
            transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            opacity: 0.7,
          }}
        />
      </button>

      {showDropdown && (
        <div
          className="absolute right-0 mt-2 rounded-2xl overflow-hidden z-50"
          style={{
            background: "#FFFFFF",
            border: "1px solid #EEEEEE",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            minWidth: "180px",
          }}
        >
          <button
            onClick={() => handleExport("CSV")}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors hover:bg-gray-50"
            style={{ color: "#0E0F0C" }}
          >
            <Table size={15} style={{ color: "#948EEE" }} />
            Export as CSV
          </button>
          <div style={{ height: "1px", background: "#F7F7F9", margin: "0 12px" }} />
          <button
            onClick={() => handleExport("PDF")}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors hover:bg-gray-50"
            style={{ color: "#0E0F0C" }}
          >
            <FileText size={15} style={{ color: "#037847" }} />
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportTransaction;
