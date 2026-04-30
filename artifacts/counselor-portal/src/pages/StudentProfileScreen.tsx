import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import {
  Shield, Menu, BadgeCheck, Calendar, CheckCircle2, Clock, MapPin,
  User, Phone, Mail, ChevronRight, MessageCircle, BookOpen, Brain,
  LayoutDashboard, Users, IndianRupee, BarChart2, Settings, School,
  Star, ArrowLeft, Edit3, Plus, Send, FileText, Download, Clipboard,
  Target, TrendingUp, GraduationCap, Building2, Zap, AlertTriangle,
  ChevronDown, ChevronUp, Tag, Sparkles, Activity, CreditCard, Bell,
  BookMarked, Flag, Check, RefreshCw, ExternalLink, Award, Layers, X,
  Stethoscope, Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface StudentProfileScreenProps {
  mobile?: string;
}

const RIASEC_DATA = [
  { code: "R", label: "Realistic",      score: 72, color: "#0f4c75" },
  { code: "I", label: "Investigative",  score: 68, color: "#1565c0" },
  { code: "A", label: "Artistic",       score: 45, color: "#6a1b9a" },
  { code: "S", label: "Social",         score: 50, color: "#2e7d32" },
  { code: "E", label: "Enterprising",   score: 55, color: "#e65100" },
  { code: "C", label: "Conventional",   score: 40, color: "#37474f" },
];

const APTITUDE_DATA = [
  { skill: "Logical Reasoning",    score: 85 },
  { skill: "Numerical Ability",    score: 78 },
  { skill: "Verbal Reasoning",     score: 65 },
  { skill: "Spatial Ability",      score: 80 },
  { skill: "Critical Thinking",    score: 73 },
];

const PATHWAY_RECS = [
  {
    id: "p1",
    rank: 1,
    title: "B.Tech Computer Science → IIT / NIT",
    sub: "Followed by M.Tech in Data Science or AI",
    match: 94,
    steps: ["Clear JEE Advanced with rank < 2000", "Choose IIT Bombay / IIT Delhi / NIT Trichy", "Specialise in AI/ML in 3rd–4th year", "M.Tech or direct industry"],
    tag: "Best Fit",
  },
  {
    id: "p2",
    rank: 2,
    title: "B.Tech + Data Science at BITS Pilani",
    sub: "WILP dual-degree advantage, strong placements",
    match: 88,
    steps: ["Score 350+ in BITSAT", "Enroll in CS + Data Science dual degree", "Industry internships via BITS network"],
    tag: "Strong Match",
  },
  {
    id: "p3",
    rank: 3,
    title: "B.Sc Statistics / Math → IISc",
    sub: "Research-oriented path, excellent for academia",
    match: 76,
    steps: ["Apply for CMI / ISI / IISc BS programmes", "Pursue pure mathematics + statistics", "PhD or Data Science MSc abroad"],
    tag: "Research Track",
  },
];

const COLLEGES = [
  { id: "c1", name: "IIT Bombay", course: "B.Tech Computer Science", exam: "JEE Advanced", cutoff: "Rank < 500",   status: "Target",      difficulty: "Very High", location: "Mumbai"    },
  { id: "c2", name: "IIT Delhi",  course: "B.Tech Computer Science", exam: "JEE Advanced", cutoff: "Rank < 200",   status: "Stretch",     difficulty: "Extreme",   location: "New Delhi" },
  { id: "c3", name: "NIT Trichy", course: "B.Tech Computer Science", exam: "JEE Mains",    cutoff: "Rank < 5,000", status: "Safe",        difficulty: "High",      location: "Trichy"    },
  { id: "c4", name: "BITS Pilani",course: "CS + Data Science",       exam: "BITSAT",       cutoff: "Score 350+",   status: "Target",      difficulty: "High",      location: "Pilani"    },
  { id: "c5", name: "IIIT Hyd",   course: "B.Tech CSE",              exam: "JEE Mains",    cutoff: "Rank < 2,000", status: "Achievable",  difficulty: "High",      location: "Hyderabad" },
  { id: "c6", name: "DTU Delhi",  course: "B.Tech CSE",              exam: "JEE Mains",    cutoff: "Rank < 3,000", status: "Safe",        difficulty: "High",      location: "New Delhi" },
];

const COACHING = [
  { name: "Allen Career Institute", mode: "Offline", focus: "JEE Advanced", city: "Kota / Delhi",   rating: 4.8 },
  { name: "Aakash Institute",       mode: "Hybrid",  focus: "JEE Mains",    city: "Pan-India",      rating: 4.5 },
  { name: "Unacademy",              mode: "Online",  focus: "JEE Full Prep",city: "Online",          rating: 4.4 },
  { name: "Physics Wallah",         mode: "Online",  focus: "JEE + Board",  city: "Online",          rating: 4.6 },
];

const COUNSELING_NOTES = [
  {
    id: "n1",
    date: "14 Mar 2026",
    type: "Session Note",
    author: "Dr. Ananya Sharma",
    content: "Completed initial RIASEC assessment. Student demonstrates strong aptitude in Logical Reasoning (85%) and Spatial Ability (80%). High career confusion — torn between pursuing pure Mathematics and Computer Science. Self-reported parental pressure to choose Engineering. Assigned: RIASEC report + career mapping worksheet.",
    tags: ["Assessment", "Initial"],
  },
  {
    id: "n2",
    date: "5 Apr 2026",
    type: "Session Note",
    author: "Dr. Ananya Sharma",
    content: "Follow-up session. Priya has reviewed the RIASEC report and is now leaning towards Data Science as a career goal. Discussed IIT Bombay, BITS Pilani, and NIT Trichy as primary targets. Parental pressure still high — father insists on IIT only. Recommended stress management techniques. Will send college comparison document.",
    tags: ["Career Guidance", "College List"],
  },
  {
    id: "n3",
    date: "20 Apr 2026",
    type: "Coordinator Alert",
    author: "Ms. Neha Gupta (School Coordinator)",
    content: "Alert: Priya was absent for 3 consecutive days (17–19 Apr) without prior intimation. School reports she appeared distressed when she returned. Parents were contacted — father confirmed stress at home regarding exam preparation. Recommend prioritising emotional support in next session.",
    tags: ["Alert", "Attendance", "Stress"],
  },
];

const APPOINTMENTS = [
  { id: "a1", date: "14 Mar 2026", time: "10:00 AM", type: "Initial Assessment",       duration: "90 min", mode: "In-person", status: "completed", fee: 1500 },
  { id: "a2", date: "5 Apr 2026",  time: "11:00 AM", type: "Career Guidance",           duration: "60 min", mode: "Video call", status: "completed", fee: 1500 },
  { id: "a3", date: "27 Apr 2026", time: "2:00 PM",  type: "Follow-up + Stress Check",  duration: "45 min", mode: "Video call", status: "upcoming",  fee: 1500 },
  { id: "a4", date: "15 May 2026", time: "11:00 AM", type: "College Strategy Session",  duration: "60 min", mode: "In-person", status: "scheduled", fee: 1500 },
];

const PAYMENTS = [
  { id: "pay1", date: "14 Mar 2026", desc: "Session 1 — Initial Assessment",     amount: 1500, status: "paid",    method: "UPI"        },
  { id: "pay2", date: "5 Apr 2026",  desc: "Session 2 — Career Guidance",         amount: 1500, status: "paid",    method: "Net Banking" },
  { id: "pay3", date: "27 Apr 2026", desc: "Session 3 — Follow-up",              amount: 1500, status: "pending", method: "—"           },
];

const FOLLOWUPS = [
  { id: "f1", date: "27 Apr 2026", task: "Check exam prep progress — JEE Mains mock test results",    status: "due",       priority: "high"   },
  { id: "f2", date: "3 May 2026",  task: "Send BITS Pilani application checklist",                     status: "upcoming",  priority: "medium" },
  { id: "f3", date: "15 May 2026", task: "Pre-session check-in call (15 min)",                         status: "upcoming",  priority: "medium" },
  { id: "f4", date: "30 May 2026", task: "Post-board exam debrief + emotional check-in",               status: "upcoming",  priority: "high"   },
  { id: "f5", date: "15 Jul 2026", task: "College admission status update + counseling road-map",      status: "upcoming",  priority: "medium" },
];

const COUNSELOR_ACTIONS = [
  { id: "ca1", label: "Schedule Session",    icon: <Calendar      className="w-4 h-4" />, testid: "action-schedule"  },
  { id: "ca2", label: "Send Message",        icon: <Send          className="w-4 h-4" />, testid: "action-message"   },
  { id: "ca3", label: "Add Note",            icon: <Edit3         className="w-4 h-4" />, testid: "action-note"      },
  { id: "ca4", label: "Generate Report",     icon: <Download      className="w-4 h-4" />, testid: "action-report"    },
  { id: "ca5", label: "Refer to Specialist", icon: <ExternalLink  className="w-4 h-4" />, testid: "action-refer"     },
  { id: "ca6", label: "Add Follow-up",       icon: <Flag          className="w-4 h-4" />, testid: "action-followup"  },
];

type ProfileTab = "overview" | "pathway" | "appointments" | "payments" | "notes" | "followups";

const TABS: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview",     label: "Overview",      icon: <Layers     className="w-3.5 h-3.5" /> },
  { id: "pathway",      label: "Pathway",       icon: <Target     className="w-3.5 h-3.5" /> },
  { id: "appointments", label: "Appointments",  icon: <Calendar   className="w-3.5 h-3.5" /> },
  { id: "payments",     label: "Payments",      icon: <CreditCard className="w-3.5 h-3.5" /> },
  { id: "notes",        label: "Notes",         icon: <BookOpen   className="w-3.5 h-3.5" /> },
  { id: "followups",    label: "Follow-ups",    icon: <Flag       className="w-3.5 h-3.5" /> },
];

