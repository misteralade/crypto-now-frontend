import { Link } from "@tanstack/react-router";
import HeroSectionNew from "../components/pages/homepage/HeroSectionNew.tsx";
import { ROUTES } from "../util/constants.util.ts";

const HeroNavbar = () => (
  <nav
    className="relative z-20 flex items-center justify-between px-6 md:px-12 py-4"
    style={{ background: "transparent" }}
  >
    {/* Logo */}
    <Link to={ROUTES.HOMEPAGE}>
      <img src="/logo.svg" alt="CryptoNow" className="h-8 w-auto" />
    </Link>

    {/* Auth buttons */}
    <div className="flex items-center gap-3">
      <Link
        to={ROUTES.SIGNIN}
        className="px-5 py-2 rounded-full text-sm font-semibold text-[#0E0F0C] border border-[#0E0F0C]/20 hover:bg-[#0E0F0C]/5 transition-colors"
      >
        Login
      </Link>
      <Link
        to={ROUTES.SIGNUP}
        className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-colors"
        style={{ background: "#948EEE" }}
      >
        Sign up
      </Link>
    </div>
  </nav>
);

const HeroPreviewPage = () => {
  return (
    <div style={{ background: "#f5f0e8", minHeight: "100vh" }}>
      <HeroNavbar />
      <HeroSectionNew />
    </div>
  );
};

export default HeroPreviewPage;
