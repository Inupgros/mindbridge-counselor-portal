import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Menu, BadgeCheck, Calendar, LayoutDashboard, Users, IndianRupee,
  BarChart2, Settings, School, Download, RefreshCw, Filter,
  MapPin, Globe, BookOpen, Languages, UserCheck, TrendingUp, Lightbulb,
  Star, ArrowUpRight, ChevronDown, ChevronUp, Info,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

/* ─── PALETTE ─────────────────────────────────────── */
const P = {
  primary:  "hsl(var(--primary))",
  blue:     "#3B82F6",
  blue2:    "#2563eb",
  amber:    "#F59E0B",
  green:    "#10B981",
  red:      "#EF4444",
  teal:     "#14B8A6",
  rose:     "#F43F5E",
  indigo:   "#6366F1",
  orange:   "#F97316",
  slate:    "#64748B",
};

/* ─── DATA ────────────────────────────────────────── */

const AGE_DATA = [
  { age: "13 yrs", count: 2  },
  { age: "14 yrs", count: 3  },
  { age: "15 yrs", count: 8  },
  { age: "16 yrs", count: 11 },
  { age: "17 yrs", count: 14 },
  { age: "18 yrs", count: 10 },
];

const GENDER_DATA = [
  { name: "Male",                  value: 27, color: P.blue,   pct: 56 },
  { name: "Female",                value: 19, color: P.rose,   pct: 40 },
  { name: "Prefer not to disclose",value:  2, color: P.slate,  pct:  4 },
];

const BLUE_GRAD = "linear-gradient(to right, hsl(var(--primary)), #2563eb)";
const SCHOOL_PIE_FILLS = [P.primary, "#2563eb", "#3b82f6", "#93c5fd"];
const LANG_PIE_FILLS   = [P.primary, "#2563eb", "#3b82f6"];

const CITY_DATA = [
  { city: "Rohini",        count: 18, pct: 38, color: BLUE_GRAD },
  { city: "West Delhi",    count: 14, pct: 29, color: BLUE_GRAD },
  { city: "South Delhi",   count:  8, pct: 17, color: BLUE_GRAD },
  { city: "Central Delhi", count:  4, pct:  8, color: BLUE_GRAD },
  { city: "East Delhi",    count:  2, pct:  4, color: BLUE_GRAD },
  { city: "North Delhi",   count:  2, pct:  4, color: BLUE_GRAD },
];

const STATE_DATA = [
  { state: "Delhi",         count: 38, pct: 79, color: BLUE_GRAD },
  { state: "Haryana",       count:  6, pct: 13, color: BLUE_GRAD },
  { state: "Uttar Pradesh", count:  3, pct:  6, color: BLUE_GRAD },
  { state: "Rajasthan",     count:  1, pct:  2, color: BLUE_GRAD },
];

const SCHOOL_TYPE_DATA = [
  { type: "CBSE Private", count: 28, pct: 58, color: BLUE_GRAD },
  { type: "CBSE Govt",    count:  8, pct: 17, color: BLUE_GRAD },
  { type: "ICSE",         count:  8, pct: 17, color: BLUE_GRAD },
  { type: "IB",           count:  4, pct:  8, color: BLUE_GRAD },
];

const CLASS_DATA = [
  { cls: "Class 8",  count:  5, fill: "#bfdbfe" },
  { cls: "Class 9",  count:  7, fill: "#93c5fd" },
  { cls: "Class 10", count: 12, fill: "#60a5fa" },
  { cls: "Class 11", count: 14, fill: "#3b82f6" },
  { cls: "Class 12", count: 10, fill: P.primary },
];

const PARENT_DATA = [
  { label: "High (all sessions)", count: 12, pct: 25, color: BLUE_GRAD },
  { label: "Medium (sometimes)",  count: 24, pct: 50, color: BLUE_GRAD },
  { label: "Low (minimal)",       count: 10, pct: 21, color: BLUE_GRAD },
  { label: "No engagement",       count:  2, pct:  4, color: BLUE_GRAD },
];

const LANGUAGE_DATA = [
  { lang: "Hindi",     count: 28, pct: 58, color: BLUE_GRAD },
  { lang: "English",   count: 16, pct: 33, color: BLUE_GRAD },
  { lang: "Bilingual", count:  4, pct:  8, color: BLUE_GRAD },
];

