import {
  KeyRound,
  Trophy,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Shield,
  Star,
  Award,
  Printer,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useCallback, useRef } from "react";

import { ANSWER, COLLECTED_LETTERS, formatDate, shuffleArray } from "./final-stage.data";
import type { FinalStageProps } from "./final-stage.data";

const CELEBRATION_PARTICLES = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  left: Math.random() * 100,
  duration: 3 + Math.random() * 3,
  delay: Math.random() * 2,
  color:
    index % 3 === 0
      ? "rgba(20,184,166,0.6)"
      : index % 3 === 1
        ? "rgba(249,115,22,0.6)"
        : "rgba(234,179,8,0.6)",
}));

export function FinalStage({ onBack }: FinalStageProps) {
  const [shuffledLetters, setShuffledLetters] = useState<
    { letter: string; id: number; room: number; roomName: string }[]
  >(() => {
    const lettersWithIds = COLLECTED_LETTERS.map((letter, index) => ({
      ...letter,
      id: index,
    }));
    return shuffleArray(lettersWithIds);
  });
  const [slots, setSlots] = useState<(number | null)[]>(Array(8).fill(null));
  const [isSolved, setIsSolved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintText, setHintText] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamNameInput, setTeamNameInput] = useState("");
  const [showTeamPrompt, setShowTeamPrompt] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const getSlotLetter = (slotIndex: number): string | null => {
    const letterId = slots[slotIndex];
    if (letterId === null) return null;
    const found = shuffledLetters.find((l) => l.id === letterId);
    return found ? found.letter : null;
  };

  const placeLetter = useCallback(
    (letterId: number) => {
      if (isSolved) return;
      if (slots.includes(letterId)) {
        setSlots((prev) => prev.map((s) => (s === letterId ? null : s)));
        setWrongAttempt(false);
        return;
      }
      const emptyIndex = slots.findIndex((s) => s === null);
      if (emptyIndex === -1) return;
      const newSlots = [...slots];
      newSlots[emptyIndex] = letterId;
      setSlots(newSlots);
      setWrongAttempt(false);
    },
    [slots, isSolved]
  );

  const removeFromSlot = useCallback(
    (slotIndex: number) => {
      if (isSolved) return;
      setSlots((prev) => {
        const newSlots = [...prev];
        newSlots[slotIndex] = null;
        return newSlots;
      });
      setWrongAttempt(false);
    },
    [isSolved]
  );

  const checkAnswer = useCallback(() => {
    const currentWord = slots
      .map((id) => {
        if (id === null) return "";
        const found = shuffledLetters.find((l) => l.id === id);
        return found ? found.letter : "";
      })
      .join("");

    if (currentWord === ANSWER) {
      setIsSolved(true);
      setTimeout(() => setShowCelebration(true), 600);
    } else {
      setWrongAttempt(true);
      setTimeout(() => setWrongAttempt(false), 1500);
    }
  }, [slots, shuffledLetters]);

  const resetPuzzle = () => {
    setSlots(Array(8).fill(null));
    setWrongAttempt(false);
    setShuffledLetters(shuffleArray(shuffledLetters));
    setHintUsed(false);
    setHintText("");
  };

  const useHintAction = () => {
    if (!hintUsed) {
      setHintUsed(true);
      setHintText(
        "The mother of modern nursing — born in Italy, she revolutionized healthcare with evidence-based practices."
      );
    }
  };

  const handleViewCertificate = () => {
    setShowTeamPrompt(true);
  };

  const handleTeamSubmit = () => {
    if (teamNameInput.trim()) {
      setTeamName(teamNameInput.trim());
      setShowTeamPrompt(false);
      setShowCertificate(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const allSlotsFilled = slots.every((s) => s !== null);

  // ───── Certificate View ─────
  if (showCertificate) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a1f22] overflow-y-auto font-[Inter,sans-serif]">
        {/* Non-print header */}
        <div className="print:hidden px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <button
            onClick={() => setShowCertificate(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Certificate
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div className="flex items-center justify-center px-4 py-12 print:py-0 print:px-0">
          <div
            ref={certificateRef}
            className="w-full max-w-[800px] aspect-[1.414/1] bg-white rounded-2xl print:rounded-none shadow-2xl relative overflow-hidden"
          >
            {/* Outer border pattern */}
            <div className="absolute inset-0 p-3">
              <div className="w-full h-full border-2 border-[#0f4c5c] rounded-xl relative">
                {/* Inner border */}
                <div className="absolute inset-2 border border-[#0f4c5c]/30 rounded-lg" />

                {/* Corner decorations */}
                {[
                  "top-0 left-0",
                  "top-0 right-0",
                  "bottom-0 left-0",
                  "bottom-0 right-0",
                ].map((pos, i) => (
                  <div
                    key={i}
                    className={`absolute ${pos} w-16 h-16`}
                    style={{
                      background:
                        i === 0
                          ? "linear-gradient(135deg, #0f4c5c 0%, #0f4c5c 30%, transparent 30%)"
                          : i === 1
                            ? "linear-gradient(225deg, #0f4c5c 0%, #0f4c5c 30%, transparent 30%)"
                            : i === 2
                              ? "linear-gradient(45deg, #0f4c5c 0%, #0f4c5c 30%, transparent 30%)"
                              : "linear-gradient(315deg, #0f4c5c 0%, #0f4c5c 30%, transparent 30%)",
                      opacity: 0.15,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Top decorative band */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0f4c5c] via-[#14b8a6] to-[#0f4c5c]" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-12 py-10">
              {/* Top emblem */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-[#14b8a6] rounded-full" />
                <div className="w-12 h-12 rounded-full bg-[#0f4c5c] flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="w-1 h-8 bg-[#14b8a6] rounded-full" />
              </div>

              {/* Organization */}
              <p
                className="text-[#0f4c5c]/60 tracking-[0.3em] uppercase mb-1"
                style={{ fontSize: "10px" }}
              >
                EBNA Escape Room Academy
              </p>

              {/* Decorative line */}
              <div className="flex items-center gap-3 mb-6 w-64">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#14b8a6]/40" />
                <div className="w-2 h-2 rounded-full bg-[#14b8a6]/40" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#14b8a6]/40" />
              </div>

              {/* Certificate title */}
              <h1
                className="text-[#0f4c5c] text-center mb-1 tracking-wide"
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: "32px",
                  lineHeight: 1.2,
                }}
              >
                Certificate of Achievement
              </h1>

              {/* Subtitle */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-20 bg-[#14b8a6]/40" />
                <p
                  className="text-[#14b8a6] tracking-[0.2em] uppercase"
                  style={{ fontSize: "11px" }}
                >
                  Expert of Evidence
                </p>
                <div className="h-px w-20 bg-[#14b8a6]/40" />
              </div>

              {/* Preamble */}
              <p className="text-[#0f4c5c]/60 text-center mb-4" style={{ fontSize: "13px" }}>
                This certificate is proudly presented to
              </p>

              {/* Team name */}
              <div className="mb-4 text-center">
                <h2
                  className="text-[#0f4c5c] mb-1"
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: "36px",
                    lineHeight: 1.3,
                  }}
                >
                  {teamName}
                </h2>
                <div className="w-72 h-px bg-[#0f4c5c]/20 mx-auto" />
              </div>

              {/* Achievement text */}
              <p
                className="text-[#0f4c5c]/70 text-center max-w-md mb-6"
                style={{ fontSize: "13px", lineHeight: 1.7 }}
              >
                for successfully completing all four rooms of the EBNA Escape
                Room, demonstrating exceptional skill in evidence-based nursing
                practice, critical appraisal of research, and scientific
                reasoning — and for solving the case by identifying{" "}
                <span className="text-[#0f4c5c]" style={{ fontFamily: "'Georgia', serif" }}>
                  Florence Nightingale
                </span>
                , the pioneer of evidence-based healthcare.
              </p>

              {/* Rooms completed strip */}
              <div className="flex items-center gap-4 mb-6">
                {[
                  { num: 1, name: "Knowledge" },
                  { num: 2, name: "Abstracts" },
                  { num: 3, name: "Analytics" },
                  { num: 4, name: "Sciencebattle" },
                ].map((room) => (
                  <div key={room.num} className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#14b8a6]/10 flex items-center justify-center">
                      <span
                        className="text-[#14b8a6]"
                        style={{ fontSize: "10px", fontFamily: "monospace" }}
                      >
                        ✓
                      </span>
                    </div>
                    <span className="text-[#0f4c5c]/50" style={{ fontSize: "10px" }}>
                      {room.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Decorative divider */}
              <div className="flex items-center gap-3 mb-6 w-80">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#0f4c5c]/15" />
                <Star className="w-4 h-4 text-[#14b8a6]/40" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#0f4c5c]/15" />
              </div>

              {/* Bottom section: Date & Seal */}
              <div className="flex items-end justify-between w-full max-w-lg">
                {/* Date */}
                <div className="text-center">
                  <p className="text-[#0f4c5c]/80 mb-1" style={{ fontSize: "13px" }}>
                    {formatDate()}
                  </p>
                  <div className="w-32 h-px bg-[#0f4c5c]/20" />
                  <p
                    className="text-[#0f4c5c]/40 mt-1 tracking-wider uppercase"
                    style={{ fontSize: "9px" }}
                  >
                    Date
                  </p>
                </div>

                {/* Seal */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-[#14b8a6]/30 flex items-center justify-center relative">
                    <div className="absolute inset-1 rounded-full border border-[#14b8a6]/15" />
                    <div className="flex flex-col items-center">
                      <Award className="w-6 h-6 text-[#14b8a6]/60" />
                      <span
                        className="text-[#14b8a6]/60 mt-0.5"
                        style={{ fontSize: "6px", letterSpacing: "0.15em" }}
                      >
                        CERTIFIED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Signature line */}
                <div className="text-center">
                  <p
                    className="text-[#0f4c5c]/60 mb-1"
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: "14px",
                      fontStyle: "italic",
                    }}
                  >
                    EBNA Academy
                  </p>
                  <div className="w-32 h-px bg-[#0f4c5c]/20" />
                  <p
                    className="text-[#0f4c5c]/40 mt-1 tracking-wider uppercase"
                    style={{ fontSize: "9px" }}
                  >
                    Director
                  </p>
                </div>
              </div>

              {/* Florence quote at very bottom */}
              <p
                className="text-[#0f4c5c]/30 italic text-center mt-6"
                style={{ fontSize: "10px" }}
              >
                &ldquo;The very first requirement in a hospital is that it
                should do the sick no harm.&rdquo; — Florence Nightingale
              </p>
            </div>

            {/* Bottom decorative band */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0f4c5c] via-[#14b8a6] to-[#0f4c5c]" />
          </div>
        </div>

        {/* Print styles */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .fixed {
              position: absolute !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:py-0 {
              padding-top: 0 !important;
              padding-bottom: 0 !important;
            }
            .print\\:px-0 {
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .print\\:rounded-none {
              border-radius: 0 !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // ───── Celebration Screen ─────
  if (showCelebration) {
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

        {/* Floating particles */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {CELEBRATION_PARTICLES.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${particle.left}%`,
                backgroundColor: particle.color,
              }}
              initial={{ y: "100vh", opacity: 0 }}
              animate={{
                y: "-10vh",
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="max-w-2xl w-full text-center"
          >
            {/* Trophy */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3, type: "spring" }}
              className="w-28 h-28 rounded-3xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/40 flex items-center justify-center mx-auto mb-8"
            >
              <Trophy className="w-14 h-14 text-yellow-400" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="font-[JetBrains_Mono,monospace] text-sm">
                  CASE SOLVED
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl text-white mb-4 tracking-tight">
                <span className="text-teal-400">FLORENCE</span> Nightingale
              </h1>

              <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
                The founder of modern nursing and a pioneer of evidence-based
                practice. She used statistical analysis to revolutionize
                healthcare — proving that evidence saves lives.
              </p>
            </motion.div>

            {/* Solved word */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-center justify-center gap-2 md:gap-3 mb-10"
            >
              {ANSWER.split("").map((letter, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.4 + i * 0.12,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="w-12 h-16 md:w-16 md:h-20 bg-gradient-to-b from-teal-500/20 to-teal-500/5 border-2 border-teal-500/60 rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(20,184,166,0.3)]"
                >
                  <span className="text-teal-400 text-2xl md:text-3xl font-[JetBrains_Mono,monospace]">
                    {letter}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Achievement badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-xl mx-auto"
            >
              {[
                {
                  icon: Shield,
                  title: "Evidence Hunter",
                  desc: "Completed all 4 rooms",
                  color: "text-teal-400",
                  bg: "bg-teal-500/10",
                  border: "border-teal-500/30",
                },
                {
                  icon: Star,
                  title: "Critical Thinker",
                  desc: "Analyzed & compared studies",
                  color: "text-yellow-400",
                  bg: "bg-yellow-500/10",
                  border: "border-yellow-500/30",
                },
                {
                  icon: Award,
                  title: "Case Solver",
                  desc: "Decoded FLORENCE",
                  color: "text-orange-400",
                  bg: "bg-orange-500/10",
                  border: "border-orange-500/30",
                },
              ].map((badge, i) => (
                <motion.div
                  key={badge.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4 + i * 0.15 }}
                  className={`${badge.bg} border ${badge.border} rounded-xl p-4 text-center`}
                >
                  <badge.icon className={`w-8 h-8 ${badge.color} mx-auto mb-2`} />
                  <h4 className="text-white text-sm mb-1">{badge.title}</h4>
                  <p className="text-gray-500 text-xs">{badge.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Florence quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 max-w-xl mx-auto"
            >
              <p
                className="text-gray-300 text-sm italic mb-3"
                style={{ lineHeight: 1.8 }}
              >
                &ldquo;The very first requirement in a hospital is that it
                should do the sick no harm.&rdquo;
              </p>
              <p className="text-teal-400 text-xs font-[JetBrains_Mono,monospace]">
                — Florence Nightingale (1820–1910)
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.3 }}
              className="grid grid-cols-4 gap-3 mb-10 max-w-md mx-auto"
            >
              {[
                { label: "Rooms", value: "4/4" },
                { label: "Letters", value: "8/8" },
                { label: "Case", value: "Solved" },
                { label: "XP", value: "4000" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="text-teal-400 text-lg font-[JetBrains_Mono,monospace] block">
                    {stat.value}
                  </span>
                  <span className="text-gray-500 text-xs">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Certificate CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.6 }}
              className="mb-10"
            >
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 max-w-md mx-auto">
                <Award className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-white text-lg mb-2">Expert of Evidence</h3>
                <p className="text-gray-400 text-sm mb-5">
                  You&apos;ve earned the prestigious Expert of Evidence certificate.
                  Enter your team name to claim it!
                </p>
                <button
                  onClick={handleViewCertificate}
                  className="px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white rounded-xl transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <Award className="w-5 h-5" />
                  Claim Your Certificate
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4 }}
            >
              <button
                onClick={onBack}
                className="px-6 py-3 bg-white/5 border border-white/10 hover:border-teal-500/40 text-gray-400 hover:text-white rounded-xl transition-colors"
              >
                Return to Mission Control
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Team name prompt modal */}
        {showTeamPrompt && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0f2a2e] border border-teal-500/30 rounded-2xl p-8 w-full max-w-md relative"
            >
              <button
                onClick={() => setShowTeamPrompt(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white">Claim Your Certificate</h3>
                  <p className="text-yellow-400 font-[JetBrains_Mono,monospace] text-xs">
                    EXPERT OF EVIDENCE
                  </p>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-5">
                Enter your team name to generate your personalized Expert of
                Evidence certificate.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTeamSubmit();
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="team-name-input" className="text-gray-400 text-sm mb-1 block">
                    Team Name
                  </label>
                  <input
                    id="team-name-input"
                    type="text"
                    value={teamNameInput}
                    onChange={(e) => setTeamNameInput(e.target.value)}
                    placeholder="Enter your team name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!teamNameInput.trim()}
                  className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    teamNameInput.trim()
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white"
                      : "bg-white/5 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Generate Certificate
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // ───── Main Puzzle UI ─────
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
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-teal-400" />
              <span className="text-white font-[JetBrains_Mono,monospace] text-sm">
                FINAL STAGE — SOLVE THE CASE
              </span>
            </div>

            <div className="w-16" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="max-w-2xl w-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="font-[JetBrains_Mono,monospace] text-sm">
                  ALL LETTERS COLLECTED
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl text-white mb-3 tracking-tight">
                Crack the <span className="text-teal-400">Code</span>
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                You&apos;ve collected 8 letters from all four rooms. Arrange them to
                reveal the name that inspired evidence-based nursing.
              </p>
            </motion.div>

            {/* Collected letters by room */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
            >
              {[
                { room: 1, name: "Knowledge", letters: "E, C" },
                { room: 2, name: "Abstracts", letters: "F, O" },
                { room: 3, name: "Analytics", letters: "L, R" },
                { room: 4, name: "Sciencebattle", letters: "N, E" },
              ].map((r) => (
                <div
                  key={r.room}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
                >
                  <span className="text-gray-500 text-xs block mb-1">
                    Room {r.room}
                  </span>
                  <span className="text-teal-400 font-[JetBrains_Mono,monospace] text-sm">
                    {r.letters}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Answer slots */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <p className="text-gray-500 text-xs font-[JetBrains_Mono,monospace] text-center mb-4">
                ARRANGE THE LETTERS TO FORM THE ANSWER
              </p>
              <div className="flex items-center justify-center gap-2 md:gap-3">
                {slots.map((_, slotIndex) => {
                  const letter = getSlotLetter(slotIndex);
                  return (
                    <motion.button
                      key={slotIndex}
                      onClick={() => letter && removeFromSlot(slotIndex)}
                      className={`w-12 h-16 md:w-16 md:h-20 rounded-xl border-2 flex items-center justify-center transition-all ${
                        letter
                          ? wrongAttempt
                            ? "bg-red-500/10 border-red-500/50 cursor-pointer"
                            : isSolved
                              ? "bg-teal-500/20 border-teal-500/60"
                              : "bg-white/10 border-teal-500/40 cursor-pointer hover:border-teal-500/60"
                          : "bg-white/5 border-white/10 border-dashed"
                      }`}
                      whileTap={letter && !isSolved ? { scale: 0.9 } : {}}
                      layout
                    >
                      <AnimatePresence mode="wait">
                        {letter ? (
                          <motion.span
                            key={`slot-${slotIndex}-${letter}`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className={`text-2xl md:text-3xl font-[JetBrains_Mono,monospace] ${
                              wrongAttempt
                                ? "text-red-400"
                                : isSolved
                                  ? "text-teal-400"
                                  : "text-white"
                            }`}
                          >
                            {letter}
                          </motion.span>
                        ) : (
                          <motion.span
                            key={`empty-${slotIndex}`}
                            className="text-gray-700 text-lg font-[JetBrains_Mono,monospace]"
                          >
                            _
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
              {wrongAttempt && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center mt-3 font-[JetBrains_Mono,monospace]"
                >
                  Not quite right — try a different arrangement!
                </motion.p>
              )}
            </motion.div>

            {/* Available letters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <p className="text-gray-500 text-xs font-[JetBrains_Mono,monospace] text-center mb-4">
                TAP A LETTER TO PLACE IT
              </p>
              <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                {shuffledLetters.map((item) => {
                  const placed = slots.includes(item.id);
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => placeLetter(item.id)}
                      disabled={isSolved}
                      className={`w-12 h-16 md:w-14 md:h-18 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        placed
                          ? "bg-white/[0.02] border-white/5 opacity-30 cursor-default"
                          : "bg-[#0a1f22] border-teal-500/30 cursor-pointer hover:border-teal-500/60 hover:bg-teal-500/5 hover:scale-105"
                      }`}
                      whileTap={!placed && !isSolved ? { scale: 0.85 } : {}}
                      layout
                    >
                      <span
                        className={`text-xl md:text-2xl font-[JetBrains_Mono,monospace] ${
                          placed ? "text-gray-700" : "text-teal-400"
                        }`}
                      >
                        {item.letter}
                      </span>
                      <span className="text-[9px] text-gray-600 mt-0.5">
                        R{item.room}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Hint */}
            {hintText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 mb-6 text-center"
              >
                <p className="text-orange-300 text-sm">
                  <span className="font-[JetBrains_Mono,monospace] text-xs text-orange-400 block mb-1">
                    HINT
                  </span>
                  {hintText}
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetPuzzle}
                className="px-5 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white rounded-xl transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              {!hintUsed && (
                <button
                  onClick={useHintAction}
                  className="px-5 py-3 bg-orange-500/10 border border-orange-500/30 hover:border-orange-500/50 text-orange-400 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Use Hint
                </button>
              )}

              <button
                onClick={checkAnswer}
                disabled={!allSlotsFilled || isSolved}
                className={`px-8 py-3 rounded-xl flex items-center gap-2 transition-all ${
                  allSlotsFilled && !isSolved
                    ? "bg-teal-500 hover:bg-teal-400 text-white hover:scale-105"
                    : "bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

