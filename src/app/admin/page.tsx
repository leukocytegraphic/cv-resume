"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RefreshCw, Users, Coins, ArrowLeft, Mail, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.email !== "leukocyteng@gmail.com")) {
      router.push("/");
    } else if (status === "authenticated" && session?.user?.email === "leukocyteng@gmail.com") {
      fetchUsers();
    }
  }, [status]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: "100vh" }}>
        <RefreshCw className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="landing" style={{ minHeight: "100vh" }}>
      <nav className="landing-nav">
        <div className="container flex items-center justify-between">
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
            <div className="logo-mark" style={{ width: 28, height: 28, fontSize: 11 }}>CV</div>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>Admin Dashboard</span>
          </Link>
          <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={14} /> My Dashboard
          </Link>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: 100 }}>
        <div className="card" style={{ padding: 40, borderRadius: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: 16, marginBottom: 40 }}>
            <div style={{ background: "var(--accent-dim)", color: "var(--accent-light)", padding: 12, borderRadius: 12 }}>
               <Users size={32} />
            </div>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800 }}>Platform Users</h1>
              <p style={{ color: "var(--text-secondary)" }}>Total registered: {users.length}</p>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
               <thead>
                 <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                   <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>USER</th>
                   <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>EMAIL</th>
                   <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>CREDITS</th>
                   <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>JOINED</th>
                   <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>X PROFILE</th>
                 </tr>
               </thead>
               <tbody>
                 {users.map(u => (
                   <tr key={u.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f8f9fa"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                     <td style={{ padding: "16px" }}>
                       <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {u.image && <img src={u.image} style={{ width: 32, height: 32, borderRadius: "50%" }} />}
                          <span style={{ fontWeight: 600 }}>{u.name || "Anonymous"}</span>
                       </div>
                     </td>
                     <td style={{ padding: "16px", color: "var(--text-secondary)", fontSize: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Mail size={14} /> {u.email || "No email"}
                        </div>
                     </td>
                     <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: u.credits < 5 ? "var(--accent)" : "inherit" }}>
                          <Coins size={14} /> {u.credits}
                        </div>
                     </td>
                     <td style={{ padding: "16px", color: "var(--text-secondary)", fontSize: 13 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Calendar size={14} /> {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                     </td>
                     <td style={{ padding: "16px" }}>
                        {u.accounts?.[0]?.providerAccountId ? (
                          <a href={`https://x.com/i/user/${u.accounts[0].providerAccountId}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--accent-light)", textDecoration: "none", fontSize: 13 }}>
                            View on X <ExternalLink size={12} />
                          </a>
                        ) : "N/A"}
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
