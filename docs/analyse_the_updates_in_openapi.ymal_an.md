### Analysis of OpenAPI Updates

The recent updates in `openapi.yaml` introduce backend support for the **Room of Science Battle** and its real-time review workflow, mirroring the pattern established by the **Room of Analytics**.

Key changes in `openapi.yaml`:
1. **WebSocket Topics (Info section):**
   - Admin submissions topic added: `/topic/sciencebattle/submissions`
   - Player feedback topic added: `/topic/sciencebattle/feedback{mission-name}/feedback` (or `/topic/mission/sciencebattle/{mission-name}/feedback`)
2. **Admin Dashboard Endpoints:**
   - Added `POST /api/admin/submission/sciencebattle` (`operationId: scienceBattleSubmissionFeedback`) accepting `SubmissionFeedbackDto` (`roomId`, `questions: QuestionFeedbackDto[]`).
3. **Room of Science Battle Endpoints:**
   - Added `POST /api/rooms/roomofsciencebattle/submit` (`operationId: submitScienceBattle`) accepting `ScienceBattleSubmissionDto` and returning `ScienceBattleSubmissionResponseDto`.
   - Added `GET /api/rooms/roomofsciencebattle/results` (`operationId: getScienceBattleResults`) accepting `roomId` and `missionId` query parameters, returning `ResultDto`.
   - Added `POST /api/game/proceed/sciencebattle` (`operationId: proceedToTheRoomOfScienceBattle`) accepting `ProceedDto` (`roomId`).
4. **Data Schemas & DTOs:**
   - `ScienceBattleSubmissionDto`: Contains `roomId`, `levelofEvidenceQuestionId`, `levelofEvidenceAnswer`, and `openQuestions: OpenQuestionSubmissionDto[]`.
   - `ScienceBattleSubmissionResponseDto`: Contains `progress` and `levelOfEvidenceApproved`.
   - `ScienceBattleFeedbackDto`: Contains `roomId`, `missionName`, `progress`, `feedbackAt`, and `questions: QuestionFeedbackResultDto[]`.
   - `SubmissionFeedbackDto` & `QuestionFeedbackDto`: Shared structure for admin feedback submission.

---

### Plan for Making Needed Changes

#### Phase 1: WebSocket & Notification Services (`src/entities/notification`)

1. **Update Notification Models & Types (`src/entities/notification/model/types.ts`):**
   - Export `ScienceBattleFeedbackDto` (fields: `roomId`, `missionName`, `progress`, `feedbackAt`, `questions: QuestionFeedbackResultDto[]`).
   - Define a union type `PlayerRoomFeedbackDto = AnalyticsFeedbackDto | ScienceBattleFeedbackDto` (or make feedback handling generic).
   - Ensure `AdminNotification` accommodates notifications arriving from both Room of Analytics and Room of Science Battle.

2. **Update WebSocket Client (`src/entities/notification/api/websocket.ts`):**
   - **Admin WebSocket (`connectWebSocket`):**
     - Modify subscription setup to subscribe to both `/topic/analytics/submissions` and `/topic/sciencebattle/submissions`.
     - Track both subscriptions and ensure clean unsubscription in `disconnectWebSocket()`.
   - **Player Feedback WebSocket (`connectPlayerFeedbackWs`):**
     - Extend `connectPlayerFeedbackWs` or introduce `connectScienceBattleFeedbackWs(token, missionName, onFeedback)` to subscribe to the Science Battle feedback topic: `/topic/sciencebattle/feedback${missionName}/feedback` (or configurable topic path).
     - Ensure disconnect methods clean up player subscriptions properly.

---

#### Phase 2: API Client Services (`src/services/api.ts` and `src/pages/room-of-sciencebattle/api.ts`)

1. **Update Admin API (`src/services/api.ts`):**
   - Add `submitScienceBattleFeedback: (request: SubmissionFeedbackDto) => fetchApi<string>('/api/admin/submission/sciencebattle', { method: 'POST', body: JSON.stringify(request) })`.
   - Align `adminApi.submitFeedback` or expose dedicated endpoints for both room types.

2. **Update Proceed API (`src/services/api.ts`):**
   - Fix the endpoint URL typo in `proceedApi.toScienceBattleRoom`: change `/api/game/proceed/scienebattle` to `/api/game/proceed/sciencebattle`.

