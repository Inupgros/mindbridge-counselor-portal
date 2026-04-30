import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Menu, BadgeCheck, Calendar, LayoutDashboard, Users, IndianRupee,
  BarChart2, Settings, School, TrendingUp,
  Download, RefreshCw, GraduationCap, CheckCircle2, Clock,
  UserPlus, Percent, Building2, MapPin, BookOpen, Brain, Target,
  Filter, Layers,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

/* ─── STATIC DATA ──────────────────────────────────── */

const KPI = {
  total:      48,
  active:     31,
  completed:  12,
  pending:     5,
  requests:   63,
  conversion: 76,
  avgSessions: 2.8,
  newThisMonth: 13,
};

const MONTHLY_GROWTH = [
  { month: "Jan", new: 8,  active: 18, completed: 3,  requests: 11 },
  { month: "Feb", new: 12, active: 24, completed: 6,  requests: 17 },
  { month: "Mar", new: 15, active: 29, completed: 9,  requests: 19 },
  { month: "Apr", new: 13, active: 31, completed: 12, requests: 16 },
];

const SCHOOL_STATS = [
  { school: "DPS Rohini",     city: "Rohini",      total: 18, active: 12, completed: 5, pending: 1, requests: 24, conversion: 75, avgScore: 71 },
  { school: "St. Xavier's",   city: "West Delhi",  total: 15, active: 10, completed: 4, pending: 1, requests: 19, conversion: 79, avgScore: 69 },
  { school: "Springdales",    city: "West Delhi",  total: 10, active:  6, completed: 3, pending: 1, requests: 13, conversion: 77, avgScore: 73 },
  { school: "DPS Dwarka",     city: "West Delhi",  total:  5, active:  3, completed: 0, pending: 2, requests:  7, conversion: 71, avgScore: 66 },
];

const CITY_DATA = [
  { city: "Rohini",        students: 18, color: "hsl(var(--primary))" },
  { city: "West Delhi",    students: 20, color: "#2563eb"              },
  { city: "South Delhi",   students:  6, color: "#3b82f6"              },
  { city: "Central Delhi", students:  4, color: "#93c5fd"              },
];

const CLASS_DATA = [
  { class: "Class 8",  students: 5,  active: 3, completed: 2 },
  { class: "Class 9",  students: 7,  active: 5, completed: 1 },
  { class: "Class 10", students: 12, active: 8, completed: 3 },
  { class: "Class 11", students: 14, active: 9, completed: 3 },
  { class: "Class 12", students: 10, active: 6, completed: 3 },
];

const AGE_DATA = [
  { range: "13–14", students: 5,  fill: "#93c5fd" },
  { range: "15–16", students: 19, fill: "#2563eb"  },
  { range: "17–18", students: 24, fill: "hsl(var(--primary))" },
];

const CAREER_INTEREST = [
  { interest: "Engineering / Technology", count: 18, pct: 38 },
  { interest: "Medical / Life Sciences",  count:  9, pct: 19 },
  { interest: "Commerce / Finance",       count:  8, pct: 17 },
  { interest: "Arts / Design / Media",    count:  7, pct: 15 },
  { interest: "Law / Humanities",         count:  4, pct:  8 },
  { interest: "Undecided",               count:  2, pct:  4 },
];

const CAREER_COLORS = [
  "hsl(var(--primary))", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe",
];

const ASSESSMENT_RADAR = [
  { dimension: "Career Clarity",    avg: 67, benchmark: 70 },
  { dimension: "Academic",          avg: 72, benchmark: 70 },
  { dimension: "Self-Awareness",    avg: 75, benchmark: 70 },
  { dimension: "Social-Emotional",  avg: 68, benchmark: 70 },
  { dimension: "Exam Preparedness", avg: 64, benchmark: 70 },
];

const ASSESSMENT_DIST = [
  { range: "< 50",   students: 4,  label: "Needs Support" },
  { range: "50–64",  students: 11, label: "Developing"    },
  { range: "65–79",  students: 22, label: "On Track"      },
  { range: "80–100", students: 11, label: "Strong"        },
];

const URGENCY_DATA = [
  { label: "Critical", count: 5, color: "#EF4444" },
  { label: "High",     count: 14, color: "#F59E0B" },
  { label: "Medium",   count: 20, color: "#3B82F6"  },
  { label: "Low",      count: 9,  color: "#10B981"  },
];

