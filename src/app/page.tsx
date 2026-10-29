"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SimakShell from "@/components/SimakShell";

export default function HomePage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("simak_logged_in");
      if (isLoggedIn !== "true") {
        router.replace("/login");
      } else {
        setIsReady(true);
      }
    }
  }, [router]);

  if (!isReady) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bx-bg, #FBF8F1)",
          color: "var(--brand, #0A2E52)",
          gap: "12px",
        }}
      >
        <div className="portal-spinner" style={{ width: "28px", height: "28px" }} />
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "0.95rem",
            fontWeight: "700",
            letterSpacing: "0.02em",
          }}
        >
          Memuat Portal SIMAK...
        </span>
      </div>
    );
  }

  return <SimakShell initialNav="dashboard" />;
}
