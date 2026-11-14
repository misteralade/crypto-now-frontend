import { useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authServiceApi } from "../../api/auth.api.ts";
import { EmailSchema } from "../../schemas/common.schema.ts";
import { extractErrorMessage } from "../../util/index.util.ts";
import { ArrowRight, MailCheck } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout.tsx";
import { ROUTES } from "../../util/constants.util.ts";

export default function CheckEmailPage() {
  const { email: initialEmail } = useSearch({ from: "/check-email" });
  const [email, setEmail] = useState(initialEmail);
  const resend = useMutation({
    mutationFn: (address: string) => authServiceApi.resendSignupVerification(address),
    onSuccess: ({ success, message }) => {
      if (success) toast.success(message);
      else toast.error(message);
    },
    onError: (error) => toast.error(extractErrorMessage(error) || "Couldn't resend the link. Try again."),
  });
  const validEmail = EmailSchema.safeParse(email).success;
  return (
    <AuthLayout layoutType={1}>
      <main className="mx-auto flex w-full max-w-md flex-col items-center px-1 py-8 text-center sm:py-12">
        <div className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-[32px] bg-[#F0EFFD] text-[#575AE5] sm:h-32 sm:w-32" aria-hidden="true">
          <div className="absolute inset-3 rounded-[24px] border border-[#DAD8FA]" />
          <MailCheck size={50} strokeWidth={1.35} />
        </div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#7772D9]">One more step</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#0E0F0C] sm:text-4xl">Check your email</h1>
        <p className="mt-4 max-w-sm text-base leading-7 text-[#454745]">
          We sent you a verification link. Open it to activate your CryptoNow account.
        </p>
        <form className="mt-7 w-full space-y-3 text-left" onSubmit={(event) => { event.preventDefault(); if (validEmail) resend.mutate(email); }}>
          <label htmlFor="verification-email" className="block text-sm font-semibold text-[#454745]">Email address</label>
          <input id="verification-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-xl border border-[#DCDCE6] px-4 text-sm text-[#0E0F0C] outline-none focus:border-[#7772D9] focus:ring-2 focus:ring-[#DAD8FA]" />
          <button type="submit" disabled={!validEmail || resend.isPending} className="min-h-11 w-full rounded-xl bg-[#03034D] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
            {resend.isPending ? "Sending..." : "Resend verification link"}
          </button>
        </form>
        <div className="mt-5 w-full rounded-2xl border border-[#EAE9F5] bg-[#FAFAFE] px-5 py-4 text-sm leading-6 text-[#6B6E6B]">
          Can't find it? Check your spam or junk folder.
        </div>
        <Link to={ROUTES.SIGNIN} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-[#575AE5] underline-offset-4 hover:underline">
          Back to sign in <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </main>
    </AuthLayout>
  );
}
