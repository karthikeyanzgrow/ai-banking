"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Customer Portal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link href="/client" className="group flex flex-col items-center text-center bg-white border border-slate-200 rounded-3xl p-12 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl group-hover:bg-blue-100 transition-all" />
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Users className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Customer Portal</h2>
            <p className="text-slate-500 leading-relaxed mb-10 text-lg">
              Submit your corporate applications for instant AI verification.
            </p>
            <div className="mt-auto inline-flex items-center text-blue-600 font-bold bg-blue-50 px-6 py-3 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
              Enter Portal <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>

        {/* Staff Portal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/staff/applications" className="group flex flex-col items-center text-center bg-white border border-slate-200 rounded-3xl p-12 hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-all" />
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Staff Portal</h2>
            <p className="text-slate-500 leading-relaxed mb-10 text-lg">
              Review pre-scored AI applications and manage operations.
            </p>
            <div className="mt-auto inline-flex items-center text-indigo-600 font-bold bg-indigo-50 px-6 py-3 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">
              Access Workspace <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
