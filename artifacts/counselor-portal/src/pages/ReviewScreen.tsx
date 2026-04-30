import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, CheckCircle2, Clock, XCircle, AlertTriangle,
  FileText, Upload, RefreshCw, ChevronDown, ChevronUp, ChevronRight,
  Briefcase, CreditCard, MapPin, Camera, Landmark,
  GraduationCap, User, Building2, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ReviewScreenProps {
  mobile: string;
  onSuccess?: () => void;
}

type DocStatus = "under_review" | "approved" | "rejected" | "pending";

interface Document {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: DocStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  fileName: string;
}

type AppStatus = "submitted" | "under_review" | "action_required" | "approved";

const TIMELINE_STEPS: { id: AppStatus; label: string; sub: string }[] = [
  { id: "submitted",       label: "Submitted",       sub: "Application received" },
  { id: "under_review",    label: "Under Review",    sub: "Team verifying docs"  },
  { id: "action_required", label: "Action Required", sub: "Some docs need re-upload" },
  { id: "approved",        label: "Approved",        sub: "Profile goes live"    },
];

const STEP_ORDER: AppStatus[] = ["submitted", "under_review", "action_required", "approved"];

const INITIAL_DOCS: Document[] = [
  {
    id: "personal",
    label: "Personal Details",
    icon: <User className="w-4 h-4" />,
    status: "approved",
    submittedAt: "27 Apr 2026, 10:14 AM",
    reviewedAt: "27 Apr 2026, 11:02 AM",
    fileName: "personal_details.pdf",
  },
  {
    id: "qualification",
    label: "Qualification",
    icon: <GraduationCap className="w-4 h-4" />,
    status: "approved",
    submittedAt: "27 Apr 2026, 10:14 AM",
    reviewedAt: "27 Apr 2026, 11:05 AM",
    fileName: "degree_certificate.pdf",
  },
  {
    id: "certificate",
    label: "Professional Certificate",
    icon: <FileText className="w-4 h-4" />,
    status: "under_review",
    submittedAt: "27 Apr 2026, 10:14 AM",
    fileName: "counsellor_licence.pdf",
  },
  {
    id: "experience",
    label: "Experience Document",
    icon: <Briefcase className="w-4 h-4" />,
    status: "under_review",
    submittedAt: "27 Apr 2026, 10:14 AM",
    fileName: "experience_letter.pdf",
  },
  {
    id: "idproof",
    label: "ID Proof",
    icon: <CreditCard className="w-4 h-4" />,
    status: "rejected",
    submittedAt: "27 Apr 2026, 10:14 AM",
    reviewedAt: "27 Apr 2026, 11:20 AM",
    rejectionReason: "The uploaded document appears to be expired. Please upload a valid government-issued ID with an expiry date after today.",
    fileName: "passport_scan.jpg",
  },
  {
    id: "organisation",
    label: "Organisation Details",
    icon: <Building2 className="w-4 h-4" />,
    status: "approved",
    submittedAt: "27 Apr 2026, 10:14 AM",
    reviewedAt: "27 Apr 2026, 11:08 AM",
    fileName: "organisation_details.pdf",
  },
  {
    id: "address",
    label: "Address Proof",
    icon: <MapPin className="w-4 h-4" />,
    status: "rejected",
    submittedAt: "27 Apr 2026, 10:14 AM",
    reviewedAt: "27 Apr 2026, 11:22 AM",
    rejectionReason: "The document is older than 3 months. Please upload a utility bill, bank statement, or rental agreement dated within the last 3 months.",
    fileName: "address_proof.pdf",
  },
  {
    id: "photo",
    label: "Profile Photo",
    icon: <Camera className="w-4 h-4" />,
    status: "approved",
    submittedAt: "27 Apr 2026, 10:14 AM",
    reviewedAt: "27 Apr 2026, 11:10 AM",
    fileName: "headshot.jpg",
  },
  {
    id: "bank",
    label: "Bank Details",
    icon: <Landmark className="w-4 h-4" />,
    status: "under_review",
    submittedAt: "27 Apr 2026, 10:14 AM",
    fileName: "bank_details.pdf",
  },
];

