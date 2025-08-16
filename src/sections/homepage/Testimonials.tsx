export default function Testimonials() {
  return (
    <section className="mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-normal text-[#0E0F0C] mb-2">
            Testimonials
          </h2>
          <p className="text-[#454745] font-normal text-lg">
            What our customers are saying about our service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-w-6xl mx-auto">
          {/* Left column - 2 boxes stacked */}
          <div className="bg-[#F5F5FF] rounded-lg aspect-[4/3] w-full"></div>

          {/* Middle column - single box spanning 2 rows */}
          <div className="bg-[#F5F5FF] rounded-lg row-span-2 w-full"></div>

          {/* Right column - 2 boxes stacked */}
          <div className="bg-[#F5F5FF] rounded-lg aspect-[4/3] w-full"></div>

          {/* Second row - left and right only */}
          <div className="bg-[#F5F5FF] rounded-lg aspect-[4/3] w-full"></div>
          <div className="bg-[#F5F5FF] rounded-lg aspect-[4/3] w-full"></div>
        </div>
      </div>
    </section>
  );
}
