import Navbar from "../../components/global/navbar/Navbar.tsx";
import Footer from "../../components/global/Footer.tsx";
import { Fragment } from "react";

const AmlPolicyPage = () => {
  const formattedDate = "24 November 2025";

  return (
    <Fragment>
      <Navbar />
      <section className="w-full md:w-[90%] 2xl:max-w-8xl mx-auto mt-[34px] mb-[30px] lg:mb-[143px] px-4 text-lg text-[#454745] flex flex-col lg:grid lg:grid-cols-[30%_70%] lg:gap-8 items-start gap-x-6 lg:gap-x-24">
        {/* LHS Table of Content */}
        <nav
          aria-label="Table of contents"
          className="w-full hidden lg:w-[650px] text-nowrap font-medium lg:sticky lg:top-[34px] lg:self-start lg:max-h-[calc(100vh-68px)] lg:overflow-y-auto overflow-hidden lg:block"
        >
          <h2 className="text-lg lg:text-2xl text-[#0E0F0C] mb-4">
            Table of content
          </h2>

          <ul className="list-none space-y-4 text-base text-[#0E0F0C]">
            <li className="whitespace-nowrap">
              <a href="#regulatory-framework" className="hover:underline text-sm whitespace-nowrap">
                1. Regulatory Framework
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#user-due-diligence" className="hover:underline text-sm whitespace-nowrap">
                2. User Due Diligence (UDD)
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#risk-assessment" className="hover:underline text-sm whitespace-nowrap">
                3. Risk Assessment
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#employee-training" className="hover:underline text-sm whitespace-nowrap">
                4. Employee Training and Awareness
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#internal-controls" className="hover:underline text-sm whitespace-nowrap">
                5. Internal Controls and Audit
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#record-keeping" className="hover:underline text-sm whitespace-nowrap">
                6. Record Keeping
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#sanctions-compliance" className="hover:underline text-sm whitespace-nowrap">
                7. Sanctions Compliance
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#policy-review" className="hover:underline text-sm whitespace-nowrap">
                8. Policy Review
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#contact" className="hover:underline text-sm whitespace-nowrap">
                9. Contact
              </a>
            </li>
          </ul>
        </nav>
        {/* RHS */}
        <div className="mt-6 md:mt-0 lg:max-w-5xl">
          <aside>
            <h1 className="text-3xl lg:text-5xl text-[#0E0F0C] font-bold mb-4">
              AML/Compliance Policy
            </h1>
            <p className="text-[#0E0F0C] text-base">
              Last updated: {formattedDate}
            </p>
          </aside>

          <aside className="mt-6 md:mt-12 space-y-4">
            <p>
              This Anti-Money Laundering (AML) and Counter-Terrorism Financing
              (CFT) Compliance Policy is formulated to ensure that{" "}
              <strong>Alarora Innovations Limited</strong> operates in full
              compliance with all applicable laws, regulations, and regulatory
              directives related to anti-money laundering and counter-terrorism
              financing. The primary objective of this policy is to prevent our
              company, employees, and representatives from being used,
              intentionally or unintentionally, to facilitate financial crimes
              such as money laundering, terrorist financing, and proliferation
              financing, thereby maintaining the integrity of the global
              financial system and the cryptocurrency ecosystem.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="regulatory-framework"
            >
              1. Regulatory Framework
            </h2>
            <p className="mt-4">
              This Policy governs all activities and operations of our company
              and is designed to ensure full compliance with all applicable
              laws, regulations, and guidelines relevant to cryptocurrency
              operations, anti-money laundering (AML), and counter-terrorism
              financing (CTF). Our commitment to regulatory compliance is
              unwavering, and we adhere strictly to the following frameworks and
              any other relevant legislation or regulatory requirements that may
              apply:
            </p>
            <div className="mt-6 lg:mt-12 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  a. Central Bank of Nigeria (CBN) Regulations on Cryptocurrency
                  Operations
                </h3>
                <p className="mt-4">
                  We comply with all directives, circulars, and guidelines issued
                  by the CBN concerning the operation, management, and
                  regulation of cryptocurrency activities. This includes
                  adherence to restrictions on cryptocurrency trading, reporting
                  requirements, and any licensing obligations mandated by the
                  CBN.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  b. Nigerian Financial Intelligence Unit (NFIU) Guidelines
                </h3>
                <p className="mt-4">
                  Our company follows the NFIU's guidelines on identifying,
                  reporting, and managing suspicious transactions and
                  activities. We cooperate fully with the NFIU to ensure timely
                  submission of Suspicious Transaction Reports (STRs) and
                  Currency Transaction Reports (CTRs) as required.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  c. The Independent Corrupt Practices and Other Related
                  Offences Commission (ICPC) Act, 2000
                </h3>
                <p className="mt-4">
                  We ensure that our operations are free from corrupt practices
                  and comply with the provisions of the ICPC Act, which
                  prohibits corruption and related offenses. Our internal
                  controls and employee conduct policies are designed to detect
                  and prevent corrupt practices within our business.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  d. Money Laundering (Prevention and Prohibition) Act, 2022
                  (as amended)
                </h3>
                <p className="mt-4">
                  Our AML program is fully aligned with the provisions of this
                  Act. We implement robust procedures to prevent, detect, and
                  report money laundering activities, including customer due
                  diligence, transaction monitoring, and record-keeping as
                  stipulated.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  e. Terrorism (Prevention and Prohibition) Act, 2022
                </h3>
                <p className="mt-4">
                  We actively prevent the use of our platform for terrorism
                  financing by implementing stringent checks and controls
                  consistent with this Act. Our policies include screening
                  customers and transactions against known terrorist entities
                  and promptly reporting any suspicious activities.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  f. Financial Action Task Force (FATF) Recommendations
                </h3>
                <p className="mt-4">
                  In recognition of global AML/CTF standards, our policies and
                  procedures incorporate the FATF's recommendations. This
                  includes adopting a risk-based approach, enhancing customer
                  due diligence, and ensuring transparency in all transactions
                  to combat illicit financial flows.
                </p>
              </div>
            </div>
            <p className="mt-6">
              Our company commits to continually reviewing and updating this
              Policy to reflect changes in regulatory requirements and industry
              best practices.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="user-due-diligence"
            >
              2. User Due Diligence (UDD)
            </h2>
            <p className="mt-4">
              To uphold the highest standards of integrity and regulatory
              compliance, we implement comprehensive User Due Diligence
              procedures. These measures are critical to verifying the identity
              of our users and the legitimacy of their funds, thereby
              mitigating risks related to money laundering, terrorism
              financing, and other financial crimes.
            </p>
            <div className="mt-6 lg:mt-12 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  a. Verification of Identity and Ownership of Funds
                </h3>
                <p className="mt-4">
                  All users must provide valid, government-issued
                  identification documents such as the National Identification
                  Number (NIN), International Passport, or other acceptable
                  forms of ID. This verification process confirms the identity
                  of the user and ensures that the source of funds is legitimate.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  b. Continuous Monitoring of Customer Transactions
                </h3>
                <p className="mt-4">
                  We maintain ongoing surveillance of customer activities to
                  detect unusual or suspicious behaviour. This includes
                  real-time monitoring and periodic reviews of transaction
                  patterns to identify inconsistencies with the customer's
                  profile or known legitimate activities.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  c. Record Keeping and Maintenance
                </h3>
                <p className="mt-4">
                  Accurate and up-to-date records of customer identification,
                  transaction history, and due diligence activities are
                  maintained securely for as long as required by law. These
                  records facilitate audits, investigations, and regulatory
                  reporting.
                </p>
              </div>
            </div>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="risk-assessment"
            >
              3. Risk Assessment
            </h2>
            <p className="mt-4">
              Our company adopts a robust risk-based approach to AML/CTF
              compliance by conducting regular and systematic risk assessments.
              These assessments help us identify, evaluate, and mitigate the
              risks associated with our customers, products, services, and
              geographic exposure.
            </p>
            <div className="mt-6 lg:mt-12 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  a. Identification of Risks:
                </h3>
                <p className="mt-4">
                  We analyse the risk factors inherent in our customer base,
                  including their profiles, behaviour, and transaction
                  patterns. We also assess risks linked to specific products or
                  services that may be vulnerable to misuse, as well as
                  geographic risks where certain regions may have higher
                  incidences of financial crime.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  b. Evaluation and Prioritization:
                </h3>
                <p className="mt-4">
                  Each identified risk is evaluated based on its potential
                  impact and likelihood. This helps us prioritize resources and
                  controls to address the most significant risks effectively.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  c. Implementation of Risk-Based Controls:
                </h3>
                <p className="mt-4">
                  Based on the assessment, we tailor our internal controls,
                  policies, and procedures to mitigate identified risks. This
                  includes setting limits, enhancing due diligence measures,
                  staff training, and deploying technology solutions to monitor
                  and manage risks.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  d. Regular Review and Update:
                </h3>
                <p className="mt-4">
                  Risk assessments are conducted periodically and updated in
                  response to changes in the regulatory environment, business
                  operations, or emerging threats to ensure ongoing
                  effectiveness.
                </p>
              </div>
            </div>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="employee-training"
            >
              4. Employee Training and Awareness
            </h2>
            <p className="mt-4">
              We will conduct regular AML/CFT training programs for all
              employees to understand their responsibilities in understand the
              framework of this Policy. Employees are also kept informed of the
              updates on changes in AML laws, regulations, and company
              policies.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="internal-controls"
            >
              5. Internal Controls and Audit
            </h2>
            <p className="mt-4">
              There will be an appointment of a Compliance officer responsible
              for overseeing this program and overseeing strict adherence to the
              terms contained herein. In addition to this, periodic independent
              audits would be conducted to assess the effectiveness of our AML
              controls and procedures. There would also be audit logging that
              records every action taken by our Users and Admin.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="record-keeping"
            >
              6. Record Keeping
            </h2>
            <p className="mt-4">
              To ensure our records are not tampered with or damaged, there are
              secure storage facilities for all AML-related documentation and
              records, which are stored permanently. These records are readily
              accessible for regulatory review or for audit purposes. All
              activity logs are securely kept for a maximum of six (6) months
              before erasure.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="sanctions-compliance"
            >
              7. Sanctions Compliance
            </h2>
            <p className="mt-4">
              All our users and transactions are screened against Nigerian and
              international sanctions lists. Where users or entities are
              identified to be on the list, immediate action shall be taken to
              block or reject transactions involving these sanctioned users or
              entities.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="policy-review"
            >
              8. Policy Review
            </h2>
            <p className="mt-4">
              We shall review and update the AML Compliance Policy to reflect
              changes in laws, regulations, and company operations.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="contact">
              9. Contact
            </h2>
            <p className="mt-4">
              Should you have any general inquiries or concerns regarding this
              AML/Compliance Policy, please contact us using the details
              provided below.
            </p>
            <div className="mt-4 space-y-2">
              <p>
                <strong>Name:</strong> Alarora Innovations Limited
              </p>
              <p>
                <strong>Email:</strong> cryptonownaija@gmail.com
              </p>
              <p>
                <strong>Phone:</strong> 07016568181
              </p>
            </div>
            <p className="mt-6">
              This Policy is mandatory for all employees and stakeholders of
              Alarora Innovations Limited. Non-compliance may result in
              disciplinary action, including termination and reporting to
              relevant authorities.
            </p>
          </aside>
        </div>
      </section>
      <Footer />
    </Fragment>
  );
};

export default AmlPolicyPage;
