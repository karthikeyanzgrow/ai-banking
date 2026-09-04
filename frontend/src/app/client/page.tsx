"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Landmark, ArrowLeft, ArrowRight } from "lucide-react";

export default function ClientPortalOptions() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans p-6 relative">
      
      <div className="absolute top-10 left-10">
        <Link href="/" className="text-slate-400 hover:text-slate-900 flex items-center text-sm font-bold transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Select Service</h1>
        <p className="text-slate-500 text-lg">Please select the type of application you wish to submit today.</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Business Account Opening */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link href="/client/apply?type=account" className="group flex flex-col items-center text-center bg-white border border-slate-200 rounded-3xl p-10 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-all" />
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Building2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Business Account Opening</h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              Open a new corporate checking or savings account with zero-latency AI onboarding.
            </p>
            <div className="mt-auto inline-flex items-center text-emerald-600 font-bold bg-emerald-50 px-6 py-3 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-all">
              Start Application <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>

        {/* Loan Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/client/apply?type=loan" className="group flex flex-col items-center text-center bg-white border border-slate-200 rounded-3xl p-10 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl group-hover:bg-blue-100 transition-all" />
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Landmark className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Corporate Loan Origination</h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              Apply for business financing, credit lines, or commercial real estate loans.
            </p>
            <div className="mt-auto inline-flex items-center text-blue-600 font-bold bg-blue-50 px-6 py-3 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
              Start Procedure <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
