import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, CheckCircle2, Star, Calendar, Clock, ArrowRight,
  User, Camera, Landmark, GraduationCap, Briefcase, MapPin,
  BadgeCheck, Sparkles, ChevronRight, Lock, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ApprovedScreenProps {
  mobile: string;
  onSuccess?: () => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  done: boolean;
  icon: React.ReactNode;
  category: "completed" | "todo";
}

const CHECKLIST: ChecklistItem[] = [
  {
    id: "photo",
    label: "Profile photo uploaded",
    description: "Your headshot is live on your profile",
    done: true,
    icon: <Camera className="w-3.5 h-3.5" />,
    category: "completed",
  },
  {
    id: "personal",
    label: "Personal details complete",
    description: "Name, DOB and contact info verified",
    done: true,
    icon: <User className="w-3.5 h-3.5" />,
    category: "completed",
  },
  {
    id: "qualification",
    label: "Qualifications verified",
    description: "Degree and credentials approved",
    done: true,
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    category: "completed",
  },
  {
    id: "bank",
    label: "Bank details submitted",
    description: "Payout account is ready",
    done: true,
    icon: <Landmark className="w-3.5 h-3.5" />,
    category: "completed",
  },
  {
    id: "availability",
    label: "Set your availability schedule",
    description: "Let clients know when you're free",
    done: false,
    icon: <Calendar className="w-3.5 h-3.5" />,
    category: "todo",
  },
  {
    id: "bio",
    label: "Write a professional bio",
    description: "Help clients understand your approach",
    done: false,
    icon: <Briefcase className="w-3.5 h-3.5" />,
    category: "todo",
  },
  {
    id: "rates",
    label: "Set your session rates",
    description: "Define your pricing per session",
    done: false,
    icon: <Star className="w-3.5 h-3.5" />,
    category: "todo",
  },
  {
    id: "location",
    label: "Add session location or video link",
    description: "In-person address or virtual meeting URL",
    done: false,
    icon: <MapPin className="w-3.5 h-3.5" />,
    category: "todo",
  },
];

function CircularProgress({ pct, size = 120 }: { pct: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {pct}%
        </motion.span>
        <span className="text-[10px] text-muted-foreground font-medium">complete</span>
      </div>
    </div>
  );
}

function ApprovalBadge() {
  return (
    <div className="relative flex items-center justify-center mb-6">
      {/* Outer glow ring */}
      <motion.div
        className="absolute w-36 h-36 rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Badge body */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}
        className="relative z-10 w-28 h-28"
      >
        <svg viewBox="0 0 112 112" fill="none" className="w-full h-full drop-shadow-lg">
          {/* Hexagonal shield body */}
          <path
            d="M56 8 L96 28 L96 68 C96 85 78 98 56 104 C34 98 16 85 16 68 L16 28 Z"
            fill="hsl(var(--primary))"
          />
          {/* Inner highlight */}
          <path
            d="M56 16 L88 32 L88 68 C88 82 74 93 56 98 C38 93 24 82 24 68 L24 32 Z"
            fill="hsl(var(--primary))"
            opacity="0.6"
          />
          {/* Star accents */}
          <circle cx="40" cy="24" r="2" fill="white" opacity="0.4" />
          <circle cx="72" cy="24" r="2" fill="white" opacity="0.4" />
          <circle cx="30" cy="44" r="1.5" fill="white" opacity="0.3" />
          <circle cx="82" cy="44" r="1.5" fill="white" opacity="0.3" />
        </svg>
        {/* Animated checkmark on top */}
        <div className="absolute inset-0 flex items-center justify-center pb-2">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <motion.path
              d="M10 22 L18 30 L34 14"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, delay: 0.45, ease: "easeOut" }}
            />
          </svg>
        </div>
      </motion.div>

      {/* Floating sparkles */}
      {[
        { x: -52, y: -20, delay: 0.7, size: 14 },
        { x:  52, y: -28, delay: 0.9, size: 12 },
        { x: -40, y:  44, delay: 1.1, size: 10 },
        { x:  48, y:  36, delay: 0.8, size: 13 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute text-amber-400"
          style={{ left: `calc(50% + ${s.x}px)`, top: `calc(50% + ${s.y}px)` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 1.4, delay: s.delay, repeat: Infinity, repeatDelay: 2.8 }}
        >
          <Sparkles style={{ width: s.size, height: s.size }} />
        </motion.div>
      ))}
    </div>
  );
}

