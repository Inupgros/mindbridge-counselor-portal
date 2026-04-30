import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle2, ShieldCheck, Clock, ArrowLeft, MessageSquare, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface OTPScreenProps {
  mobile: string;
  onBack: () => void;
  onSuccess: () => void;
}

const RESEND_SECONDS = 30;
const OTP_LENGTH = 6;

export default function OTPScreen({ mobile, onBack, onSuccess }: OTPScreenProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setHasError(false);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setHasError(true);
      toast({ title: "Incomplete code", description: "Please enter all 6 digits.", variant: "destructive" });
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
    }, 1400);
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setHasError(false);
    inputRefs.current[0]?.focus();
    toast({ title: "Code resent", description: `A new code was sent to +1 ${mobile}` });
  };

  const maskedMobile = mobile.length >= 4
    ? `+1 (•••) •••-${mobile.slice(-4)}`
    : `+1 ${mobile}`;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Left Panel */}
      <div className="w-full md:w-[45%] bg-gradient-to-br from-primary to-blue-700 text-primary-foreground p-8 md:p-12 lg:p-16 flex flex-col justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-semibold tracking-tight">MindBridge</span>
          </div>

          <div className="flex-1 flex flex-col justify-center my-12 md:my-0">
            {/* Shield/Lock Illustration */}
            <div className="w-full max-w-xs mx-auto mb-10 opacity-90 drop-shadow-2xl">
              <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                {/* Background circle glow */}
                <circle cx="160" cy="130" r="100" fill="rgba(255,255,255,0.04)" />
                <circle cx="160" cy="130" r="75" fill="rgba(255,255,255,0.04)" />
                {/* Phone silhouette */}
                <rect x="110" y="50" width="100" height="170" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <rect x="122" y="66" width="76" height="120" rx="6" fill="rgba(255,255,255,0.06)" />
                {/* Screen content — message bubbles */}
                <rect x="130" y="80" width="60" height="12" rx="6" fill="rgba(255,255,255,0.25)" />
                <rect x="130" y="100" width="44" height="10" rx="5" fill="rgba(255,255,255,0.15)" />
                {/* OTP boxes on screen */}
                <rect x="128" y="120" width="14" height="16" rx="3" fill="rgba(255,255,255,0.3)" />
                <rect x="146" y="120" width="14" height="16" rx="3" fill="rgba(255,255,255,0.3)" />
                <rect x="164" y="120" width="14" height="16" rx="3" fill="rgba(255,255,255,0.3)" />
                <rect x="128" y="142" width="14" height="16" rx="3" fill="rgba(255,255,255,0.15)" />
                <rect x="146" y="142" width="14" height="16" rx="3" fill="rgba(255,255,255,0.15)" />
                <rect x="164" y="142" width="14" height="16" rx="3" fill="rgba(255,255,255,0.15)" />
                {/* Home indicator */}
                <rect x="145" y="208" width="30" height="4" rx="2" fill="rgba(255,255,255,0.2)" />
                {/* Shield badge floating */}
                <circle cx="230" cy="80" r="28" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <path d="M230 62 C218 66 218 72 218 78 C218 88 224 96 230 100 C236 96 242 88 242 78 C242 72 242 66 230 62Z" fill="rgba(255,255,255,0.5)" />
                <path d="M226 80 L229 83 L235 77" stroke="rgba(20,50,90,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Signal arcs */}
                <path d="M90 170 Q90 140 110 130" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M82 178 Q80 135 110 118" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-medium leading-tight mb-4 text-white">
              Your security is our priority.
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-md">
              Two-factor verification ensures only you can access your practice on MindBridge.
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
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-semibold text-foreground">MindBridge</span>
          </div>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              /* Success State */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center text-center py-8"
                data-testid="otp-success"
              >
                {/* Animated checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                  className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-6"
                >
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                      <motion.path
                        d="M10 22 L18 30 L34 14"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                      />
                    </svg>
                  </motion.div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-serif font-medium text-foreground mb-2"
                >
                  Verified successfully
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-muted-foreground mb-8"
                >
                  Your identity has been confirmed. Welcome to MindBridge.
                </motion.p>

                {/* Secure login message */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary/5 border border-primary/10"
                  data-testid="secure-login-message"
                >
                  <Lock className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm text-primary font-medium">Secure login established</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mt-6 w-full"
                >
                  <Button
                    data-testid="button-continue-profile"
                    className="w-full h-11"
                    onClick={onSuccess}
                  >
                    Continue to Profile Setup
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              /* OTP Entry State */
              <motion.div
                key="otp-entry"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                {/* Back button */}
                <button
                  data-testid="button-edit-mobile"
                  onClick={onBack}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  Edit mobile number
                </button>

                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-2">
                    Verify your number
                  </h2>
                  <p className="text-muted-foreground">
                    We sent a 6-digit code to{" "}
                    <span className="font-medium text-foreground">{maskedMobile}</span>
                  </p>
                </div>

                {/* OTP Input boxes */}
                <div className="mb-6">
                  <div
                    className="flex gap-3 justify-between"
                    onPaste={handlePaste}
                    data-testid="otp-input-group"
                  >
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        data-testid={`otp-input-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`
                          w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 bg-background
                          outline-none transition-all duration-150
                          focus:border-primary focus:ring-2 focus:ring-primary/20
                          ${hasError
                            ? "border-destructive bg-destructive/5 text-destructive animate-shake"
                            : digit
                              ? "border-primary/60 bg-primary/5 text-foreground"
                              : "border-border text-foreground"
                          }
                        `}
                      />
                    ))}
                  </div>
                  {hasError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive text-sm mt-2"
                    >
                      Please enter all 6 digits to continue.
                    </motion.p>
                  )}
                </div>

                {/* Resend timer */}
                <div className="flex items-center justify-between mb-8 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>Didn't receive it?</span>
                  </div>
                  {canResend ? (
                    <button
                      data-testid="button-resend-otp"
                      onClick={handleResend}
                      className="font-medium text-primary hover:underline transition-colors"
                    >
                      Resend code
                    </button>
                  ) : (
                    <span className="text-muted-foreground" data-testid="resend-timer">
                      Resend in{" "}
                      <span className="font-semibold text-foreground tabular-nums">
                        0:{String(timer).padStart(2, "0")}
                      </span>
                    </span>
                  )}
                </div>

                {/* Verify button */}
                <Button
                  data-testid="button-verify-otp"
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="w-full h-11 text-base shadow-md"
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Verifying...
                    </span>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                {/* Secure login message */}
                <div className="mt-6 flex items-center justify-center gap-2" data-testid="secure-login-message">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">This is a secure, encrypted verification step</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
