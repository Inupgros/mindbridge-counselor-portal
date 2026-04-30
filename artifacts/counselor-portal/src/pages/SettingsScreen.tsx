import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Menu, BadgeCheck, Calendar, LayoutDashboard, Users, IndianRupee,
  BarChart2, School, MessageCircle, Bell, Globe, Settings, Camera, Eye,
  EyeOff, Check, X, Upload, Trash2, Download, ExternalLink, LogOut,
  HelpCircle, ChevronRight, Lock, CreditCard, FileText, Languages,
  User, Briefcase, Building2, Phone, Mail, MapPin, Hash, Star,
  AlertCircle, CheckCircle2, Plus, Edit3, RefreshCw, BookOpen, Clock,
  Laptop, Smartphone, Search, GraduationCap, VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

/* ─── TYPES ─────────────────────────────────────── */

type Section =
  | "profile"
  | "specialization"
  | "security"
  | "language"
  | "notifications"
  | "sessions"
  | "bank"
  | "documents"
  | "help"
  | "logout";

type Proficiency = "Beginner" | "Intermediate" | "Expert";

/* ─── STATIC DATA ────────────────────────────────── */

const PROFILE_DATA = {
  name:          "Dr. Ananya Sharma",
  email:         "ananya.sharma@mindbridge.in",
  phone:         "+91 9876543210",
  dob:           "12 Mar 1989",
  gender:        "Female",
  city:          "Delhi",
  state:         "Delhi",
  pincode:       "110085",
  address:       "C-47, Pocket 3, Rohini Sector 11, Delhi",
  qualification: "M.Sc. Psychology, MBA HR",
  regNumber:     "RCI/2019/DEL/04521",
  languages:     ["Hindi", "English"],
};

const SPECIALIZATIONS = [
  "Career Counseling",
  "Academic Coaching",
  "College Admission Guidance",
  "Mental Health Support",
  "Stress Management",
];

const CERTIFICATIONS = [
  { id: "c1", name: "Certified Career Counselor (CCC)", issuer: "NCDA",      year: "2020", valid: true },
  { id: "c2", name: "RCI Licensed Psychologist",         issuer: "RCI India", year: "2019", valid: true },
  { id: "c3", name: "School Counseling Certificate",     issuer: "CBSE",      year: "2021", valid: true },
  { id: "c4", name: "MBTI Certified Practitioner",       issuer: "OPP Ltd",   year: "2022", valid: true },
];

const NOTIF_SETTINGS = [
  { id: "ns_student", label: "New student requests",      email: true,  sms: false, push: true  },
  { id: "ns_appt",    label: "Appointment reminders",     email: true,  sms: true,  push: true  },
  { id: "ns_visit",   label: "School visit reminders",    email: true,  sms: true,  push: false },
  { id: "ns_payment", label: "Payment updates",           email: true,  sms: false, push: true  },
  { id: "ns_doc",     label: "Document approvals",        email: false, sms: false, push: true  },
  { id: "ns_message", label: "New messages",              email: false, sms: false, push: true  },
  { id: "ns_system",  label: "System & platform updates", email: true,  sms: false, push: false },
];

const NOTIF_ICON_CFG: Record<string, { icon: React.ReactNode; color: string }> = {
  ns_student: { icon: <Users       className="w-3.5 h-3.5" />, color: "bg-blue-50 text-blue-600"    },
  ns_appt:    { icon: <Calendar    className="w-3.5 h-3.5" />, color: "bg-green-50 text-green-600"  },
  ns_visit:   { icon: <School      className="w-3.5 h-3.5" />, color: "bg-teal-50 text-teal-600"    },
  ns_payment: { icon: <IndianRupee className="w-3.5 h-3.5" />, color: "bg-amber-50 text-amber-600"  },
  ns_doc:     { icon: <FileText    className="w-3.5 h-3.5" />, color: "bg-purple-50 text-purple-600"},
  ns_message: { icon: <MessageCircle className="w-3.5 h-3.5" />, color: "bg-primary/10 text-primary"},
  ns_system:  { icon: <Settings    className="w-3.5 h-3.5" />, color: "bg-slate-50 text-slate-600"  },
};

const BANK_DATA = {
  accountHolder: "Ananya Sharma",
  bankName:      "HDFC Bank",
  accountNumber: "****4521",
  ifsc:          "HDFC0001234",
  branch:        "Rohini Sector 11, Delhi",
  accountType:   "Savings",
  pan:           "AXBPA2345K",
  verified:      true,
};

const DOCUMENTS = [
  { id: "d1", name: "PAN Card",             type: "Identity",      status: "verified", uploaded: "15 Jan 2026", size: "420 KB" },
  { id: "d2", name: "Aadhaar Card",          type: "Identity",      status: "verified", uploaded: "15 Jan 2026", size: "560 KB" },
  { id: "d3", name: "Degree Certificate",    type: "Qualification", status: "verified", uploaded: "16 Jan 2026", size: "1.2 MB" },
  { id: "d4", name: "RCI License",           type: "Certification", status: "verified", uploaded: "16 Jan 2026", size: "380 KB" },
  { id: "d5", name: "Profile Photo",         type: "Profile",       status: "verified", uploaded: "16 Jan 2026", size: "200 KB" },
  { id: "d6", name: "Bank Cancelled Cheque", type: "Banking",       status: "pending",  uploaded: "20 Mar 2026", size: "310 KB" },
  { id: "d7", name: "Experience Letter",     type: "Experience",    status: "pending",  uploaded: "20 Mar 2026", size: "670 KB" },
];

const DOC_TYPE_CFG: Record<string, { icon: React.ReactNode; color: string }> = {
  Identity:      { icon: <Shield        className="w-4 h-4" />, color: "bg-blue-50 text-blue-600"      },
  Qualification: { icon: <GraduationCap className="w-4 h-4" />, color: "bg-purple-50 text-purple-600"  },
  Certification: { icon: <BadgeCheck    className="w-4 h-4" />, color: "bg-green-50 text-green-600"    },
  Profile:       { icon: <Camera        className="w-4 h-4" />, color: "bg-primary/10 text-primary"    },
  Banking:       { icon: <CreditCard    className="w-4 h-4" />, color: "bg-amber-50 text-amber-600"    },
  Experience:    { icon: <Briefcase     className="w-4 h-4" />, color: "bg-teal-50 text-teal-600"      },
};

const FAQ = [
  { q: "How do I update my availability for school visits?", a: "Go to the Schools section and select the visit you want to modify. You can update timing and session slots from the visit detail page." },
  { q: "How is my payout calculated?", a: "Your gross earnings are calculated from all completed sessions and school visits. A 12% platform fee and 2% TDS are deducted, and the net amount is credited to your registered bank account." },
  { q: "Can I accept walk-in students not referred via Inupgro?", a: "Currently MindBridge only supports students referred through the Inupgro platform. Direct referrals are not supported in this cycle." },
  { q: "How long does document verification take?", a: "Document review typically takes 1–3 business days. You will receive a notification once your document status is updated." },
];

const ACTIVE_DEVICES = [
  { id: "dv1", name: "Chrome on Windows", location: "Delhi, India",     lastActive: "Now · current session", type: "laptop",   isCurrent: true  },
  { id: "dv2", name: "Safari on iPhone",   location: "Delhi, India",    lastActive: "2 hours ago",            type: "phone",    isCurrent: false },
  { id: "dv3", name: "Chrome on MacBook",  location: "Gurugram, India", lastActive: "3 days ago",             type: "laptop",   isCurrent: false },
];

