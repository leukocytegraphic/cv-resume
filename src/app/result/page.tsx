"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CVData, CVTemplate } from "@/types";

const WALLET = "0xc428758C4d07cc64A879601b0578182872997Cc9";

/* ── Watermark (subtle bottom-corner) ─────────────────────────────────── */
function Watermark() {
  return (
    <div style={{
      position: "absolute",
      bottom: 16,
      right: 18,
      fontSize: 9,
      color: "rgba(120,100,200,0.28)",
      fontWeight: 500,
      letterSpacing: "0.06em",
      userSelect: "none",
      pointerEvents: "none",
      fontFamily: "Inter, sans-serif",
    }}>
      CV Designed by Leukocyte
    </div>
  );
}

/* ── CV Templates ──────────────────────────────────────────────────────── */
function CVModern({ cv, watermark }: { cv: CVData; watermark: boolean }) {
  const pi = (cv as any).personalInfo || {};
  const skills: string[] = (cv as any).skills || [];
  const experience: any[] = (cv as any).experience || [];
  const education: any[] = (cv as any).education || [];
  const highlights: any[] = (cv as any).highlights || [];

  return (
    <div className="cv-modern" id="cv-preview" style={{ position: "relative" }}>
      {watermark && <Watermark />}
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
        <div style={{ marginTop: 16, fontSize: 12, opacity: 0.7, display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {pi.email && <span>✉ {pi.email}</span>}
          {pi.phone && <span>✆ {pi.phone}</span>}
          {pi.location && <span>📍 {pi.location}</span>}
          {pi.website && <span>🔗 {pi.website}</span>}
          {pi.twitterHandle && <span>𝕏 @{pi.twitterHandle}</span>}
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

function CVProfessional({ cv, watermark }: { cv: CVData; watermark: boolean }) {
  const pi = (cv as any).personalInfo || {};
  const skills: string[] = (cv as any).skills || [];
  const experience: any[] = (cv as any).experience || [];
  const education: any[] = (cv as any).education || [];
  const highlights: any[] = (cv as any).highlights || [];

  return (
    <div className="cv-professional" id="cv-preview" style={{ position: "relative" }}>
      {watermark && <Watermark />}
      <div className="cv-professional-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1>{pi.name || "Your Name"}</h1>
            <div className="title">{pi.title || cv.targetRole}</div>
          </div>
          {pi.avatarUrl && <img src={pi.avatarUrl} alt={pi.name} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />}
        </div>
        <p className="summary">{pi.summary}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12, fontSize: 12, color: "#6b7280" }}>
          {pi.email && <span>✉ {pi.email}</span>}
          {pi.phone && <span>✆ {pi.phone}</span>}
          {pi.location && <span>📍 {pi.location}</span>}
          {pi.website && <span>🔗 {pi.website}</span>}
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

function CVMinimal({ cv, watermark }: { cv: CVData; watermark: boolean }) {
  const pi = (cv as any).personalInfo || {};
  const skills: string[] = (cv as any).skills || [];
  const experience: any[] = (cv as any).experience || [];
  const education: any[] = (cv as any).education || [];
  const highlights: any[] = (cv as any).highlights || [];

  return (
    <div className="cv-minimal" id="cv-preview" style={{ position: "relative" }}>
      {watermark && <Watermark />}
      <h1>{pi.name || "Your Name"}</h1>
      <div className="title">{pi.title || cv.targetRole}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6, marginBottom: 16, fontSize: 12, color: "#9ca3af" }}>
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

/* ── Payment Modal ─────────────────────────────────────────────────────── */
function PaymentModal({ onClose, onUnlock }: { onClose: () => void; onUnlock: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyWallet = () => {
    navigator.clipboard.writeText(WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div style={{ fontSize: 40, marginBottom: 16 }}>✨</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Remove Watermark</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          Support the project with a one-time payment of <strong style={{ color: "var(--accent-light)" }}>$2 USD</strong> in ETH or any EVM token.
          After sending, click "I&apos;ve Paid" to unlock your clean download.
        </p>

        {/* Wallet */}
        <div style={{
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "16px 20px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, fontWeight: 600, letterSpacing: "0.06em" }}>ETH WALLET (EVM)</div>
            <div style={{ fontSize: 12, color: "var(--accent-light)", fontFamily: "monospace", wordBreak: "break-all" }}>{WALLET}</div>
          </div>
          <button
            onClick={copyWallet}
            style={{
              padding: "8px 14px", borderRadius: 8,
              background: copied ? "var(--success-dim)" : "var(--accent-dim)",
              color: copied ? "var(--success)" : "var(--accent-light)",
              border: "1px solid", fontFamily: "var(--font)", fontSize: 12,
              fontWeight: 600, cursor: "pointer", flexShrink: 0,
              borderColor: copied ? "rgba(16,185,129,0.3)" : "rgba(124,58,237,0.3)",
            }}
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>

        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 28 }}>
          Send exactly <strong>~$2 USD worth</strong> of ETH, USDC, or any EVM token to the address above.
          Compatible with MetaMask, Coinbase Wallet, Trust Wallet, etc.
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 999,
            background: "transparent", border: "1px solid var(--border)",
            color: "var(--text-secondary)", fontFamily: "var(--font)", fontSize: 14,
            fontWeight: 600, cursor: "pointer",
          }}>
            Cancel
          </button>
          <button onClick={onUnlock} style={{
            flex: 2, padding: "12px", borderRadius: 999,
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "white", fontFamily: "var(--font)", fontSize: 14,
            fontWeight: 700, cursor: "pointer", border: "none",
            boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
          }}>
            ✓ I&apos;ve Paid — Unlock Clean PDF
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
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("cvData");
    const storedTemplate = sessionStorage.getItem("cvTemplate") as CVTemplate;
    const unlocked = sessionStorage.getItem("watermarkUnlocked") === "true";
    if (!stored) { router.push("/builder"); return; }
    setCv(JSON.parse(stored));
    if (storedTemplate) setTemplate(storedTemplate);
    if (unlocked) setWatermarkEnabled(false);
  }, [router]);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => { window.print(); setPrinting(false); }, 100);
  };

  const handleUnlockPaid = () => {
    setWatermarkEnabled(false);
    sessionStorage.setItem("watermarkUnlocked", "true");
    setShowPayModal(false);
    setTimeout(handlePrint, 300);
  };

  const handleStartOver = () => {
    sessionStorage.removeItem("cvData");
    sessionStorage.removeItem("cvTemplate");
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
          }
        }
      `}</style>

      {showPayModal && <PaymentModal onClose={() => setShowPayModal(false)} onUnlock={handleUnlockPaid} />}

      <div className="result-page">
        {/* Toolbar */}
        <div className="result-toolbar print-hide">
          <div className="flex items-center gap-3">
            <Link href="/" style={{ color: "var(--text-muted)", fontSize: 13, textDecoration: "none" }}>← Home</Link>
            <span style={{ color: "var(--border)" }}>|</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Your CV is ready 🎉</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="template-switcher">
              {TEMPLATES.map(t => (
                <button key={t.id} id={`template-${t.id}`} className={`template-btn ${template === t.id ? "active" : ""}`} onClick={() => setTemplate(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Download with watermark (free) */}
            <button id="download-pdf-btn" className="btn btn-ghost" onClick={handlePrint} disabled={printing}>
              {printing ? <><div className="spinner" /> Preparing…</> : "⬇ Download (Free)"}
            </button>

            {/* Download without watermark ($2) */}
            {watermarkEnabled ? (
              <button id="download-clean-btn" className="btn btn-primary" onClick={() => setShowPayModal(true)}>
                ✨ Clean PDF — $2
              </button>
            ) : (
              <button id="download-clean-btn" className="btn btn-primary" onClick={handlePrint} disabled={printing}>
                ⬇ Download Clean PDF
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={handleStartOver}>Rebuild</button>
          </div>
        </div>

        {/* CV Preview */}
        <div ref={previewRef} className="animate-fadeIn">
          {template === "modern" && <CVModern cv={cv} watermark={watermarkEnabled} />}
          {template === "professional" && <CVProfessional cv={cv} watermark={watermarkEnabled} />}
          {template === "minimal" && <CVMinimal cv={cv} watermark={watermarkEnabled} />}
        </div>

        {/* Bottom actions */}
        <div className="print-hide" style={{ maxWidth: 820, margin: "24px auto", padding: "0 16px", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-ghost btn-lg" onClick={handlePrint} disabled={printing} id="download-btn-bottom">
            ⬇ Free Download (with watermark)
          </button>
          {watermarkEnabled && (
            <button className="btn btn-primary btn-lg" onClick={() => setShowPayModal(true)}>
              ✨ Get Clean PDF — $2 once
            </button>
          )}
          <button className="btn btn-ghost" onClick={handleStartOver}>↩ Build Another</button>
        </div>
      </div>
    </>
  );
}
