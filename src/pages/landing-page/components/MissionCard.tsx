import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import React from 'react'

import type { MissionApi } from '@/services/api'

interface MissionCardProps {
  mission: {
    id: number
    title: string
    subtitle: string
    icon: React.ComponentType<{ className?: string }> | null
    color: string
    borderColor: string
    bgColor: string
    textColor: string
    apiMission: MissionApi
  }
  onSelect: (mission: { id: number; apiMission: string }) => void
  index: number
}

export function MissionCard({ mission, onSelect, index }: MissionCardProps) {
  const Icon = mission.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={() => onSelect(mission)}
      className={`group relative ${mission.bgColor} ${mission.borderColor} border rounded-2xl p-4 cursor-pointer transition-all hover:border-teal-500/60 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] overflow-hidden`}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${mission.textColor.replace('text-', 'from-')}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
      />

      <div className='relative z-10 flex items-center gap-4'>
        {/* Left side: Icon + Subtitle */}
        <div className='flex items-center gap-3 flex-shrink-0'>
          <div
            className={`w-10 h-10 rounded-xl ${mission.bgColor} ${mission.borderColor} border flex items-center justify-center`}
          >
            {Icon && <Icon className={`w-5 h-5 ${mission.textColor}`} />}
          </div>
          <span className={`font-[JetBrains_Mono,monospace] text-xs ${mission.textColor}`}>
            {mission.subtitle}
          </span>
        </div>

        {/* Title */}
        <h3 className='text-lg text-white font-medium flex-grow text-center'>{mission.title}</h3>

        {/* Arrow */}
        <div
          className={`flex items-center gap-1 ${mission.textColor} opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0`}
        >
          <span className='text-sm'>Enter</span>
          <ChevronRight className='w-4 h-4' />
        </div>
      </div>
    </motion.div>
  )
}
