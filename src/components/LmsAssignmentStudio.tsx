"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { LmsLesson, LmsAssignmentConfig, LmsAssignmentRubric, LmsAssignmentTaskItem } from "../types/simak";

interface LmsAssignmentStudioProps {
  lesson: LmsLesson;
  onChange: (updated: LmsLesson) => void;
}

const DEFAULT_ASSIGNMENT_TASKS: LmsAssignmentTaskItem[] = [
  {
    id: "task-1",
    order: 1,
    title: "Perancangan Skema Database & Migrasi Tabel",
    description: "Rancang skema relasional PostgreSQL untuk sistem LMS dengan minimal 4 tabel utama: Users, Courses, Lessons, dan Submissions. Sediakan skrip migrasi up dan down yang dapat dieksekusi secara otomatis dan idempotent tanpa inkonsistensi foreign key.",
    acceptanceCriteria: "Skrip migrasi database berhasil dieksekusi dari awal (fresh migration) dan mencakup index relasi.",
    studentAnswer: "Skema database telah dirancang menggunakan PostgreSQL dengan Prisma ORM. File skema terletak di /prisma/schema.prisma dan berkas migrasi di /prisma/migrations. Seluruh tabel telah dilengkapi relasi foreign key dan index pada kolom foreign key.",
  },
  {
    id: "task-2",
    order: 2,
    title: "Implementasi RESTful CRUD Endpoint & Validasi DTO",
    description: "Kembangkan seluruh endpoint RESTful API untuk Course dan Lesson. Terapkan validasi skema input request body menggunakan library validasi (misal: Zod / Joi / Class-Validator). Format JSON response wajib konsisten: { success, data, message, errors }.",
    acceptanceCriteria: "Semua endpoint merespons dengan HTTP status code yang tepat (200, 201, 400, 404, 500) dan pesan error informatif.",
    studentAnswer: "Endpoint CRUD diimplementasikan di controller /src/controllers/course.controller.ts dan divalidasi dengan Zod schema di /src/schemas/course.schema.ts. Response error mengembalikan kode 400 beserta array rincian validasi.",
  },
  {
    id: "task-3",
    order: 3,
    title: "Sistem Otentikasi & Autorisasi JWT Role-Based",
    description: "Implementasikan alur otentikasi login dan register dengan password hashing bcrypt (salt >= 10). Generate JWT access token dengan masa kedaluwarsa 24 jam dan buat middleware penjaga rute privat untuk membedakan hak akses Mahasiswa dan Mentor/Admin.",
    acceptanceCriteria: "Endpoint tertutup menolak akses tanpa token (401 Unauthorized) atau jika peran pengguna tidak memiliki izin (403 Forbidden).",
    studentAnswer: "Middleware autentikasi JWT dibuat di /src/middleware/auth.ts dengan verifikasi signature dan claim role pengguna. Password di-hash menggunakan bcryptjs 12 salt rounds sebelum disimpan ke database.",
  },
  {
    id: "task-4",
    order: 4,
    title: "Dokumentasi Lengkap README & Pengujian API",
    description: "Tuliskan panduan setup lengkap di file README.md, mencakup variabel lingkungan (.env.example), langkah instalasi dependensi, instruksi menjalankan server lokal, dan contoh pemanggilan endpoint via Postman atau cURL.",
    acceptanceCriteria: "Dokumentasi README memungkinkan reviewer menjalankan seluruh API secara lokal dalam waktu kurang dari 5 menit.",
    studentAnswer: "File README.md telah dilengkapi dengan diagram alur arsitektur, daftar env variables di .env.example, serta file collection Postman ekspor di /postman/lms-collection.json.",
  },
];

