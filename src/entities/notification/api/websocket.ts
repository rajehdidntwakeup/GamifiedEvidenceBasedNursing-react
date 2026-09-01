import { Client, IMessage, StompSubscription } from '@stomp/stompjs'

import type {
  AdminNotification,
  AnalyticsFeedbackDto,
  ScienceBattleFeedbackDto,
} from '../model/types'

// Spring Boot SockJS endpoint exposes raw WebSocket at /ws/websocket
const WS_BASE = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws'
const WS_URL = WS_BASE.replace(/^http/, 'ws') + '/websocket'

let stompClient: Client | null = null
let adminSubscriptions: StompSubscription[] = []
let adminMessageHandler: ((msg: AdminNotification) => void) | null = null

export function connectWebSocket(token: string, onMessage: (msg: AdminNotification) => void) {
  adminMessageHandler = onMessage

  if (stompClient?.active) {
    console.log('[AdminWebSocket] already active, updated handler only')
    return
  }

  console.log('[AdminWebSocket] connecting to', WS_URL)
  stompClient = new Client({
    brokerURL: WS_URL,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => {
      if (import.meta.env.DEV) console.log('[AdminWebSocket]', str)
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log('[AdminWebSocket] connected, subscribing to admin topics')
      adminSubscriptions = []

      const handleMessage = (message: IMessage) => {
        const body = JSON.parse(message.body)
        console.log('[AdminWebSocket] raw message:', body)
        adminMessageHandler?.(body)
      }

      const analyticsSub = stompClient!.subscribe('/topic/analytics/submissions', handleMessage)
      const scienceBattleSub = stompClient!.subscribe('/topic/sciencebattle/submissions', handleMessage)
      adminSubscriptions.push(analyticsSub, scienceBattleSub)
    },
    onStompError: (frame) => {
      console.error('[AdminWebSocket] STOMP error:', frame.headers['message'])
    },
    onWebSocketError: (event) => {
      console.error('[AdminWebSocket] WebSocket error:', event)
    },
    onDisconnect: () => {
      console.log('[AdminWebSocket] disconnected')
    },
  })

  stompClient.activate()
}

export function disconnectWebSocket() {
  console.log('[AdminWebSocket] disconnecting...')
  adminSubscriptions.forEach((sub) => sub.unsubscribe())
  adminSubscriptions = []
  stompClient?.deactivate()
  stompClient = null
  adminMessageHandler = null
}

// Player-side: listen for admin feedback on Analytics
let playerStompClient: Client | null = null
let playerSubscription: StompSubscription | null = null

export function connectPlayerFeedbackWs(
  token: string | undefined,
  missionName: string,
  onFeedback: (msg: AnalyticsFeedbackDto) => void,
) {
  if (playerStompClient?.active) return

  const connectHeaders: Record<string, string> = {}
  if (token) {
    connectHeaders.Authorization = `Bearer ${token}`
  }

  playerStompClient = new Client({
    brokerURL: WS_URL,
    connectHeaders,
    debug: (str) => {
      if (import.meta.env.DEV) console.log('[player-ws]', str)
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      playerSubscription = playerStompClient!.subscribe(
        `/topic/mission/analytics/${missionName}/feedback`,
        (message: IMessage) => {
          const body = JSON.parse(message.body)
          onFeedback(body)
        },
      )
    },
    onStompError: (frame) => {
      console.error('Player WS broker error: ' + frame.headers['message'])
    },
  })

  playerStompClient.activate()
}

export function disconnectPlayerFeedbackWs() {
  playerSubscription?.unsubscribe()
  playerStompClient?.deactivate()
  playerSubscription = null
  playerStompClient = null
}

// Player-side: listen for admin feedback on Science Battle
let scienceBattleStompClient: Client | null = null
let scienceBattleSubscription: StompSubscription | null = null

export function connectScienceBattleFeedbackWs(
  token: string | undefined,
  missionName: string,
  onFeedback: (msg: ScienceBattleFeedbackDto) => void,
) {
  if (scienceBattleStompClient?.active) return

  const connectHeaders: Record<string, string> = {}
  if (token) {
    connectHeaders.Authorization = `Bearer ${token}`
  }

  scienceBattleStompClient = new Client({
    brokerURL: WS_URL,
    connectHeaders,
    debug: (str) => {
      if (import.meta.env.DEV) console.log('[sciencebattle-ws]', str)
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      scienceBattleSubscription = scienceBattleStompClient!.subscribe(
        `/topic/sciencebattle/feedback/${missionName}/feedback`,
        (message: IMessage) => {
          const body = JSON.parse(message.body)
          onFeedback(body)
        },
      )
    },
    onStompError: (frame) => {
      console.error('Science Battle WS broker error: ' + frame.headers['message'])
    },
  })

  scienceBattleStompClient.activate()
}

export function disconnectScienceBattleFeedbackWs() {
  scienceBattleSubscription?.unsubscribe()
  scienceBattleStompClient?.deactivate()
  scienceBattleSubscription = null
  scienceBattleStompClient = null
}
