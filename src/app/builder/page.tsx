"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BuilderState, UserAnalysis, CompanyAnalysis, CVData } from "@/types";

const STEPS = ["You", "Target", "Role", "Preview"];

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
    if (!state.useXAuth && !state.twitterHandle && !state.manualSkills) {
      update({ error: "Please enter your X handle or your skills to continue." });
      return;
    }
    update({ analyzingUser: true });
    try {
      const body = state.manualSkills
        ? { manual: true, skills: state.manualSkills, areas: state.manualAreas, displayName: state.twitterHandle || "You", handle: state.twitterHandle }
        : { handle: state.twitterHandle };

      const res = await fetch("/api/analyze-user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data: UserAnalysis = await res.json();
      if (!res.ok) throw new Error((data as any).error || "Analysis failed");
      update({ userAnalysis: data, analyzingUser: false, step: 2 });
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
      update({ companyAnalysis: data, analyzingCompany: false, step: 3 });
    } catch (e: any) {
      update({ analyzingCompany: false, error: e.message });
    }
  };

  // ── Step 3: Generate CV ───────────────────────────────────────────────
  const generateCV = async () => {
    const role = state.customRole || state.selectedRole;
    if (!role) { update({ error: "Please select or type a role." }); return; }
    if (!state.userAnalysis || !state.companyAnalysis) return;
    update({ generatingCV: true });
    try {
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAnalysis: state.userAnalysis, companyAnalysis: state.companyAnalysis, selectedRole: role }),
      });
      const data: CVData = await res.json();
      if (!res.ok) throw new Error((data as any).error || "Generation failed");

      // Merge personalInfo with avatar/handle from analysis
      const enriched = {
        ...data,
        personalInfo: {
          ...(data as any).personalInfo,
          twitterHandle: state.userAnalysis.twitterHandle,
          avatarUrl: state.userAnalysis.avatarUrl,
        },
        targetRole: role,
        targetCompany: state.companyAnalysis.companyName,
      };

      // Store in sessionStorage and navigate
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
                <button className={`option-toggle-btn ${!state.manualSkills ? "active" : ""}`} onClick={() => update({ manualSkills: "", manualAreas: "" })}>
                  𝕏 X Profile
                </button>
                <button className={`option-toggle-btn ${state.manualSkills !== undefined && state.useXAuth === false ? "" : ""}`}
                  onClick={() => update({ twitterHandle: "", useXAuth: false })}>
                  ✏️ Manual
                </button>
              </div>

              {/* X Handle input (always useful for display name) */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8, color: "var(--text-secondary)" }}>
                  Your X handle <span style={{ color: "var(--text-muted)" }}>(e.g. @elonmusk)</span>
                </label>
                <input
                  className="input"
                  placeholder="@yourhandle"
                  value={state.twitterHandle}
                  onChange={e => update({ twitterHandle: e.target.value.trim() })}
                />
              </div>

              {/* Manual fields (optional override) */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8, color: "var(--text-secondary)" }}>
                  Your skills <span style={{ color: "var(--text-muted)" }}>(optional — leave blank to scan X)</span>
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
            {/* Analysis result summary */}
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
