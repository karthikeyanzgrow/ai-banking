"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, FileText, ChevronRight, CheckCircle, Clock, XCircle, RefreshCw, Search, Sparkles, Menu, X, Filter, Home, Landmark, Building2 } from "lucide-react";

export default function ApplicationsQueue() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'loan' | 'account'>('home');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/applications`)
      .then((res) => res.json())
      .then((data) => {
        setApps(data);
        setLoading(false);
      });
  }, []);

  const filteredApps = apps.filter((app: any) => {
    if (activeView === 'loan' && app.type === 'loan') return true;
    if (activeView === 'account' && (app.type === 'account_onboarding' || app.type === 'account')) return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="w-full px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="w-px h-6 bg-slate-200 hidden md:block"></div>
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-800">Z Grow AI Banking Solutions</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
          </div>
        </div>
      </nav>

      {/* Hamburger Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[320px] bg-white border-r border-slate-200 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">Navigation</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-1 rounded-md hover:bg-slate-100 text-slate-500"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <button 
                  onClick={() => { setActiveView('home'); setIsMenuOpen(false); }}
                  className={`flex items-center gap-3 w-full text-left p-4 rounded-xl font-bold text-sm transition-colors ${activeView === 'home' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}
                >
                  <Home className="w-4 h-4" /> Home
                </button>
                <button 
                  onClick={() => { setActiveView('account'); setIsMenuOpen(false); }}
                  className={`flex items-center gap-3 w-full text-left p-4 rounded-xl font-bold text-sm transition-colors ${activeView === 'account' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}
                >
                  <Landmark className="w-4 h-4" /> Business Account Opening
                </button>
                <button 
                  onClick={() => { setActiveView('loan'); setIsMenuOpen(false); }}
                  className={`flex items-center gap-3 w-full text-left p-4 rounded-xl font-bold text-sm transition-colors ${activeView === 'loan' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-slate-600 hover:bg-slate-50 border border-transparent'}`}
                >
                  <Building2 className="w-4 h-4" /> Business Loan Applications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeView === 'home' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center pt-12">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight text-center mb-4">Select Application Queue</h1>
            <p className="text-slate-500 text-center mb-16 max-w-xl">Choose a queue below to review applications that have been automatically analyzed and pre-scored by Z-Grow AI.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <button onClick={() => setActiveView('account')} className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 p-10 rounded-3xl text-left transition-all group flex flex-col gap-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Landmark className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Business Account Opening</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">Review KYC profiles, trade licenses, and identity documents for new corporate entities.</p>
                </div>
              </button>

              <button onClick={() => setActiveView('loan')} className="bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 p-10 rounded-3xl text-left transition-all group flex flex-col gap-4">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Business Loan Applications</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">Analyze financial statements, board resolutions, and AI risk assessments for corporate credit.</p>
                </div>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
              <div>
                <button onClick={() => setActiveView('home')} className="text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors mb-4 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 rotate-180" /> Back to Home
                </button>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  {activeView === 'account' ? 'Account Opening Queue' : 'Loan Applications Queue'}
                </h1>
              </div>
              
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search APP ID..." className="bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full md:w-64 transition-all" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-24 text-center text-slate-400 flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 animate-spin mb-4 text-slate-300" />
                  <span className="text-sm font-bold uppercase tracking-widest">Fetching intelligence...</span>
                </div>
              ) : filteredApps.length === 0 ? (
                <div className="p-24 text-center text-slate-500 text-sm font-medium bg-slate-50/50">
                  No applications currently in this queue.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">ID</th>
                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Procedure Type</th>
                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">System Recommendation</th>
                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                        <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApps.map((app: any) => (
                        <tr key={app.id}>
                          <td className="px-6 py-4 whitespace-nowrap font-extrabold text-slate-900 text-sm">APP-{app.id.toString().padStart(4, '0')}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 border border-slate-200 px-2 py-1 rounded">
                              {app.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px] ${app.ai_recommendation === 'approve' ? 'text-emerald-600' : app.ai_recommendation === 'reject' ? 'text-rose-600' : 'text-amber-600'}`}>
                              {app.ai_recommendation === 'approve' && <CheckCircle className="w-3.5 h-3.5" />}
                              {app.ai_recommendation === 'review' && <Clock className="w-3.5 h-3.5" />}
                              {app.ai_recommendation === 'reject' && <XCircle className="w-3.5 h-3.5" />}
                              {app.ai_recommendation}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-slate-400 uppercase text-[9px] font-black tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">{app.status}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Link href={`/staff/applications/${app.id}`} className="inline-flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-1.5 px-4 rounded-lg transition-colors text-xs shadow-sm">
                              Inspect <ChevronRight className="w-3.5 h-3.5 ml-1 text-slate-400" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
