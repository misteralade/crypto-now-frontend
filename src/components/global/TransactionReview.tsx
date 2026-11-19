import { useEffect, useState } from "react";
import { CheckCircle2, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { API_KIT } from "../../api/index.ts";

type Props = { sessionId: string; guest: boolean };

export default function TransactionReview({ sessionId, guest }: Props) {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const endpoint = guest ? "/review/guest" : "/review/user";

  useEffect(() => {
    let active = true;
    setVisible(false);
    setSubmitted(false);
    API_KIT.get(`${endpoint}/${encodeURIComponent(sessionId)}`).then(({ data }) => {
      if (active) setVisible(data.success && !data.data.reviewed && !data.data.optedOut);
    }).catch(() => { if (active) setVisible(false); });
    return () => { active = false; };
  }, [endpoint, sessionId]);

  useEffect(() => {
    if (!submitted) return;
    const timer = window.setTimeout(() => setVisible(false), 800);
    return () => window.clearTimeout(timer);
  }, [submitted]);

  async function submit() {
    setBusy(true); setError("");
    try {
      await API_KIT.post(endpoint, { sessionId, rating, message: rating < 4 ? message.trim() : undefined });
      setSubmitted(true);
    } catch { setError("We couldn't save your review. Please try again."); }
    finally { setBusy(false); }
  }

  async function optOut() {
    setBusy(true); setError("");
    try { await API_KIT.put("/review/user/preference/opt-out"); setVisible(false); }
    catch { setError("We couldn't save your preference. Please try again."); }
    finally { setBusy(false); }
  }

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><motion.section layout transition={{ duration: 0.2 }} role="dialog" aria-modal="true" aria-label="Transaction review" className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
      <AnimatePresence mode="wait" initial={false}>
      {submitted ? <motion.div key="thanks" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} role="status" className="flex items-center gap-3 py-2"><CheckCircle2 size={22} className="shrink-0 text-emerald-600" /><p className="text-sm font-semibold">Thanks for your review.</p></motion.div> : <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.14 }} className="space-y-3">
        <div className="flex justify-between gap-4"><p className="font-semibold">How was your experience?</p><button type="button" onClick={() => setVisible(false)} aria-label="Close review" className="text-gray-500">×</button></div>
        <div className="flex gap-1" role="group" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" aria-label={`${star} ${star === 1 ? "star" : "stars"}`} aria-pressed={rating === star} onClick={() => setRating(star)} className="p-1"><Star size={28} fill={star <= rating ? "#e9aa16" : "none"} color={star <= rating ? "#e9aa16" : "#9ca3af"} /></button>)}
        </div>
        {rating > 0 && rating < 4 && <label className="block text-sm">What could we have done better?<textarea className="mt-2 block w-full rounded-lg border border-gray-300 p-2" maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)} rows={3} /></label>}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="button" disabled={busy || !rating || (rating < 4 && !message.trim())} onClick={submit} className="rounded-lg bg-[#6B45D0] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Submit review</button>
        {!guest && <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={false} disabled={busy} onChange={optOut} />Never see this again</label>}
      </motion.div>}
      </AnimatePresence>
    </motion.section></div>
  );
}
