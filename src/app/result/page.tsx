"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CVData, CVTemplate } from "@/types";

function CVModern({ cv }: { cv: CVData }) {
  const pi = (cv as any).personalInfo || {};
  const skills: string[] = (cv as any).skills || [];
  const experience: any[] = (cv as any).experience || [];
  const education: any[] = (cv as any).education || [];
  const highlights: any[] = (cv as any).highlights || [];

  return (
    <div className="cv-modern" id="cv-preview">
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
        <div style={{ marginTop: 16, fontSize: 13, opacity: 0.7 }}>
          𝕏 @{pi.twitterHandle} · Applying for: {cv.targetRole} at {cv.targetCompany}
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
              <div className="cv-section-title">Highlights</div>
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
          <div className="cv-section-title">Experience</div>
          {experience.map((exp: any, i: number) => (
            <div key={i} className="cv-exp-item">
              <h4>{exp.title}</h4>
              <div className="company">{exp.company}</div>
              <div className="period">{exp.period}</div>
              <ul>
                {(exp.bullets || []).map((b: string, j: number) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
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
    <div className="cv-professional" id="cv-preview">
      <div className="cv-professional-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1>{pi.name || "Your Name"}</h1>
            <div className="title">{pi.title || cv.targetRole}</div>
          </div>
          {pi.avatarUrl && (
            <img src={pi.avatarUrl} alt={pi.name} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
          )}
        </div>
        <p className="summary">{pi.summary}</p>
      </div>
      <div className="cv-professional-body">
        <div className="cv-pro-section">
          <div className="cv-pro-section-title">Core Skills</div>
          <div className="cv-pro-skills">
            {skills.map(s => <span key={s} className="cv-pro-skill">{s}</span>)}
          </div>
        </div>

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

        {highlights.length > 0 && (
          <div className="cv-pro-section">
            <div className="cv-pro-section-title">Key Highlights</div>
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

  return (
    <div className="cv-minimal" id="cv-preview">
      <h1>{pi.name || "Your Name"}</h1>
      <div className="title">{pi.title || cv.targetRole} · @{pi.twitterHandle}</div>
      <p className="summary">{pi.summary}</p>

      <div className="cv-minimal-section">
        <div className="cv-minimal-section-title">Skills</div>
        <div className="cv-minimal-skills">
          {skills.map(s => <span key={s} className="cv-minimal-skill">{s}</span>)}
        </div>
      </div>

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
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("cvData");
    const storedTemplate = sessionStorage.getItem("cvTemplate") as CVTemplate;
    if (!stored) { router.push("/builder"); return; }
    setCv(JSON.parse(stored));
    if (storedTemplate) setTemplate(storedTemplate);
  }, [router]);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 100);
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
                <button
                  key={t.id}
                  id={`template-${t.id}`}
                  className={`template-btn ${template === t.id ? "active" : ""}`}
                  onClick={() => setTemplate(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              id="download-pdf-btn"
              className="btn btn-primary"
              onClick={handlePrint}
              disabled={printing}
            >
              {printing ? <><div className="spinner" /> Preparing…</> : "⬇ Download PDF"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleStartOver}>Start Over</button>
          </div>
        </div>

        {/* CV Preview */}
        <div ref={previewRef} className="animate-fadeIn">
          {template === "modern" && <CVModern cv={cv} />}
          {template === "professional" && <CVProfessional cv={cv} />}
          {template === "minimal" && <CVMinimal cv={cv} />}
        </div>

        {/* Bottom actions (mobile) */}
        <div className="print-hide" style={{ maxWidth: 820, margin: "24px auto", padding: "0 16px", display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-primary btn-lg" onClick={handlePrint} disabled={printing} id="download-btn-bottom">
            ⬇ Download PDF
          </button>
          <button className="btn btn-ghost" onClick={handleStartOver}>↩ Build Another</button>
        </div>
      </div>
    </>
  );
}
