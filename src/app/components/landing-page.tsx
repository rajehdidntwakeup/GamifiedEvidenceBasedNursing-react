import { useState } from "react";
import { motion } from "motion/react";
import { Shield, Lock, Users, Brain, ChevronRight, Heart, Thermometer, Syringe, Stethoscope, ArrowLeft, Star, KeyRound } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { RoomOfKnowledge } from "./room-of-knowledge";
import { RoomOfAbstracts } from "./room-of-abstracts";
import { RoomOfAnalytics } from "./room-of-analytics";
import { RoomOfSciencebattle } from "./room-of-sciencebattle";
import { FinalStage } from "./final-stage";
import { AdminDashboard } from "./admin-dashboard";

const missions = [
  {
    id: 1,
    title: "The Silent Symptom",
    subtitle: "MISSION 01",
    desc: "A patient presents with unexplained fatigue and abnormal labs. Analyze the evidence trail to uncover the hidden diagnosis before time runs out.",
    icon: Stethoscope,
    difficulty: "Beginner",
    xp: 1000,
    color: "teal",
    borderColor: "border-teal-500/40",
    bgColor: "bg-teal-500/10",
    textColor: "text-teal-400",
  },
  {
    id: 2,
    title: "The Medication Maze",
    subtitle: "MISSION 02",
    desc: "A critical medication error has been flagged. Navigate conflicting drug interactions and research evidence to determine the safest treatment path.",
    icon: Syringe,
    difficulty: "Intermediate",
    xp: 1000,
    color: "orange",
    borderColor: "border-orange-500/40",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-400",
  },
  {
    id: 3,
    title: "Code Blue Protocol",
    subtitle: "MISSION 03",
    desc: "A rapid response situation unfolds. Use evidence-based resuscitation guidelines and critical thinking to stabilize the patient in this high-stakes scenario.",
    icon: Heart,
    difficulty: "Advanced",
    xp: 1000,
    color: "red",
    borderColor: "border-red-500/40",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
  },
  {
    id: 4,
    title: "The Infection Detective",
    subtitle: "MISSION 04",
    desc: "A mysterious infection is spreading through the ward. Trace the source using epidemiological evidence and implement evidence-based infection control measures.",
    icon: Thermometer,
    difficulty: "Intermediate",
    xp: 1000,
    color: "green",
    borderColor: "border-green-500/40",
    bgColor: "bg-green-500/10",
    textColor: "text-green-400",
  },
  {
    id: 5,
    title: "The Chronic Conundrum",
    subtitle: "MISSION 05",
    desc: "A complex chronic disease patient requires a comprehensive care plan. Synthesize multiple research studies to design an evidence-based management strategy.",
    icon: Brain,
    difficulty: "Expert",
    xp: 1000,
    color: "purple",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
  },
];

type Mission = (typeof missions)[number];

