import { motion } from 'motion/react'
import { X } from 'lucide-react'
import type { Study } from '../room-of-analytics.data'

interface StudyModalProps {
  study: Study
  pdfSrc?: string
  onClose: () => void
}

export function StudyModal({ study, pdfSrc, onClose }: StudyModalProps) {
  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='bg-[#faf9f6] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto relative shadow-2xl'
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-10 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors'
        >
          <X className='w-4 h-4 text-gray-700' />
        </button>

        {pdfSrc ? (
          <iframe src={pdfSrc} title='Study PDF' className='w-full h-[80vh]' />
        ) : (
          <div className='p-8'>
            <div className='border-b-2 border-gray-800 pb-4 mb-6'>
              <p className='text-gray-500 text-xs tracking-wider uppercase mb-1'>
                {study.journal} &bull; {study.year} &bull; Original Research
              </p>
              <h2 className='text-gray-900 text-lg' style={{ lineHeight: 1.4 }}>
                {study.title}
              </h2>
              <p className='text-gray-600 text-sm mt-2'>{study.authors}</p>
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
                  {study.sections[section.key as keyof typeof study.sections]}
                </p>
              </div>
            ))}

            <div className='mt-6 pt-4 border-t border-gray-200'>
              <span className='text-gray-400 text-xs font-[JetBrains_Mono,monospace]'>
                STUDY DOCUMENT // READ CAREFULLY BEFORE COMPLETING TASKS
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
