import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar, Cell, LabelList,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Menu, BadgeCheck, Calendar, LayoutDashboard, Users, IndianRupee,
  BarChart2, Settings, School, Target, Brain, Zap, AlertTriangle,
  TrendingUp, GraduationCap, ChevronDown, ChevronUp, Star, Award,
  ArrowRight, Flag, CheckCircle2, XCircle, Clock, Sparkles, Activity,
  BookOpen, Code, FlaskConical, Layers, Building2, MapPin, BarChart3,
  ArrowLeft, Download, RefreshCw, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface CareerAnalysisScreenProps {
  mobile?: string;
}

/* ─── DATA ─────────────────────────────────────────── */

const OVERALL_SCORE = 74;

const READINESS_SCORES = [
  { label: "Self-Awareness",      score: 82, fill: "hsl(var(--primary))" },
  { label: "Academic Readiness",  score: 79, fill: "hsl(var(--primary))" },
  { label: "Career Clarity",      score: 65, fill: "hsl(var(--primary))" },
  { label: "Social-Emotional",    score: 71, fill: "hsl(var(--primary))" },
  { label: "Exam Preparedness",   score: 68, fill: "hsl(var(--primary))" },
];

const APTITUDE_DATA = [
  { skill: "Logical Reasoning",   score: 85 },
  { skill: "Numerical Ability",   score: 78 },
  { skill: "Spatial Ability",     score: 80 },
  { skill: "Verbal Communication",score: 65 },
  { skill: "Creative Thinking",   score: 52 },
  { skill: "Emotional Intelligence", score: 71 },
];

const INTEREST_RADAR = [
  { domain: "Technology",    value: 88 },
  { domain: "Mathematics",   value: 82 },
  { domain: "Sci & Research",value: 75 },
  { domain: "Education",     value: 58 },
  { domain: "Business",      value: 45 },
  { domain: "Social Service",value: 42 },
  { domain: "Healthcare",    value: 35 },
  { domain: "Creative Arts", value: 30 },
];

const SKILL_GAPS = [
  { skill: "Python Programming",             required: 85, current: 40, category: "Technical" },
  { skill: "Machine Learning Concepts",      required: 80, current: 20, category: "Technical" },
  { skill: "Statistics & Probability",       required: 85, current: 72, category: "Analytical" },
  { skill: "Data Visualisation",             required: 75, current: 30, category: "Technical" },
  { skill: "Database / SQL",                 required: 70, current: 25, category: "Technical" },
  { skill: "Calculus & Linear Algebra",      required: 90, current: 75, category: "Analytical" },
  { skill: "Communication & Presentation",   required: 80, current: 65, category: "Soft Skill" },
  { skill: "Problem Solving",                required: 90, current: 83, category: "Analytical" },
];

