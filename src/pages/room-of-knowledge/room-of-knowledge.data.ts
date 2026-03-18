import { roomApi } from "@/services/api";
import type { MissionApi, RoomOfKnowledgeQuestionDto } from "@/services/api";
import type { Mission } from "@/shared/types/mission";

export interface RoomOfKnowledgeProps {
  mission: Mission;
  onBack: () => void;
  onProceedToRoom2?: () => void;
}

export interface RoomQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export const TOTAL_TIME = 10 * 60;

const MISSION_BY_ID: Record<number, MissionApi> = {
  1: "WOUND_CARE_FOR_PRESSURE_ULCERS",
  2: "FALL_PREVENTION_IN_GERIATRICS",
  3: "PAIN_MANAGEMENT_IN_POSTOPERATIVE_CARE",
  4: "NUTRITIONAL_INTERVENTIONS_FOR_MALNUTRITION",
  5: "PREVENTION_OF_CATHETER_ASSOCIATED_URINARY_TRACT_INFECTIONS",
};

function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function mapApiQuestionsToRoomQuestions(apiQuestions: RoomOfKnowledgeQuestionDto[]): RoomQuestion[] {
  return apiQuestions
    .map((apiQuestion, index) => {
      const shuffledAnswers = shuffleArray(apiQuestion.answers);
      const options = shuffledAnswers.map((answer) => answer.answer);
      const correctIndex = shuffledAnswers.findIndex(
        (answer) => answer.isCorrect ?? answer.correct ?? false,
      );

      if (!apiQuestion.question || options.length === 0 || correctIndex < 0) {
        return null;
      }

      return {
        id: index + 1,
        question: apiQuestion.question,
        options,
        correctIndex,
      };
    })
    .filter((question): question is RoomQuestion => question !== null);
}

export async function loadRoomOfKnowledgeQuestions(missionId: number): Promise<RoomQuestion[]> {
  const storedGameId = localStorage.getItem("activeGameId");
  const gameId = storedGameId ? Number(storedGameId) : NaN;

  if (!Number.isInteger(gameId) || gameId <= 0) {
    throw new Error("No active game found. Ask an admin to create a game first.");
  }

  const missionApi = MISSION_BY_ID[missionId];
  if (!missionApi) {
    throw new Error("This mission is not mapped to an API mission.");
  }

  const storedPassword = sessionStorage.getItem("activeMissionPassword")?.trim();
  const apiQuestions = await roomApi.getRoomOfKnowledgeQuestionList({
    gameId,
    mission: missionApi,
    ...(storedPassword ? { password: storedPassword } : {}),
  });

  const mappedQuestions = mapApiQuestionsToRoomQuestions(apiQuestions);
  if (mappedQuestions.length === 0) {
    throw new Error("No questions were returned for this mission.");
  }

  return mappedQuestions;
}
