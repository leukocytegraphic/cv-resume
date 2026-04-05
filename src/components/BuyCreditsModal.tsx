"use client";

import { useState } from "react";
import { Coins, RefreshCw, Check } from "lucide-react";

export function BuyCreditsModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [amount, setAmount] = useState(20);
  const [loading, setLoading] = useState(false);

  // 1 credit = $0.05
  const price = (amount * 0.05).toFixed(2);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/credits/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
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
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Coins size={16} /> {val} Credits</span>
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
