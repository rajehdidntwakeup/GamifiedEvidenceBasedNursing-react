import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Trophy,
  KeyRound,
  Eye,
  X,
} from "lucide-react";

interface Mission {
  id: number;
  title: string;
  subtitle: string;
  textColor: string;
  bgColor: string;
}

interface RoomOfAbstractsProps {
  mission: Mission;
  onBack: () => void;
  onProceedToRoom3?: () => void;
}

interface Article {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  type: string;
  abstract: string;
  correctAnswers: {
    titleAuthor: string;
    pyramid: string;
    ahcpr: string;
    studyDesign: string;
  };
}

interface TableRow {
  titleAuthor: string;
  pyramid: string;
  ahcpr: string;
  studyDesign: string;
}

const pyramidOptions = [
  { value: "", label: "Select LoE..." },
  { value: "Level I", label: "Level I — Systematic Reviews / Meta-analyses" },
  { value: "Level II", label: "Level II — Randomized Controlled Trials" },
  { value: "Level III", label: "Level III — Controlled Trials (no randomization)" },
  { value: "Level IV", label: "Level IV — Case-Control / Cohort Studies" },
  { value: "Level V", label: "Level V — Systematic Reviews of Descriptive Studies" },
  { value: "Level VI", label: "Level VI — Single Descriptive / Qualitative Study" },
  { value: "Level VII", label: "Level VII — Expert Opinion" },
];

const ahcprOptions = [
  { value: "", label: "Select AHCPR..." },
  { value: "Ia", label: "Ia — Meta-analysis of RCTs" },
  { value: "Ib", label: "Ib — At least one RCT" },
  { value: "IIa", label: "IIa — Controlled study (no randomization)" },
  { value: "IIb", label: "IIb — Quasi-experimental study" },
  { value: "III", label: "III — Non-experimental descriptive studies" },
  { value: "IV", label: "IV — Expert committee reports / opinions" },
];