export function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [currentRoom, setCurrentRoom] = useState<number>(1);
  const [pendingMission, setPendingMission] = useState<Mission | null>(null);
  const [missionPassword, setMissionPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLogin(false);
    setShowAdmin(true);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-[#0f2a2e] relative overflow-hidden font-[Inter,sans-serif]">
      {/* Background image overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1686916058141-a04d7f501ba8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGNvcnJpZG9yJTIwZGFyayUyMG1vb2R5fGVufDF8fHx8MTc3MjQ2MjUzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Hospital corridor"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xl tracking-tight font-[Inter,sans-serif]">EBNA <span className="text-teal-400">Escape Room</span></span>
        </div>
        <button
          onClick={() => setShowLogin(true)}
          className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-lg transition-colors"
        >
          Admin Login
        </button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 mb-8">
            <Lock className="w-4 h-4" />
            <span className="font-[JetBrains_Mono,monospace] text-sm">CLASSIFIED // MISSION BRIEFING</span>
          </div>

          <h1 className="text-4xl md:text-6xl text-white mb-6 tracking-tight">
            Crack the Case.<br />
            <span className="text-teal-400">Master the Evidence.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Enter immersive clinical escape rooms where evidence-based nursing practice meets puzzle-solving. 
            Analyze research, decode patient mysteries, and prove your critical thinking skills.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <button
              onClick={() => setShowMissions(true)}
              className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              Begin Your Mission
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full"
        >
          {[
            { icon: Brain, title: "Clinical Puzzles", desc: "Solve PICO-based challenges and interpret research studies to unlock clues", color: "text-teal-400" },
            { icon: Users, title: "Team Collaboration", desc: "Work with peers in real-time to analyze evidence and make clinical decisions", color: "text-orange-400" },
            { icon: Shield, title: "Earn Badges", desc: "Collect Evidence Hunter, Critical Thinker, and Team Player achievements", color: "text-green-400" },
          ].map((f, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-teal-500/40 transition-colors">
              <f.icon className={`w-8 h-8 ${f.color} mb-4`} />
              <h3 className="text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Mission Selection Screen */}
      {showMissions && (
        <div className="fixed inset-0 z-50 bg-[#0a1f22]/95 backdrop-blur-md overflow-y-auto">
          {/* Grid overlay */}
          <div className="absolute inset-0 z-0 opacity-5"
            style={{
              backgroundImage: "linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }}
          />

          <div className="relative z-10 px-6 md:px-12 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <button
                onClick={() => setShowMissions(false)}
                className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Base</span>
              </button>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300">
                <Lock className="w-4 h-4" />
                <span className="font-[JetBrains_Mono,monospace] text-sm">SELECT YOUR MISSION</span>
              </div>
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl text-white mb-3 tracking-tight">
                Choose Your <span className="text-teal-400">Mission</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Each mission is a unique clinical escape room. Solve evidence-based puzzles, earn XP, and unlock achievements.
              </p>
            </motion.div>

            {/* Mission Cards */}
            <div className="max-w-4xl mx-auto space-y-4 pb-12">
              {missions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`group bg-white/5 backdrop-blur-sm border border-white/10 hover:${mission.borderColor} rounded-2xl p-6 cursor-pointer transition-all hover:bg-white/[0.07]`}
                  onClick={() => {
                    setPendingMission(mission);
                    setShowMissions(false);
                    setMissionPassword("");
                    setPasswordError(false);
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-5">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl ${mission.bgColor} flex items-center justify-center shrink-0`}>
                      <mission.icon className={`w-7 h-7 ${mission.textColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`font-[JetBrains_Mono,monospace] text-xs ${mission.textColor}`}>
                          {mission.subtitle}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${mission.bgColor} ${mission.textColor}`}>
                          {mission.difficulty}
                        </span>
                      </div>
                      <h3 className="text-white text-lg mb-1">{mission.title}</h3>
                      <p className="text-gray-500 text-sm">{mission.desc}</p>
                    </div>

                    {/* Meta + Action */}
                    <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-2 shrink-0">
                      <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {mission.xp} XP
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 ${mission.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <span className="text-sm">Enter</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mission Password Gate */}
      {pendingMission && !activeMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f2a2e] border border-teal-500/30 rounded-2xl p-8 w-full max-w-md relative"
          >
            <button
              onClick={() => {
                setPendingMission(null);
                setShowMissions(true);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl"
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg ${pendingMission.bgColor} flex items-center justify-center`}>
                <KeyRound className={`w-5 h-5 ${pendingMission.textColor}`} />
              </div>
              <div>
                <h2 className="text-white">{pendingMission.title}</h2>
                <p className={`${pendingMission.textColor} font-[JetBrains_Mono,monospace] text-xs`}>ROOM ACCESS CODE REQUIRED</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-5">
              Enter the room password provided by your instructor to begin the mission.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (missionPassword.trim().length > 0) {
                  setActiveMission(pendingMission);
                  setPendingMission(null);
                  setMissionPassword("");
                  setPasswordError(false);
                } else {
                  setPasswordError(true);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Room Password</label>
                <input
                  type="password"
                  value={missionPassword}
                  onChange={(e) => {
                    setMissionPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Enter room password"
                  autoFocus
                  className={`w-full px-4 py-3 bg-white/5 border ${passwordError ? "border-red-500/60" : "border-white/10"} rounded-lg text-white placeholder:text-gray-600 focus:border-teal-500 focus:outline-none`}
                />
                {passwordError && (
                  <p className="text-red-400 text-xs mt-1.5">Please enter the room password to continue.</p>
                )}
              </div>
              <button
                type="submit"
                className={`w-full py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2`}
              >
                Enter Room
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-gray-600 text-xs mt-4 text-center">Ask your instructor for the access code</p>
          </motion.div>
        </div>
      )}

      {/* Room of Knowledge */}
      {activeMission && currentRoom === 1 && (
        <RoomOfKnowledge
          mission={activeMission}
          onBack={() => {
            setActiveMission(null);
            setCurrentRoom(1);
            setShowMissions(true);
          }}
          onProceedToRoom2={() => setCurrentRoom(2)}
        />
      )}

      {/* Room of Abstracts */}
      {activeMission && currentRoom === 2 && (
        <RoomOfAbstracts
          mission={activeMission}
          onBack={() => {
            setActiveMission(null);
            setCurrentRoom(1);
            setShowMissions(true);
          }}
          onProceedToRoom3={() => setCurrentRoom(3)}
        />
      )}

      {/* Room of Analytics */}
      {activeMission && currentRoom === 3 && (
        <RoomOfAnalytics
          mission={activeMission}
          onBack={() => {
            setActiveMission(null);
            setCurrentRoom(1);
            setShowMissions(true);
          }}
          onProceedToRoom4={() => setCurrentRoom(4)}
        />
      )}

      {/* Room of Sciencebattle */}
      {activeMission && currentRoom === 4 && (
        <RoomOfSciencebattle
          mission={activeMission}
          onBack={() => {
            setActiveMission(null);
            setCurrentRoom(1);
            setShowMissions(true);
          }}
          onProceedToFinalStage={() => setCurrentRoom(5)}
        />
      )}

      {/* Final Stage */}
      {activeMission && currentRoom === 5 && (
        <FinalStage
          mission={activeMission}
          onBack={() => {
            setActiveMission(null);
            setCurrentRoom(1);
            setShowMissions(true);
          }}
        />
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f2a2e] border border-teal-500/30 rounded-2xl p-8 w-full max-w-md relative"
          >
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl">&times;</button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white">Agent Authentication</h2>
                <p className="text-teal-400 font-[JetBrains_Mono,monospace] text-xs">SECURE ACCESS PORTAL</p>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Student Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="agent@nursing.edu"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Access Code</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your access code"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Access Mission Control
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-gray-600 text-xs mt-4 text-center">Demo mode: any credentials will work</p>
          </motion.div>
        </div>
      )}

      {/* Admin Dashboard */}
      {showAdmin && (
        <AdminDashboard onBack={() => setShowAdmin(false)} />
      )}
    </div>
  );
}