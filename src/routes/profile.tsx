import { createFileRoute, redirect } from "@tanstack/react-router";
import ProfilePage from "../sections/profile/ProfilePage.tsx";
import { LOCAL_STORAGE_KEYS } from "../util/constants.ts";

export const Route = createFileRoute("/profile")({
    beforeLoad: () => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        if (!accessToken) {
            throw redirect({
                to: "/sign-in",
            });
        }
    },
    component: ProfilePage,
});
