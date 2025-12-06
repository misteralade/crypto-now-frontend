import Navbar from "../../components/global/navbar/Navbar.tsx";
import DashboardContent from "./DashboardContent.tsx";

export default function DashboardPage() {
  return (
    <div className={`space-y-10 md:space-y-20 pb-14`}>
      <Navbar />
      <DashboardContent />
    </div>
  );
}
