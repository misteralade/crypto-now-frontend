import Navbar from "../../components/global/navbar/Navbar.tsx";
import Footer from "../../components/global/Footer.tsx";

const PrivacyPolicyPage = () => {
  const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Navbar />
      <section className="w-full md:w-[90%] 2xl:max-w-7xl mx-auto mt-[34px] mb-[30px] lg:mb-[143px] px-4 text-lg text-[#454745] flex flex-col md:flex-row items-start gap-x-6 lg:gap-x-24">
        {/* LHS Table of Content */}
        <nav
          aria-label="Table of contents"
          className="w-full lg:w-[650px] text-nowrap font-medium"
        >
          <h2 className="text-lg lg:text-2xl text-[#0E0F0C] mb-4">
            Table of content
          </h2>

          <ul className="list-none space-y-4 text-base text-[#0E0F0C]">
            <li>
              <a href="#privacy-policy" className="hover:underline">
                Privacy Policy
              </a>
            </li>

            <li>
              <a href="#introduction" className="hover:underline">
                Introduction
              </a>
            </li>

            <li>
              <a
                href="#information-we-collect"
                className="font-semibold hover:underline"
              >
                Information we collect
              </a>
              <div className="mt-2 space-y-1 text-[#454745] font-normal">
                <a href="#personal-data" className="block hover:underline">
                  Personal data
                </a>
                <a href="#non-personal-data" className="block hover:underline">
                  Non-Personal data
                </a>
              </div>
            </li>

            <li>
              <a href="#how-we-use" className="font-semibold hover:underline">
                How we use your information
              </a>
              <div className="mt-2 space-y-1 text-[#454745] font-normal">
                <a href="#use-personal-data" className="block hover:underline">
                  Personal data
                </a>
                <a
                  href="#use-non-personal-data"
                  className="block hover:underline"
                >
                  Non-Personal data
                </a>
              </div>
            </li>
          </ul>
        </nav>
        {/* RHS */}
        <div className="mt-6 md:mt-0">
          <aside>
            <h1 className="text-3xl lg:text-5xl text-[#0E0F0C] font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-[#0E0F0C] text-base">
              Last updated: {formattedDate}
            </p>
          </aside>

          <aside className="mt-6 md:mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="privacy-policy"
            >
              Privacy Policy
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
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="introduction">
              1. Introduction
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
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="information-we-collect"
            >
              2. Information we collect
            </h2>
            <div className="mt-6 lg:mt-12">
              <h3
                className="text-xl font-bold text-[#0E0F0C]"
                id="personal-data"
              >
                2.1. Personal data
              </h3>
              <p className="mt-4">
                Favex Technology Limited conducts business in the Federal
                Republic of Nigeria and is committed to assisting the fight
                against money laundering [ML] and terrorist financing [TF], by
                operating an effective risk-based approach. <br /> <br /> By
                doing so, the company will seek to maintain compliance with
                legislative and regulatory requirements. This policy actively
                manages risks associated with money laundering and terrorist
                financing, and through risk mitigants, aims to prevent, detect,
                and report suspicions of money laundering and terrorist
                financing.
              </p>
            </div>

            <div className="mt-6 lg:mt-12">
              <h3
                className="text-xl font-bold text-[#0E0F0C]"
                id="non-personal-data"
              >
                2.2. Non-Personal data
              </h3>
              <p className="mt-4">
                Favex Technology Limited conducts business in the Federal
                Republic of Nigeria and is committed to assisting the fight
                against money laundering [ML] and terrorist financing [TF], by
                operating an effective risk-based approach. <br /> <br /> By
                doing so, the company will seek to maintain compliance with
                legislative and regulatory requirements. This policy actively
                manages risks associated with money laundering and terrorist
                financing, and through risk mitigants, aims to prevent, detect,
                and report suspicions of money laundering and terrorist
                financing.
              </p>
            </div>
          </aside>

          <aside className="mt-12 lg:mt-16 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="how-we-use">
              3. How we use your information
            </h2>
            <div className="mt-6 lg:mt-12">
              <h3
                className="text-xl font-bold text-[#0E0F0C]"
                id="use-personal-data"
              >
                3.1. Personal data
              </h3>
              <p className="mt-4">
                Favex Technology Limited conducts business in the Federal
                Republic of Nigeria and is committed to assisting the fight
                against money laundering [ML] and terrorist financing [TF], by
                operating an effective risk-based approach. <br /> <br /> By
                doing so, the company will seek to maintain compliance with
                legislative and regulatory requirements. This policy actively
                manages risks associated with money laundering and terrorist
                financing, and through risk mitigants, aims to prevent, detect,
                and report suspicions of money laundering and terrorist
                financing.
              </p>
            </div>

            <div className="mt-6 lg:mt-12">
              <h3
                className="text-xl font-bold text-[#0E0F0C]"
                id="use-non-personal-data"
              >
                3.2. Non-Personal data
              </h3>
              <p className="mt-4">
                Favex Technology Limited conducts business in the Federal
                Republic of Nigeria and is committed to assisting the fight
                against money laundering [ML] and terrorist financing [TF], by
                operating an effective risk-based approach. <br /> <br /> By
                doing so, the company will seek to maintain compliance with
                legislative and regulatory requirements. This policy actively
                manages risks associated with money laundering and terrorist
                financing, and through risk mitigants, aims to prevent, detect,
                and report suspicions of money laundering and terrorist
                financing.
              </p>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
