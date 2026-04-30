import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, GraduationCap, FileText, Briefcase, CreditCard,
  Building2, MapPin, Camera, Landmark, CheckCircle2,
  Upload, X, AlertCircle, ChevronRight, Shield, Clock,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ProfileScreenProps {
  mobile: string;
  onSuccess: () => void;
}

type DocumentStatus = "required" | "pending" | "uploaded" | "optional";

interface UploadedFile {
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "done";
}

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
  required: boolean;
}

const SECTIONS: Section[] = [
  { id: "personal",      label: "Personal Details",       icon: <User className="w-4 h-4" />,         required: true },
  { id: "qualification", label: "Qualification",          icon: <GraduationCap className="w-4 h-4" />, required: true },
  { id: "certificate",   label: "Certificate Upload",     icon: <FileText className="w-4 h-4" />,      required: true },
  { id: "experience",    label: "Experience Upload",      icon: <Briefcase className="w-4 h-4" />,     required: true },
  { id: "idproof",       label: "ID Proof",               icon: <CreditCard className="w-4 h-4" />,    required: true },
  { id: "organisation",  label: "Organisation Details",   icon: <Building2 className="w-4 h-4" />,     required: false },
  { id: "address",       label: "Address Proof",          icon: <MapPin className="w-4 h-4" />,        required: true },
  { id: "photo",         label: "Photo Upload",           icon: <Camera className="w-4 h-4" />,        required: true },
  { id: "bank",          label: "Bank Details",           icon: <Landmark className="w-4 h-4" />,      required: true },
];

