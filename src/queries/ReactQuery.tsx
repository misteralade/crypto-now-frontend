import {type ReactNode, useState} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {TIME_IN_MILLISECONDS} from "../util/constants.ts";

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
            staleTime: TIME_IN_MILLISECONDS.TEN_SECONDS,
            gcTime: TIME_IN_MILLISECONDS.ONE_HOUR,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
