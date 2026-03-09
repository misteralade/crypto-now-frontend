import AppSimCard from "./AppSimCard.tsx";

const HeroSectionNew = () => {
  return (
    <section
      className="relative min-h-[calc(100vh-72px)] flex flex-col overflow-hidden"
      style={{ background: "#f5f0e8" }}
    >
      {/* Noise grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.5,
        }}
      />

      {/* Purple glow — left */}
      <div
        className="pointer-events-none absolute -left-40 top-1/4 w-[560px] h-[560px] rounded-full z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(148,142,238,0.38) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      {/* Gold glow — right */}
      <div
        className="pointer-events-none absolute -right-40 top-1/4 w-[560px] h-[560px] rounded-full z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(247,166,0,0.30) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 pt-10 pb-16 gap-8">
        {/* Headline */}
        <div className="text-center">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-tight tracking-tight"
            style={{ fontFamily: "'Zen Dots', cursive", color: "#0E0F0C" }}
          >
            BUY{" "}
            <span
              style={{
                fontFamily: "'Delius', cursive",
                fontSize: "0.65em",
                color: "#948EEE",
                verticalAlign: "middle",
              }}
            >
              and
            </span>{" "}
            SELL
          </h1>
          <p
            className="mt-3 text-lg sm:text-xl text-gray-500"
            style={{ fontFamily: "'Delius', cursive" }}
          >
            Fast &bull; Simple &bull; Secure
          </p>
        </div>

        {/* Coins + Card row — coins overlap/hug card */}
        <div className="flex items-center justify-center w-full max-w-5xl">
          {/* BTC coin — large, negative margin so it hugs the card */}
          <div
            className="hidden sm:block flex-shrink-0 animate-[float_4s_ease-in-out_infinite] relative z-10"
            style={{ marginRight: "-28px" }}
          >
            <img
              src="/decorations/btc-coin.png"
              alt="Bitcoin"
              className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full object-cover"
              style={{
                boxShadow: "0 8px 40px rgba(247,166,0,0.30)",
                filter: "drop-shadow(0 4px 16px rgba(247,166,0,0.20))",
              }}
            />
          </div>

          {/* Arrow BTC → card */}
          <div className="hidden lg:block flex-shrink-0 relative z-20 mx-1">
            <img
              src="/decorations/arrow.png"
              alt=""
              className="w-12 h-auto opacity-60"
            />
          </div>

          {/* App Sim Card */}
          <div className="flex-shrink-0 relative z-30">
            <AppSimCard />
          </div>

          {/* Arrow card → Naira */}
          <div className="hidden lg:block flex-shrink-0 relative z-20 mx-1">
            <img
              src="/decorations/arrow.png"
              alt=""
              className="w-12 h-auto opacity-60"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>

          {/* Naira coin — large, negative margin so it hugs the card */}
          <div
            className="hidden sm:block flex-shrink-0 animate-[float_4s_ease-in-out_0.9s_infinite] relative z-10"
            style={{ marginLeft: "-28px" }}
          >
            <img
              src="/decorations/naira-coin.png"
              alt="Naira"
              className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full object-cover"
              style={{
                boxShadow: "0 8px 40px rgba(148,142,238,0.30)",
                filter: "drop-shadow(0 4px 16px rgba(148,142,238,0.20))",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </section>
  );
};

export default HeroSectionNew;
