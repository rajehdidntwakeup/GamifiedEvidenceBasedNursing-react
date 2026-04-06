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
import {motion, AnimatePresence} from "motion/react";
import {useState, useEffect, useCallback} from "react";

import {roomOfKnowledgeApi} from "./api";
import {TOTAL_TIME, loadRoomOfKnowledgeQuestions} from "./room-of-knowledge.data";
import type {RoomOfKnowledgeProps, RoomQuestion, QuestionResult} from "./room-of-knowledge.data";

export function RoomOfKnowledge({mission, onBack, onProceedToRoom2}: RoomOfKnowledgeProps) {
    const [questions, setQuestions] = useState<RoomQuestion[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
    const [questionsError, setQuestionsError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isVerifyingAnswer, setIsVerifyingAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [verifiedCorrectIndex, setVerifiedCorrectIndex] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [results, setResults] = useState<QuestionResult[]>([]);
    const [timeExpired, setTimeExpired] = useState(false);
    const [isProceeding, setIsProceeding] = useState(false);
    const [proceedError, setProceedError] = useState<string | null>(null);
    const [resultProgress, setResultProgress] = useState<number | null>(null);
    const [resultKey, setResultKey] = useState<string | null>(null);

    const loadQuestions = useCallback(async () => {
        setIsLoadingQuestions(true);
        setQuestionsError(null);

        try {
            const mappedQuestions = await loadRoomOfKnowledgeQuestions();

            setQuestions(mappedQuestions);
            setTimeLeft(TOTAL_TIME);
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setScore(0);
            setIsComplete(false);
            setAnswers([]);
            setResults([]);
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
            setVerifiedCorrectIndex(null);
        }
    }, []);

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

    const handleSelectAnswer = async (index: number) => {
        if (isAnswered || isLoadingQuestions || isVerifyingAnswer) return;
        const activeQuestion = questions[currentQuestion];
        if (!activeQuestion) return;

        setIsVerifyingAnswer(true);
        setSelectedAnswer(index);

        // Get the answerId for this index from the stored answerIds
        const answerId = activeQuestion.answerIds[index];

        // Get roomId from sessionStorage
        const storedRoomId = sessionStorage.getItem("activeRoomId");
        const roomId = storedRoomId ? Number(storedRoomId) : 1;

        // Call API to verify answer
        const isCorrect = await roomOfKnowledgeApi.verifyAnswer(
            roomId,
            activeQuestion.id,
            answerId
        );

        setIsVerifyingAnswer(false);
        setIsAnswered(true);
        if (isCorrect) {
            setScore((s) => s + 1);
            setVerifiedCorrectIndex(index);
        } else {
            setVerifiedCorrectIndex(activeQuestion.correctIndex);
        }
        setAnswers((prev) => [...prev, index]);
        setResults((prev) => [...prev, {
            question: activeQuestion.question,
            isCorrect: isCorrect
        }]);
    };

    const handleNext = useCallback(async () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((q) => q + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setVerifiedCorrectIndex(null);
        } else {
            // Fetch result from API before showing results screen
            const storedRoomId = sessionStorage.getItem("activeRoomId");
            const roomId = storedRoomId ? Number(storedRoomId) : 1;

            try {
                const result = await roomOfKnowledgeApi.getResult(roomId);
                setResultProgress(result.progress);
                setResultKey(result.key);

                // Save clue letters to sessionStorage if progress is 100%
                if (result.progress === 100 && result.key) {
                    sessionStorage.setItem("roomOfKnowledgeKey", result.key);
                }
            } catch {
                // If API fails, fall back to local calculation
                setResultProgress(Math.round((score / questions.length) * 100));
                setResultKey(null);
            }

            setIsComplete(true);
        }
    }, [currentQuestion, questions.length, score]);

    const q = questions[currentQuestion];
    const progressPercent =
        questions.length > 0
            ? ((currentQuestion + (isAnswered ? 1 : 0)) / questions.length) * 100
            : 0;

    const handleProceed = async () => {
        if (!onProceedToRoom2 || isProceeding) return;

        setIsProceeding(true);
        setProceedError(null);

        try {
            // Get roomId from sessionStorage
            const storedRoomId = sessionStorage.getItem("activeRoomId");
            const roomId = storedRoomId ? Number(storedRoomId) : 1;

            const response = await roomOfKnowledgeApi.proceed({ roomId });

            // Store the next room's questions/data if needed
            if (response.questions) {
                sessionStorage.setItem("roomOfAbstractsData", JSON.stringify(response));
            }

            // Update room ID in session storage
            sessionStorage.setItem("activeRoomId", String(response.roomId));

            onProceedToRoom2();
        } catch (error) {
            console.error("Failed to proceed to Room 2:", error);
            setProceedError(
                error instanceof Error && error.message
                    ? error.message
                    : "Failed to proceed to the next room. Please try again.",
            );
        } finally {
            setIsProceeding(false);
        }
    };

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
                        <div
                            className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"/>
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
                        <AlertTriangle className="w-10 h-10 text-orange-400 mx-auto mb-4"/>
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
                                <ChevronRight className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isComplete) {
        const pct = resultProgress ?? Math.round((score / questions.length) * 100);
        const passed = pct === 100;
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
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 0.5}}
                        className="max-w-lg w-full text-center"
                    >
                        {timeExpired && (
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-6">
                                <AlertTriangle className="w-4 h-4"/>
                                <span className="font-[JetBrains_Mono,monospace] text-sm">TIME EXPIRED</span>
                            </div>
                        )}
                        <div
                            className={`w-20 h-20 rounded-2xl ${passed ? "bg-teal-500/20" : "bg-orange-500/20"} flex items-center justify-center mx-auto mb-6`}
                        >
                            {passed ? (
                                <Trophy className="w-10 h-10 text-teal-400"/>
                            ) : (
                                <AlertTriangle className="w-10 h-10 text-orange-400"/>
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
                                <span className="text-gray-400">Progress</span>
                                <span className="text-white text-2xl font-[JetBrains_Mono,monospace]">
                  {pct}%
                </span>
                            </div>
                            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
                                <motion.div
                                    initial={{width: 0}}
                                    animate={{width: `${pct}%`}}
                                    transition={{duration: 1, delay: 0.3}}
                                    className={`h-full rounded-full ${passed ? "bg-teal-500" : "bg-orange-500"}`}
                                />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                  {passed ? "Perfect score!" : "Not enough"}
                </span>
                                <span className={passed ? "text-teal-400" : "text-orange-400"}>
                  {passed ? "ROOM CLEARED" : "100% required to pass"}
                </span>
                            </div>
                        </div>

                        {/* Clue Letters Reward */}
                        {passed && resultKey && (
                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.6, delay: 1.2}}
                                className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden"
                            >
                                {/* Scanline effect */}
                                <div className="absolute inset-0 opacity-5" style={{
                                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(20,184,166,0.3) 2px, rgba(20,184,166,0.3) 4px)",
                                }}/>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <KeyRound className="w-5 h-5 text-teal-400"/>
                                        <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-sm">CLUE LETTERS UNLOCKED</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-5">
                                        You&apos;ve earned two letters for solving the case. Keep these safe —
                                        you&apos;ll need them later!
                                    </p>
                                    <div className="flex items-center justify-center gap-6">
                                        {resultKey.split("-").map((letter, i) => (
                                            <motion.div
                                                key={letter}
                                                initial={{opacity: 0, scale: 0, rotateY: 180}}
                                                animate={{opacity: 1, scale: 1, rotateY: 0}}
                                                transition={{
                                                    duration: 0.6,
                                                    delay: 1.6 + i * 0.3,
                                                    type: "spring",
                                                    stiffness: 200
                                                }}
                                                className="w-16 h-20 bg-[#0a1f22] border-2 border-teal-500/60 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.2)]"
                                            >
                                                <span
                                                    className="text-teal-400 text-3xl font-[JetBrains_Mono,monospace]">{letter}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-xs mt-4 font-[JetBrains_Mono,monospace]">
                                        FRAGMENT 1 OF ? // COLLECTED: {resultKey.replace("-", " , ")}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Question review (Cash Memo) */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
                            <h3 className="text-teal-400 font-[JetBrains_Mono,monospace] text-sm mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                MISSION REPORT
                            </h3>
                            <div className="space-y-3">
                                {results.map((result, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                                    >
                                        {result.isCorrect ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                <span className="text-gray-500 font-[JetBrains_Mono,monospace] mr-2">#{i + 1}</span>
                                                {result.question}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                                {results.length === 0 && (
                                    <p className="text-gray-500 text-sm italic text-center py-4">No questions answered.</p>
                                )}
                            </div>
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
                                        onClick={async () => {
                                            const storedRoomId = sessionStorage.getItem("activeRoomId");
                                            const roomId = storedRoomId ? Number(storedRoomId) : 1;

                                            try {
                                                await roomOfKnowledgeApi.retryRoom(roomId);
                                            } catch (error) {
                                                console.error("Failed to retry room:", error);
                                            }

                                            setTimeLeft(TOTAL_TIME);
                                            setCurrentQuestion(0);
                                            setSelectedAnswer(null);
                                            setIsAnswered(false);
                                            setScore(0);
                                            setIsComplete(false);
                                            setAnswers([]);
                                            setResults([]);
                                            setTimeExpired(false);
                                            setResultProgress(null);
                                            setResultKey(null);
                                        }}
                                    className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    Retry Room
                                    <ChevronRight className="w-4 h-4"/>
                                </button>
                            )}
                            {passed && onProceedToRoom2 && (
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={handleProceed}
                                        disabled={isProceeding}
                                        className="px-6 py-3 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isProceeding ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4"/>
                                        )}
                                        Proceed to Room 2
                                    </button>
                                    {proceedError && (
                                        <p className="text-red-400 text-xs mt-1">{proceedError}</p>
                                    )}
                                </div>
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
                            <ArrowLeft className="w-5 h-5"/>
                            <span className="hidden sm:inline">Abort Mission</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-teal-400"/>
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
                        style={{width: `${timerPercent}%`}}
                        transition={{duration: 0.5}}
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
                                animate={{width: `${progressPercent}%`}}
                                transition={{duration: 0.3}}
                            />
                        </div>

                        {/* Question */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion}
                                initial={{opacity: 0, x: 20}}
                                animate={{opacity: 1, x: 0}}
                                exit={{opacity: 0, x: -20}}
                                transition={{duration: 0.3}}
                            >
                                <h2 className="text-xl md:text-2xl text-white mb-8 tracking-tight">
                                    {q.question}
                                </h2>

                                {/* Options */}
                                <div className="space-y-3 mb-8">
                                    {q.options.map((option, i) => {
                                        const isSelected = selectedAnswer === i;
                                        const isCorrect = verifiedCorrectIndex !== null ? i === verifiedCorrectIndex : i === q.correctIndex;
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
                                                disabled={isAnswered || isVerifyingAnswer}
                                                className={`w-full text-left px-5 py-4 rounded-xl border ${borderClass} ${bgClass} transition-all flex items-center gap-4 ${!isAnswered && !isVerifyingAnswer ? "cursor-pointer" : "cursor-default"}`}
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
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen className="w-4 h-4 text-teal-400"/>
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
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        className="flex justify-end"
                                    >
                                        <button
                                            onClick={handleNext}
                                            className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center gap-2"
                                        >
                                            {currentQuestion < questions.length - 1
                                                ? "Next Question"
                                                : "View Results"}
                                            <ChevronRight className="w-4 h-4"/>
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


