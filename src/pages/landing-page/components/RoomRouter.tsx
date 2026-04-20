import { Suspense, lazy } from 'react'

import { AdminDashboard } from '@/pages/admin-dashboard/admin-dashboard'
import type { Mission } from '@/shared/types/mission'

// Lazy load room components for code splitting
const RoomOfKnowledge = lazy(() =>
  import('@/pages/room-of-knowledge/room-of-knowledge').then((module) => ({
    default: module.RoomOfKnowledge,
  })),
)
const RoomOfAbstracts = lazy(() =>
  import('@/pages/room-of-abstracts/room-of-abstracts').then((module) => ({
    default: module.RoomOfAbstracts,
  })),
)
const RoomOfAnalytics = lazy(() =>
  import('@/pages/room-of-analytics/room-of-analytics').then((module) => ({
    default: module.RoomOfAnalytics,
  })),
)
const RoomOfSciencebattle = lazy(() =>
  import('@/pages/room-of-sciencebattle/room-of-sciencebattle').then((module) => ({
    default: module.RoomOfSciencebattle,
  })),
)
const FinalStage = lazy(() =>
  import('@/pages/final-stage/final-stage').then((module) => ({
    default: module.FinalStage,
  })),
)

interface RoomRouterProps {
  currentRoom: number
  showAdmin: boolean
  mission: Mission
  onBack: () => void
  onRoomChange: (room: number) => void
}

function LoadingScreen() {
  return (
    <div className='min-h-screen bg-[#0f2a2e] flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4' />
        <p className='text-gray-400'>Loading room...</p>
      </div>
    </div>
  )
}

export function RoomRouter({
  currentRoom,
  showAdmin,
  mission,
  onBack,
  onRoomChange,
}: RoomRouterProps) {
  if (showAdmin) {
    return <AdminDashboard onBack={onBack} />
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      {currentRoom === 1 && (
        <RoomOfKnowledge
          mission={mission}
          onBack={onBack}
          onProceedToRoom2={() => onRoomChange(2)}
        />
      )}
      {currentRoom === 2 && (
        <RoomOfAbstracts
          mission={mission}
          onBack={onBack}
          onProceedToRoom3={() => onRoomChange(3)}
        />
      )}
      {currentRoom === 3 && (
        <RoomOfAnalytics
          mission={mission}
          onBack={onBack}
          onProceedToRoom4={() => onRoomChange(4)}
        />
      )}
      {currentRoom === 4 && (
        <RoomOfSciencebattle
          mission={mission}
          onBack={onBack}
          onProceedToFinalStage={() => onRoomChange(5)}
        />
      )}
      {currentRoom === 5 && <FinalStage mission={mission} onBack={onBack} />}
    </Suspense>
  )
}
