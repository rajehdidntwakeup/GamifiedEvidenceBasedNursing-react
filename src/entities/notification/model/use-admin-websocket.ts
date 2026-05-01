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
