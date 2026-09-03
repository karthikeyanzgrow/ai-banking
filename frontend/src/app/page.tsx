"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Users, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Z-Grow <span className="text-blue-400">Capital</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">Corporate Banking</span>
          <span className="hover:text-white cursor-pointer transition-colors">Wealth Management</span>
          <span className="hover:text-white cursor-pointer transition-colors">AI Risk Engines</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4" />
          Powered by Gemini AI Infrastructure
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight"
        >
          The Future of <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Intelligent Banking</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-16 leading-relaxed"
        >
          Experience zero-latency onboarding and predictive risk management. Choose your secure operating environment below to begin.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
          {/* Client Portal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/client/apply" className="group block h-full bg-[#111111] border border-white/10 rounded-3xl p-8 hover:bg-[#151515] hover:border-blue-500/50 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Users className="w-7 h-7 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Corporate Onboarding</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Submit corporate documents for automated, instantaneous verification through our AI document intelligence engine.
              </p>
              <div className="flex items-center text-blue-400 font-semibold group-hover:gap-3 transition-all">
                Enter Secure Portal <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </Link>
          </motion.div>

          {/* Staff Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link href="/staff/applications" className="group block h-full bg-[#111111] border border-white/10 rounded-3xl p-8 hover:bg-[#151515] hover:border-indigo-500/50 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-7 h-7 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Operations Desk</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Review corporate applications analyzed and pre-scored by Gemini AI. Manage the onboarding queue.
              </p>
              <div className="flex items-center text-indigo-400 font-semibold group-hover:gap-3 transition-all">
                Access Workspace <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
