import { Brain, Heart, Stethoscope, Syringe, Thermometer } from "lucide-react";

import type { MissionApi } from "@/services/api";

export const MISSIONS = [
  {
    id: 1,
    apiMission: "WOUND_CARE_FOR_PRESSURE_ULCERS" as MissionApi,
    title: "The Silent Symptom",
    subtitle: "MISSION 01",
    desc: "A patient presents with unexplained fatigue and abnormal labs. Analyze the evidence trail to uncover the hidden diagnosis before time runs out.",
    icon: Stethoscope,
    xp: 1000,
    color: "teal",
    borderColor: "border-teal-500/40",
    bgColor: "bg-teal-500/10",
    textColor: "text-teal-400",
  },
  {
    id: 2,
    apiMission: "FALL_PREVENTION_IN_GERIATRICS" as MissionApi,
    title: "The Medication Maze",
    subtitle: "MISSION 02",
    desc: "A critical medication error has been flagged. Navigate conflicting drug interactions and research evidence to determine the safest treatment path.",
    icon: Syringe,
    xp: 1000,
    color: "orange",
    borderColor: "border-orange-500/40",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-400",
  },
  {
    id: 3,
    apiMission: "PAIN_MANAGEMENT_IN_POSTOPERATIVE_CARE" as MissionApi,
    title: "Code Blue Protocol",
    subtitle: "MISSION 03",
    desc: "A rapid response situation unfolds. Use evidence-based resuscitation guidelines and critical thinking to stabilize the patient in this high-stakes scenario.",
    icon: Heart,
    xp: 1000,
    color: "red",
    borderColor: "border-red-500/40",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
  },
  {
    id: 4,
    apiMission: "NUTRITIONAL_INTERVENTIONS_FOR_MALNUTRITION" as MissionApi,
    title: "The Infection Detective",
    subtitle: "MISSION 04",
    desc: "A mysterious infection is spreading through the ward. Trace the source using epidemiological evidence and implement evidence-based infection control measures.",
    icon: Thermometer,
    xp: 1000,
    color: "green",
    borderColor: "border-green-500/40",
    bgColor: "bg-green-500/10",
    textColor: "text-green-400",
  },
  {
    id: 5,
    apiMission: "PREVENTION_OF_CATHETER_ASSOCIATED_URINARY_TRACT_INFECTIONS" as MissionApi,
    title: "The Chronic Conundrum",
    subtitle: "MISSION 05",
    desc: "A complex chronic disease patient requires a comprehensive care plan. Synthesize multiple research studies to design an evidence-based management strategy.",
    icon: Brain,
    xp: 1000,
    color: "purple",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
  },
];



export type LandingMission = (typeof MISSIONS)[number];