const CAREER_CLUSTERS = [
  { cluster: "STEM",               count: 27, pct: 56, color: BLUE_GRAD,
    sub: ["Engineering/Technology (18)", "Medical/Life Sciences (9)"] },
  { cluster: "Business & Commerce", count:  8, pct: 17, color: BLUE_GRAD,
    sub: ["Finance & Accounting (5)", "Entrepreneurship (3)"] },
  { cluster: "Arts & Design",      count:  7, pct: 15, color: BLUE_GRAD,
    sub: ["Visual Arts/Design (4)", "Performing Arts (3)"] },
  { cluster: "Humanities & Law",   count:  4, pct:  8, color: BLUE_GRAD,
    sub: ["Law (2)", "Social Sciences (2)"] },
  { cluster: "Undecided",          count:  2, pct:  4, color: BLUE_GRAD,
    sub: ["Need career clarity sessions"] },
];

const OPPORTUNITY_REGIONS = [
  {
    id: "rohini", city: "Rohini", state: "Delhi",
    students: 18, schools: 1, density: "High",
    densityColor: P.green, opportunity: 92,
    note: "Strong base — school expansion possible. 2 nearby schools not yet partnered.",
    badge: "Expand",
  },
  {
    id: "west-delhi", city: "West Delhi", state: "Delhi",
    students: 14, schools: 2, density: "High",
    densityColor: P.green, opportunity: 88,
    note: "St. Xavier's + Springdales + DPS Dwarka present. High engagement rates.",
    badge: "Nurture",
  },
  {
    id: "south-delhi", city: "South Delhi", state: "Delhi",
    students: 8, schools: 1, density: "Medium",
    densityColor: P.blue, opportunity: 74,
    note: "Strong urban demand. 4+ private schools untapped. High-income catchment.",
    badge: "Grow",
  },
  {
    id: "central-delhi", city: "Central Delhi", state: "Delhi",
    students: 4, schools: 1, density: "Low",
    densityColor: P.amber, opportunity: 61,
    note: "Government school segment — consider fee-flexible tiers for wider reach.",
    badge: "Pilot",
  },
  {
    id: "east-delhi", city: "East Delhi", state: "Delhi",
    students: 2, schools: 0, density: "Untapped",
    densityColor: P.orange, opportunity: 83,
    note: "High student population density. No partnerships yet. High potential.",
    badge: "Priority",
  },
  {
    id: "north-delhi", city: "North Delhi", state: "Delhi",
    students: 2, schools: 0, density: "Untapped",
    densityColor: P.orange, opportunity: 76,
    note: "Several CBSE schools in Pitampura, Shalimar Bagh not yet reached.",
    badge: "Explore",
  },
];

const NAV_ITEMS = [
  { id: "dashboard",    path: "/dashboard",    icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: "Dashboard"    },
  { id: "students",     path: "/requests",     icon: <Users           className="w-4.5 h-4.5" />, label: "Students"     },
  { id: "appointments", path: "/appointment",  icon: <Calendar        className="w-4.5 h-4.5" />, label: "Appointments" },
  { id: "schools",      path: "/visits",       icon: <School          className="w-4.5 h-4.5" />, label: "Schools"      },
  { id: "revenue",      path: "/revenue",      icon: <IndianRupee     className="w-4.5 h-4.5" />, label: "Revenue"      },
  { id: "reports",      path: "/analytics",    icon: <BarChart2       className="w-4.5 h-4.5" />, label: "Reports"      },
  { id: "demographics", path: "/demographics", icon: <Globe           className="w-4.5 h-4.5" />, label: "Demographics" },
  { id: "settings",     path: "/settings",     icon: <Settings        className="w-4.5 h-4.5" />, label: "Settings"     },
];

/* ─── SMALL HELPERS ───────────────────────────────── */

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg px-3 py-2 text-xs">
      {label && <p className="font-semibold text-foreground mb-1">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color ?? p.fill }} className="leading-5">
          {p.name ?? p.dataKey}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const PieTip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
      <p className="text-foreground">{payload[0].value} students · {payload[0].payload.pct}%</p>
    </div>
  );
};

