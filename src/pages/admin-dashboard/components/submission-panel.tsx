import { useState } from 'react'
import { Check, X, Send } from 'lucide-react'
import { motion } from 'motion/react'

import type { AdminNotification, QuestionFeedback } from '@/entities/notification'

interface Props {
  submission: AdminNotification
  onSubmitFeedback: (
    submissionId: number,
    roomId: number,
    feedback: QuestionFeedback[],
    loeQuestionId?: number,
    loeAnswer?: string,
  ) => void
}

export function SubmissionPanel({ submission, onSubmitFeedback }: Props) {
  const [decisions, setDecisions] = useState<Record<number, boolean | null>>({})

  const setDecision = (questionId: number, approved: boolean) => {
    setDecisions((prev) => ({ ...prev, [questionId]: approved }))
  }

  const nonLoeAnswers = submission.answers.filter((a) => !a.isLoe)
  const allDecided = nonLoeAnswers.every(
    (a) => decisions[a.questionId] !== null && decisions[a.questionId] !== undefined,
  )

  const handleSubmit = () => {
    const feedback: QuestionFeedback[] = nonLoeAnswers.map((a) => ({
      questionId: a.questionId,
      answer: a.answerText,
      approved: decisions[a.questionId]!,
    }))

    const loeAnswerDetail = submission.answers.find((a) => a.isLoe)
    const loeQuestionId = submission.loeQuestionId || loeAnswerDetail?.questionId
    const loeAnswer = submission.loeAnswer || loeAnswerDetail?.answerText

    onSubmitFeedback(submission.submissionId, submission.roomId, feedback, loeQuestionId, loeAnswer)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-4'
    >
      <div className='flex justify-between items-start mb-3'>
        <div>
          <h3 className='text-white font-bold'>{submission.missionName}</h3>
          <p className='text-gray-500 text-xs font-[JetBrains_Mono,monospace]'>
            Mission #{submission.missionId} &middot; {submission.roomName}
          </p>
        </div>
        <time
          className='text-gray-600 text-[10px] font-[JetBrains_Mono,monospace]'
          title={submission.submittedAt}
        >
          {new Date(submission.submittedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      </div>

      <div className='space-y-3'>
        {submission.answers.map((a) => {
          if (a.isLoe) {
            return (
              <div
                key={a.questionId}
                className='bg-teal-500/5 border border-teal-500/10 rounded-xl p-3'
              >
                <div className='flex items-center gap-2 mb-1'>
                  <span className='px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-wider'>
                    LOE Question
                  </span>
                  <p className='text-gray-400 text-xs'>{a.questionText}</p>
                </div>
                <p className='text-teal-200 text-sm font-semibold leading-relaxed'>
                  {a.answerText}
                </p>
              </div>
            )
          }

          const decision = decisions[a.questionId]
          return (
            <div
              key={a.questionId}
              className='bg-white/[0.03] border border-white/5 rounded-xl p-3'
            >
              <p className='text-gray-400 text-xs mb-1'>{a.questionText}</p>
              <p className='text-gray-200 text-sm leading-relaxed mb-3'>{a.answerText}</p>

              <div className='flex gap-2'>
                <button
                  onClick={() => setDecision(a.questionId, true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                    decision === true
                      ? 'bg-teal-500/30 border-teal-500/50 text-teal-200'
                      : 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/30 text-teal-300'
                  }`}
                >
                  <Check className='w-3.5 h-3.5' /> Approve
                </button>
                <button
                  onClick={() => setDecision(a.questionId, false)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                    decision === false
                      ? 'bg-red-500/30 border-red-500/50 text-red-200'
                      : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-300'
                  }`}
                >
                  <X className='w-3.5 h-3.5' /> Reject
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className='mt-4 flex justify-end'>
        <button
          onClick={handleSubmit}
          disabled={!allDecided}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors border ${
            allDecided
              ? 'bg-teal-500/20 hover:bg-teal-500/30 border-teal-500/30 text-teal-300 cursor-pointer'
              : 'bg-gray-500/10 border-gray-500/20 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send className='w-4 h-4' /> Submit Feedback
        </button>
      </div>
    </motion.div>
  )
}
