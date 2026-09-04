"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, UploadCloud, CheckCircle2, FileText, Loader2, Lock, FileSignature, Building2, Contact, Plane, Landmark, Wallet } from "lucide-react";

function ApplyForm() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  
  const pageTitle = type === 'loan' ? 'Corporate Loan Origination' : 'Business Account Opening';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/applications/upload`, {
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
    <div className="h-screen w-screen bg-[#f8fafc] text-slate-900 font-sans p-4 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background soft blurs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10 flex flex-col h-full justify-center">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/client" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-bold transition-colors bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{pageTitle}</h1>
            <p className="text-sm text-slate-500">Secure AI Document Verification</p>
          </div>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="bg-white/90 backdrop-blur-xl shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden border border-white/50 flex flex-col flex-grow max-h-[85vh]"
        >
          {/* Form Header */}
          <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" /> Document Checklist
            </h2>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-md border border-white/10">
              <Lock className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs font-medium text-slate-200">256-bit Encrypted</span>
            </div>
          </div>

          {/* Form Body - Premium Visual Grid */}
          <div className="flex-grow overflow-hidden bg-slate-50/50 p-4 md:p-6 flex flex-col justify-center">
            <input type="hidden" name="application_type" value={type || 'account'} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Primary Document - Spans both columns */}
              <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm shadow-blue-900/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-blue-100">
                    <FileSignature className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      {type === 'loan' ? 'Loan Application Form' : 'Account Opening Application'}
                    </h3>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <input type="file" name="files" className="w-full md:w-64 text-xs text-slate-600 bg-transparent border-0 outline-none file:mr-3 file:py-1.5 file:px-5 file:rounded-full file:border-0 file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:transition-all cursor-pointer file:shadow-md file:shadow-blue-500/30" required />
                </div>
              </div>

              {/* Secondary Documents Grid */}
              {[
                { label: "Trade License", icon: <Building2 className="w-3.5 h-3.5 text-emerald-500" />, required: true },
                { label: "Emirates ID (Signatory)", icon: <Contact className="w-3.5 h-3.5 text-indigo-500" />, required: true },
                { label: "Passport", icon: <Plane className="w-3.5 h-3.5 text-sky-500" />, required: true },
                { label: "Bank Statements", icon: <Landmark className="w-3.5 h-3.5 text-amber-500" />, required: false },
                { label: "Financials / Salary", icon: <Wallet className="w-3.5 h-3.5 text-rose-500" />, required: false },
                { label: "Board Resolution", icon: <FileText className="w-3.5 h-3.5 text-slate-500" />, required: false }
              ].map((field, idx) => (
                <div key={idx} className="bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md rounded-2xl p-2.5 transition-all flex flex-col justify-between group shadow-sm shadow-slate-200/50">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                        {field.icon}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">{field.label}</span>
                    </div>
                    {field.required ? (
                      <span className="text-[8px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-1 py-0.5 rounded uppercase tracking-wider">Req</span>
                    ) : (
                      <span className="text-[8px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1 py-0.5 rounded uppercase tracking-wider">Opt</span>
                    )}
                  </div>
                  <input type="file" name="files" required={field.required} className="w-full text-[10px] text-slate-400 bg-transparent border-0 outline-none file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:font-semibold file:bg-slate-50 file:text-slate-600 group-hover:file:bg-blue-50 group-hover:file:text-blue-700 file:transition-colors cursor-pointer" />
                </div>
              ))}

            </div>
          </div>

          {/* Form Footer */}
          <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
            <div className="hidden md:flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium">SOC2 Certified Infrastructure</span>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto relative overflow-hidden group bg-slate-900 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-slate-900/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-sm ml-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-400" />
                  Analyzing via AI...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
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

export default function ClientApply() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>}>
      <ApplyForm />
    </Suspense>
  );
}
