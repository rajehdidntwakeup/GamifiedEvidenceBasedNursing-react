import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Clock,
  FlaskConical,
  ChevronRight,
  AlertTriangle,
  Trophy,
  KeyRound,
  FileText,
  X,
  Search,
  BarChart3,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ClipboardList,
  PenLine,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

interface Mission {
  id: number;
  title: string;
  subtitle: string;
  textColor: string;
  bgColor: string;
}

interface RoomOfAnalyticsProps {
  mission: Mission;
  onBack: () => void;
  onProceedToRoom4?: () => void;
}

interface Study {
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

// Methodology minimum word count
const METHODOLOGY_MIN_WORDS = 30;

const studiesByMission: Record<number, Study[]> = {
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
          "Process metrics improved significantly but the ultimate patient outcome (ROSC) did not reach significance",
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

export function RoomOfAnalytics({ mission, onBack, onProceedToRoom4 }: RoomOfAnalyticsProps) {
  const TOTAL_TIME = 20 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [viewingStudy, setViewingStudy] = useState<number | null>(null);

  // Methodology text
  const [methodologyText, setMethodologyText] = useState("");

  // Results text
  const [resultsText, setResultsText] = useState("");

  // LoE selection
  const [selectedLoe, setSelectedLoe] = useState("");

  // Strengths & Weaknesses
  const [strengthsText, setStrengthsText] = useState("");
  const [weaknessText, setWeaknessText] = useState("");

  const [results, setResults] = useState<{
    methodologyOk: boolean;
    resultsOk: boolean;
    loeCorrect: boolean;
    strengthsOk: boolean;
    weaknessOk: boolean;
    overallScore: number;
    overallTotal: number;
  } | null>(null);

  const studies = studiesByMission[mission.id] || studiesByMission[1];
  const study = studies[0];

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
    const methodologyOk = wordCount(methodologyText) >= METHODOLOGY_MIN_WORDS;
    const resultsOk = wordCount(resultsText) >= 15;
    const loeCorrect = selectedLoe === study.correctAnswers.loe;
    const strengthsOk = wordCount(strengthsText) >= 15;
    const weaknessOk = wordCount(weaknessText) >= 15;

    // Scoring: 5 tasks
    const overallTotal = 5;
    let overallScore = 0;
    if (methodologyOk) overallScore++;
    if (resultsOk) overallScore++;
    if (loeCorrect) overallScore++;
    if (strengthsOk) overallScore++;
    if (weaknessOk) overallScore++;

    setResults({
      methodologyOk,
      resultsOk,
      loeCorrect,
      strengthsOk,
      weaknessOk,
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
    setMethodologyText("");
    setResultsText("");
    setSelectedLoe("");
    setStrengthsText("");
    setWeaknessText("");
  };

  const passed = results ? results.overallScore >= 3 : false;
  const percentage = results ? Math.round((results.overallScore / results.overallTotal) * 100) : 0;

  // Study PDF-style viewer modal
  const studyModal = viewingStudy !== null && (
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
          {/* Journal-style header */}
          <div className="border-b-2 border-gray-800 pb-4 mb-6">
            <p className="text-gray-500 text-xs tracking-wider uppercase mb-1">
              {study.journal} &bull; {study.year} &bull; Original Research
            </p>
            <h2 className="text-gray-900 text-lg" style={{ lineHeight: 1.4 }}>
              {study.title}
            </h2>
            <p className="text-gray-600 text-sm mt-2">{study.authors}</p>
          </div>

          {/* Study sections */}
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
                {study.sections[section.key as keyof typeof study.sections]}
              </p>
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <span className="text-gray-400 text-xs font-[JetBrains_Mono,monospace]">
              STUDY DOCUMENT // READ CAREFULLY BEFORE COMPLETING TASKS
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
                  ? "Outstanding critical analysis, Agent. Your appraisal skills are exceptional."
                  : "Sharpen your analytical lens and try again, Agent."}
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
                {/* Methodology */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    {results.methodologyOk ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="text-white text-sm">Methodology Analysis</span>
                    <span className="text-gray-500 text-xs ml-auto font-[JetBrains_Mono,monospace]">
                      {results.methodologyOk ? "Sufficient detail" : `Min. ${METHODOLOGY_MIN_WORDS} words required`}
                    </span>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    {results.resultsOk ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="text-white text-sm">Results Summary</span>
                    <span className="text-gray-500 text-xs ml-auto font-[JetBrains_Mono,monospace]">
                      {results.resultsOk ? "Sufficient detail" : "Min. 15 words required"}
                    </span>
                  </div>
                </div>

                {/* LoE */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-1">
                    {results.loeCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="text-white text-sm">Level of Evidence</span>
                  </div>
                  {!results.loeCorrect && (
                    <div className="ml-8">
                      <p className="text-xs text-red-300">
                        Your answer: {selectedLoe || "(empty)"}{" "}
                        <span className="text-teal-400 ml-1">Correct: {study.correctAnswers.loe}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Strengths */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    {results.strengthsOk ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="text-white text-sm">Strengths</span>
                    <span className="text-gray-500 text-xs ml-auto font-[JetBrains_Mono,monospace]">
                      {results.strengthsOk ? "Sufficient detail" : "Min. 15 words required"}
                    </span>
                  </div>
                </div>

                {/* Weaknesses */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    {results.weaknessOk ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span className="text-white text-sm">Weaknesses</span>
                    <span className="text-gray-500 text-xs ml-auto font-[JetBrains_Mono,monospace]">
                      {results.weaknessOk ? "Sufficient detail" : "Min. 15 words required"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key analysis points (learning feedback) */}
              <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-5 mb-8 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-teal-400" />
                  <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-sm">KEY ANALYSIS POINTS</span>
                </div>
                <ul className="space-y-2">
                  {study.correctAnswers.keyAnalysisPoints.map((point, i) => (
                    <li key={i} className="text-gray-400 text-sm flex gap-2">
                      <span className="text-teal-500 shrink-0">&#8250;</span>
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Known weaknesses */}
                <div className="mt-4 pt-4 border-t border-teal-500/10">
                  <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-xs mb-2 block">
                    STUDY WEAKNESSES TO IDENTIFY
                  </span>
                  <ul className="space-y-1">
                    {study.correctAnswers.weaknesses.map((w, i) => (
                      <li key={i} className="text-gray-500 text-xs flex gap-2">
                        <span className="text-orange-400 shrink-0">•</span>
                        {w}
                      </li>
                    ))}
                  </ul>
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
                      Two more letters revealed! Your collection grows.
                    </p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      {["E", "C", "F", "O"].map((letter) => (
                        <div
                          key={`prev-${letter}`}
                          className="w-11 h-14 bg-[#0a1f22]/60 border border-white/10 rounded-lg flex items-center justify-center opacity-40"
                        >
                          <span className="text-gray-500 text-lg font-[JetBrains_Mono,monospace]">{letter}</span>
                        </div>
                      ))}
                      <div className="w-px h-12 bg-teal-500/30 mx-1" />
                      {["L", "R"].map((letter, i) => (
                        <motion.div
                          key={letter}
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
                      FRAGMENT 3 OF 4 // COLLECTED: E, C, F, O, L, R
                    </p>
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
                {passed && onProceedToRoom4 && (
                  <button
                    onClick={onProceedToRoom4}
                    className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Room 4
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
              You ran out of time before submitting your analysis.
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

  // Check completeness for submit button
  const canSubmit =
    wordCount(methodologyText) >= 10 &&
    wordCount(resultsText) >= 5 &&
    selectedLoe !== "" &&
    wordCount(strengthsText) >= 5 &&
    wordCount(weaknessText) >= 5;

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
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Abort Mission</span>
            </button>

            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-teal-400" />
              <span className="text-white font-[JetBrains_Mono,monospace] text-sm">
                ROOM 3 — ANALYTICS
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

        {/* Content — two-column layout: document + tasks */}
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
                Critically <span className="text-teal-400">Analyze</span> the Study
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                Read the research study carefully, then complete the analysis tasks beside it.
                Identify the methodology, summarize results, determine the Level of Evidence, and evaluate strengths &amp; weaknesses.
              </p>
            </motion.div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT: Study Document */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="lg:sticky lg:top-0 lg:self-start"
              >
                <div
                  className="group bg-[#faf9f6] rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-shadow"
                  onClick={() => setViewingStudy(0)}
                >
                  <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <p className="text-gray-500 text-xs tracking-wider uppercase">
                        {study.journal} &bull; {study.year}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 font-[JetBrains_Mono,monospace]">
                      CLICK TO EXPAND
                    </span>
                  </div>
                  <div className="p-6 max-h-[65vh] overflow-y-auto">
                    <h3 className="text-gray-900 text-sm mb-2" style={{ lineHeight: 1.5 }}>
                      {study.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-4">{study.authors}</p>

                    {[
                      { key: "background", label: "Background" },
                      { key: "objective", label: "Objective" },
                      { key: "methods", label: "Methods" },
                      { key: "results", label: "Results" },
                      { key: "conclusion", label: "Conclusion" },
                    ].map((section) => (
                      <div key={section.key} className="mb-4">
                        <h4 className="text-gray-700 text-xs tracking-wider uppercase mb-1">
                          {section.label}
                        </h4>
                        <p className="text-gray-600 text-xs" style={{ lineHeight: 1.7 }}>
                          {study.sections[section.key as keyof typeof study.sections]}
                        </p>
                      </div>
                    ))}

                    <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-2 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Search className="w-4 h-4" />
                      <span className="text-xs">Click to view full-screen</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT: Analysis Tasks */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-6"
              >
                {/* TASK 1: Methodology */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <ClipboardList className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <span className="text-white text-sm">Methodology</span>
                      <p className="text-gray-500 text-xs">
                        Describe the key methodological elements of this study
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <textarea
                      value={methodologyText}
                      onChange={(e) => setMethodologyText(e.target.value)}
                      placeholder="Describe the methodology: Study design, Location/Setting, Target group/Population, Database/Data source, Samples/Sample size, Intervention/Exposure, Outcome measures..."
                      rows={8}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-teal-500 focus:outline-none text-sm resize-y"
                      style={{ lineHeight: 1.7 }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-600 text-xs">
                        {wordCount(methodologyText)} words
                      </span>
                      <span
                        className={`text-xs ${
                          wordCount(methodologyText) >= METHODOLOGY_MIN_WORDS
                            ? "text-green-400"
                            : "text-gray-600"
                        }`}
                      >
                        Min. {METHODOLOGY_MIN_WORDS} words
                      </span>
                    </div>
                  </div>
                </div>

                {/* TASK 2: Results */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <PenLine className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-white text-sm">The Results</span>
                      <p className="text-gray-500 text-xs">
                        Summarize the key findings and statistical outcomes
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <textarea
                      value={resultsText}
                      onChange={(e) => setResultsText(e.target.value)}
                      placeholder="Summarize the main results of the study. Include key statistical findings, significance levels, effect sizes, and any notable outcomes (both significant and non-significant)..."
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-teal-500 focus:outline-none text-sm resize-y"
                      style={{ lineHeight: 1.7 }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-600 text-xs">
                        {wordCount(resultsText)} words
                      </span>
                      <span
                        className={`text-xs ${
                          wordCount(resultsText) >= 15 ? "text-green-400" : "text-gray-600"
                        }`}
                      >
                        Min. 15 words
                      </span>
                    </div>
                  </div>
                </div>

                {/* TASK 3: Level of Evidence */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <span className="text-white text-sm">Level of Evidence</span>
                      <p className="text-gray-500 text-xs">
                        Classify this study on the evidence pyramid
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <select
                      value={selectedLoe}
                      onChange={(e) => setSelectedLoe(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none text-sm appearance-none cursor-pointer"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                      }}
                    >
                      {loeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#0a1f22] text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* TASK 4: Strengths */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <span className="text-white text-sm">Strengths</span>
                      <p className="text-gray-500 text-xs">
                        What does this study do well? Identify its methodological and design strengths
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <textarea
                      value={strengthsText}
                      onChange={(e) => setStrengthsText(e.target.value)}
                      placeholder="Identify the strengths of this study. Consider aspects like study design rigor, sample size adequacy, blinding, validated outcome measures, appropriate statistical methods, low attrition rates, or strong generalizability..."
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-teal-500 focus:outline-none text-sm resize-y"
                      style={{ lineHeight: 1.7 }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-600 text-xs">
                        {wordCount(strengthsText)} words
                      </span>
                      <span
                        className={`text-xs ${
                          wordCount(strengthsText) >= 15 ? "text-green-400" : "text-gray-600"
                        }`}
                      >
                        Min. 15 words
                      </span>
                    </div>
                  </div>
                </div>

                {/* TASK 5: Weaknesses */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <span className="text-white text-sm">Weaknesses</span>
                      <p className="text-gray-500 text-xs">
                        Identify limitations, biases, and threats to validity
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <textarea
                      value={weaknessText}
                      onChange={(e) => setWeaknessText(e.target.value)}
                      placeholder="Identify the weaknesses and limitations of this study. Consider potential biases (selection, performance, detection, attrition), confounders, lack of blinding or randomization, small sample size, short follow-up, or limited generalizability..."
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-teal-500 focus:outline-none text-sm resize-y"
                      style={{ lineHeight: 1.7 }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-600 text-xs">
                        {wordCount(weaknessText)} words
                      </span>
                      <span
                        className={`text-xs ${
                          wordCount(weaknessText) >= 15 ? "text-green-400" : "text-gray-600"
                        }`}
                      >
                        Min. 15 words
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-center pb-8">
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`px-8 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                      canSubmit
                        ? "bg-teal-500 hover:bg-teal-400 text-white"
                        : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/10"
                    }`}
                  >
                    Submit Analysis
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
