import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "@tanstack/react-router";
import { setDisputeDetailsId } from "../../redux/transaction.slice.ts";
import { useTransactionQuery } from "../../queries/transaction.query.ts";
import { ROUTES } from "../../util/constants.util.ts";

export const useViewDisputeDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    disputeMessages,
    loadingDisputeMessages,
    disputeDetails,
    loadingDisputeDetails,
    userSendDisputeMutation,
  } = useTransactionQuery();

  const params = useParams({ strict: false }) as { id?: string };
  const id = params.id;

  useEffect(() => {
    if (id) {
      dispatch(setDisputeDetailsId(id));
    }
  }, [id, dispatch]);

  const onBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: ROUTES.TRANSACTION });
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch {
      // Fallback if clipboard API is not available
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedField(field);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    }
  };

  return {
    // Values
    disputeId: id,
    disputeMessages: disputeMessages ?? [],
    loadingDisputeMessages,
    disputeDetails,
    loadingDisputeDetails,
    copiedField,

    // Functions
    onBack,
    copyToClipboard,
    userSendDisputeMutation,
  };
};
