import {
  ArrowLeft,
  Clock,
  FileText,
  ChevronRight,
  AlertTriangle,
  Trophy,
  KeyRound,
  Image as ImageIcon,
  X,
  ZoomIn,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

import { roomOfAbstractsApi } from "./api";
import {
  TOTAL_TIME,
} from "./room-of-abstracts.data";
import type {
  RoomOfAbstractsProps,
  StoredRoomOfAbstractsData,
  TableQuestion,
  TableRow,
  CellOptions,
} from "./room-of-abstracts.data";

// Direct imports for all abstracts
// When backend sends "abstracts/mission1/1_Abstract_Expertenkommentar.PNG" we extract
// the filename "1_Abstract_Expertenkommentar.PNG" and match it here
import m1_a1 from "@/shared/assets/abstracts/mission1/1_Abstract_Expertenkommentar.PNG?url";
import m1_a2 from "@/shared/assets/abstracts/mission1/2_Abstract_Santamarie_et_al_RCT.PNG?url";
import m1_a3 from "@/shared/assets/abstracts/mission1/3_Abstract_Zhang_et_al.PNG?url";
import m2_a1 from "@/shared/assets/abstracts/mission2/1_Abstract_Effects_of_VR_Games.PNG?url";
import m2_a2 from "@/shared/assets/abstracts/mission2/2_Abstract_Bedrails_and_Falls_in_Nursing_Homes.PNG?url";
import m2_a3 from "@/shared/assets/abstracts/mission2/3_Abstract_Expertenkommentar.PNG?url";
import m3_a1 from "@/shared/assets/abstracts/mission3/1_Abstract_PostoperstivePaintreatmentwithDementia.PNG?url";
import m3_a2 from "@/shared/assets/abstracts/mission3/2_Abstract_Documentaton_for_Assessing_Pain_inPostoperative.PNG?url";
import m3_a3 from "@/shared/assets/abstracts/mission3/3_Abstract_Nursing_Music_Protocol_and_Postoperative_Pain.PNG?url";
import m4_a1 from "@/shared/assets/abstracts/mission4/1_Abstract_Ten_Cate_et_al_Systematic_Review.PNG?url";
import m4_a2 from "@/shared/assets/abstracts/mission4/2_Abstract_weerasag_et_al_RCT.PNG?url";
import m4_a3 from "@/shared/assets/abstracts/mission4/3_Abstract_Gefahr_einer_Mangelernährung_Querschnittstudie.PNG?url";
import m5_a1 from "@/shared/assets/abstracts/mission5/1_Abstract_Urin_Sampling_is_associated_with_reduced_CAUTI_2021.PNG?url";
import m5_a2 from "@/shared/assets/abstracts/mission5/2_Abstract_Implementation_of_a_multi_modal_inervention_CAUTI2024.PNG?url";
import m5_a3 from "@/shared/assets/abstracts/mission5/3_Abstracxt_PRactice_REcommendation_CAUTI2023.PNG?url";

// Map by filename only
const abstracts: Record<string, string> = {
  "1_Abstract_Expertenkommentar.PNG": m1_a1,
  "2_Abstract_Santamarie_et_al_RCT.PNG": m1_a2,
  "3_Abstract_Zhang_et_al.PNG": m1_a3,
  "1_Abstract_Effects_of_VR_Games.PNG": m2_a1,
  "2_Abstract_Bedrails_and_Falls_in_Nursing_Homes.PNG": m2_a2,
  "3_Abstract_Expertenkommentar.PNG": m2_a3,
  "1_Abstract_PostoperstivePaintreatmentwithDementia.PNG": m3_a1,
  "2_Abstract_Documentaton_for_Assessing_Pain_inPostoperative.PNG": m3_a2,
  "3_Abstract_Nursing_Music_Protocol_and_Postoperative_Pain.PNG": m3_a3,
  "1_Abstract_Ten_Cate_et_al_Systematic_Review.PNG": m4_a1,
  "2_Abstract_weerasag_et_al_RCT.PNG": m4_a2,
  "3_Abstract_Gefahr_einer_Mangelernährung_Querschnittstudie.PNG": m4_a3,
  "1_Abstract_Urin_Sampling_is_associated_with_reduced_CAUTI_2021.PNG": m5_a1,
  "2_Abstract_Implementation_of_a_multi_modal_inervention_CAUTI2024.PNG": m5_a2,
  "3_Abstracxt_PRactice_REcommendation_CAUTI2023.PNG": m5_a3,
};

function getAbstractImage(docPath: string): string | undefined {
  if (!docPath) return undefined;
  // docPath is like "abstracts/mission1/1_Abstract_Expertenkommentar.PNG"
  // Extract just the filename
  const filename = docPath.split("/").pop();
  return filename ? abstracts[filename] : undefined;
}

const STORAGE_KEY = "roomOfAbstractsData";

// Build an empty row
function emptyRow(): TableRow {
  return {
    titleAuthor: { answerId: null, questionId: null },
    pyramid: { answerId: null, questionId: null },
    ahcpr: { answerId: null, questionId: null },
    studyDesign: { answerId: null, questionId: null },
  };
}

// Parse question prefix like "4_2_Study Design?" → { col: 4, row: 2, rest: "Study Design?" }
function parseQuestionKey(question: string): { col: number; row: number; rest: string } | null {
  const match = question.match(/^(\d+)_(\d+)_(.*)$/);
  if (!match) return null;
  return { col: Number(match[1]), row: Number(match[2]), rest: match[3] };
}

interface MappedTable {
  rows: TableRow[];
  rowCount: number;
}

function buildTable(questions: TableQuestion[]): MappedTable {
  const cellMap = new Map<string, { questionId: number }>();

  for (const q of questions) {
    const parsed = parseQuestionKey(q.question);
    if (!parsed) continue;
    const col = parsed.col;
    if (!col) continue;
    const row = parsed.row;
    const key = `${col}_${row}`;
    cellMap.set(key, { questionId: q.questionId });
  }
  let maxRow = 0;
  for (const key of cellMap.keys()) {
    const row = Number(key.split("_")[1]);
    if (row > maxRow) maxRow = row;
  }

  const rows: TableRow[] = [];
  for (let n = 0; n < maxRow; n++) {
      let r = n + 1;
    const row = emptyRow();

    const titleCell = cellMap.get(`1_${r}`);
    if (titleCell) row.titleAuthor = { answerId: null, questionId: titleCell.questionId };

    const pyramidCell = cellMap.get(`2_${r}`);
    if (pyramidCell) row.pyramid = { answerId: null, questionId: pyramidCell.questionId };

    const ahcprCell = cellMap.get(`3_${r}`);
    if (ahcprCell) row.ahcpr = { answerId: null, questionId: ahcprCell.questionId };

    const designCell = cellMap.get(`4_${r}`);
    if (designCell) row.studyDesign = { answerId: null, questionId: designCell.questionId };
    rows.push(row);
  }
  return { rows, rowCount: maxRow };
}

// Build dropdown options per col/row from the questions
// Uses parsed.col (the first number in "4_2_Study_Title_And_Autor?") directly as column index
function buildCellOptions(questions: TableQuestion[]): Map<number, CellOptions> {
  const optionsMap = new Map<number, CellOptions>();

  for (const q of questions) {
    const parsed = parseQuestionKey(q.question);
    if (!parsed) continue;
    // Store by row index (0, 1, 2) instead of parsed.row (1, 2, 3)
    const rowIndex = parsed.row - 1;
    if (!optionsMap.has(rowIndex)) {
      optionsMap.set(rowIndex, { titleAuthor: [], pyramid: [], ahcpr: [], studyDesign: [] });
    }
    const rowOpts = optionsMap.get(rowIndex)!;
    if (parsed.col === 1) rowOpts.titleAuthor = q.answers;
    else if (parsed.col === 2) rowOpts.pyramid = q.answers;
    else if (parsed.col === 3) rowOpts.ahcpr = q.answers;
    else if (parsed.col === 4) rowOpts.studyDesign = q.answers;
  }

  return optionsMap;
}

function loadStoredData(): StoredRoomOfAbstractsData | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as StoredRoomOfAbstractsData;
    // Ensure docs is always an array
    if (!data.docs) {
      data.docs = [];
    }
    // Migrate from old 'images' field to 'docs'
    const legacyData = data as unknown as { images?: string[] };
    if (legacyData.images && legacyData.images.length > 0 && data.docs.length === 0) {
      data.docs = legacyData.images;
      delete legacyData.images;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    return data;
  } catch {
    return null;
  }
}

