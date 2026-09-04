"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle, XCircle, Loader2, FileCheck, FileX, AlertTriangle, Sparkles, FileText } from "lucide-react";

export default function ApplicationDetail(props: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(props.params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/applications/${resolvedParams.id}`)
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
    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/applications/${resolvedParams.id}/review`, {
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

  if (loading) return <div className="h-screen w-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>;
  if (!data || !data.application) return <div className="h-screen w-screen bg-slate-50 flex items-center justify-center text-red-500 font-bold">Application not found</div>;

  const { application, documents } = data;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100 text-slate-900 p-4 gap-4">
      
      {/* Top Header Bar */}
      <header className="bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-between px-5 py-3 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/staff/applications" className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">APP-{application.id.toString().padStart(4, '0')}</h1>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${application.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : application.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
              {application.status}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 bg-slate-100 px-2 py-0.5 rounded">
              {application.type.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        {application.status === 'pending' && (
          <div className="flex items-center gap-2">
            <button onClick={() => handleReview('reject')} disabled={actionLoading} className="bg-white hover:bg-rose-50 text-rose-600 font-bold py-1.5 px-4 rounded-lg border border-rose-200 hover:border-rose-300 shadow-sm transition-all disabled:opacity-50 flex items-center text-xs">
              <XCircle className="w-3.5 h-3.5 mr-1.5" /> Decline
            </button>
            <button onClick={() => handleReview('approve')} disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center text-xs border border-emerald-700">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Approve
            </button>
          </div>
        )}
      </header>

      {/* Summary Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shrink-0 flex gap-6 items-center shadow-sm">
        <div className="flex-grow">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Summary</h2>
          <p className="text-xs font-medium text-slate-700 leading-relaxed" title={application.ai_summary}>
            {application.ai_summary}
          </p>
        </div>
        <div className="shrink-0 text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Recommendation</p>
          <div className={`flex items-center justify-end gap-1.5 font-black uppercase tracking-widest text-xs ${application.ai_recommendation === 'approve' ? 'text-emerald-600' : application.ai_recommendation === 'reject' ? 'text-rose-600' : 'text-amber-600'}`}>
            {application.ai_recommendation === 'approve' && <CheckCircle className="w-4 h-4" />}
            {application.ai_recommendation === 'review' && <AlertTriangle className="w-4 h-4" />}
            {application.ai_recommendation === 'reject' && <XCircle className="w-4 h-4" />}
            {application.ai_recommendation}
          </div>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="flex-grow bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
        
        <div className="flex-grow overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-12 text-center">Status</th>
                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-56">Artifact Name</th>
                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-40">Type</th>
                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider min-w-[250px]">Notes</th>
                <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider min-w-[300px]">Extracted Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc: any) => (
                <tr key={doc.id}>
                  <td className="px-5 py-3 align-middle text-center">
                    <div className="flex justify-center">
                      {doc.is_valid ? <FileCheck className="w-4 h-4 text-slate-300" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    </div>
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <div className="font-medium text-slate-900 text-xs truncate max-w-[200px]" title={doc.filename}>
                      {doc.filename}
                    </div>
                  </td>
                  <td className="px-5 py-3 align-middle">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-[9px] font-semibold text-slate-500 uppercase tracking-widest border border-slate-200/60">
                      {doc.document_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3 align-middle">
                    {doc.validation_notes ? (
                      <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed max-w-sm" title={doc.validation_notes}>
                        {doc.validation_notes}
                      </div>
                    ) : (
                      <span className="text-slate-300 text-[11px] font-medium">-</span>
                    )}
                  </td>
                  <td className="px-5 py-3 align-middle">
                    {doc.extracted_data && doc.extracted_data !== "{}" ? (
                      <div className="font-sans text-[10px] line-clamp-2 leading-relaxed max-w-lg flex flex-wrap gap-x-3 gap-y-1">
                        {(() => {
                          try {
                            const data = JSON.parse(doc.extracted_data);
                            return Object.entries(data).map(([key, value]) => (
                              <div key={key} className="inline-block">
                                <span className="font-bold text-slate-700 capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                                <span className="text-slate-500 font-medium">{String(value)}</span>
                              </div>
                            ));
                          } catch (e) {
                            return <span className="text-slate-500 break-all">{doc.extracted_data}</span>;
                          }
                        })()}
                      </div>
                    ) : (
                      <span className="text-slate-300 text-[11px] font-medium">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
