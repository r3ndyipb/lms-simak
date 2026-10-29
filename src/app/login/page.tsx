import React from "react";
import SimakHeader from "@/components/SimakHeader";
import SimakShowcase from "@/components/SimakShowcase";
import SimakLoginForm from "@/components/SimakLoginForm";
import BlackboxRails from "@/components/BlackboxRails";
import PortalBottomBar from "@/components/PortalBottomBar";

export const metadata = {
  title: "Masuk Portal SIMAK — Sistem Informasi Manajemen Akademik & Reviewer",
  description:
    "Portal terpadu masuk untuk administrator institusi, biro akademik BAAK, dosen instruktur, dan reviewer penilai tugas ANVIEO Academy.",
};

export default function SimakLoginPage() {
  return (
    <div className="portal-page-wrap">
      {/* Top Header in Auth Mode */}
      <SimakHeader currentPage="login" />

      {/* Main Dual-Panel Auth Container */}
      <main className="portal-auth-container">
        <BlackboxRails position="both" />

        <div className="blackbox-frame">
          <div className="portal-auth-grid">
            {/* Left Column: Institutional Authority Showcase */}
            <SimakShowcase />

            {/* Right Column: Staff-Only Login Card (No registration) */}
            <SimakLoginForm />
          </div>
        </div>
      </main>

      {/* Institutional Bottom Bar */}
      <PortalBottomBar />
    </div>
  );
}
