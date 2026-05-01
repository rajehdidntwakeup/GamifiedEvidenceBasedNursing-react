import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

import { useNotification } from '@/entities/notification'

interface NotificationBellProps {
  onClick: () => void
  alertCount?: number
}

export function NotificationBell({ onClick, alertCount = 0 }: NotificationBellProps) {
  const { state } = useNotification()
  const totalCount = state.unreadCount + alertCount

  return (
    <button
      onClick={onClick}
      className='relative p-2 text-gray-400 hover:text-teal-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors'
      title='Notifications'
    >
      <Bell className='w-4 h-4' />
      <AnimatePresence>
        {totalCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className='absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center animate-pulse'
          >
            {totalCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
