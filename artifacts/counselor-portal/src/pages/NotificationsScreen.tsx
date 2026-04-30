import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Menu, BadgeCheck, Calendar, LayoutDashboard, Users, IndianRupee,
  BarChart2, Settings, School, MessageCircle, Bell, BellOff, BellRing,
  UserPlus, FileText, Globe, Zap, CheckCheck, Archive, ChevronRight,
  Filter, MoreHorizontal, Search, Trash2, Eye, EyeOff, RefreshCw, X,
  AlertCircle, Info, CheckCircle2, Clock, ArrowRight, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

/* ─── TYPES ───────────────────────────────────────── */

type NType = "student_request" | "appointment" | "school_visit" | "payment" | "document" | "message" | "system";
type Priority = "high" | "medium" | "low";

interface Notification {
  id: string;
  type: NType;
  title: string;
  body: string;
  timestamp: string;
  group: "today" | "yesterday" | "this_week" | "earlier";
  read: boolean;
  priority: Priority;
  action?: string;
  actionLabel?: string;
  meta?: string;
}

/* ─── STATIC DATA ──────────────────────────────────── */

const INITIAL: Notification[] = [
  {
    id: "n1", type: "student_request",
    title: "New counseling request",
    body: "Riya Kapoor (Class 12, DPS Rohini) has submitted a new counseling request. Priority flagged as High.",
    timestamp: "2 min ago", group: "today", read: false, priority: "high",
    action: "/requests", actionLabel: "Review Request", meta: "DPS Rohini · Class 12",
  },
  {
    id: "n2", type: "payment",
    title: "Payment received",
    body: "₹1,500 received from Priya Mehta for the session on 24 Apr 2026. Invoice INV-024 marked Received.",
    timestamp: "18 min ago", group: "today", read: false, priority: "high",
    action: "/revenue", actionLabel: "View Invoice", meta: "INV-024 · ₹1,500",
  },
  {
    id: "n3", type: "message",
    title: "New message from parent",
    body: "Arjun Nair's parent sent a message regarding rescheduling the next appointment. Reply required.",
    timestamp: "45 min ago", group: "today", read: false, priority: "high",
    action: "/requests", actionLabel: "View Student", meta: "Arjun Nair · Parent",
  },
  {
    id: "n4", type: "appointment",
    title: "Pre-session form not filled",
    body: "Kavya Reddy's appointment is confirmed for 2:30 PM today, but the pre-session intake form has not been submitted.",
    timestamp: "1 hr ago", group: "today", read: false, priority: "medium",
    action: "/appointment", actionLabel: "View Appointment", meta: "Today · 2:30 PM",
  },
  {
    id: "n5", type: "document",
    title: "Progress report awaiting review",
    body: "A progress report for Aarav Singh has been submitted by the school and is awaiting your review and e-signature.",
    timestamp: "2 hrs ago", group: "today", read: false, priority: "medium",
    action: "/student", actionLabel: "Open Document", meta: "Aarav Singh · Progress Report",
  },
  {
    id: "n6", type: "school_visit",
    title: "School visit tomorrow — DPS Rohini",
    body: "Reminder: Your school visit to DPS Rohini is scheduled for tomorrow at 9:00 AM. 6 sessions planned.",
    timestamp: "3 hrs ago", group: "today", read: false, priority: "medium",
    action: "/visits", actionLabel: "View Visit Plan", meta: "28 Apr 2026 · 9:00 AM · 6 sessions",
  },
  {
    id: "n7", type: "system",
    title: "MindBridge v2.4.1 — update available",
    body: "A new platform update is available with improvements to the career assessment tool and performance fixes.",
    timestamp: "5 hrs ago", group: "today", read: false, priority: "low",
    actionLabel: "View Changelog",
  },
  {
    id: "n8", type: "school_visit",
    title: "Visit brief packet uploaded",
    body: "St. Xavier's school coordinator has uploaded the visit agenda and student list for the upcoming session.",
    timestamp: "6 hrs ago", group: "today", read: false, priority: "low",
    action: "/visits", actionLabel: "Open Packet", meta: "St. Xavier's · Visit Brief",
  },
  {
    id: "n9", type: "appointment",
    title: "Appointment rescheduled",
    body: "Priya Mehta's session has been rescheduled to 28 Apr at 11:00 AM by parent request. Calendar updated.",
    timestamp: "8 hrs ago", group: "today", read: true, priority: "medium",
    action: "/appointment", actionLabel: "View Session", meta: "28 Apr · 11:00 AM",
  },
  {
    id: "n10", type: "message",
    title: "Visit agenda from DPS Rohini",
    body: "DPS Rohini coordinator sent the confirmed agenda for the upcoming school visit. 3 attachments included.",
    timestamp: "10 hrs ago", group: "today", read: true, priority: "low",
    action: "/visits", actionLabel: "View School", meta: "DPS Rohini Coordinator",
  },
  {
    id: "n11", type: "payment",
    title: "Invoice INV-030 paid",
    body: "St. Xavier's has cleared invoice INV-030. ₹7,500 received and credited to your account.",
    timestamp: "Yesterday, 4:15 PM", group: "yesterday", read: true, priority: "medium",
    action: "/revenue", actionLabel: "View Invoice", meta: "INV-030 · ₹7,500",
  },
  {
    id: "n12", type: "student_request",
    title: "Student request approved",
    body: "Rohan Verma's counseling request has been approved and onboarded to your active student list.",
    timestamp: "Yesterday, 1:30 PM", group: "yesterday", read: true, priority: "medium",
    action: "/requests", actionLabel: "View Profile", meta: "Rohan Verma · Active",
  },
  {
    id: "n13", type: "document",
    title: "Career assessment approved",
    body: "The career assessment report for Aarav Singh has been approved and the PDF has been sent to the parent's email.",
    timestamp: "Yesterday, 11:00 AM", group: "yesterday", read: true, priority: "low",
    action: "/career-analysis", actionLabel: "View Report", meta: "Aarav Singh · Career Assessment",
  },
  {
    id: "n14", type: "system",
    title: "Monthly summary report ready",
    body: "Your monthly performance and revenue summary report for March 2026 is ready for download from the Reports section.",
    timestamp: "Yesterday, 9:00 AM", group: "yesterday", read: true, priority: "low",
    action: "/analytics", actionLabel: "Download Report",
  },
  {
    id: "n15", type: "school_visit",
    title: "DPS Dwarka visit recap uploaded",
    body: "Visit summary uploaded for DPS Dwarka. 7 session slots recorded, 5 students attended. Counselor notes pending.",
    timestamp: "25 Apr, 6:00 PM", group: "this_week", read: true, priority: "low",
    action: "/visits", actionLabel: "View Recap", meta: "DPS Dwarka · 7 sessions",
  },
  {
    id: "n16", type: "appointment",
    title: "Missed appointment — follow-up required",
    body: "Anaya Krishnan missed the scheduled appointment on 22 Apr without prior notice. Please initiate a follow-up.",
    timestamp: "25 Apr, 3:00 PM", group: "this_week", read: true, priority: "high",
    action: "/appointment", actionLabel: "Schedule Follow-up", meta: "Anaya Krishnan · Missed",
  },
  {
    id: "n17", type: "payment",
    title: "Payout initiated — Apr 2026",
    body: "Your April 2026 payout of ₹14,190 (net after 12% platform fee and 2% TDS) has been initiated and is processing.",
    timestamp: "25 Apr, 10:00 AM", group: "this_week", read: true, priority: "medium",
    action: "/revenue", actionLabel: "Track Payout", meta: "₹14,190 · HDFC ****4521",
  },
  {
    id: "n18", type: "message",
    title: "3 unread messages from Ishaan Malhotra",
    body: "Ishaan Malhotra has sent 3 messages over the past 2 days regarding career options. Review and respond.",
    timestamp: "24 Apr, 2:00 PM", group: "this_week", read: true, priority: "medium",
    action: "/student", actionLabel: "View Profile", meta: "Ishaan Malhotra · 3 messages",
  },
  {
    id: "n19", type: "document",
    title: "Participation certificate approved",
    body: "Certificate of participation for the DPS Rohini school visit has been approved by the principal and is available.",
    timestamp: "23 Apr, 4:30 PM", group: "this_week", read: true, priority: "low",
    actionLabel: "Download Certificate", meta: "DPS Rohini · Certificate",
  },
  {
    id: "n20", type: "system",
    title: "Inupgro data sync completed",
    body: "All student records from Inupgro have been successfully synced. 48 students, 4 schools — data current as of 23 Apr.",
    timestamp: "23 Apr, 12:00 PM", group: "this_week", read: true, priority: "low",
  },
];