const CAREER_PATHWAYS = [
  {
    id: "cp1",
    title: "Data Scientist",
    match: 94,
    tag: "Best Fit",
    tagColor: "text-primary bg-primary/10 border-primary/20",
    entryRole: "Junior Data Analyst",
    salaryCurrent: "₹8–14 LPA",
    salaryPeak: "₹35–80 LPA",
    timeline: "5–6 years to first role",
    exams: ["JEE Advanced / BITSAT"],
    degree: "B.Tech CS → M.Tech Data Science",
    companies: ["Google", "Microsoft", "Flipkart", "Zepto"],
    strength: "Strong aptitude alignment (Logical 85%, Math 80%)",
    challenge: "Python and ML skill gap needs urgent bridging",
  },
  {
    id: "cp2",
    title: "ML / AI Engineer",
    match: 88,
    tag: "Strong Match",
    tagColor: "text-primary bg-primary/10 border-primary/20",
    entryRole: "Junior ML Engineer",
    salaryCurrent: "₹12–20 LPA",
    salaryPeak: "₹40–90 LPA",
    timeline: "5–6 years to first role",
    exams: ["JEE Advanced / BITSAT"],
    degree: "B.Tech CS (AI/ML specialisation)",
    companies: ["OpenAI", "Nvidia", "TCS Research", "InMobi"],
    strength: "High spatial ability (80%) suits systems design",
    challenge: "Deep mathematics requirement — calculus & linear algebra",
  },
  {
    id: "cp3",
    title: "Research Scientist",
    match: 76,
    tag: "Research Track",
    tagColor: "text-primary bg-primary/10 border-primary/20",
    entryRole: "Research Assistant / PhD Scholar",
    salaryCurrent: "₹5–12 LPA",
    salaryPeak: "₹25–60 LPA",
    timeline: "8–10 years (incl. PhD)",
    exams: ["IISc Entrance", "JEST", "GATE"],
    degree: "B.Sc Maths/Stats → IISc/IITs PhD",
    companies: ["TIFR", "IISc", "Microsoft Research", "Google Brain"],
    strength: "Investigative RIASEC type (I:68) suits academic curiosity",
    challenge: "Long commitment (PhD) — requires high intrinsic motivation",
  },
  {
    id: "cp4",
    title: "Software Engineer",
    match: 71,
    tag: "Fallback Option",
    tagColor: "text-primary bg-primary/10 border-primary/20",
    entryRole: "Junior Software Developer",
    salaryCurrent: "₹6–15 LPA",
    salaryPeak: "₹25–50 LPA",
    timeline: "4–5 years to first role",
    exams: ["JEE Mains / BITSAT"],
    degree: "B.Tech CS (any NIT/BITS)",
    companies: ["Infosys", "Wipro", "Razorpay", "Swiggy"],
    strength: "Broad applicability, fastest route to employment",
    challenge: "Lower aptitude alignment vs top career options",
  },
];

const ELIGIBILITY_DATA = [
  { college: "IIT Bombay CS",    readiness: 65, required: 100, status: "Gap: 35%",    color: "#e65100" },
  { college: "IIT Delhi CS",     readiness: 48, required: 100, status: "Gap: 52%",    color: "#c62828" },
  { college: "BITS Pilani CS+DS",readiness: 78, required: 100, status: "Gap: 22%",    color: "#f57c00" },
  { college: "NIT Trichy CS",    readiness: 88, required: 100, status: "Gap: 12%",    color: "#2e7d32" },
  { college: "IIIT Hyderabad",   readiness: 85, required: 100, status: "Gap: 15%",    color: "#1565c0" },
  { college: "DTU Delhi",        readiness: 90, required: 100, status: "Gap: 10%",    color: "#2e7d32" },
];

const ROADMAP_STEPS = [
  { id: "r1", phase: "Now",         period: "Apr 2026",        title: "Finalise Career Goal",  desc: "Complete skill gap plan, confirm Data Science track",                     status: "active"    },
  { id: "r2", phase: "1–3 months",  period: "May–Jul 2026",    title: "Exam Preparation",      desc: "JEE Mains Session 2, BITSAT prep, board exam execution",                  status: "upcoming"  },
  { id: "r3", phase: "4–6 months",  period: "Aug–Oct 2026",    title: "JEE Advanced + Apps",   desc: "JEE Advanced crash course, JOSAA counseling registration",                status: "upcoming"  },
  { id: "r4", phase: "7–9 months",  period: "Nov 2026–Feb 2027","title": "Results & Admission", desc: "Entrance results, JOSAA rounds, BITS Pilani admission process",            status: "upcoming"  },
  { id: "r5", phase: "Year 1–4",    period: "2027–2031",       title: "B.Tech Journey",        desc: "Learn Python, ML, Stats, build projects, internships",                    status: "future"    },
  { id: "r6", phase: "Year 5+",     period: "2031 onwards",    title: "Career Launch",         desc: "Data Science role, M.Tech option, or industry placement",                 status: "future"    },
];

