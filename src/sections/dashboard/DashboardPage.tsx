import Navbar from "../../components/global/navbar/Navbar.tsx";
import Footer from "../../components/global/Footer.tsx";
import DashboardContent from "./DashboardContent.tsx";

export default function DashboardPage() {

    return (
        <div className={`space-y-10 md:space-y-20`}>
            <Navbar />
            <DashboardContent />
            <Footer />
        </div>
    )
}