import type { Mission } from "@/shared/types/mission";

export interface RoomOfAnalyticsProps {
  mission: Mission;
  onBack: () => void;
  onProceedToRoom4?: () => void;
}

export interface Study {
  id: number;
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
  correctAnswers: {
    loe: string;
    studyDesign: string;
    weaknesses: string[];
    keyAnalysisPoints: string[];
  };
}

export const LOE_OPTIONS = [
  { value: "", label: "Select Level of Evidence..." },
  { value: "Level I", label: "Level I — Systematic Reviews / Meta-analyses" },
  { value: "Level II", label: "Level II — Randomized Controlled Trials" },
  { value: "Level III", label: "Level III — Controlled Trials (no randomization)" },
  { value: "Level IV", label: "Level IV — Case-Control / Cohort Studies" },
  { value: "Level V", label: "Level V — Systematic Reviews of Descriptive Studies" },
  { value: "Level VI", label: "Level VI — Single Descriptive / Qualitative Study" },
  { value: "Level VII", label: "Level VII — Expert Opinion" },
];

// Methodology minimum word count
export const METHODOLOGY_MIN_WORDS = 30;

export const STUDIES_BY_MISSION: Record<number, Study[]> = {
  1: [
    {
      id: 1,
      title: "Effect of Structured Rounding Protocols on Early Detection of Clinical Deterioration in Medical-Surgical Patients",
      authors: "Brennan, C. L., Foster, J. A., & Yamamoto, S.",
      journal: "Journal of Clinical Nursing",
      year: 2023,
      sections: {
        background:
          "Clinical deterioration in hospitalized patients often goes unrecognized until a critical event occurs. Structured rounding protocols using early warning scores (EWS) have been proposed to improve early detection, yet adoption remains inconsistent across healthcare settings. Delayed recognition of deterioration contributes to increased mortality, unplanned ICU admissions, and failure-to-rescue events. Evidence suggests that systematic nursing surveillance can identify subtle changes in patient status before overt deterioration, but the optimal frequency and structure of rounding remains debated.",
        objective:
          "To evaluate whether implementing a structured hourly rounding protocol integrated with the Modified Early Warning Score (MEWS) improves early detection of clinical deterioration compared to standard nursing care in medical-surgical units.",
        methods:
          "A quasi-experimental pre-post design was used across three medical-surgical units in a 450-bed community hospital. The pre-intervention phase (6 months, N = 1,247 patients) used standard care with assessments every 4 hours. The intervention phase (6 months, N = 1,312 patients) implemented structured hourly rounds incorporating MEWS assessment, pain evaluation, positioning, and toileting needs. Nurses received a 4-hour training session on the protocol. Primary outcomes were rapid response team (RRT) activations, unplanned ICU transfers, and in-hospital cardiac arrests. Data were collected from electronic health records and analyzed using chi-square tests and logistic regression. No randomization was performed. The study was conducted on day shifts only (7 AM to 7 PM). Night shift practices were not standardized.",
        results:
          "During the intervention phase, RRT activations decreased by 34% (from 8.2 to 5.4 per 1,000 patient-days, p = 0.018). Unplanned ICU transfers declined by 28% (from 4.1 to 2.9 per 1,000 patient-days, p = 0.041). In-hospital cardiac arrests showed a non-significant decrease (1.2 to 0.9 per 1,000 patient-days, p = 0.312). Nurse compliance with hourly rounding averaged 73% during the intervention period, with significant variation between units (range: 61-84%). Patient satisfaction scores improved by 12% in the intervention group. No sample size calculation was reported. Confidence intervals were not provided for any outcome measures.",
        conclusion:
          "Structured hourly rounding with MEWS integration shows promise for reducing clinical deterioration events. The protocol was feasible to implement with minimal additional resources. These findings support the adoption of systematic surveillance approaches in medical-surgical settings. Further research using rigorous randomized designs is needed to confirm these findings and determine optimal rounding frequencies across different shift patterns.",
      },
      correctAnswers: {
        loe: "Level III",
        studyDesign: "Quasi-experimental",
        weaknesses: [
          "No randomization — quasi-experimental pre-post design limits causal inference",
          "No blinding of nurses or outcome assessors",
          "No sample size calculation reported",
          "Confidence intervals not provided for outcomes",
          "Only day shifts studied — night shift not standardized, limiting generalizability",
          "Variable compliance (61-84%) across units introduces implementation bias",
          "Confounders such as staffing changes, seasonal variation, or concurrent initiatives not controlled",
          "Pre-post design susceptible to Hawthorne effect and temporal trends",
        ],
        keyAnalysisPoints: [
          "The lack of randomization and control group makes it impossible to attribute improvements solely to the intervention",
          "Compliance variation between units suggests implementation fidelity was a significant issue",
          "Excluding night shifts limits the applicability of findings to 24-hour care settings",
          "Statistical significance was not found for cardiac arrests, the most critical outcome",
          "Without confidence intervals, the precision of the effect estimates cannot be assessed",
        ],
      },
    },
  ],
  2: [
    {
      id: 1,
      title: "Nurse-Pharmacist Collaborative Deprescribing in Polypharmacy: A Prospective Cohort Study in Long-Term Care",
      authors: "Van der Berg, R., Takahashi, M., & O'Sullivan, K.",
      journal: "Annals of Pharmacotherapy",
      year: 2024,
      sections: {
        background:
          "Polypharmacy (concurrent use of ≥5 medications) affects up to 60% of long-term care residents and is associated with increased adverse drug events (ADEs), falls, hospitalizations, and cognitive decline. Deprescribing — the planned, supervised process of reducing or stopping inappropriate medications — has gained attention as a strategy to improve outcomes. Collaborative models involving nurses and pharmacists have been proposed but evidence regarding their effectiveness in long-term care settings remains limited.",
        objective:
          "To evaluate the effectiveness of a nurse-pharmacist collaborative deprescribing intervention on medication burden, adverse drug events, and patient-reported quality of life in long-term care residents with polypharmacy.",
        methods:
          "A prospective cohort study was conducted in 8 long-term care facilities over 12 months. The intervention group (4 facilities, N = 186 residents) received structured monthly medication reviews by a nurse-pharmacist team using the STOPP/START criteria and Beers criteria. The comparison group (4 facilities, N = 172 residents) received usual care with annual medication reviews by pharmacy alone. Facilities were assigned to groups based on geographic convenience. Outcomes included number of medications, ADEs, falls, hospitalizations, and quality of life (EQ-5D-5L). Data were analyzed using mixed-effects models adjusting for age, comorbidity burden, and baseline medication count. Residents with cognitive impairment (MMSE < 18) were excluded. Staff blinding was not feasible.",
        results:
          "The intervention group showed a mean reduction of 2.3 medications per resident (95% CI: 1.8-2.8, p < 0.001) compared to 0.4 in the comparison group (p < 0.001 for between-group difference). ADEs decreased by 41% in the intervention group (incidence rate ratio = 0.59, 95% CI: 0.43-0.81). Falls showed a non-significant reduction (IRR = 0.82, 95% CI: 0.64-1.05, p = 0.112). Hospitalizations decreased by 23% (IRR = 0.77, 95% CI: 0.61-0.97, p = 0.028). Quality of life scores improved significantly in the intervention group (mean difference = 0.08, 95% CI: 0.03-0.13). Sample size was based on ADE reduction estimates from a prior pilot study (power = 80%, alpha = 0.05).",
        conclusion:
          "Nurse-pharmacist collaborative deprescribing significantly reduces medication burden and adverse drug events in long-term care residents. The intervention is feasible and well-accepted by staff and residents. Healthcare organizations should consider implementing collaborative deprescribing programs as part of routine long-term care practice.",
      },
      correctAnswers: {
        loe: "Level IV",
        studyDesign: "Cohort Study",
        weaknesses: [
          "Non-randomized — facilities assigned by geographic convenience, introducing selection bias",
          "No blinding of staff or outcome assessors",
          "Excluding residents with cognitive impairment (MMSE < 18) limits generalizability to the most vulnerable population",
          "Facility-level confounders (staffing ratios, organizational culture) not fully controlled",
          "Comparison group received only annual reviews — an inactive comparator inflates effect size",
          "12-month follow-up may be insufficient to assess long-term deprescribing safety",
        ],
        keyAnalysisPoints: [
          "Geographic convenience allocation introduces systematic differences between groups",
          "Excluding cognitively impaired residents removes the population most affected by polypharmacy",
          "The inactive comparison (annual vs. monthly reviews) makes it unclear whether benefits come from frequency or collaboration",
          "Falls reduction was not statistically significant despite being a primary concern with polypharmacy",
        ],
      },
    },
  ],
  3: [
    {
      id: 1,
      title: "Effect of High-Fidelity Simulation Training on Nurses' Performance During In-Hospital Cardiac Arrest: A Randomized Controlled Trial",
      authors: "Lindqvist, E., Patel, N. K., & Russo, M.",
      journal: "Resuscitation",
      year: 2024,
      sections: {
        background:
          "In-hospital cardiac arrest (IHCA) outcomes depend heavily on the speed and quality of the initial response, which is primarily led by bedside nurses. While simulation-based training has been widely adopted, evidence on whether high-fidelity simulation (HFS) training translates to improved real-world resuscitation performance is limited. Most studies evaluate knowledge and confidence rather than actual clinical performance during cardiac arrests.",
        objective:
          "To determine whether quarterly high-fidelity simulation training improves nurses' resuscitation performance during actual in-hospital cardiac arrests compared to annual standard Basic Life Support (BLS) recertification.",
        methods:
          "A cluster-randomized controlled trial was conducted across 12 medical-surgical units in three academic medical centers (N = 342 nurses). Units were randomized to either quarterly HFS training (intervention, 6 units) or annual standard BLS recertification (control, 6 units) over 18 months. Primary outcomes were time to first compression, time to defibrillation, and CPR quality metrics (compression depth and rate) measured during actual IHCA events using defibrillator event logs and code team documentation. Secondary outcomes included ROSC rates and nurse self-efficacy scores. A total of 89 IHCA events occurred during the study period (48 intervention, 41 control). Assessors reviewing defibrillator logs were blinded to group allocation. Sample size was calculated a priori based on a 15-second improvement in time to first compression (power = 85%, alpha = 0.05). Analysis was intention-to-treat.",
        results:
          "The HFS group demonstrated significantly shorter time to first compression (median 28s vs. 45s, p < 0.001) and time to defibrillation for shockable rhythms (median 2.1 min vs. 3.4 min, p = 0.003). CPR quality was higher in the intervention group: mean compression depth (5.3 cm vs. 4.7 cm, p = 0.012) and correct compression rate (78% vs. 61% within target range, p = 0.008). ROSC rates were higher but did not reach statistical significance (62.5% vs. 51.2%, p = 0.274). Self-efficacy scores were significantly higher in the intervention group (p < 0.001). Six nurses in the intervention group left the study due to transfer or resignation (attrition rate 3.5%).",
        conclusion:
          "Quarterly high-fidelity simulation training significantly improves nurses' resuscitation performance metrics during actual cardiac arrests. Organizations should invest in regular simulation-based training to optimize code response quality.",
      },
      correctAnswers: {
        loe: "Level II",
        studyDesign: "RCT",
        weaknesses: [
          "Cluster randomization at unit level means individual nurses were not randomized",
          "Only partial blinding (assessors only) — nurses knew their training condition",
          "Limited to academic medical centers — may not generalize to community hospitals",
          "ROSC (the most clinically meaningful outcome) was not statistically significant",
          "Only 89 cardiac arrest events — may be underpowered for clinical outcomes like survival",
          "Hawthorne effect possible — intervention nurses may perform better due to awareness",
        ],
        keyAnalysisPoints: [
          "Process metrics improved significantly but the ultimate patient outcome (ROSC) was not significant",
          "The gap between statistical significance on process measures and clinical significance of outcomes should be discussed",
          "Academic setting with motivated participants may not reflect real-world implementation challenges",
          "Low attrition rate (3.5%) is a study strength",
        ],
      },
    },
  ],
  4: [
    {
      id: 1,
      title: "Impact of Ultraviolet-C Room Disinfection on Healthcare-Associated Clostridioides difficile Infection Rates: A Multicenter Stepped-Wedge Trial",
      authors: "Ibrahim, A. S., Chen, L., & Morales-Garcia, P.",
      journal: "Infection Control & Hospital Epidemiology",
      year: 2024,
      sections: {
        background:
          "Healthcare-associated Clostridioides difficile infections (HA-CDI) remain a significant challenge in acute care settings, causing substantial morbidity, mortality, and healthcare costs. Standard terminal cleaning with chemical disinfectants often fails to eliminate C. difficile spores from environmental surfaces. Ultraviolet-C (UV-C) light disinfection devices have emerged as an adjunct to manual cleaning, but evidence from rigorous trials in real-world clinical settings is limited.",
        objective:
          "To evaluate the effectiveness of UV-C room disinfection as an adjunct to standard terminal cleaning in reducing HA-CDI rates in acute care hospitals.",
        methods:
          "A stepped-wedge cluster-randomized trial was conducted across 6 acute care hospitals over 24 months. Hospitals sequentially crossed from the control phase (standard terminal cleaning only) to the intervention phase (standard cleaning + UV-C disinfection) at 4-month intervals. The primary outcome was the incidence rate of HA-CDI per 10,000 patient-days. Secondary outcomes included other healthcare-associated infections (MRSA, VRE) and environmental bioburden measured by adenosine triphosphate (ATP) bioluminescence testing. UV-C devices were deployed for all terminal cleans in intervention-phase rooms. Data were analyzed using generalized linear mixed models accounting for the stepped-wedge design, hospital-level clustering, and secular trends. Baseline infection rates varied substantially between hospitals (range: 3.2 to 11.7 per 10,000 patient-days). Environmental services staff were not blinded to the intervention.",
        results:
          "HA-CDI rates decreased by 27% during intervention phases compared to control phases (adjusted IRR = 0.73, 95% CI: 0.58-0.92, p = 0.008). Environmental surface contamination decreased by 64% as measured by ATP levels (p < 0.001). MRSA transmission showed a non-significant reduction (IRR = 0.84, 95% CI: 0.67-1.05). VRE showed no significant change. Compliance with UV-C deployment averaged 81% (range across hospitals: 68-93%). Hospitals with higher baseline CDI rates showed greater absolute reductions. No adverse events related to UV-C exposure were reported. The study was powered for a 25% reduction in CDI with 80% power.",
        conclusion:
          "UV-C disinfection as an adjunct to standard terminal cleaning significantly reduces C. difficile infection rates. Implementation should be prioritized in hospitals with high baseline CDI rates. Consistent deployment compliance is essential for optimal effectiveness.",
      },
      correctAnswers: {
        loe: "Level II",
        studyDesign: "RCT",
        weaknesses: [
          "Environmental services staff not blinded to intervention — may improve manual cleaning during UV-C phases",
          "Wide variation in baseline CDI rates suggests hospital-level confounders",
          "Compliance variation (68-93%) across hospitals affects internal validity",
          "Stepped-wedge design is susceptible to temporal trends and secular changes",
          "Cannot isolate the effect of UV-C from potential changes in other infection prevention practices",
          "MRSA and VRE did not show significant reduction — effect may be pathogen-specific",
        ],
        keyAnalysisPoints: [
          "The lack of blinding means the Hawthorne effect could improve overall cleaning quality during intervention phases",
          "The stepped-wedge design appropriately accounts for temporal trends but cannot eliminate all confounders",
          "Variable compliance suggests implementation feasibility challenges at some sites",
          "The study was adequately powered and used appropriate statistical methods for the design",
        ],
      },
    },
  ],
  5: [
    {
      id: 1,
      title: "Effectiveness of a Nurse-Led Chronic Pain Self-Management Program in Primary Care: A Pragmatic Randomized Controlled Trial",
      authors: "Hofmann, L., Adebayo, T., & McAllister, S.",
      journal: "Pain Management Nursing",
      year: 2024,
      sections: {
        background:
          "Chronic non-cancer pain affects approximately 20% of adults worldwide and is a leading cause of disability. Opioid prescribing for chronic pain has been curtailed due to addiction and overdose risks, creating demand for non-pharmacological self-management approaches. Nurse-led programs have shown promise in chronic disease management but evidence for their effectiveness specifically in chronic pain self-management within primary care remains limited.",
        objective:
          "To evaluate the effectiveness of a 12-week nurse-led chronic pain self-management program (CPSMP) compared to usual care on pain intensity, functional disability, and self-efficacy in adults with chronic non-cancer pain in primary care settings.",
        methods:
          "A pragmatic, parallel-group randomized controlled trial was conducted across 14 primary care clinics (N = 284 adults with chronic non-cancer pain ≥3 months). Participants were individually randomized (1:1) to CPSMP (N = 143) or usual care (N = 141) using computer-generated block randomization. The CPSMP consisted of 8 group sessions over 12 weeks led by trained nurse specialists, covering pain neuroscience education, graded activity, cognitive-behavioral strategies, sleep hygiene, and mindfulness. Usual care continued under treating physician discretion. Primary outcome: Brief Pain Inventory (BPI) severity score at 6 months. Secondary outcomes: Oswestry Disability Index (ODI), Pain Self-Efficacy Questionnaire (PSEQ), and opioid use. Assessments at baseline, 3, 6, and 12 months. Assessors blinded to allocation. Analysis was intention-to-treat with multiple imputation for missing data. Twenty-three percent of intervention participants attended fewer than 5 of 8 sessions. Twelve-month follow-up retention was 74%.",
        results:
          "At 6 months, the CPSMP group showed significantly lower pain severity (BPI mean difference = -1.4, 95% CI: -2.0 to -0.8, p < 0.001) and disability (ODI mean difference = -8.2, 95% CI: -12.1 to -4.3, p < 0.001). Self-efficacy improved significantly (PSEQ mean difference = 6.7, 95% CI: 3.8 to 9.6, p < 0.001). Opioid use decreased in the intervention group (32% to 21%) compared to stable rates in usual care (34% to 31%), p = 0.038. At 12 months, between-group differences in pain severity diminished but remained significant (BPI mean difference = -0.9, 95% CI: -1.5 to -0.3, p = 0.004). Subgroup analysis showed greater effects in participants with moderate pain (BPI 4-6) compared to severe pain (BPI ≥7).",
        conclusion:
          "The nurse-led CPSMP significantly reduces pain severity and disability while improving self-efficacy. Effects attenuate somewhat at 12 months, suggesting the need for booster sessions. Primary care organizations should consider implementing nurse-led self-management programs as a non-pharmacological strategy for chronic pain management.",
      },
      correctAnswers: {
        loe: "Level II",
        studyDesign: "RCT",
        weaknesses: [
          "Participants not blinded (only assessors) — awareness of group allocation may influence self-reported outcomes",
          "23% of intervention participants attended fewer than 5/8 sessions — dosage effect unclear",
          "26% attrition at 12 months may introduce bias despite multiple imputation",
          "Treatment effects attenuated at 12 months — durability of intervention is a concern",
          "Usual care was not standardized across clinics — variable comparison condition",
          "Greater effects in moderate vs. severe pain limits generalizability to highest-need patients",
        ],
        keyAnalysisPoints: [
          "Self-reported outcomes in an unblinded study are susceptible to expectation bias",
          "The pragmatic design improves real-world applicability but reduces internal validity",
          "Declining effects at 12 months suggest the need for maintenance strategies",
          "The study appropriately used ITT analysis and addressed missing data",
        ],
      },
    },
  ],
};

export const TOTAL_TIME = 20 * 60;