function SectionCard({ testid, icon, title, sub, children, action }: {
  testid: string; icon: React.ReactNode; title: string; sub?: string; children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid={testid}>
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between gap-3 bg-muted/20">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function HBar({ label, count, pct, total, color, testid }: {
  label: string; count: number; pct: number; total: number; color: string; testid: string;
}) {
  return (
    <div className="flex items-center gap-3" data-testid={testid}>
      <p className="text-xs text-foreground w-24 shrink-0 truncate">{label}</p>
      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-2 rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
      <p className="text-xs font-bold text-foreground w-5 text-right shrink-0">{count}</p>
      <p className="text-[10px] text-muted-foreground w-8 text-right shrink-0">{pct}%</p>
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────── */

export default function DemographicsScreen({ mobile = "9876543210" }: { mobile?: string }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedCluster, setExpandedCluster] = useState<string | null>("STEM");
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [activeGender, setActiveGender] = useState<number | null>(null);

  return (
    <div className="h-screen bg-background flex overflow-hidden">

      {/* ── SIDEBAR ── */}
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 220, opacity: 1 }}
          transition={{ duration: 0.22 }}
          className="bg-card border-r border-border flex flex-col shrink-0 overflow-hidden"
          data-testid="demographics-sidebar"
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
                  item.id === "demographics"
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

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-card/95 backdrop-blur border-b border-border flex items-center gap-3 px-4 sm:px-6 shrink-0" data-testid="demographics-header">
          <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-toggle-sidebar">
            <Menu className="w-4.5 h-4.5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Demographic Analysis</p>
              <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full" data-testid="demographics-period-badge">Jan–Apr 2026</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">48 students · 4 schools · Delhi NCR cohort · Dr. Ananya Sharma</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-export-demographics"
              onClick={() => toast({ title: "Exporting demographics", description: "Demographic analysis PDF being prepared." })}>
              <Download className="w-3.5 h-3.5" /><span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-refresh-demographics"
              onClick={() => toast({ title: "Refreshed", description: "Demographics synced with Inupgro." })}>
              <RefreshCw className="w-3.5 h-3.5" /><span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto" data-testid="demographics-body">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

            {/* ── SUMMARY BAND ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="demographics-summary-band">
              {[
                { testid: "summary-total",   label: "Total Students", value: "48",  sub: "4 schools",         color: "text-primary",   bg: "bg-primary/8",   icon: <Users className="w-4 h-4" /> },
                { testid: "summary-states",  label: "States Covered", value: "4",   sub: "Delhi-NCR dominant",color: "text-blue-600",  bg: "bg-blue-50",     icon: <Globe className="w-4 h-4" /> },
                { testid: "summary-types",   label: "School Types",   value: "4",   sub: "CBSE, ICSE, IB",    color: "text-primary",   bg: "bg-primary/10",  icon: <School className="w-4 h-4" /> },
                { testid: "summary-avg-age", label: "Average Age",    value: "16.4",sub: "yrs (range 13–18)",  color: "text-amber-600", bg: "bg-amber-50",    icon: <Calendar className="w-4 h-4" /> },
              ].map((s) => (
                <motion.div key={s.testid} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3" data-testid={s.testid}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg} ${s.color}`}>{s.icon}</div>
                  <div>
                    <p className="text-xl font-bold text-foreground leading-none">{s.value}</p>
                    <p className="text-xs font-semibold text-foreground mt-0.5">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── ROW 1: AGE + GENDER ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="section-age-gender">

              {/* Age groups */}
              <SectionCard testid="section-age-groups" icon={<Users className="w-4 h-4" />}
                title="Age Group Distribution" sub="Individual year breakdown (13–18 yrs)">
                <div className="p-5 space-y-3" data-testid="age-groups-content">
                  {AGE_DATA.map((d) => (
                    <HBar key={d.age} testid={`age-bar-${d.age.replace(" ", "-")}`}
                      label={d.age} count={d.count} pct={Math.round(d.count / 48 * 100)}
                      total={48} color={d.count >= 8 ? P.primary : P.slate} />
                  ))}
                  <div className="pt-3 border-t border-border grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-base font-bold text-primary">16.4</p>
                      <p className="text-[10px] text-muted-foreground">Avg age (yrs)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-base font-bold text-foreground">17</p>
                      <p className="text-[10px] text-muted-foreground">Median age</p>
                    </div>
                    <div className="text-center">
                      <p className="text-base font-bold text-foreground">13–18</p>
                      <p className="text-[10px] text-muted-foreground">Range</p>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Gender distribution */}
              <SectionCard testid="section-gender" icon={<UserCheck className="w-4 h-4" />}
                title="Gender Distribution" sub="Self-reported · privacy-first display">
                <div className="p-5" data-testid="gender-content">
                  <div className="flex gap-4 items-center">
                    <div className="w-44 shrink-0" data-testid="gender-pie-chart">
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie
                            data={GENDER_DATA} dataKey="value" nameKey="name"
                            cx="50%" cy="50%" innerRadius={44} outerRadius={68}
                            paddingAngle={3}
                            activeIndex={activeGender ?? undefined}
                            onMouseEnter={(_, i) => setActiveGender(i)}
                            onMouseLeave={() => setActiveGender(null)}
                          >
                            {GENDER_DATA.map((d) => (
                              <Cell key={d.name} fill={d.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<PieTip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-4" data-testid="gender-legend">
                      {GENDER_DATA.map((d, i) => (
                        <div key={d.name} data-testid={`gender-row-${i}`}
                          className="cursor-default"
                          onMouseEnter={() => setActiveGender(i)}
                          onMouseLeave={() => setActiveGender(null)}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                              <p className="text-xs text-foreground">{d.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground">{d.value}</span>
                              <span className="text-[10px] text-muted-foreground w-7 text-right">{d.pct}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <motion.div className="h-1.5 rounded-full" style={{ background: d.color }}
                              initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 0.7, delay: i * 0.1 }} />
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-border">
                        <p className="text-[10px] text-muted-foreground italic">Gender data is self-reported and voluntary. 2 students opted out of disclosure.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ── ROW 2: CITY + STATE ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="section-city-state">

              {/* City distribution */}
              <SectionCard testid="section-city-distribution" icon={<MapPin className="w-4 h-4" />}
                title="City-wise Distribution" sub="Student density by city across Delhi NCR">
                <div className="p-5 space-y-3" data-testid="city-distribution-content">
                  {CITY_DATA.map((d) => (
                    <HBar key={d.city} testid={`city-bar-${d.city.replace(/\s+/g, "-").toLowerCase()}`}
                      label={d.city} count={d.count} pct={d.pct} total={48} color={d.color} />
                  ))}
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="font-semibold text-foreground">Rohini + West Delhi</span>
                      <span>account for 67% of the cohort. Strong urban concentration.</span>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* State-wise */}
              <SectionCard testid="section-state-distribution" icon={<Globe className="w-4 h-4" />}
                title="State-wise Distribution" sub="Home state of students (self-reported)">
                <div className="p-5" data-testid="state-distribution-content">
                  <div className="space-y-4">
                    {STATE_DATA.map((d) => (
                      <div key={d.state} data-testid={`state-bar-${d.state.replace(/\s+/g, "-").toLowerCase()}`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-foreground">{d.state}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-foreground">{d.count}</span>
                            <span className="text-[10px] text-muted-foreground w-7 text-right">{d.pct}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <motion.div className="h-3 rounded-full" style={{ background: d.color }}
                            initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 0.8 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-primary/5 border border-primary/15 rounded-xl" data-testid="state-insight">
                    <p className="text-[10px] text-primary font-semibold mb-0.5">Geographic insight</p>
                    <p className="text-[10px] text-muted-foreground">79% of students are Delhi-based. Cross-state students (Haryana 13%, UP 6%, Rajasthan 2%) are predominantly from school-adjacent regions, suggesting school-commute overlap.</p>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ── ROW 3: SCHOOL TYPE + CLASS SEGMENT ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="section-school-class">

              {/* School type */}
              <SectionCard testid="section-school-type" icon={<School className="w-4 h-4" />}
                title="School Type Distribution" sub="Curriculum board breakdown across 4 school types">
                <div className="p-5">
                  <div className="flex gap-4 items-center">
                    <div className="w-44 shrink-0" data-testid="school-type-pie">
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie data={SCHOOL_TYPE_DATA} dataKey="count" nameKey="type"
                            cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={3}>
                            {SCHOOL_TYPE_DATA.map((d, i) => <Cell key={d.type} fill={SCHOOL_PIE_FILLS[i]} />)}
                          </Pie>
                          <Tooltip content={<PieTip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1" data-testid="school-type-legend">
                      {SCHOOL_TYPE_DATA.map((d, i) => (
                        <div key={d.type} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
                          data-testid={`school-type-row-${d.type.replace(/\s+/g, "-").toLowerCase()}`}>
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: SCHOOL_PIE_FILLS[i] }} />
                            <p className="text-xs text-foreground">{d.type}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-foreground">{d.count}</p>
                            <p className="text-[10px] text-muted-foreground w-7 text-right">{d.pct}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Class segment */}
              <SectionCard testid="section-class-segment" icon={<BookOpen className="w-4 h-4" />}
                title="Class / Grade Segment" sub="Student count per class — 48 total">
                <div className="p-5" data-testid="class-segment-content">
                  <div data-testid="class-segment-chart">
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart data={CLASS_DATA} barSize={28} margin={{ top: 4, right: 8, left: -24, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="cls" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<Tip />} />
                        <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]}>
                          {CLASS_DATA.map((d) => <Cell key={d.cls} fill={d.fill} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 mt-2" data-testid="class-segment-grid">
                    {CLASS_DATA.map((d) => (
                      <div key={d.cls} className="text-center" data-testid={`class-cell-${d.cls.replace(" ", "-").toLowerCase()}`}>
                        <p className="text-sm font-bold text-foreground">{d.count}</p>
                        <p className="text-[10px] text-muted-foreground">{d.cls.replace("Class ", "Cls ")}</p>
                        <p className="text-[9px] text-muted-foreground">{Math.round(d.count / 48 * 100)}%</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-[10px] text-muted-foreground border-t border-border pt-2">
                    Peak segment: <span className="font-semibold text-primary">Class 11 (14 students · 29%)</span> — pre-board career decision stage.
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ── ROW 4: PARENT INVOLVEMENT + LANGUAGE ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="section-parent-language">

              {/* Parent involvement */}
              <SectionCard testid="section-parent-involvement" icon={<UserCheck className="w-4 h-4" />}
                title="Parent Involvement Level" sub="Counselor-assessed engagement across 48 families">
                <div className="p-5 space-y-3" data-testid="parent-involvement-content">
                  {PARENT_DATA.map((d) => (
                    <div key={d.label} data-testid={`parent-bar-${d.label.split(" ")[0].toLowerCase()}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                          <p className="text-xs text-foreground">{d.label}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-foreground">{d.count}</span>
                          <span className="text-[10px] text-muted-foreground w-7 text-right">{d.pct}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <motion.div className="h-2.5 rounded-full" style={{ background: d.color }}
                          initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-border space-y-1.5">
                    <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-xl" data-testid="parent-insight-high">
                      <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <p className="text-[10px] text-green-800">75% of families show at least medium engagement — healthy for school-counselor programs.</p>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl" data-testid="parent-insight-low">
                      <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <p className="text-[10px] text-amber-800">12 students (25%) have low or no family engagement — flag for priority outreach sessions.</p>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Language preference */}
              <SectionCard testid="section-language-preference" icon={<Languages className="w-4 h-4" />}
                title="Language Preference" sub="Preferred language for counseling sessions">
                <div className="p-5" data-testid="language-preference-content">
                  <div className="flex gap-4 items-center mb-4">
                    <div className="w-40 shrink-0" data-testid="language-pie-chart">
                      <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                          <Pie data={LANGUAGE_DATA} dataKey="count" nameKey="lang"
                            cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={4}>
                            {LANGUAGE_DATA.map((d, i) => <Cell key={d.lang} fill={LANG_PIE_FILLS[i]} />)}
                          </Pie>
                          <Tooltip content={<PieTip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-3">
                      {LANGUAGE_DATA.map((d, i) => (
                        <div key={d.lang} data-testid={`language-row-${d.lang.toLowerCase()}`}>
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ background: LANG_PIE_FILLS[i] }} />
                              <p className="text-xs font-semibold text-foreground">{d.lang}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground">{d.count}</span>
                              <span className="text-[10px] text-muted-foreground w-7 text-right">{d.pct}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <motion.div className="h-2 rounded-full" style={{ background: d.color }}
                              initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 0.7 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-primary/5 border border-primary/15 rounded-xl" data-testid="language-insight">
                    <p className="text-[10px] text-primary font-semibold mb-0.5">Session planning note</p>
                    <p className="text-[10px] text-muted-foreground">Hindi is preferred by 58% of students — group workshops should be conducted bilingually. 4 bilingual students can benefit from either medium.</p>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ── CAREER INTEREST CLUSTERS ── */}
            <SectionCard testid="section-career-clusters" icon={<TrendingUp className="w-4 h-4" />}
              title="Career Interest Clusters" sub="Grouped interest areas from student assessments — click a cluster to expand sub-interests">
              <div className="p-5 space-y-2" data-testid="career-clusters-content">
                {CAREER_CLUSTERS.map((c, i) => {
                  const expanded = expandedCluster === c.cluster;
                  return (
                    <div key={c.cluster} data-testid={`cluster-row-${i}`}
                      className="border border-border rounded-xl overflow-hidden">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                        data-testid={`cluster-toggle-${i}`}
                        onClick={() => setExpandedCluster(expanded ? null : c.cluster)}
                      >
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                        <p className="text-sm font-semibold text-foreground flex-1">{c.cluster}</p>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="w-32 bg-muted rounded-full h-2 overflow-hidden">
                            <motion.div className="h-2 rounded-full" style={{ background: c.color }}
                              initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                          </div>
                          <span className="text-xs font-bold text-foreground w-5 text-right">{c.count}</span>
                          <span className="text-[10px] text-muted-foreground w-7 text-right">{c.pct}%</span>
                          {expanded
                            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                        </div>
                      </button>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-3 border-t border-border bg-muted/10"
                          data-testid={`cluster-detail-${i}`}
                        >
                          <div className="pt-2 flex flex-wrap gap-2">
                            {c.sub.map((s) => (
                              <span key={s} className="text-[11px] px-2.5 py-1 rounded-lg border border-border bg-card text-foreground">{s}</span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
                <div className="pt-2 flex items-start gap-2 text-[10px] text-muted-foreground">
                  <Info className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
                  <span>STEM cluster (56%) dominates. Consider group career exploration sessions for Engineering and Medical tracks — 57% of all students fall in STEM-aligned interests.</span>
                </div>
              </div>
            </SectionCard>

            {/* ── HIGH-OPPORTUNITY REGIONS ── */}
            <SectionCard testid="section-opportunity-regions" icon={<Lightbulb className="w-4 h-4" />}
              title="High-Opportunity Regions" sub="Expansion intelligence — density, potential, and growth strategy per region">
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" data-testid="opportunity-regions-grid">
                {OPPORTUNITY_REGIONS.map((r) => {
                  const expanded = expandedRegion === r.id;
                  const scoreColor = "hsl(var(--primary))";
                  return (
                    <div key={r.id}
                      className={`border rounded-2xl overflow-hidden transition-all ${expanded ? "border-primary/40 shadow-sm" : "border-border"}`}
                      data-testid={`region-card-${r.id}`}>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-bold text-foreground">{r.city}</p>
                            <p className="text-[10px] text-muted-foreground">{r.state}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              r.density === "High"     ? "bg-green-100 text-green-700" :
                              r.density === "Medium"   ? "bg-blue-100 text-blue-700"   :
                              r.density === "Low"      ? "bg-amber-100 text-amber-700"  :
                              "bg-orange-100 text-orange-700"
                            }`} data-testid={`region-density-${r.id}`}>{r.density}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary`}
                              data-testid={`region-badge-${r.id}`}>{r.badge}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1">
                            <p className="text-[10px] text-muted-foreground mb-1">Opportunity Score</p>
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                              <motion.div className="h-2 rounded-full" style={{ background: scoreColor }}
                                initial={{ width: 0 }} animate={{ width: `${r.opportunity}%` }} transition={{ duration: 0.8 }} />
                            </div>
                          </div>
                          <p className="text-lg font-bold shrink-0" style={{ color: scoreColor }}
                            data-testid={`region-score-${r.id}`}>{r.opportunity}</p>
                        </div>

                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                          <span><span className="font-semibold text-foreground">{r.students}</span> students</span>
                          <span><span className="font-semibold text-foreground">{r.schools}</span> school{r.schools !== 1 ? "s" : ""}</span>
                        </div>

                        <button
                          className="mt-3 w-full text-[10px] text-primary font-semibold flex items-center justify-center gap-1 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors"
                          data-testid={`region-expand-${r.id}`}
                          onClick={() => setExpandedRegion(expanded ? null : r.id)}
                        >
                          {expanded ? "Hide insight" : "View strategy"}
                          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4 border-t border-border bg-muted/10"
                          data-testid={`region-insight-${r.id}`}
                        >
                          <p className="text-[10px] text-muted-foreground pt-3">{r.note}</p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="px-5 pb-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl" data-testid="opportunity-insight">
                  <p className="text-[10px] text-amber-800 font-semibold mb-0.5">Strategic recommendation</p>
                  <p className="text-[10px] text-amber-700">East Delhi (score 83) and North Delhi (score 76) are high-opportunity untapped regions with zero school partnerships. Immediate outreach to CBSE schools in Pitampura, Shalimar Bagh, and Preet Vihar recommended.</p>
                </div>
              </div>
            </SectionCard>

            <div className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