function StatusBadge({ status }: { status: DocumentStatus }) {
  const config = {
    required: { label: "Required",  bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200" },
    pending:  { label: "Pending",   bg: "bg-orange-50",  text: "text-orange-600", border: "border-orange-200" },
    uploaded: { label: "Uploaded",  bg: "bg-green-50",   text: "text-green-700",  border: "border-green-200" },
    optional: { label: "Optional",  bg: "bg-slate-50",   text: "text-slate-500",  border: "border-slate-200" },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      {status === "uploaded" && <Check className="w-3 h-3" />}
      {status === "pending"  && <Clock className="w-3 h-3" />}
      {status === "required" && <AlertCircle className="w-3 h-3" />}
      {config.label}
    </span>
  );
}

function UploadZone({
  id,
  label,
  accept,
  hint,
  file,
  onUpload,
}: {
  id: string;
  label: string;
  accept: string;
  hint: string;
  file: UploadedFile | null;
  onUpload: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onUpload(f);
  };

  return (
    <div className="mt-2">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        data-testid={`file-input-${id}`}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }}
      />
      {file ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-border rounded-xl p-4 bg-card"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            <StatusBadge status={file.status === "done" ? "uploaded" : "pending"} />
          </div>
          {file.status === "uploading" && (
            <div className="space-y-1">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${file.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">{file.progress}%</p>
            </div>
          )}
          {file.status === "done" && (
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Document uploaded successfully
            </div>
          )}
        </motion.div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer
            ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          data-testid={`upload-zone-${id}`}
        >
          <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground mb-0.5">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      )}
    </div>
  );
}

function SectionCard({ id, title, icon, badge, children }: {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge: DocumentStatus;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      id={`section-${id}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35 }}
      className="bg-card rounded-2xl border border-border p-6 mb-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
        <StatusBadge status={badge} />
      </div>
      {children}
    </motion.div>
  );
}

function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function ProfileScreen({ mobile, onSuccess }: ProfileScreenProps) {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [files, setFiles] = useState<Record<string, UploadedFile | null>>({
    certificate: null,
    experience: null,
    idproof: null,
    address: null,
    photo: null,
  });

  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", gender: "", email: "",
    degree: "", university: "", graduationYear: "", specialisation: "",
    orgName: "", orgRole: "", orgWebsite: "",
    street: "", city: "", state: "", pincode: "",
    bankName: "", accountNumber: "", ifsc: "", accountHolder: "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleUpload = (key: string, file: File) => {
    setFiles((prev) => ({
      ...prev,
      [key]: { name: file.name, size: file.size, progress: 0, status: "uploading" },
    }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) => ({
          ...prev,
          [key]: prev[key] ? { ...prev[key]!, progress: 100, status: "done" } : null,
        }));
      } else {
        setFiles((prev) => ({
          ...prev,
          [key]: prev[key] ? { ...prev[key]!, progress: Math.round(progress) } : null,
        }));
      }
    }, 280);
  };

  const getDocStatus = (key: string): DocumentStatus => {
    const f = files[key];
    if (!f) return "required";
    if (f.status === "uploading") return "pending";
    return "uploaded";
  };

  const getSectionStatus = (id: string): DocumentStatus => {
    if (["certificate", "experience", "idproof", "address", "photo"].includes(id)) return getDocStatus(id);
    if (id === "personal") {
      return form.firstName && form.lastName && form.dob && form.gender ? "uploaded" : "required";
    }
    if (id === "qualification") {
      return form.degree && form.university ? "uploaded" : "required";
    }
    if (id === "bank") {
      return form.bankName && form.accountNumber && form.ifsc ? "uploaded" : "required";
    }
    return "optional";
  };

  const totalRequired = SECTIONS.filter((s) => s.required).length;
  const completedRequired = SECTIONS.filter((s) => s.required && getSectionStatus(s.id) === "uploaded").length;
  const progressPct = Math.round((completedRequired / totalRequired) * 100);

  const scrollToSection = (id: string) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  const handleSubmit = () => {
    if (completedRequired < totalRequired) {
      toast({ title: "Incomplete submission", description: "Please complete all required sections before submitting.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
            className="w-24 h-24 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6"
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <motion.path
                d="M10 22 L18 30 L34 14"
                stroke="#16a34a"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              />
            </svg>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-2xl font-serif font-medium text-foreground mb-2">Application submitted</h2>
            <p className="text-muted-foreground mb-6">Your documents are being reviewed. We'll notify you at {mobile} within 2–3 business days.</p>
            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary/5 border border-primary/10 mb-6">
              <Shield className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm text-primary font-medium">Your documents are encrypted and secure</span>
            </div>
            <Button
              data-testid="button-view-status"
              className="w-full h-11"
              onClick={onSuccess}
            >
              View Verification Status
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-serif font-semibold text-foreground">MindBridge</span>
          </div>

          {/* Progress bar */}
          <div className="flex-1 max-w-xs hidden sm:block">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Profile completion</span>
              <span className="font-semibold text-foreground">{progressPct}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground hidden md:block">
              {completedRequired}/{totalRequired} required sections
            </span>
            <div className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
        {/* Left Sidebar Nav */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-3 px-3 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />Sections</p>
            {SECTIONS.map((s) => {
              const status = getSectionStatus(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left
                    ${activeSection === s.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                >
                  <span className={activeSection === s.id ? "text-primary" : "text-muted-foreground"}>
                    {s.icon}
                  </span>
                  <span className="flex-1 truncate">{s.label}</span>
                  {status === "uploaded" && <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                  {status === "required" && s.required && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-serif font-medium text-foreground mb-1">Complete your profile</h1>
            <p className="text-muted-foreground text-sm">Submit your professional documents to get verified as a counselor on MindBridge.</p>
          </div>

          {/* Mobile progress */}
          <div className="sm:hidden mb-5 p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Profile completion</span>
              <span className="font-semibold text-foreground">{progressPct}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4 }} />
            </div>
          </div>

          {/* — Personal Details — */}
          <SectionCard id="personal" title="Personal Details" icon={<User className="w-4 h-4" />} badge={getSectionStatus("personal")}>
            <FormRow>
              <Field label="First Name" required>
                <Input data-testid="input-first-name" placeholder="Dr. Ananya" value={form.firstName} onChange={set("firstName")} className="h-10" />
              </Field>
              <Field label="Last Name" required>
                <Input data-testid="input-last-name" placeholder="Sharma" value={form.lastName} onChange={set("lastName")} className="h-10" />
              </Field>
            </FormRow>
            <div className="mt-4">
              <FormRow>
                <Field label="Date of Birth" required>
                  <Input data-testid="input-dob" type="date" value={form.dob} onChange={set("dob")} className="h-10" />
                </Field>
                <Field label="Gender" required>
                  <select
                    data-testid="select-gender"
                    value={form.gender}
                    onChange={set("gender")}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not">Prefer not to say</option>
                  </select>
                </Field>
              </FormRow>
            </div>
            <div className="mt-4">
              <Field label="Email Address" required>
                <Input data-testid="input-profile-email" type="email" placeholder="dr.sharma@example.com" value={form.email} onChange={set("email")} className="h-10" />
              </Field>
            </div>
          </SectionCard>

          {/* — Qualification — */}
          <SectionCard id="qualification" title="Qualification" icon={<GraduationCap className="w-4 h-4" />} badge={getSectionStatus("qualification")}>
            <FormRow>
              <Field label="Highest Degree" required>
                <Input data-testid="input-degree" placeholder="M.Sc. Clinical Psychology" value={form.degree} onChange={set("degree")} className="h-10" />
              </Field>
              <Field label="University / Institution" required>
                <Input data-testid="input-university" placeholder="University of Delhi" value={form.university} onChange={set("university")} className="h-10" />
              </Field>
            </FormRow>
            <div className="mt-4">
              <FormRow>
                <Field label="Graduation Year">
                  <Input data-testid="input-graduation-year" placeholder="2018" value={form.graduationYear} onChange={set("graduationYear")} className="h-10" />
                </Field>
                <Field label="Specialisation">
                  <Input data-testid="input-specialisation" placeholder="CBT, Trauma Therapy" value={form.specialisation} onChange={set("specialisation")} className="h-10" />
                </Field>
              </FormRow>
            </div>
          </SectionCard>

          {/* — Certificate Upload — */}
          <SectionCard id="certificate" title="Certificate Upload" icon={<FileText className="w-4 h-4" />} badge={getDocStatus("certificate")}>
            <p className="text-sm text-muted-foreground mb-1">Upload your professional certification or licence. Accepted formats: PDF, JPG, PNG (max 5 MB).</p>
            <UploadZone
              id="certificate"
              label="Drop your certificate here or click to browse"
              accept=".pdf,.jpg,.jpeg,.png"
              hint="PDF, JPG or PNG · Max 5 MB"
              file={files.certificate}
              onUpload={(f) => handleUpload("certificate", f)}
            />
          </SectionCard>

          {/* — Experience Upload — */}
          <SectionCard id="experience" title="Experience Upload" icon={<Briefcase className="w-4 h-4" />} badge={getDocStatus("experience")}>
            <p className="text-sm text-muted-foreground mb-1">Upload your work experience letter or resumé. Helps us verify your years of practice.</p>
            <UploadZone
              id="experience"
              label="Drop your experience document or click to browse"
              accept=".pdf,.doc,.docx"
              hint="PDF or DOC · Max 5 MB"
              file={files.experience}
              onUpload={(f) => handleUpload("experience", f)}
            />
          </SectionCard>

          {/* — ID Proof — */}
          <SectionCard id="idproof" title="ID Proof" icon={<CreditCard className="w-4 h-4" />} badge={getDocStatus("idproof")}>
            <p className="text-sm text-muted-foreground mb-1">Upload a government-issued photo ID — passport, driver's licence, or national ID card.</p>
            <UploadZone
              id="idproof"
              label="Drop your ID document or click to browse"
              accept=".pdf,.jpg,.jpeg,.png"
              hint="PDF, JPG or PNG · Max 5 MB"
              file={files.idproof}
              onUpload={(f) => handleUpload("idproof", f)}
            />
          </SectionCard>

          {/* — Organisation Details — */}
          <SectionCard id="organisation" title="Organisation Details" icon={<Building2 className="w-4 h-4" />} badge={getSectionStatus("organisation")}>
            <p className="text-sm text-muted-foreground mb-3">Optional — add your current or most recent employer details.</p>
            <FormRow>
              <Field label="Organisation Name">
                <Input data-testid="input-org-name" placeholder="MindCare Clinic" value={form.orgName} onChange={set("orgName")} className="h-10" />
              </Field>
              <Field label="Your Role">
                <Input data-testid="input-org-role" placeholder="Senior Counselor" value={form.orgRole} onChange={set("orgRole")} className="h-10" />
              </Field>
            </FormRow>
            <div className="mt-4">
              <Field label="Website">
                <Input data-testid="input-org-website" placeholder="https://mindcare.in" value={form.orgWebsite} onChange={set("orgWebsite")} className="h-10" />
              </Field>
            </div>
          </SectionCard>

          {/* — Address Proof — */}
          <SectionCard id="address" title="Address Proof" icon={<MapPin className="w-4 h-4" />} badge={getDocStatus("address")}>
            <p className="text-sm text-muted-foreground mb-3">Enter your current address and upload a supporting document (utility bill, bank statement, etc.).</p>
            <Field label="Street Address" required>
              <Input data-testid="input-street" placeholder="42, Greenpark Lane" value={form.street} onChange={set("street")} className="h-10" />
            </Field>
            <div className="mt-4">
              <FormRow>
                <Field label="City" required>
                  <Input data-testid="input-city" placeholder="Bengaluru" value={form.city} onChange={set("city")} className="h-10" />
                </Field>
                <Field label="State" required>
                  <Input data-testid="input-state" placeholder="Karnataka" value={form.state} onChange={set("state")} className="h-10" />
                </Field>
              </FormRow>
            </div>
            <div className="mt-4">
              <Field label="PIN Code" required>
                <Input data-testid="input-pincode" placeholder="560038" value={form.pincode} onChange={set("pincode")} className="h-10 max-w-xs" />
              </Field>
            </div>
            <div className="mt-4">
              <UploadZone
                id="address"
                label="Upload address proof document"
                accept=".pdf,.jpg,.jpeg,.png"
                hint="Utility bill, bank statement · PDF or Image · Max 5 MB"
                file={files.address}
                onUpload={(f) => handleUpload("address", f)}
              />
            </div>
          </SectionCard>

          {/* — Photo Upload — */}
          <SectionCard id="photo" title="Photo Upload" icon={<Camera className="w-4 h-4" />} badge={getDocStatus("photo")}>
            <p className="text-sm text-muted-foreground mb-1">Upload a recent, clear headshot. This will appear on your counselor profile.</p>
            <UploadZone
              id="photo"
              label="Upload your profile photo"
              accept=".jpg,.jpeg,.png,.webp"
              hint="JPG or PNG · Minimum 300×300 px · Max 3 MB"
              file={files.photo}
              onUpload={(f) => handleUpload("photo", f)}
            />
          </SectionCard>

          {/* — Bank Details — */}
          <SectionCard id="bank" title="Bank Details" icon={<Landmark className="w-4 h-4" />} badge={getSectionStatus("bank")}>
            <p className="text-sm text-muted-foreground mb-3">Your earnings will be deposited to this account. All data is encrypted.</p>
            <FormRow>
              <Field label="Bank Name" required>
                <Input data-testid="input-bank-name" placeholder="State Bank of India" value={form.bankName} onChange={set("bankName")} className="h-10" />
              </Field>
              <Field label="Account Holder Name" required>
                <Input data-testid="input-account-holder" placeholder="Dr. Ananya Sharma" value={form.accountHolder} onChange={set("accountHolder")} className="h-10" />
              </Field>
            </FormRow>
            <div className="mt-4">
              <FormRow>
                <Field label="Account Number" required>
                  <Input data-testid="input-account-number" placeholder="•••• •••• 4892" value={form.accountNumber} onChange={set("accountNumber")} className="h-10" />
                </Field>
                <Field label="IFSC Code" required>
                  <Input data-testid="input-ifsc" placeholder="SBIN0001234" value={form.ifsc} onChange={set("ifsc")} className="h-10" />
                </Field>
              </FormRow>
            </div>
          </SectionCard>

          {/* Document Summary */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Document Status Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTIONS.map((s) => {
                const status = getSectionStatus(s.id);
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40 border border-border cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => scrollToSection(s.id)}
                  >
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <span className="text-muted-foreground">{s.icon}</span>
                      <span>{s.label}</span>
                    </div>
                    <StatusBadge status={status} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-card/95 backdrop-blur border-t border-border">
            <div className="max-w-2xl flex items-center gap-4">
              <div className="flex-1">
                {completedRequired < totalRequired ? (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-amber-600">{totalRequired - completedRequired} required {totalRequired - completedRequired === 1 ? "section" : "sections"}</span> still pending
                  </p>
                ) : (
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    All required sections complete — ready to submit
                  </p>
                )}
              </div>
              <Button
                data-testid="button-submit-profile"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-11 px-8 text-sm shadow-md shrink-0"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Submit Application
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
