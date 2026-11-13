import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { PDF_MIME_TYPE, RECEIPT_ACCEPT, receiptFileError } from "../../util/receiptFile.ts";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onFileCleared: () => void;
  maxFiles: number;
  compact?: boolean;
}

export default function TradePaymentUpload({ onFileSelected, onFileCleared, compact = false }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const selectFile = (selected: File | undefined) => {
    if (!selected) return;
    const error = receiptFileError(selected);
    if (error) { toast.error(error); if (input.current) input.current.value = ""; return; }
    setFile(selected);
    onFileSelected(selected);
  };

  return (
    <div className="space-y-2 p-3" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]); }}>
      {file && preview && (file.type === PDF_MIME_TYPE ? (
        <object data={preview} type="application/pdf" aria-label="Receipt preview" className="w-full h-52 rounded-lg"><a href={preview} target="_blank" rel="noreferrer">View PDF</a></object>
      ) : <img src={preview} alt="Receipt preview" className="w-full max-h-64 rounded-lg object-contain" />)}
      {file && <p className="break-all text-xs text-gray-600">{file.name}</p>}
      <div className="flex items-center justify-center gap-3">
        <button type="button" onClick={() => input.current?.click()} className="rounded-xl border border-[#948EEE] px-4 py-2 text-sm font-semibold text-[#575AE5]">{file ? "Replace file" : compact ? "Choose file" : "Browse files"}</button>
        {file && <button type="button" onClick={() => { setFile(null); onFileCleared(); if (input.current) input.current.value = ""; }} className="text-sm text-red-600">Remove</button>}
      </div>
      <input ref={input} type="file" accept={RECEIPT_ACCEPT} onChange={(event) => selectFile(event.target.files?.[0])} className="hidden" />
      <p className="text-center text-xs text-gray-500">JPG, PNG or PDF, up to 5 MB</p>
    </div>
  );
}
