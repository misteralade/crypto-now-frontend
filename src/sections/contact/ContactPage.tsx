import Navbar from "../../components/global/navbar/Navbar.tsx";
import Footer from "../../components/global/Footer.tsx";
import CustomButton from "../../components/global/Button.tsx";

const ContactPage = () => (
  <>
    <Navbar />
    <main className="w-full md:w-[90%] 2xl:max-w-7xl mx-auto px-4 md:px-0 mt-[34px] mb-[30px] lg:mb-[121px] text-lg text-[#454745] flex md:flex-row flex-col gap-x-8 lg:gap-[51px] md:mt-16">
      {/* LHS */}
      <aside className="w-full md:w-[270px] lg:w-[458px]">
        <h1 className="text-3xl lg:text-5xl xl:text-[64px] xl:leading-[70px] text-[#0E0F0C] font-bold mb-6">
          Get in touch with us
        </h1>
        <p className="text-xl">
          We’re here to help! Whether you have a question about our services,
          need assistance with your account, or want to provide feedback, our
          tram is ready to assist you
        </p>
        <div className="mt-4 md:mt-8">
          <p className="text-xl">Email</p>
          <p className="text-2xl mt-2">support@cryptonow.dev</p>
        </div>

        <div className="mt-4 md:mt-8">
          <p className="text-xl">Phone</p>
          <p className="text-2xl mt-2">+234 801 000 222</p>
        </div>
      </aside>

      {/* RHS */}
      <aside className="flex-1 mt-12 md:mt-0">
        <form className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <label className="absolute -top-3 left-6 px-2 text-sm font-medium bg-white">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter your first name"
                className="w-full lg:text-lg rounded-full border border-[#ECECEC] bg-white p-4 outline-none focus:ring-2 focus:ring-[#03034D]/20 placeholder:text-[#9A9A9A]"
              />
            </div>
            <div className="relative">
              <label className="absolute -top-3 left-6 px-2 text-sm font-medium bg-white">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter your last name"
                className="w-full lg:text-lg rounded-full border border-[#ECECEC] bg-white p-4 outline-none focus:ring-2 focus:ring-[#03034D]/20 placeholder:text-[#9A9A9A]"
              />
            </div>
          </div>

          <div className="my-8 relative">
            <label className="absolute -top-3 left-6 px-2 text-sm font-medium bg-white">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter your email address"
              className="w-full lg:text-lg rounded-full border border-[#ECECEC] bg-white p-4 outline-none focus:ring-2 focus:ring-[#03034D]/20 placeholder:text-[#9A9A9A]"
            />
          </div>

          <div className="mt-4 relative">
            <label className="absolute -top-3 left-6 px-2 text-sm font-medium bg-white">
              How can we help you?
            </label>
            <textarea
              placeholder="Enter your message"
              className="w-full h-[206px] rounded-3xl border border-[#ECECEC] bg-white px-5 py-4 outline-none focus:ring-2 focus:ring-[#03034D]/20 placeholder:text-[#9CA3AF] resize-none"
            ></textarea>
          </div>

          <div className="mt-6 md:mt-12 flex justify-end">
            {/* <button
              type="submit"
              className="bg-[#03034D] lg:text-lg text-white px-8 md:px-5 py-4 cursor-pointer rounded-full font-semibold hover:bg-[#03034D]/90 transition-colors duration-300"
            >
              Send Message
            </button> */}

            <CustomButton onClick={() => {}} buttonText="Send Message" />
          </div>
        </form>
      </aside>
    </main>
    <Footer />
  </>
);

export default ContactPage;
