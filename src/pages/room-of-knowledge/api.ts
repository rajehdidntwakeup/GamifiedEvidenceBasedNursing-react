/**
 * Room of Knowledge API - Feature-specific API functions and types
 */

import type {
  MissionApi,
  RoomOfKnowledgeQuestionDto,
  ProceedDto,
  RoomOfAbstractsResponseDto,
} from '@/services/api'
import { proceedApi } from '@/services/api'
import { fetchApi } from '@/shared/api/base-client'

export interface RoomOfKnowledgeApiRequest {
  gameId: number
  teamId: number
  roomId: number
  mission: MissionApi
}

export interface RoomOfKnowledgeApi {
  getQuestions: (request: RoomOfKnowledgeApiRequest) => Promise<RoomOfKnowledgeQuestionDto[]>
  verifyAnswer: (roomId: number, questionId: number, answerId: number) => Promise<boolean>
  getResult: (roomId: number) => Promise<{ progress: number; key: string | null }>
  proceed: (request: ProceedDto) => Promise<RoomOfAbstractsResponseDto>
  retryRoom: (roomId: number) => Promise<number>
}

export const roomOfKnowledgeApi: RoomOfKnowledgeApi = {
  getQuestions: ({ gameId, teamId, roomId }: RoomOfKnowledgeApiRequest) => {
    return fetchApi<RoomOfKnowledgeQuestionDto[]>(
      `/api/games/${gameId}/teams/${teamId}/rooms/${roomId}/questions`,
    )
  },
  verifyAnswer: (roomId: number, questionId: number, answerId: number) => {
    return fetchApi<boolean>(
      `/api/rooms/roomofknowledge/${roomId}/question/${questionId}/answer/${answerId}`,
    )
  },
  getResult: (roomId: number) => {
    return fetchApi<{ progress: number; key: string | null }>(
      `/api/rooms/roomofknowledge/getResult?roomId=${roomId}`,
    )
  },
  proceed: (request: ProceedDto) => {
    return proceedApi.toNextRoom(request)
  },
  retryRoom: (roomId: number) => {
    return fetchApi<number>(`/api/rooms/retry/knowledge?roomId=${roomId}`, {
      method: 'PUT',
    })
  },
}
