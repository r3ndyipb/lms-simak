"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";

export default function PortalBottomBar() {
  const [activeModal, setActiveModal] = useState<"terms" | "privacy" | "help" | null>(null);

  return (
    <>
      <footer className="portal-bottom-bar" role="contentinfo">
        <div className="blackbox-frame">
          <div className="portal-bottom-bar-inner">
            {/* Left Corner: Copyright ANVIEO */}
            <div className="portal-bottom-left">
              <span>© 2026 ANVIEO Academy. All rights reserved.</span>
            </div>

            {/* Right Corner: Terms & Conditions, Privacy, Help */}
            <div className="portal-bottom-right">
              <button
                type="button"
                className="portal-bottom-link"
                onClick={() => setActiveModal("terms")}
                title="Lihat Ketentuan Layanan"
              >
                Ketentuan Layanan
              </button>
              <span className="portal-bottom-dot" aria-hidden="true">•</span>
              <button
                type="button"
                className="portal-bottom-link"
                onClick={() => setActiveModal("privacy")}
                title="Lihat Kebijakan Privasi"
              >
                Kebijakan Privasi
              </button>
              <span className="portal-bottom-dot" aria-hidden="true">•</span>
              <button
                type="button"
                className="portal-bottom-link"
                onClick={() => setActiveModal("help")}
                title="Pusat Bantuan & Kontak"
              >
                Bantuan &amp; FAQ
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Modal for Terms, Privacy, or Help */}
      {activeModal && (
        <div
          className="blackbox-modal-backdrop"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="blackbox-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "520px" }}
          >
            <button
              type="button"
              className="blackbox-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Tutup"
            >
              ×
            </button>

            {activeModal === "terms" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <FlatIcon type="shield" size={20} color="var(--gold)" />
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", margin: 0, color: "var(--bx-ink-bright)" }}>
                    Ketentuan Layanan &amp; Etika Pembelajaran
                  </h3>
                </div>
                <div style={{ maxHeight: "280px", overflowY: "auto", fontSize: "0.8125rem", color: "var(--bx-prose-ink)", lineHeight: 1.6, paddingRight: "8px" }}>
                  <p style={{ margin: "0 0 10px 0" }}>
                    Selamat datang di <strong>ANVIEO Academy Portal</strong>. Dengan mengakses dan menggunakan platform ini, Anda menyetujui ketentuan berikut:
                  </p>
                  <ul style={{ paddingLeft: "18px", margin: "10px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <li><strong>Integritas Kode:</strong> Setiap tugas akhir dan baris kode praktikum harus merupakan hasil pengerjaan mandiri atau kolaborasi resmi yang diizinkan kurikulum.</li>
                    <li><strong>SLA Evaluasi Reviewer:</strong> Proyek submission Anda akan dinilai langsung oleh tim instruktur berlisensi dalam tenggat 1x24 jam kerja.</li>
                    <li><strong>Kerahasiaan Akun:</strong> Akun portal belajar ini bersifat personal dan tidak boleh dialihkan kepada pihak lain.</li>
                    <li><strong>Hak Cipta Modul:</strong> Materi silabus, diagram arsitektur, dan aset ajar dilindungi hak kekayaan intelektual ANVIEO Academy.</li>
                  </ul>
                </div>
              </>
            )}

            {activeModal === "privacy" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <FlatIcon type="lock" size={20} color="var(--gold)" />
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", margin: 0, color: "var(--bx-ink-bright)" }}>
                    Kebijakan Privasi &amp; Perlindungan Data
                  </h3>
                </div>
                <div style={{ maxHeight: "280px", overflowY: "auto", fontSize: "0.8125rem", color: "var(--bx-prose-ink)", lineHeight: 1.6, paddingRight: "8px" }}>
                  <p style={{ margin: "0 0 10px 0" }}>
                    Kami berkomitmen menjaga keamanan identitas dan integritas rekam jejak akademik Anda:
                  </p>
                  <ul style={{ paddingLeft: "18px", margin: "10px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <li><strong>Enkripsi Kredensial:</strong> Kata sandi dan data autentikasi Anda terlindungi melalui enkripsi modern.</li>
                    <li><strong>Kontak Mahasiswa:</strong> Nomor WhatsApp dan email hanya digunakan untuk notifikasi status verifikasi tugas, nilai, dan penerbitan sertifikat digital terverifikasi.</li>
                    <li><strong>Keamanan Sandbox:</strong> Repositori kode dan pengerjaan kuis siswa dieksekusi dalam kontainer terisolasi yang aman.</li>
                  </ul>
                </div>
              </>
            )}

            {activeModal === "help" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <FlatIcon type="chat" size={20} color="var(--gold)" />
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", margin: 0, color: "var(--bx-ink-bright)" }}>
                    Pusat Bantuan Portal Belajar
                  </h3>
                </div>
                <div style={{ maxHeight: "280px", overflowY: "auto", fontSize: "0.8125rem", color: "var(--bx-prose-ink)", lineHeight: 1.6, paddingRight: "8px" }}>
                  <p style={{ margin: "0 0 10px 0" }}>
                    Mengalami kendala saat masuk ke portal atau memerlukan bantuan verifikasi akun?
                  </p>
                  <div style={{ background: "var(--bx-bg)", padding: "14px", borderRadius: "6px", border: "1px solid var(--bx-border)", marginTop: "10px" }}>
                    <div style={{ fontWeight: 700, color: "var(--bx-ink-bright)", marginBottom: "6px" }}>Helpdesk Akademik ANVIEO</div>
                    <div style={{ color: "var(--bx-prose-ink)", marginBottom: "4px" }}>
                      Email Dukungan: <a href="mailto:support@anvieo.edu" style={{ color: "var(--gold)", fontWeight: 600 }}>support@anvieo.edu</a>
                    </div>
                    <div style={{ color: "var(--bx-prose-ink)", marginBottom: "6px" }}>
                      Hotline WhatsApp: <span style={{ color: "var(--gold)", fontWeight: 600 }}>+62 812-9876-5432</span>
                    </div>
                    <div style={{ color: "var(--bx-muted-soft)", fontSize: "0.75rem" }}>
                      Layanan Operasional: Senin – Jumat (08:00 – 20:00 WIB)
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="button"
              className="portal-submit-btn portal-submit-btn-black"
              onClick={() => setActiveModal(null)}
              style={{ marginTop: "16px" }}
            >
              TUTUP
            </button>
          </div>
        </div>
      )}
    </>
  );
}
