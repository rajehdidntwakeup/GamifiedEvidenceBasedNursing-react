import {
  ArrowLeft,
  Clock,
  FlaskConical,
  ChevronRight,
  FileText,
  Search,
  BarChart3,
  ClipboardList,
  PenLine,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import { useSession } from '@/entities/session'
import m1_pdf from '@/shared/assets/analytics/mission1/1_Zhang_et_al_SystematicReview.pdf?url'
import m2_pdf from '@/shared/assets/analytics/mission2/1_Effects_of_VR_Games_in_reducing_fall(2023).pdf?url'
import m3_pdf from '@/shared/assets/analytics/mission3/1_Postoperative_Paintreatment_with_Dementia(2022).pdf?url'
import m4_pdf from '@/shared/assets/analytics/mission4/1_Intervent_and_prevent_Malnutrition.pdf?url'
import m5_pdf from '@/shared/assets/analytics/mission5/1_Urin_Sampling_is_associatet_with_reduced_CAUTI(2021).pdf?url'

import { LOE_OPTIONS, STUDIES_BY_MISSION, TOTAL_TIME } from './room-of-analytics.data'
import type { RoomOfAnalyticsProps } from './room-of-analytics.data'
import { FeedbackOverlay } from './components/FeedbackOverlay'
import { ResultsScreen } from './components/ResultsScreen'
import { TimeExpiredScreen } from './components/TimeExpiredScreen'
import { StudyModal } from './components/StudyModal'
import { useRoomOfAnalytics } from './components/useRoomOfAnalytics'

const analyticsPdfs: Record<string, string> = {
  '1_Zhang_et_al_SystematicReview.pdf': m1_pdf,
  '1_Effects_of_VR_Games_in_reducing_fall(2023).pdf': m2_pdf,
  '1_Postoperative_Paintreatment_with_Dementia(2022).pdf': m3_pdf,
  '1_Intervent_and_prevent_Malnutrition.pdf': m4_pdf,
  '1_Urin_Sampling_is_associatet_with_reduced_CAUTI(2021).pdf': m5_pdf,
}

function getAnalyticsPdf(docPath: string): string | undefined {
  if (!docPath) return undefined
  const filename = docPath.split('/').pop()
  return filename ? analyticsPdfs[filename] : undefined
}

export function RoomOfAnalytics({ mission, onBack, onProceedToRoom4 }: RoomOfAnalyticsProps) {
  const { user } = useSession()
  const {
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
    handleSubmit,
    handleRetry,
  } = useRoomOfAnalytics(mission, user?.token)

  const [viewingStudy, setViewingStudy] = useState<number | null>(null)

  const studies = STUDIES_BY_MISSION[mission.id] || STUDIES_BY_MISSION[1]
  const study = studies[0]
  const pdfSrc =
    roomData && roomData.docs.length > 0 ? getAnalyticsPdf(roomData.docs[0]) : undefined

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timerPercent = (timeLeft / TOTAL_TIME) * 100
  const isTimerWarning = timeLeft < 300
  const isTimerCritical = timeLeft < 60

  const wordCount = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0)

  const canSubmit =
    (lockedFields.methodology || methodologyText.trim() !== '') &&
    (lockedFields.results || resultsText.trim() !== '') &&
    (lockedFields.loe || selectedLoe !== '') &&
    (lockedFields.strengths || strengthsText.trim() !== '') &&
    (lockedFields.weakness || weaknessText.trim() !== '')

  if (isComplete && results) {
    const passed = results.overallScore === 5
    const percentage = Math.round((results.overallScore / results.overallTotal) * 100)

    return (
      <ResultsScreen
        passed={passed}
        timeExpired={timeExpired}
        percentage={percentage}
        overallScore={results.overallScore}
        overallTotal={results.overallTotal}
        results={results}
        selectedLoe={selectedLoe}
        study={study}
        previousKeys={previousKeys}
        backendKey={backendKey}
        onBack={onBack}
        onRetry={handleRetry}
        onProceedToRoom4={onProceedToRoom4}
      />
    )
  }

  if (isComplete && !results) {
    return <TimeExpiredScreen onBack={onBack} onRetry={handleRetry} />
  }

  return (
    <div className='fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto overflow-x-hidden font-[Inter,sans-serif]'>
      {viewingStudy !== null && (
        <StudyModal study={study} pdfSrc={pdfSrc} onClose={() => setViewingStudy(null)} />
      )}

      {isWaitingForFeedback && <FeedbackOverlay progress={progress} />}

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
          <div className='flex items-center justify-between max-w-6xl mx-auto'>
            <button
              onClick={onBack}
              className='flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors'
            >
              <ArrowLeft className='w-5 h-5' />
              <span className='hidden sm:inline'>Abort Mission</span>
            </button>

            <div className='flex items-center gap-2'>
              <FlaskConical className='w-5 h-5 text-teal-400' />
              <span className='text-white font-[JetBrains_Mono,monospace] text-sm'>
                ROOM 3 — ANALYTICS
              </span>
            </div>

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

        <div className='w-full h-1 bg-white/5'>
          <motion.div
            className={`h-full ${
              isTimerCritical ? 'bg-red-500' : isTimerWarning ? 'bg-orange-500' : 'bg-teal-500'
            }`}
            animate={{ width: `${timerPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className='flex-1 overflow-y-auto'>
          <div className='max-w-7xl mx-auto px-4 md:px-8 py-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className='text-center mb-8'
            >
              <h2 className='text-2xl md:text-3xl text-white mb-3 tracking-tight'>
                Critically <span className='text-teal-400'>Analyze</span> the Study
              </h2>
              <p className='text-gray-400 max-w-2xl mx-auto text-sm'>
                Read the research study carefully, then complete the analysis tasks beside it.
                Identify the methodology, summarize results, determine the Level of Evidence, and
                evaluate strengths &amp; weaknesses.
              </p>
            </motion.div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* LEFT: Study Document */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className='lg:sticky lg:top-0 lg:self-start'
              >
                {pdfSrc ? (
                  <div className='bg-[#faf9f6] rounded-2xl overflow-hidden border border-gray-200'>
                    <div className='bg-gray-100 px-6 py-3 border-b border-gray-200 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <FileText className='w-4 h-4 text-gray-500' />
                        <p className='text-gray-500 text-xs tracking-wider uppercase'>Study PDF</p>
                      </div>
                      <button
                        type='button'
                        onClick={() => setViewingStudy(0)}
                        className='text-xs text-teal-600 hover:text-teal-500 font-[JetBrains_Mono,monospace]'
                      >
                        FULL SCREEN →
                      </button>
                    </div>
                    <iframe src={pdfSrc} title='Study PDF' className='w-full h-[65vh]' />
                  </div>
                ) : (
                  <button
                    type='button'
                    className='group bg-[#faf9f6] rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-shadow w-full text-left'
                    onClick={() => setViewingStudy(0)}
                  >
                    <div className='bg-gray-100 px-6 py-3 border-b border-gray-200 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <FileText className='w-4 h-4 text-gray-500' />
                        <p className='text-gray-500 text-xs tracking-wider uppercase'>
                          {study.journal} &bull; {study.year}
                        </p>
                      </div>
                      <span className='text-xs text-gray-400 font-[JetBrains_Mono,monospace]'>
                        CLICK TO EXPAND
                      </span>
                    </div>
                    <div className='p-6 max-h-[65vh] overflow-y-auto'>
                      <h3 className='text-gray-900 text-sm mb-2' style={{ lineHeight: 1.5 }}>
                        {study.title}
                      </h3>
                      <p className='text-gray-500 text-xs mb-4'>{study.authors}</p>

                      {[
                        { key: 'background', label: 'Background' },
                        { key: 'objective', label: 'Objective' },
                        { key: 'methods', label: 'Methods' },
                        { key: 'results', label: 'Results' },
                        { key: 'conclusion', label: 'Conclusion' },
                      ].map((section) => (
                        <div key={section.key} className='mb-4'>
                          <h4 className='text-gray-700 text-xs tracking-wider uppercase mb-1'>
                            {section.label}
                          </h4>
                          <p className='text-gray-600 text-xs' style={{ lineHeight: 1.7 }}>
                            {study.sections[section.key as keyof typeof study.sections]}
                          </p>
                        </div>
                      ))}

                      <div className='mt-4 pt-3 border-t border-gray-200 flex items-center gap-2 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <Search className='w-4 h-4' />
                        <span className='text-xs'>Click to view full-screen</span>
                      </div>
                    </div>
                  </button>
                )}
              </motion.div>

              {/* RIGHT: Analysis Tasks */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className='space-y-6'
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

                {/* TASK 1: Methodology */}
                <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
                  <div className='px-5 py-4 border-b border-white/10 flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center'>
                      <ClipboardList className='w-4 h-4 text-blue-400' />
                    </div>
                    <div className='flex-1'>
                      <span className='text-white text-sm'>Methodology</span>
                      <p className='text-gray-500 text-xs'>
                        Describe the key methodological elements of this study
                      </p>
                    </div>
                    {retryFeedback && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          retryFeedback.methodologyOk
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}
                      >
                        {retryFeedback.methodologyOk ? 'Approved' : 'Needs correction'}
                      </span>
                    )}
                  </div>
                  <div className='p-5'>
                    <textarea
                      value={methodologyText}
                      onChange={(e) => setMethodologyText(e.target.value)}
                      disabled={lockedFields.methodology}
                      placeholder='Describe the methodology: Study design, Location/Setting, Target group/Population, Database/Data source, Samples/Sample size, Intervention/Exposure, Outcome measures...'
                      rows={8}
                      className={`w-full rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none text-sm resize-y ${
                        lockedFields.methodology
                          ? 'bg-white/5 border border-green-500/30 opacity-60 cursor-not-allowed'
                          : retryFeedback && !retryFeedback.methodologyOk
                            ? 'bg-white/5 border border-orange-500/30 focus:border-orange-500'
                            : 'bg-white/5 border border-white/10 focus:border-teal-500'
                      }`}
                      style={{ lineHeight: 1.7 }}
                    />
                    <div className='mt-2'>
                      <span className='text-gray-600 text-xs'>
                        {wordCount(methodologyText)} words
                      </span>
                    </div>
                  </div>
                </div>

                {/* TASK 2: Results */}
                <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
                  <div className='px-5 py-4 border-b border-white/10 flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center'>
                      <PenLine className='w-4 h-4 text-emerald-400' />
                    </div>
                    <div className='flex-1'>
                      <span className='text-white text-sm'>The Results</span>
                      <p className='text-gray-500 text-xs'>
                        Summarize the key findings and statistical outcomes
                      </p>
                    </div>
                    {retryFeedback && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          retryFeedback.resultsOk
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}
                      >
                        {retryFeedback.resultsOk ? 'Approved' : 'Needs correction'}
                      </span>
                    )}
                  </div>
                  <div className='p-5'>
                    <textarea
                      value={resultsText}
                      onChange={(e) => setResultsText(e.target.value)}
                      disabled={lockedFields.results}
                      placeholder='Summarize the main results of the study. Include key statistical findings, significance levels, effect sizes, and any notable outcomes (both significant and non-significant)...'
                      rows={5}
                      className={`w-full rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none text-sm resize-y ${
                        lockedFields.results
                          ? 'bg-white/5 border border-green-500/30 opacity-60 cursor-not-allowed'
                          : retryFeedback && !retryFeedback.resultsOk
                            ? 'bg-white/5 border border-orange-500/30 focus:border-orange-500'
                            : 'bg-white/5 border border-white/10 focus:border-teal-500'
                      }`}
                      style={{ lineHeight: 1.7 }}
                    />
                    <div className='mt-2'>
                      <span className='text-gray-600 text-xs'>{wordCount(resultsText)} words</span>
                    </div>
                  </div>
                </div>

                {/* TASK 3: Level of Evidence */}
                <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
                  <div className='px-5 py-4 border-b border-white/10 flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center'>
                      <BarChart3 className='w-4 h-4 text-purple-400' />
                    </div>
                    <div className='flex-1'>
                      <span className='text-white text-sm'>Level of Evidence</span>
                      <p className='text-gray-500 text-xs'>
                        Classify this study on the evidence pyramid
                      </p>
                    </div>
                    {retryFeedback && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          retryFeedback.loeCorrect
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}
                      >
                        {retryFeedback.loeCorrect ? 'Approved' : 'Needs correction'}
                      </span>
                    )}
                  </div>
                  <div className='p-5'>
                    <select
                      value={selectedLoe}
                      onChange={(e) => setSelectedLoe(e.target.value)}
                      disabled={lockedFields.loe}
                      className={`w-full rounded-lg px-4 py-3 text-white focus:outline-none text-sm appearance-none ${
                        lockedFields.loe
                          ? 'bg-white/5 border border-green-500/30 opacity-60 cursor-not-allowed'
                          : retryFeedback && !retryFeedback.loeCorrect
                            ? 'bg-white/5 border border-orange-500/30 focus:border-orange-500 cursor-pointer'
                            : 'bg-white/5 border border-white/10 focus:border-teal-500 cursor-pointer'
                      }`}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                      }}
                    >
                      {LOE_OPTIONS.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className='bg-[#0a1f22] text-white'
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* TASK 4: Strengths */}
                <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
                  <div className='px-5 py-4 border-b border-white/10 flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center'>
                      <ShieldCheck className='w-4 h-4 text-green-400' />
                    </div>
                    <div className='flex-1'>
                      <span className='text-white text-sm'>Strengths</span>
                      <p className='text-gray-500 text-xs'>
                        What does this study do well? Identify its methodological and design
                        strengths
                      </p>
                    </div>
                    {retryFeedback && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          retryFeedback.strengthsOk
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}
                      >
                        {retryFeedback.strengthsOk ? 'Approved' : 'Needs correction'}
                      </span>
                    )}
                  </div>
                  <div className='p-5'>
                    <textarea
                      value={strengthsText}
                      onChange={(e) => setStrengthsText(e.target.value)}
                      disabled={lockedFields.strengths}
                      placeholder='Identify the strengths of this study. Consider aspects like study design rigor, sample size adequacy, blinding, validated outcome measures, appropriate statistical methods, low attrition rates, or strong generalizability...'
                      rows={5}
                      className={`w-full rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none text-sm resize-y ${
                        lockedFields.strengths
                          ? 'bg-white/5 border border-green-500/30 opacity-60 cursor-not-allowed'
                          : retryFeedback && !retryFeedback.strengthsOk
                            ? 'bg-white/5 border border-orange-500/30 focus:border-orange-500'
                            : 'bg-white/5 border border-white/10 focus:border-teal-500'
                      }`}
                      style={{ lineHeight: 1.7 }}
                    />
                    <div className='mt-2'>
                      <span className='text-gray-600 text-xs'>
                        {wordCount(strengthsText)} words
                      </span>
                    </div>
                  </div>
                </div>

                {/* TASK 5: Weaknesses */}
                <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
                  <div className='px-5 py-4 border-b border-white/10 flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center'>
                      <ShieldAlert className='w-4 h-4 text-orange-400' />
                    </div>
                    <div className='flex-1'>
                      <span className='text-white text-sm'>Weaknesses</span>
                      <p className='text-gray-500 text-xs'>
                        Identify limitations, biases, and threats to validity
                      </p>
                    </div>
                    {retryFeedback && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          retryFeedback.weaknessOk
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}
                      >
                        {retryFeedback.weaknessOk ? 'Approved' : 'Needs correction'}
                      </span>
                    )}
                  </div>
                  <div className='p-5'>
                    <textarea
                      value={weaknessText}
                      onChange={(e) => setWeaknessText(e.target.value)}
                      disabled={lockedFields.weakness}
                      placeholder='Identify the weaknesses and limitations of this study. Consider potential biases (selection, performance, detection, attrition), confounders, lack of blinding or randomization, small sample size, short follow-up, or limited generalizability...'
                      rows={5}
                      className={`w-full rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none text-sm resize-y ${
                        lockedFields.weakness
                          ? 'bg-white/5 border border-green-500/30 opacity-60 cursor-not-allowed'
                          : retryFeedback && !retryFeedback.weaknessOk
                            ? 'bg-white/5 border border-orange-500/30 focus:border-orange-500'
                            : 'bg-white/5 border border-white/10 focus:border-teal-500'
                      }`}
                      style={{ lineHeight: 1.7 }}
                    />
                    <div className='mt-2'>
                      <span className='text-gray-600 text-xs'>{wordCount(weaknessText)} words</span>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className='flex justify-center pb-8'>
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`px-8 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                      canSubmit
                        ? 'bg-teal-500 hover:bg-teal-400 text-white'
                        : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/10'
                    }`}
                  >
                    Submit Analysis
                    <ChevronRight className='w-4 h-4' />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
