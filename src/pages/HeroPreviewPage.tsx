import HeroSectionNew from "../components/pages/homepage/HeroSectionNew.tsx";
import WhyCryptoNowNew from "../components/pages/homepage/WhyCryptoNowNew.tsx";
import TestimonialsNew from "../components/pages/homepage/TestimonialsNew.tsx";
import FAQsNew from "../components/pages/homepage/FAQsNew.tsx";
import FooterNew from "../components/pages/homepage/FooterNew.tsx";
import PublicNavbar from "../components/global/navbar/PublicNavbar.tsx";

const HeroPreviewPage = () => {
  return (
    <div style={{ background: "#FAF9F7" }}>
      <PublicNavbar />
      <HeroSectionNew />
      <WhyCryptoNowNew />
      <TestimonialsNew />
      <FAQsNew />
      <FooterNew />
    </div>
  );
};

export default HeroPreviewPage;
