"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Mail, Save, Send, Eye, RefreshCw, ChevronDown, ChevronUp,
  Monitor, Smartphone, Moon, Sun, Copy, Check, AlertCircle,
  Loader2, Clock, Tag, Zap
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface EmailTemplate {
  id: string;
  template_key: string;
  name: string;
  subject: string;
  body_html: string;
  version: number;
  updated_at: string;
}

type PreviewMode = "desktop" | "mobile" | "dark";

// ── Variable definitions ───────────────────────────────────────────────────
const VARIABLE_GROUPS = [
  {
    label: "Patient Info",
    color: "#018ABE",
    vars: [
      { key: "patientName", description: "Full patient name" },
      { key: "patientEmail", description: "Patient email address" },
      { key: "patientPhone", description: "Patient phone number" },
    ],
  },
  {
    label: "Appointment",
    color: "#22c55e",
    vars: [
      { key: "appointmentId", description: "Booking reference ID" },
      { key: "appointmentDate", description: "Appointment date" },
      { key: "appointmentTime", description: "Appointment time slot" },
    ],
  },
  {
    label: "Clinic Details",
    color: "#f59e0b",
    vars: [
      { key: "clinicName", description: "Clinic full name" },
      { key: "clinicAddress", description: "Clinic address" },
      { key: "clinicPhone", description: "Clinic phone number" },
      { key: "clinicEmail", description: "Clinic email address" },
    ],
  },
];

// ── Sample values for live preview ────────────────────────────────────────
const SAMPLE_VALUES: Record<string, string> = {
  patientName: "Ravi Kumar",
  patientEmail: "ravi@example.com",
  patientPhone: "+91 98765 43210",
  appointmentId: "NHC-2024-0001",
  appointmentDate: "Monday, 30 June 2025",
  appointmentTime: "10:30 AM",
  clinicName: "Narayan Homoeopathic Chikitsalaya",
  clinicAddress: "First street, Neelam cinema crossing 32, Civil Lines, Roorkee",
  clinicPhone: "+91-1332 270021",
  clinicEmail: "homoeopathy4u@gmail.com",
};

function renderWithSamples(text: string) {
  let out = text;
  Object.entries(SAMPLE_VALUES).forEach(([k, v]) => {
    out = out.replace(new RegExp(`{{${k}}}`, "g"), v);
  });
  return out;
}

