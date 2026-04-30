import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Menu, BadgeCheck, Calendar, LayoutDashboard, Users, IndianRupee,
  BarChart2, Settings, School, ArrowLeft, Video, Phone,
  Clock, CheckCircle2, Circle, Plus, ChevronDown, ChevronUp,
  AlertTriangle, Bell, Edit3, Save, ExternalLink, User,
  Building2, BookOpen, Flag, RefreshCw,
  X, Download, Clipboard, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface AppointmentDetailScreenProps {
  mobile?: string;
}

/* ─── TYPES ─────────────────────────────────────────── */

interface AgendaItem    { id: string; text: string; done: boolean; critical: boolean; }
interface NextStepItem  { id: string; owner: "student" | "counselor"; text: string; done: boolean; }

interface SessionData {
  id: string;
  sessionNumber: number;
  totalSessions: number;
  title: string;
  date: string;
  dateObj: Date;
  time: string;
  endTime: string;
  duration: string;
  status: string;
  mode: string;
  platform: string;
  meetingLink: string;
  fee: number;
  paymentStatus: "pending" | "paid";
  createdAt: string;
  lastModified: string;
  visitContext: {
    sessionType: string;
    referredBy: string;
    reason: string;
    urgency: string;
    previousOutcome: string;
    inupgroAlert?: string;
  };
  initialAgenda: AgendaItem[];
  initialNotes: string;
  initialOutcomeSummary: string;
  initialOutcome: string;
  initialMood: string;
  initialNextSteps: NextStepItem[];
  initialReminderDate: string;
  initialReminderTime: string;
  initialReminderNote: string;
}

interface SessionWorkState {
  agenda: AgendaItem[];
  notes: string;
  editingNotes: boolean;
  notesDraft: string;
  mood: string;
  outcome: string;
  outcomeSummary: string;
  editingOutcome: boolean;
  outcomeDraft: string;
  nextSteps: NextStepItem[];
  reminderDate: string;
  reminderTime: string;
  reminderNote: string;
  reminderSaved: boolean;
  sessionStatus: string;
}

/* ─── STUDENT / COUNSELOR / SCHOOL (constant) ────────── */

const STUDENT = {
  name: "Priya Mehta",
  initials: "PM",
  class: "Class 12-A",
  age: 17,
  school: "Delhi Public School, Rohini",
  city: "Rohini, New Delhi",
  phone: "+91 98765 43210",
  email: "priya.mehta@email.com",
  urgency: "high",
  careerTrack: "Data Science",
};

const COUNSELOR = {
  name: "Dr. Ananya Sharma",
  initials: "AS",
  specialization: "Career Counseling · Mental Health",
  qualification: "PhD (Psychology), M.Ed, NCC Certified",
  phone: "+91 90000 12345",
  experience: "8 years",
};

const SCHOOL_INFO = {
  name: "Delhi Public School, Rohini",
  coordinator: "Mrs. Sunita Rao",
  coordinatorPhone: "+91 91234 56789",
  board: "CBSE",
  city: "Rohini, New Delhi",
  visitStatus: "1 of 2 visits completed",
};

/* ─── SESSION OUTCOMES / MOOD OPTIONS ───────────────── */

const SESSION_OUTCOMES = [
  "Career clarity achieved — final decision confirmed",
  "Partially resolved — needs one more session",
  "Referred to specialist / third-party support",
  "Student did not attend (No Show)",
  "Session rescheduled by student",
  "Session rescheduled by counselor",
];

const MOOD_OPTIONS = [
  { value: "positive",   label: "Positive",   color: "bg-green-50 text-green-700 border-green-200"  },
  { value: "neutral",    label: "Neutral",    color: "bg-slate-50 text-slate-600 border-slate-200"  },
  { value: "anxious",    label: "Anxious",    color: "bg-amber-50 text-amber-700 border-amber-200"  },
  { value: "distressed", label: "Distressed", color: "bg-red-50 text-red-700 border-red-200"        },
];

/* ─── MULTI-SESSION DATA ─────────────────────────────── */

