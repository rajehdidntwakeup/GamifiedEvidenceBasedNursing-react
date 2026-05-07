import { useState, useEffect, useCallback } from 'react'
import { connectPlayerFeedbackWs, disconnectPlayerFeedbackWs } from '@/entities/notification'
import type { AnalyticsFeedbackDto } from '@/entities/notification'
import { roomTimeApi, roomOfAnalyticsApi } from '@/services/api'
import { TOTAL_TIME, LOE_OPTIONS } from '../room-of-analytics.data'
import type { Mission } from '@/shared/types/mission'

interface StoredRoomOfAnalyticsData {
  roomId: number
  missionId: number
  mainQuestion: string
  docs: string[]
  questions: { questionId: number; question: string; answers: string[] }[]
}

function loadStoredData(): StoredRoomOfAnalyticsData | null {
  try {
    const raw = sessionStorage.getItem('roomOfAnalyticsData')
    if (!raw) return null
    return JSON.parse(raw) as StoredRoomOfAnalyticsData
  } catch {
    return null
  }
}

interface LockedFields {
  methodology: boolean
  results: boolean
  loe: boolean
  strengths: boolean
  weakness: boolean
}

interface RetryFeedback {
  methodologyOk: boolean
  resultsOk: boolean
  loeCorrect: boolean
  strengthsOk: boolean
  weaknessOk: boolean
}

interface ResultsState {
  methodologyOk: boolean
  resultsOk: boolean
  loeCorrect: boolean
  strengthsOk: boolean
  weaknessOk: boolean
  overallScore: number
  overallTotal: number
}

