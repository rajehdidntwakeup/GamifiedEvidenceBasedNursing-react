import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Clock,
  Swords,
  ChevronRight,
  AlertTriangle,
  Trophy,
  KeyRound,
  FileText,
  X,
  Search,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Scale,
  ShieldCheck,
  BarChart3,
  PenLine,
} from "lucide-react";

interface Mission {
  id: number;
  title: string;
  subtitle: string;
  textColor: string;
  bgColor: string;
}

interface RoomOfSciencebattleProps {
  mission: Mission;
  onBack: () => void;
  onProceedToFinalStage?: () => void;
}

interface StudyCompact {
  id: string;
  label: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  sections: {
    background: string;
    objective: string;
    methods: string;
    results: string;
    conclusion: string;
  };
  loe: string;
  studyDesign: string;
  sampleSize: string;
  keyStrengths: string[];
  keyWeaknesses: string[];
}

interface StudyPair {
  context: string;
  intervention: string;
  studyA: StudyCompact;
  studyB: StudyCompact;
  betterStudy: string; // "A" or "B"
  rationale: string[];
}

const loeOptions = [
  { value: "", label: "Select Level of Evidence..." },
  { value: "Level I", label: "Level I — Systematic Reviews / Meta-analyses" },
  { value: "Level II", label: "Level II — Randomized Controlled Trials" },
  { value: "Level III", label: "Level III — Controlled Trials (no randomization)" },
  { value: "Level IV", label: "Level IV — Case-Control / Cohort Studies" },
  { value: "Level V", label: "Level V — Systematic Reviews of Descriptive Studies" },
  { value: "Level VI", label: "Level VI — Single Descriptive / Qualitative Study" },
  { value: "Level VII", label: "Level VII — Expert Opinion" },
];

