import { Suspense, lazy } from "react";

// Lazy load room components for code splitting
const RoomOfKnowledge = lazy(() => import("@/pages/room-of-knowledge/room-of-knowledge"));
const RoomOfAbstracts = lazy(() => import("@/pages/room-of-abstracts/room-of-abstracts"));
const RoomOfAnalytics = lazy(() => import("@/pages/room-of-analytics/room-of-analytics"));
const RoomOfSciencebattle = lazy(() => import("@/pages/room-of-sciencebattle/room-of-sciencebattle"));
const FinalStage = lazy(() => import("@/pages/final-stage/final-stage"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard/admin-dashboard"));

interface RoomRouterProps {
  currentRoom: number;
  showAdmin: boolean;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0f2a2e] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading room...</p>
      </div>
    </div>
  );
}

export function RoomRouter({ currentRoom, showAdmin }: RoomRouterProps) {
  if (showAdmin) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AdminDashboard />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      {currentRoom === 1 && <RoomOfKnowledge />}
      {currentRoom === 2 && <RoomOfAbstracts />}
      {currentRoom === 3 && <RoomOfAnalytics />}
      {currentRoom === 4 && <RoomOfSciencebattle />}
      {currentRoom === 5 && <FinalStage />}
    </Suspense>
  );
}
