import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, School, Calendar, CheckCircle2, Clock, MapPin, User,
  Phone, Mail, ChevronRight, Upload, FileText, AlertTriangle,
  LayoutDashboard, Users, IndianRupee, BarChart2, Settings,
  BadgeCheck, Plus, X, ChevronDown, ChevronUp, Edit3,
  Paperclip, Check, AlertCircle, Building2, Menu, Star,
  Clipboard, BookOpen, ArrowLeft, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface SchoolVisitScreenProps {
  mobile?: string;
}

type VisitStatus = "completed" | "scheduled" | "overdue" | "not-scheduled";
type InvitationSource = "Inupgro Platform" | "School Coordinator" | "Direct Referral" | "Self-initiated";

interface Visit {
  id: string;
  slot: 1 | 2;
  status: VisitStatus;
  date: string;
  time?: string;
  studentsAttended?: number;
  duration?: string;
  notes?: string;
  proofFile?: string;
  completedAt?: string;
  dueBy?: string;
}

interface School {
  id: string;
  name: string;
  city: string;
  address: string;
  board: string;
  totalStudents: number;
  totalStaff: number;
  principal: string;
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
  invitationSource: InvitationSource;
  invitationDate: string;
  assignedSince: string;
  color: string;
  visits: Visit[];
  accepted: boolean;
}

