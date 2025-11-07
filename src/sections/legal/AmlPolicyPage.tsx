import Navbar from "../../components/global/navbar/Navbar.tsx";
import Footer from "../../components/global/Footer.tsx";

const AmlPolicyPage = () => (
  <>
    <Navbar />
    <section className="max-w-3xl md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl mx-auto mt-[34px] mb-[30px] lg:mb-[242px] px-4 text-lg text-[#454745]">
      <div className="text-center lg:px-20 xl:px-44">
        <h1 className="text-3xl lg:text-5xl text-[#0E0F0C] font-bold mb-4">
          Anti-money Laundering & KYC Policy
        </h1>
        <p className="text-base md:text-lg">
          Understand Our Commitment to Our AML and KYC Policies
        </p>
      </div>

      {/* foreword */}
      <aside className="mt-12 lg:mt-16">
        <h3 className="text-lg font-medium text-[#0E0F0C] uppercase">
          Foreword
        </h3>
        <div className="mt-6">
          Favex Technology Limited conducts business in the Federal Republic of
          Nigeria and is committed to assisting the fight against money
          laundering [ML] and terrorist financing [TF], by operating an
          effective risk-based approach. <br /> <br /> By doing so, the company
          will seek to maintain compliance with legislative and regulatory
          requirements. This policy actively manages risks associated with money
          laundering and terrorist financing, and through risk mitigants, aims
          to prevent, detect, and report suspicions of money laundering and
          terrorist financing.
        </div>
      </aside>

      {/* purpose */}
      <aside className="mt-12">
        <h3 className="text-lg font-medium text-[#0E0F0C] uppercase">
          Purpose
        </h3>
        <div className="mt-6">
          This policy sets out Favex Technology Limited principles and measures
          adopted to ensure that the firm adheres to applicable laws and
          regulatory requirements about combating money laundering, corruption,
          and terrorist financing. This document describes the degree of due
          diligence to be applied when establishing, managing, monitoring, and
          declassifying/terminating business relationships at the various stages
          of the client relationship lifespan.
          <br /> <br />
          <p>
            This document requires that the firm complies with the following
            basic principles:
          </p>
          <ul className="mt-3 list-disc list-inside md:list-outside pl-6 md:pl-8">
            <li>
              We do not accept funds that we know or are expected to know, are
              proceeds of criminal activities.
            </li>
            <li>
              We do not enter or maintain business relationships with shell
              banks (a Financial Institution with no physical presence in any
              country).
            </li>
            <li>
              We must always determine the identity of a contracting party and
              beneficial owners in respect of a transaction.
            </li>
            <li>
              A risk-based approach is applied throughout clients’ relationship
              lifespan.
            </li>
            <li>
              We undertake additional investigations for business relationships
              and transactions with increased risks
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <p>For employees, the main objectives of this policy are to:</p>
          <ul className="mt-3 list-disc list-inside md:list-outside pl-6 md:pl-8">
            <li>
              Enhance awareness of all employees (especially those in
              higher-risk roles) of the money laundering and financing terrorism
              risks the business faces.
            </li>
            <li>
              Enable staff to follow a Risk-Based Approach in mitigating money
              laundering (ML) and terrorism financing (FT) risks and provide
              reasonable assurance that the firm does not accept assets that it
              knows or should reasonably be expected to know are proceeds of
              crime.
            </li>
            <li>
              Ensure that the firm remains complaint with all relevant money
              laundering legislation and regulation.
            </li>
            <li>
              Define a framework for staff encountering suspicious activity,
              transactions, or behaviour to escalate/notify the Money Laundering
              Compliance Officer (MLCO) or Compliance Dept.
            </li>
            <li>
              Retain the confidence of the Organization’s key stakeholders,
              including regulators and law enforcement agencies.
            </li>
          </ul>
        </div>
      </aside>
    </section>
    <Footer />
  </>
);

export default AmlPolicyPage;
