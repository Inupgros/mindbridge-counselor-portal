import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Menu, BadgeCheck, Calendar, LayoutDashboard, Users, IndianRupee,
  BarChart2, Settings, School, ChevronDown, TrendingUp,
  TrendingDown, Download, RefreshCw, Filter, Check, FileText, Clock,
  AlertTriangle, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight,
  Building2, User, CreditCard, Wallet, Receipt, Send, ChevronRight,
  ChevronLeft, Eye, ExternalLink, CircleDollarSign, Layers,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

/* ─── TYPES ────────────────────────────────────────── */
type PaymentStatus = "received" | "pending" | "overdue" | "processing";
type EarningType   = "appointment" | "school_visit";
type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";

interface Payment {
  id: string;
  date: string;
  month: string;
  studentOrSchool: string;
  type: EarningType;
  appointmentType: string;
  school: string;
  amount: number;
  status: PaymentStatus;
  invoiceId: string;
  description: string;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  client: string;
  clientType: "student" | "school";
  school: string;
  date: string;
  dueDate: string;
  month: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: InvoiceStatus;
  items: string;
}

/* ─── STATIC DATA ────────────────────────────────── */

const MONTHLY_TREND = [
  { month: "Jan",  received: 14500, pending: 2000,  appt: 9000,  visits: 7500 },
  { month: "Feb",  received: 16000, pending: 3500,  appt: 10500, visits: 9000 },
  { month: "Mar",  received: 12500, pending: 4500,  appt: 8000,  visits: 9000 },
  { month: "Apr",  received:  9000, pending: 6500,  appt: 7500,  visits: 8000 },
];

const PAYMENTS: Payment[] = [
  { id: "p1",  date: "4 Apr 2026",  month: "Apr", studentOrSchool: "Priya Mehta",   type: "appointment",  appointmentType: "Career Counseling",  school: "DPS Rohini",         amount: 1500, status: "received",   invoiceId: "INV-024", description: "Session 2 — Career Goal Planning"         },
  { id: "p2",  date: "5 Apr 2026",  month: "Apr", studentOrSchool: "Rohit Kumar",   type: "appointment",  appointmentType: "Career Counseling",  school: "St. Xavier's",       amount: 1500, status: "received",   invoiceId: "INV-025", description: "Session 1 — Initial Assessment"           },
  { id: "p3",  date: "10 Apr 2026", month: "Apr", studentOrSchool: "DPS Rohini",    type: "school_visit", appointmentType: "School Visit",        school: "DPS Rohini",         amount: 8000, status: "received",   invoiceId: "INV-026", description: "April school visit — Group Session + Screening" },
  { id: "p4",  date: "12 Apr 2026", month: "Apr", studentOrSchool: "Ananya Roy",    type: "appointment",  appointmentType: "Career Counseling",  school: "St. Xavier's",       amount: 1500, status: "received",   invoiceId: "INV-027", description: "Session 1 — Career Interest Mapping"       },
  { id: "p5",  date: "15 Apr 2026", month: "Apr", studentOrSchool: "Meera Singh",   type: "appointment",  appointmentType: "Mental Health",       school: "Springdales",        amount: 2000, status: "received",   invoiceId: "INV-028", description: "Session 1 — Stress & Anxiety Assessment"   },
  { id: "p6",  date: "18 Apr 2026", month: "Apr", studentOrSchool: "Arjun Nair",    type: "appointment",  appointmentType: "Follow-up",           school: "DPS Rohini",         amount: 1500, status: "received",   invoiceId: "INV-029", description: "Session 3 — Follow-up Counseling"          },
  { id: "p7",  date: "22 Apr 2026", month: "Apr", studentOrSchool: "St. Xavier's",  type: "school_visit", appointmentType: "School Visit",        school: "St. Xavier's",       amount: 7500, status: "processing", invoiceId: "INV-030", description: "April school visit — Career Screening Day"  },
  { id: "p8",  date: "25 Apr 2026", month: "Apr", studentOrSchool: "Kavya Reddy",   type: "appointment",  appointmentType: "Career Counseling",  school: "Springdales",        amount: 1500, status: "pending",    invoiceId: "INV-031", description: "Session 2 — Career Path Shortlisting"      },
  { id: "p9",  date: "27 Apr 2026", month: "Apr", studentOrSchool: "Priya Mehta",   type: "appointment",  appointmentType: "Follow-up",           school: "DPS Rohini",         amount: 1500, status: "pending",    invoiceId: "INV-032", description: "Session 3 — Career Follow-up + Stress Check"},
  { id: "p10", date: "28 Apr 2026", month: "Apr", studentOrSchool: "Rohit Kumar",   type: "appointment",  appointmentType: "Mental Health",       school: "St. Xavier's",       amount: 2000, status: "pending",    invoiceId: "INV-033", description: "Session 2 — Emotional Regulation"           },
  { id: "p11", date: "5 Mar 2026",  month: "Mar", studentOrSchool: "DPS Rohini",    type: "school_visit", appointmentType: "School Visit",        school: "DPS Rohini",         amount: 8000, status: "received",   invoiceId: "INV-018", description: "March school visit — Group Career Session"   },
  { id: "p12", date: "8 Mar 2026",  month: "Mar", studentOrSchool: "Arjun Nair",    type: "appointment",  appointmentType: "Career Counseling",  school: "DPS Rohini",         amount: 1500, status: "received",   invoiceId: "INV-019", description: "Session 1 — Initial Career Assessment"      },
  { id: "p13", date: "15 Mar 2026", month: "Mar", studentOrSchool: "Meera Singh",   type: "appointment",  appointmentType: "Mental Health",       school: "Springdales",        amount: 2000, status: "received",   invoiceId: "INV-020", description: "Session 3 — Closure & Wellness Planning"     },
  { id: "p14", date: "20 Mar 2026", month: "Mar", studentOrSchool: "Springdales",   type: "school_visit", appointmentType: "School Visit",        school: "Springdales",        amount: 7500, status: "received",   invoiceId: "INV-021", description: "March school visit — Mental Wellness Day"     },
  { id: "p15", date: "28 Mar 2026", month: "Mar", studentOrSchool: "Kavya Reddy",   type: "appointment",  appointmentType: "Career Counseling",  school: "Springdales",        amount: 1500, status: "overdue",    invoiceId: "INV-022", description: "Session 1 — Career Discovery"                },
  { id: "p16", date: "5 Feb 2026",  month: "Feb", studentOrSchool: "DPS Rohini",    type: "school_visit", appointmentType: "School Visit",        school: "DPS Rohini",         amount: 8000, status: "received",   invoiceId: "INV-012", description: "Feb school visit — Batch 12 Career Day"      },
  { id: "p17", date: "12 Feb 2026", month: "Feb", studentOrSchool: "St. Xavier's",  type: "school_visit", appointmentType: "School Visit",        school: "St. Xavier's",       amount: 7500, status: "received",   invoiceId: "INV-013", description: "Feb school visit — Class 8–10 Career Screening"},
  { id: "p18", date: "18 Feb 2026", month: "Feb", studentOrSchool: "Arjun Nair",    type: "appointment",  appointmentType: "Follow-up",           school: "DPS Rohini",         amount: 1500, status: "received",   invoiceId: "INV-014", description: "Session 2 — Follow-up Counseling"             },
  { id: "p19", date: "25 Feb 2026", month: "Feb", studentOrSchool: "Meera Singh",   type: "appointment",  appointmentType: "Mental Health",       school: "Springdales",        amount: 2000, status: "received",   invoiceId: "INV-015", description: "Session 2 — Anxiety Management"               },
  { id: "p20", date: "8 Jan 2026",  month: "Jan", studentOrSchool: "DPS Rohini",    type: "school_visit", appointmentType: "School Visit",        school: "DPS Rohini",         amount: 7500, status: "received",   invoiceId: "INV-006", description: "Jan school visit — New Semester Career Kickoff"},
  { id: "p21", date: "15 Jan 2026", month: "Jan", studentOrSchool: "Arjun Nair",    type: "appointment",  appointmentType: "Career Counseling",  school: "DPS Rohini",         amount: 1500, status: "received",   invoiceId: "INV-007", description: "Session 4 — Final Pathway Confirmation"       },
  { id: "p22", date: "22 Jan 2026", month: "Jan", studentOrSchool: "Meera Singh",   type: "appointment",  appointmentType: "Mental Health",       school: "Springdales",        amount: 2000, status: "received",   invoiceId: "INV-008", description: "Session 4 — Wellness Review"                  },
];

