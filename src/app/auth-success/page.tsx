"use client";

import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    // Wait a brief moment to ensure cookies/session are saved, then close the popup.
    setTimeout(() => {
      window.close();
    }, 500);
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif" }}>
      <p>Authentication successful. You can close this window.</p>
    </div>
  );
}
