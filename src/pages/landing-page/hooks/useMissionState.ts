import { useState, useCallback, useEffect } from "react";

import { roomApi } from "@/services/api";
import type { MissionApi } from "@/services/api";

import { MISSIONS } from "../landing-page.data";
import type { LandingMission } from "../landing-page.data";

const ACTIVE_MISSION_ID_STORAGE_KEY = "activeMissionId";
const ACTIVE_ROOM_STORAGE_KEY = "activeRoom";
const ACTIVE_GAME_ID_STORAGE_KEY = "activeGameId";
const MAX_GAME_ID_DISCOVERY = 100_000;

function parseStoredRoom(rawRoom: string | null): number {
  const room = Number(rawRoom);
  if (!Number.isInteger(room) || room < 1 || room > 5) return 1;
  return room;
}

function getStoredMission(): LandingMission | null {
  const rawMissionId = sessionStorage.getItem(ACTIVE_MISSION_ID_STORAGE_KEY);
  const missionId = Number(rawMissionId);
  if (!Number.isInteger(missionId)) return null;
  return MISSIONS.find((mission) => mission.id === missionId) ?? null;
}

function parseErrorStatus(error: unknown): number | null {
  if (!(error instanceof Error)) {
    return null;
  }

  const httpMatch = error.message.match(/http\s*(\d{3})/i);
  if (httpMatch) {
    const status = Number(httpMatch[1]);
    return Number.isInteger(status) ? status : null;
  }

  const jsonStatusMatch = error.message.match(/"status"\s*:\s*(\d{3})/i);
  if (jsonStatusMatch) {
    const status = Number(jsonStatusMatch[1]);
    return Number.isInteger(status) ? status : null;
  }

  return null;
}

function getStoredGameId(): number | null {
  const rawGameId = localStorage.getItem(ACTIVE_GAME_ID_STORAGE_KEY);
  const gameId = Number(rawGameId);
  if (!Number.isInteger(gameId) || gameId <= 0) {
    return null;
  }
  return gameId;
}

async function doesGameExist(gameId: number, mission: MissionApi): Promise<boolean> {
  try {
    await roomApi.getRoomOfKnowledgeQuestionList({
      gameId,
      mission,
    });
    return true;
  } catch (error) {
    const status = parseErrorStatus(error);

    if (status === 500) {
      return false;
    }

    if (status === 400 || status === 401 || status === 403) {
      return true;
    }

    throw error;
  }
}

async function discoverLatestGameId(mission: MissionApi): Promise<number | null> {
  const gameOneExists = await doesGameExist(1, mission);
  if (!gameOneExists) {
    return null;
  }

  let lower = 1;
  let upper = 2;

  while (upper <= MAX_GAME_ID_DISCOVERY) {
    const exists = await doesGameExist(upper, mission);
    if (!exists) {
      break;
    }

    lower = upper;
    upper *= 2;
  }

  if (upper > MAX_GAME_ID_DISCOVERY) {
    upper = MAX_GAME_ID_DISCOVERY + 1;
  }

  let left = lower;
  let right = upper - 1;

  while (left < right) {
    const middle = Math.floor((left + right + 1) / 2);
    const exists = await doesGameExist(middle, mission);

    if (exists) {
      left = middle;
    } else {
      right = middle - 1;
    }
  }

  return left;
}

async function resolveGameId(mission: MissionApi): Promise<number | null> {
  const storedGameId = getStoredGameId();
  if (storedGameId) {
    return storedGameId;
  }

  const discoveredGameId = await discoverLatestGameId(mission);
  if (!discoveredGameId) {
    return null;
  }

  localStorage.setItem(ACTIVE_GAME_ID_STORAGE_KEY, String(discoveredGameId));
  return discoveredGameId;
}

interface MissionState {
  showLogin: boolean;
  showMissions: boolean;
  activeMission: LandingMission | null;
  currentRoom: number;
  pendingMission: LandingMission | null;
  missionPassword: string;
  passwordError: boolean;
  passwordErrorMessage: string | null;
  isUnlockingMission: boolean;
  username: string;
  password: string;
  showAdmin: boolean;
}

