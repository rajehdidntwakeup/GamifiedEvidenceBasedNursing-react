import type { Mission } from "@/shared/types/mission";

export interface RoomOfKnowledgeProps {
  mission: Mission;
  onBack: () => void;
  onProceedToRoom2?: () => void;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUESTIONS_BY_MISSION: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      question:
        "What does the 'P' in the PICO framework stand for in evidence-based practice?",
      options: ["Prognosis", "Patient/Population", "Protocol", "Pharmacology"],
      correctIndex: 1,
      explanation:
        "PICO stands for Patient/Population, Intervention, Comparison, and Outcome — the foundational framework for forming clinical questions.",
    },
    {
      id: 2,
      question:
        "Which level of evidence is considered the strongest in the evidence hierarchy?",
      options: [
        "Expert opinion",
        "Case-control study",
        "Systematic review of RCTs",
        "Cohort study",
      ],
      correctIndex: 2,
      explanation:
        "Systematic reviews of randomized controlled trials (RCTs) synthesize multiple high-quality studies and sit at the top of the evidence pyramid.",
    },
    {
      id: 3,
      question:
        "A nurse suspects a patient's fatigue is linked to an undiagnosed condition. What is the first step in evidence-based practice?",
      options: [
        "Implement a treatment plan",
        "Ask a searchable clinical question",
        "Consult a colleague",
        "Order additional labs immediately",
      ],
      correctIndex: 1,
      explanation:
        "The first step in EBP is to formulate a clear, searchable clinical question (often using PICO) to guide your evidence search.",
    },
    {
      id: 4,
      question: "What is the primary purpose of a randomized controlled trial (RCT)?",
      options: [
        "To describe patient demographics",
        "To establish cause-and-effect relationships",
        "To survey patient satisfaction",
        "To review existing literature",
      ],
      correctIndex: 1,
      explanation:
        "RCTs randomly assign participants to intervention or control groups, which helps establish causal relationships between treatments and outcomes.",
    },
    {
      id: 5,
      question:
        "When critically appraising a research study, which factor is MOST important to assess?",
      options: [
        "The journal's impact factor",
        "The number of authors",
        "The validity and reliability of the study design",
        "The length of the publication",
      ],
      correctIndex: 2,
      explanation:
        "Assessing validity (does the study measure what it claims?) and reliability (are results consistent?) is essential for determining if evidence is trustworthy.",
    },
  ],
  2: [
    {
      id: 1,
      question:
        "Which database is most commonly used by nurses to search for evidence-based clinical information?",
      options: ["Google Scholar", "CINAHL", "Wikipedia", "PubMed only"],
      correctIndex: 1,
      explanation:
        "CINAHL (Cumulative Index to Nursing and Allied Health Literature) is the most comprehensive nursing-specific database for evidence-based research.",
    },
    {
      id: 2,
      question:
        "When evaluating a drug interaction study, what does 'statistical significance' (p < 0.05) indicate?",
      options: [
        "The result is clinically important",
        "The result is unlikely due to chance alone",
        "The drug is safe for all patients",
        "The study has no bias",
      ],
      correctIndex: 1,
      explanation:
        "A p-value < 0.05 means there is less than a 5% probability that the observed result occurred by chance, but this does not necessarily mean clinical significance.",
    },
    {
      id: 3,
      question:
        "What is the 'Number Needed to Treat' (NNT) in pharmacological research?",
      options: [
        "The total number of patients in a study",
        "The number of patients who must be treated for one to benefit",
        "The number of adverse drug reactions reported",
        "The dosage required for therapeutic effect",
      ],
      correctIndex: 1,
      explanation:
        "NNT represents how many patients need to receive a treatment for one additional patient to benefit — a lower NNT indicates a more effective treatment.",
    },
    {
      id: 4,
      question:
        "A nurse discovers two medications with a known interaction. What is the BEST evidence-based action?",
      options: [
        "Discontinue both medications immediately",
        "Consult clinical guidelines and pharmacist before acting",
        "Administer them at different times without consultation",
        "Document it and move on",
      ],
      correctIndex: 1,
      explanation:
        "Evidence-based practice involves consulting clinical guidelines and collaborating with the interdisciplinary team (including pharmacists) before making medication changes.",
    },
    {
      id: 5,
      question: "What is a 'black box warning' on a medication?",
      options: [
        "An indication that the drug is over-the-counter",
        "The FDA's most serious warning about life-threatening risks",
        "A notice that the drug is expired",
        "A recommendation for pediatric use",
      ],
      correctIndex: 1,
      explanation:
        "A black box warning is the FDA's strictest warning, placed on medications that carry serious or life-threatening risks that must be carefully weighed against benefits.",
    },
  ],
  3: [
    {
      id: 1,
      question:
        "According to current evidence-based guidelines, what is the recommended compression-to-ventilation ratio for adult CPR?",
      options: ["15:2", "30:2", "15:1", "20:2"],
      correctIndex: 1,
      explanation:
        "The AHA guidelines recommend a 30:2 compression-to-ventilation ratio for adult CPR to maximize circulation during cardiac arrest.",
    },
    {
      id: 2,
      question:
        "In a Code Blue situation, what is the evidence-based recommended depth for chest compressions in adults?",
      options: [
        "At least 1 inch",
        "At least 2 inches (5 cm)",
        "At least 3 inches",
        "As deep as possible",
      ],
      correctIndex: 1,
      explanation:
        "Evidence-based guidelines recommend compressing at least 2 inches (5 cm) deep in adults to ensure adequate cardiac output during CPR.",
    },
    {
      id: 3,
      question:
        "Which rhythm requires immediate defibrillation based on ACLS protocols?",
      options: [
        "Asystole",
        "Pulseless electrical activity (PEA)",
        "Ventricular fibrillation (VF)",
        "Sinus bradycardia",
      ],
      correctIndex: 2,
      explanation:
        "Ventricular fibrillation is a shockable rhythm that requires immediate defibrillation. Asystole and PEA are non-shockable rhythms treated with medications.",
    },
    {
      id: 4,
      question:
        "What does the evidence say about the role of epinephrine in cardiac arrest?",
      options: [
        "It should never be used",
        "It improves short-term survival but may not improve neurological outcomes",
        "It guarantees full recovery",
        "It is only used in pediatric patients",
      ],
      correctIndex: 1,
      explanation:
        "Research shows epinephrine improves return of spontaneous circulation (ROSC) but evidence on long-term neurological outcomes remains debated.",
    },
    {
      id: 5,
      question:
        "Post-cardiac arrest, what is the evidence-based target temperature management recommendation?",
      options: [
        "Warm the patient immediately",
        "Maintain targeted hypothermia (32-36°C) for at least 24 hours",
        "No temperature management is needed",
        "Cool to below 30°C",
      ],
      correctIndex: 1,
      explanation:
        "Targeted temperature management (32-36°C for at least 24 hours) is recommended to improve neurological outcomes after cardiac arrest.",
    },
  ],
  4: [
    {
      id: 1,
      question:
        "According to evidence-based infection control guidelines, what is the MOST effective method to prevent healthcare-associated infections?",
      options: [
        "Wearing gloves at all times",
        "Proper hand hygiene",
        "Using antibiotics prophylactically",
        "Isolating all patients",
      ],
      correctIndex: 1,
      explanation:
        "Hand hygiene is consistently identified as the single most effective intervention for preventing healthcare-associated infections across all clinical settings.",
    },
    {
      id: 2,
      question:
        "What type of study design is best suited for investigating a disease outbreak?",
      options: [
        "Randomized controlled trial",
        "Case-control study",
        "Systematic review",
        "Qualitative interview study",
      ],
      correctIndex: 1,
      explanation:
        "Case-control studies are ideal for outbreak investigations as they compare cases (infected) with controls (non-infected) to identify exposure risk factors quickly.",
    },
    {
      id: 3,
      question: "What is the 'chain of infection' in epidemiology?",
      options: [
        "A treatment protocol for infections",
        "The sequence of events required for infection transmission",
        "A list of common antibiotics",
        "A surgical sterilization procedure",
      ],
      correctIndex: 1,
      explanation:
        "The chain of infection describes the six linked elements needed for infection to spread: infectious agent, reservoir, portal of exit, mode of transmission, portal of entry, and susceptible host.",
    },
    {
      id: 4,
      question:
        "When implementing contact precautions, which PPE is evidence-based as the minimum requirement?",
      options: [
        "N95 respirator and face shield",
        "Gloves and gown",
        "Surgical mask only",
        "Gloves only",
      ],
      correctIndex: 1,
      explanation:
        "Contact precautions require, at minimum, gloves and gown when entering the patient's room, with hand hygiene before and after removal.",
    },
    {
      id: 5,
      question:
        "What does 'antibiotic stewardship' aim to achieve in evidence-based practice?",
      options: [
        "Prescribing antibiotics for all infections",
        "Optimizing antibiotic use to reduce resistance and improve outcomes",
        "Eliminating all bacteria from the hospital",
        "Replacing antibiotics with herbal remedies",
      ],
      correctIndex: 1,
      explanation:
        "Antibiotic stewardship programs promote the appropriate use of antibiotics to improve patient outcomes, reduce antimicrobial resistance, and decrease unnecessary costs.",
    },
  ],
  5: [
    {
      id: 1,
      question:
        "In managing chronic diseases, what does 'self-management support' mean in evidence-based practice?",
      options: [
        "The patient manages everything alone",
        "Providing education, skills, and tools to empower patients in managing their condition",
        "Only physicians make management decisions",
        "Relying solely on medication adherence",
      ],
      correctIndex: 1,
      explanation:
        "Self-management support involves collaborative education and empowerment strategies that help patients actively participate in their chronic disease management.",
    },
    {
      id: 2,
      question:
        "Which research synthesis method combines quantitative results from multiple studies?",
      options: [
        "Narrative review",
        "Meta-analysis",
        "Case study",
        "Qualitative synthesis",
      ],
      correctIndex: 1,
      explanation:
        "Meta-analysis uses statistical methods to combine results from multiple studies, providing a more precise estimate of treatment effects than individual studies alone.",
    },
    {
      id: 3,
      question:
        "What is the Chronic Care Model (CCM) primarily designed to improve?",
      options: [
        "Acute emergency care",
        "The quality of chronic illness management in primary care",
        "Surgical outcomes",
        "Hospital discharge planning only",
      ],
      correctIndex: 1,
      explanation:
        "The Chronic Care Model is an evidence-based framework designed to improve the quality of chronic disease management through system-level changes in primary care.",
    },
    {
      id: 4,
      question:
        "When developing an evidence-based care plan for a patient with multiple chronic conditions, what approach is recommended?",
      options: [
        "Treat each condition in isolation",
        "Use an integrated, patient-centered approach considering all conditions",
        "Focus only on the most severe condition",
        "Follow a single disease guideline strictly",
      ],
      correctIndex: 1,
      explanation:
        "Evidence supports an integrated, patient-centered approach for multimorbidity that considers interactions between conditions and aligns treatment with patient goals.",
    },
    {
      id: 5,
      question:
        "What role does 'shared decision-making' play in chronic disease management?",
      options: [
        "The clinician makes all decisions",
        "Clinician and patient collaborate to make decisions informed by best evidence and patient values",
        "The patient decides without clinician input",
        "Decisions are made by the insurance company",
      ],
      correctIndex: 1,
      explanation:
        "Shared decision-making integrates the best available evidence with clinical expertise and patient preferences — a core principle of evidence-based practice.",
    },
  ],
};


export const TOTAL_TIME = 10 * 60;

