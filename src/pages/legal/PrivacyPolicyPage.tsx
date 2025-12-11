import Navbar from "../../components/global/navbar/Navbar.tsx";
import Footer from "../../components/global/Footer.tsx";
import { Fragment } from "react";

const PrivacyPolicyPage = () => {
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
              <a href="#lawful-basis" className="hover:underline text-sm whitespace-nowrap">
                1. Lawful Basis for Processing Your Data
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#consent" className="hover:underline text-sm whitespace-nowrap">
                2. Consent
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#personal-data-collect" className="hover:underline text-sm whitespace-nowrap">
                3. What Personal Data Do We Collect?
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#minors" className="hover:underline text-sm whitespace-nowrap">
                4. Information of Minors
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#how-we-use" className="hover:underline text-sm whitespace-nowrap">
                5. How Do We Use and Process Personal Data?
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#sharing" className="hover:underline text-sm whitespace-nowrap">
                6. Sharing Your Personal Data
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#retention" className="hover:underline text-sm whitespace-nowrap">
                7. How Do We Retain Personal Data?
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#your-rights" className="hover:underline text-sm whitespace-nowrap">
                8. What Are Your Rights?
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#protection" className="hover:underline text-sm whitespace-nowrap">
                9. How Do We Protect Your Personal Data?
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#remedies" className="hover:underline text-sm whitespace-nowrap">
                10. Remedies for Violation and Time-Frame for Remedy
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#changes" className="hover:underline text-sm whitespace-nowrap">
                11. Changes to Our Privacy Policy
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a href="#contact" className="hover:underline text-sm whitespace-nowrap">
                12. Contact Us
              </a>
            </li>
          </ul>
        </nav>
        {/* RHS */}
        <div className="mt-6 md:mt-0 lg:max-w-5xl">
          <aside>
            <h1 className="text-3xl lg:text-5xl text-[#0E0F0C] font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-[#0E0F0C] text-base">
              Last updated: {formattedDate}
            </p>
          </aside>

          <aside className="mt-6 md:mt-12 space-y-4">
            <p>
              At <strong>Alarora Innovations Limited</strong>, we value and are committed to
              protecting our users' Privacy and the Personal Data they share with
              us, ensuring it is handled with care and transparency. To further
              strengthen our resolve, we have established this Privacy Policy to
              highlight our privacy policies - what information is collected, how
              we use and process the data, the steps we take to safeguard the
              information, our sharing schemes if the data will be shared, your
              rights as a data subject and our retention period. This is
              applicable when you use our website.
            </p>
            <p>
              This Privacy Policy is formulated in full compliance with the
              provisions of the Nigeria Data Protection Act 2023 and other
              applicable data protection regulations.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="lawful-basis"
            >
              1. Lawful Basis for Processing Your Data
            </h2>
            <p>
              In line with our engagement, our legal basis for processing your
              personal data may be all or any of the following:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Upon provision of your consent.</li>
              <li>To fulfil the performance of the contract with you.</li>
              <li>
                For our legitimate business interest or that of a third party.
              </li>
              <li>
                To facilitate compliance with legal and regulatory obligations.
              </li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="consent">
              2. Consent
            </h2>
            <p>
              You give your consent to our processing of your personal data when
              you access our platforms for specific purposes such as, account
              creation, transaction processing or marketing communications. This
              consent is informed, freely given and revocable.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2
              className="text-2xl font-bold text-[#0E0F0C]"
              id="personal-data-collect"
            >
              3. What Personal Data Do We Collect?
            </h2>
            <div className="mt-6 lg:mt-12 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  a. Personal Information:
                </h3>
                <p className="mt-4">
                  This includes any information that can be used to identify you,
                  such as, your full name, date of birth, email address, phone
                  number, mailing address, proof of national identity, payment
                  details, and any other information you provide when signing up
                  or using our service. This may also user-generated content like
                  photos or messages.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  b. Transaction information:
                </h3>
                <p className="mt-4">
                  When you use our website to send and receive virtual
                  currencies, we collect and retain information about the
                  transaction. We may also collect associated information, such as
                  the full details of the digital currencies involved, evidence of
                  your transaction as a sender or beneficiary, and your
                  transaction history.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  c. Participant Personal Data:
                </h3>
                <p className="mt-4">
                  When you transact with a third party, either by buying or
                  selling, we may collect Personal Data about the other
                  participants associated with the transaction, such as, the name
                  and other details provided on the payment receipt about the
                  participant who is receiving digital currency from (or sending
                  digital currency to) you. We may also collect data about your
                  phone contacts with your consent, so you can easily transact
                  with your friends and contacts.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  d. Automatically Collected Information:
                </h3>
                <p className="mt-4">
                  When you visit or interact with our website, certain data is
                  collected automatically. This can include your IP address,
                  browser type, device type, operating system, time spent on our
                  website and click patterns. This helps us understand how you
                  engage on our website and identify any current or potential
                  technical issues and security threats.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  e. Information from other sources:
                </h3>
                <p className="mt-4">
                  We may collect information from other sources, such as our
                  social media platforms when you reach out to us to lodge a
                  complaint about our services. However, we will only ask for
                  information relevant to the help required of us to you.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  f. Other information we collect related to your use of our
                  website or Services:
                </h3>
                <p className="mt-4">
                  We may collect additional information from or about you when you
                  communicate with us, contact our customer support teams via the
                  website or respond to a survey and questionnaire created by us.
                </p>
              </div>
            </div>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="minors">
              4. Information of Minors
            </h2>
            <p>
              If you are under the age of 18, you are only eligible to use the
              service offered on our digital platform under the supervision and
              with the consent of your parent (s) or legally appointed guardian,
              in compliance with existing laws. To achieve this, a consent
              authorization form must be duly executed by the parent/legal
              guardian, and the minor. This form can be assessed and downloaded
              on the sign-up page. After the details have been correctly filled,
              it is to be uploaded on the relevant section of the sign-up page.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="how-we-use">
              5. How Do We Use and Process Personal Data?
            </h2>
            <p className="mt-4">
              We collect your personal data to provide and maintain the core
              functionalities of our service, ensuring an efficient and secure
              user experience. We may process your Personal Data for the
              following reasons:
            </p>
            <div className="mt-6 lg:mt-12 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  a. Provide services, including:
                </h3>
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>Authenticate your access to your account (s).</li>
                  <li>Buy or sell your preferred digital currency.</li>
                  <li>
                    Communicate with you about your account, transactions or
                    service updates.
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  b. Detect, prevent and manage risk, fraud, abuse, and other
                  illegal activities:
                </h3>
                <p className="mt-4">
                  To our services, and prevent you from fraud (by developing and
                  adopting measures of verifying your identity). To achieve this,
                  we deploy our risk and fraud tools by using the personal data,
                  device information and geolocation collected from you on our
                  Platform.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  c. Comply with our legal and regulatory obligations:
                </h3>
                <p className="mt-4">
                  And to enforce the terms of our website and services, including
                  compliance with all applicable laws and regulations.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  d. Trail and track information (data) breach:
                </h3>
                <p className="mt-4">
                  And remediate such identified breaches.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  e. Conduct research and analysis:
                </h3>
                <p className="mt-4">
                  To improve the service, develop new features, and enhance
                  security.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  f. Resolve disputes and troubleshoot problems.
                </h3>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  g. With your prior consent:
                </h3>
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>
                    Send promotional materials or offers to you if you have opted
                    in, while respecting your choices to unsubscribe.
                  </li>
                </ul>
                <p className="mt-4">
                  In the event you unsubscribe or object, we will stop sending
                  further promotional materials and communications to you by SMS
                  or email. You retain the right to withdraw your consent at any
                  time, without incurring any charge.
                </p>
              </div>
            </div>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="sharing">
              6. Sharing Your Personal Data
            </h2>
            <p className="mt-4">
              We respect your privacy and do not sell your personal data to third
              parties. However, we may share your information in the following
              ways:
            </p>
            <div className="mt-6 lg:mt-12 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  a. With trusted service providers:
                </h3>
                <p className="mt-4">
                  Who perform functions at our direction and on our behalf, such
                  as cloud hosting, payment processing, customer support, or
                  marketing services. These providers are contractually obligated
                  to protect your data. These third-party service providers may,
                  for example, provide you with services, verify your identity,
                  assist in processing transactions, send you advertisements for
                  our products and services, or provide customer support.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  b. With other financial institutions:
                </h3>
                <p className="mt-4">To process transactions.</p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  c. With the other parties to transactions:
                </h3>
                <p className="mt-4">
                  When you use the services, such as other users and their service
                  providers. This includes other users you are sending or
                  receiving cryptocurrencies from and their service providers. The
                  information might include:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>
                    Personal Data and account information necessary to facilitate
                    the transaction; and
                  </li>
                  <li>
                    Personal Data to help other participant(s) resolve disputes
                    and detect and prevent fraud.
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  d. Where permitted or required by law:
                </h3>
                <p className="mt-4">
                  We may share information about you with other parties for our
                  business purposes or as permitted or required by law, in any of
                  the following instances:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>
                    We may disclose information if required to do so to comply with
                    any court proceeding, other legal process, or applicable
                    regulation.
                  </li>
                  <li>
                    To law enforcement, government authorities, or other third
                    parties if required by law, legal process, or to protect
                    rights, property, or safety.
                  </li>
                  <li>
                    During business transactions such as mergers, acquisitions, or
                    asset sales, where your information may be transferred as part
                    of the deal, with assurances of privacy protection.
                  </li>
                  <li>
                    Where such disclosure is reasonably believed to be necessary
                    or appropriate to prevent imminent physical harm or financial
                    loss, or in connection with an investigation of suspected or
                    actual illegal activity.
                  </li>
                  <li>
                    With regulators for the purposes of anti-fraud compliance, and
                    related due diligence, all in accordance with applicable data
                    privacy regulations and laws.
                  </li>
                  <li>
                    To investigate violations of or enforce a user agreement or
                    other legal terms applicable to any service.
                  </li>
                  <li>To protect our property, services and legal rights.</li>
                  <li>
                    To support our audit, compliance, and corporate governance
                    functions.
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  e. With your consent:
                </h3>
                <p className="mt-4">
                  We also will share your Personal Data and other information with
                  your consent or direction.
                </p>
              </div>
            </div>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="retention">
              7. How Do We Retain Personal Data?
            </h2>
            <p className="mt-4">
              We retain your personal information only for as long as necessary to
              fulfill the purposes outlined in this policy or to comply with
              legal obligations. This means:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                Keeping data for the duration of your account activity and any
                related services.
              </li>
              <li>
                Retaining certain information for a period after account closure
                to resolve disputes, enforce agreements, or comply with laws.
              </li>
              <li>
                Regularly reviewing and securely deleting or anonymizing data that
                is no longer needed.
              </li>
            </ul>
            <p className="mt-4">
              Subject to applicable law, which may, from time to time, oblige us
              to retain your Personal Data for a certain period, we will retain
              your Personal Data for as long as necessary to fulfil the purposes
              we collect it for, including the purposes of satisfying any legal,
              accounting, or reporting obligations.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="your-rights">
              8. What Are Your Rights?
            </h2>
            <div className="mt-6 lg:mt-12 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  a. Right to be informed.
                </h3>
                <p className="mt-4">
                  As a data subject, you must be informed of the use and extent of
                  processing your personal data. In compliance with this
                  obligation, we have published this privacy notice.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  b. Requests to Access, Rectify or Erase.
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-[#0E0F0C]">
                      i. Access Request
                    </h4>
                    <p className="mt-2">
                      As permitted under law and applicable data protection
                      legislation, you have the right to access your data and
                      obtain a copy of this personal data and other supplementary
                      information we may hold. A copy of that Personal Data will
                      be given in an electronic form without payment of a fee,
                      unless you request that a physical copy is delivered to
                      your given address at an undertaken fee. This right of
                      access is given without prejudice to the rights of other
                      data subjects. This right of access gives life to your
                      other rights such as rectification, erasure or objection to
                      further processing.
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-[#0E0F0C]">
                      ii. Rectification Request
                    </h4>
                    <p className="mt-2">
                      You have the right to request that an updated version of
                      your Personal data is processed. Also, you can ask us to
                      correct your Personal Data (including by means of providing
                      a supplementary statement) if it is inaccurate, or update
                      outdated or incomplete or irrelevant Personal Data without
                      undue delay.
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-[#0E0F0C]">
                      iii. Erasure Request
                    </h4>
                    <p className="mt-2">
                      You have the right to ask us to erase your Personal Data
                      if:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                      <li>
                        Your Personal Data are no longer necessary for the
                        purpose(s) they were collected for.
                      </li>
                      <li>Your Personal Data have been unlawfully processed.</li>
                      <li>
                        Your Personal Data must be erased to comply with a
                        legislation or court order.
                      </li>
                      <li>
                        You withdraw your consent for the processing of the
                        Personal Data (and this is the only basis on which we are
                        processing your Personal Data).
                      </li>
                      <li>
                        You object to the possession, provided there are no
                        overriding legitimate grounds for continued processing, or
                      </li>
                      <li>
                        You object to processing for direct marketing purposes.
                      </li>
                    </ul>
                    <p className="mt-4">
                      If we receive your erasure request, we will also take
                      reasonable steps to inform other data controllers processing
                      the data so they can seek to erase links to or copies of
                      your Personal Data. We may refuse to act on your request to
                      erase your Personal Data if the processing of your Personal
                      Data is necessary:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                      <li>
                        To exercise our right of freedom of expression and
                        information.
                      </li>
                      <li>
                        To comply with the relevant Nigerian laws and regulations.
                      </li>
                      <li>
                        For the performance of a task carried out in the public
                        interest or to exercise some official authority vested in
                        us.
                      </li>
                      <li>
                        To establish, exercise or defend legal claims.
                      </li>
                      <li>
                        To comply with pertinent legal and regulatory directives.
                      </li>
                    </ul>
                    <p className="mt-4">
                      In these cases, we can restrict the processing instead of
                      erasing your Personal Data if requested to do so by you.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  c. Right to Object to Processing:
                </h3>
                <p className="mt-4">
                  You have the right to object at any time to the further
                  processing of your Personal Data. We may however dishonour your
                  request in the following situations and continue to process your
                  personal data where there are public interest or other
                  legitimate grounds, and we are able to give compelling reasons
                  which overrides your fundamental rights and freedoms, and your
                  interests.
                </p>
                <p className="mt-4">
                  Where you object to processing for direct marketing purposes,
                  your personal data shall no longer be processed for such
                  purposes.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  d. Requests to Restrict:
                </h3>
                <p className="mt-4">
                  You have the right to ask us to restrict the processing of your
                  Personal Data if:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                  <li>
                    You have a request, and you want us to stop processing your
                    data pending the resolution of such request.
                  </li>
                  <li>
                    You object to the accuracy of your Personal Data, and we are
                    in the process of verifying the Personal Data we hold.
                  </li>
                  <li>
                    The processing is unlawful, and you do not want us to erase
                    your Personal Data.
                  </li>
                  <li>
                    We no longer need your Personal Data for the original
                    purpose(s) of processing, but you need them to establish,
                    exercise or defend legal claims and you do not want us to
                    delete the Personal Data as a result, or
                  </li>
                </ul>
                <p className="mt-4">
                  Where processing is restricted, we may store your Personal Data,
                  and will only process your Personal Data:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                  <li>If you have given us your consent.</li>
                  <li>
                    For establishing, exercising or defending legal claims.
                  </li>
                  <li>
                    For protecting the rights of another natural or legal person,
                    or
                  </li>
                  <li>
                    For reasons of important public interest as defined under the
                    NDPA and relevant Nigerian laws
                  </li>
                  <li>
                    To comply with pertinent legal and regulatory directives.
                  </li>
                </ul>
                <p className="mt-4">
                  Once processing is restricted following your request, we will
                  inform you before we lift the restriction and continue processing
                  your data.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  e. Requests for Data Portability:
                </h3>
                <p className="mt-4">
                  Subject to the directives of the Nigeria Data Protection
                  Commission and technical possibilities, you have this right in
                  different forms:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                  <li>
                    First, you have the right to request that your data is given
                    to you in a structured, commonly used, and machine-readable
                    format without undue delay.
                  </li>
                  <li>
                    Secondly, you can transmit the data obtained in a readable
                    format to another organisation without any hindrance.
                  </li>
                  <li>
                    You can request for the data to be transmitted directly to
                    another organisation where it is technically possible to do so
                    in any file format.
                  </li>
                </ul>
                <p className="mt-4">
                  This right of portability can come with a reasonable fee where
                  any of such requests is manifestly unfounded or excessive. If
                  your request relates to a set of Personal Data that also
                  concerns other individuals, we may restrict the transfer to only
                  the portion relevant to you, unless you establish that you have
                  also gotten their consent.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  f. Prohibition to Automated Decision-Making:
                </h3>
                <p className="mt-4">
                  Generally, you have the right to object to any decision
                  concerning you or which otherwise significantly and legally
                  affects you if this is based solely on the automated processing
                  of your Personal Data without human intervention. This includes
                  automated decisions based on profiling. However, we may refuse
                  your request regarding such automated decisions where:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2 ml-4">
                  <li>
                    Necessary for entering a contract with you, or for the
                    performance of your contract with us.
                  </li>
                  <li>Permitted by regulations, or</li>
                  <li>Based on your authorised consent.</li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  g. Withdrawal of consent:
                </h3>
                <p className="mt-4">
                  Where consent has been provided, you are entitled to retract
                  such consent at any time, with the same ease as when it was
                  initially obtained. Nonetheless, the withdrawal of consent does
                  not impact the legality of data processing activities conducted
                  based on consent prior to its withdrawal.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0E0F0C]">
                  h. Right to lodge complaint:
                </h3>
                <p className="mt-4">
                  Where you are dissatisfied with the decision, action, or inaction
                  of a data controller or data processor, you have the right to
                  lodge a complaint with the Nigeria Data Protection Commission
                  (NDPC) for remedial action.
                </p>
              </div>
            </div>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="protection">
              9. How Do We Protect Your Personal Data?
            </h2>
            <p className="mt-4">
              We implement robust security measures to safeguard your data,
              including:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                Encryption of sensitive information during transmission and
                storage to prevent unauthorized access.
              </li>
              <li>
                Regular security assessments and audits to identify and fix
                vulnerabilities by periodically conducting vulnerabilities checks
                and penetration testing.
              </li>
              <li>
                Access controls limiting data access to only authenticated and
                authorized personnel only. Our personnel are only granted the
                minimum access and permissions necessary to perform their job
                duties.
              </li>
              <li>
                Integrating secure infrastructure and software practices
                throughout our technology and operations to reduce risks of
                breaches or data loss.
              </li>
              <li>
                Adopting and enforcing appropriate security measures such as
                securing and maintaining the privacy of your password(s) and
                account/profile registration information.
              </li>
            </ul>
            <p className="mt-4">
              Despite our efforts, we encourage you to take precautions like using
              strong passwords and keeping your login details confidential.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="remedies">
              10. Remedies for Violation and Time-Frame for Remedy
            </h2>
            <p className="mt-4">
              In the unlikely event that any of your rights as our data subject
              are violated, we commit to addressing the issue and redressing the
              violation as promptly and effectively as possible within thirty (30)
              days of receiving a formal complaint. The available remedies include,
              but are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Correction or deletion of your data</li>
              <li>Granting access to your data</li>
              <li>
                Providing due information regarding the processing of your data
              </li>
              <li>Restricting further processing</li>
              <li>
                Other applicable remedies as prescribed by relevant laws
              </li>
            </ul>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="changes">
              11. Changes to Our Privacy Policy
            </h2>
            <p className="mt-4">
              We reserve the right to update or modify this Privacy Policy at any
              time. When we do, we will revise the updated date at the bottom of
              this page. We encourage you to review this Privacy Policy
              periodically to stay informed about how we are protecting your
              information. Your continued use of our services after any changes
              signifies your acceptance of the updated Privacy Policy.
            </p>
          </aside>

          <aside className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-[#0E0F0C]" id="contact">
              12. Contact Us
            </h2>
            <p className="mt-4">
              Should you have any general inquiries or concerns regarding this
              Privacy Policy or our methods for handling your Personal Data, please
              contact us using the details provided below.
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
          </aside>
        </div>
      </section>
      <Footer />
    </Fragment>
  );
};

export default PrivacyPolicyPage;
