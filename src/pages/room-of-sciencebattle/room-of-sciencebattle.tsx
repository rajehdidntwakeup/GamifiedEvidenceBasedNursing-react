import {
  ArrowLeft,
  Clock,
  Swords,
  ChevronRight,
  AlertTriangle,
  Trophy,
  KeyRound,
  FileText,
  X,
  Search,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Scale,
  ShieldCheck,
  ShieldAlert,
  BarChart3,
  PenLine,
  BookOpen,
  Link as LinkIcon,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import { useSession } from '@/entities/session'
import { resolvePdfAsset } from '@/shared/lib/assets'

import {
  LOE_OPTIONS,
  STUDY_PAIRS_BY_MISSION,
  TOTAL_TIME,
} from './room-of-sciencebattle.data'
import type { RoomOfSciencebattleProps, StudyCompact } from './room-of-sciencebattle.data'
import { FeedbackOverlay } from './components/FeedbackOverlay'
import { useRoomOfScienceBattle } from './components/useRoomOfScienceBattle'

export function RoomOfSciencebattle({
  mission,
  onBack,
  onProceedToFinalStage,
}: RoomOfSciencebattleProps) {
  const { user } = useSession()
  const {
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
    handleSubmit,
    handleRetry,
  } = useRoomOfScienceBattle(mission, user?.token)

  // Viewing expanded study
  const [viewingStudy, setViewingStudy] = useState<'A' | 'B' | null>(null)

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  const pair = STUDY_PAIRS_BY_MISSION[mission.id] || STUDY_PAIRS_BY_MISSION[1]
  const pdfSrc = resolvePdfAsset(roomData?.docs?.[0], mission.id)

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timerPercent = (timeLeft / TOTAL_TIME) * 100
  const isTimerWarning = timeLeft < 300
  const isTimerCritical = timeLeft < 60

  const wordCount = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0)

  const passed = results ? results.overallScore === 5 : false
  const percentage = results ? Math.round((results.overallScore / results.overallTotal) * 100) : 0

  const canSubmit =
    (lockedFields.loeA || selectedLoEA !== '') &&
    (lockedFields.loeB || selectedLoEB !== '') &&
    (lockedFields.betterStudy || betterStudyChoice !== '') &&
    (lockedFields.justification || justificationText.trim() !== '') &&
    (lockedFields.comparison || comparisonNotes.trim() !== '')

  // Render a study card
  const renderStudyCard = (study: StudyCompact, side: 'A' | 'B') => (
    <button
      type='button'
      className='group bg-[#faf9f6] rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-shadow w-full text-left'
      onClick={() => setViewingStudy(side)}
    >
      <div className='bg-gray-100 px-5 py-3 border-b border-gray-200 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <FileText className='w-4 h-4 text-gray-500' />
          <p className='text-gray-500 text-xs tracking-wider uppercase'>{study.label}</p>
        </div>
        <span className='text-xs text-gray-400 font-[JetBrains_Mono,monospace]'>
          CLICK TO EXPAND
        </span>
      </div>
      <div className='p-5 max-h-[50vh] overflow-y-auto'>
        <h3 className='text-gray-900 text-sm mb-2' style={{ lineHeight: 1.5 }}>
          {study.title}
        </h3>
        <p className='text-gray-500 text-xs mb-1'>{study.authors}</p>
        <p className='text-gray-400 text-xs mb-4'>
          {study.journal} &bull; {study.year}
        </p>
        {[
          { key: 'background', label: 'Background' },
          { key: 'objective', label: 'Objective' },
          { key: 'methods', label: 'Methods' },
          { key: 'results', label: 'Results' },
          { key: 'conclusion', label: 'Conclusion' },
        ].map((section) => (
          <div key={section.key} className='mb-3'>
            <h4 className='text-gray-700 text-xs tracking-wider uppercase mb-1'>{section.label}</h4>
            <p className='text-gray-600 text-xs' style={{ lineHeight: 1.7 }}>
              {study.sections[section.key as keyof typeof study.sections]}
            </p>
          </div>
        ))}
        <div className='mt-3 pt-2 border-t border-gray-200 flex items-center gap-2 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity'>
          <Search className='w-4 h-4' />
          <span className='text-xs'>Click to view full-screen</span>
        </div>
      </div>
    </button>
  )

  // Full study modal
  const studyModalData =
    viewingStudy === 'A' ? pair.studyA : viewingStudy === 'B' ? pair.studyB : null
  const studyModal = viewingStudy !== null && studyModalData && (
    <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='bg-[#faf9f6] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto relative shadow-2xl'
      >
        <button
          onClick={() => setViewingStudy(null)}
          className='absolute top-4 right-4 z-10 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors'
        >
          <X className='w-4 h-4 text-gray-700' />
        </button>

        {viewingStudy === 'A' && pdfSrc ? (
          <iframe src={pdfSrc} title='Study A PDF' className='w-full h-[80vh]' />
        ) : (
          <div className='p-8'>
            <div className='border-b-2 border-gray-800 pb-4 mb-6'>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 text-xs mb-2'>
                {studyModalData.label}
              </div>
              <p className='text-gray-500 text-xs tracking-wider uppercase mb-1'>
                {studyModalData.journal} &bull; {studyModalData.year} &bull;{' '}
                {studyModalData.studyDesign}
              </p>
              <h2 className='text-gray-900 text-lg' style={{ lineHeight: 1.4 }}>
                {studyModalData.title}
              </h2>
              <p className='text-gray-600 text-sm mt-2'>{studyModalData.authors}</p>
            </div>

            {[
              { key: 'background', label: 'Background' },
              { key: 'objective', label: 'Objective' },
              { key: 'methods', label: 'Methods' },
              { key: 'results', label: 'Results' },
              { key: 'conclusion', label: 'Conclusion' },
            ].map((section) => (
              <div key={section.key} className='mb-5'>
                <h3 className='text-gray-800 text-sm tracking-wider uppercase mb-2'>
                  {section.label}
                </h3>
                <p className='text-gray-700 text-sm' style={{ lineHeight: 1.8 }}>
                  {studyModalData.sections[section.key as keyof typeof studyModalData.sections]}
                </p>
              </div>
            ))}

            {/* Quick reference: design details */}
            <div className='mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200'>
              <h4 className='text-gray-700 text-xs tracking-wider uppercase mb-3'>Quick Reference</h4>
              <div className='grid grid-cols-3 gap-4 text-xs'>
                <div>
                  <span className='text-gray-400 block'>Study Design</span>
                  <span className='text-gray-800'>{studyModalData.studyDesign}</span>
                </div>
                <div>
                  <span className='text-gray-400 block'>Sample Size</span>
                  <span className='text-gray-800'>{studyModalData.sampleSize}</span>
                </div>
                <div>
                  <span className='text-gray-400 block'>Level of Evidence</span>
                  <span className='text-gray-800'>{studyModalData.loe}</span>
                </div>
              </div>
            </div>

            <div className='mt-6 pt-4 border-t border-gray-200'>
              <span className='text-gray-400 text-xs font-[JetBrains_Mono,monospace]'>
                STUDY {viewingStudy} | COMPARE CAREFULLY WITH THE OTHER STUDY
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )

  // Results screen
  if (isComplete && results) {
    return (
      <div className='fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto font-[Inter,sans-serif]'>
        <div
          className='absolute inset-0 z-0 opacity-5'
          style={{
            backgroundImage:
              'linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className='relative z-10 px-6 py-12'>
          <div className='max-w-2xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='text-center'
            >
              {timeExpired && (
                <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-6'>
                  <AlertTriangle className='w-4 h-4' />
                  <span className='font-[JetBrains_Mono,monospace] text-sm'>TIME EXPIRED</span>
                </div>
              )}
              <div
                className={`w-20 h-20 rounded-2xl ${passed ? 'bg-teal-500/20' : 'bg-orange-500/20'} flex items-center justify-center mx-auto mb-6`}
              >
                {passed ? (
                  <Trophy className='w-10 h-10 text-teal-400' />
                ) : (
                  <AlertTriangle className='w-10 h-10 text-orange-400' />
                )}
              </div>
              <h2 className='text-3xl text-white mb-2 tracking-tight'>
                {timeExpired ? "Time's Up!" : passed ? 'Room Cleared!' : 'Room Failed'}
              </h2>
              <p className='text-gray-400 mb-8'>
                {passed
                  ? "Exceptional evidence comparison, Agent. You've proven your ability to distinguish study quality."
                  : 'Refine your evidence appraisal skills and try again, Agent.'}
              </p>

              {/* Score overview */}
              <div className='bg-white/5 border border-white/10 rounded-2xl p-6 mb-6'>
                <div className='flex items-center justify-between mb-4'>
                  <span className='text-gray-400'>Tasks Completed</span>
                  <span className='text-white text-2xl font-[JetBrains_Mono,monospace]'>
                    {results.overallScore}/{results.overallTotal}
                  </span>
                </div>
                <div className='w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4'>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={`h-full rounded-full ${passed ? 'bg-teal-500' : 'bg-orange-500'}`}
                  />
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-500'>{percentage}% tasks passed</span>
                  <span className={passed ? 'text-teal-400' : 'text-orange-400'}>
                    {passed ? 'PASSED' : '3 of 5 tasks required'}
                  </span>
                </div>
              </div>

              {/* Task breakdown */}
              <div className='space-y-3 mb-8 text-left'>
                {/* LoE A */}
                <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                  <div className='flex items-center gap-3 mb-1'>
                    {results.loeACorrect ? (
                      <CheckCircle2 className='w-5 h-5 text-green-400 shrink-0' />
                    ) : (
                      <XCircle className='w-5 h-5 text-red-400 shrink-0' />
                    )}
                    <span className='text-white text-sm'>Level of Evidence — Study A</span>
                  </div>
                  {!results.loeACorrect && (
                    <div className='ml-8'>
                      <p className='text-xs text-red-300'>
                        Your answer: {selectedLoEA || '(empty)'}{' '}
                        <span className='text-teal-400 ml-1'>Correct: {pair.studyA.loe}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* LoE B */}
                <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                  <div className='flex items-center gap-3 mb-1'>
                    {results.loeBCorrect ? (
                      <CheckCircle2 className='w-5 h-5 text-green-400 shrink-0' />
                    ) : (
                      <XCircle className='w-5 h-5 text-red-400 shrink-0' />
                    )}
                    <span className='text-white text-sm'>Level of Evidence — Study B</span>
                  </div>
                  {!results.loeBCorrect && (
                    <div className='ml-8'>
                      <p className='text-xs text-red-300'>
                        Your answer: {selectedLoEB || '(empty)'}{' '}
                        <span className='text-teal-400 ml-1'>Correct: {pair.studyB.loe}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Better study choice */}
                <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                  <div className='flex items-center gap-3 mb-1'>
                    {results.betterStudyCorrect ? (
                      <CheckCircle2 className='w-5 h-5 text-green-400 shrink-0' />
                    ) : (
                      <XCircle className='w-5 h-5 text-red-400 shrink-0' />
                    )}
                    <span className='text-white text-sm'>Better Evidence Identification</span>
                  </div>
                  {!results.betterStudyCorrect && (
                    <div className='ml-8'>
                      <p className='text-xs text-red-300'>
                        Your answer: Study {betterStudyChoice || '—'}{' '}
                        <span className='text-teal-400 ml-1'>
                          Correct: Study {pair.betterStudy}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Justification */}
                <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                  <div className='flex items-center gap-3'>
                    {results.justificationOk ? (
                      <CheckCircle2 className='w-5 h-5 text-green-400 shrink-0' />
                    ) : (
                      <XCircle className='w-5 h-5 text-red-400 shrink-0' />
                    )}
                    <span className='text-white text-sm'>Decision Justification</span>
                    <span className='text-gray-500 text-xs ml-auto font-[JetBrains_Mono,monospace]'>
                      {results.justificationOk ? 'Approved' : 'Needs correction'}
                    </span>
                  </div>
                </div>

                {/* Comparison notes */}
                <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                  <div className='flex items-center gap-3'>
                    {results.comparisonOk ? (
                      <CheckCircle2 className='w-5 h-5 text-green-400 shrink-0' />
                    ) : (
                      <XCircle className='w-5 h-5 text-red-400 shrink-0' />
                    )}
                    <span className='text-white text-sm'>Methodological Comparison</span>
                    <span className='text-gray-500 text-xs ml-auto font-[JetBrains_Mono,monospace]'>
                      {results.comparisonOk ? 'Approved' : 'Needs correction'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rationale (learning feedback) */}
              <div className='bg-teal-500/5 border border-teal-500/20 rounded-xl p-5 mb-8 text-left'>
                <div className='flex items-center gap-2 mb-3'>
                  <Lightbulb className='w-5 h-5 text-teal-400' />
                  <span className='text-teal-400 font-[JetBrains_Mono,monospace] text-sm'>
                    WHY STUDY {pair.betterStudy} PROVIDES BETTER EVIDENCE
                  </span>
                </div>
                <ul className='space-y-2'>
                  {pair.rationale.map((point, i) => (
                    <li key={i} className='text-gray-400 text-sm flex gap-2'>
                      <span className='text-teal-500 shrink-0'>&#8250;</span>
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Strengths / weaknesses comparison */}
                <div className='mt-4 pt-4 border-t border-teal-500/10 grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <span className='text-teal-400 font-[JetBrains_Mono,monospace] text-xs mb-2 block'>
                      STUDY A — KEY WEAKNESSES
                    </span>
                    <ul className='space-y-1'>
                      {pair.studyA.keyWeaknesses.map((w, i) => (
                        <li key={i} className='text-gray-500 text-xs flex gap-2'>
                          <span className='text-orange-400 shrink-0'>•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className='text-teal-400 font-[JetBrains_Mono,monospace] text-xs mb-2 block'>
                      STUDY B — KEY STRENGTHS
                    </span>
                    <ul className='space-y-1'>
                      {pair.studyB.keyStrengths.map((s, i) => (
                        <li key={i} className='text-gray-500 text-xs flex gap-2'>
                          <span className='text-green-400 shrink-0'>•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Clue Letters */}
              {passed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className='bg-gradient-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden'
                >
                  <div
                    className='absolute inset-0 opacity-5'
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(20,184,166,0.3) 2px, rgba(20,184,166,0.3) 4px)',
                    }}
                  />
                  <div className='relative z-10'>
                    <div className='flex items-center justify-center gap-2 mb-4'>
                      <KeyRound className='w-5 h-5 text-teal-400' />
                      <span className='text-teal-400 font-[JetBrains_Mono,monospace] text-sm'>
                        CLUE LETTERS UNLOCKED
                      </span>
                    </div>
                    <p className='text-gray-400 text-sm mb-5'>
                      The final letters revealed! Your collection is complete.
                    </p>
                    <div className='flex items-center justify-center gap-3 flex-wrap'>
                      {previousKeys.flatMap((k) =>
                        k.split('-').map((letter) => (
                          <div
                            key={`prev-${letter}-${k}`}
                            className='w-11 h-14 bg-[#0a1f22]/60 border border-white/10 rounded-lg flex items-center justify-center opacity-40'
                          >
                            <span className='text-gray-500 text-lg font-[JetBrains_Mono,monospace]'>
                              {letter.toUpperCase()}
                            </span>
                          </div>
                        )),
                      )}
                      {previousKeys.length > 0 && (backendKey || 'N-E') && (
                        <div className='w-px h-12 bg-teal-500/30 mx-1' />
                      )}
                      {(backendKey || 'N-E').split('-').map((letter, i) => (
                        <motion.div
                          key={`new-${letter}-${i}`}
                          initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 1.6 + i * 0.3,
                            type: 'spring',
                            stiffness: 200,
                          }}
                          className='w-16 h-20 bg-[#0a1f22] border-2 border-teal-500/60 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.2)]'
                        >
                          <span className='text-teal-400 text-3xl font-[JetBrains_Mono,monospace]'>
                            {letter.toUpperCase()}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    <p className='text-gray-600 text-xs mt-4 font-[JetBrains_Mono,monospace]'>
                      FRAGMENT 4 OF 4 // ALL LETTERS COLLECTED:{' '}
                      {previousKeys.map((k) => k.replace('-', ', ')).join(', ')}
                      {previousKeys.length > 0 ? ', ' : ''}
                      {(backendKey || 'N-E').replace('-', ', ')}
                    </p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                      className='mt-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg'
                    >
                      <p className='text-teal-300 text-sm font-[JetBrains_Mono,monospace]'>
                        🔓 All 8 letters unlocked! Unscramble them to solve the case...
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <button
                  onClick={onBack}
                  className='px-6 py-3 bg-white/5 border border-white/10 hover:border-teal-500/40 text-white rounded-xl transition-colors'
                >
                  Back to Missions
                </button>
                {!passed && (
                  <button
                    onClick={handleRetry}
                    className='px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2'
                  >
                    Retry Room
                    <ChevronRight className='w-4 h-4' />
                  </button>
                )}
                {passed && onProceedToFinalStage && (
                  <button
                    onClick={onProceedToFinalStage}
                    className='px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2'
                  >
                    Solve the Case
                    <ChevronRight className='w-4 h-4' />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  // Time expired without submission
  if (isComplete && !results) {
    return (
      <div className='fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto font-[Inter,sans-serif]'>
        <div
          className='absolute inset-0 z-0 opacity-5'
          style={{
            backgroundImage:
              'linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className='relative z-10 flex items-center justify-center min-h-screen px-6 py-12'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='max-w-lg w-full text-center'
          >
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-6'>
              <AlertTriangle className='w-4 h-4' />
              <span className='font-[JetBrains_Mono,monospace] text-sm'>TIME EXPIRED</span>
            </div>
            <div className='w-20 h-20 rounded-2xl bg-orange-500/20 flex items-center justify-center mx-auto mb-6'>
              <AlertTriangle className='w-10 h-10 text-orange-400' />
            </div>
            <h2 className='text-3xl text-white mb-2'>Time&apos;s Up!</h2>
            <p className='text-gray-400 mb-8'>
              You ran out of time before submitting your evidence comparison.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <button
                onClick={onBack}
                className='px-6 py-3 bg-white/5 border border-white/10 hover:border-teal-500/40 text-white rounded-xl transition-colors'
              >
                Back to Missions
              </button>
              <button
                onClick={handleRetry}
                className='px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2'
              >
                Retry Room <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Main room UI
  return (
    <div className='fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto font-[Inter,sans-serif]'>
      {studyModal}

      {isWaitingForFeedback && <FeedbackOverlay progress={progress} />}

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
        {/* Top bar */}
        <div className='px-6 md:px-12 py-4 border-b border-white/10'>
          <div className='flex items-center justify-between max-w-7xl mx-auto'>
            <button
              onClick={onBack}
              className='flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors'
            >
              <ArrowLeft className='w-5 h-5' />
              <span className='hidden sm:inline'>Abort Mission</span>
            </button>

            <div className='flex items-center gap-2'>
              <Swords className='w-5 h-5 text-teal-400' />
              <span className='text-white font-[JetBrains_Mono,monospace] text-sm'>
                ROOM 4 — SCIENCEBATTLE
              </span>
            </div>

            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                isTimerCritical
                  ? 'bg-red-500/10 border-red-500/40 text-red-400'
                  : isTimerWarning
                    ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
                    : 'bg-white/5 border-white/10 text-white'
              }`}
            >
              <Clock className={`w-4 h-4 ${isTimerCritical ? 'animate-pulse' : ''}`} />
              <span className='font-[JetBrains_Mono,monospace] text-sm tabular-nums'>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Timer bar */}
        <div className='w-full h-1 bg-white/5'>
          <motion.div
            className={`h-full ${
              isTimerCritical ? 'bg-red-500' : isTimerWarning ? 'bg-orange-500' : 'bg-teal-500'
            }`}
            animate={{ width: `${timerPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto'>
          <div className='max-w-7xl mx-auto px-4 md:px-8 py-8'>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className='text-center mb-8'
            >
              <h2 className='text-2xl md:text-3xl text-white mb-3 tracking-tight'>
                The <span className='text-teal-400'>Science Battle</span>
              </h2>
              <p className='text-gray-400 max-w-3xl mx-auto text-sm mb-4'>{pair.context}</p>
              <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300'>
                <Scale className='w-4 h-4' />
                <span className='font-[JetBrains_Mono,monospace] text-xs'>
                  COMPARE BOTH STUDIES — DETERMINE WHICH PROVIDES BETTER EVIDENCE — JUSTIFY YOUR
                  DECISION
                </span>
              </div>
            </motion.div>

            {/* Two studies side by side */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {pdfSrc ? (
                  <div className='bg-[#faf9f6] rounded-2xl overflow-hidden border border-gray-200'>
                    <div className='bg-gray-100 px-5 py-3 border-b border-gray-200 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <FileText className='w-4 h-4 text-gray-500' />
                        <p className='text-gray-500 text-xs tracking-wider uppercase'>{pair.studyA.label}</p>
                      </div>
                      <button
                        type='button'
                        onClick={() => setViewingStudy('A')}
                        className='text-xs text-teal-600 hover:text-teal-500 font-[JetBrains_Mono,monospace] cursor-pointer'
                      >
                        FULL SCREEN →
                      </button>
                    </div>
                    <iframe src={pdfSrc} title='Study A PDF' className='w-full h-[50vh]' />
                  </div>
                ) : (
                  renderStudyCard(pair.studyA, 'A')
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className='bg-[#faf9f6] rounded-2xl overflow-hidden'
              >
                <div className='bg-gray-100 px-5 py-3 border-b border-gray-200 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <BookOpen className='w-4 h-4 text-gray-500' />
                    <p className='text-gray-500 text-xs tracking-wider uppercase'>
                      Study B (Your Supporting Study)
                    </p>
                  </div>
                  <span className='text-xs text-gray-400 font-[JetBrains_Mono,monospace]'>
                    YOU CHOOSE
                  </span>
                </div>
                <div className='p-5 space-y-4'>
                  <p className='text-gray-600 text-xs' style={{ lineHeight: 1.6 }}>
                    Find a peer-reviewed study that supports the same intervention as Study A (
                    {pair.intervention}). Provide its title and a link (e.g., PubMed, DOI, or
                    journal URL).
                  </p>

                  <div>
                    <label
                      htmlFor='studyBTitle'
                      className='text-gray-700 text-xs tracking-wider uppercase mb-1 block'
                    >
                      Study Title
                    </label>
                    <input
                      id='studyBTitle'
                      type='text'
                      value={studyBTitle}
                      onChange={(e) => setStudyBTitle(e.target.value)}
                      disabled={lockedFields.studyBTitle}
                      placeholder='Full title of the supporting study...'
                      className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none ${
                        lockedFields.studyBTitle
                          ? 'bg-gray-100 border border-green-500/30 text-gray-500 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-teal-500'
                      }`}
                    />
                    <div className='flex items-center justify-between mt-1'>
                      <span className='text-gray-400 text-xs'>
                        {studyBTitle.trim().length} characters
                      </span>
                      <span
                        className={`text-xs ${
                          studyBTitle.trim().length >= 10 ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        Min. 10 characters
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='studyBLink'
                      className='text-gray-700 text-xs tracking-wider uppercase mb-1 block'
                    >
                      Link to Study
                    </label>
                    <div className='relative'>
                      <LinkIcon className='w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
                      <input
                        id='studyBLink'
                        type='url'
                        value={studyBLink}
                        onChange={(e) => setStudyBLink(e.target.value)}
                        disabled={lockedFields.studyBLink}
                        placeholder='https://pubmed.ncbi.nlm.nih.gov/...'
                        className={`w-full rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none ${
                          lockedFields.studyBLink
                            ? 'bg-gray-100 border border-green-500/30 text-gray-500 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-teal-500'
                        }`}
                      />
                    </div>
                    <div className='flex items-center justify-between mt-1'>
                      <span className='text-gray-400 text-xs'>
                        {studyBLink.trim() ? 'URL provided' : 'No URL yet'}
                      </span>
                      <span
                        className={`text-xs ${
                          isValidUrl(studyBLink) ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        Must be a valid URL
                      </span>
                    </div>
                  </div>

                  <div className='pt-2 border-t border-gray-200'>
                    <p className='text-gray-500 text-xs' style={{ lineHeight: 1.6 }}>
                      <span className='text-gray-700'>Tip:</span> Choose a study whose design or
                      methods directly address Study A&apos;s limitations — that&apos;s what makes
                      your evidence base stronger.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Analysis Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className='space-y-6 max-w-4xl mx-auto'
            >
              {retryFeedback && (
                <div className='bg-orange-500/10 border border-orange-500/30 rounded-xl p-4'>
                  <div className='flex items-center gap-2 mb-1'>
                    <ShieldAlert className='w-4 h-4 text-orange-400 shrink-0' />
                    <span className='text-orange-400 text-sm font-medium'>Feedback Received</span>
                  </div>
                  <p className='text-gray-400 text-xs leading-relaxed'>
                    Some answers were approved and locked. Rejected answers have been cleared —
                    please correct them and submit again.
                  </p>
                </div>
              )}

              {/* TASK 1: LoE for Study A */}
              <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
                <div className='px-5 py-4 border-b border-white/10 flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center'>
                    <BarChart3 className='w-4 h-4 text-purple-400' />
                  </div>
                  <div className='flex-1'>
                    <span className='text-white text-sm'>Level of Evidence — Study A</span>
                    <p className='text-gray-500 text-xs'>
                      Classify the previously reviewed study on the evidence pyramid
                    </p>
                  </div>
                  {retryFeedback && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        retryFeedback.loeAOk
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}
                    >
                      {retryFeedback.loeAOk ? 'Approved' : 'Needs correction'}
                    </span>
                  )}
                </div>
                <div className='p-5'>
                  <select
                    value={selectedLoEA}
                    onChange={(e) => setSelectedLoEA(e.target.value)}
                    disabled={lockedFields.loeA}
                    className={`w-full rounded-lg px-4 py-3 text-white focus:outline-none text-sm appearance-none cursor-pointer ${
                      lockedFields.loeA
                        ? 'bg-white/5 border border-green-500/30 opacity-60 cursor-not-allowed'
                        : retryFeedback && !retryFeedback.loeAOk
                          ? 'bg-white/5 border border-orange-500/30 focus:border-orange-500'
                          : 'bg-white/5 border border-white/10 focus:border-teal-500'
                    }`}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                    }}
                  >
                    {LOE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className='bg-[#0f2a2e] text-white'>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TASK 2: LoE for Study B */}
              <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
                <div className='px-5 py-4 border-b border-white/10 flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center'>
                    <BarChart3 className='w-4 h-4 text-purple-400' />
                  </div>
                  <div className='flex-1'>
                    <span className='text-white text-sm'>Level of Evidence — Study B</span>
                    <p className='text-gray-500 text-xs'>
                      Classify the new supporting study on the evidence pyramid
                    </p>
                  </div>
                  {retryFeedback && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        retryFeedback.loeBOk
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}
                    >
                      {retryFeedback.loeBOk ? 'Approved' : 'Needs correction'}
                    </span>
                  )}
                </div>
                <div className='p-5'>
                  <select
                    value={selectedLoEB}
                    onChange={(e) => setSelectedLoEB(e.target.value)}
                    disabled={lockedFields.loeB}
                    className={`w-full rounded-lg px-4 py-3 text-white focus:outline-none text-sm appearance-none cursor-pointer ${
                      lockedFields.loeB
                        ? 'bg-white/5 border border-green-500/30 opacity-60 cursor-not-allowed'
                        : retryFeedback && !retryFeedback.loeBOk
                          ? 'bg-white/5 border border-orange-500/30 focus:border-orange-500'
                          : 'bg-white/5 border border-white/10 focus:border-teal-500'
                    }`}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                    }}
                  >
                    {LOE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className='bg-[#0f2a2e] text-white'>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TASK 3: Which study provides better evidence? */}
              <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
                <div className='px-5 py-4 border-b border-white/10 flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center'>
                    <Scale className='w-4 h-4 text-teal-400' />
                  </div>
                  <div className='flex-1'>
                    <span className='text-white text-sm'>Better Evidence</span>
                    <p className='text-gray-500 text-xs'>
                      Which study provides the better evidence for the intervention?
                    </p>
                  </div>
                  {retryFeedback && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        retryFeedback.betterStudyOk
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}
                    >
                      {retryFeedback.betterStudyOk ? 'Approved' : 'Needs correction'}
                    </span>
                  )}
                </div>
                <div className='p-5'>
                  <div className='grid grid-cols-2 gap-4'>
                    <button
                      type='button'
                      onClick={() => setBetterStudyChoice('A')}
                      disabled={lockedFields.betterStudy}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        lockedFields.betterStudy
                          ? betterStudyChoice === 'A'
                            ? 'border-green-500/50 bg-green-500/10 opacity-70 cursor-not-allowed'
                            : 'border-white/5 bg-white/5 opacity-40 cursor-not-allowed'
                          : retryFeedback && !retryFeedback.betterStudyOk
                            ? betterStudyChoice === 'A'
                              ? 'border-orange-500 bg-orange-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                            : betterStudyChoice === 'A'
                              ? 'border-teal-500 bg-teal-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className='flex items-center gap-2 mb-2'>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            betterStudyChoice === 'A' ? 'border-teal-500' : 'border-white/30'
                          }`}
                        >
                          {betterStudyChoice === 'A' && (
                            <div className='w-2.5 h-2.5 rounded-full bg-teal-500' />
                          )}
                        </div>
                        <span
                          className={`text-sm ${betterStudyChoice === 'A' ? 'text-teal-400' : 'text-white'}`}
                        >
                          Study A
                        </span>
                      </div>
                      <p className='text-gray-500 text-xs line-clamp-2'>
                        {pair.studyA.studyDesign} — {pair.studyA.sampleSize}
                      </p>
                    </button>
                    <button
                      type='button'
                      onClick={() => setBetterStudyChoice('B')}
                      disabled={lockedFields.betterStudy}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        lockedFields.betterStudy
                          ? betterStudyChoice === 'B'
                            ? 'border-green-500/50 bg-green-500/10 opacity-70 cursor-not-allowed'
                            : 'border-white/5 bg-white/5 opacity-40 cursor-not-allowed'
                          : retryFeedback && !retryFeedback.betterStudyOk
                            ? betterStudyChoice === 'B'
                              ? 'border-orange-500 bg-orange-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                            : betterStudyChoice === 'B'
                              ? 'border-teal-500 bg-teal-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className='flex items-center gap-2 mb-2'>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            betterStudyChoice === 'B' ? 'border-teal-500' : 'border-white/30'
                          }`}
                        >
                          {betterStudyChoice === 'B' && (
                            <div className='w-2.5 h-2.5 rounded-full bg-teal-500' />
                          )}
                        </div>
                        <span
                          className={`text-sm ${betterStudyChoice === 'B' ? 'text-teal-400' : 'text-white'}`}
                        >
                          Study B
                        </span>
                      </div>
                      <p className='text-gray-500 text-xs line-clamp-2'>
                        {pair.studyB.studyDesign} — {pair.studyB.sampleSize}
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* TASK 4: Justification */}
              <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
                <div className='px-5 py-4 border-b border-white/10 flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center'>
                    <ShieldCheck className='w-4 h-4 text-orange-400' />
                  </div>
                  <div className='flex-1'>
                    <span className='text-white text-sm'>Justify Your Decision</span>
                    <p className='text-gray-500 text-xs'>
                      Explain why your chosen study provides better evidence. Consider study design,
                      level of evidence, sample size, methodological rigor, and clinical outcomes.
                    </p>
                  </div>
                  {retryFeedback && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        retryFeedback.justificationOk
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}
                    >
                      {retryFeedback.justificationOk ? 'Approved' : 'Needs correction'}
                    </span>
                  )}
                </div>
                <div className='p-5'>
                  <textarea
                    value={justificationText}
                    onChange={(e) => setJustificationText(e.target.value)}
                    disabled={lockedFields.justification}
                    placeholder='Justify your decision by comparing the study designs, levels of evidence, methodological strengths and weaknesses, sample sizes, statistical approaches, outcome significance, and generalizability of both studies...'
                    rows={6}
                    className={`w-full rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none text-sm resize-y ${
                      lockedFields.justification
                        ? 'bg-white/5 border border-green-500/30 opacity-60 cursor-not-allowed'
                        : retryFeedback && !retryFeedback.justificationOk
                          ? 'bg-white/5 border border-orange-500/30 focus:border-orange-500'
                          : 'bg-white/5 border border-white/10 focus:border-teal-500'
                    }`}
                    style={{ lineHeight: 1.7 }}
                  />
                  <div className='flex items-center justify-between mt-2'>
                    <span className='text-gray-600 text-xs'>
                      {wordCount(justificationText)} words
                    </span>
                  </div>
                </div>
              </div>

              {/* TASK 5: Methodological comparison notes */}
              <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
                <div className='px-5 py-4 border-b border-white/10 flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center'>
                    <PenLine className='w-4 h-4 text-emerald-400' />
                  </div>
                  <div className='flex-1'>
                    <span className='text-white text-sm'>Methodological Comparison</span>
                    <p className='text-gray-500 text-xs'>
                      Compare the key methodological differences between the two studies (e.g.,
                      randomization, blinding, sample selection, compliance, outcome measures).
                    </p>
                  </div>
                  {retryFeedback && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        retryFeedback.comparisonOk
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}
                    >
                      {retryFeedback.comparisonOk ? 'Approved' : 'Needs correction'}
                    </span>
                  )}
                </div>
                <div className='p-5'>
                  <textarea
                    value={comparisonNotes}
                    onChange={(e) => setComparisonNotes(e.target.value)}
                    disabled={lockedFields.comparison}
                    placeholder='Compare the methodological approaches: How do the study designs differ? What are the key differences in randomization, blinding, sample selection, compliance monitoring, and outcome measurement?'
                    rows={5}
                    className={`w-full rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none text-sm resize-y ${
                      lockedFields.comparison
                        ? 'bg-white/5 border border-green-500/30 opacity-60 cursor-not-allowed'
                        : retryFeedback && !retryFeedback.comparisonOk
                          ? 'bg-white/5 border border-orange-500/30 focus:border-orange-500'
                          : 'bg-white/5 border border-white/10 focus:border-teal-500'
                    }`}
                    style={{ lineHeight: 1.7 }}
                  />
                  <div className='flex items-center justify-between mt-2'>
                    <span className='text-gray-600 text-xs'>
                      {wordCount(comparisonNotes)} words
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className='flex justify-center pt-4 pb-8'>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`px-10 py-4 rounded-xl flex items-center gap-2 transition-all ${
                    canSubmit
                      ? 'bg-teal-500 hover:bg-teal-400 text-white hover:scale-105'
                      : 'bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Submit Evidence Battle
                  <ChevronRight className='w-5 h-5' />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
