"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { LmsLesson, LmsQuizConfig, LmsQuizQuestion } from "../types/simak";

interface LmsQuizStudioProps {
  lesson: LmsLesson;
  onChange: (updated: LmsLesson) => void;
}

const DEFAULT_QUIZ_CONFIG: LmsQuizConfig = {
  passingScore: 75,
  durationMinutes: 15,
  randomizeQuestions: true,
  showExplanationImmediately: true,
  questions: [
    {
      id: "q1",
      type: "multiple_choice",
      prompt: "Manakah metode HTTP yang paling tepat dan idempotent untuk memperbarui sebagian (partial update) data entitas pada arsitektur RESTful API?",
      questionText: "Manakah metode HTTP yang paling tepat dan idempotent untuk memperbarui sebagian (partial update) data entitas pada arsitektur RESTful API?",
      options: [
        { id: "opt1", label: "A", text: "POST", isCorrect: false },
        { id: "opt2", label: "B", text: "PATCH", isCorrect: true },
        { id: "opt3", label: "C", text: "PUT", isCorrect: false },
        { id: "opt4", label: "D", text: "OPTIONS", isCorrect: false },
      ],
      correctOptionId: "opt2",
      correctOptionIds: ["opt2"],
      explanation: "HTTP PATCH dirancang secara spesifik untuk melakukan modifikasi sebagian (partial update) terhadap resource, sedangkan PUT digunakan untuk replace seluruh representasi resource.",
      points: 20,
    },
    {
      id: "q2",
      type: "multiple_choice",
      prompt: "Apa fungsi utama dari claim 'exp' yang terdapat di dalam payload JSON Web Token (JWT)?",
      questionText: "Apa fungsi utama dari claim 'exp' yang terdapat di dalam payload JSON Web Token (JWT)?",
      options: [
        { id: "opt1", label: "A", text: "Menentukan waktu kedaluwarsa (expiration time) token dalam format UNIX timestamp", isCorrect: true },
        { id: "opt2", label: "B", text: "Menyimpan password pengguna yang telah dienkripsi dengan salt", isCorrect: false },
        { id: "opt3", label: "C", text: "Menyimpan kunci rahasia HMAC SHA-256 server", isCorrect: false },
        { id: "opt4", label: "D", text: "Menentukan level hak akses pengguna dalam aplikasi", isCorrect: false },
      ],
      correctOptionId: "opt1",
      correctOptionIds: ["opt1"],
      explanation: "Claim 'exp' (Expiration Time) mengidentifikasi waktu kedaluwarsa pada atau setelah token tidak boleh diterima lagi untuk verifikasi otorisasi.",
      points: 20,
    },
    {
      id: "q3",
      type: "multiple_select",
      prompt: "Manakah dari teknologi framework berikut yang secara native mendukung arsitektur Server-Side Rendering (SSR) pada ekosistem JavaScript modern? (Pilih semua yang benar)",
      questionText: "Manakah dari teknologi framework berikut yang secara native mendukung arsitektur Server-Side Rendering (SSR) pada ekosistem JavaScript modern? (Pilih semua yang benar)",
      options: [
        { id: "opt1", label: "A", text: "Next.js (React Framework)", isCorrect: true },
        { id: "opt2", label: "B", text: "Nuxt (Vue Framework)", isCorrect: true },
        { id: "opt3", label: "C", text: "Create React App (CRA Static SPA)", isCorrect: false },
        { id: "opt4", label: "D", text: "Remix / React Router v7", isCorrect: true },
      ],
      correctOptionId: "opt1",
      correctOptionIds: ["opt1", "opt2", "opt4"],
      explanation: "Next.js, Nuxt, dan Remix dirancang dengan kapabilitas Server-Side Rendering (SSR) terintegrasi, sedangkan Create React App (CRA) murni Client-Side Rendered (CSR SPA).",
      points: 20,
    },
    {
      id: "q4",
      type: "multiple_choice",
      prompt: "Status kode HTTP 401 Unauthorized secara spesifik menunjukkan bahwa:",
      questionText: "Status kode HTTP 401 Unauthorized secara spesifik menunjukkan bahwa:",
      options: [
        { id: "opt1", label: "A", text: "Permintaan valid tetapi server melarang akses resource (Forbidden)", isCorrect: false },
        { id: "opt2", label: "B", text: "Permintaan belum terotentikasi dan memerlukan kredensial otentikasi yang valid", isCorrect: true },
        { id: "opt3", label: "C", text: "Resource yang diminta tidak ditemukan di server (Not Found)", isCorrect: false },
        { id: "opt4", label: "D", text: "Format payload request JSON tidak valid (Bad Request)", isCorrect: false },
      ],
      correctOptionId: "opt2",
      correctOptionIds: ["opt2"],
      explanation: "Kode 401 Unauthorized mengindikasikan bahwa request tidak memiliki kredensial otentikasi yang valid. Jika user sudah login tapi dilarang karena hak akses, kodenya adalah 403 Forbidden.",
      points: 20,
    },
    {
      id: "q5",
      type: "multiple_select",
      prompt: "Manakah HTTP Security Headers yang direkomendasikan OWASP untuk mencegah serangan XSS, Clickjacking, dan MIME sniffing? (Pilih semua yang benar)",
      questionText: "Manakah HTTP Security Headers yang direkomendasikan OWASP untuk mencegah serangan XSS, Clickjacking, dan MIME sniffing? (Pilih semua yang benar)",
      options: [
        { id: "opt1", label: "A", text: "Content-Security-Policy (CSP)", isCorrect: true },
        { id: "opt2", label: "B", text: "X-Content-Type-Options: nosniff", isCorrect: true },
        { id: "opt3", label: "C", text: "Access-Control-Allow-Origin: *", isCorrect: false },
        { id: "opt4", label: "D", text: "X-Frame-Options: DENY / SAMEORIGIN", isCorrect: true },
      ],
      correctOptionId: "opt1",
      correctOptionIds: ["opt1", "opt2", "opt4"],
      explanation: "CSP membatasi sumber script, nosniff mencegah eksploitasi tipe MIME, dan X-Frame-Options mencegah clickjacking dalam iframe. Wildcard CORS origin (*) justru membuka akses terbuka tanpa pembatasan keamanan.",
      points: 20,
    },
  ],
};