const INVOICES: Invoice[] = [
  { id: "i1",  invoiceNo: "INV-032", client: "Priya Mehta",   clientType: "student", school: "DPS Rohini",   date: "27 Apr 2026", dueDate: "4 May 2026",  month: "Apr", amount: 1500, platformFee: 180, netAmount: 1320, status: "pending", items: "Session 3 — Career Follow-up + Stress Check"        },
  { id: "i2",  invoiceNo: "INV-031", client: "Kavya Reddy",   clientType: "student", school: "Springdales",  date: "25 Apr 2026", dueDate: "2 May 2026",  month: "Apr", amount: 1500, platformFee: 180, netAmount: 1320, status: "pending", items: "Session 2 — Career Path Shortlisting"               },
  { id: "i3",  invoiceNo: "INV-033", client: "Rohit Kumar",   clientType: "student", school: "St. Xavier's", date: "28 Apr 2026", dueDate: "5 May 2026",  month: "Apr", amount: 2000, platformFee: 240, netAmount: 1760, status: "pending", items: "Session 2 — Emotional Regulation"                   },
  { id: "i4",  invoiceNo: "INV-030", client: "St. Xavier's",  clientType: "school",  school: "St. Xavier's", date: "22 Apr 2026", dueDate: "29 Apr 2026", month: "Apr", amount: 7500, platformFee: 900, netAmount: 6600, status: "pending", items: "April School Visit — Career Screening Day"          },
  { id: "i5",  invoiceNo: "INV-029", client: "Arjun Nair",    clientType: "student", school: "DPS Rohini",   date: "18 Apr 2026", dueDate: "25 Apr 2026", month: "Apr", amount: 1500, platformFee: 180, netAmount: 1320, status: "paid",    items: "Session 3 — Follow-up Counseling"                   },
  { id: "i6",  invoiceNo: "INV-028", client: "Meera Singh",   clientType: "student", school: "Springdales",  date: "15 Apr 2026", dueDate: "22 Apr 2026", month: "Apr", amount: 2000, platformFee: 240, netAmount: 1760, status: "paid",    items: "Session 1 — Stress & Anxiety Assessment"            },
  { id: "i7",  invoiceNo: "INV-027", client: "Ananya Roy",    clientType: "student", school: "St. Xavier's", date: "12 Apr 2026", dueDate: "19 Apr 2026", month: "Apr", amount: 1500, platformFee: 180, netAmount: 1320, status: "paid",    items: "Session 1 — Career Interest Mapping"                },
  { id: "i8",  invoiceNo: "INV-026", client: "DPS Rohini",    clientType: "school",  school: "DPS Rohini",   date: "10 Apr 2026", dueDate: "17 Apr 2026", month: "Apr", amount: 8000, platformFee: 960, netAmount: 7040, status: "paid",    items: "April School Visit — Group Session + Screening"     },
  { id: "i9",  invoiceNo: "INV-022", client: "Kavya Reddy",   clientType: "student", school: "Springdales",  date: "28 Mar 2026", dueDate: "4 Apr 2026",  month: "Mar", amount: 1500, platformFee: 180, netAmount: 1320, status: "overdue", items: "Session 1 — Career Discovery"                       },
  { id: "i10", invoiceNo: "INV-021", client: "Springdales",   clientType: "school",  school: "Springdales",  date: "20 Mar 2026", dueDate: "27 Mar 2026", month: "Mar", amount: 7500, platformFee: 900, netAmount: 6600, status: "paid",    items: "March School Visit — Mental Wellness Day"           },
];

const PAYOUT = {
  cycle: "May 2026",
  cutoffDate: "30 Apr 2026",
  payoutDate: "5 May 2026",
  pendingAmount: 16500,
  platformFeePercent: 12,
  platformFeeAmount: 1980,
  tdsPercent: 2,
  tdsAmount: 330,
  netPayout: 14190,
  bankAccount: "HDFC Bank ****4521",
  status: "processing",
  lastPayout: { month: "Apr 2026", amount: 15240, date: "5 Apr 2026" },
};

