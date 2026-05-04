export interface AnswerDetail {
  questionId: number
  questionText: string
  answerText: string
  isLoe?: boolean
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
  submissionId: number
  missionId: number
  missionName: string
  roomId: number
  roomName: string
  submittedAt: string // ISO-8601
  answers: AnswerDetail[]
  loeQuestionId?: number
  loeAnswer?: string
}

export interface AnalyticsFeedbackDto {
  roomId: number
  missionName: string
  progress: number
  feedbackAt: string
  questions: QuestionFeedbackResultDto[]
}
