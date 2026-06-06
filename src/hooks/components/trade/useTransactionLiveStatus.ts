import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionServiceApi } from "../../../api/transaction.api.ts";
import { BASIC } from "../../../config/index.config.ts";
import { QUERY_KEYS } from "../../../queries/query.keys.ts";
import { TIME_IN_MILLISECONDS } from "../../../util/constants.util.ts";
import type { TransactionResponseEntity } from "../../../types/response.payload.types.ts";
import type { TransactionStatus } from "../../../types/request.payload.types.ts";

const TERMINAL_TRANSACTION_STATUSES = new Set([
  "COMPLETED",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
  "PAYOUT_FAILED",
  "DISPUTED",
  "REFUNDED",
]);

type TransactionStatusEventPayload = {
  transactionId: string;
  sessionId: string;
  previousStatus: string | null;
  status: TransactionStatus;
  source: "INSERT" | "UPDATE";
  transactionUpdatedAt: string;
};

type UseTransactionLiveStatusOptions = {
  enabled?: boolean;
  pollIntervalMs?: number;
};

const isTerminalTransactionStatus = (status?: string | null) =>
  !!status && TERMINAL_TRANSACTION_STATUSES.has(status);

export const useTransactionLiveStatus = (
  sessionId?: string,
  options: UseTransactionLiveStatusOptions = {},
) => {
  const isEnabled = !!sessionId && options.enabled !== false;
  const [transport, setTransport] = useState<"idle" | "sse" | "poll">("idle");
  const [eventStatus, setEventStatus] = useState<TransactionStatus | null>(null);
  const transportRef = useRef(transport);
  const eventSourceRef = useRef<EventSource | null>(null);
  const terminalEventSeenRef = useRef(false);
  const lastEventIdRef = useRef(0);

  useEffect(() => {
    transportRef.current = transport;
  }, [transport]);

  useEffect(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    terminalEventSeenRef.current = false;
    lastEventIdRef.current = 0;
    setEventStatus(null);
    setTransport("idle");
  }, [sessionId]);

  const queryKey = useMemo(
    () => [QUERY_KEYS.TRANSACTION.USER_TRANSACTION_DETAILS, sessionId],
    [sessionId],
  );

  const {
    data,
    isFetched,
    refetch,
    ...query
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!sessionId) {
        return null;
      }

      const { data, success } = await transactionServiceApi.getTransactionDetails(
        sessionId,
      );

      if (success) {
        return data;
      }

      return null;
    },
    enabled: isEnabled,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval:
      transport === "poll"
        ? options.pollIntervalMs ?? TIME_IN_MILLISECONDS.FIVE_SECONDS
        : false,
  });

  useEffect(() => {
    if (!isEnabled || !sessionId) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setTransport("idle");
      return;
    }

    if (!isFetched) {
      return;
    }

    const currentStatus = data?.status;
    if (isTerminalTransactionStatus(currentStatus)) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setTransport("idle");
      return;
    }

    if (transportRef.current === "poll") {
      return;
    }

    if (typeof window === "undefined" || typeof window.EventSource === "undefined") {
      setTransport("poll");
      return;
    }

    if (eventSourceRef.current) {
      return;
    }

    const streamUrl = `${BASIC.API_BASE_URL.replace(/\/$/, "")}/transaction/events/${encodeURIComponent(sessionId)}`;
    const eventSource = new EventSource(streamUrl, {
      withCredentials: true,
    });

    eventSourceRef.current = eventSource;

    const switchToPolling = (reason: string) => {
      terminalEventSeenRef.current = false;
      eventSource.close();
      eventSourceRef.current = null;
      setTransport("poll");
      console.info("[TransactionLiveStatus] Falling back to polling", {
        sessionId,
        reason,
      });
    };

    eventSource.onopen = () => {
      setTransport("sse");
      console.info("[TransactionLiveStatus] Opened SSE stream", {
        sessionId,
      });
    };

    const handleStatusEvent = (event: MessageEvent<string>) => {
      if (!event.data) {
        return;
      }

      const rawEventId = Number.parseInt(event.lastEventId || "0", 10);
      if (Number.isFinite(rawEventId) && rawEventId <= lastEventIdRef.current) {
        return;
      }

      if (Number.isFinite(rawEventId) && rawEventId > 0) {
        lastEventIdRef.current = rawEventId;
      }

      let payload: TransactionStatusEventPayload | null = null;
      try {
        payload = JSON.parse(event.data) as TransactionStatusEventPayload;
      } catch (error) {
        console.error("[TransactionLiveStatus] Failed to parse SSE payload", {
          sessionId,
          error,
        });
        return;
      }

      if (payload.sessionId !== sessionId) {
        return;
      }

      setEventStatus(payload.status);

      if (isTerminalTransactionStatus(payload.status)) {
        terminalEventSeenRef.current = true;
      }

      console.info("[TransactionLiveStatus] Received transaction status event", {
        sessionId,
        eventId: rawEventId,
        previousStatus: payload.previousStatus,
        status: payload.status,
        source: payload.source,
      });

      void refetch();
    };

    eventSource.addEventListener(
      "transaction-status",
      handleStatusEvent as EventListener,
    );

    eventSource.onmessage = handleStatusEvent;

    eventSource.onerror = () => {
      if (terminalEventSeenRef.current || isTerminalTransactionStatus(data?.status)) {
        eventSource.close();
        eventSourceRef.current = null;
        setTransport("idle");
        return;
      }

      switchToPolling("sse_error");
    };

    return () => {
      eventSource.removeEventListener(
        "transaction-status",
        handleStatusEvent as EventListener,
      );
      eventSource.close();
      if (eventSourceRef.current === eventSource) {
        eventSourceRef.current = null;
      }
    };
  }, [data?.status, isEnabled, isFetched, refetch, sessionId]);

  useEffect(() => {
    if (!data?.status) {
      return;
    }

    if (eventStatus === data.status) {
      setEventStatus(null);
    }
  }, [data?.status, eventStatus]);

  const liveData = useMemo(() => {
    if (!data) {
      return data;
    }

    if (!eventStatus || eventStatus === data.status) {
      return data;
    }

    return {
      ...data,
      status: eventStatus,
    } satisfies TransactionResponseEntity;
  }, [data, eventStatus]);

  return {
    ...query,
    data: liveData,
    isFetched,
    refetch,
    transport,
    isPollingFallback: transport === "poll",
    isSseActive: transport === "sse",
  };
};
