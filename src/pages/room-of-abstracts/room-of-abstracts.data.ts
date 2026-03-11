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
  type: string;
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
  { value: "Level I", label: "Level I — Systematic Reviews / Meta-analyses" },
  { value: "Level II", label: "Level II — Randomized Controlled Trials" },
  { value: "Level III", label: "Level III — Controlled Trials (no randomization)" },
  { value: "Level IV", label: "Level IV — Case-Control / Cohort Studies" },
  { value: "Level V", label: "Level V — Systematic Reviews of Descriptive Studies" },
  { value: "Level VI", label: "Level VI — Single Descriptive / Qualitative Study" },
  { value: "Level VII", label: "Level VII — Expert Opinion" },
];

export const AHCPR_OPTIONS = [
  { value: "", label: "Select AHCPR..." },
  { value: "Ia", label: "Ia — Meta-analysis of RCTs" },
  { value: "Ib", label: "Ib — At least one RCT" },
  { value: "IIa", label: "IIa — Controlled study (no randomization)" },
  { value: "IIb", label: "IIb — Quasi-experimental study" },
  { value: "III", label: "III — Non-experimental descriptive studies" },
  { value: "IV", label: "IV — Expert committee reports / opinions" },
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

export const ARTICLES_BY_MISSION: Record<number, Article[]> = {
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


export const TOTAL_TIME = 15 * 60;