const NAV_ITEMS_SIDEBAR = [
  { id: "dashboard",    path: "/dashboard",   icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: "Dashboard"    },
  { id: "students",     path: "/requests",    icon: <Users           className="w-4.5 h-4.5" />, label: "Students"     },
  { id: "appointments", path: "/appointment", icon: <Calendar        className="w-4.5 h-4.5" />, label: "Appointments" },
  { id: "schools",      path: "/visits",      icon: <School          className="w-4.5 h-4.5" />, label: "Schools"      },
  { id: "revenue",      path: "/revenue",     icon: <IndianRupee     className="w-4.5 h-4.5" />, label: "Revenue"      },
  { id: "reports",      path: "/analytics",   icon: <BarChart2       className="w-4.5 h-4.5" />, label: "Reports"      },
  { id: "settings",     path: "/settings",    icon: <Settings        className="w-4.5 h-4.5" />, label: "Settings"     },
];

const SECTION_NAV: { id: Section; icon: React.ReactNode; label: string; sub?: string }[] = [
  { id: "profile",        icon: <User       className="w-4 h-4" />, label: "My Profile",            sub: "Personal info & photo"      },
  { id: "specialization", icon: <Briefcase  className="w-4 h-4" />, label: "Specialization",        sub: "Expertise & certifications" },
  { id: "security",       icon: <Lock       className="w-4 h-4" />, label: "Security",              sub: "Password & 2FA"             },
  { id: "language",       icon: <Languages  className="w-4 h-4" />, label: "Language & Preferences",sub: "Language, theme"            },
  { id: "notifications",  icon: <Bell       className="w-4 h-4" />, label: "Notifications",         sub: "Email, SMS, push"           },
  { id: "sessions",       icon: <Clock      className="w-4 h-4" />, label: "Session Preferences",   sub: "Duration, mode & schedule"  },
  { id: "bank",           icon: <CreditCard className="w-4 h-4" />, label: "Bank & Payout",         sub: "Account & payment details"  },
  { id: "documents",      icon: <FileText   className="w-4 h-4" />, label: "Documents",             sub: "Uploaded files & status"    },
  { id: "help",           icon: <HelpCircle className="w-4 h-4" />, label: "Help & Support",        sub: "FAQs, contact, feedback"    },
  { id: "logout",         icon: <LogOut     className="w-4 h-4" />, label: "Logout",                sub: "Sign out of MindBridge"     },
];

const PROF_LEVELS: Proficiency[] = ["Beginner", "Intermediate", "Expert"];
const PROF_DOT: Record<Proficiency, string> = {
  Beginner:     "bg-slate-400",
  Intermediate: "bg-amber-400",
  Expert:       "bg-green-500",
};
const PROF_TEXT: Record<Proficiency, string> = {
  Beginner:     "text-slate-500",
  Intermediate: "text-amber-600",
  Expert:       "text-green-600",
};

/* ─── HELPERS ────────────────────────────────────── */

function AccentBar({ from = "from-primary", to = "to-blue-400" }: { from?: string; to?: string }) {
  return <div className={`h-1 w-full bg-gradient-to-r ${from} ${to}`} />;
}

function Field({ label, value, testid, editable = true, type = "text", onChange }: {
  label: string; value: string; testid: string; editable?: boolean; type?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div data-testid={testid}>
      <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</label>
      {editable
        ? <input
            className="w-full h-9 bg-background border border-border rounded-xl px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all"
            type={type}
            defaultValue={value}
            onChange={(e) => onChange?.(e.target.value)}
            data-testid={`${testid}-input`}
          />
        : <div className="h-9 flex items-center px-3 bg-muted/40 rounded-xl text-sm text-foreground border border-border/50">{value}</div>
      }
    </div>
  );
}

function Toggle({ checked, onChange, testid }: { checked: boolean; onChange: () => void; testid: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted border border-border"}`}
      onClick={onChange}
      data-testid={testid}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-serif font-semibold text-foreground">{title}</h2>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function SaveBar({ onSave, onCancel, testid }: { onSave: () => void; onCancel: () => void; testid: string }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-5 border-t border-border mt-6">
      <Button variant="ghost" size="sm" className="h-9 text-sm" onClick={onCancel} data-testid={`${testid}-cancel`}>
        Cancel
      </Button>
      <Button size="sm" className="h-9 text-sm px-5" onClick={onSave} data-testid={`${testid}-save`}>
        <Check className="w-3.5 h-3.5 mr-1.5" />Save Changes
      </Button>
    </div>
  );
}

/* ─── SECTION: PROFILE ───────────────────────────── */