/* ─── TYPE CONFIG ─────────────────────────────────── */

const TYPE_CONFIG: Record<NType, { label: string; icon: React.ReactNode; color: string; bg: string; border: string; dot: string }> = {
  student_request: { label: "Student Request", icon: <UserPlus  className="w-4 h-4" />, color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   dot: "bg-blue-500"    },
  appointment:     { label: "Appointment",      icon: <Calendar  className="w-4 h-4" />, color: "text-primary",   bg: "bg-primary/5", border: "border-primary/20", dot: "bg-primary"     },
  school_visit:    { label: "School Visit",     icon: <School    className="w-4 h-4" />, color: "text-teal-600",  bg: "bg-teal-50",   border: "border-teal-200",   dot: "bg-teal-500"    },
  payment:         { label: "Payment",          icon: <IndianRupee className="w-4 h-4"/>,color: "text-green-600", bg: "bg-green-50",  border: "border-green-200",  dot: "bg-green-500"   },
  document:        { label: "Document",         icon: <FileText  className="w-4 h-4" />, color: "text-amber-600", bg: "bg-amber-50",  border: "border-amber-200",  dot: "bg-amber-500"   },
  message:         { label: "Message",          icon: <MessageCircle className="w-4 h-4"/>,color:"text-rose-600",  bg: "bg-rose-50",   border: "border-rose-200",   dot: "bg-rose-500"    },
  system:          { label: "System",           icon: <Zap       className="w-4 h-4" />, color: "text-slate-600", bg: "bg-slate-50",  border: "border-slate-200",  dot: "bg-slate-400"   },
};

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  high:   { label: "High",   color: "text-red-600",   bg: "bg-red-50 border-red-200"   },
  medium: { label: "Medium", color: "text-amber-600", bg: "bg-amber-50 border-amber-200"},
  low:    { label: "Low",    color: "text-slate-500", bg: "bg-slate-50 border-slate-200"},
};