interface MissionActions {
  setShowLogin: (show: boolean) => void;
  setShowMissions: (show: boolean) => void;
  setActiveMission: (mission: LandingMission | null) => void;
  setCurrentRoom: (room: number) => void;
  setPendingMission: (mission: LandingMission | null) => void;
  setMissionPassword: (password: string) => void;
  setPasswordError: (error: boolean) => void;
  setPasswordErrorMessage: (message: string | null) => void;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setShowAdmin: (show: boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleMissionSelect: (mission: LandingMission) => void;
  handlePasswordSubmit: () => Promise<void>;
}

export function useMissionState(): [MissionState, MissionActions] {
  const initialMission = getStoredMission();
  const [showLogin, setShowLogin] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [activeMission, setActiveMissionState] = useState<LandingMission | null>(initialMission);
  const [currentRoom, setCurrentRoomState] = useState(() =>
    initialMission ? parseStoredRoom(sessionStorage.getItem(ACTIVE_ROOM_STORAGE_KEY)) : 1,
  );
  const [pendingMission, setPendingMission] = useState<LandingMission | null>(null);
  const [missionPassword, setMissionPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);
  const [isUnlockingMission, setIsUnlockingMission] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    if (!activeMission) {
      sessionStorage.removeItem(ACTIVE_MISSION_ID_STORAGE_KEY);
      sessionStorage.removeItem(ACTIVE_ROOM_STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(ACTIVE_MISSION_ID_STORAGE_KEY, String(activeMission.id));
    sessionStorage.setItem(ACTIVE_ROOM_STORAGE_KEY, String(currentRoom));
  }, [activeMission, currentRoom]);

  const setActiveMission = useCallback((mission: LandingMission | null) => {
    setActiveMissionState(mission);
    if (!mission) {
      setCurrentRoomState(1);
    }
  }, []);

  const setCurrentRoom = useCallback((room: number) => {
    setCurrentRoomState((current) => {
      if (!Number.isInteger(room) || room < 1 || room > 5) {
        return current;
      }
      return room;
    });
  }, []);

  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setShowLogin(false);
    setShowAdmin(true);
    setUsername("");
    setPassword("");
  }, []);

  const handleMissionSelect = useCallback((mission: LandingMission) => {
    setPendingMission(mission);
    setMissionPassword("");
    setPasswordError(false);
    setPasswordErrorMessage(null);
  }, []);

  const handlePasswordSubmit = useCallback(async () => {
    const trimmedPassword = missionPassword.trim();

    if (!pendingMission) {
      setPasswordError(true);
      setPasswordErrorMessage("Select a mission first.");
      return;
    }

    if (!trimmedPassword) {
      setPasswordError(true);
      setPasswordErrorMessage("Password is required.");
      return;
    }

    setIsUnlockingMission(true);
    setPasswordError(false);
    setPasswordErrorMessage(null);

    try {
      const gameId = await resolveGameId(pendingMission.apiMission);

      if (!gameId) {
        setPasswordError(true);
        setPasswordErrorMessage("No active game found. Ask an admin to create a game first.");
        return;
      }

      await roomApi.getRoomOfKnowledgeQuestionList({
        gameId,
        mission: pendingMission.apiMission,
        password: trimmedPassword,
      });
      localStorage.setItem(ACTIVE_GAME_ID_STORAGE_KEY, String(gameId));
      sessionStorage.setItem("activeMissionPassword", trimmedPassword);
      setActiveMission(pendingMission);
      setPendingMission(null);
      setMissionPassword("");
      setPasswordError(false);
      setPasswordErrorMessage(null);
      setShowMissions(false);
      setCurrentRoom(1);
    } catch (error) {
      setPasswordError(true);
      setPasswordErrorMessage(
        error instanceof Error && error.message ? error.message : "Incorrect password. Please try again."
      );
    } finally {
      setIsUnlockingMission(false);
    }
  }, [missionPassword, pendingMission, setActiveMission, setCurrentRoom]);

  const state: MissionState = {
    showLogin,
    showMissions,
    activeMission,
    currentRoom,
    pendingMission,
    missionPassword,
    passwordError,
    passwordErrorMessage,
    isUnlockingMission,
    username,
    password,
    showAdmin,
  };

  const actions: MissionActions = {
    setShowLogin,
    setShowMissions,
    setActiveMission,
    setCurrentRoom,
    setPendingMission,
    setMissionPassword,
    setPasswordError,
    setPasswordErrorMessage,
    setUsername,
    setPassword,
    setShowAdmin,
    handleLogin,
    handleMissionSelect,
    handlePasswordSubmit,
  };

  return [state, actions];
}
