import { useEffect, useRef, useState } from "react";

export default function ReceiptViewer({ url, label }: { url: string; label: string }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open) dialog.current?.showModal(); }, [open]);
  const pdf = (() => { try { return new URL(url, window.location.href).pathname.toLowerCase().endsWith(".pdf"); } catch { return false; } })();
  return (
    <div className="space-y-2 min-w-0">
      <p className="text-sm text-gray-500">{label}</p>
      <button type="button" onClick={() => setOpen(true)} className="block w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 text-left" aria-label={`Expand ${label}`}>
        {pdf ? <span className="flex h-40 items-center justify-center text-sm text-indigo-700">View PDF</span> : <img src={url} alt={label} className="h-40 w-full object-contain" />}
      </button>
      {open && <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); setOpen(false); }} className="m-auto w-[calc(100%-2rem)] max-w-4xl rounded-2xl bg-white p-4 backdrop:bg-black/60">
        <div className="mb-3 flex items-center justify-between gap-3"><p className="font-semibold">{label}</p><button type="button" onClick={() => setOpen(false)} className="rounded-lg border px-3 py-1 text-sm">Close</button></div>
        {pdf ? <object data={url} type="application/pdf" className="h-[70vh] w-full"><a href={url} target="_blank" rel="noreferrer">Open receipt</a></object> : <img src={url} alt={label} className="max-h-[70vh] w-full object-contain" />}
        <a href={url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-indigo-700 underline">Open receipt in a new tab</a>
      </dialog>}
    </div>
  );
}