const GROUP_LABELS: Record<string, string> = {
  today: "Today",
  yesterday: "Yesterday",
  this_week: "This Week",
  earlier: "Earlier",
};

type FilterTab = "all" | "unread" | NType;

const FILTER_TABS: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
  { id: "all",            label: "All",             icon: <Bell className="w-3.5 h-3.5" />           },
  { id: "unread",         label: "Unread",          icon: <BellRing className="w-3.5 h-3.5" />       },
  { id: "student_request",label: "Student Requests",icon: <UserPlus className="w-3.5 h-3.5" />       },
  { id: "appointment",    label: "Appointments",    icon: <Calendar className="w-3.5 h-3.5" />       },
  { id: "school_visit",   label: "School Visits",   icon: <School className="w-3.5 h-3.5" />         },
  { id: "payment",        label: "Payments",        icon: <IndianRupee className="w-3.5 h-3.5" />    },
  { id: "document",       label: "Documents",       icon: <FileText className="w-3.5 h-3.5" />       },
  { id: "message",        label: "Messages",        icon: <MessageCircle className="w-3.5 h-3.5" /> },
  { id: "system",         label: "System",          icon: <Zap className="w-3.5 h-3.5" />            },
];

const NAV_ITEMS = [
  { id: "dashboard",       path: "/dashboard",      icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: "Dashboard"       },
  { id: "students",        path: "/requests",       icon: <Users           className="w-4.5 h-4.5" />, label: "Students"        },
  { id: "appointments",    path: "/appointment",    icon: <Calendar        className="w-4.5 h-4.5" />, label: "Appointments"    },
  { id: "schools",         path: "/visits",         icon: <School          className="w-4.5 h-4.5" />, label: "Schools"         },
  { id: "revenue",         path: "/revenue",        icon: <IndianRupee     className="w-4.5 h-4.5" />, label: "Revenue"         },
  { id: "reports",         path: "/analytics",      icon: <BarChart2       className="w-4.5 h-4.5" />, label: "Reports"         },
  { id: "demographics",    path: "/demographics",   icon: <Globe           className="w-4.5 h-4.5" />, label: "Demographics"    },
  { id: "notifications",   path: "/notifications",  icon: <Bell            className="w-4.5 h-4.5" />, label: "Notifications"   },
  { id: "settings",        path: "/settings",       icon: <Settings        className="w-4.5 h-4.5" />, label: "Settings"        },
];

/* ─── COMPONENT ────────────────────────────────────── */

