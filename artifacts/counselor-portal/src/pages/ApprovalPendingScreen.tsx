import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Clock, CheckCircle2, Mail, Phone, MessageCircle,
  FileText, Briefcase, CreditCard, MapPin, Camera, Landmark,
  GraduationCap, User, Building2, CalendarClock, Bell,
  RefreshCw, ChevronRight, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApprovalPendingScreenProps {
  mobile: string;
  onSuccess?: () => void;
}

type StageStatus = "done" | "active" | "upcoming";

interface Stage {
  id: string;
  label: string;
  description: string;
  status: StageStatus;
  completedAt?: string;
}

interface SubmittedDoc {
  id: string;
  label: string;
  icon: React.ReactNode;
  fileName: string;
  submittedAt: string;
}

const STAGES: Stage[] = [
  {
    id: "received",
    label: "Application Received",
    description: "Your profile and documents have been received",
    status: "done",
    completedAt: "27 Apr 2026, 10:14 AM",
  },
  {
    id: "docs_review",
    label: "Document Review",
    description: "Compliance team is verifying your certificates and ID",
    status: "active",
  },
  {
    id: "background",
    label: "Background Check",
    description: "Professional licence and credentials verified externally",
    status: "upcoming",
  },
  {
    id: "final",
    label: "Final Approval",
    description: "Senior reviewer signs off on your complete application",
    status: "upcoming",
  },
  {
    id: "live",
    label: "Profile Goes Live",
    description: "Your counselor profile becomes visible to clients",
    status: "upcoming",
  },
];

const SUBMITTED_DOCS: SubmittedDoc[] = [
  { id: "personal",      label: "Personal Details",        icon: <User className="w-3.5 h-3.5" />,         fileName: "personal_details.pdf",   submittedAt: "27 Apr" },
  { id: "qualification", label: "Qualification",           icon: <GraduationCap className="w-3.5 h-3.5" />, fileName: "degree_certificate.pdf",  submittedAt: "27 Apr" },
  { id: "certificate",   label: "Professional Certificate",icon: <FileText className="w-3.5 h-3.5" />,      fileName: "counsellor_licence.pdf",  submittedAt: "27 Apr" },
  { id: "experience",    label: "Experience Document",     icon: <Briefcase className="w-3.5 h-3.5" />,     fileName: "experience_letter.pdf",   submittedAt: "27 Apr" },
  { id: "idproof",       label: "ID Proof",                icon: <CreditCard className="w-3.5 h-3.5" />,    fileName: "passport_scan.jpg",       submittedAt: "27 Apr" },
  { id: "organisation",  label: "Organisation Details",    icon: <Building2 className="w-3.5 h-3.5" />,     fileName: "organisation_details.pdf",submittedAt: "27 Apr" },
  { id: "address",       label: "Address Proof",           icon: <MapPin className="w-3.5 h-3.5" />,        fileName: "address_proof.pdf",       submittedAt: "27 Apr" },
  { id: "photo",         label: "Profile Photo",           icon: <Camera className="w-3.5 h-3.5" />,        fileName: "headshot.jpg",            submittedAt: "27 Apr" },
  { id: "bank",          label: "Bank Details",            icon: <Landmark className="w-3.5 h-3.5" />,      fileName: "bank_details.pdf",        submittedAt: "27 Apr" },
];

function PulsingRing() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center mx-auto mb-8">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-primary/20"
          initial={{ width: 48, height: 48, opacity: 0.8 }}
          animate={{ width: 128, height: 128, opacity: 0 }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.div
        className="relative z-10 w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-primary" />
        </motion.div>
      </motion.div>
    </div>
  );
}

function StageRow({ stage, isLast }: { stage: Stage; isLast: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
            stage.status === "done"
              ? "bg-primary border-primary"
              : stage.status === "active"
              ? "bg-primary border-primary"
              : "bg-background border-muted"
          }`}
          data-testid={`stage-${stage.id}`}
        >
          {stage.status === "done" ? (
            <CheckCircle2 className="w-4 h-4 text-white" />
          ) : stage.status === "active" ? (
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-white inline-block"
            />
          ) : (
            <span className="w-2 h-2 rounded-full bg-muted-foreground/30 inline-block" />
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 flex-1 min-h-8 mt-1 ${
              stage.status === "done" ? "bg-primary" : "bg-muted"
            }`}
          />
        )}
      </div>

      <div className={`pb-6 flex-1 min-w-0 ${isLast ? "pb-0" : ""}`}>
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span
            className={`text-sm font-semibold ${
              stage.status === "upcoming" ? "text-muted-foreground" : "text-foreground"
            }`}
          >
            {stage.label}
          </span>
          {stage.status === "active" && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <Clock className="w-3 h-3" />
              In Progress
            </span>
          )}
          {stage.status === "done" && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              <CheckCircle2 className="w-3 h-3" />
              Complete
            </span>
          )}
        </div>
        <p
          className={`text-xs leading-relaxed ${
            stage.status === "upcoming" ? "text-muted-foreground/60" : "text-muted-foreground"
          }`}
        >
          {stage.description}
        </p>
        {stage.completedAt && (
          <p className="text-xs text-green-600 mt-1">{stage.completedAt}</p>
        )}
      </div>
    </div>
  );
}

