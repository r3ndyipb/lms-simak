"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { LmsLesson, LmsDownloadConfig } from "../types/simak";

interface LmsDownloadStudioProps {
  lesson: LmsLesson;
  onChange: (updated: LmsLesson) => void;
}

const DEFAULT_DOWNLOAD_CONFIG: LmsDownloadConfig = {
  fileTitle: "Modul Praktikum & Cheatsheet Arsitektur Sistem Skala Tinggi.pdf",
  fileType: "pdf",
  fileSizeMb: 14.8,
  version: "v2.4",
  downloadUrl: "https://assets.anvieo.edu/materials/cheatsheet-arsitektur-web-v2.pdf",
  studyInstructions: "Unduh dan pelajari modul ini sebagai referensi pendamping praktikum. Bacalah Bab 3 mengenai Caching Strategy sebelum mengerjakan tugas proyek mingguan.",
};

export default function LmsDownloadStudio({ lesson, onChange }: LmsDownloadStudioProps) {
  const [viewMode, setViewMode] = useState<"config" | "preview">("config");
  const [simulatedUploading, setSimulatedUploading] = useState(false);
  const [downloadCounter, setDownloadCounter] = useState(142);

  const config = lesson.downloadConfig || DEFAULT_DOWNLOAD_CONFIG;

  const updateConfig = (partial: Partial<LmsDownloadConfig>) => {
    const nextConfig: LmsDownloadConfig = { ...config, ...partial };
    onChange({
      ...lesson,
      attachmentUrl: nextConfig.downloadUrl,
      downloadConfig: nextConfig,
    });
  };

  const handleSimulateUpload = () => {
    setSimulatedUploading(true);
    setTimeout(() => {
      setSimulatedUploading(false);
      updateConfig({
        fileTitle: "Bahan-Kuliah-LMS-Terbaru.pdf",
        fileSizeMb: 18.2,
        version: "v3.0",
        downloadUrl: "https://assets.anvieo.edu/storage/bahan-kuliah-lms-v3.pdf",
      });
    }, 800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden", background: "var(--bx-surface)" }}>
      {/* Studio Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          background: "var(--bx-bg-alt)",
          borderBottom: "1px solid var(--bx-border)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FlatIcon type="download" size={16} color="var(--brand)" />
          <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--brand)" }}>
            Studio Bahan Bacaan &amp; Berkas Unduhan
          </span>
          <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "3px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", color: "var(--muted)" }}>
            {config.fileType.toUpperCase()} • {config.fileSizeMb} MB • Versi {config.version}
          </span>
        </div>

        {/* View Switcher */}
        <div style={{ display: "flex", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "4px", padding: "1px" }}>
          <button
            type="button"
            onClick={() => setViewMode("config")}
            style={{
              padding: "4px 12px",
              border: "none",
              borderRadius: "3px",
              background: viewMode === "config" ? "var(--brand)" : "transparent",
              color: viewMode === "config" ? "#FFFFFF" : "var(--ink)",
              fontSize: "0.74rem",
              fontWeight: viewMode === "config" ? 700 : 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FlatIcon type="settings" size={13} color={viewMode === "config" ? "#FFFFFF" : "var(--ink)"} />
            <span>Konfigurasi Berkas</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("preview")}
            style={{
              padding: "4px 12px",
              border: "none",
              borderRadius: "3px",
              background: viewMode === "preview" ? "var(--brand)" : "transparent",
              color: viewMode === "preview" ? "#FFFFFF" : "var(--ink)",
              fontSize: "0.74rem",
              fontWeight: viewMode === "preview" ? 700 : 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FlatIcon type="eye" size={13} color={viewMode === "preview" ? "#FFFFFF" : "var(--ink)"} />
            <span>Preview Kartu Unduhan Mahasiswa</span>
          </button>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {/* ============================================================== */}
        {/* TAB 1: CONFIGURATION */}
        {/* ============================================================== */}
        {viewMode === "config" && (
          <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* File Metadata Card */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "16px" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: "0.88rem", color: "var(--brand)", display: "flex", alignItems: "center", gap: "6px" }}>
                <FlatIcon type="document" size={16} color="var(--brand)" />
                <span>Informasi &amp; Metadata Berkas</span>
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, marginBottom: "4px" }}>
                    Nama / Judul Dokumen:
                  </label>
                  <input
                    type="text"
                    value={config.fileTitle}
                    onChange={(e) => updateConfig({ fileTitle: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, marginBottom: "4px" }}>
                      Tipe / Format Berkas:
                    </label>
                    <select
                      value={config.fileType}
                      onChange={(e) => updateConfig({ fileType: e.target.value as any })}
                      style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                    >
                      <option value="pdf">PDF Document (.pdf)</option>
                      <option value="zip">ZIP Archive (.zip)</option>
                      <option value="pptx">Slide Presentasi (.pptx)</option>
                      <option value="code">Source Code / Repo Bundle</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, marginBottom: "4px" }}>
                      Ukuran Berkas (MB):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={config.fileSizeMb}
                      onChange={(e) => updateConfig({ fileSizeMb: Number(e.target.value) })}
                      style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, marginBottom: "4px" }}>
                      Versi Rilis:
                    </label>
                    <input
                      type="text"
                      value={config.version}
                      onChange={(e) => updateConfig({ version: e.target.value })}
                      placeholder="v1.0"
                      style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, marginBottom: "4px" }}>
                    URL Berkas / CDN Storage:
                  </label>
                  <input
                    type="url"
                    value={config.downloadUrl}
                    onChange={(e) => updateConfig({ downloadUrl: e.target.value })}
                    placeholder="https://assets.anvieo.edu/..."
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                  />
                </div>
              </div>
            </div>

            {/* Drag & Drop Upload Zone Simulator */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "16px" }}>
              <h3 style={{ margin: "0 0 10px", fontSize: "0.88rem", color: "var(--brand)", display: "flex", alignItems: "center", gap: "6px" }}>
                <FlatIcon type="upload" size={16} color="var(--brand)" />
                <span>Unggah Berkas Baru ke Cloud Storage</span>
              </h3>

              <div
                onClick={handleSimulateUpload}
                style={{
                  border: "2px dashed var(--bx-border)",
                  borderRadius: "6px",
                  padding: "24px 16px",
                  textAlign: "center",
                  background: simulatedUploading ? "#EFF6FF" : "var(--bx-bg-alt)",
                  cursor: "pointer",
                }}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bx-surface)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <FlatIcon type="upload" size={18} color="var(--brand)" />
                </div>

                {simulatedUploading ? (
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1D4ED8" }}>
                    Sedang mengunggah berkas ke server...
                  </span>
                ) : (
                  <div>
                    <strong style={{ display: "block", fontSize: "0.84rem", color: "var(--brand)" }}>
                      Klik atau seret file PDF / ZIP ke sini untuk upload
                    </strong>
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                      Berkas otomatis ter-host di CDN terenkripsi
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Study Instructions & Reading Guide */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "16px" }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "0.88rem", color: "var(--brand)", display: "flex", alignItems: "center", gap: "6px" }}>
                <FlatIcon type="book" size={16} color="var(--brand)" />
                <span>Petunjuk Membaca &amp; Instruksi Praktikum Mahasiswa</span>
              </h3>
              <textarea
                rows={4}
                value={config.studyInstructions}
                onChange={(e) => updateConfig({ studyInstructions: e.target.value })}
                placeholder="Tuliskan petunjuk studi mandiri mengenai bagian materi apa yang perlu dipelajari dari file ini..."
                style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: STUDENT DOWNLOAD CARD PREVIEW */}
        {/* ============================================================== */}
        {viewMode === "preview" && (
          <div style={{ maxWidth: "680px", margin: "20px auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                background: "var(--bx-surface)",
                border: "1px solid var(--bx-border)",
                borderRadius: "8px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Card Header with Large File Icon */}
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "8px",
                    background: config.fileType === "pdf" ? "#FEE2E2" : config.fileType === "zip" ? "#FEF3C7" : "#E0F2FE",
                    color: config.fileType === "pdf" ? "#DC2626" : config.fileType === "zip" ? "#B45309" : "#0284C7",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "0.78rem",
                    flexShrink: 0,
                  }}
                >
                  <FlatIcon type="download" size={20} color="currentColor" />
                  <span>{config.fileType.toUpperCase()}</span>
                </div>

                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: "0 0 6px", fontSize: "1.05rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                    {config.fileTitle}
                  </h2>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.72rem", color: "var(--muted)" }}>
                    <span style={{ padding: "1px 6px", borderRadius: "3px", background: "var(--bx-bg-alt)", border: "1px solid var(--bx-border)", fontWeight: 600 }}>
                      Versi {config.version}
                    </span>
                    <span>•</span>
                    <span>{config.fileSizeMb} MB</span>
                    <span>•</span>
                    <span>{downloadCounter} Kali Diunduh</span>
                  </div>
                </div>
              </div>

              {/* Instructions Box */}
              {config.studyInstructions && (
                <div style={{ background: "var(--bx-bg-alt)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "12px 14px", fontSize: "0.82rem", lineHeight: 1.5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--brand)", marginBottom: "4px", fontWeight: 700 }}>
                    <FlatIcon type="book" size={14} color="var(--brand)" />
                    <span>Petunjuk Pembelajaran:</span>
                  </div>
                  <p style={{ margin: 0, color: "var(--ink)" }}>{config.studyInstructions}</p>
                </div>
              )}

              {/* Primary Download Button */}
              <button
                type="button"
                onClick={() => setDownloadCounter(downloadCounter + 1)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "6px",
                  border: "none",
                  background: "var(--brand)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 2px 4px rgba(10, 46, 82, 0.2)",
                }}
              >
                <FlatIcon type="download" size={16} color="#FFFFFF" />
                <span>Unduh Berkas Sekarang ({config.fileSizeMb} MB)</span>
              </button>

              <div style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--muted)" }}>
                Lisensi Materi: Hak Cipta dilindungi undang-undang • Khusus peserta terdaftar LMS
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
