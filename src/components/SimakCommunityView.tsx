"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { LmsForumThread } from "../types/simak";
import { MOCK_FORUM_THREADS } from "../data/simakMockData";

type CommTab = "forum" | "flagged" | "leaderboard" | "kategori";

export default function SimakCommunityView() {
  const [activeTab, setActiveTab] = useState<CommTab>("forum");
  const [threads, setThreads] = useState<LmsForumThread[]>(MOCK_FORUM_THREADS);
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");

  const handleTogglePin = (threadId: string) => {
    setThreads(
      threads.map((t) => (t.id === threadId ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const handleToggleLock = (threadId: string) => {
    setThreads(
      threads.map((t) => (t.id === threadId ? { ...t, isLocked: !t.isLocked } : t))
    );
  };

  const handleDeleteThread = (threadId: string) => {
    if (confirm("Hapus diskusi ini dari forum?")) {
      setThreads(threads.filter((t) => t.id !== threadId));
    }
  };

  const handleResolveFlag = (threadId: string, action: "keep" | "delete") => {
    if (action === "delete") {
      setThreads(threads.filter((t) => t.id !== threadId));
      alert("Konten yang dilaporkan telah dihapus dan user diberi peringatan.");
    } else {
      setThreads(
        threads.map((t) => (t.id === threadId ? { ...t, status: "active" } : t))
      );
      alert("Laporan ditolak, konten dinyatakan aman.");
    }
  };

  const filteredThreads = threads.filter((t) => {
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.authorName.toLowerCase().includes(q);
  });

  const flaggedThreads = threads.filter((t) => t.status === "flagged");

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
              Community Moderation
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Forum Diskusi Siswa, Laporan Konten &amp; Leaderboard
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
            Pusat Komunitas &amp; Moderasi Forum
          </h2>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "6px", background: "var(--bx-bg-alt)", padding: "4px", borderRadius: "8px" }}>
          {[
            { id: "forum", label: "Moderasi Diskusi", icon: "book" },
            { id: "flagged", label: `Laporan Pelanggaran (${flaggedThreads.length})`, icon: "shield" },
            { id: "leaderboard", label: "Top Kontributor", icon: "award" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as CommTab)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: isActive ? "var(--brand, #0A2E52)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--ink)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                <FlatIcon type={tab.icon} size={13} color={isActive ? "#ffffff" : "var(--muted)"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: FORUM MODERATION */}
      {/* ============================================================== */}
      {activeTab === "forum" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              padding: "10px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "var(--bx-bg-alt)",
                border: "1px solid var(--bx-border)",
                borderRadius: "6px",
                padding: "6px 10px",
                width: "280px",
              }}
            >
              <FlatIcon type="search" size={13} color="var(--muted)" />
              <input
                type="text"
                placeholder="Cari thread diskusi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.8rem", width: "100%", color: "var(--ink)" }}
              />
            </div>

            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Total Diskusi: <strong>{threads.length} Thread</strong>
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredThreads.map((thr) => (
              <div
                key={thr.id}
                style={{
                  background: "var(--bx-surface, #FFFFFF)",
                  border: `1px solid ${thr.isPinned ? "var(--gold)" : "var(--bx-border)"}`,
                  borderRadius: "8px",
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    {thr.isPinned && (
                      <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "4px", background: "var(--gold)", color: "#ffffff", fontWeight: 700 }}>
                        PINNED
                      </span>
                    )}
                    {thr.isLocked && (
                      <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "4px", background: "#FEE2E2", color: "#DC2626", fontWeight: 700 }}>
                        LOCKED
                      </span>
                    )}
                    <span style={{ fontSize: "0.72rem", color: "var(--brand)", fontWeight: 700 }}>
                      [{thr.category}]
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>• {thr.createdAt}</span>
                  </div>

                  <h3 style={{ margin: "2px 0 6px", fontSize: "0.98rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                    {thr.title}
                  </h3>

                  <p style={{ margin: "0 0 8px", fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.4 }}>
                    {thr.excerpt}
                  </p>

                  <div style={{ display: "flex", gap: "12px", fontSize: "0.72rem", color: "var(--muted)" }}>
                    <span>Pengirim: <strong>{thr.authorName}</strong></span>
                    <span>💬 {thr.repliesCount} Balasan</span>
                    <span>▲ {thr.upvotes} Upvotes</span>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => handleTogglePin(thr.id)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid var(--bx-border)",
                      background: thr.isPinned ? "var(--gold)" : "var(--bx-bg-alt)",
                      color: thr.isPinned ? "#ffffff" : "var(--ink)",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {thr.isPinned ? "Unpin" : "Pin"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleLock(thr.id)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid var(--bx-border)",
                      background: "var(--bx-bg-alt)",
                      color: thr.isLocked ? "#059669" : "#DC2626",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {thr.isLocked ? "Buka Lock" : "Kunci"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteThread(thr.id)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "none",
                      background: "#FEE2E2",
                      color: "#DC2626",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: FLAGGED CONTENT */}
      {/* ============================================================== */}
      {activeTab === "flagged" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {flaggedThreads.map((f) => (
            <div
              key={f.id}
              style={{
                padding: "16px",
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", background: "#DC2626", color: "#ffffff", borderRadius: "4px" }}>
                  LAPORAN PELANGGARAN USER
                </span>
                <h4 style={{ margin: "6px 0 2px", color: "#991B1B", fontSize: "0.95rem" }}>{f.title}</h4>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#7F1D1D" }}>{f.excerpt}</p>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "4px" }}>Dilaporkan oleh user 1 hari lalu</div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => handleResolveFlag(f.id, "keep")}
                  style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "#ffffff", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}
                >
                  Abaikan Laporan
                </button>
                <button
                  type="button"
                  onClick={() => handleResolveFlag(f.id, "delete")}
                  style={{ padding: "6px 12px", borderRadius: "4px", border: "none", background: "#DC2626", color: "#ffffff", fontSize: "0.75rem", cursor: "pointer", fontWeight: 700 }}
                >
                  Take Down &amp; Hapus Konten
                </button>
              </div>
            </div>
          ))}

          {flaggedThreads.length === 0 && (
            <div style={{ padding: "24px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", textAlign: "center", color: "#065F46" }}>
              ✓ Semua laporan pelanggaran bersih! Tidak ada antrean konten yang dilaporkan.
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LEADERBOARD KONTRIBUTOR */}
      {/* ============================================================== */}
      {activeTab === "leaderboard" && (
        <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
          <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
            Top Kontributor Forum Teraktif (Oktober 2026)
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem" }}>
            {[
              { rank: 1, name: "Muhammad Farhan", answers: 42, upvotes: 184, badge: "Master Contributor" },
              { rank: 2, name: "Siti Nurhaliza", answers: 31, upvotes: 120, badge: "Lead Helper" },
              { rank: 3, name: "Aditya Pratama", answers: 26, upvotes: 95, badge: "Active Solver" },
            ].map((usr) => (
              <div
                key={usr.rank}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "var(--bx-bg-alt)",
                  borderRadius: "6px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontWeight: 800, color: "var(--gold-2)", width: "20px" }}>#{usr.rank}</span>
                  <strong>{usr.name}</strong>
                  <span style={{ fontSize: "0.68rem", padding: "1px 6px", background: "var(--bx-surface)", borderRadius: "4px", color: "var(--brand)", fontWeight: 700 }}>
                    {usr.badge}
                  </span>
                </div>
                <div>
                  <strong>{usr.answers} Solusi Terverifikasi</strong> • {usr.upvotes} Upvotes
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