const NAV_ITEMS = [
  { id: "dashboard",    path: "/dashboard",     icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: "Dashboard"    },
  { id: "students",     path: "/requests",      icon: <Users           className="w-4.5 h-4.5" />, label: "Students"     },
  { id: "appointments", path: "/appointment",   icon: <Calendar        className="w-4.5 h-4.5" />, label: "Appointments" },
  { id: "schools",      path: "/visits",        icon: <School          className="w-4.5 h-4.5" />, label: "Schools"      },
  { id: "revenue",      path: "/revenue",       icon: <IndianRupee     className="w-4.5 h-4.5" />, label: "Revenue"      },
  { id: "reports",      path: "/analytics",     icon: <BarChart2       className="w-4.5 h-4.5" />, label: "Reports"      },
  { id: "settings",     path: "/settings",      icon: <Settings        className="w-4.5 h-4.5" />, label: "Settings"     },
];

/* ─── HELPERS ─────────────────────────────────────── */

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color ?? p.stroke }} className="leading-5">
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold" style={{ color: payload[0].payload.fill ?? payload[0].payload.color }}>{payload[0].name}</p>
      <p className="text-foreground">{payload[0].value} students</p>
    </div>
  );
};

/* ─── CHART LEGEND ────────────────────────────────── */
function ChartLegend({ items }: { items: { color: string; label: string; dashed?: boolean }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-3">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: item.color, opacity: item.dashed ? 0.6 : 1 }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/* ─── SECTION HEADER ─────────────────────────────── */
function SectionHeader({ icon, title, sub, testid, accentBar = "bg-primary" }: {
  icon: React.ReactNode; title: string; sub?: string; testid: string; accentBar?: string;
}) {
  return (
    <>
      <div className={`h-1 w-full ${accentBar}`} />
      <div className="px-5 py-3.5 border-b border-border flex items-center gap-2 bg-muted/20" data-testid={`${testid}-header`}>
        <span className="text-primary">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </div>
    </>
  );
}

/* ─── COMPONENT ────────────────────────────────────── */

export default function StudentAnalyticsScreen({ mobile = "9876543210" }: { mobile?: string }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterPeriod, setFilterPeriod]   = useState("All Time (Jan–Apr 2026)");
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  const [schoolSortKey, setSchoolSortKey]   = useState<"total" | "conversion" | "avgScore">("total");

  const sortedSchools = [...SCHOOL_STATS].sort((a, b) =>
    schoolSortKey === "total"      ? b.total - a.total :
    schoolSortKey === "conversion" ? b.conversion - a.conversion :
    b.avgScore - a.avgScore
  );

  const activePct    = Math.round(KPI.active    / KPI.total * 100);
  const completedPct = Math.round(KPI.completed / KPI.total * 100);
  const pendingPct   = Math.round(KPI.pending   / KPI.total * 100);

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
            data-testid="analytics-sidebar"
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
                <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-card/95 backdrop-blur border-b border-border flex items-center gap-3 px-4 sm:px-6 shrink-0" data-testid="analytics-header">
          <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-toggle-sidebar">
            <Menu className="w-4.5 h-4.5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Student Analytics</p>
              <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full" data-testid="analytics-period-badge">Jan–Apr 2026</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Cohort overview across 4 schools · Dr. Ananya Sharma</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center h-8 gap-1.5 px-3 rounded-xl border border-border bg-background text-xs text-muted-foreground">
              <Filter className="w-3 h-3" />
              <select
                className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                data-testid="filter-period"
              >
                {["All Time (Jan–Apr 2026)", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026"].map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-export-analytics"
              onClick={() => toast({ title: "Exporting analytics", description: "Student analytics PDF being prepared." })}>
              <Download className="w-3.5 h-3.5" /><span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-refresh-analytics"
              onClick={() => toast({ title: "Refreshed", description: "Analytics synced with Inupgro." })}>
              <RefreshCw className="w-3.5 h-3.5" /><span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto" data-testid="analytics-body">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

            {/* ── KPI CARDS ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3" data-testid="kpi-cards">
              <KpiCard index={0} testid="kpi-total"        icon={<Users        className="w-4 h-4" />} label="Total Students"   value={KPI.total}        sub="Across 4 schools"   color="text-primary"   bg="bg-primary/10"  accentBar="bg-primary"   pill="+13 this month"  pillColor="bg-primary/10 text-primary"        />
              <KpiCard index={1} testid="kpi-active"       icon={<TrendingUp   className="w-4 h-4" />} label="Active"           value={KPI.active}       sub="In counseling"      color="text-teal-600"  bg="bg-teal-50"     accentBar="bg-teal-500"  pill={`${activePct}% of cohort`}  pillColor="bg-teal-50 text-teal-700"    suffix="students" />
              <KpiCard index={2} testid="kpi-completed"    icon={<CheckCircle2 className="w-4 h-4" />} label="Completed"        value={KPI.completed}    sub="Full cycle done"    color="text-blue-600"  bg="bg-blue-50"     accentBar="bg-blue-500"  pill={`${completedPct}% of cohort`}  pillColor="bg-blue-50 text-blue-700"  suffix="students" />
              <KpiCard index={3} testid="kpi-pending"      icon={<Clock        className="w-4 h-4" />} label="Pending"          value={KPI.pending}      sub="Awaiting session 1" color="text-amber-600" bg="bg-amber-50"    accentBar="bg-amber-500" pill="Needs follow-up"  pillColor="bg-amber-50 text-amber-700"        suffix="students" />
              <KpiCard index={4} testid="kpi-requests"     icon={<UserPlus     className="w-4 h-4" />} label="Requests"         value={KPI.requests}     sub="Total received"     color="text-primary"   bg="bg-primary/10"  accentBar="bg-primary"   pill="63 total inbound" pillColor="bg-primary/10 text-primary"        suffix="total"    />
              <KpiCard index={5} testid="kpi-conversion"   icon={<Percent      className="w-4 h-4" />} label="Conversion"       value={KPI.conversion}   sub="Requests accepted"  color="text-green-600" bg="bg-green-50"    accentBar="bg-green-500" pill="Above target"  pillColor="bg-green-50 text-green-700"        suffix="%"        />
              <KpiCard index={6} testid="kpi-avg-sessions" icon={<Calendar     className="w-4 h-4" />} label="Avg Sessions"     value={KPI.avgSessions}  sub="Per student"        color="text-rose-600"  bg="bg-rose-50"     accentBar="bg-rose-500"  pill="Per enrolled student" pillColor="bg-rose-50 text-rose-700" suffix="/student" />
            </div>

            {/* ── COHORT SNAPSHOT ── */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-cohort-snapshot">
              <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-primary to-blue-500" />
              <div className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="shrink-0">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                      Cohort Status Breakdown
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Active · Completed · Pending · {KPI.total} students</p>
                  </div>

                  {/* Stacked bar */}
                  <div className="flex-1 min-w-[180px]">
                    <div className="flex rounded-full overflow-hidden h-3 bg-muted">
                      <motion.div
                        className="bg-teal-500 transition-all duration-700"
                        style={{ width: `${activePct}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${activePct}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        title={`Active ${activePct}%`}
                      />
                      <motion.div
                        className="bg-blue-500 transition-all duration-700"
                        style={{ width: `${completedPct}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${completedPct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        title={`Completed ${completedPct}%`}
                      />
                      <motion.div
                        className="bg-amber-400 transition-all duration-700"
                        style={{ width: `${pendingPct}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pendingPct}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        title={`Pending ${pendingPct}%`}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="w-2 h-2 rounded-sm bg-teal-500 shrink-0" />
                        Active <span className="font-semibold text-foreground ml-1">{activePct}%</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="w-2 h-2 rounded-sm bg-blue-500 shrink-0" />
                        Completed <span className="font-semibold text-foreground ml-1">{completedPct}%</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="w-2 h-2 rounded-sm bg-amber-400 shrink-0" />
                        Pending <span className="font-semibold text-foreground ml-1">{pendingPct}%</span>
                      </span>
                    </div>
                  </div>

                  {/* Side stats */}
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Active</p>
                      <p className="text-sm font-bold text-teal-600">{KPI.active}</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Completed</p>
                      <p className="text-sm font-bold text-blue-600">{KPI.completed}</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Pending</p>
                      <p className="text-sm font-bold text-amber-600">{KPI.pending}</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <span className="inline-flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-center">
                      <span className="text-sm font-bold text-green-700 leading-none">{KPI.conversion}% conv.</span>
                      <span className="text-[9px] text-green-600 leading-none">{KPI.avgSessions} avg sessions</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── MONTHLY GROWTH TREND ── */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-monthly-growth">
              <SectionHeader icon={<TrendingUp className="w-4 h-4" />} title="Monthly Growth Trend" sub="New students · Active cohort · Completions · Request volume (Jan–Apr 2026)" testid="section-monthly-growth" accentBar="bg-primary" />
              <div className="px-5 pt-5 pb-4" data-testid="growth-chart">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={MONTHLY_GROWTH} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradActive"    x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor="#14B8A6" stopOpacity={0.2}/><stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/></linearGradient>
                      <linearGradient id="gradNew"       x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.25}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient>
                      <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor="#2563eb" stopOpacity={0.2}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="active"    name="Active"    stroke="#14B8A6"              fill="url(#gradActive)"    strokeWidth={2} dot={{ r: 3, fill: "#14B8A6" }} />
                    <Area type="monotone" dataKey="requests"  name="Requests"  stroke="#F59E0B"              fill="transparent"         strokeWidth={2} strokeDasharray="4 3" dot={{ r: 3, fill: "#F59E0B" }} />
                    <Area type="monotone" dataKey="new"       name="New"       stroke="hsl(var(--primary))"  fill="url(#gradNew)"       strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
                    <Area type="monotone" dataKey="completed" name="Completed" stroke="#2563eb"              fill="url(#gradCompleted)" strokeWidth={2} dot={{ r: 3, fill: "#2563eb" }} />
                  </AreaChart>
                </ResponsiveContainer>
                <ChartLegend items={[
                  { color: "#14B8A6", label: "Active" },
                  { color: "#F59E0B", label: "Requests", dashed: true },
                  { color: "hsl(var(--primary))", label: "New" },
                  { color: "#2563eb", label: "Completed" },
                ]} />
              </div>
            </div>

            {/* ── SCHOOL-WISE STATS TABLE ── */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-school-stats">
              <div className="h-1 w-full bg-primary" />
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">School-wise Breakdown</p>
                    <p className="text-[10px] text-muted-foreground">Students, completion rate, and assessment performance per school</p>
                  </div>
                </div>
                <div className="flex items-center gap-2" data-testid="school-sort-controls">
                  <p className="text-[10px] text-muted-foreground">Sort by:</p>
                  {(["total", "conversion", "avgScore"] as const).map((key) => (
                    <button
                      key={key}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg transition-all ${schoolSortKey === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                      data-testid={`school-sort-${key}`}
                      onClick={() => setSchoolSortKey(key)}
                    >
                      {key === "total" ? "Total" : key === "conversion" ? "Conversion" : "Score"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto" data-testid="school-stats-table">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">School</th>
                      <th className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">City</th>
                      <th className="text-center px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                      <th className="text-center px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Active</th>
                      <th className="text-center px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Completed</th>
                      <th className="text-center px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pending</th>
                      <th className="text-center px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Requests</th>
                      <th className="text-center px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Conversion</th>
                      <th className="text-center px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Avg Score</th>
                      <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSchools.map((s, idx) => {
                      const completionRate = Math.round(s.completed / s.total * 100);
                      return (
                        <React.Fragment key={s.school}>
                          <tr
                            className={`group border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors ${expandedSchool === s.school ? "bg-muted/20" : idx === 0 ? "bg-primary/[0.02]" : ""}`}
                            onClick={() => setExpandedSchool(expandedSchool === s.school ? null : s.school)}
                            data-testid={`school-row-${s.school.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
                          >
                            <td className={`py-3 font-semibold text-foreground pl-4 pr-5 border-l-2 transition-colors ${idx === 0 || expandedSchool === s.school ? "border-primary/50" : "border-transparent group-hover:border-primary/30"}`}>{s.school}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" />{s.city}</span>
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-foreground">{s.total}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">{s.active}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">{s.completed}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">{s.pending}</span>
                            </td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{s.requests}</td>
                            <td className="px-4 py-3 text-center">
                              <p className={`font-semibold text-xs ${s.conversion >= 75 ? "text-green-700" : "text-amber-600"}`}>{s.conversion}%</p>
                              <div className="w-12 mx-auto bg-muted rounded-full h-1 mt-1 overflow-hidden">
                                <div className={`h-1 rounded-full ${s.conversion >= 75 ? "bg-green-500" : "bg-amber-400"}`} style={{ width: `${s.conversion}%` }} />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${s.avgScore >= 70 ? "bg-primary/10 text-primary" : "bg-amber-50 text-amber-700"}`}>{s.avgScore}</span>
                            </td>
                            <td className="px-5 py-3 w-32">
                              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-2 rounded-full bg-primary transition-all duration-500"
                                  style={{ width: `${completionRate}%` }}
                                  data-testid={`school-progress-${s.school.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
                                />
                              </div>
                              <p className="text-[9px] text-muted-foreground mt-0.5">{completionRate}% complete</p>
                            </td>
                          </tr>
                          {expandedSchool === s.school && (
                            <tr data-testid={`school-detail-${s.school.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}>
                              <td colSpan={10} className="px-5 py-4 bg-muted/10 border-b border-border">
                                <div className="flex flex-wrap gap-6 text-xs">
                                  <div>
                                    <p className="text-[10px] text-muted-foreground mb-0.5">Active Rate</p>
                                    <p className="font-semibold text-teal-600">{Math.round(s.active / s.total * 100)}%</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground mb-0.5">Completion Rate</p>
                                    <p className="font-semibold text-primary">{Math.round(s.completed / s.total * 100)}%</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground mb-0.5">Requests → Students</p>
                                    <p className="font-semibold text-foreground">{s.requests} → {s.total} accepted</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground mb-0.5">Avg Assessment Score</p>
                                    <p className={`font-bold ${s.avgScore >= 70 ? "text-primary" : "text-amber-600"}`}>{s.avgScore}/100</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-muted-foreground mb-0.5">Score Status</p>
                                    <p className={`font-semibold ${s.avgScore >= 70 ? "text-primary" : "text-amber-600"}`}>{s.avgScore >= 70 ? "Above target" : "Below target (70)"}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/40 border-t-2 border-border" data-testid="school-stats-footer">
                      <td className="px-5 py-3 font-bold text-foreground text-xs" colSpan={2}>Total / Average</td>
                      <td className="px-4 py-3 text-center font-bold text-foreground text-xs">{KPI.total}</td>
                      <td className="px-4 py-3 text-center font-bold text-teal-700 text-xs">{KPI.active}</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-700 text-xs">{KPI.completed}</td>
                      <td className="px-4 py-3 text-center font-bold text-amber-700 text-xs">{KPI.pending}</td>
                      <td className="px-4 py-3 text-center font-bold text-muted-foreground text-xs">{KPI.requests}</td>
                      <td className="px-4 py-3 text-center font-bold text-green-700 text-xs">{KPI.conversion}%</td>
                      <td className="px-4 py-3 text-center font-bold text-primary text-xs">70</td>
                      <td className="px-5 py-3" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* ── CITY + CLASS CHARTS ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" data-testid="section-city-class">

              {/* City-wise */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-city-stats">
                <SectionHeader icon={<MapPin className="w-4 h-4" />} title="City-wise Distribution" sub="Student spread by geography" testid="section-city-stats" accentBar="bg-blue-500" />
                <div className="p-5">
                  <div className="flex gap-4">
                    <div className="flex-1" data-testid="city-pie-chart">
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={CITY_DATA}
                            dataKey="students"
                            nameKey="city"
                            cx="50%" cy="50%"
                            innerRadius={48} outerRadius={72}
                            paddingAngle={3}
                          >
                            {CITY_DATA.map((d, i) => (
                              <Cell key={d.city} fill={d.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<PieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col justify-center gap-2.5 shrink-0" data-testid="city-legend">
                      {CITY_DATA.map((d) => (
                        <div key={d.city} className="flex items-center gap-2" data-testid={`city-row-${d.city.replace(/\s+/g, "-").toLowerCase()}`}>
                          <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                          <p className="text-xs text-foreground">{d.city}</p>
                          <p className="text-xs font-semibold text-foreground ml-auto pl-3">{d.students}</p>
                          <p className="text-[10px] text-muted-foreground w-8 text-right">{Math.round(d.students / KPI.total * 100)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Class-wise */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-class-stats">
                <SectionHeader icon={<BookOpen className="w-4 h-4" />} title="Class-wise Breakdown" sub="Active vs Completed per class" testid="section-class-stats" accentBar="bg-teal-500" />
                <div className="px-5 pt-5 pb-4" data-testid="class-bar-chart">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={CLASS_DATA} barSize={16} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="class" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="students"  name="Total"     fill="hsl(var(--primary))" opacity={0.25} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="active"    name="Active"    fill="#10B981"              radius={[3, 3, 0, 0]} />
                      <Bar dataKey="completed" name="Completed" fill="#3B82F6"              radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <ChartLegend items={[
                    { color: "hsl(var(--primary))", label: "Total" },
                    { color: "#10B981", label: "Active" },
                    { color: "#3B82F6", label: "Completed" },
                  ]} />
                </div>
              </div>
            </div>

            {/* ── AGE GROUP + URGENCY ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" data-testid="section-age-urgency">

              {/* Age group */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-age-stats">
                <SectionHeader icon={<Users className="w-4 h-4" />} title="Age Group Distribution" sub="Student count by age range" testid="section-age-stats" accentBar="bg-primary" />
                <div className="p-5 space-y-4" data-testid="age-breakdown">
                  {AGE_DATA.map((d) => {
                    const pct = Math.round(d.students / KPI.total * 100);
                    return (
                      <div key={d.range} data-testid={`age-row-${d.range.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-semibold text-foreground">{d.range} years</p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-foreground">{d.students}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground">{pct}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            className="h-2.5 rounded-full"
                            style={{ background: d.fill }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground">Dominant group: <span className="font-semibold text-primary">17–18 years (50%)</span></p>
                    <p className="text-[10px] text-muted-foreground">Class 11–12 focus</p>
                  </div>
                </div>
              </div>

              {/* Urgency breakdown */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-urgency-stats">
                <SectionHeader icon={<Target className="w-4 h-4" />} title="Request Urgency Breakdown" sub="Priority level of student requests" testid="section-urgency-stats" accentBar="bg-red-500" />
                <div className="p-5 space-y-3" data-testid="urgency-breakdown">
                  {URGENCY_DATA.map((d) => {
                    const pct = Math.round(d.count / KPI.total * 100);
                    return (
                      <div key={d.label} data-testid={`urgency-row-${d.label.toLowerCase()}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                            <p className="text-xs font-semibold text-foreground">{d.label}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-foreground">{d.count}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground">{pct}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            className="h-2.5 rounded-full"
                            style={{ background: d.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground">
                      <span className="font-semibold text-red-600">5 Critical</span> students need immediate counselor attention.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CAREER INTEREST ── */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-career-interest">
              <SectionHeader icon={<GraduationCap className="w-4 h-4" />} title="Career Interest Distribution" sub="Primary career interest from student assessments — 48 students" testid="section-career-interest" accentBar="bg-amber-400" />
              <div className="p-5">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-3" data-testid="career-interest-bars">
                    {CAREER_INTEREST.map((c, i) => (
                      <div key={c.interest} data-testid={`career-interest-row-${i}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: CAREER_COLORS[i] }} />
                            <p className="text-xs text-foreground">{c.interest}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-bold text-foreground">{c.count}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground w-9 text-right">{c.pct}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            className="h-2.5 rounded-full"
                            style={{ background: CAREER_COLORS[i] }}
                            initial={{ width: 0 }}
                            animate={{ width: `${c.pct}%` }}
                            transition={{ duration: 0.7, delay: i * 0.08 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="lg:w-64 flex flex-col gap-3 shrink-0">
                    <div className="bg-primary/8 border border-primary/20 rounded-2xl overflow-hidden">
                      <div className="h-1 w-full bg-primary" />
                      <div className="p-4">
                        <p className="text-[10px] text-muted-foreground mb-0.5">Top Interest</p>
                        <p className="text-sm font-bold text-primary">Engineering / Technology</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">18 students · 38% of cohort</p>
                      </div>
                    </div>
                    <div className="bg-muted/30 border border-border rounded-2xl overflow-hidden">
                      <div className="h-1 w-full bg-slate-400/60" />
                      <div className="p-4">
                        <p className="text-[10px] text-muted-foreground mb-0.5">Undecided</p>
                        <p className="text-sm font-bold text-foreground">2 students</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Need priority career clarity sessions</p>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
                      <div className="h-1 w-full bg-amber-400" />
                      <div className="p-4">
                        <p className="text-[10px] text-amber-700 mb-0.5">Insight</p>
                        <p className="text-xs font-semibold text-amber-800">STEM-dominant cohort</p>
                        <p className="text-[10px] text-amber-700 mt-0.5">57% interested in Engineering or Medical tracks. Consider group sessions for common topics.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── ASSESSMENT PERFORMANCE ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" data-testid="section-assessment">

              {/* Radar chart */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-assessment-radar">
                <SectionHeader icon={<Brain className="w-4 h-4" />} title="Assessment Dimension Averages" sub="Cohort avg vs 70-point benchmark" testid="section-assessment-radar" accentBar="bg-primary" />
                <div className="px-5 pt-5 pb-0" data-testid="assessment-radar-chart">
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={ASSESSMENT_RADAR} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickCount={4} />
                      <Radar name="Cohort Avg" dataKey="avg"       stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                      <Radar name="Benchmark"  dataKey="benchmark" stroke="#F59E0B"               fill="#F59E0B"               fillOpacity={0.05} strokeWidth={1.5} strokeDasharray="4 3" />
                    </RadarChart>
                  </ResponsiveContainer>
                  <ChartLegend items={[
                    { color: "hsl(var(--primary))", label: "Cohort Avg" },
                    { color: "#F59E0B", label: "Benchmark (70)", dashed: true },
                  ]} />
                </div>
                <div className="px-5 py-4">
                  <div className="grid grid-cols-5 gap-2" data-testid="assessment-scores-grid">
                    {ASSESSMENT_RADAR.map((d) => (
                      <div key={d.dimension} className="text-center" data-testid={`assessment-score-${d.dimension.toLowerCase().replace(/\s+/g, "-")}`}>
                        <p className={`text-sm font-bold ${d.avg >= d.benchmark ? "text-primary" : "text-amber-600"}`}>{d.avg}</p>
                        <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{d.dimension.split("/")[0].trim()}</p>
                        {d.avg < d.benchmark && <p className="text-[8px] text-amber-600 font-semibold">Below</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Score distribution */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-score-distribution">
                <SectionHeader icon={<BarChart2 className="w-4 h-4" />} title="Career Readiness Score Distribution" sub="Overall student readiness score bands" testid="section-score-distribution" accentBar="bg-blue-500" />
                <div className="p-5" data-testid="score-dist-chart">
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={ASSESSMENT_DIST} barSize={36} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="students" name="Students" radius={[4, 4, 0, 0]}>
                        {ASSESSMENT_DIST.map((d, i) => (
                          <Cell key={i} fill={i === 0 ? "#EF4444" : i === 1 ? "#F59E0B" : i === 2 ? "hsl(var(--primary))" : "#2563eb"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border" data-testid="score-dist-legend">
                    {ASSESSMENT_DIST.map((d, i) => (
                      <div key={d.range} className="text-center" data-testid={`score-band-${i}`}>
                        <p className={`text-sm font-bold ${i === 0 ? "text-red-600" : i === 1 ? "text-amber-600" : "text-primary"}`}>{d.students}</p>
                        <p className="text-[10px] font-semibold text-foreground">{d.range}</p>
                        <p className="text-[9px] text-muted-foreground">{d.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── KPI CARD ─────────────────────────────────────── */

function KpiCard({
  testid, icon, label, value, sub, color, bg, accentBar,
  suffix, pill, pillColor, index = 0,
}: {
  testid: string; icon: React.ReactNode; label: string; value: number;
  sub: string; color: string; bg: string; accentBar: string;
  suffix?: string; pill?: string; pillColor?: string; index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
      data-testid={testid}
    >
      <div className={`h-1 w-full ${accentBar}`} />
      <div className="p-4 flex flex-col gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>{icon}</div>
        <div>
          <p className="text-xl font-bold text-foreground leading-none">
            {value}{suffix && <span className="text-sm font-medium text-muted-foreground ml-0.5">{suffix}</span>}
          </p>
          <p className="text-xs font-semibold text-foreground mt-0.5">{label}</p>
        </div>
        {pill && (
          <span className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full ${pillColor ?? "bg-muted text-muted-foreground"}`}>
            {pill}
          </span>
        )}
      </div>
    </motion.div>
  );
}
