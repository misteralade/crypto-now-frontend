import { useParams } from "@tanstack/react-router";
import {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import {setDisputeAttachments, setDisputeReason, setTransactionDetailSessionId} from "../../redux/transaction.slice.ts";
import {useTransactionQuery} from "../../queries/transaction.query.ts";
import type {MessageAttachment} from "../../types/transaction.types.ts";

export const useTransactionDetailsPage = () => {
  const dispatch = useDispatch();
  const { transactionDetails, loadingTransactionDetails, disputeTransactionInitiationMutation } = useTransactionQuery();
  
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [showDisputeTransaction, setShowDisputeTransaction] = useState(false)
  
  const { id } = useParams({ from: '/dashboard/transactions/$id' })
  
  useEffect(() => {
    if (id) {
      dispatch(setTransactionDetailSessionId(id))
    }
  }, [id, dispatch]);
  
  const handleDisputeReason = (value: string) => dispatch(setDisputeReason(value))
  
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  const handleSubmitDispute = ( reason: string, attachments: MessageAttachment[]) => {
    dispatch(setDisputeReason(reason))
    dispatch(setDisputeAttachments(attachments))
    
    disputeTransactionInitiationMutation.mutate()
  }
  
  const toggleDisputeTransaction = () => setShowDisputeTransaction(!showDisputeTransaction)
  
  return {
    // 🧩 Values
    transactionDetails,
    loadingTransactionDetails,
    showDisputeTransaction,
    copiedField,
    
    // ⚙️ Functions
    toggleDisputeTransaction,
    handleDisputeReason,
    copyToClipboard,
    handleSubmitDispute,
  }
}