const SESSIONS: SessionData[] = [
  {
    id: "s1",
    sessionNumber: 1,
    totalSessions: 4,
    title: "Initial Assessment",
    date: "15 Jan 2026",
    dateObj: new Date(2026, 0, 15),
    time: "11:00 AM",
    endTime: "12:00 PM",
    duration: "60 min",
    status: "completed",
    mode: "In-person",
    platform: "Counselor Office",
    meetingLink: "",
    fee: 1500,
    paymentStatus: "paid",
    createdAt: "10 Jan 2026",
    lastModified: "15 Jan 2026",
    visitContext: {
      sessionType: "Initial Assessment",
      referredBy: "School coordinator (Mrs. Sunita Rao)",
      reason: "Student referred for career counseling and stress management. Class 12-A student preparing for board exams with career direction uncertainty. Reported anxiety about stream selection and parental expectations.",
      urgency: "Medium",
      previousOutcome: "No prior sessions.",
      inupgroAlert: undefined,
    },
    initialAgenda: [
      { id: "s1ag1", text: "Introduction and rapport building",                           done: true,  critical: false },
      { id: "s1ag2", text: "Academic background and performance review",                  done: true,  critical: false },
      { id: "s1ag3", text: "Career interests and aspirations — initial exploration",      done: true,  critical: true  },
      { id: "s1ag4", text: "Family expectations and pressure points",                     done: true,  critical: false },
      { id: "s1ag5", text: "Goal-setting for counseling program",                         done: true,  critical: false },
    ],
    initialNotes: "First session with Priya. Student arrived on time with her mother who waited outside. Student appeared nervous initially but warmed up within the first 10 minutes.\n\nAcademic profile: 85% aggregate in Class 11. Strong in Mathematics and Computer Science, weaker in Physics. Interested in technology but confused between CS Engineering and Data Science paths.\n\nFamily dynamics: Father is an IIT graduate and expects Priya to pursue IIT. Mother is supportive of Data Science. Priya feels significant pressure.\n\nInitial assessment suggests career confusion compounded by parental pressure. Student is bright and motivated. Recommended 3-4 session program.",
    initialOutcomeSummary: "Initial rapport established. Career confusion identified. Program plan: 4 sessions covering career clarity, JEE preparation strategy, and stress management.",
    initialOutcome: "Partially resolved — needs one more session",
    initialMood: "neutral",
    initialNextSteps: [
      { id: "s1ns1", owner: "student",   text: "Complete Inupgro career interest assessment form",         done: true  },
      { id: "s1ns2", owner: "counselor", text: "Research top Data Science programs in India and send list", done: true  },
      { id: "s1ns3", owner: "student",   text: "Discuss career options with parents before next session",   done: true  },
    ],
    initialReminderDate: "2026-02-01",
    initialReminderTime: "09:00",
    initialReminderNote: "Pre-session check: review career assessment form submitted by Priya.",
  },
  {
    id: "s2",
    sessionNumber: 2,
    totalSessions: 4,
    title: "Career Guidance",
    date: "5 Apr 2026",
    dateObj: new Date(2026, 3, 5),
    time: "2:00 PM",
    endTime: "3:00 PM",
    duration: "60 min",
    status: "completed",
    mode: "Video Call",
    platform: "Google Meet",
    meetingLink: "meet.google.com/xyz-mnop-qrs",
    fee: 1500,
    paymentStatus: "paid",
    createdAt: "20 Mar 2026",
    lastModified: "5 Apr 2026",
    visitContext: {
      sessionType: "Career Guidance",
      referredBy: "Student self-referral (continued program)",
      reason: "Follow-up on career direction post-assessment. Review Data Science vs CS Engineering options. Discuss JEE vs CUET strategy based on assessment results. Address parental pressure update.",
      urgency: "Medium",
      previousOutcome: "Session 1 (15 Jan): Initial rapport. Career assessment sent. Data Science interest noted but not confirmed.",
      inupgroAlert: undefined,
    },
    initialAgenda: [
      { id: "s2ag1", text: "Review Inupgro career assessment results",                     done: true,  critical: true  },
      { id: "s2ag2", text: "Deep-dive: Data Science vs CS Engineering career paths",       done: true,  critical: true  },
      { id: "s2ag3", text: "JEE vs CUET strategy — which exams to focus on",               done: true,  critical: false },
      { id: "s2ag4", text: "Top college shortlist: BITS Pilani, NIT Trichy, Delhi colleges",done: true,  critical: false },
      { id: "s2ag5", text: "Parental conversation progress check",                         done: true,  critical: false },
    ],
    initialNotes: "Student arrived composed. Parental situation has improved slightly — father has agreed to consider Data Science if Priya gets into BITS Pilani.\n\nCareer assessment review: Strong aptitude for data analysis and statistics. Programming skills intermediate. Clear interest in ML applications.\n\nDecision progress: Priya is leaning towards Data Science but not fully committed — still worried about JEE performance and parental reaction if she doesn't crack IIT.\n\nShortlisted: BITS Pilani (CS + DS dual degree), NIT Trichy (Data Science), IIIT Hyderabad (Data Science), and Delhi University (CS). Sent college brochures.",
    initialOutcomeSummary: "Career direction narrowing towards Data Science. College shortlist finalised. JEE Mains strategy discussed — priority is BITS Pilani score. Parental pressure ongoing but improving.",
    initialOutcome: "Partially resolved — needs one more session",
    initialMood: "anxious",
    initialNextSteps: [
      { id: "s2ns1", owner: "student",   text: "Attempt 1 full JEE Mains mock test and share results",    done: true  },
      { id: "s2ns2", owner: "counselor", text: "Send BITS Pilani CS + DS admission brochure and checklist",done: true  },
      { id: "s2ns3", owner: "student",   text: "Speak to parents about Data Science decision update",      done: false },
    ],
    initialReminderDate: "2026-04-20",
    initialReminderTime: "10:00",
    initialReminderNote: "Pre-session: check if Priya completed mock test and spoke to parents.",
  },
  {
    id: "s3",
    sessionNumber: 3,
    totalSessions: 4,
    title: "Follow-up + Stress Check",
    date: "27 Apr 2026",
    dateObj: new Date(2026, 3, 27),
    time: "2:00 PM",
    endTime: "2:45 PM",
    duration: "45 min",
    status: "upcoming",
    mode: "Video Call",
    platform: "Google Meet",
    meetingLink: "meet.google.com/abc-defg-hij",
    fee: 1500,
    paymentStatus: "pending",
    createdAt: "8 Apr 2026",
    lastModified: "26 Apr 2026",
    visitContext: {
      sessionType: "Follow-up Counseling",
      referredBy: "Student self-referral via Inupgro",
      reason: "Career confusion (CS vs Data Science) + follow-up on 3-day unexplained school absence flagged by school coordinator on 20 Apr 2026. Student disclosed stress at home regarding JEE preparation and parental pressure.",
      urgency: "High",
      previousOutcome: "Session 2 (5 Apr): Leaning towards Data Science. Parental pressure ongoing. Shortlist of BITS Pilani + NIT Trichy sent.",
      inupgroAlert: "Coordinator alert: 3-day absence 17–19 Apr 2026. Student appeared distressed on return.",
    },
    initialAgenda: [
      { id: "s3ag1", text: "Check-in — emotional state after recent school absence",      done: false, critical: true  },
      { id: "s3ag2", text: "Review JEE Mains mock test results and preparation progress", done: false, critical: false },
      { id: "s3ag3", text: "Final career clarity discussion: CS vs Data Science",         done: false, critical: true  },
      { id: "s3ag4", text: "Discuss BITS Pilani CS + Data Science dual-degree pathway",   done: false, critical: false },
      { id: "s3ag5", text: "Plan next session agenda and confirm follow-up tasks",        done: false, critical: false },
    ],
    initialNotes: "Student arrived on time. Appeared subdued compared to Session 2 — attributed to stress around board exam preparation and ongoing parental pressure about IIT admission.\n\nDiscussed the 3-day absence: student confirmed it was due to anxiety and feeling overwhelmed. No self-harm ideation — ruled out. Emotional state is anxious but functional.\n\nCareer discussion: Priya has now clearly chosen Data Science as her primary goal. Relieved to have made the decision. BITS Pilani DS dual-degree discussed at length — student is very interested.",
    initialOutcomeSummary: "Session productive. Career clarity achieved — student has confirmed Data Science as final career goal. Emotional state stable after check-in. JEE prep concerns addressed with structured study plan.",
    initialOutcome: "",
    initialMood: "anxious",
    initialNextSteps: [
      { id: "s3ns1", owner: "student",   text: "Register for JEE Mains Session 2 before 10 May 2026",       done: false },
      { id: "s3ns2", owner: "counselor", text: "Send BITS Pilani CS + DS admission brochure and checklist",  done: false },
      { id: "s3ns3", owner: "counselor", text: "Share stress management resource sheet with student",        done: false },
      { id: "s3ns4", owner: "student",   text: "Attempt 2 full-length JEE Mains mock tests before next session", done: false },
    ],
    initialReminderDate: "2026-05-03",
    initialReminderTime: "10:00",
    initialReminderNote: "Pre-session check-in: confirm JEE Mains registration and mock test scores before Session 4.",
  },
  {
    id: "s4",
    sessionNumber: 4,
    totalSessions: 4,
    title: "College Strategy Session",
    date: "15 May 2026",
    dateObj: new Date(2026, 4, 15),
    time: "11:00 AM",
    endTime: "12:00 PM",
    duration: "60 min",
    status: "scheduled",
    mode: "In-person",
    platform: "Counselor Office",
    meetingLink: "",
    fee: 1500,
    paymentStatus: "pending",
    createdAt: "27 Apr 2026",
    lastModified: "27 Apr 2026",
    visitContext: {
      sessionType: "College Strategy",
      referredBy: "Program continuation",
      reason: "Final session: confirm Data Science career decision, build application strategy for BITS Pilani + NIT Trichy, review JEE Mains results and determine next steps for college admissions.",
      urgency: "Medium",
      previousOutcome: "Session 3 (27 Apr): Career clarity expected. Stress management discussed. JEE prep ongoing.",
      inupgroAlert: undefined,
    },
    initialAgenda: [
      { id: "s4ag1", text: "Review JEE Mains Session 2 results",                          done: false, critical: true  },
      { id: "s4ag2", text: "Finalise college application shortlist and priorities",        done: false, critical: true  },
      { id: "s4ag3", text: "BITS Pilani application strategy and deadlines",               done: false, critical: false },
      { id: "s4ag4", text: "Build post-session action plan for admissions",                done: false, critical: false },
    ],
    initialNotes: "",
    initialOutcomeSummary: "",
    initialOutcome: "",
    initialMood: "neutral",
    initialNextSteps: [
      { id: "s4ns1", owner: "student",   text: "Submit BITS Pilani application by deadline",                done: false },
      { id: "s4ns2", owner: "counselor", text: "Provide written career recommendation letter for applications", done: false },
    ],
    initialReminderDate: "2026-05-13",
    initialReminderTime: "09:00",
    initialReminderNote: "Pre-session: confirm JEE results and application status.",
  },
];

