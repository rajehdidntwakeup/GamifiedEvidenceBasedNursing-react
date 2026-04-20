import type { RoomOfKnowledgeQuestionDto } from '@/services/api'
import type { Mission } from '@/shared/types/mission'

export interface RoomOfKnowledgeProps {
  mission: Mission
  onBack: () => void
  onProceedToRoom2?: () => void
}

export interface RoomQuestion {
  id: number
  question: string
  options: string[]
  answerIds: number[] // Store answerIds for API verification
  correctIndex: number
  explanation?: string
}

export interface QuestionResult {
  question: string
  isCorrect: boolean
}

export const TOTAL_TIME = 10 * 60

function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function mapApiQuestionsToRoomQuestions(
  apiQuestions: RoomOfKnowledgeQuestionDto[],
): RoomQuestion[] {
  return apiQuestions
    .map((apiQuestion) => {
      const shuffledAnswers = shuffleArray(apiQuestion.answers)
      const options = shuffledAnswers.map((answer) => answer.answer)
      const answerIds = shuffledAnswers.map((answer) => answer.answerId)

      // Find the index of the correct answer in the shuffled array
      const correctIndex = shuffledAnswers.findIndex((a) => a.isCorrect || a.correct)

      return {
        id: apiQuestion.questionId,
        question: apiQuestion.question,
        options,
        answerIds,
        correctIndex,
      }
    })
    .filter((question): question is RoomQuestion => question !== null)
}

export interface RoomOfKnowledgeData {
  questions: RoomQuestion[]
  timer: number
}

export async function loadRoomOfKnowledgeQuestions(): Promise<RoomOfKnowledgeData> {
  // Get questions and timer from sessionStorage where they were stored after /api/game/mission/enter
  const storedQuestions = sessionStorage.getItem('missionQuestions')
  const storedTimer = sessionStorage.getItem('missionTimer')

  if (!storedQuestions) {
    throw new Error('No questions found. Please select a mission first.')
  }

  try {
    const apiQuestions: RoomOfKnowledgeQuestionDto[] = JSON.parse(storedQuestions)
    const mappedQuestions = mapApiQuestionsToRoomQuestions(apiQuestions)
    const timer = storedTimer ? Number(storedTimer) : TOTAL_TIME

    if (mappedQuestions.length === 0) {
      throw new Error('No questions were returned for this mission.')
    }

    return {
      questions: mappedQuestions,
      timer,
    }
  } catch {
    throw new Error('Failed to load questions from server.')
  }
}
