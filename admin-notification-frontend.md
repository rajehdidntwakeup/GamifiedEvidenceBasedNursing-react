# Admin Notification Frontend Plan

## Context

Backend is Spring Boot with STOMP WebSocket on `/ws`. CORS configured for `http://localhost:5173`. JWT auth via `Authorization: Bearer <token>`. Frontend is separate Vite app.

## Actual Stack

- React 19.2.4
- TypeScript 5.9.3
- Vite 7.1.12 (port 5173)
- `react-router` 7.13.0
- Tailwind CSS 4.1.12 with `@tailwindcss/vite`
- `motion` 12.38.0 (animations — import from `motion/react`)
- `lucide-react` 0.487.0 (icons)
- Vitest 4.1.1 + `@testing-library/react` 16.3.2 + jsdom 29.0.1 (testing)

No global state library installed. Use React Context + `useReducer`.

## Project Architecture

This project follows **Feature-Sliced Design (FSD)**:

```
src/
├── app/          # App shell, router, global CSS
├── entities/     # Business entities (session, etc.)
├── features/     # User-facing features (password-gate, etc.)
├── pages/        # Full page components (kebab-case dirs)
├── services/     # Centralized API definitions
├── shared/       # Shared utilities, types, assets
│   ├── api/      # Base fetch client
│   └── types/    # Shared type definitions
└── widgets/      # Reusable composite components
```

All imports use the `@/` path alias (mapped to `src/`).

## Auth System Reference

Auth lives in `src/entities/session/`. Key exports:

- `useSession()` — hook returning `{ user, isAuthenticated, isLoading, error, login, register, logout, clearError }`
- `user` shape: `{ token: string; admin: boolean }`
- Token stored in `localStorage['token']`, auto-attached by `fetchApi()` in `src/shared/api/base-client.ts`
- Import: `import { useSession } from '@/entities/session'`

---

## 1. Install WebSocket Dependencies

```bash
npm install @stomp/stompjs sockjs-client
npm install -D @types/sockjs-client
```

---

## 2. WebSocket Client Service

File: `src/entities/notification/api/websocket.ts`

```typescript
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

import type { AdminNotification } from '../model/types'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws'

let stompClient: Client | null = null
let subscription: StompSubscription | null = null

export function connectWebSocket(token: string, onMessage: (msg: AdminNotification) => void) {
  if (stompClient?.active) return

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => {
      if (import.meta.env.DEV) console.log(str)
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      subscription = stompClient!.subscribe('/topic/analytics/submissions', (message: IMessage) => {
        const body = JSON.parse(message.body)
        onMessage(body)
      })
    },
    onStompError: (frame) => {
      console.error('Broker error: ' + frame.headers['message'])
    },
  })

  stompClient.activate()
}

export function disconnectWebSocket() {
  subscription?.unsubscribe()
  stompClient?.deactivate()
  subscription = null
  stompClient = null
}
```

**Why SockJS:** Spring Boot STOMP endpoint registered with `.withSockJS()`. Frontend must use SockJS to match.

**Reconnect:** `reconnectDelay` handles backend restarts or transient failures.

**Note:** `VITE_WS_URL` is already defined in `.env` as `http://localhost:8080/ws`.

---

## 3. Type Definitions

File: `src/entities/notification/model/types.ts`

```typescript
export interface AnswerDetail {
  questionId: number
  questionText: string
  answerText: string
}

export interface AdminNotification {
  submissionId: number
  missionId: number
  missionName: string
  roomId: number
  roomName: string
  submittedAt: string // ISO-8601
  answers: AnswerDetail[]
}
```

---

## 4. State Management (React Context + useReducer)

No Zustand/Redux in `package.json`. Keep it vanilla.

File: `src/entities/notification/model/notification-context.tsx`

```typescript
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
      const exists = state.notifications.some(
        (n) => n.submissionId === action.payload.submissionId,
      )
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
        notifications: state.notifications.filter(
          (n) => n.submissionId !== action.payload,
        ),
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
  if (!ctx)
    throw new Error('useNotification must be inside NotificationProvider')
  return ctx
}
```

---

## 5. Entity Barrel Export

File: `src/entities/notification/index.ts`

```typescript
export { NotificationProvider, useNotification } from './model/notification-context'
export type { AdminNotification, AnswerDetail } from './model/types'
export { connectWebSocket, disconnectWebSocket } from './api/websocket'
```

---

## 6. WebSocket Provider Hook

File: `src/entities/notification/model/use-admin-websocket.ts`

