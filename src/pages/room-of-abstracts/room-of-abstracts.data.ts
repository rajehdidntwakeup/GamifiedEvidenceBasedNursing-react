import type { Mission } from '@/shared/types/mission'

export interface RoomOfAbstractsProps {
  mission: Mission
  onBack: () => void
  onProceedToRoom3?: () => void
}

// answers from the backend
export interface TableQuestion {
  questionId: number
  question: string // e.g. "4_2_Study Design?"
  answers: { answerId: number; answer: string }[] // correct answer is always first (index 0)
}

export interface StoredRoomOfAbstractsData {
  roomId: number
  missionId: number
  mainQuestion: string
  docs: string[]
  questions: TableQuestion[]
}

// Selected answer per cell
export interface TableRow {
  titleAuthor: { answerId: number | null; questionId: number | null }
  pyramid: { answerId: number | null; questionId: number | null }
  ahcpr: { answerId: number | null; questionId: number | null }
  studyDesign: { answerId: number | null; questionId: number | null }
}

// Options for dropdown rendering per row
export interface CellOptions {
  titleAuthor: { answerId: number; answer: string }[]
  pyramid: { answerId: number; answer: string }[]
  ahcpr: { answerId: number; answer: string }[]
  studyDesign: { answerId: number; answer: string }[]
}

export const TOTAL_TIME = 15 * 60
