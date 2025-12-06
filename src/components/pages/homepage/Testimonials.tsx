import { usePublishedTestimonialsQuery } from "../../../queries/testimonial.query.ts";
import { TESTIMONIAL_CONTENT_TYPES } from "../../../util/constants.util.ts";
import type { TestimonialResponse } from "../../../types/response.payload.types.ts";
import { LoadingSpinner } from "../../global/LoadingSpinner.tsx";

const TestimonialCard = ({ testimonial }: { testimonial: TestimonialResponse }) => {
  const { contentType, contentLink, name, description } = testimonial;

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url.trim());
      
      // Handle youtube.com/watch?v=VIDEO_ID
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
        const videoId = urlObj.searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Handle youtu.be/VIDEO_ID
      if (urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Already an embed URL
      if (url.includes('/embed/')) {
        return url;
      }
      
      return url;
    } catch {
      return url;
    }
  };

  const renderContent = () => {
    switch (contentType) {
      case TESTIMONIAL_CONTENT_TYPES.VIDEO:
        return (
          <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
            <iframe
              src={getYouTubeEmbedUrl(contentLink)}
              title={name}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        );
      case TESTIMONIAL_CONTENT_TYPES.IMAGE:
        return (
          <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
            <img
              src={contentLink}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        );
      case TESTIMONIAL_CONTENT_TYPES.TEXT:
        return (
          <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-700 italic">"{description}"</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F5F5FF] rounded-lg p-5 flex flex-col h-full">
      {renderContent()}
      <div className="mt-auto">
        <h3 className="text-lg font-semibold text-[#0E0F0C] mb-2 line-clamp-2">
          {name}
        </h3>
        {contentType !== TESTIMONIAL_CONTENT_TYPES.TEXT && (
          <p className="text-sm text-[#454745] line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

const Testimonials = () => {
  const { testimonials, isLoading } = usePublishedTestimonialsQuery(1, 100);

  return (
    <section className="mt-20 max-md:px-4">
      <div className="max-w-6xl mx-auto md:px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal text-[#0E0F0C] mb-2">
            Testimonials
          </h2>
          <p className="text-[#454745] font-normal text-base sm:text-lg">
            What our customers are saying about our service
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#454745] text-lg">No testimonials available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;
