import {useQuery} from "@tanstack/react-query";
import {QUERY_KEYS} from "./query.keys.ts";
import {testimonialServiceApi} from "../api/testimonial.api.ts";

export const usePublishedTestimonialsQuery = (page: number = 1, limit: number = 100) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.TESTIMONIAL.GET_PUBLISHED_TESTIMONIALS, page, limit],
    queryFn: async () => {
      const response = await testimonialServiceApi.getPublishedTestimonials(page, limit);
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    testimonials: data?.data?.testimonials || [],
    pagination: data?.data?.pagination,
    isLoading,
    error,
    refetch,
  };
};

