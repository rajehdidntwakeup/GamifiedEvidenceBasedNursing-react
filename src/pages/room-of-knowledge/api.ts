/**
 * Room of Knowledge API - Feature-specific API functions and types
 */

import type { MissionApi, RoomOfKnowledgeQuestionDto, ProceedDto, RoomOfAbstractsResponseDto } from "@/services/api";
import { fetchApi } from "@/services/api/client";
import { proceedApi } from "@/services/api";

export interface RoomOfKnowledgeApiRequest {
  gameId: number;
  teamId: number;
  roomId: number;
  mission: MissionApi;
}

export interface RoomOfKnowledgeApi {
  getQuestions: (request: RoomOfKnowledgeApiRequest) => Promise<RoomOfKnowledgeQuestionDto[]>;
  verifyAnswer: (questionId: number, answerId: number) => Promise<boolean>;
  proceed: (request: ProceedDto) => Promise<RoomOfAbstractsResponseDto>;
}

export const roomOfKnowledgeApi: RoomOfKnowledgeApi = {
  getQuestions: ({ gameId, teamId, roomId }: RoomOfKnowledgeApiRequest) => {
    return fetchApi<RoomOfKnowledgeQuestionDto[]>(`/api/games/${gameId}/teams/${teamId}/rooms/${roomId}/questions`);
  },
  verifyAnswer: (questionId: number, answerId: number) => {
    return fetchApi<boolean>(`/api/rooms/roomofknowledge/question/${questionId}/answer/${answerId}`);
  },
  proceed: (request: ProceedDto) => {
    return proceedApi.toNextRoom(request);
  },
};
