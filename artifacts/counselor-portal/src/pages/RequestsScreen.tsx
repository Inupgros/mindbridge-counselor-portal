import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Menu, BadgeCheck, Calendar, CheckCircle2, XCircle,
  Clock, AlertTriangle, User, School, ChevronDown, ChevronUp,
  Search, Filter, LayoutDashboard, Users, IndianRupee, BarChart2,
  Settings, Zap, MessageCircle, BookOpen, Brain, ArrowRight,
  Info, RefreshCw, Inbox, Check, X, Tag, Building2,
  GraduationCap, Star, Sparkles, ListFilter, SortAsc,
  ChevronRight, Phone, Mail, FileText, Clipboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface RequestsScreenProps {
  mobile?: string;
}

type RequestStatus = "new" | "pending" | "approved" | "denied";
type Urgency = "critical" | "high" | "medium" | "low";
type ServiceType =
  | "Individual Counseling"
  | "Group Counseling"
  | "Career Guidance"
  | "Crisis Support"
  | "Academic Support"
  | "Conflict Resolution"
  | "Trauma Support"
  | "Stress Management"
  | "Mental Health Assessment";

interface CounselingRequest {
  id: string;
  studentName: string;
  studentClass: string;
  studentAge: number;
  school: string;
  schoolId: string;
  reason: string;
  service: ServiceType;
  urgency: Urgency;
  status: RequestStatus;
  referredBy: string;
  referralSource: string;
  submittedAt: string;
  submittedDaysAgo: number;
  notes?: string;
  previousSessions?: number;
  approvedAt?: string;
  deniedAt?: string;
  denialReason?: string;
  scheduledAt?: string;
  smartFlag?: string;
}

