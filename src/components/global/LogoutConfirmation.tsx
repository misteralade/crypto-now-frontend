import { useEffect, useRef } from "react";

interface LogoutConfirmationProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmation({ onCancel, onConfirm }: LogoutConfirmationProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="logout-title"
      aria-describedby="logout-description"
      onCancel={(event) => { event.preventDefault(); onCancel(); }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl border-0 bg-white p-6 shadow-2xl backdrop:bg-black/50"
    >
      <h2 id="logout-title" className="text-xl font-bold text-[#0E0F0C]">Log out?</h2>
      <p id="logout-description" className="mt-2 text-sm text-[#6B6E6B]">You'll need to sign in again to access your account.</p>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" autoFocus onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-[#454745]">Cancel</button>
        <button type="button" onClick={onConfirm} className="rounded-xl bg-[#EB5757] px-4 py-2 text-sm font-semibold text-white">Log out</button>
      </div>
    </dialog>
  );
}
