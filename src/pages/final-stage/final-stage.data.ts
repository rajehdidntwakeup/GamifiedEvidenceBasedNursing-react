import type { Mission } from '@/shared/types/mission'

export interface FinalStageProps {
  mission: Mission
  onBack: () => void
}

export const ANSWER = 'FLORENCE'

export const COLLECTED_LETTERS = [
  { letter: 'E', room: 1, roomName: 'Room of Knowledge' },
  { letter: 'C', room: 1, roomName: 'Room of Knowledge' },
  { letter: 'F', room: 2, roomName: 'Room of Abstracts' },
  { letter: 'O', room: 2, roomName: 'Room of Abstracts' },
  { letter: 'L', room: 3, roomName: 'Room of Analytics' },
  { letter: 'R', room: 3, roomName: 'Room of Analytics' },
  { letter: 'N', room: 4, roomName: 'Room of Sciencebattle' },
  { letter: 'E', room: 4, roomName: 'Room of Sciencebattle' },
]

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Format today's date nicely
export function formatDate(): string {
  const d = new Date()
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
