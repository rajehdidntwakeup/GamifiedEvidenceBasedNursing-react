import {
  ArrowLeft,
  Shield,
  Users,
  Trophy,
  Activity,
  Eye,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Search,
  Crown,
  LogOut,
  Bell,
  Timer,
  AlertTriangle,
  Clock,
  Plus,
  Check,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect, useCallback, useRef } from 'react'
import React from 'react'

import { gameApi, type GameResponseDto } from '@/services/api'

import {
  MOCK_ACTIVE_TEAMS,
  MOCK_PAST_GAMES,
  ROOMS,
  formatTime,
  getTimeColor,
} from './admin-dashboard.data'
import type { ActiveTeam, SortDir, SortField, Tab, TimeoutAlert } from './admin-dashboard.data'

interface AdminDashboardProps {
  onBack?: () => void
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('monitor')
  const [activeTeams, setActiveTeams] = useState<ActiveTeam[]>(MOCK_ACTIVE_TEAMS)
  const [expandedGame, setExpandedGame] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [lastRefreshed, setLastRefreshed] = useState(new Date())
  const [timeoutAlerts, setTimeoutAlerts] = useState<TimeoutAlert[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [extendModalTeam, setExtendModalTeam] = useState<ActiveTeam | null>(null)
  const [showNewGameModal, setShowNewGameModal] = useState(false)
  const [isCreatingGame, setIsCreatingGame] = useState(false)
  const [createGameError, setCreateGameError] = useState<string | null>(null)
  const [createGameResponse, setCreateGameResponse] = useState<GameResponseDto | null>(null)
  const alertedTeamsRef = useRef<Set<string>>(new Set())

  // Countdown timer — ticks every second
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTeams((prev) =>
        prev.map((team) => {
          // Skip completed or already timed-out teams
          if (team.currentRoom >= 6 || team.timedOut) return team
          const newTime = team.timeRemaining - 1
          if (newTime <= 0) {
            // Fire timeout alert if not already alerted
            if (!alertedTeamsRef.current.has(team.id)) {
              alertedTeamsRef.current.add(team.id)
              const roomInfo = ROOMS[team.currentRoom] || ROOMS[0]
              setTimeoutAlerts((prev) => [
                {
                  id: `alert-${team.id}-${Date.now()}`,
                  teamId: team.id,
                  teamName: team.name,
                  roomName: roomInfo.name,
                  timestamp: new Date(),
                  dismissed: false,
                },
                ...prev,
              ])
              setShowNotifications(true)
            }
            return { ...team, timeRemaining: 0, timedOut: true }
          }
          return { ...team, timeRemaining: newTime }
        }),
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate occasional room advancement for non-timed-out teams
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTeams((prev) =>
        prev.map((team) => {
          if (team.timedOut || team.currentRoom >= 6) return team
          if (Math.random() < 0.1) {
            return {
              ...team,
              currentRoom: team.currentRoom + 1,
              score: team.score + Math.floor(Math.random() * 300 + 200),
            }
          }
          return team
        }),
      )
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleExtendTime = useCallback((teamId: string, minutes: number) => {
    setActiveTeams((prev) =>
      prev.map((team) => {
        if (team.id !== teamId) return team
        // Clear the alerted flag so it can re-alert if it times out again
        alertedTeamsRef.current.delete(teamId)
        return {
          ...team,
          timeRemaining: team.timeRemaining + minutes * 60,
          timedOut: false,
        }
      }),
    )
    // Dismiss corresponding alerts
    setTimeoutAlerts((prev) =>
      prev.map((a) => (a.teamId === teamId ? { ...a, dismissed: true } : a)),
    )
    setExtendModalTeam(null)
  }, [])

  const dismissAlert = useCallback((alertId: string) => {
    setTimeoutAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a)))
  }, [])

  const handleRefresh = () => {
    setLastRefreshed(new Date())
    setActiveTeams(MOCK_ACTIVE_TEAMS)
    setTimeoutAlerts([])
    alertedTeamsRef.current.clear()
  }

  const handleCloseNewGameModal = () => {
    if (isCreatingGame) return
    setShowNewGameModal(false)
    setCreateGameError(null)
    setCreateGameResponse(null)
  }

  const handleCreateGame = async () => {
    setIsCreatingGame(true)
    setCreateGameError(null)
    setCreateGameResponse(null)

    try {
      const response = await gameApi.create()
      localStorage.setItem('activeGameId', String(response.gameId))
      setCreateGameResponse(response)
      setLastRefreshed(new Date())
      setShowNewGameModal(true)
    } catch (error) {
      setCreateGameError(error instanceof Error ? error.message : 'Failed to create game.')
      setShowNewGameModal(true)
    } finally {
      setIsCreatingGame(false)
    }
  }

  const getRoomInfo = (roomId: number) => ROOMS[roomId] || ROOMS[0]

  const roomCounts = ROOMS.map((room) => ({
    ...room,
    count: activeTeams.filter((t) => t.currentRoom === room.id).length,
  }))

  const filteredGames = MOCK_PAST_GAMES.filter(
    (g) =>
      g.winnerTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.mission.toLowerCase().includes(searchQuery.toLowerCase()),
  ).sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    switch (sortField) {
      case 'date':
        return dir * a.date.localeCompare(b.date)
      case 'mission':
        return dir * a.mission.localeCompare(b.mission)
      case 'winner':
        return dir * a.winnerTeam.localeCompare(b.winnerTeam)
      case 'teams':
        return dir * (a.totalTeams - b.totalTeams)
      case 'time':
        return dir * a.winnerTime.localeCompare(b.winnerTime)
      case 'score':
        return dir * (a.winnerScore - b.winnerScore)
      default:
        return 0
    }
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDir === 'asc' ? (
      <ChevronUp className='w-3 h-3' />
    ) : (
      <ChevronDown className='w-3 h-3' />
    )
  }

  const totalActiveTeams = activeTeams.length
  const teamsInProgress = activeTeams.filter(
    (t) => t.currentRoom > 0 && t.currentRoom < 6 && !t.timedOut,
  ).length
  const teamsCompleted = activeTeams.filter((t) => t.currentRoom === 6).length
  const teamsTimedOut = activeTeams.filter((t) => t.timedOut).length
  const activeAlerts = timeoutAlerts.filter((a) => !a.dismissed)

  return (
    <div className='fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto font-[Inter,sans-serif]'>
      {/* Grid overlay */}
      <div
        className='absolute inset-0 z-0 opacity-5'
        style={{
          backgroundImage:
            'linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className='relative z-10 flex flex-col h-full'>
        {/* Top Bar */}
        <div className='px-6 md:px-10 py-4 border-b border-white/10 bg-[#0a1f22]/80 backdrop-blur-sm'>
          <div className='flex items-center justify-between max-w-7xl mx-auto'>
            <div className='flex items-center gap-4'>
              <button
                onClick={onBack}
                className='flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors'
                disabled={!onBack}
              >
                <ArrowLeft className='w-5 h-5' />
              </button>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center'>
                  <Shield className='w-5 h-5 text-white' />
                </div>
                <div>
                  <h1 className='text-white text-lg tracking-tight'>Admin Dashboard</h1>
                  <p className='text-teal-400 font-[JetBrains_Mono,monospace] text-[10px] tracking-wider'>
                    MISSION CONTROL CENTER
                  </p>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <span className='hidden md:inline text-gray-500 text-xs font-[JetBrains_Mono,monospace]'>
                Last updated: {lastRefreshed.toLocaleTimeString()}
              </span>

              {/* Notification bell */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className='relative p-2 text-gray-400 hover:text-teal-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors'
                title='Timeout alerts'
              >
                <Bell className='w-4 h-4' />
                {activeAlerts.length > 0 && (
                  <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-pulse'>
                    {activeAlerts.length}
                  </span>
                )}
              </button>

              <button
                onClick={handleRefresh}
                className='p-2 text-gray-400 hover:text-teal-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors'
                title='Refresh data'
              >
                <RefreshCcw className='w-4 h-4' />
              </button>
              <button
                onClick={handleCreateGame}
                disabled={isCreatingGame}
                className='flex items-center gap-2 px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 rounded-lg transition-colors disabled:opacity-50'
                title='Create a new game'
              >
                {isCreatingGame ? (
                  <span className='w-4 h-4 border-2 border-teal-500/30 border-t-teal-300 rounded-full animate-spin' />
                ) : (
                  <Plus className='w-4 h-4' />
                )}
                <span className='hidden sm:inline text-sm'>
                  {isCreatingGame ? 'Creating...' : 'New Game'}
                </span>
              </button>
              <button
                onClick={onBack}
                className='flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors'
              >
                <LogOut className='w-4 h-4' />
                <span className='hidden sm:inline text-sm'>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* ═══ TIMEOUT ALERT BANNER — slides in from top ═══ */}
        <AnimatePresence>
          {activeAlerts.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className='overflow-hidden border-b border-red-500/20'
            >
              <div className='bg-red-500/10 px-6 md:px-10 py-3 space-y-2'>
                {activeAlerts.map((alert) => {
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className='flex flex-col sm:flex-row sm:items-center gap-3 max-w-7xl mx-auto'
                    >
                      <div className='flex items-center gap-3 flex-1 min-w-0'>
                        <div className='w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0'>
                          <AlertTriangle className='w-4 h-4 text-red-400' />
                        </div>
                        <div className='min-w-0'>
                          <p className='text-red-300 text-sm truncate'>
                            <span className='text-white'>{alert.teamName}</span> ran out of time in{' '}
                            <span className='text-red-200'>{alert.roomName}</span>
                          </p>
                          <p className='text-red-400/60 text-[10px] font-[JetBrains_Mono,monospace]'>
                            {alert.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2 shrink-0 pl-11 sm:pl-0'>
                        {[10, 15, 30].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => handleExtendTime(alert.teamId, mins)}
                            className='flex items-center gap-1 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 rounded-lg text-xs transition-colors'
                          >
                            <Plus className='w-3 h-3' />
                            {mins} min
                          </button>
                        ))}
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className='p-1.5 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors'
                          title='Dismiss'
                        >
                          <X className='w-3.5 h-3.5' />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ NOTIFICATION PANEL (dropdown) ═══ */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='absolute top-16 right-6 md:right-10 z-50 w-[360px] max-h-[400px] overflow-y-auto bg-[#0f2a2e] border border-white/10 rounded-2xl shadow-2xl'
            >
              <div className='px-4 py-3 border-b border-white/10 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Bell className='w-4 h-4 text-teal-400' />
                  <span className='text-white text-sm'>Timeout Alerts</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className='text-gray-500 hover:text-white'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
              {timeoutAlerts.length === 0 ? (
                <div className='px-4 py-8 text-center'>
                  <Clock className='w-8 h-8 text-gray-700 mx-auto mb-2' />
                  <p className='text-gray-500 text-sm'>No timeout alerts yet</p>
                </div>
              ) : (
                <div className='divide-y divide-white/5'>
                  {timeoutAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`px-4 py-3 ${alert.dismissed ? 'opacity-50' : ''}`}
                    >
                      <div className='flex items-start gap-3'>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            alert.dismissed ? 'bg-gray-500/10' : 'bg-red-500/20'
                          }`}
                        >
                          {alert.dismissed ? (
                            <Check className='w-3.5 h-3.5 text-green-400' />
                          ) : (
                            <AlertTriangle className='w-3.5 h-3.5 text-red-400' />
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm text-gray-300 truncate'>
                            <span className='text-white'>{alert.teamName}</span>
                          </p>
                          <p className='text-gray-500 text-xs'>Timed out in {alert.roomName}</p>
                          <p className='text-gray-600 text-[10px] font-[JetBrains_Mono,monospace] mt-1'>
                            {alert.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {!alert.dismissed && (
                          <button
                            onClick={() => {
                              const team = activeTeams.find((t) => t.id === alert.teamId)
                              if (team) setExtendModalTeam(team)
                            }}
                            className='px-2 py-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 rounded text-[10px] shrink-0'
                          >
                            Extend
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ EXTEND TIME MODAL ═══ */}
        <AnimatePresence>
          {extendModalTeam && (
            <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className='bg-[#0f2a2e] border border-orange-500/30 rounded-2xl p-6 w-full max-w-sm relative'
              >
                <button
                  onClick={() => setExtendModalTeam(null)}
                  className='absolute top-4 right-4 text-gray-500 hover:text-white'
                >
                  <X className='w-5 h-5' />
                </button>

                <div className='flex items-center gap-3 mb-5'>
                  <div className='w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center'>
                    <Timer className='w-5 h-5 text-orange-400' />
                  </div>
                  <div>
                    <h3 className='text-white'>Extend Time</h3>
                    <p className='text-orange-400 font-[JetBrains_Mono,monospace] text-[10px] tracking-wider'>
                      TIME OVERRIDE
                    </p>
                  </div>
                </div>

                <div className='bg-white/5 border border-white/10 rounded-xl p-4 mb-5'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='w-7 h-7 rounded-lg bg-teal-500/10 flex items-center justify-center'>
                      <span className='text-teal-400 text-xs font-[JetBrains_Mono,monospace]'>
                        {extendModalTeam.name.charAt(0)}
                      </span>
                    </div>
                    <span className='text-white text-sm'>{extendModalTeam.name}</span>
                  </div>
                  <div className='flex items-center gap-4 text-xs text-gray-500 pl-10'>
                    <span>{getRoomInfo(extendModalTeam.currentRoom).name}</span>
                    <span className='text-red-400 font-[JetBrains_Mono,monospace]'>
                      {extendModalTeam.timedOut
                        ? "TIME'S UP"
                        : formatTime(extendModalTeam.timeRemaining)}
                    </span>
                  </div>
                </div>

                <p className='text-gray-400 text-sm mb-4'>
                  Choose how much additional time to grant this team:
                </p>

                <div className='grid grid-cols-3 gap-3'>
                  {[
                    { mins: 10, label: '10 min', desc: 'Short' },
                    { mins: 15, label: '15 min', desc: 'Medium' },
                    { mins: 30, label: '30 min', desc: 'Extended' },
                  ].map((opt) => (
                    <button
                      key={opt.mins}
                      onClick={() => handleExtendTime(extendModalTeam.id, opt.mins)}
                      className='flex flex-col items-center gap-1 p-4 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 hover:border-orange-500/40 rounded-xl transition-all group'
                    >
                      <div className='flex items-center gap-1 text-orange-300 group-hover:text-orange-200'>
                        <Plus className='w-4 h-4' />
                        <span className='font-[JetBrains_Mono,monospace] text-lg'>{opt.mins}</span>
                      </div>
                      <span className='text-gray-500 text-[10px]'>minutes</span>
                      <span className='text-orange-400/50 text-[10px]'>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNewGameModal && (
            <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className='bg-[#0f2a2e] border border-teal-500/30 rounded-2xl p-6 w-full max-w-md relative'
              >
                <button
                  onClick={handleCloseNewGameModal}
                  disabled={isCreatingGame}
                  className='absolute top-4 right-4 text-gray-500 hover:text-white disabled:opacity-50'
                >
                  <X className='w-5 h-5' />
                </button>

                <div className='flex items-center gap-3 mb-5'>
                  <div className='w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center'>
                    <Plus className='w-5 h-5 text-teal-300' />
                  </div>
                  <div>
                    <h3 className='text-white'>New Game</h3>
                    <p className='text-teal-400 font-[JetBrains_Mono,monospace] text-[10px] tracking-wider'>
                      CREATE SESSION
                    </p>
                  </div>
                </div>

                <div className='space-y-4'>
                  {createGameError && (
                    <div className='px-3 py-2 bg-red-500/15 border border-red-500/30 rounded-lg text-red-300 text-sm'>
                      {createGameError}
                    </div>
                  )}

                  {createGameResponse && (
                    <div className='space-y-4'>
                      <div className='px-3 py-2 bg-green-500/15 border border-green-500/30 rounded-lg text-green-300 text-sm'>
                        Game #{createGameResponse.gameId} created successfully.
                      </div>

                      <div className='bg-white/5 border border-white/10 rounded-xl overflow-hidden'>
                        <div className='px-4 py-2 border-b border-white/10 bg-white/5'>
                          <span className='text-xs font-[JetBrains_Mono,monospace] text-gray-400'>
                            TEAM PASSWORDS
                          </span>
                        </div>
                        <div className='divide-y divide-white/5'>
                          {createGameResponse.teamPasswords.map((tp) => (
                            <div
                              key={tp.teamId}
                              className='px-4 py-3 flex items-center justify-between'
                            >
                              <div>
                                <p className='text-white text-sm'>{tp.mission}</p>
                                <p className='text-gray-500 text-[10px]'>Team ID: {tp.teamId}</p>
                              </div>
                              <code className='px-2 py-1 bg-teal-500/10 text-teal-400 rounded text-sm font-bold'>
                                {tp.password}
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className='text-gray-500 text-xs text-center'>
                        Share these passwords with the corresponding teams.
                      </p>
                    </div>
                  )}

                  <div className='flex items-center justify-end pt-2'>
                    <button
                      type='button'
                      onClick={handleCloseNewGameModal}
                      className='px-6 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-lg transition-colors'
                    >
                      Done
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className='flex-1 px-6 md:px-10 py-6 max-w-7xl mx-auto w-full'>
          {/* Stats bar */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
            {[
              {
                icon: Users,
                label: 'Active Teams',
                value: totalActiveTeams,
                color: 'text-teal-400',
                bg: 'bg-teal-500/10',
                border: 'border-teal-500/20',
              },
              {
                icon: Activity,
                label: 'In Progress',
                value: teamsInProgress,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20',
              },
              {
                icon: AlertTriangle,
                label: 'Timed Out',
                value: teamsTimedOut,
                color: 'text-red-400',
                bg: 'bg-red-500/10',
                border: 'border-red-500/20',
              },
              {
                icon: Trophy,
                label: 'Completed',
                value: teamsCompleted,
                color: 'text-green-400',
                bg: 'bg-green-500/10',
                border: 'border-green-500/20',
              },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${stat.bg} border ${stat.border} rounded-xl p-4`}
              >
                <div className='flex items-center gap-2 mb-2'>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className='text-gray-500 text-xs'>{stat.label}</span>
                </div>
                <span className={`${stat.color} text-2xl font-[JetBrains_Mono,monospace]`}>
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Tab bar */}
          <div className='flex items-center gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit'>
            <button
              onClick={() => setActiveTab('monitor')}
              className={`px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'monitor'
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className='w-4 h-4' />
              Live Monitor
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className='w-4 h-4' />
              Game History
            </button>
          </div>

          {/* ═══ LIVE MONITOR TAB ═══ */}
          {activeTab === 'monitor' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Room progress pipeline */}
              <div className='mb-8'>
                <h3 className='text-gray-400 text-xs font-[JetBrains_Mono,monospace] tracking-wider mb-4'>
                  ROOM PIPELINE
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {roomCounts.map((room) => (
                    <div
                      key={room.id}
                      className={`${room.bg} border ${room.border} rounded-xl px-4 py-3 flex items-center gap-3 min-w-[140px]`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${room.dot} ${room.count > 0 ? 'animate-pulse' : 'opacity-30'}`}
                      />
                      <div>
                        <span className='text-gray-400 text-xs block'>{room.short}</span>
                        <span className={`${room.color} text-lg font-[JetBrains_Mono,monospace]`}>
                          {room.count}
                        </span>
                        <span className='text-gray-600 text-xs ml-1'>
                          {room.count === 1 ? 'team' : 'teams'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teams table */}
              <div className='bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden'>
                <div className='px-6 py-4 border-b border-white/10 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Users className='w-4 h-4 text-teal-400' />
                    <h3 className='text-white text-sm'>Active Teams</h3>
                    <span className='text-gray-600 text-xs font-[JetBrains_Mono,monospace]'>
                      ({activeTeams.length})
                    </span>
                  </div>
                  <div className='flex items-center gap-1 text-gray-500 text-xs'>
                    <Activity className='w-3 h-3' />
                    <span>Live</span>
                    <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-1' />
                  </div>
                </div>

                {/* Desktop table */}
                <div className='hidden md:block overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-white/5'>
                        <th className='px-6 py-3 text-left text-gray-500 text-xs font-[JetBrains_Mono,monospace] tracking-wider'>
                          TEAM
                        </th>
                        <th className='px-6 py-3 text-left text-gray-500 text-xs font-[JetBrains_Mono,monospace] tracking-wider'>
                          CURRENT ROOM
                        </th>
                        <th className='px-6 py-3 text-left text-gray-500 text-xs font-[JetBrains_Mono,monospace] tracking-wider'>
                          PROGRESS
                        </th>
                        <th className='px-6 py-3 text-left text-gray-500 text-xs font-[JetBrains_Mono,monospace] tracking-wider'>
                          TIME LEFT
                        </th>
                        <th className='px-6 py-3 text-left text-gray-500 text-xs font-[JetBrains_Mono,monospace] tracking-wider'>
                          STARTED
                        </th>
                        <th className='px-6 py-3 text-right text-gray-500 text-xs font-[JetBrains_Mono,monospace] tracking-wider'>
                          SCORE
                        </th>
                        <th className='px-6 py-3 text-center text-gray-500 text-xs font-[JetBrains_Mono,monospace] tracking-wider'>
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTeams
                        .sort((a, b) => {
                          // Timed out first, then by room desc
                          if (a.timedOut !== b.timedOut) return a.timedOut ? -1 : 1
                          return b.currentRoom - a.currentRoom
                        })
                        .map((team) => {
                          const room = getRoomInfo(team.currentRoom)
                          const progress = Math.round((team.currentRoom / 6) * 100)
                          const timeColor = getTimeColor(team.timeRemaining, team.timedOut)
                          return (
                            <motion.tr
                              key={team.id}
                              layout
                              className={`border-b border-white/5 transition-colors ${
                                team.timedOut
                                  ? 'bg-red-500/[0.04] hover:bg-red-500/[0.08]'
                                  : 'hover:bg-white/[0.02]'
                              }`}
                            >
                              <td className='px-6 py-4'>
                                <div className='flex items-center gap-3'>
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                      team.timedOut ? 'bg-red-500/10' : 'bg-teal-500/10'
                                    }`}
                                  >
                                    <span
                                      className={`text-sm font-[JetBrains_Mono,monospace] ${
                                        team.timedOut ? 'text-red-400' : 'text-teal-400'
                                      }`}
                                    >
                                      {team.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className='text-white text-sm block'>{team.name}</span>
                                    <span className='text-gray-600 text-[10px]'>
                                      {team.membersCount} members
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className='px-6 py-4'>
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${room.bg} ${room.color} border ${room.border}`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${room.dot} ${team.currentRoom < 6 && !team.timedOut ? 'animate-pulse' : ''}`}
                                  />
                                  {room.name}
                                </span>
                              </td>
                              <td className='px-6 py-4'>
                                <div className='flex items-center gap-3'>
                                  <div className='w-24 h-2 bg-white/5 rounded-full overflow-hidden'>
                                    <motion.div
                                      className={`h-full rounded-full ${team.timedOut ? 'bg-red-500' : 'bg-teal-500'}`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${progress}%` }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  </div>
                                  <span className='text-gray-500 text-xs font-[JetBrains_Mono,monospace]'>
                                    {progress}%
                                  </span>
                                </div>
                              </td>
                              <td className='px-6 py-4'>
                                <div className='flex items-center gap-2'>
                                  <Timer
                                    className={`w-3.5 h-3.5 ${timeColor} ${team.timedOut ? 'animate-pulse' : ''}`}
                                  />
                                  <span
                                    className={`text-sm font-[JetBrains_Mono,monospace] ${timeColor} ${
                                      team.timedOut ? 'animate-pulse' : ''
                                    }`}
                                  >
                                    {team.timedOut ? "TIME'S UP" : formatTime(team.timeRemaining)}
                                  </span>
                                </div>
                              </td>
                              <td className='px-6 py-4'>
                                <span className='text-gray-400 text-sm font-[JetBrains_Mono,monospace]'>
                                  {team.startedAt}
                                </span>
                              </td>
                              <td className='px-6 py-4 text-right'>
                                <span className='text-teal-400 text-sm font-[JetBrains_Mono,monospace]'>
                                  {team.score.toLocaleString()}
                                </span>
                              </td>
                              <td className='px-6 py-4 text-center'>
                                <button
                                  onClick={() => setExtendModalTeam(team)}
                                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                                    team.timedOut
                                      ? 'bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300'
                                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white'
                                  }`}
                                >
                                  <Plus className='w-3 h-3' />
                                  Time
                                </button>
                              </td>
                            </motion.tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className='md:hidden divide-y divide-white/5'>
                  {activeTeams
                    .sort((a, b) => {
                      if (a.timedOut !== b.timedOut) return a.timedOut ? -1 : 1
                      return b.currentRoom - a.currentRoom
                    })
                    .map((team) => {
                      const room = getRoomInfo(team.currentRoom)
                      const progress = Math.round((team.currentRoom / 6) * 100)
                      const timeColor = getTimeColor(team.timeRemaining, team.timedOut)
                      return (
                        <div
                          key={team.id}
                          className={`px-5 py-4 ${team.timedOut ? 'bg-red-500/[0.04]' : ''}`}
                        >
                          <div className='flex items-center justify-between mb-3'>
                            <div className='flex items-center gap-2'>
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                  team.timedOut ? 'bg-red-500/10' : 'bg-teal-500/10'
                                }`}
                              >
                                <span
                                  className={`text-xs font-[JetBrains_Mono,monospace] ${
                                    team.timedOut ? 'text-red-400' : 'text-teal-400'
                                  }`}
                                >
                                  {team.name.charAt(0)}
                                </span>
                              </div>
                              <span className='text-white text-sm'>{team.name}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <Timer
                                className={`w-3 h-3 ${timeColor} ${team.timedOut ? 'animate-pulse' : ''}`}
                              />
                              <span
                                className={`text-xs font-[JetBrains_Mono,monospace] ${timeColor}`}
                              >
                                {team.timedOut ? "TIME'S UP" : formatTime(team.timeRemaining)}
                              </span>
                            </div>
                          </div>
                          <div className='flex items-center gap-2 mb-2'>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${room.bg} ${room.color} border ${room.border}`}
                            >
                              <span className={`w-1 h-1 rounded-full ${room.dot}`} />
                              {room.short}
                            </span>
                            <span className='text-gray-600 text-xs'>Started {team.startedAt}</span>
                            <span className='text-teal-400 text-xs font-[JetBrains_Mono,monospace] ml-auto'>
                              {team.score.toLocaleString()}
                            </span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <div className='flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden'>
                              <div
                                className={`h-full rounded-full transition-all ${team.timedOut ? 'bg-red-500' : 'bg-teal-500'}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className='text-gray-500 text-[10px] font-[JetBrains_Mono,monospace]'>
                              {progress}%
                            </span>
                            <button
                              onClick={() => setExtendModalTeam(team)}
                              className={`ml-1 px-2 py-1 rounded text-[10px] transition-colors ${
                                team.timedOut
                                  ? 'bg-orange-500/20 border border-orange-500/30 text-orange-300'
                                  : 'bg-white/5 border border-white/10 text-gray-400'
                              }`}
                            >
                              +Time
                            </button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ GAME HISTORY TAB ═══ */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search */}
              <div className='mb-6'>
                <div className='relative max-w-sm'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500' />
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Search by team or mission...'
                    className='w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-600 focus:border-teal-500/50 focus:outline-none'
                  />
                </div>
              </div>

              {/* History table */}
              <div className='bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden'>
                <div className='px-6 py-4 border-b border-white/10 flex items-center gap-2'>
                  <Trophy className='w-4 h-4 text-yellow-400' />
                  <h3 className='text-white text-sm'>Previous Games</h3>
                  <span className='text-gray-600 text-xs font-[JetBrains_Mono,monospace]'>
                    ({filteredGames.length})
                  </span>
                </div>

                {/* Desktop table */}
                <div className='hidden md:block overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-white/5'>
                        {[
                          { key: 'date' as SortField, label: 'DATE' },
                          { key: 'mission' as SortField, label: 'MISSION' },
                          { key: 'winner' as SortField, label: 'WINNER' },
                          { key: 'teams' as SortField, label: 'TEAMS' },
                          { key: 'time' as SortField, label: 'WIN TIME' },
                          { key: 'score' as SortField, label: 'SCORE' },
                        ].map((col) => (
                          <th
                            key={col.key}
                            onClick={() => handleSort(col.key)}
                            className='px-6 py-3 text-left text-gray-500 text-xs font-[JetBrains_Mono,monospace] tracking-wider cursor-pointer hover:text-teal-400 transition-colors select-none'
                          >
                            <span className='inline-flex items-center gap-1'>
                              {col.label}
                              <SortIcon field={col.key} />
                            </span>
                          </th>
                        ))}
                        <th className='px-6 py-3 w-10' />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGames.map((game) => (
                        <React.Fragment key={game.id}>
                          <tr
                            className='border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer'
                            onClick={() =>
                              setExpandedGame(expandedGame === game.id ? null : game.id)
                            }
                          >
                            <td className='px-6 py-4 text-gray-400 text-sm font-[JetBrains_Mono,monospace]'>
                              {new Date(game.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </td>
                            <td className='px-6 py-4 text-gray-300 text-sm'>{game.mission}</td>
                            <td className='px-6 py-4'>
                              <div className='flex items-center gap-2'>
                                <Crown className='w-4 h-4 text-yellow-400' />
                                <span className='text-white text-sm'>{game.winnerTeam}</span>
                              </div>
                            </td>
                            <td className='px-6 py-4 text-gray-400 text-sm font-[JetBrains_Mono,monospace]'>
                              {game.totalTeams}
                            </td>
                            <td className='px-6 py-4'>
                              <span className='text-teal-400 text-sm font-[JetBrains_Mono,monospace]'>
                                {game.winnerTime}
                              </span>
                            </td>
                            <td className='px-6 py-4'>
                              <span className='text-yellow-400 text-sm font-[JetBrains_Mono,monospace]'>
                                {game.winnerScore.toLocaleString()}
                              </span>
                            </td>
                            <td className='px-6 py-4'>
                              {expandedGame === game.id ? (
                                <ChevronUp className='w-4 h-4 text-gray-500' />
                              ) : (
                                <ChevronDown className='w-4 h-4 text-gray-500' />
                              )}
                            </td>
                          </tr>

                          <AnimatePresence>
                            {expandedGame === game.id && (
                              <motion.tr
                                key={`${game.id}-expanded`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <td colSpan={7} className='px-6 pb-4'>
                                  <div className='bg-white/[0.03] border border-white/5 rounded-xl p-4'>
                                    <p className='text-gray-500 text-xs font-[JetBrains_Mono,monospace] mb-3 tracking-wider'>
                                      ALL TEAMS — {game.mission}
                                    </p>
                                    <div className='space-y-2'>
                                      {game.allTeams.map((t, idx) => (
                                        <div key={t.name} className='flex items-center gap-4'>
                                          <span className='text-gray-600 text-xs font-[JetBrains_Mono,monospace] w-6'>
                                            #{idx + 1}
                                          </span>
                                          <div className='flex items-center gap-2 flex-1 min-w-0'>
                                            {idx === 0 && (
                                              <Crown className='w-3.5 h-3.5 text-yellow-400 shrink-0' />
                                            )}
                                            <span
                                              className={`text-sm truncate ${idx === 0 ? 'text-white' : 'text-gray-400'}`}
                                            >
                                              {t.name}
                                            </span>
                                          </div>
                                          <span className='text-teal-400 text-xs font-[JetBrains_Mono,monospace] w-16 text-right'>
                                            {t.score.toLocaleString()}
                                          </span>
                                          <span className='text-gray-500 text-xs font-[JetBrains_Mono,monospace] w-14 text-right'>
                                            {t.time}
                                          </span>
                                          <span
                                            className={`text-xs px-2 py-0.5 rounded-full w-20 text-center ${
                                              t.completed
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}
                                          >
                                            {t.completed ? 'Completed' : 'DNF'}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className='md:hidden divide-y divide-white/5'>
                  {filteredGames.map((game) => (
                    <div key={game.id}>
                      <button
                        className='w-full px-5 py-4 text-left'
                        onClick={() => setExpandedGame(expandedGame === game.id ? null : game.id)}
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-gray-500 text-xs font-[JetBrains_Mono,monospace]'>
                            {new Date(game.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          {expandedGame === game.id ? (
                            <ChevronUp className='w-4 h-4 text-gray-500' />
                          ) : (
                            <ChevronDown className='w-4 h-4 text-gray-500' />
                          )}
                        </div>
                        <p className='text-gray-300 text-sm mb-2'>{game.mission}</p>
                        <div className='flex items-center gap-2'>
                          <Crown className='w-3.5 h-3.5 text-yellow-400' />
                          <span className='text-white text-sm'>{game.winnerTeam}</span>
                          <span className='text-teal-400 text-xs font-[JetBrains_Mono,monospace] ml-auto'>
                            {game.winnerTime}
                          </span>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedGame === game.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className='overflow-hidden'
                          >
                            <div className='px-5 pb-4'>
                              <div className='bg-white/[0.03] border border-white/5 rounded-xl p-3 space-y-2'>
                                {game.allTeams.map((t, idx) => (
                                  <div key={t.name} className='flex items-center gap-2'>
                                    <span className='text-gray-600 text-[10px] font-[JetBrains_Mono,monospace] w-4'>
                                      {idx + 1}
                                    </span>
                                    {idx === 0 && (
                                      <Crown className='w-3 h-3 text-yellow-400 shrink-0' />
                                    )}
                                    <span
                                      className={`text-xs flex-1 truncate ${idx === 0 ? 'text-white' : 'text-gray-400'}`}
                                    >
                                      {t.name}
                                    </span>
                                    <span className='text-teal-400 text-[10px] font-[JetBrains_Mono,monospace]'>
                                      {t.score}
                                    </span>
                                    <span
                                      className={`text-[10px] ${t.completed ? 'text-green-400' : 'text-red-400'}`}
                                    >
                                      {t.completed ? '✓' : 'DNF'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {filteredGames.length === 0 && (
                  <div className='px-6 py-12 text-center'>
                    <Search className='w-8 h-8 text-gray-700 mx-auto mb-3' />
                    <p className='text-gray-500 text-sm'>
                      No games found matching <span className='text-white'>{searchQuery}</span>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
