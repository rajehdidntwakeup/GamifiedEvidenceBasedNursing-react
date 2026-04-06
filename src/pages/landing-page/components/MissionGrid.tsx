import { ArrowLeft, Lock } from "lucide-react";
import { motion } from "motion/react";

import { MISSIONS } from "../landing-page.data";
import type { LandingMission } from "../landing-page.data";

import { MissionCard } from "./MissionCard";

interface MissionGridProps {
  onBack: () => void;
  onSelectMission: (mission: { id: number; apiMission: string }) => void;
  missions?: string[]; // Optional mission titles from backend
}

// Get mission data from MISSIONS array by title (matches backend response)
function getMissionByTitle(title: string): LandingMission | undefined {
  return MISSIONS.find(m => m.title === title);
}

export function MissionGrid({ onBack, onSelectMission, missions }: MissionGridProps) {
  // Use backend missions if available, otherwise show all hardcoded missions
  const availableMissions: LandingMission[] = missions && missions.length > 0
    ? missions.filter(title => {
        const mission = getMissionByTitle(title);
        return mission !== undefined;
      }).map(title => getMissionByTitle(title)!) : MISSIONS;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a1f22]/95 backdrop-blur-md overflow-y-auto">
      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}
      />

      <div className="relative z-10 px-6 md:px-12 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Base</span>
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300">
            <Lock className="w-4 h-4" />
            <span className="font-[JetBrains_Mono,monospace] text-sm">SELECT YOUR MISSION</span>
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl text-white mb-4">Choose Your Challenge</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Each mission presents a unique clinical scenario. Select one to begin your evidence-based nursing investigation.
          </p>
        </motion.div>

        {/* Mission List */}
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {availableMissions.map((mission, index) => (
            <MissionCard
              key={mission.apiMission}
              mission={mission}
              onSelect={onSelectMission}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
