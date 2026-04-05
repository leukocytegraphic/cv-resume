"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Twitter, MapPin, Mail, Phone, Link as LinkIcon, Download, Sparkles, RefreshCw, Lock, Coins, Check, ArrowLeft } from "lucide-react";
import { CVData, CVTemplate } from "@/types";

/* ── CV Templates ──────────────────────────────────────────────────────── */
function CVModern({ cv }: { cv: CVData }) {
  const pi = (cv as any).personalInfo || {};
  const skills: string[] = (cv as any).skills || [];
  const experience: any[] = (cv as any).experience || [];
  const education: any[] = (cv as any).education || [];
  const highlights: any[] = (cv as any).highlights || [];

  return (
    <div className="cv-modern" id="cv-preview" style={{ position: "relative" }}>
      <div className="cv-modern-header">
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
          {pi.avatarUrl && (
            <img src={pi.avatarUrl} alt={pi.name} style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.3)", objectFit: "cover" }} />
          )}
          <div>
            <h1>{pi.name || "Your Name"}</h1>
            <div className="title">{pi.title || cv.targetRole}</div>
          </div>
        </div>
        <p className="summary">{pi.summary}</p>
        <div style={{ marginTop: 16, fontSize: 12, opacity: 0.7, display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          {pi.email && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Mail size={12} /> {pi.email}</span>}
          {pi.phone && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Phone size={12} /> {pi.phone}</span>}
          {pi.location && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {pi.location}</span>}
          {pi.website && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><LinkIcon size={12} /> {pi.website}</span>}
          {pi.twitterHandle && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Twitter size={12} /> @{pi.twitterHandle}</span>}
        </div>
      </div>

      <div className="cv-modern-body">
        <div className="cv-modern-sidebar">
          <div className="cv-section-title">Skills</div>
          <div style={{ marginBottom: 24 }}>
            {skills.map(s => <span key={s} className="cv-skill-tag">{s}</span>)}
          </div>

          {highlights.length > 0 && (
            <>
              <div className="cv-section-title">Key Achievements</div>
              {highlights.map((h: any, i: number) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>{h.title}</div>
                  <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.6 }}>{h.description}</div>
                </div>
              ))}
            </>
          )}

          {education.length > 0 && (
            <>
              <div className="cv-section-title" style={{ marginTop: 8 }}>Education</div>
              {education.map((e: any, i: number) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{e.degree}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{e.school} · {e.year}</div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="cv-modern-main">
          {experience.length > 0 && (
            <>
              <div className="cv-section-title">Experience</div>
              {experience.map((exp: any, i: number) => (
                <div key={i} className="cv-exp-item">
                  <h4>{exp.title}</h4>
                  <div className="company">{exp.company}</div>
                  <div className="period">{exp.period}</div>
                  <ul>{(exp.bullets || []).map((b: string, j: number) => <li key={j}>{b}</li>)}</ul>
                </div>
              ))}
            </>
          )}
          {experience.length === 0 && (
            <div style={{ color: "#9ca3af", fontSize: 13, fontStyle: "italic", padding: "16px 0" }}>
              Add your work experience to enrich this section.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CVProfessional({ cv }: { cv: CVData }) {
  const pi = (cv as any).personalInfo || {};
  const skills: string[] = (cv as any).skills || [];
  const experience: any[] = (cv as any).experience || [];
  const education: any[] = (cv as any).education || [];
  const highlights: any[] = (cv as any).highlights || [];

  return (
    <div className="cv-professional" id="cv-preview" style={{ position: "relative" }}>
      <div className="cv-professional-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1>{pi.name || "Your Name"}</h1>
            <div className="title">{pi.title || cv.targetRole}</div>
          </div>
          {pi.avatarUrl && <img src={pi.avatarUrl} alt={pi.name} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />}
        </div>
        <p className="summary">{pi.summary}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12, fontSize: 12, color: "#6b7280", alignItems: "center" }}>
          {pi.email && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Mail size={12} /> {pi.email}</span>}
          {pi.phone && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Phone size={12} /> {pi.phone}</span>}
          {pi.location && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {pi.location}</span>}
          {pi.website && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><LinkIcon size={12} /> {pi.website}</span>}
        </div>
      </div>
      <div className="cv-professional-body">
        <div className="cv-pro-section">
          <div className="cv-pro-section-title">Core Skills</div>
          <div className="cv-pro-skills">{skills.map(s => <span key={s} className="cv-pro-skill">{s}</span>)}</div>
        </div>

        {experience.length > 0 && (
          <div className="cv-pro-section">
            <div className="cv-pro-section-title">Professional Experience</div>
            {experience.map((exp: any, i: number) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#1e1e1e", fontSize: 15 }}>{exp.title}</div>
                    <div style={{ color: "#1e40af", fontSize: 13, fontWeight: 500 }}>{exp.company}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>{exp.period}</div>
                </div>
                <ul style={{ paddingLeft: 18, marginTop: 8 }}>
                  {(exp.bullets || []).map((b: string, j: number) => (
                    <li key={j} style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 4 }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {highlights.length > 0 && (
          <div className="cv-pro-section">
            <div className="cv-pro-section-title">Key Achievements</div>
            {highlights.map((h: any, i: number) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: "#1e1e1e" }}>{h.title}: </span>
                <span style={{ fontSize: 13, color: "#374151" }}>{h.description}</span>
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div className="cv-pro-section">
            <div className="cv-pro-section-title">Education</div>
            {education.map((e: any, i: number) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1e1e1e" }}>{e.degree}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{e.school}</div>
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{e.year}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CVMinimal({ cv }: { cv: CVData }) {
  const pi = (cv as any).personalInfo || {};
  const skills: string[] = (cv as any).skills || [];
  const experience: any[] = (cv as any).experience || [];
  const education: any[] = (cv as any).education || [];
  const highlights: any[] = (cv as any).highlights || [];

  return (
    <div className="cv-minimal" id="cv-preview" style={{ position: "relative" }}>
      <h1>{pi.name || "Your Name"}</h1>
      <div className="title">{pi.title || cv.targetRole}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6, marginBottom: 16, fontSize: 12, color: "#9ca3af", alignItems: "center" }}>
        {pi.email && <span>{pi.email}</span>}
        {pi.phone && <span>{pi.phone}</span>}
        {pi.location && <span>{pi.location}</span>}
        {pi.website && <span>{pi.website}</span>}
      </div>
      <p className="summary">{pi.summary}</p>

      <div className="cv-minimal-section">
        <div className="cv-minimal-section-title">Skills</div>
        <div className="cv-minimal-skills">{skills.map(s => <span key={s} className="cv-minimal-skill">{s}</span>)}</div>
      </div>

      {highlights.length > 0 && (
        <div className="cv-minimal-section">
          <div className="cv-minimal-section-title">Achievements</div>
          {highlights.map((h: any, i: number) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{h.title}: </span>
              <span style={{ fontSize: 13, color: "#374151" }}>{h.description}</span>
            </div>
          ))}
        </div>
      )}

      {experience.length > 0 && (
        <div className="cv-minimal-section">
          <div className="cv-minimal-section-title">Experience</div>
          {experience.map((exp: any, i: number) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{exp.title}</span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>{exp.period}</span>
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>{exp.company}</div>
              <ul style={{ paddingLeft: 16 }}>
                {(exp.bullets || []).map((b: string, j: number) => (
                  <li key={j} style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 3 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="cv-minimal-section">
          <div className="cv-minimal-section-title">Education</div>
          {education.map((e: any, i: number) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 14, color: "#111" }}>{e.degree} — {e.school}</span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{e.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Buy Credits Modal ─────────────────────────────────────────────────────── */
function BuyCreditsModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [amount, setAmount] = useState(20);
  const [loading, setLoading] = useState(false);

  // 1 credit = $0.05
  const price = (amount * 0.05).toFixed(2);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // In a real app we'd call /api/checkout/flutterwave
      // Since we just have basic setup, simulate payment success
      // Mocking for now to avoid complicated Stripe/Flutterwave redirect setup in UI previews
      const res = await fetch("/api/credits/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
      // Check if standard keys are used and link generated
      const data = await res.json();
      if (data.payment_url) {
         window.location.href = data.payment_url;
      } else if (data.fallback) {
         window.location.href = data.mockUrl;
      } else {
         throw new Error("Missing link");
      }
    } catch (err) {
      alert("Error initiating payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: "40px 36px",
        maxWidth: 480, width: "100%",
        boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        textAlign: "center",
      }}>
        <div style={{ display: "inline-flex", background: "var(--accent-dim)", color: "var(--accent-light)", padding: 16, borderRadius: "50%", marginBottom: 16 }}>
          <Coins size={32} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Buy Credits</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          1 Credit = <strong style={{ color: "var(--accent-light)" }}>$0.05</strong>. Downloads cost 5 credits.
        </p>

        <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          {[10, 20, 50, 100].map(val => (
            <button key={val} onClick={() => setAmount(val)} style={{
              padding: "16px", borderRadius: 12,
              border: amount === val ? "2px solid var(--accent)" : "1px solid var(--border)",
              background: amount === val ? "var(--accent-dim)" : "transparent",
              color: amount === val ? "var(--accent)" : "inherit",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              cursor: "pointer", fontSize: 15, fontWeight: 600
            }}>
              <span className="flex items-center gap-2"><Coins size={16} /> {val} Credits</span>
              <span>${(val * 0.05).toFixed(2)}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 999,
            background: "transparent", border: "1px solid var(--border)",
            color: "var(--text-secondary)", fontFamily: "var(--font)", fontSize: 14,
            fontWeight: 600, cursor: "pointer",
          }}>
            Cancel
          </button>
          <button onClick={handleCheckout} disabled={loading} style={{
            flex: 2, padding: "12px", borderRadius: 999,
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "white", fontFamily: "var(--font)", fontSize: 14,
            fontWeight: 700, cursor: "pointer", border: "none",
            boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            {loading ? <RefreshCw className="spinner" size={16} /> : <><Check size={16} /> Pay ${price} with Flutterwave</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────── */
const TEMPLATES: { id: CVTemplate; label: string }[] = [
  { id: "modern", label: "Modern" },
  { id: "professional", label: "Professional" },
  { id: "minimal", label: "Minimal" },
];

export default function ResultPage() {
  const router = useRouter();
  const [cv, setCv] = useState<CVData | null>(null);
  const [template, setTemplate] = useState<CVTemplate>("modern");
  const [printing, setPrinting] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("cvData");
    const storedTemplate = sessionStorage.getItem("cvTemplate") as CVTemplate;
    const isUnlocked = sessionStorage.getItem("cvUnlocked") === "true";
    if (!stored) { router.push("/builder"); return; }
    setCv(JSON.parse(stored));
    if (storedTemplate) setTemplate(storedTemplate);
    if (isUnlocked) setUnlocked(true);

    fetchCredits();
  }, [router]);

  const fetchCredits = async () => {
    try {
      const res = await fetch("/api/credits");
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits);
      } else {
        // Fallback for UI if totally local/no db
        setCredits(10);
      }
    } catch {
      setCredits(10);
    }
  };

  const handleUnlock = async () => {
    if (credits !== null && credits < 5) {
      setShowBuyModal(true);
      return;
    }
    setUnlocking(true);
    try {
      // Simulate deducting API
      const res = await fetch("/api/credits/deduct", { method: "POST" });
      if (!res.ok) {
        // Fallback simulation
        if (credits !== null) setCredits(credits - 5);
      } else {
        await fetchCredits();
      }
      
      setUnlocked(true);
      sessionStorage.setItem("cvUnlocked", "true");
    } catch {
      alert("Failed to unlock.");
    } finally {
      setUnlocking(false);
    }
  };

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => { window.print(); setPrinting(false); }, 100);
  };

  const handleStartOver = () => {
    sessionStorage.removeItem("cvData");
    sessionStorage.removeItem("cvTemplate");
    sessionStorage.removeItem("cvUnlocked");
    router.push("/builder");
  };

  if (!cv) {
    return (
      <div className="loading-overlay" style={{ minHeight: "100vh" }}>
        <div className="spinner spinner-lg" />
        <p style={{ color: "var(--text-secondary)" }}>Loading your CV…</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          .result-toolbar, .print-hide { display: none !important; }
          body { background: white !important; }
          .cv-modern, .cv-professional, .cv-minimal { 
            box-shadow: none !important; 
            margin: 0 !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            filter: none !important;
          }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      {showBuyModal && <BuyCreditsModal onClose={() => setShowBuyModal(false)} onSuccess={() => {
        setShowBuyModal(false);
        fetchCredits();
      }} />}

      <div className="result-page">
        {/* Toolbar */}
        <div className="result-toolbar print-hide">
          <div className="flex items-center gap-3">
            <Link href="/" style={{ color: "var(--text-muted)", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              <ArrowLeft size={14} /> Home
            </Link>
            <span style={{ color: "var(--border)" }}>|</span>
            <span style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
               Your CV is ready <Sparkles size={16} className="text-accent" />
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium flex items-center gap-2" style={{ color: "var(--text-secondary)", marginRight: 8 }}>
              <Coins size={16} className="text-accent" /> {credits !== null ? credits : "..."} Credits
              <button 
                onClick={() => setShowBuyModal(true)} 
                style={{ background: "transparent", border: "1px solid var(--border)", fontSize: 11, padding: "2px 8px", borderRadius: 99, marginLeft: 6, cursor: "pointer" }}
              >
                Buy More
              </button>
            </div>

            <div className="template-switcher">
              {TEMPLATES.map(t => (
                <button key={t.id} id={`template-${t.id}`} className={`template-btn ${template === t.id ? "active" : ""}`} onClick={() => setTemplate(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            {unlocked ? (
              <button id="download-clean-btn" className="btn btn-primary flex items-center gap-2" onClick={handlePrint} disabled={printing}>
                {printing ? <RefreshCw size={16} className="spinner" /> : <Download size={16} />} 
                {printing ? "Preparing…" : "Download PDF"}
              </button>
            ) : (
              <button className="btn btn-primary flex items-center gap-2" onClick={handleUnlock} disabled={unlocking}>
                {unlocking ? <RefreshCw size={16} className="spinner" /> : <Lock size={16} />} Unlock Download (5 Credits)
              </button>
            )}
          </div>
        </div>

        {/* CV Preview */}
        <div style={{ position: "relative", maxWidth: 820, margin: "0 auto" }}>
          <div ref={previewRef} className="animate-fadeIn" style={{
            filter: unlocked ? "none" : "blur(4px)",
            userSelect: unlocked ? "auto" : "none",
            pointerEvents: unlocked ? "auto" : "none",
            opacity: unlocked ? 1 : 0.8,
            transition: "all 0.4s ease"
          }}>
            {template === "modern" && <CVModern cv={cv} />}
            {template === "professional" && <CVProfessional cv={cv} />}
            {template === "minimal" && <CVMinimal cv={cv} />}
          </div>
          
          {/* Paywall Overlay */}
          {!unlocked && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 10,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.4)"
            }}>
              <div style={{ background: "var(--bg-card)", padding: 32, borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,0.1)", textAlign: "center", border: "1px solid var(--border)", maxWidth: 360 }}>
                <Lock size={32} color="var(--accent)" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>High-Quality PDF</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
                  Unlock your professional CV without watermarks. Ready for perfect A4 printing.
                </p>
                <button className="btn btn-primary w-full flex items-center justify-center gap-2" onClick={handleUnlock} disabled={unlocking}>
                  {unlocking ? <RefreshCw size={16} className="spinner" /> : <Lock size={16} />} Unlock (Cost: 5 Credits)
                </button>
                <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
                  Current balance: {credits !== null ? credits : "..."} credits
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="print-hide" style={{ maxWidth: 820, margin: "24px auto", padding: "0 16px", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-ghost flex items-center gap-2" onClick={handleStartOver}>
             Rebuild Another
          </button>
        </div>
      </div>
    </>
  );
}
