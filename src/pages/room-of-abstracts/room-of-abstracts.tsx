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
import { AHCPR_OPTIONS, ARTICLES_BY_MISSION, PYRAMID_OPTIONS, STUDY_DESIGN_OPTIONS, TOTAL_TIME } from "./room-of-abstracts.data";
import type { RoomOfAbstractsProps, TableRow } from "./room-of-abstracts.data";

export function RoomOfAbstracts({ mission, onBack, onProceedToRoom3 }: RoomOfAbstractsProps) {
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

  const articles = ARTICLES_BY_MISSION[mission.id] || ARTICLES_BY_MISSION[1];

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
                    {["E", "C"].map((letter) => (
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
                            {PYRAMID_OPTIONS.map((opt) => (
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
                            {AHCPR_OPTIONS.map((opt) => (
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
                            {STUDY_DESIGN_OPTIONS.map((opt) => (
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



