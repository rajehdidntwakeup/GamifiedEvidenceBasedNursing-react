import { useState, useCallback, useEffect } from "react";

import { enteringMissionApi } from "@/services/api";
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

function getStoredGameId(): number | null {
  const rawGameId = localStorage.getItem(ACTIVE_GAME_ID_STORAGE_KEY);
  const gameId = Number(rawGameId);
  if (!Number.isInteger(gameId) || gameId <= 0) {
    return null;
  }
  return gameId;
}

async function doesGameExist(gameId?: number, mission?: string): Promise<boolean> {
  // Simplified check - just verify we can access the game endpoint
  try {
    const url = gameId ? `/api/games/${gameId}/missions/${mission}` : "/api/game/landing";
    const response = await fetch(url);
    if (!response.ok) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function discoverLatestGameId(mission: MissionApi): Promise<number | null> {
  const gameOneExists = await doesGameExist();
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
  handleMissionSelect: (mission: { id: number; apiMission: string }) => void;
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

  const handleMissionSelect = useCallback((mission: { id: number; apiMission: string }) => {
    // Create a LandingMission-like object for backward compatibility
    const backendMission = {
      id: mission.id,
      apiMission: mission.apiMission as MissionApi,
      title: "",
      subtitle: "",
      desc: "",
      icon: null,
      xp: 0,
      color: "",
      borderColor: "",
      bgColor: "",
      textColor: "",
    };
    setPendingMission(backendMission);
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

      // Call the enter mission API to unlock and get initial room info
      const response = await enteringMissionApi.enter({
        password: trimmedPassword,
        gameId: gameId,
        missionId: pendingMission.id,
      });

      // Store the questions directly from the API response
      sessionStorage.setItem("missionQuestions", JSON.stringify(response.questions));

      localStorage.setItem(ACTIVE_GAME_ID_STORAGE_KEY, String(gameId));
      sessionStorage.setItem("activeTeamId", String(pendingMission.id));
      sessionStorage.setItem("activeRoomId", String(response.roomId));
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
