import Navbar from "../../components/global/navbar/Navbar.tsx";
import Footer from "../../components/global/Footer.tsx";

const TermsOfServicePage = () => {
  const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return (
    <>
      <Navbar />
      <section className="max-w-3xl md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl mx-auto mt-[34px] mb-[30px] lg:mb-[242px] px-4 text-lg text-[#454745]">
        <h1 className="text-3xl lg:text-5xl text-[#0E0F0C] font-bold mb-4">
          Terms of Service
        </h1>
        <p className="text-[#0E0F0C] text-base">
          Last updated: {formattedDate}
        </p>
        <aside className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold text-[#0E0F0C]">
            Terms and conditions
          </h2>
          <p>
            Favex Technology Limited conducts business in the Federal Republic
            of Nigeria and is committed to assisting the fight against money
            laundering [ML] and terrorist financing [TF], by operating an
            effective risk-based approach. <br /> <br /> By doing so, the
            company will seek to maintain compliance with legislative and
            regulatory requirements. This policy actively manages risks
            associated with money laundering and terrorist financing, and
            through risk mitigants, aims to prevent, detect, and report
            suspicions of money laundering and terrorist financing.
          </p>
        </aside>

        <aside className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold text-[#0E0F0C]">1. Introduction</h2>
          <p>
            Favex Technology Limited conducts business in the Federal Republic
            of Nigeria and is committed to assisting the fight against money
            laundering [ML] and terrorist financing [TF], by operating an
            effective risk-based approach. <br /> <br /> By doing so, the
            company will seek to maintain compliance with legislative and
            regulatory requirements. This policy actively manages risks
            associated with money laundering and terrorist financing, and
            through risk mitigants, aims to prevent, detect, and report
            suspicions of money laundering and terrorist financing.
          </p>
        </aside>

        <aside className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold text-[#0E0F0C]">
            2. Information we collect
          </h2>
          <div className="mt-6">
            <h3 className="text-xl font-bold text-[#0E0F0C]">
              2.1. Personal data
            </h3>
            <p className="mt-4">
              Favex Technology Limited conducts business in the Federal Republic
              of Nigeria and is committed to assisting the fight against money
              laundering [ML] and terrorist financing [TF], by operating an
              effective risk-based approach. <br /> <br /> By doing so, the
              company will seek to maintain compliance with legislative and
              regulatory requirements. This policy actively manages risks
              associated with money laundering and terrorist financing, and
              through risk mitigants, aims to prevent, detect, and report
              suspicions of money laundering and terrorist financing.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-[#0E0F0C]">
              2.2. Non-Personal data
            </h3>
            <p className="mt-4">
              Favex Technology Limited conducts business in the Federal Republic
              of Nigeria and is committed to assisting the fight against money
              laundering [ML] and terrorist financing [TF], by operating an
              effective risk-based approach. <br /> <br /> By doing so, the
              company will seek to maintain compliance with legislative and
              regulatory requirements. This policy actively manages risks
              associated with money laundering and terrorist financing, and
              through risk mitigants, aims to prevent, detect, and report
              suspicions of money laundering and terrorist financing.
            </p>
          </div>
        </aside>

        <aside className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold text-[#0E0F0C]">
            3. How we use your information
          </h2>
          <div className="mt-6">
            <h3 className="text-xl font-bold text-[#0E0F0C]">
              3.1. Personal data
            </h3>
            <p className="mt-4">
              Favex Technology Limited conducts business in the Federal Republic
              of Nigeria and is committed to assisting the fight against money
              laundering [ML] and terrorist financing [TF], by operating an
              effective risk-based approach. <br /> <br /> By doing so, the
              company will seek to maintain compliance with legislative and
              regulatory requirements. This policy actively manages risks
              associated with money laundering and terrorist financing, and
              through risk mitigants, aims to prevent, detect, and report
              suspicions of money laundering and terrorist financing.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-[#0E0F0C]">
              3.2. Non-Personal data
            </h3>
            <p className="mt-4">
              Favex Technology Limited conducts business in the Federal Republic
              of Nigeria and is committed to assisting the fight against money
              laundering [ML] and terrorist financing [TF], by operating an
              effective risk-based approach. <br /> <br /> By doing so, the
              company will seek to maintain compliance with legislative and
              regulatory requirements. This policy actively manages risks
              associated with money laundering and terrorist financing, and
              through risk mitigants, aims to prevent, detect, and report
              suspicions of money laundering and terrorist financing.
            </p>
          </div>
        </aside>
      </section>
      <Footer />
    </>
  );
};

export default TermsOfServicePage;
