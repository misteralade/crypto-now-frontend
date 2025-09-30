import Navbar from "../../components/global/navbar/Navbar.tsx";
import ProfileContent from "./ProfileContent.tsx";

export default function ProfilePage() {
    return (
        <div className={`space-y-10 md:space-y-20 pb-14`}>
            <Navbar />
            <ProfileContent />
        </div>
    );
}