export default function LmsQuizStudio({ lesson, onChange }: LmsQuizStudioProps) {
  const [viewMode, setViewMode] = useState<"builder" | "simulation">("builder");

  // Student exam simulator state (answers stored as array of string IDs per question)
  const [simQuestionIndex, setSimQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string[]>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showIncompleteNotice, setShowIncompleteNotice] = useState(false);

  const config = lesson.quizConfig || DEFAULT_QUIZ_CONFIG;

  const updateConfig = (partial: Partial<LmsQuizConfig>) => {
    const nextConfig: LmsQuizConfig = { ...config, ...partial };
    onChange({
      ...lesson,
      quizConfig: nextConfig,
    });
  };

  // Question Management
  const handleAddQuestion = () => {
    const correctOptId = `opt-1-${Date.now()}`;
    const newQ: LmsQuizQuestion = {
      id: `q-${Date.now()}`,
      type: "multiple_choice",
      prompt: "Pertanyaan baru...",
      questionText: "Pertanyaan baru...",
      options: [
        { id: correctOptId, label: "A", text: "Pilihan A", isCorrect: true },
        { id: `opt-2-${Date.now()}`, label: "B", text: "Pilihan B", isCorrect: false },
        { id: `opt-3-${Date.now()}`, label: "C", text: "Pilihan C", isCorrect: false },
        { id: `opt-4-${Date.now()}`, label: "D", text: "Pilihan D", isCorrect: false },
      ],
      correctOptionId: correctOptId,
      correctOptionIds: [correctOptId],
      explanation: "Penjelasan mengapa pilihan ini adalah jawaban yang benar...",
      points: 20,
    };
    updateConfig({ questions: [...config.questions, newQ] });
  };

  const handleUpdateQuestion = (qId: string, partial: Partial<LmsQuizQuestion>) => {
    const nextQuestions = config.questions.map((q) => {
      if (q.id !== qId) return q;
      const updated = { ...q, ...partial };
      if (partial.prompt && !partial.questionText) updated.questionText = partial.prompt;
      if (partial.questionText && !partial.prompt) updated.prompt = partial.questionText;

      // Sync correctOptionIds and isCorrect
      if (partial.correctOptionId && (!partial.correctOptionIds || partial.correctOptionIds.length === 0)) {
        updated.correctOptionIds = [partial.correctOptionId];
      }
      return updated;
    });
    updateConfig({ questions: nextQuestions });
  };

  const handleDeleteQuestion = (qId: string) => {
    const nextQuestions = config.questions.filter((q) => q.id !== qId);
    updateConfig({ questions: nextQuestions });
  };

  // Option Management
  const handleAddOption = (qId: string) => {
    const q = config.questions.find((x) => x.id === qId);
    if (!q) return;
    const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const nextLabel = labels[q.options.length] || "X";
    const nextOptions = [
      ...q.options,
      { id: `opt-${Date.now()}`, label: nextLabel, text: `Pilihan ${nextLabel}`, isCorrect: false },
    ];
    handleUpdateQuestion(qId, { options: nextOptions });
  };

  const handleDeleteOption = (qId: string, optId: string) => {
    const q = config.questions.find((x) => x.id === qId);
    if (!q || q.options.length <= 2) return;
    const nextOptions = q.options.filter((o) => o.id !== optId);
    let nextCorrect = q.correctOptionId;
    if (nextCorrect === optId && nextOptions.length > 0) {
      nextCorrect = nextOptions[0].id;
    }
    const nextCorrectIds = (q.correctOptionIds || []).filter((id) => id !== optId);
    handleUpdateQuestion(qId, {
      options: nextOptions,
      correctOptionId: nextCorrect,
      correctOptionIds: nextCorrectIds.length > 0 ? nextCorrectIds : [nextOptions[0].id],
    });
  };

  // Switch between Single Choice and Multiple Choice
  const handleToggleQuestionType = (qId: string, newType: "multiple_choice" | "multiple_select") => {
    const q = config.questions.find((x) => x.id === qId);
    if (!q) return;

    let nextOpts = [...q.options];
    let nextCorrectId = q.correctOptionId;
    let nextCorrectIds = q.correctOptionIds || [];

    if (newType === "multiple_choice") {
      // Keep only 1 correct option
      const firstCorrect = q.options.find((o) => o.isCorrect) || q.options[0];
      nextOpts = q.options.map((o) => ({ ...o, isCorrect: o.id === firstCorrect?.id }));
      nextCorrectId = firstCorrect?.id;
      nextCorrectIds = firstCorrect ? [firstCorrect.id] : [];
    }

    handleUpdateQuestion(qId, {
      type: newType,
      options: nextOpts,
      correctOptionId: nextCorrectId,
      correctOptionIds: nextCorrectIds,
    });
  };

  // Toggle option selection in Single Choice vs Multiple Choice
  const handleSelectCorrectOption = (qId: string, optId: string) => {
    const q = config.questions.find((x) => x.id === qId);
    if (!q) return;

    if (q.type === "multiple_select") {
      // Toggle checkbox for multiple select
      const nextOpts = q.options.map((o) => (o.id === optId ? { ...o, isCorrect: !o.isCorrect } : o));
      const nextCorrectIds = nextOpts.filter((o) => o.isCorrect).map((o) => o.id);
      handleUpdateQuestion(qId, {
        options: nextOpts,
        correctOptionId: nextCorrectIds[0] || "",
        correctOptionIds: nextCorrectIds,
      });
    } else {
      // Single radio choice
      const nextOpts = q.options.map((o) => ({ ...o, isCorrect: o.id === optId }));
      handleUpdateQuestion(qId, {
        options: nextOpts,
        correctOptionId: optId,
        correctOptionIds: [optId],
      });
    }
  };

  // Student answer interaction
  const handleStudentSelectAnswer = (qId: string, optId: string, isMultiple: boolean) => {
    const current = studentAnswers[qId] || [];
    if (isMultiple) {
      const next = current.includes(optId) ? current.filter((id) => id !== optId) : [...current, optId];
      setStudentAnswers({ ...studentAnswers, [qId]: next });
    } else {
      setStudentAnswers({ ...studentAnswers, [qId]: [optId] });
    }
  };

  // Total points
  const totalPoints = config.questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
  const totalQuestions = config.questions.length;

  // Completion calculation for strict regulation
  const answeredQuestionIds = config.questions.filter((q) => {
    const ans = studentAnswers[q.id];
    return Array.isArray(ans) && ans.length > 0;
  });
  const answeredCount = answeredQuestionIds.length;
  const unansweredQuestions = config.questions.filter((q) => {
    const ans = studentAnswers[q.id];
    return !Array.isArray(ans) || ans.length === 0;
  });
  const is100PercentCompleted = totalQuestions > 0 && answeredCount === totalQuestions;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Student Simulation Score
  const calculateStudentScore = () => {
    let earned = 0;
    config.questions.forEach((q) => {
      const userAns = studentAnswers[q.id] || [];
      if (q.type === "multiple_select") {
        const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
        const isExactMatch =
          correctIds.length === userAns.length &&
          correctIds.every((id) => userAns.includes(id)) &&
          userAns.every((id) => correctIds.includes(id));
        if (isExactMatch) {
          earned += Number(q.points) || 0;
        }
      } else {
        const targetId = q.correctOptionId || q.options.find((o) => o.isCorrect)?.id;
        if (userAns.length === 1 && userAns[0] === targetId) {
          earned += Number(q.points) || 0;
        }
      }
    });
    const percentage = totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0;
    return { earned, percentage, isPassed: percentage >= config.passingScore };
  };

  const simResult = calculateStudentScore();

  const handleAttemptFinish = () => {
    if (!is100PercentCompleted) {
      setShowIncompleteNotice(true);
      if (unansweredQuestions.length > 0) {
        const firstUnansweredIndex = config.questions.findIndex((q) => q.id === unansweredQuestions[0].id);
        if (firstUnansweredIndex >= 0) {
          setSimQuestionIndex(firstUnansweredIndex);
        }
      }
      return;
    }
    setShowIncompleteNotice(false);
    setQuizSubmitted(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden", background: "var(--bx-surface)" }}>
      {/* Studio Header: Switcher & Stats */}
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
          <FlatIcon type="quiz" size={16} color="var(--brand)" />
          <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--brand)" }}>
            Studio Kuis: Single &amp; Multiple Choice
          </span>
          <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "3px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", color: "var(--muted)" }}>
            {config.questions.length} Soal • {totalPoints} Poin Maksimal
          </span>
          <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "3px", background: "#FEF3C7", color: "#92400E", fontWeight: 700 }}>
            Passing Grade: {config.passingScore}%
          </span>
        </div>

        {/* View Switcher */}
        <div style={{ display: "flex", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "4px", padding: "1px" }}>
          <button
            type="button"
            onClick={() => {
              setViewMode("builder");
              setShowIncompleteNotice(false);
            }}
            style={{
              padding: "4px 12px",
              border: "none",
              borderRadius: "3px",
              background: viewMode === "builder" ? "var(--brand)" : "transparent",
              color: viewMode === "builder" ? "#FFFFFF" : "var(--ink)",
              fontSize: "0.74rem",
              fontWeight: viewMode === "builder" ? 700 : 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FlatIcon type="settings" size={13} color={viewMode === "builder" ? "#FFFFFF" : "var(--ink)"} />
            <span>Editor Soal &amp; Pengaturan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("simulation");
              setSimQuestionIndex(0);
              setQuizSubmitted(false);
              setShowIncompleteNotice(false);
            }}
            style={{
              padding: "4px 12px",
              border: "none",
              borderRadius: "3px",
              background: viewMode === "simulation" ? "var(--brand)" : "transparent",
              color: viewMode === "simulation" ? "#FFFFFF" : "var(--ink)",
              fontSize: "0.74rem",
              fontWeight: viewMode === "simulation" ? 700 : 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <FlatIcon type="eye" size={13} color={viewMode === "simulation" ? "#FFFFFF" : "var(--ink)"} />
            <span>Simulasi Ujian Mahasiswa</span>
          </button>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
        {/* ============================================================== */}
        {/* TAB 1: BUILDER MODE */}
        {/* ============================================================== */}
        {viewMode === "builder" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px" }}>
            <div style={{ maxWidth: "980px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Quiz General Settings Card */}
              <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                  <FlatIcon type="settings" size={14} color="var(--brand)" />
                  <strong style={{ fontSize: "0.82rem", color: "var(--brand)" }}>
                    Pengaturan Parameter Kuis
                  </strong>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", fontSize: "0.78rem" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "3px" }}>
                      Passing Grade (%):
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={config.passingScore}
                      onChange={(e) => updateConfig({ passingScore: Number(e.target.value) })}
                      style={{ width: "100%", padding: "5px 8px", borderRadius: "3px", border: "1px solid var(--bx-border)" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "3px" }}>
                      Durasi Pengerjaan (Menit):
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={config.durationMinutes}
                      onChange={(e) => updateConfig({ durationMinutes: Number(e.target.value) })}
                      style={{ width: "100%", padding: "5px 8px", borderRadius: "3px", border: "1px solid var(--bx-border)" }}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingTop: "18px" }}>
                    <input
                      type="checkbox"
                      id="chkRandom"
                      checked={config.randomizeQuestions}
                      onChange={(e) => updateConfig({ randomizeQuestions: e.target.checked })}
                    />
                    <label htmlFor="chkRandom" style={{ cursor: "pointer" }}>Acak Urutan Soal</label>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingTop: "18px" }}>
                    <input
                      type="checkbox"
                      id="chkShowExp"
                      checked={config.showExplanationImmediately}
                      onChange={(e) => updateConfig({ showExplanationImmediately: e.target.checked })}
                    />
                    <label htmlFor="chkShowExp" style={{ cursor: "pointer" }}>Buka Pembahasan Nilai</label>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {config.questions.map((q, qIdx) => {
                  const isMultiple = q.type === "multiple_select";
                  return (
                    <div
                      key={q.id}
                      style={{
                        background: "var(--bx-surface)",
                        border: "1px solid var(--bx-border)",
                        borderRadius: "6px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {/* Question Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid var(--bx-border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 800, padding: "2px 8px", borderRadius: "4px", background: "var(--brand)", color: "#FFFFFF" }}>
                            Soal #{qIdx + 1}
                          </span>

                          {/* Question Type Selector: Single Choice vs Multiple Choice */}
                          <select
                            value={q.type || "multiple_choice"}
                            onChange={(e) => handleToggleQuestionType(q.id, e.target.value as any)}
                            style={{
                              padding: "3px 8px",
                              borderRadius: "4px",
                              border: "1px solid var(--bx-border)",
                              background: isMultiple ? "#EFF6FF" : "#F8FAFC",
                              color: isMultiple ? "#1E40AF" : "var(--brand)",
                              fontSize: "0.74rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            <option value="multiple_choice">Single Choice (1 Kunci Benar)</option>
                            <option value="multiple_select">Multiple Choice (Pilihan Jamak &gt; 1 Kunci Benar)</option>
                          </select>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.76rem" }}>
                            <span style={{ color: "var(--muted)" }}>Bobot Poin:</span>
                            <input
                              type="number"
                              min={1}
                              value={q.points}
                              onChange={(e) => handleUpdateQuestion(q.id, { points: Number(e.target.value) })}
                              style={{ width: "55px", padding: "3px 6px", borderRadius: "3px", border: "1px solid var(--bx-border)", fontSize: "0.76rem" }}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q.id)}
                            style={{ padding: "3px 8px", background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: "3px", fontSize: "0.72rem", cursor: "pointer" }}
                          >
                            Hapus Soal
                          </button>
                        </div>
                      </div>

                      {/* Question Prompt */}
                      <div>
                        <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, marginBottom: "4px" }}>
                          Pertanyaan / Deskripsi Soal:
                        </label>
                        <textarea
                          rows={2}
                          value={q.prompt}
                          onChange={(e) => handleUpdateQuestion(q.id, { prompt: e.target.value })}
                          placeholder="Ketik pertanyaan kuis di sini..."
                          style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                        />
                      </div>

                      {/* Options List (Radio for Single Choice, Checkboxes for Multiple Choice) */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--ink)", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span>
                              {isMultiple
                                ? "Pilihan Jawaban (Centang Checkbox untuk menandai KUNCI-KUNCI JAWABAN BENAR):"
                                : "Pilihan Jawaban (Pilih Radio untuk menandai SATU KUNCI JAWABAN BENAR):"}
                            </span>
                            <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "3px", background: isMultiple ? "#DBEAFE" : "#E2E8F0", color: isMultiple ? "#1E40AF" : "var(--brand)", fontWeight: 700 }}>
                              {isMultiple ? "Multiple Select" : "Single Choice"}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddOption(q.id)}
                            style={{ padding: "2px 8px", background: "var(--bx-bg-alt)", border: "1px solid var(--bx-border)", borderRadius: "3px", fontSize: "0.72rem", cursor: "pointer" }}
                          >
                            Tambah Opsi
                          </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {q.options.map((opt) => {
                            const isCorrect = opt.isCorrect;
                            return (
                              <div
                                key={opt.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "6px 10px",
                                  borderRadius: "4px",
                                  border: isCorrect ? "2px solid #059669" : "1px solid var(--bx-border)",
                                  background: isCorrect ? "#ECFDF5" : "var(--bx-surface)",
                                }}
                              >
                                {/* Radio for single choice, Checkbox for multiple choice */}
                                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                  {isMultiple ? (
                                    <input
                                      type="checkbox"
                                      checked={isCorrect}
                                      onChange={() => handleSelectCorrectOption(q.id, opt.id)}
                                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                    />
                                  ) : (
                                    <input
                                      type="radio"
                                      name={`correct-${q.id}`}
                                      checked={isCorrect}
                                      onChange={() => handleSelectCorrectOption(q.id, opt.id)}
                                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                    />
                                  )}
                                </label>

                                {/* Label A, B, C, D */}
                                <span
                                  style={{
                                    width: "22px",
                                    height: "22px",
                                    borderRadius: isMultiple ? "4px" : "50%",
                                    background: isCorrect ? "#059669" : "var(--bx-bg-alt)",
                                    color: isCorrect ? "#FFFFFF" : "var(--ink)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: "0.74rem",
                                    flexShrink: 0,
                                  }}
                                >
                                  {opt.label}
                                </span>

                                {/* Option Text Input */}
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => {
                                    const nextOpts = q.options.map((o) => (o.id === opt.id ? { ...o, text: e.target.value } : o));
                                    handleUpdateQuestion(q.id, { options: nextOpts });
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: "5px 8px",
                                    borderRadius: "3px",
                                    border: "1px solid var(--bx-border)",
                                    fontSize: "0.78rem",
                                    background: "var(--bx-surface)",
                                  }}
                                />

                                {/* Correct indicator badge */}
                                {isCorrect && (
                                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#065F46", padding: "2px 6px", borderRadius: "3px", background: "#D1FAE5" }}>
                                    ✓ KUNCI BENAR
                                  </span>
                                )}

                                {/* Delete option if > 2 */}
                                {q.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOption(q.id, opt.id)}
                                    style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "0.72rem" }}
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Explanation Field */}
                      <div style={{ background: "var(--bx-bg-alt)", padding: "10px", borderRadius: "4px", border: "1px solid var(--bx-border)" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", fontWeight: 700, color: "var(--brand)", marginBottom: "4px" }}>
                          <FlatIcon type="info" size={13} color="var(--brand)" />
                          <span>Pembahasan &amp; Penjelasan Jawaban Benar:</span>
                        </label>
                        <textarea
                          rows={2}
                          value={q.explanation || ""}
                          onChange={(e) => handleUpdateQuestion(q.id, { explanation: e.target.value })}
                          placeholder="Jelaskan alasan kunci jawaban ini benar untuk membantu mahasiswa yang salah menjawab..."
                          style={{ width: "100%", padding: "6px 8px", borderRadius: "3px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Add Question Button */}
              <button
                type="button"
                onClick={handleAddQuestion}
                style={{
                  padding: "12px",
                  borderRadius: "6px",
                  border: "2px dashed var(--bx-border)",
                  background: "var(--bx-bg-alt)",
                  color: "var(--brand)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <FlatIcon type="plus" size={16} color="var(--brand)" />
                <span>Tambah Soal Baru (Single / Multiple Choice)</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: STUDENT EXAM SIMULATION (5-COLUMN BUTTONS ON THE LEFT) */}
        {/* ============================================================== */}
        {viewMode === "simulation" && (
          <div style={{ display: "flex", width: "100%", height: "100%", overflow: "hidden" }}>
            {/* LEFT SIDEBAR: QUESTION NUMBER BUTTONS IN 5 COLUMNS */}
            <div
              style={{
                width: "280px",
                flexShrink: 0,
                borderRight: "1px solid var(--bx-border)",
                background: "var(--bx-surface)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                overflowY: "auto",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--bx-border)", paddingBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "0.84rem", color: "var(--brand)" }}>
                  <FlatIcon type="quiz" size={16} color="var(--brand)" />
                  <span>Navigasi Soal</span>
                </div>
                <span style={{ fontSize: "0.7rem", padding: "1px 6px", borderRadius: "3px", background: "var(--bx-bg-alt)", color: "var(--muted)", fontWeight: 600 }}>
                  Grid 5 Kolom
                </span>
              </div>

              {/* 5-COLUMN BUTTON GRID */}
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "8px", fontWeight: 600 }}>
                  PILIH NOMOR SOAL:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }}>
                  {config.questions.map((q, idx) => {
                    const isAnswered = (studentAnswers[q.id] || []).length > 0;
                    const isCurrent = simQuestionIndex === idx;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setSimQuestionIndex(idx);
                          setShowIncompleteNotice(false);
                        }}
                        style={{
                          height: "38px",
                          borderRadius: "4px",
                          border: isCurrent
                            ? "2px solid var(--brand)"
                            : isAnswered
                            ? "1px solid #16A34A"
                            : "1px solid var(--bx-border)",
                          background: isCurrent
                            ? "var(--brand)"
                            : isAnswered
                            ? "#DCFCE7"
                            : "var(--bx-bg-alt)",
                          color: isCurrent
                            ? "#FFFFFF"
                            : isAnswered
                            ? "#166534"
                            : "var(--ink)",
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span>{idx + 1}</span>
                        {isAnswered && !isCurrent && (
                          <span style={{ position: "absolute", top: "1px", right: "2px", fontSize: "0.55rem", fontWeight: 900 }}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress & Completion Meter */}
              <div style={{ background: "var(--bx-bg-alt)", borderRadius: "6px", padding: "12px", border: "1px solid var(--bx-border)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>Kelengkapan Kuis:</span>
                  <span style={{ fontWeight: 800, color: is100PercentCompleted ? "#166534" : "#92400E" }}>
                    {answeredCount} / {totalQuestions} ({progressPercent}%)
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div style={{ width: "100%", height: "8px", background: "var(--bx-border)", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: "100%",
                      background: is100PercentCompleted ? "#16A34A" : "var(--brand)",
                      transition: "width 0.25s ease",
                    }}
                  />
                </div>

                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "4px 8px",
                    borderRadius: "4px",
                    background: is100PercentCompleted ? "#DCFCE7" : "#FEF3C7",
                    color: is100PercentCompleted ? "#166534" : "#92400E",
                    textAlign: "center",
                  }}
                >
                  {is100PercentCompleted
                    ? "✓ 100% Terisi - Siap Dikumpulkan"
                    : `⚠️ ${totalQuestions - answeredCount} Soal Belum Terisi`}
                </div>
              </div>

              {/* Legend Indicator */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.72rem", color: "var(--muted)", paddingTop: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "14px", height: "14px", borderRadius: "3px", background: "var(--brand)" }} />
                  <span>Soal Aktif Saat Ini</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#DCFCE7", border: "1px solid #16A34A" }} />
                  <span>Sudah Terisi ({answeredCount})</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "14px", height: "14px", borderRadius: "3px", background: "var(--bx-bg-alt)", border: "1px solid var(--bx-border)" }} />
                  <span>Belum Diisi ({totalQuestions - answeredCount})</span>
                </div>
              </div>

              {/* Regulation Banner in Sidebar */}
              <div style={{ marginTop: "auto", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "6px", padding: "10px", fontSize: "0.72rem", color: "#1E40AF" }}>
                <strong style={{ display: "block", marginBottom: "2px" }}>Regulasi Ujian:</strong>
                <span>Wajib mengisi 100% seluruh butir pertanyaan untuk membuka kunci pengumpulan jawaban.</span>
              </div>
            </div>

            {/* RIGHT MAIN AREA: ACTIVE QUESTION CARD & REGULATION CONTROLS */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Simulation Top Strip */}
              <div
                style={{
                  background: "var(--brand)",
                  color: "#FFFFFF",
                  padding: "12px 18px",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FlatIcon type="clock" size={16} color="var(--gold)" />
                  <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                    Waktu Simulasi: 14:48
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.74rem", color: "#E2E8F0" }}>
                    Passing Grade: {config.passingScore}% • Minimal Lulus
                  </span>
                  <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: "3px", background: "rgba(255,255,255,0.2)" }}>
                    {is100PercentCompleted ? "100% Lengkap" : `Progress: ${progressPercent}%`}
                  </span>
                </div>
              </div>

              {/* Incomplete Warning Alert Banner if attempted early submission */}
              {showIncompleteNotice && !is100PercentCompleted && (
                <div
                  style={{
                    background: "#FEF2F2",
                    border: "2px solid #EF4444",
                    borderRadius: "6px",
                    padding: "12px 16px",
                    color: "#991B1B",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <FlatIcon type="warning" size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ display: "block", marginBottom: "3px", fontSize: "0.84rem" }}>
                      Regulasi Kuis: Ujian Belum 100% Diisi
                    </strong>
                    <span>
                      Anda belum dapat mengumpulkan kuis karena masih ada{" "}
                      <strong>{unansweredQuestions.length} nomor soal yang belum dijawab</strong> (Nomor:{" "}
                      {unansweredQuestions
                        .map((q) => config.questions.findIndex((x) => x.id === q.id) + 1)
                        .join(", ")}
                      ). Sesuai regulasi sistem kelulusan, Anda wajib menjawab seluruh butir soal sebelum dapat melakukan submit nilai.
                    </span>
                  </div>
                </div>
              )}

              {/* Active Question Card */}
              {config.questions[simQuestionIndex] && (
                <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.88rem", color: "var(--brand)" }}>
                        Pertanyaan {simQuestionIndex + 1} dari {config.questions.length}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "3px",
                          background: config.questions[simQuestionIndex].type === "multiple_select" ? "#DBEAFE" : "#F1F5F9",
                          color: config.questions[simQuestionIndex].type === "multiple_select" ? "#1E40AF" : "var(--brand)",
                        }}
                      >
                        {config.questions[simQuestionIndex].type === "multiple_select"
                          ? "Multiple Choice (Pilihan Jamak)"
                          : "Single Choice (Pilihan Tunggal)"}
                      </span>
                    </div>

                    <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                      Bobot: {config.questions[simQuestionIndex].points} Poin
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <p style={{ margin: "0 0 16px", fontSize: "0.94rem", fontWeight: 600, lineHeight: 1.55, color: "var(--ink)" }}>
                    {config.questions[simQuestionIndex].prompt}
                  </p>

                  {/* Helper Text for Question Type */}
                  <div style={{ marginBottom: "12px", fontSize: "0.74rem", color: "var(--muted)" }}>
                    {config.questions[simQuestionIndex].type === "multiple_select" ? (
                      <span style={{ color: "#1E40AF", fontWeight: 600 }}>
                        ℹ Pilihan Jamak: Anda dapat memilih lebih dari satu jawaban yang benar.
                      </span>
                    ) : (
                      <span>Pilihlah salah satu jawaban yang paling tepat.</span>
                    )}
                  </div>

                  {/* Options List (Radio for Single, Checkboxes for Multiple) */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                    {config.questions[simQuestionIndex].options.map((opt) => {
                      const qId = config.questions[simQuestionIndex].id;
                      const isMultiple = config.questions[simQuestionIndex].type === "multiple_select";
                      const currentSelected = studentAnswers[qId] || [];
                      const isSelected = currentSelected.includes(opt.id);

                      return (
                        <label
                          key={opt.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 14px",
                            borderRadius: "4px",
                            border: isSelected ? "2px solid var(--brand)" : "1px solid var(--bx-border)",
                            background: isSelected ? "rgba(10, 46, 82, 0.05)" : "var(--bx-surface)",
                            cursor: "pointer",
                            fontSize: "0.82rem",
                          }}
                        >
                          {isMultiple ? (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleStudentSelectAnswer(qId, opt.id, true)}
                              style={{ width: "16px", height: "16px", cursor: "pointer" }}
                            />
                          ) : (
                            <input
                              type="radio"
                              name={`sim-${qId}`}
                              checked={isSelected}
                              onChange={() => handleStudentSelectAnswer(qId, opt.id, false)}
                              style={{ width: "16px", height: "16px", cursor: "pointer" }}
                            />
                          )}

                          <span style={{ fontWeight: 700, width: "18px" }}>{opt.label}.</span>
                          <span style={{ flex: 1 }}>{opt.text}</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Navigation and Submission Regulation Controls */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid var(--bx-border)" }}>
                    <button
                      type="button"
                      disabled={simQuestionIndex === 0}
                      onClick={() => {
                        setSimQuestionIndex(simQuestionIndex - 1);
                        setShowIncompleteNotice(false);
                      }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "4px",
                        border: "1px solid var(--bx-border)",
                        background: "var(--bx-surface)",
                        fontSize: "0.76rem",
                        cursor: simQuestionIndex === 0 ? "not-allowed" : "pointer",
                        opacity: simQuestionIndex === 0 ? 0.5 : 1,
                      }}
                    >
                      ← Soal Sebelumnya
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {simQuestionIndex < config.questions.length - 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSimQuestionIndex(simQuestionIndex + 1);
                            setShowIncompleteNotice(false);
                          }}
                          style={{ padding: "6px 16px", borderRadius: "4px", border: "1px solid var(--brand)", background: "var(--brand)", color: "#FFFFFF", fontWeight: 700, fontSize: "0.76rem", cursor: "pointer" }}
                        >
                          Soal Berikutnya →
                        </button>
                      )}

                      {/* STRICT REGULATION SUBMIT BUTTON */}
                      <button
                        type="button"
                        onClick={handleAttemptFinish}
                        style={{
                          padding: "6px 18px",
                          borderRadius: "4px",
                          border: "none",
                          background: is100PercentCompleted ? "#059669" : "#64748B",
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: "0.76rem",
                          cursor: is100PercentCompleted ? "pointer" : "not-allowed",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          opacity: is100PercentCompleted ? 1 : 0.8,
                        }}
                      >
                        <FlatIcon type={is100PercentCompleted ? "check" : "shield"} size={14} color="#FFFFFF" />
                        <span>
                          {is100PercentCompleted
                            ? "Selesaikan & Kumpulkan Kuis"
                            : `Belum 100% Terisi (${answeredCount}/${totalQuestions})`}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz Result Preview Card */}
              {quizSubmitted && (
                <div
                  style={{
                    background: simResult.isPassed ? "#ECFDF5" : "#FFF1F2",
                    border: simResult.isPassed ? "2px solid #059669" : "2px solid #E11D48",
                    borderRadius: "8px",
                    padding: "20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px", fontSize: "1.05rem", color: simResult.isPassed ? "#065F46" : "#9F1239", display: "flex", alignItems: "center", gap: "6px" }}>
                        {simResult.isPassed ? (
                          <>
                            <FlatIcon type="certificate" size={18} color="#059669" />
                            <span>Selamat! Anda LULUS Kuis</span>
                          </>
                        ) : (
                          <>
                            <FlatIcon type="warning" size={18} color="#E11D48" />
                            <span>Belum Mencapai Passing Grade</span>
                          </>
                        )}
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: simResult.isPassed ? "#047857" : "#BE123C" }}>
                        Skor Akhir: {simResult.percentage}% ({simResult.earned} dari {totalPoints} Poin) • Standar Kelulusan: {config.passingScore}%
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentAnswers({});
                        setQuizSubmitted(false);
                        setSimQuestionIndex(0);
                        setShowIncompleteNotice(false);
                      }}
                      style={{ padding: "6px 12px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "4px", fontSize: "0.76rem", cursor: "pointer" }}
                    >
                      Ulangi Ujian
                    </button>
                  </div>

                  {/* Question Review & Explanation */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
                    {config.questions.map((q, idx) => {
                      const userAns = studentAnswers[q.id] || [];
                      let isCorrect = false;

                      if (q.type === "multiple_select") {
                        const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
                        isCorrect =
                          correctIds.length === userAns.length &&
                          correctIds.every((id) => userAns.includes(id)) &&
                          userAns.every((id) => correctIds.includes(id));
                      } else {
                        const targetId = q.correctOptionId || q.options.find((o) => o.isCorrect)?.id;
                        isCorrect = userAns.length === 1 && userAns[0] === targetId;
                      }

                      const correctLabels = q.options
                        .filter((o) => o.isCorrect)
                        .map((o) => `${o.label}. ${o.text}`)
                        .join(", ");

                      const userLabels = q.options
                        .filter((o) => userAns.includes(o.id))
                        .map((o) => `${o.label}. ${o.text}`)
                        .join(", ");

                      return (
                        <div key={q.id} style={{ padding: "10px 14px", background: "var(--bx-surface)", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.78rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <strong>#{idx + 1}. {q.prompt}</strong>
                            <span style={{ color: isCorrect ? "#16A34A" : "#DC2626", fontWeight: 700 }}>
                              {isCorrect ? `✓ Benar (+${q.points})` : "✕ Salah (0)"}
                            </span>
                          </div>
                          <div style={{ color: "var(--muted)", margin: "4px 0" }}>
                            Jawaban Anda: <strong>{userLabels || "(Tidak dijawab)"}</strong>
                          </div>
                          <div style={{ color: "var(--muted)", margin: "4px 0" }}>
                            Kunci Jawaban Benar: <strong style={{ color: "#065F46" }}>{correctLabels}</strong>
                          </div>
                          {q.explanation && (
                            <div style={{ padding: "6px 8px", background: "#EFF6FF", borderRadius: "3px", color: "#1E40AF", fontSize: "0.74rem", marginTop: "6px", display: "flex", alignItems: "flex-start", gap: "6px" }}>
                              <FlatIcon type="info" size={13} color="#1E40AF" style={{ marginTop: "1px", flexShrink: 0 }} />
                              <div>
                                <strong>Pembahasan:</strong> {q.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