const STATUS_CONFIG: Record<DocStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  under_review: {
    label: "Under Review",
    bg: "bg-primary/5",
    text: "text-primary",
    border: "border-primary/20",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  approved: {
    label: "Approved",
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
};

function DocStatusBadge({ status }: { status: DocStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

function ResubmitZone({ docId, onResubmit }: { docId: string; onResubmit: (id: string) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    onResubmit(docId);
    setTimeout(() => inputRef.current?.click(), 0);
  };

  return (
    <div className="mt-3">
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        data-testid={`resubmit-input-${docId}`}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
        data-testid={`button-resubmit-${docId}`}
        onClick={handleClick}
      >
        <Upload className="w-3.5 h-3.5" />
        Resubmit Document
      </Button>
    </div>
  );
}

function DocumentCard({ doc, onResubmit }: { doc: Document; onResubmit: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const isRejected = doc.status === "rejected";

  return (
    <motion.div
      layout
      className={`border rounded-xl overflow-hidden transition-colors ${
        isRejected ? "border-red-200 bg-red-50/30" : "border-border bg-card"
      }`}
    >
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => setExpanded((v) => !v)}
        data-testid={`doc-card-toggle-${doc.id}`}
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isRejected ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
        }`}>
          {doc.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{doc.label}</span>
            <DocStatusBadge status={doc.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{doc.fileName}</p>
        </div>

        <span className="text-muted-foreground shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground mb-0.5">Submitted</p>
                  <p className="font-medium text-foreground">{doc.submittedAt}</p>
                </div>
                {doc.reviewedAt && (
                  <div>
                    <p className="text-muted-foreground mb-0.5">Reviewed</p>
                    <p className="font-medium text-foreground">{doc.reviewedAt}</p>
                  </div>
                )}
              </div>

              {isRejected && doc.rejectionReason && (
                <div className="flex gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-red-700 mb-1">Rejection Reason</p>
                    <p className="text-xs text-red-600 leading-relaxed">{doc.rejectionReason}</p>
                  </div>
                </div>
              )}

              {isRejected && <ResubmitZone docId={doc.id} onResubmit={onResubmit} />}

              {doc.status === "under_review" && (
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="inline-block"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </motion.span>
                  Our team is currently reviewing this document
                </div>
              )}

              {doc.status === "approved" && (
                <div className="flex items-center gap-2 text-xs text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified and accepted by our compliance team
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ReviewScreen({ mobile, onSuccess }: ReviewScreenProps) {
  const { toast } = useToast();
  const [docs, setDocs] = useState<Document[]>(INITIAL_DOCS);
  const [resubmittedIds, setResubmittedIds] = useState<Set<string>>(new Set());

  const approvedCount   = docs.filter((d) => d.status === "approved").length;
  const rejectedCount   = docs.filter((d) => d.status === "rejected").length;
  const reviewingCount  = docs.filter((d) => d.status === "under_review").length;
  const total           = docs.length;

  const appStatus: AppStatus = rejectedCount > 0 ? "action_required" : "under_review";
  const currentStepIdx = STEP_ORDER.indexOf(appStatus);

  const overallPct = Math.round((approvedCount / total) * 100);

  const handleResubmit = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "under_review", rejectionReason: undefined, reviewedAt: undefined } : d))
    );
    setResubmittedIds((prev) => new Set(prev).add(id));
    toast({
      title: "Document resubmitted",
      description: "Your document is back under review. We'll notify you at " + mobile + " once it's checked.",
    });
  };

  const groupedByStatus: Record<string, Document[]> = {
    rejected:     docs.filter((d) => d.status === "rejected"),
    under_review: docs.filter((d) => d.status === "under_review"),
    approved:     docs.filter((d) => d.status === "approved"),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-serif font-semibold text-foreground">MindBridge</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:block">Application ID</span>
            <span className="font-mono font-semibold text-foreground bg-muted px-2 py-0.5 rounded">MB-{mobile.slice(-4)}-2026</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-serif font-medium text-foreground mb-1"
          >
            Document Verification Status
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-sm"
          >
            Submitted 27 Apr 2026 at 10:14 AM · Notifications sent to {mobile}
          </motion.p>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border rounded-2xl p-6 mb-6"
        >
          <h2 className="text-sm font-semibold text-foreground mb-5">Application Progress</h2>
          <div className="relative flex items-start justify-between gap-2" data-testid="timeline">
            {/* Connector line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted" />
            <motion.div
              className="absolute top-4 left-4 h-0.5 bg-primary origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: currentStepIdx / (TIMELINE_STEPS.length - 1) }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              style={{ width: `calc(100% - 2rem)` }}
            />

            {TIMELINE_STEPS.map((step, idx) => {
              const isDone    = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const isFuture  = idx > currentStepIdx;
              const isActionRequired = step.id === "action_required" && isCurrent;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 flex-1 min-w-0"
                  data-testid={`timeline-step-${step.id}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    isDone    ? "bg-primary border-primary"
                    : isCurrent && isActionRequired ? "bg-amber-500 border-amber-500"
                    : isCurrent ? "bg-primary border-primary"
                    : "bg-background border-muted"
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : isCurrent && isActionRequired ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-white" />
                    ) : isCurrent ? (
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                        className="w-2.5 h-2.5 rounded-full bg-white inline-block"
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/30 inline-block" />
                    )}
                  </div>
                  <div className="text-center px-1">
                    <p className={`text-xs font-semibold leading-tight ${
                      isFuture ? "text-muted-foreground" : isActionRequired ? "text-amber-700" : "text-foreground"
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight hidden sm:block">{step.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
          data-testid="summary-cards"
        >
          {[
            { label: "Total",        value: total,          bg: "bg-muted/50",    text: "text-foreground", icon: <FileText className="w-4 h-4" /> },
            { label: "Approved",     value: approvedCount,  bg: "bg-primary/10",  text: "text-primary",    icon: <CheckCircle2 className="w-4 h-4" /> },
            { label: "Under Review", value: reviewingCount, bg: "bg-primary/5",   text: "text-primary",    icon: <Clock className="w-4 h-4" /> },
            { label: "Rejected",     value: rejectedCount,  bg: "bg-red-50",      text: "text-red-700",    icon: <XCircle className="w-4 h-4" /> },
          ].map((card) => (
            <div key={card.label} className={`rounded-xl p-4 border border-border ${card.bg}`}>
              <div className={`mb-1.5 ${card.text}`}>{card.icon}</div>
              <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Overall progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Overall verification progress</span>
            <span className="font-semibold text-foreground">{overallPct}% approved</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </div>
        </motion.div>

        {/* Action Required Banner */}
        {rejectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6"
            data-testid="action-required-banner"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-0.5">Action required — {rejectedCount} {rejectedCount === 1 ? "document" : "documents"} rejected</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Please review the rejection reasons below and resubmit the corrected documents. Your application will continue once all documents are verified.
              </p>
            </div>
          </motion.div>
        )}

        {/* Document Groups */}
        <div className="space-y-6">
          {/* Rejected */}
          {groupedByStatus.rejected.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              data-testid="section-rejected"
            >
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-semibold text-foreground">Rejected — Action Required</h3>
                <span className="text-xs font-medium bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
                  {groupedByStatus.rejected.length}
                </span>
              </div>
              <div className="space-y-3">
                {groupedByStatus.rejected.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} onResubmit={handleResubmit} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Under Review */}
          {groupedByStatus.under_review.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-testid="section-under-review"
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Under Review</h3>
                <span className="text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                  {groupedByStatus.under_review.length}
                </span>
              </div>
              <div className="space-y-3">
                {groupedByStatus.under_review.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} onResubmit={handleResubmit} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Approved */}
          {groupedByStatus.approved.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              data-testid="section-approved"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Approved</h3>
                <span className="text-xs font-medium bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                  {groupedByStatus.approved.length}
                </span>
              </div>
              <div className="space-y-3">
                {groupedByStatus.approved.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} onResubmit={handleResubmit} />
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Info footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex gap-2.5 p-4 rounded-xl bg-muted/40 border border-border"
          data-testid="info-footer"
        >
          <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Review typically takes 1–2 business days. You'll receive an SMS at <span className="font-medium text-foreground">{mobile}</span> once each document is verified. For urgent queries, contact <span className="font-medium text-foreground">support@mindbridge.in</span>.
          </p>
        </motion.div>

        {onSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-4 flex justify-end"
          >
            <Button
              data-testid="button-view-approval-status"
              onClick={onSuccess}
              className="gap-2"
            >
              View Approval Status
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
