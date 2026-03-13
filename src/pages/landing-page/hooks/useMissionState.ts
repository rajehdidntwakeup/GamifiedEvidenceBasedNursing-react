import { useState, useCallback } from "react";
import type { LandingMission } from "../landing-page.data";

interface MissionState {
  showLogin: boolean;
  showMissions: boolean;
  activeMission: LandingMission | null;
  currentRoom: number;
  pendingMission: LandingMission | null;
  missionPassword: string;
  passwordError: boolean;
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
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setShowAdmin: (show: boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleMissionSelect: (mission: LandingMission) => void;
  handlePasswordSubmit: (e: React.FormEvent) => void;
}

export function useMissionState(): [MissionState, MissionActions] {
  const [showLogin, setShowLogin] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [activeMission, setActiveMission] = useState<LandingMission | null>(null);
  const [currentRoom, setCurrentRoom] = useState(1);
  const [pendingMission, setPendingMission] = useState<LandingMission | null>(null);
  const [missionPassword, setMissionPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);

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
  }, []);

  const handlePasswordSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual password validation
    if (missionPassword === "test") {
      setActiveMission(pendingMission);
      setPendingMission(null);
      setMissionPassword("");
      setPasswordError(false);
      setShowMissions(false);
      setCurrentRoom(1);
    } else {
      setPasswordError(true);
    }
  }, [missionPassword, pendingMission]);

  const state: MissionState = {
    showLogin,
    showMissions,
    activeMission,
    currentRoom,
    pendingMission,
    missionPassword,
    passwordError,
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
    setUsername,
    setPassword,
    setShowAdmin,
    handleLogin,
    handleMissionSelect,
    handlePasswordSubmit,
  };

  return [state, actions];
}