export default function ApprovalPendingScreen({ mobile, onSuccess }: ApprovalPendingScreenProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatElapsed = (s: number) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    return `${m}m ${s % 60}s`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-serif font-semibold text-foreground">MindBridge</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Session: {formatElapsed(elapsed)}</span>
            </div>
            <span className="font-mono text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
              MB-{mobile.slice(-4)}-2026
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* ——— LEFT COLUMN ——— */}
          <div>
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="bg-card border border-border rounded-2xl p-8 text-center mb-6"
              data-testid="hero-card"
            >
              <PulsingRing />
              <h1 className="text-2xl font-serif font-medium text-foreground mb-2">
                Your profile is under review
              </h1>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                Our compliance team is carefully reviewing your submitted documents and credentials. We'll notify you as soon as the review is complete.
              </p>

              {/* Status pill */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium"
                data-testid="status-pill"
              >
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-blue-500 inline-block"
                />
                Profile Under Review
              </div>
            </motion.div>

            {/* ETA Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 mb-6"
              data-testid="eta-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CalendarClock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">Estimated Review Time</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 p-4 rounded-xl bg-muted/40 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Expected completion</p>
                  <p className="text-lg font-semibold text-foreground">29 Apr 2026</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Within 2–3 business days</p>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-xs text-muted-foreground mb-1">SLA guarantee</p>
                  <p className="text-lg font-semibold text-primary">72 hrs</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Maximum wait time</p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Timelines may vary during high-volume periods. You'll receive an SMS at <span className="font-medium text-foreground">{mobile}</span> once a decision is made.</span>
              </div>
            </motion.div>

            {/* Approval Progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-2xl p-6 mb-6"
              data-testid="progress-stages"
            >
              <h2 className="text-sm font-semibold text-foreground mb-5">Approval Progress</h2>
              {STAGES.map((stage, idx) => (
                <StageRow key={stage.id} stage={stage} isLast={idx === STAGES.length - 1} />
              ))}
            </motion.div>

            {/* Support Contact */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6"
              data-testid="support-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Need help?</h2>
                  <p className="text-xs text-muted-foreground">Our support team is available Mon–Sat, 9 AM–7 PM IST</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="mailto:support@mindbridge.in"
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors group"
                  data-testid="contact-email"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Email</p>
                    <p className="text-xs text-muted-foreground">support@mindbridge.in</p>
                  </div>
                </a>

                <a
                  href="tel:+911800123456"
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors group"
                  data-testid="contact-phone"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Toll-Free</p>
                    <p className="text-xs text-muted-foreground">1800-123-4567</p>
                  </div>
                </a>

                <button
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors group text-left"
                  data-testid="contact-chat"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Live Chat</p>
                    <p className="text-xs text-muted-foreground">Avg. wait &lt; 2 min</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>

          {/* ——— RIGHT COLUMN ——— */}
          <div>
            {/* Notification reminder */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-primary text-primary-foreground rounded-2xl p-5 mb-5"
              data-testid="notification-banner"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">You'll be notified</p>
                  <p className="text-xs text-primary-foreground/80 leading-relaxed">
                    An SMS will be sent to <span className="font-semibold text-white">{mobile}</span> once your application is approved or if any action is needed.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Submitted Documents Summary */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.13 }}
              className="bg-card border border-border rounded-2xl p-5"
              data-testid="doc-summary"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">Submitted Documents</h2>
                <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                  {SUBMITTED_DOCS.length} files
                </span>
              </div>

              <div className="space-y-2">
                {SUBMITTED_DOCS.map((doc, idx) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.04 }}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
                    data-testid={`doc-item-${doc.id}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {doc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground leading-tight truncate">{doc.label}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{doc.fileName}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-[10px] text-muted-foreground">{doc.submittedAt}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Shield className="w-3.5 h-3.5" />
                  <span>All documents encrypted</span>
                </div>
                <span className="text-muted-foreground">27 Apr 2026</span>
              </div>
            </motion.div>

            {/* What happens next */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 }}
              className="mt-5 bg-card border border-border rounded-2xl p-5"
              data-testid="next-steps-card"
            >
              <h2 className="text-sm font-semibold text-foreground mb-3">What happens next?</h2>
              <div className="space-y-3">
                {[
                  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />, text: "You'll get an SMS once approved" },
                  { icon: <ChevronRight className="w-3.5 h-3.5 text-primary" />,  text: "Set your availability and session rates" },
                  { icon: <ChevronRight className="w-3.5 h-3.5 text-primary" />,  text: "Your profile goes live for client bookings" },
                  { icon: <ChevronRight className="w-3.5 h-3.5 text-primary" />,  text: "First payout within 7 days of first session" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <span className="mt-0.5 shrink-0">{item.icon}</span>
                    <span className="leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {onSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200"
                data-testid="approved-cta"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-green-800">Application Approved</p>
                    <p className="text-xs text-green-700">Your profile has been verified and is live.</p>
                  </div>
                  <Button
                    size="sm"
                    className="shrink-0 gap-1.5"
                    data-testid="button-view-approved"
                    onClick={onSuccess}
                  >
                    Access Portal
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
