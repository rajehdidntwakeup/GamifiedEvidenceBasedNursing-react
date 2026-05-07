import { motion } from 'motion/react'
import { AlertTriangle, ChevronRight } from 'lucide-react'

interface TimeExpiredScreenProps {
  onBack: () => void
  onRetry: () => void
}

export function TimeExpiredScreen({ onBack, onRetry }: TimeExpiredScreenProps) {
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
            You ran out of time before submitting your analysis.
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button
              onClick={onBack}
              className='px-6 py-3 bg-white/5 border border-white/10 hover:border-teal-500/40 text-white rounded-xl transition-colors'
            >
              Back to Missions
            </button>
            <button
              onClick={onRetry}
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
