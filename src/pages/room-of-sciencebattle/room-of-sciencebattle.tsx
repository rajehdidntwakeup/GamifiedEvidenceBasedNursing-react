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
import { motion } from "motion/react";
import { useState, useEffect } from "react";

import { JUSTIFICATION_MIN_WORDS, LOE_OPTIONS, STUDY_PAIRS_BY_MISSION, TOTAL_TIME } from "./room-of-sciencebattle.data";
import type { RoomOfSciencebattleProps, StudyCompact } from "./room-of-sciencebattle.data";

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

  const pair = STUDY_PAIRS_BY_MISSION[mission.id] || STUDY_PAIRS_BY_MISSION[1];

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
    <button
      type="button"
      className="group bg-[#faf9f6] rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-shadow w-full text-left"
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
    </button>
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
              STUDY {viewingStudy} | COMPARE CAREFULLY WITH THE OTHER STUDY
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
            <h2 className="text-3xl text-white mb-2">Time&apos;s Up!</h2>
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
                    {LOE_OPTIONS.map((opt) => (
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
                    {LOE_OPTIONS.map((opt) => (
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



