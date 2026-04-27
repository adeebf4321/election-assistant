"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, FileText, MapPin, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    id: "eligibility",
    title: "1. Check Eligibility",
    icon: UserPlus,
    content: "To vote in India, you must be an Indian citizen, 18 years of age or older on the qualifying date (usually Jan 1st of the year), and a resident of the polling area.",
    actionText: "Verify Age Requirements",
    link: "https://voters.eci.gov.in/"
  },
  {
    id: "registration",
    title: "2. Register to Vote (Form 6)",
    icon: FileText,
    content: "If you are a new voter, you need to fill out Form 6. You can do this online via the NVSP portal or submit a physical copy to your Electoral Registration Officer (ERO).",
    actionText: "Apply Online via Form 6",
    link: "https://voters.eci.gov.in/"
  },
  {
    id: "verify",
    title: "3. Verify Electoral Roll",
    icon: CheckCircle2,
    content: "Having a Voter ID (EPIC) is not enough. Your name MUST be on the electoral roll. Check your status online before election day.",
    actionText: "Search Your Name in Roll",
    link: "https://electoralsearch.eci.gov.in/"
  },
  {
    id: "poll",
    title: "4. Find Polling Booth",
    icon: MapPin,
    content: "Your polling booth is assigned based on your address. You can find your exact booth location and Part Number online or via the Voter Helpline App.",
    actionText: "Locate Booth",
    link: "https://electoralsearch.eci.gov.in/"
  }
];

export default function VoterGuide() {
  const [activeStep, setActiveStep] = useState(steps[0].id);

  return (
    <section id="guide" className="py-20 bg-[#112240]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">Step-by-Step Voter Guide</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Follow this simple guide to ensure you are ready for election day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center justify-between border ${
                    isActive 
                      ? 'bg-[#138808]/10 border-[#138808] text-white' 
                      : 'bg-[#0A192F] border-white/10 text-gray-400 hover:border-white/30 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-[#138808]' : ''}`} />
                    <span className="font-medium">{step.title}</span>
                  </div>
                  <ChevronRight className={`h-5 w-5 transition-transform ${isActive ? 'rotate-90 text-[#138808]' : ''}`} />
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-2">
            <div className="glass-panel rounded-2xl p-8 min-h-[300px] flex flex-col relative overflow-hidden">
              {steps.map((step) => {
                const isActive = activeStep === step.id;
                const Icon = step.icon;
                
                if (!isActive) return null;

                return (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                  >
                    <Icon className="h-12 w-12 text-[#FF9933] mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-1">
                      {step.content}
                    </p>
                    
                    <a 
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#138808] hover:bg-[#138808]/80 text-white px-6 py-3 rounded-lg font-medium transition-colors w-fit"
                    >
                      {step.actionText}
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
