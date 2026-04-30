import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  Shield, Bell, ChevronRight, CheckCircle2, Clock, AlertTriangle,
  User, Calendar, School, TrendingUp, BookOpen, MessageCircle,
  LayoutDashboard, Users, MapPin, BarChart2, Settings, LogOut,
  Star, X, Search, Menu, BadgeCheck, ArrowUpRight, ArrowDownRight,
  Video, Phone, FileText, Zap, GraduationCap, Building2,
  ChevronDown, MoreHorizontal, Activity, IndianRupee, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface DashboardScreenProps {
  mobile: string;
}

const REVENUE_DATA = [
  { month: "Nov", amount: 16200 },
  { month: "Dec", amount: 18500 },
  { month: "Jan", amount: 19800 },
  { month: "Feb", amount: 22100 },
  { month: "Mar", amount: 21800 },
  { month: "Apr", amount: 24500 },
];

const SESSIONS_DATA = [
  { day: "Mon", count: 6 },
  { day: "Tue", count: 9 },
  { day: "Wed", count: 7 },
  { day: "Thu", count: 11 },
  { day: "Fri", count: 8 },
  { day: "Sat", count: 6 },
];

const PENDING_REQUESTS = [
  {
    id: "r1",
    name: "Rahul Sharma",
    class: "Class 10",
    school: "St. Xavier's High School",
    concern: "Exam anxiety",
    referredBy: "Ms. Priya Soni (Class Teacher)",
    source: "Inupgro",
    priority: "high",
    time: "2h ago",
    avatar: "RS",
  },
  {
    id: "r2",
    name: "Kavya Singh",
    class: "Class 12",
    school: "DPS Rohini",
    concern: "Career confusion",
    referredBy: "Self-referred via Inupgro",
    source: "Inupgro",
    priority: "medium",
    time: "4h ago",
    avatar: "KS",
  },
  {
    id: "r3",
    name: "Arjun Mehta",
    class: "Class 9",
    school: "KV Sector 12",
    concern: "Peer conflict",
    referredBy: "Class Coordinator",
    source: "Inupgro",
    priority: "high",
    time: "5h ago",
    avatar: "AM",
  },
  {
    id: "r4",
    name: "Meera Patel",
    class: "Class 11",
    school: "Ryan International",
    concern: "Stress management",
    referredBy: "Parent via Inupgro",
    source: "Inupgro",
    priority: "low",
    time: "Yesterday",
    avatar: "MP",
  },
];

const APPOINTMENTS = [
  {
    id: "a1",
    name: "Ananya Roy",
    class: "Class 8",
    school: "St. Xavier's High School",
    type: "Follow-up session",
    time: "Today, 2:00 PM",
    mode: "video",
    status: "confirmed",
  },
  {
    id: "a2",
    name: "Rohit Kumar",
    class: "Class 11",
    school: "DPS Rohini",
    type: "Initial assessment",
    time: "Today, 4:30 PM",
    mode: "in-person",
    status: "confirmed",
  },
  {
    id: "a3",
    name: "School Visit",
    class: "",
    school: "St. Xavier's High School",
    type: "Group counseling session",
    time: "Tomorrow, 10:00 AM",
    mode: "in-person",
    status: "upcoming",
  },
  {
    id: "a4",
    name: "Priya Nair",
    class: "Class 10",
    school: "KV Sector 12",
    type: "Anxiety management",
    time: "29 Apr, 3:00 PM",
    mode: "video",
    status: "upcoming",
  },
];

const SCHOOL_ALERTS = [
  {
    id: "s1",
    school: "St. Xavier's High School",
    message: "Group session scheduled for 45 students — prep materials needed",
    time: "Tomorrow 9:00 AM",
    urgency: "urgent",
  },
  {
    id: "s2",
    school: "DPS Rohini",
    message: "3 new referrals added via Inupgro — review and accept",
    time: "29 Apr 2026",
    urgency: "normal",
  },
  {
    id: "s3",
    school: "KV Sector 12",
    message: "Monthly progress report due — submit via Inupgro portal",
    time: "30 Apr 2026",
    urgency: "normal",
  },
];

