import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ToastContainer } from "react-toastify";
import {Provider} from "react-redux";
import QueryClientProviderWrapper from "../src/queries/ReactQuery.tsx";
import "./index.css";
import "./assets/css/colors.css";

import { routeTree } from "./routeTree.gen";
import {persistor, store} from "./store.ts";
import {PersistGate} from "redux-persist/integration/react";

const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
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
              className="toast-container"
            />
            <RouterProvider router={router} />
          </QueryClientProviderWrapper>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
}