/* Sort sessions chronologically */
const SORTED_SESSIONS = [...SESSIONS].sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

/* Build initial work-state map */
function buildInitialWorkState(): Record<string, SessionWorkState> {
  const map: Record<string, SessionWorkState> = {};
  SESSIONS.forEach((s) => {
    map[s.id] = {
      agenda:         [...s.initialAgenda],
      notes:          s.initialNotes,
      editingNotes:   false,
      notesDraft:     s.initialNotes,
      mood:           s.initialMood,
      outcome:        s.initialOutcome,
      outcomeSummary: s.initialOutcomeSummary,
      editingOutcome: false,
      outcomeDraft:   s.initialOutcomeSummary,
      nextSteps:      [...s.initialNextSteps],
      reminderDate:   s.initialReminderDate,
      reminderTime:   s.initialReminderTime,
      reminderNote:   s.initialReminderNote,
      reminderSaved:  false,
      sessionStatus:  s.status,
    };
  });
  return map;
}

/* ─── NAV ───────────────────────────────────────────── */

const NAV_ITEMS = [
  { id: "dashboard",    path: "/dashboard",   icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: "Dashboard"    },
  { id: "students",     path: "/requests",    icon: <Users           className="w-4.5 h-4.5" />, label: "Students"     },
  { id: "appointments", path: "/appointment", icon: <Calendar        className="w-4.5 h-4.5" />, label: "Appointments" },
  { id: "schools",      path: "/visits",      icon: <School          className="w-4.5 h-4.5" />, label: "Schools"      },
  { id: "revenue",      path: "/revenue",     icon: <IndianRupee     className="w-4.5 h-4.5" />, label: "Revenue"      },
  { id: "reports",      path: "/analytics",   icon: <BarChart2       className="w-4.5 h-4.5" />, label: "Reports"      },
  { id: "settings",     path: "/settings",    icon: <Settings        className="w-4.5 h-4.5" />, label: "Settings"     },
];

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  upcoming:    { label: "Upcoming",   bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
  in_progress: { label: "In Progress",bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
  completed:   { label: "Completed",  bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  dot: "bg-green-500"  },
  no_show:     { label: "No Show",    bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500"    },
  scheduled:   { label: "Scheduled",  bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
};

function formatShortDate(d: Date): string {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

/* ─── COMPONENT ─────────────────────────────────────── */

export default function AppointmentDetailScreen({ mobile = "9876543210" }: AppointmentDetailScreenProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* Default to most recent upcoming/in-progress session, else last session */
  const defaultSessionId = useMemo(() => {
    const upcomingOrInProgress = SORTED_SESSIONS.find(
      (s) => s.status === "upcoming" || s.status === "in_progress"
    );
    return upcomingOrInProgress?.id ?? SORTED_SESSIONS[SORTED_SESSIONS.length - 1].id;
  }, []);

  const [selectedSessionId, setSelectedSessionId] = useState<string>(defaultSessionId);
  const [workState, setWorkState] = useState<Record<string, SessionWorkState>>(buildInitialWorkState);

  /* Transient UI state (not per-session) */
  const [newAgendaItem, setNewAgendaItem]   = useState("");
  const [showAgendaInput, setShowAgendaInput] = useState(false);
  const [newStepText, setNewStepText]       = useState("");
  const [newStepOwner, setNewStepOwner]     = useState<"student" | "counselor">("counselor");
  const [showNextStepInput, setShowNextStepInput] = useState(false);

  /* Current session shortcuts */
  const session  = SORTED_SESSIONS.find((s) => s.id === selectedSessionId)!;
  const ws       = workState[selectedSessionId];

  const updateWS = (update: Partial<SessionWorkState>) => {
    setWorkState((prev) => ({ ...prev, [selectedSessionId]: { ...prev[selectedSessionId], ...update } }));
  };

  const completedAgendaItems = ws.agenda.filter((a) => a.done).length;
  const completedNextSteps   = ws.nextSteps.filter((s) => s.done).length;

  const sc = STATUS_CFG[ws.sessionStatus] ?? STATUS_CFG.scheduled;

  /* Session switch — reset transient UI */
  const handleSelectSession = (id: string) => {
    setSelectedSessionId(id);
    setShowAgendaInput(false);
    setShowNextStepInput(false);
    setNewAgendaItem("");
    setNewStepText("");
  };

  const handleAddAgendaItem = () => {
    if (!newAgendaItem.trim()) return;
    updateWS({ agenda: [...ws.agenda, { id: `ag${Date.now()}`, text: newAgendaItem.trim(), done: false, critical: false }] });
    setNewAgendaItem("");
    setShowAgendaInput(false);
  };

  const handleAddNextStep = () => {
    if (!newStepText.trim()) return;
    updateWS({ nextSteps: [...ws.nextSteps, { id: `ns${Date.now()}`, owner: newStepOwner, text: newStepText.trim(), done: false }] });
    setNewStepText("");
    setShowNextStepInput(false);
  };

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
            data-testid="appt-sidebar"
          >
            <div className="h-16 px-5 flex items-center gap-3 border-b border-border shrink-0">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base font-serif font-semibold text-foreground whitespace-nowrap">MindBridge</span>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              <p className="text-[10px] font-medium text-muted-foreground px-3 mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />Main Menu
              </p>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left whitespace-nowrap ${
                    item.id === "appointments"
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
        <header className="h-16 bg-card/95 backdrop-blur border-b border-border flex items-center gap-3 px-4 sm:px-6 shrink-0" data-testid="appt-header">
          <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-toggle-sidebar">
            <Menu className="w-4.5 h-4.5" />
          </button>
          <button onClick={() => navigate("/appointment")} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-back">
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground truncate">{session.title}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>{sc.label}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Session {session.sessionNumber} of {session.totalSessions} · {STUDENT.name} · {session.date} at {session.time}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {ws.sessionStatus === "upcoming" && (
              <Button size="sm" className="h-8 text-xs gap-1.5" data-testid="button-start-session"
                onClick={() => { updateWS({ sessionStatus: "in_progress" }); toast({ title: "Session started", description: "Timer running." }); }}>
                <Video className="w-3.5 h-3.5" />Start Session
              </Button>
            )}
            {ws.sessionStatus === "in_progress" && (
              <Button size="sm" className="h-8 text-xs gap-1.5" data-testid="button-complete-session"
                onClick={() => { updateWS({ sessionStatus: "completed" }); toast({ title: "Session completed", description: "Notes and outcome have been saved." }); }}>
                <CheckCircle2 className="w-3.5 h-3.5" />Complete Session
              </Button>
            )}
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-reschedule"
              onClick={() => toast({ title: "Reschedule requested", description: "Opening reschedule flow." })}>
              <RefreshCw className="w-3.5 h-3.5" /><span className="hidden sm:inline">Reschedule</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-export-notes"
              onClick={() => toast({ title: "Exporting notes", description: "Session notes PDF being prepared." })}>
              <Download className="w-3.5 h-3.5" /><span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </header>

        {/* Two-column layout */}
        <div className="flex-1 overflow-hidden flex" data-testid="appt-layout">

          {/* LEFT — metadata column */}
          <div className="w-72 xl:w-80 border-r border-border overflow-y-auto shrink-0 bg-card/20" data-testid="appt-info-column">
            <div className="p-4 space-y-4">

              {/* ── SESSION LIST (date-sorted) — top of left panel ── */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="session-list-card">
                <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-muted/30">
                  <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    All Sessions · {SORTED_SESSIONS.length} total
                  </p>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full shrink-0">
                    Session {session.sessionNumber} of {SORTED_SESSIONS.length}
                  </span>
                </div>
                <div className="divide-y divide-border max-h-52 overflow-y-auto" data-testid="session-list">
                  {SORTED_SESSIONS.map((s) => {
                    const cfg     = STATUS_CFG[workState[s.id].sessionStatus] ?? STATUS_CFG.scheduled;
                    const isSelected = s.id === selectedSessionId;
                    return (
                      <button
                        key={s.id}
                        className={`w-full text-left px-3 py-2.5 transition-all ${
                          isSelected
                            ? "bg-primary/8 border-l-2 border-primary"
                            : "hover:bg-muted/50 border-l-2 border-transparent"
                        }`}
                        onClick={() => handleSelectSession(s.id)}
                        data-testid={`session-list-item-${s.id}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 justify-between">
                              <p className={`text-[11px] font-semibold truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
                                {s.title}
                              </p>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                {cfg.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-muted-foreground">{formatShortDate(s.dateObj)}</span>
                              <span className="text-[9px] font-semibold text-muted-foreground/60 bg-muted px-1 rounded">S{s.sessionNumber}</span>
                              <span className="text-[10px] text-muted-foreground">{s.time}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Student summary (constant) */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="student-info-card">
                <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-muted/30">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0" />Student
                  </p>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">{STUDENT.initials}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{STUDENT.name}</p>
                      <p className="text-[10px] text-muted-foreground">{STUDENT.class} · Age {STUDENT.age}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <InfoRow label="School"        value={STUDENT.school}       />
                    <InfoRow label="City"          value={STUDENT.city}         />
                    <InfoRow label="Career track"  value={STUDENT.careerTrack}  highlight />
                    <InfoRow label="Urgency"       value={STUDENT.urgency.charAt(0).toUpperCase() + STUDENT.urgency.slice(1)} />
                    <InfoRow label="Total sessions" value={`${SORTED_SESSIONS.length} sessions`} />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <a href={`tel:${STUDENT.phone}`} className="flex-1 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg py-1.5 transition-colors">
                      <Phone className="w-3 h-3" />{STUDENT.phone}
                    </a>
                  </div>
                  <button
                    className="w-full mt-2 flex items-center justify-center gap-1.5 text-[10px] text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-lg py-1.5 transition-colors"
                    data-testid="button-view-student-profile"
                    onClick={() => navigate("/student")}
                  >
                    <ChevronRight className="w-3 h-3" />View Full Profile
                  </button>
                </div>
              </div>

              {/* ── SESSION DETAILS (per selected session) ── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSessionId}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                  data-testid="session-info-card"
                >
                  <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-muted/30">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0" />Session Details
                    </p>
                  </div>
                  <div className="p-4 space-y-2">
                    <InfoRow label="Session #"  value={`${session.sessionNumber} of ${session.totalSessions}`} />
                    <InfoRow label="Date"       value={session.date}                            highlight />
                    <InfoRow label="Time"       value={`${session.time} – ${session.endTime}`} highlight />
                    <InfoRow label="Duration"   value={session.duration}   />
                    <InfoRow label="Mode"       value={session.mode}       />
                    <InfoRow label="Platform"   value={session.platform}   />
                    <InfoRow label="Fee"        value={`₹${session.fee.toLocaleString()}`} />
                    <InfoRow label="Payment"    value={session.paymentStatus === "pending" ? "Pending" : "Paid"} />
                    {session.meetingLink && (
                      <div className="pt-1">
                        <p className="text-[10px] text-muted-foreground mb-1">Meeting link</p>
                        <a
                          href={`https://${session.meetingLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] text-primary font-medium hover:underline"
                          data-testid="meeting-link"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          {session.meetingLink}
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Visit context (per selected session) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`ctx-${selectedSessionId}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                  data-testid="visit-context-card"
                >
                  <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-muted/30">
                    <Clipboard className="w-3.5 h-3.5 text-primary" />
                    <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0" />Session Context
                    </p>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <InfoRow label="Session type" value={session.visitContext.sessionType} />
                    <InfoRow label="Referred by"  value={session.visitContext.referredBy}  />
                    <InfoRow label="Urgency"      value={session.visitContext.urgency}     highlight />
                    <div className="pt-1">
                      <p className="text-[10px] text-muted-foreground mb-1">Reason for session</p>
                      <p className="text-[11px] text-foreground leading-relaxed">{session.visitContext.reason}</p>
                    </div>
                    {session.visitContext.previousOutcome && (
                      <div className="pt-1">
                        <p className="text-[10px] text-muted-foreground mb-1">Previous session outcome</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{session.visitContext.previousOutcome}</p>
                      </div>
                    )}
                    {session.visitContext.inupgroAlert && (
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-800 leading-relaxed">{session.visitContext.inupgroAlert}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Counselor (constant) */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="counselor-info-card">
                <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-muted/30">
                  <BadgeCheck className="w-3.5 h-3.5 text-primary" />
                  <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0" />Counselor
                  </p>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">{COUNSELOR.initials}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{COUNSELOR.name}</p>
                      <p className="text-[10px] text-muted-foreground">{COUNSELOR.experience} experience</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <InfoRow label="Specialization" value={COUNSELOR.specialization} />
                    <InfoRow label="Qualification"  value={COUNSELOR.qualification}  />
                    <InfoRow label="Phone"          value={COUNSELOR.phone}          />
                  </div>
                </div>
              </div>

              {/* School (constant) */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="school-info-card">
                <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-muted/30">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0" />School
                  </p>
                </div>
                <div className="p-4 space-y-1.5">
                  <InfoRow label="School"       value={SCHOOL_INFO.name}             highlight />
                  <InfoRow label="Board"        value={SCHOOL_INFO.board}            />
                  <InfoRow label="City"         value={SCHOOL_INFO.city}             />
                  <InfoRow label="Coordinator"  value={SCHOOL_INFO.coordinator}      />
                  <InfoRow label="Contact"      value={SCHOOL_INFO.coordinatorPhone} />
                  <InfoRow label="Visit status" value={SCHOOL_INFO.visitStatus}      />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — working document (all per selected session) */}
          <div className="flex-1 min-w-0 overflow-y-auto" data-testid="appt-working-area">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSessionId}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5"
              >

                {/* ── AGENDA ── */}
                <WorkSection
                  testid="section-agenda"
                  icon={<BookOpen className="w-4 h-4" />}
                  title="Session Agenda"
                  badge={`${completedAgendaItems}/${ws.agenda.length} done`}
                  badgeColor={completedAgendaItems === ws.agenda.length && ws.agenda.length > 0 ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}
                >
                  <div className="space-y-2" data-testid="agenda-list">
                    {ws.agenda.length === 0 && (
                      <p className="text-xs text-muted-foreground py-2">No agenda items yet — add one below.</p>
                    )}
                    {ws.agenda.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${item.done ? "bg-primary/5 border-primary/20" : "bg-background border-border"}`}
                        data-testid={`agenda-item-${item.id}`}
                      >
                        <button
                          className="shrink-0 mt-0.5"
                          data-testid={`button-toggle-agenda-${item.id}`}
                          onClick={() => updateWS({ agenda: ws.agenda.map((a) => a.id === item.id ? { ...a, done: !a.done } : a) })}
                        >
                          {item.done
                            ? <CheckCircle2 className="w-4.5 h-4.5 text-primary" />
                            : <Circle className="w-4.5 h-4.5 text-border" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.text}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {item.critical && !item.done && (
                            <span className="text-[9px] font-semibold bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full">Priority</span>
                          )}
                          <button
                            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-600 transition-colors"
                            data-testid={`button-remove-agenda-${item.id}`}
                            onClick={() => updateWS({ agenda: ws.agenda.filter((a) => a.id !== item.id) })}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {showAgendaInput && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add agenda item…"
                            className="flex-1 h-8 px-3 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                            value={newAgendaItem}
                            onChange={(e) => setNewAgendaItem(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddAgendaItem()}
                            data-testid="input-new-agenda"
                            autoFocus
                          />
                          <Button size="sm" className="h-8 text-[11px]" data-testid="button-save-agenda-item" onClick={handleAddAgendaItem}>Add</Button>
                          <Button variant="ghost" size="sm" className="h-8 text-[11px]" onClick={() => { setShowAgendaInput(false); setNewAgendaItem(""); }}>Cancel</Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!showAgendaInput && (
                    <button
                      className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                      data-testid="button-add-agenda-item"
                      onClick={() => setShowAgendaInput(true)}
                    >
                      <Plus className="w-3.5 h-3.5" />Add agenda item
                    </button>
                  )}
                </WorkSection>

                {/* ── STUDENT MOOD ── */}
                <WorkSection
                  testid="section-mood"
                  icon={<ActivityIcon />}
                  title="Student Mood at Session Start"
                >
                  <div className="flex gap-2 flex-wrap" data-testid="mood-selector">
                    {MOOD_OPTIONS.map((m) => (
                      <button
                        key={m.value}
                        className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all ${ws.mood === m.value ? m.color + " ring-2 ring-offset-1 ring-current/30" : "bg-background border-border text-muted-foreground hover:border-primary/40"}`}
                        data-testid={`button-mood-${m.value}`}
                        onClick={() => updateWS({ mood: m.value })}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {ws.mood === "positive"   && "Student appeared engaged and calm — good session conditions."}
                    {ws.mood === "neutral"    && "Student appeared composed with no visible emotional distress."}
                    {ws.mood === "anxious"    && "Student showed visible anxiety — proceed with check-in and grounding techniques before main agenda."}
                    {ws.mood === "distressed" && "Student appeared significantly distressed — prioritise emotional support. Consider deferring agenda items."}
                  </p>
                </WorkSection>

                {/* ── COUNSELING NOTES ── */}
                <WorkSection
                  testid="section-notes"
                  icon={<Edit3 className="w-4 h-4" />}
                  title="Counseling Notes"
                  action={
                    ws.editingNotes
                      ? undefined
                      : <button className="text-[10px] text-primary flex items-center gap-1 hover:underline" data-testid="button-edit-notes" onClick={() => updateWS({ notesDraft: ws.notes, editingNotes: true })}>
                          <Edit3 className="w-3 h-3" />Edit
                        </button>
                  }
                >
                  {ws.editingNotes ? (
                    <div data-testid="notes-editor">
                      <textarea
                        rows={8}
                        className="w-full px-3 py-2.5 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none leading-relaxed"
                        value={ws.notesDraft}
                        onChange={(e) => updateWS({ notesDraft: e.target.value })}
                        data-testid="textarea-notes"
                      />
                      <div className="flex gap-2 mt-2 justify-end">
                        <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => updateWS({ editingNotes: false })}>Cancel</Button>
                        <Button size="sm" className="h-7 text-[11px] gap-1" data-testid="button-save-notes"
                          onClick={() => { updateWS({ notes: ws.notesDraft, editingNotes: false }); toast({ title: "Notes saved", description: "Counseling notes updated." }); }}>
                          <Save className="w-3 h-3" />Save Notes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap" data-testid="notes-display">
                      {ws.notes || <span className="text-muted-foreground italic">No notes yet — click Edit to add notes for this session.</span>}
                    </p>
                  )}
                </WorkSection>

                {/* ── OUTCOME ── */}
                <WorkSection
                  testid="section-outcome"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  title="Session Outcome"
                  action={
                    ws.editingOutcome
                      ? undefined
                      : <button className="text-[10px] text-primary flex items-center gap-1 hover:underline" data-testid="button-edit-outcome" onClick={() => updateWS({ outcomeDraft: ws.outcomeSummary, editingOutcome: true })}>
                          <Edit3 className="w-3 h-3" />Edit
                        </button>
                  }
                >
                  <div className="space-y-3">
                    <div data-testid="outcome-selector">
                      <p className="text-[10px] text-muted-foreground mb-1.5">Outcome type</p>
                      <select
                        className="w-full h-8 px-2 text-xs border border-border rounded-xl bg-background focus:outline-none cursor-pointer"
                        value={ws.outcome}
                        onChange={(e) => updateWS({ outcome: e.target.value })}
                        data-testid="select-outcome"
                      >
                        <option value="">Select outcome…</option>
                        {SESSION_OUTCOMES.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1.5">Outcome summary</p>
                      {ws.editingOutcome ? (
                        <div data-testid="outcome-editor">
                          <textarea
                            rows={4}
                            className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            value={ws.outcomeDraft}
                            onChange={(e) => updateWS({ outcomeDraft: e.target.value })}
                            data-testid="textarea-outcome"
                          />
                          <div className="flex gap-2 mt-2 justify-end">
                            <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => updateWS({ editingOutcome: false })}>Cancel</Button>
                            <Button size="sm" className="h-7 text-[11px] gap-1" data-testid="button-save-outcome"
                              onClick={() => { updateWS({ outcomeSummary: ws.outcomeDraft, editingOutcome: false }); toast({ title: "Outcome saved", description: "Session outcome updated." }); }}>
                              <Save className="w-3 h-3" />Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-foreground leading-relaxed" data-testid="outcome-display">
                          {ws.outcomeSummary || <span className="text-muted-foreground italic">No outcome recorded yet.</span>}
                        </p>
                      )}
                    </div>
                  </div>
                </WorkSection>

                {/* ── NEXT STEPS ── */}
                <WorkSection
                  testid="section-next-steps"
                  icon={<Flag className="w-4 h-4" />}
                  title="Next Steps"
                  badge={`${completedNextSteps}/${ws.nextSteps.length} done`}
                  badgeColor={completedNextSteps === ws.nextSteps.length && ws.nextSteps.length > 0 ? "bg-green-50 text-green-700 border-green-200" : "bg-muted text-muted-foreground border-border"}
                >
                  <div className="space-y-2" data-testid="next-steps-list">
                    {ws.nextSteps.length === 0 && (
                      <p className="text-xs text-muted-foreground py-2">No next steps yet.</p>
                    )}
                    {ws.nextSteps.map((step) => (
                      <motion.div
                        key={step.id}
                        layout
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${step.done ? "bg-green-50/30 border-green-200" : "bg-background border-border"}`}
                        data-testid={`next-step-${step.id}`}
                      >
                        <button
                          className="shrink-0 mt-0.5"
                          data-testid={`button-toggle-step-${step.id}`}
                          onClick={() => updateWS({ nextSteps: ws.nextSteps.map((s) => s.id === step.id ? { ...s, done: !s.done } : s) })}
                        >
                          {step.done
                            ? <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />
                            : <Circle className="w-4.5 h-4.5 text-border" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${step.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{step.text}</p>
                          <span className={`text-[9px] font-semibold mt-0.5 inline-block px-1.5 py-0.5 rounded-full border ${step.owner === "counselor" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}`}>
                            {step.owner === "counselor" ? "Counselor" : "Student"}
                          </span>
                        </div>
                        <button
                          className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-600 transition-colors shrink-0"
                          data-testid={`button-remove-step-${step.id}`}
                          onClick={() => updateWS({ nextSteps: ws.nextSteps.filter((s) => s.id !== step.id) })}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {showNextStepInput && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-2">
                        <div className="space-y-2 p-3 bg-muted/30 rounded-xl border border-border">
                          <input
                            type="text"
                            placeholder="Describe the next step…"
                            className="w-full h-8 px-3 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                            value={newStepText}
                            onChange={(e) => setNewStepText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddNextStep()}
                            data-testid="input-new-step"
                            autoFocus
                          />
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] text-muted-foreground">Assigned to:</p>
                            <button
                              className={`text-[10px] px-2 py-0.5 rounded-full border ${newStepOwner === "counselor" ? "bg-primary/10 text-primary border-primary/20" : "bg-background border-border text-muted-foreground"}`}
                              data-testid="button-owner-counselor"
                              onClick={() => setNewStepOwner("counselor")}
                            >Counselor</button>
                            <button
                              className={`text-[10px] px-2 py-0.5 rounded-full border ${newStepOwner === "student" ? "bg-primary/10 text-primary border-primary/20" : "bg-background border-border text-muted-foreground"}`}
                              data-testid="button-owner-student"
                              onClick={() => setNewStepOwner("student")}
                            >Student</button>
                            <div className="ml-auto flex gap-2">
                              <Button size="sm" className="h-7 text-[11px]" data-testid="button-save-step" onClick={handleAddNextStep}>Add</Button>
                              <Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={() => { setShowNextStepInput(false); setNewStepText(""); }}>Cancel</Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!showNextStepInput && (
                    <button
                      className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                      data-testid="button-add-next-step"
                      onClick={() => setShowNextStepInput(true)}
                    >
                      <Plus className="w-3.5 h-3.5" />Add next step
                    </button>
                  )}
                </WorkSection>

                {/* ── FOLLOW-UP REMINDER ── */}
                <WorkSection
                  testid="section-followup"
                  icon={<Bell className="w-4 h-4" />}
                  title="Follow-up Reminder"
                  badge={ws.reminderSaved ? "Reminder set" : undefined}
                  badgeColor="bg-green-50 text-green-700 border-green-200"
                >
                  <div className="space-y-3" data-testid="followup-reminder-form">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-1">Reminder date *</label>
                        <input
                          type="date"
                          className="w-full h-8 px-2.5 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                          value={ws.reminderDate}
                          onChange={(e) => updateWS({ reminderDate: e.target.value, reminderSaved: false })}
                          data-testid="input-reminder-date"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-1">Reminder time *</label>
                        <input
                          type="time"
                          className="w-full h-8 px-2.5 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                          value={ws.reminderTime}
                          onChange={(e) => updateWS({ reminderTime: e.target.value, reminderSaved: false })}
                          data-testid="input-reminder-time"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-1">Reminder note</label>
                      <textarea
                        rows={2}
                        className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                        value={ws.reminderNote}
                        onChange={(e) => updateWS({ reminderNote: e.target.value, reminderSaved: false })}
                        data-testid="textarea-reminder-note"
                      />
                    </div>
                    {ws.reminderSaved && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-green-50 border border-green-200"
                        data-testid="reminder-saved-indicator"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        <p className="text-xs text-green-700 font-medium">Reminder set for {ws.reminderDate} at {ws.reminderTime}</p>
                      </motion.div>
                    )}
                    <Button size="sm" className="h-8 text-xs gap-1.5 w-full" data-testid="button-save-reminder"
                      onClick={() => {
                        if (!ws.reminderDate || !ws.reminderTime) { toast({ title: "Date and time required" }); return; }
                        updateWS({ reminderSaved: true });
                        toast({ title: "Reminder saved", description: `Follow-up scheduled for ${ws.reminderDate} at ${ws.reminderTime}.` });
                      }}>
                      <Bell className="w-3.5 h-3.5" />Set Reminder
                    </Button>
                  </div>
                </WorkSection>

                {/* ── STATUS FOOTER ── */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pb-2" data-testid="appt-footer">
                  <p>Session record · Created {session.createdAt} · Last modified {session.lastModified}</p>
                  <p className="flex items-center gap-1"><RefreshCw className="w-2.5 h-2.5" />Synced with Inupgro</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── HELPERS ─────────────────────────────────────── */

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2 py-1 border-b border-border/40 last:border-0">
      <span className="text-[10px] text-muted-foreground shrink-0">{label}</span>
      <span className={`text-[11px] font-medium text-right leading-snug ${highlight ? "text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function WorkSection({
  testid, icon, title, badge, badgeColor, action, children,
}: {
  testid: string;
  icon: React.ReactNode;
  title: string;
  badge?: string;
  badgeColor?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid={testid}>
      <div className="px-4 py-3 border-b border-border flex items-center gap-2 bg-muted/20">
        <span className="text-primary">{icon}</span>
        <p className="text-xs font-semibold text-foreground flex-1">{title}</p>
        {badge && <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>{badge}</span>}
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