const DEFAULT_ASSIGNMENT_CONFIG: LmsAssignmentConfig = {
  intro: "Dalam tugas proyek mandiri ini, Anda diminta membangun arsitektur backend RESTful API yang aman dengan otentikasi JWT, validasi skema input, dan penanganan error terpusat sesuai standar industri.",
  submissionFormat: {
    allowGithub: true,
    allowDemoUrl: true,
    allowFileUpload: true,
    fileTypesAllowed: ".zip, .rar, .pdf",
    maxFileSizeMb: 50,
  },
  tasks: DEFAULT_ASSIGNMENT_TASKS,
  requiredFiles: ["README.md", "package.json", ".env.example", "api-spec.json"],
  rubrics: [
    {
      id: "r1",
      criteria: "Struktur Arsitektur & Clean Code",
      weight: 30,
      description: "Pemisahan concerns antara controller, service, dan repository sesuai standar industri tanpa coupling ketat.",
    },
    {
      id: "r2",
      criteria: "Fungsionalitas CRUD & Validasi Input",
      weight: 35,
      description: "Semua endpoint RESTful beroperasi dengan validasi DTO, status kode HTTP yang tepat, dan response konsisten.",
    },
    {
      id: "r3",
      criteria: "Keamanan Otentikasi & Autorisasi JWT",
      weight: 20,
      description: "Proteksi route privat, hashing password dengan bcrypt (salt round >= 10), dan handling token expiration.",
    },
    {
      id: "r4",
      criteria: "Dokumentasi API & Petunjuk Instalasi",
      weight: 15,
      description: "README jelas mencakup environment variables, langkah migrasi database, dan pengujian API via Postman/cURL.",
    },
  ],
  tipsAndTricks: [
    "Pastikan file `.env` tidak ter-commit ke repositori GitHub, sediakan file `.env.example`.",
    "Jalankan linter dan test suite lokal sebelum mengompres berkas proyek menjadi arsip ZIP.",
    "Sertakan tautan live deploy jika memungkinkan untuk mempercepat proses review mentor.",
  ],
  starterCodeUrl: "https://github.com/anvieo-edu/rest-api-starter-kit",
  starterAssetUrl: "https://assets.anvieo.edu/starter/project-assets.zip",
  slaReviewHours: 48,
};