const ASSIGNED_SCHOOLS = [
  { id: "sc1", name: "St. Xavier's High School",   city: "New Delhi",   students: 312, counselors: 2, pending: 3, color: "bg-blue-500",  borderColor: "border-l-blue-500"  },
  { id: "sc2", name: "Delhi Public School, Rohini", city: "New Delhi",   students: 478, counselors: 3, pending: 1, color: "bg-teal-500",  borderColor: "border-l-teal-500"  },
  { id: "sc3", name: "KV Sector 12",               city: "Dwarka",      students: 267, counselors: 1, pending: 2, color: "bg-blue-500",  borderColor: "border-l-blue-500"  },
  { id: "sc4", name: "Ryan International School",  city: "Noida",       students: 389, counselors: 2, pending: 0, color: "bg-amber-500", borderColor: "border-l-amber-500" },
];

const NOTIFICATIONS = [
  { id: "n1", icon: <MessageCircle className="w-4 h-4" />, text: "New referral from St. Xavier's via Inupgro",           time: "2m ago",    read: false, color: "text-blue-600  bg-blue-50"  },
  { id: "n2", icon: <Calendar      className="w-4 h-4" />, text: "Reminder: Session with Ananya Roy at 2:00 PM today",   time: "15m ago",   read: false, color: "text-primary   bg-primary/10" },
  { id: "n3", icon: <AlertTriangle className="w-4 h-4" />, text: "School visit prep for St. Xavier's due tomorrow",      time: "1h ago",    read: false, color: "text-amber-600 bg-amber-50" },
  { id: "n4", icon: <CheckCircle2  className="w-4 h-4" />, text: "Session notes for Rohit Kumar submitted to Inupgro",   time: "3h ago",    read: true,  color: "text-green-600 bg-green-50" },
  { id: "n5", icon: <IndianRupee   className="w-4 h-4" />, text: "Payout of ₹6,300 initiated — expected in 2 days",      time: "Yesterday", read: true,  color: "text-green-600 bg-green-50" },
  { id: "n6", icon: <MessageCircle className="w-4 h-4" />, text: "Inupgro coordinator message from DPS Rohini",          time: "Yesterday", read: true,  color: "text-blue-600  bg-blue-50"  },
];

const RECENT_ACTIVITY = [
  { id: "ac1", text: "Session completed — Ananya Roy (Class 8, St. Xavier's)", time: "1h ago",    type: "session" },
  { id: "ac2", text: "New referral received — Kavya Singh via Inupgro",        time: "3h ago",    type: "referral" },
  { id: "ac3", text: "Session notes synced to Inupgro for Rohit Kumar",        time: "5h ago",    type: "sync"    },
  { id: "ac4", text: "DPS Rohini coordinator sent a message via Inupgro",      time: "Yesterday", type: "message" },
  { id: "ac5", text: "Monthly report reviewed by school admin — St. Xavier's", time: "Yesterday", type: "report"  },
];

const NAV_ITEMS = [
  { id: "dashboard",    path: "/dashboard",  icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: "Dashboard"    },
  { id: "students",     path: "/requests",   icon: <Users           className="w-4.5 h-4.5" />, label: "Students"     },
  { id: "appointments", path: "/appointment",icon: <Calendar        className="w-4.5 h-4.5" />, label: "Appointments" },
  { id: "schools",      path: "/visits",     icon: <School          className="w-4.5 h-4.5" />, label: "Schools"      },
  { id: "revenue",      path: "/revenue",    icon: <IndianRupee     className="w-4.5 h-4.5" />, label: "Revenue"      },
  { id: "reports",      path: "/analytics",  icon: <BarChart2       className="w-4.5 h-4.5" />, label: "Reports"      },
  { id: "settings",     path: "/settings",   icon: <Settings        className="w-4.5 h-4.5" />, label: "Settings"     },
];

