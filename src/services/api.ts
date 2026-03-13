/**
 * API configuration and utility functions for backend integration.
 * Base URL: http://localhost:8080/api
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/**
 * Generic fetch wrapper with error handling.
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ============== AUTH API ==============

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export const authApi = {
  login: (credentials: AuthRequest) => 
    fetchApi<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  
  register: (credentials: AuthRequest) =>
    fetchApi<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
};

// ============== GAME API ==============

export interface GameResponse {
  id: number;
  password: string;
  begin: string;
  finish: string | null;
  status: string;
  teamMissions: Record<string, number>;
}

export interface GameResult {
  gameId: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  winnerId: number | null;
  winnerName: string | null;
  teamResults: TeamResult[];
}

export interface TeamResult {
  teamId: number;
  teamName: string;
  score: number;
  completionTimeMinutes: number;
  isWinner: boolean;
  finalRanking: number;
}

export const gameApi = {
  create: (password: string) =>
    fetchApi<GameResponse>("/game/create", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
  
  getResults: (gameId: number) =>
    fetchApi<GameResult>(`/completion/games/${gameId}/results`),
    
  checkCompletion: (gameId: number) =>
    fetchApi<GameResult | null>(`/completion/games/${gameId}/check`),
    
  getWinner: (gameId: number) =>
    fetchApi<{ teamId: number; teamName: string; finalScore: number }>(`/completion/games/${gameId}/winner`),
};

// ============== TEAM API ==============

export interface TeamDto {
  id: number;
  mission: string;
  status: string;
  location: string;
  isWinner: boolean;
  gameId: number;
}

export interface TeamProgress {
  teamId: number;
  teamName: string;
  currentLocation: string;
  status: string;
  score: number;
  timerRemaining: number | null;
  currentQuestion: string | null;
  isWinner: boolean;
  timestamp: string;
}

export const teamApi = {
  getById: (teamId: number) =>
    fetchApi<TeamDto>(`/teams/${teamId}`),
    
  getByGame: (gameId: number) =>
    fetchApi<TeamDto[]>(`/teams/game/${gameId}`),
    
  getProgress: (teamId: number) =>
    fetchApi<TeamProgress>(`/teams/${teamId}/progress`),
    
  completeGame: (teamId: number) =>
    fetchApi<{ teamId: number; finalScore: number; completionTimeMinutes: number }>(
      `/completion/teams/${teamId}/complete`,
      { method: "POST" }
    ),
};

// ============== ROOM API ==============

export interface QuestionDto {
  id: number;
  title: string;
  image: string | null;
  answers: { id: number; text: string }[];
}

export interface RoomStatus {
  roomId: number;
  location: string;
  status: string;
  timerRemaining: number;
  totalQuestions: number;
  answeredQuestions: number;
  questions: QuestionDto[];
  isComplete: boolean;
}

export interface SubmitAnswerRequest {
  teamId: number;
  roomId: number;
  questionId: number;
  answerId: number;
}

export interface SubmitAnswerResponse {
  correct: boolean;
  pointsEarned: number;
  newTotalScore: number;
  feedback: string;
  roomCompleted: boolean;
  nextQuestionId: number | null;
}

export const roomApi = {
  getStatus: (roomId: number, teamId: number) =>
    fetchApi<RoomStatus>(`/rooms/${roomId}/status?teamId=${teamId}`),
    
  getQuestions: (roomId: number, teamId: number) =>
    fetchApi<QuestionDto[]>(`/rooms/${roomId}/questions?teamId=${teamId}`),
    
  submitAnswer: (roomId: number, request: SubmitAnswerRequest) =>
    fetchApi<SubmitAnswerResponse>(`/rooms/${roomId}/submit-answer`, {
      method: "POST",
      body: JSON.stringify(request),
    }),
    
  getHint: (roomId: number, teamId: number, questionId: number) =>
    fetchApi<string>(`/rooms/${roomId}/questions/${questionId}/hint?teamId=${teamId}`, {
      method: "POST",
    }),
    
  skipQuestion: (roomId: number, teamId: number, questionId: number) =>
    fetchApi<RoomStatus>(`/rooms/${roomId}/questions/${questionId}/skip?teamId=${teamId}`, {
      method: "POST",
    }),
};

// ============== LEADERBOARD API ==============

export interface LeaderboardEntry {
  teamId: number;
  teamName: string;
  mission: string;
  rank: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  hintsUsed: number;
  completionTimeMinutes: number;
  accuracyPercentage: number;
  isCurrentUser: boolean;
  status: string;
}

export const leaderboardApi = {
  getGameLeaderboard: (gameId: number) =>
    fetchApi<LeaderboardEntry[]>(`/leaderboard/games/${gameId}`),
    
  getTopTeams: (gameId: number, limit: number = 10) =>
    fetchApi<LeaderboardEntry[]>(`/leaderboard/games/${gameId}/top?limit=${limit}`),
    
  getGlobalLeaderboard: () =>
    fetchApi<LeaderboardEntry[]>("/leaderboard/global"),
    
  getMissionLeaderboard: (mission: string) =>
    fetchApi<LeaderboardEntry[]>(`/leaderboard/global/mission/${mission}`),
    
  getMyPosition: (gameId: number, teamId: number) =>
    fetchApi<LeaderboardEntry>(`/leaderboard/games/${gameId}/my-position?teamId=${teamId}`),
};

// ============== ADMIN API ==============

export interface AdminGame {
  id: number;
  password: string;
  beginTime: string;
  endTime: string | null;
  status: string;
  teamCount: number;
  activeTeams: number;
  completedTeams: number;
  teams: AdminTeamSummary[];
  winnerId: number | null;
  winnerName: string | null;
}

export interface AdminTeamSummary {
  teamId: number;
  mission: string;
  status: string;
  score: number;
}

export const adminApi = {
  getAllGames: () =>
    fetchApi<AdminGame[]>("/admin/games"),
    
  getGame: (gameId: number) =>
    fetchApi<AdminGame>(`/admin/games/${gameId}`),
    
  deleteGame: (gameId: number) =>
    fetchApi<void>(`/admin/games/${gameId}`, { method: "DELETE" }),
    
  startGame: (gameId: number) =>
    fetchApi<AdminGame>(`/admin/games/${gameId}/start`, { method: "POST" }),
    
  endGame: (gameId: number) =>
    fetchApi<AdminGame>(`/admin/games/${gameId}/end`, { method: "POST" }),
    
  getGameTeams: (gameId: number) =>
    fetchApi<TeamDto[]>(`/admin/games/${gameId}/teams`),
    
  resetTeam: (gameId: number, teamId: number) =>
    fetchApi<TeamDto>(`/admin/games/${gameId}/teams/${teamId}/reset`, { method: "POST" }),
    
  exportResults: (gameId: number) =>
    fetchApi<string>(`/admin/games/${gameId}/export`),
};

export default {
  auth: authApi,
  game: gameApi,
  team: teamApi,
  room: roomApi,
  leaderboard: leaderboardApi,
  admin: adminApi,
};
