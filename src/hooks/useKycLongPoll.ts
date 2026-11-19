import { useCallback, useEffect, useRef, useState } from "react";
import { kycServiceApi } from "../api/kyc.api.ts";
import {
  KycSessionStepEnum,
  type KycSessionStep,
  type KycStatusResponse,
} from "../types/kyc.types.ts";

const PROCESSING_STEPS: KycSessionStep[] = [
  KycSessionStepEnum.IN_PROGRESS,
  KycSessionStepEnum.SUBMITTED,
  KycSessionStepEnum.RESUBMITTED,
];
const MAX_CONSECUTIVE_FAILURES = 3;
const INITIAL_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;

interface UseKycLongPollOptions {
  enabled: boolean;
  onStatusChange: (status: KycStatusResponse) => void;
  onError?: (error: unknown) => void;
}

export function useKycLongPoll({
  enabled,
  onStatusChange,
  onError,
}: UseKycLongPollOptions) {
  const [isPolling, setIsPolling] = useState(false);
  const abortRef = useRef(false);
  const consecutiveFailuresRef = useRef(0);
  const backoffRef = useRef(INITIAL_BACKOFF_MS);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onStatusChangeRef = useRef(onStatusChange);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
    onErrorRef.current = onError;
  }, [onStatusChange, onError]);

  const poll = useCallback(async () => {
    if (abortRef.current) return;

    setIsPolling(true);

    try {
      const response = await kycServiceApi.getStatus();

      if (abortRef.current) return;

      consecutiveFailuresRef.current = 0;
      backoffRef.current = INITIAL_BACKOFF_MS;

      if (response.success && response.data) {
        onStatusChangeRef.current(response.data);

        // Keep polling only while still processing
        if (
          PROCESSING_STEPS.includes(response.data.currentStep) &&
          !abortRef.current
        ) {
          timeoutRef.current = setTimeout(poll, 5000);
        } else {
          setIsPolling(false);
        }
      } else {
        setIsPolling(false);
      }
    } catch (error) {
      if (abortRef.current) return;

      consecutiveFailuresRef.current += 1;

      if (consecutiveFailuresRef.current >= MAX_CONSECUTIVE_FAILURES) {
        // Fall back to regular status polling
        setIsPolling(false);
        onErrorRef.current?.(error);
        return;
      }

      // Exponential backoff reconnect
      const backoff = Math.min(backoffRef.current * 2, MAX_BACKOFF_MS);
      backoffRef.current = backoff;
      timeoutRef.current = setTimeout(poll, backoff);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    abortRef.current = false;
    consecutiveFailuresRef.current = 0;
    backoffRef.current = INITIAL_BACKOFF_MS;

    poll();

    return () => {
      abortRef.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsPolling(false);
    };
  }, [enabled, poll]);

  return { isPolling };
}
