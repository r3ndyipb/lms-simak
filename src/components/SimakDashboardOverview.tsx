"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { SimakUser, ReviewSubmission, SimakNavId } from "../types/simak";
import {
  MOCK_SUBMISSIONS,
  MOCK_COMMERCIAL_DASHBOARD,
} from "../data/simakMockData";

interface SimakDashboardOverviewProps {
  currentUser: SimakUser;
  onNavigate: (navId: SimakNavId) => void;
  onOpenReviewModal: (submission: ReviewSubmission) => void;
}

export default function SimakDashboardOverview({
  currentUser,
  onNavigate,
  onOpenReviewModal,
}: SimakDashboardOverviewProps) {
  const [dashboardTab, setDashboardTab] = useState<"overview" | "analytics">("overview");
  const [chartPeriod, setChartPeriod] = useState<"7d" | "30d">("30d");
  const stats = MOCK_COMMERCIAL_DASHBOARD;

  const handleExportGrowthCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Cohort,Bulan 0,Bulan 1,Bulan 2,Bulan 3,Bulan 4,Bulan 5"]
        .concat([
          "Mei 2026,100%,86%,74%,68%,62%,58%",
          "Juni 2026,100%,88%,76%,71%,66%,-",
          "Juli 2026,100%,91%,81%,75%,-,-",
          "Agustus 2026,100%,92%,83%,-,-,-",
          "September 2026,100%,94%,-,-,-,-",
          "Oktober 2026,100%,-,-,-,-,-",
        ])
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lms_growth_cohort_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const urgentSubmissions = MOCK_SUBMISSIONS.filter(
    (s) => s.status === "pending" || s.status === "in_review"
  ).slice(0, 3);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        height: "100%",
        maxHeight: "100%",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflowY: "auto",
        paddingBottom: "16px",
      }}
    >
      {/* Top Header & Quick Actions Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          padding: "10px 16px",
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(10, 46, 82, 0.04)",
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "1.05rem",
                color: "var(--brand, #0A2E52)",
              }}
            >
              Portal Eksekutif LMS
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                padding: "2px 8px",
                borderRadius: "12px",
                background: "var(--gold-soft)",
                color: "#78350F",
                fontWeight: 700,
              }}
            >
              Enterprise Dashboard
            </span>
          </div>
          <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--muted)" }}>
            Selamat datang kembali, <strong>{currentUser.name}</strong> • Ikhtisar pertumbuhan siswa, katalog kelas, dan omset platform.
          </p>
        </div>

        {/* Switcher & Quick Actions */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
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
              onClick={() => setDashboardTab("overview")}
              style={{
                padding: "5px 12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: dashboardTab === "overview" ? "var(--brand)" : "transparent",
                color: dashboardTab === "overview" ? "#ffffff" : "var(--ink)",
              }}
            >
              Ringkasan Operasional
            </button>
            <button
              type="button"
              onClick={() => setDashboardTab("analytics")}
              style={{
                padding: "5px 12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: dashboardTab === "analytics" ? "var(--brand)" : "transparent",
                color: dashboardTab === "analytics" ? "#ffffff" : "var(--ink)",
              }}
            >
              Advanced Analytics &amp; Growth 📈
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("kurikulum")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              background: "var(--brand, #0A2E52)",
              color: "#ffffff",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FlatIcon type="plus" size={13} color="#ffffff" />
            <span>Buat Kelas Baru</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("users")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid var(--bx-border)",
              background: "var(--bx-bg-alt)",
              color: "var(--brand)",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FlatIcon type="users" size={13} color="var(--brand)" />
            <span>Kelola Pengguna</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: OVERVIEW & OPERASIONAL */}
      {dashboardTab === "overview" && (
        <>
          {/* 5 KPI Metric Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px",
              flexShrink: 0,
            }}
          >
        {/* Card 1: Siswa Aktif */}
        <div
          style={{
            background: "var(--bx-surface, #FFFFFF)",
            border: "1px solid var(--bx-border)",
            borderRadius: "8px",
            padding: "12px 14px",
            boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600 }}>Total Siswa Aktif</span>
            <span style={{ padding: "4px", background: "var(--bx-bg-alt)", borderRadius: "4px" }}>
              <FlatIcon type="users" size={14} color="var(--brand)" />
            </span>
          </div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--brand)", margin: "4px 0" }}>
            {stats.kpi.activeStudents}
          </div>
          <div style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 700 }}>
            {stats.kpi.activeStudentsGrowth}
          </div>
        </div>

        {/* Card 2: Kelas Terpublikasi */}
        <div
          style={{
            background: "var(--bx-surface, #FFFFFF)",
            border: "1px solid var(--bx-border)",
            borderRadius: "8px",
            padding: "12px 14px",
            boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600 }}>Kelas Terpublikasi</span>
            <span style={{ padding: "4px", background: "var(--bx-bg-alt)", borderRadius: "4px" }}>
              <FlatIcon type="curriculum" size={14} color="var(--gold-2)" />
            </span>
          </div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--ink)", margin: "4px 0" }}>
            {stats.kpi.publishedCourses}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600 }}>
            {stats.kpi.publishedCoursesGrowth}
          </div>
        </div>

        {/* Card 3: Revenue Bulan Ini */}
        <div
          style={{
            background: "var(--bx-surface, #FFFFFF)",
            border: "1px solid var(--bx-border)",
            borderRadius: "8px",
            padding: "12px 14px",
            boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600 }}>Omset Berjalan (Okt)</span>
            <span style={{ padding: "4px", background: "#FEF3C7", borderRadius: "4px" }}>
              <FlatIcon type="award" size={14} color="#B45309" />
            </span>
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#065F46", margin: "4px 0" }}>
            {stats.kpi.monthlyRevenue}
          </div>
          <div style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 700 }}>
            {stats.kpi.monthlyRevenueGrowth}
          </div>
        </div>

        {/* Card 4: Sertifikat Terbit */}
        <div
          style={{
            background: "var(--bx-surface, #FFFFFF)",
            border: "1px solid var(--bx-border)",
            borderRadius: "8px",
            padding: "12px 14px",
            boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600 }}>Sertifikat Terbit</span>
            <span style={{ padding: "4px", background: "var(--bx-bg-alt)", borderRadius: "4px" }}>
              <FlatIcon type="certificate" size={14} color="var(--brand)" />
            </span>
          </div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--ink)", margin: "4px 0" }}>
            {stats.kpi.certificatesIssued}
          </div>
          <div style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 700 }}>
            {stats.kpi.certificatesGrowth}
          </div>
        </div>

        {/* Card 5: Pendaftar Baru Hari Ini */}
        <div
          style={{
            background: "var(--bx-surface, #FFFFFF)",
            border: "1px solid var(--bx-border)",
            borderRadius: "8px",
            padding: "12px 14px",
            boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600 }}>Pendaftar Baru Hari Ini</span>
            <span style={{ padding: "4px", background: "#EFF6FF", borderRadius: "4px" }}>
              <FlatIcon type="target" size={14} color="#1D4ED8" />
            </span>
          </div>
          <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#1D4ED8", margin: "4px 0" }}>
            {stats.kpi.newRegistrationsToday}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600 }}>
            Konversi pendaftaran 8.4%
          </div>
        </div>
      </div>

      {/* Main Dual-Column Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
          gap: "12px",
          minHeight: 0,
        }}
      >
        {/* Left Column: Revenue Trend + Top 5 Popular Courses */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Revenue & Registration Charts */}
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              padding: "14px 16px",
              boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "0.92rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                  Tren Pendapatan &amp; Pertumbuhan Siswa
                </h3>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Pertumbuhan omset 6 bulan terakhir</span>
              </div>

              <div style={{ display: "flex", gap: "4px", background: "var(--bx-bg-alt)", padding: "2px", borderRadius: "6px" }}>
                <button
                  type="button"
                  onClick={() => setChartPeriod("7d")}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    border: "none",
                    background: chartPeriod === "7d" ? "var(--brand)" : "transparent",
                    color: chartPeriod === "7d" ? "#ffffff" : "var(--muted)",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  7 Hari
                </button>
                <button
                  type="button"
                  onClick={() => setChartPeriod("30d")}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    border: "none",
                    background: chartPeriod === "30d" ? "var(--brand)" : "transparent",
                    color: chartPeriod === "30d" ? "#ffffff" : "var(--muted)",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  6 Bulan
                </button>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "14px", height: "130px", paddingTop: "10px", borderBottom: "1px solid var(--bx-border)" }}>
              {stats.revenueTrend.map((bar, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: "0.68rem", color: "var(--muted)", marginBottom: "4px" }}>{bar.amount}</span>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "38px",
                      height: `${bar.heightPct}%`,
                      background: i === stats.revenueTrend.length - 1 ? "var(--gold)" : "var(--brand)",
                      borderRadius: "4px 4px 0 0",
                      transition: "height 0.3s ease",
                    }}
                  />
                  <span style={{ fontSize: "0.68rem", color: "var(--ink)", fontWeight: 600, marginTop: "6px" }}>
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Popular Courses */}
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              padding: "14px 16px",
              boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "0.92rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                Top 5 Kelas Terpopuler &amp; Completion Rate
              </h3>
              <button
                type="button"
                onClick={() => onNavigate("kurikulum")}
                style={{ background: "none", border: "none", color: "var(--gold-2)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
              >
                Lihat Semua
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {stats.popularCourses.map((crs, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    background: "var(--bx-bg-alt)",
                    borderRadius: "6px",
                    gap: "10px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--brand)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {idx + 1}. {crs.title}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--muted)", display: "flex", gap: "10px", marginTop: "2px" }}>
                      <span>★ {crs.rating}</span>
                      <span>{crs.students} Siswa</span>
                    </div>
                  </div>

                  {/* Completion Rate Meter */}
                  <div style={{ width: "120px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#065F46" }}>
                      {crs.completionRate}% Lulus
                    </span>
                    <div style={{ width: "100%", height: "6px", background: "rgba(10,46,82,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${crs.completionRate}%`,
                          height: "100%",
                          background: "#059669",
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activities + Review Queue */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Feed Aktivitas Terbaru */}
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              padding: "14px 16px",
              boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "0.92rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                Aktivitas Transaksi &amp; Notifikasi
              </h3>
              <span style={{ fontSize: "0.68rem", padding: "2px 6px", background: "#D1FAE5", color: "#065F46", borderRadius: "4px", fontWeight: 700 }}>
                Live Stream
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {stats.recentActivities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    padding: "8px",
                    borderBottom: "1px solid var(--bx-border)",
                    fontSize: "0.78rem",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor:
                        act.type === "payment" ? "#059669" :
                        act.type === "course" ? "#C9962E" :
                        act.type === "cert" ? "#7C3AED" : "#0A2E52",
                      marginTop: "5px",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "var(--ink)", lineHeight: 1.35 }}>{act.text}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "2px" }}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Review Queue SLA */}
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              padding: "14px 16px",
              boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#DC2626" }} />
                <h3 style={{ margin: 0, fontSize: "0.88rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                  Antrean Evaluasi Tugas Mahasiswa
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("review-queue")}
                style={{ background: "none", border: "none", color: "var(--gold-2)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}
              >
                Buka Queue
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {urgentSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    padding: "8px 10px",
                    background: "var(--bx-bg-alt)",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {sub.studentName}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
                      {sub.courseName}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenReviewModal(sub)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "none",
                      background: "var(--brand)",
                      color: "#ffffff",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Beri Nilai
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )}

  {/* VIEW 2: ADVANCED ANALYTICS & GROWTH */}
  {dashboardTab === "analytics" && (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Action Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          padding: "10px 14px",
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "8px",
        }}
      >
        <div>
          <strong style={{ fontSize: "0.85rem", color: "var(--brand)" }}>
            Model Metrik Pertumbuhan &amp; Retensi SaaS LMS
          </strong>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
            Data dihitung secara agregat dari transaksi langganan, cohort pendaftaran, dan progres kurikulum.
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportGrowthCSV}
          className="portal-btn-primary"
          style={{ padding: "6px 14px", fontSize: "0.75rem", fontWeight: 700, borderRadius: "5px", cursor: "pointer" }}
        >
          📥 Export Laporan Growth CSV
        </button>
      </div>

      {/* SaaS Economics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
        <div style={{ padding: "14px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Monthly Recurring Revenue (MRR)</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#065F46", margin: "2px 0" }}>Rp 142.500.000</div>
          <div style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 700 }}>+14.2% MoM Growth</div>
        </div>

        <div style={{ padding: "14px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Annual Run Rate (ARR)</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--brand)", margin: "2px 0" }}>Rp 1.710.000.000</div>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Proyeksi 12 bulan ke depan</div>
        </div>

        <div style={{ padding: "14px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Customer Churn Rate</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#166534", margin: "2px 0" }}>1.8% / bln</div>
          <div style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 700 }}>Sehat (&lt; 2.5% Benchmark)</div>
        </div>

        <div style={{ padding: "14px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>ARPU &amp; LTV / CAC</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--gold-2)", margin: "2px 0" }}>5.2x LTV/CAC</div>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>ARPU: Rp 385.000 • Payback 2.1 bln</div>
        </div>
      </div>

      {/* Cohort Retention Heatmap */}
      <div
        style={{
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div>
            <h3 style={{ margin: "0 0 2px", fontSize: "0.98rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Cohort Retention Analysis (Aktivitas Siswa 6 Bulan Terakhir)
            </h3>
            <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
              Persentase siswa yang tetap aktif belajar dan memperbarui langganan setelah pendaftaran awal.
            </span>
          </div>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "#D1FAE5", color: "#065F46" }}>
            Benchmark Global: Top Quartile
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", textAlign: "center" }}>
            <thead>
              <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)" }}>
                <th style={{ padding: "8px 12px", textAlign: "left" }}>Cohort Siswa</th>
                <th style={{ padding: "8px 12px" }}>Siswa Baru</th>
                <th style={{ padding: "8px 12px" }}>Bulan 0</th>
                <th style={{ padding: "8px 12px" }}>Bulan 1</th>
                <th style={{ padding: "8px 12px" }}>Bulan 2</th>
                <th style={{ padding: "8px 12px" }}>Bulan 3</th>
                <th style={{ padding: "8px 12px" }}>Bulan 4</th>
                <th style={{ padding: "8px 12px" }}>Bulan 5</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Mei 2026", total: 420, rates: [100, 86, 74, 68, 62, 58] },
                { name: "Juni 2026", total: 510, rates: [100, 88, 76, 71, 66] },
                { name: "Juli 2026", total: 640, rates: [100, 91, 81, 75] },
                { name: "Agustus 2026", total: 720, rates: [100, 92, 83] },
                { name: "September 2026", total: 850, rates: [100, 94] },
                { name: "Oktober 2026", total: 980, rates: [100] },
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                  <td style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: "var(--brand)" }}>{row.name}</td>
                  <td style={{ padding: "8px 12px", fontWeight: 600 }}>{row.total.toLocaleString("id-ID")}</td>
                  {[0, 1, 2, 3, 4, 5].map((colIdx) => {
                    const val = row.rates[colIdx];
                    if (val === undefined) {
                      return <td key={colIdx} style={{ padding: "8px 12px", color: "var(--muted)" }}>-</td>;
                    }
                    const bgOpacity = (val / 100) * 0.4;
                    return (
                      <td
                        key={colIdx}
                        style={{
                          padding: "8px 12px",
                          fontWeight: 700,
                          background: `rgba(5, 150, 105, ${bgOpacity})`,
                          color: val >= 70 ? "#065F46" : "var(--ink)",
                        }}
                      >
                        {val}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completion & Dropout Rates by Track */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div style={{ background: "var(--bx-surface, #FFFFFF)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: "0.95rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
            Tingkat Kelulusan (Completion Rate) per Peminatan
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.78rem" }}>
            {[
              { track: "Fullstack Web & AI Architecture", rate: 92.0, avgDays: "36 hari", color: "#059669" },
              { track: "Cloud & Kubernetes Microservices", rate: 86.4, avgDays: "48 hari", color: "#0A2E52" },
              { track: "Artificial Intelligence & LLM Agent", rate: 81.2, avgDays: "52 hari", color: "#C9962E" },
              { track: "Cybersecurity & Zero Trust Security", rate: 74.5, avgDays: "60 hari", color: "#7C3AED" },
            ].map((t, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600 }}>{t.track}</span>
                  <strong style={{ color: t.color }}>{t.rate}% (Rata-rata {t.avgDays})</strong>
                </div>
                <div style={{ width: "100%", height: "6px", background: "var(--bx-bg-alt)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${t.rate}%`, height: "100%", background: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--bx-surface, #FFFFFF)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: "0.95rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
            Indikator Dropout &amp; Titik Hambatan Belajar Siswa
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.78rem" }}>
            {[
              { mod: "Modul 4: Distributed System Sharding (AI & Cloud)", drop: "4.8%", cause: "Tingkat kesulitan setup cluster lokal" },
              { mod: "Modul 3: Reverse Engineering & Binary Exploitation", drop: "6.2%", cause: "Prasyarat assembly & C low-level" },
              { mod: "Modul 5: Kubernetes Helm Deployment & Ingress", drop: "3.2%", cause: "Konfigurasi SSL cert-manager" },
              { mod: "Modul 2: Next.js 16 Server Actions & Cache", drop: "2.1%", cause: "Evolusi API Next.js terbaru" },
            ].map((d, idx) => (
              <div key={idx} style={{ padding: "8px 10px", background: "var(--bx-bg-alt)", borderRadius: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "var(--brand)" }}>{d.mod}</strong>
                  <span style={{ color: "#DC2626", fontWeight: 700 }}>{d.drop} dropout</span>
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "2px" }}>
                  Penyebab teridentifikasi: {d.cause}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
}
