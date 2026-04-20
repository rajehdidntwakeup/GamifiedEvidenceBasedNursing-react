// Room definitions
export const ROOMS = [
  {
    id: 0,
    name: 'Lobby',
    short: 'Lobby',
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    dot: 'bg-gray-400',
  },
  {
    id: 1,
    name: 'Room of Knowledge',
    short: 'Knowledge',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/30',
    dot: 'bg-teal-400',
  },
  {
    id: 2,
    name: 'Room of Abstracts',
    short: 'Abstracts',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
  },
  {
    id: 3,
    name: 'Room of Analytics',
    short: 'Analytics',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400',
  },
  {
    id: 4,
    name: 'Room of Sciencebattle',
    short: 'Sciencebattle',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    dot: 'bg-orange-400',
  },
  {
    id: 5,
    name: 'Final Stage',
    short: 'Final',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    dot: 'bg-yellow-400',
  },
  {
    id: 6,
    name: 'Completed',
    short: 'Done',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    dot: 'bg-green-400',
  },
]

export interface ActiveTeam {
  id: string
  name: string
  mission: string
  currentRoom: number
  startedAt: string
  membersCount: number
  score: number
  timeRemaining: number // seconds
  timedOut: boolean
}

export interface TimeoutAlert {
  id: string
  teamId: string
  teamName: string
  roomName: string
  timestamp: Date
  dismissed: boolean
}

export interface PastGame {
  id: string
  date: string
  mission: string
  winnerTeam: string
  totalTeams: number
  winnerTime: string
  winnerScore: number
  allTeams: { name: string; score: number; time: string; completed: boolean }[]
}

// Mock active teams — some with low time to demo the timeout feature
export const MOCK_ACTIVE_TEAMS: ActiveTeam[] = [
  {
    id: 't1',
    name: 'The Nightingales',
    mission: 'The Silent Symptom',
    currentRoom: 3,
    startedAt: '14:30',
    membersCount: 4,
    score: 2200,
    timeRemaining: 45,
    timedOut: false,
  },
  {
    id: 't2',
    name: 'Code Blue Crew',
    mission: 'The Silent Symptom',
    currentRoom: 1,
    startedAt: '14:45',
    membersCount: 3,
    score: 800,
    timeRemaining: 1920,
    timedOut: false,
  },
  {
    id: 't3',
    name: 'EBN Warriors',
    mission: 'The Silent Symptom',
    currentRoom: 4,
    startedAt: '14:15',
    membersCount: 5,
    score: 3100,
    timeRemaining: 25,
    timedOut: false,
  },
  {
    id: 't4',
    name: 'The Evidence Squad',
    mission: 'The Silent Symptom',
    currentRoom: 2,
    startedAt: '14:35',
    membersCount: 4,
    score: 1500,
    timeRemaining: 1380,
    timedOut: false,
  },
  {
    id: 't5',
    name: 'Clinical Detectives',
    mission: 'The Silent Symptom',
    currentRoom: 5,
    startedAt: '13:50',
    membersCount: 3,
    score: 3800,
    timeRemaining: 480,
    timedOut: false,
  },
  {
    id: 't6',
    name: 'Stat Nurses',
    mission: 'The Silent Symptom',
    currentRoom: 1,
    startedAt: '15:00',
    membersCount: 4,
    score: 400,
    timeRemaining: 2700,
    timedOut: false,
  },
  {
    id: 't7',
    name: 'Research Rebels',
    mission: 'The Silent Symptom',
    currentRoom: 2,
    startedAt: '14:40',
    membersCount: 3,
    score: 1200,
    timeRemaining: 1080,
    timedOut: false,
  },
]

