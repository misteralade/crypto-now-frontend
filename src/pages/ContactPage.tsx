import PublicNavbar from "../components/global/navbar/PublicNavbar.tsx";
import FooterNew from "../components/pages/homepage/FooterNew.tsx";
import {
  ContactUsRequestSchema,
  type ContactUsRequestType,
} from "../schemas/user.schema.ts";
import { contactUsInitialState } from "../redux/states/user.states.ts";
import { toFormikValidate } from "zod-formik-adapter";
import { Form, Formik } from "formik";
import { useContactPage } from "../hooks/pages/useContactPage.ts";
import { FaWhatsapp } from "react-icons/fa6";
import { ROUTES } from "../util/constants.util.ts";

const inputBase =
  "w-full bg-white rounded-2xl border px-5 py-4 text-[#0E0F0C] placeholder:text-[#BDBDBD] outline-none transition-all focus:ring-2";

const inputStyle: React.CSSProperties = {
  borderColor: "rgba(148,142,238,0.25)",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "15px",
};

const labelStyle: React.CSSProperties = {
  position: "absolute",
  top: "-10px",
  left: "20px",
  padding: "0 6px",
  background: "white",
  fontSize: "12px",
  fontWeight: 600,
  color: "rgba(14,15,12,0.55)",
  fontFamily: "'DM Sans', sans-serif",
  letterSpacing: "0.02em",
};

const Field = ({
  label,
  error,
  touched,
  children,
}: {
  label: string;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <span style={labelStyle}>{label}</span>
    {children}
    {touched && error && (
      <p className="text-red-500 text-xs mt-1.5 pl-1">{error}</p>
    )}
  </div>
);

const ContactPage = () => {
  const { handleSubmit } = useContactPage();

  return (
    <div style={{ background: "#FAF9F7", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <PublicNavbar innerClassName="max-w-6xl mx-auto" />

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">

        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#948EEE" }}
          >
            Contact us
          </p>
          <h1
            className="text-4xl md:text-[56px] font-bold leading-tight"
            style={{ color: "#0E0F0C", letterSpacing: "-0.02em" }}
          >
            Get in touch with us
          </h1>
          <p className="mt-4 text-base md:text-lg max-w-xl mx-auto" style={{ color: "rgba(14,15,12,0.5)" }}>
            Whether you have a question, need help with your account, or want to share feedback — we're ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* LHS — contact info */}
          <aside className="lg:col-span-2 space-y-5">

            <div
              className="rounded-3xl p-6"
              style={{
                background: "white",
                border: "1px solid rgba(148,142,238,0.18)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
              }}
            >
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "rgba(14,15,12,0.35)" }}>Email</p>
              <a
                href="mailto:cryptonownaijahelpdesk@gmail.com?subject=Contact%20Us%20Inquiry"
                className="text-base font-medium hover:opacity-70 transition-opacity break-all"
                style={{ color: "#0E0F0C" }}
              >
                cryptonownaijahelpdesk@gmail.com
              </a>
            </div>

            <div
              className="rounded-3xl p-6"
              style={{
                background: "white",
                border: "1px solid rgba(148,142,238,0.18)",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
              }}
            >
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "rgba(14,15,12,0.35)" }}>Phone</p>
              <a
                href="tel:+2347016568181"
                className="text-base font-medium hover:opacity-70 transition-opacity"
                style={{ color: "#0E0F0C" }}
              >
                +234 701 6568 181
              </a>
            </div>

            <a
              href={ROUTES.SOCIALS.WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-3xl p-6 transition-all hover:scale-[1.01]"
              style={{
                background: "#948EEE",
                color: "white",
                boxShadow: "0 4px 20px rgba(148,142,238,0.35)",
              }}
            >
              <FaWhatsapp size={22} />
              <span className="text-base font-semibold">Chat on WhatsApp</span>
            </a>

          </aside>

          {/* RHS — form */}
          <div className="lg:col-span-3">
            <div
              className="rounded-3xl p-8 md:p-10"
              style={{
                background: "white",
                border: "1px solid rgba(148,142,238,0.18)",
                boxShadow: "0 2px 24px rgba(0,0,0,0.04)",
              }}
            >
              <Formik<ContactUsRequestType>
                initialValues={contactUsInitialState}
                validate={toFormikValidate(ContactUsRequestSchema)}
                onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                validateOnBlur
                validateOnMount
              >
                {({ handleChange, handleBlur, errors, touched, values, isSubmitting, isValid }) => (
                  <Form className="space-y-6">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Field label="First name" error={errors.firstName} touched={touched.firstName}>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Prosper"
                          className={`${inputBase} focus:ring-[#948EEE]/20`}
                          style={inputStyle}
                        />
                      </Field>

                      <Field label="Last name" error={errors.lastName} touched={touched.lastName}>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Okafor"
                          className={`${inputBase} focus:ring-[#948EEE]/20`}
                          style={inputStyle}
                        />
                      </Field>
                    </div>

                    <Field label="Email address" error={errors.email} touched={touched.email}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="you@example.com"
                        className={`${inputBase} focus:ring-[#948EEE]/20`}
                        style={inputStyle}
                      />
                    </Field>

                    <Field label="How can we help?" error={errors.message} touched={touched.message}>
                      <textarea
                        id="message"
                        name="message"
                        value={values.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Tell us what's on your mind..."
                        rows={5}
                        maxLength={2000}
                        className={`${inputBase} resize-none focus:ring-[#948EEE]/20`}
                        style={{ ...inputStyle, borderRadius: "20px" }}
                      />
                      <p className="text-xs mt-1.5 pl-1" style={{ color: "rgba(14,15,12,0.3)" }}>
                        {values.message.length}/2000
                      </p>
                    </Field>

                    <button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="w-full rounded-full py-4 text-white font-semibold text-base transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "#948EEE" }}
                    >
                      {isSubmitting ? "Sending…" : "Send message"}
                    </button>

                  </Form>
                )}
              </Formik>
            </div>
          </div>

        </div>
      </main>

      <FooterNew />
    </div>
  );
};

export default ContactPage;