const PRIORITY_CONFIG = {
  high:   { label: "High",   bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200"   },
  medium: { label: "Medium", bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200" },
  low:    { label: "Low",    bg: "bg-slate-50",  text: "text-slate-600",  border: "border-slate-200" },
};

type Priority = "high" | "medium" | "low";

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  return (
    <div className={`${s} rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0`}>
      {initials}
    </div>
  );
}

function StatCard({
  label, value, sub, icon, iconClass, accentClass, trend, trendUp, delay, sparkBars,
}: {
  label: string; value: string; sub: string; icon: React.ReactNode;
  iconClass?: string; accentClass?: string; trend?: string; trendUp?: boolean;
  delay: number; sparkBars?: number[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
      data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className={`h-1 w-full ${accentClass ?? "bg-primary"}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass ?? "bg-primary/10 text-primary"}`}>
            {icon}
          </div>
          {trend && (
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              trendUp
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}>
              {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-foreground mb-0.5">{value}</p>
        <p className="text-xs font-medium text-muted-foreground mb-3">{label}</p>
        {sparkBars && (
          <div className="flex items-end gap-0.5 h-6 mb-2.5">
            {sparkBars.map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm transition-all ${
                  i === sparkBars.length - 1
                    ? (accentClass ?? "bg-primary")
                    : "bg-muted"
                }`}
                style={{ height: `${Math.max(18, Math.round(h * 100))}%` }}
              />
            ))}
          </div>
        )}
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
    </motion.div>
  );
}

export default function DashboardScreen({ mobile }: DashboardScreenProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [activeNav, setActiveNav]           = useState("dashboard");
  const [notifOpen, setNotifOpen]           = useState(false);
  const [notifications, setNotifications]   = useState(NOTIFICATIONS);
  const [acceptedIds, setAcceptedIds]       = useState<Set<string>>(new Set());

  const [showSessionLauncher, setShowSessionLauncher] = useState(false);
  const sessionLauncherCloseRef = useRef<HTMLButtonElement>(null);

  const todaySessions = APPOINTMENTS.filter((a) => a.time.startsWith("Today"));

  useEffect(() => {
    if (!showSessionLauncher) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSessionLauncher(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const frame = requestAnimationFrame(() => sessionLauncherCloseRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(frame);
    };
  }, [showSessionLauncher]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const acceptRequest = (id: string) => {
    setAcceptedIds((prev) => new Set(prev).add(id));
    toast({ title: "Request accepted", description: "Student added to your schedule via Inupgro." });
  };

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
            data-testid="sidebar"
          >
            {/* Logo */}
            <div className="h-16 px-5 flex items-center gap-3 border-b border-border shrink-0">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base font-serif font-semibold text-foreground whitespace-nowrap">MindBridge</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              <p className="text-[10px] font-medium text-muted-foreground px-3 mb-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />Main Menu</p>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    else setActiveNav(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left whitespace-nowrap ${
                    activeNav === item.id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Profile mini */}
            <div className="px-3 py-3 border-t border-border shrink-0">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                  AS
                </div>
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

      {/* ——— MAIN AREA ——— */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-16 bg-card/95 backdrop-blur border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 gap-4" data-testid="dashboard-header">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              data-testid="button-toggle-sidebar"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students, schools…"
                className="pl-9 pr-4 h-9 w-56 text-sm bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="search-input"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:block text-xs text-muted-foreground bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              Synced with Inupgro
            </span>
            <button
              className="relative p-2 rounded-xl hover:bg-muted transition-colors"
              onClick={() => setNotifOpen((v) => !v)}
              data-testid="button-notifications"
            >
              <Bell className="w-4.5 h-4.5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-card" />
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center cursor-pointer">
              AS
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">

          {/* ── Welcome hero ── */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border-b border-border/60 px-4 sm:px-6 py-5 overflow-hidden"
            data-testid="welcome-hero"
          >
            {/* decorative blobs */}
            <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-primary/6 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 right-32 w-24 h-24 rounded-full bg-primary/4 blur-xl" />

            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-serif font-semibold text-foreground leading-tight" data-testid="welcome-heading">
                  Good morning, Dr. Ananya
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Monday, 27 Apr 2026
                  <span className="mx-2 text-muted-foreground/40">·</span>
                  <span className="text-primary font-medium">4 new requests</span> from Inupgro
                </p>
              </div>

              {/* Quick actions */}
              <div className="flex items-center gap-2 flex-wrap" data-testid="quick-actions">
                <Button size="sm" className="h-8 text-xs gap-1.5 rounded-xl shadow-sm" data-testid="button-start-session"
                  onClick={() => setShowSessionLauncher(true)}>
                  <Video className="w-3.5 h-3.5" />Start Session
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 rounded-xl bg-card/70" data-testid="button-schedule-visit"
                  onClick={() => navigate("/visits")}>
                  <MapPin className="w-3.5 h-3.5" />Schedule Visit
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 rounded-xl bg-card/70" data-testid="button-view-reports"
                  onClick={() => navigate("/analytics")}>
                  <BarChart2 className="w-3.5 h-3.5" />View Reports
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="p-4 sm:p-6 space-y-6">

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-testid="stat-cards">
              <StatCard label="Sessions This Month" value="47"      sub="vs 41 last month"      accentClass="bg-primary"    icon={<Activity    className="w-5 h-5" />} iconClass="bg-primary/10 text-primary"  trend="+15%" trendUp delay={0.05} sparkBars={[0.48, 0.55, 0.62, 0.71, 0.74, 1.0]} />
              <StatCard label="Students Reached"    value="234"     sub="across 4 schools"      accentClass="bg-teal-500"   icon={<Users       className="w-5 h-5" />} iconClass="bg-teal-50 text-teal-600"    trend="+8%"  trendUp delay={0.1}  sparkBars={[0.60, 0.65, 0.72, 0.80, 0.84, 1.0]} />
              <StatCard label="Assigned Schools"    value="4"       sub="12 open referrals"     accentClass="bg-blue-500"   icon={<School      className="w-5 h-5" />} iconClass="bg-blue-50 text-blue-600"                     delay={0.15} sparkBars={[0.75, 0.75, 1.0, 1.0, 1.0, 1.0]} />
              <StatCard label="Revenue This Month"  value="₹24,500" sub="₹6,300 payout pending" accentClass="bg-amber-500"  icon={<IndianRupee className="w-5 h-5" />} iconClass="bg-amber-50 text-amber-600"  trend="+12%" trendUp delay={0.2}  sparkBars={[0.66, 0.76, 0.81, 0.90, 0.89, 1.0]} />
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">

              {/* LEFT COLUMN */}
              <div className="space-y-5 min-w-0">

                {/* School Visit Alerts */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                  data-testid="school-visit-alerts"
                >
                  <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <h2 className="text-sm font-semibold text-foreground">School Visit Alerts</h2>
                    </div>
                    <span className="text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      {SCHOOL_ALERTS.length} upcoming
                    </span>
                  </div>
                  <div className="p-3 space-y-2">
                    {SCHOOL_ALERTS.map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start gap-3 p-3 rounded-xl ${
                          alert.urgency === "urgent"
                            ? "bg-gradient-to-r from-red-50 to-red-50/40 border border-red-200"
                            : "bg-muted/30 border border-border"
                        }`}
                        data-testid={`alert-${alert.id}`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          alert.urgency === "urgent" ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
                        }`}>
                          <School className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className={`text-xs font-semibold ${alert.urgency === "urgent" ? "text-red-800" : "text-foreground"}`}>{alert.school}</p>
                            {alert.urgency === "urgent" && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">Urgent</span>
                            )}
                          </div>
                          <p className={`text-xs leading-relaxed ${alert.urgency === "urgent" ? "text-red-700" : "text-muted-foreground"}`}>{alert.message}</p>
                          <p className={`text-[10px] mt-1 flex items-center gap-1 ${alert.urgency === "urgent" ? "text-red-600/80" : "text-muted-foreground"}`}>
                            <Clock className="w-3 h-3" />{alert.time}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className={`h-7 text-[11px] shrink-0 rounded-lg ${
                            alert.urgency === "urgent"
                              ? "bg-red-600 hover:bg-red-700 text-white border-0"
                              : ""
                          }`}
                          variant={alert.urgency === "urgent" ? "default" : "outline"}
                          data-testid={`button-prepare-${alert.id}`}
                          onClick={() => navigate("/visits")}
                        >
                          {alert.urgency === "urgent" ? "Prepare now" : "Prepare"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Pending Counseling Requests */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                  data-testid="pending-requests"
                >
                  <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <h2 className="text-sm font-semibold text-foreground">Pending Requests</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">via Inupgro</span>
                      <span className="text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                        {PENDING_REQUESTS.length} new
                      </span>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    {PENDING_REQUESTS.map((req) => {
                      const accepted = acceptedIds.has(req.id);
                      const pc = PRIORITY_CONFIG[req.priority as Priority];
                      const priorityAccent: Record<Priority, string> = {
                        high:   "border-l-red-500",
                        medium: "border-l-amber-400",
                        low:    "border-l-slate-300",
                      };
                      return (
                        <div
                          key={req.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border border-l-4 transition-colors cursor-pointer ${
                            accepted
                              ? "bg-green-50/50 border-green-200/60 border-l-green-500"
                              : `bg-muted/20 border-border/60 ${priorityAccent[req.priority as Priority]} hover:bg-muted/50`
                          }`}
                          data-testid={`request-${req.id}`}
                          onClick={() => navigate("/student")}
                        >
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {req.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                              <p className="text-xs font-semibold text-foreground">{req.name}</p>
                              <span className="text-[10px] text-muted-foreground">{req.class}</span>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
                                {pc.label}
                              </span>
                            </div>
                            <p className="text-xs text-foreground/80 mb-0.5">{req.concern}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{req.school}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3" />{req.time}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1.5 shrink-0">
                            {accepted ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-green-700 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />Accepted
                              </span>
                            ) : (
                              <>
                                <Button size="sm" className="h-7 text-[11px] rounded-lg" data-testid={`button-accept-${req.id}`} onClick={(e) => { e.stopPropagation(); acceptRequest(req.id); }}>
                                  Accept
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-[11px] rounded-lg" data-testid={`button-view-${req.id}`} onClick={(e) => { e.stopPropagation(); navigate("/student"); }}>
                                  View
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-5 py-3 border-t border-border/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-muted-foreground">
                        <span className="font-semibold text-foreground">{acceptedIds.size}</span> of {PENDING_REQUESTS.length} accepted
                      </span>
                      <button className="text-[11px] text-primary font-medium flex items-center gap-0.5 hover:underline" onClick={() => navigate("/requests")}>
                        Review all <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(acceptedIds.size / PENDING_REQUESTS.length) * 100}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Upcoming Appointments */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                  data-testid="upcoming-appointments"
                >
                  <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <h2 className="text-sm font-semibold text-foreground">Upcoming Appointments</h2>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-[11px] text-primary hover:text-primary" onClick={() => toast({ title: "Full calendar" })}>
                      View all <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </div>
                  <div className="p-3 space-y-1">
                    {(["today", "upcoming"] as const).map((group) => {
                      const items = APPOINTMENTS.filter((a) =>
                        group === "today" ? a.time.startsWith("Today") : !a.time.startsWith("Today")
                      );
                      if (!items.length) return null;
                      return (
                        <div key={group}>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 py-1.5 mt-1">
                            {group === "today" ? "Today" : "Upcoming"}
                          </p>
                          <div className="space-y-1.5">
                            {items.map((apt) => (
                              <div
                                key={apt.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/60 hover:bg-muted/50 transition-colors cursor-pointer group"
                                data-testid={`appointment-${apt.id}`}
                                onClick={() => navigate("/appointment/detail")}
                              >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  apt.mode === "video" ? "bg-blue-50 text-blue-600" : "bg-primary/10 text-primary"
                                }`}>
                                  {apt.mode === "video" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                    <p className="text-xs font-semibold text-foreground truncate">
                                      {apt.name}{apt.class ? ` · ${apt.class}` : ""}
                                    </p>
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${
                                      apt.mode === "video"
                                        ? "bg-blue-50 text-blue-600 border-blue-200"
                                        : "bg-primary/5 text-primary border-primary/20"
                                    }`}>
                                      {apt.mode === "video" ? "Video" : "In-person"}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground truncate">{apt.type}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-xs font-semibold text-foreground">{apt.time.split(",")[0]}</p>
                                  <p className="text-[10px] text-muted-foreground">{apt.time.split(",")[1]?.trim()}</p>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0 transition-colors" />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Revenue + Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Revenue chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                    data-testid="revenue-chart"
                  >
                    <div className="px-5 pt-4 pb-3 border-b border-border/60">
                      <div className="flex items-center justify-between mb-0.5">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Revenue This Month</h2>
                        <span className="text-[11px] text-green-600 font-semibold flex items-center gap-0.5">
                          <ArrowUpRight className="w-3 h-3" />+12%
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">₹24,500</p>
                    </div>
                    <div className="p-4">
                      <ResponsiveContainer width="100%" height={110}>
                        <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
                          <defs>
                            <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}    />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                          <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                          <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#rev-grad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs">
                        <div>
                          <p className="text-muted-foreground">Pending payout</p>
                          <p className="font-semibold text-foreground">₹6,300</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">This week</p>
                          <p className="font-semibold text-foreground">₹8,200</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Sessions analytics */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                    data-testid="analytics-widget"
                  >
                    <div className="px-5 pt-4 pb-3 border-b border-border/60">
                      <div className="flex items-center justify-between mb-0.5">
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sessions This Week</h2>
                        <span className="text-[10px] text-muted-foreground">47 total / month</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">47</p>
                    </div>
                    <div className="p-4">
                      <ResponsiveContainer width="100%" height={110}>
                        <BarChart data={SESSIONS_DATA} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="font-semibold text-foreground">4.9</span>
                          <span className="text-muted-foreground">avg rating</span>
                        </div>
                        <div className="text-right text-muted-foreground">
                          234 students reached
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-5">

                {/* Profile Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                  data-testid="profile-summary"
                >
                  {/* Profile header strip */}
                  <div className="bg-gradient-to-br from-primary/10 to-primary/4 px-5 pt-5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary font-bold text-base flex items-center justify-center ring-2 ring-primary/20">
                        AS
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-foreground">Dr. Ananya Sharma</p>
                          <BadgeCheck className="w-4 h-4 text-green-500 shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground">Clinical Psychologist</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Available for bookings
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-px bg-border">
                    {[
                      { value: "47",  label: "Sessions" },
                      { value: "4.9", label: "Rating"   },
                      { value: "4",   label: "Schools"  },
                    ].map((s) => (
                      <div key={s.label} className="bg-card text-center py-3">
                        <p className="text-sm font-bold text-foreground">{s.value}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Today's schedule summary */}
                  <div className="px-4 py-2.5 border-t border-border/60 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <p className="text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">2 sessions</span> scheduled today
                    </p>
                  </div>
                </motion.div>

                {/* Assigned Schools */}
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.13 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                  data-testid="assigned-schools"
                >
                  <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <h2 className="text-sm font-semibold text-foreground">Assigned Schools</h2>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">{ASSIGNED_SCHOOLS.length} schools</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    {ASSIGNED_SCHOOLS.map((school) => (
                      <div
                        key={school.id}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border-l-4 hover:bg-muted/50 transition-colors cursor-pointer group ${school.borderColor} bg-muted/10`}
                        data-testid={`school-${school.id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{school.name}</p>
                          <p className="text-[10px] text-muted-foreground">{school.city} · {school.students} students</p>
                        </div>
                        {school.pending > 0 ? (
                          <span className="text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full shrink-0">
                            {school.pending} pending
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/50 shrink-0">Clear</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                  data-testid="recent-activity"
                >
                  <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-border/60">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
                    <span className="text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded-full ml-auto">via Inupgro</span>
                  </div>
                  <div className="p-4 space-y-0">
                    {RECENT_ACTIVITY.map((item, i) => {
                      const iconMap: Record<string, React.ReactNode> = {
                        session:  <Video         className="w-3.5 h-3.5 text-blue-600"   />,
                        referral: <Users         className="w-3.5 h-3.5 text-primary"    />,
                        sync:     <Activity      className="w-3.5 h-3.5 text-teal-600"   />,
                        message:  <MessageCircle className="w-3.5 h-3.5 text-primary"    />,
                        report:   <FileText      className="w-3.5 h-3.5 text-amber-600"  />,
                      };
                      const iconBg: Record<string, string> = {
                        session:  "bg-blue-50 border border-blue-100",
                        referral: "bg-primary/10 border border-primary/15",
                        sync:     "bg-teal-50 border border-teal-100",
                        message:  "bg-primary/10 border border-primary/15",
                        report:   "bg-amber-50 border border-amber-100",
                      };
                      return (
                        <div key={item.id} className="flex items-start gap-3 py-2.5 relative" data-testid={`activity-${item.id}`}>
                          {i < RECENT_ACTIVITY.length - 1 && (
                            <div className="absolute left-[15px] top-9 bottom-0 w-0.5 bg-border" />
                          )}
                          <div className={`w-8 h-8 rounded-xl ${iconBg[item.type]} flex items-center justify-center shrink-0 z-10`}>
                            {iconMap[item.type]}
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <p className="text-xs text-foreground leading-snug">{item.text}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ——— SESSION LAUNCHER MODAL ——— */}
      <AnimatePresence>
        {showSessionLauncher && (
          <>
            {/* Backdrop */}
            <motion.div
              key="session-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setShowSessionLauncher(false)}
            />
            {/* Dialog */}
            <motion.div
              key="session-dialog"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
                data-testid="session-launcher-modal"
              >
                {/* Accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-primary to-blue-400" />

                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Start a Session</p>
                      <p className="text-[11px] text-muted-foreground">Today's scheduled sessions</p>
                    </div>
                  </div>
                  <button
                    ref={sessionLauncherCloseRef}
                    onClick={() => setShowSessionLauncher(false)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    data-testid="session-launcher-close"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Session list */}
                <div className="px-6 py-4 space-y-3">
                  {todaySessions.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-2xl bg-muted mx-auto mb-3 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">No sessions scheduled for today</p>
                      <p className="text-xs text-muted-foreground mb-4">Your schedule is clear — nothing booked for today.</p>
                      <button
                        className="text-xs text-primary font-medium hover:underline"
                        onClick={() => { setShowSessionLauncher(false); navigate("/appointment"); }}
                      >
                        Schedule one →
                      </button>
                    </div>
                  ) : (
                    todaySessions.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                        data-testid={`session-item-${apt.id}`}
                      >
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          apt.mode === "video" ? "bg-blue-50 text-blue-600" : "bg-primary/10 text-primary"
                        }`}>
                          {apt.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <p className="text-xs font-semibold text-foreground truncate">
                              {apt.name}{apt.class ? ` · ${apt.class}` : ""}
                            </p>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${
                              apt.mode === "video"
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : "bg-primary/5 text-primary border-primary/20"
                            }`}>
                              {apt.mode === "video" ? "Video" : "In-person"}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">{apt.type}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 shrink-0" />
                            {apt.time.replace("Today, ", "")}
                          </p>
                        </div>

                        {/* CTA */}
                        <Button
                          size="sm"
                          className="h-8 text-xs shrink-0 gap-1.5 rounded-xl"
                          onClick={() => { setShowSessionLauncher(false); navigate("/appointment/detail"); }}
                          data-testid={`button-join-${apt.id}`}
                        >
                          {apt.mode === "video" ? (
                            <><Video className="w-3.5 h-3.5" />Join</>
                          ) : (
                            <><MapPin className="w-3.5 h-3.5" />Start</>
                          )}
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 pt-1 border-t border-border flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">
                    {todaySessions.length} session{todaySessions.length !== 1 ? "s" : ""} today
                  </p>
                  <button
                    className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline"
                    onClick={() => { setShowSessionLauncher(false); navigate("/appointment"); }}
                  >
                    View full schedule <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ——— NOTIFICATION PANEL ——— */}
      <AnimatePresence>
        {notifOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setNotifOpen(false)}
            />
            <motion.aside
              key="notif-panel"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border shadow-xl z-50 flex flex-col"
              data-testid="notification-panel"
            >
              <div className="h-16 px-5 flex items-center justify-between border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs text-primary hover:underline" onClick={markAllRead}>Mark all read</button>
                  <button className="p-1 rounded-lg hover:bg-muted" onClick={() => setNotifOpen(false)}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 p-3 rounded-xl border transition-colors ${
                      n.read ? "bg-muted/20 border-border" : "bg-card border-border shadow-sm"
                    }`}
                    data-testid={`notification-${n.id}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${n.color.split("  ")[0]} ${n.color.split("  ")[1]}`}>
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${n.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                        {n.text}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
