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
import { LOE_OPTIONS, METHODOLOGY_MIN_WORDS, STUDIES_BY_MISSION, TOTAL_TIME } from "./room-of-analytics.data";
import type { RoomOfAnalyticsProps } from "./room-of-analytics.data";

export function RoomOfAnalytics({ mission, onBack, onProceedToRoom4 }: RoomOfAnalyticsProps) {
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

  const studies = STUDIES_BY_MISSION[mission.id] || STUDIES_BY_MISSION[1];
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
                      {LOE_OPTIONS.map((opt) => (
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