export function useRoomOfAnalytics(mission: Mission, userToken?: string) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [timeExpired, setTimeExpired] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isWaitingForFeedback, setIsWaitingForFeedback] = useState(
    () => sessionStorage.getItem('analyticsWaitingForFeedback') === 'true',
  )

  const [methodologyText, setMethodologyText] = useState(
    () => sessionStorage.getItem('analyticsMethodologyText') || '',
  )
  const [resultsText, setResultsText] = useState(
    () => sessionStorage.getItem('analyticsResultsText') || '',
  )
  const [selectedLoe, setSelectedLoe] = useState(
    () => sessionStorage.getItem('analyticsSelectedLoe') || '',
  )
  const [strengthsText, setStrengthsText] = useState(
    () => sessionStorage.getItem('analyticsStrengthsText') || '',
  )
  const [weaknessText, setWeaknessText] = useState(
    () => sessionStorage.getItem('analyticsWeaknessText') || '',
  )

  const [lockedFields, setLockedFields] = useState<LockedFields>(() => {
    try {
      const raw = sessionStorage.getItem('analyticsLockedFields')
      if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return {
      methodology: false,
      results: false,
      loe: false,
      strengths: false,
      weakness: false,
    }
  })

  const [retryFeedback, setRetryFeedback] = useState<RetryFeedback | null>(() => {
    try {
      const raw = sessionStorage.getItem('analyticsRetryFeedback')
      if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return null
  })

  const [results, setResults] = useState<ResultsState | null>(null)
  const [backendKey, setBackendKey] = useState<string | null>(null)
  const [previousKeys, setPreviousKeys] = useState<string[]>([])
  const [roomData] = useState<StoredRoomOfAnalyticsData | null>(() => loadStoredData())

  const roomId = roomData?.roomId ?? (Number(sessionStorage.getItem('activeRoomId')) || 3)
  const missionId = roomData?.missionId ?? mission.id
  const missionName = mission.title

  const checkResults = useCallback(() => {
    roomOfAnalyticsApi
      .getResults(roomId, missionId)
      .then((result) => {
        if (result.progress === 100 && result.key) {
          setBackendKey(result.key)
          sessionStorage.setItem('roomOfAnalyticsKey', result.key)
          setResults({
            methodologyOk: true,
            resultsOk: true,
            loeCorrect: true,
            strengthsOk: true,
            weaknessOk: true,
            overallScore: 5,
            overallTotal: 5,
          })
          setIsWaitingForFeedback(false)
          setIsComplete(true)
          disconnectPlayerFeedbackWs()
        }
      })
      .catch((err) => console.error('[AnalyticsResults] error:', err))
  }, [roomId, missionId])

  const handleFeedbackReceived = useCallback((feedback: AnalyticsFeedbackDto) => {
    setProgress(feedback.progress ?? 0)
    const questionMap = new Map(feedback.questions.map((q) => [q.questionId, q.approved]))
    const questions = roomData?.questions ?? []

    const findQId = (kw: string[]) => {
      const kws = kw.map((s) => s.toLowerCase())
      return questions.find((q) => kws.some((k) => q.question.toLowerCase().includes(k)))
        ?.questionId
    }

    const methodologyQId = findQId(['methodology'])
    const resultsQId = findQId(['result'])
    const loeQId = findQId(['level of evidence'])
    const strengthsQId = findQId(['strength'])
    const weaknessQId = findQId(['weakness'])

    const methodologyOk = methodologyQId !== undefined ? (questionMap.get(methodologyQId) ?? false) : null
    const resultsOk = resultsQId !== undefined ? (questionMap.get(resultsQId) ?? false) : null
    const loeCorrect = loeQId !== undefined ? (questionMap.get(loeQId) ?? false) : null
    const strengthsOk = strengthsQId !== undefined ? (questionMap.get(strengthsQId) ?? false) : null
    const weaknessOk = weaknessQId !== undefined ? (questionMap.get(weaknessQId) ?? false) : null

    setLockedFields((prev) => {
      const next = {
        methodology: (methodologyOk !== null ? methodologyOk : prev.methodology) || prev.methodology,
        results: (resultsOk !== null ? resultsOk : prev.results) || prev.results,
        loe: (loeCorrect !== null ? loeCorrect : prev.loe) || prev.loe,
        strengths: (strengthsOk !== null ? strengthsOk : prev.strengths) || prev.strengths,
        weakness: (weaknessOk !== null ? weaknessOk : prev.weakness) || prev.weakness,
      }
      sessionStorage.setItem('analyticsLockedFields', JSON.stringify(next))
      return next
    })

    setRetryFeedback((prev) => {
      const next = {
        methodologyOk: (methodologyOk !== null ? methodologyOk : prev?.methodologyOk) || prev?.methodologyOk || false,
        resultsOk: (resultsOk !== null ? resultsOk : prev?.resultsOk) || prev?.resultsOk || false,
        loeCorrect: (loeCorrect !== null ? loeCorrect : prev?.loeCorrect) || prev?.loeCorrect || false,
        strengthsOk: (strengthsOk !== null ? strengthsOk : prev?.strengthsOk) || prev?.strengthsOk || false,
        weaknessOk: (weaknessOk !== null ? weaknessOk : prev?.weaknessOk) || prev?.weaknessOk || false,
      }
      sessionStorage.setItem('analyticsRetryFeedback', JSON.stringify(next))
      return next
    })

    if (methodologyOk === false && !lockedFields.methodology) setMethodologyText('')
    if (resultsOk === false && !lockedFields.results) setResultsText('')
    if (loeCorrect === false && !lockedFields.loe) setSelectedLoe('')
    if (strengthsOk === false && !lockedFields.strengths) setStrengthsText('')
    if (weaknessOk === false && !lockedFields.weakness) setWeaknessText('')

    setIsWaitingForFeedback(false)
    disconnectPlayerFeedbackWs()
    checkResults()
  }, [roomData, lockedFields, checkResults])

  useEffect(() => {
    if (isWaitingForFeedback) {
      sessionStorage.setItem('analyticsWaitingForFeedback', 'true')
    } else {
      sessionStorage.removeItem('analyticsWaitingForFeedback')
    }
  }, [isWaitingForFeedback])

  useEffect(() => {
    sessionStorage.setItem('analyticsLockedFields', JSON.stringify(lockedFields))
  }, [lockedFields])

  useEffect(() => {
    if (retryFeedback) {
      sessionStorage.setItem('analyticsRetryFeedback', JSON.stringify(retryFeedback))
    } else {
      sessionStorage.removeItem('analyticsRetryFeedback')
    }
  }, [retryFeedback])

  useEffect(() => {
    sessionStorage.setItem('analyticsMethodologyText', methodologyText)
    sessionStorage.setItem('analyticsResultsText', resultsText)
    sessionStorage.setItem('analyticsSelectedLoe', selectedLoe)
    sessionStorage.setItem('analyticsStrengthsText', strengthsText)
    sessionStorage.setItem('analyticsWeaknessText', weaknessText)
  }, [methodologyText, resultsText, selectedLoe, strengthsText, weaknessText])

  useEffect(() => {
    if (!isWaitingForFeedback) return
    connectPlayerFeedbackWs(userToken, missionName, handleFeedbackReceived)
    return () => disconnectPlayerFeedbackWs()
  }, [isWaitingForFeedback, userToken, missionName, handleFeedbackReceived])

  useEffect(() => {
    const keys: string[] = []
    const k1 = sessionStorage.getItem('roomOfKnowledgeKey')
    if (k1) keys.push(k1)
    const k2 = sessionStorage.getItem('roomOfAbstractsKey')
    if (k2) keys.push(k2)
    setPreviousKeys(keys)
  }, [])

  useEffect(() => {
    if (isComplete || timeExpired) return

    roomTimeApi
      .getHowMuchTimeDoWeHave(roomId)
      .then((serverTime) => {
        const serverTimeInSeconds = serverTime.minutes * 60 + serverTime.seconds
        if (serverTimeInSeconds > 0) {
          setTimeLeft(serverTimeInSeconds)
        }
      })
      .catch((error) => console.error('Failed to fetch server time:', error))

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setTimeExpired(true)
          setIsComplete(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isComplete, timeExpired, roomId])

  const handleSubmit = () => {
    setIsWaitingForFeedback(true)
    setRetryFeedback(null)

    const questions = roomData?.questions ?? []
    const findQId = (kw: string[]) => {
      const kws = kw.map((s) => s.toLowerCase())
      return questions.find((q) => kws.some((k) => q.question.toLowerCase().includes(k)))?.questionId ?? 0
    }

    const openQuestions = [
      { questionId: findQId(['methodology']), answer: methodologyText },
      { questionId: findQId(['result']), answer: resultsText },
      { questionId: findQId(['strength']), answer: strengthsText },
      { questionId: findQId(['weakness']), answer: weaknessText },
    ].filter((q) => q.questionId !== 0 && q.answer.trim() !== '')

    const loeQuestion = questions.find((q) => q.question.toLowerCase().includes('level of evidence'))
    const loeQuestionId = loeQuestion?.questionId || 0
    const loeOption = LOE_OPTIONS.find((o) => o.value === selectedLoe)
    const loeAnswer = loeOption?.label || selectedLoe

    const openQuestionsWithoutLoe = openQuestions.filter((q) => q.questionId !== loeQuestionId)

    if (openQuestionsWithoutLoe.length > 0 || (!lockedFields.loe && loeAnswer)) {
      roomOfAnalyticsApi
        .submit({
          roomId,
          openQuestions: openQuestionsWithoutLoe,
          ...(lockedFields.loe
            ? {}
            : {
                levelofEvidenceQuestionId: loeQuestionId,
                levelofEvidencAnswer: loeAnswer,
              }),
        })
        .then((response) => {
          setProgress(response.progress)
          checkResults()

          const allOpenApproved =
            lockedFields.methodology &&
            lockedFields.results &&
            lockedFields.strengths &&
            lockedFields.weakness

          const nextRetry = {
            methodologyOk: lockedFields.methodology,
            resultsOk: lockedFields.results,
            loeCorrect: response.levelOfEvidenceApproved,
            strengthsOk: lockedFields.strengths,
            weaknessOk: lockedFields.weakness,
          }

          if (response.levelOfEvidenceApproved) {
            setLockedFields((prev) => {
              const next = { ...prev, loe: true }
              sessionStorage.setItem('analyticsLockedFields', JSON.stringify(next))
              return next
            })
          }

          if (allOpenApproved && !response.levelOfEvidenceApproved) {
            setRetryFeedback(nextRetry)
            sessionStorage.setItem('analyticsRetryFeedback', JSON.stringify(nextRetry))
            setIsWaitingForFeedback(false)
            return
          }
          if (!allOpenApproved) {
            setRetryFeedback(nextRetry)
            sessionStorage.setItem('analyticsRetryFeedback', JSON.stringify(nextRetry))
            connectPlayerFeedbackWs(userToken, missionName, handleFeedbackReceived)
          }
        })
        .catch((err) => console.error('[AnalyticsSubmit] error:', err))
    }
  }

  const handleRetry = () => {
    disconnectPlayerFeedbackWs()
    setTimeLeft(TOTAL_TIME)
    setTimeExpired(false)
    setIsComplete(false)
    setIsWaitingForFeedback(false)
    setProgress(0)
    setResults(null)
    setRetryFeedback(null)
    setBackendKey(null)
    setLockedFields({
      methodology: false,
      results: false,
      loe: false,
      strengths: false,
      weakness: false,
    })
    sessionStorage.removeItem('analyticsLockedFields')
    sessionStorage.removeItem('analyticsRetryFeedback')
    sessionStorage.removeItem('analyticsWaitingForFeedback')
    sessionStorage.removeItem('analyticsMethodologyText')
    sessionStorage.removeItem('analyticsResultsText')
    sessionStorage.removeItem('analyticsSelectedLoe')
    sessionStorage.removeItem('analyticsStrengthsText')
    sessionStorage.removeItem('analyticsWeaknessText')
    sessionStorage.removeItem('roomOfAnalyticsKey')
    sessionStorage.removeItem('roomOfAnalyticsData')
    setMethodologyText('')
    setResultsText('')
    setSelectedLoe('')
    setStrengthsText('')
    setWeaknessText('')
  }

  return {
    timeLeft,
    timeExpired,
    isComplete,
    progress,
    isWaitingForFeedback,
    methodologyText,
    setMethodologyText,
    resultsText,
    setResultsText,
    selectedLoe,
    setSelectedLoe,
    strengthsText,
    setStrengthsText,
    weaknessText,
    setWeaknessText,
    lockedFields,
    retryFeedback,
    results,
    backendKey,
    previousKeys,
    roomData,
    roomId,
    missionId,
    handleSubmit,
    handleRetry,
  }
}