const SCHOOLS: School[] = [
  {
    id: "sc1",
    name: "St. Xavier's High School",
    city: "New Delhi",
    address: "12, Civil Lines, New Delhi - 110054",
    board: "CBSE",
    totalStudents: 312,
    totalStaff: 28,
    principal: "Dr. Ramesh Kapoor",
    coordinatorName: "Ms. Priya Soni",
    coordinatorPhone: "+91 98101 12345",
    coordinatorEmail: "priya.soni@stxaviers.edu.in",
    invitationSource: "Inupgro Platform",
    invitationDate: "10 Jan 2026",
    assignedSince: "15 Jan 2026",
    color: "bg-blue-500",
    accepted: true,
    visits: [
      {
        id: "v1a",
        slot: 1,
        status: "completed",
        date: "12 Feb 2026",
        time: "10:00 AM",
        studentsAttended: 47,
        duration: "3 hours",
        notes: "Conducted group session on exam stress management. Students were highly engaged. Identified 5 students needing individual follow-up. Session included breathing exercises and study planning techniques.",
        proofFile: "visit_proof_stxaviers_feb2026.pdf",
        completedAt: "12 Feb 2026, 1:30 PM",
      },
      {
        id: "v1b",
        slot: 2,
        status: "scheduled",
        date: "28 Apr 2026",
        time: "9:00 AM",
        dueBy: "30 Jun 2026",
        notes: "Planned: Follow-up group session + individual assessments for the 5 flagged students.",
      },
    ],
  },
  {
    id: "sc2",
    name: "Delhi Public School, Rohini",
    city: "New Delhi",
    address: "Sector 9, Rohini, New Delhi - 110085",
    board: "CBSE",
    totalStudents: 478,
    totalStaff: 42,
    principal: "Mr. Arvind Sharma",
    coordinatorName: "Ms. Neha Gupta",
    coordinatorPhone: "+91 99110 54321",
    coordinatorEmail: "neha.gupta@dpsrohini.edu.in",
    invitationSource: "School Coordinator",
    invitationDate: "15 Jan 2026",
    assignedSince: "20 Jan 2026",
    color: "bg-teal-500",
    accepted: true,
    visits: [
      {
        id: "v2a",
        slot: 1,
        status: "completed",
        date: "5 Mar 2026",
        time: "11:00 AM",
        studentsAttended: 63,
        duration: "2.5 hours",
        notes: "Career guidance session for Class 12 students. Covered CUET, entrance exam prep, stream selection. Well-received by students and staff. Parents' queries addressed after session.",
        proofFile: "visit_proof_dps_rohini_mar2026.pdf",
        completedAt: "5 Mar 2026, 1:30 PM",
      },
      {
        id: "v2b",
        slot: 2,
        status: "scheduled",
        date: "15 May 2026",
        time: "10:30 AM",
        dueBy: "30 Jun 2026",
        notes: "Planned: Peer conflict resolution workshop for Classes 9–11.",
      },
    ],
  },
  {
    id: "sc3",
    name: "Kendriya Vidyalaya, Sector 12",
    city: "Dwarka, New Delhi",
    address: "Sector 12, Dwarka, New Delhi - 110075",
    board: "KVS / CBSE",
    totalStudents: 267,
    totalStaff: 24,
    principal: "Mr. S. K. Mishra",
    coordinatorName: "Mrs. Sunita Rao",
    coordinatorPhone: "+91 97110 67890",
    coordinatorEmail: "sunita.rao@kvsector12.edu.in",
    invitationSource: "Inupgro Platform",
    invitationDate: "5 Jan 2026",
    assignedSince: "10 Jan 2026",
    color: "bg-blue-500",
    accepted: true,
    visits: [
      {
        id: "v3a",
        slot: 1,
        status: "completed",
        date: "20 Jan 2026",
        time: "9:30 AM",
        studentsAttended: 38,
        duration: "2 hours",
        notes: "Introductory session on mental health awareness. Emphasis on reducing stigma. Teacher sensitisation workshop also conducted for 12 teachers.",
        proofFile: "visit_proof_kv_sector12_jan2026.pdf",
        completedAt: "20 Jan 2026, 11:45 AM",
      },
      {
        id: "v3b",
        slot: 2,
        status: "not-scheduled",
        date: "",
        dueBy: "30 Sep 2026",
        notes: "",
      },
    ],
  },
  {
    id: "sc4",
    name: "Ryan International School",
    city: "Noida",
    address: "Sector 31, Noida, Uttar Pradesh - 201301",
    board: "CBSE",
    totalStudents: 389,
    totalStaff: 35,
    principal: "Ms. Kavita Mathur",
    coordinatorName: "Mr. Rohit Joshi",
    coordinatorPhone: "+91 95100 11223",
    coordinatorEmail: "rohit.joshi@ryannoida.edu.in",
    invitationSource: "Direct Referral",
    invitationDate: "20 Feb 2026",
    assignedSince: "1 Mar 2026",
    color: "bg-amber-500",
    accepted: true,
    visits: [
      {
        id: "v4a",
        slot: 1,
        status: "not-scheduled",
        date: "",
        dueBy: "31 Aug 2026",
        notes: "",
      },
      {
        id: "v4b",
        slot: 2,
        status: "not-scheduled",
        date: "",
        dueBy: "30 Nov 2026",
        notes: "",
      },
    ],
  },
  {
    id: "sc5",
    name: "Amity International School",
    city: "Vasant Kunj, New Delhi",
    address: "Sector C, Vasant Kunj, New Delhi - 110070",
    board: "CBSE",
    totalStudents: 520,
    totalStaff: 48,
    principal: "Dr. Meena Bhatia",
    coordinatorName: "Ms. Ritu Khanna",
    coordinatorPhone: "+91 98201 44556",
    coordinatorEmail: "ritu.khanna@amityvasantkunj.edu.in",
    invitationSource: "Inupgro Platform",
    invitationDate: "22 Apr 2026",
    assignedSince: "",
    color: "bg-purple-500",
    accepted: false,
    visits: [
      { id: "v5a", slot: 1, status: "not-scheduled", date: "", dueBy: "30 Sep 2026", notes: "" },
      { id: "v5b", slot: 2, status: "not-scheduled", date: "", dueBy: "31 Dec 2026", notes: "" },
    ],
  },
  {
    id: "sc6",
    name: "Modern School, Barakhamba",
    city: "New Delhi",
    address: "Barakhamba Road, New Delhi - 110001",
    board: "CBSE",
    totalStudents: 445,
    totalStaff: 39,
    principal: "Mr. Vijay Tandon",
    coordinatorName: "Mrs. Anjali Mehta",
    coordinatorPhone: "+91 99990 33221",
    coordinatorEmail: "anjali.mehta@modernschool.net",
    invitationSource: "School Coordinator",
    invitationDate: "25 Apr 2026",
    assignedSince: "",
    color: "bg-rose-500",
    accepted: false,
    visits: [
      { id: "v6a", slot: 1, status: "not-scheduled", date: "", dueBy: "30 Sep 2026", notes: "" },
      { id: "v6b", slot: 2, status: "not-scheduled", date: "", dueBy: "31 Dec 2026", notes: "" },
    ],
  },
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

const STATUS_CONFIG: Record<VisitStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  completed:     { label: "Completed",     bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  icon: <CheckCircle2  className="w-3.5 h-3.5" /> },
  scheduled:     { label: "Scheduled",     bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   icon: <Calendar      className="w-3.5 h-3.5" /> },
  overdue:       { label: "Overdue",       bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  "not-scheduled": { label: "Not Scheduled", bg: "bg-slate-50",  text: "text-slate-600",  border: "border-slate-200",  icon: <Clock         className="w-3.5 h-3.5" /> },
};

const SOURCE_CONFIG: Record<InvitationSource, { bg: string; text: string; border: string }> = {
  "Inupgro Platform":  { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  "School Coordinator":{ bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200"   },
  "Direct Referral":   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  "Self-initiated":    { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200"  },
};

function getSchoolStats(schools: School[]) {
  let total = 0, completed = 0, scheduled = 0, notScheduled = 0;
  schools.forEach((s) => {
    s.visits.forEach((v) => {
      total++;
      if (v.status === "completed") completed++;
      else if (v.status === "scheduled") scheduled++;
      else notScheduled++;
    });
  });
  const compliance = Math.round((completed / total) * 100);
  return { total, completed, scheduled, notScheduled, compliance };
}

interface MarkCompleteFormState {
  attendanceCount: string;
  duration: string;
  notes: string;
  proofUploaded: boolean;
}

export default function SchoolVisitScreen({ mobile = "9876543210" }: SchoolVisitScreenProps) {
  const { toast } = useToast();
  const [, navigate]         = useLocation();
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [selectedSchoolId, setSelectedSchoolId] = useState("sc1");
  const [schoolsData, setSchoolsData]   = useState<School[]>(SCHOOLS);
  const [leftTab, setLeftTab] = useState<"invites" | "not-visited" | "visited">(
    () => SCHOOLS.some((s) => !s.accepted) ? "invites" : "visited"
  );
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [completingVisit, setCompletingVisit] = useState<string | null>(null);
  const [schedulingVisit, setSchedulingVisit] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleNotes, setScheduleNotes] = useState("");
  const [completeForm, setCompleteForm] = useState<MarkCompleteFormState>({
    attendanceCount: "",
    duration: "",
    notes: "",
    proofUploaded: false,
  });

  const [showNewVisitForm, setShowNewVisitForm] = useState(false);
  const [newVisitForm, setNewVisitForm] = useState({
    schoolId: "",
    slot: "" as "" | "1" | "2",
    date: "",
    time: "",
    notes: "",
  });

  const selectedSchool = schoolsData.find((s) => s.id === selectedSchoolId)!;
  const stats = getSchoolStats(schoolsData.filter((s) => s.accepted));

  const acceptedSchools = schoolsData.filter((s) => s.accepted);

  const upcomingVisitsAll = acceptedSchools
    .flatMap((s) => s.visits.filter((v) => v.status === "scheduled").map((v) => ({ ...v, schoolName: s.name })))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleMarkComplete = (visitId: string) => {
    if (!completeForm.attendanceCount || !completeForm.duration || !completeForm.notes) {
      toast({ title: "Required fields missing", description: "Please fill in attendance, duration, and session notes." });
      return;
    }
    setSchoolsData((prev) =>
      prev.map((s) => ({
        ...s,
        visits: s.visits.map((v) =>
          v.id === visitId
            ? {
                ...v,
                status: "completed" as VisitStatus,
                studentsAttended: parseInt(completeForm.attendanceCount, 10),
                duration: completeForm.duration,
                notes: completeForm.notes,
                proofFile: completeForm.proofUploaded ? `visit_proof_${visitId}.pdf` : undefined,
                completedAt: "27 Apr 2026, 12:00 PM",
              }
            : v
        ),
      }))
    );
    setCompletingVisit(null);
    setCompleteForm({ attendanceCount: "", duration: "", notes: "", proofUploaded: false });
    toast({ title: "Visit marked complete", description: "Visit details saved and synced." });
  };

  const handleScheduleVisit = (visitId: string) => {
    if (!scheduleDate || !scheduleTime) {
      toast({ title: "Date and time required", description: "Please select a date and time for the visit." });
      return;
    }
    setSchoolsData((prev) =>
      prev.map((s) => ({
        ...s,
        visits: s.visits.map((v) =>
          v.id === visitId
            ? {
                ...v,
                status: "scheduled" as VisitStatus,
                date: scheduleDate,
                time: scheduleTime,
                notes: scheduleNotes,
              }
            : v
        ),
      }))
    );
    setSchedulingVisit(null);
    setScheduleDate("");
    setScheduleTime("");
    setScheduleNotes("");
    toast({ title: "Visit scheduled", description: `Visit scheduled for ${scheduleDate} at ${scheduleTime}.` });
  };

  const handleAcceptSchool = (schoolId: string) => {
    setSchoolsData((prev) =>
      prev.map((s) => s.id === schoolId ? { ...s, accepted: true, assignedSince: "28 Apr 2026" } : s)
    );
    setSelectedSchoolId(schoolId);
    setLeftTab("not-visited");
    toast({ title: "School accepted", description: "School added to your visit schedule." });
  };

  const handleRequestNewVisit = () => {
    const { schoolId, slot, date, time, notes } = newVisitForm;
    if (!schoolId || !slot || !date || !time) {
      toast({ title: "Required fields missing", description: "Please select a school, slot, date and time." });
      return;
    }
    const targetSchool = schoolsData.find((s) => s.id === schoolId)!;
    const visitId = targetSchool.visits.find((v) => v.slot === (parseInt(slot) as 1 | 2) && v.status === "not-scheduled")?.id;
    if (!visitId) {
      toast({ title: "Slot unavailable", description: "That visit slot has already been scheduled." });
      return;
    }
    const displayDate = date;
    const displayTime = (() => {
      const [h, m] = time.split(":");
      const hour = parseInt(h, 10);
      return `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
    })();
    setSchoolsData((prev) =>
      prev.map((s) => s.id !== schoolId ? s : {
        ...s,
        visits: s.visits.map((v) =>
          v.id === visitId
            ? { ...v, status: "scheduled" as VisitStatus, date: displayDate, time: displayTime, notes: notes || undefined }
            : v
        ),
      })
    );
    setSelectedSchoolId(schoolId);
    const hasAnyCompleted = targetSchool.visits.some((v) => v.status === "completed");
    setLeftTab(hasAnyCompleted ? "visited" : "not-visited");
    setShowNewVisitForm(false);
    setNewVisitForm({ schoolId: "", slot: "", date: "", time: "", notes: "" });
    toast({
      title: "Visit scheduled",
      description: `${targetSchool.name} · Visit ${slot} on ${displayDate} at ${displayTime}.`,
    });
  };

  const acceptedSchoolsWithSlots = schoolsData.filter(
    (s) => s.accepted && s.visits.some((v) => v.status === "not-scheduled")
  );
  const hasAvailableSlots = acceptedSchoolsWithSlots.length > 0;
  const newVisitAvailableSlots = newVisitForm.schoolId
    ? (schoolsData.find((s) => s.id === newVisitForm.schoolId)?.visits ?? []).filter((v) => v.status === "not-scheduled")
    : [];

  const inviteSchools    = schoolsData.filter((s) => !s.accepted);
  const notVisitedSchools = schoolsData.filter((s) => s.accepted && s.visits.every((v) => v.status !== "completed"));
  const visitedSchools   = schoolsData.filter((s) => s.accepted && s.visits.some((v) => v.status === "completed"));

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
            data-testid="visits-sidebar"
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
                    item.id === "schools"
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
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors cursor-pointer">
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
        <header className="h-16 bg-card/95 backdrop-blur border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0" data-testid="visits-header">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-toggle-sidebar">
              <Menu className="w-4.5 h-4.5" />
            </button>
            <div>
              <h1 className="text-sm font-serif font-semibold text-foreground leading-none">School Visit Management</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">Academic Year 2026 · 2 visits required per school</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
              <Shield className="w-3 h-3" />
              {stats.compliance}% Compliance
            </span>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5"
              data-testid="button-schedule-new-visit"
              disabled={!hasAvailableSlots}
              title={!hasAvailableSlots ? "All visits are scheduled" : undefined}
              onClick={() => setShowNewVisitForm((v) => !v)}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Request Visit</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col">

          {/* Summary strip */}
          <div className="border-b border-border bg-card/60 px-4 sm:px-6 py-3 flex items-center gap-2.5 overflow-x-auto shrink-0" data-testid="summary-strip">
            {[
              {
                label: "Assigned Schools",
                value: String(schoolsData.filter((s) => s.accepted).length),
                icon: <School className="w-3.5 h-3.5" />,
                iconBg: "bg-primary/10 text-primary",
                valueCls: "text-foreground",
                cardBg: "bg-primary/5 border-primary/15",
              },
              {
                label: "Visits Completed",
                value: String(stats.completed),
                icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                iconBg: "bg-green-100 text-green-600",
                valueCls: "text-green-700",
                cardBg: "bg-green-50/60 border-green-200/60",
              },
              {
                label: "Visits Scheduled",
                value: String(stats.scheduled),
                icon: <Calendar className="w-3.5 h-3.5" />,
                iconBg: "bg-blue-100 text-blue-600",
                valueCls: "text-blue-700",
                cardBg: "bg-blue-50/60 border-blue-200/60",
              },
              {
                label: "Not Yet Scheduled",
                value: String(stats.notScheduled),
                icon: <Clock className="w-3.5 h-3.5" />,
                iconBg: "bg-amber-100 text-amber-600",
                valueCls: "text-amber-700",
                cardBg: "bg-amber-50/60 border-amber-200/60",
              },
              {
                label: "Annual Compliance",
                value: `${stats.compliance}%`,
                icon: <BadgeCheck className="w-3.5 h-3.5" />,
                iconBg: stats.compliance >= 50 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500",
                valueCls: stats.compliance >= 50 ? "text-green-700" : "text-red-600",
                cardBg: stats.compliance >= 50 ? "bg-green-50/60 border-green-200/60" : "bg-red-50/60 border-red-200/60",
              },
            ].map((s) => (
              <div key={s.label}
                className={`flex items-center gap-2.5 shrink-0 px-3.5 py-2 rounded-xl border ${s.cardBg}`}
                data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${s.iconBg}`}>
                  {s.icon}
                </div>
                <div>
                  <p className={`text-base font-bold leading-tight ${s.valueCls}`}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Two-panel layout */}
          <div className="flex-1 overflow-hidden flex">

            {/* LEFT: School list with 3 tabs */}
            <div className="w-72 xl:w-80 border-r border-border flex flex-col shrink-0 bg-card/30" data-testid="school-list">

              {/* Tab switcher header */}
              <div className="px-3 pt-3 pb-0 border-b border-border shrink-0">
                <div className="flex gap-0.5">
                  {(
                    [
                      { key: "invites",     label: "Invites",     count: inviteSchools.length },
                      { key: "not-visited", label: "Not Visited", count: notVisitedSchools.length },
                      { key: "visited",     label: "Visited",     count: visitedSchools.length },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setLeftTab(tab.key)}
                      data-testid={`tab-${tab.key}`}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[10px] font-semibold transition-colors rounded-t-lg border-b-2 ${
                        leftTab === tab.key
                          ? "text-primary border-primary bg-primary/5"
                          : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {tab.label}
                      <span className={`inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold ${
                        leftTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>{tab.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto">

                {/* ── TAB 1: Invites ── */}
                {leftTab === "invites" && (
                  inviteSchools.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10">
                      <BadgeCheck className="w-8 h-8 text-green-500 mb-2" />
                      <p className="text-xs font-semibold text-foreground">All caught up!</p>
                      <p className="text-[10px] text-muted-foreground mt-1">No pending school invitations.</p>
                    </div>
                  ) : (
                    inviteSchools.map((school) => {
                      const isSelected = school.id === selectedSchoolId;
                      return (
                        <div
                          key={school.id}
                          className={`border-b border-border transition-colors ${isSelected ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/40"}`}
                          data-testid={`invite-item-${school.id}`}
                        >
                          <button
                            className="w-full text-left px-4 pt-4 pb-2"
                            onClick={() => setSelectedSchoolId(school.id)}
                            data-testid={`invite-row-select-${school.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full ${school.color} mt-1.5 shrink-0`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground truncate">{school.name}</p>
                                <p className="text-[10px] text-muted-foreground">{school.city}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className="text-[10px] bg-muted text-foreground px-1.5 py-0.5 rounded-full border border-border">{school.board}</span>
                                  <span className="text-[10px] text-muted-foreground">{school.totalStudents} students</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${SOURCE_CONFIG[school.invitationSource].bg} ${SOURCE_CONFIG[school.invitationSource].text} ${SOURCE_CONFIG[school.invitationSource].border}`}>
                                    {school.invitationSource}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">{school.invitationDate}</span>
                                </div>
                              </div>
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground/40"}`} />
                            </div>
                          </button>
                          <div className="px-4 pb-3 flex justify-end">
                            <Button
                              size="sm"
                              className="h-6 text-[10px] px-2.5"
                              data-testid={`button-accept-${school.id}`}
                              onClick={() => handleAcceptSchool(school.id)}
                            >
                              <Check className="w-2.5 h-2.5 mr-1" />Accept
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )
                )}

                {/* ── TAB 2: Not Visited ── */}
                {leftTab === "not-visited" && (
                  notVisitedSchools.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                      <p className="text-xs font-semibold text-foreground">All schools visited!</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Every accepted school has at least one completed visit.</p>
                    </div>
                  ) : (
                    notVisitedSchools.map((school) => {
                      const isSelected = school.id === selectedSchoolId;
                      const nextScheduled = school.visits.find((v) => v.status === "scheduled");
                      return (
                        <button
                          key={school.id}
                          className={`w-full text-left px-4 py-4 border-b border-border transition-colors ${
                            isSelected ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/40"
                          }`}
                          onClick={() => setSelectedSchoolId(school.id)}
                          data-testid={`not-visited-item-${school.id}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${school.color} mt-1.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">{school.name}</p>
                              <p className="text-[10px] text-muted-foreground">{school.city} · {school.totalStudents} students</p>
                              {/* Visit slot status dots */}
                              <div className="flex items-center gap-1.5 mt-2">
                                {school.visits.map((v) => (
                                  <div key={v.id} className="flex items-center gap-1">
                                    <div
                                      className={`w-4 h-4 rounded-full flex items-center justify-center border text-[8px] font-bold ${
                                        v.status === "scheduled"
                                          ? "bg-blue-500 border-blue-500 text-white"
                                          : "bg-background border-border text-muted-foreground"
                                      }`}
                                      title={`Visit ${v.slot}: ${STATUS_CONFIG[v.status].label}`}
                                    >
                                      {v.status === "scheduled"
                                        ? <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        : <span>{v.slot}</span>
                                      }
                                    </div>
                                  </div>
                                ))}
                                <span className="text-[10px] text-muted-foreground ml-1">0/2 visited</span>
                              </div>
                              {nextScheduled && (
                                <p className="text-[10px] text-blue-600 mt-1 flex items-center gap-1">
                                  <Calendar className="w-2.5 h-2.5" />{nextScheduled.date}
                                </p>
                              )}
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground/40"}`} />
                          </div>
                        </button>
                      );
                    })
                  )
                )}

                {/* ── TAB 3: Visited ── */}
                {leftTab === "visited" && (
                  visitedSchools.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10">
                      <School className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-xs font-semibold text-foreground">No visits yet</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Completed visits will appear here.</p>
                    </div>
                  ) : (
                    visitedSchools.map((school) => {
                      const isSelected = school.id === selectedSchoolId;
                      return (
                        <button
                          key={school.id}
                          className={`w-full text-left px-4 py-4 border-b border-border transition-colors ${
                            isSelected ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/40"
                          }`}
                          onClick={() => setSelectedSchoolId(school.id)}
                          data-testid={`visited-item-${school.id}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${school.color} mt-1.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">{school.name}</p>
                              <p className="text-[10px] text-muted-foreground">{school.city}</p>
                              {/* Visit 1 & Visit 2 status badges */}
                              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                {school.visits.map((v) => {
                                  const badgeCls =
                                    v.status === "completed"   ? "bg-green-50 text-green-700 border-green-200" :
                                    v.status === "scheduled"   ? "bg-blue-50 text-blue-700 border-blue-200"   :
                                    "bg-slate-50 text-slate-500 border-slate-200";
                                  const badgeIcon =
                                    v.status === "completed"   ? <Check className="w-2.5 h-2.5" /> :
                                    v.status === "scheduled"   ? <Calendar className="w-2.5 h-2.5" /> :
                                    <Clock className="w-2.5 h-2.5" />;
                                  const badgeLabel =
                                    v.status === "completed"   ? "Completed" :
                                    v.status === "scheduled"   ? "Scheduled" : "Not Scheduled";
                                  return (
                                    <span
                                      key={v.id}
                                      className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${badgeCls}`}
                                      title={`Visit ${v.slot}: ${STATUS_CONFIG[v.status].label}`}
                                    >
                                      {badgeIcon}Visit {v.slot} · {badgeLabel}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground/40"}`} />
                          </div>
                        </button>
                      );
                    })
                  )
                )}
              </div>

              {/* Upcoming visits mini-list */}
              <div className="border-t border-border px-4 py-3 bg-card/60 shrink-0" data-testid="upcoming-visits-list">
                <p className="text-[10px] font-medium text-muted-foreground mb-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />Upcoming Visits</p>
                {upcomingVisitsAll.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground">No upcoming visits scheduled.</p>
                ) : (
                  <div className="space-y-2">
                    {upcomingVisitsAll.map((v) => (
                      <div key={v.id} className="flex items-center gap-2" data-testid={`upcoming-visit-${v.id}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-medium text-foreground truncate">{v.schoolName}</p>
                          <p className="text-[10px] text-muted-foreground">{v.date} · {v.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Selected school detail */}
            <div className="flex-1 overflow-y-auto flex flex-col min-w-0">

              {/* ── REQUEST VISIT FORM (slide-down from header button) ── */}
              <AnimatePresence>
                {showNewVisitForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="border-b border-border overflow-hidden shrink-0"
                    data-testid="request-visit-form"
                  >
                    <div className="p-5 bg-blue-50/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                            <Calendar className="w-3.5 h-3.5" />
                          </span>
                          Request New School Visit
                        </p>
                        <button
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                          onClick={() => { setShowNewVisitForm(false); setNewVisitForm({ schoolId: "", slot: "", date: "", time: "", notes: "" }); }}
                          data-testid="button-close-request-form"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* School picker */}
                        <div>
                          <label className="text-[10px] font-medium text-muted-foreground block mb-1">School *</label>
                          <select
                            className="w-full h-8 px-2.5 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                            value={newVisitForm.schoolId}
                            onChange={(e) => setNewVisitForm((f) => ({ ...f, schoolId: e.target.value, slot: "" }))}
                            data-testid="select-new-visit-school"
                          >
                            <option value="">Select a school…</option>
                            {acceptedSchoolsWithSlots.map((s) => (
                              <option key={s.id} value={s.id}>{s.name} · {s.city}</option>
                            ))}
                          </select>
                        </div>

                        {/* Slot picker */}
                        <div>
                          <label className="text-[10px] font-medium text-muted-foreground block mb-1">Visit Slot *</label>
                          <select
                            className="w-full h-8 px-2.5 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer disabled:opacity-50"
                            value={newVisitForm.slot}
                            disabled={!newVisitForm.schoolId}
                            onChange={(e) => setNewVisitForm((f) => ({ ...f, slot: e.target.value as "" | "1" | "2" }))}
                            data-testid="select-new-visit-slot"
                          >
                            <option value="">Select slot…</option>
                            {newVisitAvailableSlots.map((v) => (
                              <option key={v.id} value={String(v.slot)}>Visit {v.slot} of 2{v.dueBy ? ` — due ${v.dueBy}` : ""}</option>
                            ))}
                          </select>
                        </div>

                        {/* Date */}
                        <div>
                          <label className="text-[10px] font-medium text-muted-foreground block mb-1">Date *</label>
                          <input
                            type="date"
                            className="w-full h-8 px-2.5 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            value={newVisitForm.date}
                            onChange={(e) => setNewVisitForm((f) => ({ ...f, date: e.target.value }))}
                            data-testid="input-new-visit-date"
                          />
                        </div>

                        {/* Time */}
                        <div>
                          <label className="text-[10px] font-medium text-muted-foreground block mb-1">Time *</label>
                          <input
                            type="time"
                            className="w-full h-8 px-2.5 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            value={newVisitForm.time}
                            onChange={(e) => setNewVisitForm((f) => ({ ...f, time: e.target.value }))}
                            data-testid="input-new-visit-time"
                          />
                        </div>
                      </div>

                      {/* Prep notes */}
                      <div>
                        <label className="text-[10px] font-medium text-muted-foreground block mb-1">Prep Notes (optional)</label>
                        <textarea
                          rows={2}
                          placeholder="What topics or activities are planned for this visit?"
                          className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                          value={newVisitForm.notes}
                          onChange={(e) => setNewVisitForm((f) => ({ ...f, notes: e.target.value }))}
                          data-testid="textarea-new-visit-notes"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline" size="sm" className="h-8 text-xs"
                          onClick={() => { setShowNewVisitForm(false); setNewVisitForm({ schoolId: "", slot: "", date: "", time: "", notes: "" }); }}
                        >Cancel</Button>
                        <Button
                          size="sm" className="h-8 text-xs gap-1.5"
                          data-testid="button-submit-request-visit"
                          onClick={handleRequestNewVisit}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />Confirm Visit Request
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
              <motion.div
                key={selectedSchoolId}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex-1"
                data-testid="school-detail-panel"
              >
                <div className="p-5 space-y-5">

                  {/* ── SCHOOL HERO CARD ── */}
                  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className={`h-1 w-full ${selectedSchool.color}`} />
                    <div className="p-4 relative overflow-hidden">
                      <div className="pointer-events-none absolute -top-6 -right-6 w-28 h-28 rounded-full bg-primary/4 blur-2xl" />
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-2xl ${selectedSchool.color} flex items-center justify-center shrink-0 shadow-sm`}>
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-base font-serif font-semibold text-foreground" data-testid="detail-school-name">
                              {selectedSchool.name}
                            </h2>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0" />{selectedSchool.address}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className="text-[10px] bg-muted text-foreground px-2 py-0.5 rounded-full font-semibold border border-border">{selectedSchool.board}</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Users className="w-2.5 h-2.5" />{selectedSchool.totalStudents} students
                              </span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <User className="w-2.5 h-2.5" />{selectedSchool.totalStaff} staff
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0" data-testid="mandate-badge">
                          <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold px-3 py-1.5 rounded-full">
                            <Shield className="w-3 h-3" />2 visits / year required
                          </div>
                        </div>
                      </div>

                      {/* Visit progress tracker */}
                      <div className="mt-4 pt-4 border-t border-border/60">
                        <div className="flex items-center gap-3">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide shrink-0">Visit Progress</p>
                          <div className="flex-1 flex items-center gap-2">
                            {selectedSchool.visits.map((v, idx) => (
                              <React.Fragment key={v.id}>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                                    v.status === "completed" ? "bg-green-500 border-green-500 text-white" :
                                    v.status === "scheduled" ? "bg-blue-500 border-blue-500 text-white" :
                                    "bg-background border-border text-muted-foreground"
                                  }`}>{v.slot}</div>
                                  <span className={`text-[10px] font-semibold ${
                                    v.status === "completed" ? "text-green-700" :
                                    v.status === "scheduled" ? "text-blue-700" :
                                    "text-muted-foreground"
                                  }`}>{STATUS_CONFIG[v.status].label}</span>
                                </div>
                                {idx < selectedSchool.visits.length - 1 && (
                                  <div className={`flex-1 h-0.5 rounded-full ${
                                    selectedSchool.visits[0].status === "completed" ? "bg-green-300" : "bg-border"
                                  }`} />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                          <span className="text-[10px] font-semibold text-muted-foreground shrink-0">
                            {selectedSchool.visits.filter((v) => v.status === "completed").length}/2
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── CONTACTS + ASSIGNMENT ── */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="school-details-grid">

                    {/* School Contacts */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                      <div className="h-1 w-full bg-teal-500" />
                      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs font-semibold text-foreground">School Contacts</p>
                      </div>
                      <div className="p-4 space-y-3">
                        {/* Principal */}
                        <div className="flex items-center gap-3 pb-3 border-b border-border/60">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                            {selectedSchool.principal.split(" ").slice(-2).map((w) => w[0]).join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">{selectedSchool.principal}</p>
                            <p className="text-[10px] text-muted-foreground">Principal</p>
                          </div>
                          <span className="text-[9px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-full shrink-0">Admin</span>
                        </div>
                        {/* Coordinator */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {selectedSchool.coordinatorName.split(" ").slice(-2).map((w) => w[0]).join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">{selectedSchool.coordinatorName}</p>
                            <p className="text-[10px] text-teal-600 font-medium mb-1.5">Counseling Coordinator</p>
                            <div className="space-y-1">
                              <a href={`tel:${selectedSchool.coordinatorPhone}`} className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                                <Phone className="w-2.5 h-2.5 shrink-0" />{selectedSchool.coordinatorPhone}
                              </a>
                              <a href={`mailto:${selectedSchool.coordinatorEmail}`} className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors truncate">
                                <Mail className="w-2.5 h-2.5 shrink-0" />{selectedSchool.coordinatorEmail}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Assignment Details */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="invitation-source-card">
                      <div className="h-1 w-full bg-primary" />
                      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs font-semibold text-foreground">Assignment Details</p>
                      </div>
                      <div className="p-4">
                        <div className="space-y-0">
                          {[
                            {
                              label: "Invitation Source",
                              content: (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${SOURCE_CONFIG[selectedSchool.invitationSource].bg} ${SOURCE_CONFIG[selectedSchool.invitationSource].text} ${SOURCE_CONFIG[selectedSchool.invitationSource].border}`}>
                                  {selectedSchool.invitationSource}
                                </span>
                              ),
                            },
                            { label: "Invitation Date",    content: <span className="text-[10px] font-medium text-foreground">{selectedSchool.invitationDate}</span> },
                            { label: "Assigned Since",     content: <span className="text-[10px] font-medium text-foreground">{selectedSchool.assignedSince || "Pending"}</span> },
                            { label: "Annual Requirement", content: <span className="text-[10px] font-semibold text-primary">2 visits by 31 Dec 2026</span> },
                          ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between gap-2 py-2.5 border-b border-border/50 last:border-0">
                              <span className="text-[10px] text-muted-foreground">{row.label}</span>
                              {row.content}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── VISIT SCHEDULE ── */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Visit Schedule · 2026</h3>
                      </div>
                      <span className="text-[11px] font-semibold text-muted-foreground bg-muted border border-border px-2.5 py-0.5 rounded-full">
                        {selectedSchool.visits.filter((v) => v.status === "completed").length}/2 complete
                      </span>
                    </div>

                    <div className="space-y-4" data-testid="visit-cards">
                      {selectedSchool.visits.map((visit) => {
                        const sc = STATUS_CONFIG[visit.status];
                        const isExpanded = expandedNote === visit.id;
                        const isCompleting = completingVisit === visit.id;
                        const isScheduling = schedulingVisit === visit.id;
                        const borderAccent =
                          visit.status === "completed" ? "border-l-green-500" :
                          visit.status === "scheduled"  ? "border-l-blue-500"  :
                          "border-l-slate-300";

                        return (
                          <motion.div
                            key={visit.id}
                            layout
                            className={`bg-card border border-l-4 ${borderAccent} rounded-2xl overflow-hidden`}
                            data-testid={`visit-card-${visit.id}`}
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
                                    visit.status === "completed" ? "bg-green-50 text-green-700" :
                                    visit.status === "scheduled" ? "bg-blue-50 text-blue-700" :
                                    "bg-muted text-muted-foreground"
                                  }`}>
                                    V{visit.slot}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                      <p className="text-xs font-semibold text-foreground">Visit {visit.slot} of 2</p>
                                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                                        {sc.icon}{sc.label}
                                      </span>
                                    </div>
                                    {visit.status === "completed" && (
                                      <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
                                        <Calendar className="w-2.5 h-2.5" />{visit.date}
                                        <span className="text-border">·</span>
                                        <Clock className="w-2.5 h-2.5" />{visit.time}
                                        <span className="text-border">·</span>
                                        {visit.duration}
                                        <span className="text-border">·</span>
                                        <Users className="w-2.5 h-2.5" />{visit.studentsAttended} students
                                      </p>
                                    )}
                                    {visit.status === "scheduled" && (
                                      <p className="text-[10px] text-blue-600 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />{visit.date} at {visit.time}
                                      </p>
                                    )}
                                    {visit.status === "not-scheduled" && (
                                      <p className="text-[10px] text-muted-foreground">
                                        Due by: <span className="font-semibold text-amber-600">{visit.dueBy}</span>
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {visit.status === "completed" && (
                                    <button
                                      onClick={() => setExpandedNote(isExpanded ? null : visit.id)}
                                      className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-muted transition-colors"
                                    >
                                      <FileText className="w-3.5 h-3.5" />Notes
                                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>
                                  )}
                                  {visit.status === "scheduled" && !isCompleting && (
                                    <Button size="sm" className="h-7 text-[11px]"
                                      data-testid={`button-complete-visit-${visit.id}`}
                                      onClick={() => setCompletingVisit(visit.id)}>
                                      <CheckCircle2 className="w-3 h-3 mr-1" />Mark Complete
                                    </Button>
                                  )}
                                  {visit.status === "not-scheduled" && !isScheduling && (
                                    <Button variant="outline" size="sm" className="h-7 text-[11px]"
                                      data-testid={`button-schedule-visit-${visit.id}`}
                                      onClick={() => setSchedulingVisit(visit.id)}>
                                      <Calendar className="w-3 h-3 mr-1" />Schedule
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {/* Proof badge for completed visits */}
                              {visit.status === "completed" && (
                                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/60">
                                  <div className={`flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-lg border ${
                                    visit.proofFile
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`} data-testid={`proof-status-${visit.id}`}>
                                    {visit.proofFile
                                      ? <><Paperclip className="w-3 h-3 mr-1" />{visit.proofFile}</>
                                      : <><AlertCircle className="w-3 h-3 mr-1" />No proof uploaded</>
                                    }
                                  </div>
                                  {!visit.proofFile && (
                                    <button
                                      className="text-[10px] text-primary flex items-center gap-1 hover:underline"
                                      data-testid={`button-upload-proof-${visit.id}`}
                                      onClick={() => {
                                        setSchoolsData((prev) =>
                                          prev.map((s) => ({
                                            ...s,
                                            visits: s.visits.map((v) =>
                                              v.id === visit.id
                                                ? { ...v, proofFile: `visit_proof_${visit.id}_upload.pdf` }
                                                : v
                                            ),
                                          }))
                                        );
                                        toast({ title: "Proof uploaded", description: "Attendance document saved." });
                                      }}
                                    >
                                      <Upload className="w-3 h-3" />Upload proof
                                    </button>
                                  )}
                                  <span className="text-[10px] text-muted-foreground ml-auto">Completed {visit.completedAt}</span>
                                </div>
                              )}

                              {/* Scheduled visit prep notes */}
                              {visit.status === "scheduled" && visit.notes && !isCompleting && (
                                <div className="mt-3 pt-3 border-t border-border/60">
                                  <p className="text-[10px] text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                                    <Clipboard className="w-3 h-3" />Prep Notes
                                  </p>
                                  <p className="text-[11px] text-foreground leading-relaxed">{visit.notes}</p>
                                </div>
                              )}
                            </div>

                            {/* Expanded session notes */}
                            <AnimatePresence>
                              {isExpanded && visit.status === "completed" && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="border-t border-border overflow-hidden"
                                  data-testid={`visit-notes-${visit.id}`}
                                >
                                  <div className="p-4 bg-muted/20">
                                    <p className="text-[10px] font-semibold text-muted-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Session Notes
                                    </p>
                                    <p className="text-xs text-foreground leading-relaxed">{visit.notes}</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Mark complete form */}
                            <AnimatePresence>
                              {isCompleting && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="border-t border-border overflow-hidden"
                                  data-testid={`complete-form-${visit.id}`}
                                >
                                  <div className="p-4 bg-green-50/40 space-y-3">
                                    <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                                      <span className="w-5 h-5 rounded-md bg-green-100 text-green-700 flex items-center justify-center"><CheckCircle2 className="w-3 h-3" /></span>
                                      Mark Visit as Complete
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-medium text-muted-foreground block mb-1">Students Attended *</label>
                                        <input type="number" min="1" placeholder="e.g. 45"
                                          className="w-full h-8 px-3 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                          value={completeForm.attendanceCount}
                                          onChange={(e) => setCompleteForm((f) => ({ ...f, attendanceCount: e.target.value }))}
                                          data-testid={`input-attendance-${visit.id}`} />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-medium text-muted-foreground block mb-1">Duration *</label>
                                        <input type="text" placeholder="e.g. 2.5 hours"
                                          className="w-full h-8 px-3 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                          value={completeForm.duration}
                                          onChange={(e) => setCompleteForm((f) => ({ ...f, duration: e.target.value }))}
                                          data-testid={`input-duration-${visit.id}`} />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-medium text-muted-foreground block mb-1">Session Notes *</label>
                                      <textarea rows={3}
                                        placeholder="Describe what was covered, student engagement, follow-ups needed…"
                                        className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                        value={completeForm.notes}
                                        onChange={(e) => setCompleteForm((f) => ({ ...f, notes: e.target.value }))}
                                        data-testid={`input-notes-${visit.id}`} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <button
                                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                                          completeForm.proofUploaded
                                            ? "bg-green-50 border-green-300 text-green-700"
                                            : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                                        }`}
                                        onClick={() => setCompleteForm((f) => ({ ...f, proofUploaded: !f.proofUploaded }))}
                                        data-testid={`button-upload-attendance-${visit.id}`}
                                      >
                                        {completeForm.proofUploaded
                                          ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Proof attached</>
                                          : <><Upload className="w-3.5 h-3.5 mr-1" />Upload attendance proof</>
                                        }
                                      </button>
                                      <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="h-7 text-[11px]"
                                          onClick={() => { setCompletingVisit(null); setCompleteForm({ attendanceCount: "", duration: "", notes: "", proofUploaded: false }); }}>
                                          Cancel
                                        </Button>
                                        <Button size="sm" className="h-7 text-[11px]"
                                          data-testid={`button-submit-complete-${visit.id}`}
                                          onClick={() => handleMarkComplete(visit.id)}>
                                          Save Visit
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Schedule visit form */}
                            <AnimatePresence>
                              {isScheduling && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="border-t border-border overflow-hidden"
                                  data-testid={`schedule-form-${visit.id}`}
                                >
                                  <div className="p-4 bg-blue-50/30 space-y-3">
                                    <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                                      <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center"><Calendar className="w-3 h-3" /></span>
                                      Schedule Visit {visit.slot}
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] font-medium text-muted-foreground block mb-1">Date *</label>
                                        <input type="date"
                                          className="w-full h-8 px-3 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                          value={scheduleDate}
                                          onChange={(e) => setScheduleDate(e.target.value)}
                                          data-testid={`input-schedule-date-${visit.id}`} />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-medium text-muted-foreground block mb-1">Time *</label>
                                        <input type="time"
                                          className="w-full h-8 px-3 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                          value={scheduleTime}
                                          onChange={(e) => setScheduleTime(e.target.value)}
                                          data-testid={`input-schedule-time-${visit.id}`} />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-medium text-muted-foreground block mb-1">Prep Notes</label>
                                      <textarea rows={2}
                                        placeholder="What topics or activities are planned for this visit?"
                                        className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                        value={scheduleNotes}
                                        onChange={(e) => setScheduleNotes(e.target.value)}
                                        data-testid={`input-schedule-notes-${visit.id}`} />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button variant="outline" size="sm" className="h-7 text-[11px]"
                                        onClick={() => { setSchedulingVisit(null); setScheduleDate(""); setScheduleTime(""); setScheduleNotes(""); }}>
                                        Cancel
                                      </Button>
                                      <Button size="sm" className="h-7 text-[11px]"
                                        data-testid={`button-submit-schedule-${visit.id}`}
                                        onClick={() => handleScheduleVisit(visit.id)}>
                                        Confirm Schedule
                                      </Button>
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

                  {/* ── VISIT HISTORY ── */}
                  <div className="bg-card border border-border rounded-2xl overflow-hidden" data-testid="visit-history">
                    <div className="h-1 w-full bg-green-500" />
                    <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs font-semibold text-foreground">Visit History — {selectedSchool.name}</p>
                    </div>
                    <div className="p-4">
                      {selectedSchool.visits.filter((v) => v.status === "completed").length === 0 ? (
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground">No completed visits yet for this school.</p>
                        </div>
                      ) : (
                        <div className="space-y-0">
                          {selectedSchool.visits
                            .filter((v) => v.status === "completed")
                            .map((v, idx, arr) => (
                              <div key={v.id} className="flex items-start gap-3" data-testid={`history-item-${v.id}`}>
                                {/* Timeline line + dot */}
                                <div className="flex flex-col items-center shrink-0 pt-0.5">
                                  <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                  {idx < arr.length - 1 && (
                                    <div className="w-px flex-1 bg-border my-1 min-h-[16px]" />
                                  )}
                                </div>
                                <div className={`flex-1 min-w-0 pb-4 ${idx < arr.length - 1 ? "" : ""}`}>
                                  <div className="flex items-start justify-between gap-2 mb-0.5">
                                    <p className="text-xs font-semibold text-foreground">Visit {v.slot} · {v.date}</p>
                                    <span className="text-[10px] text-muted-foreground shrink-0 bg-muted px-1.5 py-0.5 rounded-full border border-border">{v.duration}</span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                                    <Users className="w-2.5 h-2.5" />{v.studentsAttended} students attended
                                    <span className="text-border">·</span>
                                    {v.completedAt}
                                  </p>
                                  {v.notes && (
                                    <p className="text-[11px] text-foreground/80 mt-1.5 leading-relaxed line-clamp-2 bg-muted/30 rounded-lg px-2.5 py-1.5 border border-border/60">{v.notes}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
