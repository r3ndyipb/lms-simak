"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { ClassSchedule } from "../types/simak";
import { MOCK_SCHEDULES } from "../data/simakMockData";

export default function SimakJadwalView() {
  const [schedules] = useState<ClassSchedule[]>(MOCK_SCHEDULES);
  const [filterDay, setFilterDay] = useState<string>("all");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--bx-surface)",
          border: "1px solid var(--bx-border)",
          borderRadius: "10px",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "2px 8px",
                borderRadius: "4px",
                background: "var(--brand)",
                color: "#ffffff",
                fontWeight: "700",
                textTransform: "uppercase",
              }}
            >
              Penjadwalan Terintegrasi
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Lab Fisik &amp; Virtual Zoom Terhubung
            </span>
          </div>
          <h2
            style={{
              fontSize: "1.45rem",
              fontFamily: "var(--font-heading)",
              margin: "6px 0 2px",
              color: "var(--brand)",
            }}
          >
            Jadwal Perkuliahan &amp; Sesi Mentoring
          </h2>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>
            Kalender perkuliahan mingguan, alokasi ruang laboratorium, dan monitoring presensi kehadiran mahasiswa.
          </p>
        </div>

        <button
          type="button"
          className="portal-btn-primary"
          style={{ padding: "10px 16px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <FlatIcon name="plus" size={16} />
          <span>Tambah Sesi Jadwal</span>
        </button>
      </div>

      {/* Schedule Table */}
      <div
        style={{
          background: "var(--bx-surface)",
          border: "1px solid var(--bx-border)",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid var(--bx-border)", textAlign: "left", background: "var(--bx-bg-alt)" }}>
                <th style={{ padding: "12px 14px", color: "var(--muted)", fontWeight: "700" }}>Waktu &amp; Sesi</th>
                <th style={{ padding: "12px 14px", color: "var(--muted)", fontWeight: "700" }}>Mata Kuliah &amp; Topik</th>
                <th style={{ padding: "12px 14px", color: "var(--muted)", fontWeight: "700" }}>Ruang / Tipe</th>
                <th style={{ padding: "12px 14px", color: "var(--muted)", fontWeight: "700" }}>Dosen Pengampu</th>
                <th style={{ padding: "12px 14px", color: "var(--muted)", fontWeight: "700" }}>Presensi</th>
                <th style={{ padding: "12px 14px", color: "var(--muted)", fontWeight: "700", textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((sch) => (
                <tr key={sch.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                  <td style={{ padding: "14px" }}>
                    <div style={{ fontWeight: "700", color: "var(--ink)" }}>{sch.date}</div>
                    <div style={{ fontSize: "0.76rem", color: "var(--gold-2)", fontWeight: "600", marginTop: "2px" }}>
                      {sch.time}
                    </div>
                  </td>

                  <td style={{ padding: "14px" }}>
                    <div style={{ fontWeight: "700", color: "var(--brand)" }}>
                      {sch.courseTitle}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--ink)", marginTop: "2px" }}>
                      Sesi {sch.sessionNumber}: {sch.sessionTitle}
                    </div>
                  </td>

                  <td style={{ padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FlatIcon name="company" size={14} color="var(--brand)" />
                      <span style={{ fontSize: "0.82rem", fontWeight: "600" }}>{sch.room}</span>
                    </div>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "4px",
                        fontSize: "0.7rem",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background:
                          sch.type === "hybrid"
                            ? "#D1FAE5"
                            : sch.type === "offline_lab"
                            ? "#DBEAFE"
                            : "#FEF3C7",
                        color:
                          sch.type === "hybrid"
                            ? "#065F46"
                            : sch.type === "offline_lab"
                            ? "#1E40AF"
                            : "#B45309",
                        fontWeight: "700",
                        textTransform: "uppercase",
                      }}
                    >
                      {sch.type}
                    </span>
                  </td>

                  <td style={{ padding: "14px" }}>
                    <div style={{ fontWeight: "600", color: "var(--ink)" }}>{sch.instructorName}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Dosen Utama</div>
                  </td>

                  <td style={{ padding: "14px" }}>
                    <div style={{ fontWeight: "700", color: "var(--brand)" }}>
                      {sch.attendanceCount}/{sch.totalStudents} Hadir
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#10B981", fontWeight: "600" }}>
                      {Math.round((sch.attendanceCount / (sch.totalStudents || 1)) * 100)}% Partisipasi
                    </div>
                  </td>

                  <td style={{ padding: "14px", textAlign: "right" }}>
                    <button
                      type="button"
                      style={{
                        padding: "6px 12px",
                        background: "var(--bx-bg-alt)",
                        color: "var(--brand)",
                        border: "1px solid var(--bx-border)",
                        borderRadius: "5px",
                        fontSize: "0.78rem",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Buka Presensi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
