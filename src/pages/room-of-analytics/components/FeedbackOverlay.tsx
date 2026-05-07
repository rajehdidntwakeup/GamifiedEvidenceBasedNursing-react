import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'

interface FeedbackOverlayProps {
  progress: number
}

export function FeedbackOverlay({ progress }: FeedbackOverlayProps) {
  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1f22]/60 backdrop-blur-xl'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='text-center p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl max-w-sm w-full mx-4'
      >
        <div className='relative w-20 h-20 mx-auto mb-6'>
          <div className='absolute inset-0 rounded-full border-4 border-teal-500/20' />
          <div className='absolute inset-0 rounded-full border-4 border-t-teal-500 animate-spin' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <Loader2 className='w-8 h-8 text-teal-400 animate-pulse' />
          </div>
        </div>
        <h3 className='text-xl text-white mb-2 font-semibold tracking-tight'>
          Analysis Submitted
        </h3>
        <p className='text-gray-400 text-sm mb-6 leading-relaxed'>
          Your analysis has been sent for review. Please wait for the administrator's feedback
          to proceed.
        </p>
        <div className='w-full bg-gray-700/50 rounded-full h-2 overflow-hidden mb-4'>
          <motion.div
            className='bg-teal-500 h-full rounded-full'
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className='flex items-center justify-between mb-4'>
          <span className='text-gray-500 text-xs font-[JetBrains_Mono,monospace]'>
            Review Progress
          </span>
          <span className='text-teal-400 text-xs font-[JetBrains_Mono,monospace]'>
            {progress}%
          </span>
        </div>
        <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400'>
          <span className='w-2 h-2 rounded-full bg-orange-500 animate-ping' />
          <span className='text-xs font-[JetBrains_Mono,monospace] uppercase tracking-wider'>
            Waiting for Admin...
          </span>
        </div>
      </motion.div>
    </div>
  )
}
