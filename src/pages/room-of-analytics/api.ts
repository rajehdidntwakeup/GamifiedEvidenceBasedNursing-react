/**
 * Room of Analytics API - Feature-specific API functions and types
 */

import type { MissionApi } from "@/services/api";
import { fetchApi } from "@/shared/api/base-client";

export interface RoomOfAnalyticsApiRequest {
  gameId: number;
  mission: MissionApi;
  password?: string;
}

export interface RoomOfAnalyticsApi {
  getStudies: (request: RoomOfAnalyticsApiRequest) => Promise<unknown[]>;
}

export const roomOfAnalyticsApi: RoomOfAnalyticsApi = {
  getStudies: ({ gameId, mission, password }: RoomOfAnalyticsApiRequest) => {
    const query = new URLSearchParams({
      gameId: String(gameId),
      mission,
      ...(password ? { password } : {}),
    }).toString();
    return fetchApi<unknown[]>(`/rooms/room-of-analytics?${query}`);
  },
};