const studyPairsByMission: Record<number, StudyPair> = {
  1: {
    context:
      "A preliminary search was conducted to find another study that supports the use of structured rounding protocols with early warning scores for early detection of clinical deterioration.",
    intervention: "Structured rounding with early warning score integration",
    studyA: {
      id: "A",
      label: "Study A (Previously Reviewed)",
      title:
        "Effect of Structured Rounding Protocols on Early Detection of Clinical Deterioration in Medical-Surgical Patients",
      authors: "Brennan, C. L., Foster, J. A., & Yamamoto, S.",
      journal: "Journal of Clinical Nursing",
      year: 2023,
      sections: {
        background:
          "Clinical deterioration in hospitalized patients often goes unrecognized until a critical event occurs. Structured rounding protocols using early warning scores (EWS) have been proposed to improve early detection, yet adoption remains inconsistent across healthcare settings.",
        objective:
          "To evaluate whether implementing a structured hourly rounding protocol integrated with the Modified Early Warning Score (MEWS) improves early detection of clinical deterioration compared to standard nursing care.",
        methods:
          "A quasi-experimental pre-post design was used across three medical-surgical units in a 450-bed community hospital. Pre-intervention (6 months, N=1,247) used standard care with 4-hour assessments. Intervention (6 months, N=1,312) implemented hourly rounds with MEWS. Nurses received 4-hour training. Day shifts only. No randomization performed.",
        results:
          "RRT activations decreased by 34% (p=0.018). Unplanned ICU transfers declined by 28% (p=0.041). Cardiac arrests showed non-significant decrease (p=0.312). Nurse compliance averaged 73% (range: 61-84%). No sample size calculation reported. No confidence intervals provided.",
        conclusion:
          "Structured hourly rounding with MEWS integration shows promise for reducing clinical deterioration events. Further research using randomized designs is needed.",
      },
      loe: "Level III",
      studyDesign: "Quasi-experimental pre-post",
      sampleSize: "N=2,559 (1,247 pre, 1,312 post)",
      keyStrengths: [
        "Large sample across three units",
        "Clear, measurable primary outcomes",
        "Practical intervention feasible with minimal resources",
        "Statistically significant reduction in RRT activations and ICU transfers",
      ],
      keyWeaknesses: [
        "No randomization or control group",
        "Day shifts only — night shift not standardized",
        "Variable compliance (61-84%) across units",
        "No sample size calculation or confidence intervals",
        "Pre-post design susceptible to Hawthorne effect",
      ],
    },
    studyB: {
      id: "B",
      label: "Study B (New Supporting Study)",
      title:
        "Cluster-Randomized Trial of Modified Early Warning Score-Driven Nursing Surveillance on Patient Outcomes in Acute Care Wards",
      authors: "Karlsson, A. M., Ochieng, D., & Whitfield, R.",
      journal: "BMJ Quality & Safety",
      year: 2024,
      sections: {
        background:
          "Early warning scores (EWS) have been recommended by international guidelines to detect clinical deterioration, but evidence from randomized trials on their impact when integrated into nursing surveillance remains sparse. Most existing evidence comes from before-after studies with limited ability to establish causality.",
        objective:
          "To determine whether a MEWS-driven structured nursing surveillance protocol reduces unplanned ICU admissions and in-hospital mortality compared to standard nursing observation schedules in acute medical and surgical wards.",
        methods:
          "A cluster-randomized controlled trial was conducted across 16 acute care wards in four hospitals (N=4,218 patients). Wards were randomized 1:1 to intervention (MEWS-driven surveillance with automated escalation triggers, 8 wards) or control (standard observation schedules, 8 wards). The intervention included electronic MEWS calculation at every patient contact, automated escalation alerts, and mandatory senior review for MEWS ≥5. All nursing shifts (day and night) were included. Primary outcomes: unplanned ICU admissions and 30-day in-hospital mortality. Assessors blinded to allocation. Analysis was intention-to-treat with adjustment for clustering. A priori power calculation based on 20% reduction in ICU admissions (power=80%, alpha=0.05). Follow-up: 12 months.",
        results:
          "Unplanned ICU admissions decreased by 31% in the intervention group (adjusted OR=0.69, 95% CI: 0.54-0.88, p=0.003). 30-day mortality was lower in the intervention group (3.2% vs. 4.8%, adjusted OR=0.65, 95% CI: 0.46-0.92, p=0.015). Time to first escalation for deteriorating patients was significantly shorter (median 18 min vs. 47 min, p<0.001). Protocol adherence was 87% across intervention wards (range: 79-94%). No significant difference in length of stay. Sensitivity analysis excluding one outlier hospital confirmed robustness of primary results.",
        conclusion:
          "MEWS-driven nursing surveillance significantly reduces unplanned ICU admissions and in-hospital mortality. The automated escalation component appears critical to effectiveness. Implementation across all nursing shifts is feasible and recommended.",
      },
      loe: "Level II",
      studyDesign: "Cluster-RCT",
      sampleSize: "N=4,218 across 16 wards in 4 hospitals",
      keyStrengths: [
        "Cluster-randomized controlled trial — higher evidence level",
        "Large, multi-site sample (4 hospitals, 16 wards)",
        "Included all nursing shifts (day and night)",
        "A priori power calculation performed",
        "Blinded outcome assessors",
        "Confidence intervals and ITT analysis reported",
        "Sensitivity analysis confirmed robustness",
        "Higher protocol adherence (87%) than Study A",
      ],
      keyWeaknesses: [
        "Cluster randomization means individual patients not randomized",
        "Staff not blinded to intervention (Hawthorne effect possible)",
        "No significant difference in length of stay",
        "Automated escalation adds technology dependency",
      ],
    },
    betterStudy: "B",
    rationale: [
      "Study B is a cluster-randomized controlled trial (Level II) vs. Study A's quasi-experimental design (Level III), providing stronger evidence for causality",
      "Study B includes blinded assessors, a priori power calculation, confidence intervals, and ITT analysis — addressing key methodological gaps in Study A",
      "Study B covers all nursing shifts (24-hour coverage) while Study A only studied day shifts, improving generalizability",
      "Study B has a larger sample (N=4,218 vs. N=2,559) across more sites (4 hospitals vs. 1)",
      "Study B achieved higher protocol adherence (87%) compared to Study A (73%), suggesting better implementation fidelity",
      "Study B demonstrated statistically significant mortality reduction, a clinically critical outcome that Study A did not measure",
    ],
  },
  2: {
    context:
      "A preliminary search was conducted to find another study that supports the collaborative deprescribing intervention for reducing polypharmacy in long-term care.",
    intervention: "Nurse-pharmacist collaborative deprescribing",
    studyA: {
      id: "A",
      label: "Study A (Previously Reviewed)",
      title:
        "Nurse-Pharmacist Collaborative Deprescribing in Polypharmacy: A Prospective Cohort Study in Long-Term Care",
      authors: "Van der Berg, R., Takahashi, M., & O'Sullivan, K.",
      journal: "Annals of Pharmacotherapy",
      year: 2024,
      sections: {
        background:
          "Polypharmacy affects up to 60% of long-term care residents and is associated with increased adverse drug events, falls, hospitalizations, and cognitive decline. Collaborative deprescribing models have been proposed but evidence in long-term care remains limited.",
        objective:
          "To evaluate the effectiveness of a nurse-pharmacist collaborative deprescribing intervention on medication burden, adverse drug events, and quality of life in long-term care residents.",
        methods:
          "Prospective cohort study in 8 long-term care facilities over 12 months. Intervention (4 facilities, N=186): monthly nurse-pharmacist medication reviews using STOPP/START and Beers criteria. Comparison (4 facilities, N=172): usual annual pharmacy reviews. Facilities assigned by geographic convenience. Residents with MMSE <18 excluded.",
        results:
          "Mean reduction of 2.3 medications per resident in intervention (95% CI: 1.8-2.8, p<0.001) vs. 0.4 in comparison. ADEs decreased 41% (IRR=0.59, 95% CI: 0.43-0.81). Falls: non-significant reduction. Hospitalizations decreased 23% (p=0.028). QoL improved significantly.",
        conclusion:
          "Collaborative deprescribing significantly reduces medication burden and adverse drug events. Healthcare organizations should consider implementing collaborative programs.",
      },
      loe: "Level IV",
      studyDesign: "Prospective Cohort",
      sampleSize: "N=358 (186 intervention, 172 comparison)",
      keyStrengths: [
        "Used validated deprescribing criteria (STOPP/START, Beers)",
        "12-month follow-up period",
        "Measured multiple relevant outcomes",
        "Sample size based on pilot study",
      ],
      keyWeaknesses: [
        "Non-randomized — geographic convenience allocation",
        "Excluded residents with cognitive impairment (MMSE <18)",
        "Facilities assigned by convenience — selection bias",
        "Comparison group only had annual reviews — inactive comparator",
        "No blinding",
      ],
    },
    studyB: {
      id: "B",
      label: "Study B (New Supporting Study)",
      title:
        "Randomized Controlled Trial of Interprofessional Deprescribing Rounds vs. Usual Pharmacy Review in Residential Aged Care",
      authors: "Nguyen, T. H., Blackmore, C., & Johansson, S.",
      journal: "Age and Ageing",
      year: 2025,
      sections: {
        background:
          "Polypharmacy-related harm remains a leading safety concern in residential aged care. While deprescribing is recommended, optimal delivery models are unclear. Interprofessional approaches may improve uptake and safety, but randomized evidence in aged care is sparse.",
        objective:
          "To determine whether interprofessional deprescribing rounds led by a nurse-pharmacist team reduce potentially inappropriate medications and adverse drug events compared to usual pharmacy review in residential aged care.",
        methods:
          "A pragmatic, parallel-group cluster-randomized controlled trial was conducted across 12 residential aged care facilities (N=412 residents). Facilities were randomized 1:1 to interprofessional deprescribing rounds (6 facilities, N=214) or usual pharmacy review (6 facilities, N=198). Intervention: fortnightly nurse-pharmacist rounds using STOPP/START v2, Beers 2023, and STOPPFrail criteria. All residents included regardless of cognitive status. Primary outcome: number of potentially inappropriate medications (PIMs) at 6 months. Secondary: ADEs, falls, hospitalizations, and mortality. Assessors blinded. ITT analysis. Power calculation performed (80% power, alpha 0.05). Follow-up: 12 months.",
        results:
          "PIMs reduced by 2.8 per resident in intervention vs. 0.6 in control (mean difference −2.2, 95% CI: −2.7 to −1.7, p<0.001). ADEs decreased 38% (IRR=0.62, 95% CI: 0.48−0.80, p<0.001). Falls reduced by 22% (IRR=0.78, 95% CI: 0.63−0.97, p=0.024). Hospitalizations reduced by 19% (p=0.042). No increase in mortality. Subgroup analysis showed benefit across cognitive status groups including dementia residents. Protocol adherence: 91%.",
        conclusion:
          "Interprofessional deprescribing rounds significantly reduce inappropriate medications and associated harms across all resident subgroups. Including cognitively impaired residents is feasible and beneficial. This model should be adopted as standard practice.",
      },
      loe: "Level II",
      studyDesign: "Cluster-RCT",
      sampleSize: "N=412 across 12 facilities",
      keyStrengths: [
        "Cluster-RCT design (Level II evidence)",
        "Included all residents regardless of cognitive status",
        "Used multiple validated criteria including STOPPFrail",
        "Blinded assessors, ITT analysis, power calculation",
        "Falls reached statistical significance (unlike Study A)",
        "High protocol adherence (91%)",
        "12-month follow-up with safety monitoring",
      ],
      keyWeaknesses: [
        "Cluster randomization (not individual-level)",
        "Pragmatic design — some variation in implementation",
        "Staff awareness of allocation (no staff blinding)",
      ],
    },
    betterStudy: "B",
    rationale: [
      "Study B is a cluster-RCT (Level II) vs. Study A's cohort design (Level IV), providing substantially stronger causal evidence",
      "Study B included all residents regardless of cognitive status, while Study A excluded MMSE <18 — making Study B more generalizable to the real population",
      "Study B achieved statistical significance for falls reduction (p=0.024) — a key outcome that Study A could not demonstrate",
      "Study B used blinded assessors, ITT analysis, and a priori power calculation, addressing Study A's methodological limitations",
      "Study B had higher protocol adherence (91% vs. not reported for Study A) and a larger overall sample",
    ],
  },
  3: {
    context:
      "A preliminary search was conducted to find another study that supports the use of high-fidelity simulation training for improving cardiac arrest response performance.",
    intervention: "High-fidelity simulation training for cardiac arrest response",
    studyA: {
      id: "A",
      label: "Study A (Previously Reviewed)",
      title:
        "Effect of High-Fidelity Simulation Training on Nurses' Performance During In-Hospital Cardiac Arrest: A Randomized Controlled Trial",
      authors: "Lindqvist, E., Patel, N. K., & Russo, M.",
      journal: "Resuscitation",
      year: 2024,
      sections: {
        background:
          "In-hospital cardiac arrest outcomes depend on speed and quality of initial response. While simulation training is widely adopted, evidence on whether HFS translates to improved real-world performance is limited.",
        objective:
          "To determine whether quarterly HFS training improves nurses' resuscitation performance during actual cardiac arrests compared to annual standard BLS recertification.",
        methods:
          "Cluster-RCT across 12 units in 3 academic medical centers (N=342 nurses). Units randomized to quarterly HFS (6 units) or annual BLS (6 units) over 18 months. 89 actual IHCA events occurred. Assessors blinded. ITT analysis. Power calculation performed.",
        results:
          "Shorter time to first compression (28s vs. 45s, p<0.001). Shorter defibrillation time (2.1 vs. 3.4 min, p=0.003). Better CPR quality metrics. ROSC not significant (62.5% vs. 51.2%, p=0.274). Self-efficacy significantly higher. Attrition 3.5%.",
        conclusion:
          "Quarterly HFS significantly improves process metrics during actual arrests. Organizations should invest in regular simulation training.",
      },
      loe: "Level II",
      studyDesign: "Cluster-RCT",
      sampleSize: "N=342 nurses, 89 IHCA events",
      keyStrengths: [
        "RCT design with blinded assessors",
        "Measured actual performance during real cardiac arrests",
        "Low attrition (3.5%)",
        "Appropriate statistical analysis",
      ],
      keyWeaknesses: [
        "Only 89 events — may be underpowered for ROSC",
        "Academic medical centers only — limited generalizability",
        "ROSC (most clinically meaningful) not significant",
        "Hawthorne effect possible",
        "Only partial blinding",
      ],
    },
    studyB: {
      id: "B",
      label: "Study B (New Supporting Study)",
      title:
        "Multi-Center Stepped-Wedge Trial of Monthly In-Situ Simulation on Cardiac Arrest Survival in Community and Academic Hospitals",
      authors: "Garcia-Hernandez, P., Lee, J. W., & Thompson, A. K.",
      journal: "Critical Care Medicine",
      year: 2025,
      sections: {
        background:
          "In-situ simulation (ISS) — simulation conducted in the actual clinical environment — may better translate to real-world performance than skills lab-based simulation. While prior studies show process improvements, evidence linking simulation frequency to patient survival across diverse hospital settings is limited.",
        objective:
          "To evaluate whether monthly in-situ simulation training improves return of spontaneous circulation (ROSC) and survival to discharge following in-hospital cardiac arrest compared to standard annual BLS/ACLS recertification.",
        methods:
          "A stepped-wedge cluster-randomized trial across 24 units in 8 hospitals (4 academic, 4 community) over 24 months (N=612 nurses). Units sequentially crossed from control (annual certification) to intervention (monthly 30-minute in-situ simulation) at 3-month intervals. Primary outcome: ROSC rate during actual IHCA events (N=247 events). Secondary: time to compressions, defibrillation time, CPR quality, survival to discharge. Assessors blinded. Analysis adjusted for temporal trends, clustering, and hospital type. A priori power calculation for 15% ROSC improvement. ITT analysis with sensitivity analyses.",
        results:
          "ROSC rates improved significantly in intervention phases (71.2% vs. 54.8%, adjusted OR=2.03, 95% CI: 1.34-3.08, p=0.001). Survival to discharge improved (42.1% vs. 31.6%, adjusted OR=1.58, 95% CI: 1.04-2.40, p=0.032). Time to compressions improved (22s vs. 41s, p<0.001). CPR quality: compression depth 5.4 vs. 4.8 cm (p=0.004). Benefits consistent across academic and community hospitals. Protocol adherence 84% (range: 72-96%). No difference in nurse burnout scores.",
        conclusion:
          "Monthly in-situ simulation significantly improves both ROSC and survival to discharge. Benefits are consistent across hospital types. The in-situ approach is feasible without increasing burnout. This model should be standard practice for cardiac arrest preparedness.",
      },
      loe: "Level II",
      studyDesign: "Stepped-wedge cluster-RCT",
      sampleSize: "N=612 nurses, 247 IHCA events across 8 hospitals",
      keyStrengths: [
        "Larger sample of cardiac arrest events (247 vs. 89)",
        "ROSC reached statistical significance (unlike Study A)",
        "Survival to discharge also significant — ultimate patient outcome",
        "Included both academic AND community hospitals",
        "Stepped-wedge design controls for temporal trends",
        "Assessed nurse burnout — no negative effect",
        "Blinded assessors, ITT analysis, power calculation",
      ],
      keyWeaknesses: [
        "Stepped-wedge design more complex and harder to interpret",
        "Variable adherence (72-96%) across sites",
        "Cannot fully separate ISS effect from increased frequency effect",
        "Staff not blinded to intervention phase",
      ],
    },
    betterStudy: "B",
    rationale: [
      "Study B demonstrated statistically significant ROSC improvement (p=0.001) — the most clinically critical outcome that Study A failed to achieve (p=0.274)",
      "Study B additionally showed significant survival to discharge, providing the strongest patient-centered evidence",
      "Study B had nearly 3× more cardiac arrest events (247 vs. 89), providing much greater statistical power for meaningful outcomes",
      "Study B included both academic and community hospitals, dramatically improving generalizability over Study A's academic-only setting",
      "Both are Level II evidence, but Study B's broader scope, larger sample, and significant patient outcomes make it the stronger supporting study",
    ],
  },
  4: {
    context:
      "A preliminary search was conducted to find another study that supports the use of UV-C disinfection as an adjunct to standard terminal cleaning for reducing healthcare-associated C. difficile infections.",
    intervention: "UV-C room disinfection for C. difficile prevention",
    studyA: {
      id: "A",
      label: "Study A (Previously Reviewed)",
      title:
        "Impact of Ultraviolet-C Room Disinfection on Healthcare-Associated Clostridioides difficile Infection Rates: A Multicenter Stepped-Wedge Trial",
      authors: "Ibrahim, A. S., Chen, L., & Morales-Garcia, P.",
      journal: "Infection Control & Hospital Epidemiology",
      year: 2024,
      sections: {
        background:
          "Healthcare-associated C. difficile infections remain a significant challenge. Standard terminal cleaning often fails to eliminate spores. UV-C disinfection has emerged as an adjunct but rigorous evidence is limited.",
        objective:
          "To evaluate UV-C room disinfection as an adjunct to standard terminal cleaning in reducing HA-CDI rates in acute care hospitals.",
        methods:
          "Stepped-wedge cluster-randomized trial across 6 hospitals over 24 months. Hospitals crossed from control to intervention at 4-month intervals. Primary outcome: HA-CDI per 10,000 patient-days. Environmental staff not blinded. Compliance averaged 81% (68-93%).",
        results:
          "HA-CDI decreased 27% (IRR=0.73, 95% CI: 0.58-0.92, p=0.008). Environmental contamination decreased 64%. MRSA: non-significant reduction. VRE: no change. Higher baseline CDI hospitals showed greater reductions.",
        conclusion:
          "UV-C disinfection significantly reduces C. difficile infections. Should be prioritized in high-CDI settings.",
      },
      loe: "Level II",
      studyDesign: "Stepped-wedge cluster-RCT",
      sampleSize: "6 hospitals, 24 months",
      keyStrengths: [
        "Stepped-wedge RCT design",
        "Environmental bioburden measured objectively",
        "Significant CDI reduction",
        "Adequate power calculation",
      ],
      keyWeaknesses: [
        "Environmental staff not blinded",
        "Compliance variation (68-93%)",
        "MRSA/VRE not significantly reduced",
        "Cannot isolate UV-C from improved cleaning behavior",
        "Wide baseline CDI variation between hospitals",
      ],
    },
    studyB: {
      id: "B",
      label: "Study B (New Supporting Study)",
      title:
        "Randomized Controlled Trial of Automated UV-C Disinfection With Real-Time Compliance Monitoring on Healthcare-Associated Infections in Intensive Care Units",
      authors: "Park, S. Y., Williams, G. R., & Fernandez-Ortega, J.",
      journal: "The Lancet Infectious Diseases",
      year: 2025,
      sections: {
        background:
          "UV-C disinfection has shown promise in reducing healthcare-associated infections (HAIs), but prior studies have been limited by variable compliance and inability to separate UV-C efficacy from Hawthorne effects on manual cleaning. Automated UV-C systems with real-time compliance monitoring may address these limitations.",
        objective:
          "To evaluate the effectiveness of an automated UV-C disinfection system with electronic compliance monitoring in reducing CDI and other HAIs in ICU settings, controlling for manual cleaning quality.",
        methods:
          "A parallel-group cluster-randomized trial across 20 ICUs in 10 hospitals (N=18,432 patient-days). ICUs randomized 1:1 to automated UV-C + standard cleaning (10 ICUs) or standard cleaning alone (10 ICUs) over 18 months. Electronic sensors monitored UV-C deployment compliance AND manual cleaning thoroughness (fluorescent marker removal) in both arms. Primary: HA-CDI rate. Secondary: MRSA, VRE, overall HAI rate, environmental bioburden. Assessors and infection control staff blinded to allocation. ITT analysis. Power calculation performed. Manual cleaning quality controlled as covariate.",
        results:
          "HA-CDI decreased 39% in UV-C group (adjusted IRR=0.61, 95% CI: 0.47-0.79, p<0.001). MRSA decreased 28% (IRR=0.72, 95% CI: 0.56-0.93, p=0.012). Overall HAI rate reduced by 24% (p=0.003). UV-C compliance: 94% (automated deployment). Manual cleaning quality did not differ between groups (p=0.67), confirming UV-C as the active component. Environmental bioburden 71% lower in UV-C rooms. VRE: non-significant trend (IRR=0.81, p=0.09). Effect consistent across hospital types.",
        conclusion:
          "Automated UV-C disinfection significantly reduces CDI, MRSA, and overall HAI rates. Controlling for manual cleaning quality confirms UV-C as the causative mechanism. Automated systems achieve near-perfect compliance. This study provides the strongest evidence to date for UV-C adoption.",
      },
      loe: "Level II",
      studyDesign: "Parallel-group cluster-RCT",
      sampleSize: "20 ICUs across 10 hospitals, 18,432 patient-days",
      keyStrengths: [
        "Controlled for manual cleaning quality — isolates UV-C effect",
        "Automated compliance monitoring (94%) eliminates adherence concerns",
        "MRSA AND CDI both significantly reduced (Study A only CDI)",
        "Blinded infection control staff and assessors",
        "Larger scale (20 ICUs vs. 6 hospitals)",
        "Confirmed UV-C as causative mechanism",
        "Appropriate statistical controls and ITT analysis",
      ],
      keyWeaknesses: [
        "ICU-only setting — may not generalize to general wards",
        "Automated systems require capital investment",
        "VRE still non-significant",
        "18 months may not capture long-term sustainability",
      ],
    },
    betterStudy: "B",
    rationale: [
      "Study B controlled for manual cleaning quality, isolating UV-C as the active intervention — addressing the major confound in Study A",
      "Study B achieved higher compliance (94% automated vs. 81% manual) ensuring more reliable effect estimates",
      "Study B demonstrated significant MRSA reduction in addition to CDI, showing broader antimicrobial impact",
      "Study B blinded infection control staff, reducing detection bias present in Study A",
      "Both are Level II, but Study B's methodological rigor (controlled confounders, automated compliance, blinding) provides stronger evidence",
    ],
  },
  5: {
    context:
      "A preliminary search was conducted to find another study that supports nurse-led chronic pain self-management programs in primary care.",
    intervention: "Nurse-led chronic pain self-management program",
    studyA: {
      id: "A",
      label: "Study A (Previously Reviewed)",
      title:
        "Effectiveness of a Nurse-Led Chronic Pain Self-Management Program in Primary Care: A Pragmatic Randomized Controlled Trial",
      authors: "Hofmann, L., Adebayo, T., & McAllister, S.",
      journal: "Pain Management Nursing",
      year: 2024,
      sections: {
        background:
          "Chronic non-cancer pain affects ~20% of adults worldwide. With opioid curtailment, non-pharmacological self-management approaches are needed. Nurse-led programs show promise but evidence in primary care is limited.",
        objective:
          "To evaluate a 12-week nurse-led CPSMP vs. usual care on pain intensity, disability, and self-efficacy in primary care.",
        methods:
          "Pragmatic parallel-group RCT across 14 clinics (N=284). Individual randomization. 8 group sessions over 12 weeks. Assessors blinded. ITT with multiple imputation. 23% attended <5/8 sessions. 12-month retention 74%.",
        results:
          "Pain severity reduced (BPI difference −1.4, p<0.001). Disability reduced (ODI −8.2, p<0.001). Self-efficacy improved. Opioid use decreased. Effects attenuated at 12 months but remained significant (BPI −0.9, p=0.004). Greater effects in moderate vs. severe pain.",
        conclusion:
          "Nurse-led CPSMP significantly reduces pain and disability. Effects attenuate at 12 months, suggesting need for booster sessions.",
      },
      loe: "Level II",
      studyDesign: "Pragmatic RCT",
      sampleSize: "N=284 across 14 clinics",
      keyStrengths: [
        "Individual randomization",
        "ITT analysis with multiple imputation",
        "Assessors blinded",
        "12-month follow-up",
        "Opioid reduction demonstrated",
      ],
      keyWeaknesses: [
        "Participants not blinded — self-reported outcomes biased",
        "23% poor session attendance",
        "26% attrition at 12 months",
        "Effects attenuated over time",
        "Greater effects in moderate vs. severe pain — limits generalizability",
      ],
    },
    studyB: {
      id: "B",
      label: "Study B (New Supporting Study)",
      title:
        "Nurse-Led Pain Self-Management With Digital Booster Sessions: A Multi-Center Randomized Trial With 24-Month Follow-Up",
      authors: "Andersen, K. R., DaSilva, F., & Murray, J. E.",
      journal: "The Journal of Pain",
      year: 2025,
      sections: {
        background:
          "Nurse-led self-management programs for chronic pain show short-term benefits, but effects often attenuate over time. Digital health booster sessions may sustain gains, but this combination has not been tested in a rigorous trial with long-term follow-up.",
        objective:
          "To evaluate the effectiveness and sustainability of a nurse-led chronic pain self-management program augmented with monthly digital booster sessions compared to usual care over 24 months.",
        methods:
          "A multi-center, parallel-group RCT across 22 primary care clinics (N=486 adults with chronic non-cancer pain ≥6 months). Individual randomization stratified by pain severity (moderate/severe) and clinic. Intervention: 10 in-person group sessions over 12 weeks plus monthly 30-minute video booster sessions for 12 months. Usual care per treating physician. Primary: BPI severity at 12 months. Secondary: ODI, PSEQ, opioid use, healthcare utilization. Assessors blinded. ITT analysis. Power calculation for BPI difference of 1.0 (power=90%, alpha=0.05). 24-month follow-up. Retention: 82% at 12 months, 76% at 24 months. Session attendance: 84% attended ≥8/10 sessions.",
        results:
          "BPI severity at 12 months: mean difference −1.8 (95% CI: −2.3 to −1.3, p<0.001). At 24 months: −1.5 (95% CI: −2.1 to −0.9, p<0.001) — effects sustained. Disability: ODI −10.4 at 12 months (p<0.001), −8.7 at 24 months (p<0.001). Self-efficacy improved and maintained. Opioid use decreased from 36% to 18% in intervention vs. 35% to 29% in control (p=0.004). Healthcare utilization (pain-related visits) decreased 31% (p=0.001). Benefits consistent across moderate and severe pain subgroups. Booster session engagement averaged 78% over 12 months.",
        conclusion:
          "Nurse-led self-management with digital boosters provides sustained pain and disability reduction through 24 months. The digital booster model addresses the attenuation effect seen in prior programs. Benefits extend to severe pain populations. This should become the standard model for nurse-led chronic pain programs.",
      },
      loe: "Level II",
      studyDesign: "Parallel-group RCT",
      sampleSize: "N=486 across 22 clinics",
      keyStrengths: [
        "Larger sample (N=486 vs. 284) across more clinics (22 vs. 14)",
        "24-month follow-up shows sustained effects (Study A's effects attenuated)",
        "Digital booster component addresses Study A's main limitation",
        "Higher session attendance (84% vs. 77% in Study A)",
        "Better retention (82% at 12mo vs. 74%)",
        "Benefits consistent across moderate AND severe pain",
        "Reduced healthcare utilization — cost-effectiveness indicator",
        "90% power, stratified randomization, blinded assessors",
      ],
      keyWeaknesses: [
        "Participants still not blinded — self-reported outcomes",
        "Digital literacy required — may exclude some populations",
        "Booster engagement declined over time (78% average)",
        "Cannot separate in-person from digital booster effects",
      ],
    },
    betterStudy: "B",
    rationale: [
      "Study B directly addresses Study A's key limitation (effect attenuation) by incorporating digital booster sessions that sustain improvements through 24 months",
      "Study B has a larger sample (N=486 vs. 284), more sites (22 vs. 14), and better retention (82% vs. 74%), providing more robust evidence",
      "Study B demonstrates benefits in BOTH moderate and severe pain populations, while Study A's effects were greater only in moderate pain",
      "Study B's 24-month follow-up (vs. 12 months) provides critical evidence for long-term sustainability",
      "Both are Level II, but Study B's design improvements, sustained outcomes, and broader effectiveness make it the stronger study",
    ],
  },
};