3. **Define Room of Science Battle API (`src/services/api.ts` or `src/pages/room-of-sciencebattle/api.ts`):**
   - Add `roomOfScienceBattleApi`:
     - `submit: (request: ScienceBattleSubmissionDto) => fetchApi<ScienceBattleSubmissionResponseDto>('/api/rooms/roomofsciencebattle/submit', { method: 'POST', body: JSON.stringify(request) })`
     - `getResults: (roomId: number, missionId: number) => fetchApi<ResultDto>(`/api/rooms/roomofsciencebattle/results?roomId=${roomId}&missionId=${missionId}`)`
   - Add TypeScript interfaces: `ScienceBattleSubmissionDto`, `ScienceBattleSubmissionResponseDto`, `ScienceBattleFeedbackDto`.

---

#### Phase 3: Admin Dashboard Integration (`src/pages/admin-dashboard`)

1. **Dynamic Feedback Submission (`src/pages/admin-dashboard/admin-dashboard.tsx`):**
   - In `handleSubmitFeedback`, inspect the submission `roomId` or room name:
     - If `roomId === 3` (Analytics), call `adminApi.submitFeedback` (`/api/admin/submission/analytics`).
     - If `roomId === 4` (Science Battle), call `adminApi.submitScienceBattleFeedback` (`/api/admin/submission/sciencebattle`).
2. **Submissions Panel UI (`submission-panel.tsx`):**
   - Update labels and UI badges to clearly distinguish between Analytics and Science Battle submissions.

---

#### Phase 4: Room of Science Battle Implementation (`src/pages/room-of-sciencebattle`)

1. **State Management & Custom Hook (`useRoomOfScienceBattle.ts`):**
   - Create `useRoomOfScienceBattle` mirroring the robust architecture in `useRoomOfAnalytics`:
     - **Data Hydration:** Read room data from `sessionStorage.getItem('roomOfScienceBattleData')` with fallback to static mission data.
     - **Timer Integration:** Synchronize remaining room time using `roomTimeApi.getHowMuchTimeDoWeHave(roomId)`.
     - **Session Persistence:** Save/restore form inputs (LoE selections, justification, comparison notes), `lockedFields`, and `isWaitingForFeedback` in `sessionStorage`.
     - **Answer Submission:** Send answers via `roomOfScienceBattleApi.submit`. Handle the initial response (e.g. `levelOfEvidenceApproved`, partial progress).
     - **WebSocket Feedback Listener:** When waiting for admin feedback, connect to the Science Battle feedback WebSocket topic.
     - **Feedback Processing:** On receiving `ScienceBattleFeedbackDto`, lock approved questions, clear rejected fields for retry, and update progress.
     - **Completion & Results:** When progress hits 100%, call `roomOfScienceBattleApi.getResults(roomId, missionId)` to retrieve the completion key (`key`), mark room complete, and disconnect WebSocket.

2. **UI & Component Updates (`room-of-sciencebattle.tsx`):**
   - Replace purely client-side validation logic in `handleSubmit` with the API submission & feedback flow.
   - Add a `FeedbackOverlay` / waiting state banner informing the user that their submission is under review by the admin.
   - Disable/lock inputs for approved answers while allowing re-editing of rejected or pending answers.
   - Integrate `ResultsScreen` with backend key retrieval and the `onProceedToFinalStage` trigger.

3. **Room Transition from Analytics to Science Battle:**
   - In `room-of-analytics`, ensure `onProceedToRoom4` triggers `proceedApi.toScienceBattleRoom({ roomId: 3 })`, stores the response in `sessionStorage.setItem('roomOfScienceBattleData', JSON.stringify(data))`, and sets `activeRoomId` to `4`.

---

#### Phase 5: Verification and End-to-End Testing

1. **Type & Build Verification:** Run TypeScript checks (`tsc --noEmit`) and project build to ensure complete type safety across all modified DTOs and API clients.
2. **Flow Verification:**
   - Advance from Room of Abstracts -> Room of Analytics -> Room of Science Battle.
   - Submit answers in Science Battle and verify admin receives the notification via `/topic/sciencebattle/submissions`.
   - Admin approves/rejects questions via `/api/admin/submission/sciencebattle`.
   - Player receives feedback via WebSocket and updates UI state dynamically.
   - Unlock key retrieved from `/api/rooms/roomofsciencebattle/results` and transition to Final Stage.