function ProfileSection({ toast }: { toast: any }) {
  const [name, setName]         = useState(PROFILE_DATA.name);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileRef  = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const COMPLETENESS_FIELDS = [
    PROFILE_DATA.name, PROFILE_DATA.phone, PROFILE_DATA.dob,
    PROFILE_DATA.gender, PROFILE_DATA.city, PROFILE_DATA.address,
    PROFILE_DATA.qualification, PROFILE_DATA.languages.length > 0 ? "yes" : "",
  ];
  const filled = COMPLETENESS_FIELDS.filter(Boolean).length;
  const completeness = Math.round((filled / COMPLETENESS_FIELDS.length) * 100);

  const handleSave = () => {
    toast({ title: "Profile updated", description: "Your personal information has been saved." });
  };

  return (
    <div data-testid="section-profile">
      <SectionTitle title="My Profile" sub="Your personal information visible to schools and Inupgro" />

      {/* Profile card with cover image */}
      <div className="mb-6 border border-border rounded-2xl overflow-hidden hover:ring-2 hover:ring-primary/10 transition-all" data-testid="profile-photo-area">

        {/* Cover photo banner */}
        <div className="relative h-32 group" data-testid="profile-cover-area">
          {coverPreview
            ? <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-r from-primary/40 via-blue-500/30 to-teal-400/40" />
          }
          {/* Hover overlay */}
          <button
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25 backdrop-blur-[1px]"
            data-testid="button-change-cover"
            onClick={() => coverRef.current?.click()}
          >
            <span className="flex items-center gap-1.5 bg-black/50 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">
              <Camera className="w-3.5 h-3.5" /> Change cover photo
            </span>
          </button>
          <input ref={coverRef} type="file" accept="image/*" className="hidden" data-testid="input-cover-file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCoverPreview(URL.createObjectURL(file));
                toast({ title: "Cover photo updated" });
              }
            }} />
          {/* Remove cover button (only when cover is set) */}
          {coverPreview && (
            <button
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              data-testid="button-remove-cover"
              onClick={() => { setCoverPreview(null); toast({ title: "Cover photo removed" }); }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Avatar + info — avatar overlaps the cover */}
        <div className="px-5 pb-5 bg-muted/20">
          <div className="flex items-end gap-4 -mt-10 mb-3">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border-4 border-background ring-2 ring-primary/20"
                data-testid="profile-avatar">AS</div>
              <button
                className="absolute -bottom-0.5 -right-0.5 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                data-testid="button-change-photo"
                onClick={() => fileRef.current?.click()}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" data-testid="input-photo-file"
                onChange={() => toast({ title: "Photo updated", description: "Profile photo will be updated after review." })} />
            </div>

            {/* Name + role + verified (right side of avatar row) */}
            <div className="flex-1 min-w-0 pb-1 flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight">{name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Licensed Psychologist · Career Counselor</p>
              </div>
              <span className="text-[10px] font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded-full shrink-0 mt-0.5" data-testid="profile-verified-badge">
                Verified
              </span>
            </div>
          </div>

          {/* Verified check + action links */}
          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-2">
            <BadgeCheck className="w-3 h-3 text-green-500" /> Profile verified by MindBridge
          </p>
          <div className="flex gap-3">
            <button className="text-[10px] font-semibold text-primary hover:underline" data-testid="button-upload-photo"
              onClick={() => fileRef.current?.click()}>Upload new photo</button>
            <span className="text-muted-foreground">·</span>
            <button className="text-[10px] font-semibold text-muted-foreground hover:underline" data-testid="button-upload-cover"
              onClick={() => coverRef.current?.click()}>Change cover</button>
            <span className="text-muted-foreground">·</span>
            <button className="text-[10px] font-semibold text-red-500 hover:underline" data-testid="button-remove-photo"
              onClick={() => toast({ title: "Photo removed" })}>Remove photo</button>
          </div>

          {/* Completeness bar */}
          <div className="mt-4 pt-4 border-t border-border/50" data-testid="profile-completeness">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Profile Completeness</p>
              <span className="text-[10px] font-bold text-primary">{completeness}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completeness}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{filled} of {COMPLETENESS_FIELDS.length} fields filled</p>
          </div>
        </div>
      </div>

      {/* Personal info form */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5">
        <AccentBar from="from-primary/60" to="to-primary/20" />
        <div className="p-5 bg-muted/20">
          <p className="text-xs font-semibold text-foreground mb-4">Personal Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="profile-form">
            <Field testid="field-name"          label="Full Name"       value={PROFILE_DATA.name}          onChange={setName} />
            <Field testid="field-email"         label="Email Address"   value={PROFILE_DATA.email}         editable={false} />
            <Field testid="field-phone"         label="Mobile Number"   value={PROFILE_DATA.phone}         type="tel" />
            <Field testid="field-dob"           label="Date of Birth"   value={PROFILE_DATA.dob}           />
            <Field testid="field-gender"        label="Gender"          value={PROFILE_DATA.gender}        />
            <Field testid="field-qualification" label="Qualification"   value={PROFILE_DATA.qualification} />
            <Field testid="field-reg-number"    label="RCI Reg. Number" value={PROFILE_DATA.regNumber}     editable={false} />
            <Field testid="field-city"          label="City"            value={PROFILE_DATA.city}          />
            <div className="sm:col-span-2">
              <Field testid="field-address" label="Address" value={PROFILE_DATA.address} />
            </div>
          </div>
        </div>
      </div>

      <SaveBar testid="profile-save" onSave={handleSave} onCancel={() => toast({ title: "Changes discarded" })} />
    </div>
  );
}

/* ─── SECTION: SPECIALIZATION ────────────────────── */

function SpecializationSection({ toast }: { toast: any }) {
  const [specs, setSpecs]     = useState<string[]>(SPECIALIZATIONS);
  const [newSpec, setNewSpec] = useState("");
  const [experience]          = useState("6");
  const [proficiencies, setProficiencies] = useState<Record<string, Proficiency>>(
    Object.fromEntries(SPECIALIZATIONS.map((s) => [s, "Expert" as Proficiency]))
  );

  const cycleProficiency = (spec: string) => {
    setProficiencies((p) => {
      const curr = p[spec] ?? "Beginner";
      const idx  = PROF_LEVELS.indexOf(curr);
      return { ...p, [spec]: PROF_LEVELS[(idx + 1) % PROF_LEVELS.length] };
    });
  };

  return (
    <div data-testid="section-specialization">
      <SectionTitle title="Specialization & Experience" sub="Areas of expertise, certifications, and professional history" />

      {/* Experience */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="experience-block">
        <AccentBar from="from-teal-500" to="to-primary" />
        <div className="p-5 bg-muted/20">
          <p className="text-xs font-semibold text-foreground mb-4">Professional Experience</p>
          <div className="grid grid-cols-2 gap-4">
            <div data-testid="field-years-experience">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Years of Experience</label>
              <input className="w-full h-9 bg-background border border-border rounded-xl px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                type="number" defaultValue={experience} min={0} max={40}
                data-testid="field-years-experience-input" />
            </div>
            <div data-testid="field-schools-served">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Schools Currently Serving</label>
              <div className="h-9 flex items-center px-3 bg-muted/40 rounded-xl text-sm text-foreground border border-border/50">4 schools</div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Professional Bio</label>
            <textarea className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              rows={3} defaultValue="Licensed psychologist and certified career counselor with 6 years of experience in school-based mental health and career guidance. Specializing in adolescent career planning, academic coaching, and college admission prep."
              data-testid="field-bio-input" />
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="specializations-block">
        <AccentBar from="from-primary" to="to-blue-400" />
        <div className="p-5 bg-muted/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-foreground">Areas of Specialization</p>
            <p className="text-[10px] text-muted-foreground">Tap a tag to cycle proficiency level</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-3" data-testid="specializations-list">
            {specs.map((s) => {
              const prof = proficiencies[s] ?? "Expert";
              return (
                <span key={s}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-primary cursor-pointer hover:bg-primary/12 transition-colors"
                  data-testid={`spec-tag-${s.replace(/[\s/]/g, "-").toLowerCase()}`}
                  onClick={() => cycleProficiency(s)}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${PROF_DOT[prof]}`} title={prof} />
                  {s}
                  <span className={`text-[9px] font-bold ${PROF_TEXT[prof]}`}>{prof.slice(0, 3)}</span>
                  <button
                    className="hover:text-red-500 transition-colors ml-0.5"
                    data-testid={`button-remove-spec-${s.replace(/[\s/]/g, "-").toLowerCase()}`}
                    onClick={(e) => { e.stopPropagation(); setSpecs((p) => p.filter((x) => x !== s)); }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input className="flex-1 h-9 bg-background border border-border rounded-xl px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Add specialization..." value={newSpec}
              onChange={(e) => setNewSpec(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && newSpec.trim()) { setSpecs((p) => [...p, newSpec.trim()]); setProficiencies((p) => ({ ...p, [newSpec.trim()]: "Beginner" })); setNewSpec(""); }}}
              data-testid="input-new-spec" />
            <Button size="sm" className="h-9 gap-1.5" data-testid="button-add-spec"
              onClick={() => { if (newSpec.trim()) { setSpecs((p) => [...p, newSpec.trim()]); setProficiencies((p) => ({ ...p, [newSpec.trim()]: "Beginner" })); setNewSpec(""); }}}>
              <Plus className="w-3.5 h-3.5" />Add
            </Button>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="border border-border rounded-2xl overflow-hidden" data-testid="certifications-block">
        <AccentBar from="from-green-500" to="to-teal-400" />
        <div className="p-5 bg-muted/20">
          <p className="text-xs font-semibold text-foreground mb-3">Certifications</p>
          <div className="space-y-2" data-testid="certifications-list">
            {CERTIFICATIONS.map((c) => (
              <div key={c.id}
                className="flex items-center justify-between p-3.5 bg-card border border-border rounded-xl border-l-4 border-l-green-500"
                data-testid={`cert-row-${c.id}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <BadgeCheck className="w-4.5 h-4.5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.issuer} · {c.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full">Active</span>
                  <button className="text-[10px] text-primary hover:underline" data-testid={`button-view-cert-${c.id}`}
                    onClick={() => toast({ title: "Certificate", description: `${c.name} opened.` })}>View</button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
            data-testid="button-add-certification"
            onClick={() => toast({ title: "Upload certificate", description: "Navigate to Documents to upload a new certificate." })}>
            <Plus className="w-3.5 h-3.5" />Add certification
          </button>
        </div>
      </div>

      <SaveBar testid="spec-save" onSave={() => toast({ title: "Specialization updated" })} onCancel={() => {}} />
    </div>
  );
}

/* ─── SECTION: SECURITY ──────────────────────────── */

function SecuritySection({ toast }: { toast: any }) {
  const [current,  setCurrent]  = useState("");
  const [newPw,    setNewPw]    = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showCurr, setShowCurr] = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [twoFA,    setTwoFA]    = useState(true);
  const [devices,  setDevices]  = useState(ACTIVE_DEVICES);

  const strength = newPw.length === 0 ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 :
    /[A-Z]/.test(newPw) && /[0-9]/.test(newPw) && /[^A-Za-z0-9]/.test(newPw) ? 4 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-amber-400", "bg-blue-500", "bg-green-500"];

  const handleSave = () => {
    if (!current) { toast({ title: "Current password required" }); return; }
    if (newPw !== confirm) { toast({ title: "Passwords do not match" }); return; }
    if (strength < 2) { toast({ title: "Password too weak" }); return; }
    toast({ title: "Password updated", description: "Your password has been changed successfully." });
    setCurrent(""); setNewPw(""); setConfirm("");
  };

  const signOutDevice = (id: string) => {
    setDevices((d) => d.filter((x) => x.id !== id));
    toast({ title: "Device signed out", description: "That session has been terminated." });
  };

  return (
    <div data-testid="section-security">
      <SectionTitle title="Security" sub="Manage your password and two-factor authentication" />

      {/* Password change */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="password-change-block">
        <AccentBar from="from-red-500" to="to-primary" />
        <div className="p-5 bg-muted/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
              <Lock className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-xs font-semibold text-foreground">Change Password</p>
          </div>
          <div className="space-y-4">
            <div data-testid="field-current-password">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Current Password</label>
              <div className="relative">
                <input
                  className="w-full h-9 bg-background border border-border rounded-xl px-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  type={showCurr ? "text" : "password"} value={current} placeholder="Enter current password"
                  onChange={(e) => setCurrent(e.target.value)} data-testid="input-current-password"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" data-testid="toggle-current-password"
                  onClick={() => setShowCurr((v) => !v)}>
                  {showCurr ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div data-testid="field-new-password">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">New Password</label>
              <div className="relative">
                <input
                  className="w-full h-9 bg-background border border-border rounded-xl px-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  type={showNew ? "text" : "password"} value={newPw} placeholder="Minimum 8 characters"
                  onChange={(e) => setNewPw(e.target.value)} data-testid="input-new-password"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" data-testid="toggle-new-password"
                  onClick={() => setShowNew((v) => !v)}>
                  {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {newPw.length > 0 && (
                <div className="mt-2 flex items-center gap-2" data-testid="password-strength">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColor[strength] : "bg-muted"}`} />
                    ))}
                  </div>
                  <span className={`text-[10px] font-semibold ${strength >= 3 ? "text-green-600" : strength === 2 ? "text-blue-600" : strength === 1 ? "text-amber-500" : "text-red-500"}`}
                    data-testid="strength-label">{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <div data-testid="field-confirm-password">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  className="w-full h-9 bg-background border border-border rounded-xl px-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  type={showConf ? "text" : "password"} value={confirm} placeholder="Re-enter new password"
                  onChange={(e) => setConfirm(e.target.value)} data-testid="input-confirm-password"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" data-testid="toggle-confirm-password"
                  onClick={() => setShowConf((v) => !v)}>
                  {showConf ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {confirm.length > 0 && newPw !== confirm && (
                <p className="text-[10px] text-red-500 mt-1" data-testid="password-mismatch-error">Passwords do not match</p>
              )}
              {confirm.length > 0 && newPw === confirm && (
                <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1" data-testid="password-match-ok">
                  <CheckCircle2 className="w-3 h-3" />Passwords match
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
            <button className="text-xs text-primary hover:underline" data-testid="button-forgot-password"
              onClick={() => toast({ title: "Reset link sent", description: "A password reset link has been sent to your email." })}>
              Forgot password?
            </button>
            <Button size="sm" className="h-9 text-sm px-5" onClick={handleSave} data-testid="button-save-password">
              <Lock className="w-3.5 h-3.5 mr-1.5" />Update Password
            </Button>
          </div>
        </div>
      </div>

      {/* 2FA */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="two-fa-block">
        <AccentBar from="from-green-500" to="to-teal-400" />
        <div className="p-5 bg-muted/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground">Two-Factor Authentication</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Adds an extra layer of security via OTP on your registered mobile.</p>
            </div>
            <Toggle checked={twoFA} onChange={() => { setTwoFA((v) => !v); toast({ title: twoFA ? "2FA disabled" : "2FA enabled" }); }} testid="toggle-2fa" />
          </div>
          {twoFA && (
            <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <p className="text-[10px] text-green-700">2FA is active. OTPs will be sent to <span className="font-semibold">+91 98765 43210</span>.</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Devices */}
      <div className="border border-border rounded-2xl overflow-hidden" data-testid="active-devices-block">
        <AccentBar from="from-slate-400" to="to-slate-600" />
        <div className="p-5 bg-muted/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
              <Laptop className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Active Devices</p>
              <p className="text-[10px] text-muted-foreground">Sessions currently logged in to your account</p>
            </div>
          </div>
          <div className="space-y-2" data-testid="devices-list">
            {devices.map((dv) => (
              <div key={dv.id}
                className={`flex items-center gap-3 p-3.5 rounded-xl border ${dv.isCurrent ? "bg-primary/5 border-primary/20" : "bg-card border-border"}`}
                data-testid={`device-row-${dv.id}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${dv.isCurrent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {dv.type === "phone" ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">{dv.name}</p>
                    {dv.isCurrent && (
                      <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full">This device</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{dv.location} · {dv.lastActive}</p>
                </div>
                {!dv.isCurrent && (
                  <button className="text-[10px] text-red-500 font-semibold hover:underline shrink-0" data-testid={`button-signout-device-${dv.id}`}
                    onClick={() => signOutDevice(dv.id)}>
                    Sign out
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex justify-end">
            <Button variant="outline" size="sm" className="h-8 text-xs text-red-500 border-red-200 hover:bg-red-50 gap-1.5"
              data-testid="button-signout-all-devices"
              onClick={() => { setDevices((d) => d.filter((x) => x.isCurrent)); toast({ title: "Signed out of all other devices" }); }}>
              <LogOut className="w-3.5 h-3.5" />Sign out of all other devices
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SECTION: LANGUAGE ──────────────────────────── */

function LanguageSection({ toast }: { toast: any }) {
  const [lang,      setLang]      = useState("en");
  const [theme,     setTheme]     = useState("system");
  const [tz,        setTz]        = useState("Asia/Kolkata");
  const [df,        setDf]        = useState("DD MMM YYYY");
  const [fontSize,  setFontSize]  = useState<"Normal" | "Large" | "Extra Large">("Normal");

  const formatPreview = (fmt: string) => {
    if (fmt === "DD MMM YYYY") return "27 Apr 2026";
    if (fmt === "DD/MM/YYYY")  return "27/04/2026";
    if (fmt === "MM/DD/YYYY")  return "04/27/2026";
    if (fmt === "YYYY-MM-DD")  return "2026-04-27";
    return "27 Apr 2026";
  };

  const tzLabel: Record<string, string> = {
    "Asia/Kolkata": "UTC+5:30",
    "Asia/Dubai":   "UTC+4",
    "Europe/London":"UTC+0",
  };

  const themeLabel: Record<string, string> = {
    system: "System Default",
    light:  "Light",
    dark:   "Dark",
  };

  const fontSizes: ("Normal" | "Large" | "Extra Large")[] = ["Normal", "Large", "Extra Large"];

  return (
    <div data-testid="section-language">
      <SectionTitle title="Language & Preferences" sub="Display language, theme, timezone, and date format" />

      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="language-block">
        <AccentBar from="from-purple-500" to="to-primary" />
        <div className="p-5 bg-muted/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
              <Languages className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xs font-semibold text-foreground">Display Settings</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div data-testid="field-language">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Display Language</label>
              <select className="w-full h-9 bg-background border border-border rounded-xl px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={lang} onChange={(e) => setLang(e.target.value)} data-testid="select-language">
                <option value="en">English</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="te">Telugu (తెలుగు)</option>
              </select>
            </div>
            <div data-testid="field-theme">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Theme</label>
              <select className="w-full h-9 bg-background border border-border rounded-xl px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={theme} onChange={(e) => setTheme(e.target.value)} data-testid="select-theme">
                <option value="system">System Default</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div data-testid="field-timezone">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Timezone</label>
              <select className="w-full h-9 bg-background border border-border rounded-xl px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={tz} onChange={(e) => setTz(e.target.value)} data-testid="select-timezone">
                <option value="Asia/Kolkata">IST (UTC+5:30)</option>
                <option value="Asia/Dubai">Gulf Standard Time (UTC+4)</option>
                <option value="Europe/London">GMT (UTC+0)</option>
              </select>
            </div>
            <div data-testid="field-date-format">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Date Format</label>
              <select className="w-full h-9 bg-background border border-border rounded-xl px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={df} onChange={(e) => setDf(e.target.value)} data-testid="select-date-format">
                <option value="DD MMM YYYY">DD MMM YYYY (27 Apr 2026)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>

          {/* Live preview */}
          <div className="mt-4 p-3 bg-background border border-border rounded-xl flex flex-wrap items-center gap-3" data-testid="language-preview">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Preview:</span>
            <span className="text-xs font-semibold text-foreground bg-primary/8 px-2 py-0.5 rounded-lg" data-testid="preview-date">{formatPreview(df)}</span>
            <span className="text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded-lg" data-testid="preview-theme">{themeLabel[theme]}</span>
            <span className="text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded-lg" data-testid="preview-tz">{tzLabel[tz] ?? tz}</span>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="accessibility-block">
        <AccentBar from="from-blue-400" to="to-teal-400" />
        <div className="p-5 bg-muted/20">
          <p className="text-xs font-semibold text-foreground mb-3">Accessibility</p>
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Font Size</label>
            <div className="flex gap-2" data-testid="font-size-selector">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  data-testid={`font-size-${size.toLowerCase().replace(" ", "-")}`}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    fontSize === size
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SaveBar testid="language-save"
        onSave={() => toast({ title: "Preferences saved", description: "Language and display preferences updated." })}
        onCancel={() => {}} />
    </div>
  );
}

/* ─── SECTION: NOTIFICATIONS ─────────────────────── */

function NotifSettingsSection({ toast }: { toast: any }) {
  const [settings,      setSettings]      = useState(NOTIF_SETTINGS);
  const [quietEnabled,  setQuietEnabled]  = useState(false);
  const [quietStart,    setQuietStart]    = useState("22:00");
  const [quietEnd,      setQuietEnd]      = useState("07:00");

  const toggle = (id: string, channel: "email" | "sms" | "push") =>
    setSettings((prev) => prev.map((s) => s.id === id ? { ...s, [channel]: !s[channel as keyof typeof s] } : s));

  return (
    <div data-testid="section-notifications-settings">
      <SectionTitle title="Notification Settings" sub="Choose how and when you receive notifications for each event type" />

      {/* Notification table */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="notification-settings-table">
        <AccentBar from="from-blue-500" to="to-primary" />
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="text-center px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="text-center px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">SMS</th>
              <th className="text-center px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Push</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => {
              const cfg = NOTIF_ICON_CFG[s.id];
              return (
                <tr key={s.id} className="border-b border-border/50 last:border-0 hover:bg-muted/10"
                  data-testid={`notif-settings-row-${s.id}`}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg?.color ?? "bg-muted text-muted-foreground"}`}>
                        {cfg?.icon}
                      </div>
                      <span className="font-semibold text-foreground text-xs">{s.label}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Toggle checked={s.email} onChange={() => toggle(s.id, "email")} testid={`toggle-email-${s.id}`} />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Toggle checked={s.sms} onChange={() => toggle(s.id, "sms")} testid={`toggle-sms-${s.id}`} />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Toggle checked={s.push} onChange={() => toggle(s.id, "push")} testid={`toggle-push-${s.id}`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quiet Hours */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="quiet-hours-block">
        <AccentBar from="from-slate-400" to="to-slate-600" />
        <div className="p-5 bg-muted/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <VolumeX className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Quiet Hours</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Silence non-urgent notifications during these hours</p>
              </div>
            </div>
            <Toggle checked={quietEnabled} onChange={() => setQuietEnabled((v) => !v)} testid="toggle-quiet-hours" />
          </div>
          <AnimatePresence>
            {quietEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-4 overflow-hidden"
                data-testid="quiet-hours-inputs"
              >
                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Start Time</label>
                  <input type="time" value={quietStart} onChange={(e) => setQuietStart(e.target.value)}
                    className="w-full h-9 bg-background border border-border rounded-xl px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    data-testid="input-quiet-start" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">End Time</label>
                  <input type="time" value={quietEnd} onChange={(e) => setQuietEnd(e.target.value)}
                    className="w-full h-9 bg-background border border-border rounded-xl px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    data-testid="input-quiet-end" />
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-muted-foreground">
                    Active quiet window: <span className="font-semibold text-foreground">{quietStart} – {quietEnd}</span>. Only urgent alerts will come through.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <SaveBar testid="notif-settings-save"
        onSave={() => toast({ title: "Notification preferences saved" })}
        onCancel={() => setSettings(NOTIF_SETTINGS)} />
    </div>
  );
}

/* ─── SECTION: SESSION PREFERENCES ──────────────── */

function SessionPreferencesSection({ toast }: { toast: any }) {
  const [duration,    setDuration]    = useState("45 minutes");
  const [buffer,      setBuffer]      = useState("10 minutes");
  const [maxPerDay,   setMaxPerDay]   = useState("8");
  const [defaultMode, setDefaultMode] = useState("Video Call");
  const [timezone,    setTimezone]    = useState("Asia/Kolkata (IST, UTC+5:30)");
  const [autoAccept,  setAutoAccept]  = useState(false);
  const [showNotes,   setShowNotes]   = useState(true);
  const [recConsent,  setRecConsent]  = useState(true);
  const [workStart,   setWorkStart]   = useState("09:00");
  const [workEnd,     setWorkEnd]     = useState("18:00");
  const [workDays, setWorkDays] = useState({
    Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false,
  });

  const toggleDay = (day: keyof typeof workDays) =>
    setWorkDays((d) => ({ ...d, [day]: !d[day] }));

  const activeDays = (Object.entries(workDays) as [string, boolean][]).filter(([, v]) => v).map(([k]) => k);
  const fmt12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
  };
  const scheduleSummary = activeDays.length > 0
    ? `${activeDays[0]}${activeDays.length > 1 ? `–${activeDays[activeDays.length - 1]}` : ""}, ${fmt12(workStart)} – ${fmt12(workEnd)}`
    : "No working days selected";

  const handleSave = () =>
    toast({ title: "Session preferences saved", description: "Your scheduling settings have been updated." });

  return (
    <div data-testid="section-sessions">
      <SectionTitle title="Session Preferences" sub="Configure your default session format, availability, and scheduling rules" />

      {/* Scheduling defaults */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="session-scheduling-block">
        <AccentBar from="from-primary" to="to-teal-400" />
        <div className="p-5 bg-muted/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs font-semibold text-foreground">Scheduling Defaults</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div data-testid="field-session-duration">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Session Duration</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} data-testid="select-session-duration"
                className="w-full h-9 px-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
                {["30 minutes", "45 minutes", "60 minutes", "90 minutes"].map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div data-testid="field-buffer-time">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Buffer Between Sessions</label>
              <select value={buffer} onChange={(e) => setBuffer(e.target.value)} data-testid="select-buffer-time"
                className="w-full h-9 px-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
                {["0 minutes", "5 minutes", "10 minutes", "15 minutes", "20 minutes"].map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div data-testid="field-max-sessions">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Max Sessions per Day</label>
              <input type="number" min={1} max={20} value={maxPerDay} onChange={(e) => setMaxPerDay(e.target.value)}
                data-testid="input-max-sessions"
                className="w-full h-9 px-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
            </div>
            <div data-testid="field-default-mode">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Default Session Mode</label>
              <select value={defaultMode} onChange={(e) => setDefaultMode(e.target.value)} data-testid="select-default-mode"
                className="w-full h-9 px-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
                <option>Video Call</option>
                <option>Phone Call</option>
                <option>In-Person</option>
              </select>
            </div>
            <div className="sm:col-span-2" data-testid="field-timezone">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} data-testid="select-timezone"
                className="w-full h-9 px-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
                <option>Asia/Kolkata (IST, UTC+5:30)</option>
                <option>Asia/Dubai (GST, UTC+4)</option>
                <option>Europe/London (GMT, UTC+0)</option>
                <option>America/New_York (EST, UTC-5)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Work hours + days */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="work-hours-block">
        <AccentBar from="from-teal-500" to="to-green-400" />
        <div className="p-5 bg-muted/20">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-foreground">Availability</p>
            <span className="text-[10px] font-semibold bg-primary/8 text-primary border border-primary/20 px-2.5 py-1 rounded-full" data-testid="schedule-summary">
              {scheduleSummary}
            </span>
          </div>

          {/* Work hours */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Start Time</label>
              <input type="time" value={workStart} onChange={(e) => setWorkStart(e.target.value)}
                className="w-full h-9 bg-background border border-border rounded-xl px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-work-start" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">End Time</label>
              <input type="time" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)}
                className="w-full h-9 bg-background border border-border rounded-xl px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="input-work-end" />
            </div>
          </div>

          {/* Working days */}
          <div data-testid="working-days-block">
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Working Days</label>
            <div className="flex gap-1.5 flex-wrap">
              {(Object.keys(workDays) as Array<keyof typeof workDays>).map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  data-testid={`toggle-day-${day}`}
                  className={`w-10 h-10 text-xs font-bold rounded-xl border-2 transition-all ${
                    workDays[day]
                      ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/20"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {day.slice(0, 2)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Behaviour toggles */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="session-behaviour-block">
        <AccentBar from="from-amber-400" to="to-primary" />
        <div className="p-5 bg-muted/20">
          <p className="text-xs font-semibold text-foreground mb-4">Session Behaviour</p>
          <div className="space-y-4">
            {[
              { key: "autoAccept", label: "Auto-accept referrals",    desc: "Automatically accept new student referrals from Inupgro", val: autoAccept, set: setAutoAccept },
              { key: "showNotes",  label: "Show prior session notes", desc: "Display previous session notes before each appointment",  val: showNotes,  set: setShowNotes  },
              { key: "recConsent", label: "Recording consent prompt", desc: "Always prompt students for consent before recording",     val: recConsent, set: setRecConsent },
            ].map(({ key, label, desc, val, set }) => (
              <div key={key} className="flex items-center justify-between gap-4" data-testid={`behaviour-row-${key}`}>
                <div>
                  <p className="text-xs font-semibold text-foreground">{label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <button role="switch" aria-checked={val} onClick={() => set((v: boolean) => !v)} data-testid={`toggle-${key}`}
                  className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${val ? "bg-primary" : "bg-muted border border-border"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${val ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SaveBar testid="sessions-save" onSave={handleSave} onCancel={() => toast({ title: "Changes discarded" })} />
    </div>
  );
}

/* ─── SECTION: BANK ──────────────────────────────── */

function BankSection({ toast }: { toast: any }) {
  const [editing, setEditing] = useState(false);

  return (
    <div data-testid="section-bank">
      <SectionTitle title="Bank & Payout Details" sub="Your registered bank account for payout credits. Managed by MindBridge finance team." />

      {/* Virtual bank card */}
      <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-blue-700 text-primary-foreground p-5 shadow-lg mb-5"
        data-testid="virtual-bank-card">
        <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-10 -translate-x-10" />
        <div className="relative h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold opacity-80">MindBridge</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">{BANK_DATA.accountType}</span>
              {BANK_DATA.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-300" />
              )}
            </div>
          </div>
          <div>
            <p className="text-xl font-mono font-bold tracking-[0.25em] mb-3" data-testid="card-account-number">
              •••• •••• {BANK_DATA.accountNumber.replace("****", "")}
            </p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] opacity-50 uppercase tracking-wider">Account Holder</p>
                <p className="text-sm font-semibold" data-testid="card-holder-name">{BANK_DATA.accountHolder}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] opacity-50 uppercase tracking-wider">Bank</p>
                <p className="text-sm font-semibold" data-testid="card-bank-name">{BANK_DATA.bankName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] opacity-50 uppercase tracking-wider">IFSC</p>
                <p className="text-sm font-mono font-semibold" data-testid="card-ifsc">{BANK_DATA.ifsc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details card */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="bank-details-card">
        <AccentBar from="from-primary" to="to-blue-400" />
        <div className="p-5 bg-muted/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs font-semibold text-foreground">Primary Bank Account</p>
            </div>
            <div className="flex items-center gap-2">
              {BANK_DATA.verified && (
                <span className="text-[10px] font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-0.5 rounded-full" data-testid="bank-verified-badge">
                  Verified
                </span>
              )}
              <button className="flex items-center gap-1 text-[10px] text-primary font-semibold hover:underline" data-testid="button-edit-bank"
                onClick={() => setEditing((v) => !v)}>
                <Edit3 className="w-3 h-3" />{editing ? "Cancel" : "Edit"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3" data-testid="bank-info-grid">
            {[
              { label: "Account Holder", value: BANK_DATA.accountHolder, testid: "bank-holder"     },
              { label: "Bank Name",      value: BANK_DATA.bankName,       testid: "bank-name"       },
              { label: "Account Number", value: BANK_DATA.accountNumber,  testid: "bank-account-no" },
              { label: "IFSC Code",      value: BANK_DATA.ifsc,           testid: "bank-ifsc"       },
              { label: "Branch",         value: BANK_DATA.branch,         testid: "bank-branch"     },
              { label: "Account Type",   value: BANK_DATA.accountType,    testid: "bank-type"       },
            ].map((f) => (
              <div key={f.testid} data-testid={f.testid}>
                <p className="text-[10px] text-muted-foreground">{f.label}</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{f.value}</p>
              </div>
            ))}
          </div>

          {editing && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="mt-5 pt-4 border-t border-border" data-testid="bank-edit-form">
              <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                Bank account changes require re-verification by the MindBridge finance team. Changes may take 2–3 business days to take effect.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field testid="field-bank-name"     label="Bank Name"     value={BANK_DATA.bankName} />
                <Field testid="field-bank-ifsc"     label="IFSC Code"     value={BANK_DATA.ifsc}     />
                <Field testid="field-bank-acc"      label="Account No."   value=""                   />
                <Field testid="field-bank-acc-conf" label="Confirm Acc."  value=""                   />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setEditing(false)} data-testid="button-bank-cancel">Cancel</Button>
                <Button size="sm" className="h-8 text-xs" data-testid="button-bank-submit"
                  onClick={() => { setEditing(false); toast({ title: "Bank update requested", description: "Verification will take 2–3 business days." }); }}>
                  Submit for Verification
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* PAN chip */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 text-white p-4 flex items-center gap-3 shadow-sm"
        data-testid="pan-details-card">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-6 translate-x-6" />
        <div className="w-10 h-8 bg-white/25 rounded-lg flex items-center justify-center shrink-0 border border-white/30">
          <Hash className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-semibold opacity-70 uppercase tracking-wider">PAN Card</p>
          <p className="text-sm font-mono font-bold tracking-wider" data-testid="pan-number">{BANK_DATA.pan}</p>
        </div>
        <span className="text-[10px] font-bold bg-white/20 border border-white/30 px-2.5 py-1 rounded-full shrink-0" data-testid="pan-verified-badge">
          Verified
        </span>
      </div>
    </div>
  );
}

/* ─── SECTION: DOCUMENTS ─────────────────────────── */

function DocumentsSection({ toast }: { toast: any }) {
  const [docs, setDocs] = useState(DOCUMENTS);
  const fileRef = useRef<HTMLInputElement>(null);

  const verifiedCount = docs.filter((d) => d.status === "verified").length;
  const progress = Math.round((verifiedCount / docs.length) * 100);
  const hasPending = docs.some((d) => d.status === "pending");

  return (
    <div data-testid="section-documents">
      <SectionTitle title="Document Management" sub="Uploaded verification documents and their approval status" />

      {/* Progress header */}
      <div className="border border-border rounded-2xl overflow-hidden mb-5" data-testid="doc-progress-card">
        <AccentBar from="from-green-500" to="to-teal-400" />
        <div className="p-5 bg-muted/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs font-semibold text-foreground">Verification Progress</p>
            </div>
            <span className="text-xs font-bold text-green-700" data-testid="doc-progress-label">
              {verifiedCount} of {docs.length} verified
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden" data-testid="doc-progress-bar">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          {hasPending && (
            <div className="mt-3 flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl" data-testid="pending-docs-banner">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <p className="text-[10px] text-amber-700">Pending documents: review typically takes <span className="font-semibold">1–3 business days</span>.</p>
            </div>
          )}
        </div>
      </div>

      {/* Document list */}
      <div className="space-y-2 mb-5" data-testid="documents-list">
        {docs.map((d) => {
          const typeCfg = DOC_TYPE_CFG[d.type] ?? { icon: <FileText className="w-4 h-4" />, color: "bg-muted text-muted-foreground" };
          return (
            <div key={d.id}
              className={`flex items-center gap-4 p-4 border rounded-2xl transition-colors ${d.status === "pending" ? "bg-amber-50/50 border-amber-200" : "bg-muted/20 border-border"}`}
              data-testid={`doc-row-${d.id}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                d.status === "verified" ? typeCfg.color : "bg-amber-100 text-amber-600"
              }`}>
                {typeCfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">{d.name}</p>
                <p className="text-[10px] text-muted-foreground">{d.type} · {d.size} · Uploaded {d.uploaded}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                d.status === "verified"
                  ? "bg-green-100 border-green-200 text-green-700"
                  : "bg-amber-100 border-amber-200 text-amber-700"
              }`} data-testid={`doc-status-${d.id}`}>
                {d.status === "verified" ? "Verified" : "Pending"}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" data-testid={`button-download-doc-${d.id}`}
                  onClick={() => toast({ title: `${d.name} downloaded` })}>
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors" data-testid={`button-delete-doc-${d.id}`}
                  onClick={() => { setDocs((p) => p.filter((x) => x.id !== d.id)); toast({ title: `${d.name} removed` }); }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload area */}
      <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/2 transition-all cursor-pointer"
        data-testid="upload-doc-area"
        onClick={() => fileRef.current?.click()}>
        <Upload className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm font-semibold text-foreground">Upload a document</p>
        <p className="text-[10px] text-muted-foreground text-center">PDF, JPG or PNG up to 5 MB. Accepted: ID proof, certifications, degree, experience letters.</p>
        <button className="mt-1 text-xs font-semibold text-primary hover:underline" data-testid="button-browse-files">Browse files</button>
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" data-testid="input-doc-file"
          onChange={() => toast({ title: "Document uploaded", description: "Your document has been submitted for review." })} />
      </div>
    </div>
  );
}

/* ─── SECTION: HELP ──────────────────────────────── */

function HelpSection({ toast }: { toast: any }) {
  const [openFaq,   setOpenFaq]   = useState<number | null>(null);
  const [feedback,  setFeedback]  = useState("");
  const [rating,    setRating]    = useState<number | null>(null);
  const [faqQuery,  setFaqQuery]  = useState("");

  const filteredFaq = useMemo(() => {
    if (!faqQuery.trim()) return FAQ;
    const q = faqQuery.toLowerCase();
    return FAQ.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [faqQuery]);

  return (
    <div data-testid="section-help">
      <SectionTitle title="Help & Support" sub="FAQs, contact support, and share feedback" />

      {/* Quick contact */}
      <div className="border border-border rounded-2xl overflow-hidden mb-6" data-testid="support-cards">
        <AccentBar from="from-blue-500" to="to-primary" />
        <div className="p-5 bg-muted/20">
          <p className="text-xs font-semibold text-foreground mb-3">Contact Support</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: <Mail        className="w-4 h-4" />, label: "Email Support", val: "support@mindbridge.in",   testid: "support-email", bg: "bg-blue-50 text-blue-600"    },
              { icon: <Phone       className="w-4 h-4" />, label: "Phone Support", val: "1800-XXX-XXXX (9AM–6PM)", testid: "support-phone", bg: "bg-green-50 text-green-600"  },
              { icon: <MessageCircle className="w-4 h-4" />, label: "Live Chat", val: "Chat with us now",         testid: "support-chat",  bg: "bg-primary/10 text-primary"  },
            ].map((c) => (
              <button key={c.testid}
                className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl text-left hover:bg-muted/40 transition-colors group"
                data-testid={c.testid}
                onClick={() => toast({ title: c.label, description: c.val })}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${c.bg}`}>{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{c.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{c.val}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="border border-border rounded-2xl overflow-hidden mb-6" data-testid="faq-section">
        <AccentBar from="from-purple-400" to="to-primary" />
        <div className="p-5 bg-muted/20">
          <p className="text-xs font-semibold text-foreground mb-3">Frequently Asked Questions</p>
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search FAQs…"
              value={faqQuery}
              onChange={(e) => { setFaqQuery(e.target.value); setOpenFaq(null); }}
              className="w-full h-9 pl-9 pr-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="faq-search-input"
            />
          </div>
          <div className="space-y-2" data-testid="faq-list">
            {filteredFaq.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground" data-testid="faq-empty">
                No FAQs match "<span className="font-semibold">{faqQuery}</span>"
              </div>
            ) : (
              filteredFaq.map((faq, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden bg-card" data-testid={`faq-item-${i}`}>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-muted/20 transition-colors"
                    data-testid={`faq-toggle-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <p className="text-xs font-semibold text-foreground pr-4">{faq.q}</p>
                    <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 border-t border-border bg-muted/10" data-testid={`faq-answer-${i}`}>
                      <p className="text-xs text-muted-foreground leading-relaxed pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="border border-border rounded-2xl overflow-hidden" data-testid="feedback-section">
        <AccentBar from="from-amber-400" to="to-orange-400" />
        <div className="p-5 bg-muted/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xs font-semibold text-foreground">Share Feedback</p>
          </div>
          <div className="flex items-center gap-2 mb-4" data-testid="rating-stars">
            <p className="text-[10px] text-muted-foreground mr-1">Rate your experience:</p>
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} onClick={() => setRating(i)} data-testid={`star-${i}`}>
                <Star className={`w-5 h-5 ${i <= (rating ?? 0) ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <textarea
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            rows={3}
            placeholder="Tell us what you think, or report an issue..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            data-testid="feedback-input"
          />
          <Button size="sm" className="mt-3 h-9 text-sm gap-1.5" data-testid="button-submit-feedback"
            onClick={() => { toast({ title: "Feedback submitted", description: "Thank you for your feedback." }); setFeedback(""); setRating(null); }}>
            <Check className="w-3.5 h-3.5" />Submit Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── SECTION: LOGOUT ────────────────────────────── */

function LogoutSection({ toast, navigate }: { toast: any; navigate: any }) {
  const [confirmed, setConfirmed] = useState(false);
  const [sessionDevices, setSessionDevices] = useState(ACTIVE_DEVICES);

  const signOutDevice = (id: string) => {
    setSessionDevices((d) => d.filter((x) => x.id !== id));
    toast({ title: "Device signed out" });
  };

  return (
    <div data-testid="section-logout" className="flex flex-col items-center py-12 gap-6">
      <div className="w-20 h-20 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
        <LogOut className="w-8 h-8 text-red-500" />
      </div>
      <div className="text-center">
        <p className="text-lg font-serif font-semibold text-foreground">Sign out of MindBridge?</p>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">You will be returned to the login screen. Any unsaved changes will be lost.</p>
      </div>

      {!confirmed ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" size="sm" className="h-10 px-6 text-sm" data-testid="button-cancel-logout"
            onClick={() => toast({ title: "Logout cancelled" })}>
            Cancel
          </Button>
          <Button size="sm" className="h-10 px-6 text-sm bg-red-600 hover:bg-red-700 text-white border-0" data-testid="button-confirm-logout"
            onClick={() => { setConfirmed(true); toast({ title: "Logged out", description: "You have been signed out of MindBridge." }); setTimeout(() => navigate("/"), 1200); }}>
            <LogOut className="w-4 h-4 mr-1.5" />Sign out
          </Button>
          <Button variant="outline" size="sm" className="h-10 px-5 text-sm text-red-500 border-red-200 hover:bg-red-50" data-testid="button-signout-all"
            onClick={() => { toast({ title: "Signed out of all devices", description: "All sessions have been terminated." }); setTimeout(() => navigate("/"), 1200); }}>
            Sign out of all devices
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-600" data-testid="logout-success">
          <CheckCircle2 className="w-5 h-5" />
          <p className="text-sm font-semibold">Signed out successfully. Redirecting...</p>
        </div>
      )}

      {/* Active device sessions */}
      <div className="w-full max-w-md border border-border rounded-2xl overflow-hidden" data-testid="logout-devices">
        <AccentBar from="from-slate-400" to="to-slate-600" />
        <div className="p-4 bg-muted/20">
          <p className="text-xs font-semibold text-foreground mb-3">Active Sessions</p>
          <div className="space-y-2">
            {sessionDevices.map((dv) => (
              <div key={dv.id}
                className={`flex items-center gap-3 p-3 rounded-xl border ${dv.isCurrent ? "bg-primary/5 border-primary/20" : "bg-card border-border"}`}
                data-testid={`logout-device-row-${dv.id}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${dv.isCurrent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {dv.type === "phone" ? <Smartphone className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-foreground truncate">{dv.name}</p>
                    {dv.isCurrent && <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">Current</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{dv.location} · {dv.lastActive}</p>
                </div>
                {!dv.isCurrent && (
                  <button className="text-[10px] text-red-500 font-semibold hover:underline shrink-0"
                    data-testid={`button-signout-logout-device-${dv.id}`}
                    onClick={() => signOutDevice(dv.id)}>
                    Sign out
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 bg-muted/20 border border-border rounded-xl text-center max-w-sm" data-testid="session-info">
        <p className="text-[10px] text-muted-foreground">Logged in as <span className="font-semibold text-foreground">Dr. Ananya Sharma</span></p>
        <p className="text-[10px] text-muted-foreground">Session started: Today, 9:00 AM · Last active: Just now</p>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────── */

export default function SettingsScreen({ mobile = "9876543210" }: { mobile?: string }) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [activeSection, setActiveSection] = useState<Section>("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":        return <ProfileSection         toast={toast} />;
      case "specialization": return <SpecializationSection  toast={toast} />;
      case "security":       return <SecuritySection        toast={toast} />;
      case "language":       return <LanguageSection        toast={toast} />;
      case "notifications":  return <NotifSettingsSection   toast={toast} />;
      case "sessions":       return <SessionPreferencesSection toast={toast} />;
      case "bank":           return <BankSection            toast={toast} />;
      case "documents":      return <DocumentsSection       toast={toast} />;
      case "help":           return <HelpSection            toast={toast} />;
      case "logout":         return <LogoutSection          toast={toast} navigate={navigate} />;
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">

      {/* ── APP SIDEBAR ── */}
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 220, opacity: 1 }}
          transition={{ duration: 0.22 }}
          className="bg-card border-r border-border flex flex-col shrink-0 overflow-hidden"
          data-testid="settings-sidebar"
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
            {NAV_ITEMS_SIDEBAR.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left whitespace-nowrap ${
                  item.id === "settings"
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
        <header className="h-16 bg-card/95 backdrop-blur border-b border-border flex items-center gap-3 px-4 sm:px-6 shrink-0" data-testid="settings-header">
          <button onClick={() => setSidebarOpen((v) => !v)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground" data-testid="button-toggle-sidebar">
            <Menu className="w-4.5 h-4.5" />
          </button>
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm font-semibold text-foreground">Settings</p>
            <span className="text-muted-foreground">·</span>
            <p className="text-sm text-muted-foreground">{SECTION_NAV.find((s) => s.id === activeSection)?.label}</p>
          </div>
        </header>

        {/* Two-column content */}
        <div className="flex-1 flex min-h-0 overflow-hidden">

          {/* ── SECTION NAV ── */}
          <aside className="w-56 shrink-0 border-r border-border bg-card overflow-y-auto" data-testid="settings-section-nav">
            <nav className="px-2 py-3 space-y-0.5">
              {SECTION_NAV.map((s) => (
                <button
                  key={s.id}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                    activeSection === s.id
                      ? "bg-primary/10 text-primary"
                      : s.id === "logout"
                        ? "text-red-500 hover:bg-red-50"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  data-testid={`section-nav-${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                >
                  <span className={activeSection === s.id ? "text-primary" : ""}>{s.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${activeSection === s.id ? "text-primary" : ""}`}>{s.label}</p>
                    {s.sub && <p className="text-[10px] text-muted-foreground truncate">{s.sub}</p>}
                  </div>
                  {activeSection === s.id && <div className="ml-auto w-1 h-5 bg-primary rounded-full shrink-0" />}
                </button>
              ))}
            </nav>
          </aside>

          {/* ── SECTION CONTENT ── */}
          <main className="flex-1 overflow-y-auto p-6 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

    </div>
  );
}
