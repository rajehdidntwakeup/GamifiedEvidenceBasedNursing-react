import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronRight,
  AlertTriangle,
  Trophy,
  KeyRound,
} from "lucide-react";

interface Mission {
  id: number;
  title: string;
  subtitle: string;
  textColor: string;
  bgColor: string;
}

interface RoomOfKnowledgeProps {
  mission: Mission;
  onBack: () => void;
  onProceedToRoom2?: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const questionsByMission: Record<number, Question[]> = {
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

export function RoomOfKnowledge({ mission, onBack, onProceedToRoom2 }: RoomOfKnowledgeProps) {
  const TOTAL_TIME = 10 * 60; // 10 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeExpired, setTimeExpired] = useState(false);

  const questions = questionsByMission[mission.id] || questionsByMission[1];

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
  const isTimerWarning = timeLeft < 120; // under 2 min
  const isTimerCritical = timeLeft < 60; // under 1 min

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    const isCorrect = index === questions[currentQuestion].correctIndex;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, index]);
  };

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
    }
  }, [currentQuestion, questions.length]);

  const q = questions[currentQuestion];
  const progressPercent = ((currentQuestion + (isAnswered ? 1 : 0)) / questions.length) * 100;

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;
    return (
      <div className="fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto font-[Inter,sans-serif]">
        {/* Grid overlay */}
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
            className="max-w-lg w-full text-center"
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
              {timeExpired
                ? `You answered ${answers.length} of ${questions.length} questions before time ran out.`
                : passed
                  ? "Excellent work, Agent. Your evidence analysis skills are sharp."
                  : "Review the evidence and try again, Agent. Knowledge is power."}
            </p>

            {/* Score display */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">Score</span>
                <span className="text-white text-2xl font-[JetBrains_Mono,monospace]">
                  {score}/{questions.length}
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

            {/* Clue Letters Reward */}
            {passed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden"
              >
                {/* Scanline effect */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(20,184,166,0.3) 2px, rgba(20,184,166,0.3) 4px)",
                }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <KeyRound className="w-5 h-5 text-teal-400" />
                    <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-sm">CLUE LETTERS UNLOCKED</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-5">
                    You've earned two letters for solving the case. Keep these safe — you'll need them later!
                  </p>
                  <div className="flex items-center justify-center gap-6">
                    {["E", "C"].map((letter, i) => (
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
                    FRAGMENT 1 OF ? // COLLECT ALL LETTERS TO SOLVE THE CASE
                  </p>
                </div>
              </motion.div>
            )}

            {/* Question review */}
            <div className="space-y-2 mb-8">
              {questions.map((question, i) => {
                const userAnswer = answers[i];
                const isCorrect = userAnswer === question.correctIndex;
                const wasAnswered = userAnswer !== undefined;
                return (
                  <div
                    key={question.id}
                    className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 text-left"
                  >
                    {wasAnswered ? (
                      isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-600 shrink-0" />
                    )}
                    <span className="text-gray-300 text-sm truncate">
                      Q{i + 1}: {question.question}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onBack}
                className="px-6 py-3 bg-white/5 border border-white/10 hover:border-teal-500/40 text-white rounded-xl transition-colors"
              >
                Back to Missions
              </button>
              {!passed && (
                <button
                  onClick={() => {
                    setTimeLeft(TOTAL_TIME);
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setIsAnswered(false);
                    setScore(0);
                    setIsComplete(false);
                    setAnswers([]);
                    setTimeExpired(false);
                  }}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Retry Room
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {passed && onProceedToRoom2 && (
                <button
                  onClick={onProceedToRoom2}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Room 2
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto font-[Inter,sans-serif]">
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
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Abort Mission</span>
            </button>

            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-400" />
              <span className="text-white font-[JetBrains_Mono,monospace] text-sm">
                ROOM 1 — KNOWLEDGE
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
              <Clock
                className={`w-4 h-4 ${isTimerCritical ? "animate-pulse" : ""}`}
              />
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

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="max-w-3xl w-full">
            {/* Progress */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className={`text-sm ${mission.textColor}`}>
                {mission.subtitle} — {mission.title}
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-8">
              <motion.div
                className="h-full bg-teal-500 rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl md:text-2xl text-white mb-8 tracking-tight">
                  {q.question}
                </h2>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {q.options.map((option, i) => {
                    const isSelected = selectedAnswer === i;
                    const isCorrect = i === q.correctIndex;
                    let borderClass = "border-white/10 hover:border-teal-500/40";
                    let bgClass = "bg-white/5 hover:bg-white/[0.07]";
                    let labelColor = "text-gray-500";

                    if (isAnswered) {
                      if (isCorrect) {
                        borderClass = "border-green-500/60";
                        bgClass = "bg-green-500/10";
                        labelColor = "text-green-400";
                      } else if (isSelected && !isCorrect) {
                        borderClass = "border-red-500/60";
                        bgClass = "bg-red-500/10";
                        labelColor = "text-red-400";
                      } else {
                        borderClass = "border-white/5";
                        bgClass = "bg-white/[0.02]";
                        labelColor = "text-gray-700";
                      }
                    } else if (isSelected) {
                      borderClass = "border-teal-500/60";
                      bgClass = "bg-teal-500/10";
                      labelColor = "text-teal-400";
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelectAnswer(i)}
                        disabled={isAnswered}
                        className={`w-full text-left px-5 py-4 rounded-xl border ${borderClass} ${bgClass} transition-all flex items-center gap-4 ${!isAnswered ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-[JetBrains_Mono,monospace] shrink-0 ${labelColor} border ${isAnswered && isCorrect ? "border-green-500/40 bg-green-500/20" : isAnswered && isSelected && !isCorrect ? "border-red-500/40 bg-red-500/20" : "border-white/10 bg-white/5"}`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span
                          className={`${isAnswered && !isCorrect && !isSelected ? "text-gray-600" : "text-gray-200"}`}
                        >
                          {option}
                        </span>
                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-green-400 ml-auto shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-400 ml-auto shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-teal-400" />
                      <span className="text-teal-400 text-sm font-[JetBrains_Mono,monospace]">
                        EVIDENCE BRIEFING
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{q.explanation}</p>
                  </motion.div>
                )}

                {/* Next button */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-end"
                  >
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center gap-2"
                    >
                      {currentQuestion < questions.length - 1
                        ? "Next Question"
                        : "View Results"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}