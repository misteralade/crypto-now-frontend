import { Fragment } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import SEO from "../components/global/SEO.tsx";

export const Route = createRootRoute({
  component: () => (
    <Fragment>
      <SEO />
      <Outlet />
      <TanStackRouterDevtools />
    </Fragment>
  ),
});