export default function LmsAssignmentStudio({ lesson, onChange }: LmsAssignmentStudioProps) {
  const [viewMode, setViewMode] = useState<"config" | "student_view">("config");

  // New item inputs
  const [newRequiredFile, setNewRequiredFile] = useState("");
  const [newTip, setNewTip] = useState("");

  // Student simulation form states
  const [studentGithub, setStudentGithub] = useState("");
  const [studentDemo, setStudentDemo] = useState("");
  const [studentNotes, setStudentNotes] = useState("");
  const [simulatedUploadedFile, setSimulatedUploadedFile] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const config = lesson.assignmentConfig || DEFAULT_ASSIGNMENT_CONFIG;

  const updateConfig = (partial: Partial<LmsAssignmentConfig>) => {
    const nextConfig: LmsAssignmentConfig = { ...config, ...partial };
    onChange({
      ...lesson,
      assignmentConfig: nextConfig,
    });
  };

  // Task Items Handlers
  const handleAddTask = () => {
    const currentTasks = config.tasks || [];
    const nextOrder = currentTasks.length + 1;
    const newTask: LmsAssignmentTaskItem = {
      id: `task-${Date.now()}`,
      order: nextOrder,
      title: `Tugas Nomor #${nextOrder}`,
      description: "Tuliskan uraian instruksi lengkap dan latar belakang teknis untuk tugas nomor ini...",
      acceptanceCriteria: "Kriteria penerimaan atau standar kelulusan tugas...",
      studentAnswer: "",
    };
    updateConfig({ tasks: [...currentTasks, newTask] });
  };

  const handleUpdateTask = (id: string, partial: Partial<LmsAssignmentTaskItem>) => {
    const currentTasks = config.tasks || [];
    const nextTasks = currentTasks.map((t) => (t.id === id ? { ...t, ...partial } : t));
    updateConfig({ tasks: nextTasks });
  };

  const handleDeleteTask = (id: string) => {
    const currentTasks = config.tasks || [];
    const nextTasks = currentTasks
      .filter((t) => t.id !== id)
      .map((t, idx) => ({ ...t, order: idx + 1 }));
    updateConfig({ tasks: nextTasks });
  };

  // Rubric Handlers
  const handleAddRubric = () => {
    const newRubric: LmsAssignmentRubric = {
      id: `rub-${Date.now()}`,
      criteria: "Kriteria Baru",
      weight: 10,
      description: "Deskripsi standar kelulusan kriteria ini...",
    };
    updateConfig({ rubrics: [...config.rubrics, newRubric] });
  };

  const handleUpdateRubric = (id: string, partial: Partial<LmsAssignmentRubric>) => {
    const nextRubrics = config.rubrics.map((r) => (r.id === id ? { ...r, ...partial } : r));
    updateConfig({ rubrics: nextRubrics });
  };

  const handleDeleteRubric = (id: string) => {
    const nextRubrics = config.rubrics.filter((r) => r.id !== id);
    updateConfig({ rubrics: nextRubrics });
  };

  // Required Files Handlers
  const handleAddRequiredFile = () => {
    if (!newRequiredFile.trim()) return;
    updateConfig({ requiredFiles: [...config.requiredFiles, newRequiredFile.trim()] });
    setNewRequiredFile("");
  };

  const handleDeleteRequiredFile = (idx: number) => {
    const nextFiles = config.requiredFiles.filter((_, i) => i !== idx);
    updateConfig({ requiredFiles: nextFiles });
  };

  // Tips Handlers
  const handleAddTip = () => {
    if (!newTip.trim()) return;
    updateConfig({ tipsAndTricks: [...config.tipsAndTricks, newTip.trim()] });
    setNewTip("");
  };

  const handleDeleteTip = (idx: number) => {
    const nextTips = config.tipsAndTricks.filter((_, i) => i !== idx);
    updateConfig({ tipsAndTricks: nextTips });
  };

  const totalRubricWeight = config.rubrics.reduce((acc, r) => acc + (Number(r.weight) || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden", background: "var(--bx-surface)" }}>
      {/* Studio Sub-Header: Mode Switcher */}
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
          <FlatIcon type="code" size={16} color="var(--brand)" />
          <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--brand)" }}>
            Studio Penugasan &amp; Rubrik Submission
          </span>
          <span
            style={{
              fontSize: "0.68rem",
              padding: "1px 6px",
              borderRadius: "3px",
              background: totalRubricWeight === 100 ? "#DCFCE7" : "#FEF3C7",
              color: totalRubricWeight === 100 ? "#166534" : "#92400E",
              fontWeight: 700,
            }}
          >
            Total Bobot: {totalRubricWeight}% {totalRubricWeight === 100 ? "✓ Sesuai" : "(Harus 100%)"}
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
            <span>Konfigurasi Tugas &amp; Rubrik</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("student_view")}
            style={{
              padding: "4px 12px",
              border: "none",
              borderRadius: "3px",
              background: viewMode === "student_view" ? "var(--brand)" : "transparent",
              color: viewMode === "student_view" ? "#FFFFFF" : "var(--ink)",
              fontSize: "0.74rem",
              fontWeight: viewMode === "student_view" ? 700 : 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FlatIcon type="eye" size={13} color={viewMode === "student_view" ? "#FFFFFF" : "var(--ink)"} />
            <span>Simulasi Tampilan Mahasiswa</span>
          </button>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px" }}>
        {/* ============================================================== */}
        {/* TAB 1: CONFIGURATION MODE */}
        {/* ============================================================== */}
        {viewMode === "config" && (
          <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* 1. Pengantar & Objektif Tugas */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <FlatIcon type="document" size={15} color="var(--brand)" />
                <label style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--brand)" }}>
                  1. Pengantar &amp; Objektif Pembelajaran Tugas
                </label>
              </div>
              <p style={{ margin: "0 0 8px", fontSize: "0.76rem", color: "var(--muted)" }}>
                Jelaskan skenario proyek, masalah yang dipecahkan, dan kompetensi yang diuji dalam tugas ini.
              </p>
              <textarea
                rows={4}
                value={config.intro}
                onChange={(e) => updateConfig({ intro: e.target.value })}
                placeholder="Tuliskan latar belakang studi kasus dan tujuan utama pengerjaan tugas..."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid var(--bx-border)",
                  fontSize: "0.82rem",
                  lineHeight: 1.5,
                }}
              />
            </div>

            {/* 2. Format Pengumpulan & Ketentuan Upload File */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <FlatIcon type="upload" size={15} color="var(--brand)" />
                <label style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--brand)" }}>
                  2. Instruksi Submission &amp; Ketentuan Upload Berkas
                </label>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: "0.76rem", color: "var(--muted)" }}>
                Tentukan format pengumpulan yang wajib disediakan mahasiswa dan ketentuan batas ukuran file.
              </p>

              {/* Toggles */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 10px", background: "var(--bx-bg-alt)", border: "1px solid var(--bx-border)", borderRadius: "4px", fontSize: "0.78rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={config.submissionFormat.allowGithub}
                    onChange={(e) =>
                      updateConfig({
                        submissionFormat: { ...config.submissionFormat, allowGithub: e.target.checked },
                      })
                    }
                  />
                  <span>Wajib Tautan Repositori GitHub</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 10px", background: "var(--bx-bg-alt)", border: "1px solid var(--bx-border)", borderRadius: "4px", fontSize: "0.78rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={config.submissionFormat.allowDemoUrl}
                    onChange={(e) =>
                      updateConfig({
                        submissionFormat: { ...config.submissionFormat, allowDemoUrl: e.target.checked },
                      })
                    }
                  />
                  <span>Wajib Tautan Live Demo / Deploy</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 10px", background: "var(--bx-bg-alt)", border: "1px solid var(--bx-border)", borderRadius: "4px", fontSize: "0.78rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={config.submissionFormat.allowFileUpload}
                    onChange={(e) =>
                      updateConfig({
                        submissionFormat: { ...config.submissionFormat, allowFileUpload: e.target.checked },
                      })
                    }
                  />
                  <span>Wajib Unggah Berkas Arsip Proyek</span>
                </label>
              </div>

              {/* Upload Configuration Fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", padding: "12px", background: "var(--bx-bg-alt)", borderRadius: "4px", border: "1px solid var(--bx-border)" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "4px" }}>
                    Format Berkas yang Diizinkan:
                  </label>
                  <input
                    type="text"
                    value={config.submissionFormat.fileTypesAllowed}
                    onChange={(e) =>
                      updateConfig({
                        submissionFormat: { ...config.submissionFormat, fileTypesAllowed: e.target.value },
                      })
                    }
                    placeholder=".zip, .rar, .pdf"
                    style={{ width: "100%", padding: "5px 8px", borderRadius: "3px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "4px" }}>
                    Ukuran Maksimum Berkas (MB):
                  </label>
                  <input
                    type="number"
                    value={config.submissionFormat.maxFileSizeMb}
                    onChange={(e) =>
                      updateConfig({
                        submissionFormat: { ...config.submissionFormat, maxFileSizeMb: Number(e.target.value) },
                      })
                    }
                    style={{ width: "100%", padding: "5px 8px", borderRadius: "3px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "4px" }}>
                    SLA Waktu Review Mentor (Jam):
                  </label>
                  <input
                    type="number"
                    value={config.slaReviewHours}
                    onChange={(e) => updateConfig({ slaReviewHours: Number(e.target.value) })}
                    style={{ width: "100%", padding: "5px 8px", borderRadius: "3px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Butir Tugas & Instruksi Pengerjaan Bernomor */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FlatIcon type="code" size={15} color="var(--brand)" />
                  <label style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--brand)" }}>
                    3. Butir Tugas &amp; Instruksi Pengerjaan Bernomor (Wajib Uraian Teks)
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddTask}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    border: "none",
                    background: "var(--brand)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "0.74rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FlatIcon type="plus" size={12} color="#FFFFFF" />
                  <span>Tambah Nomor Tugas</span>
                </button>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: "0.76rem", color: "var(--muted)" }}>
                Setiap nomor tugas wajib memiliki instruksi teks uraian lengkap (bukan hanya poin daftar) agar mahasiswa memahami konteks teknis dan kriteria penerimaan secara mendalam.
              </p>

              {/* Numbered Task Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(config.tasks || DEFAULT_ASSIGNMENT_TASKS).map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "6px",
                      padding: "14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--bx-border)", paddingBottom: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "0.76rem", fontWeight: 800, padding: "2px 8px", borderRadius: "3px", background: "var(--brand)", color: "#FFFFFF" }}>
                          Nomor #{task.order}
                        </span>
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) => handleUpdateTask(task.id, { title: e.target.value })}
                          placeholder="Judul Tugas..."
                          style={{ fontWeight: 700, fontSize: "0.82rem", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "3px", padding: "4px 8px", width: "360px" }}
                        />
                      </div>

                      {(config.tasks || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "0.74rem" }}
                        >
                          Hapus Nomor Ini
                        </button>
                      )}
                    </div>

                    {/* Full Instruction Textarea */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "3px" }}>
                        Uraian Teks Instruksi Lengkap:
                      </label>
                      <textarea
                        rows={3}
                        value={task.description}
                        onChange={(e) => handleUpdateTask(task.id, { description: e.target.value })}
                        placeholder="Tuliskan petunjuk teknis, skenario, dan requirement lengkap untuk nomor tugas ini..."
                        style={{ width: "100%", padding: "6px 8px", borderRadius: "3px", border: "1px solid var(--bx-border)", fontSize: "0.78rem", background: "var(--bx-surface)", lineHeight: 1.5 }}
                      />
                    </div>

                    {/* Acceptance Criteria */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "3px", color: "var(--brand)" }}>
                        Kriteria Penerimaan (Acceptance Criteria):
                      </label>
                      <input
                        type="text"
                        value={task.acceptanceCriteria || ""}
                        onChange={(e) => handleUpdateTask(task.id, { acceptanceCriteria: e.target.value })}
                        placeholder="Standar hasil yang diharapkan dari nomor ini..."
                        style={{ width: "100%", padding: "5px 8px", borderRadius: "3px", border: "1px solid var(--bx-border)", fontSize: "0.78rem", background: "var(--bx-surface)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Ketentuan Berkas Wajib */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <FlatIcon type="certificate" size={15} color="var(--brand)" />
                <label style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--brand)" }}>
                  4. Ketentuan Berkas Wajib dalam Proyek
                </label>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "0.76rem", color: "var(--muted)" }}>
                Daftar file yang wajib ada di dalam repositori atau berkas ZIP mahasiswa (misal: README.md, package.json).
              </p>

              {/* Chips List */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                {config.requiredFiles.map((file, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 10px",
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "4px",
                      fontSize: "0.76rem",
                      fontFamily: "monospace",
                      fontWeight: 600,
                    }}
                  >
                    <span>{file}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteRequiredFile(idx)}
                      style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "0.76rem", padding: "0 2px" }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              {/* Add File Tag */}
              <div style={{ display: "flex", gap: "6px", maxWidth: "420px" }}>
                <input
                  type="text"
                  placeholder="Tambah berkas wajib (misal: .env.example)..."
                  value={newRequiredFile}
                  onChange={(e) => setNewRequiredFile(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddRequiredFile();
                    }
                  }}
                  style={{ flex: 1, padding: "5px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                />
                <button
                  type="button"
                  onClick={handleAddRequiredFile}
                  style={{ padding: "5px 12px", borderRadius: "4px", border: "none", background: "var(--brand)", color: "#FFFFFF", fontWeight: 700, fontSize: "0.74rem", cursor: "pointer" }}
                >
                  Tambah Berkas
                </button>
              </div>
            </div>

            {/* 5. Kriteria Utama & Rubrik Penilaian */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FlatIcon type="target" size={15} color="var(--brand)" />
                  <label style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--brand)" }}>
                    5. Kriteria Utama &amp; Rubrik Penilaian (Total Bobot 100%)
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddRubric}
                  style={{ padding: "4px 10px", borderRadius: "4px", border: "none", background: "var(--brand)", color: "#FFFFFF", fontWeight: 700, fontSize: "0.74rem", cursor: "pointer" }}
                >
                  Tambah Kriteria
                </button>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: "0.76rem", color: "var(--muted)" }}>
                Rubrik penilaian transparan digunakan mentor untuk menilai submission mahasiswa secara objektif.
              </p>

              {/* Rubric Table */}
              <div style={{ overflowX: "auto", border: "1px solid var(--bx-border)", borderRadius: "4px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                  <thead>
                    <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                      <th style={{ padding: "8px 10px", width: "30%" }}>Kriteria Penilaian</th>
                      <th style={{ padding: "8px 10px", width: "15%" }}>Bobot (%)</th>
                      <th style={{ padding: "8px 10px", width: "45%" }}>Standar Kelulusan / Deskripsi</th>
                      <th style={{ padding: "8px 10px", width: "10%", textAlign: "center" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.rubrics.map((rubric) => (
                      <tr key={rubric.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                        <td style={{ padding: "6px 10px" }}>
                          <input
                            type="text"
                            value={rubric.criteria}
                            onChange={(e) => handleUpdateRubric(rubric.id, { criteria: e.target.value })}
                            style={{ width: "100%", padding: "4px 6px", borderRadius: "3px", border: "1px solid var(--bx-border)", fontSize: "0.78rem", fontWeight: 600 }}
                          />
                        </td>
                        <td style={{ padding: "6px 10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <input
                              type="number"
                              min={1}
                              max={100}
                              value={rubric.weight}
                              onChange={(e) => handleUpdateRubric(rubric.id, { weight: Number(e.target.value) })}
                              style={{ width: "60px", padding: "4px 6px", borderRadius: "3px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                            />
                            <span>%</span>
                          </div>
                        </td>
                        <td style={{ padding: "6px 10px" }}>
                          <textarea
                            rows={2}
                            value={rubric.description}
                            onChange={(e) => handleUpdateRubric(rubric.id, { description: e.target.value })}
                            style={{ width: "100%", padding: "4px 6px", borderRadius: "3px", border: "1px solid var(--bx-border)", fontSize: "0.76rem" }}
                          />
                        </td>
                        <td style={{ padding: "6px 10px", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteRubric(rubric.id)}
                            style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "0.74rem" }}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. Tips & Trik Pengerjaan */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <FlatIcon type="star" size={15} color="var(--gold)" />
                <label style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--brand)" }}>
                  6. Tips &amp; Trik Pengerjaan Proyek
                </label>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "0.76rem", color: "var(--muted)" }}>
                Berikan tips praktis atau panduan antisipasi error umum agar mahasiswa dapat menyelesaikan tugas dengan baik.
              </p>

              {/* Tips List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
                {config.tipsAndTricks.map((tip, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 10px",
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "4px",
                      fontSize: "0.78rem",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FlatIcon type="star" size={13} color="var(--gold)" />
                      <span>{tip}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTip(idx)}
                      style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "0.74rem" }}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Tip Row */}
              <div style={{ display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  placeholder="Tulis tips atau trik baru..."
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTip();
                    }
                  }}
                  style={{ flex: 1, padding: "5px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                />
                <button
                  type="button"
                  onClick={handleAddTip}
                  style={{ padding: "5px 12px", borderRadius: "4px", border: "none", background: "var(--brand)", color: "#FFFFFF", fontWeight: 700, fontSize: "0.74rem", cursor: "pointer" }}
                >
                  Tambah Tips
                </button>
              </div>
            </div>

            {/* 6. Starter Code & Asset Pendukung */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <FlatIcon type="link" size={15} color="var(--brand)" />
                <label style={{ fontWeight: 700, fontSize: "0.84rem", color: "var(--brand)" }}>
                  7. Tautan Starter Code &amp; Berkas Asset Proyek
                </label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "4px" }}>
                    URL GitHub Starter Kit:
                  </label>
                  <input
                    type="url"
                    value={config.starterCodeUrl || ""}
                    onChange={(e) => updateConfig({ starterCodeUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "4px" }}>
                    URL Berkas Asset Pendukung (ZIP):
                  </label>
                  <input
                    type="url"
                    value={config.starterAssetUrl || ""}
                    onChange={(e) => updateConfig({ starterAssetUrl: e.target.value })}
                    placeholder="https://assets.anvieo.edu/..."
                    style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: STUDENT SIMULATION VIEW */}
        {/* ============================================================== */}
        {viewMode === "student_view" && (
          <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Header Card */}
            <div
              style={{
                background: "linear-gradient(135deg, var(--brand) 0%, #1E3A8A 100%)",
                color: "#FFFFFF",
                borderRadius: "8px",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Tugas Praktikum Mandiri
                </span>
                <h2 style={{ margin: "8px 0 4px", fontSize: "1.25rem", fontFamily: "var(--font-heading)" }}>
                  {lesson.title || "Tugas Proyek Mandiri"}
                </h2>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#E2E8F0" }}>
                  Estimasi Pengerjaan: {lesson.durationMinutes || 120} Menit • Review SLA: {config.slaReviewHours} Jam Kerja
                </p>
              </div>

              {config.starterCodeUrl && (
                <a
                  href={config.starterCodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "8px 16px",
                    background: "#FFFFFF",
                    color: "var(--brand)",
                    borderRadius: "4px",
                    fontWeight: 700,
                    fontSize: "0.76rem",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FlatIcon type="code" size={14} color="var(--brand)" />
                  <span>Lihat Starter Code</span>
                </a>
              )}
            </div>

            {/* Pengantar & Objektif */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "18px" }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "0.94rem", color: "var(--brand)" }}>
                Pengantar &amp; Objektif Tugas
              </h3>
              <p style={{ margin: 0, fontSize: "0.84rem", lineHeight: 1.6, color: "var(--ink)" }}>
                {config.intro}
              </p>
            </div>

            {/* DAFTAR BUTIR TUGAS & LEMBAR KERJA MAHASISWA (SETIAP NOMOR BISA MENULISKAN TEKS) */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "0.94rem", color: "var(--brand)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FlatIcon type="code" size={16} color="var(--brand)" />
                  <span>Daftar Butir Tugas &amp; Lembar Jawaban Teks Mahasiswa</span>
                </h3>
                <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                  {(config.tasks || DEFAULT_ASSIGNMENT_TASKS).length} Butir Tugas
                </span>
              </div>
              <p style={{ margin: "0 0 16px", fontSize: "0.78rem", color: "var(--muted)" }}>
                Mahasiswa wajib membaca instruksi setiap nomor tugas dan dapat menuliskan uraian teks penjelasan pengerjaan pada kolom jawaban yang disediakan.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {(config.tasks || DEFAULT_ASSIGNMENT_TASKS).map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "6px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {/* Header Nomor & Judul */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.76rem", fontWeight: 800, padding: "2px 8px", borderRadius: "3px", background: "var(--brand)", color: "#FFFFFF" }}>
                        Nomor #{task.order}
                      </span>
                      <strong style={{ fontSize: "0.88rem", color: "var(--brand)" }}>
                        {task.title}
                      </strong>
                    </div>

                    {/* Uraian Teks Instruksi Lengkap */}
                    <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "4px", padding: "12px", fontSize: "0.82rem", lineHeight: 1.6, color: "var(--ink)" }}>
                      <span style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: "4px", letterSpacing: "0.03em" }}>
                        Instruksi Teknis:
                      </span>
                      <p style={{ margin: 0 }}>{task.description}</p>
                    </div>

                    {/* Acceptance Criteria */}
                    {task.acceptanceCriteria && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "0.76rem", color: "#065F46", background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "6px 10px", borderRadius: "4px" }}>
                        <FlatIcon type="check" size={14} color="#059669" style={{ marginTop: "1px", flexShrink: 0 }} />
                        <span><strong>Standar Penerimaan:</strong> {task.acceptanceCriteria}</span>
                      </div>
                    )}

                    {/* Mahasiswa Teks Input per Nomor Tugas */}
                    <div style={{ marginTop: "4px" }}>
                      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "var(--brand)", marginBottom: "4px" }}>
                        Uraian Teks Jawaban / Solusi Mahasiswa (Nomor #{task.order}):
                      </label>
                      <textarea
                        rows={3}
                        value={task.studentAnswer || ""}
                        onChange={(e) => handleUpdateTask(task.id, { studentAnswer: e.target.value })}
                        placeholder={`Tuliskan teks uraian solusi, penjelasan kode, atau dokumentasi pengerjaan untuk Nomor #${task.order}...`}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "4px",
                          border: "1px solid var(--bx-border)",
                          fontSize: "0.8rem",
                          background: "var(--bx-surface)",
                          lineHeight: 1.5,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ketentuan Berkas Wajib */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "18px" }}>
              <h3 style={{ margin: "0 0 10px", fontSize: "0.94rem", color: "var(--brand)", display: "flex", alignItems: "center", gap: "6px" }}>
                <FlatIcon type="certificate" size={16} color="var(--brand)" />
                <span>Ketentuan Berkas Wajib</span>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {config.requiredFiles.map((file, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", background: "var(--bx-bg-alt)", padding: "6px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)" }}>
                    <span style={{ color: "#16A34A", fontWeight: 700 }}>✓</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{file}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rubrik Penilaian Mahasiswa */}
            <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "18px" }}>
              <h3 style={{ margin: "0 0 10px", fontSize: "0.94rem", color: "var(--brand)", display: "flex", alignItems: "center", gap: "6px" }}>
                <FlatIcon type="target" size={16} color="var(--brand)" />
                <span>Rubrik Penilaian Mentor ({totalRubricWeight}% Bobot)</span>
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                  <thead>
                    <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                      <th style={{ padding: "8px 10px" }}>Kriteria</th>
                      <th style={{ padding: "8px 10px", width: "80px" }}>Bobot</th>
                      <th style={{ padding: "8px 10px" }}>Deskripsi Penilaian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.rubrics.map((r) => (
                      <tr key={r.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                        <td style={{ padding: "8px 10px", fontWeight: 700 }}>{r.criteria}</td>
                        <td style={{ padding: "8px 10px", color: "var(--brand)", fontWeight: 700 }}>{r.weight}%</td>
                        <td style={{ padding: "8px 10px", color: "var(--muted)" }}>{r.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FORM SUBMISSION MAHASISWA (UPLOAD BERKAS & LINK) */}
            <div
              style={{
                background: "var(--bx-surface)",
                border: "2px solid var(--brand)",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(10, 46, 82, 0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--brand)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FlatIcon type="upload" size={18} color="var(--brand)" />
                  <span>Formulir Pengumpulan Tugas Mahasiswa</span>
                </h3>
                {isSubmitted && (
                  <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "3px", background: "#DCFCE7", color: "#166534", fontWeight: 700 }}>
                    ✓ Berhasil Dikirim
                  </span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {config.submissionFormat.allowGithub && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      Tautan Repositori GitHub Proyek <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/lms-rest-api"
                      value={studentGithub}
                      onChange={(e) => setStudentGithub(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                    />
                  </div>
                )}

                {config.submissionFormat.allowDemoUrl && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      Tautan Live Demo / Deployment (Opsional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://my-project.vercel.app"
                      value={studentDemo}
                      onChange={(e) => setStudentDemo(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                    />
                  </div>
                )}

                {config.submissionFormat.allowFileUpload && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      Unggah Berkas Proyek ({config.submissionFormat.fileTypesAllowed}, maks {config.submissionFormat.maxFileSizeMb}MB) <span style={{ color: "#EF4444" }}>*</span>
                    </label>

                    {/* Drag and Drop Box Simulation */}
                    <div
                      onClick={() => setSimulatedUploadedFile("submission-proyek-final.zip (14.2 MB)")}
                      style={{
                        border: "2px dashed var(--bx-border)",
                        borderRadius: "6px",
                        padding: "24px 16px",
                        textAlign: "center",
                        background: simulatedUploadedFile ? "#EFF6FF" : "var(--bx-bg-alt)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bx-surface)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                        <FlatIcon type="upload" size={18} color="var(--brand)" />
                      </div>

                      {simulatedUploadedFile ? (
                        <div>
                          <strong style={{ display: "block", fontSize: "0.84rem", color: "#1E40AF" }}>
                            ✓ {simulatedUploadedFile}
                          </strong>
                          <span style={{ fontSize: "0.72rem", color: "#64748B" }}>
                            Klik untuk mengganti berkas unggahan
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--brand)" }}>
                            Tarik berkas proyek ke sini atau klik untuk browse file
                          </span>
                          <p style={{ margin: "4px 0 0", fontSize: "0.72rem", color: "var(--muted)" }}>
                            Format yang didukung: {config.submissionFormat.fileTypesAllowed} • Maksimal {config.submissionFormat.maxFileSizeMb} MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Catatan untuk Reviewer
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan catatan tambahan jika ada instruksi khusus untuk menjalankan proyek..."
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.8rem" }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(true)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "4px",
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
                  }}
                >
                  <FlatIcon type="check" size={16} color="#FFFFFF" />
                  <span>{isSubmitted ? "Kirim Ulang Tugas" : "Kirim Tugas Sekarang"}</span>
                </button>
              </div>
            </div>

            {/* Tips & Trik Callout */}
            <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "6px", padding: "14px 18px", color: "#065F46" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "0.82rem", marginBottom: "6px" }}>
                <FlatIcon type="star" size={14} color="#059669" />
                <span>Tips &amp; Trik Pengerjaan</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.78rem", lineHeight: 1.6 }}>
                {config.tipsAndTricks.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
