export interface AnswerDetail {
  questionId: number
  questionText: string
  answerText: string
}

export interface QuestionFeedback {
  questionId: number
  answer: string
  approved: boolean
}

export interface QuestionFeedbackResultDto {
  questionId: number
  approved: boolean
  answerText?: string | null
}

export interface AdminNotification {
  missionId: number
  missionName: string
  roomId: number
  roomName: string
  submittedAt: string // ISO-8601
  answers: AnswerDetail[]
}

export interface AnalyticsFeedbackDto {
  roomId: number
  missionName: string
  progress: number
  feedbackAt: string
  questions: QuestionFeedbackResultDto[]
}

export function getNotificationId(n: AdminNotification): string {
  return `${n.missionId}-${n.roomId}-${n.submittedAt}`
}
