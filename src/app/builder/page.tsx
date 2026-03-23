"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BuilderState, UserAnalysis, CompanyAnalysis, ReviewData } from "@/types";

const STEPS = ["You", "Target", "Role", "Review", "Preview"];

const initialState: BuilderState = {
  step: 1,
  useXAuth: false,
  twitterHandle: "",
  manualSkills: "",
  manualAreas: "",
  companyHandle: "",
  manualJobDescription: "",
  useManualCompany: false,
  selectedRole: "",
  customRole: "",
  reviewData: null,
  selectedTemplate: "modern",
  userAnalysis: null,
  companyAnalysis: null,
  cvData: null,
  analyzingUser: false,
  analyzingCompany: false,
  generatingCV: false,
  error: null,
};

export default function BuilderPage() {
  const [state, setState] = useState<BuilderState>(initialState);
  const router = useRouter();

  const update = useCallback((patch: Partial<BuilderState>) => {
    setState(prev => ({ ...prev, ...patch, error: null }));
  }, []);

  // ── Step 1: Analyze user ──────────────────────────────────────────────
  const analyzeUser = async () => {
    if (state.useXAuth && !state.twitterHandle) {
      update({ error: "Please enter your X handle to continue." });
      return;
    }
    if (!state.useXAuth && !state.manualSkills) {
      update({ error: "Please enter your skills to continue." });
      return;
    }
    update({ analyzingUser: true });
    try {
      const body = !state.useXAuth
        ? { manual: true, skills: state.manualSkills, areas: state.manualAreas, displayName: state.twitterHandle || "You", handle: state.twitterHandle }
        : { handle: state.twitterHandle };

      const res = await fetch("/api/analyze-user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data: UserAnalysis = await res.json();
      if (!res.ok) throw new Error((data as any).error || "Analysis failed");

      const safeData = {
        ...data,
        skills: Array.isArray(data.skills) ? data.skills : [],
        domains: Array.isArray(data.domains) ? data.domains : [],
      };
      update({ userAnalysis: safeData, analyzingUser: false, step: 2 });
    } catch (e: any) {
      update({ analyzingUser: false, error: e.message });
    }
  };

  // ── Step 2: Analyze company ───────────────────────────────────────────
  const analyzeCompany = async () => {
    if (!state.useManualCompany && !state.companyHandle) {
      update({ error: "Please enter a company X handle or use manual input." });
      return;
    }
    if (state.useManualCompany && !state.manualJobDescription) {
      update({ error: "Please enter the job description." });
      return;
    }
    update({ analyzingCompany: true });
    try {
      const body = state.useManualCompany
        ? { manual: true, description: state.manualJobDescription, companyName: state.companyHandle || "Target Company" }
        : { handle: state.companyHandle };

      const res = await fetch("/api/analyze-company", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data: CompanyAnalysis = await res.json();
      if (!res.ok) throw new Error((data as any).error || "Analysis failed");

      const safeData = {
        ...data,
        roles: Array.isArray(data.roles) ? data.roles : [],
        requirements: Array.isArray(data.requirements) ? data.requirements : [],
        techStack: Array.isArray(data.techStack) ? data.techStack : [],
        keywords: Array.isArray(data.keywords) ? data.keywords : [],
      };

      update({ companyAnalysis: safeData, analyzingCompany: false, step: 3 });
    } catch (e: any) {
      update({ analyzingCompany: false, error: e.message });
    }
  };

  // ── Step 3 → Step 4: Go to Review ────────────────────────────────────
  const goToReview = () => {
    const role = state.customRole || state.selectedRole;
    if (!role) { update({ error: "Please select or type a role." }); return; }
    if (!state.userAnalysis || !state.companyAnalysis) return;

    // Pre-fill review with what we know from analysis
    const prefilledReview: ReviewData = {
      name: state.userAnalysis.displayName || state.twitterHandle || "",
      title: role,
      summary: state.userAnalysis.summary || "",
      email: "",
      phone: "",
      location: "",
      website: state.userAnalysis.twitterHandle ? `https://x.com/${state.userAnalysis.twitterHandle}` : "",
      education: [{ degree: "", school: "", year: "" }],
    };
    update({ reviewData: prefilledReview, step: 4 });
  };

  // ── Review helpers ────────────────────────────────────────────────────
  const updateReview = (patch: Partial<ReviewData>) => {
    setState(prev => ({
      ...prev,
      reviewData: { ...(prev.reviewData as ReviewData), ...patch },
      error: null,
    }));
  };

  const updateEducation = (idx: number, field: string, value: string) => {
    setState(prev => {
      const edu = [...(prev.reviewData?.education || [])];
      edu[idx] = { ...edu[idx], [field]: value };
      return { ...prev, reviewData: { ...(prev.reviewData as ReviewData), education: edu } };
    });
  };

  const addEducation = () => {
    setState(prev => ({
      ...prev,
      reviewData: {
        ...(prev.reviewData as ReviewData),
        education: [...(prev.reviewData?.education || []), { degree: "", school: "", year: "" }],
      },
    }));
  };

  const removeEducation = (idx: number) => {
    setState(prev => ({
      ...prev,
      reviewData: {
        ...(prev.reviewData as ReviewData),
        education: (prev.reviewData?.education || []).filter((_, i) => i !== idx),
      },
    }));
  };

  // ── Step 5: Generate CV ───────────────────────────────────────────────
  const generateCV = async () => {
    const role = state.customRole || state.selectedRole;
    if (!state.userAnalysis || !state.companyAnalysis || !state.reviewData) return;
    update({ generatingCV: true });
    try {
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnalysis: state.userAnalysis,
          companyAnalysis: state.companyAnalysis,
          selectedRole: role,
          reviewData: state.reviewData,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as any).error || "Generation failed");

      // Merge personalInfo with user-confirmed review data
      const enriched = {
        ...data,
        personalInfo: {
          ...(data.personalInfo || {}),
          name: state.reviewData.name,
          title: state.reviewData.title,
          summary: state.reviewData.summary,
          email: state.reviewData.email,
          phone: state.reviewData.phone,
          location: state.reviewData.location,
          website: state.reviewData.website,
          twitterHandle: state.userAnalysis.twitterHandle,
          avatarUrl: state.userAnalysis.avatarUrl,
        },
        education: state.reviewData.education.filter(e => e.degree || e.school),
        targetRole: role,
        targetCompany: state.companyAnalysis.companyName,
      };

      sessionStorage.setItem("cvData", JSON.stringify(enriched));
      sessionStorage.setItem("cvTemplate", state.selectedTemplate);
      router.push("/result");
    } catch (e: any) {
      update({ generatingCV: false, error: e.message });
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  const progressPct = ((state.step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="builder-page">
      <div className="container-narrow">
        {/* Header */}
        <div className="builder-header">
          <Link href="/" style={{ color: "var(--text-muted)", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            ← Back
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Build your CV</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 6 }}>Answer a few questions and we&apos;ll do the rest.</p>

          {/* Progress bar */}
          <div className="progress-bar-container">
            <div className="progress-steps">
              <div className="progress-steps-fill" style={{ width: `${progressPct}%` }} />
              {STEPS.map((label, i) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div className={`progress-step-dot ${state.step === i + 1 ? "active" : state.step > i + 1 ? "done" : ""}`}>
                    {state.step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 11, color: state.step === i + 1 ? "var(--accent-light)" : "var(--text-muted)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {state.error && (
          <div className="error-msg" style={{ marginBottom: 24 }}>⚠ {state.error}</div>
        )}

        {/* ── STEP 1: Who are you? ── */}
        {state.step === 1 && (
          <div className="step-panel">
            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Tell us about you</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
                We&apos;ll analyze your X profile or you can type your skills manually.
              </p>

              {/* Toggle */}
              <div className="option-toggle" style={{ marginBottom: 24 }}>
                <button className={`option-toggle-btn ${state.useXAuth ? "active" : ""}`} onClick={() => update({ useXAuth: true, error: null })}>
                  𝕏 X Profile
                </button>
                <button className={`option-toggle-btn ${!state.useXAuth ? "active" : ""}`}
                  onClick={() => update({ useXAuth: false, error: null })}>
                  ✏️ Manual
                </button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8, color: "var(--text-secondary)" }}>
                  {state.useXAuth ? "Your X handle" : "Your name or handle"} <span style={{ color: "var(--text-muted)" }}>{state.useXAuth ? "(e.g. @elonmusk)" : ""}</span>
                </label>
                <input
                  className="input"
                  placeholder={state.useXAuth ? "@yourhandle" : "e.g. John Doe"}
                  value={state.twitterHandle}
                  onChange={e => update({ twitterHandle: e.target.value })}
                />
              </div>

              {!state.useXAuth && (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8, color: "var(--text-secondary)" }}>
                      Your skills
                    </label>
                    <textarea
                      className="input"
                      placeholder="e.g. React, TypeScript, smart contract development, technical writing, DeFi..."
                      value={state.manualSkills}
                      onChange={e => update({ manualSkills: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8, color: "var(--text-secondary)" }}>
                      Your professional areas <span style={{ color: "var(--text-muted)" }}>(optional)</span>
                    </label>
                    <input
                      className="input"
                      placeholder="e.g. Web3, frontend development, protocol design..."
                      value={state.manualAreas}
                      onChange={e => update({ manualAreas: e.target.value })}
                    />
                  </div>
                </>
              )}

              <button
                id="analyze-user-btn"
                className="btn btn-primary w-full"
                style={{ padding: "14px" }}
                onClick={analyzeUser}
                disabled={state.analyzingUser}
              >
                {state.analyzingUser ? (
                  <><div className="spinner" /> Analyzing your profile…</>
                ) : (
                  "Analyze & Continue →"
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Target company ── */}
        {state.step === 2 && (
          <div className="step-panel">
            {state.userAnalysis && (
              <div className="analysis-card success" style={{ marginBottom: 24 }}>
                <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
                  {state.userAnalysis.avatarUrl && (
                    <img src={state.userAnalysis.avatarUrl} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 600 }}>{state.userAnalysis.displayName}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>@{state.userAnalysis.twitterHandle} · {state.userAnalysis.experienceLevel} level</div>
                  </div>
                  <span className="badge badge-success" style={{ marginLeft: "auto" }}>✓ Analyzed</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {state.userAnalysis.skills.slice(0, 8).map(s => (
                    <span key={s} className="badge badge-accent">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Where are you applying?</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
                We&apos;ll scan their X to understand what they&apos;re looking for.
              </p>

              <div className="option-toggle" style={{ marginBottom: 24 }}>
                <button className={`option-toggle-btn ${!state.useManualCompany ? "active" : ""}`} onClick={() => update({ useManualCompany: false })}>
                  𝕏 Company X Handle
                </button>
                <button className={`option-toggle-btn ${state.useManualCompany ? "active" : ""}`} onClick={() => update({ useManualCompany: true })}>
                  ✏️ Paste Job Description
                </button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8, color: "var(--text-secondary)" }}>
                  {state.useManualCompany ? "Company name" : "Company X handle"}
                </label>
                <input
                  className="input"
                  placeholder={state.useManualCompany ? "e.g. Miden Protocol" : "@0xmiden"}
                  value={state.companyHandle}
                  onChange={e => update({ companyHandle: e.target.value.trim() })}
                />
              </div>

              {state.useManualCompany && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8, color: "var(--text-secondary)" }}>
                    Job description / requirements
                  </label>
                  <textarea
                    className="input"
                    placeholder="Paste the job description or describe what the company is looking for..."
                    value={state.manualJobDescription}
                    onChange={e => update({ manualJobDescription: e.target.value })}
                    rows={6}
                  />
                </div>
              )}

              <div className="flex gap-3" style={{ marginTop: 28 }}>
                <button className="btn btn-ghost" onClick={() => update({ step: 1 })}>← Back</button>
                <button
                  id="analyze-company-btn"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "14px" }}
                  onClick={analyzeCompany}
                  disabled={state.analyzingCompany}
                >
                  {state.analyzingCompany ? (
                    <><div className="spinner" /> Analyzing company…</>
                  ) : (
                    "Analyze & Continue →"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Role selection ── */}
        {state.step === 3 && (
          <div className="step-panel">
            {state.companyAnalysis && (
              <div className="analysis-card success" style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{state.companyAnalysis.companyName}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>{state.companyAnalysis.culture}</div>
                <div className="flex" style={{ flexWrap: "wrap", gap: 6 }}>
                  {state.companyAnalysis.techStack.slice(0, 6).map(t => (
                    <span key={t} className="badge badge-neutral">{t}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Which role are you going for?</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
                Based on your skills and the company&apos;s needs, we suggest:
              </p>

              <div className="section-label">AI-Suggested Roles</div>
              <div className="role-chips" style={{ marginBottom: 24 }}>
                {(state.companyAnalysis?.roles || []).map(role => (
                  <button
                    key={role}
                    className={`role-chip ${state.selectedRole === role ? "selected" : ""}`}
                    onClick={() => update({ selectedRole: role, customRole: "" })}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="divider" />

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8, color: "var(--text-secondary)" }}>
                  Or type a custom role
                </label>
                <input
                  className="input"
                  placeholder="e.g. Senior Protocol Engineer"
                  value={state.customRole}
                  onChange={e => update({ customRole: e.target.value, selectedRole: "" })}
                />
              </div>

              <div className="flex gap-3">
                <button className="btn btn-ghost" onClick={() => update({ step: 2 })}>← Back</button>
                <button
                  id="go-to-review-btn"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "14px" }}
                  onClick={goToReview}
                >
                  Review my details →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Review & Edit ── */}
        {state.step === 4 && state.reviewData && (
          <div className="step-panel">
            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Review your details</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
                Confirm and correct any information before we generate your CV. Fields marked <span style={{ color: "var(--accent)" }}>*</span> will appear on your CV.
              </p>

              <div style={{ display: "grid", gap: 16 }}>
                {/* Name & Title */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>
                      Full name <span style={{ color: "var(--accent)" }}>*</span>
                    </label>
                    <input className="input" placeholder="Your full name" value={state.reviewData.name} onChange={e => updateReview({ name: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>
                      Job title <span style={{ color: "var(--accent)" }}>*</span>
                    </label>
                    <input className="input" placeholder="e.g. Frontend Developer" value={state.reviewData.title} onChange={e => updateReview({ title: e.target.value })} />
                  </div>
                </div>

                {/* Contact Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>
                      Email <span style={{ color: "var(--accent)" }}>*</span>
                    </label>
                    <input className="input" type="email" placeholder="you@email.com" value={state.reviewData.email} onChange={e => updateReview({ email: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>
                      Phone <span style={{ color: "var(--text-muted)" }}>(optional)</span>
                    </label>
                    <input className="input" placeholder="+1 234 567 8900" value={state.reviewData.phone} onChange={e => updateReview({ phone: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>
                      Location <span style={{ color: "var(--text-muted)" }}>(optional)</span>
                    </label>
                    <input className="input" placeholder="e.g. Lagos, Nigeria" value={state.reviewData.location} onChange={e => updateReview({ location: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>
                      Website / X link <span style={{ color: "var(--text-muted)" }}>(optional)</span>
                    </label>
                    <input className="input" placeholder="https://x.com/yourhandle" value={state.reviewData.website} onChange={e => updateReview({ website: e.target.value })} />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "var(--text-secondary)" }}>
                    Professional summary <span style={{ color: "var(--accent)" }}>*</span>
                  </label>
                  <textarea className="input" rows={4} placeholder="A short blurb about who you are and what you bring to the table..." value={state.reviewData.summary} onChange={e => updateReview({ summary: e.target.value })} />
                </div>

                {/* Education */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Education</label>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: "4px 12px" }} onClick={addEducation}>+ Add</button>
                  </div>
                  {state.reviewData.education.map((edu, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginBottom: 10, alignItems: "end" }}>
                      <input className="input" placeholder="Degree / Certificate" value={edu.degree} onChange={e => updateEducation(idx, "degree", e.target.value)} />
                      <input className="input" placeholder="School / University" value={edu.school} onChange={e => updateEducation(idx, "school", e.target.value)} />
                      <div style={{ display: "flex", gap: 6 }}>
                        <input className="input" placeholder="Year" style={{ width: 80 }} value={edu.year} onChange={e => updateEducation(idx, "year", e.target.value)} />
                        {state.reviewData!.education.length > 1 && (
                          <button className="btn btn-ghost" style={{ padding: "8px 10px", color: "var(--accent)" }} onClick={() => removeEducation(idx)}>✕</button>
                        )}
                      </div>
                    </div>
                  ))}
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                    Leave blank to skip education section on your CV.
                  </p>
                </div>
              </div>

              <div className="flex gap-3" style={{ marginTop: 32 }}>
                <button className="btn btn-ghost" onClick={() => update({ step: 3 })}>← Back</button>
                <button
                  id="generate-cv-btn"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "14px" }}
                  onClick={generateCV}
                  disabled={state.generatingCV}
                >
                  {state.generatingCV ? (
                    <><div className="spinner" /> Generating your CV…</>
                  ) : (
                    "Generate My CV →"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