export default function ApprovedScreen({ mobile }: ApprovedScreenProps) {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState(CHECKLIST);

  const doneCount  = checklist.filter((i) => i.done).length;
  const totalCount = checklist.length;
  const pct        = Math.round((doneCount / totalCount) * 100);

  const toggle = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id && item.category === "todo" ? { ...item, done: !item.done } : item))
    );
  };

  const handleDashboard = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      toast({ title: "Opening dashboard…", description: "Welcome to MindBridge, counselor." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border" data-testid="approved-header">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-serif font-semibold text-foreground">MindBridge</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Verified badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
              data-testid="header-verified-badge"
            >
              <BadgeCheck className="w-3.5 h-3.5" />
              Verified Counselor
            </motion.div>
            <span className="font-mono text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded border border-border hidden sm:block">
              MB-{mobile.slice(-4)}-2026
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

          {/* ——— LEFT COLUMN ——— */}
          <div>
            {/* Hero celebration card */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="bg-card border border-border rounded-2xl p-8 text-center mb-6 overflow-hidden relative"
              data-testid="hero-card"
            >
              {/* Subtle background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-primary/5 pointer-events-none" />

              <div className="relative z-10">
                <ApprovalBadge />

                {/* Access Granted pill */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4"
                  data-testid="access-granted-badge"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Access Granted
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  className="text-3xl font-serif font-medium text-foreground mb-2"
                  data-testid="welcome-heading"
                >
                  Welcome to MindBridge
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.82 }}
                  className="text-muted-foreground text-sm max-w-sm mx-auto mb-2"
                >
                  Your application has been approved. You are now a verified counselor and your profile is live on MindBridge.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-xs text-muted-foreground mb-7"
                >
                  Approved 27 Apr 2026 · Notified to {mobile}
                </motion.p>

                {/* Dashboard CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="h-12 px-10 text-base shadow-lg shadow-primary/20 gap-2"
                    data-testid="button-go-dashboard"
                    onClick={handleDashboard}
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Approval details strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-3 gap-3 mb-6"
              data-testid="approval-details"
            >
              {[
                { icon: <BadgeCheck className="w-4 h-4 text-primary" />,    label: "Status",   value: "Approved",       bg: "bg-primary/10 border-primary/20" },
                { icon: <Clock      className="w-4 h-4 text-primary"    />, label: "Approved", value: "27 Apr 2026",    bg: "bg-primary/5 border-primary/15" },
                { icon: <Lock       className="w-4 h-4 text-primary"    />, label: "Access",   value: "Full Access",    bg: "bg-primary/5 border-primary/15" },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl p-3.5 border ${item.bg} text-center`}>
                  <div className="flex justify-center mb-1.5">{item.icon}</div>
                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Next-step checklist */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6"
              data-testid="checklist-card"
            >
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-foreground">Setup Checklist</h2>
                <span className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{doneCount}</span> / {totalCount} complete
                </span>
              </div>

              {/* Mini progress bar */}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-5">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, delay: 0.7 }}
                />
              </div>

              {/* Completed items */}
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />Completed during onboarding</p>
              <div className="space-y-2 mb-5">
                {checklist.filter((i) => i.category === "completed").map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.06 }}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-primary/5 border border-primary/10"
                    data-testid={`checklist-item-${item.id}`}
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground line-through decoration-primary/40">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="text-muted-foreground shrink-0">{item.icon}</span>
                  </motion.div>
                ))}
              </div>

              {/* To-do items */}
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />To complete next</p>
              <div className="space-y-2">
                {checklist.filter((i) => i.category === "todo").map((item, idx) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + idx * 0.07 }}
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl border text-left transition-colors ${
                      item.done
                        ? "bg-primary/5 border-primary/10"
                        : "bg-muted/40 border-border hover:bg-muted/70"
                    }`}
                    data-testid={`checklist-item-${item.id}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      item.done
                        ? "bg-primary/10 border-primary/20"
                        : "bg-background border-muted-foreground/30"
                    }`}>
                      {item.done && <CheckCircle2 className="w-3 h-3 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${item.done ? "text-foreground line-through decoration-primary/40" : "text-foreground"}`}>
                        {item.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-muted-foreground">{item.icon}</span>
                      {!item.done && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ——— RIGHT COLUMN ——— */}
          <div className="space-y-5">
            {/* Profile completion ring */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 text-center"
              data-testid="completion-card"
            >
              <h2 className="text-sm font-semibold text-foreground mb-4">Profile Completion</h2>
              <div className="flex justify-center mb-4">
                <CircularProgress pct={pct} size={128} />
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Complete the remaining steps to attract more clients and boost your visibility.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-primary/10 border border-primary/15 py-2 px-3">
                  <p className="font-semibold text-primary">{checklist.filter(i=>i.done).length}</p>
                  <p className="text-muted-foreground">Done</p>
                </div>
                <div className="rounded-lg bg-muted/40 border border-border py-2 px-3">
                  <p className="font-semibold text-foreground">{checklist.filter(i=>!i.done).length}</p>
                  <p className="text-muted-foreground">Remaining</p>
                </div>
              </div>
            </motion.div>

            {/* Notification confirmation */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 }}
              className="bg-primary text-primary-foreground rounded-2xl p-5"
              data-testid="notification-card"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Approval confirmed</p>
                  <p className="text-xs text-primary-foreground/80 leading-relaxed">
                    A confirmation SMS has been sent to <span className="font-semibold text-white">{mobile}</span>. Keep this number active for client notifications.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* What you can do now */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-card border border-border rounded-2xl p-5"
              data-testid="capabilities-card"
            >
              <h2 className="text-sm font-semibold text-foreground mb-3">You now have access to</h2>
              <div className="space-y-3">
                {[
                  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-primary" />, text: "Accept and manage client bookings" },
                  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-primary" />, text: "Video and in-person sessions" },
                  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-primary" />, text: "Session notes and client history" },
                  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-primary" />, text: "Earnings dashboard and payouts" },
                  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-primary" />, text: "Referrals and peer network" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <span className="mt-0.5 shrink-0">{item.icon}</span>
                    <span className="leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-9 text-xs gap-1.5"
                  data-testid="button-explore-features"
                  onClick={() => toast({ title: "Opening feature tour…" })}
                >
                  Explore all features
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>

            {/* Counselor ID card */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.32 }}
              className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-5 text-white"
              data-testid="counselor-id-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-white/80" />
                  <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">Counselor ID</span>
                </div>
                <BadgeCheck className="w-5 h-5 text-white/80" />
              </div>
              <p className="font-mono text-xl font-bold tracking-widest text-white mb-1">
                MB-{mobile.slice(-4)}-2026
              </p>
              <p className="text-xs text-white/60 mb-3">Issued 27 Apr 2026</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                <span className="text-xs text-white/80 font-medium">Active &amp; Verified</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
