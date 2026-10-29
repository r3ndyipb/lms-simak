"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";

type SettingsTab = "profil" | "integrasi" | "email" | "maintenance";

export default function SimakSettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profil");
  const [saved, setSaved] = useState(false);

  // Profil Platform Form State
  const [platformName, setPlatformName] = useState("ANVIEO LMS — Enterprise AI & Tech Learning");
  const [tagline, setTagline] = useState("Platform Edukasi Rekayasa Perangkat Lunak & Sistem Cerdas Modern");
  const [platformUrl, setPlatformUrl] = useState("https://lms.anvieo.ac.id");
  const [supportEmail, setSupportEmail] = useState("support@anvieo.ac.id");
  const [githubUrl, setGithubUrl] = useState("https://github.com/r3ndyipb/anvieo-llm");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/company/anvieo-edu");
  const [youtubeUrl, setYoutubeUrl] = useState("https://youtube.com/@anvieotech");

  // Integrasi Form State
  const [paymentGateway, setPaymentGateway] = useState<"midtrans" | "xendit">("midtrans");
  const [midtransServerKey, setMidtransServerKey] = useState("SB-Mid-server-8849-XK108-prod-sec");
  const [midtransClientKey, setMidtransClientKey] = useState("SB-Mid-client-2993-KL401");
  const [isSandbox, setIsSandbox] = useState(true);

  const [videoProvider, setVideoProvider] = useState<"mux" | "bunny">("mux");
  const [muxTokenId, setMuxTokenId] = useState("mux_token_99182a472910");
  const [muxTokenSecret, setMuxTokenSecret] = useState("••••••••••••••••••••••••");

  const [emailService, setEmailService] = useState<"resend" | "ses">("resend");
  const [resendApiKey, setResendApiKey] = useState("re_8849xk_1082a49281");
  const [senderEmail, setSenderEmail] = useState("notifications@anvieo.ac.id");

  const [s3Bucket, setS3Bucket] = useState("anvieo-lms-assets-prod");
  const [s3Region, setS3Region] = useState("ap-southeast-1 (Jakarta)");

  // Email Template Form State
  const [selectedTemplate, setSelectedTemplate] = useState("welcome");
  const [emailSubject, setEmailSubject] = useState("Selamat Datang di ANVIEO LMS Platform!");
  const [emailBody, setEmailBody] = useState(
    "Halo {{student_name}},\n\nTerima kasih telah bergabung dengan ANVIEO LMS. Akun Anda telah aktif dan Anda siap mengakses ribuan jam materi teknologi terdepan.\n\nSalam,\nTim Akademik ANVIEO"
  );

  // Maintenance State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [announcementText, setAnnouncementText] = useState(
    "🚀 Rilis Modul Baru: Arsitektur Next.js 16 & Server Actions kini telah terpublikasi untuk seluruh siswa aktif!"
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          padding: "14px 18px",
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(10, 46, 82, 0.04)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "0.7rem",
                padding: "2px 8px",
                borderRadius: "4px",
                background: "var(--brand, #0A2E52)",
                color: "#ffffff",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Pengaturan Sistem
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Profil Lembaga, Integrasi Payment &amp; Video CDN
            </span>
          </div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontFamily: "var(--font-heading)",
              margin: "3px 0 1px",
              color: "var(--brand, #0A2E52)",
            }}
          >
            Konfigurasi &amp; Integrasi Platform
          </h2>
        </div>

        <button
          type="button"
          onClick={handleSave}
          style={{
            padding: "8px 18px",
            borderRadius: "6px",
            border: "none",
            background: saved ? "#059669" : "var(--brand, #0A2E52)",
            color: "#ffffff",
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
        >
          {saved ? "Pengaturan Disimpan" : "Simpan Seluruh Konfigurasi"}
        </button>
      </div>

      {saved && (
        <div
          style={{
            padding: "10px 16px",
            background: "#D1FAE5",
            color: "#065F46",
            borderRadius: "6px",
            fontSize: "0.82rem",
            fontWeight: 600,
            border: "1px solid #A7F3D0",
          }}
        >
          Konfigurasi sistem LMS telah berhasil diperbarui dan disinkronkan ke server produksi.
        </div>
      )}

      {/* 4 Tabs Navigation */}
      <div style={{ display: "flex", gap: "6px", background: "var(--bx-bg-alt)", padding: "4px", borderRadius: "8px" }}>
        {[
          { id: "profil", label: "Profil Platform", icon: "company" },
          { id: "integrasi", label: "Integrasi (Payment, Video, S3)", icon: "settings" },
          { id: "email", label: "Template Email", icon: "book" },
          { id: "maintenance", label: "Maintenance & Pengumuman", icon: "shield" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "none",
                background: isActive ? "var(--brand, #0A2E52)" : "transparent",
                color: isActive ? "#ffffff" : "var(--ink)",
                fontWeight: isActive ? 700 : 500,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <FlatIcon type={tab.icon} size={14} color={isActive ? "#ffffff" : "var(--muted)"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <div
        style={{
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
        }}
      >
        {/* ============================================================== */}
        {/* TAB 1: PROFIL PLATFORM */}
        {/* ============================================================== */}
        {activeTab === "profil" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Nama Platform LMS</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>URL Utama Platform</label>
                <input
                  type="text"
                  value={platformUrl}
                  onChange={(e) => setPlatformUrl(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Tagline / Slogan Platform</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Email Layanan / Customer Support</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
              />
            </div>

            <div style={{ paddingTop: "12px", borderTop: "1px solid var(--bx-border)" }}>
              <strong style={{ display: "block", marginBottom: "10px", color: "var(--brand)" }}>Tautan Sosial Media Platform:</strong>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)", marginBottom: "4px" }}>GitHub Repo / Org</label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)", marginBottom: "4px" }}>LinkedIn Page</label>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)", marginBottom: "4px" }}>YouTube Channel</label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: INTEGRASI (PAYMENT, VIDEO, CLOUD) */}
        {/* ============================================================== */}
        {activeTab === "integrasi" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", fontSize: "0.82rem" }}>
            {/* Payment Gateway */}
            <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <strong style={{ color: "var(--brand)", fontSize: "0.9rem" }}>1. Payment Gateway (Midtrans / Xendit)</strong>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.75rem" }}>
                  <input
                    type="checkbox"
                    checked={isSandbox}
                    onChange={(e) => setIsSandbox(e.target.checked)}
                  />
                  <span>Sandbox / Test Mode Active</span>
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Server Key</label>
                  <input
                    type="text"
                    value={midtransServerKey}
                    onChange={(e) => setMidtransServerKey(e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Client Key</label>
                  <input
                    type="text"
                    value={midtransClientKey}
                    onChange={(e) => setMidtransClientKey(e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                  />
                </div>
              </div>
              <div style={{ marginTop: "8px", fontSize: "0.72rem", color: "var(--muted)" }}>
                Webhook URL: <code style={{ color: "var(--brand)" }}>https://api.anvieo.ac.id/v1/payments/webhook</code>
              </div>
            </div>

            {/* Video CDN Provider */}
            <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
              <strong style={{ color: "var(--brand)", fontSize: "0.9rem", display: "block", marginBottom: "10px" }}>
                2. Video Hosting &amp; Streaming CDN (Mux / Bunny.net)
              </strong>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Token ID</label>
                  <input
                    type="text"
                    value={muxTokenId}
                    onChange={(e) => setMuxTokenId(e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Token Secret</label>
                  <input
                    type="password"
                    value={muxTokenSecret}
                    onChange={(e) => setMuxTokenSecret(e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.75rem" }}
                  />
                </div>
              </div>
            </div>

            {/* Email & Cloud Storage */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                <strong style={{ color: "var(--brand)", display: "block", marginBottom: "8px" }}>3. Email Transaksional (Resend)</strong>
                <label style={{ display: "block", fontSize: "0.72rem", marginBottom: "4px" }}>API Key</label>
                <input
                  type="text"
                  value={resendApiKey}
                  onChange={(e) => setResendApiKey(e.target.value)}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontFamily: "var(--font-mono)", fontSize: "0.75rem", marginBottom: "6px" }}
                />
                <label style={{ display: "block", fontSize: "0.72rem", marginBottom: "4px" }}>Sender Email</label>
                <input
                  type="text"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.75rem" }}
                />
              </div>

              <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                <strong style={{ color: "var(--brand)", display: "block", marginBottom: "8px" }}>4. Object Storage (AWS S3)</strong>
                <label style={{ display: "block", fontSize: "0.72rem", marginBottom: "4px" }}>S3 Bucket Name</label>
                <input
                  type="text"
                  value={s3Bucket}
                  onChange={(e) => setS3Bucket(e.target.value)}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.75rem", marginBottom: "6px" }}
                />
                <label style={{ display: "block", fontSize: "0.72rem", marginBottom: "4px" }}>Region</label>
                <input
                  type="text"
                  value={s3Region}
                  onChange={(e) => setS3Region(e.target.value)}
                  style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.75rem" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TEMPLATE EMAIL */}
        {/* ============================================================== */}
        {activeTab === "email" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.82rem" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <label style={{ fontWeight: 700 }}>Pilih Template:</label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  if (e.target.value === "welcome") {
                    setEmailSubject("Selamat Datang di ANVIEO LMS Platform!");
                    setEmailBody("Halo {{student_name}},\n\nTerima kasih telah bergabung dengan ANVIEO LMS. Akun Anda telah aktif dan Anda siap mengakses ribuan jam materi teknologi terdepan.\n\nSalam,\nTim Akademik ANVIEO");
                  } else if (e.target.value === "invoice") {
                    setEmailSubject("Konfirmasi Pembayaran & Invoice #{{order_id}}");
                    setEmailBody("Halo {{student_name}},\n\nPembayaran sebesar {{amount}} untuk kelas '{{course_title}}' telah terverifikasi sukses.\n\nInvoice PDF terlampir.");
                  } else {
                    setEmailSubject("Sertifikat Kelulusan Resmi: {{course_title}}");
                    setEmailBody("Selamat {{student_name}}!\n\nAnda telah dinyatakan lulus dengan skor {{score}}. Sertifikat Anda dapat diverifikasi dengan kode {{cert_code}}.");
                  }
                }}
                style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.8rem" }}
              >
                <option value="welcome">Selamat Datang &amp; Registrasi Akun</option>
                <option value="invoice">Invoice Pembelian Kelas Sukses</option>
                <option value="certificate">Penerbitan Sertifikat Kelulusan</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Subject Email</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Konten Pesan Email (Plain Text / HTML)</label>
              <textarea
                rows={6}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", lineHeight: 1.5 }}
              />
              <span style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "4px", display: "block" }}>
                Variabel yang didukung: <code>{"{{student_name}}"}</code>, <code>{"{{course_title}}"}</code>, <code>{"{{amount}}"}</code>, <code>{"{{order_id}}"}</code>, <code>{"{{cert_code}}"}</code>
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: MAINTENANCE & PENGUMUMAN */}
        {/* ============================================================== */}
        {activeTab === "maintenance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem" }}>
            {/* Maintenance Mode Toggle */}
            <div
              style={{
                padding: "16px",
                background: maintenanceMode ? "#FEE2E2" : "var(--bx-bg-alt)",
                border: `1px solid ${maintenanceMode ? "#FCA5A5" : "var(--bx-border)"}`,
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: maintenanceMode ? "#DC2626" : "var(--brand)", fontSize: "0.95rem" }}>
                  Mode Pemeliharaan (Maintenance Mode)
                </div>
                <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: "2px" }}>
                  Jika diaktifkan, portal publik siswa akan menampilkan halaman pemeliharaan sementara waktu.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  background: maintenanceMode ? "#DC2626" : "#059669",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                {maintenanceMode ? "Matikan Maintenance" : "Aktifkan Maintenance"}
              </button>
            </div>

            {/* Announcement Banner */}
            <div style={{ padding: "16px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <strong style={{ color: "var(--brand)", fontSize: "0.9rem" }}>Pengumuman Banner Global</strong>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.75rem" }}>
                  <input
                    type="checkbox"
                    checked={announcementActive}
                    onChange={(e) => setAnnouncementActive(e.target.checked)}
                  />
                  <span>Tampilkan Banner di Header Siswa</span>
                </label>
              </div>

              <textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
