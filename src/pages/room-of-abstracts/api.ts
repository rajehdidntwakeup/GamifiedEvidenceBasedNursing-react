/**
 * Room of Abstracts API - Feature-specific API functions and types
 */

import { fetchApi } from "@/shared/api/base-client";

export interface VerifyAnswer {
  questionId: number;
  answerId: number;
}

export interface RoomOfAbstractsApi {
  verifyAnswers: (request: {
    roomId: number;
    missionId: number;
    answers: VerifyAnswer[];
  }) => Promise<{ progress: number; key: string | null }>;
  retryRoom: (roomId: number) => Promise<number>;
}

export const roomOfAbstractsApi: RoomOfAbstractsApi = {
  verifyAnswers: (request) =>
    fetchApi<{ progress: number; key: string | null }>(
      "/api/rooms/roomofabstracts/verify",
      {
        method: "POST",
        body: JSON.stringify(request),
      },
    ),
  retryRoom: (roomId: number) => {
    return fetchApi<number>(`/api/rooms/retry/abstracts?roomId=${roomId}`, {
      method: 'PUT',
    });
  },
};
