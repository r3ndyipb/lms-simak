"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { ReviewSubmission, ReviewStatus, LmsStudentPortfolio, LmsIssuedCertificate } from "../types/simak";
import { MOCK_STUDENT_PORTFOLIOS, MOCK_ISSUED_CERTIFICATES } from "../data/simakMockData";

interface SimakReviewQueueViewProps {
  onOpenReviewModal: (submission: ReviewSubmission) => void;
  submissions: ReviewSubmission[];
}

type MainMode = "tugas" | "portofolio" | "sertifikat" | "verifikasi";

export default function SimakReviewQueueView({
  onOpenReviewModal,
  submissions,
}: SimakReviewQueueViewProps) {
  const [mainMode, setMainMode] = useState<MainMode>("tugas");

  // Tab 1: Antrean Tugas State
  const [activeTab, setActiveTab] = useState<"all" | ReviewStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>("all");

  // Tab 2: Portofolio Showcase State
  const [portfolios, setPortfolios] = useState<LmsStudentPortfolio[]>(MOCK_STUDENT_PORTFOLIOS);
  const [portfolioSearch, setPortfolioSearch] = useState("");
  const [portfolioTrackFilter, setPortfolioTrackFilter] = useState("all");
  const [selectedPortfolio, setSelectedPortfolio] = useState<LmsStudentPortfolio | null>(null);
  const [portfolioNotesInput, setPortfolioNotesInput] = useState("");

  // Tab 3 & 4: Sertifikat Terbit & Verifikasi
  const [certificates, setCertificates] = useState<LmsIssuedCertificate[]>(MOCK_ISSUED_CERTIFICATES);
  const [certSearch, setCertSearch] = useState("");
  const [certFilterStatus, setCertFilterStatus] = useState("all");
  const [previewCert, setPreviewCert] = useState<LmsIssuedCertificate | null>(null);

  // Tab 4: Simulator Verifikasi
  const [verifySerialInput, setVerifySerialInput] = useState("");
  const [verifiedResult, setVerifiedResult] = useState<LmsIssuedCertificate | null | "not_found">(null);

  // Handlers for Tab 2
  const handleToggleFeatured = (id: string) => {
    setPortfolios(
      portfolios.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
  };

  const handleToggleVerified = (id: string) => {
    setPortfolios(
      portfolios.map((p) => (p.id === id ? { ...p, isIndustryVerified: !p.isIndustryVerified } : p))
    );
  };

  const handleOpenPortfolioNotes = (p: LmsStudentPortfolio) => {
    setSelectedPortfolio(p);
    setPortfolioNotesInput(p.reviewerNotes || "");
  };

  const handleSavePortfolioNotes = () => {
    if (!selectedPortfolio) return;
    setPortfolios(
      portfolios.map((p) =>
        p.id === selectedPortfolio.id ? { ...p, reviewerNotes: portfolioNotesInput } : p
      )
    );
    setSelectedPortfolio(null);
  };

  const handleDeletePortfolio = (id: string) => {
    if (confirm("Hapus portofolio proyek ini dari showcase publik?")) {
      setPortfolios(portfolios.filter((p) => p.id !== id));
    }
  };

  // Handlers for Tab 3: Sertifikat
  const handleRevokeCertificate = (certId: string) => {
    if (confirm("Peringatan: Revoke akan membatalkan keabsahan sertifikat ini. Lanjutkan?")) {
      setCertificates(
        certificates.map((c) => (c.id === certId ? { ...c, status: "revoked" } : c))
      );
      alert("Sertifikat berhasil di-revoke dan statusnya di halaman verifikasi menjadi TIDAK BERLAKU.");
    }
  };

  const handleRegenerateCertificate = (certId: string) => {
    const freshSerial = `AUI-2026-RE-${Math.floor(100000 + Math.random() * 900000)}`;
    setCertificates(
      certificates.map((c) =>
        c.id === certId
          ? {
              ...c,
              serialNumber: freshSerial,
              status: "aktif",
              verificationUrl: `https://anvieo.ac.id/verify/${freshSerial}`,
              issueDate: "Hari ini, Diterbitkan ulang",
            }
          : c
      )
    );
    alert(`Sertifikat berhasil diterbitkan ulang dengan nomor seri baru: ${freshSerial}`);
  };

  // Handler for Tab 4: Verifikasi
  const handleVerifySerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifySerialInput.trim()) return;
    const match = certificates.find(
      (c) => c.serialNumber.toLowerCase() === verifySerialInput.trim().toLowerCase()
    );
    if (match) {
      setVerifiedResult(match);
    } else {
      setVerifiedResult("not_found");
    }
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (activeTab !== "all" && sub.status !== activeTab) return false;
    if (selectedTrack !== "all" && sub.trackName !== selectedTrack) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.studentName.toLowerCase().includes(q);
      const matchNim = sub.studentNim.toLowerCase().includes(q);
      const matchCode = sub.submissionCode.toLowerCase().includes(q);
      const matchMod = sub.moduleTitle.toLowerCase().includes(q);
      if (!matchName && !matchNim && !matchCode && !matchMod) return false;
    }
    return true;
  });

  // Filter Portfolios
  const filteredPortfolios = portfolios.filter((p) => {
    if (portfolioTrackFilter !== "all" && p.trackName !== portfolioTrackFilter) return false;
    if (!portfolioSearch) return true;
    const q = portfolioSearch.toLowerCase();
    return (
      p.projectTitle.toLowerCase().includes(q) ||
      p.studentName.toLowerCase().includes(q) ||
      p.projectExcerpt.toLowerCase().includes(q)
    );
  });

  // Filter Certificates
  const filteredCertificates = certificates.filter((c) => {
    if (certFilterStatus !== "all" && c.status !== certFilterStatus) return false;
    if (!certSearch) return true;
    const q = certSearch.toLowerCase();
    return (
      c.serialNumber.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q) ||
      c.courseName.toLowerCase().includes(q)
    );
  });

  const countPending = submissions.filter((s) => s.status === "pending").length;
  const countInReview = submissions.filter((s) => s.status === "in_review").length;
  const countApproved = submissions.filter((s) => s.status === "approved").length;
  const countRevision = submissions.filter((s) => s.status === "revision").length;
  const countRejected = submissions.filter((s) => s.status === "rejected").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Top Header & Mode Switcher */}
      <div
        style={{
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "10px",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          boxShadow: "0 1px 3px rgba(10, 46, 82, 0.04)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "2px 8px",
                borderRadius: "4px",
                background: "var(--brand, #0A2E52)",
                color: "#ffffff",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Evaluasi &amp; Akreditasi
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              SLA 48 Jam • Validasi Portofolio • Sertifikat Digital
            </span>
          </div>
          <h2 style={{ fontSize: "1.3rem", fontFamily: "var(--font-heading)", margin: "4px 0 2px", color: "var(--brand)" }}>
            Review Tugas, Portofolio &amp; Sertifikat Terbit
          </h2>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>
            Evaluasi berkas tugas kode, kurasi proyek lulusan untuk industri, kelola sertifikat digital, dan simulator verifikasi publik.
          </p>
        </div>

        {/* 4 Mode Selector Tabs */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              background: "var(--bx-bg-alt, #f4f6f8)",
              padding: "3px",
              borderRadius: "6px",
              border: "1px solid var(--bx-border)",
              gap: "4px",
            }}
          >
            <button
              type="button"
              onClick={() => setMainMode("tugas")}
              style={{
                padding: "6px 12px",
                fontSize: "0.74rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: mainMode === "tugas" ? "var(--brand)" : "transparent",
                color: mainMode === "tugas" ? "#ffffff" : "var(--ink)",
              }}
            >
              Antrean Tugas ({submissions.length})
            </button>
            <button
              type="button"
              onClick={() => setMainMode("portofolio")}
              style={{
                padding: "6px 12px",
                fontSize: "0.74rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: mainMode === "portofolio" ? "var(--brand)" : "transparent",
                color: mainMode === "portofolio" ? "#ffffff" : "var(--ink)",
              }}
            >
              Showcase Siswa ({portfolios.length})
            </button>
            <button
              type="button"
              onClick={() => setMainMode("sertifikat")}
              style={{
                padding: "6px 12px",
                fontSize: "0.74rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: mainMode === "sertifikat" ? "var(--brand)" : "transparent",
                color: mainMode === "sertifikat" ? "#ffffff" : "var(--ink)",
              }}
            >
              Sertifikat Terbit ({certificates.length})
            </button>
            <button
              type="button"
              onClick={() => setMainMode("verifikasi")}
              style={{
                padding: "6px 12px",
                fontSize: "0.74rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: mainMode === "verifikasi" ? "var(--brand)" : "transparent",
                color: mainMode === "verifikasi" ? "#ffffff" : "var(--ink)",
              }}
            >
              Cek Keaslian QR
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: ANTREAN TUGAS */}
      {mainMode === "tugas" && (
        <div
          style={{
            background: "var(--bx-surface)",
            border: "1px solid var(--bx-border)",
            borderRadius: "10px",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Navigation Status Tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              borderBottom: "1px solid var(--bx-border)",
              paddingBottom: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: activeTab === "all" ? "1.5px solid var(--gold)" : "1px solid var(--bx-border)",
                background: activeTab === "all" ? "var(--bx-bg-alt)" : "transparent",
                color: activeTab === "all" ? "var(--brand)" : "var(--muted)",
                fontWeight: activeTab === "all" ? 700 : 600,
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              Semua ({submissions.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: activeTab === "pending" ? "1.5px solid var(--gold)" : "1px solid var(--bx-border)",
                background: activeTab === "pending" ? "var(--bx-bg-alt)" : "transparent",
                color: activeTab === "pending" ? "var(--brand)" : "var(--muted)",
                fontWeight: activeTab === "pending" ? 700 : 600,
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              Menunggu Review ({countPending})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("in_review")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: activeTab === "in_review" ? "1.5px solid var(--gold)" : "1px solid var(--bx-border)",
                background: activeTab === "in_review" ? "var(--bx-bg-alt)" : "transparent",
                color: activeTab === "in_review" ? "var(--brand)" : "var(--muted)",
                fontWeight: activeTab === "in_review" ? 700 : 600,
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              Sedang Dinilai ({countInReview})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("approved")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: activeTab === "approved" ? "1.5px solid var(--gold)" : "1px solid var(--bx-border)",
                background: activeTab === "approved" ? "var(--bx-bg-alt)" : "transparent",
                color: activeTab === "approved" ? "var(--brand)" : "var(--muted)",
                fontWeight: activeTab === "approved" ? 700 : 600,
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              Disetujui ({countApproved})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("revision")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: activeTab === "revision" ? "1.5px solid var(--gold)" : "1px solid var(--bx-border)",
                background: activeTab === "revision" ? "var(--bx-bg-alt)" : "transparent",
                color: activeTab === "revision" ? "var(--brand)" : "var(--muted)",
                fontWeight: activeTab === "revision" ? 700 : 600,
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              Perlu Revisi ({countRevision})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("rejected")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: activeTab === "rejected" ? "1.5px solid #EF4444" : "1px solid var(--bx-border)",
                background: activeTab === "rejected" ? "rgba(239, 68, 68, 0.08)" : "transparent",
                color: activeTab === "rejected" ? "#DC2626" : "var(--muted)",
                fontWeight: activeTab === "rejected" ? 700 : 600,
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              Ditolak ({countRejected})
            </button>
          </div>

          {/* Search & Track Filters */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1, minWidth: "260px" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "340px" }}>
                <input
                  type="text"
                  placeholder="Cari nama mahasiswa, NIM, kode submission..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 34px",
                    borderRadius: "6px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-bg-alt)",
                    color: "var(--ink)",
                    fontSize: "0.84rem",
                    outline: "none",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--muted)",
                    display: "flex",
                  }}
                >
                  <FlatIcon type="search" size={16} />
                </span>
              </div>

              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-bg-alt)",
                  color: "var(--ink)",
                  fontSize: "0.84rem",
                  outline: "none",
                }}
              >
                <option value="all">Semua Peminatan</option>
                <option value="Artificial Intelligence & Autonomous Agent">AI &amp; Autonomous Agent</option>
                <option value="Cloud Infrastructure & DevOps Architect">Cloud &amp; DevOps</option>
                <option value="Fullstack Web & AI Integration">Fullstack &amp; AI</option>
              </select>
            </div>

            <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
              Menampilkan <strong>{filteredSubmissions.length}</strong> submission tugas
            </div>
          </div>

          {/* Submissions Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid var(--bx-border)",
                    fontSize: "0.78rem",
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  <th style={{ padding: "12px 14px" }}>Mahasiswa &amp; NIM</th>
                  <th style={{ padding: "12px 14px" }}>Modul &amp; Kode Tugas</th>
                  <th style={{ padding: "12px 14px" }}>Status &amp; SLA</th>
                  <th style={{ padding: "12px 14px" }}>Reviewer &amp; Waktu</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "var(--muted)" }}>
                      Tidak ada submission yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr
                      key={sub.id}
                      style={{
                        borderBottom: "1px solid var(--bx-border)",
                        transition: "background 0.15s ease",
                      }}
                    >
                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img
                            src={sub.studentAvatar}
                            alt={sub.studentName}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--brand)" }}>
                              {sub.studentName}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                              NIM: {sub.studentNim} • {sub.trackName.split("&")[0]}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px" }}>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--ink)" }}>
                          {sub.moduleTitle}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                          Kode: <code>{sub.submissionCode}</code> • {sub.courseName}
                        </div>
                      </td>

                      <td style={{ padding: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: "12px",
                              display: "inline-block",
                              width: "fit-content",
                              background:
                                sub.status === "approved"
                                  ? "#DCFCE7"
                                  : sub.status === "revision"
                                  ? "#FEE2E2"
                                  : sub.status === "in_review"
                                  ? "#FEF3C7"
                                  : "#EFF6FF",
                              color:
                                sub.status === "approved"
                                  ? "#166534"
                                  : sub.status === "revision"
                                  ? "#991B1B"
                                  : sub.status === "in_review"
                                  ? "#92400E"
                                  : "#1E40AF",
                            }}
                          >
                            {sub.status === "approved"
                              ? `Disetujui (${sub.score}/100)`
                              : sub.status === "revision"
                              ? `Perlu Revisi (${sub.score || 68})`
                              : sub.status === "in_review"
                              ? "Sedang Dinilai"
                              : "Menunggu Review"}
                          </span>

                          <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                            SLA: <strong>{sub.deadlineHoursLeft} jam tersisa</strong>
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: "14px" }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--ink)" }}>
                          {sub.assignedReviewerName || "Belum dialokasikan"}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                          Diserahkan: {sub.submittedAt}
                        </div>
                      </td>

                      <td style={{ padding: "14px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => onOpenReviewModal(sub)}
                          style={{
                            padding: "8px 14px",
                            background: sub.status === "approved" ? "var(--bx-bg-alt)" : "var(--brand)",
                            color: sub.status === "approved" ? "var(--brand)" : "#ffffff",
                            border: sub.status === "approved" ? "1px solid var(--bx-border)" : "none",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {sub.status === "approved" ? "Lihat Penilaian" : "Mulai Review"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 2: SHOWCASE PROYEK & PORTOFOLIO SISWA */}
      {mainMode === "portofolio" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Controls Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              padding: "12px 16px",
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flex: 1, minWidth: "260px" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
                <input
                  type="text"
                  value={portfolioSearch}
                  onChange={(e) => setPortfolioSearch(e.target.value)}
                  placeholder="Cari judul proyek, mahasiswa..."
                  style={{
                    width: "100%",
                    padding: "6px 10px 6px 30px",
                    fontSize: "0.76rem",
                    borderRadius: "5px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-bg-alt)",
                    color: "var(--ink)",
                  }}
                />
                <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>
                  <FlatIcon type="search" size={13} />
                </span>
              </div>

              <select
                value={portfolioTrackFilter}
                onChange={(e) => setPortfolioTrackFilter(e.target.value)}
                style={{
                  padding: "6px 10px",
                  fontSize: "0.76rem",
                  borderRadius: "5px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-bg-alt)",
                }}
              >
                <option value="all">Semua Jalur Peminatan</option>
                <option value="Artificial Intelligence & Cloud Architecture">AI &amp; Cloud</option>
                <option value="Autonomous AI & Intelligent Systems">Autonomous AI</option>
                <option value="Fullstack Web & AI Architecture">Fullstack Web</option>
                <option value="Cybersecurity & Infrastructure">Cybersecurity</option>
              </select>
            </div>

            <div style={{ fontSize: "0.76rem", color: "var(--muted)" }}>
              Total <strong>{filteredPortfolios.length}</strong> karya portofolio siswa
            </div>
          </div>

          {/* Portfolio Grid Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "14px",
            }}
          >
            {filteredPortfolios.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "var(--bx-surface, #FFFFFF)",
                  border: item.isFeatured ? "2px solid var(--gold)" : "1px solid var(--bx-border)",
                  borderRadius: "10px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  boxShadow: "0 1px 3px rgba(10, 46, 82, 0.04)",
                  position: "relative",
                }}
              >
                {/* Header: Student Info & Badges */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <img
                      src={item.studentAvatar}
                      alt={item.studentName}
                      style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                      <strong style={{ fontSize: "0.86rem", color: "var(--brand)", display: "block" }}>
                        {item.studentName}
                      </strong>
                      <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                        {item.trackName}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "4px" }}>
                    {item.isIndustryVerified && (
                      <span
                        title="Terverifikasi Standar Industri"
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: "#FEF3C7",
                          color: "#92400E",
                          border: "1px solid #FDE68A",
                        }}
                      >
                        ✓ Industri Verified
                      </span>
                    )}
                    {item.isFeatured && (
                      <span
                        title="Ditampilkan di Homepage LMS"
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: "var(--brand)",
                          color: "#ffffff",
                        }}
                      >
                        ★ Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 style={{ margin: "4px 0", fontSize: "0.96rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                    {item.projectTitle}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.76rem", color: "var(--ink)", lineHeight: "1.4" }}>
                    {item.projectExcerpt}
                  </p>
                </div>

                {/* Links: Demo & Repo */}
                <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--bx-border)", paddingTop: "8px" }}>
                  <a
                    href={item.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "4px 8px",
                      fontSize: "0.7rem",
                      borderRadius: "4px",
                      background: "#EFF6FF",
                      color: "#1D4ED8",
                      textDecoration: "none",
                      fontWeight: 600,
                      border: "1px solid #BFDBFE",
                    }}
                  >
                    🌐 Buka Live Demo
                  </a>
                  <a
                    href={item.githubRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "4px 8px",
                      fontSize: "0.7rem",
                      borderRadius: "4px",
                      background: "#F3F4F6",
                      color: "#374151",
                      textDecoration: "none",
                      fontWeight: 600,
                      border: "1px solid #D1D5DB",
                    }}
                  >
                    💻 Source Code
                  </a>
                </div>

                {/* Reviewer Feedback Snippet */}
                {item.reviewerNotes && (
                  <div
                    style={{
                      fontSize: "0.7rem",
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "4px",
                      padding: "6px 8px",
                      color: "var(--muted)",
                    }}
                  >
                    <strong style={{ color: "var(--brand)" }}>Catatan Asesor: </strong>
                    {item.reviewerNotes}
                  </div>
                )}

                {/* Curator Action Controls */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--bx-border)",
                    paddingTop: "8px",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(item.id)}
                      style={{
                        padding: "3px 8px",
                        fontSize: "0.68rem",
                        borderRadius: "4px",
                        border: "1px solid var(--bx-border)",
                        background: item.isFeatured ? "var(--gold)" : "transparent",
                        color: item.isFeatured ? "#ffffff" : "var(--brand)",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {item.isFeatured ? "Unfeature" : "★ Feature"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleVerified(item.id)}
                      style={{
                        padding: "3px 8px",
                        fontSize: "0.68rem",
                        borderRadius: "4px",
                        border: "1px solid var(--bx-border)",
                        background: item.isIndustryVerified ? "#166534" : "transparent",
                        color: item.isIndustryVerified ? "#ffffff" : "#166534",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {item.isIndustryVerified ? "Verified" : "Verifikasi"}
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      type="button"
                      onClick={() => handleOpenPortfolioNotes(item)}
                      style={{
                        padding: "3px 8px",
                        fontSize: "0.68rem",
                        borderRadius: "4px",
                        border: "1px solid var(--bx-border)",
                        background: "var(--bx-bg-alt)",
                        color: "var(--brand)",
                        cursor: "pointer",
                      }}
                    >
                      Catatan
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePortfolio(item.id)}
                      style={{
                        padding: "3px 8px",
                        fontSize: "0.68rem",
                        borderRadius: "4px",
                        border: "1px solid #FCA5A5",
                        background: "transparent",
                        color: "#DC2626",
                        cursor: "pointer",
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: SERTIFIKAT TERBIT */}
      {mainMode === "sertifikat" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Controls Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              padding: "12px 16px",
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flex: 1, minWidth: "260px" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
                <input
                  type="text"
                  value={certSearch}
                  onChange={(e) => setCertSearch(e.target.value)}
                  placeholder="Cari nomor seri, nama siswa, kelas..."
                  style={{
                    width: "100%",
                    padding: "6px 10px 6px 30px",
                    fontSize: "0.76rem",
                    borderRadius: "5px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-bg-alt)",
                    color: "var(--ink)",
                  }}
                />
                <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>
                  <FlatIcon type="search" size={13} />
                </span>
              </div>

              <select
                value={certFilterStatus}
                onChange={(e) => setCertFilterStatus(e.target.value)}
                style={{
                  padding: "6px 10px",
                  fontSize: "0.76rem",
                  borderRadius: "5px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-bg-alt)",
                }}
              >
                <option value="all">Semua Status Sertifikat</option>
                <option value="aktif">Aktif &amp; Terverifikasi</option>
                <option value="revoked">Telah Di-Revoke</option>
              </select>
            </div>

            <div style={{ fontSize: "0.76rem", color: "var(--muted)" }}>
              Total <strong>{filteredCertificates.length}</strong> sertifikat diterbitkan
            </div>
          </div>

          {/* Certificate Table */}
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.76rem" }}>
              <thead>
                <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left", color: "var(--muted)" }}>
                  <th style={{ padding: "10px 14px" }}>Nomor Seri Sertifikat</th>
                  <th style={{ padding: "10px 14px" }}>Penerima / Mahasiswa</th>
                  <th style={{ padding: "10px 14px" }}>Mata Kuliah / Program</th>
                  <th style={{ padding: "10px 14px" }}>Nilai Akhir</th>
                  <th style={{ padding: "10px 14px" }}>Tanggal Terbit</th>
                  <th style={{ padding: "10px 14px" }}>Status Keabsahan</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((cert) => (
                  <tr key={cert.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                    <td style={{ padding: "10px 14px" }}>
                      <code style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--brand)", background: "var(--bx-bg-alt)", padding: "2px 6px", borderRadius: "4px" }}>
                        {cert.serialNumber}
                      </code>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <img
                          src={cert.studentAvatar}
                          alt={cert.studentName}
                          style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div>
                          <strong style={{ color: "var(--brand)", display: "block" }}>{cert.studentName}</strong>
                          <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>{cert.studentEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontWeight: 600, color: "var(--ink)" }}>{cert.courseName}</div>
                      <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>Instruktur: {cert.instructorName}</div>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontWeight: 800, color: "var(--gold-2)", fontSize: "0.82rem" }}>
                        {cert.gradeScore} ({cert.gradeLetter})
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", color: "var(--muted)" }}>
                      {cert.issueDate}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: cert.status === "aktif" ? "#D1FAE5" : "#FEE2E2",
                          color: cert.status === "aktif" ? "#065F46" : "#DC2626",
                          textTransform: "uppercase",
                        }}
                      >
                        {cert.status === "aktif" ? "Valid Aktif" : "Revoked"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "4px" }}>
                        <button
                          type="button"
                          onClick={() => setPreviewCert(cert)}
                          style={{
                            padding: "4px 8px",
                            fontSize: "0.68rem",
                            borderRadius: "4px",
                            border: "1px solid var(--bx-border)",
                            background: "var(--bx-bg-alt)",
                            color: "var(--brand)",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Lihat PDF
                        </button>
                        {cert.status === "aktif" ? (
                          <button
                            type="button"
                            onClick={() => handleRevokeCertificate(cert.id)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "0.68rem",
                              borderRadius: "4px",
                              border: "1px solid #FCA5A5",
                              background: "transparent",
                              color: "#DC2626",
                              cursor: "pointer",
                            }}
                          >
                            Revoke
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRegenerateCertificate(cert.id)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "0.68rem",
                              borderRadius: "4px",
                              border: "1px solid #A7F3D0",
                              background: "transparent",
                              color: "#059669",
                              cursor: "pointer",
                            }}
                          >
                            Regenerate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 4: SIMULATOR VERIFIKASI SERTIFIKAT PUBLIK */}
      {mainMode === "verifikasi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px", margin: "0 auto", width: "100%" }}>
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "24px",
              boxShadow: "0 1px 4px rgba(10, 46, 82, 0.05)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div style={{ display: "inline-block", background: "var(--cream, #FBF8F1)", border: "1px solid var(--gold)", padding: "4px 12px", borderRadius: "20px", fontSize: "0.72rem", color: "var(--gold-2)", fontWeight: 700, marginBottom: "8px" }}>
                Official Verification Portal
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: "1.25rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                Cek Keaslian Sertifikat Digital SIMAK
              </h3>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
                Masukkan nomor seri sertifikat yang tercantum pada dokumen fisik / QR code untuk memvalidasi akreditasi dan nilai mahasiswa.
              </p>
            </div>

            <form onSubmit={handleVerifySerial} style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <input
                type="text"
                required
                value={verifySerialInput}
                onChange={(e) => setVerifySerialInput(e.target.value)}
                placeholder="Contoh: AUI-2026-CS-008912"
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  fontSize: "0.84rem",
                  borderRadius: "6px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-bg-alt)",
                  fontFamily: "var(--font-mono)",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                className="portal-btn-primary"
                style={{ padding: "10px 20px", fontSize: "0.82rem", fontWeight: 700, borderRadius: "6px", cursor: "pointer" }}
              >
                Verifikasi Keaslian
              </button>
            </form>

            <div style={{ fontSize: "0.72rem", color: "var(--muted)", textAlign: "center" }}>
              Coba nomor sampel:{" "}
              {certificates.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setVerifySerialInput(c.serialNumber);
                    setVerifiedResult(c);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--brand)",
                    fontWeight: 700,
                    textDecoration: "underline",
                    cursor: "pointer",
                    margin: "0 4px",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {c.serialNumber}
                </button>
              ))}
            </div>

            {/* Verification Result Card */}
            {verifiedResult === "not_found" && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  borderRadius: "8px",
                  background: "#FEF2F2",
                  border: "1px solid #FCA5A5",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>⚠️</div>
                <strong style={{ color: "#991B1B", fontSize: "0.88rem", display: "block" }}>
                  Sertifikat Tidak Ditemukan!
                </strong>
                <span style={{ fontSize: "0.76rem", color: "#7F1D1D" }}>
                  Nomor seri &quot;{verifySerialInput}&quot; tidak terdaftar dalam basis data akreditasi resmi AUI SIMAK.
                </span>
              </div>
            )}

            {verifiedResult && verifiedResult !== "not_found" && (
              <div
                style={{
                  marginTop: "20px",
                  borderRadius: "10px",
                  border: verifiedResult.status === "aktif" ? "2px solid #059669" : "2px solid #DC2626",
                  background: verifiedResult.status === "aktif" ? "#F0FDF4" : "#FEF2F2",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "1.4rem" }}>
                      {verifiedResult.status === "aktif" ? "✅" : "⛔"}
                    </span>
                    <div>
                      <strong style={{ color: verifiedResult.status === "aktif" ? "#065F46" : "#991B1B", fontSize: "0.96rem", display: "block" }}>
                        {verifiedResult.status === "aktif" ? "TERVERIFIKASI & AKREDITASI RESMI" : "SERTIFIKAT TELAH DI-REVOKE / DIBATALKAN"}
                      </strong>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                        Database ID: {verifiedResult.serialNumber}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      background: verifiedResult.status === "aktif" ? "#D1FAE5" : "#FEE2E2",
                      color: verifiedResult.status === "aktif" ? "#065F46" : "#991B1B",
                    }}
                  >
                    STATUS: {verifiedResult.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.78rem" }}>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Nama Penerima:</span>
                    <strong style={{ color: "var(--brand)", fontSize: "0.9rem" }}>{verifiedResult.studentName}</strong>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{verifiedResult.studentEmail}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Program / Mata Kuliah:</span>
                    <strong style={{ color: "var(--brand)" }}>{verifiedResult.courseName}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Instruktur Penanggung Jawab:</span>
                    <strong>{verifiedResult.instructorName}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Nilai &amp; Predikat Kelulusan:</span>
                    <strong style={{ color: "var(--gold-2)", fontSize: "0.95rem" }}>
                      {verifiedResult.gradeScore} / 100 (Predikat {verifiedResult.gradeLetter})
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Tanggal Terbit:</span>
                    <strong>{verifiedResult.issueDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", display: "block" }}>Masa Berlaku:</span>
                    <strong>{verifiedResult.expiryDate || "Seumur Hidup"}</strong>
                  </div>
                </div>

                <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {verifiedResult.skillsAcquired.map((s, idx) => (
                      <span key={idx} style={{ fontSize: "0.65rem", padding: "2px 6px", borderRadius: "3px", background: "rgba(0,0,0,0.06)", color: "var(--brand)", fontWeight: 600 }}>
                        ✓ {s}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewCert(verifiedResult)}
                    className="portal-btn-primary"
                    style={{ padding: "5px 12px", fontSize: "0.72rem", fontWeight: 700, borderRadius: "4px" }}
                  >
                    Buka Dokumen Asli
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW SERTIFIKAT PDF / DOKUMEN */}
      {previewCert && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "10px",
              padding: "24px",
              width: "100%",
              maxWidth: "680px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            {/* Certificate Frame */}
            <div
              style={{
                border: "4px double var(--gold)",
                borderRadius: "8px",
                padding: "24px",
                textAlign: "center",
                background: "var(--cream, #FBF8F1)",
                position: "relative",
              }}
            >
              <div style={{ fontSize: "0.75rem", letterSpacing: "2px", fontWeight: 700, color: "var(--gold-2)", textTransform: "uppercase" }}>
                ASEAN UNIVERSITY INTERNATIONAL
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", margin: "6px 0 2px", color: "var(--brand)" }}>
                SERTIFIKAT KELULUSAN KOMPETENSI
              </h2>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "14px" }}>
                Nomor Seri: <code>{previewCert.serialNumber}</code>
              </div>

              <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Diberikan secara terakreditasi kepada:</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--brand)", margin: "4px 0" }}>
                {previewCert.studentName}
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--muted)", maxWidth: "460px", margin: "0 auto 12px" }}>
                Telah berhasil menyelesaikan seluruh kurikulum, uji kompetensi kuis, dan submission proyek industri pada kelas:
              </div>

              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--brand)", marginBottom: "8px" }}>
                &quot;{previewCert.courseName}&quot;
              </div>

              <div style={{ display: "inline-block", background: "#FFFFFF", border: "1px solid var(--bx-border)", padding: "4px 14px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 700, color: "var(--gold-2)", marginBottom: "16px" }}>
                Nilai Akhir: {previewCert.gradeScore} / 100 (Predikat {previewCert.gradeLetter})
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,0.08)", fontSize: "0.72rem" }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: "var(--muted)" }}>Diterbitkan pada:</div>
                  <strong>{previewCert.issueDate}</strong>
                  <div style={{ fontSize: "0.66rem", color: "var(--muted)", marginTop: "2px" }}>Status: {previewCert.status.toUpperCase()}</div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "var(--brand)" }}>{previewCert.instructorName}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.68rem" }}>Master Assessor &amp; Kaprodi</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "14px" }}>
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                style={{ padding: "6px 14px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "transparent", fontSize: "0.76rem", cursor: "pointer" }}
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => alert(`Mengunduh dokumen PDF sertifikat ${previewCert.serialNumber}...`)}
                className="portal-btn-primary"
                style={{ padding: "6px 16px", borderRadius: "5px", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer" }}
              >
                📥 Download PDF Resmi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CATATAN ASESOR PORTOFOLIO */}
      {selectedPortfolio && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "20px",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ margin: "0 0 6px", fontSize: "1.05rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Catatan Asesor Portofolio
            </h3>
            <p style={{ margin: "0 0 12px", fontSize: "0.74rem", color: "var(--muted)" }}>
              Proyek: <strong>{selectedPortfolio.projectTitle}</strong> ({selectedPortfolio.studentName})
            </p>
            <textarea
              rows={4}
              value={portfolioNotesInput}
              onChange={(e) => setPortfolioNotesInput(e.target.value)}
              placeholder="Berikan catatan teknis rubrik penilaian, arsitektur, atau rekomendasi perbaikan portofolio..."
              style={{
                width: "100%",
                padding: "8px 10px",
                fontSize: "0.76rem",
                borderRadius: "5px",
                border: "1px solid var(--bx-border)",
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={() => setSelectedPortfolio(null)}
                style={{ padding: "6px 12px", fontSize: "0.74rem", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "transparent" }}
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleSavePortfolioNotes}
                className="portal-btn-primary"
                style={{ padding: "6px 16px", fontSize: "0.74rem", fontWeight: 700, borderRadius: "4px" }}
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
