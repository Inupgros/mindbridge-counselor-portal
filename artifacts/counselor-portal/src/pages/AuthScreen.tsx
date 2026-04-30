import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Phone, Shield, Eye, EyeOff, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import OTPScreen from "@/pages/OTPScreen";
import ProfileScreen from "@/pages/ProfileScreen";
import ReviewScreen from "@/pages/ReviewScreen";
import ApprovalPendingScreen from "@/pages/ApprovalPendingScreen";
import ApprovedScreen from "@/pages/ApprovedScreen";
import DashboardScreen from "@/pages/DashboardScreen";

export default function AuthScreen() {
  const [screen, setScreen] = useState<"auth" | "otp" | "profile" | "review" | "pending" | "approved" | "dashboard">("auth");
  const [registeredMobile, setRegisteredMobile] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regMobile,   setRegMobile]   = useState("");
  const [regEmail,    setRegEmail]    = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = () => {
    toast({ title: "Login successful!", description: "Welcome back to MindBridge." });
    navigate("/dashboard");
  };

  const handleRegister = () => {
    setRegisteredMobile(regMobile);
    setScreen("otp");
  };

  if (screen === "dashboard") return <DashboardScreen mobile={registeredMobile} />;
  if (screen === "approved")  return <ApprovedScreen  mobile={registeredMobile} onSuccess={() => setScreen("dashboard")} />;
  if (screen === "pending")   return <ApprovalPendingScreen mobile={registeredMobile} onSuccess={() => setScreen("approved")} />;
  if (screen === "review")    return <ReviewScreen    mobile={registeredMobile} onSuccess={() => setScreen("pending")} />;
  if (screen === "profile")   return <ProfileScreen   mobile={registeredMobile} onSuccess={() => setScreen("review")} />;
  if (screen === "otp")       return (
    <OTPScreen mobile={registeredMobile} onBack={() => setScreen("auth")} onSuccess={() => setScreen("profile")} />
  );

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">

      {/* Left Panel */}
      <div className="w-full md:w-[45%] bg-gradient-to-br from-primary to-[#5b21b6] text-primary-foreground p-8 md:p-12 lg:p-16 flex flex-col justify-between overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-semibold tracking-tight">MindBridge</span>
          </div>

          <div className="flex-1 flex flex-col justify-center my-12 md:my-0">
            <div className="w-full max-w-sm mx-auto mb-10 opacity-90 drop-shadow-2xl">
              <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <rect width="400" height="300" rx="16" fill="rgba(255,255,255,0.03)" />
                <rect x="80" y="200" width="240" height="12" rx="4" fill="rgba(255,255,255,0.15)" />
                <rect x="100" y="212" width="16" height="88" fill="rgba(255,255,255,0.1)" />
                <rect x="284" y="212" width="16" height="88" fill="rgba(255,255,255,0.1)" />
                <rect x="40" y="40" width="120" height="140" rx="8" fill="rgba(255,255,255,0.05)" />
                <line x1="100" y1="40" x2="100" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                <line x1="40" y1="110" x2="160" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                <rect x="280" y="40" width="80" height="140" fill="rgba(255,255,255,0.05)" />
                <line x1="280" y1="80" x2="360" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                <line x1="280" y1="120" x2="360" y2="120" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                <line x1="280" y1="160" x2="360" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                <rect x="290" y="56" width="12" height="24" rx="2" fill="rgba(255,255,255,0.2)" />
                <rect x="306" y="50" width="16" height="30" rx="2" fill="rgba(255,255,255,0.3)" />
                <rect x="326" y="60" width="10" height="20" rx="2" fill="rgba(255,255,255,0.15)" />
                <path d="M70 170 Q50 140 70 120 Q90 140 70 170" fill="rgba(255,255,255,0.2)" />
                <path d="M70 170 Q40 160 50 130 Q70 150 70 170" fill="rgba(255,255,255,0.15)" />
                <rect x="60" y="170" width="20" height="30" rx="4" fill="rgba(255,255,255,0.25)" />
                <circle cx="200" cy="110" r="24" fill="rgba(255,255,255,0.25)" />
                <path d="M160 190 Q160 140 200 140 Q240 140 240 190 L240 200 L160 200 Z" fill="rgba(255,255,255,0.2)" />
                <path d="M170 180 L210 180 L230 200 L150 200 Z" fill="rgba(255,255,255,0.4)" />
                <rect x="175" y="165" width="50" height="35" rx="2" fill="rgba(255,255,255,0.3)" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-medium leading-tight mb-4 text-white">
              Trusted by 12,000+ certified counselors worldwide.
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-md">
              A serene, secure platform designed exclusively for the mindful practice of therapy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white/90" />
              </div>
              <span className="text-sm font-medium text-white/90">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white/90" />
              </div>
              <span className="text-sm font-medium text-white/90">256-bit SSL</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white/90" />
              </div>
              <span className="text-sm font-medium text-white/90">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-card relative">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-semibold text-foreground">MindBridge</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-2">
              {activeTab === "login" ? "Welcome back" : "Join MindBridge"}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === "login"
                ? "Enter your credentials to access your practice."
                : "Apply for a counselor account to manage your practice."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex p-1 bg-muted rounded-xl mb-8 relative">
            <button
              onClick={() => setActiveTab("login")}
              data-testid="tab-login"
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors relative z-10 ${
                activeTab === "login" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              data-testid="tab-register"
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors relative z-10 ${
                activeTab === "register" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
            <motion.div
              layoutId="activeTab"
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-card rounded-lg shadow-sm"
              initial={false}
              animate={{ left: activeTab === "login" ? "4px" : "calc(50%)" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      data-testid="input-email"
                      placeholder="dr.smith@example.com"
                      className="pl-10 h-11"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      data-testid="input-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-1">
                    <button type="button" data-testid="link-forgot-password" className="text-xs text-primary hover:underline font-medium">
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <Button data-testid="button-login" className="w-full h-11 text-base mt-2 shadow-md" onClick={handleLogin}>
                  Sign In
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Mobile Number</label>
                  <div className="relative flex">
                    <div className="flex items-center justify-center bg-muted border border-input border-r-0 rounded-l-md px-3 text-muted-foreground text-sm font-medium">
                      +1
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                      <Input
                        data-testid="input-mobile"
                        placeholder="(555) 000-0000"
                        className="pl-10 rounded-l-none h-11"
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Work Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Work Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      data-testid="input-reg-email"
                      placeholder="dr.smith@example.com"
                      className="pl-10 h-11"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      data-testid="input-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Role */}
                <div className="pt-2">
                  <label className="mb-2 block text-sm font-medium leading-none">Account Role</label>
                  <div className="p-3 border border-border rounded-lg bg-muted/50 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                      <Shield className="h-4 w-4 text-primary" />
                      Counselor
                    </div>
                    <Badge variant="secondary" className="font-normal text-xs text-muted-foreground">Read-only</Badge>
                  </div>
                </div>

                <Button data-testid="button-register" className="w-full h-11 text-base mt-4 shadow-md" onClick={handleRegister}>
                  Submit Application
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Secure Portal</span>
            <Separator className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
