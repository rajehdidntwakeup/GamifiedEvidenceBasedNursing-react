/**
 * API exports - Main entry point for API functionality
 * This file re-exports from feature-specific API modules
 */

import type { AuthResponse } from '@/entities/session'
import { fetchApi } from '@/shared/api/base-client'

// ============== ADMIN API ==============

export interface QuestionFeedbackDto {
  questionId: number
  answer: string
  approved: boolean
}

export interface SubmissionFeedbackDto {
  roomId: number
  questions: QuestionFeedbackDto[]
}

export type AnalyticsSubmissionFeedbackDto = SubmissionFeedbackDto

export interface MissionPasswordDto {
  missionName: string
  password: string
}

export interface SessionPasswordsDto {
  gameId: number
  missionPasswords: MissionPasswordDto[]
}

export const adminApi = {
  /**
   * Check if any administrator exists
   * Path: /api/admin/isThereAdmin
   */
  isThereAdmin: () => fetchApi<boolean>('/api/admin/isThereAdmin'),

  /**
   * Get passwords for all missions in the current session
   * Path: /api/admin/dashboard/missions-passwords
   */
  getMissionsPasswords: () => fetchApi<SessionPasswordsDto>('/api/admin/dashboard/missions-passwords'),

  /**
   * Submit feedback for an analytics submission
   * Path: /api/admin/submission/analytics
   */
  submitFeedback: (request: SubmissionFeedbackDto) =>
    fetchApi<string>('/api/admin/submission/analytics', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  /**
   * Submit feedback for a science battle submission
   * Path: /api/admin/submission/sciencebattle
   */
  submitScienceBattleFeedback: (request: SubmissionFeedbackDto) =>
    fetchApi<string>('/api/admin/submission/sciencebattle', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  /**
   * Close the current game session
   * Path: /api/admin/dashboard/close-game-session
   */
  closeGameSession: () =>
    fetchApi<void>('/api/admin/dashboard/close-game-session', {
      method: 'POST',
    }),
}

// ============== GAME API ==============

export const gameApi = {
  /**
   * Create a new game session
   * Path: /api/game/create
   */
  create: () =>
    fetchApi<GameResponseDto>('/api/game/create', {
      method: 'POST',
    }),

  /**
   * Check if a game is currently running
   * Path: /api/game/landing
   */
  landing: () => fetchApi<boolean>('/api/game/landing'),

  /**
   * Get available missions for landing page
   * Path: /api/game/landing/missions
   */
  getLandingMissions: () => fetchApi<LandingPageResponse>('/api/game/landing/missions'),

  /**
   * Get the current active game session ID
   * Path: /api/game/landing/session-id
   */
  getGameSessionId: () => fetchApi<number>('/api/game/landing/session-id'),
}

// ============== ENTERING MISSION API ==============

export const enteringMissionApi = {
  /**
   * Enter the game with a mission
   * Path: /api/game/mission/enter
   */
  enter: (request: { password: string; gameId: number; missionId: number }) =>
    fetchApi<EnteringGameResponse>('/api/game/mission/enter', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
}

// ============== ROOM OF KNOWLEDGE API ==============

export interface VerifyAnswerDto {
  questionId: number
  answerId: number
  roomId: number
}

export interface ResultDto {
  progress: number
  key: string | null
}

export const roomOfKnowledgeApi = {
  /**
   * Verify if an answer is correct using path-based endpoint
   * Path: /api/rooms/roomofknowledge/{roomId}/question/{questionId}/answer/{answerId}
   */
  verifyAnswer: (roomId: number, questionId: number, answerId: number) =>
    fetchApi<boolean>(`/api/rooms/roomofknowledge/${roomId}/question/${questionId}/answer/${answerId}`),

  /**
   * Get result for Room of Knowledge
   * Path: /api/rooms/roomofknowledge/getResult
   */
  getResult: (roomId: number) => {
    const query = new URLSearchParams({ roomId: String(roomId) }).toString()
    return fetchApi<ResultDto>(`/api/rooms/roomofknowledge/getResult?${query}`)
  },
}

// ============== ROOM OF ABSTRACTS API ==============

export interface VerifyRoomOfAbstractsAnswersDto {
  roomId: number
  missionId: number
  answers: QuestionAnswerDto[]
}

export const roomOfAbstractsApi = {
  /**
   * Verify answers for Room of Abstracts
   * Path: /api/rooms/roomofabstracts/verify
   */
  verifyAnswers: (request: VerifyRoomOfAbstractsAnswersDto) =>
    fetchApi<ResultDto>('/api/rooms/roomofabstracts/verify', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
}

// ============== ROOM OF ANALYTICS API ==============

export interface OpenQuestionSubmissionDto {
  questionId: number
  answer: string
}

export interface AnalyticsSubmissionDto {
  roomId: number
  levelofEvidenceQuestionId?: number
  levelofEvidenceAnswer?: string
  openQuestions: OpenQuestionSubmissionDto[]
}

export type SubmissionDto = AnalyticsSubmissionDto

export interface AnalyticsSubmissionResponseDto {
  progress: number
  levelOfEvidenceApproved: boolean
}

export type SubmissionResponseDto = AnalyticsSubmissionResponseDto

export const roomOfAnalyticsApi = {
  /**
   * Submit answers for Room of Analytics
   * Path: /api/rooms/roomofanalytics/submit
   */
  submit: (request: AnalyticsSubmissionDto) =>
    fetchApi<AnalyticsSubmissionResponseDto>('/api/rooms/roomofanalytics/submit', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  /**
   * Get results for Room of Analytics
   * Path: /api/rooms/roomofanalytics/results
   */
  getResults: (roomId: number, missionId: number) => {
    const query = new URLSearchParams({
      roomId: String(roomId),
      missionId: String(missionId),
    }).toString()
    return fetchApi<ResultDto>(`/api/rooms/roomofanalytics/results?${query}`)
  },
}

// ============== ROOM OF SCIENCE BATTLE API ==============

export interface ScienceBattleSubmissionDto {
  roomId: number
  levelofEvidenceQuestionId?: number
  levelofEvidenceAnswer?: string
  openQuestions: OpenQuestionSubmissionDto[]
}

export interface ScienceBattleSubmissionResponseDto {
  progress: number
  levelOfEvidenceApproved: boolean
}

export const roomOfScienceBattleApi = {
  /**
   * Submit answers for Room of Science Battle
   * Path: /api/rooms/roomofsciencebattle/submit
   */
  submit: (request: ScienceBattleSubmissionDto) =>
    fetchApi<ScienceBattleSubmissionResponseDto>('/api/rooms/roomofsciencebattle/submit', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  /**
   * Get results for Room of Science Battle
   * Path: /api/rooms/roomofsciencebattle/results
   */
  getResults: (roomId: number, missionId: number) => {
    const query = new URLSearchParams({
      roomId: String(roomId),
      missionId: String(missionId),
    }).toString()
    return fetchApi<ResultDto>(`/api/rooms/roomofsciencebattle/results?${query}`)
  },
}

// ============== PROCEED TO NEXT ROOM API ==============

export interface ProceedDto {
  roomId: number
}

export interface RoomOfAbstractsResponseDto {
  roomId: number
  missionId: number
  mainQuestion: string
  docs: string[]
  questions: TableQuestionDto[]
}

export interface TableQuestionDto {
  questionId: number
  question: string
  answers: AnswerDto[]
}

export interface RoomResponseDto {
  roomId: number
  missionId: number
  mainQuestion: string
  docs: string[]
  questions: QuestionDto[]
}

export interface QuestionDto {
  questionId: number
  question: string
  answers: AnswerDto[]
}

export const proceedApi = {
  /**
   * Proceed to the next room (Room of Abstracts)
   * Path: /api/game/proceed/abstracts
   */
  toNextRoom: (request: ProceedDto) =>
    fetchApi<RoomOfAbstractsResponseDto>('/api/game/proceed/abstracts', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  /**
   * Proceed to the Room of Analytics
   * Path: /api/game/proceed/analytics
   */
  toAnalyticsRoom: (request: ProceedDto) =>
    fetchApi<RoomResponseDto>('/api/game/proceed/analytics', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  /**
   * Proceed to the Room of Science Battle
   * Path: /api/game/proceed/sciencebattle
   */
  toScienceBattleRoom: (request: ProceedDto) =>
    fetchApi<RoomResponseDto>('/api/game/proceed/sciencebattle', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
}

// ============== ROOM TIME API ==============

export interface RoomTimeResponse {
  minutes: number
  seconds: number
}

export const roomTimeApi = {
  /**
   * Get how much time is left for a room
   * Path: /api/rooms/howmuchtimedowehave
   */
  getHowMuchTimeDoWeHave: (roomId: number) => {
    const query = new URLSearchParams({ roomId: String(roomId) }).toString()
    return fetchApi<RoomTimeResponse>(`/api/rooms/howmuchtimedowehave?${query}`)
  },
}

// ============== TYPES ==============

export type { AuthResponse }

export interface GameResponseDto {
  gameId: number
  teamPasswords: TeamPasswordDto[]
}

export interface TeamPasswordDto {
  teamId: number
  mission: string
  password: string
}

export interface LandingPageResponse {
  gameId: number
  missions: MissionDto[]
}

export interface MissionDto {
  missionId: number
  missionName: string
}

export interface EnteringGameResponse {
  missionId: number
  roomId: number
  timer: number
  questions: RoomOfKnowledgeQuestionDto[]
}

export interface RoomOfKnowledgeQuestionDto {
  questionId: number
  question: string
  answers: AnswerDto[]
}

export interface AnswerDto {
  answerId: number
  answer: string
  isCorrect?: boolean
  correct?: boolean
}

export interface QuestionAnswerDto {
  questionId: number
  answerId: number
}

// ============== MISSION API TYPE ==============

export type MissionApi =
  | 'WOUND_CARE_FOR_PRESSURE_ULCERS'
  | 'FALL_PREVENTION_IN_GERIATRICS'
  | 'PAIN_MANAGEMENT_IN_POSTOPERATIVE_CARE'
  | 'NUTRITIONAL_INTERVENTIONS_FOR_MALNUTRITION'
  | 'PREVENTION_OF_CATHETER_ASSOCIATED_URINARY_TRACT_INFECTIONS'

// ============== ROOM OF ABSTRACTS TYPES ==============

export interface RoomOfAbstractsArticleDto {
  id: number
  title: string
  authors: string
  journal: string
  year: number
  abstract: string
  correctAnswers: RoomOfAbstractsCorrectAnswersDto
}

export interface RoomOfAbstractsCorrectAnswersDto {
  titleAuthor: string
  pyramid: string
  ahcpr: string
  studyDesign: string
}
