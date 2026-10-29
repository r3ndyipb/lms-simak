"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { MOCK_ACTIVITY_LOGS } from "../data/simakMockData";

export default function SimakAuditLogView() {
  const [filterType, setFilterType] = useState<string>("all");
  const [logs] = useState(MOCK_ACTIVITY_LOGS);

  const filteredLogs = logs.filter((log) => {
    if (filterType === "all") return true;
    return log.type === filterType;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Header */}
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
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "0.68rem",
                padding: "2px 6px",
                borderRadius: "4px",
                background: "var(--brand)",
                color: "#ffffff",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Keamanan &amp; Audit Trail
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Rekaman Transaksi Real-time
            </span>
          </div>
          <h2
            style={{
              fontSize: "1.15rem",
              fontFamily: "var(--font-heading)",
              margin: "3px 0 1px",
              color: "var(--brand, #0A2E52)",
            }}
          >
            Log Audit &amp; Aktivitas SIMAK
          </h2>
        </div>

        <button
          type="button"
          className="portal-btn-secondary"
          style={{ padding: "8px 14px", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <FlatIcon type="download" size={15} />
          <span>Ekspor Log Audit</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "6px" }}>
        {["all", "review", "schedule", "grade", "user", "system"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilterType(type)}
            style={{
              padding: "5px 12px",
              borderRadius: "5px",
              border: filterType === type ? "1.5px solid var(--gold)" : "1px solid var(--bx-border)",
              background: filterType === type ? "var(--bx-bg-alt)" : "var(--bx-surface)",
              color: filterType === type ? "var(--brand)" : "var(--muted)",
              fontWeight: filterType === type ? 700 : 600,
              fontSize: "0.78rem",
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {type === "all" ? "Semua Aktivitas" : type}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div
        style={{
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "8px",
          padding: "14px",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid var(--bx-border)", textAlign: "left", background: "var(--bx-bg-alt)" }}>
              <th style={{ padding: "8px 12px", color: "var(--muted)", fontWeight: 700 }}>Waktu</th>
              <th style={{ padding: "8px 12px", color: "var(--muted)", fontWeight: 700 }}>Aktor &amp; Peran</th>
              <th style={{ padding: "8px 12px", color: "var(--muted)", fontWeight: 700 }}>Aksi Dilakukan</th>
              <th style={{ padding: "8px 12px", color: "var(--muted)", fontWeight: 700 }}>Target Objek</th>
              <th style={{ padding: "8px 12px", color: "var(--muted)", fontWeight: 700 }}>Kategori</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                <td style={{ padding: "10px 12px", color: "var(--muted)", whiteSpace: "nowrap" }}>
                  {log.timestamp}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <strong style={{ color: "var(--ink)" }}>{log.actorName}</strong>
                  <div style={{ fontSize: "0.7rem", color: "var(--gold-2)" }}>{log.actorRole}</div>
                </td>
                <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--brand)" }}>
                  {log.action}
                </td>
                <td style={{ padding: "10px 12px", color: "var(--ink)" }}>
                  {log.target}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: "var(--muted)",
                    }}
                  >
                    {log.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
