"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FlatIcon from "./FlatIcon";
import { DEMO_USERS, saveStoredUser } from "../data/simakMockData";
import { SimakRole, SimakUser } from "../types/simak";

export default function SimakLoginForm() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<SimakRole>("administrator");
  const [identifier, setIdentifier] = useState(DEMO_USERS[0].email);
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Help Modal State
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpTicketSent, setHelpTicketSent] = useState(false);
  const [helpEmail, setHelpEmail] = useState("");
  const [helpMessage, setHelpMessage] = useState("");

  const handleSelectPersona = (user: SimakUser) => {
    setSelectedRole(user.role);
    setIdentifier(user.email);
    setPassword("AnvieoSimak2026!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const targetUser =
      DEMO_USERS.find((u) => u.role === selectedRole) || DEMO_USERS[0];

    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("simak_logged_in", "true");
        saveStoredUser({
          ...targetUser,
          email: identifier.includes("@") ? identifier : targetUser.email,
          nip: !identifier.includes("@") ? identifier : targetUser.nip,
        });
      }

      setIsLoading(false);
      router.push("/");
    }, 450);
  };

  const handleHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHelpTicketSent(true);
    setTimeout(() => {
      setShowHelpModal(false);
      setHelpTicketSent(false);
      setHelpEmail("");
      setHelpMessage("");
    }, 1800);
  };

  return (
    <>
      <div className="portal-card-wrap">
        {/* Navigation Tabs (Masuk - Single tab for staff portal) */}
        <div className="portal-nav-tabs">
          <span className="portal-nav-tab active">
            Masuk Portal SIMAK
          </span>
        </div>

        {/* Main Login Form matching lms-portal */}
        <form onSubmit={handleSubmit} className="portal-form">
          {/* Email / NIP Field */}
          <div className="portal-form-group">
            <label htmlFor="identifier" className="portal-label">
              <span>Email Dinas atau NIP <span style={{ color: "var(--gold)" }}>*</span></span>
            </label>
            <div className="portal-input-wrap">
              <span className="portal-input-icon">
                <FlatIcon type="email" size={17} />
              </span>
              <input
                type="text"
                id="identifier"
                name="identifier"
                autoComplete="username"
                required
                placeholder="nama@anvieo.ac.id atau NIP"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="portal-input"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="portal-form-group">
            <label htmlFor="password" className="portal-label">
              <span>Kata Sandi <span style={{ color: "var(--gold)" }}>*</span></span>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="portal-link-gold"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Bantuan Sandi?
              </button>
            </label>
            <div className="portal-input-wrap">
              <span className="portal-input-icon">
                <FlatIcon type="lock" size={17} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="portal-input"
              />
              <span className="portal-input-addon">
                <button
                  type="button"
                  className="portal-pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  title={showPassword ? "Sembunyikan" : "Tampilkan"}
                >
                  <FlatIcon type={showPassword ? "eye-off" : "eye"} size={17} />
                </button>
              </span>
            </div>
          </div>

          {/* Role Select Field */}
          <div className="portal-form-group">
            <label htmlFor="role-select" className="portal-label">
              <span>Peran Masuk Institusi <span style={{ color: "var(--gold)" }}>*</span></span>
            </label>
            <div className="portal-input-wrap">
              <span className="portal-input-icon">
                <FlatIcon type="shield" size={17} />
              </span>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => {
                  const newRole = e.target.value as SimakRole;
                  setSelectedRole(newRole);
                  const found = DEMO_USERS.find((u) => u.role === newRole);
                  if (found) {
                    setIdentifier(found.email);
                  }
                }}
                className="portal-input"
                style={{ cursor: "pointer", paddingRight: "36px" }}
              >
                <option value="administrator">Administrator (Pusat IT &amp; Tata Kelola)</option>
                <option value="administrasi">Administrasi Akademik (BAAK / Tata Usaha)</option>
                <option value="instruktur">Instruktur / Dosen Pengajar &amp; Penguji</option>
                <option value="reviewer">Reviewer Kode &amp; Technical Assessor</option>
                <option value="koordinator">Koordinator Kurikulum &amp; Kaprodi</option>
              </select>
              <span className="portal-input-addon" style={{ pointerEvents: "none" }}>
                <FlatIcon type="chevron-down" size={15} />
              </span>
            </div>
          </div>

          {/* Options Row (Remember Me) */}
          <div className="portal-form-options">
            <label className="portal-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Ingat sesi di perangkat ini</span>
            </label>
            <span style={{ fontSize: "0.8125rem", color: "var(--bx-muted-soft)" }}>
              Terenkripsi TLS
            </span>
          </div>

          {/* Submit Button (Black) matching lms-portal */}
          <button
            type="submit"
            disabled={isLoading}
            className="portal-submit-btn portal-submit-btn-black"
          >
            {isLoading ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "16px",
                    height: "16px",
                    border: "2px solid #FFFFFF",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite",
                  }}
                />
                <span>MEMVERIFIKASI AKSES...</span>
              </>
            ) : (
              <>
                <span>MASUK KE PORTAL SIMAK</span>
                <FlatIcon type="arrow-right" size={16} color="#FFFFFF" />
              </>
            )}
          </button>
        </form>

        {/* Persona Switcher Divider matching lms-portal */}
        <div className="portal-divider">
          <span>atau pilih persona demo staf</span>
        </div>

        {/* Quick Demo Persona Switcher Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "8px",
          }}
        >
          {DEMO_USERS.slice(0, 4).map((u) => {
            const isSelected = selectedRole === u.role;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSelectPersona(u)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 9px",
                  textAlign: "left",
                  background: isSelected ? "var(--bx-bg-alt)" : "var(--bx-surface)",
                  border: isSelected ? "1.5px solid var(--gold)" : "1px solid var(--bx-border)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                title={`Login sebagai ${u.name}`}
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "var(--ink)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {u.name.split(",")[0]}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--muted)",
                      textTransform: "capitalize",
                    }}
                  >
                    {u.roleTitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Forgot Password / Help Modal matching lms-portal standard */}
      {showHelpModal && (
        <div
          className="blackbox-modal-backdrop"
          onClick={() => {
            setShowHelpModal(false);
            setHelpTicketSent(false);
          }}
        >
          <div
            className="blackbox-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "440px" }}
          >
            <button
              type="button"
              className="blackbox-modal-close"
              onClick={() => {
                setShowHelpModal(false);
                setHelpTicketSent(false);
              }}
              aria-label="Tutup"
            >
              ×
            </button>

            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  margin: "0 auto 12px",
                  background: "rgba(201,150,46,0.12)",
                  border: "1px solid var(--gold)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FlatIcon type="key" size={22} color="var(--gold)" />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.25rem",
                  margin: "0 0 6px",
                  color: "var(--bx-ink-bright)",
                }}
              >
                Bantuan Akun SIMAK
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--bx-muted)", margin: 0 }}>
                Reset sandi staf atau akun terkunci diverifikasi langsung oleh Subbagian Tata Usaha / BAAK.
              </p>
            </div>

            {helpTicketSent ? (
              <div style={{ textAlign: "center", padding: "14px 0" }}>
                <div style={{ color: "#10B981", marginBottom: "8px", display: "flex", justifyContent: "center" }}>
                  <FlatIcon type="check-circle" size={36} color="#10B981" />
                </div>
                <h4 style={{ fontSize: "1rem", color: "var(--bx-ink-bright)", marginBottom: "6px" }}>
                  Tiket Bantuan Terkirim!
                </h4>
                <p style={{ fontSize: "0.875rem", color: "var(--bx-muted)", marginBottom: "16px" }}>
                  Admin BAAK akan memverifikasi dan mengirimkan tautan reset ke email dinas <strong>{helpEmail || identifier}</strong>.
                </p>
                <button
                  type="button"
                  className="portal-submit-btn"
                  onClick={() => {
                    setShowHelpModal(false);
                    setHelpTicketSent(false);
                  }}
                >
                  KEMBALI KE LOGIN
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleHelpSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "14px" }}
              >
                <div className="portal-form-group">
                  <label className="portal-label">Email Dinas atau NIP Terdaftar</label>
                  <input
                    type="text"
                    required
                    placeholder="nama.staf@anvieo.ac.id atau NIP"
                    value={helpEmail || identifier}
                    onChange={(e) => setHelpEmail(e.target.value)}
                    className="portal-input"
                  />
                </div>

                <div className="portal-form-group">
                  <label className="portal-label">Keterangan Singkat</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Lupa kata sandi / akun terkunci..."
                    value={helpMessage}
                    onChange={(e) => setHelpMessage(e.target.value)}
                    className="portal-input"
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  className="portal-submit-btn portal-submit-btn-black"
                >
                  KIRIM PERMINTAAN RESET →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