const MILESTONES = [
  { id: "ms1", date: "10 May 2026", event: "JEE Mains Session 2 — Registration deadline",     priority: "critical", daysLeft: 13  },
  { id: "ms2", date: "24–25 May 2026","event": "JEE Mains Session 2 — Examination",           priority: "high",     daysLeft: 27  },
  { id: "ms3", date: "2 Jun 2026",  event: "BITSAT Exam — Slot booking opens",                priority: "high",     daysLeft: 36  },
  { id: "ms4", date: "15 Jul 2026", event: "JEE Advanced Results announcement",               priority: "medium",   daysLeft: 79  },
  { id: "ms5", date: "Aug 2026",    event: "JOSAA Counseling Round 1",                        priority: "medium",   daysLeft: 100 },
  { id: "ms6", date: "Sep 2026",    event: "BITS Pilani Admissions + Seat Acceptance",        priority: "medium",   daysLeft: 130 },
];

const WARNINGS = [
  { id: "w1", severity: "critical", title: "Python & ML skill gap is critical",            detail: "Current Python proficiency: 40/85 required. ML knowledge: 20/80 required. Must begin structured programming course within 2 weeks.", action: "Refer to online coding bootcamp"  },
  { id: "w2", severity: "critical", title: "JEE Mains registration closes in 13 days",     detail: "The registration window for JEE Mains Session 2 (May 2026) closes on 10 May 2026. Missing this will delay the entire admission timeline by 1 year.", action: "Register immediately at jeemain.nta.nic.in" },
  { id: "w3", severity: "high",     title: "Career clarity score below threshold (65/100)", detail: "Student is still uncertain between pure CS and Data Science. Low career clarity affects preparation focus and motivation.", action: "Schedule dedicated career clarity session" },
  { id: "w4", severity: "high",     title: "Machine Learning conceptual gap: 60 points",   detail: "Data Science target requires ML fundamentals. A 60-point gap is significant and requires 3–4 months of structured learning.", action: "Add ML foundations to study plan"    },
  { id: "w5", severity: "medium",   title: "Verbal communication (65%) below target (80%)", detail: "Communication skills below target will affect internship interviews and group discussions. Recommend debate / presentation practice.", action: "Enrol in communication skills programme" },
];

/* ─── NAV ─────────────────────────────────────────── */

const NAV_ITEMS = [
  { id: "dashboard",    path: "/dashboard",   icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: "Dashboard"    },
  { id: "students",     path: "/requests",    icon: <Users           className="w-4.5 h-4.5" />, label: "Students"     },
  { id: "appointments", path: "/appointment", icon: <Calendar        className="w-4.5 h-4.5" />, label: "Appointments" },
  { id: "schools",      path: "/visits",      icon: <School          className="w-4.5 h-4.5" />, label: "Schools"      },
  { id: "revenue",      path: "/revenue",     icon: <IndianRupee     className="w-4.5 h-4.5" />, label: "Revenue"      },
  { id: "reports",      path: "/analytics",   icon: <BarChart2       className="w-4.5 h-4.5" />, label: "Reports"      },
  { id: "settings",     path: "/settings",    icon: <Settings        className="w-4.5 h-4.5" />, label: "Settings"     },
];

/* ─── HELPERS ─────────────────────────────────────── */

function SeverityDot({ severity }: { severity: string }) {
  return (
    <span className={`w-2 h-2 rounded-full shrink-0 ${severity === "critical" ? "bg-red-500" : severity === "high" ? "bg-orange-500" : "bg-amber-400"}`} />
  );
}

function ScoreRing({ score, size = 96 }: { score: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = "hsl(var(--primary))";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="8"
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>{score}</text>
      <text x={size / 2} y={size / 2 + 18} textAnchor="middle" fontSize="8" fill="#9ca3af">/100</text>
    </svg>
  );
}

/* ─── COMPONENT ───────────────────────────────────── */

