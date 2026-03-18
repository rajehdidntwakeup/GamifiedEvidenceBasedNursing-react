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
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";

import { TOTAL_TIME, loadRoomOfKnowledgeQuestions } from "./room-of-knowledge.data";
import type { RoomOfKnowledgeProps, RoomQuestion } from "./room-of-knowledge.data";

export function RoomOfKnowledge({ mission, onBack, onProceedToRoom2 }: RoomOfKnowledgeProps) {
  const [questions, setQuestions] = useState<RoomQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeExpired, setTimeExpired] = useState(false);

  const loadQuestions = useCallback(async () => {
    setIsLoadingQuestions(true);
    setQuestionsError(null);

    try {
      const mappedQuestions = await loadRoomOfKnowledgeQuestions(mission.id);

      setQuestions(mappedQuestions);
      setTimeLeft(TOTAL_TIME);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setScore(0);
      setIsComplete(false);
      setAnswers([]);
      setTimeExpired(false);
    } catch (error) {
      setQuestions([]);
      setQuestionsError(
        error instanceof Error && error.message
          ? error.message
          : "Failed to load Room of Knowledge questions.",
      );
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [mission.id]);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  // Timer
  useEffect(() => {
    if (
      isComplete ||
      timeExpired ||
      isLoadingQuestions ||
      !!questionsError ||
      questions.length === 0
    ) return;
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
  }, [isComplete, timeExpired, isLoadingQuestions, questionsError, questions.length]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerPercent = (timeLeft / TOTAL_TIME) * 100;
  const isTimerWarning = timeLeft < 120; // under 2 min
  const isTimerCritical = timeLeft < 60; // under 1 min

  const handleSelectAnswer = (index: number) => {
    if (isAnswered || isLoadingQuestions) return;
    const activeQuestion = questions[currentQuestion];
    if (!activeQuestion) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    const isCorrect = index === activeQuestion.correctIndex;
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
  const progressPercent =
    questions.length > 0
      ? ((currentQuestion + (isAnswered ? 1 : 0)) / questions.length) * 100
      : 0;

  if (isLoadingQuestions) {
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
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading Room of Knowledge questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (questionsError || !q) {
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
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="max-w-lg w-full text-center bg-white/5 border border-white/10 rounded-2xl p-8">
            <AlertTriangle className="w-10 h-10 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl text-white mb-3 tracking-tight">Unable to load questions</h2>
            <p className="text-gray-400 mb-6">
              {questionsError || "No playable questions were found for this mission."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onBack}
                className="px-6 py-3 bg-white/5 border border-white/10 hover:border-teal-500/40 text-white rounded-xl transition-colors"
              >
                Back to Missions
              </button>
              <button
                onClick={() => {
                  void loadQuestions();
                }}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Retry Load
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = score === questions.length;
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
                  {passed ? "PASSED" : "All questions must be correct"}
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
                    You&apos;ve earned two letters for solving the case. Keep these safe — you&apos;ll need them later!
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
                {isAnswered && q.explanation && (
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