// Mock past games
export const MOCK_PAST_GAMES: PastGame[] = [
  {
    id: 'g1',
    date: '2026-03-02',
    mission: 'The Silent Symptom',
    winnerTeam: 'Florence Force',
    totalTeams: 6,
    winnerTime: '42:18',
    winnerScore: 4000,
    allTeams: [
      { name: 'Florence Force', score: 4000, time: '42:18', completed: true },
      { name: 'The Evidencers', score: 3600, time: '48:32', completed: true },
      { name: 'Nurse Navigators', score: 3200, time: '51:45', completed: true },
      { name: 'Critical Care Crew', score: 2800, time: '55:10', completed: true },
      { name: 'The Analyzers', score: 1900, time: '—', completed: false },
      { name: 'Team Vitals', score: 1200, time: '—', completed: false },
    ],
  },
  {
    id: 'g2',
    date: '2026-02-27',
    mission: 'The Medication Maze',
    winnerTeam: 'Rx Rangers',
    totalTeams: 5,
    winnerTime: '38:55',
    winnerScore: 4000,
    allTeams: [
      { name: 'Rx Rangers', score: 4000, time: '38:55', completed: true },
      { name: 'Dose Detectives', score: 3400, time: '45:20', completed: true },
      { name: 'Pharma Phinders', score: 2900, time: '52:00', completed: true },
      { name: 'The Prescribers', score: 2100, time: '—', completed: false },
      { name: 'Med Check Mates', score: 800, time: '—', completed: false },
    ],
  },
  {
    id: 'g3',
    date: '2026-02-20',
    mission: 'Code Blue Protocol',
    winnerTeam: 'Rapid Response',
    totalTeams: 8,
    winnerTime: '35:42',
    winnerScore: 4000,
    allTeams: [
      { name: 'Rapid Response', score: 4000, time: '35:42', completed: true },
      { name: 'Shock Team Alpha', score: 3800, time: '37:15', completed: true },
      { name: 'Defib Dynasty', score: 3500, time: '41:30', completed: true },
      { name: 'ACLS Avengers', score: 3200, time: '44:00', completed: true },
      { name: 'Pulse Patrol', score: 2800, time: '49:22', completed: true },
      { name: 'BLS Brigade', score: 2400, time: '53:10', completed: true },
      { name: 'The Resuscitators', score: 1600, time: '—', completed: false },
      { name: 'CPR Collective', score: 900, time: '—', completed: false },
    ],
  },
  {
    id: 'g4',
    date: '2026-02-14',
    mission: 'The Silent Symptom',
    winnerTeam: 'The Nightingales',
    totalTeams: 4,
    winnerTime: '40:05',
    winnerScore: 4000,
    allTeams: [
      { name: 'The Nightingales', score: 4000, time: '40:05', completed: true },
      { name: 'Evidence Hunters', score: 3200, time: '47:30', completed: true },
      { name: 'Clinical Minds', score: 2600, time: '54:12', completed: true },
      { name: 'Team Hypothesis', score: 1800, time: '—', completed: false },
    ],
  },
  {
    id: 'g5',
    date: '2026-02-07',
    mission: 'The Infection Detective',
    winnerTeam: 'Germ Busters',
    totalTeams: 6,
    winnerTime: '44:30',
    winnerScore: 4000,
    allTeams: [
      { name: 'Germ Busters', score: 4000, time: '44:30', completed: true },
      { name: 'Infection Control Unit', score: 3700, time: '46:15', completed: true },
      { name: 'Pathogen Patrol', score: 3100, time: '50:00', completed: true },
      { name: 'Sterile Squad', score: 2500, time: '55:40', completed: true },
      { name: 'Bio Barrier Team', score: 1900, time: '—', completed: false },
      { name: 'The Sanitizers', score: 1100, time: '—', completed: false },
    ],
  },
]

export type Tab = 'monitor' | 'history'
export type SortField = 'date' | 'mission' | 'winner' | 'teams' | 'time' | 'score'
export type SortDir = 'asc' | 'desc'

export function formatTime(seconds: number): string {
  if (seconds <= 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function getTimeColor(seconds: number, timedOut: boolean): string {
  if (timedOut) return 'text-red-400'
  if (seconds <= 60) return 'text-red-400'
  if (seconds <= 300) return 'text-orange-400'
  return 'text-gray-400'
}
