/**
 * Room of Science Battle API - Feature-specific API functions and types
 */

import type {
  ProceedDto,
  RoomResponseDto,
  ScienceBattleSubmissionDto,
  ScienceBattleSubmissionResponseDto,
  ResultDto,
} from '@/services/api'
import { proceedApi, roomOfScienceBattleApi } from '@/services/api'

export type {
  ScienceBattleSubmissionDto,
  ScienceBattleSubmissionResponseDto,
  ResultDto,
}

export const roomOfSciencebattleApi = {
  submit: (request: ScienceBattleSubmissionDto): Promise<ScienceBattleSubmissionResponseDto> => {
    return roomOfScienceBattleApi.submit(request)
  },
  getResults: (roomId: number, missionId: number): Promise<ResultDto> => {
    return roomOfScienceBattleApi.getResults(roomId, missionId)
  },
  proceed: (request: ProceedDto): Promise<RoomResponseDto> => {
    return proceedApi.toScienceBattleRoom(request)
  },
}