```typescript
import { useEffect } from 'react'

import { useSession } from '@/entities/session'

import { connectWebSocket, disconnectWebSocket } from '../api/websocket'
import { useNotification } from './notification-context'

export function useAdminWebSocket() {
  const { user } = useSession()
  const { dispatch } = useNotification()

  useEffect(() => {
    if (!user?.token || !user.admin) return

    connectWebSocket(user.token, (msg) => {
      dispatch({ type: 'ADD', payload: msg })
    })

    return () => {
      disconnectWebSocket()
    }
  }, [user?.token, user?.admin, dispatch])
}
```

**Mount point:** Call `useAdminWebSocket()` inside admin dashboard so it lives for entire admin session.

---

## 7. Admin Dashboard UI Components

### Notification Bell Component

File: `src/pages/admin-dashboard/components/notification-bell.tsx`

```tsx
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

import { useNotification } from '@/entities/notification'

export function NotificationBell() {
  const { state, dispatch } = useNotification()

  return (
    <div className='relative'>
      <button
        aria-label='notifications'
        className='relative p-2 rounded-full hover:bg-gray-100 transition-colors'
        onClick={() => dispatch({ type: 'MARK_ALL_READ' })}
      >
        <Bell className='w-5 h-5 text-gray-700' />
        <AnimatePresence>
          {state.unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className='absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full min-w-[1.25rem] h-5 flex items-center justify-center text-xs font-medium px-1'
            >
              {state.unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
```

### Submission Detail Panel

File: `src/pages/admin-dashboard/components/submission-panel.tsx`

```tsx
import { Check, X } from 'lucide-react'
import { motion } from 'motion/react'

import type { AdminNotification } from '@/entities/notification'

interface Props {
  submission: AdminNotification
  onValidate: (id: number) => void
  onReject: (id: number) => void
}

export function SubmissionPanel({ submission, onValidate, onReject }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className='border border-gray-200 rounded-xl p-5 mb-4 bg-white shadow-sm'
    >
      <div className='flex justify-between items-start mb-3'>
        <div>
          <h3 className='font-bold text-gray-900'>{submission.missionName}</h3>
          <p className='text-sm text-gray-500'>
            Mission ID: {submission.missionId} &middot; Room: {submission.roomName}
          </p>
        </div>
        <time className='text-xs text-gray-400' title={submission.submittedAt}>
          {new Date(submission.submittedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      </div>

      <div className='space-y-3'>
        {submission.answers.map((a) => (
          <div key={a.questionId} className='bg-gray-50 rounded-lg p-3'>
            <p className='font-semibold text-sm text-gray-800'>{a.questionText}</p>
            <p className='text-sm text-gray-600 mt-1 leading-relaxed'>{a.answerText}</p>
          </div>
        ))}
      </div>

      <div className='flex gap-2 mt-4'>
        <button
          onClick={() => onValidate(submission.submissionId)}
          className='inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
        >
          <Check className='w-4 h-4' /> Validate
        </button>
        <button
          onClick={() => onReject(submission.submissionId)}
          className='inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
        >
          <X className='w-4 h-4' /> Reject
        </button>
      </div>
    </motion.div>
  )
}
```

---

## 8. Integration with Admin Dashboard

The admin dashboard already exists at `src/pages/admin-dashboard/admin-dashboard.tsx`. Add WebSocket hook and notification UI into existing component. The `useAdminWebSocket()` hook should be called inside this component (or a wrapper). The `NotificationBell` can be added to the dashboard header. Submission notifications render via `SubmissionPanel` in a new "Submissions" tab or section.

Example integration (add to existing admin dashboard):

```typescript
import { useAdminWebSocket } from '@/entities/notification/model/use-admin-websocket'
import { useNotification } from '@/entities/notification'
import { NotificationBell } from './components/notification-bell'
import { SubmissionPanel } from './components/submission-panel'

// Inside AdminDashboard component:
useAdminWebSocket()
const { state, dispatch } = useNotification()

const handleValidate = (id: number) => {
  // TODO: POST /api/admin/submissions/{id}/validate
  dispatch({ type: 'REMOVE', payload: id })
}

const handleReject = (id: number) => {
  // TODO: POST /api/admin/submissions/{id}/reject
  dispatch({ type: 'REMOVE', payload: id })
}
```

---

## 9. App-Level Provider Wiring

File: `src/app/App.tsx` — wrap with `NotificationProvider`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

import { SessionProvider, useSession } from '@/entities/session'
import { NotificationProvider } from '@/entities/notification'
import { AdminDashboard } from '@/pages/admin-dashboard/admin-dashboard'
import { LandingPage } from '@/pages/landing-page/landing-page'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSession()
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

