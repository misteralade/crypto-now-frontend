import {
  axiosGetRequestHandler,
  axiosPatchRequestHandler,
} from "./index.ts";
import type {
  BaseApiResponse,
  HasNewNotificationsResponse,
  UserNotificationsHistoryResponse,
} from "../types/response.payload.types.ts";

class NotificationServiceApi {
  private static instance: NotificationServiceApi;

  private constructor() {}

  public static getInstance(): NotificationServiceApi {
    if (!NotificationServiceApi.instance) {
      NotificationServiceApi.instance = new NotificationServiceApi();
    }

    return NotificationServiceApi.instance;
  }

  async hasNewNotifications() {
    const { data, message, success }: { data: HasNewNotificationsResponse, message: string, success: boolean } = await axiosGetRequestHandler("/notification/user/has-new");

    return { data, message, success };
  }

  async getUserNotifications(page = 1, limit = 20) {
    const { data, message, success }: { data: UserNotificationsHistoryResponse, message: string, success: boolean } = await axiosGetRequestHandler(`/notification/user?page=${page}&limit=${limit}`);

    return { data, message, success };
  }

  async markAllNotificationsRead() {
    return await axiosPatchRequestHandler("/notification/user/mark-all-read", {}) as BaseApiResponse<null>;
  }
}

export const notificationServiceApi = NotificationServiceApi.getInstance();
