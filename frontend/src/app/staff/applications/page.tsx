"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, FileText, ChevronRight, CheckCircle, Clock, XCircle, RefreshCw, Search, Sparkles } from "lucide-react";

export default function ApplicationsQueue() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/applications")
      .then((res) => res.json())
      .then((data) => {
        setApps(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-800">Z-Grow Ops</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <Link href="/staff/applications" className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" /> AI Queue
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-4 border border-indigo-200">
              <Sparkles className="w-3 h-3" /> Auto-Underwriting Active
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Application Queue</h1>
            <p className="mt-3 text-slate-500 max-w-2xl text-lg">Review corporate applications analyzed and pre-scored by Gemini AI.</p>
          </div>
          
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search APP ID..." className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full md:w-72 transition-all" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          {loading ? (
            <div className="p-24 text-center text-slate-400 flex flex-col items-center">
              <RefreshCw className="h-10 w-10 animate-spin mb-6 text-blue-500" />
              <span className="text-lg font-medium">Fetching intelligence...</span>
            </div>
          ) : apps.length === 0 ? (
            <div className="p-24 text-center text-slate-500 text-lg">The queue is completely clear.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-8 py-5 text-left font-bold text-slate-500 uppercase tracking-widest text-xs">ID</th>
                    <th className="px-8 py-5 text-left font-bold text-slate-500 uppercase tracking-widest text-xs">Type</th>
                    <th className="px-8 py-5 text-left font-bold text-slate-500 uppercase tracking-widest text-xs">AI Recommendation</th>
                    <th className="px-8 py-5 text-left font-bold text-slate-500 uppercase tracking-widest text-xs">Status</th>
                    <th className="px-8 py-5 text-right font-bold text-slate-500 uppercase tracking-widest text-xs">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {apps.map((app: any, idx: number) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * idx }}
                      key={app.id} 
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-6 whitespace-nowrap font-extrabold text-slate-900 text-base">APP-{app.id.toString().padStart(4, '0')}</td>
                      <td className="px-8 py-6 whitespace-nowrap text-slate-600 font-medium capitalize">{app.type.replace('_', ' ')}</td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {app.ai_recommendation === 'approve' && <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"><CheckCircle className="w-4 h-4" /> Approve</span>}
                        {app.ai_recommendation === 'review' && <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"><Clock className="w-4 h-4" /> Review</span>}
                        {app.ai_recommendation === 'reject' && <span className="inline-flex items-center gap-1.5 text-rose-700 font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200"><XCircle className="w-4 h-4" /> Reject</span>}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="text-slate-500 uppercase text-xs font-bold tracking-widest bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">{app.status}</span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right">
                        <Link href={`/staff/applications/${app.id}`} className="inline-flex items-center justify-center bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 font-bold py-2 px-6 rounded-xl transition-colors">
                          Inspect <ChevronRight className="w-4 h-4 ml-2 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