export default function CareerAnalysisScreen({ mobile = "9876543210" }: CareerAnalysisScreenProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [expandedPathway, setExpandedPathway] = useState<string | null>("cp1");
  const [expandedWarning, setExpandedWarning] = useState<string | null>(null);
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());

  const activeWarnings = WARNINGS.filter((w) => !dismissedWarnings.has(w.id));

  return (
    <div className="h-screen bg-background flex overflow-hidden">

      {/* ── SIDEBAR ── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="bg-card border-r border-border flex flex-col shrink-0 overflow-hidden"
            data-testid="career-sidebar"
          >
            <div className="h-16 px-5 flex items-center gap-3 border-b border-border shrink-0">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base font-serif font-semibold text-foreground whitespace-nowrap">MindBridge</span>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              <p className="text-[10px] font-medium text-muted-foreground px-3 mb-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />Main Menu</p>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left whitespace-nowrap ${
                    item.id === "reports"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  data-testid={`sidebar-nav-${item.id}`}
                >
                  {item.icon}{item.label}
                </button>
              ))}
            </nav>
            <div className="px-3 py-3 border-t border-border shrink-0">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">AS</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">Dr. Ananya Sharma</p>
                  <p className="text-[10px] text-muted-foreground truncate">{mobile}</p>
                </div>
                <BadgeCheck className="w-4 h-4 text-green-500 shrink-0" />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-card/95 backdrop-blur border-b border-border flex items-center gap-3 px-4 sm:px-6 shrink-0" data-testid="career-header">
          <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-toggle-sidebar">
            <Menu className="w-4.5 h-4.5" />
          </button>
          <button onClick={() => navigate("/student")} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-back">
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Career Analysis</p>
            <p className="text-sm font-semibold text-foreground truncate">Priya Mehta · Class 12-A · Data Science Track</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {activeWarnings.filter((w) => w.severity === "critical").length > 0 && (
              <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full" data-testid="warning-badge">
                <AlertTriangle className="w-3 h-3" />
                {activeWarnings.filter((w) => w.severity === "critical").length} Critical Alerts
              </span>
            )}
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-export-report"
              onClick={() => toast({ title: "Exporting analysis", description: "Career analysis PDF is being generated." })}>
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5" data-testid="button-update-analysis"
              onClick={() => toast({ title: "Analysis updated", description: "Latest assessment data applied." })}>
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh Data</span>
            </Button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" data-testid="career-analysis-content">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

            {/* ── SECTION 1: ASSESSMENT SCORE ── */}
            <section data-testid="section-assessment-score">
              <SectionLabel icon={<Award className="w-4 h-4" />} title="Assessment Score" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Overall score ring */}
                <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2" data-testid="overall-score-card">
                  <ScoreRing score={OVERALL_SCORE} size={108} />
                  <p className="text-sm font-semibold text-foreground">Career Readiness</p>
                  <p className="text-[10px] text-muted-foreground text-center">Overall composite across 5 dimensions</p>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {OVERALL_SCORE >= 80 ? "Strong" : OVERALL_SCORE >= 65 ? "Developing" : "Needs Support"}
                  </span>
                </div>

                {/* Sub-scores */}
                <div className="md:col-span-2 bg-card border border-border rounded-2xl p-5" data-testid="readiness-sub-scores">
                  <p className="text-xs font-semibold text-foreground mb-3">Readiness Dimensions</p>
                  <div className="space-y-3">
                    {READINESS_SCORES.map((rs) => (
                      <div key={rs.label} data-testid={`readiness-row-${rs.label.toLowerCase().replace(/\s+/g, "-")}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-foreground">{rs.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">{rs.score}</span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{rs.score >= 80 ? "Strong" : rs.score >= 70 ? "Good" : "Developing"}</span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rs.score}%` }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="h-full rounded-full"
                            style={{ background: "linear-gradient(to right, hsl(var(--primary)), #2563eb)" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── SECTION 2: WARNING SIGNALS ── */}
            {activeWarnings.length > 0 && (
              <section data-testid="section-warnings">
                <SectionLabel icon={<AlertTriangle className="w-4 h-4 text-red-600" />} title="Warning Signals" badge={`${activeWarnings.length} active`} badgeColor="bg-red-50 text-red-700 border-red-200" />
                <div className="space-y-2" data-testid="warnings-list">
                  {activeWarnings.map((w) => (
                    <motion.div
                      key={w.id}
                      layout
                      className={`border rounded-2xl overflow-hidden ${
                        w.severity === "critical" ? "border-red-200 bg-red-50/40" :
                        w.severity === "high"     ? "border-orange-200 bg-orange-50/30" :
                        "border-amber-200 bg-amber-50/20"
                      }`}
                      data-testid={`warning-${w.id}`}
                    >
                      <div
                        className="p-3.5 flex items-start gap-3 cursor-pointer"
                        onClick={() => setExpandedWarning(expandedWarning === w.id ? null : w.id)}
                      >
                        <SeverityDot severity={w.severity} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-xs font-semibold ${
                              w.severity === "critical" ? "text-red-800" :
                              w.severity === "high" ? "text-orange-800" : "text-amber-800"
                            }`}>{w.title}</p>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${
                              w.severity === "critical" ? "bg-red-100 text-red-700 border-red-200" :
                              w.severity === "high"     ? "bg-orange-100 text-orange-700 border-orange-200" :
                              "bg-amber-100 text-amber-700 border-amber-200"
                            }`}>{w.severity}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            className="text-[10px] text-muted-foreground hover:text-foreground px-2 py-0.5 rounded border border-border bg-background"
                            data-testid={`button-dismiss-warning-${w.id}`}
                            onClick={(e) => { e.stopPropagation(); setDismissedWarnings((prev) => new Set([...prev, w.id])); toast({ title: "Warning dismissed", description: w.title }); }}
                          >
                            Dismiss
                          </button>
                          {expandedWarning === w.id ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                        </div>
                      </div>
                      <AnimatePresence>
                        {expandedWarning === w.id && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                            <div className={`px-4 pb-3.5 border-t ${w.severity === "critical" ? "border-red-200" : w.severity === "high" ? "border-orange-200" : "border-amber-200"}`}>
                              <p className="text-xs text-foreground/80 mt-2.5 leading-relaxed">{w.detail}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <ArrowRight className={`w-3 h-3 shrink-0 ${w.severity === "critical" ? "text-red-600" : w.severity === "high" ? "text-orange-600" : "text-amber-600"}`} />
                                <p className={`text-[11px] font-semibold ${w.severity === "critical" ? "text-red-700" : w.severity === "high" ? "text-orange-700" : "text-amber-700"}`}>
                                  Recommended action: {w.action}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* ── SECTION 3: APTITUDE + INTEREST MAP ── */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Aptitude Breakdown */}
                <div data-testid="section-aptitude">
                  <SectionLabel icon={<Brain className="w-4 h-4" />} title="Aptitude Breakdown" />
                  <div className="bg-card border border-border rounded-2xl p-5 h-64" data-testid="aptitude-chart">
                    <p className="text-[10px] text-muted-foreground mb-2">Top strength: <strong className="text-primary">Logical Reasoning (85)</strong></p>
                    <ResponsiveContainer width="100%" height="90%">
                      <BarChart data={APTITUDE_DATA} layout="vertical" margin={{ top: 0, right: 36, left: 4, bottom: 0 }}>
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 8 }} axisLine={false} tickLine={false} tickCount={6} />
                        <YAxis dataKey="skill" type="category" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={130} />
                        <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]} fill="hsl(var(--primary))">
                          <LabelList dataKey="score" position="right" style={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Interest Map */}
                <div data-testid="section-interest-map">
                  <SectionLabel icon={<Activity className="w-4 h-4" />} title="Interest Map" />
                  <div className="bg-card border border-border rounded-2xl p-5 h-64" data-testid="interest-map-chart">
                    <p className="text-[10px] text-muted-foreground mb-1">Dominant interests: <strong className="text-primary">Technology (88) · Mathematics (82)</strong></p>
                    <ResponsiveContainer width="100%" height="90%">
                      <RadarChart data={INTEREST_RADAR} margin={{ top: 4, right: 20, bottom: 4, left: 20 }}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="domain" tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                        <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            {/* ── SECTION 4: SKILL GAP ANALYSIS ── */}
            <section data-testid="section-skill-gap">
              <SectionLabel icon={<Layers className="w-4 h-4" />} title="Skill Gap Analysis" subtitle="Target career: Data Scientist" />
              <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="skill-gap-table">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Skill</th>
                        <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                        <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider w-48">Progress</th>
                        <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Current</th>
                        <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Required</th>
                        <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Gap</th>
                        <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SKILL_GAPS.map((sg, i) => {
                        const gap = sg.required - sg.current;
                        const pct = Math.round((sg.current / sg.required) * 100);
                        const priority = gap >= 50 ? "critical" : gap >= 20 ? "high" : gap >= 10 ? "medium" : "low";
                        return (
                          <tr key={sg.skill} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/10"}`} data-testid={`skill-row-${i}`}>
                            <td className="px-4 py-3 text-xs font-medium text-foreground">{sg.skill}</td>
                            <td className="px-4 py-3">
                              <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full border border-border">{sg.category}</span>
                            </td>
                            <td className="px-4 py-3 w-48">
                              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.7, delay: i * 0.05 }}
                                  className={`h-full rounded-full ${
                                    priority === "critical" ? "bg-red-500" :
                                    priority === "high"     ? "bg-orange-400" :
                                    priority === "medium"   ? "bg-amber-400" :
                                    "bg-green-500"
                                  }`}
                                />
                                <div
                                  className="absolute top-0 h-full border-r-2 border-dashed border-slate-400 opacity-60"
                                  style={{ left: "100%" }}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-xs font-semibold text-foreground">{sg.current}</td>
                            <td className="px-4 py-3 text-center text-xs text-muted-foreground">{sg.required}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs font-bold ${gap >= 50 ? "text-red-600" : gap >= 20 ? "text-orange-600" : gap >= 10 ? "text-amber-600" : "text-green-600"}`}>
                                -{gap}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${
                                priority === "critical" ? "bg-red-50 text-red-700 border-red-200" :
                                priority === "high"     ? "bg-orange-50 text-orange-700 border-orange-200" :
                                priority === "medium"   ? "bg-amber-50 text-amber-700 border-amber-200" :
                                "bg-green-50 text-green-700 border-green-200"
                              }`}>{priority}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── SECTION 5: CAREER PATHWAYS ── */}
            <section data-testid="section-career-pathways">
              <SectionLabel icon={<Target className="w-4 h-4" />} title="Career Pathways" subtitle="Ranked by aptitude-interest match" />
              <div className="space-y-3" data-testid="pathways-list">
                {CAREER_PATHWAYS.map((cp) => {
                  const isExpanded = expandedPathway === cp.id;
                  return (
                    <motion.div key={cp.id} layout className="bg-card border border-border rounded-2xl overflow-hidden" data-testid={`pathway-${cp.id}`}>
                      <div className="p-4 flex items-start gap-4 cursor-pointer" onClick={() => setExpandedPathway(isExpanded ? null : cp.id)}>
                        {/* Match circle */}
                        <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 ${cp.match >= 90 ? "bg-green-50 border border-green-200" : cp.match >= 80 ? "bg-blue-50 border border-blue-200" : cp.match >= 70 ? "bg-amber-50 border border-amber-200" : "bg-slate-50 border border-slate-200"}`}>
                          <span className={`text-lg font-extrabold leading-none ${cp.match >= 90 ? "text-green-700" : cp.match >= 80 ? "text-blue-700" : cp.match >= 70 ? "text-amber-700" : "text-slate-600"}`}>{cp.match}</span>
                          <span className="text-[8px] text-muted-foreground">%</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="text-sm font-semibold text-foreground">{cp.title}</p>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cp.tagColor}`}>{cp.tag}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{cp.degree}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-[10px] text-foreground font-medium">Entry: {cp.salaryCurrent}</span>
                            <span className="text-muted-foreground/40">·</span>
                            <span className="text-[10px] text-green-700 font-medium">Senior: {cp.salaryPeak}</span>
                            <span className="text-muted-foreground/40">·</span>
                            <span className="text-[10px] text-muted-foreground">{cp.timeline}</span>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />}
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden border-t border-border">
                            <div className="p-4 bg-muted/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-[10px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-primary/50 inline-block" />Key Details</p>
                                <div className="space-y-1.5 text-xs">
                                  <p><span className="text-muted-foreground">Entry role:</span> <strong>{cp.entryRole}</strong></p>
                                  <p><span className="text-muted-foreground">Degree path:</span> {cp.degree}</p>
                                  <p><span className="text-muted-foreground">Exams:</span> {cp.exams.join(", ")}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-primary/50 inline-block" />Top Employers</p>
                                <div className="flex flex-wrap gap-1">
                                  {cp.companies.map((c) => <span key={c} className="text-[10px] bg-background border border-border px-2 py-0.5 rounded-full text-foreground">{c}</span>)}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="bg-green-50 border border-green-200 rounded-xl p-2.5">
                                  <p className="text-[10px] font-semibold text-green-700 mb-0.5 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Strength</p>
                                  <p className="text-[10px] text-green-800">{cp.strength}</p>
                                </div>
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                                  <p className="text-[10px] font-semibold text-amber-700 mb-0.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Challenge</p>
                                  <p className="text-[10px] text-amber-800">{cp.challenge}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* ── SECTION 6: ELIGIBILITY CHART ── */}
            <section data-testid="section-eligibility">
              <SectionLabel icon={<GraduationCap className="w-4 h-4" />} title="Eligibility Chart" subtitle="Current exam readiness vs. minimum required for admission" />
              <div className="bg-card border border-border rounded-2xl p-5" data-testid="eligibility-chart">
                <div className="space-y-4">
                  {ELIGIBILITY_DATA.map((eg, i) => (
                    <div key={eg.college} data-testid={`eligibility-row-${i}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">{eg.college}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{eg.readiness}% ready</span>
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                            eg.readiness >= 88 ? "bg-green-50 text-green-700 border-green-200" :
                            eg.readiness >= 75 ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            {eg.readiness >= 88 ? "Near Ready" : eg.readiness >= 75 ? "Needs Work" : "Significant Gap"}
                          </span>
                        </div>
                      </div>
                      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${eg.readiness}%` }}
                          transition={{ duration: 0.9, delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: eg.color }}
                        />
                        <div className="absolute right-0 top-0 h-full flex items-center pr-1.5">
                          <span className="text-[8px] text-muted-foreground font-medium">{eg.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Readiness scores are based on current academic performance, aptitude assessment, and projected exam scores.
                </p>
              </div>
            </section>

            {/* ── SECTION 7: RECOMMENDED NEXT STEP ── */}
            <section data-testid="section-recommended-step">
              <SectionLabel icon={<Sparkles className="w-4 h-4" />} title="Recommended Next Education Step" />
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-5" data-testid="recommended-step-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-base font-serif font-semibold text-foreground">B.Tech Computer Science — NIT Trichy or BITS Pilani</p>
                      <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full">Top Recommendation</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Specialisation: Data Science / Artificial Intelligence · Admission Cycle: 2026–27</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Match score",     value: "94%",              icon: <Star className="w-3 h-3 text-amber-500" />    },
                        { label: "Admission exam",  value: "JEE Mains + BITSAT", icon: <BookOpen className="w-3 h-3 text-primary" />  },
                        { label: "Timeline",        value: "4 years",           icon: <Clock className="w-3 h-3 text-blue-600" />    },
                        { label: "Starting salary", value: "₹8–14 LPA",         icon: <TrendingUp className="w-3 h-3 text-green-600" /> },
                      ].map((s) => (
                        <div key={s.label} className="bg-card/70 rounded-xl px-3 py-2 flex items-center gap-2">
                          {s.icon}
                          <div>
                            <p className="text-[9px] text-muted-foreground">{s.label}</p>
                            <p className="text-xs font-semibold text-foreground">{s.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-primary/15">
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Why this recommendation:</strong> Priya's aptitude scores (Logical 85%, Spatial 80%, Numerical 78%) strongly align with the CS + Data Science curriculum. NIT Trichy has 88% admission readiness — achievable with 3 months of focused JEE Mains preparation. BITS Pilani offers a unique CS + Data Science dual degree with industry-leading placements and is achievable with BITSAT score of 350+.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── SECTION 8: ROADMAP VISUAL ── */}
            <section data-testid="section-roadmap">
              <SectionLabel icon={<ArrowRight className="w-4 h-4" />} title="Career Roadmap" subtitle="From Class 12 to Data Scientist" />
              <div className="bg-card border border-border rounded-2xl p-5 overflow-x-auto" data-testid="roadmap-visual">
                <div className="flex items-start gap-0 min-w-max">
                  {ROADMAP_STEPS.map((step, i) => (
                    <div key={step.id} className="flex items-start" data-testid={`roadmap-step-${step.id}`}>
                      <div className="flex flex-col items-center">
                        {/* Node */}
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          step.status === "active"   ? "bg-primary border-primary text-primary-foreground" :
                          step.status === "upcoming" ? "bg-card border-primary text-primary" :
                          "bg-muted border-border text-muted-foreground"
                        }`}>
                          {step.status === "active"   ? <Zap className="w-4 h-4" /> :
                           step.status === "upcoming" ? <Clock className="w-4 h-4" /> :
                           <Flag className="w-4 h-4" />}
                        </div>
                        {/* Label below node */}
                        <div className="mt-2 text-center w-32 px-1">
                          <p className={`text-[10px] font-bold ${step.status === "active" ? "text-primary" : "text-foreground"}`}>{step.phase}</p>
                          <p className="text-[9px] text-muted-foreground">{step.period}</p>
                          <p className={`text-[10px] font-semibold mt-0.5 ${step.status === "active" ? "text-primary" : "text-foreground"}`}>{step.title}</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                      {/* Connector */}
                      {i < ROADMAP_STEPS.length - 1 && (
                        <div className="flex items-start pt-5">
                          <div className={`w-12 h-0.5 ${step.status === "active" || step.status === "upcoming" ? "bg-primary" : "bg-border"}`} />
                          <ChevronRight className={`w-3 h-3 -ml-1.5 mt-[-6px] ${step.status === "active" || step.status === "upcoming" ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-5 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary" /><span className="text-[10px] text-muted-foreground">Active</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border-2 border-primary bg-card" /><span className="text-[10px] text-muted-foreground">Upcoming</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-muted border border-border" /><span className="text-[10px] text-muted-foreground">Future</span></div>
                </div>
              </div>
            </section>

            {/* ── SECTION 9: FUTURE MILESTONES ── */}
            <section data-testid="section-milestones">
              <SectionLabel icon={<Flag className="w-4 h-4" />} title="Future Milestones" subtitle="Upcoming deadlines and key dates" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" data-testid="milestones-grid">
                {MILESTONES.map((ms) => (
                  <div
                    key={ms.id}
                    className={`bg-card border rounded-2xl p-4 flex flex-col gap-2 ${
                      ms.priority === "critical" ? "border-red-200 bg-red-50/20" :
                      ms.priority === "high"     ? "border-orange-200 bg-orange-50/10" :
                      "border-border"
                    }`}
                    data-testid={`milestone-${ms.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${
                        ms.priority === "critical" ? "bg-red-100 text-red-700 border-red-200" :
                        ms.priority === "high"     ? "bg-orange-100 text-orange-700 border-orange-200" :
                        "bg-muted text-muted-foreground border-border"
                      }`}>{ms.priority}</span>
                      <span className={`text-[10px] font-semibold ${
                        ms.daysLeft <= 14 ? "text-red-600" : ms.daysLeft <= 30 ? "text-orange-600" : "text-muted-foreground"
                      }`}>
                        {ms.daysLeft <= 0 ? "TODAY" : `${ms.daysLeft}d left`}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-snug">{ms.event}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />{ms.date}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom padding */}
            <div className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SECTION LABEL HELPER ─── */
function SectionLabel({ icon, title, subtitle, badge, badgeColor }: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-primary">{icon}</span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {subtitle && <span className="text-[10px] text-muted-foreground hidden sm:block">— {subtitle}</span>}
      {badge && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ml-auto ${badgeColor}`}>{badge}</span>}
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
