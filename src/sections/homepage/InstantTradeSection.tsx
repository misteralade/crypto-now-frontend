import CustomButton from "../../components/global/Button";

export default function InstantTradeSection() {
  return (
    <section className="max-md:px-4">
      <div className="max-w-6xl mx-auto mt-24">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal md:tracking-[1px] text-[#0E0F0C] mb-3">
            Instant trade as a Guest
          </h2>
          <p className="text-gray-600 text-xl max-w-xl mx-auto leading-relaxed">
            You can also buy and sell your crypto coins without having to sign
            up. It's fast, easy, and reliable.
          </p>
        </div>

        {/* Trading Form */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-5xl mx-auto">
          {/* I want to text */}
          <span className="text-black font-normal text-base">I want to</span>

          {/* First bordered container: Buy + Bitcoin */}
          <div className="flex items-center max-md:w-full bg-white rounded-[100px] border border-[#ECECEC] p-2">
            {/* Buy dropdown */}
            <div className="flex items-center gap-3 px-4 py-2">
              <select className="bg-transparent border-none outline-none font-medium text-gray-900 cursor-pointer">
                <option>Buy</option>
                <option>Sell</option>
              </select>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300"></div>

            {/* Bitcoin dropdown */}
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">₿</span>
              </div>
              <select className="bg-transparent border-none outline-none font-medium text-gray-900 cursor-pointer">
                <option>Bitcoin</option>
              </select>
            </div>
          </div>

          {/* For text */}
          <span className="text-black font-normal text-base">for</span>

          {/* Second bordered container: Amount + Naira */}
          <div className="flex items-center bg-white rounded-[100px] border border-[#ECECEC] p-2">
            {/* Amount input */}
            <div className="px-4 py-2">
              <input
                type="text"
                placeholder="Amount"
                className="bg-transparent border-none outline-none font-medium text-gray-900 placeholder-gray-500 w-[200px]"
              />
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300"></div>

            {/* Naira dropdown */}
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-6 h-4 rounded-sm overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-green-600 via-white to-green-600"></div>
              </div>
              <select className="bg-transparent border-none outline-none font-medium text-gray-900 cursor-pointer">
                <option>Naira</option>
              </select>
            </div>
          </div>

          {/* Buy Button */}
          <CustomButton buttonText="Buy crypto now" />
        </div>
      </div>
    </section>
  );
}
