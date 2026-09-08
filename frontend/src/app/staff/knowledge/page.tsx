"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  BookOpen,
  HelpCircle,
  Copy,
  Check
} from "lucide-react";

interface KBDocument {
  id: number;
  filename: string;
  gemini_file_uri: string;
  uploaded_at: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function formatInline(text: string): React.ReactNode[] {
  // Regex matches:
  // 1. **bold**
  // 2. Citations in parentheses like (UAE Corporate & SME Account Opening SOP, Page 7, Section 05...)
  const regex = /(\*\*[^*]+\*\*|\([^)]*(?:SOP|Guide|Manual|Page|Section|Regulatory|Matrix|Example|Law)[^)]*\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("(") && part.endsWith(")")) {
      return (
        <span 
          key={i} 
          className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md text-[11px] font-semibold mx-1 my-0.5 align-middle shadow-2xs"
        >
          <FileText className="w-3 h-3 text-blue-500 inline" />
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
              <span className="flex-1">{formatInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      currentList.push(trimmed.replace(/^[*•-]\s+/, ""));
    } else {
      flushList();
      elements.push(
        <p key={`p-${lineIdx}`} className="text-xs leading-relaxed text-slate-700 my-2">
          {formatInline(trimmed)}
        </p>
      );
    }
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
}

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<"upload" | "chat">("upload");
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I am your Internal Banking Assistant. You can ask me any policy, compliance, or procedural questions based on the uploaded SOP manuals and regulatory guidelines. I will provide accurate answers with citations."
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [askingAi, setAskingAi] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      const res = await fetch(`${API_BASE}/api/kb/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadStatus("Uploading documents to Gemini AI...");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("uploaded_file", file);

        const res = await fetch(`${API_BASE}/api/kb/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
      }
      setUploadStatus("All documents uploaded and indexed successfully!");
      fetchDocuments();
      setTimeout(() => setUploadStatus(null), 4000);
    } catch (err: any) {
      setUploadStatus(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || askingAi) return;

    const userMessage = inputQuery.trim();
    setInputQuery("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setAskingAi(true);

    try {
      const res = await fetch(`${API_BASE}/api/kb/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "No response received." }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err.message}. Please verify the backend is running and documents are uploaded.` }
      ]);
    } finally {
      setAskingAi(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputQuery(prompt);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/staff/applications" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h1 className="font-bold text-slate-900 text-sm tracking-tight">Staff Knowledge Base & AI Assistant</h1>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "upload" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Documents
              {documents.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                  {documents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "chat" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Ask AI
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col">
        {activeTab === "upload" ? (
          <div className="space-y-6 max-w-4xl mx-auto w-full pt-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Knowledge Base Documents</h2>
              <p className="text-sm text-slate-500 mt-1">
                Upload internal standard operating procedures (SOPs), AML manuals, and credit policies for the AI to reference.
              </p>
            </div>

            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="kb-file-input"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label 
                htmlFor="kb-file-input" 
                className="cursor-pointer flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {uploading ? "Processing and indexing with Gemini AI..." : "Click to select SOP & Regulatory PDFs"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Select one or multiple PDF documents (up to 3 files recommended)</p>
                </div>
              </label>

              {uploadStatus && (
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg bg-blue-50 text-blue-700">
                  <CheckCircle2 className="w-4 h-4" />
                  {uploadStatus}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Active Knowledge Base Documents ({documents.length})
                </h3>
                <button 
                  onClick={fetchDocuments} 
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Refresh list
                </button>
              </div>

              {loadingDocs ? (
                <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading indexed documents...
                </div>
              ) : documents.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No documents uploaded yet. Please upload the 3 SOP & Regulatory PDFs to enable Ask AI.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 mt-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-[10px]">
                          PDF
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{doc.filename}</p>
                          <p className="text-[10px] text-slate-400">
                            Indexed: {new Date(doc.uploaded_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Indexed & Ready
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {documents.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-sm"
                  >
                    Proceed to Ask AI <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-140px)]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-slate-700" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900">Z-Grow Compliance & Operations Assistant</h2>
                  <p className="text-[11px] text-slate-500">Grounded exclusively on your uploaded banking manuals with citations</p>
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                {documents.length} Manuals Attached
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-3xl rounded-2xl p-4 text-xs ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none shadow-sm font-medium"
                        : "bg-white text-slate-800 rounded-bl-none border border-slate-200/80 shadow-xs"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen className="w-3 h-3 text-slate-500" /> Z-Grow Assistant
                          </span>
                          <button
                            onClick={() => handleCopy(msg.content, idx)}
                            className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-[10px]"
                            title="Copy answer"
                          >
                            {copiedIdx === idx ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <FormattedMessage content={msg.content} />
                      </div>
                    ) : (
                      <p className="leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {askingAi && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    Searching manuals and formulating cited response...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-6 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-400 flex items-center gap-1 font-semibold whitespace-nowrap">
                <HelpCircle className="w-3 h-3" /> Suggestions:
              </span>
              <button
                onClick={() => handleSuggestedPrompt("What are the mandatory KYC requirements for corporate account opening?")}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-full px-3 py-1 whitespace-nowrap transition-colors"
              >
                Corporate KYC requirements
              </button>
              <button
                onClick={() => handleSuggestedPrompt("What is the sanctions screening procedure under UAE AML guidelines?")}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-full px-3 py-1 whitespace-nowrap transition-colors"
              >
                UAE AML Sanctions procedure
              </button>
              <button
                onClick={() => handleSuggestedPrompt("What are the required financial documents for a business loan approval?")}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-full px-3 py-1 whitespace-nowrap transition-colors"
              >
                Loan financial documents
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  documents.length === 0 
                    ? "Please upload documents first in the Upload Documents tab..."
                    : "Ask any question about procedures, KYC, AML, or loan requirements..."
                }
                disabled={askingAi || documents.length === 0}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={askingAi || !inputQuery.trim() || documents.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