export default function NotificationsScreen({ mobile = "9876543210" }: { mobile?: string }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [items, setItems]               = useState<Notification[]>(INITIAL);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [search, setSearch]             = useState("");
  const [openMenu, setOpenMenu]         = useState<string | null>(null);

  /* derived counts */
  const unreadCount = items.filter((n) => !n.read).length;
  const countFor = (f: FilterTab) => {
    if (f === "all")    return items.length;
    if (f === "unread") return items.filter((n) => !n.read).length;
    return items.filter((n) => n.type === f).length;
  };

  /* filtered list */
  const filtered = useMemo(() => {
    let list = [...items];
    if (activeFilter === "unread") list = list.filter((n) => !n.read);
    else if (activeFilter !== "all") list = list.filter((n) => n.type === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q));
    }
    return list;
  }, [items, activeFilter, search]);

  /* grouped */
  const grouped = useMemo(() => {
    const map: Record<string, Notification[]> = {};
    filtered.forEach((n) => {
      if (!map[n.group]) map[n.group] = [];
      map[n.group].push(n);
    });
    return map;
  }, [filtered]);

  const groupOrder = ["today", "yesterday", "this_week", "earlier"];

  /* actions */
  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const toggleRead = (id: string) =>
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n));

  const archiveItem = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast({ title: "Notification archived", description: "Removed from your notification list." });
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({ title: "All notifications marked as read" });
  };

  const clearAll = () => {
    setItems([]);
    toast({ title: "All notifications cleared" });
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">

      {/* ── SIDEBAR ── */}
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 220, opacity: 1 }}
          transition={{ duration: 0.22 }}
          className="bg-card border-r border-border flex flex-col shrink-0 overflow-hidden"
          data-testid="notifications-sidebar"
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
                  item.id === "notifications"
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-testid={`sidebar-nav-${item.id}`}
              >
                <span className="relative">
                  {item.icon}
                  {item.id === "notifications" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </span>
                {item.label}
                {item.id === "notifications" && unreadCount > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    {unreadCount}
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

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-card/95 backdrop-blur border-b border-border flex items-center gap-3 px-4 sm:px-6 shrink-0" data-testid="notifications-header">
          <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-toggle-sidebar">
            <Menu className="w-4.5 h-4.5" />
          </button>
          <div className="flex-1 min-w-0 flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full shrink-0" data-testid="header-unread-badge">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-mark-all-read"
              onClick={markAllRead} disabled={unreadCount === 0}>
              <CheckCheck className="w-3.5 h-3.5" /><span className="hidden sm:inline">Mark all read</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-refresh-notifications"
              onClick={() => toast({ title: "Refreshed", description: "Notifications synced." })}>
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-notification-settings"
              onClick={() => toast({ title: "Notification settings", description: "Configure your notification preferences." })}>
              <Settings className="w-3.5 h-3.5" />
            </Button>
          </div>
        </header>

        {/* Two-column layout */}
        <div className="flex-1 flex min-h-0 overflow-hidden">

          {/* ── LEFT FILTER PANEL ── */}
          <aside className="w-52 shrink-0 border-r border-border bg-card flex flex-col overflow-hidden" data-testid="filter-panel">
            {/* search */}
            <div className="px-3 py-3 border-b border-border">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full h-8 bg-muted rounded-lg pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                  placeholder="Search notifications..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="notification-search"
                />
                {search && (
                  <button className="absolute right-2.5 top-1/2 -translate-y-1/2" onClick={() => setSearch("")} data-testid="button-clear-search">
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* filter tabs */}
            <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto" data-testid="filter-tabs">
              {FILTER_TABS.map((tab) => {
                const cnt = countFor(tab.id);
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all text-left ${
                      isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setActiveFilter(tab.id)}
                    data-testid={`filter-tab-${tab.id}`}
                  >
                    {tab.icon}
                    <span className="flex-1 truncate">{tab.label}</span>
                    {cnt > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`} data-testid={`filter-count-${tab.id}`}>{cnt}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* bulk actions */}
            <div className="px-3 py-3 border-t border-border space-y-1.5">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                data-testid="button-clear-all" onClick={clearAll}>
                <Trash2 className="w-3.5 h-3.5" />Clear all
              </button>
            </div>
          </aside>

          {/* ── NOTIFICATION LIST ── */}
          <div className="flex-1 overflow-y-auto" data-testid="notification-list">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground" data-testid="empty-state">
                <BellOff className="w-10 h-10 opacity-30" />
                <p className="text-sm font-semibold">No notifications</p>
                <p className="text-xs">All caught up — nothing to show here.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {groupOrder.filter((g) => grouped[g]?.length).map((g) => (
                  <div key={g} data-testid={`group-${g}`}>
                    {/* group label */}
                    <div className="sticky top-0 z-10 px-5 py-2 bg-muted/60 backdrop-blur-sm border-b border-border/40">
                      <p className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5" data-testid={`group-label-${g}`}><span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />{GROUP_LABELS[g]}</p>
                    </div>

                    {/* rows */}
                    {grouped[g].map((n) => {
                      const tc = TYPE_CONFIG[n.type];
                      const pc = PRIORITY_CONFIG[n.priority];
                      const menuOpen = openMenu === n.id;
                      return (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8, height: 0 }}
                          transition={{ duration: 0.18 }}
                          className={`relative flex gap-4 px-5 py-4 hover:bg-muted/20 transition-colors cursor-default ${
                            !n.read ? "bg-primary/[0.03] border-l-2 border-l-primary" : ""
                          }`}
                          data-testid={`notification-row-${n.id}`}
                          onClick={() => { if (!n.read) markRead(n.id); setOpenMenu(null); }}
                        >
                          {/* type icon */}
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${tc.bg} ${tc.color}`}
                            data-testid={`notif-icon-${n.id}`}>
                            {tc.icon}
                          </div>

                          {/* content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-0.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                {!n.read && (
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${tc.dot}`} data-testid={`unread-dot-${n.id}`} />
                                )}
                                <p className={`text-xs truncate ${n.read ? "text-muted-foreground" : "font-semibold text-foreground"}`}
                                  data-testid={`notif-title-${n.id}`}>
                                  {n.title}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {n.priority !== "low" && (
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${pc.bg} ${pc.color}`}
                                    data-testid={`priority-badge-${n.id}`}>
                                    {pc.label}
                                  </span>
                                )}
                                <p className="text-[10px] text-muted-foreground whitespace-nowrap" data-testid={`notif-time-${n.id}`}>{n.timestamp}</p>
                                {/* context menu */}
                                <div className="relative">
                                  <button
                                    className="p-1 rounded-lg hover:bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ opacity: menuOpen ? 1 : undefined }}
                                    data-testid={`button-menu-${n.id}`}
                                    onClick={(e) => { e.stopPropagation(); setOpenMenu(menuOpen ? null : n.id); }}
                                  >
                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                  </button>
                                  {menuOpen && (
                                    <div className="absolute right-0 top-7 w-40 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden"
                                      data-testid={`context-menu-${n.id}`}
                                      onClick={(e) => e.stopPropagation()}>
                                      <button
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted"
                                        data-testid={`menu-toggle-read-${n.id}`}
                                        onClick={() => { toggleRead(n.id); setOpenMenu(null); toast({ title: n.read ? "Marked as unread" : "Marked as read" }); }}
                                      >
                                        {n.read ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        {n.read ? "Mark as unread" : "Mark as read"}
                                      </button>
                                      <button
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-600 hover:bg-red-50"
                                        data-testid={`menu-archive-${n.id}`}
                                        onClick={() => { archiveItem(n.id); setOpenMenu(null); }}
                                      >
                                        <Archive className="w-3.5 h-3.5" />Archive
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground leading-relaxed mb-2" data-testid={`notif-body-${n.id}`}>{n.body}</p>

                            <div className="flex items-center gap-2 flex-wrap">
                              {/* type badge */}
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tc.bg} ${tc.border} ${tc.color}`}
                                data-testid={`type-badge-${n.id}`}>
                                {tc.label}
                              </span>
                              {/* meta */}
                              {n.meta && (
                                <span className="text-[10px] text-muted-foreground" data-testid={`notif-meta-${n.id}`}>{n.meta}</span>
                              )}
                              {/* action */}
                              {n.actionLabel && (
                                <button
                                  className={`ml-auto flex items-center gap-1 text-[10px] font-semibold ${tc.color} hover:underline`}
                                  data-testid={`notif-action-${n.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markRead(n.id);
                                    if (n.action) navigate(n.action);
                                    else toast({ title: n.actionLabel!, description: n.title });
                                  }}
                                >
                                  {n.actionLabel} <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
