import { useEffect } from 'react'

import { useSession } from '@/entities/session'

import { connectWebSocket, disconnectWebSocket } from '../api/websocket'

import { useNotification } from './notification-context'

export function useAdminWebSocket() {
  const { user } = useSession()
  const { dispatch } = useNotification()

  useEffect(() => {
    console.log('[AdminWebSocket] hook running - token:', !!user?.token, 'isAdmin:', user?.isAdmin)
    if (!user?.token || !user.isAdmin) {
      console.log('[AdminWebSocket] skipping connection (missing token or not admin)')
      return
    }

    console.log('[AdminWebSocket] starting connection...')
    connectWebSocket(user.token, (msg) => {
      console.log('[AdminWebSocket] dispatching ADD with:', msg)
      dispatch({ type: 'ADD', payload: msg })
    })

    return () => {
      console.log('[AdminWebSocket] cleanup disconnect')
      disconnectWebSocket()
    }
  }, [user?.token, user?.isAdmin, dispatch])
}
