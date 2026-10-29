"use client";

import React, { useState, useEffect } from "react";
import FlatIcon from "./FlatIcon";

const TESTIMONIALS = [
  {
    avatar: "/alumni/alumni_3.jpg",
    name: "Dr. Ir. Hendra Prasetyo, M.T.",
    role: "Direktur Sistem Informasi & BAAK",
    quote:
      "SIMAK mengintegrasikan kurikulum OBE, alokasi reviewer kode, dan pemantauan kelulusan mahasiswa dalam satu ekosistem institusi terpercaya.",
  },
  {
    avatar: "/alumni/alumni_1.jpg",
    name: "Prof. Budi Rahardjo, Ph.D.",
    role: "Master Instructor Cloud Systems",
    quote:
      "Distribusi silabus dan rubrik terstandar memangkas beban administratif pengajar sehingga fokus penuh pada kualitas capaian pembelajaran.",
  },
  {
    avatar: "/alumni/alumni_2.jpg",
    name: "Rian Maulana, S.T.",
    role: "Lead Technical Assessor & Reviewer",
    quote:
      "Review queue dengan SLA 24 jam dan rubrik clean architecture memastikan setiap mahasiswa mendapatkan feedback berbobot level industri.",
  },
];

export default function SimakShowcase() {
  const [activeTestiIndex, setActiveTestiIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestiIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentTesti = TESTIMONIALS[activeTestiIndex];

  return (
    <div className="portal-showcase-clean">
      <div>
        {/* Line Model Eyebrow (Model Garis AUI) */}
        <div className="portal-showcase-line-label">
          <span className="portal-gold-line" aria-hidden="true" />
          <span>PORTAL ADMINISTRASI &amp; REVIEWER TERPADU</span>
        </div>

        {/* Main Display Heading (Fraunces Serif) */}
        <h1 className="portal-showcase-heading">
          Pusat Kendali Akademik, Kurikulum &amp; Evaluasi Tugas
        </h1>

        <p className="portal-showcase-subtext">
          Portal operasional terpadu bagi administrator institusi, biro akademik BAAK, instruktur, dan reviewer kode untuk memantau silabus OBE, antrean penilaian tugas, serta otorisasi hak akses.
        </p>

        {/* High-Impact Feature Highlights */}
        <div className="portal-feature-list">
          <div className="portal-feature-item">
            <div className="portal-feature-icon-box">
              <FlatIcon type="curriculum" size={17} />
            </div>
            <div>
              <div className="portal-feature-title">Master Kelas &amp; Kurikulum OBE</div>
              <div className="portal-feature-desc">
                Tata kelola RPS, alokasi modul SKS, dan silabus terstruktur berstandar industri internasional.
              </div>
            </div>
          </div>

          <div className="portal-feature-item">
            <div className="portal-feature-icon-box">
              <FlatIcon type="code" size={17} />
            </div>
            <div>
              <div className="portal-feature-title">Review Queue &amp; SLA Penilaian &lt; 24 Jam</div>
              <div className="portal-feature-desc">
                Distribusi evaluasi tugas submission mahasiswa dengan rubrik kriteria ganda dan feedback terarah.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Social Proof Strip */}
      <div className="portal-trust-card">
        <div className="portal-testimonial-clean">
          <img
            src={currentTesti.avatar}
            alt={currentTesti.name}
            className="portal-testimonial-avatar"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="portal-testimonial-quote">
              &ldquo;{currentTesti.quote}&rdquo;
            </p>
            <div className="portal-testimonial-author">
              <strong>{currentTesti.name}</strong> · <span>{currentTesti.role}</span>
            </div>
          </div>
        </div>

        {/* Live Institutional Metrics Strip */}
        <div className="portal-stats-row">
          <div className="portal-stat-col">
            <span className="portal-stat-num">3,428+</span>
            <span className="portal-stat-label">Mahasiswa Aktif</span>
          </div>
          <div className="portal-stat-col">
            <span className="portal-stat-num">128+</span>
            <span className="portal-stat-label">Silabus &amp; Modul</span>
          </div>
          <div className="portal-stat-col">
            <span className="portal-stat-num">&lt; 24 Jam</span>
            <span className="portal-stat-label">Rata-rata Review SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