const NAV_ITEMS = [
  { id: "dashboard",    path: "/dashboard",   icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: "Dashboard"    },
  { id: "students",     path: "/requests",    icon: <Users           className="w-4.5 h-4.5" />, label: "Students"     },
  { id: "appointments", path: "/appointment", icon: <Calendar        className="w-4.5 h-4.5" />, label: "Appointments" },
  { id: "schools",      path: "/visits",      icon: <School          className="w-4.5 h-4.5" />, label: "Schools"      },
  { id: "revenue",      path: "/revenue",     icon: <IndianRupee     className="w-4.5 h-4.5" />, label: "Revenue"      },
  { id: "reports",      path: "/analytics",   icon: <BarChart2       className="w-4.5 h-4.5" />, label: "Reports"      },
  { id: "settings",     path: "/settings",    icon: <Settings        className="w-4.5 h-4.5" />, label: "Settings"     },
];

function SectionCard({ title, icon, children, testid, className = "" }: { title: string; icon: React.ReactNode; children: React.ReactNode; testid?: string; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-2xl overflow-hidden ${className}`} data-testid={testid}>
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0" />{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-[10px] text-muted-foreground shrink-0">{label}</span>
      <span className={`text-[11px] font-medium text-right ${highlight ? "text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

export default function StudentProfileScreen({ mobile = "9876543210" }: StudentProfileScreenProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab]     = useState<ProfileTab>("overview");
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [expandedPath, setExpandedPath] = useState<string | null>("p1");
  const [newNote, setNewNote]           = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [completedFollowups, setCompletedFollowups] = useState<Set<string>>(new Set());

  const [showReferModal, setShowReferModal]   = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [referSpecialty, setReferSpecialty]   = useState("Clinical Psychologist");
  const [referUrgency, setReferUrgency]       = useState<"high"|"medium"|"low">("medium");
  const [referNotes, setReferNotes]           = useState("");
  const [followupTask, setFollowupTask]       = useState("");
  const [followupDate, setFollowupDate]       = useState("");
  const [followupPriority, setFollowupPriority] = useState<"high"|"medium">("medium");

  const totalPaid    = PAYMENTS.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pendingAmt   = PAYMENTS.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const completedSessions = APPOINTMENTS.filter((a) => a.status === "completed").length;
  const nextAppt     = APPOINTMENTS.find((a) => a.status === "upcoming" || a.status === "scheduled");

  return (
    <div className="h-screen bg-background flex overflow-hidden">

      {/* ——— SIDEBAR ——— */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="bg-card border-r border-border flex flex-col shrink-0 overflow-hidden"
            data-testid="profile-sidebar"
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
                    item.id === "students"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  data-testid={`sidebar-nav-${item.id}`}
                >
                  {item.icon}
                  {item.label}
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

      {/* ——— MAIN ——— */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header bar */}
        <header className="h-16 bg-card/95 backdrop-blur border-b border-border flex items-center gap-3 px-4 sm:px-6 shrink-0" data-testid="profile-header">
          <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-toggle-sidebar">
            <Menu className="w-4.5 h-4.5" />
          </button>
          <button onClick={() => navigate("/requests")} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-back">
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Student Profile</p>
            <p className="text-sm font-semibold text-foreground truncate">Priya Mehta · Class 12-A · DPS Rohini</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-career-analysis"
              onClick={() => navigate("/career-analysis")}>
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Career Analysis</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-download-report"
              onClick={() => toast({ title: "Generating report…", description: "Student profile PDF will be ready shortly." })}>
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Report</span>
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5" data-testid="button-schedule-session"
              onClick={() => toast({ title: "Schedule session", description: "Opening session scheduler for Priya Mehta." })}>
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Schedule</span>
            </Button>
          </div>
        </header>

        {/* Student hero card */}
        <div className="bg-card border-b border-border px-4 sm:px-6 py-4 shrink-0" data-testid="student-hero">
          <div className="flex items-start gap-4 flex-wrap">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary text-xl font-bold flex items-center justify-center shrink-0">PM</div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-serif font-semibold text-foreground" data-testid="student-name">Priya Mehta</h2>
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Class 12-A · Delhi Public School, Rohini · CBSE</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-2.5 h-2.5" />Rohini, New Delhi
                  <span className="text-border">·</span>
                  <GraduationCap className="w-2.5 h-2.5" />Science (PCM + CS)
                  <span className="text-border">·</span>
                  Age 17
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-4 ml-auto flex-wrap" data-testid="hero-stats">
              {[
                { label: "Sessions",     value: String(completedSessions),              color: "text-foreground"  },
                { label: "Total Paid",   value: `₹${totalPaid.toLocaleString()}`,       color: "text-green-600"   },
                { label: "Pending",      value: `₹${pendingAmt.toLocaleString()}`,      color: pendingAmt > 0 ? "text-amber-600" : "text-muted-foreground" },
                { label: "RIASEC Type",  value: "RI",                                   color: "text-primary"     },
                { label: "Target",       value: "Data Scientist",                       color: "text-primary"     },
                { label: "Next Session", value: nextAppt ? nextAppt.date : "—",         color: "text-blue-600"    },
              ].map((s) => (
                <div key={s.label} className="text-center px-3 border-r border-border last:border-0">
                  <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Counselor action buttons */}
          <div className="flex items-center gap-2 mt-3 flex-wrap" data-testid="counselor-actions">
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5" data-testid="action-schedule"
              onClick={() => navigate("/appointment/detail")}>
              <Calendar className="w-4 h-4" />Schedule Session
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5" data-testid="action-note"
              onClick={() => { setActiveTab("notes"); setShowNoteForm(true); }}>
              <Edit3 className="w-4 h-4" />Add Note
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5" data-testid="action-report"
              onClick={() => setShowReportModal(true)}>
              <Download className="w-4 h-4" />Generate Report
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5" data-testid="action-refer"
              onClick={() => setShowReferModal(true)}>
              <ExternalLink className="w-4 h-4" />Refer to Specialist
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5" data-testid="action-followup"
              onClick={() => { setActiveTab("followups"); setShowFollowupForm(true); }}>
              <Flag className="w-4 h-4" />Add Follow-up
            </Button>
          </div>
        </div>

        {/* Content: left info + right tabbed panel */}
        <div className="flex-1 overflow-hidden flex">

          {/* LEFT info column */}
          <div className="w-64 xl:w-72 border-r border-border overflow-y-auto shrink-0 bg-card/20" data-testid="info-column">
            <div className="p-3 space-y-3">

              {/* Basic info */}
              <SectionCard title="Basic Info" icon={<User className="w-3.5 h-3.5" />} testid="basic-info-card">
                <InfoRow label="Full Name"     value="Priya Mehta"           />
                <InfoRow label="Date of Birth" value="15 May 2008"           />
                <InfoRow label="Age"           value="17 years"              />
                <InfoRow label="Gender"        value="Female"                />
                <InfoRow label="Mobile"        value="+91 98765 43210"       />
                <InfoRow label="Email"         value="priya.mehta@email.com" />
                <InfoRow label="City"          value="Rohini, New Delhi"     />
                <InfoRow label="PIN Code"      value="110085"                />
              </SectionCard>

              {/* Parent info */}
              <SectionCard title="Parent / Guardian" icon={<Users className="w-3.5 h-3.5" />} testid="parent-info-card">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold text-foreground mb-1">Father</p>
                    <InfoRow label="Name"       value="Mr. Rajesh Mehta"   />
                    <InfoRow label="Profession" value="Software Engineer"  />
                    <InfoRow label="Employer"   value="TCS, Gurgaon"       />
                    <InfoRow label="Mobile"     value="+91 98765 43211"    />
                  </div>
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-[10px] font-semibold text-foreground mb-1">Mother</p>
                    <InfoRow label="Name"       value="Mrs. Sunita Mehta"  />
                    <InfoRow label="Profession" value="School Teacher"     />
                    <InfoRow label="Employer"   value="KV Rohini Sec 9"    />
                    <InfoRow label="Mobile"     value="+91 98765 43212"    />
                  </div>
                </div>
              </SectionCard>

              {/* School info */}
              <SectionCard title="Academic Profile" icon={<School className="w-3.5 h-3.5" />} testid="academic-profile-card">
                <InfoRow label="School"        value="Delhi Public School, Rohini" />
                <InfoRow label="Board"         value="CBSE"                        />
                <InfoRow label="Current Class" value="Class 12-A"                  />
                <InfoRow label="Stream"        value="Science (PCM + CS)"          />
                <InfoRow label="Class 10 %"    value="89.4% (2024)"  highlight     />
                <InfoRow label="Class 11 %"    value="82.6% (2025)"  highlight     />
                <div className="mt-2">
                  <p className="text-[10px] text-muted-foreground mb-1.5">Extra-curriculars</p>
                  <div className="flex flex-wrap gap-1">
                    {["Debate Club", "School Magazine", "Swimming"].map((e) => (
                      <span key={e} className="text-[9px] bg-muted border border-border px-1.5 py-0.5 rounded-full text-foreground">{e}</span>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* Current stage + target */}
              <SectionCard title="Career Profile" icon={<Target className="w-3.5 h-3.5" />} testid="career-profile-card">
                <InfoRow label="Current Stage"  value="Class 12 — College Application"  highlight />
                <InfoRow label="Career Interest" value="CS / Data Science / Math"       highlight />
                <InfoRow label="Target Career"  value="Data Scientist / ML Engineer"    highlight />
                <InfoRow label="Target Exams"   value="JEE Advanced, BITSAT"            />
                <InfoRow label="Target Year"    value="Admission Cycle 2026–27"         />
                <InfoRow label="Profile Match"  value="94% — Computer Science"  highlight />
              </SectionCard>

              {/* Assessment summary */}
              <SectionCard title="Assessment Summary" icon={<Brain className="w-3.5 h-3.5" />} testid="assessment-summary-card">
                <InfoRow label="RIASEC Type"      value="RI (Realistic + Investigative)" highlight />
                <InfoRow label="Personality"      value="Introvert · Analytical"         />
                <InfoRow label="Learning Style"   value="Visual-Spatial"                 />
                <InfoRow label="Top Aptitude"     value="Logical Reasoning (85%)"  highlight />
                <InfoRow label="Assessment Date"  value="10 Feb 2026"                   />
              </SectionCard>
            </div>
          </div>

          {/* RIGHT tabbed content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* Tab bar */}
            <div className="border-b border-border bg-card/50 flex items-center gap-0.5 px-3 overflow-x-auto shrink-0" data-testid="profile-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <span className={activeTab === tab.id ? "text-primary" : "text-muted-foreground"}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5" data-testid="tab-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                >

                  {/* ——— OVERVIEW ——— */}
                  {activeTab === "overview" && (
                    <div className="space-y-5" data-testid="content-overview">

                      {/* RIASEC + Aptitude */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="riasec-chart">
                          <div className="h-1 w-full bg-primary" />
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <BarChart2 className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-foreground leading-tight">RIASEC Assessment</p>
                                <p className="text-[10px] text-muted-foreground">Dominant: <strong className="text-primary">RI — Realistic + Investigative</strong></p>
                              </div>
                            </div>
                            <ResponsiveContainer width="100%" height={120}>
                              <BarChart data={RIASEC_DATA} margin={{ top: 6, right: 0, left: -28, bottom: 0 }}>
                                <XAxis dataKey="code" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(v: number, n, p) => [v, p.payload.label]} contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                                <Bar dataKey="score" radius={[3, 3, 0, 0]} fill="hsl(var(--primary))" />
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {RIASEC_DATA.map((d) => (
                                <span key={d.code} className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${d.score >= 65 ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted text-muted-foreground"}`}>
                                  {d.code}: {d.score}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="aptitude-chart">
                          <div className="h-1 w-full bg-teal-500" />
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                                <TrendingUp className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-foreground leading-tight">Aptitude Scores</p>
                                <p className="text-[10px] text-muted-foreground">Strengths: Logical Reasoning & Spatial Ability</p>
                              </div>
                            </div>
                            <ResponsiveContainer width="100%" height={120}>
                              <BarChart data={APTITUDE_DATA} layout="vertical" margin={{ top: 6, right: 8, left: 4, bottom: 0 }}>
                                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="skill" type="category" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={110} />
                                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                                <Bar dataKey="score" radius={[0, 3, 3, 0]} fill="hsl(169 100% 37%)" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Career interest tags + profile summary */}
                      <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="career-interests-card">
                        <div className="h-1 w-full bg-amber-500" />
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                              <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-xs font-semibold text-foreground">Career Interests & Goals</p>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {["Computer Science", "Data Science", "Mathematics", "Machine Learning", "Research", "Statistics"].map((t) => (
                              <span key={t} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium">{t}</span>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-3 border-t border-border">
                            {[
                              { label: "Current Stage",  value: "Class 12 · Applications",  accent: "border-l-primary"   },
                              { label: "Target Career",  value: "Data Scientist / ML Eng",   accent: "border-l-teal-500"  },
                              { label: "Target Exam",    value: "JEE Advanced + BITSAT",     accent: "border-l-amber-500" },
                              { label: "Timeline",       value: "Admission Cycle 2026–27",   accent: "border-l-blue-400"  },
                            ].map((s) => (
                              <div key={s.label} className={`bg-muted/40 rounded-xl px-3 py-2 border-l-2 ${s.accent}`}>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                                <p className="text-[11px] font-semibold text-foreground mt-0.5">{s.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Recent activity — timeline */}
                      <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="recent-activity-card">
                        <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border/60">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Activity className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-xs font-semibold text-foreground">Recent Activity</p>
                        </div>
                        <div className="p-4">
                          <div className="relative pl-8">
                            <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-border rounded-full" />
                            <div className="space-y-4">
                              {[
                                { text: "Session 2 completed — Career Guidance",          time: "5 Apr 2026",  icon: <CheckCircle2 className="w-3.5 h-3.5" />,   iconBg: "bg-green-50 text-green-600",  dot: "bg-green-500" },
                                { text: "Coordinator alert: 3-day absence (17–19 Apr)",   time: "20 Apr 2026", icon: <AlertTriangle className="w-3.5 h-3.5" />,   iconBg: "bg-red-50 text-red-600",     dot: "bg-red-500"   },
                                { text: "Message received: BITS Pilani inquiry",           time: "15 Apr 2026", icon: <MessageCircle className="w-3.5 h-3.5" />,   iconBg: "bg-blue-50 text-blue-600",   dot: "bg-blue-500"  },
                                { text: "College shortlist document sent via Inupgro",     time: "10 Apr 2026", icon: <FileText className="w-3.5 h-3.5" />,         iconBg: "bg-primary/10 text-primary",  dot: "bg-primary"   },
                                { text: "Session 3 scheduled for 27 Apr 2026 at 2:00 PM", time: "8 Apr 2026",  icon: <Calendar className="w-3.5 h-3.5" />,         iconBg: "bg-primary/10 text-primary",  dot: "bg-primary"   },
                              ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 relative">
                                  <div className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2 border-card ${item.dot}`} />
                                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                                    {item.icon}
                                  </div>
                                  <div className="flex-1 min-w-0 pt-0.5">
                                    <p className="text-xs text-foreground leading-snug">{item.text}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ——— PATHWAY ——— */}
                  {activeTab === "pathway" && (
                    <div className="space-y-5" data-testid="content-pathway">

                      {/* Pathway recommendations */}
                      <div data-testid="pathway-recommendations">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Target className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-xs font-semibold text-foreground">Recommended Pathways</p>
                        </div>
                        <div className="space-y-3">
                          {PATHWAY_RECS.map((p) => {
                            const isExpanded = expandedPath === p.id;
                            return (
                              <motion.div key={p.id} layout className={`bg-card border rounded-2xl overflow-hidden border-l-4 ${p.rank === 1 ? "border-primary border-l-primary" : "border-border border-l-muted-foreground/30"}`} data-testid={`pathway-${p.id}`}>
                                <div className="p-4 flex items-start gap-3 cursor-pointer" onClick={() => setExpandedPath(isExpanded ? null : p.id)}>
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${p.rank === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                    {p.rank}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                      <p className="text-sm font-semibold text-foreground">{p.title}</p>
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.rank === 1 ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted text-muted-foreground border border-border"}`}>{p.tag}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{p.sub}</p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <div className="text-right">
                                      <p className="text-sm font-bold text-green-600">{p.match}%</p>
                                      <p className="text-[9px] text-muted-foreground">match</p>
                                    </div>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden border-t border-border">
                                      <div className="p-4 bg-muted/20">
                                        <p className="text-[10px] font-medium text-muted-foreground mb-2 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-primary/50 inline-block" />Step-by-step pathway</p>
                                        <div className="space-y-2">
                                          {p.steps.map((step, i) => (
                                            <div key={i} className="flex items-start gap-2.5">
                                              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                                              <p className="text-xs text-foreground">{step}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Eligible colleges */}
                      <div data-testid="eligible-colleges">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-xs font-semibold text-foreground">Eligible Colleges</p>
                        </div>
                        <div className="bg-card border border-border rounded-2xl overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-border bg-muted/40">
                                  {["College", "Course", "Exam", "Cutoff", "Location", "Status"].map((h) => (
                                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {COLLEGES.map((c, i) => (
                                  <tr key={c.id} className={`border-b border-border last:border-0 transition-colors hover:bg-muted/20 ${i === 0 ? "bg-primary/5" : ""}`} data-testid={`college-row-${c.id}`}>
                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                      <div className="flex items-center gap-1.5">
                                        {i === 0 && <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-1 py-0.5 rounded">TOP</span>}
                                        <span className="font-semibold text-foreground">{c.name}</span>
                                      </div>
                                    </td>
                                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{c.course}</td>
                                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{c.exam}</td>
                                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap font-medium">{c.cutoff}</td>
                                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{c.location}</td>
                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                        c.status === "Safe"       ? "bg-green-100 text-green-700 border border-green-300"  :
                                        c.status === "Achievable" ? "bg-blue-100  text-blue-700  border border-blue-300"   :
                                        c.status === "Target"     ? "bg-amber-100 text-amber-700 border border-amber-300"  :
                                        "bg-red-100 text-red-700 border border-red-300"
                                      }`}>{c.status}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Coaching options */}
                      <div data-testid="coaching-options">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Award className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-xs font-semibold text-foreground">Recommended Coaching</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {COACHING.map((c, idx) => (
                            <div key={c.name} className={`bg-card border rounded-xl p-3 flex items-start gap-3 border-l-4 ${idx % 2 === 0 ? "border-primary border-l-primary" : "border-teal-500 border-l-teal-500"}`}>
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${idx % 2 === 0 ? "bg-primary/10 text-primary" : "bg-teal-50 text-teal-600"}`}>
                                <BookMarked className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground">{c.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  <p className="text-[10px] text-muted-foreground">{c.focus}</p>
                                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                                    c.mode === "Online"  ? "bg-blue-50 text-blue-700 border-blue-200" :
                                    c.mode === "Offline" ? "bg-slate-50 text-slate-600 border-slate-200" :
                                    "bg-teal-50 text-teal-700 border-teal-200"
                                  }`}>{c.mode}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">{c.city}</p>
                              </div>
                              <div className="flex items-center gap-0.5 shrink-0">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span className="text-[10px] font-semibold text-foreground">{c.rating}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ——— APPOINTMENTS ——— */}
                  {activeTab === "appointments" && (
                    <div className="space-y-4" data-testid="content-appointments">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{APPOINTMENTS.length} Sessions</p>
                            <p className="text-[10px] text-muted-foreground">{completedSessions} completed</p>
                          </div>
                        </div>
                        <Button size="sm" className="h-7 text-[11px] gap-1" data-testid="button-new-appointment"
                          onClick={() => toast({ title: "New appointment", description: "Opening session scheduler…" })}>
                          <Plus className="w-3 h-3" />Book Session
                        </Button>
                      </div>

                      {/* Today separator */}
                      {APPOINTMENTS.some((a) => a.status === "upcoming") && (
                        <div className="flex items-center gap-2">
                          <div className="h-px flex-1 bg-amber-200" />
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">TODAY</span>
                          <div className="h-px flex-1 bg-amber-200" />
                        </div>
                      )}

                      <div className="space-y-3">
                        {APPOINTMENTS.map((apt, idx) => {
                          const showUpcomingSep = idx > 0 && apt.status === "scheduled" && APPOINTMENTS[idx - 1].status !== "scheduled";
                          return (
                            <React.Fragment key={apt.id}>
                              {showUpcomingSep && (
                                <div className="flex items-center gap-2 pt-1">
                                  <div className="h-px flex-1 bg-border" />
                                  <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Upcoming</span>
                                  <div className="h-px flex-1 bg-border" />
                                </div>
                              )}
                              <div
                                className={`bg-card border rounded-2xl p-4 flex items-start gap-3 border-l-4 ${
                                  apt.status === "completed" ? "border-l-green-500 border-green-100" :
                                  apt.status === "upcoming"  ? "border-l-blue-500 border-blue-100"  :
                                  "border-l-slate-400 border-slate-100"
                                }`}
                                data-testid={`appointment-${apt.id}`}
                              >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  apt.status === "completed" ? "bg-green-50 text-green-600" :
                                  apt.status === "upcoming"  ? "bg-blue-50 text-blue-600"   :
                                  "bg-slate-100 text-slate-500"
                                }`}>
                                  <Calendar className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <p className="text-xs font-semibold text-foreground">{apt.type}</p>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                      apt.status === "completed" ? "bg-green-50 text-green-700 border-green-200" :
                                      apt.status === "upcoming"  ? "bg-blue-50  text-blue-700  border-blue-200"  :
                                      "bg-slate-50 text-slate-600 border-slate-200"
                                    }`}>{apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}</span>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                      apt.mode === "Video call" || apt.mode?.toLowerCase().includes("video")
                                        ? "bg-primary/10 text-primary border-primary/20"
                                        : "bg-slate-50 text-slate-600 border-slate-200"
                                    }`}>
                                      {apt.mode}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground">{apt.date} · {apt.time} · {apt.duration}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-sm font-bold text-foreground">₹{apt.fee.toLocaleString()}</p>
                                  <p className="text-[10px] text-muted-foreground">Session fee</p>
                                  {(apt.status === "upcoming" || apt.status === "scheduled") && (
                                    <button
                                      className="mt-1.5 text-[10px] text-primary font-medium hover:underline flex items-center gap-0.5 ml-auto"
                                      data-testid={`button-view-appt-${apt.id}`}
                                      onClick={() => navigate("/appointment/detail")}
                                    >
                                      View detail →
                                    </button>
                                  )}
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ——— PAYMENTS ——— */}
                  {activeTab === "payments" && (() => {
                    const paidCount = PAYMENTS.filter((p) => p.status === "paid").length;
                    const paidPct = Math.round((paidCount / PAYMENTS.length) * 100);
                    return (
                    <div className="space-y-4" data-testid="content-payments">
                      {/* Stat cards */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Total Paid",      value: `₹${totalPaid.toLocaleString()}`,  accent: "bg-green-500",  iconBg: "bg-green-50 text-green-600",  icon: <CheckCircle2 className="w-4 h-4" /> },
                          { label: "Pending",         value: `₹${pendingAmt.toLocaleString()}`, accent: "bg-amber-500",  iconBg: "bg-amber-50 text-amber-600",  icon: <Clock className="w-4 h-4" /> },
                          { label: "Sessions Billed", value: String(PAYMENTS.length),           accent: "bg-primary",    iconBg: "bg-primary/10 text-primary",  icon: <CreditCard className="w-4 h-4" /> },
                        ].map((s) => (
                          <div key={s.label} className="bg-card border border-border rounded-2xl overflow-hidden">
                            <div className={`h-1 w-full ${s.accent}`} />
                            <div className="p-3">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${s.iconBg}`}>{s.icon}</div>
                              <p className="text-lg font-bold text-foreground leading-tight">{s.value}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Sessions paid progress */}
                      <div className="bg-card border border-border rounded-xl px-4 py-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[11px] font-semibold text-foreground">{paidCount} of {PAYMENTS.length} sessions paid</p>
                          <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">{paidPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${paidPct}%` }} />
                        </div>
                      </div>
                      {/* Payment list */}
                      <div className="space-y-2" data-testid="payment-list">
                        {PAYMENTS.map((pay) => (
                          <div
                            key={pay.id}
                            className={`bg-card border rounded-2xl p-4 flex items-center gap-3 border-l-4 ${
                              pay.status === "paid" ? "border-l-green-500 border-green-100" : "border-l-amber-500 border-amber-100"
                            }`}
                            data-testid={`payment-${pay.id}`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${pay.status === "paid" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground">{pay.desc}</p>
                              <p className="text-[10px] text-muted-foreground">{pay.date} · {pay.method}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <p className="text-sm font-bold text-foreground">₹{pay.amount.toLocaleString()}</p>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pay.status === "paid" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                                {pay.status === "paid" ? "Paid" : "Pending"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    );
                  })()}

                  {/* ——— NOTES ——— */}
                  {activeTab === "notes" && (
                    <div className="space-y-4" data-testid="content-notes">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <BookOpen className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">Counseling Notes</p>
                            <p className="text-[10px] text-muted-foreground">{COUNSELING_NOTES.length} notes on record</p>
                          </div>
                        </div>
                        <Button size="sm" className="h-7 text-[11px] gap-1" data-testid="button-add-note"
                          onClick={() => setShowNoteForm((v) => !v)}>
                          <Plus className="w-3 h-3" />Add Note
                        </Button>
                      </div>

                      {/* Add note form */}
                      <AnimatePresence>
                        {showNoteForm && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden" data-testid="add-note-form">
                            <div className="bg-card border border-primary/30 rounded-2xl p-4 space-y-3">
                              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />New Counseling Note
                              </p>
                              <textarea
                                rows={4}
                                placeholder="Enter session notes, observations, or follow-up actions…"
                                className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                data-testid="note-textarea"
                              />
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => { setShowNoteForm(false); setNewNote(""); }}>Cancel</Button>
                                <Button size="sm" className="h-7 text-[11px]" data-testid="button-save-note"
                                  onClick={() => {
                                    if (!newNote.trim()) { toast({ title: "Note cannot be empty" }); return; }
                                    toast({ title: "Note saved", description: "Counseling note added to profile." });
                                    setShowNoteForm(false); setNewNote("");
                                  }}>Save Note</Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Existing notes */}
                      <div className="space-y-3" data-testid="notes-list">
                        {COUNSELING_NOTES.map((note) => {
                          const isAlert = note.type === "Coordinator Alert";
                          const isExpanded = expandedNote === note.id;
                          return (
                            <div
                              key={note.id}
                              className={`border rounded-2xl overflow-hidden ${
                                isAlert
                                  ? "border-red-200 bg-gradient-to-r from-red-50 to-red-50/40"
                                  : "border-border bg-card"
                              }`}
                              data-testid={`note-${note.id}`}
                            >
                              {/* Header strip for session notes */}
                              {!isAlert && (
                                <div className="h-0.5 w-full bg-primary/40" />
                              )}
                              <div
                                className="p-4 flex items-start gap-3 cursor-pointer"
                                onClick={() => setExpandedNote(isExpanded ? null : note.id)}
                              >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isAlert ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"}`}>
                                  {isAlert ? <AlertTriangle className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                    <p className={`text-xs font-semibold ${isAlert ? "text-red-800" : "text-foreground"}`}>{note.type}</p>
                                    {isAlert && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">Alert</span>}
                                    {note.tags.map((tag) => (
                                      <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded-full border ${isAlert ? "bg-red-50 text-red-700 border-red-200" : "bg-muted text-muted-foreground border-border"}`}>{tag}</span>
                                    ))}
                                  </div>
                                  <p className={`text-[10px] ${isAlert ? "text-red-600/80" : "text-muted-foreground"}`}>{note.date} · {note.author}</p>
                                  <p className={`text-xs mt-1 line-clamp-2 ${isAlert ? "text-red-700/80" : "text-foreground/70"}`}>{note.content}</p>
                                </div>
                                <button
                                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border shrink-0 mt-0.5 transition-colors ${
                                    isAlert
                                      ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                      : "bg-muted text-muted-foreground border-border hover:border-primary hover:text-primary"
                                  }`}
                                >
                                  {isExpanded ? "Collapse" : "Expand"}
                                </button>
                              </div>
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden border-t border-border">
                                    <div className={`p-4 ${isAlert ? "bg-red-50/60" : "bg-muted/20"}`}>
                                      <p className={`text-xs leading-relaxed ${isAlert ? "text-red-800" : "text-foreground"}`}>{note.content}</p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ——— FOLLOW-UPS ——— */}
                  {activeTab === "followups" && (
                    <div className="space-y-4" data-testid="content-followups">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Flag className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">Follow-up Tasks</p>
                            <p className="text-[10px] text-muted-foreground">{FOLLOWUPS.length} tasks · {completedFollowups.size} done</p>
                          </div>
                        </div>
                        <Button size="sm" className="h-7 text-[11px] gap-1" data-testid="button-add-followup"
                          onClick={() => setShowFollowupForm((v) => !v)}>
                          <Plus className="w-3 h-3" />Add Follow-up
                        </Button>
                      </div>

                      {/* Add follow-up inline form */}
                      <AnimatePresence>
                        {showFollowupForm && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                            data-testid="add-followup-form"
                          >
                            <div className="bg-card border border-primary/30 rounded-2xl p-4 space-y-3">
                              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <Flag className="w-3.5 h-3.5 text-primary" />New Follow-up Task
                              </p>
                              <div>
                                <label className="text-[10px] text-muted-foreground font-medium block mb-1">Task description</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Send college application checklist…"
                                  className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                  value={followupTask}
                                  onChange={(e) => setFollowupTask(e.target.value)}
                                  data-testid="followup-task-input"
                                />
                              </div>
                              <div className="flex gap-3">
                                <div className="flex-1">
                                  <label className="text-[10px] text-muted-foreground font-medium block mb-1">Due date</label>
                                  <input
                                    type="date"
                                    className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={followupDate}
                                    onChange={(e) => setFollowupDate(e.target.value)}
                                    data-testid="followup-date-input"
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="text-[10px] text-muted-foreground font-medium block mb-1">Priority</label>
                                  <select
                                    className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={followupPriority}
                                    onChange={(e) => setFollowupPriority(e.target.value as "high"|"medium")}
                                    data-testid="followup-priority-select"
                                  >
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="sm" className="h-7 text-[11px]"
                                  onClick={() => { setShowFollowupForm(false); setFollowupTask(""); setFollowupDate(""); setFollowupPriority("medium"); }}>
                                  Cancel
                                </Button>
                                <Button size="sm" className="h-7 text-[11px]" data-testid="button-save-followup"
                                  onClick={() => {
                                    if (!followupTask.trim()) { toast({ title: "Task cannot be empty" }); return; }
                                    toast({ title: "Follow-up added", description: `"${followupTask}" scheduled${followupDate ? ` for ${followupDate}` : ""}.` });
                                    setShowFollowupForm(false); setFollowupTask(""); setFollowupDate(""); setFollowupPriority("medium");
                                  }}>
                                  Save Follow-up
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Timeline */}
                      <div className="relative" data-testid="followup-timeline">
                        <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-border rounded-full" />
                        <div className="space-y-3 pl-8">
                          {FOLLOWUPS.map((f) => {
                            const isDone = completedFollowups.has(f.id);
                            const isDue = f.status === "due" && !isDone;
                            return (
                              <div key={f.id} className="relative" data-testid={`followup-${f.id}`}>
                                <div className={`absolute -left-8 top-3.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  isDone ? "bg-green-500 border-green-500" :
                                  isDue  ? "bg-red-500 border-red-500" :
                                  "bg-card border-border"
                                }`}>
                                  {isDone && <Check className="w-3 h-3 text-white" />}
                                  {isDue && !isDone && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                                </div>
                                <div className={`border rounded-2xl p-3.5 transition-colors ${
                                  isDone ? "border-green-200 bg-green-50/30" :
                                  isDue  ? "border-red-200 bg-gradient-to-r from-red-50 to-red-50/40" :
                                  "border-border bg-card"
                                }`}>
                                  {isDue && (
                                    <div className="flex items-center gap-1.5 mb-2">
                                      <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">DUE TODAY</span>
                                    </div>
                                  )}
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-xs font-semibold ${isDone ? "line-through text-muted-foreground" : isDue ? "text-red-800" : "text-foreground"}`}>{f.task}</p>
                                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        <p className={`text-[10px] flex items-center gap-1 ${isDue ? "text-red-600/80" : "text-muted-foreground"}`}>
                                          <Calendar className="w-2.5 h-2.5" />{f.date}
                                        </p>
                                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                                          f.priority === "high"
                                            ? isDue ? "bg-red-100 text-red-800 border-red-300" : "bg-red-50 text-red-700 border-red-200"
                                            : "bg-amber-50 text-amber-700 border-amber-200"
                                        }`}>{f.priority}</span>
                                      </div>
                                    </div>
                                    <button
                                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
                                        isDone
                                          ? "bg-green-50 text-green-700 border-green-200"
                                          : isDue
                                          ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                                          : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                                      }`}
                                      data-testid={`button-complete-followup-${f.id}`}
                                      onClick={() => {
                                        setCompletedFollowups((prev) => {
                                          const next = new Set(prev);
                                          isDone ? next.delete(f.id) : next.add(f.id);
                                          return next;
                                        });
                                        if (!isDone) toast({ title: "Follow-up marked done", description: f.task });
                                      }}
                                    >
                                      {isDone ? <><Check className="w-3 h-3 inline mr-0.5" />Done</> : "Mark done"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ——— REFER TO SPECIALIST MODAL ——— */}
      <AnimatePresence>
        {showReferModal && (
          <>
            <motion.div
              key="refer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowReferModal(false)}
            />
            <motion.div
              key="refer-modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              data-testid="refer-modal"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Refer to Specialist</p>
                  </div>
                  <button onClick={() => setShowReferModal(false)} className="p-1 rounded-lg hover:bg-muted" data-testid="button-close-refer">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  {/* Student summary */}
                  <div className="bg-muted/40 border border-border rounded-xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">PM</div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground">Priya Mehta</p>
                      <p className="text-[10px] text-muted-foreground">Class 12-A · DPS Rohini · Age 17</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-foreground block mb-1.5">Specialist Type</label>
                    <select
                      className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      value={referSpecialty}
                      onChange={(e) => setReferSpecialty(e.target.value)}
                      data-testid="refer-specialty-select"
                    >
                      {["Clinical Psychologist", "Psychiatrist", "Child Therapist", "Career Counselor", "Learning Disability Expert", "Family Therapist"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-foreground block mb-1.5">Urgency</label>
                    <div className="flex gap-2">
                      {(["high", "medium", "low"] as const).map((u) => (
                        <button
                          key={u}
                          onClick={() => setReferUrgency(u)}
                          data-testid={`refer-urgency-${u}`}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors capitalize ${
                            referUrgency === u
                              ? u === "high"   ? "bg-red-500 text-white border-red-500"
                              : u === "medium" ? "bg-amber-500 text-white border-amber-500"
                              :                  "bg-slate-500 text-white border-slate-500"
                              : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-foreground block mb-1.5">Reason / Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Describe the reason for referral and any relevant background…"
                      className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      value={referNotes}
                      onChange={(e) => setReferNotes(e.target.value)}
                      data-testid="refer-notes-textarea"
                    />
                  </div>
                </div>

                <div className="px-5 pb-5 flex gap-2 justify-end">
                  <Button variant="outline" size="sm" className="h-8 text-xs"
                    onClick={() => { setShowReferModal(false); setReferNotes(""); }}>
                    Cancel
                  </Button>
                  <Button size="sm" className="h-8 text-xs gap-1.5" data-testid="button-submit-referral"
                    onClick={() => {
                      if (!referNotes.trim()) { toast({ title: "Please add a reason for the referral" }); return; }
                      toast({
                        title: "Referral submitted",
                        description: `Priya Mehta referred to ${referSpecialty} with ${referUrgency} urgency via Inupgro.`,
                      });
                      setShowReferModal(false); setReferNotes(""); setReferSpecialty("Clinical Psychologist"); setReferUrgency("medium");
                    }}>
                    <Send className="w-3 h-3" />Submit Referral
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ——— GENERATE REPORT MODAL ——— */}
      <AnimatePresence>
        {showReportModal && (
          <>
            <motion.div
              key="report-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowReportModal(false)}
            />
            <motion.div
              key="report-modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              data-testid="report-modal"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Student Profile Report</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">Draft Preview</span>
                    <button onClick={() => setShowReportModal(false)} className="p-1 rounded-lg hover:bg-muted" data-testid="button-close-report">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
                  {/* Report header */}
                  <div className="bg-gradient-to-r from-primary/8 to-primary/3 border border-primary/15 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">PM</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Priya Mehta</p>
                        <p className="text-[10px] text-muted-foreground">Class 12-A · DPS Rohini · CBSE</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[10px] text-muted-foreground">Report Date</p>
                        <p className="text-xs font-semibold text-foreground">28 Apr 2026</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[{ label: "Sessions", value: `${completedSessions} completed` }, { label: "RIASEC Type", value: "RI — Investigative" }, { label: "Profile Match", value: "94% — CS" }].map((s) => (
                        <div key={s.label} className="bg-white/60 rounded-lg px-2.5 py-1.5 text-center">
                          <p className="text-[9px] text-muted-foreground">{s.label}</p>
                          <p className="text-[10px] font-semibold text-foreground">{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {[
                    {
                      title: "Assessment Summary",
                      rows: [
                        ["RIASEC Type", "RI — Realistic + Investigative"],
                        ["Personality", "Introvert · Analytical"],
                        ["Top Aptitude", "Logical Reasoning (85%)"],
                        ["Learning Style", "Visual-Spatial"],
                      ],
                    },
                    {
                      title: "Career Recommendation",
                      rows: [
                        ["Target Career", "Data Scientist / ML Engineer"],
                        ["Best Pathway", "B.Tech CS → IIT / NIT (94% match)"],
                        ["Target Exams", "JEE Advanced, BITSAT"],
                        ["Timeline", "Admission Cycle 2026–27"],
                      ],
                    },
                    {
                      title: "Counseling Summary",
                      rows: [
                        ["Total Sessions", "2 completed, 1 upcoming"],
                        ["Last Session", "5 Apr 2026 — Career Guidance"],
                        ["Next Session", "27 Apr 2026 at 2:00 PM"],
                        ["Counselor", "Dr. Ananya Sharma"],
                      ],
                    },
                  ].map((section) => (
                    <div key={section.title} className="bg-muted/30 border border-border rounded-xl overflow-hidden">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 bg-muted/50 border-b border-border">{section.title}</p>
                      <div className="divide-y divide-border/60">
                        {section.rows.map(([label, value]) => (
                          <div key={label} className="flex items-center justify-between px-4 py-2 gap-4">
                            <span className="text-[10px] text-muted-foreground shrink-0">{label}</span>
                            <span className="text-[11px] font-medium text-foreground text-right">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 pb-5 pt-4 border-t border-border flex gap-2 justify-end">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setShowReportModal(false)}>
                    Close
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-print-report"
                    onClick={() => { toast({ title: "Opening print dialog…" }); window.print(); }}>
                    <Printer className="w-3.5 h-3.5" />Print
                  </Button>
                  <Button size="sm" className="h-8 text-xs gap-1.5" data-testid="button-download-report-modal"
                    onClick={() => {
                      toast({ title: "Report downloaded", description: "Priya_Mehta_Profile_Apr2026.pdf saved." });
                      setShowReportModal(false);
                    }}>
                    <Download className="w-3.5 h-3.5" />Download PDF
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
