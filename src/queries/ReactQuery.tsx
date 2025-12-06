import {type ReactNode, useState} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {TIME_IN_MILLISECONDS} from "../util/constants.util.ts";

export default function ReactQueryRegistry({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            retryDelay: TIME_IN_MILLISECONDS.THREE_SECONDS,
            staleTime: TIME_IN_MILLISECONDS.TEN_SECONDS,
            gcTime: TIME_IN_MILLISECONDS.ONE_HOUR,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
            retryDelay: TIME_IN_MILLISECONDS.THREE_SECONDS,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
