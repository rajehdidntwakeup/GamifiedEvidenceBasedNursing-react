import { Client, IMessage, StompSubscription } from '@stomp/stompjs'

import type { AdminNotification, AnalyticsFeedbackDto } from '../model/types'

// Spring Boot SockJS endpoint exposes raw WebSocket at /ws/websocket
const WS_BASE = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws'
const WS_URL = WS_BASE.replace(/^http/, 'ws') + '/websocket'

let stompClient: Client | null = null
let subscription: StompSubscription | null = null
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
      console.log('[AdminWebSocket] connected, subscribing to /topic/analytics/submissions')
      subscription = stompClient!.subscribe('/topic/analytics/submissions', (message: IMessage) => {
        const body = JSON.parse(message.body)
        console.log('[AdminWebSocket] raw message:', body)
        adminMessageHandler?.(body)
      })
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
  subscription?.unsubscribe()
  stompClient?.deactivate()
  subscription = null
  stompClient = null
  adminMessageHandler = null
}

// Player-side: listen for admin feedback on a specific mission
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
