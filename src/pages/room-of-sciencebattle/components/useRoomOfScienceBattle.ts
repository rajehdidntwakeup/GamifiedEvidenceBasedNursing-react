import { useState, useEffect, useCallback } from 'react'

import {
  connectScienceBattleFeedbackWs,
  disconnectScienceBattleFeedbackWs,
} from '@/entities/notification'
import type { ScienceBattleFeedbackDto } from '@/entities/notification'
import { roomTimeApi, roomOfScienceBattleApi } from '@/services/api'
import type { Mission } from '@/shared/types/mission'

import {
  TOTAL_TIME,
  LOE_OPTIONS,
} from '../room-of-sciencebattle.data'

interface StoredRoomOfScienceBattleData {
  roomId: number
  missionId: number
  mainQuestion: string
  docs: string[]
  questions: { questionId: number; question: string; answers: string[] }[]
}

function resolveScienceBattleQuestionIds(
  questions: { questionId: number; question: string }[] = [],
) {
  const findQId = (kw: string[], fallbackIdx: number) => {
    const kws = kw.map((s) => s.toLowerCase())
    const match = questions.find((q) => kws.some((k) => q.question.toLowerCase().includes(k)))
    return match?.questionId ?? questions[fallbackIdx]?.questionId ?? fallbackIdx + 1
  }

  return {
    loeAQId: findQId(
      ['level of evidence - study a', 'level of evidence a', 'loe - study a', 'loe a', 'study a'],
      0,
    ),
    loeBQId: findQId(
      ['level of evidence - study b', 'level of evidence b', 'loe - study b', 'loe b', 'study b'],
      1,
    ),
    betterStudyQId: findQId(
      ['which study provides the better evidence', 'better evidence', 'better study', 'which study', 'better', 'superior', 'choice', 'select'],
      2,
    ),
    justificationQId: findQId(
      ['explain why', 'justify', 'justification', 'rationale', 'why'],
      3,
    ),
    comparisonQId: findQId(
      ['methodological differences', 'methodological comparison', 'comparison', 'compare', 'notes', 'difference'],
      4,
    ),
    studyTitleQId: findQId(['study title', 'title'], 5),
    studyLinkQId: findQId(['link to study', 'link', 'url'], 6),
  }
}

function loadStoredData(): StoredRoomOfScienceBattleData | null {
  try {
    const raw = sessionStorage.getItem('roomOfScienceBattleData')
    if (!raw) return null
    return JSON.parse(raw) as StoredRoomOfScienceBattleData
  } catch {
    return null
  }
}

export interface LockedFields {
  loeA: boolean
  loeB: boolean
  betterStudy: boolean
  justification: boolean
  comparison: boolean
  studyBTitle: boolean
  studyBLink: boolean
}

export interface RetryFeedback {
  loeAOk: boolean
  loeBOk: boolean
  betterStudyOk: boolean
  justificationOk: boolean
  comparisonOk: boolean
  studyBTitleOk?: boolean
  studyBLinkOk?: boolean
}

export interface ResultsState {
  loeACorrect: boolean
  loeBCorrect: boolean
  betterStudyCorrect: boolean
  justificationOk: boolean
  comparisonOk: boolean
  overallScore: number
  overallTotal: number
}