const PAYOUT_HISTORY = [
  {
    month: PAYOUT.lastPayout.month,
    gross: 17727,
    platformFee: 2127,
    tds: 360,
    net: PAYOUT.lastPayout.amount,
    dateCredited: PAYOUT.lastPayout.date,
    bank: PAYOUT.bankAccount,
    status: "credited",
  },
  {
    month: "Mar 2026",
    gross: 15500,
    platformFee: 1860,
    tds: 310,
    net: 13330,
    dateCredited: "5 Mar 2026",
    bank: PAYOUT.bankAccount,
    status: "credited",
  },
  {
    month: "Feb 2026",
    gross: 12000,
    platformFee: 1440,
    tds: 240,
    net: 10320,
    dateCredited: "5 Feb 2026",
    bank: PAYOUT.bankAccount,
    status: "credited",
  },
  {
    month: "Jan 2026",
    gross: 9500,
    platformFee: 1140,
    tds: 190,
    net: 8170,
    dateCredited: "5 Jan 2026",
    bank: PAYOUT.bankAccount,
    status: "credited",
  },
];

const SCHOOLS = ["All Schools", "DPS Rohini", "St. Xavier's", "Springdales"];
const STUDENTS = ["All Students", "Priya Mehta", "Rohit Kumar", "Ananya Roy", "Meera Singh", "Arjun Nair", "Kavya Reddy"];
const APPT_TYPES = ["All Types", "Career Counseling", "Mental Health", "Follow-up", "School Visit"];
const MONTHS_FILTER = ["All Months", "Jan", "Feb", "Mar", "Apr"];

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

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const STATUS_CFG: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  received:   { label: "Received",   bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  icon: <CheckCircle2 className="w-3 h-3" />  },
  pending:    { label: "Pending",    bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  icon: <Clock        className="w-3 h-3" />  },
  processing: { label: "Processing", bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   icon: <RefreshCw    className="w-3 h-3" />  },
  overdue:    { label: "Overdue",    bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    icon: <AlertTriangle className="w-3 h-3" /> },
  paid:       { label: "Paid",       bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  icon: <CheckCircle2 className="w-3 h-3" />  },
  draft:      { label: "Draft",      bg: "bg-slate-50",  text: "text-slate-600",  border: "border-slate-200",  icon: <FileText     className="w-3 h-3" />  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.draft;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.fill ?? p.stroke }} className="leading-5">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

/* ─── CHART LEGEND ─────────────────────────────────── */
function ChartLegend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-3">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/* ─── COMPONENT ────────────────────────────────────── */