export function RoomOfAbstracts({ onBack, onProceedToRoom3 }: RoomOfAbstractsProps) {
  const [data, setData] = useState<StoredRoomOfAbstractsData | null>(null);
  const [tableRows, setTableRows] = useState<TableRow[]>([]);
  const [cellOptions, setCellOptions] = useState<Map<number, CellOptions>>(new Map());
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [resultProgress, setResultProgress] = useState<number | null>(null);
  const [resultKey, setResultKey] = useState<string | null>(null);
  const [previousKey, setPreviousKey] = useState<string | null>(null);

  // Load from sessionStorage on mount
  useEffect(() => {
    const loaded = loadStoredData();
    if (!loaded || loaded.questions.length === 0) {
      setData(null);
      setTableRows([]);
      return;
    }
    setData(loaded);
    const { rows } = buildTable(loaded.questions);
    const options = buildCellOptions(loaded.questions);
    setTableRows(rows);
    setCellOptions(options);
    setTimeLeft(TOTAL_TIME);
    setTimeExpired(false);
    setIsComplete(false);

    // Load previously collected key from Room of Knowledge
    const storedKey = sessionStorage.getItem("roomOfKnowledgeKey");
    setPreviousKey(storedKey);
  }, []);

  // Timer
  useEffect(() => {
    if (isComplete || timeExpired || tableRows.length === 0) return;
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
  }, [isComplete, timeExpired, tableRows.length]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerPercent = (timeLeft / TOTAL_TIME) * 100;
  const isTimerWarning = timeLeft < 180;
  const isTimerCritical = timeLeft < 60;

  const updateCell = (rowIndex: number, field: keyof TableRow, answerId: number | null) => {
    setTableRows((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [field]: { ...updated[rowIndex][field], answerId } };
      return updated;
    });
  };

  const allFilled =
    tableRows.length > 0 &&
    tableRows.every(
      (row) =>
        row.titleAuthor.answerId !== null &&
        row.pyramid.answerId !== null &&
        row.ahcpr.answerId !== null &&
        row.studyDesign.answerId !== null,
    );

  const handleSubmit = async () => {
    if (!data || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const answers = tableRows
        .flatMap((row) => [
          row.titleAuthor.questionId !== null
            ? { questionId: row.titleAuthor.questionId, answerId: row.titleAuthor.answerId }
            : null,
          row.pyramid.questionId !== null
            ? { questionId: row.pyramid.questionId, answerId: row.pyramid.answerId }
            : null,
          row.ahcpr.questionId !== null
            ? { questionId: row.ahcpr.questionId, answerId: row.ahcpr.answerId }
            : null,
          row.studyDesign.questionId !== null
            ? { questionId: row.studyDesign.questionId, answerId: row.studyDesign.answerId }
            : null,
        ])
        .filter((a): a is { questionId: number; answerId: number | null } => a !== null && a.answerId !== null);

      const result = await roomOfAbstractsApi.verifyAnswers({
        roomId: data.roomId,
        missionId: data.missionId,
        answers: answers as { questionId: number; answerId: number }[],
      });

      setResultProgress(result.progress);
      setResultKey(result.key);

      // Save clue letters to sessionStorage if progress is 100%
      if (result.progress === 100 && result.key) {
        sessionStorage.setItem("roomOfAbstractsKey", result.key);
      }

      setIsComplete(true);
    } catch {
      setSubmitError("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = async () => {
    if (!data) return;

    try {
      await roomOfAbstractsApi.retryRoom(data.roomId);
    } catch (error) {
      console.error("Failed to retry room:", error);
    }

    const { rows } = buildTable(data.questions);
    const options = buildCellOptions(data.questions);
    setTableRows(rows);
    setCellOptions(options);
    setTimeLeft(TOTAL_TIME);
    setTimeExpired(false);
    setIsComplete(false);
    setSubmitError(null);
  };

  // ── No data found ─────────────────────────────────────────────────────────
  if (!data || tableRows.length === 0) {
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
            <h2 className="text-2xl text-white mb-3 tracking-tight">No Room Data Found</h2>
            <p className="text-gray-400 mb-6">
              Please complete Room 1 first, then proceed to this room.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors"
            >
              Back to Missions
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Results screen ────────────────────────────────────────────────────────
  if (isComplete) {
    const didPass = resultProgress === 100;
    const pct = resultProgress ?? 0;

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
              className={`w-20 h-20 rounded-2xl ${didPass ? "bg-teal-500/20" : "bg-orange-500/20"} flex items-center justify-center mx-auto mb-6`}
            >
              {didPass ? (
                <Trophy className="w-10 h-10 text-teal-400" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-orange-400" />
              )}
            </div>
            <h2 className="text-3xl text-white mb-2 tracking-tight">
              {timeExpired ? "Time's Up!" : didPass ? "Room Cleared!" : "Room Failed"}
            </h2>
            <p className="text-gray-400 mb-8">
              {didPass
                ? "Excellent analysis, Agent. You've demonstrated strong evidence appraisal skills."
                : "Perfect score required. Review the abstracts more carefully and try again, Agent."}
            </p>

            {/* Progress */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">Progress</span>
                <span className="text-white text-2xl font-[JetBrains_Mono,monospace]">
                  {pct}%
                </span>
              </div>
              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full rounded-full ${didPass ? "bg-teal-500" : "bg-orange-500"}`}
                />
              </div>
              <div className="flex items-center justify-between text-sm mt-4">
                <span className="text-gray-500">
                  {didPass ? "Perfect score!" : "Not enough"}
                </span>
                <span className={didPass ? "text-teal-400" : "text-orange-400"}>
                  {didPass ? "ROOM CLEARED" : "100% required to pass"}
                </span>
              </div>
            </div>

            {/* Clue Letters */}
            {didPass && resultKey && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 border border-teal-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(20,184,166,0.3) 2px, rgba(20,184,166,0.3) 4px)",
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
                    {previousKey && previousKey.split("-").map((letter) => (
                      <div
                        key={`prev-${letter}`}
                        className="w-12 h-15 bg-[#0a1f22]/60 border border-white/10 rounded-lg flex items-center justify-center opacity-40"
                      >
                        <span className="text-gray-500 text-xl font-[JetBrains_Mono,monospace]">{letter}</span>
                      </div>
                    ))}
                    <div className="w-px h-12 bg-teal-500/30 mx-1" />
                    {resultKey.split("-").map((letter, i) => (
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
                    FRAGMENT 2 OF ? // COLLECTED: {previousKey ? previousKey.replace("-", ", ") + ", " : ""}{resultKey.replace("-", ", ")}
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
              {!didPass && (
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Retry Room <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {didPass && onProceedToRoom3 && (
                <button
                  onClick={onProceedToRoom3}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Room 3 <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Main room UI ───────────────────────────────────────────────────────────
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
              isTimerCritical ? "bg-red-500" : isTimerWarning ? "bg-orange-500" : "bg-teal-500"
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
                {data.mainQuestion}
              </p>
            </motion.div>

            {/* Abstract Docs */}
            {Array.isArray(data.docs) && data.docs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-4 h-4 text-teal-400" />
                  <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-sm">
                    RESEARCH ABSTRACTS
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.docs.map((doc, i) => {
                    if (!doc || typeof doc !== "string") return null;
                    const src = getAbstractImage(doc);
                    if (!src) return null;
                    return (
                      <div
                        key={i}
                        className="bg-white rounded-xl overflow-hidden border border-white/10 cursor-pointer group hover:border-teal-500/50 transition-all"
                        onClick={() => setExpandedImage(src)}
                      >
                        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                          <p className="text-gray-500 text-xs font-[JetBrains_Mono,monospace]">
                            ABSTRACT {i + 1}
                          </p>
                          <ZoomIn className="w-3.5 h-3.5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                        </div>
                        <img
                          src={src}
                          alt={`Abstract ${i + 1}`}
                          className="w-full h-auto object-contain max-h-64 group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Classification Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-400" />
                <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-sm">
                  EVIDENCE CLASSIFICATION TABLE
                </span>
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
                    {tableRows.map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-4 px-4">
                          <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs font-[JetBrains_Mono,monospace]">
                            {i + 1}
                          </div>
                        </td>
                        {/* Author */}
                        <td className="py-4 px-4">
                          <select
                            value={row.titleAuthor.answerId ?? ""}
                            onChange={(e) => updateCell(i, "titleAuthor", e.target.value ? Number(e.target.value) : null)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-teal-500 focus:outline-none text-sm appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 8px center",
                            }}
                          >
                            <option value="" className="bg-[#0a1f22] text-white">Select author...</option>
                            {(cellOptions.get(i)?.titleAuthor ?? []).map((opt) => (
                              <option key={opt.answerId} value={opt.answerId} className="bg-[#0a1f22] text-white">
                                {opt.answer}
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* Pyramid (LoE) */}
                        <td className="py-4 px-4">
                          <select
                            value={row.pyramid.answerId ?? ""}
                            onChange={(e) => updateCell(i, "pyramid", e.target.value ? Number(e.target.value) : null)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-teal-500 focus:outline-none text-sm appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 8px center",
                            }}
                          >
                            <option value="" className="bg-[#0a1f22] text-white">Select LoE...</option>
                            {(cellOptions.get(i)?.pyramid ?? []).map((opt) => (
                              <option key={opt.answerId} value={opt.answerId} className="bg-[#0a1f22] text-white">
                                {opt.answer}
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* AHCPR */}
                        <td className="py-4 px-4">
                          <select
                            value={row.ahcpr.answerId ?? ""}
                            onChange={(e) => updateCell(i, "ahcpr", e.target.value ? Number(e.target.value) : null)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-teal-500 focus:outline-none text-sm appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 8px center",
                            }}
                          >
                            <option value="" className="bg-[#0a1f22] text-white">Select AHCPR...</option>
                            {(cellOptions.get(i)?.ahcpr ?? []).map((opt) => (
                              <option key={opt.answerId} value={opt.answerId} className="bg-[#0a1f22] text-white">
                                {opt.answer}
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* Study Design */}
                        <td className="py-4 px-4">
                          <select
                            value={row.studyDesign.answerId ?? ""}
                            onChange={(e) => updateCell(i, "studyDesign", e.target.value ? Number(e.target.value) : null)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-teal-500 focus:outline-none text-sm appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 8px center",
                            }}
                          >
                            <option value="" className="bg-[#0a1f22] text-white">Select design...</option>
                            {(cellOptions.get(i)?.studyDesign ?? []).map((opt) => (
                              <option key={opt.answerId} value={opt.answerId} className="bg-[#0a1f22] text-white">
                                {opt.answer}
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
            <div className="flex flex-col items-center gap-3 pb-12">
              {submitError && <p className="text-red-400 text-sm">{submitError}</p>}
              <button
                onClick={() => void handleSubmit()}
                disabled={!allFilled || isSubmitting}
                className={`px-8 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                  allFilled && !isSubmitting
                    ? "bg-teal-500 hover:bg-teal-400 text-white cursor-pointer"
                    : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/10"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Analysis <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
              {!allFilled && (
                <p className="text-gray-500 text-xs">Fill all table cells to submit</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {expandedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={expandedImage}
              alt="Expanded abstract"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
