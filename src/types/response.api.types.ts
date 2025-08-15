export type BaseApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};