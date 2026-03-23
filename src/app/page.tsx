import Link from "next/link";

const features = [
  {
    icon: "𝕏",
    label: "X Profile Scan",
    title: "Your posts reveal your talent",
    desc: "We analyze your X activity to extract real skills, strengths, and professional identity — without a single form to fill.",
    color: "#6366f1",
  },
  {
    icon: "🎯",
    label: "Company Intelligence",
    title: "Know exactly what they want",
    desc: "Enter any company's X handle. We read their posts and understand their culture, stack, and hiring criteria in seconds.",
    color: "#8b5cf6",
  },
  {
    icon: "🤖",
    label: "AI Skill Matching",
    title: "Match made by Llama 3.3",
    desc: "Groq AI cross-references your profile with what the company needs, highlighting the strongest alignment — like a recruiter in your corner.",
    color: "#06b6d4",
  },
  {
    icon: "✏️",
    label: "Review & Edit",
    title: "You're always in control",
    desc: "Before generation, review every detail. Add your real education, fix your name, set your email. Your CV, your truth.",
    color: "#10b981",
  },
  {
    icon: "📄",
    label: "3 Pro Templates",
    title: "Modern, Professional, or Minimal",
    desc: "Choose from three ATS-friendly templates. Download as PDF with one click — ready to send to any employer.",
    color: "#f59e0b",
  },
  {
    icon: "⚡",
    label: "Under 5 Minutes",
    title: "Fast enough for any deadline",
    desc: "From zero to a tailored, employer-ready CV in under 5 minutes. Perfect for quick pivots and last-minute applications.",
    color: "#ef4444",
  },
];

const steps = [
  {
    n: "01",
    title: "Share your X handle",
    desc: "Connect your X profile or type your skills manually. We instantly detect your professional strengths.",
    icon: "𝕏",
  },
  {
    n: "02",
    title: "Add the target company",
    desc: "Drop the company's X handle or paste the job description. We decode exactly what they're after.",
    icon: "🏢",
  },
  {
    n: "03",
    title: "Pick your role",
    desc: "AI suggests best-fit roles based on your profile. Pick one or type your own custom role.",
    icon: "🎯",
  },
  {
    n: "04",
    title: "Review & confirm your details",
    desc: "Add your real contact info and education. No fabricated data on your final CV — ever.",
    icon: "✅",
  },
  {
    n: "05",
    title: "Download your CV",
    desc: "Preview your ATS-optimized CV, choose a template, and download as a clean PDF instantly.",
    icon: "📥",
  },
];

const stats = [
  { value: "< 5 min", label: "Average build time" },
  { value: "100%", label: "Completely free" },
  { value: "3", label: "Premium templates" },
  { value: "ATS", label: "Optimized output" },
];

export default function Home() {
  return (
    <main className="landing">
      {/* ── NAV ── */}
      <nav className="landing-nav">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="logo-mark">CV</div>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>
              CVBuilder
              <span style={{ color: "var(--accent)", fontWeight: 400, fontSize: 13, marginLeft: 6 }}>AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" style={{ color: "var(--text-muted)", fontSize: 14, textDecoration: "none" }}>Features</a>
            <a href="#how" style={{ color: "var(--text-muted)", fontSize: 14, textDecoration: "none" }}>How it works</a>
            <Link href="/builder" className="btn btn-primary btn-sm">
              Build for free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="landing-hero container">
        <div className="hero-eyebrow">
          <span>✦</span>
          <span>AI-Powered · X-Connected · Free Forever</span>
        </div>

        <h1 className="hero-title">
          Get your dream job<br />
          with a CV that&apos;s{" "}
          <span className="gradient-text">actually tailored</span>
        </h1>

        <p className="hero-subtitle">
          Connect your X profile. Point us at the company. Groq AI writes your
          entire CV — matched to the role, optimized for ATS, ready in 5 minutes.
        </p>

        <div className="hero-cta-group">
          <Link href="/builder" className="btn btn-primary btn-lg animate-pulse-glow">
            Build My CV — It&apos;s Free →
          </Link>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
            No account. No credit card. Just results.
          </span>
        </div>

        {/* Stats strip */}
        <div className="stats-strip">
          {stats.map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-features" id="features">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="section-eyebrow">Everything you need</p>
            <h2 className="section-title">
              Built for the{" "}
              <span className="gradient-text">active job hunter</span>
            </h2>
            <p className="section-sub">No more rewriting your CV from scratch for every application.</p>
          </div>

          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card card-hover">
                <div className="feature-icon-wrap" style={{ background: `${f.color}18`, border: `1px solid ${f.color}40` }}>
                  <span style={{ fontSize: 20 }}>{f.icon}</span>
                </div>
                <div className="feature-label">{f.label}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-steps" id="how">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="section-eyebrow">The process</p>
            <h2 className="section-title">
              Five steps to{" "}
              <span className="gradient-text">your next role</span>
            </h2>
          </div>

          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={s.n} className="step-card">
                <div className="step-connector" style={{ opacity: i < steps.length - 1 ? 1 : 0 }} />
                <div className="step-badge">{s.icon}</div>
                <div className="step-number">{s.n}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="landing-cta">
        <div className="container">
          <div className="cta-card">
            <div className="cta-glow" />
            <p className="section-eyebrow" style={{ marginBottom: 16 }}>Start now — it&apos;s free</p>
            <h2 className="cta-title">
              Your next opportunity<br />is waiting.
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 17, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
              Stop sending generic CVs. Build one that speaks directly to the
              company you want — in under 5 minutes.
            </p>
            <Link href="/builder" className="btn btn-primary btn-lg animate-pulse-glow">
              Build My CV Now — Free →
            </Link>
            <div style={{ marginTop: 20, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              {["✓ No sign-up required", "✓ ATS-optimized output", "✓ PDF download included"].map(t => (
                <span key={t} style={{ color: "var(--text-muted)", fontSize: 13 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="flex items-center gap-3">
              <div className="logo-mark" style={{ width: 28, height: 28, fontSize: 11 }}>CV</div>
              <span style={{ fontWeight: 700, fontSize: 15 }}>CVBuilder AI</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Built by{" "}
              <a href="https://x.com/leukocyteng1" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--accent-light)", textDecoration: "none", fontWeight: 500 }}>
                Leukocyte
              </a>
              {" "}|| All Rights Reserved {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
