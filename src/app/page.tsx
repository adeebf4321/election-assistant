import Navbar from "@/components/Navbar";
import Timeline from "@/components/Timeline";
import VoterGuide from "@/components/VoterGuide";
import Assistant from "@/components/Assistant";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#112240] via-[#0A192F] to-[#0A192F] -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
              Official Voter Awareness Guide
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Empowering the <br className="hidden md:block" />
              <span className="heading-gradient">Indian Voter</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-10 leading-relaxed">
              Your comprehensive, secure, and interactive guide to navigating the world's largest democratic process. Understand your rights, register to vote, and stay informed.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#guide" className="bg-[#FF9933] hover:bg-[#e68a2e] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,153,51,0.3)]">
                Start the Guide
              </a>
              <a href="#timeline" className="glass-panel hover:bg-white/10 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all">
                View Timeline
              </a>
            </div>
          </div>
        </section>

        <Timeline />
        <VoterGuide />
        <Assistant />
      </main>

      <Footer />
    </>
  );
}
