"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, UploadCloud, CheckCircle2, FileText, Loader2, Lock } from "lucide-react";

export default function ClientApply() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const res = await fetch("http://localhost:8000/api/applications/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to upload. Make sure backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-8 font-sans relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-200/50 rounded-full blur-[120px] pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-2xl shadow-slate-200/50 max-w-lg w-full text-center relative z-10 border border-slate-100"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Documents Secured</h2>
          <p className="text-slate-500 mb-10 text-lg leading-relaxed">
            Your corporate documents have been encrypted and uploaded successfully. Our AI engine is currently verifying the details to expedite your onboarding.
          </p>
          <Link href="/" className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-all w-full text-lg shadow-lg shadow-slate-900/20">
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background soft blurs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col items-center text-center"
        >
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center mb-6 text-sm font-semibold transition-colors bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portal
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Corporate Onboarding</h1>
          <p className="text-lg text-slate-500 max-w-2xl">Upload your compliance documents. Our intelligent systems will parse and verify them instantly.</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit} 
          className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden border border-white/50"
        >
          <div className="bg-slate-900 px-10 py-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-400" /> Document Checklist
              </h2>
              <p className="text-slate-400 text-sm mt-2">All files must be clear, high-resolution PDFs.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10 mt-4 md:mt-0">
              <Lock className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-slate-200">256-bit Encrypted</span>
            </div>
          </div>

          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 bg-gradient-to-b from-white/50 to-slate-50/50">
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">Primary Application</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative flex items-center justify-center w-full bg-white border border-slate-200 rounded-2xl p-2 transition-all">
                  <input type="file" name="files" className="w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl" required />
                </div>
              </div>
            </div>

            {[
              { label: "Trade License", required: true },
              { label: "Emirates ID (Signatory)", required: true },
              { label: "Passport", required: true },
              { label: "Bank Statements (6 Mos)", required: false },
              { label: "Financials / Salary Cert", required: false },
              { label: "Board Resolution", required: false }
            ].map((field, idx) => (
              <div key={idx} className="relative group">
                <label className="flex justify-between items-center text-sm font-bold text-slate-700 mb-2">
                  <span>{field.label}</span>
                  {field.required ? <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">Required</span> : <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">Optional</span>}
                </label>
                <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-1.5 transition-all shadow-sm">
                  <input type="file" name="files" required={field.required} className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 transition-all cursor-pointer" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-10 bg-white border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-slate-500 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 w-full md:w-auto justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium">SOC2 Certified Infrastructure</span>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto relative overflow-hidden group bg-slate-900 text-white font-bold py-4 px-10 rounded-xl shadow-xl shadow-slate-900/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400" />
                  Analyzing via AI...
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5 mr-3 group-hover:-translate-y-1 transition-transform" />
                  Submit for Verification
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