// ── Sub-components ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    saved: "bg-emerald-100 text-emerald-700",
    saving: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
    idle: "bg-slate-100 text-slate-500",
  };
  const labels: Record<string, string> = {
    saved: "Saved",
    saving: "Saving…",
    error: "Save failed",
    idle: "No changes",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || map.idle}`}>
      {status === "saving" && <Loader2 className="h-3 w-3 animate-spin" />}
      {status === "saved" && <Check className="h-3 w-3" />}
      {status === "error" && <AlertCircle className="h-3 w-3" />}
      {labels[status] || ""}
    </span>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [showPreview, setShowPreview] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [showVariables, setShowVariables] = useState(true);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // ── Fetch templates ────────────────────────────────────────────────────
  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/templates");
      const json = await res.json();
      if (json.success && json.templates?.length) {
        setTemplates(json.templates);
        const first = json.templates[0];
        setSelectedId(first.id);
        setEditSubject(first.subject);
        setEditBody(first.body_html);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTemplates(); }, [loadTemplates]);

  // ── Select a template ─────────────────────────────────────────────────
  const selectTemplate = (t: EmailTemplate) => {
    setSelectedId(t.id);
    setEditSubject(t.subject);
    setEditBody(t.body_html);
    setSaveStatus("idle");
    setTestResult(null);
  };

  // ── Insert variable at cursor ─────────────────────────────────────────
  const insertVariable = (varKey: string) => {
    const tag = `{{${varKey}}}`;
    const ta = bodyRef.current;
    if (!ta) {
      setEditBody((prev) => prev + tag);
      return;
    }
    const start = ta.selectionStart ?? editBody.length;
    const end = ta.selectionEnd ?? editBody.length;
    const newVal = editBody.substring(0, start) + tag + editBody.substring(end);
    setEditBody(newVal);
    // Restore cursor after insertion
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  // ── Copy variable to clipboard ─────────────────────────────────────────
  const copyVar = (varKey: string) => {
    navigator.clipboard.writeText(`{{${varKey}}}`);
    setCopiedVar(varKey);
    setTimeout(() => setCopiedVar(null), 1500);
  };

  // ── Save template ─────────────────────────────────────────────────────
  const saveTemplate = async () => {
    if (!selectedId) return;
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, subject: editSubject, bodyHtml: editBody }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveStatus("saved");
        setTemplates((prev) =>
          prev.map((t) => (t.id === selectedId ? json.template : t))
        );
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  };

  // ── Send test email ────────────────────────────────────────────────────
  const sendTest = async () => {
    if (!testEmail.trim()) return;
    setSendingTest(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/templates/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: editSubject, bodyHtml: editBody, testEmail }),
      });
      const json = await res.json();
      if (json.success) {
        setTestResult({ ok: true, msg: json.message });
      } else {
        setTestResult({ ok: false, msg: json.error || "Failed to send" });
      }
    } catch (e: any) {
      setTestResult({ ok: false, msg: e.message || "Network error" });
    } finally {
      setSendingTest(false);
    }
  };

  const selected = templates.find((t) => t.id === selectedId);

  // ── Preview dimensions ─────────────────────────────────────────────────
  const previewDims: Record<PreviewMode, { w: string; h: string; label: string; bg: string; textColor: string }> = {
    desktop: { w: "100%", h: "500px", label: "Desktop (Gmail)", bg: "#f6f8fa", textColor: "#1e293b" },
    mobile: { w: "375px", h: "667px", label: "Mobile View", bg: "#f6f8fa", textColor: "#1e293b" },
    dark: { w: "100%", h: "500px", label: "Dark Mode", bg: "#1e293b", textColor: "#f1f5f9" },
  };
  const dims = previewDims[previewMode];

  const previewHtml = renderWithSamples(editBody);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#018ABE] mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading email templates…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Email Template Manager</h1>
          <p className="text-sm text-slate-500 mt-1">Edit, preview, and test transactional email templates</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={saveStatus} />
          <button
            onClick={saveTemplate}
            disabled={saveStatus === "saving"}
            className="inline-flex items-center gap-2 bg-[#018ABE] hover:bg-[#0173a0] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
          >
            {saveStatus === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Template
          </button>
        </div>
      </div>

      {/* ── Template selector tabs ────────────────────────────────── */}
      {templates.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTemplate(t)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedId === t.id
                  ? "bg-[#001B4B] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Mail className="h-4 w-4 shrink-0" />
              <span>{t.name}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                selectedId === t.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
              }`}>
                v{t.version}
              </span>
            </button>
          ))}
        </div>
      )}

      {templates.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-amber-800">No templates found in database</p>
          <p className="text-xs text-amber-600 mt-1">Run the <code className="bg-amber-100 px-1 rounded">migrations.sql</code> file in Supabase to seed the default templates.</p>
        </div>
      )}

      {selected && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* ── Left panel: Editor + Variables ──────────────────── */}
          <div className="xl:col-span-3 space-y-5">
            {/* Subject line */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Subject Line</label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => { setEditSubject(e.target.value); setSaveStatus("idle"); }}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#018ABE]/30 focus:border-[#018ABE] transition-all"
                placeholder="Enter email subject…"
              />
              <p className="text-xs text-slate-400">Tip: Variables like <code className="bg-slate-100 px-1 rounded">{"{{appointmentId}}"}</code> work in the subject too.</p>
            </div>

            {/* Variable Helper Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowVariables(!showVariables)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#018ABE]/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-[#018ABE]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">Variable Helper</p>
                    <p className="text-xs text-slate-400">Click to insert at cursor position</p>
                  </div>
                </div>
                {showVariables ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </button>

              {showVariables && (
                <div className="px-6 pb-5 space-y-4 border-t border-slate-100 pt-4">
                  {VARIABLE_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: group.color }}>
                        {group.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.vars.map((v) => (
                          <div key={v.key} className="flex items-center gap-1">
                            <button
                              onClick={() => insertVariable(v.key)}
                              title={`Insert {{${v.key}}} — ${v.description}`}
                              className="flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer"
                              style={{
                                borderColor: `${group.color}40`,
                                backgroundColor: `${group.color}10`,
                                color: group.color,
                              }}
                            >
                              <Tag className="h-3 w-3" />
                              {`{{${v.key}}}`}
                            </button>
                            <button
                              onClick={() => copyVar(v.key)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Copy to clipboard"
                            >
                              {copiedVar === v.key ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* HTML Body Editor */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">HTML Email Body</label>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>v{selected.version} — Last updated {new Date(selected.updated_at).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
              <textarea
                ref={bodyRef}
                value={editBody}
                onChange={(e) => { setEditBody(e.target.value); setSaveStatus("idle"); }}
                rows={22}
                spellCheck={false}
                className="w-full font-mono text-xs border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#018ABE]/30 focus:border-[#018ABE] transition-all resize-y"
                placeholder="<div>Enter HTML email content here…</div>"
              />
            </div>

            {/* Test email sender */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Send className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Send Test Email</p>
                  <p className="text-xs text-slate-400">Sends current template with sample variable values</p>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#018ABE]/30 focus:border-[#018ABE] transition-all"
                />
                <button
                  onClick={sendTest}
                  disabled={sendingTest || !testEmail.trim()}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {sendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send
                </button>
              </div>
              {testResult && (
                <div className={`flex items-start gap-2.5 p-3 rounded-xl text-sm font-medium ${testResult.ok ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  {testResult.ok ? <Check className="h-4 w-4 mt-0.5 shrink-0" /> : <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
                  {testResult.msg}
                </div>
              )}
            </div>
          </div>

          {/* ── Right panel: Live Preview ────────────────────────── */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden sticky top-6">
              {/* Preview toolbar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Live Preview</span>
                </div>
                <div className="flex items-center gap-1">
                  {(["desktop", "mobile", "dark"] as PreviewMode[]).map((mode) => {
                    const icons = { desktop: Monitor, mobile: Smartphone, dark: Moon };
                    const Icon = icons[mode];
                    return (
                      <button
                        key={mode}
                        onClick={() => setPreviewMode(mode)}
                        title={mode.charAt(0).toUpperCase() + mode.slice(1)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          previewMode === mode
                            ? "bg-[#001B4B] text-white"
                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview label badge */}
              <div className="flex items-center justify-center py-2 bg-slate-50 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{dims.label}</span>
              </div>

              {/* Gmail-style chrome for desktop/dark */}
              {previewMode !== "mobile" && (
                <div className={`p-4 ${previewMode === "dark" ? "bg-[#1e293b]" : "bg-[#f6f8fa]"}`}>
                  {/* Fake Gmail top bar */}
                  <div className={`rounded-t-xl px-4 py-2.5 border-b flex items-center gap-3 ${previewMode === "dark" ? "bg-[#0f172a] border-slate-700" : "bg-white border-slate-200"}`}>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className={`flex-1 h-5 rounded-full text-[10px] flex items-center px-3 font-mono ${previewMode === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-400"}`}>
                      {renderWithSamples(editSubject).substring(0, 50)}{renderWithSamples(editSubject).length > 50 ? "…" : ""}
                    </div>
                  </div>
                  {/* Email body canvas */}
                  <div
                    className={`rounded-b-xl overflow-auto border border-t-0 ${previewMode === "dark" ? "border-slate-700" : "border-slate-200"}`}
                    style={{ maxHeight: "480px", backgroundColor: dims.bg }}
                  >
                    <iframe
                      srcDoc={`<html><head><meta charset='utf-8'><style>body{margin:0;padding:16px;font-family:sans-serif;background:${dims.bg};color:${dims.textColor};}*{box-sizing:border-box;}</style></head><body>${previewHtml}</body></html>`}
                      className="w-full"
                      style={{ height: "480px", border: "none" }}
                      title="Email preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              )}

              {/* Mobile frame */}
              {previewMode === "mobile" && (
                <div className="flex justify-center py-5 bg-slate-100">
                  <div className="relative" style={{ width: "320px" }}>
                    {/* Phone shell */}
                    <div className="absolute inset-0 rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl z-10 pointer-events-none" />
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-800 rounded-b-2xl z-20 pointer-events-none" />
                    <iframe
                      srcDoc={`<html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><style>body{margin:0;padding:12px;font-family:sans-serif;background:#f6f8fa;}*{box-sizing:border-box;}</style></head><body>${previewHtml}</body></html>`}
                      className="rounded-[2rem] overflow-hidden"
                      style={{ width: "320px", height: "580px", border: "none" }}
                      title="Mobile email preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              )}

              {/* Preview tip */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 text-center">
                  Preview uses sample values. Actual emails will use real booking data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
