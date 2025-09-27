import Navbar from "../../components/global/navbar/Navbar.tsx";
import DashboardContent from "./DashboardContent.tsx";
import {useEffect} from "react";
import {useNavigate} from "@tanstack/react-router";

export default function DashboardPage() {
    const isLoggedIn = localStorage.getItem("accessToken") !== null;
    const navigate = useNavigate();

    console.log(localStorage.getItem("accessToken"));

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