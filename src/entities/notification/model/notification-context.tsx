import { createContext, useContext, useReducer, type ReactNode } from 'react'

import type { AdminNotification } from './types'

type State = {
  notifications: AdminNotification[]
  unreadCount: number
}

type Action =
  | { type: 'ADD'; payload: AdminNotification }
  | { type: 'MARK_ALL_READ' }
  | { type: 'REMOVE'; payload: number }

const initialState: State = { notifications: [], unreadCount: 0 }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const exists = state.notifications.some((n) => n.submissionId === action.payload.submissionId)
      if (exists) return state
      return {
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }
    }
    case 'MARK_ALL_READ':
      return { ...state, unreadCount: 0 }
    case 'REMOVE':
      return {
        notifications: state.notifications.filter((n) => n.submissionId !== action.payload),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }
    default:
      return state
  }
}

const NotificationContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be inside NotificationProvider')
  return ctx
}