export default function RevenueScreen({ mobile = "9876543210" }: { mobile?: string }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filters
  const [filterMonth,      setFilterMonth]      = useState("All Months");
  const [filterSchool,     setFilterSchool]     = useState("All Schools");
  const [filterStudent,    setFilterStudent]    = useState("All Students");
  const [filterApptType,   setFilterApptType]   = useState("All Types");

  // Table + chart state
  const [activeTab, setActiveTab]               = useState<"payments" | "invoices">("payments");
  const [paymentsPage, setPaymentsPage]         = useState(1);
  const [invoicesPage, setInvoicesPage]         = useState(1);
  const [expandedInvoice, setExpandedInvoice]   = useState<string | null>(null);
  const [chartView, setChartView]               = useState<"status" | "type">("status");
  const PAGE_SIZE = 8;

  // Payout early request state
  const [showPayoutModal, setShowPayoutModal]   = useState(false);
  const [payoutRequested, setPayoutRequested]   = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const payoutModalCancelRef = useRef<HTMLButtonElement>(null);
  const historyModalCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showPayoutModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPayoutModal(false);
    };
    document.addEventListener("keydown", onKeyDown);
    // Move focus to Cancel button on open for keyboard accessibility
    const frame = requestAnimationFrame(() => payoutModalCancelRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(frame);
    };
  }, [showPayoutModal]);

  useEffect(() => {
    if (!showHistoryModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowHistoryModal(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const frame = requestAnimationFrame(() => historyModalCloseRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(frame);
    };
  }, [showHistoryModal]);

  const handleConfirmPayoutRequest = () => {
    setShowPayoutModal(false);
    setPayoutRequested(true);
    toast({
      title: "Early payout requested · Expected within 24–48 hours",
    });
  };

  const resetFilters = () => {
    setFilterMonth("All Months");
    setFilterSchool("All Schools");
    setFilterStudent("All Students");
    setFilterApptType("All Types");
    setPaymentsPage(1);
    setInvoicesPage(1);
  };

  const filteredPayments = useMemo(() => {
    return PAYMENTS.filter((p) => {
      if (filterMonth   !== "All Months"   && p.month !== filterMonth)           return false;
      if (filterSchool  !== "All Schools"  && p.school !== filterSchool)         return false;
      if (filterStudent !== "All Students" && p.studentOrSchool !== filterStudent) return false;
      if (filterApptType !== "All Types"   && p.appointmentType !== filterApptType &&
          !(filterApptType === "School Visit" && p.type === "school_visit"))     return false;
      return true;
    });
  }, [filterMonth, filterSchool, filterStudent, filterApptType]);

  const filteredInvoices = useMemo(() => {
    return INVOICES.filter((inv) => {
      if (filterMonth  !== "All Months"  && inv.month !== filterMonth) return false;
      if (filterSchool !== "All Schools" && inv.school !== filterSchool) return false;
      if (filterStudent !== "All Students" && inv.client !== filterStudent) return false;
      return true;
    });
  }, [filterMonth, filterSchool, filterStudent]);

  const paymentsSlice  = filteredPayments.slice((paymentsPage - 1) * PAGE_SIZE, paymentsPage * PAGE_SIZE);
  const invoicesSlice  = filteredInvoices.slice((invoicesPage - 1) * PAGE_SIZE, invoicesPage * PAGE_SIZE);
  const paymentPages   = Math.ceil(filteredPayments.length / PAGE_SIZE);
  const invoicePages   = Math.ceil(filteredInvoices.length / PAGE_SIZE);

  // KPI computations (unfiltered — always show YTD)
  const totalRevenue     = PAYMENTS.reduce((a, p) => a + p.amount, 0);
  const totalReceived    = PAYMENTS.filter((p) => p.status === "received").reduce((a, p) => a + p.amount, 0);
  const totalPending     = PAYMENTS.filter((p) => p.status === "pending" || p.status === "processing").reduce((a, p) => a + p.amount, 0);
  const totalOverdue     = PAYMENTS.filter((p) => p.status === "overdue").reduce((a, p) => a + p.amount, 0);
  const apptEarnings     = PAYMENTS.filter((p) => p.type === "appointment").reduce((a, p) => a + p.amount, 0);
  const visitEarnings    = PAYMENTS.filter((p) => p.type === "school_visit").reduce((a, p) => a + p.amount, 0);

  // Filtered KPIs
  const fTotal     = filteredPayments.reduce((a, p) => a + p.amount, 0);
  const fReceived  = filteredPayments.filter((p) => p.status === "received").reduce((a, p) => a + p.amount, 0);
  const fPending   = filteredPayments.filter((p) => p.status === "pending" || p.status === "processing").reduce((a, p) => a + p.amount, 0);

  const filtersActive = filterMonth !== "All Months" || filterSchool !== "All Schools" ||
                        filterStudent !== "All Students" || filterApptType !== "All Types";

  const chartData = MONTHLY_TREND;
  const apptPct   = Math.round(apptEarnings  / totalRevenue * 100);
  const visitPct  = Math.round(visitEarnings / totalRevenue * 100);

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
            data-testid="revenue-sidebar"
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
                    item.id === "revenue"
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
        <header className="h-16 bg-card/95 backdrop-blur border-b border-border flex items-center gap-3 px-4 sm:px-6 shrink-0" data-testid="revenue-header">
          <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-toggle-sidebar">
            <Menu className="w-4.5 h-4.5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Revenue Dashboard</p>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Jan–Apr 2026</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Earnings, invoices and payout tracking · Dr. Ananya Sharma</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-export-revenue"
              onClick={() => toast({ title: "Exporting report", description: "Revenue report PDF being prepared." })}>
              <Download className="w-3.5 h-3.5" /><span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-refresh-revenue"
              onClick={() => toast({ title: "Refreshed", description: "Revenue data synced with payment gateway." })}>
              <RefreshCw className="w-3.5 h-3.5" /><span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto" data-testid="revenue-body">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

            {/* ── KPI CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" data-testid="kpi-cards">
              <KpiCard
                testid="kpi-total"   index={0}
                label="Total Revenue"
                value={fmt(totalRevenue)}
                sub="Jan–Apr 2026 (YTD)"
                icon={<CircleDollarSign className="w-5 h-5" />}
                color="text-primary"
                bg="bg-primary/10"
                accentBar="bg-primary"
                trend="+18% vs last year"
                trendUp
              />
              <KpiCard
                testid="kpi-received" index={1}
                label="Received"
                value={fmt(totalReceived)}
                sub={`${PAYMENTS.filter(p => p.status === "received").length} payments collected`}
                icon={<CheckCircle2 className="w-5 h-5" />}
                color="text-green-600"
                bg="bg-green-50"
                accentBar="bg-green-500"
                trend={`${Math.round(totalReceived / totalRevenue * 100)}% of total`}
                trendUp
                progress={totalReceived / totalRevenue}
                progressColor="bg-green-500"
              />
              <KpiCard
                testid="kpi-pending" index={2}
                label="Pending"
                value={fmt(totalPending)}
                sub={`${PAYMENTS.filter(p => p.status === "pending" || p.status === "processing").length} awaiting payment`}
                icon={<Clock className="w-5 h-5" />}
                color="text-amber-600"
                bg="bg-amber-50"
                accentBar="bg-amber-500"
                trend={`${Math.round(totalPending / totalRevenue * 100)}% of total`}
                trendUp={false}
                progress={totalPending / totalRevenue}
                progressColor="bg-amber-400"
              />
              <KpiCard
                testid="kpi-appointments" index={3}
                label="Appointment Earnings"
                value={fmt(apptEarnings)}
                sub={`${PAYMENTS.filter(p => p.type === "appointment").length} sessions`}
                icon={<Calendar className="w-5 h-5" />}
                color="text-blue-600"
                bg="bg-blue-50"
                accentBar="bg-blue-500"
                trend={`Avg ${fmt(Math.round(apptEarnings / PAYMENTS.filter(p => p.type === "appointment").length))} /session`}
                trendUp
              />
              <KpiCard
                testid="kpi-visits" index={4}
                label="School Visit Earnings"
                value={fmt(visitEarnings)}
                sub={`${PAYMENTS.filter(p => p.type === "school_visit").length} visits`}
                icon={<Building2 className="w-5 h-5" />}
                color="text-primary"
                bg="bg-primary/10"
                accentBar="bg-primary"
                trend={`Avg ${fmt(Math.round(visitEarnings / PAYMENTS.filter(p => p.type === "school_visit").length))} /visit`}
                trendUp
              />
            </div>

            {/* ── EARNINGS BREAKDOWN ── */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-earnings-breakdown">
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-primary to-teal-500" />
              <div className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="shrink-0">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                      Earnings Breakdown
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Appointments vs School Visits · YTD</p>
                  </div>

                  {/* Stacked bar */}
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex rounded-full overflow-hidden h-3 bg-muted">
                      <div
                        className="bg-blue-500 transition-all duration-700"
                        style={{ width: `${apptPct}%` }}
                        title={`Appointments ${apptPct}%`}
                      />
                      <div
                        className="bg-primary transition-all duration-700"
                        style={{ width: `${visitPct}%` }}
                        title={`School Visits ${visitPct}%`}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="w-2 h-2 rounded-sm bg-blue-500 shrink-0" />
                        Appointments <span className="font-semibold text-foreground ml-1">{apptPct}%</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className="w-2 h-2 rounded-sm bg-primary shrink-0" />
                        School Visits <span className="font-semibold text-foreground ml-1">{visitPct}%</span>
                      </span>
                    </div>
                  </div>

                  {/* Side values */}
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Appointments</p>
                      <p className="text-sm font-bold text-blue-600">{fmt(apptEarnings)}</p>
                      <p className="text-[10px] text-muted-foreground">{PAYMENTS.filter(p => p.type === "appointment").length} sessions</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">School Visits</p>
                      <p className="text-sm font-bold text-primary">{fmt(visitEarnings)}</p>
                      <p className="text-[10px] text-muted-foreground">{PAYMENTS.filter(p => p.type === "school_visit").length} visits</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Total YTD</p>
                      <p className="text-sm font-bold text-foreground">{fmt(totalRevenue)}</p>
                      <p className="text-[10px] text-green-600 font-medium">+18% YoY</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── MONTHLY TREND CHART ── */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-monthly-trend">
              <div className="h-1 w-full bg-primary" />
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Monthly Revenue Trend</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {chartView === "status" ? "Received vs Pending by month" : "Appointments vs School Visits by month"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">Jan–Apr 2026</span>
                  <div className="flex rounded-xl overflow-hidden border border-border bg-muted/40">
                    <button
                      className={`text-[11px] font-medium px-3 py-1.5 transition-colors ${chartView === "status" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      data-testid="chart-tab-status"
                      onClick={() => setChartView("status")}
                    >By Status</button>
                    <button
                      className={`text-[11px] font-medium px-3 py-1.5 transition-colors ${chartView === "type" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      data-testid="chart-tab-type"
                      onClick={() => setChartView("type")}
                    >By Type</button>
                  </div>
                </div>
              </div>
              <div className="px-5 pt-5 pb-4" data-testid="trend-chart">
                <AnimatePresence mode="wait">
                  {chartView === "status" ? (
                    <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                      <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="received" name="Received" stackId="status" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorReceived)" dot={{ r: 3, fill: "hsl(var(--primary))" }} />
                          <Area type="monotone" dataKey="pending"  name="Pending"  stackId="status" stroke="#F59E0B"              strokeWidth={2} fill="url(#colorPending)"  dot={{ r: 3, fill: "#F59E0B" }} />
                        </AreaChart>
                      </ResponsiveContainer>
                      <ChartLegend items={[
                        { color: "hsl(var(--primary))", label: "Received" },
                        { color: "#F59E0B", label: "Pending" },
                      ]} />
                    </motion.div>
                  ) : (
                    <motion.div key="type" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 0 }} barSize={22} barGap={4}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="appt"   name="Appointments"  fill="#3B82F6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="visits" name="School Visits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                      <ChartLegend items={[
                        { color: "#3B82F6", label: "Appointments" },
                        { color: "hsl(var(--primary))", label: "School Visits" },
                      ]} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── FILTERS ROW ── */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="filters-row">
              <div className="h-1 w-full bg-slate-400/60" />
              <div className="px-5 py-3.5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs font-semibold text-foreground">Filter</p>
                    {filtersActive && (
                      <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                        {[filterMonth !== "All Months", filterSchool !== "All Schools", filterStudent !== "All Students", filterApptType !== "All Types"].filter(Boolean).length}
                      </span>
                    )}
                  </div>
                  <FilterDropdown
                    testid="filter-month"
                    value={filterMonth}
                    options={MONTHS_FILTER}
                    onChange={(v) => { setFilterMonth(v); setPaymentsPage(1); setInvoicesPage(1); }}
                    icon={<Calendar className="w-3 h-3" />}
                    active={filterMonth !== "All Months"}
                  />
                  <FilterDropdown
                    testid="filter-school"
                    value={filterSchool}
                    options={SCHOOLS}
                    onChange={(v) => { setFilterSchool(v); setPaymentsPage(1); setInvoicesPage(1); }}
                    icon={<Building2 className="w-3 h-3" />}
                    active={filterSchool !== "All Schools"}
                  />
                  <FilterDropdown
                    testid="filter-student"
                    value={filterStudent}
                    options={STUDENTS}
                    onChange={(v) => { setFilterStudent(v); setPaymentsPage(1); setInvoicesPage(1); }}
                    icon={<User className="w-3 h-3" />}
                    active={filterStudent !== "All Students"}
                  />
                  <FilterDropdown
                    testid="filter-appt-type"
                    value={filterApptType}
                    options={APPT_TYPES}
                    onChange={(v) => { setFilterApptType(v); setPaymentsPage(1); setInvoicesPage(1); }}
                    icon={<Calendar className="w-3 h-3" />}
                    active={filterApptType !== "All Types"}
                  />
                  {filtersActive && (
                    <button
                      className="text-[11px] text-primary hover:underline flex items-center gap-1"
                      data-testid="button-reset-filters"
                      onClick={resetFilters}
                    >
                      <XCircle className="w-3 h-3" />Clear filters
                    </button>
                  )}
                  {filtersActive && (
                    <div className="ml-auto flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-muted-foreground">Showing {filteredPayments.length} transactions</span>
                      <div className="flex gap-3 text-[11px]">
                        <span className="text-foreground font-semibold">Total: {fmt(fTotal)}</span>
                        <span className="text-green-600 font-semibold">Received: {fmt(fReceived)}</span>
                        <span className="text-amber-600 font-semibold">Pending: {fmt(fPending)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── TAB SWITCHER + TABLE ── */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="section-records">
              <div className="h-1 w-full bg-primary" />

              {/* Tabs */}
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-2" data-testid="records-tabs">
                  <button
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${activeTab === "payments" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    data-testid="tab-payments"
                    onClick={() => setActiveTab("payments")}
                  >
                    Payment History
                    <span className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full ${activeTab === "payments" ? "bg-white/20 text-white" : "bg-border text-muted-foreground"}`}>{filteredPayments.length}</span>
                  </button>
                  <button
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${activeTab === "invoices" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    data-testid="tab-invoices"
                    onClick={() => setActiveTab("invoices")}
                  >
                    Invoice List
                    <span className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full ${activeTab === "invoices" ? "bg-white/20 text-white" : "bg-border text-muted-foreground"}`}>{filteredInvoices.length}</span>
                  </button>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1" data-testid="button-download-table"
                  onClick={() => toast({ title: `${activeTab === "payments" ? "Payment history" : "Invoices"} downloaded`, description: "CSV export ready." })}>
                  <Download className="w-3 h-3" />Export CSV
                </Button>
              </div>

              {/* ── PAYMENT HISTORY TABLE ── */}
              {activeTab === "payments" && (
                <div data-testid="payments-table">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Student / School</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                          <th className="text-right px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                          <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentsSlice.map((p) => (
                          <tr
                            key={p.id}
                            className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${
                              p.status === "overdue" ? "bg-red-50/50" :
                              p.type === "school_visit" ? "bg-primary/[0.02]" : ""
                            }`}
                            data-testid={`payment-row-${p.id}`}
                          >
                            <td className={`py-3 text-muted-foreground whitespace-nowrap ${p.type === "school_visit" ? "pl-4 border-l-2 border-primary/40" : "px-5"}`}>
                              {p.date}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${p.type === "school_visit" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-700"}`}>
                                  {p.type === "school_visit"
                                    ? <Building2 className="w-3 h-3" />
                                    : <span>{initials(p.studentOrSchool)}</span>
                                  }
                                </div>
                                <span className="font-medium text-foreground truncate max-w-[120px]">{p.studentOrSchool}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground max-w-[180px]">
                              <p className="truncate">{p.description}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${p.type === "school_visit" ? "bg-primary/10 text-primary border border-primary/20" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                                {p.type === "school_visit" ? "School Visit" : p.appointmentType}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-foreground">{fmt(p.amount)}</td>
                            <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                            <td className="px-5 py-3">
                              <button
                                className="text-[10px] text-primary hover:underline flex items-center gap-1"
                                data-testid={`button-view-invoice-${p.id}`}
                                onClick={() => { setActiveTab("invoices"); const inv = filteredInvoices.find(i => i.invoiceNo === p.invoiceId); if (inv) setExpandedInvoice(inv.id); }}
                              >
                                <FileText className="w-3 h-3" />{p.invoiceId}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredPayments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground" data-testid="payments-empty">
                      <Receipt className="w-10 h-10 mb-3 opacity-20" />
                      <p className="text-sm font-medium">No payments match the current filters.</p>
                      <button className="mt-2 text-xs text-primary hover:underline" onClick={resetFilters}>Clear filters</button>
                    </div>
                  )}
                  {paymentPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-border" data-testid="payments-pagination">
                      <p className="text-[11px] text-muted-foreground">
                        Showing {(paymentsPage - 1) * PAGE_SIZE + 1}–{Math.min(paymentsPage * PAGE_SIZE, filteredPayments.length)} of {filteredPayments.length}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={paymentsPage === 1}
                          data-testid="button-payments-prev" onClick={() => setPaymentsPage((p) => p - 1)}>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Button>
                        {Array.from({ length: paymentPages }, (_, i) => i + 1).map((pg) => (
                          <button key={pg}
                            className={`h-7 w-7 text-xs rounded-lg transition-colors ${paymentsPage === pg ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
                            data-testid={`payments-page-${pg}`}
                            onClick={() => setPaymentsPage(pg)}
                          >{pg}</button>
                        ))}
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={paymentsPage === paymentPages}
                          data-testid="button-payments-next" onClick={() => setPaymentsPage((p) => p + 1)}>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── INVOICE LIST ── */}
              {activeTab === "invoices" && (
                <div data-testid="invoices-table">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Invoice #</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Client</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Due</th>
                          <th className="text-right px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                          <th className="text-right px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Net (after fee)</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                          <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoicesSlice.map((inv) => (
                          <React.Fragment key={inv.id}>
                            <tr
                              className={`border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer ${
                                inv.status === "overdue" ? "bg-red-50/50" :
                                inv.clientType === "school" ? "bg-primary/[0.02]" : ""
                              } ${expandedInvoice === inv.id ? "bg-muted/30" : ""}`}
                              onClick={() => setExpandedInvoice(expandedInvoice === inv.id ? null : inv.id)}
                              data-testid={`invoice-row-${inv.id}`}
                            >
                              <td className={`py-3 font-mono text-[11px] text-primary font-semibold ${inv.clientType === "school" ? "pl-4 border-l-2 border-primary/40" : "px-5"}`}>
                                {inv.invoiceNo}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold ${inv.clientType === "school" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-700"}`}>
                                    {inv.clientType === "school" ? <Building2 className="w-3 h-3" /> : <span>{initials(inv.client)}</span>}
                                  </div>
                                  <span className="font-medium text-foreground">{inv.client}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground max-w-[160px]">
                                <p className="truncate">{inv.items}</p>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{inv.date}</td>
                              <td className={`px-4 py-3 whitespace-nowrap ${inv.status === "overdue" ? "text-red-600 font-semibold" : "text-muted-foreground"}`}>{inv.dueDate}</td>
                              <td className="px-4 py-3 text-right font-semibold text-foreground">{fmt(inv.amount)}</td>
                              <td className="px-4 py-3 text-right font-semibold text-green-700">{fmt(inv.netAmount)}</td>
                              <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-1">
                                  <button className="p-1 rounded hover:bg-muted text-muted-foreground" data-testid={`button-view-invoice-detail-${inv.id}`}
                                    onClick={(e) => { e.stopPropagation(); setExpandedInvoice(expandedInvoice === inv.id ? null : inv.id); }}>
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button className="p-1 rounded hover:bg-muted text-muted-foreground" data-testid={`button-download-invoice-${inv.id}`}
                                    onClick={(e) => { e.stopPropagation(); toast({ title: `${inv.invoiceNo} downloaded`, description: "Invoice PDF ready." }); }}>
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                  {(inv.status === "pending" || inv.status === "overdue") && (
                                    <button className="p-1 rounded hover:bg-muted text-muted-foreground" data-testid={`button-send-reminder-${inv.id}`}
                                      onClick={(e) => { e.stopPropagation(); toast({ title: "Payment reminder sent", description: `Reminder sent to ${inv.client}.` }); }}>
                                      <Send className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                            <AnimatePresence>
                              {expandedInvoice === inv.id && (
                                <motion.tr
                                  key={`${inv.id}-detail`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <td colSpan={9} className="px-5 py-4 bg-muted/20 border-b border-border">
                                    <div className="flex flex-wrap gap-6 text-xs" data-testid={`invoice-detail-${inv.id}`}>
                                      <div>
                                        <p className="text-[10px] text-muted-foreground mb-0.5">Invoice No</p>
                                        <p className="font-semibold font-mono">{inv.invoiceNo}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] text-muted-foreground mb-0.5">Gross Amount</p>
                                        <p className="font-semibold">{fmt(inv.amount)}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] text-muted-foreground mb-0.5">Platform Fee (12%)</p>
                                        <p className="font-semibold text-red-600">−{fmt(inv.platformFee)}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] text-muted-foreground mb-0.5">Net to Counselor</p>
                                        <p className="font-semibold text-green-700">{fmt(inv.netAmount)}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] text-muted-foreground mb-0.5">School</p>
                                        <p className="font-medium">{inv.school}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] text-muted-foreground mb-0.5">Due Date</p>
                                        <p className={`font-medium ${inv.status === "overdue" ? "text-red-600" : ""}`}>{inv.dueDate}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] text-muted-foreground mb-0.5">Status</p>
                                        <StatusBadge status={inv.status} />
                                      </div>
                                    </div>
                                  </td>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredInvoices.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground" data-testid="invoices-empty">
                      <FileText className="w-10 h-10 mb-3 opacity-20" />
                      <p className="text-sm font-medium">No invoices match the current filters.</p>
                      <button className="mt-2 text-xs text-primary hover:underline" onClick={resetFilters}>Clear filters</button>
                    </div>
                  )}
                  {invoicePages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-border" data-testid="invoices-pagination">
                      <p className="text-[11px] text-muted-foreground">
                        Showing {(invoicesPage - 1) * PAGE_SIZE + 1}–{Math.min(invoicesPage * PAGE_SIZE, filteredInvoices.length)} of {filteredInvoices.length}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={invoicesPage === 1}
                          data-testid="button-invoices-prev" onClick={() => setInvoicesPage((p) => p - 1)}>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Button>
                        {Array.from({ length: invoicePages }, (_, i) => i + 1).map((pg) => (
                          <button key={pg}
                            className={`h-7 w-7 text-xs rounded-lg transition-colors ${invoicesPage === pg ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
                            data-testid={`invoices-page-${pg}`}
                            onClick={() => setInvoicesPage(pg)}
                          >{pg}</button>
                        ))}
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={invoicesPage === invoicePages}
                          data-testid="button-invoices-next" onClick={() => setInvoicesPage((p) => p + 1)}>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── PAYOUT STATUS ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" data-testid="section-payout">

              {/* Current payout cycle */}
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden" data-testid="payout-current-card">
                <div className="h-1 w-full bg-green-500" />
                <div className="px-5 py-3.5 border-b border-border flex items-center gap-2 bg-muted/20">
                  <Wallet className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Current Payout Cycle</p>
                  {payoutRequested ? (
                    <span className="ml-auto text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1" data-testid="payout-status-badge">
                      <CheckCircle2 className="w-2.5 h-2.5" />Requested
                    </span>
                  ) : (
                    <span className="ml-auto text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse" data-testid="payout-status-badge">
                      <RefreshCw className="w-2.5 h-2.5" />Processing
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                    <PayoutStat label="Payout Cycle"         value={PAYOUT.cycle}               />
                    <PayoutStat label="Cutoff Date"          value={PAYOUT.cutoffDate}           />
                    <PayoutStat label="Expected Payout"      value={PAYOUT.payoutDate}   highlight />
                    <PayoutStat label="Gross Pending"        value={fmt(PAYOUT.pendingAmount)}   />
                    <PayoutStat label={`Platform Fee (${PAYOUT.platformFeePercent}%)`} value={`−${fmt(PAYOUT.platformFeeAmount)}`} negative />
                    <PayoutStat label={`TDS (${PAYOUT.tdsPercent}%)`}                  value={`−${fmt(PAYOUT.tdsAmount)}`}        negative />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary/8 via-blue-50/50 to-primary/5 border border-primary/15">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Net Payout to Bank</p>
                      <p className="text-2xl font-bold text-primary mt-0.5 tracking-tight" data-testid="payout-net-amount">{fmt(PAYOUT.netPayout)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">Bank Account</p>
                      <p className="text-sm font-semibold text-foreground">{PAYOUT.bankAccount}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Expected: {PAYOUT.payoutDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {payoutRequested ? (
                      <Button size="sm" className="h-8 text-xs gap-1.5 flex-1" disabled data-testid="button-request-payout">
                        <CheckCircle2 className="w-3.5 h-3.5" />Request Submitted
                      </Button>
                    ) : (
                      <Button size="sm" className="h-8 text-xs gap-1.5 flex-1" data-testid="button-request-payout"
                        onClick={() => setShowPayoutModal(true)}>
                        <Send className="w-3.5 h-3.5" />Request Payout Early
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-view-payout-history"
                      onClick={() => setShowHistoryModal(true)}>
                      <Eye className="w-3.5 h-3.5" />History
                    </Button>
                  </div>
                </div>
              </div>

              {/* Last payout + breakdown */}
              <div className="flex flex-col gap-4">
                <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="payout-last-card">
                  <div className="h-1 w-full bg-green-500" />
                  <div className="px-5 py-3.5 border-b border-border flex items-center gap-2 bg-muted/20">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-semibold text-foreground">Last Payout</p>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Month</span>
                      <span className="text-xs font-semibold text-foreground">{PAYOUT.lastPayout.month}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Amount received</span>
                      <span className="text-sm font-bold text-green-700">{fmt(PAYOUT.lastPayout.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Date</span>
                      <span className="text-xs font-semibold text-foreground">{PAYOUT.lastPayout.date}</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center gap-1.5 text-[10px] text-green-600">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="font-medium">Successfully credited to bank</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overdue reminder */}
                {totalOverdue > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl overflow-hidden" data-testid="overdue-alert-card">
                    <div className="h-1 w-full bg-red-500" />
                    <div className="p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-red-800">Overdue Payment</p>
                          <p className="text-[11px] text-red-700 mt-0.5">
                            {fmt(totalOverdue)} overdue from Kavya Reddy (INV-022). Due date passed.
                          </p>
                          <button
                            className="mt-2 text-[11px] text-red-700 font-semibold hover:underline flex items-center gap-1"
                            data-testid="button-send-overdue-reminder"
                            onClick={() => toast({ title: "Overdue reminder sent", description: "Reminder sent to student and school coordinator." })}
                          >
                            <Send className="w-3 h-3" />Send reminder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-4" />
          </div>
        </div>
      </div>

      {/* ── PAYOUT REQUEST MODAL ── */}
      <AnimatePresence>
        {showPayoutModal && (
          <>
            {/* Backdrop */}
            <motion.div
              key="payout-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setShowPayoutModal(false)}
              data-testid="payout-modal-backdrop"
            />
            {/* Dialog */}
            <motion.div
              key="payout-dialog"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
                data-testid="payout-modal"
              >
                {/* Modal header */}
                <div className="h-1 w-full bg-gradient-to-r from-green-500 to-primary" />
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Request Early Payout</p>
                      <p className="text-[10px] text-muted-foreground">Review your payout details before confirming</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="w-7 h-7 rounded-lg hover:bg-muted text-muted-foreground flex items-center justify-center transition-colors"
                    data-testid="payout-modal-close"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>

                {/* Breakdown */}
                <div className="px-6 py-5 space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Gross Pending Amount</span>
                      <span className="text-xs font-semibold text-foreground">{fmt(PAYOUT.pendingAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Platform Fee ({PAYOUT.platformFeePercent}%)</span>
                      <span className="text-xs font-semibold text-red-600">−{fmt(PAYOUT.platformFeeAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">TDS ({PAYOUT.tdsPercent}%)</span>
                      <span className="text-xs font-semibold text-red-600">−{fmt(PAYOUT.tdsAmount)}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">Net Payout</span>
                      <span className="text-lg font-bold text-primary">{fmt(PAYOUT.netPayout)}</span>
                    </div>
                  </div>

                  {/* Bank destination */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/40 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{PAYOUT.bankAccount}</p>
                      <p className="text-[10px] text-muted-foreground">Payout destination</p>
                    </div>
                  </div>

                  {/* Info note */}
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      Early payout requests are processed within <span className="font-semibold">24–48 business hours</span>. Standard payout date was {PAYOUT.payoutDate}.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-5 flex gap-3">
                  <Button
                    ref={payoutModalCancelRef}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-9 text-xs"
                    onClick={() => setShowPayoutModal(false)}
                    data-testid="payout-modal-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 h-9 text-xs gap-1.5"
                    onClick={handleConfirmPayoutRequest}
                    data-testid="payout-modal-confirm"
                  >
                    <Send className="w-3.5 h-3.5" />Confirm Request
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── PAYOUT HISTORY MODAL ── */}
      <AnimatePresence>
        {showHistoryModal && (
          <>
            {/* Backdrop */}
            <motion.div
              key="history-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setShowHistoryModal(false)}
              data-testid="history-modal-backdrop"
            />
            {/* Dialog */}
            <motion.div
              key="history-dialog"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto overflow-hidden"
                data-testid="payout-history-modal"
              >
                {/* Modal header */}
                <div className="h-1 w-full bg-gradient-to-r from-primary to-green-500" />
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Payout History</p>
                      <p className="text-[10px] text-muted-foreground">Past payouts credited to your bank account</p>
                    </div>
                  </div>
                  <button
                    ref={historyModalCloseRef}
                    onClick={() => setShowHistoryModal(false)}
                    className="w-7 h-7 rounded-lg hover:bg-muted text-muted-foreground flex items-center justify-center transition-colors"
                    data-testid="history-modal-close"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" data-testid="payout-history-table">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border">
                        <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">Month</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">Gross</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">Platform Fee</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">TDS</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">Net Payout</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">Date Credited</th>
                        <th className="px-4 py-2.5 text-center font-semibold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PAYOUT_HISTORY.map((row, i) => (
                        <tr
                          key={row.month}
                          className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}
                          data-testid={`payout-history-row-${i}`}
                        >
                          <td className="px-4 py-3 font-medium text-foreground">{row.month}</td>
                          <td className="px-4 py-3 text-right text-foreground">{fmt(row.gross)}</td>
                          <td className="px-4 py-3 text-right text-red-600">−{fmt(row.platformFee)}</td>
                          <td className="px-4 py-3 text-right text-red-600">−{fmt(row.tds)}</td>
                          <td className="px-4 py-3 text-right font-bold text-green-700">{fmt(row.net)}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{row.dateCredited}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle2 className="w-3 h-3" />
                              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
                  <p className="text-[10px] text-muted-foreground">Showing {PAYOUT_HISTORY.length} past payouts · {PAYOUT.bankAccount}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => setShowHistoryModal(false)}
                    data-testid="history-modal-close-btn"
                  >
                    Close
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

/* ─── SUB-COMPONENTS ──────────────────────────────── */

function KpiCard({
  testid, label, value, sub, icon, color, bg, accentBar,
  trend, trendUp, progress, progressColor, index = 0,
}: {
  testid: string; label: string; value: string; sub: string;
  icon: React.ReactNode; color: string; bg: string; accentBar: string;
  trend: string; trendUp: boolean; progress?: number; progressColor?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
      data-testid={testid}
    >
      <div className={`h-1 w-full ${accentBar}`} />
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>{icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground leading-tight">{label}</p>
            <p className="text-xl font-bold text-foreground tracking-tight mt-0.5 leading-tight">{value}</p>
          </div>
        </div>
        {progress !== undefined && progressColor && (
          <div className="h-1 w-full rounded-full bg-muted mb-3 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${progressColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ duration: 0.7, delay: index * 0.05 + 0.2, ease: "easeOut" }}
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground leading-tight">{sub}</p>
          <span className={`text-[10px] font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${trendUp ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
            {trendUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
            {trend}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function PayoutStat({ label, value, highlight, negative }: { label: string; value: string; highlight?: boolean; negative?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? "text-primary" : negative ? "text-red-600" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function FilterDropdown({ testid, value, options, onChange, icon, active }: {
  testid: string; value: string; options: string[]; onChange: (v: string) => void; icon?: React.ReactNode; active?: boolean;
}) {
  return (
    <div className="relative flex items-center gap-1">
      <div className={`flex items-center h-8 gap-1.5 px-3 rounded-xl border transition-colors ${active ? "border-primary/50 bg-primary/5" : "border-border bg-background hover:border-primary/40"}`}>
        {icon && <span className={active ? "text-primary" : "text-muted-foreground"}>{icon}</span>}
        <select
          className={`bg-transparent text-xs focus:outline-none cursor-pointer pr-4 appearance-none ${active ? "text-primary font-medium" : "text-foreground"}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid={testid}
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className={`w-3 h-3 pointer-events-none ${active ? "text-primary" : "text-muted-foreground"}`} />
      </div>
    </div>
  );
}