const studyDesignOptions = [
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

const articlesByMission: Record<number, Article[]> = {
  1: [
    {
      id: 1,
      title: "Effectiveness of Nurse-Led Interventions on Patient Fatigue in Chronic Illness: A Systematic Review and Meta-Analysis",
      authors: "Al-Rashidi, S., Chen, W., & Patel, R.",
      journal: "Journal of Advanced Nursing",
      year: 2023,
      type: "research",
      abstract:
        "Background: Fatigue is one of the most prevalent and debilitating symptoms in chronic illness, yet evidence-based nursing interventions remain inconsistently applied. Objective: To synthesize evidence from randomized controlled trials evaluating nurse-led interventions for fatigue management across chronic conditions. Methods: A systematic search of CINAHL, PubMed, and Cochrane Library databases was conducted for RCTs published between 2010 and 2023. Twenty-six studies meeting inclusion criteria were pooled using random-effects meta-analysis. Results: Nurse-led interventions significantly reduced fatigue scores (SMD = -0.58, 95% CI: -0.74 to -0.42, p < 0.001). Exercise-based and cognitive-behavioral interventions demonstrated the largest effect sizes. Conclusion: Strong evidence supports nurse-led multimodal interventions for fatigue reduction. Nurses should integrate these approaches into patient-centered care plans.",
      correctAnswers: {
        titleAuthor: "Al-Rashidi, Chen & Patel (2023)",
        pyramid: "Level I",
        ahcpr: "Ia",
        studyDesign: "Meta-Analysis",
      },
    },
    {
      id: 2,
      title: "Impact of Bedside Handover on Patient Safety Outcomes: A Randomized Controlled Trial",
      authors: "Johnson, M. T., & Rivera, L.",
      journal: "International Journal of Nursing Studies",
      year: 2022,
      type: "research",
      abstract:
        "Background: Traditional nursing handovers conducted at the nurses' station may contribute to communication errors and reduced patient engagement. Objective: To evaluate whether bedside handover improves patient safety outcomes compared to traditional handover. Methods: A parallel-group randomized controlled trial was conducted across four medical-surgical units in two tertiary hospitals (N = 312 patients). The intervention group received structured bedside handover using the ISBAR framework, while the control group received standard station-based handover. Primary outcomes included medication errors, patient falls, and patient satisfaction scores measured over 6 months. Results: The bedside handover group experienced significantly fewer medication errors (3.2% vs. 7.8%, p = 0.012) and higher patient satisfaction (M = 4.3 vs. 3.6, p < 0.001). Fall rates did not significantly differ between groups. Conclusion: Bedside handover using ISBAR improves medication safety and patient satisfaction. Implementation is recommended as standard practice.",
      correctAnswers: {
        titleAuthor: "Johnson & Rivera (2022)",
        pyramid: "Level II",
        ahcpr: "Ib",
        studyDesign: "RCT",
      },
    },
    {
      id: 3,
      title: "Nurses' Perceptions of Evidence-Based Practice Barriers in Primary Care: A Descriptive Qualitative Study",
      authors: "Okafor, N. E., Lindström, A., & Hayashi, K.",
      journal: "BMC Nursing",
      year: 2024,
      type: "research",
      abstract:
        "Background: Despite growing emphasis on evidence-based practice (EBP), primary care nurses continue to report challenges in translating research into clinical decisions. Objective: To explore nurses' lived experiences and perceived barriers to implementing EBP in primary care settings. Methods: A descriptive qualitative design was employed. Semi-structured interviews were conducted with 18 registered nurses from six primary care clinics. Data were analyzed using thematic analysis following Braun and Clarke's six-phase framework. Results: Four major themes emerged: (1) 'Time is the enemy' — overwhelming workloads limit research engagement; (2) 'Lost in translation' — difficulty interpreting statistical findings; (3) 'Culture of tradition' — resistance from senior colleagues; (4) 'Lack of access' — limited database subscriptions and training. Participants emphasized the need for organizational support, mentorship, and protected time for EBP activities. Conclusion: Systemic barriers significantly impede EBP adoption among primary care nurses. Targeted organizational interventions and educational support are essential.",
      correctAnswers: {
        titleAuthor: "Okafor, Lindström & Hayashi (2024)",
        pyramid: "Level VI",
        ahcpr: "III",
        studyDesign: "Qualitative Study",
      },
    },
  ],
  2: [
    {
      id: 1,
      title: "Pharmacist-Nurse Collaborative Medication Reconciliation: A Systematic Review",
      authors: "Kim, J. H., Brown, D., & Santos, F.",
      journal: "Journal of Clinical Nursing",
      year: 2023,
      type: "research",
      abstract:
        "Background: Medication errors during care transitions are a leading cause of preventable harm. Collaborative reconciliation involving pharmacists and nurses may reduce these errors. Objective: To systematically review evidence on pharmacist-nurse collaborative medication reconciliation interventions. Methods: A systematic review was conducted following PRISMA guidelines. Databases searched included CINAHL, PubMed, Embase, and Cochrane Library (2012-2023). Eighteen studies were included for narrative synthesis. Results: Collaborative models consistently reduced medication discrepancies (range: 30-65% reduction across studies). The most effective approaches involved structured communication tools and electronic decision support. Patient readmission rates decreased in 11 of 18 studies. Conclusion: Pharmacist-nurse collaboration in medication reconciliation significantly reduces errors and should be implemented during all care transitions.",
      correctAnswers: {
        titleAuthor: "Kim, Brown & Santos (2023)",
        pyramid: "Level V",
        ahcpr: "III",
        studyDesign: "Systematic Review",
      },
    },
    {
      id: 2,
      title: "Double-Checking Versus Single-Checking of High-Alert Medications: A Randomized Controlled Trial in Pediatric Units",
      authors: "Weber, C., & Nguyen, T. P.",
      journal: "Pediatric Nursing",
      year: 2024,
      type: "research",
      abstract:
        "Background: Double-checking high-alert medications is widely practiced, but evidence supporting its superiority over single-checking is limited. Objective: To compare error detection rates between independent double-checking and single-checking protocols for high-alert medications in pediatric settings. Methods: A multicenter randomized controlled trial across 6 pediatric units (N = 1,840 medication administrations). Nurses were randomized to perform either independent double-checking or single-checking with a standardized checklist. Primary outcome was the rate of detected errors before administration. Results: The double-checking group detected significantly more calculation errors (4.1% vs. 1.8%, p = 0.003) and dosing discrepancies (3.7% vs. 1.2%, p < 0.001). No significant difference was found for wrong-patient errors. Time required increased by an average of 2.3 minutes per administration. Conclusion: Independent double-checking is more effective at detecting dosing errors for high-alert pediatric medications, despite modest time costs.",
      correctAnswers: {
        titleAuthor: "Weber & Nguyen (2024)",
        pyramid: "Level II",
        ahcpr: "Ib",
        studyDesign: "RCT",
      },
    },
    {
      id: 3,
      title: "Polypharmacy Management in Elderly Patients: Expert Consensus and Clinical Recommendations",
      authors: "European Geriatric Medicine Society Task Force",
      journal: "European Geriatric Medicine",
      year: 2023,
      type: "research",
      abstract:
        "Background: Polypharmacy among elderly patients is associated with increased adverse drug events, hospitalizations, and mortality. Objective: To develop expert consensus recommendations for managing polypharmacy in patients aged 65 and older. Methods: A modified Delphi process was conducted with a panel of 34 experts in geriatric medicine, clinical pharmacy, and nursing. Three iterative rounds of questionnaires were completed, with consensus defined as ≥75% agreement. Results: Consensus was reached on 28 of 35 proposed recommendations. Key recommendations include: (1) conduct comprehensive medication review at every care transition; (2) apply the STOPP/START criteria for deprescribing; (3) prioritize patient goals of care over disease-specific guidelines; (4) involve patients and caregivers in deprescribing decisions. Conclusion: These consensus recommendations provide a framework for safe polypharmacy management in elderly patients, emphasizing collaborative deprescribing and patient-centered care.",
      correctAnswers: {
        titleAuthor: "European Geriatric Medicine Society Task Force (2023)",
        pyramid: "Level VII",
        ahcpr: "IV",
        studyDesign: "Expert Opinion",
      },
    },
  ],
  3: [
    {
      id: 1,
      title: "Targeted Temperature Management After Cardiac Arrest: A Meta-Analysis of Randomized Controlled Trials",
      authors: "Andersen, K. F., Li, X., & Morrison, B.",
      journal: "Resuscitation",
      year: 2023,
      type: "research",
      abstract:
        "Background: Targeted temperature management (TTM) has been a cornerstone of post-cardiac arrest care, but optimal target temperatures remain debated. Objective: To synthesize evidence from RCTs comparing different TTM strategies on neurological outcomes and survival after cardiac arrest. Methods: Systematic search of PubMed, Cochrane Library, and Embase identified 12 RCTs (N = 6,432 patients). Random-effects meta-analysis was performed for primary outcomes of favorable neurological outcome (CPC 1-2) and all-cause mortality at 6 months. Results: TTM at 33°C did not significantly improve neurological outcomes compared to TTM at 36°C (RR = 1.04, 95% CI: 0.92-1.17, p = 0.53). Both active TTM strategies were superior to no temperature management (RR = 1.42, 95% CI: 1.18-1.71, p < 0.001). Conclusion: Active temperature management is essential post-cardiac arrest, but evidence does not support superiority of 33°C over 36°C.",
      correctAnswers: {
        titleAuthor: "Andersen, Li & Morrison (2023)",
        pyramid: "Level I",
        ahcpr: "Ia",
        studyDesign: "Meta-Analysis",
      },
    },
    {
      id: 2,
      title: "Nurse-to-Patient Ratio and In-Hospital Cardiac Arrest Outcomes: A Retrospective Cohort Study",
      authors: "Garcia, R. M., Thompson, S. E., & Yılmaz, D.",
      journal: "Critical Care Medicine",
      year: 2024,
      type: "research",
      abstract:
        "Background: Staffing ratios have been linked to patient outcomes, but their impact on cardiac arrest response and survival is poorly understood. Objective: To examine the association between nurse-to-patient ratios and outcomes following in-hospital cardiac arrest (IHCA). Methods: A retrospective cohort study using data from 42 acute care hospitals over a 5-year period (2018-2023). Records of 8,914 IHCA events were analyzed. The primary outcome was return of spontaneous circulation (ROSC); secondary outcomes included survival to discharge and neurological outcomes. Multilevel logistic regression models adjusted for patient acuity, time of arrest, and hospital characteristics. Results: Higher nurse-to-patient ratios (≥1:4) were independently associated with improved ROSC (OR = 1.38, 95% CI: 1.12-1.70, p = 0.002) and survival to discharge (OR = 1.24, 95% CI: 1.04-1.48, p = 0.017). Time to first defibrillation was shorter in units with higher staffing. Conclusion: Adequate nurse staffing is associated with improved cardiac arrest outcomes, likely through faster recognition and response.",
      correctAnswers: {
        titleAuthor: "Garcia, Thompson & Yılmaz (2024)",
        pyramid: "Level IV",
        ahcpr: "IIb",
        studyDesign: "Cohort Study",
      },
    },
    {
      id: 3,
      title: "Debriefing After Resuscitation Events: Experiences of Critical Care Nurses — A Qualitative Study",
      authors: "Kowalski, A., & Svensson, E.",
      journal: "Heart & Lung",
      year: 2023,
      type: "research",
      abstract:
        "Background: Resuscitation events are high-stress experiences that can affect nurses' well-being and future performance. Debriefing is recommended but inconsistently practiced. Objective: To explore critical care nurses' experiences with post-resuscitation debriefing and its perceived impact on professional practice. Methods: A qualitative descriptive study was conducted. In-depth interviews with 15 critical care nurses from three ICUs were analyzed using thematic content analysis. Purposive sampling ensured variation in experience level (2-20 years). Results: Three themes emerged: (1) 'Processing the chaos' — nurses valued debriefing for emotional processing and sense-making; (2) 'Learning in real time' — debriefing facilitated identification of clinical and teamwork improvements; (3) 'The missing piece' — many nurses reported debriefing was offered inconsistently, often only after unsuccessful resuscitations. Participants expressed a strong desire for structured, routine debriefing regardless of outcome. Conclusion: Structured debriefing after all resuscitation events supports nurses' emotional well-being and continuous clinical improvement.",
      correctAnswers: {
        titleAuthor: "Kowalski & Svensson (2023)",
        pyramid: "Level VI",
        ahcpr: "III",
        studyDesign: "Qualitative Study",
      },
    },
  ],
  4: [
    {
      id: 1,
      title: "Hand Hygiene Compliance Interventions in Acute Care: A Systematic Review and Meta-Analysis",
      authors: "Mensah, K. A., O'Brien, L., & Zhang, Y.",
      journal: "American Journal of Infection Control",
      year: 2023,
      type: "research",
      abstract:
        "Background: Hand hygiene is the most effective measure for preventing healthcare-associated infections, yet compliance rates remain suboptimal. Objective: To evaluate the effectiveness of interventions designed to improve hand hygiene compliance among healthcare workers. Methods: A systematic review and meta-analysis following PRISMA guidelines. Databases searched: PubMed, CINAHL, Cochrane Library, and Scopus (2010-2023). Thirty-four studies (22 RCTs, 12 quasi-experimental) were included. Results: Multimodal interventions produced the highest compliance improvement (pooled OR = 2.47, 95% CI: 1.89-3.23, p < 0.001). Education alone had moderate effects (OR = 1.62), while audit-and-feedback showed sustained improvements over 12 months. Electronic monitoring combined with feedback was most effective in ICU settings. Conclusion: Multimodal interventions combining education, audit-feedback, and environmental modifications most effectively improve hand hygiene compliance. Single-strategy approaches are insufficient.",
      correctAnswers: {
        titleAuthor: "Mensah, O'Brien & Zhang (2023)",
        pyramid: "Level I",
        ahcpr: "Ia",
        studyDesign: "Meta-Analysis",
      },
    },
    {
      id: 2,
      title: "Effectiveness of Chlorhexidine Bathing vs. Standard Bathing in Reducing CLABSI: A Randomized Controlled Trial",
      authors: "Park, S., Williams, J. R., & Fernandez, A.",
      journal: "Infection Control & Hospital Epidemiology",
      year: 2024,
      type: "research",
      abstract:
        "Background: Central line-associated bloodstream infections (CLABSIs) are a significant cause of morbidity in hospitalized patients. Daily chlorhexidine gluconate (CHG) bathing is recommended, but evidence in non-ICU settings is limited. Objective: To compare the effectiveness of daily 2% CHG bathing versus standard soap-and-water bathing in reducing CLABSI rates on medical-surgical units. Methods: A cluster-randomized controlled trial was conducted across 14 medical-surgical units in 7 hospitals (N = 4,218 patients with central lines). Units were randomized to either daily CHG bathing or standard bathing over 18 months. Results: CHG bathing reduced CLABSI rates by 41% (2.1 vs. 3.6 per 1,000 catheter-days, incidence rate ratio = 0.59, 95% CI: 0.42-0.83, p = 0.003). Skin adverse events were rare and similar between groups (1.2% vs. 0.9%). Conclusion: Daily CHG bathing significantly reduces CLABSI rates in medical-surgical patients and should be considered for all patients with central lines.",
      correctAnswers: {
        titleAuthor: "Park, Williams & Fernandez (2024)",
        pyramid: "Level II",
        ahcpr: "Ib",
        studyDesign: "RCT",
      },
    },
    {
      id: 3,
      title: "Nurses' Knowledge and Practices Regarding Antibiotic Stewardship: A Cross-Sectional Survey",
      authors: "Dimitriou, E., Hassan, M., & Kelly, P.",
      journal: "Journal of Infection Prevention",
      year: 2023,
      type: "research",
      abstract:
        "Background: Nurses play a critical role in antibiotic stewardship, yet their knowledge and practices in this area are not well characterized. Objective: To assess nurses' knowledge of antibiotic stewardship principles and their self-reported practices related to antibiotic administration. Methods: A cross-sectional survey design was used. A validated 42-item questionnaire was distributed to registered nurses across 8 hospitals in three countries (N = 1,245, response rate = 68%). Descriptive statistics, chi-square tests, and logistic regression were used for analysis. Results: Overall knowledge scores averaged 62.4% (SD = 14.2). Significant knowledge gaps were identified in antimicrobial resistance mechanisms (48.3% correct) and duration-of-therapy recommendations (51.7% correct). Nurses with specialized infection control training scored significantly higher (72.1% vs. 58.3%, p < 0.001). Only 34% reported routinely questioning antibiotic orders they considered inappropriate. Conclusion: Significant knowledge gaps exist among nurses regarding antibiotic stewardship. Targeted education programs should be integrated into nursing curricula and continuing education.",
      correctAnswers: {
        titleAuthor: "Dimitriou, Hassan & Kelly (2023)",
        pyramid: "Level VI",
        ahcpr: "III",
        studyDesign: "Cross-Sectional Study",
      },
    },
  ],
  5: [
    {
      id: 1,
      title: "Self-Management Interventions for Type 2 Diabetes: A Systematic Review and Meta-Analysis of RCTs",
      authors: "Torres, L., Johansson, M., & Adeyemi, O.",
      journal: "Diabetes Care",
      year: 2024,
      type: "research",
      abstract:
        "Background: Self-management education and support (SMES) are cornerstones of diabetes care, but the comparative effectiveness of different delivery methods is unclear. Objective: To compare the effectiveness of technology-based versus face-to-face self-management interventions for adults with type 2 diabetes. Methods: A systematic review and meta-analysis of RCTs identified through MEDLINE, CINAHL, Embase, and PsycINFO (2015-2024). Forty-one RCTs (N = 12,847) were included. Random-effects models assessed pooled mean differences in HbA1c, self-efficacy, and quality of life. Results: Both technology-based (MD = -0.42%, 95% CI: -0.56 to -0.28) and face-to-face interventions (MD = -0.51%, 95% CI: -0.67 to -0.35) significantly reduced HbA1c compared to usual care. No significant difference was found between delivery modes (p = 0.34). Technology-based interventions showed higher engagement among younger adults (<50 years). Conclusion: Both delivery modes are effective for diabetes self-management. Choice should be guided by patient preference, access, and age-related engagement patterns.",
      correctAnswers: {
        titleAuthor: "Torres, Johansson & Adeyemi (2024)",
        pyramid: "Level I",
        ahcpr: "Ia",
        studyDesign: "Meta-Analysis",
      },
    },
    {
      id: 2,
      title: "Motivational Interviewing by Nurses to Improve Medication Adherence in Heart Failure: An RCT",
      authors: "Bennett, K., Choi, S., & Lopez, G.",
      journal: "European Journal of Heart Failure",
      year: 2023,
      type: "research",
      abstract:
        "Background: Non-adherence to prescribed medications is a major contributor to heart failure exacerbations and hospital readmissions. Objective: To evaluate the effect of a nurse-delivered motivational interviewing (MI) intervention on medication adherence and clinical outcomes in patients with heart failure. Methods: A single-blind randomized controlled trial (N = 224) conducted at two outpatient heart failure clinics. The intervention group received 6 nurse-led MI sessions over 12 weeks in addition to usual care. The control group received usual care only. Primary outcome: self-reported medication adherence (MMAS-8) at 6 months. Secondary outcomes: BNP levels, emergency department visits, and hospital readmissions. Results: The MI group showed significantly higher medication adherence scores (7.2 vs. 5.8, p < 0.001) and fewer ED visits (0.8 vs. 1.6, p = 0.009) at 6 months. Hospital readmissions were lower but did not reach statistical significance (p = 0.072). Conclusion: Nurse-delivered motivational interviewing significantly improves medication adherence and reduces emergency utilization in heart failure patients.",
      correctAnswers: {
        titleAuthor: "Bennett, Choi & Lopez (2023)",
        pyramid: "Level II",
        ahcpr: "Ib",
        studyDesign: "RCT",
      },
    },
    {
      id: 3,
      title: "Living with COPD: A Qualitative Exploration of Patients' Experiences with Pulmonary Rehabilitation",
      authors: "Murphy, R. D., & Tanaka, H.",
      journal: "Chronic Illness",
      year: 2024,
      type: "research",
      abstract:
        "Background: Pulmonary rehabilitation (PR) is recommended for COPD management, but attendance and completion rates remain low. Understanding patients' subjective experiences is essential for improving engagement. Objective: To explore the lived experiences of patients with COPD who participated in pulmonary rehabilitation programs. Methods: An interpretive phenomenological analysis (IPA) was conducted. In-depth semi-structured interviews with 12 patients who completed PR programs (aged 54-78, 7 male, 5 female). Interviews were audio-recorded, transcribed verbatim, and analyzed using Smith's IPA framework. Results: Three superordinate themes emerged: (1) 'Reclaiming my breath' — PR provided tangible improvements in exercise tolerance and daily functioning; (2) 'Not alone anymore' — group dynamics offered emotional support and normalized their experience; (3) 'The cliff edge after' — participants described feelings of abandonment and regression after program completion, with limited follow-up support. Conclusion: While PR significantly benefits COPD patients, the transition post-program requires structured follow-up to sustain gains and prevent disengagement.",
      correctAnswers: {
        titleAuthor: "Murphy & Tanaka (2024)",
        pyramid: "Level VI",
        ahcpr: "III",
        studyDesign: "Qualitative Study",
      },
    },
  ],
};

export function RoomOfAbstracts({ mission, onBack, onProceedToRoom3 }: RoomOfAbstractsProps) {
  const TOTAL_TIME = 15 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [viewingArticle, setViewingArticle] = useState<number | null>(null);
  const [tableData, setTableData] = useState<TableRow[]>([
    { titleAuthor: "", pyramid: "", ahcpr: "", studyDesign: "" },
    { titleAuthor: "", pyramid: "", ahcpr: "", studyDesign: "" },
    { titleAuthor: "", pyramid: "", ahcpr: "", studyDesign: "" },
  ]);
  const [results, setResults] = useState<boolean[][] | null>(null);

  const articles = articlesByMission[mission.id] || articlesByMission[1];

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
  const isTimerWarning = timeLeft < 180;
  const isTimerCritical = timeLeft < 60;

  const updateTableRow = (rowIndex: number, field: keyof TableRow, value: string) => {
    setTableData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [field]: value };
      return updated;
    });
  };

  const handleSubmit = () => {
    const checkResults = articles.map((article, i) => {
      const row = tableData[i];
      const correct = article.correctAnswers;
      return [
        row.titleAuthor.trim().length > 0 && correct.titleAuthor.toLowerCase().includes(row.titleAuthor.trim().toLowerCase().split(" ")[0].replace(",", "")),
        row.pyramid === correct.pyramid,
        row.ahcpr === correct.ahcpr,
        row.studyDesign === correct.studyDesign,
      ];
    });
    setResults(checkResults);
    setIsComplete(true);
  };

  const totalCells = articles.length * 4;
  const correctCells = results ? results.flat().filter(Boolean).length : 0;
  const percentage = results ? Math.round((correctCells / totalCells) * 100) : 0;
  const passed = percentage >= 60;

  const handleRetry = () => {
    setTimeLeft(TOTAL_TIME);
    setTimeExpired(false);
    setIsComplete(false);
    setResults(null);
    setTableData([
      { titleAuthor: "", pyramid: "", ahcpr: "", studyDesign: "" },
      { titleAuthor: "", pyramid: "", ahcpr: "", studyDesign: "" },
      { titleAuthor: "", pyramid: "", ahcpr: "", studyDesign: "" },
    ]);
  };

  // Article viewer modal
  const articleModal = viewingArticle !== null && (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#faf9f6] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative shadow-2xl"
      >
        <button
          onClick={() => setViewingArticle(null)}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>
        <div className="p-8">
          {/* Journal header */}
          <div className="border-b-2 border-gray-800 pb-3 mb-6">
            <p className="text-gray-500 text-xs tracking-wider uppercase mb-1">
              {articles[viewingArticle].journal} &bull; {articles[viewingArticle].year}
            </p>
            <h2 className="text-gray-900 text-lg" style={{ lineHeight: 1.4 }}>
              {articles[viewingArticle].title}
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              {articles[viewingArticle].authors}
            </p>
          </div>

          {/* Abstract */}
          <div>
            <h3 className="text-gray-800 text-sm tracking-wider uppercase mb-3">Abstract</h3>
            <p className="text-gray-700 text-sm" style={{ lineHeight: 1.8 }}>
              {articles[viewingArticle].abstract}
            </p>
          </div>

          {/* Article number tag */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-gray-400 text-xs font-[JetBrains_Mono,monospace]">
              ARTICLE {viewingArticle + 1} OF {articles.length}
            </span>
            <div className="flex gap-2">
              {viewingArticle > 0 && (
                <button
                  onClick={() => setViewingArticle(viewingArticle - 1)}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" /> Previous
                </button>
              )}
              {viewingArticle < articles.length - 1 && (
                <button
                  onClick={() => setViewingArticle(viewingArticle + 1)}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
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
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full text-center"
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
              {timeExpired
                ? "Time's Up!"
                : passed
                  ? "Room Cleared!"
                  : "Room Failed"}
            </h2>
            <p className="text-gray-400 mb-8">
              {passed
                ? "Excellent analysis, Agent. You've demonstrated strong evidence appraisal skills."
                : "Review the abstracts more carefully and try again, Agent."}
            </p>

            {/* Score display */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">Cells Correct</span>
                <span className="text-white text-2xl font-[JetBrains_Mono,monospace]">
                  {correctCells}/{totalCells}
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
                <span className="text-gray-500">{percentage}% correct</span>
                <span className={passed ? "text-teal-400" : "text-orange-400"}>
                  {passed ? "PASSED" : "60% required to pass"}
                </span>
              </div>
            </div>

            {/* Results table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-2 px-3 text-gray-500 font-[JetBrains_Mono,monospace] text-xs">#</th>
                    <th className="py-2 px-3 text-gray-500 font-[JetBrains_Mono,monospace] text-xs">Title & Author</th>
                    <th className="py-2 px-3 text-gray-500 font-[JetBrains_Mono,monospace] text-xs">Pyramid</th>
                    <th className="py-2 px-3 text-gray-500 font-[JetBrains_Mono,monospace] text-xs">AHCPR</th>
                    <th className="py-2 px-3 text-gray-500 font-[JetBrains_Mono,monospace] text-xs">Design</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article, i) => (
                    <tr key={article.id} className="border-b border-white/5">
                      <td className="py-3 px-3 text-gray-400">{i + 1}</td>
                      {["titleAuthor", "pyramid", "ahcpr", "studyDesign"].map((field, j) => {
                        const isCorrect = results[i][j];
                        const userVal = tableData[i][field as keyof TableRow];
                        const correctVal = article.correctAnswers[field as keyof typeof article.correctAnswers];
                        return (
                          <td key={field} className="py-3 px-3">
                            <div className="flex items-start gap-2">
                              {isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <p className={`text-xs ${isCorrect ? "text-green-300" : "text-red-300"}`}>
                                  {userVal || "(empty)"}
                                </p>
                                {!isCorrect && (
                                  <p className="text-xs text-teal-400 mt-1">
                                    {correctVal}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Clue Letters Reward */}
            {passed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(20,184,166,0.3) 2px, rgba(20,184,166,0.3) 4px)",
                }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <KeyRound className="w-5 h-5 text-teal-400" />
                    <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-sm">CLUE LETTERS UNLOCKED</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-5">
                    Two more letters revealed! Add them to your collection.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    {["E", "C"].map((letter, idx) => (
                      <div
                        key={`prev-${letter}`}
                        className="w-12 h-15 bg-[#0a1f22]/60 border border-white/10 rounded-lg flex items-center justify-center opacity-40"
                      >
                        <span className="text-gray-500 text-xl font-[JetBrains_Mono,monospace]">{letter}</span>
                      </div>
                    ))}
                    <div className="w-px h-12 bg-teal-500/30 mx-1" />
                    {["F", "O"].map((letter, i) => (
                      <motion.div
                        key={letter}
                        initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.6, delay: 1.6 + i * 0.3, type: "spring", stiffness: 200 }}
                        className="w-16 h-20 bg-[#0a1f22] border-2 border-teal-500/60 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.2)]"
                      >
                        <span className="text-teal-400 text-3xl font-[JetBrains_Mono,monospace]">{letter}</span>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs mt-4 font-[JetBrains_Mono,monospace]">
                    FRAGMENT 2 OF ? // COLLECTED: E, C, F, O
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
              {passed && onProceedToRoom3 && (
                <button
                  onClick={onProceedToRoom3}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Room 3
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
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
            <p className="text-gray-400 mb-8">You ran out of time before submitting your analysis.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={onBack} className="px-6 py-3 bg-white/5 border border-white/10 hover:border-teal-500/40 text-white rounded-xl transition-colors">
                Back to Missions
              </button>
              <button onClick={handleRetry} className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2">
                Retry Room <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main room UI
  const allFilled = tableData.every(
    (row) => row.titleAuthor.trim() && row.pyramid && row.ahcpr && row.studyDesign
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto font-[Inter,sans-serif]">
      {articleModal}
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
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Abort Mission</span>
            </button>

            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              <span className="text-white font-[JetBrains_Mono,monospace] text-sm">
                ROOM 2 — ABSTRACTS
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
        <div className="flex-1 px-6 py-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl text-white mb-3 tracking-tight">
                Analyze the <span className="text-teal-400">Abstracts</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                Read each research article abstract carefully, then classify each study in the table below. 
                Identify the study title & author, level of evidence, AHCPR classification, and study design.
              </p>
            </motion.div>

            {/* Article Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group bg-[#faf9f6] rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-shadow"
                  onClick={() => setViewingArticle(index)}
                >
                  {/* Paper header */}
                  <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
                    <p className="text-gray-400 text-[10px] tracking-wider uppercase">
                      {article.journal} &bull; {article.year}
                    </p>
                  </div>
                  <div className="p-5">
                    <h3 className="text-gray-900 text-sm mb-2" style={{ lineHeight: 1.5 }}>
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-3">{article.authors}</p>
                    <p className="text-gray-600 text-xs" style={{ lineHeight: 1.6 }}>
                      {article.abstract.slice(0, 120)}...
                    </p>
                  </div>
                  <div className="px-5 pb-4 flex items-center justify-between">
                    <span className="text-teal-600 text-xs font-[JetBrains_Mono,monospace]">
                      ARTICLE {index + 1}
                    </span>
                    <div className="flex items-center gap-1 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-xs">Read</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Classification Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-400" />
                <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-sm">EVIDENCE CLASSIFICATION TABLE</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="py-3 px-4 text-left text-gray-500 font-[JetBrains_Mono,monospace] text-xs w-8">#</th>
                      <th className="py-3 px-4 text-left text-gray-500 font-[JetBrains_Mono,monospace] text-xs">Study Title & Author</th>
                      <th className="py-3 px-4 text-left text-gray-500 font-[JetBrains_Mono,monospace] text-xs">Pyramid (LoE)</th>
                      <th className="py-3 px-4 text-left text-gray-500 font-[JetBrains_Mono,monospace] text-xs">AHCPR</th>
                      <th className="py-3 px-4 text-left text-gray-500 font-[JetBrains_Mono,monospace] text-xs">Study Design</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article, i) => (
                      <tr key={article.id} className="border-b border-white/5">
                        <td className="py-4 px-4">
                          <button
                            onClick={() => setViewingArticle(i)}
                            className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs hover:bg-teal-500/20 transition-colors"
                          >
                            {i + 1}
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            value={tableData[i].titleAuthor}
                            onChange={(e) => updateTableRow(i, "titleAuthor", e.target.value)}
                            placeholder="e.g. Author et al. (2023)"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:border-teal-500 focus:outline-none text-sm"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={tableData[i].pyramid}
                            onChange={(e) => updateTableRow(i, "pyramid", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-teal-500 focus:outline-none text-sm appearance-none cursor-pointer"
                            style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
                          >
                            {pyramidOptions.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-[#0a1f22] text-white">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={tableData[i].ahcpr}
                            onChange={(e) => updateTableRow(i, "ahcpr", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-teal-500 focus:outline-none text-sm appearance-none cursor-pointer"
                            style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
                          >
                            {ahcprOptions.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-[#0a1f22] text-white">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={tableData[i].studyDesign}
                            onChange={(e) => updateTableRow(i, "studyDesign", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-teal-500 focus:outline-none text-sm appearance-none cursor-pointer"
                            style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
                          >
                            {studyDesignOptions.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-[#0a1f22] text-white">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Submit */}
            <div className="flex justify-center pb-12">
              <button
                onClick={handleSubmit}
                disabled={!allFilled}
                className={`px-8 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                  allFilled
                    ? "bg-teal-500 hover:bg-teal-400 text-white"
                    : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/10"
                }`}
              >
                Submit Analysis
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
