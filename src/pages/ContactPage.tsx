import Navbar from "../components/global/navbar/Navbar.tsx";
import Footer from "../components/global/Footer.tsx";
import CustomButton from "../components/global/Button.tsx";
import {
  ContactUsRequestSchema,
  type ContactUsRequestType,
} from "../schemas/user.schema.ts";
import { contactUsInitialState } from "../redux/states/user.states.ts";
import { toFormikValidate } from "zod-formik-adapter";
import { Form, Formik } from "formik";
import { Fragment } from "react";
import { useContactPage } from "../hooks/pages/useContactPage.ts";

const ContactPage = () => {
  const {
    // Values

    // Functions
    handleSubmit,
  } = useContactPage();

  return (
    <Fragment>
      <Navbar />
      <main className="w-full md:w-[90%] 2xl:max-w-7xl mx-auto px-4 md:px-0 mt-[34px] mb-[30px] lg:mb-[121px] text-lg text-[#454745] flex md:flex-row flex-col gap-x-8 lg:gap-[51px] md:mt-24">
        {/* LHS */}
        <aside className="w-full md:w-[270px] lg:w-[458px]">
          <h1 className="text-3xl lg:text-5xl xl:text-[64px] xl:leading-[70px] text-[#0E0F0C] font-bold mb-6">
            Get in touch with us
          </h1>
          <p className="text-lg">
            We’re here to help! Whether you have a question about our services,
            need assistance with your account, or want to provide feedback, our
            team is ready to assist you
          </p>
          <div className="mt-4 md:mt-8">
            <p className="text-xl">Email</p>
            {/*Email me, should have a Subject attached to the email*/}
            <a
              href="mailto:cryptonownaijahelpdesk@gmail.com?subject=Contact%20Us%20Inquiry"
              className="text-xl hover:text-blue-800"
              target="_blank"
            >
              cryptonownaijahelpdesk@gmail.com
            </a>
          </div>

          <div className="mt-4 md:mt-8">
            <p className="text-xl">Phone</p>
            <a
              href="tel:+2347016568181"
              className="text-xl hover:text-blue-800"
              target="_blank"
            >
              +234 701 6568 181
            </a>
          </div>
        </aside>

        {/* RHS */}
        <aside className="flex-1 mt-12 md:mt-0">
          <Formik<ContactUsRequestType>
            initialValues={contactUsInitialState}
            validate={toFormikValidate(ContactUsRequestSchema)}
            onSubmit={(values, { resetForm }) =>
              handleSubmit(values, resetForm)
            }
            validateOnBlur
            validateOnMount
          >
            {({
              handleChange,
              handleBlur,
              errors,
              touched,
              values,
              isSubmitting,
              isValid,
            }) => (
              <Form className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* First Name */}
                  <div className="relative">
                    <label className="absolute -top-3 left-6 px-2 text-sm font-medium bg-white">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your first name"
                      className="w-full lg:text-lg rounded-full border border-[#ECECEC] bg-white p-4 outline-none focus:ring-2 focus:ring-[#03034D]/20 placeholder:text-[#9A9A9A]"
                    />

                    {touched.firstName && errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="relative">
                    <label className="absolute -top-3 left-6 px-2 text-sm font-medium bg-white">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your last name"
                      className="w-full lg:text-lg rounded-full border border-[#ECECEC] bg-white p-4 outline-none focus:ring-2 focus:ring-[#03034D]/20 placeholder:text-[#9A9A9A]"
                    />

                    {touched.lastName && errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="my-8 relative">
                  <label className="absolute -top-3 left-6 px-2 text-sm font-medium bg-white">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your email address"
                    className="w-full lg:text-lg rounded-full border border-[#ECECEC] bg-white p-4 outline-none focus:ring-2 focus:ring-[#03034D]/20 placeholder:text-[#9A9A9A]"
                  />

                  {touched.email && errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="mt-4 relative">
                  <label className="absolute -top-3 left-6 px-2 text-sm font-medium bg-white">
                    How can we help you?
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your message"
                    className="w-full h-[206px] rounded-3xl border border-[#ECECEC] bg-white px-5 py-4 outline-none focus:ring-2 focus:ring-[#03034D]/20 placeholder:text-[#9CA3AF] resize-none"
                    rows={5}
                    maxLength={2000}
                    // disabled={isUpdating}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      {values.message.length}/2000
                    </p>

                    {touched.email && errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 md:mt-12 flex justify-end">
                  <CustomButton
                    buttonText={
                      isSubmitting ? "Sending Message..." : "Send Message"
                    }
                    disabled={!isValid || isSubmitting}
                    type="submit"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </aside>
      </main>
      <Footer />
    </Fragment>
  );
};

export default ContactPage;
