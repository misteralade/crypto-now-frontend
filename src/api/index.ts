/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosRequestHeaders } from "axios";
import {BASIC} from "../config/index.config.ts";
import {ROUTES} from "../util/constants.ts";
import type {BaseApiResponse} from "../types/response.api.types.ts";

export const userInstance = axios.create({
  baseURL: BASIC.API_BASE_URL,
  // timeout: 20000,
  // withCredentials: true,
});

userInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders;
  }
  return config;
});

userInstance.interceptors.response.use(
  (response) => {
    const accessToken = response.headers["x-api-key"];
    if (
      accessToken &&
      typeof accessToken === "string" &&
      accessToken.trim() !== ""
    ) {
      localStorage.setItem("accessToken", accessToken);
    }
    return response;
  },
  async (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message?.toLowerCase() === "jwt token error") {
        setTimeout(() => {
          window.location.href = ROUTES.LOGIN;
        }, 3000);
      }
    }
    return Promise.reject(error);
  }
);

export const axiosPostRequestHandler = async (
  url: string,
  data: any,
  config?: any
) => {
  try {
    const request = await userInstance.post(url, data, {
      ...config,
    });
    return request.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const axiosPutRequestHandler = async (url: string, data: any) => {
  try {
    const request = await userInstance.put(url, data);

    return request.data as BaseApiResponse<any>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const axiosDeleteRequestHandler = async (url: string) => {
  try {
    const request = await userInstance.delete(url);

    return request.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const axiosGetRequestHandler = async (url: string, params?: any) => {
  try {
    const request = await userInstance.get(url, {
      params,
    });

    return request.data as BaseApiResponse<any>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
