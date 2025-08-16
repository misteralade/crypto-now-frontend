import { createFileRoute } from "@tanstack/react-router";
import Navbar from "../components/global/Navbar";
import HeroSection from "../sections/homepage/HeroSection";
import StepsSection from "../sections/homepage/StepsSection";
import WhyCryptoNow from "../sections/homepage/WhyCryptoNow";
import Footer from "../components/global/Footer";
import CustomButton from "../components/global/Button";
import AllInOne from "../sections/homepage/AllInOne";
import Testimonials from "../sections/homepage/Testimonials";
import InstantTradeSection from "../sections/homepage/InstantTradeSection";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <InstantTradeSection />
      <StepsSection />
      <WhyCryptoNow />
      <AllInOne />
      <Testimonials />
      <div className="max-w-[960px] my-20 mx-auto text-center">
        <div className="text-5xl sm:text-7xl md:tex-8xl lg:text-9xl font-semibold">
          Your crypto,
        </div>
        <div className="text-5xl sm:text-7xl md:tex-8xl lg:text-9xl text-[#BDBDBD] font-semibold md:-mt-4 mb-6">
          your way
        </div>
        <CustomButton buttonText="Buy & sell crypto now" />
      </div>
      <Footer />
    </div>
  );
}