const INITIAL_REQUESTS: CounselingRequest[] = [
  {
    id: "req1",
    studentName: "Rahul Sharma",
    studentClass: "Class 10-B",
    studentAge: 15,
    school: "St. Xavier's High School",
    schoolId: "sc1",
    reason: "Experiencing severe exam anxiety and sleep disruption ahead of board exams. Class teacher reports noticeable drop in performance.",
    service: "Individual Counseling",
    urgency: "critical",
    status: "new",
    referredBy: "Ms. Priya Soni",
    referralSource: "Class Teacher",
    submittedAt: "27 Apr 2026, 9:10 AM",
    submittedDaysAgo: 0,
    previousSessions: 0,
    smartFlag: "Board exam in 3 weeks — time-sensitive",
  },
  {
    id: "req2",
    studentName: "Priya Mehta",
    studentClass: "Class 12-A",
    studentAge: 17,
    school: "Delhi Public School, Rohini",
    schoolId: "sc2",
    reason: "Confused about stream selection and higher education. Considering dropping out due to parental pressure. Needs career direction.",
    service: "Career Guidance",
    urgency: "high",
    status: "new",
    referredBy: "Self — via Inupgro",
    referralSource: "Student Self-referral",
    submittedAt: "27 Apr 2026, 8:45 AM",
    submittedDaysAgo: 0,
    previousSessions: 1,
    smartFlag: "Class 12 — college application deadline approaching",
  },
  {
    id: "req3",
    studentName: "Akash Kumar",
    studentClass: "Class 9-C",
    studentAge: 14,
    school: "Kendriya Vidyalaya, Sector 12",
    schoolId: "sc3",
    reason: "Ongoing peer conflict — repeatedly targeted by a group of classmates. School coordinator confirms multiple witnessed incidents.",
    service: "Conflict Resolution",
    urgency: "high",
    status: "new",
    referredBy: "Mrs. Sunita Rao",
    referralSource: "School Coordinator",
    submittedAt: "26 Apr 2026, 4:30 PM",
    submittedDaysAgo: 1,
    previousSessions: 0,
  },
  {
    id: "req4",
    studentName: "Divya Nair",
    studentClass: "Class 8-A",
    studentAge: 13,
    school: "Ryan International School",
    schoolId: "sc4",
    reason: "Parent reports child is overwhelmed with extra-curricular commitments. Showing signs of burnout and refusing to attend school.",
    service: "Stress Management",
    urgency: "medium",
    status: "new",
    referredBy: "Parent via Inupgro",
    referralSource: "Parent Referral",
    submittedAt: "26 Apr 2026, 11:00 AM",
    submittedDaysAgo: 1,
  },
  {
    id: "req5",
    studentName: "Sana Ali",
    studentClass: "Class 11-B",
    studentAge: 16,
    school: "St. Xavier's High School",
    schoolId: "sc1",
    reason: "Referred by school doctor after student disclosed persistent low mood, loss of appetite, and withdrawal from friends for past 3 weeks.",
    service: "Mental Health Assessment",
    urgency: "critical",
    status: "pending",
    referredBy: "Dr. V. Krishnamurthy (School Doctor)",
    referralSource: "Medical Referral",
    submittedAt: "24 Apr 2026, 2:15 PM",
    submittedDaysAgo: 3,
    previousSessions: 0,
    smartFlag: "Medical referral — response overdue by 3 days",
  },
  {
    id: "req6",
    studentName: "Rohan Singh",
    studentClass: "Class 10-A",
    studentAge: 15,
    school: "Delhi Public School, Rohini",
    schoolId: "sc2",
    reason: "Struggling with study habits and time management. Academic performance declining steadily since Term 1.",
    service: "Academic Support",
    urgency: "medium",
    status: "pending",
    referredBy: "Mr. Arvind (Class Teacher)",
    referralSource: "Class Teacher",
    submittedAt: "25 Apr 2026, 3:00 PM",
    submittedDaysAgo: 2,
    previousSessions: 2,
  },
  {
    id: "req7",
    studentName: "Ananya Das",
    studentClass: "Class 7-D",
    studentAge: 12,
    school: "Kendriya Vidyalaya, Sector 12",
    schoolId: "sc3",
    reason: "Victim of sustained classroom bullying. School counselor escalated after student disclosed emotional distress and self-harm ideation.",
    service: "Trauma Support",
    urgency: "critical",
    status: "pending",
    referredBy: "Internal School Counselor",
    referralSource: "Internal Escalation",
    submittedAt: "25 Apr 2026, 10:45 AM",
    submittedDaysAgo: 2,
    previousSessions: 0,
    smartFlag: "Self-harm ideation disclosed — treat as priority",
  },
  {
    id: "req8",
    studentName: "Kavya Reddy",
    studentClass: "Class 12-C",
    studentAge: 17,
    school: "Ryan International School",
    schoolId: "sc4",
    reason: "Severe stress around college applications and entrance exams. Concerns about parental expectations.",
    service: "Career Guidance",
    urgency: "medium",
    status: "approved",
    referredBy: "Self — via Inupgro",
    referralSource: "Student Self-referral",
    submittedAt: "22 Apr 2026, 9:00 AM",
    submittedDaysAgo: 5,
    approvedAt: "23 Apr 2026",
    scheduledAt: "30 Apr 2026, 11:00 AM",
    previousSessions: 0,
  },
  {
    id: "req9",
    studentName: "Aarav Joshi",
    studentClass: "Class 9-B",
    studentAge: 14,
    school: "St. Xavier's High School",
    schoolId: "sc1",
    reason: "Visible social anxiety — avoids group activities and has difficulty speaking in class. Teachers report significant distress.",
    service: "Individual Counseling",
    urgency: "high",
    status: "approved",
    referredBy: "Ms. Priya Soni",
    referralSource: "Class Teacher",
    submittedAt: "24 Apr 2026, 1:00 PM",
    submittedDaysAgo: 3,
    approvedAt: "26 Apr 2026",
    previousSessions: 0,
  },
  {
    id: "req10",
    studentName: "Ritesh Patel",
    studentClass: "Class 10-D",
    studentAge: 15,
    school: "Delhi Public School, Rohini",
    schoolId: "sc2",
    reason: "Performance anxiety before tests.",
    service: "Group Counseling",
    urgency: "low",
    status: "denied",
    referredBy: "Parent via Inupgro",
    referralSource: "Parent Referral",
    submittedAt: "20 Apr 2026, 5:00 PM",
    submittedDaysAgo: 7,
    deniedAt: "22 Apr 2026",
    denialReason: "Duplicate request — existing open case from same student",
    previousSessions: 3,
  },
];

