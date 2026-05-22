import { useParams } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  setDisputeAttachments,
  setDisputeReason,
  setTransactionDetailSessionId,
} from "../../redux/transaction.slice.ts";
import { useTransactionQuery } from "../../queries/transaction.query.ts";
import type { MessageAttachment } from "../../types/transaction.types.ts";
// trigger pr 2
import { convertToMillify } from "../../util/index.util.ts";

export const useTransactionDetailsPage = () => {
  const dispatch = useDispatch();
  const {
    transactionDetails,
    loadingTransactionDetails,
    disputeTransactionInitiationMutation,
  } = useTransactionQuery();

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [showDisputeTransaction, setShowDisputeTransaction] = useState(false);

  const [disputeCountdown, setDisputeCountdown] = useState<string>("");
  const [canDispute, setCanDispute] = useState<boolean>(false);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const { id } = useParams({ from: "/dashboard/transactions/$id" });

  useEffect(() => {
    if (id) {
      dispatch(setTransactionDetailSessionId(id));
    }
  }, [id, dispatch]);

  // Countdown for dispute button (6 hours from createdAt)
  useEffect(() => {
    if (!transactionDetails?.createdAt) {
      setCanDispute(true);
      setDisputeCountdown("");
      return;
    }

    const updateCountdown = () => {
      const createdAt = new Date(transactionDetails.createdAt).getTime();
      const now = new Date().getTime();
      const oneHourInMs = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
      const disputeAvailableAt = createdAt + oneHourInMs;
      const diff = disputeAvailableAt - now;

      if (diff <= 0) {
        setCanDispute(true);
        setDisputeCountdown("");
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        return;
      }

      setCanDispute(false);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setDisputeCountdown(
        hours > 0
          ? `${hours}h ${minutes}m ${seconds}s`
          : minutes > 0
            ? `${minutes}m ${seconds}s`
            : `${seconds}s`,
      );
    };

    updateCountdown();
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [transactionDetails?.createdAt]);

  const handleDisputeReason = (value: string) =>
    dispatch(setDisputeReason(value));

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitDispute = (
    reason: string,
    attachments: MessageAttachment[],
  ) => {
    dispatch(setDisputeReason(reason));
    dispatch(setDisputeAttachments(attachments));

    disputeTransactionInitiationMutation.mutate();
  };

  const openDisputeMailTo = () => {
    const email = "Support@cryptonow.ng";
    const subject = `Dispute Transaction - ${transactionDetails?.sessionId || ""}`;
    const body = `Hello,\n\nI would like to dispute a transaction with the following details:\n\nTransaction ID: ${transactionDetails?.sessionId || ""}\nAmount: ${convertToMillify(Number(transactionDetails?.amountFiat)) || ""} ${transactionDetails?.currency || ""}\nDate: ${transactionDetails?.createdAt || ""}\n\nReason for Dispute:\n\n[Please provide your reason here]\n\nThank you.`;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const toggleDisputeTransaction = () =>
    setShowDisputeTransaction(!showDisputeTransaction);

  return {
    // 🧩 Values
    transactionDetails,
    loadingTransactionDetails,
    showDisputeTransaction,
    copiedField,
    disputeCountdown,
    canDispute,

    // ⚙️ Functions 2222
    toggleDisputeTransaction,
    handleDisputeReason,
    copyToClipboard,
    handleSubmitDispute,
    openDisputeMailTo,
  };
};
