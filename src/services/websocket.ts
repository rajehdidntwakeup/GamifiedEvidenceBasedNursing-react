/**
 * WebSocket service for real-time communication with backend.
 * Uses STOMP protocol over SockJS.
 */

import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";

export interface WebSocketCallbacks {
  onTeamProgress?: (update: TeamProgressUpdate) => void;
  onTeamJoin?: (event: TeamJoinEvent) => void;
  onAnswerSubmitted?: (event: AnswerSubmittedEvent) => void;
  onTimerUpdate?: (teamId: number, secondsRemaining: number) => void;
  onWinnerAnnouncement?: (teamId: number, teamName: string) => void;
  onLeaderboardUpdate?: (leaderboard: LeaderboardUpdate) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export interface TeamProgressUpdate {
  teamId: number;
  teamName: string;
  currentLocation: string;
  status: string;
  score: number;
  timerRemaining: number;
  currentQuestion: string | null;
  isWinner: boolean;
  timestamp: string;
}

export interface TeamJoinEvent {
  teamId: number;
  teamName: string;
  gameId: number;
  joinedBy: string;
  timestamp: string;
}

export interface AnswerSubmittedEvent {
  teamId: number;
  teamName: string;
  roomId: number;
  questionId: number;
  isCorrect: boolean;
  pointsEarned: number;
  newTotalScore: number;
  feedback: string;
  timestamp: string;
}

export interface LeaderboardUpdate {
  gameId: number;
  entries: Array<{
    teamId: number;
    teamName: string;
    rank: number;
    score: number;
  }>;
}

export class WebSocketService {
  private client: Client | null = null;
  private gameId: number | null = null;
  private teamId: number | null = null;
  private callbacks: WebSocketCallbacks = {};
  private subscriptions: Array<{ id: string; unsubscribe: () => void }> = [];

  constructor(gameId?: number, teamId?: number) {
    this.gameId = gameId || null;
    this.teamId = teamId || null;
  }

  /**
   * Connect to WebSocket server.
   */
  connect(token?: string): void {
    if (this.client?.active) {
      console.log("WebSocket already connected");
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log("STOMP: ", str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log("WebSocket connected");
      this.subscribeToTopics();
      this.callbacks.onConnect?.();
    };

    this.client.onDisconnect = () => {
      console.log("WebSocket disconnected");
      this.callbacks.onDisconnect?.();
    };

    this.client.onStompError = (frame) => {
      console.error("STOMP error:", frame.headers.message);
      this.callbacks.onError?.(new Error(frame.headers.message));
    };

    this.client.activate();
  }

  /**
   * Disconnect from WebSocket server.
   */
  disconnect(): void {
    this.unsubscribeAll();
    this.client?.deactivate();
    this.client = null;
  }

  /**
   * Set callbacks for WebSocket events.
   */
  setCallbacks(callbacks: WebSocketCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Subscribe to game and team topics.
   */
  private subscribeToTopics(): void {
    if (!this.client?.active) return;

    // Game-wide topics
    if (this.gameId) {
      // Team progress updates
      this.subscribe(`/topic/game/${this.gameId}/progress`, (message) => {
        const update: TeamProgressUpdate = JSON.parse(message.body);
        this.callbacks.onTeamProgress?.(update);
      });

      // Team join events
      this.subscribe(`/topic/game/${this.gameId}/joins`, (message) => {
        const event: TeamJoinEvent = JSON.parse(message.body);
        this.callbacks.onTeamJoin?.(event);
      });

      // Answer submissions
      this.subscribe(`/topic/game/${this.gameId}/answers`, (message) => {
        const event: AnswerSubmittedEvent = JSON.parse(message.body);
        this.callbacks.onAnswerSubmitted?.(event);
      });

      // Leaderboard updates
      this.subscribe(`/topic/game/${this.gameId}/leaderboard`, (message) => {
        const update: LeaderboardUpdate = JSON.parse(message.body);
        this.callbacks.onLeaderboardUpdate?.(update);
      });

      // Winner announcement
      this.subscribe(`/topic/game/${this.gameId}/winner`, (message) => {
        const { teamId, teamName } = JSON.parse(message.body);
        this.callbacks.onWinnerAnnouncement?.(teamId, teamName);
      });
    }

    // Team-specific topics
    if (this.teamId) {
      // Personal progress updates
      this.subscribe(`/topic/team/${this.teamId}/progress`, (message) => {
        const update: TeamProgressUpdate = JSON.parse(message.body);
        this.callbacks.onTeamProgress?.(update);
      });

      // Timer updates
      this.subscribe(`/topic/team/${this.teamId}/timer`, (message) => {
        const secondsRemaining = parseInt(message.body);
        this.callbacks.onTimerUpdate?.(this.teamId!, secondsRemaining);
      });

      // Answer results
      this.subscribe(`/topic/team/${this.teamId}/answer-result`, (message) => {
        const event: AnswerSubmittedEvent = JSON.parse(message.body);
        this.callbacks.onAnswerSubmitted?.(event);
      });
    }
  }

  /**
   * Subscribe to a STOMP topic.
   */
  private subscribe(destination: string, callback: (message: IMessage) => void): void {
    if (!this.client) return;

    const subscription = this.client.subscribe(destination, callback);
    this.subscriptions.push({
      id: subscription.id,
      unsubscribe: () => subscription.unsubscribe(),
    });
  }

  /**
   * Unsubscribe from all topics.
   */
  private unsubscribeAll(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  /**
   * Send team join message.
   */
  sendTeamJoin(teamId: number, teamName: string): void {
    if (!this.client?.active || !this.gameId) return;

    this.client.publish({
      destination: `/app/game/${this.gameId}/join`,
      body: JSON.stringify(teamId),
      headers: { teamName },
    });
  }

  /**
   * Send heartbeat/ping.
   */
  sendHeartbeat(): void {
    if (!this.client?.active || !this.gameId || !this.teamId) return;

    this.client.publish({
      destination: `/app/game/${this.gameId}/team/${this.teamId}/ping`,
      body: "{}",
    });
  }

  /**
   * Request sync with server.
   */
  requestSync(): void {
    if (!this.client?.active || !this.gameId || !this.teamId) return;

    this.client.publish({
      destination: `/app/game/${this.gameId}/team/${this.teamId}/sync`,
      body: "{}",
    });
  }

  /**
   * Check if connected.
   */
  isConnected(): boolean {
    return this.client?.active || false;
  }
}

// Singleton instance for app-wide use
let webSocketInstance: WebSocketService | null = null;

export const getWebSocketService = (
  gameId?: number,
  teamId?: number
): WebSocketService => {
  if (!webSocketInstance || 
      webSocketInstance["gameId"] !== gameId || 
      webSocketInstance["teamId"] !== teamId) {
    webSocketInstance?.disconnect();
    webSocketInstance = new WebSocketService(gameId, teamId);
  }
  return webSocketInstance;
};

export default WebSocketService;
