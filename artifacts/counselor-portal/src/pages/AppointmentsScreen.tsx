import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Menu, BadgeCheck, Calendar, LayoutDashboard, Users, IndianRupee,
  BarChart2, Settings, School, Video, Phone, MapPin, Clock,
  CheckCircle2, Plus, ChevronLeft, ChevronRight, X, Activity,
  User, Search, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface AppointmentsScreenProps {
  mobile?: string;
}

/* ─── STATIC DATA ──────────────────────────────────── */

const TODAY = new Date(2026, 3, 28); // April 28, 2026

const ALL_APPOINTMENTS = [
  { id: "a01", studentName: "Ananya Roy",       initials: "AR", class: "Class 8",   school: "St. Xavier's",      type: "Follow-up session",      date: new Date(2026,3,28), timeStr: "2:00 PM",  duration: "45 min", mode: "video",     status: "upcoming",   fee: 1500, payStatus: "pending" },
  { id: "a02", studentName: "Rohit Kumar",       initials: "RK", class: "Class 11",  school: "DPS Rohini",        type: "Initial assessment",     date: new Date(2026,3,28), timeStr: "4:30 PM",  duration: "60 min", mode: "in-person", status: "upcoming",   fee: 1500, payStatus: "pending" },
  { id: "a03", studentName: "Priya Mehta",       initials: "PM", class: "Class 12-A",school: "DPS Rohini",        type: "Follow-up + Stress Check",date: new Date(2026,3,27), timeStr: "2:00 PM",  duration: "45 min", mode: "video",     status: "completed",  fee: 1500, payStatus: "paid"    },
  { id: "a04", studentName: "Kavya Singh",       initials: "KS", class: "Class 12",  school: "DPS Rohini",        type: "Career guidance",        date: new Date(2026,3,29), timeStr: "3:00 PM",  duration: "60 min", mode: "video",     status: "scheduled",  fee: 1500, payStatus: "pending" },
  { id: "a05", studentName: "School Visit",      initials: "SV", class: "",           school: "St. Xavier's",      type: "Group counseling",       date: new Date(2026,3,29), timeStr: "10:00 AM", duration: "90 min", mode: "in-person", status: "scheduled",  fee: 0,    payStatus: "na"      },
  { id: "a06", studentName: "Arjun Mehta",       initials: "AM", class: "Class 9",   school: "KV Sector 12",      type: "Anxiety management",     date: new Date(2026,4,2),  timeStr: "11:00 AM", duration: "60 min", mode: "video",     status: "scheduled",  fee: 1500, payStatus: "pending" },
  { id: "a07", studentName: "Meera Patel",       initials: "MP", class: "Class 11",  school: "Ryan International",type: "Stress management",      date: new Date(2026,4,5),  timeStr: "3:00 PM",  duration: "45 min", mode: "in-person", status: "scheduled",  fee: 1500, payStatus: "pending" },
  { id: "a08", studentName: "Priya Mehta",       initials: "PM", class: "Class 12-A",school: "DPS Rohini",        type: "College strategy",       date: new Date(2026,4,15), timeStr: "11:00 AM", duration: "60 min", mode: "in-person", status: "scheduled",  fee: 1500, payStatus: "pending" },
  { id: "a09", studentName: "Rahul Sharma",      initials: "RS", class: "Class 10",  school: "St. Xavier's",      type: "Exam anxiety follow-up", date: new Date(2026,4,8),  timeStr: "2:00 PM",  duration: "45 min", mode: "video",     status: "scheduled",  fee: 1500, payStatus: "pending" },
  { id: "a10", studentName: "Kavya Singh",       initials: "KS", class: "Class 12",  school: "DPS Rohini",        type: "Final session",          date: new Date(2026,4,20), timeStr: "4:00 PM",  duration: "60 min", mode: "video",     status: "scheduled",  fee: 1500, payStatus: "pending" },
  { id: "a11", studentName: "Ananya Roy",        initials: "AR", class: "Class 8",   school: "St. Xavier's",      type: "Progress review",        date: new Date(2026,3,14), timeStr: "10:00 AM", duration: "45 min", mode: "in-person", status: "completed",  fee: 1500, payStatus: "paid"    },
  { id: "a12", studentName: "Rohit Kumar",       initials: "RK", class: "Class 11",  school: "DPS Rohini",        type: "Career assessment",      date: new Date(2026,3,10), timeStr: "3:00 PM",  duration: "60 min", mode: "video",     status: "completed",  fee: 1500, payStatus: "paid"    },
  { id: "a13", studentName: "Priya Nair",        initials: "PN", class: "Class 10",  school: "KV Sector 12",      type: "Initial intake",         date: new Date(2026,3,5),  timeStr: "11:00 AM", duration: "60 min", mode: "in-person", status: "completed",  fee: 1500, payStatus: "paid"    },
];

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const NAV_ITEMS = [
  { id: "dashboard",    path: "/dashboard",   icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: "Dashboard"    },
  { id: "students",     path: "/requests",    icon: <Users           className="w-4.5 h-4.5" />, label: "Students"     },
  { id: "appointments", path: "/appointment", icon: <Calendar        className="w-4.5 h-4.5" />, label: "Appointments" },
  { id: "schools",      path: "/visits",      icon: <School          className="w-4.5 h-4.5" />, label: "Schools"      },
  { id: "revenue",      path: "/revenue",     icon: <IndianRupee     className="w-4.5 h-4.5" />, label: "Revenue"      },
  { id: "reports",      path: "/analytics",   icon: <BarChart2       className="w-4.5 h-4.5" />, label: "Reports"      },
  { id: "settings",     path: "/settings",    icon: <Settings        className="w-4.5 h-4.5" />, label: "Settings"     },
];

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  upcoming:  { label: "Today",     bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200"  },
  completed: { label: "Completed", bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200"  },
  scheduled: { label: "Upcoming",  bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
};

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function AppointmentsScreen({ mobile = "9876543210" }: AppointmentsScreenProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [calMonth, setCalMonth] = useState(TODAY.getMonth());   // 3 = April
  const [calYear, setCalYear]   = useState(TODAY.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Book session form state
  const [bookStudent, setBookStudent]   = useState("");
  const [bookDate, setBookDate]         = useState("2026-04-30");
  const [bookTime, setBookTime]         = useState("10:00");
  const [bookMode, setBookMode]         = useState("video");
  const [bookType, setBookType]         = useState("Initial Assessment");

  // Stats
  const thisMonthAppts = useMemo(() =>
    ALL_APPOINTMENTS.filter((a) => a.date.getMonth() === TODAY.getMonth() && a.date.getFullYear() === TODAY.getFullYear()),
  []);
  const todayAppts = useMemo(() => ALL_APPOINTMENTS.filter((a) => isSameDay(a.date, TODAY)), []);
  const pendingPayTotal = useMemo(() =>
    ALL_APPOINTMENTS.filter((a) => a.payStatus === "pending" && a.fee > 0).reduce((s, a) => s + a.fee, 0),
  []);
  const completedCount = useMemo(() => ALL_APPOINTMENTS.filter((a) => a.status === "completed").length, []);

  // Calendar grid
  const calGrid = useMemo(() => buildCalendarGrid(calYear, calMonth), [calYear, calMonth]);

  // Dots per date in current month view
  const dotsMap = useMemo(() => {
    const m: Record<number, string[]> = {};
    ALL_APPOINTMENTS.forEach((a) => {
      if (a.date.getMonth() === calMonth && a.date.getFullYear() === calYear) {
        const d = a.date.getDate();
        if (!m[d]) m[d] = [];
        const color = a.status === "completed" ? "bg-green-500" :
                      isSameDay(a.date, TODAY) ? "bg-amber-500" : "bg-blue-500";
        if (m[d].length < 3 && !m[d].includes(color)) m[d].push(color);
      }
    });
    return m;
  }, [calMonth, calYear]);

  // Filtered appointments for the list panel
  const listAppts = useMemo(() => {
    let base: typeof ALL_APPOINTMENTS;
    if (selectedDate) {
      base = ALL_APPOINTMENTS.filter((a) => isSameDay(a.date, selectedDate));
    } else if (filterStatus === "completed") {
      base = ALL_APPOINTMENTS;
    } else {
      base = ALL_APPOINTMENTS.filter((a) => a.date >= TODAY || isSameDay(a.date, TODAY));
    }
    if (filterStatus !== "all") base = base.filter((a) => a.status === filterStatus);
    return base.sort((a, b) => a.date.getTime() - b.date.getTime() || a.timeStr.localeCompare(b.timeStr));
  }, [selectedDate, filterStatus]);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const handleSaveBooking = () => {
    if (!bookStudent.trim()) { toast({ title: "Student name required" }); return; }
    toast({ title: "Session booked!", description: `${bookType} for ${bookStudent} on ${bookDate} at ${bookTime}.` });
    setShowBookForm(false);
    setBookStudent(""); setBookDate("2026-04-30"); setBookTime("10:00");
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
            data-testid="appts-sidebar"
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
        <header className="h-16 bg-card/95 backdrop-blur border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 gap-4" data-testid="appts-header">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-toggle-sidebar">
              <Menu className="w-4.5 h-4.5" />
            </button>
            <div>
              <p className="text-sm font-semibold text-foreground">Appointments</p>
              <p className="text-[10px] text-muted-foreground">Monday, 28 Apr 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:block text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              Synced with Inupgro
            </span>
            <Button size="sm" className="h-8 text-xs gap-1.5" data-testid="button-book-session"
              onClick={() => setShowBookForm((v) => !v)}>
              <Plus className="w-3.5 h-3.5" />Book Session
            </Button>
          </div>
        </header>

        {/* Book Session slide-down form */}
        <AnimatePresence>
          {showBookForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b border-border bg-card/80"
              data-testid="book-session-form"
            >
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Plus className="w-3 h-3" /></span>
                    Book New Session
                  </p>
                  <button onClick={() => setShowBookForm(false)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="md:col-span-1">
                    <label className="text-[10px] font-medium text-muted-foreground block mb-1">Student Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={bookStudent}
                      onChange={(e) => setBookStudent(e.target.value)}
                      className="w-full h-8 px-3 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-book-student"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-1">Date</label>
                    <input type="date" value={bookDate} onChange={(e) => setBookDate(e.target.value)}
                      className="w-full h-8 px-3 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-book-date" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-1">Time</label>
                    <input type="time" value={bookTime} onChange={(e) => setBookTime(e.target.value)}
                      className="w-full h-8 px-3 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-book-time" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-1">Mode</label>
                    <select value={bookMode} onChange={(e) => setBookMode(e.target.value)}
                      className="w-full h-8 px-3 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="select-book-mode">
                      <option value="video">Video Call</option>
                      <option value="in-person">In-person</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-1">Session Type</label>
                    <select value={bookType} onChange={(e) => setBookType(e.target.value)}
                      className="w-full h-8 px-3 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="select-book-type">
                      <option>Initial Assessment</option>
                      <option>Career Guidance</option>
                      <option>Follow-up Session</option>
                      <option>Anxiety Management</option>
                      <option>Stress Management</option>
                      <option>Group Counseling</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 justify-end">
                  <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => setShowBookForm(false)}>Cancel</Button>
                  <Button size="sm" className="h-7 text-[11px]" data-testid="button-confirm-booking" onClick={handleSaveBooking}>Confirm Booking</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* Hero + stat cards */}
          <div className="relative bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border-b border-border/60 px-5 py-4 overflow-hidden">
            <div className="pointer-events-none absolute -top-6 -right-6 w-32 h-32 rounded-full bg-primary/6 blur-2xl" />
            <p className="text-xs text-muted-foreground mb-3 font-medium">Overview · April 2026</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-testid="appts-stat-cards">
              {[
                { label: "Sessions This Month", value: String(thisMonthAppts.length),      sub: "Apr 2026",              accent: "bg-primary",    iconBg: "bg-primary/10 text-primary",    icon: <Activity      className="w-4.5 h-4.5" /> },
                { label: "Today's Sessions",    value: String(todayAppts.length),           sub: "28 Apr",                accent: "bg-amber-500",  iconBg: "bg-amber-50 text-amber-600",    icon: <Clock         className="w-4.5 h-4.5" /> },
                { label: "Pending Payment",     value: `₹${pendingPayTotal.toLocaleString()}`,sub: "across sessions",   accent: "bg-red-400",    iconBg: "bg-red-50 text-red-600",        icon: <IndianRupee   className="w-4.5 h-4.5" /> },
                { label: "Completed",           value: String(completedCount),              sub: "all time",              accent: "bg-green-500",  iconBg: "bg-green-50 text-green-600",    icon: <CheckCircle2  className="w-4.5 h-4.5" /> },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                  data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g,"-")}`}
                >
                  <div className={`h-1 w-full ${s.accent}`} />
                  <div className="p-3.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${s.iconBg}`}>{s.icon}</div>
                    <p className="text-xl font-bold text-foreground leading-tight">{s.value}</p>
                    <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main content: calendar + list */}
          <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-0 h-full">

            {/* ── LEFT: Calendar ── */}
            <div className="border-r border-border bg-card/30 p-4 xl:p-5" data-testid="calendar-panel">
              {/* Month header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
                  data-testid="button-prev-month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <p className="text-sm font-semibold text-foreground" data-testid="calendar-month-label">
                  {MONTHS[calMonth]} {calYear}
                </p>
                <button
                  onClick={nextMonth}
                  className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
                  data-testid="button-next-month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day name headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS_SHORT.map((d) => (
                  <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
                ))}
              </div>

              {/* Date cells */}
              <div className="grid grid-cols-7 gap-y-0.5" data-testid="calendar-grid">
                {calGrid.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} />;
                  const cellDate = new Date(calYear, calMonth, day);
                  const isToday  = isSameDay(cellDate, TODAY);
                  const isSel    = selectedDate ? isSameDay(cellDate, selectedDate) : false;
                  const dots     = dotsMap[day] ?? [];
                  const isPast   = cellDate < TODAY && !isToday;
                  return (
                    <button
                      key={day}
                      onClick={() => { setSelectedDate(isSel ? null : cellDate); setFilterStatus("all"); }}
                      className="flex flex-col items-center justify-start pt-1 pb-1 rounded-xl transition-all min-h-[44px] hover:bg-muted"
                      data-testid={`cal-day-${day}`}
                    >
                      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold leading-none transition-colors ${
                        isSel  ? "bg-primary text-primary-foreground shadow-sm" :
                        isToday ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-1" :
                        isPast  ? "text-muted-foreground/60" :
                        "text-foreground"
                      }`}>{day}</span>
                      {dots.length > 0 && (
                        <div className="flex items-center gap-0.5 mt-1">
                          {dots.map((dotColor, di) => (
                            <span
                              key={di}
                              className={`w-1 h-1 rounded-full ${isSel ? "bg-primary-foreground/70" : dotColor}`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-4 flex-wrap">
                {[
                  { color: "bg-amber-500", label: "Today" },
                  { color: "bg-blue-500",  label: "Upcoming" },
                  { color: "bg-green-500", label: "Completed" },
                ].map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className={`w-2 h-2 rounded-full ${l.color}`} />
                    {l.label}
                  </span>
                ))}
              </div>

              {/* Quick filter */}
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Filter by status</p>
                <div className="flex flex-wrap gap-1.5" data-testid="status-filters">
                  {[
                    { val: "all",      label: "All" },
                    { val: "upcoming", label: "Today" },
                    { val: "scheduled",label: "Upcoming" },
                    { val: "completed",label: "Completed" },
                  ].map((f) => (
                    <button
                      key={f.val}
                      onClick={() => { setFilterStatus(f.val); if (f.val !== "all") setSelectedDate(null); }}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                        filterStatus === f.val
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:border-primary/40"
                      }`}
                      data-testid={`filter-${f.val}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Appointment list ── */}
            <div className="overflow-y-auto p-4 xl:p-5" data-testid="appointments-list-panel">
              {/* Section heading */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedDate
                        ? `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
                        : "All Upcoming Sessions"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {listAppts.length} session{listAppts.length !== 1 ? "s" : ""}
                      {selectedDate ? "" : " · click a date to filter"}
                    </p>
                  </div>
                </div>
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-muted"
                    data-testid="button-clear-date-filter"
                  >
                    <X className="w-3 h-3" />Clear filter
                  </button>
                )}
              </div>

              {listAppts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                    <Calendar className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">No sessions found</p>
                  <p className="text-xs text-muted-foreground mt-1">No appointments match the current filter.</p>
                </div>
              ) : (
                <div className="space-y-3" data-testid="appt-cards">
                  {listAppts.map((apt) => {
                    const sc = STATUS_CFG[apt.status] ?? STATUS_CFG.scheduled;
                    const isVideo = apt.mode === "video";
                    return (
                      <motion.div
                        key={apt.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-card border rounded-2xl p-4 flex items-start gap-4 border-l-4 transition-shadow hover:shadow-sm ${
                          apt.status === "completed" ? "border-l-green-500 border-green-100" :
                          apt.status === "upcoming"  ? "border-l-amber-500 border-amber-100" :
                          "border-l-blue-400 border-blue-100"
                        }`}
                        data-testid={`appt-card-${apt.id}`}
                      >
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                          apt.status === "completed" ? "bg-green-50 text-green-700" :
                          apt.status === "upcoming"  ? "bg-amber-50 text-amber-700" :
                          "bg-primary/10 text-primary"
                        }`}>
                          {apt.initials}
                        </div>

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="text-sm font-semibold text-foreground">{apt.studentName}</p>
                            {apt.class && <span className="text-[10px] text-muted-foreground">{apt.class}</span>}
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                              {sc.label}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                              isVideo
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}>
                              {isVideo ? <Video className="w-2.5 h-2.5" /> : <MapPin className="w-2.5 h-2.5" />}
                              {isVideo ? "Video call" : "In-person"}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-foreground">{apt.type}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" />
                              {apt.date.getDate()} {MONTHS[apt.date.getMonth()].slice(0,3)} · {apt.timeStr}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />{apt.duration}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">{apt.school}</span>
                          </div>
                        </div>

                        {/* Fee + CTA */}
                        <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                          {apt.fee > 0 ? (
                            <>
                              <p className="text-sm font-bold text-foreground">₹{apt.fee.toLocaleString()}</p>
                              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                                apt.payStatus === "paid"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}>{apt.payStatus === "paid" ? "Paid" : "Pending"}</span>
                            </>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">School visit</span>
                          )}
                          <button
                            className="mt-0.5 text-[10px] font-semibold text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-lg transition-colors"
                            data-testid={`button-view-session-${apt.id}`}
                            onClick={() => navigate("/appointment/detail")}
                          >
                            View session →
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
