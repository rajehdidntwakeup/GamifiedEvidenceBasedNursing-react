/**
 * Room of Abstracts API - Feature-specific API functions and types
 * Note: This uses a custom endpoint not defined in openapi.yaml
 */

import type { MissionApi, RoomOfAbstractsArticleDto } from "@/services/api";
import { fetchApi } from "@/services/api/client";

export interface RoomOfAbstractsApiRequest {
  gameId: number;
  teamId: number;
  roomId: number;
  mission: MissionApi;
}

export interface RoomOfAbstractsApi {
  getArticles: (request: RoomOfAbstractsApiRequest) => Promise<RoomOfAbstractsArticleDto[]>;
}

export const roomOfAbstractsApi: RoomOfAbstractsApi = {
  getArticles: ({ gameId, teamId, roomId, mission }: RoomOfAbstractsApiRequest) => {
    // Custom endpoint for Room of Abstracts articles
    // This endpoint is not defined in the openapi.yaml
    const query = new URLSearchParams({
      gameId: String(gameId),
      teamId: String(teamId),
      roomId: String(roomId),
      mission,
    }).toString();
    return fetchApi<RoomOfAbstractsArticleDto[]>(`/rooms/room-of-abstracts?${query}`);
  },
};
