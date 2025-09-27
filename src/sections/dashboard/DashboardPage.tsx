import Navbar from "../../components/global/navbar/Navbar.tsx";
import DashboardContent from "./DashboardContent.tsx";
import {useEffect} from "react";
import {useNavigate} from "@tanstack/react-router";
import {LOCAL_STORAGE_KEYS} from "../../util/constants.ts";

export default function DashboardPage() {
    const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN) !== null;
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn){
            navigate({to: '/sign-in'})
        }
    }, [isLoggedIn]);

    return (
        <div className={`space-y-10 md:space-y-20 pb-14`}>
            <Navbar />
            <DashboardContent />
        </div>
    )
}