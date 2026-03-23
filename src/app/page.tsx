import Link from "next/link";

export default function Home() {
  return (
    <main className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--gradient-hero)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800
            }}>C</div>
            <span style={{ fontWeight: 700, fontSize: 16 }}>CVBuilder</span>
          </div>
          <Link href="/builder" className="btn btn-primary btn-sm">
            Get Started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero container">
        <div className="hero-eyebrow">
          <span>✦</span>
          <span>AI-Powered · X-Connected · Free</span>
        </div>
        <h1 className="hero-title">
          Your CV,{" "}
          <span className="gradient-text">perfectly tailored</span>
          <br />in under 5 minutes.
        </h1>
        <p className="hero-subtitle">
          Connect your X account. Point us at the company you want to join.
          Let AI match your skills to their needs and generate a
          professional, hire-worthy CV instantly.
        </p>
        <div className="flex items-center justify-center gap-4" style={{ flexWrap: "wrap" }}>
          <Link href="/builder" className="btn btn-primary btn-lg">
            Build My CV Free →
          </Link>
          <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
            No sign-up needed · Powered by Groq AI
          </span>
        </div>

        {/* Social proof badges */}
        <div className="flex items-center justify-center gap-3" style={{ marginTop: 48, flexWrap: "wrap" }}>
          {["100% Free", "X-Powered", "PDF Download", "AI-Tailored", "< 5 Minutes"].map(tag => (
            <span key={tag} className="badge badge-neutral">{tag}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <p className="hero-eyebrow" style={{ margin: "0 auto 12px" }}>Features</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Built for the{" "}
              <span className="gradient-text">active job hunter</span>
            </h2>
          </div>

          <div className="features-grid">
            {[
              {
                icon: "𝕏",
                title: "X Profile Analysis",
                desc: "We read your X posts and bio to identify your real skills, strengths, and professional style — no manual input required."
              },
              {
                icon: "🎯",
                title: "Company Intelligence",
                desc: "Point us at any company's X account. We analyze their posts to understand exactly what they're looking for right now."
              },
              {
                icon: "🤖",
                title: "AI Skill Matching",
                desc: "Groq AI (Llama 3.3) matches your skills to the company's needs and suggests the roles you're best fit for."
              },
              {
                icon: "📄",
                title: "PDF Download",
                desc: "Download your tailored CV as a beautiful, ATS-friendly PDF in seconds. Three professional templates to choose from."
              },
              {
                icon: "✏️",
                title: "Manual Override",
                desc: "Prefer to type your own skills? Skip the X scan and enter details manually. Full flexibility, always."
              },
              {
                icon: "⚡",
                title: "Under 5 Minutes",
                desc: "From nothing to a professionally tailored, downloadable CV in less time than it takes to brew coffee."
              }
            ].map(f => (
              <div key={f.title} className="card feature-card card-hover animate-fadeIn">
                <div className="feature-icon" style={{ fontSize: 20 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-steps">
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <p className="hero-eyebrow" style={{ margin: "0 auto 12px" }}>How it works</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Four steps to your{" "}
              <span className="gradient-text">dream job</span>
            </h2>
          </div>

          <div className="steps-list">
            {[
              { n: "1", title: "Connect your X account", desc: "We fetch your posts and analyze your professional presence in seconds." },
              { n: "2", title: "Enter the company's X handle", desc: "Or type a job description manually. We'll figure out what they need." },
              { n: "3", title: "Pick your role", desc: "AI suggests the best-fit roles. Choose one or type your own." },
              { n: "4", title: "Download your CV", desc: "Preview your tailored CV, choose a template, and download as PDF." }
            ].map(s => (
              <div key={s.n} className="step-item">
                <div className="step-number">{s.n}</div>
                <div>
                  <h3 style={{ fontSize: 17, marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="container">
          <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 20 }}>
            Ready to get hired?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 18, marginBottom: 40 }}>
            Your next opportunity is waiting. Build your CV now — it&apos;s free.
          </p>
          <Link href="/builder" className="btn btn-primary btn-lg animate-pulse-glow">
            Start Building Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px 0", textAlign: "center" }}>
        <div className="container">
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Built by <a href="https://x.com/leukocyteng1" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-light)", textDecoration: "none" }}>Leukocyte</a> || All Rights Reserved {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}
