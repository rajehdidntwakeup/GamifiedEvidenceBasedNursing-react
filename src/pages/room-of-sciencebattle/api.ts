/**
 * Room of Sciencebattle API - Feature-specific API functions and types
 */

import type { MissionApi } from "@/services/api";
import { fetchApi } from "@/services/api/client";

export interface RoomOfSciencebattleApiRequest {
  gameId: number;
  mission: MissionApi;
  password?: string;
}

export interface RoomOfSciencebattleApi {
  getPairs: (request: RoomOfSciencebattleApiRequest) => Promise<unknown[]>;
}

export const roomOfSciencebattleApi: RoomOfSciencebattleApi = {
  getPairs: ({ gameId, mission, password }: RoomOfSciencebattleApiRequest) => {
    const query = new URLSearchParams({
      gameId: String(gameId),
      mission,
      ...(password ? { password } : {}),
    }).toString();
    return fetchApi<unknown[]>(`/rooms/room-of-sciencebattle?${query}`);
  },
};
