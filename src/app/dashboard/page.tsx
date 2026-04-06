"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Coins, LogOut, ArrowLeft, RefreshCw, LayoutDashboard, Database, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { BuyCreditsModal } from "@/components/BuyCreditsModal";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);

  useEffect(() => {
    console.log("Dashboard Session status:", status);
    if (status === "authenticated") {
      if (session?.user) {
        setLoading(false);
        fetchCredits();
      }
    } else if (status === "unauthenticated") {
      // Only redirect if we are sure the user isn't authenticated
      console.warn("Unauthenticated on dashboard, redirecting to home...");
      router.replace("/");
    }
  }, [status, session]);

  const fetchCredits = async () => {
    try {
      const res = await fetch("/api/credits");
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="loading-overlay" style={{ minHeight: "100vh" }}>
        <RefreshCw className="spinner spinner-lg" />
      </div>
    );
  }

  const isAdmin = session?.user?.email === "leukocyteng@gmail.com";

  return (
    <div className="landing" style={{ minHeight: "100vh" }}>
      {showBuyModal && <BuyCreditsModal onClose={() => setShowBuyModal(false)} onSuccess={fetchCredits} />}
      
      <nav className="landing-nav">
        <div className="container flex items-center justify-between">
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
            <div className="logo-mark" style={{ width: 28, height: 28, fontSize: 11 }}>CV</div>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>CVBuilder</span>
          </Link>
          <div className="flex items-center gap-4">
             {isAdmin && (
               <Link href="/admin" style={{ color: "var(--accent-light)", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                 <Database size={14} /> Admin
               </Link>
             )}
            <button onClick={() => signOut()} className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: 100 }}>
        <div className="card" style={{ maxWidth: 800, margin: "0 auto", padding: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
             {session?.user?.image ? (
               <img src={session.user.image} style={{ width: 80, height: 80, borderRadius: "50%", border: "4px solid var(--accent-dim)" }} />
             ) : (
               <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <UserIcon size={32} />
               </div>
             )}
             <div>
               <h1 style={{ fontSize: 32, fontWeight: 800 }}>Welcome, {session?.user?.name}!</h1>
               <p style={{ color: "var(--text-secondary)" }}>{session?.user?.email}</p>
             </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {/* Credits Card */}
            <div className="card" style={{ background: "var(--accent-dim)", border: "1px solid var(--accent)", padding: 24, borderRadius: 20 }}>
               <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                 <div style={{ background: "var(--accent)", color: "white", padding: 8, borderRadius: 8 }}>
                    <Coins size={20} />
                 </div>
                 <span style={{ fontWeight: 700, fontSize: 18 }}>Your Credit Balance</span>
               </div>
               <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 20 }}>
                 {credits ?? 0} <span style={{ fontSize: 16, fontWeight: 500, color: "var(--text-secondary)" }}>credits</span>
               </div>
               <button onClick={() => setShowBuyModal(true)} className="btn btn-primary w-full">
                 Buy More Credits
               </button>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ padding: 24, borderRadius: 20 }}>
               <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                 <LayoutDashboard size={20} className="text-accent" />
                 <span style={{ fontWeight: 700, fontSize: 18 }}>Quick Actions</span>
               </div>
               <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Link href="/builder" className="btn btn-neutral" style={{ textDecoration: "none", display: "flex", justifyContent: "center" }}>
                    Build New CV
                  </Link>
                  <Link href="/" className="btn btn-ghost" style={{ textDecoration: "none", display: "flex", justifyContent: "center" }}>
                    Back to Home
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
