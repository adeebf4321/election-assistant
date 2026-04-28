/**
 * VoterGuide component.
 *
 * Renders an interactive, step-by-step wizard that walks users
 * through the four essential steps to becoming a registered,
 * informed voter in India. Each step includes a detailed
 * description and a direct action link to the relevant official
 * ECI portal. Uses Framer Motion for content transitions.
 * Includes a "Save to Google Drive" feature for signed-in users.
 */
"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  FileText,
  MapPin,
  UserPlus,
  HardDrive,
  Loader2,
  Check,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { saveToGoogleDrive, generateVoterGuideContent } from "@/lib/google-apis";

/** Represents a single step in the voter guide */
interface GuideStep {
  /** Unique identifier for this step */
  id: string;
  /** Display title including the step number */
  title: string;
  /** Lucide icon component to render for this step */
  icon: LucideIcon;
  /** Detailed description of the step */
  content: string;
  /** Label text for the call-to-action button */
  actionText: string;
  /** URL to the official portal for this step */
  link: string;
}

/** Static data for the four voter guide steps */
const steps: GuideStep[] = [
  {
    id: "eligibility",
    title: "1. Check Eligibility",
    icon: UserPlus,
    content:
      "To vote in India, you must be an Indian citizen, 18 years of age or older on the qualifying date (usually Jan 1st of the year), and a resident of the polling area.",
    actionText: "Verify Age Requirements",
    link: "https://voters.eci.gov.in/",
  },
  {
    id: "registration",
    title: "2. Register to Vote (Form 6)",
    icon: FileText,
    content:
      "If you are a new voter, you need to fill out Form 6. You can do this online via the NVSP portal or submit a physical copy to your Electoral Registration Officer (ERO).",
    actionText: "Apply Online via Form 6",
    link: "https://voters.eci.gov.in/",
  },
  {
    id: "verify",
    title: "3. Verify Electoral Roll",
    icon: CheckCircle2,
    content:
      "Having a Voter ID (EPIC) is not enough. Your name MUST be on the electoral roll. Check your status online before election day.",
    actionText: "Search Your Name in Roll",
    link: "https://electoralsearch.eci.gov.in/",
  },
  {
    id: "poll",
    title: "4. Find Polling Booth",
    icon: MapPin,
    content:
      "Your polling booth is assigned based on your address. You can find your exact booth location and Part Number online or via the Voter Helpline App.",
    actionText: "Locate Booth",
    link: "https://electoralsearch.eci.gov.in/",
  },
];

export default function VoterGuide() {
  const [activeStep, setActiveStep] = useState<string>(steps[0].id);
  const [driveStatus, setDriveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const { user, accessToken } = useAuth();

  /** Saves the full voter guide to Google Drive */
  const handleSaveToDrive = async () => {
    if (!accessToken) return;
    setDriveStatus("saving");
    try {
      const content = generateVoterGuideContent();
      const fileId = await saveToGoogleDrive(
        accessToken,
        "IndiaVotes_Voter_Registration_Guide.txt",
        content
      );
      setDriveStatus(fileId ? "saved" : "error");
    } catch {
      setDriveStatus("error");
    }
    setTimeout(() => setDriveStatus("idle"), 3000);
  };

  return (
    <section
      id="guide"
      className="py-20 bg-[#112240]"
      aria-labelledby="guide-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            id="guide-heading"
            className="text-3xl md:text-4xl font-bold mb-4 heading-gradient"
          >
            Step-by-Step Voter Guide
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Follow this simple guide to ensure you are ready for election day.
          </p>

          {/* Save to Google Drive — visible when signed in */}
          {user && accessToken && (
            <div className="mt-6">
              <button
                onClick={handleSaveToDrive}
                disabled={driveStatus === "saving"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] disabled:opacity-50"
                style={{
                  backgroundColor:
                    driveStatus === "saved"
                      ? "rgba(19, 136, 8, 0.15)"
                      : driveStatus === "error"
                      ? "rgba(239, 68, 68, 0.15)"
                      : "rgba(255, 255, 255, 0.05)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor:
                    driveStatus === "saved"
                      ? "#138808"
                      : driveStatus === "error"
                      ? "#ef4444"
                      : "rgba(255, 255, 255, 0.15)",
                  color:
                    driveStatus === "saved"
                      ? "#138808"
                      : driveStatus === "error"
                      ? "#ef4444"
                      : "#d1d5db",
                }}
                aria-label="Save voter guide to Google Drive"
              >
                {driveStatus === "saving" && (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                {driveStatus === "saved" && (
                  <Check className="h-4 w-4" aria-hidden="true" />
                )}
                {driveStatus === "error" && (
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                )}
                {driveStatus === "idle" && (
                  <HardDrive className="h-4 w-4" aria-hidden="true" />
                )}
                <span>
                  {driveStatus === "saving"
                    ? "Saving to Drive..."
                    : driveStatus === "saved"
                    ? "Saved to Drive!"
                    : driveStatus === "error"
                    ? "Save Failed"
                    : "Save Guide to Google Drive"}
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step Selector Panel */}
          <div
            className="lg:col-span-1 space-y-4"
            role="tablist"
            aria-label="Voter guide steps"
          >
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${step.id}`}
                  id={`tab-${step.id}`}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center justify-between border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] ${
                    isActive
                      ? "bg-[#138808]/10 border-[#138808] text-white"
                      : "bg-[#0A192F] border-white/10 text-gray-400 hover:border-white/30 hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-[#138808]" : ""}`}
                      aria-hidden="true"
                    />
                    <span className="font-medium">{step.title}</span>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 transition-transform ${
                      isActive ? "rotate-90 text-[#138808]" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {/* Step Content Panel */}
          <div className="lg:col-span-2">
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  id={`panel-${step.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${step.id}`}
                  hidden={!isActive}
                  className="glass-panel rounded-2xl p-8 min-h-[300px] flex flex-col relative overflow-hidden"
                >
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col"
                    >
                      <Icon
                        className="h-12 w-12 text-[#FF9933] mb-6"
                        aria-hidden="true"
                      />
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {step.title}
                      </h3>
                      <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-1">
                        {step.content}
                      </p>

                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#138808] hover:bg-[#138808]/80 text-white px-6 py-3 rounded-lg font-medium transition-colors w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]"
                        aria-label={`${step.actionText} — opens in a new tab`}
                      >
                        {step.actionText}
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
