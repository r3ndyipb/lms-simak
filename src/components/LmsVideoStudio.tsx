"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { LmsLesson, LmsVideoConfig } from "../types/simak";
import LmsRichContentEditor from "./LmsRichContentEditor";

interface LmsVideoStudioProps {
  lesson: LmsLesson;
  onChange: (updated: LmsLesson) => void;
}

const DEFAULT_VIDEO_CONFIG: LmsVideoConfig = {
  provider: "youtube",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  durationMinutes: 20,
  chapters: [
    { timeSeconds: 0, title: "00:00 - Pengantar & Peta Konsep" },
    { timeSeconds: 180, title: "03:00 - Konsep Inti & Arsitektur" },
    { timeSeconds: 650, title: "10:50 - Live Coding & Implementasi" },
    { timeSeconds: 1050, title: "17:30 - Kesimpulan & Rangkuman" },
  ],
};

export default function LmsVideoStudio({ lesson, onChange }: LmsVideoStudioProps) {
  const [activeTab, setActiveTab] = useState<"player" | "notes">("player");
  const [newChapterTime, setNewChapterTime] = useState("");
  const [newChapterTitle, setNewChapterTitle] = useState("");

  const currentUrl = lesson.contentUrl || lesson.videoConfig?.videoUrl || "";
  const config = lesson.videoConfig || DEFAULT_VIDEO_CONFIG;

  // Extract embeddable URL
  const parseEmbed = (rawUrl: string) => {
    if (!rawUrl || !rawUrl.trim()) return { type: "empty", url: "" };
    const trimmed = rawUrl.trim();

    // YouTube regex
    const yt = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (yt) {
      return {
        type: "youtube",
        url: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1`,
      };
    }

    // Vimeo regex
    const vim = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/);
    if (vim) {
      return {
        type: "vimeo",
        url: `https://player.vimeo.com/video/${vim[3]}`,
      };
    }

    // Direct MP4 / WebM
    if (trimmed.match(/\.(mp4|webm|ogg)($|\?)/i)) {
      return {
        type: "mp4",
        url: trimmed,
      };
    }

    return { type: "other", url: trimmed };
  };

  const embedInfo = parseEmbed(currentUrl);

  const handleUrlChange = (url: string) => {
    const nextCfg: LmsVideoConfig = {
      ...config,
      videoUrl: url,
      provider: url.includes("vimeo") ? "vimeo" : url.includes("youtu") ? "youtube" : "mp4",
    };
    onChange({
      ...lesson,
      contentUrl: url,
      videoConfig: nextCfg,
    });
  };

  const handleAddChapter = () => {
    if (!newChapterTitle) return;
    const parts = newChapterTime.split(":");
    let sec = 0;
    if (parts.length === 2) {
      sec = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    } else if (parts.length === 1) {
      sec = parseInt(parts[0], 10) || 0;
    }
    const nextChapters = [...(config.chapters || []), { timeSeconds: sec, title: `${newChapterTime || "00:00"} - ${newChapterTitle}` }];
    onChange({
      ...lesson,
      videoConfig: { ...config, chapters: nextChapters },
    });
    setNewChapterTime("");
    setNewChapterTitle("");
  };

  const handleDeleteChapter = (idx: number) => {
    const nextChapters = (config.chapters || []).filter((_, i) => i !== idx);
    onChange({
      ...lesson,
      videoConfig: { ...config, chapters: nextChapters },
    });
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", overflow: "hidden", background: "var(--bx-surface)" }}>
      {/* LEFT PANE: VIDEO PLAYER PREVIEW & SOURCE CONTROL */}
      <div
        style={{
          flex: "1 1 58%",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--bx-border)",
          background: "#090D16",
          color: "#F8FAFC",
          overflowY: "auto",
        }}
      >
        {/* Source URL Bar */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #1E293B", background: "#0F172A", display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--gold)", fontWeight: 700, fontSize: "0.78rem" }}>
              <FlatIcon type="video" size={16} color="var(--gold)" />
              <span>Sumber Video:</span>
            </div>
            <input
              type="url"
              value={currentUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Masukkan link YouTube, Vimeo, atau MP4 (misal: https://www.youtube.com/watch?v=...)"
              style={{
                flex: 1,
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #334155",
                background: "#1E293B",
                color: "#FFFFFF",
                fontSize: "0.82rem",
              }}
            />
            {currentUrl && (
              <button
                type="button"
                onClick={() => handleUrlChange("")}
                style={{ padding: "4px 8px", background: "#334155", border: "none", borderRadius: "4px", color: "#94A3B8", cursor: "pointer", fontSize: "0.72rem" }}
              >
                Kosongkan
              </button>
            )}
          </div>

          {/* Quick Presets */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "0.72rem" }}>
            <span style={{ color: "#94A3B8" }}>Preset Uji Coba:</span>
            <button
              type="button"
              onClick={() => handleUrlChange("https://www.youtube.com/watch?v=SqcY0GlETPk")}
              style={{ padding: "2px 8px", borderRadius: "3px", border: "1px solid #334155", background: "#1E293B", color: "#60A5FA", cursor: "pointer" }}
            >
              ▶ YouTube: React Tutorial
            </button>
            <button
              type="button"
              onClick={() => handleUrlChange("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")}
              style={{ padding: "2px 8px", borderRadius: "3px", border: "1px solid #334155", background: "#1E293B", color: "#34D399", cursor: "pointer" }}
            >
              ▶ Direct MP4: Stream Demo
            </button>
          </div>
        </div>

        {/* REAL INTERACTIVE VIDEO PLAYER PREVIEW */}
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", flexShrink: 0 }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              background: "#000000",
              borderRadius: "6px",
              overflow: "hidden",
              border: "1px solid #1E293B",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
            }}
          >
            {embedInfo.type === "youtube" || embedInfo.type === "vimeo" ? (
              <iframe
                src={embedInfo.url}
                title="Video Preview Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            ) : embedInfo.type === "mp4" ? (
              <video
                controls
                src={embedInfo.url}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748B",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  <FlatIcon type="video" size={24} color="var(--gold)" />
                </div>
                <strong style={{ color: "#F8FAFC", fontSize: "0.9rem", marginBottom: "4px" }}>
                  Pemutar Video Belum Aktif
                </strong>
                <p style={{ margin: 0, fontSize: "0.76rem", maxWidth: "380px", color: "#94A3B8" }}>
                  Masukkan URL video di kolom atas atau klik tombol preset untuk melihat pemutaran video secara langsung.
                </p>
              </div>
            )}
          </div>

          {/* Chapters & Timestamps Navigator */}
          <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: "6px", padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#F8FAFC", display: "flex", alignItems: "center", gap: "6px" }}>
                <FlatIcon type="clock" size={14} color="var(--gold)" />
                Daftar Bab &amp; Timestamp Video ({(config.chapters || []).length} Bab)
              </span>
              <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                Durasi: {lesson.durationMinutes || config.durationMinutes || 15} Menit
              </span>
            </div>

            {/* Existing Chapters */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
              {(config.chapters || []).map((ch, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 10px",
                    background: "#1E293B",
                    borderRadius: "4px",
                    fontSize: "0.76rem",
                  }}
                >
                  <span style={{ color: "#E2E8F0" }}>{ch.title}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteChapter(idx)}
                    style={{ background: "transparent", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "0.72rem" }}
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            {/* Add Chapter Row */}
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input
                type="text"
                placeholder="00:00"
                value={newChapterTime}
                onChange={(e) => setNewChapterTime(e.target.value)}
                style={{ width: "70px", padding: "5px 8px", borderRadius: "4px", border: "1px solid #334155", background: "#1E293B", color: "#FFFFFF", fontSize: "0.74rem" }}
              />
              <input
                type="text"
                placeholder="Judul bab materi baru..."
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                style={{ flex: 1, padding: "5px 8px", borderRadius: "4px", border: "1px solid #334155", background: "#1E293B", color: "#FFFFFF", fontSize: "0.74rem" }}
              />
              <button
                type="button"
                onClick={handleAddChapter}
                style={{ padding: "5px 12px", borderRadius: "4px", border: "none", background: "var(--brand)", color: "#FFFFFF", fontWeight: 700, fontSize: "0.74rem", cursor: "pointer" }}
              >
                Tambah Bab
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: TRANSCRIPT & LECTURE NOTES (FIT HEIGHT) */}
      <div style={{ flex: "1 1 42%", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 700, color: "var(--brand)" }}>
            <FlatIcon type="document" size={15} color="var(--brand)" />
            <span>Transkrip Kuliah &amp; Catatan Materi</span>
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Tersimpan otomatis</span>
        </div>

        <div style={{ flex: 1, height: "100%", overflow: "hidden" }}>
          <LmsRichContentEditor
            title={lesson.title}
            onTitleChange={(t) => onChange({ ...lesson, title: t })}
            summary={lesson.summary}
            onSummaryChange={(s) => onChange({ ...lesson, summary: s })}
            value={lesson.textContent || ""}
            onChange={(val) => onChange({ ...lesson, textContent: val })}
            placeholder="Ketik ringkasan video, transkrip materi penting, atau tautan bacaan rujukan di sini..."
          />
        </div>
      </div>
    </div>
  );
}