const URGENCY_CONFIG: Record<Urgency, { label: string; bg: string; text: string; border: string; dot: string }> = {
  critical: { label: "Critical", bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",   dot: "bg-red-500"    },
  high:     { label: "High",     bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200",dot: "bg-orange-500" },
  medium:   { label: "Medium",   bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200", dot: "bg-amber-500"  },
  low:      { label: "Low",      bg: "bg-slate-50",  text: "text-slate-600",  border: "border-slate-200", dot: "bg-slate-400"  },
};

const STATUS_CONFIG: Record<RequestStatus, { label: string; bg: string; text: string; border: string }> = {
  new:      { label: "New",      bg: "bg-blue-50",   text: "text-blue-700",  border: "border-blue-200"  },
  pending:  { label: "Pending",  bg: "bg-amber-50",  text: "text-amber-700", border: "border-amber-200" },
  approved: { label: "Approved", bg: "bg-green-50",  text: "text-green-700", border: "border-green-200" },
  denied:   { label: "Denied",   bg: "bg-slate-50",  text: "text-slate-600", border: "border-slate-200" },
};

const URGENCY_ORDER: Record<Urgency, number> = { critical: 0, high: 1, medium: 2, low: 3 };

const SERVICE_ICON: Record<ServiceType, React.ReactNode> = {
  "Individual Counseling":    <User        className="w-3 h-3" />,
  "Group Counseling":         <Users       className="w-3 h-3" />,
  "Career Guidance":          <GraduationCap className="w-3 h-3" />,
  "Crisis Support":           <AlertTriangle className="w-3 h-3" />,
  "Academic Support":         <BookOpen    className="w-3 h-3" />,
  "Conflict Resolution":      <MessageCircle className="w-3 h-3" />,
  "Trauma Support":           <Brain       className="w-3 h-3" />,
  "Stress Management":        <Zap         className="w-3 h-3" />,
  "Mental Health Assessment": <Clipboard   className="w-3 h-3" />,
};

const DENY_REASONS = [
  "Duplicate request — existing open case",
  "Outside counselor scope — refer to specialist",
  "Insufficient information provided",
  "School capacity exceeded this month",
  "Student already receiving adequate support",
  "Request withdrawn by school/parent",
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

const TAB_KEYS: RequestStatus[] = ["new", "pending", "approved", "denied"];

function getSmartInsights(requests: CounselingRequest[]) {
  const criticalNew    = requests.filter((r) => r.status === "new"     && r.urgency === "critical").length;
  const criticalPending= requests.filter((r) => r.status === "pending" && r.urgency === "critical").length;
  const schoolCounts   = requests.reduce<Record<string, number>>((acc, r) => {
    if (r.status === "new" || r.status === "pending") acc[r.school] = (acc[r.school] || 0) + 1;
    return acc;
  }, {});
  const busiestSchool  = Object.entries(schoolCounts).sort((a, b) => b[1] - a[1])[0];
  const overdue        = requests.filter((r) => r.status === "pending" && r.submittedDaysAgo >= 3);
  return { criticalNew, criticalPending, busiestSchool, overdue };
}

export default function RequestsScreen({ mobile = "9876543210" }: RequestsScreenProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests]       = useState<CounselingRequest[]>(INITIAL_REQUESTS);
  const [activeTab, setActiveTab]     = useState<RequestStatus>("new");
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<Urgency | "all">("all");
  const [denyingId, setDenyingId]     = useState<string | null>(null);
  const [denyReason, setDenyReason]   = useState("");
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode]       = useState(false);

  const insights = getSmartInsights(requests);

  const tabCounts = useMemo(
    () => TAB_KEYS.reduce<Record<string, number>>((acc, k) => {
      acc[k] = requests.filter((r) => r.status === k).length;
      return acc;
    }, {}),
    [requests]
  );

  const filtered = useMemo(() => {
    return requests
      .filter((r) => r.status === activeTab)
      .filter((r) =>
        searchQuery === "" ||
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((r) => urgencyFilter === "all" || r.urgency === urgencyFilter)
      .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]);
  }, [requests, activeTab, searchQuery, urgencyFilter]);

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "approved", approvedAt: "27 Apr 2026" } : r)
    );
    setExpandedId(null);
    toast({ title: "Request approved", description: "Student added to your counseling queue." });
  };

  const handleDeny = (id: string) => {
    if (!denyReason) {
      toast({ title: "Select a reason", description: "Please select a denial reason to continue." });
      return;
    }
    setRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "denied", deniedAt: "27 Apr 2026", denialReason: denyReason } : r)
    );
    setDenyingId(null);
    setDenyReason("");
    toast({ title: "Request denied", description: "Student and school have been notified." });
  };

  const handleSchedule = (id: string) => {
    if (!scheduleDate || !scheduleTime) {
      toast({ title: "Date and time required", description: "Please select both date and time." });
      return;
    }
    const formatted = `${scheduleDate}, ${scheduleTime}`;
    setRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, scheduledAt: formatted } : r)
    );
    setSchedulingId(null);
    setScheduleDate("");
    setScheduleTime("");
    toast({ title: "Session scheduled", description: `Confirmed for ${formatted}.` });
  };

  const handleBulkApprove = () => {
    setRequests((prev) =>
      prev.map((r) => selectedIds.has(r.id) ? { ...r, status: "approved", approvedAt: "27 Apr 2026" } : r)
    );
    toast({ title: `${selectedIds.size} requests approved`, description: "Students added to your queue." });
    setSelectedIds(new Set());
    setBulkMode(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const criticalAlert = insights.criticalNew + insights.criticalPending;

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
            data-testid="requests-sidebar"
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
                  <span>{item.label}</span>
                  {item.id === "students" && tabCounts["new"] > 0 && (
                    <span className="ml-auto text-[10px] font-bold bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                      {tabCounts["new"]}
                    </span>
                  )}
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
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-16 bg-card/95 backdrop-blur border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 gap-3" data-testid="requests-header">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-toggle-sidebar">
              <Menu className="w-4.5 h-4.5" />
            </button>
            <div>
              <h1 className="text-sm font-serif font-semibold text-foreground leading-none">Counseling Requests</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">{requests.length} total · {tabCounts["new"]} new · auto-sorted by urgency</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {criticalAlert > 0 && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold bg-destructive/10 text-destructive border border-destructive/20 px-2.5 py-1 rounded-full"
                data-testid="critical-alert-badge"
              >
                <AlertTriangle className="w-3 h-3" />
                {criticalAlert} Critical
              </motion.span>
            )}
            <Button
              variant={bulkMode ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              data-testid="button-bulk-mode"
              onClick={() => { setBulkMode((v) => !v); setSelectedIds(new Set()); }}
            >
              <ListFilter className="w-3.5 h-3.5 mr-1" />
              {bulkMode ? "Cancel Bulk" : "Bulk Actions"}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col">

          {/* Smart alert banner */}
          <AnimatePresence>
            {(insights.criticalNew > 0 || insights.overdue.length > 0) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-primary/20 border-l-4 border-l-primary bg-primary/5 overflow-hidden shrink-0"
                data-testid="smart-alert-banner"
              >
                <div className="px-4 sm:px-6 py-2.5 flex items-center gap-6 overflow-x-auto">
                  {insights.criticalNew > 0 && (
                    <span className="text-xs text-primary flex items-center gap-1.5 shrink-0">
                      <Zap className="w-3.5 h-3.5" />
                      <strong>{insights.criticalNew} new critical</strong> request{insights.criticalNew > 1 ? "s" : ""} — immediate review recommended
                    </span>
                  )}
                  {insights.overdue.length > 0 && (
                    <span className="text-xs text-primary flex items-center gap-1.5 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      <strong>{insights.overdue.length}</strong> pending request{insights.overdue.length > 1 ? "s" : ""} overdue (&gt;3 days) — response required
                    </span>
                  )}
                  {insights.busiestSchool && insights.busiestSchool[1] >= 2 && (
                    <span className="text-xs text-primary flex items-center gap-1.5 shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                      <strong>{insights.busiestSchool[1]} active requests</strong> from {insights.busiestSchool[0]} — consider group session
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs + Filter bar */}
          <div className="border-b border-border bg-card/50 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-0.5 overflow-x-auto" data-testid="request-tabs">
              {TAB_KEYS.map((tab) => {
                const sc = STATUS_CONFIG[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setExpandedId(null); setDenyingId(null); setSchedulingId(null); }}
                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors border-b-2 whitespace-nowrap ${
                      activeTab === tab
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`tab-${tab}`}
                  >
                    {tab === "new"      && <Inbox      className="w-3.5 h-3.5" />}
                    {tab === "pending"  && <Clock      className="w-3.5 h-3.5" />}
                    {tab === "approved" && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {tab === "denied"   && <XCircle    className="w-3.5 h-3.5" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tabCounts[tab] > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        activeTab === tab ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {tabCounts[tab]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 py-2 shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search…"
                  className="pl-7 pr-3 h-7 w-40 text-xs bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="search-input"
                />
              </div>
              <select
                className="h-7 px-2 text-xs bg-muted/50 border border-border rounded-lg focus:outline-none cursor-pointer"
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value as Urgency | "all")}
                data-testid="urgency-filter"
              >
                <option value="all">All urgency</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Bulk action bar */}
          <AnimatePresence>
            {bulkMode && selectedIds.size > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-primary/20 bg-primary/5 overflow-hidden shrink-0"
                data-testid="bulk-action-bar"
              >
                <div className="px-4 sm:px-6 py-2 flex items-center gap-3">
                  <span className="text-xs font-medium text-primary">{selectedIds.size} selected</span>
                  <Button size="sm" className="h-7 text-[11px]" data-testid="button-bulk-approve" onClick={handleBulkApprove}>
                    <CheckCircle2 className="w-3 h-3 mr-1" />Approve All
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-[11px]"
                    onClick={() => { toast({ title: "Bulk denied", description: `${selectedIds.size} requests denied.` }); setSelectedIds(new Set()); setBulkMode(false); }}>
                    <XCircle className="w-3 h-3 mr-1" />Deny All
                  </Button>
                  <button className="text-xs text-muted-foreground hover:text-foreground ml-auto" onClick={() => setSelectedIds(new Set())}>
                    Clear selection
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Request list */}
          <div className="flex-1 overflow-y-auto" data-testid="request-list">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground" data-testid="empty-state">
                <Inbox className="w-10 h-10 opacity-30" />
                <p className="text-sm font-medium">No {activeTab} requests</p>
                <p className="text-xs">
                  {searchQuery || urgencyFilter !== "all" ? "Try adjusting your filters" : "Check back later"}
                </p>
              </div>
            ) : (
              <div className="p-4 sm:p-5 space-y-3">
                {filtered.map((req, idx) => {
                  const uc   = URGENCY_CONFIG[req.urgency];
                  const sc   = STATUS_CONFIG[req.status];
                  const isExpanded   = expandedId === req.id;
                  const isDenying    = denyingId  === req.id;
                  const isScheduling = schedulingId === req.id;
                  const isSelected   = selectedIds.has(req.id);

                  const initials = req.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

                  const urgencyAccent: Record<Urgency, string> = {
                    critical: "border-l-red-500",
                    high:     "border-l-orange-400",
                    medium:   "border-l-amber-400",
                    low:      "border-l-slate-300",
                  };
                  const urgencyAvatarBg: Record<Urgency, string> = {
                    critical: "bg-red-50 text-red-700",
                    high:     "bg-orange-50 text-orange-700",
                    medium:   "bg-amber-50 text-amber-700",
                    low:      "bg-slate-100 text-slate-600",
                  };

                  return (
                    <motion.div
                      key={req.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: idx * 0.04 }}
                      className={`bg-card rounded-2xl border border-border border-l-4 ${urgencyAccent[req.urgency]} shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
                        isSelected ? "ring-2 ring-primary/30" : ""
                      }`}
                      data-testid={`request-${req.id}`}
                    >
                      {/* Request card body */}
                      <div
                        className="p-4 flex items-start gap-3.5 cursor-pointer"
                        data-testid={`row-body-${req.id}`}
                        onClick={() => {
                          if (bulkMode) { toggleSelect(req.id); return; }
                          navigate("/student");
                        }}
                      >
                        {/* Bulk checkbox */}
                        {bulkMode && (activeTab === "new" || activeTab === "pending") && (
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-1 ${
                            isSelected ? "bg-primary border-primary" : "border-border bg-background"
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                          </div>
                        )}

                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${urgencyAvatarBg[req.urgency]}`}>
                          {initials}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">

                          {/* Top row: name + badges + date/toggle */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap min-w-0">
                              <p
                                className="text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                                data-testid={`student-name-link-${req.id}`}
                                onClick={(e) => { e.stopPropagation(); if (bulkMode) { toggleSelect(req.id); return; } navigate("/student"); }}
                              >{req.studentName}</p>
                              <span className="text-[10px] text-muted-foreground font-medium">{req.studentClass}</span>
                              <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${uc.bg} ${uc.text} ${uc.border}`}>
                                {req.urgency === "critical" && <Zap className="w-2.5 h-2.5" />}
                                {uc.label}
                              </span>
                            </div>
                            <div
                              className="flex items-center gap-1.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                              data-testid={`expand-toggle-${req.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(isExpanded ? null : req.id);
                                setDenyingId(null);
                                setSchedulingId(null);
                              }}
                            >
                              <span className="text-[10px]">{req.submittedAt.split(",")[0]}</span>
                              {isExpanded
                                ? <ChevronUp className="w-3.5 h-3.5" />
                                : <ChevronDown className="w-3.5 h-3.5" />
                              }
                            </div>
                          </div>

                          {/* Meta row: school · service · referral */}
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Building2 className="w-2.5 h-2.5 shrink-0" />{req.school}
                            </span>
                            <span className="text-muted-foreground/30 text-[10px]">·</span>
                            <span className="inline-flex items-center gap-1 text-[10px] bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded-md">
                              {SERVICE_ICON[req.service]}{req.service}
                            </span>
                            <span className="text-muted-foreground/30 text-[10px]">·</span>
                            <span className="text-[10px] text-muted-foreground">{req.referralSource}</span>
                          </div>

                          {/* Reason */}
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{req.reason}</p>

                          {/* Smart flag */}
                          {req.smartFlag && (
                            <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                              <Sparkles className="w-2.5 h-2.5 shrink-0" />{req.smartFlag}
                            </div>
                          )}

                          {/* Approved/Denied status row */}
                          {req.status === "approved" && (
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <span className="text-[10px] text-green-700 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />Approved {req.approvedAt}
                              </span>
                              {req.scheduledAt ? (
                                <span className="text-[10px] text-blue-700 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />Session: {req.scheduledAt}
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-600 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />Not yet scheduled
                                </span>
                              )}
                            </div>
                          )}
                          {req.status === "denied" && req.denialReason && (
                            <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-slate-400" />{req.denialReason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quick action strip — visible when not expanded */}
                      {!isExpanded && !bulkMode && (req.status === "new" || req.status === "pending") && (
                        <div className="px-4 pb-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" className="h-7 text-[11px] gap-1 rounded-lg"
                            data-testid={`button-approve-quick-${req.id}`}
                            onClick={(e) => { e.stopPropagation(); handleApprove(req.id); }}>
                            <CheckCircle2 className="w-3 h-3" />Approve
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 rounded-lg border-border text-muted-foreground hover:text-foreground"
                            data-testid={`button-expand-quick-${req.id}`}
                            onClick={(e) => { e.stopPropagation(); setExpandedId(req.id); setDenyingId(null); setSchedulingId(null); }}>
                            <ChevronDown className="w-3 h-3" />Details
                          </Button>
                          <button
                            className="ml-auto text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
                            onClick={(e) => { e.stopPropagation(); navigate("/student"); }}
                          >
                            View profile <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Expanded detail + actions */}
                      <AnimatePresence>
                        {isExpanded && !bulkMode && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden border-t border-border/60"
                            data-testid={`expanded-${req.id}`}
                          >
                            <div className="p-4 bg-muted/20 space-y-4">

                              {/* Reason + Details grid */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 bg-card rounded-xl border border-border p-3.5">
                                  <p className="text-[10px] font-semibold text-muted-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />Reason for Request
                                  </p>
                                  <p className="text-xs text-foreground leading-relaxed">{req.reason}</p>
                                </div>
                                <div className="bg-card rounded-xl border border-border p-3.5 space-y-2">
                                  <p className="text-[10px] font-semibold text-muted-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />Details
                                  </p>
                                  {[
                                    { label: "Age",           val: `${req.studentAge} yrs` },
                                    { label: "Service",       val: req.service },
                                    { label: "Referred by",   val: req.referredBy },
                                    { label: "Submitted",     val: req.submittedAt },
                                    { label: "Past sessions", val: req.previousSessions !== undefined ? String(req.previousSessions) : "—" },
                                  ].map((d) => (
                                    <div key={d.label} className="flex items-start justify-between gap-2">
                                      <span className="text-[10px] text-muted-foreground shrink-0">{d.label}</span>
                                      <span className="text-[10px] font-medium text-foreground text-right">{d.val}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Smart insight */}
                              {req.smartFlag && (
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/80 border border-blue-200">
                                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                  <p className="text-[11px] text-blue-700 leading-relaxed"><strong>Smart insight:</strong> {req.smartFlag}</p>
                                </div>
                              )}

                              {/* Action buttons */}
                              {(req.status === "new" || req.status === "pending") && !isDenying && !isScheduling && (
                                <div className="flex items-center gap-2 flex-wrap pt-1" data-testid={`action-buttons-${req.id}`}>
                                  <Button size="sm" className="h-8 text-xs gap-1.5"
                                    data-testid={`button-approve-${req.id}`}
                                    onClick={(e) => { e.stopPropagation(); handleApprove(req.id); }}>
                                    <CheckCircle2 className="w-3.5 h-3.5" />Approve
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                                    data-testid={`button-deny-${req.id}`}
                                    onClick={(e) => { e.stopPropagation(); setDenyingId(req.id); setSchedulingId(null); }}>
                                    <XCircle className="w-3.5 h-3.5" />Deny
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"
                                    data-testid={`button-schedule-${req.id}`}
                                    onClick={(e) => { e.stopPropagation(); setSchedulingId(req.id); setDenyingId(null); }}>
                                    <Calendar className="w-3.5 h-3.5" />Schedule
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground ml-auto"
                                    data-testid={`button-view-profile-${req.id}`}
                                    onClick={(e) => { e.stopPropagation(); navigate("/student"); }}>
                                    View Profile <ArrowRight className="w-3 h-3 ml-1" />
                                  </Button>
                                </div>
                              )}

                              {/* Approved actions */}
                              {req.status === "approved" && !isScheduling && (
                                <div className="flex items-center gap-2 flex-wrap pt-1" data-testid={`action-buttons-${req.id}`}>
                                  {!req.scheduledAt && (
                                    <Button size="sm" className="h-8 text-xs gap-1.5"
                                      data-testid={`button-schedule-${req.id}`}
                                      onClick={(e) => { e.stopPropagation(); setSchedulingId(req.id); }}>
                                      <Calendar className="w-3.5 h-3.5" />Schedule Session
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground"
                                    onClick={(e) => { e.stopPropagation(); toast({ title: "Opening session notes" }); }}>
                                    <FileText className="w-3.5 h-3.5 mr-1" />Session Notes
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground ml-auto"
                                    data-testid={`button-view-profile-${req.id}`}
                                    onClick={(e) => { e.stopPropagation(); navigate("/student"); }}>
                                    View Profile <ArrowRight className="w-3 h-3 ml-1" />
                                  </Button>
                                </div>
                              )}

                              {/* Denied actions */}
                              {req.status === "denied" && (
                                <div className="flex items-center gap-2 flex-wrap pt-1" data-testid={`action-buttons-${req.id}`}>
                                  <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground ml-auto"
                                    data-testid={`button-view-profile-${req.id}`}
                                    onClick={(e) => { e.stopPropagation(); navigate("/student"); }}>
                                    View Profile <ArrowRight className="w-3 h-3 ml-1" />
                                  </Button>
                                </div>
                              )}

                              {/* Deny form */}
                              {isDenying && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-red-50/60 border border-red-200 rounded-xl p-3.5 space-y-2.5"
                                  data-testid={`deny-form-${req.id}`}
                                >
                                  <p className="text-xs font-semibold text-red-700">Reason for denial</p>
                                  <select
                                    className="w-full h-8 px-2 text-xs border border-red-200 rounded-lg bg-background focus:outline-none"
                                    value={denyReason}
                                    onChange={(e) => setDenyReason(e.target.value)}
                                    data-testid={`select-deny-reason-${req.id}`}
                                  >
                                    <option value="">Select a reason…</option>
                                    {DENY_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                                  </select>
                                  <div className="flex gap-2">
                                    <Button size="sm" className="h-7 text-[11px] bg-red-600 hover:bg-red-700"
                                      data-testid={`button-confirm-deny-${req.id}`}
                                      onClick={(e) => { e.stopPropagation(); handleDeny(req.id); }}>
                                      Confirm Denial
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-7 text-[11px]"
                                      onClick={(e) => { e.stopPropagation(); setDenyingId(null); setDenyReason(""); }}>
                                      Cancel
                                    </Button>
                                  </div>
                                </motion.div>
                              )}

                              {/* Schedule form */}
                              {isScheduling && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 space-y-2.5"
                                  data-testid={`schedule-form-${req.id}`}
                                >
                                  <p className="text-xs font-semibold text-primary">Schedule first session</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[10px] text-muted-foreground block mb-1">Date *</label>
                                      <input
                                        type="date"
                                        className="w-full h-8 px-2 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        data-testid={`input-date-${req.id}`}
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] text-muted-foreground block mb-1">Time *</label>
                                      <input
                                        type="time"
                                        className="w-full h-8 px-2 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        data-testid={`input-time-${req.id}`}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" className="h-7 text-[11px]"
                                      data-testid={`button-confirm-schedule-${req.id}`}
                                      onClick={(e) => { e.stopPropagation(); handleSchedule(req.id); }}>
                                      Confirm Schedule
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-7 text-[11px]"
                                      onClick={(e) => { e.stopPropagation(); setSchedulingId(null); setScheduleDate(""); setScheduleTime(""); }}>
                                      Cancel
                                    </Button>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom status bar */}
          <div className="border-t border-border bg-card/50 px-4 sm:px-6 py-2 flex items-center justify-between shrink-0" data-testid="status-bar">
            <p className="text-[10px] text-muted-foreground">
              Showing <strong>{filtered.length}</strong> of <strong>{tabCounts[activeTab] || 0}</strong> {activeTab} requests
              {urgencyFilter !== "all" ? ` · Filtered: ${urgencyFilter}` : ""}
              {searchQuery ? ` · Search: "${searchQuery}"` : ""}
            </p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5" />Synced with Inupgro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
