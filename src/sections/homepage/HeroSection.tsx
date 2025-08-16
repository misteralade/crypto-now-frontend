import CustomButton from "../../components/global/Button";
import UserIllustration from "../../assets/illustrations/image-container.png";
import Arrow from "../../assets/icons/banner-arrow.svg";

export default function HeroSection() {
  return (
    <section className="bg-white relative overflow-hidden max-md:px-4">
      <div className="max-w-6xl mx-auto text-center mt-16">
        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold text-[#0E0F0C] md:tracking-[4px]">
          Buy and Sell Crypto
        </h1>

        {/* Subheading with decorative underline */}
        <div className="relative">
          <div className="max-lg:flex max-lg:justify-center text-4xl sm:text-5xl md:text-8xl font-semibold text-[#BDBDBD] mb-8 leading-tight">
            <span className="block sm:inline">Fast • </span>
            <span className="relative inline-block">
              Simple
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-0 top-full w-full h-auto max-w-none"
                viewBox="0 0 310 10"
                fill="none"
                style={{
                  width: "100%",
                  height: "auto",
                  transform: "translateY(-20%)",
                }}
              >
                <path
                  d="M287.111 5.98228C276.139 5.98228 265.168 6.05097 254.197 5.96355C245.399 5.89486 236.601 5.52645 227.791 5.48274C220.176 5.44527 212.51 5.45775 204.947 5.8449C189.063 6.65043 173.255 7.8431 157.357 8.59867C149.704 8.96085 142.218 8.35514 134.758 6.91894C122.591 4.5773 109.973 5.70752 97.5866 6.93142C90.3581 7.64328 83.1938 8.49876 75.9653 9.16691C69.5471 9.76013 63.8362 9.20438 58.627 6.96265C53.3793 4.70219 46.6138 5.26417 40.5428 5.9573C31.7194 6.9564 23.0889 8.36138 14.4069 9.64772C8.96618 10.4532 4.05282 9.92248 0.734374 7.58709C-0.358912 6.81903 -0.0888015 5.32037 0.618619 4.34001C0.914449 3.92788 4.43866 3.57194 5.69916 3.9029C9.72502 4.95819 13.2493 4.24011 16.9922 3.70309C28.0022 2.12327 39.038 0.431041 50.704 0.911857C54.4855 1.06797 58.7814 1.49259 61.714 2.5354C67.6692 4.65848 73.7916 4.25883 80.1584 3.72805C91.1298 2.81013 102.05 1.72987 113.06 0.955572C121.253 0.38109 129.305 0.874389 137.176 2.3543C147.042 4.20264 157.396 3.72807 167.57 3.15983C184.574 2.21069 201.487 0.755743 218.53 0.087596C227.945 -0.280822 237.54 0.624604 247.071 0.743247C259.805 0.899356 272.551 0.811935 285.297 0.899356C291.87 0.943067 298.481 1.01176 305.002 1.37393C306.829 1.47384 309.491 2.53539 309.877 3.36589C310.662 5.03938 307.536 5.15803 304.938 5.22672C299.008 5.39532 293.079 5.57639 287.15 5.75747C287.15 5.83241 287.137 5.90734 287.124 5.97603L287.111 5.98228Z"
                  fill="#948EEE"
                />
              </svg>
            </span>{" "}
            <span className="block sm:inline">• Secure</span>
          </div>

          {/* Arrow image  */}
          <img
            className="absolute right-[5%] top-[30%] max-md:hidden"
            src={Arrow}
            alt=""
          />
        </div>

        {/* Description text */}
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          With CryptoNow, trading Bitcoin and USDT is as easy as sending a text.
          No complex charts. No hidden fees. Just safe, straightforward
          transactions.
        </p>

        {/* CTA Button */}
        <CustomButton buttonText="Buy & sell crypto now" />

        <div className="mt-12 flex items-center justify-center">
          <img
            className="w-[900px] h-[420px] max-md:w-full max-md:h-full object-center object-contain"
            src={UserIllustration}
            alt=""
          />
        </div>
      </div>

      {/* <!-- GRADIENT  --> */}
      <div
        style={{ background: "rgba(148, 142, 238, 0.50)" }}
        className="right-0 max-md:hidden blur-[200px] top-[23%] z-[2] h-[450px] absolute w-[300px]"
      ></div>
    </section>
  );
}