const TOTAL_TIME = 20 * 60; // 20 minutes
const JUSTIFICATION_MIN_WORDS = 40;

export function RoomOfSciencebattle({ mission, onBack, onProceedToFinalStage }: RoomOfSciencebattleProps) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Viewing expanded study
  const [viewingStudy, setViewingStudy] = useState<"A" | "B" | null>(null);

  // Task states
  const [selectedLoEA, setSelectedLoEA] = useState("");
  const [selectedLoEB, setSelectedLoEB] = useState("");
  const [betterStudyChoice, setBetterStudyChoice] = useState<"A" | "B" | "">("");
  const [justificationText, setJustificationText] = useState("");
  const [comparisonNotes, setComparisonNotes] = useState("");

  const [results, setResults] = useState<{
    loeACorrect: boolean;
    loeBCorrect: boolean;
    betterStudyCorrect: boolean;
    justificationOk: boolean;
    comparisonOk: boolean;
    overallScore: number;
    overallTotal: number;
  } | null>(null);

  const pair = studyPairsByMission[mission.id] || studyPairsByMission[1];

  // Timer
  useEffect(() => {
    if (isComplete || timeExpired) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeExpired(true);
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isComplete, timeExpired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerPercent = (timeLeft / TOTAL_TIME) * 100;
  const isTimerWarning = timeLeft < 300;
  const isTimerCritical = timeLeft < 60;

  const wordCount = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

  const handleSubmit = () => {
    const loeACorrect = selectedLoEA === pair.studyA.loe;
    const loeBCorrect = selectedLoEB === pair.studyB.loe;
    const betterStudyCorrect = betterStudyChoice === pair.betterStudy;
    const justificationOk = wordCount(justificationText) >= JUSTIFICATION_MIN_WORDS;
    const comparisonOk = wordCount(comparisonNotes) >= 20;

    const overallTotal = 5;
    let overallScore = 0;
    if (loeACorrect) overallScore++;
    if (loeBCorrect) overallScore++;
    if (betterStudyCorrect) overallScore++;
    if (justificationOk) overallScore++;
    if (comparisonOk) overallScore++;

    setResults({
      loeACorrect,
      loeBCorrect,
      betterStudyCorrect,
      justificationOk,
      comparisonOk,
      overallScore,
      overallTotal,
    });
    setIsComplete(true);
  };

  const handleRetry = () => {
    setTimeLeft(TOTAL_TIME);
    setTimeExpired(false);
    setIsComplete(false);
    setResults(null);
    setSelectedLoEA("");
    setSelectedLoEB("");
    setBetterStudyChoice("");
    setJustificationText("");
    setComparisonNotes("");
  };

  const passed = results ? results.overallScore >= 3 : false;
  const percentage = results ? Math.round((results.overallScore / results.overallTotal) * 100) : 0;

  const canSubmit =
    selectedLoEA !== "" &&
    selectedLoEB !== "" &&
    betterStudyChoice !== "" &&
    wordCount(justificationText) >= 20 &&
    wordCount(comparisonNotes) >= 10;

  // Render a study card
  const renderStudyCard = (study: StudyCompact, side: "A" | "B") => (
    <div
      className="group bg-[#faf9f6] rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-shadow"
      onClick={() => setViewingStudy(side)}
    >
      <div className="bg-gray-100 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <p className="text-gray-500 text-xs tracking-wider uppercase">
            {study.label}
          </p>
        </div>
        <span className="text-xs text-gray-400 font-[JetBrains_Mono,monospace]">
          CLICK TO EXPAND
        </span>
      </div>
      <div className="p-5 max-h-[50vh] overflow-y-auto">
        <h3 className="text-gray-900 text-sm mb-2" style={{ lineHeight: 1.5 }}>
          {study.title}
        </h3>
        <p className="text-gray-500 text-xs mb-1">{study.authors}</p>
        <p className="text-gray-400 text-xs mb-4">
          {study.journal} &bull; {study.year}
        </p>
        {[
          { key: "background", label: "Background" },
          { key: "objective", label: "Objective" },
          { key: "methods", label: "Methods" },
          { key: "results", label: "Results" },
          { key: "conclusion", label: "Conclusion" },
        ].map((section) => (
          <div key={section.key} className="mb-3">
            <h4 className="text-gray-700 text-xs tracking-wider uppercase mb-1">
              {section.label}
            </h4>
            <p className="text-gray-600 text-xs" style={{ lineHeight: 1.7 }}>
              {study.sections[section.key as keyof typeof study.sections]}
            </p>
          </div>
        ))}
        <div className="mt-3 pt-2 border-t border-gray-200 flex items-center gap-2 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <Search className="w-4 h-4" />
          <span className="text-xs">Click to view full-screen</span>
        </div>
      </div>
    </div>
  );

  // Full study modal
  const studyModalData = viewingStudy === "A" ? pair.studyA : viewingStudy === "B" ? pair.studyB : null;
  const studyModal = viewingStudy !== null && studyModalData && (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#faf9f6] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto relative shadow-2xl"
      >
        <button
          onClick={() => setViewingStudy(null)}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>

        <div className="p-8">
          <div className="border-b-2 border-gray-800 pb-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 text-xs mb-2">
              {studyModalData.label}
            </div>
            <p className="text-gray-500 text-xs tracking-wider uppercase mb-1">
              {studyModalData.journal} &bull; {studyModalData.year} &bull; {studyModalData.studyDesign}
            </p>
            <h2 className="text-gray-900 text-lg" style={{ lineHeight: 1.4 }}>
              {studyModalData.title}
            </h2>
            <p className="text-gray-600 text-sm mt-2">{studyModalData.authors}</p>
          </div>

          {[
            { key: "background", label: "Background" },
            { key: "objective", label: "Objective" },
            { key: "methods", label: "Methods" },
            { key: "results", label: "Results" },
            { key: "conclusion", label: "Conclusion" },
          ].map((section) => (
            <div key={section.key} className="mb-5">
              <h3 className="text-gray-800 text-sm tracking-wider uppercase mb-2">
                {section.label}
              </h3>
              <p className="text-gray-700 text-sm" style={{ lineHeight: 1.8 }}>
                {studyModalData.sections[section.key as keyof typeof studyModalData.sections]}
              </p>
            </div>
          ))}

          {/* Quick reference: design details */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="text-gray-700 text-xs tracking-wider uppercase mb-3">Quick Reference</h4>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Study Design</span>
                <span className="text-gray-800">{studyModalData.studyDesign}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Sample Size</span>
                <span className="text-gray-800">{studyModalData.sampleSize}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Level of Evidence</span>
                <span className="text-gray-800">{studyModalData.loe}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <span className="text-gray-400 text-xs font-[JetBrains_Mono,monospace]">
              STUDY {viewingStudy} // COMPARE CAREFULLY WITH THE OTHER STUDY
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Results screen
  if (isComplete && results) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto font-[Inter,sans-serif]">
        <div
          className="absolute inset-0 z-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {timeExpired && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-6">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-[JetBrains_Mono,monospace] text-sm">TIME EXPIRED</span>
                </div>
              )}
              <div
                className={`w-20 h-20 rounded-2xl ${passed ? "bg-teal-500/20" : "bg-orange-500/20"} flex items-center justify-center mx-auto mb-6`}
              >
                {passed ? (
                  <Trophy className="w-10 h-10 text-teal-400" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-orange-400" />
                )}
              </div>
              <h2 className="text-3xl text-white mb-2 tracking-tight">
                {timeExpired ? "Time's Up!" : passed ? "Room Cleared!" : "Room Failed"}
              </h2>
              <p className="text-gray-400 mb-8">
                {passed
                  ? "Exceptional evidence comparison, Agent. You've proven your ability to distinguish study quality."
                  : "Refine your evidence appraisal skills and try again, Agent."}
              </p>

              {/* Score overview */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Tasks Completed</span>
                  <span className="text-white text-2xl font-[JetBrains_Mono,monospace]">
                    {results.overallScore}/{results.overallTotal}
                  </span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={`h-full rounded-full ${passed ? "bg-teal-500" : "bg-orange-500"}`}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{percentage}% tasks passed</span>
                  <span className={passed ? "text-teal-400" : "text-orange-400"}>
                    {passed ? "PASSED" : "3 of 5 tasks required"}
                  </span>
                </div>
              </div>

              {/* Task breakdown */}
              <div className="space-y-3 mb-8 text-left">
                {/* LoE A */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-1">
                    {results.loeACorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="text-white text-sm">Level of Evidence — Study A</span>
                  </div>
                  {!results.loeACorrect && (
                    <div className="ml-8">
                      <p className="text-xs text-red-300">
                        Your answer: {selectedLoEA || "(empty)"}{" "}
                        <span className="text-teal-400 ml-1">Correct: {pair.studyA.loe}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* LoE B */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-1">
                    {results.loeBCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="text-white text-sm">Level of Evidence — Study B</span>
                  </div>
                  {!results.loeBCorrect && (
                    <div className="ml-8">
                      <p className="text-xs text-red-300">
                        Your answer: {selectedLoEB || "(empty)"}{" "}
                        <span className="text-teal-400 ml-1">Correct: {pair.studyB.loe}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Better study choice */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-1">
                    {results.betterStudyCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="text-white text-sm">Better Evidence Identification</span>
                  </div>
                  {!results.betterStudyCorrect && (
                    <div className="ml-8">
                      <p className="text-xs text-red-300">
                        Your answer: Study {betterStudyChoice || "—"}{" "}
                        <span className="text-teal-400 ml-1">Correct: Study {pair.betterStudy}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Justification */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    {results.justificationOk ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="text-white text-sm">Decision Justification</span>
                    <span className="text-gray-500 text-xs ml-auto font-[JetBrains_Mono,monospace]">
                      {results.justificationOk ? "Sufficient detail" : `Min. ${JUSTIFICATION_MIN_WORDS} words required`}
                    </span>
                  </div>
                </div>

                {/* Comparison notes */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    {results.comparisonOk ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="text-white text-sm">Methodological Comparison</span>
                    <span className="text-gray-500 text-xs ml-auto font-[JetBrains_Mono,monospace]">
                      {results.comparisonOk ? "Sufficient detail" : "Min. 20 words required"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rationale (learning feedback) */}
              <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-5 mb-8 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-teal-400" />
                  <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-sm">
                    WHY STUDY {pair.betterStudy} PROVIDES BETTER EVIDENCE
                  </span>
                </div>
                <ul className="space-y-2">
                  {pair.rationale.map((point, i) => (
                    <li key={i} className="text-gray-400 text-sm flex gap-2">
                      <span className="text-teal-500 shrink-0">&#8250;</span>
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Strengths / weaknesses comparison */}
                <div className="mt-4 pt-4 border-t border-teal-500/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-xs mb-2 block">
                      STUDY A — KEY WEAKNESSES
                    </span>
                    <ul className="space-y-1">
                      {pair.studyA.keyWeaknesses.map((w, i) => (
                        <li key={i} className="text-gray-500 text-xs flex gap-2">
                          <span className="text-orange-400 shrink-0">•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-xs mb-2 block">
                      STUDY B — KEY STRENGTHS
                    </span>
                    <ul className="space-y-1">
                      {pair.studyB.keyStrengths.map((s, i) => (
                        <li key={i} className="text-gray-500 text-xs flex gap-2">
                          <span className="text-green-400 shrink-0">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Clue Letters */}
              {passed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(20,184,166,0.3) 2px, rgba(20,184,166,0.3) 4px)",
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <KeyRound className="w-5 h-5 text-teal-400" />
                      <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-sm">
                        CLUE LETTERS UNLOCKED
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-5">
                      The final letters revealed! Your collection is complete.
                    </p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {["E", "C", "F", "O", "L", "R"].map((letter) => (
                        <div
                          key={`prev-${letter}`}
                          className="w-11 h-14 bg-[#0a1f22]/60 border border-white/10 rounded-lg flex items-center justify-center opacity-40"
                        >
                          <span className="text-gray-500 text-lg font-[JetBrains_Mono,monospace]">{letter}</span>
                        </div>
                      ))}
                      <div className="w-px h-12 bg-teal-500/30 mx-1" />
                      {["N", "E"].map((letter, i) => (
                        <motion.div
                          key={`new-${letter}-${i}`}
                          initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 1.6 + i * 0.3,
                            type: "spring",
                            stiffness: 200,
                          }}
                          className="w-16 h-20 bg-[#0a1f22] border-2 border-teal-500/60 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.2)]"
                        >
                          <span className="text-teal-400 text-3xl font-[JetBrains_Mono,monospace]">
                            {letter}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-gray-600 text-xs mt-4 font-[JetBrains_Mono,monospace]">
                      FRAGMENT 4 OF 4 // ALL LETTERS COLLECTED: E, C, F, O, L, R, N, E
                    </p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                      className="mt-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg"
                    >
                      <p className="text-teal-300 text-sm font-[JetBrains_Mono,monospace]">
                        🔓 All 8 letters unlocked! Unscramble them to solve the case...
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-white/5 border border-white/10 hover:border-teal-500/40 text-white rounded-xl transition-colors"
                >
                  Back to Missions
                </button>
                {!passed && (
                  <button
                    onClick={handleRetry}
                    className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Retry Room
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {passed && onProceedToFinalStage && (
                  <button
                    onClick={onProceedToFinalStage}
                    className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Solve the Case
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Time expired without submission
  if (isComplete && !results) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto font-[Inter,sans-serif]">
        <div
          className="absolute inset-0 z-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-6">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-[JetBrains_Mono,monospace] text-sm">TIME EXPIRED</span>
            </div>
            <div className="w-20 h-20 rounded-2xl bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-orange-400" />
            </div>
            <h2 className="text-3xl text-white mb-2">Time's Up!</h2>
            <p className="text-gray-400 mb-8">
              You ran out of time before submitting your evidence comparison.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onBack}
                className="px-6 py-3 bg-white/5 border border-white/10 hover:border-teal-500/40 text-white rounded-xl transition-colors"
              >
                Back to Missions
              </button>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Retry Room <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main room UI
  return (
    <div className="fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto font-[Inter,sans-serif]">
      {studyModal}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top bar */}
        <div className="px-6 md:px-12 py-4 border-b border-white/10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Abort Mission</span>
            </button>

            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-teal-400" />
              <span className="text-white font-[JetBrains_Mono,monospace] text-sm">
                ROOM 4 — SCIENCEBATTLE
              </span>
            </div>

            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                isTimerCritical
                  ? "bg-red-500/10 border-red-500/40 text-red-400"
                  : isTimerWarning
                    ? "bg-orange-500/10 border-orange-500/40 text-orange-400"
                    : "bg-white/5 border-white/10 text-white"
              }`}
            >
              <Clock className={`w-4 h-4 ${isTimerCritical ? "animate-pulse" : ""}`} />
              <span className="font-[JetBrains_Mono,monospace] text-sm tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Timer bar */}
        <div className="w-full h-1 bg-white/5">
          <motion.div
            className={`h-full ${
              isTimerCritical
                ? "bg-red-500"
                : isTimerWarning
                  ? "bg-orange-500"
                  : "bg-teal-500"
            }`}
            style={{ width: `${timerPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl text-white mb-3 tracking-tight">
                The <span className="text-teal-400">Science Battle</span>
              </h2>
              <p className="text-gray-400 max-w-3xl mx-auto text-sm mb-4">
                {pair.context}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300">
                <Scale className="w-4 h-4" />
                <span className="font-[JetBrains_Mono,monospace] text-xs">
                  COMPARE BOTH STUDIES — DETERMINE WHICH PROVIDES BETTER EVIDENCE — JUSTIFY YOUR DECISION
                </span>
              </div>
            </motion.div>

            {/* Two studies side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {renderStudyCard(pair.studyA, "A")}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {renderStudyCard(pair.studyB, "B")}
              </motion.div>
            </div>

            {/* Analysis Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              {/* TASK 1: LoE for Study A */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white text-sm">Level of Evidence — Study A</span>
                    <p className="text-gray-500 text-xs">Classify the previously reviewed study on the evidence pyramid</p>
                  </div>
                </div>
                <div className="p-5">
                  <select
                    value={selectedLoEA}
                    onChange={(e) => setSelectedLoEA(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none text-sm appearance-none cursor-pointer"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                    }}
                  >
                    {loeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#0f2a2e] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TASK 2: LoE for Study B */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white text-sm">Level of Evidence — Study B</span>
                    <p className="text-gray-500 text-xs">Classify the new supporting study on the evidence pyramid</p>
                  </div>
                </div>
                <div className="p-5">
                  <select
                    value={selectedLoEB}
                    onChange={(e) => setSelectedLoEB(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none text-sm appearance-none cursor-pointer"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                    }}
                  >
                    {loeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#0f2a2e] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TASK 3: Which study provides better evidence? */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                    <Scale className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white text-sm">Better Evidence</span>
                    <p className="text-gray-500 text-xs">
                      Which study provides the better evidence for the intervention?
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setBetterStudyChoice("A")}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        betterStudyChoice === "A"
                          ? "border-teal-500 bg-teal-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            betterStudyChoice === "A" ? "border-teal-500" : "border-white/30"
                          }`}
                        >
                          {betterStudyChoice === "A" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                          )}
                        </div>
                        <span className={`text-sm ${betterStudyChoice === "A" ? "text-teal-400" : "text-white"}`}>
                          Study A
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-2">{pair.studyA.studyDesign} — {pair.studyA.sampleSize}</p>
                    </button>
                    <button
                      onClick={() => setBetterStudyChoice("B")}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        betterStudyChoice === "B"
                          ? "border-teal-500 bg-teal-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            betterStudyChoice === "B" ? "border-teal-500" : "border-white/30"
                          }`}
                        >
                          {betterStudyChoice === "B" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                          )}
                        </div>
                        <span className={`text-sm ${betterStudyChoice === "B" ? "text-teal-400" : "text-white"}`}>
                          Study B
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-2">{pair.studyB.studyDesign} — {pair.studyB.sampleSize}</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* TASK 4: Justification */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white text-sm">Justify Your Decision</span>
                    <p className="text-gray-500 text-xs">
                      Explain why your chosen study provides better evidence. Consider study design, level of evidence, sample size, methodological rigor, and clinical outcomes.
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <textarea
                    value={justificationText}
                    onChange={(e) => setJustificationText(e.target.value)}
                    placeholder="Justify your decision by comparing the study designs, levels of evidence, methodological strengths and weaknesses, sample sizes, statistical approaches, outcome significance, and generalizability of both studies..."
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-teal-500 focus:outline-none text-sm resize-y"
                    style={{ lineHeight: 1.7 }}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 text-xs">
                      {wordCount(justificationText)} words
                    </span>
                    <span
                      className={`text-xs ${
                        wordCount(justificationText) >= JUSTIFICATION_MIN_WORDS
                          ? "text-green-400"
                          : "text-gray-600"
                      }`}
                    >
                      Min. {JUSTIFICATION_MIN_WORDS} words
                    </span>
                  </div>
                </div>
              </div>

              {/* TASK 5: Methodological comparison notes */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <PenLine className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white text-sm">Methodological Comparison</span>
                    <p className="text-gray-500 text-xs">
                      Compare the key methodological differences between the two studies (e.g., randomization, blinding, sample selection, compliance, outcome measures).
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <textarea
                    value={comparisonNotes}
                    onChange={(e) => setComparisonNotes(e.target.value)}
                    placeholder="Compare the methodological approaches: How do the study designs differ? What are the key differences in randomization, blinding, sample selection, compliance monitoring, and outcome measurement?"
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-teal-500 focus:outline-none text-sm resize-y"
                    style={{ lineHeight: 1.7 }}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 text-xs">
                      {wordCount(comparisonNotes)} words
                    </span>
                    <span
                      className={`text-xs ${
                        wordCount(comparisonNotes) >= 20
                          ? "text-green-400"
                          : "text-gray-600"
                      }`}
                    >
                      Min. 20 words
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-center pt-4 pb-8">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`px-10 py-4 rounded-xl flex items-center gap-2 transition-all ${
                    canSubmit
                      ? "bg-teal-500 hover:bg-teal-400 text-white hover:scale-105"
                      : "bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Submit Evidence Battle
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
