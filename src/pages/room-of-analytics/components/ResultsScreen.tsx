import { motion } from 'motion/react'
import { Trophy, AlertTriangle, CheckCircle2, XCircle, KeyRound, ChevronRight } from 'lucide-react'
import type { Study } from '../room-of-analytics.data'

interface ResultsScreenProps {
  passed: boolean
  timeExpired: boolean
  percentage: number
  overallScore: number
  overallTotal: number
  results: {
    methodologyOk: boolean
    resultsOk: boolean
    loeCorrect: boolean
    strengthsOk: boolean
    weaknessOk: boolean
  }
  selectedLoe: string
  study: Study
  previousKeys: string[]
  backendKey: string | null
  onBack: () => void
  onRetry: () => void
  onProceedToRoom4?: () => void
}

export function ResultsScreen({
  passed,
  timeExpired,
  percentage,
  overallScore,
  overallTotal,
  results,
  selectedLoe,
  study,
  previousKeys,
  backendKey,
  onBack,
  onRetry,
  onProceedToRoom4,
}: ResultsScreenProps) {
  return (
    <div className='fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto overflow-x-hidden font-[Inter,sans-serif]'>
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
                ? 'Outstanding critical analysis, Agent. Your appraisal skills are exceptional.'
                : 'Sharpen your analytical lens and try again, Agent.'}
            </p>

            {/* Score overview */}
            <div className='bg-white/5 border border-white/10 rounded-2xl p-6 mb-6'>
              <div className='flex items-center justify-between mb-4'>
                <span className='text-gray-400'>Tasks Completed</span>
                <span className='text-white text-2xl font-[JetBrains_Mono,monospace]'>
                  {overallScore}/{overallTotal}
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
                  {passed ? 'PASSED' : 'All 5 tasks required'},
                </span>
              </div>
            </div>

            {/* Task breakdown */}
            <div className='space-y-3 mb-8 text-left'>
              {/* Methodology */}
              <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                <div className='flex items-center gap-3'>
                  {results.methodologyOk ? (
                    <CheckCircle2 className='w-5 h-5 text-green-400 shrink-0' />
                  ) : (
                    <XCircle className='w-5 h-5 text-red-400 shrink-0' />
                  )}
                  <span className='text-white text-sm'>Methodology Analysis</span>
                  <span className='text-gray-500 text-xs ml-auto font-[JetBrains_Mono,monospace]'>
                    {results.methodologyOk ? 'Sufficient detail' : 'Needs correction'}
                  </span>
                </div>
              </div>

              {/* Results */}
              <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                <div className='flex items-center gap-3'>
                  {results.resultsOk ? (
                    <CheckCircle2 className='w-5 h-5 text-green-400 shrink-0' />
                  ) : (
                    <XCircle className='w-5 h-5 text-red-400 shrink-0' />
                  )}
                  <span className='text-white text-sm'>Results Summary</span>
                  <span className='text-gray-500 text-xs ml-auto font-[JetBrains_Mono,monospace]'>
                    {results.resultsOk ? 'Sufficient detail' : 'Needs correction'}
                  </span>
                </div>
              </div>

              {/* LoE */}
              <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                <div className='flex items-center gap-3 mb-1'>
                  {results.loeCorrect ? (
                    <CheckCircle2 className='w-5 h-5 text-green-400 shrink-0' />
                  ) : (
                    <XCircle className='w-5 h-5 text-red-400 shrink-0' />
                  )}
                  <span className='text-white text-sm'>Level of Evidence</span>
                </div>
                {!results.loeCorrect && (
                  <div className='ml-8'>
                    <p className='text-xs text-red-300'>
                      Your answer: {selectedLoe || '(empty)'}{' '}
                      <span className='text-teal-400 ml-1'>
                        Correct: {study.correctAnswers.loe}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Strengths */}
              <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                <div className='flex items-center gap-3'>
                  {results.strengthsOk ? (
                    <CheckCircle2 className='w-5 h-5 text-green-400 shrink-0' />
                  ) : (
                    <XCircle className='w-5 h-5 text-red-400 shrink-0' />
                  )}
                  <span className='text-white text-sm'>Strengths</span>
                  <span className='text-gray-500 text-xs ml-auto font-[JetBrains_Mono,monospace]'>
                    {results.strengthsOk ? 'Sufficient detail' : 'Needs correction'}
                  </span>
                </div>
              </div>

              {/* Weaknesses */}
              <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                <div className='flex items-center gap-3'>
                  {results.weaknessOk ? (
                    <CheckCircle2 className='w-5 h-5 text-green-400 shrink-0' />
                  ) : (
                    <XCircle className='w-5 h-5 text-red-400 shrink-0' />
                  )}
                  <span className='text-white text-sm'>Weaknesses</span>
                  <span className='text-gray-500 text-xs ml-auto font-[JetBrains_Mono,monospace]'>
                    {results.weaknessOk ? 'Sufficient detail' : 'Needs correction'}
                  </span>
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
                    Two more letters revealed! Your collection grows.
                  </p>
                  <div className='flex items-center justify-center gap-3 flex-wrap'>
                    {previousKeys.flatMap((k) =>
                      k.split('-').map((letter) => (
                        <div
                          key={`prev-${letter}-${k}`}
                          className='w-12 h-15 bg-[#0a1f22]/60 border border-white/10 rounded-lg flex items-center justify-center opacity-40'
                        >
                          <span className='text-gray-500 text-xl font-[JetBrains_Mono,monospace]'>
                            {letter.toUpperCase()}
                          </span>
                        </div>
                      )),
                    )}
                    {previousKeys.length > 0 && backendKey && (
                      <div className='w-px h-12 bg-teal-500/30 mx-1' />
                    )}
                    {backendKey
                      ? backendKey.split('-').map((letter, i) => (
                          <motion.div
                            key={`key-${letter}-${i}`}
                            initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{
                              duration: 0.6,
                              delay: 1.2 + i * 0.3,
                              type: 'spring',
                              stiffness: 200,
                            }}
                            className='w-16 h-20 bg-[#0a1f22] border-2 border-teal-500/60 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.2)]'
                          >
                            <span className='text-teal-400 text-3xl font-[JetBrains_Mono,monospace]'>
                              {letter.toUpperCase()}
                            </span>
                          </motion.div>
                        ))
                      : (
                        <span className='text-gray-500 text-sm font-[JetBrains_Mono,monospace]'>
                          KEY FRAGMENT PENDING
                        </span>
                      )}
                  </div>
                  <p className='text-gray-600 text-xs mt-4 font-[JetBrains_Mono,monospace]'>
                    {backendKey
                      ? `FRAGMENT 3 OF ? // COLLECTED: ${previousKeys.map((k) => k.replace('-', ', ')).join(', ')}${previousKeys.length > 0 ? ', ' : ''}${backendKey.replace('-', ', ')}`
                      : 'ROOM KEY NOT YET AVAILABLE'}
                  </p>
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
                  onClick={onRetry}
                  className='px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2'
                >
                  Retry Room
                  <ChevronRight className='w-4 h-4' />
                </button>
              )}
              {passed && onProceedToRoom4 && (
                <button
                  onClick={onProceedToRoom4}
                  className='px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2'
                >
                  Proceed to Room 4
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
