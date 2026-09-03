"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Briefcase, ArrowLeft, CheckCircle, XCircle, FileSearch, Loader2, FileCheck, FileX, Info, AlertTriangle, Sparkles } from "lucide-react";

export default function ApplicationDetail(props: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(props.params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:8000/api/applications/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch application", err);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  const handleReview = async (action: 'approve' | 'reject') => {
    setActionLoading(true);
    const promise = fetch(`http://localhost:8000/api/applications/${resolvedParams.id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });

    toast.promise(promise, {
      loading: 'Signing decision to ledger...',
      success: `Decision executed: ${action.toUpperCase()}`,
      error: 'Failed to execute decision.'
    });

    await promise;
    router.push('/staff/applications');
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-blue-500" /></div>;
  if (!data || !data.application) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-500 font-bold">Application not found</div>;

  const { application, documents } = data;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      
      {/* Header Navbar */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/staff/applications" className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">APP-{application.id.toString().padStart(4, '0')}</h1>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-widest border ${application.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : application.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                  {application.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium capitalize mt-0.5">{application.type.replace('_', ' ')}</p>
            </div>
          </div>
          
          {application.status === 'pending' && (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleReview('reject')}
                disabled={actionLoading}
                className="bg-white hover:bg-rose-50 text-rose-600 font-bold py-2.5 px-6 rounded-xl border border-rose-200 hover:border-rose-300 shadow-sm transition-all disabled:opacity-50 flex items-center"
              >
                <XCircle className="w-4 h-4 mr-2" /> Decline
              </button>
              <button 
                onClick={() => handleReview('approve')}
                disabled={actionLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Approve
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {/* AI Intelligence Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-8 md:p-12 mb-12 relative overflow-hidden shadow-sm"
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-indigo-900">
            <FileSearch className="w-96 h-96" />
          </div>
          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-xl border border-indigo-200">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-extrabold text-indigo-900 uppercase tracking-widest">AI Intelligence Brief</h2>
            </div>
            
            <p className="text-2xl md:text-3xl text-slate-800 font-medium leading-snug mb-8">
              "{application.ai_summary}"
            </p>
            
            <div className="inline-flex items-center bg-white px-5 py-3 rounded-2xl border border-indigo-100 shadow-sm">
              <span className="text-slate-500 font-bold mr-3 uppercase text-xs tracking-wider">System Recommendation</span>
              <span className={`flex items-center gap-2 font-extrabold uppercase tracking-widest text-sm ${application.ai_recommendation === 'approve' ? 'text-emerald-600' : application.ai_recommendation === 'reject' ? 'text-rose-600' : 'text-amber-600'}`}>
                {application.ai_recommendation === 'approve' && <CheckCircle className="w-5 h-5" />}
                {application.ai_recommendation === 'review' && <AlertTriangle className="w-5 h-5" />}
                {application.ai_recommendation === 'reject' && <XCircle className="w-5 h-5" />}
                {application.ai_recommendation}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Documents Grid */}
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            Verified Artifacts
          </h3>
          <span className="text-slate-500 text-sm font-bold bg-slate-200/50 px-3 py-1 rounded-full">{documents.length} files processed</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc: any, idx: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              key={doc.id} 
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col hover:shadow-lg hover:border-blue-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`p-3 rounded-2xl border ${doc.is_valid ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                  {doc.is_valid ? <FileCheck className="w-7 h-7" /> : <FileX className="w-7 h-7" />}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${doc.is_valid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                  {doc.is_valid ? 'Verified' : 'Flagged'}
                </span>
              </div>
              
              <h4 className="font-bold text-slate-900 text-lg mb-1 truncate" title={doc.filename}>{doc.filename}</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-5 bg-slate-50 self-start px-2 py-1 rounded">{doc.document_type.replace('_', ' ')}</p>
              
              <div className="mt-auto flex flex-col gap-3">
                {doc.validation_notes && (
                  <div className="text-sm text-rose-700 bg-rose-50 p-4 rounded-xl border border-rose-100 leading-relaxed font-medium">
                    <strong className="block text-rose-500 mb-1 font-black text-xs uppercase tracking-widest">AI Note</strong>
                    {doc.validation_notes}
                  </div>
                )}
                
                {doc.extracted_data && doc.extracted_data !== "{}" && (
                  <div className="text-xs bg-slate-50 p-4 rounded-xl font-mono text-slate-600 border border-slate-200 overflow-hidden shadow-inner">
                    {doc.extracted_data}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
}
