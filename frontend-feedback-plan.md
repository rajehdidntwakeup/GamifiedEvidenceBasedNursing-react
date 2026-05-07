# Frontend Plan: Real-Time Admin Feedback via WebSocket (Updated)

## Context

The backend broadcasts admin feedback on `/topic/mission/analytics/{missionName}/feedback` whenever an admin approves or rejects answers. The payload is `AnalyticsFeedbackDto`:

```json
{
  "roomId": 3,
  "missionName": "mission1",
  "progress": 60,
  "feedbackAt": "2026-05-01T14:30:00Z",
  "questions": [
    { "questionId": 1, "approved": true, "answer": "Increased heart rate" },
    { "questionId": 2, "approved": false, "answer": null }
  ]
}
```

The frontend subscribes to this topic inside the **Room of Analytics** and updates the UI in real time.

**Tech stack:** React 19, TypeScript, Vite, `@stomp/stompjs`, React Router 7, Tailwind CSS.

---

## Step 1 — Verify Dependencies

`@stomp/stompjs` is already installed in the project.

If the backend requires SockJS compatibility (via `.withSockJS()`), you may need to install the following (currently missing):

```bash
npm install sockjs-client
npm install -D @types/sockjs-client
```

_Note: The current implementation in `src/entities/notification/api/websocket.ts` uses raw WebSockets (`ws://`)._

---

## Step 2 — Use Existing WebSocket Utility

Instead of creating a new hook, use the existing utility located at:
`src/entities/notification/api/websocket.ts`

This file provides:

- `connectPlayerFeedbackWs(token, missionName, onFeedback)`
- `disconnectPlayerFeedbackWs()`

It handles the STOMP connection logic, JWT authorization headers, and mission-specific subscriptions.

---

## Step 3 — Reference Existing Types

The data structures are already defined in:
`src/entities/notification/model/types.ts`

Key interfaces:

- `AnalyticsFeedbackDto`: The main payload containing `roomId`, `missionName`, `progress`, and `questions`.
- `QuestionFeedbackResultDto`: Individual question status (`questionId`, `approved`, `answer`).

---

## Step 4 — Implementation in Room of Analytics

The logic is already implemented in `src/pages/room-of-analytics/room-of-analytics.tsx`.

### 4a — Subscription Logic

The component uses a `handleFeedbackReceived` callback and manages the connection via `useEffect`:

```typescript
// From src/pages/room-of-analytics/room-of-analytics.tsx

const handleFeedbackReceived = (feedback: AnalyticsFeedbackDto) => {
    const questionMap = new Map(feedback.questions.map((q) => [q.questionId, q.approved]));
    // ... maps feedback to methodology, results, loe, strengths, and weakness states

    // Update UI states based on approval
    setLockedFields({ ... });
    setRetryFeedback({ ... });

    // If all 5 approved, complete the room
    if (overallScore === 5) {
        setIsComplete(true);
        disconnectPlayerFeedbackWs();
    }
};

// Reconnect on mount if waiting for feedback
useEffect(() => {
    if (!isWaitingForFeedback || !user?.token) return;
    const missionName = roomData?.missionName ?? "mission1";
    connectPlayerFeedbackWs(user.token, missionName, handleFeedbackReceived);
    return () => disconnectPlayerFeedbackWs();
}, [isWaitingForFeedback, user?.token]);
```

---

## Step 5 — UI Feedback & Progress

### 5a — State Indicators

The UI uses `lockedFields` to disable inputs for approved answers and `retryFeedback` to show which fields need correction.

### 5b — Progress Bar

The `progress` value from the WebSocket payload can be used to drive a progress bar:

```tsx
<div className='w-full bg-gray-200 rounded h-4 overflow-hidden'>
  <motion.div
    className='bg-blue-600 h-full'
    initial={{ width: 0 }}
    animate={{ width: `${progress}%` }}
    transition={{ duration: 0.5 }}
  />
</div>
```

---

## Step 6 — Connection Edge Cases

| Edge case         | Implementation Status                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| **Page refresh**  | Handled. `isWaitingForFeedback` is synced to `sessionStorage`, allowing reconnection on mount. |
| **Token expiry**  | Handled by `stompClient` reconnect logic (attempts with existing token).                       |
| **Multiple tabs** | Each tab establishes its own connection and receives the broadcast.                            |

---

## Step 7 — Environment Variables

Ensure `VITE_WS_URL` is set in your `.env` file:

```bash
VITE_WS_URL=http://localhost:8080/ws
```

The application automatically converts `http` to `ws` protocol in `websocket.ts`.

---

## Step 8 — Summary of Project Files

| File                                                | Purpose                                                  |
| --------------------------------------------------- | -------------------------------------------------------- |
| `src/entities/notification/api/websocket.ts`        | STOMP connection and subscription management             |
| `src/entities/notification/model/types.ts`          | Shared DTO interfaces for WebSocket payloads             |
| `src/pages/room-of-analytics/room-of-analytics.tsx` | Core logic for handling feedback and updating game state |
| `.env`                                              | Configuration for backend WebSocket URL                  |
