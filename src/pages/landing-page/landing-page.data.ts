import { Brain, Heart, Stethoscope, Syringe, Thermometer } from "lucide-react";

import type { MissionApi } from "@/services/api";

// LandingMission type - defined locally in this file
export interface LandingMission {
  id: number;
  apiMission: MissionApi;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }> | null;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
}

export const MISSIONS: LandingMission[] = [
  {
    id: 1,
    apiMission: "WOUND_CARE_FOR_PRESSURE_ULCERS" as MissionApi,
    title: "Wundversorgung bei Dekubitus",
    subtitle: "MISSION 01",
    icon: Stethoscope,
    color: "teal",
    borderColor: "border-teal-500/40",
    bgColor: "bg-teal-500/10",
    textColor: "text-teal-400",
  },
  {
    id: 2,
    apiMission: "FALL_PREVENTION_IN_GERIATRICS" as MissionApi,
    title: "Sturzprävention in der Geriatrie",
    subtitle: "MISSION 02",
    icon: Syringe,
    color: "orange",
    borderColor: "border-orange-500/40",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-400",
  },
  {
    id: 3,
    apiMission: "PAIN_MANAGEMENT_IN_POSTOPERATIVE_CARE" as MissionApi,
    title: "Schmerzmanagement in der postoperativen Pflege",
    subtitle: "MISSION 03",
    icon: Heart,
    color: "red",
    borderColor: "border-red-500/40",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
  },
  {
    id: 4,
    apiMission: "NUTRITIONAL_INTERVENTIONS_FOR_MALNUTRITION" as MissionApi,
    title: "Ernährungsinterventionen bei Mangelernährung",
    subtitle: "MISSION 04",
    icon: Thermometer,
    color: "green",
    borderColor: "border-green-500/40",
    bgColor: "bg-green-500/10",
    textColor: "text-green-400",
  },
  {
    id: 5,
    apiMission: "PREVENTION_OF_CATHETER_ASSOCIATED_URINARY_TRACT_INFECTIONS" as MissionApi,
    title: "Vermeidung von Katheter-assoziierten Harnwegsinfektionen",
    subtitle: "MISSION 05",
    icon: Brain,
    color: "purple",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
  },
];