function AppRoutes() {
  const { logout } = useSession()

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard onBack={logout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <SessionProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </SessionProvider>
  )
}
```

---

## 10. Environment Config

Already in `.env`:

```
VITE_API_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
VITE_APP_NAME=EBNA Escape Room
VITE_APP_VERSION=0.0.1
```

No changes needed. WebSocket service reads `VITE_WS_URL` directly.

For production, add to `.env.production`:

```
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=https://api.yourdomain.com/ws
```

---

## 11. Tailwind v4 Notes

Tailwind CSS 4.1.12 uses CSS-first configuration. Setup in this project:

**`src/app/tailwind.css`:**

```css
@import 'tailwindcss' source(none);
@import 'tw-animate-css';
@source '../**/*.{js,ts,jsx,tsx}';
```

**`src/app/theme.css`:** Uses CSS custom properties on `:root` + `@theme inline` block to map them to Tailwind color utilities. Dark mode via `@custom-variant dark (&:is(.dark *))`.

**`src/app/index.css`:** Entry point importing `fonts.css`, `tailwind.css`, and `theme.css`.

All utility classes in components above use Tailwind v4 syntax. Theme colors available as `text-primary`, `bg-accent`, `border-border`, etc.

---

## 12. Error Handling & Edge Cases

| Case                         | Handling                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Token expired during session | Backend closes WS. Frontend detects `onDisconnect`, triggers re-login or token refresh before reconnect.                 |
| Admin opens multiple tabs    | Each tab holds own WS connection and duplicate notifications. Acceptable. Dedup by `submissionId` in reducer.            |
| Backend down                 | SockJS auto-reconnects every 5s. Show offline banner if `onWebSocketClose` fires.                                        |
| Non-admin tries to connect   | Backend rejects subscription or handshake. Frontend guards with `user.admin === false` check — won't attempt connection. |
| Large submission payloads    | STOMP default payload limit is high. If answers contain long text, no issue. If images, use URLs not base64 in WS.       |

---

## 13. Testing Strategy

1. **Manual:** Open admin dashboard in browser, submit answers from player client, verify notification appears within 1s.
2. **Component tests (Vitest):** Mock `NotificationContext`, render `SubmissionPanel`, assert validate button calls handler.
3. **Integration tests:** Use `mock-socket` or real Node WS client to simulate STOMP server, assert `connectWebSocket` subscribes and delivers messages to context.

Vitest and testing libraries already installed. Example test:

File: `src/pages/admin-dashboard/components/submission-panel.test.tsx`

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { SubmissionPanel } from './submission-panel'

const mockSubmission = {
  submissionId: 1,
  missionId: 10,
  missionName: 'Mission Alpha',
  roomId: 5,
  roomName: 'Analytics Room',
  submittedAt: '2026-04-30T10:00:00Z',
  answers: [{ questionId: 1, questionText: 'Q1', answerText: 'A1' }],
}

describe('SubmissionPanel', () => {
  it('calls onValidate when validate clicked', () => {
    const onValidate = vi.fn()
    render(
      <SubmissionPanel submission={mockSubmission} onValidate={onValidate} onReject={vi.fn()} />,
    )
    fireEvent.click(screen.getByText(/validate/i))
    expect(onValidate).toHaveBeenCalledWith(1)
  })
})
```

---

## Summary Checklist

| Step                | File                                                             |
| ------------------- | ---------------------------------------------------------------- |
| Install WS deps     | `package.json`                                                   |
| WS client service   | `src/entities/notification/api/websocket.ts`                     |
| Type definitions    | `src/entities/notification/model/types.ts`                       |
| State context       | `src/entities/notification/model/notification-context.tsx`       |
| Barrel export       | `src/entities/notification/index.ts`                             |
| WS hook             | `src/entities/notification/model/use-admin-websocket.ts`         |
| Notification bell   | `src/pages/admin-dashboard/components/notification-bell.tsx`     |
| Submission panel    | `src/pages/admin-dashboard/components/submission-panel.tsx`      |
| App provider wiring | `src/app/App.tsx`                                                |
| Env config          | `.env` (already done), `.env.production` (new)                   |
| Tests               | `src/pages/admin-dashboard/components/submission-panel.test.tsx` |

## File Structure (New Files)

```
src/
├── entities/
│   └── notification/              # NEW entity
│       ├── api/
│       │   └── websocket.ts
│       ├── model/
│       │   ├── types.ts
│       │   ├── notification-context.tsx
│       │   └── use-admin-websocket.ts
│       └── index.ts
├── pages/
│   └── admin-dashboard/
│       └── components/            # NEW subdir
│           ├── notification-bell.tsx
│           ├── submission-panel.tsx
│           └── submission-panel.test.tsx
```
