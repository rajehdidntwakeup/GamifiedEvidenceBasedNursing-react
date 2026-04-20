import { KeyRound, X } from 'lucide-react'
import { motion } from 'motion/react'
import React from 'react'

import { getFriendlyPasswordError } from '../model/get-friendly-password-error'
import type { PasswordGateProps } from '../model/types'

export function PasswordGate({
  isOpen,
  onClose,
  password,
  onPasswordChange,
  onSubmit,
  error,
  errorMessage,
  isSubmitting = false,
}: PasswordGateProps) {
  if (!isOpen) return null

  const friendlyErrorMessage = getFriendlyPasswordError(errorMessage)

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    void onSubmit()
  }

  return (
    <div className='fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className='bg-[#0f2a2e] border border-teal-500/30 rounded-2xl p-8 max-w-md w-full relative'
      >
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className='absolute top-4 right-4 text-gray-400 hover:text-white transition-colors'
        >
          <X className='w-5 h-5' />
        </button>

        <div className='text-center mb-6'>
          <div className='w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center mx-auto mb-4'>
            <KeyRound className='w-8 h-8 text-teal-400' />
          </div>
          <h3 className='text-2xl text-white mb-2'>Mission Locked</h3>
          <p className='text-gray-400 text-sm'>
            Enter the mission password provided by your instructor to unlock this challenge.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <input
              type='password'
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={isSubmitting}
              placeholder='Enter mission password...'
              className={`w-full px-4 py-3 bg-white/5 border ${
                error ? 'border-red-500/50' : 'border-white/10'
              } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors`}
            />
            {error && (
              <p className='text-red-400 text-sm mt-2' aria-live='polite'>
                {friendlyErrorMessage}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full px-4 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors'
          >
            {isSubmitting ? 'Unlocking...' : 'Unlock Mission'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
