import Navbar from "../../components/global/navbar/Navbar.tsx";
import Footer from "../../components/global/Footer.tsx";
import aboutImage from "../../assets/backgrounds/crypto-about.png";
import { WhatWeDo, WhyChooseUs } from "./about.data";
import CustomButton from "../../components/global/Button.tsx";

interface AboutPageProps {
  tradeCrypto: () => void;
}

const AboutPage = ({ tradeCrypto }: AboutPageProps) => (
  <>
    <Navbar />
    <main className="w-full md:w-[90%] 2xl:max-w-7xl mx-auto px-4 md:px-0 mt-[64px] mb-[30px] lg:mb-[121px] text-lg text-[#454745]">
      <aside className="xl:pr-56">
        <h1 className="text-3xl tracking-wide lg:text-5xl xl:text-[64px] xl:leading-[70px] text-[#0E0F0C] font-bold mb-6 xl">
          Making Cryptocurrency Simple and Accessible for Everyone
        </h1>
        <p className="text-[#0E0F0C] font-light mt-4 text-xl">
          Buy, sell, and manage your digital assets with ease — built for
          everyone, everywhere.
        </p>
      </aside>

      {/* our mission */}
      <section className="mt-12 space-y-4">
        <img
          src={aboutImage}
          alt="About-img"
          className="w-full h-auto max-h-[401px] object-cover rounded-2xl"
        />

        <div className="md:flex justify-between items-start gap-x-12 mt-6 md:mt-30">
          <aside className="text-[#0E0F0C]">
            <h3 className="text-2xl lg:text-5xl font-bold text-nowrap">
              Our Mission
            </h3>
            <p className="font-normal text-lg md:text-xl mt-2">
              We believe in the future of finance.
            </p>
          </aside>
          <aside className="text-[#454745] text-lg md:text-2xl font-normal">
            <p className="mb-6">
              In a world that’s becoming more digital every day, digital money
              has the power to create a fairer, more transparent, and more
              efficient financial system.
            </p>
            <p>
              Our mission is to make cryptocurrency accessible to everyone.
              We’re breaking down barriers, removing complexity, and building
              simple, secure tools that empower anyone to join the crypto
              revolution.
            </p>
          </aside>
        </div>

        {/* What we do */}
        <aside className="mt-26">
          <div className=" flex flex-col justify-center lg:px-24 xl:px-56">
            <h3 className="text-[#0E0F0C] text-2xl lg:text-5xl font-bold text-nowrap text-center">
              What we do
            </h3>
            <p className="text-center mt-4">
              CryptoNow is the easiest way to buy, store, and manage your
              cryptocurrency. We bridge the gap between traditional finance and
              the digital asset world.
            </p>
          </div>

          {/* grid cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[26px] mt-6 md:mt-10">
            {WhatWeDo.map((item) => (
              <aside
                key={item.id}
                className="group relative transition-transform duration-400 ease-out hover:-translate-y-1 hover:scale-[1.01]"
              >
                <div className="">
                  <img
                    src={item.icon}
                    alt="access-icon"
                    className="w-16 h-16"
                  />
                  <p className="text-[#0E0F0C] font-medium text-lg md:text-2xl mt-4">
                    {item.title}
                  </p>
                  <p className="text-base lg:text-lg mt-2">
                    {item.description}
                  </p>
                </div>
              </aside>
            ))}
          </div>
        </aside>
      </section>

      {/* Why choose us */}
      <div className="md:flex justify-between items-start gap-x-12 xl:gap-x-[72px] mt-6 md:mt-32">
        <aside className="text-[#0E0F0C]">
          <h3 className="text-2xl lg:text-5xl font-bold">
            Why Choose CryptoNow?
          </h3>
        </aside>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[26px] mt-6 md:mt-0 items-stretch">
          {WhyChooseUs.map((item) => (
            <aside
              key={item.id}
              className="group relative h-full transition-transform duration-400 ease-out hover:-translate-y-1 hover:scale-[1.01]"
            >
              <div className="h-full border-[#ECECEC] border p-3 rounded-[16px] bg-white transition-colors duration-300 group-hover:bg-[#F9F9FF] group-hover:shadow-sm group-hover:shadow-black/5 flex flex-col">
                <div className="bg-[#E5E5FB] p-2 w-fit rounded-lg">
                  <img src={item.icon} alt="access-icon" />
                </div>
                <p className="text-[#0E0F0C] font-medium text-lg md:text-2xl mt-4">
                  {item.title}
                </p>
                <p className="text-base lg:text-lg mt-2">{item.description}</p>
              </div>
            </aside>
          ))}
        </div>
      </div>

      {/* your crypto, your way */}
      <aside className="flex flex-col justify-center items-center text-center p-4 mt-20 lg:mt-[116px]">
        <div className="text-6xl md:text-[126px] font-semibold leading-20 md:leading-32 mb-6 md:mb-12">
          <h1 className="text-[#0E0F0C]">Your crypto,</h1>
          <p className="text-[#BDBDBD]">your way</p>
        </div>

        {/* <button className="bg-[#03034D] text-sm md:text-lg font-semibold text-white px-12 py-4 rounded-full cursor-pointer hover:bg-[#03034D]/90 transition-colors duration-300">
          Buy & sell crypto now
        </button> */}
        <CustomButton
          onClick={tradeCrypto}
          buttonText="Buy & sell crypto now"
        />
      </aside>
    </main>
    <Footer />
  </>
);

export default AboutPage;