export function useRoomOfScienceBattle(mission: Mission, userToken?: string) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [timeExpired, setTimeExpired] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isWaitingForFeedback, setIsWaitingForFeedback] = useState(
    () => sessionStorage.getItem('scienceBattleWaitingForFeedback') === 'true',
  )

  const [selectedLoEA, setSelectedLoEA] = useState(
    () => sessionStorage.getItem('scienceBattleSelectedLoEA') || '',
  )
  const [selectedLoEB, setSelectedLoEB] = useState(
    () => sessionStorage.getItem('scienceBattleSelectedLoEB') || '',
  )
  const [betterStudyChoice, setBetterStudyChoice] = useState<'A' | 'B' | ''>(
    () => (sessionStorage.getItem('scienceBattleBetterStudyChoice') as 'A' | 'B' | '') || '',
  )
  const [justificationText, setJustificationText] = useState(
    () => sessionStorage.getItem('scienceBattleJustificationText') || '',
  )
  const [comparisonNotes, setComparisonNotes] = useState(
    () => sessionStorage.getItem('scienceBattleComparisonNotes') || '',
  )
  const [studyBTitle, setStudyBTitle] = useState(
    () => sessionStorage.getItem('scienceBattleStudyBTitle') || '',
  )
  const [studyBLink, setStudyBLink] = useState(
    () => sessionStorage.getItem('scienceBattleStudyBLink') || '',
  )

  const [lockedFields, setLockedFields] = useState<LockedFields>(() => {
    try {
      const raw = sessionStorage.getItem('scienceBattleLockedFields')
      if (raw) return JSON.parse(raw)
    } catch {
      /* ignore */
    }
    return {
      loeA: false,
      loeB: false,
      betterStudy: false,
      justification: false,
      comparison: false,
      studyBTitle: false,
      studyBLink: false,
    }
  })

  const [retryFeedback, setRetryFeedback] = useState<RetryFeedback | null>(() => {
    try {
      const raw = sessionStorage.getItem('scienceBattleRetryFeedback')
      if (raw) return JSON.parse(raw)
    } catch {
      /* ignore */
    }
    return null
  })

  const [results, setResults] = useState<ResultsState | null>(null)
  const [backendKey, setBackendKey] = useState<string | null>(null)
  const [previousKeys, setPreviousKeys] = useState<string[]>([])
  const [roomData] = useState<StoredRoomOfScienceBattleData | null>(() => loadStoredData())

  const roomId = roomData?.roomId ?? (Number(sessionStorage.getItem('activeRoomId')) || 4)
  const missionId = roomData?.missionId ?? mission.id
  const missionName = mission.title
  const checkResults = useCallback(
    (currentLocks?: LockedFields, currentFeedback?: RetryFeedback | null) => {
      const activeLocks = currentLocks ?? lockedFields
      const activeFeedback = currentFeedback !== undefined ? currentFeedback : retryFeedback

      roomOfScienceBattleApi
        .getResults(roomId, missionId)
        .then((result) => {
          if (result.progress === 100 && result.key) {
            setBackendKey(result.key)
            sessionStorage.setItem('roomOfScienceBattleKey', result.key)
            const loeACorrect = activeFeedback?.loeAOk ?? activeLocks.loeA
            const loeBCorrect = activeFeedback?.loeBOk ?? activeLocks.loeB
            const betterStudyCorrect = activeFeedback?.betterStudyOk ?? activeLocks.betterStudy
            const justificationOk = activeFeedback?.justificationOk ?? activeLocks.justification
            const comparisonOk = activeFeedback?.comparisonOk ?? activeLocks.comparison
            const overallScore = [
              loeACorrect,
              loeBCorrect,
              betterStudyCorrect,
              justificationOk,
              comparisonOk,
            ].filter(Boolean).length

            setResults({
              loeACorrect,
              loeBCorrect,
              betterStudyCorrect,
              justificationOk,
              comparisonOk,
              overallScore,
              overallTotal: 5,
            })
            setIsWaitingForFeedback(false)
            setIsComplete(true)
            disconnectScienceBattleFeedbackWs()
          }
        })
        .catch((err) => {
          console.error('[ScienceBattleResults] error:', err)
          setIsWaitingForFeedback(false)
          alert('Failed to retrieve completion results. Please try submitting again or check your connection.')
        })
    },
    [roomId, missionId, lockedFields, retryFeedback],
  )

  const handleFeedbackReceived = useCallback(
    (feedback: ScienceBattleFeedbackDto) => {
      setProgress(feedback.progress ?? 0)
      const questionMap = new Map(feedback.questions.map((q) => [q.questionId, q.approved]))
      const questions = roomData?.questions ?? []
      const {
        loeAQId,
        loeBQId,
        betterStudyQId,
        justificationQId,
        comparisonQId,
        studyTitleQId,
        studyLinkQId,
      } = resolveScienceBattleQuestionIds(questions)

      const loeAOk = loeAQId !== undefined ? (questionMap.get(loeAQId) ?? null) : null
      const loeBOk = loeBQId !== undefined ? (questionMap.get(loeBQId) ?? null) : null
      const betterStudyOk =
        betterStudyQId !== undefined ? (questionMap.get(betterStudyQId) ?? null) : null
      const justificationOk =
        justificationQId !== undefined ? (questionMap.get(justificationQId) ?? null) : null
      const comparisonOk =
        comparisonQId !== undefined ? (questionMap.get(comparisonQId) ?? null) : null
      const studyTitleOk =
        studyTitleQId !== undefined ? (questionMap.get(studyTitleQId) ?? null) : null
      const studyLinkOk =
        studyLinkQId !== undefined ? (questionMap.get(studyLinkQId) ?? null) : null

      const nextLocked = {
        loeA: (loeAOk !== null ? loeAOk : lockedFields.loeA) || lockedFields.loeA,
        loeB: (loeBOk !== null ? loeBOk : lockedFields.loeB) || lockedFields.loeB,
        betterStudy:
          (betterStudyOk !== null ? betterStudyOk : lockedFields.betterStudy) ||
          lockedFields.betterStudy,
        justification:
          (justificationOk !== null ? justificationOk : lockedFields.justification) ||
          lockedFields.justification,
        comparison:
          (comparisonOk !== null ? comparisonOk : lockedFields.comparison) ||
          lockedFields.comparison,
        studyBTitle:
          (studyTitleOk !== null ? studyTitleOk : lockedFields.studyBTitle) ||
          lockedFields.studyBTitle,
        studyBLink:
          (studyLinkOk !== null ? studyLinkOk : lockedFields.studyBLink) ||
          lockedFields.studyBLink,
      }
      setLockedFields(nextLocked)
      sessionStorage.setItem('scienceBattleLockedFields', JSON.stringify(nextLocked))

      const nextRetry = {
        loeAOk:
          (loeAOk !== null ? loeAOk : retryFeedback?.loeAOk) ||
          retryFeedback?.loeAOk ||
          false,
        loeBOk:
          (loeBOk !== null ? loeBOk : retryFeedback?.loeBOk) ||
          retryFeedback?.loeBOk ||
          false,
        betterStudyOk:
          (betterStudyOk !== null ? betterStudyOk : retryFeedback?.betterStudyOk) ||
          retryFeedback?.betterStudyOk ||
          false,
        justificationOk:
          (justificationOk !== null ? justificationOk : retryFeedback?.justificationOk) ||
          retryFeedback?.justificationOk ||
          false,
        comparisonOk:
          (comparisonOk !== null ? comparisonOk : retryFeedback?.comparisonOk) ||
          retryFeedback?.comparisonOk ||
          false,
        studyBTitleOk:
          (studyTitleOk !== null ? studyTitleOk : retryFeedback?.studyBTitleOk) ||
          retryFeedback?.studyBTitleOk ||
          false,
        studyBLinkOk:
          (studyLinkOk !== null ? studyLinkOk : retryFeedback?.studyBLinkOk) ||
          retryFeedback?.studyBLinkOk ||
          false,
      }
      setRetryFeedback(nextRetry)
      sessionStorage.setItem('scienceBattleRetryFeedback', JSON.stringify(nextRetry))

      if (loeAOk === false && !lockedFields.loeA) setSelectedLoEA('')
      if (loeBOk === false && !lockedFields.loeB) setSelectedLoEB('')
      if (betterStudyOk === false && !lockedFields.betterStudy) setBetterStudyChoice('')
      if (justificationOk === false && !lockedFields.justification) setJustificationText('')
      if (comparisonOk === false && !lockedFields.comparison) setComparisonNotes('')
      if (studyTitleOk === false && !lockedFields.studyBTitle) setStudyBTitle('')
      if (studyLinkOk === false && !lockedFields.studyBLink) setStudyBLink('')

      setIsWaitingForFeedback(false)
      disconnectScienceBattleFeedbackWs()
      checkResults(nextLocked, nextRetry)
    },
    [roomData, lockedFields, retryFeedback, checkResults],
  )

  useEffect(() => {
    if (isWaitingForFeedback) {
      sessionStorage.setItem('scienceBattleWaitingForFeedback', 'true')
    } else {
      sessionStorage.removeItem('scienceBattleWaitingForFeedback')
    }
  }, [isWaitingForFeedback])

  useEffect(() => {
    sessionStorage.setItem('scienceBattleLockedFields', JSON.stringify(lockedFields))
  }, [lockedFields])

  useEffect(() => {
    if (retryFeedback) {
      sessionStorage.setItem('scienceBattleRetryFeedback', JSON.stringify(retryFeedback))
    } else {
      sessionStorage.removeItem('scienceBattleRetryFeedback')
    }
  }, [retryFeedback])

  useEffect(() => {
    sessionStorage.setItem('scienceBattleSelectedLoEA', selectedLoEA)
    sessionStorage.setItem('scienceBattleSelectedLoEB', selectedLoEB)
    sessionStorage.setItem('scienceBattleBetterStudyChoice', betterStudyChoice)
    sessionStorage.setItem('scienceBattleJustificationText', justificationText)
    sessionStorage.setItem('scienceBattleComparisonNotes', comparisonNotes)
    sessionStorage.setItem('scienceBattleStudyBTitle', studyBTitle)
    sessionStorage.setItem('scienceBattleStudyBLink', studyBLink)
  }, [
    selectedLoEA,
    selectedLoEB,
    betterStudyChoice,
    justificationText,
    comparisonNotes,
    studyBTitle,
    studyBLink,
  ])

  useEffect(() => {
    if (!isWaitingForFeedback) return
    connectScienceBattleFeedbackWs(userToken, missionName, handleFeedbackReceived)
    return () => disconnectScienceBattleFeedbackWs()
  }, [isWaitingForFeedback, userToken, missionName, handleFeedbackReceived])

  useEffect(() => {
    const keys: string[] = []
    const k1 = sessionStorage.getItem('roomOfKnowledgeKey')
    if (k1) keys.push(k1)
    const k2 = sessionStorage.getItem('roomOfAbstractsKey')
    if (k2) keys.push(k2)
    const k3 = sessionStorage.getItem('roomOfAnalyticsKey')
    if (k3) keys.push(k3)
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
    const {
      loeAQId,
      loeBQId,
      betterStudyQId,
      justificationQId,
      comparisonQId,
      studyTitleQId,
      studyLinkQId,
    } = resolveScienceBattleQuestionIds(questions)

    const loeAOption = LOE_OPTIONS.find((o) => o.value === selectedLoEA)
    const loeAAnswer = loeAOption?.label || selectedLoEA

    const loeBOption = LOE_OPTIONS.find((o) => o.value === selectedLoEB)
    const loeBAnswer = loeBOption?.value || selectedLoEB

    /**
     * Note on Level of Evidence handling:
     * Per ScienceBattleSubmissionDto in openapi.yaml, the submission has a dedicated levelofEvidenceAnswer field
     * alongside openQuestions. Study A's level of evidence is passed to levelofEvidenceQuestionId/levelofEvidenceAnswer
     * for direct backend validation, while Study B's level of evidence and other inputs are provided as openQuestions.
     */
    const openQuestions = [
      { questionId: loeBQId, answer: loeBAnswer },
      { questionId: betterStudyQId, answer: betterStudyChoice ? `Study ${betterStudyChoice}` : '' },
      { questionId: justificationQId, answer: justificationText },
      { questionId: comparisonQId, answer: comparisonNotes },
      { questionId: studyTitleQId, answer: studyBTitle },
      { questionId: studyLinkQId, answer: studyBLink },
    ].filter((q) => q.questionId !== undefined && q.answer && q.answer.trim() !== '')

    roomOfScienceBattleApi
      .submit({
        roomId,
        levelofEvidenceQuestionId: loeAQId,
        levelofEvidenceAnswer: loeAAnswer,
        openQuestions,
      })
      .then((response) => {
        setProgress(response.progress)

        const allOpenApproved =
          lockedFields.loeB &&
          lockedFields.betterStudy &&
          lockedFields.justification &&
          lockedFields.comparison &&
          (!studyBTitle.trim() || lockedFields.studyBTitle) &&
          (!studyBLink.trim() || lockedFields.studyBLink)

        const nextLocks = response.levelOfEvidenceApproved
          ? { ...lockedFields, loeA: true }
          : lockedFields

        if (response.levelOfEvidenceApproved) {
          setLockedFields(nextLocks)
          sessionStorage.setItem('scienceBattleLockedFields', JSON.stringify(nextLocks))
        }

        const nextRetry = {
          loeAOk: response.levelOfEvidenceApproved,
          loeBOk: lockedFields.loeB,
          betterStudyOk: lockedFields.betterStudy,
          justificationOk: lockedFields.justification,
          comparisonOk: lockedFields.comparison,
          studyBTitleOk: lockedFields.studyBTitle,
          studyBLinkOk: lockedFields.studyBLink,
        }

        checkResults(nextLocks, nextRetry)

        if (allOpenApproved && !response.levelOfEvidenceApproved) {
          setRetryFeedback(nextRetry)
          sessionStorage.setItem('scienceBattleRetryFeedback', JSON.stringify(nextRetry))
          setIsWaitingForFeedback(false)
          return
        }
        if (!allOpenApproved) {
          setRetryFeedback(nextRetry)
          sessionStorage.setItem('scienceBattleRetryFeedback', JSON.stringify(nextRetry))
          connectScienceBattleFeedbackWs(userToken, missionName, handleFeedbackReceived)
        }
      })
      .catch((err) => {
        console.error('[ScienceBattleSubmit] error:', err)
        setIsWaitingForFeedback(false)
        alert('Failed to submit Science Battle answers. Please try again.')
      })
  }

  const handleRetry = () => {
    disconnectScienceBattleFeedbackWs()
    setTimeLeft(TOTAL_TIME)
    setTimeExpired(false)
    setIsComplete(false)
    setIsWaitingForFeedback(false)
    setProgress(0)
    setResults(null)
    setRetryFeedback(null)
    setBackendKey(null)
    setLockedFields({
      loeA: false,
      loeB: false,
      betterStudy: false,
      justification: false,
      comparison: false,
      studyBTitle: false,
      studyBLink: false,
    })
    sessionStorage.removeItem('scienceBattleLockedFields')
    sessionStorage.removeItem('scienceBattleRetryFeedback')
    sessionStorage.removeItem('scienceBattleWaitingForFeedback')
    sessionStorage.removeItem('scienceBattleSelectedLoEA')
    sessionStorage.removeItem('scienceBattleSelectedLoEB')
    sessionStorage.removeItem('scienceBattleBetterStudyChoice')
    sessionStorage.removeItem('scienceBattleJustificationText')
    sessionStorage.removeItem('scienceBattleComparisonNotes')
    sessionStorage.removeItem('scienceBattleStudyBTitle')
    sessionStorage.removeItem('scienceBattleStudyBLink')
    sessionStorage.removeItem('roomOfScienceBattleKey')
    // Keep 'roomOfScienceBattleData' so questions are preserved across retries
    setSelectedLoEA('')
    setSelectedLoEB('')
    setBetterStudyChoice('')
    setJustificationText('')
    setComparisonNotes('')
    setStudyBTitle('')
    setStudyBLink('')
  }

  return {
    timeLeft,
    timeExpired,
    isComplete,
    progress,
    isWaitingForFeedback,
    selectedLoEA,
    setSelectedLoEA,
    selectedLoEB,
    setSelectedLoEB,
    betterStudyChoice,
    setBetterStudyChoice,
    justificationText,
    setJustificationText,
    comparisonNotes,
    setComparisonNotes,
    studyBTitle,
    setStudyBTitle,
    studyBLink,
    setStudyBLink,
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
