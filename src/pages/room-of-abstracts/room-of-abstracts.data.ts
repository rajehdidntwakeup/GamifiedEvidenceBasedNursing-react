import type { Mission } from "@/shared/types/mission";

export interface RoomOfAbstractsProps {
  mission: Mission;
  onBack: () => void;
  onProceedToRoom3?: () => void;
}

export interface Article {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  abstract: string;
  correctAnswers: {
    titleAuthor: string;
    pyramid: string;
    ahcpr: string;
    studyDesign: string;
  };
}

export interface TableRow {
  titleAuthor: string;
  pyramid: string;
  ahcpr: string;
  studyDesign: string;
}

export const PYRAMID_OPTIONS = [
  { value: "", label: "Select LoE..." },
  { value: "Level I", label: "Level I - Systematic Reviews / Meta-analyses" },
  { value: "Level II", label: "Level II - Randomized Controlled Trials" },
  { value: "Level III", label: "Level III - Controlled Trials (no randomization)" },
  { value: "Level IV", label: "Level IV - Case-Control / Cohort Studies" },
  { value: "Level V", label: "Level V - Systematic Reviews of Descriptive Studies" },
  { value: "Level VI", label: "Level VI - Single Descriptive / Qualitative Study" },
  { value: "Level VII", label: "Level VII - Expert Opinion" },
];

export const AHCPR_OPTIONS = [
  { value: "", label: "Select AHCPR..." },
  { value: "Ia", label: "Ia - Meta-analysis of RCTs" },
  { value: "Ib", label: "Ib - At least one RCT" },
  { value: "IIa", label: "IIa - Controlled study (no randomization)" },
  { value: "IIb", label: "IIb - Quasi-experimental study" },
  { value: "III", label: "III - Non-experimental descriptive studies" },
  { value: "IV", label: "IV - Expert committee reports / opinions" },
];

export const STUDY_DESIGN_OPTIONS = [
  { value: "", label: "Select design..." },
  { value: "Systematic Review", label: "Systematic Review" },
  { value: "Meta-Analysis", label: "Meta-Analysis" },
  { value: "RCT", label: "Randomized Controlled Trial (RCT)" },
  { value: "Cohort Study", label: "Cohort Study" },
  { value: "Case-Control Study", label: "Case-Control Study" },
  { value: "Cross-Sectional Study", label: "Cross-Sectional Study" },
  { value: "Qualitative Study", label: "Qualitative Study" },
  { value: "Case Report", label: "Case Report / Case Series" },
  { value: "Expert Opinion", label: "Expert Opinion / Editorial" },
];

export const TOTAL_TIME = 15 * 60;
