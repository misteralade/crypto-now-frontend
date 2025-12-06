import {axiosGetRequestHandler} from "./index.ts";
import type {GetTestimonialsAPIResponse} from "../types/response.payload.types.ts";

export const testimonialServiceApi = {
  getPublishedTestimonials: async (page: number = 1, limit: number = 100) => {
    return await axiosGetRequestHandler('/testimonial/published', {
      page,
      limit,
    }) as GetTestimonialsAPIResponse;
  },
};

