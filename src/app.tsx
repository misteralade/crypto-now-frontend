import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import QueryClientProviderWrapper from "../src/queries/ReactQuery.tsx";
import PWAInstallBanner from "./components/global/PWAInstallBanner.tsx";
import { LoadingSpinner } from "./components/global/LoadingSpinner.tsx";
import "./index.css";
import "./assets/css/colors.css";

import { routeTree } from "./routeTree.gen";
import { persistor, store } from "./store.ts";
import { PersistGate } from "redux-persist/integration/react";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 30000,
  // A route whose JS chunk isn't preloaded yet (no hover lead-time on touch,
  // or a link that never preloads at all) renders nothing until the chunk
  // downloads — that dead time is what reads as "the app froze" on click.
  // pendingMs/pendingMinMs together mean: only show the spinner once a
  // transition has genuinely taken >150ms, and once shown, keep it for at
  // least 200ms so it doesn't flash — an already-preloaded transition never
  // shows it at all.
  defaultPendingComponent: () => <LoadingSpinner fullScreen size="lg" />,
  defaultPendingMs: 150,
  defaultPendingMinMs: 200,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<RouterProvider router={router} />}>
          <QueryClientProviderWrapper>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <PWAInstallBanner />
            <RouterProvider router={router} />
          </QueryClientProviderWrapper>
        </PersistGate>
      </Provider>
    </StrictMode>,
  );
}
