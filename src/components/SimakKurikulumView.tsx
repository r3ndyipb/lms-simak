"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { LmsCourse, LmsModule, LmsLesson, LmsAcademicTeam } from "../types/simak";
import { MOCK_LMS_COURSES, MOCK_CATEGORIES, MOCK_LEVELS, MOCK_ACADEMIC_STAFF } from "../data/simakMockData";
import LmsRichContentEditor from "./LmsRichContentEditor";
import LmsVideoStudio from "./LmsVideoStudio";
import LmsAssignmentStudio from "./LmsAssignmentStudio";
import LmsQuizStudio from "./LmsQuizStudio";
import LmsDownloadStudio from "./LmsDownloadStudio";

type CourseTab = "info" | "target" | "kurikulum" | "tim-akademik" | "harga" | "seo" | "reviews";
type StatusFilter = "all" | "terpublikasi" | "draft" | "arsip" | "gratis" | "berbayar";

const DEFAULT_ACADEMIC_TEAM: LmsAcademicTeam = {
  curriculumTeam: "Divisi Kurikulum Software Engineering Anvieo",
  curriculumAuthor: "Dr. Maya Anggraini, M.Cs.",
  curriculumAuthorAvatar: "/alumni/alumni_5.jpg",
  curriculumAuthorRole: "Lead Curriculum Designer & Author",
  instructorName: "Prof. Budi Rahardjo, Ph.D.",
  instructorAvatar: "/alumni/alumni_1.jpg",
  instructorRole: "Master Instructor & Dosen Pengampu",
  reviewerName: "Rian Maulana, S.T.",
  reviewerAvatar: "/alumni/alumni_4.jpg",
  reviewerRole: "Lead Code Reviewer & Evaluator",
  qaValidatorName: "Dr. Ir. Hendra Prasetyo, M.T. (LPMA)",
};

export default function SimakKurikulumView() {
  const [courses, setCourses] = useState<LmsCourse[]>(MOCK_LMS_COURSES);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Edit / Create Course Studio Slider 95%
  const [editingCourse, setEditingCourse] = useState<LmsCourse | null>(null);
  const [activeBuilderTab, setActiveBuilderTab] = useState<CourseTab>("kurikulum");

  // Lesson Content Studio Slider 95%
  const [activeLessonEditor, setActiveLessonEditor] = useState<{
    moduleId: string;
    lesson: LmsLesson;
    isNew?: boolean;
  } | null>(null);

  // Settings drawer within Lesson Studio
  const [showLessonSettings, setShowLessonSettings] = useState(false);

  // Filter logic
  const filteredCourses = courses.filter((c) => {
    if (statusFilter === "terpublikasi" && c.status !== "terpublikasi") return false;
    if (statusFilter === "draft" && c.status !== "draft") return false;
    if (statusFilter === "arsip" && c.status !== "arsip") return false;
    if (statusFilter === "gratis" && c.accessType !== "gratis") return false;
    if (statusFilter === "berbayar" && c.accessType !== "berbayar") return false;
    if (selectedCategory !== "all" && c.category !== selectedCategory) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.instructorName.toLowerCase().includes(q);
  });

  const handleOpenNewCourse = () => {
    const newCourse: LmsCourse = {
      id: `crs-${Date.now()}`,
      title: "",
      slug: "",
      shortDesc: "",
      fullDesc: "",
      thumbnail: "/paths/fullstack.jpg",
      category: "Web Development",
      level: "Pemula (Beginner)",
      language: "Bahasa Indonesia",
      durationHours: 10,
      normalPrice: 0,
      accessType: "gratis",
      status: "draft",
      instructorId: "usr-instruktur-03",
      instructorName: "Prof. Budi Rahardjo, Ph.D.",
      instructorAvatar: "/alumni/alumni_1.jpg",
      academicTeam: { ...DEFAULT_ACADEMIC_TEAM },
      enrolledStudents: 0,
      rating: 5.0,
      reviewCount: 0,
      updatedAt: "Hari ini",
      learningTargets: ["Memahami konsep dasar materi"],
      prerequisites: ["Kemauan belajar yang tinggi"],
      targetAudience: ["Semua kalangan"],
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: "Modul 1: Fondasi",
          order: 1,
          lessons: [
            {
              id: `lsn-${Date.now()}`,
              title: "Pengenalan Materi",
              type: "text",
              durationMinutes: 15,
              freePreview: true,
              requiresPrev: false,
              contentUrl: "",
              textContent: `# Pengenalan Materi\n\nSelamat datang di perkuliahan ini.\n\n## Poin Pembahasan\n\n- Konsep dasar dan arsitektur sistem\n- Instalasi environment kerja\n\n\`\`\`typescript\nconsole.log("Ready");\n\`\`\`\n`,
              summary: "Ringkasan pengantar materi.",
            },
          ],
        },
      ],
    };
    setEditingCourse(newCourse);
    setActiveBuilderTab("info");
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    const exists = courses.some((c) => c.id === editingCourse.id);
    if (exists) {
      setCourses(courses.map((c) => (c.id === editingCourse.id ? editingCourse : c)));
    } else {
      setCourses([editingCourse, ...courses]);
    }
    alert("Kelas berhasil disimpan!");
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm("Hapus kelas ini dari katalog?")) {
      setCourses(courses.filter((c) => c.id !== courseId));
    }
  };

  const handleAddModule = () => {
    if (!editingCourse) return;
    const newMod: LmsModule = {
      id: `mod-${Date.now()}`,
      title: `Bab ${editingCourse.modules.length + 1}`,
      order: editingCourse.modules.length + 1,
      lessons: [],
    };
    setEditingCourse({
      ...editingCourse,
      modules: [...editingCourse.modules, newMod],
    });
  };

  const handleDeleteModule = (modId: string) => {
    if (!editingCourse) return;
    if (confirm("Hapus bab ini beserta seluruh materi di dalamnya?")) {
      setEditingCourse({
        ...editingCourse,
        modules: editingCourse.modules.filter((m) => m.id !== modId),
      });
    }
  };

  const handleOpenLessonEditor = (moduleId: string, lesson: LmsLesson) => {
    const courseTeam = editingCourse?.academicTeam || DEFAULT_ACADEMIC_TEAM;
    setActiveLessonEditor({
      moduleId,
      lesson: {
        ...lesson,
        academicTeam: lesson.academicTeam || { ...courseTeam },
      },
      isNew: false,
    });
    setShowLessonSettings(false);
  };

  const handleAddNewLessonWithEditor = (moduleId: string, defaultType: "text" | "video" | "assignment" | "quiz" | "download" = "text") => {
    const courseTeam = editingCourse?.academicTeam || DEFAULT_ACADEMIC_TEAM;
    const newLsn: LmsLesson = {
      id: `lsn-${Date.now()}`,
      title: "Materi Baru",
      type: defaultType,
      durationMinutes: 15,
      freePreview: false,
      requiresPrev: true,
      contentUrl: defaultType === "video" ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ" : "",
      textContent: `# Materi Pembelajaran\n\nTuliskan uraian materi pembelajaran di sini...\n`,
      attachmentUrl: "",
      summary: "",
      academicTeam: { ...courseTeam },
      feeShareConfig: {
        unitPrice: 50000,
        instructorPct: 50,
        reviewerPct: 30,
        infraPct: 15,
        opsPct: 5,
      },
    };
    setActiveLessonEditor({
      moduleId,
      lesson: newLsn,
      isNew: true,
    });
    setShowLessonSettings(false);
  };

  const handleSaveLessonContent = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingCourse || !activeLessonEditor) return;
    const { moduleId, lesson, isNew } = activeLessonEditor;

    const nextModules = editingCourse.modules.map((m) => {
      if (m.id !== moduleId) return m;
      if (isNew) {
        return { ...m, lessons: [...m.lessons, lesson] };
      } else {
        return {
          ...m,
          lessons: m.lessons.map((l) => (l.id === lesson.id ? lesson : l)),
        };
      }
    });

    setEditingCourse({
      ...editingCourse,
      modules: nextModules,
    });
    setActiveLessonEditor(null);
  };

  const handleDeleteLesson = (modId: string, lsnId: string) => {
    if (!editingCourse) return;
    if (confirm("Hapus lesson ini?")) {
      setEditingCourse({
        ...editingCourse,
        modules: editingCourse.modules.map((m) =>
          m.id === modId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lsnId) } : m
        ),
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Slider Animation */}
      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0.95;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .course-studio-slider-95 {
          animation: slideInFromRight 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          padding: "12px 18px",
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "8px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "3px", background: "var(--brand, #0A2E52)", color: "#fff", fontWeight: 700 }}>
              LMS
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Manajemen Kelas &amp; Kurikulum</span>
          </div>
          <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-heading)", margin: "2px 0 0", color: "var(--brand, #0A2E52)" }}>
            Katalog &amp; Kurikulum
          </h2>
        </div>

        <button
          type="button"
          onClick={handleOpenNewCourse}
          style={{
            padding: "7px 14px",
            borderRadius: "6px",
            border: "none",
            background: "var(--brand, #0A2E52)",
            color: "#ffffff",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <FlatIcon type="plus" size={13} color="#ffffff" />
          <span>Buat Kelas</span>
        </button>
      </div>

      {/* Control Strip & Filter Tabs */}
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
        {/* Status Filter */}
        <div style={{ display: "flex", gap: "3px", background: "var(--bx-bg-alt)", padding: "2px", borderRadius: "5px" }}>
          {[
            { id: "all", label: "Semua" },
            { id: "terpublikasi", label: "Live" },
            { id: "draft", label: "Draft" },
            { id: "gratis", label: "Gratis" },
            { id: "berbayar", label: "Berbayar" },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as StatusFilter)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "4px",
                  border: "none",
                  background: isActive ? "var(--brand)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--ink)",
                  fontSize: "0.76rem",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Category */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "5px 8px",
              borderRadius: "5px",
              border: "1px solid var(--bx-border)",
              background: "var(--bx-surface)",
              fontSize: "0.78rem",
              cursor: "pointer",
            }}
          >
            <option value="all">Semua Kategori</option>
            {MOCK_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Cari kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "5px 8px",
              borderRadius: "5px",
              border: "1px solid var(--bx-border)",
              background: "var(--bx-bg-alt)",
              fontSize: "0.78rem",
              width: "150px",
            }}
          />
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "12px",
        }}
      >
        {filteredCourses.map((crs) => (
          <div
            key={crs.id}
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ position: "relative", height: "120px", background: "var(--brand-3)" }}>
              <img src={crs.thumbnail} alt={crs.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: "8px", left: "8px", display: "flex", gap: "4px" }}>
                <span style={{ fontSize: "0.64rem", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", background: crs.status === "terpublikasi" ? "#065F46" : "#B45309", color: "#fff" }}>
                  {crs.status.toUpperCase()}
                </span>
                <span style={{ fontSize: "0.64rem", padding: "2px 6px", borderRadius: "3px", background: "rgba(10,46,82,0.8)", color: "#fff" }}>
                  {crs.category}
                </span>
              </div>
            </div>

            <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: "0.92rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                {crs.title}
              </h3>
              <p style={{ margin: "0 0 8px", fontSize: "0.76rem", color: "var(--muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {crs.shortDesc}
              </p>

              {/* Tim Akademik Attribution Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "4px 0 10px", fontSize: "0.68rem" }}>
                <span
                  title={`Pembuat Kurikulum: ${crs.academicTeam?.curriculumAuthor || "Dr. Maya Anggraini"}`}
                  style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(10,46,82,0.08)", color: "var(--brand)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <img src={crs.academicTeam?.curriculumAuthorAvatar || "/alumni/alumni_5.jpg"} alt="" style={{ width: "13px", height: "13px", borderRadius: "50%", objectFit: "cover" }} />
                  <span>Pembuat: <strong>{crs.academicTeam?.curriculumAuthor?.split(",")[0] || "Dr. Maya"}</strong></span>
                </span>
                <span
                  title={`Instruktur Pengampu: ${crs.instructorName || "Prof. Budi Rahardjo"}`}
                  style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(201,150,46,0.12)", color: "var(--gold-2)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <img src={crs.instructorAvatar || "/alumni/alumni_1.jpg"} alt="" style={{ width: "13px", height: "13px", borderRadius: "50%", objectFit: "cover" }} />
                  <span>Instruktur: <strong>{crs.instructorName?.split(",")[0] || "Prof. Budi"}</strong></span>
                </span>
                <span
                  title={`Reviewer Evaluasi: ${crs.academicTeam?.reviewerName || "Rian Maulana"}`}
                  style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(5,150,105,0.1)", color: "#065F46", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <img src={crs.academicTeam?.reviewerAvatar || "/alumni/alumni_4.jpg"} alt="" style={{ width: "13px", height: "13px", borderRadius: "50%", objectFit: "cover" }} />
                  <span>Reviewer: <strong>{crs.academicTeam?.reviewerName?.split(",")[0] || "Rian M."}</strong></span>
                </span>
              </div>

              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--bx-border)" }}>
                <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--brand)" }}>
                  {crs.accessType === "gratis" ? "GRATIS" : `Rp ${(crs.discountPrice || crs.normalPrice).toLocaleString("id-ID")}`}
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(crs.id)}
                    style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "#DC2626", fontSize: "0.72rem", cursor: "pointer" }}
                  >
                    Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCourse(crs);
                      setActiveBuilderTab("kurikulum");
                    }}
                    style={{ padding: "4px 12px", borderRadius: "4px", border: "none", background: "var(--brand)", color: "#ffffff", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    Edit &amp; Kurikulum
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* COURSE BUILDER SLIDER 95% (ICON-BASED TABS, NO TEXT BLOAT) */}
      {/* ============================================================== */}
      {editingCourse && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "flex-end",
            zIndex: 9999,
            overflow: "hidden",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingCourse(null);
          }}
        >
          <div
            className="course-studio-slider-95"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              borderLeft: "1px solid var(--bx-border)",
              borderRadius: 0,
              width: "95vw",
              maxWidth: "95vw",
              height: "100vh",
              maxHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Top Bar of Course Studio */}
            <div
              style={{
                padding: "10px 18px",
                borderBottom: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bx-bg-alt)",
                flexShrink: 0,
                height: "48px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--brand)" }}>
                  {editingCourse.title || "Kelas Baru"}
                </span>
                <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "3px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", color: "var(--muted)" }}>
                  {editingCourse.category}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontSize: "0.76rem", cursor: "pointer" }}
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleSaveCourse}
                  style={{ padding: "6px 16px", borderRadius: "4px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, fontSize: "0.76rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FlatIcon type="check" size={13} color="#FFFFFF" />
                  <span>Simpan Kelas</span>
                </button>
              </div>
            </div>

            {/* SIMPLIFIED FLAT ICON TABS (NO BLOATED WORDING) */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid var(--bx-border)",
                background: "var(--bx-surface)",
                flexShrink: 0,
                padding: "0 10px",
                gap: "4px",
              }}
            >
              {[
                { id: "info", icon: "info", label: "Info" },
                { id: "target", icon: "target", label: "Target" },
                { id: "kurikulum", icon: "book", label: "Kurikulum" },
                { id: "tim-akademik", icon: "users", label: "Tim Kurikulum" },
                { id: "harga", icon: "money", label: "Harga" },
                { id: "seo", icon: "globe", label: "SEO" },
                { id: "reviews", icon: "star", label: "Ulasan" },
              ].map((tab) => {
                const isActive = activeBuilderTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveBuilderTab(tab.id as CourseTab)}
                    style={{
                      padding: "8px 14px",
                      border: "none",
                      borderBottom: isActive ? "2px solid var(--brand)" : "2px solid transparent",
                      background: "transparent",
                      color: isActive ? "var(--brand)" : "var(--muted)",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <FlatIcon type={tab.icon} size={14} color={isActive ? "var(--brand)" : "var(--muted)"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Body Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px" }}>
              {/* TAB: INFO */}
              {activeBuilderTab === "info" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.82rem", maxWidth: "900px" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "3px" }}>Judul Kelas</label>
                    <input
                      type="text"
                      value={editingCourse.title}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.84rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "3px" }}>Kategori</label>
                      <select
                        value={editingCourse.category}
                        onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                        style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                      >
                        {MOCK_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "3px" }}>Level</label>
                      <select
                        value={editingCourse.level}
                        onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                        style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                      >
                        {MOCK_LEVELS.map((l) => (
                          <option key={l.id} value={l.name}>{l.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "3px" }}>Durasi (Jam)</label>
                      <input
                        type="number"
                        value={editingCourse.durationHours}
                        onChange={(e) => setEditingCourse({ ...editingCourse, durationHours: Number(e.target.value) })}
                        style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "3px" }}>Ringkasan Singkat</label>
                    <textarea
                      rows={2}
                      value={editingCourse.shortDesc}
                      onChange={(e) => setEditingCourse({ ...editingCourse, shortDesc: e.target.value })}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "3px" }}>Deskripsi Lengkap Silabus</label>
                    <textarea
                      rows={4}
                      value={editingCourse.fullDesc}
                      onChange={(e) => setEditingCourse({ ...editingCourse, fullDesc: e.target.value })}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                    />
                  </div>
                </div>
              )}

              {/* TAB: TARGET */}
              {activeBuilderTab === "target" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.82rem", maxWidth: "900px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontWeight: 700 }}>Capaian Belajar</label>
                    <button
                      type="button"
                      onClick={() => setEditingCourse({ ...editingCourse, learningTargets: [...editingCourse.learningTargets, "Poin baru"] })}
                      style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)", fontSize: "0.74rem", cursor: "pointer" }}
                    >
                      Tambah Target
                    </button>
                  </div>

                  {editingCourse.learningTargets.map((target, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "6px" }}>
                      <input
                        type="text"
                        value={target}
                        onChange={(e) => {
                          const updated = [...editingCourse.learningTargets];
                          updated[idx] = e.target.value;
                          setEditingCourse({ ...editingCourse, learningTargets: updated });
                        }}
                        style={{ flex: 1, padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                      />
                      <button
                        type="button"
                        onClick={() => setEditingCourse({ ...editingCourse, learningTargets: editingCourse.learningTargets.filter((_, i) => i !== idx) })}
                        style={{ background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: "4px", padding: "0 8px", cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: KURIKULUM (CLEAN, NO HUGE WALL OF TEXT) */}
              {activeBuilderTab === "kurikulum" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid var(--bx-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <strong style={{ fontSize: "0.95rem", color: "var(--brand)" }}>Kurikulum Kelas</strong>
                      <span style={{ fontSize: "0.76rem", color: "var(--muted)" }}>
                        ({editingCourse.modules.length} Bab • {editingCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lesson)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddModule}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "5px",
                        border: "none",
                        background: "var(--brand)",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "0.76rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FlatIcon type="plus" size={12} color="#ffffff" />
                      <span>Tambah Bab</span>
                    </button>
                  </div>

                  {/* Modules */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {editingCourse.modules.map((mod, modIdx) => (
                      <div
                        key={mod.id}
                        style={{
                          background: "var(--bx-surface)",
                          border: "1px solid var(--bx-border)",
                          borderRadius: "6px",
                          padding: "12px 16px",
                        }}
                      >
                        {/* Module Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", gap: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                            <span style={{ fontSize: "0.7rem", padding: "2px 6px", borderRadius: "3px", background: "var(--brand)", color: "#fff", fontWeight: 700 }}>
                              Bab {modIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={mod.title}
                              onChange={(e) => {
                                const updated = [...editingCourse.modules];
                                updated[modIdx].title = e.target.value;
                                setEditingCourse({ ...editingCourse, modules: updated });
                              }}
                              style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--brand)", border: "none", borderBottom: "1px dashed var(--bx-border)", background: "transparent", flex: 1 }}
                            />
                            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                              {mod.lessons.length} Lesson
                            </span>
                          </div>

                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              type="button"
                              onClick={() => handleAddNewLessonWithEditor(mod.id, "text")}
                              style={{ padding: "4px 10px", borderRadius: "4px", border: "1px solid var(--brand)", background: "var(--bx-surface)", color: "var(--brand)", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer" }}
                            >
                              Tambah Materi
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteModule(mod.id)}
                              style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)", color: "#DC2626", fontSize: "0.72rem", cursor: "pointer" }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Lessons List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {mod.lessons.map((lsn, lsnIdx) => {
                            const iconMap: Record<string, string> = { video: "video", text: "document", assignment: "code", quiz: "quiz", download: "download" };
                            return (
                              <div
                                key={lsn.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "8px 12px",
                                  background: "var(--bx-bg-alt)",
                                  border: "1px solid var(--bx-border)",
                                  borderRadius: "4px",
                                  fontSize: "0.82rem",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, flexWrap: "wrap" }}>
                                  <span style={{ fontSize: "0.72rem", color: "var(--muted)", width: "26px" }}>
                                    #{modIdx + 1}.{lsnIdx + 1}
                                  </span>
                                  <FlatIcon type={iconMap[lsn.type] || "document"} size={14} color="var(--brand)" />
                                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{lsn.title || "Lesson Tanpa Judul"}</span>
                                  <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>• {lsn.durationMinutes || 10}m</span>
                                  {lsn.freePreview && (
                                    <span style={{ fontSize: "0.64rem", padding: "1px 5px", borderRadius: "3px", background: "#FEF3C7", color: "#B45309", fontWeight: 700 }}>
                                      Free
                                    </span>
                                  )}

                                  {/* Academic Team Attribution Badges for this Lesson */}
                                  <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginLeft: "6px", flexWrap: "wrap" }}>
                                    <span
                                      title={`Pembuat Kurikulum / Soal: ${lsn.academicTeam?.curriculumAuthor || editingCourse.academicTeam?.curriculumAuthor || "Dr. Maya"}`}
                                      style={{
                                        fontSize: "0.66rem",
                                        padding: "1px 6px",
                                        borderRadius: "10px",
                                        background: "rgba(10, 46, 82, 0.08)",
                                        color: "var(--brand)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      <img
                                        src={lsn.academicTeam?.curriculumAuthorAvatar || editingCourse.academicTeam?.curriculumAuthorAvatar || "/alumni/alumni_5.jpg"}
                                        alt=""
                                        style={{ width: "13px", height: "13px", borderRadius: "50%", objectFit: "cover" }}
                                      />
                                      <span>Pembuat: {(lsn.academicTeam?.curriculumAuthor || editingCourse.academicTeam?.curriculumAuthor || "Dr. Maya").split(",")[0]}</span>
                                    </span>

                                    <span
                                      title={`Instruktur Pengampu: ${lsn.academicTeam?.instructorName || editingCourse.instructorName || "Prof. Budi"}`}
                                      style={{
                                        fontSize: "0.66rem",
                                        padding: "1px 6px",
                                        borderRadius: "10px",
                                        background: "rgba(201, 150, 46, 0.12)",
                                        color: "var(--gold-2)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      <img
                                        src={lsn.academicTeam?.instructorAvatar || editingCourse.instructorAvatar || "/alumni/alumni_1.jpg"}
                                        alt=""
                                        style={{ width: "13px", height: "13px", borderRadius: "50%", objectFit: "cover" }}
                                      />
                                      <span>Instruktur: {(lsn.academicTeam?.instructorName || editingCourse.instructorName || "Prof. Budi").split(",")[0]}</span>
                                    </span>

                                    <span
                                      title={`Reviewer Evaluasi: ${lsn.academicTeam?.reviewerName || editingCourse.academicTeam?.reviewerName || "Rian M."}`}
                                      style={{
                                        fontSize: "0.66rem",
                                        padding: "1px 6px",
                                        borderRadius: "10px",
                                        background: "rgba(5, 150, 105, 0.1)",
                                        color: "#065F46",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      <img
                                        src={lsn.academicTeam?.reviewerAvatar || editingCourse.academicTeam?.reviewerAvatar || "/alumni/alumni_4.jpg"}
                                        alt=""
                                        style={{ width: "13px", height: "13px", borderRadius: "50%", objectFit: "cover" }}
                                      />
                                      <span>Reviewer: {(lsn.academicTeam?.reviewerName || editingCourse.academicTeam?.reviewerName || "Rian M.").split(",")[0]}</span>
                                    </span>
                                  </div>
                                </div>

                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenLessonEditor(mod.id, lsn)}
                                    style={{ padding: "4px 10px", borderRadius: "4px", border: "1px solid var(--brand)", background: "var(--brand)", color: "#ffffff", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                  >
                                    <FlatIcon type="edit" size={12} color="#ffffff" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLesson(mod.id, lsn.id)}
                                    style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "#DC2626", fontSize: "0.72rem", cursor: "pointer" }}
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                          {mod.lessons.length === 0 && (
                            <div style={{ fontSize: "0.76rem", color: "var(--muted)", fontStyle: "italic", padding: "10px", textAlign: "center" }}>
                              Belum ada lesson di bab ini. Klik tombol Tambah Materi di atas.
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: TIM KURIKULUM & AKADEMIK */}
              {activeBuilderTab === "tim-akademik" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "850px" }}>
                  <div style={{ background: "var(--bx-bg-alt)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                    <h3 style={{ margin: "0 0 4px", fontSize: "0.95rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                      Struktur Tim Pengembang Kurikulum &amp; Pengajar Kelas
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.76rem", color: "var(--muted)" }}>
                      Setiap kurikulum wajib memiliki data eksplisit mengenai pembuat kurikulum/tim penyusun, instruktur penanggung jawab, serta tim reviewer yang menilai tugas &amp; kuis.
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    {/* 1. Tim Pembuat Kurikulum */}
                    <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                        <img
                          src={editingCourse.academicTeam?.curriculumAuthorAvatar || "/alumni/alumni_5.jpg"}
                          alt=""
                          style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--brand)" }}
                        />
                        <div>
                          <strong style={{ fontSize: "0.84rem", color: "var(--brand)" }}>Pembuat Kurikulum / Tim Penyusun</strong>
                          <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Desain silabus, modul &amp; kisi-kisi soal</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "3px" }}>Pilih Penulis Silabus</label>
                          <select
                            value={editingCourse.academicTeam?.curriculumAuthor || "Dr. Maya Anggraini, M.Cs."}
                            onChange={(e) => {
                              const found = MOCK_ACADEMIC_STAFF.find((s) => s.name === e.target.value);
                              const curr = editingCourse.academicTeam || DEFAULT_ACADEMIC_TEAM;
                              setEditingCourse({
                                ...editingCourse,
                                academicTeam: {
                                  ...curr,
                                  curriculumAuthor: e.target.value,
                                  curriculumAuthorAvatar: found?.avatar || "/alumni/alumni_5.jpg",
                                  curriculumAuthorRole: found?.role || "Lead Curriculum Designer",
                                },
                              });
                            }}
                            style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)", fontSize: "0.76rem" }}
                          >
                            {MOCK_ACADEMIC_STAFF.map((st) => (
                              <option key={st.id} value={st.name}>{st.name} — {st.role}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "3px" }}>Nama Divisi / Tim Kurikulum</label>
                          <input
                            type="text"
                            value={editingCourse.academicTeam?.curriculumTeam || "Divisi Kurikulum Software Engineering Anvieo"}
                            onChange={(e) => {
                              const curr = editingCourse.academicTeam || DEFAULT_ACADEMIC_TEAM;
                              setEditingCourse({
                                ...editingCourse,
                                academicTeam: { ...curr, curriculumTeam: e.target.value },
                              });
                            }}
                            style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.76rem" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Instruktur Penanggung Jawab */}
                    <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                        <img
                          src={editingCourse.instructorAvatar || "/alumni/alumni_1.jpg"}
                          alt=""
                          style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--gold)" }}
                        />
                        <div>
                          <strong style={{ fontSize: "0.84rem", color: "var(--gold-2)" }}>Instruktur Pengampu Kelas</strong>
                          <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Dosen pengampu &amp; pemateri kelas</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "3px" }}>Pilih Instruktur</label>
                          <select
                            value={editingCourse.instructorName || "Prof. Budi Rahardjo, Ph.D."}
                            onChange={(e) => {
                              const found = MOCK_ACADEMIC_STAFF.find((s) => s.name === e.target.value);
                              const curr = editingCourse.academicTeam || DEFAULT_ACADEMIC_TEAM;
                              setEditingCourse({
                                ...editingCourse,
                                instructorName: e.target.value,
                                instructorAvatar: found?.avatar || "/alumni/alumni_1.jpg",
                                academicTeam: {
                                  ...curr,
                                  instructorName: e.target.value,
                                  instructorAvatar: found?.avatar || "/alumni/alumni_1.jpg",
                                  instructorRole: found?.role || "Master Instructor",
                                },
                              });
                            }}
                            style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)", fontSize: "0.76rem" }}
                          >
                            {MOCK_ACADEMIC_STAFF.map((st) => (
                              <option key={st.id} value={st.name}>{st.name} — {st.role}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "3px" }}>Jabatan / Spesialisasi Pengampu</label>
                          <input
                            type="text"
                            value={editingCourse.academicTeam?.instructorRole || "Master Instructor & Dosen Pengampu"}
                            onChange={(e) => {
                              const curr = editingCourse.academicTeam || DEFAULT_ACADEMIC_TEAM;
                              setEditingCourse({
                                ...editingCourse,
                                academicTeam: { ...curr, instructorRole: e.target.value },
                              });
                            }}
                            style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.76rem" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Reviewer & Penilai Tugas */}
                    <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                        <img
                          src={editingCourse.academicTeam?.reviewerAvatar || "/alumni/alumni_4.jpg"}
                          alt=""
                          style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: "2px solid #059669" }}
                        />
                        <div>
                          <strong style={{ fontSize: "0.84rem", color: "#065F46" }}>Lead Reviewer &amp; Korektor</strong>
                          <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Pemeriksa kode tugas &amp; feedback submission</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "3px" }}>Pilih Lead Reviewer</label>
                          <select
                            value={editingCourse.academicTeam?.reviewerName || "Rian Maulana, S.T."}
                            onChange={(e) => {
                              const found = MOCK_ACADEMIC_STAFF.find((s) => s.name === e.target.value);
                              const curr = editingCourse.academicTeam || DEFAULT_ACADEMIC_TEAM;
                              setEditingCourse({
                                ...editingCourse,
                                academicTeam: {
                                  ...curr,
                                  reviewerName: e.target.value,
                                  reviewerAvatar: found?.avatar || "/alumni/alumni_4.jpg",
                                  reviewerRole: found?.role || "Lead Code Reviewer & Evaluator",
                                },
                              });
                            }}
                            style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)", fontSize: "0.76rem" }}
                          >
                            {MOCK_ACADEMIC_STAFF.map((st) => (
                              <option key={st.id} value={st.name}>{st.name} — {st.role}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "3px" }}>Role Tim Reviewer</label>
                          <input
                            type="text"
                            value={editingCourse.academicTeam?.reviewerRole || "Lead Code Reviewer & Assessment Grader"}
                            onChange={(e) => {
                              const curr = editingCourse.academicTeam || DEFAULT_ACADEMIC_TEAM;
                              setEditingCourse({
                                ...editingCourse,
                                academicTeam: { ...curr, reviewerRole: e.target.value },
                              });
                            }}
                            style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.76rem" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. QA Penjamin Mutu */}
                    <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                        <img
                          src="/alumni/alumni_3.jpg"
                          alt=""
                          style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: "2px solid #7C3AED" }}
                        />
                        <div>
                          <strong style={{ fontSize: "0.84rem", color: "#7C3AED" }}>Penjamin Mutu Akademik (QA)</strong>
                          <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Validasi silabus &amp; standar akreditasi</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: "3px" }}>Auditor Mutu Kurikulum</label>
                          <input
                            type="text"
                            value={editingCourse.academicTeam?.qaValidatorName || "Dr. Ir. Hendra Prasetyo, M.T. (LPMA)"}
                            onChange={(e) => {
                              const curr = editingCourse.academicTeam || DEFAULT_ACADEMIC_TEAM;
                              setEditingCourse({
                                ...editingCourse,
                                academicTeam: { ...curr, qaValidatorName: e.target.value },
                              });
                            }}
                            style={{ width: "100%", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.76rem" }}
                          />
                        </div>

                        <div style={{ padding: "8px", background: "var(--bx-bg-alt)", borderRadius: "4px", fontSize: "0.72rem", color: "#065F46", fontWeight: 600 }}>
                          Status: ● Terverifikasi Standar SKKNI Level 7 &amp; IEEE 2026
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: HARGA */}
              {activeBuilderTab === "harga" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.82rem", maxWidth: "600px" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "3px" }}>Model Akses</label>
                    <select
                      value={editingCourse.accessType}
                      onChange={(e) => setEditingCourse({ ...editingCourse, accessType: e.target.value as any })}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)" }}
                    >
                      <option value="gratis">Gratis</option>
                      <option value="berbayar">Berbayar Sekali Beli</option>
                      <option value="langganan">Khusus Langganan</option>
                    </select>
                  </div>

                  {editingCourse.accessType === "berbayar" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "3px" }}>Harga Normal (Rp)</label>
                        <input
                          type="number"
                          value={editingCourse.normalPrice}
                          onChange={(e) => setEditingCourse({ ...editingCourse, normalPrice: Number(e.target.value) })}
                          style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "3px" }}>Harga Diskon (Rp)</label>
                        <input
                          type="number"
                          value={editingCourse.discountPrice || 0}
                          onChange={(e) => setEditingCourse({ ...editingCourse, discountPrice: Number(e.target.value) })}
                          style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: SEO */}
              {activeBuilderTab === "seo" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.82rem", maxWidth: "600px" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "3px" }}>Status Publikasi</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {[
                        { id: "draft", label: "Draft" },
                        { id: "terpublikasi", label: "Live" },
                        { id: "arsip", label: "Arsip" },
                      ].map((st) => (
                        <label key={st.id} style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                          <input
                            type="radio"
                            name="pubStatus"
                            checked={editingCourse.status === st.id}
                            onChange={() => setEditingCourse({ ...editingCourse, status: st.id as any })}
                          />
                          <span>{st.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: REVIEWS */}
              {activeBuilderTab === "reviews" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--muted)" }}>Total Ulasan: {(editingCourse.reviews || []).length}</span>
                  {(editingCourse.reviews || []).map((rev) => (
                    <div key={rev.id} style={{ padding: "8px 12px", background: "var(--bx-bg-alt)", borderRadius: "4px", border: "1px solid var(--bx-border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>{rev.studentName}</strong>
                        <span style={{ color: "#B45309" }}>★ {rev.rating}</span>
                      </div>
                      <p style={{ margin: "3px 0 0" }}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* LESSON CONTENT STUDIO (FIT WIDTH & FIT HEIGHT 100%, ICON TABS) */}
      {/* ============================================================== */}
      {activeLessonEditor && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "flex-end",
            zIndex: 10001,
            overflow: "hidden",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveLessonEditor(null);
          }}
        >
          <div
            className="course-studio-slider-95"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              borderLeft: "1px solid var(--bx-border)",
              borderRadius: 0,
              width: "95vw",
              maxWidth: "95vw",
              height: "100vh",
              maxHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Top Bar of Lesson Studio (Fit Width, Slim 46px, Icon Selector) */}
            <div
              style={{
                height: "46px",
                padding: "0 14px",
                borderBottom: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bx-bg-alt)",
                flexShrink: 0,
                zIndex: 60,
                gap: "8px",
              }}
            >
              {/* Left: Back & Title */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setActiveLessonEditor(null)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-surface)",
                    fontSize: "0.74rem",
                    cursor: "pointer",
                  }}
                >
                  ←
                </button>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--brand)" }}>
                  {activeLessonEditor.lesson.title || "Lesson"}
                </span>
              </div>

              {/* Center: Simplified Content Type Icons (Flat Icons) */}
              <div style={{ display: "flex", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "5px", padding: "1px", gap: "2px" }}>
                {[
                  { id: "text", icon: "document", label: "Artikel" },
                  { id: "video", icon: "video", label: "Video" },
                  { id: "assignment", icon: "code", label: "Tugas" },
                  { id: "quiz", icon: "quiz", label: "Kuis" },
                  { id: "download", icon: "download", label: "File" },
                ].map((t) => {
                  const isSelected = activeLessonEditor.lesson.type === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        setActiveLessonEditor({
                          ...activeLessonEditor,
                          lesson: { ...activeLessonEditor.lesson, type: t.id as any },
                        })
                      }
                      style={{
                        padding: "4px 10px",
                        borderRadius: "3px",
                        border: "none",
                        background: isSelected ? "var(--brand)" : "transparent",
                        color: isSelected ? "#FFFFFF" : "var(--ink)",
                        fontSize: "0.74rem",
                        fontWeight: isSelected ? 700 : 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <FlatIcon type={t.icon} size={13} color={isSelected ? "#FFFFFF" : "var(--ink)"} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right: Settings & Save */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setShowLessonSettings(!showLessonSettings)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid var(--bx-border)",
                    background: showLessonSettings ? "var(--bx-bg-alt)" : "var(--bx-surface)",
                    fontSize: "0.74rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FlatIcon type="settings" size={13} color="var(--ink)" />
                  <span>{activeLessonEditor.lesson.durationMinutes || 15}m</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveLessonContent()}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "4px",
                    border: "none",
                    background: "var(--brand)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.76rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <FlatIcon type="check" size={13} color="#FFFFFF" />
                  <span>Simpan</span>
                </button>
              </div>
            </div>

            {/* Optional Settings Drawer Strip */}
            {showLessonSettings && (
              <div style={{ background: "var(--bx-surface)", borderBottom: "1px solid var(--bx-border)", padding: "10px 16px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.78rem", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Durasi (Menit):</span>
                    <input
                      type="number"
                      value={activeLessonEditor.lesson.durationMinutes || 15}
                      onChange={(e) =>
                        setActiveLessonEditor({
                          ...activeLessonEditor,
                          lesson: { ...activeLessonEditor.lesson, durationMinutes: Number(e.target.value) },
                        })
                      }
                      style={{ width: "55px", padding: "3px 6px", borderRadius: "3px", border: "1px solid var(--bx-border)" }}
                    />
                  </div>

                  <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={activeLessonEditor.lesson.freePreview}
                      onChange={(e) =>
                        setActiveLessonEditor({
                          ...activeLessonEditor,
                          lesson: { ...activeLessonEditor.lesson, freePreview: e.target.checked },
                        })
                      }
                    />
                    <span>Free Preview</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={activeLessonEditor.lesson.requiresPrev}
                      onChange={(e) =>
                        setActiveLessonEditor({
                          ...activeLessonEditor,
                          lesson: { ...activeLessonEditor.lesson, requiresPrev: e.target.checked },
                        })
                      }
                    />
                    <span>Kunci Prasyarat</span>
                  </label>

                  <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700, marginLeft: "auto" }}>
                    ● Database Revenue Sharing Synced (`simak_materi_revenue_sharing`)
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowLessonSettings(false)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.72rem", padding: "4px" }}
                  >
                    Tutup
                  </button>
                </div>

                {/* Tim Akademik & Kepemilikan Materi / Soal Ini */}
                <div style={{ background: "var(--bx-bg-alt)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "8px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.76rem", color: "var(--brand)", display: "flex", alignItems: "center", gap: "5px" }}>
                      <FlatIcon type="users" size={13} color="var(--brand)" />
                      <span>Tim Akademik &amp; Penanggung Jawab Materi / Soal Ini (Wajib Terdata):</span>
                    </strong>
                    <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
                      Atribusi resmi pembuat kurikulum/soal, instruktur pengampu &amp; reviewer
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "8px" }}>
                    {/* 1. Pembuat Kurikulum / Soal */}
                    <div style={{ padding: "6px 8px", background: "var(--bx-surface)", borderRadius: "4px", border: "1px solid var(--bx-border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--brand)" }}>Pembuat Kurikulum / Soal</span>
                        <img
                          src={activeLessonEditor.lesson.academicTeam?.curriculumAuthorAvatar || "/alumni/alumni_5.jpg"}
                          alt=""
                          style={{ width: "16px", height: "16px", borderRadius: "50%", objectFit: "cover" }}
                        />
                      </div>
                      <select
                        value={activeLessonEditor.lesson.academicTeam?.curriculumAuthor || "Dr. Maya Anggraini, M.Cs."}
                        onChange={(e) => {
                          const found = MOCK_ACADEMIC_STAFF.find((s) => s.name === e.target.value);
                          const curr = activeLessonEditor.lesson.academicTeam || DEFAULT_ACADEMIC_TEAM;
                          setActiveLessonEditor({
                            ...activeLessonEditor,
                            lesson: {
                              ...activeLessonEditor.lesson,
                              academicTeam: {
                                ...curr,
                                curriculumAuthor: e.target.value,
                                curriculumAuthorAvatar: found?.avatar || "/alumni/alumni_5.jpg",
                                curriculumAuthorRole: found?.role || "Lead Curriculum Designer",
                              },
                            },
                          });
                        }}
                        style={{ width: "100%", padding: "3px 6px", fontSize: "0.72rem", borderRadius: "3px", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)" }}
                      >
                        {MOCK_ACADEMIC_STAFF.map((st) => (
                          <option key={st.id} value={st.name}>{st.name} — {st.role.split("&")[0]}</option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Instruktur Pengampu */}
                    <div style={{ padding: "6px 8px", background: "var(--bx-surface)", borderRadius: "4px", border: "1px solid var(--bx-border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--gold-2)" }}>Instruktur Pengampu</span>
                        <img
                          src={activeLessonEditor.lesson.academicTeam?.instructorAvatar || "/alumni/alumni_1.jpg"}
                          alt=""
                          style={{ width: "16px", height: "16px", borderRadius: "50%", objectFit: "cover" }}
                        />
                      </div>
                      <select
                        value={activeLessonEditor.lesson.academicTeam?.instructorName || "Prof. Budi Rahardjo, Ph.D."}
                        onChange={(e) => {
                          const found = MOCK_ACADEMIC_STAFF.find((s) => s.name === e.target.value);
                          const curr = activeLessonEditor.lesson.academicTeam || DEFAULT_ACADEMIC_TEAM;
                          setActiveLessonEditor({
                            ...activeLessonEditor,
                            lesson: {
                              ...activeLessonEditor.lesson,
                              academicTeam: {
                                ...curr,
                                instructorName: e.target.value,
                                instructorAvatar: found?.avatar || "/alumni/alumni_1.jpg",
                                instructorRole: found?.role || "Master Instructor",
                              },
                            },
                          });
                        }}
                        style={{ width: "100%", padding: "3px 6px", fontSize: "0.72rem", borderRadius: "3px", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)" }}
                      >
                        {MOCK_ACADEMIC_STAFF.map((st) => (
                          <option key={st.id} value={st.name}>{st.name} — {st.role.split("&")[0]}</option>
                        ))}
                      </select>
                    </div>

                    {/* 3. Reviewer & Penilai */}
                    <div style={{ padding: "6px 8px", background: "var(--bx-surface)", borderRadius: "4px", border: "1px solid var(--bx-border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#065F46" }}>Reviewer &amp; Korektor</span>
                        <img
                          src={activeLessonEditor.lesson.academicTeam?.reviewerAvatar || "/alumni/alumni_4.jpg"}
                          alt=""
                          style={{ width: "16px", height: "16px", borderRadius: "50%", objectFit: "cover" }}
                        />
                      </div>
                      <select
                        value={activeLessonEditor.lesson.academicTeam?.reviewerName || "Rian Maulana, S.T."}
                        onChange={(e) => {
                          const found = MOCK_ACADEMIC_STAFF.find((s) => s.name === e.target.value);
                          const curr = activeLessonEditor.lesson.academicTeam || DEFAULT_ACADEMIC_TEAM;
                          setActiveLessonEditor({
                            ...activeLessonEditor,
                            lesson: {
                              ...activeLessonEditor.lesson,
                              academicTeam: {
                                ...curr,
                                reviewerName: e.target.value,
                                reviewerAvatar: found?.avatar || "/alumni/alumni_4.jpg",
                                reviewerRole: found?.role || "Lead Code Reviewer",
                              },
                            },
                          });
                        }}
                        style={{ width: "100%", padding: "3px 6px", fontSize: "0.72rem", borderRadius: "3px", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)" }}
                      >
                        {MOCK_ACADEMIC_STAFF.map((st) => (
                          <option key={st.id} value={st.name}>{st.name} — {st.role.split("&")[0]}</option>
                        ))}
                      </select>
                    </div>

                    {/* 4. QA Penjamin Mutu */}
                    <div style={{ padding: "6px 8px", background: "var(--bx-surface)", borderRadius: "4px", border: "1px solid var(--bx-border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7C3AED" }}>QA Penjamin Mutu</span>
                        <span style={{ fontSize: "0.62rem", color: "#059669", fontWeight: 700 }}>● Valid</span>
                      </div>
                      <input
                        type="text"
                        value={activeLessonEditor.lesson.academicTeam?.qaValidatorName || "Dr. Ir. Hendra Prasetyo, M.T. (LPMA)"}
                        onChange={(e) => {
                          const curr = activeLessonEditor.lesson.academicTeam || DEFAULT_ACADEMIC_TEAM;
                          setActiveLessonEditor({
                            ...activeLessonEditor,
                            lesson: {
                              ...activeLessonEditor.lesson,
                              academicTeam: { ...curr, qaValidatorName: e.target.value },
                            },
                          });
                        }}
                        style={{ width: "100%", padding: "3px 6px", fontSize: "0.72rem", borderRadius: "3px", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Revenue Sharing Fee Split Row */}
                <div style={{ display: "flex", gap: "14px", alignItems: "center", background: "var(--bx-bg-alt)", padding: "6px 10px", borderRadius: "4px", flexWrap: "wrap", fontSize: "0.74rem" }}>
                  <span style={{ fontWeight: 700, color: "var(--brand)" }}>
                    Bagi Hasil Fee Soal:
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span>Biaya / Soal: Rp</span>
                    <input
                      type="number"
                      value={activeLessonEditor.lesson.feeShareConfig?.unitPrice || 50000}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const curr = activeLessonEditor.lesson.feeShareConfig || { unitPrice: 50000, instructorPct: 50, reviewerPct: 30, infraPct: 15, opsPct: 5 };
                        setActiveLessonEditor({
                          ...activeLessonEditor,
                          lesson: { ...activeLessonEditor.lesson, feeShareConfig: { ...curr, unitPrice: val } },
                        });
                      }}
                      style={{ width: "70px", padding: "2px 5px", borderRadius: "3px", border: "1px solid var(--bx-border)" }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: "var(--gold-2)", fontWeight: 700 }}>Instruktur:</span>
                    <input
                      type="number"
                      value={activeLessonEditor.lesson.feeShareConfig?.instructorPct ?? 50}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const curr = activeLessonEditor.lesson.feeShareConfig || { unitPrice: 50000, instructorPct: 50, reviewerPct: 30, infraPct: 15, opsPct: 5 };
                        setActiveLessonEditor({
                          ...activeLessonEditor,
                          lesson: { ...activeLessonEditor.lesson, feeShareConfig: { ...curr, instructorPct: val } },
                        });
                      }}
                      style={{ width: "45px", padding: "2px 5px", borderRadius: "3px", border: "1px solid var(--bx-border)" }}
                    />
                    <span>%</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: "#059669", fontWeight: 700 }}>Reviewer:</span>
                    <input
                      type="number"
                      value={activeLessonEditor.lesson.feeShareConfig?.reviewerPct ?? 30}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const curr = activeLessonEditor.lesson.feeShareConfig || { unitPrice: 50000, instructorPct: 50, reviewerPct: 30, infraPct: 15, opsPct: 5 };
                        setActiveLessonEditor({
                          ...activeLessonEditor,
                          lesson: { ...activeLessonEditor.lesson, feeShareConfig: { ...curr, reviewerPct: val } },
                        });
                      }}
                      style={{ width: "45px", padding: "2px 5px", borderRadius: "3px", border: "1px solid var(--bx-border)" }}
                    />
                    <span>%</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: "#7C3AED", fontWeight: 700 }}>Infrastruktur:</span>
                    <input
                      type="number"
                      value={activeLessonEditor.lesson.feeShareConfig?.infraPct ?? 15}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const curr = activeLessonEditor.lesson.feeShareConfig || { unitPrice: 50000, instructorPct: 50, reviewerPct: 30, infraPct: 15, opsPct: 5 };
                        setActiveLessonEditor({
                          ...activeLessonEditor,
                          lesson: { ...activeLessonEditor.lesson, feeShareConfig: { ...curr, infraPct: val } },
                        });
                      }}
                      style={{ width: "45px", padding: "2px 5px", borderRadius: "3px", border: "1px solid var(--bx-border)" }}
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Main Editor Body (Fit Width & Fit Height 100%) */}
            <div style={{ flex: 1, width: "100%", height: "calc(100vh - 46px)", display: "flex", overflow: "hidden" }}>
              {/* TYPE: TEXT / ARTIKEL (100% FIT WIDTH & HEIGHT) */}
              {activeLessonEditor.lesson.type === "text" && (
                <LmsRichContentEditor
                  title={activeLessonEditor.lesson.title}
                  onTitleChange={(t) =>
                    setActiveLessonEditor({
                      ...activeLessonEditor,
                      lesson: { ...activeLessonEditor.lesson, title: t },
                    })
                  }
                  summary={activeLessonEditor.lesson.summary}
                  onSummaryChange={(s) =>
                    setActiveLessonEditor({
                      ...activeLessonEditor,
                      lesson: { ...activeLessonEditor.lesson, summary: s },
                    })
                  }
                  value={activeLessonEditor.lesson.textContent || ""}
                  onChange={(val) =>
                    setActiveLessonEditor({
                      ...activeLessonEditor,
                      lesson: { ...activeLessonEditor.lesson, textContent: val },
                    })
                  }
                />
              )}

              {/* TYPE: VIDEO STUDIO (REAL WORKING PLAYER & TRANSCRIPT) */}
              {activeLessonEditor.lesson.type === "video" && (
                <LmsVideoStudio
                  lesson={activeLessonEditor.lesson}
                  onChange={(updated) =>
                    setActiveLessonEditor({
                      ...activeLessonEditor,
                      lesson: updated,
                    })
                  }
                />
              )}

              {/* TYPE: ASSIGNMENT STUDIO (SUBMISSION DROPZONE, RUBRICS, REQUIRED FILES, TIPS) */}
              {activeLessonEditor.lesson.type === "assignment" && (
                <LmsAssignmentStudio
                  lesson={activeLessonEditor.lesson}
                  onChange={(updated) =>
                    setActiveLessonEditor({
                      ...activeLessonEditor,
                      lesson: updated,
                    })
                  }
                />
              )}

              {/* TYPE: QUIZ STUDIO (MULTIPLE CHOICE QUESTIONS, ANSWER KEYS & STUDENT SIMULATION) */}
              {activeLessonEditor.lesson.type === "quiz" && (
                <LmsQuizStudio
                  lesson={activeLessonEditor.lesson}
                  onChange={(updated) =>
                    setActiveLessonEditor({
                      ...activeLessonEditor,
                      lesson: updated,
                    })
                  }
                />
              )}

              {/* TYPE: DOWNLOAD STUDIO (DOWNLOADABLE ASSETS, METADATA & STUDENT DOWNLOAD CARD) */}
              {activeLessonEditor.lesson.type === "download" && (
                <LmsDownloadStudio
                  lesson={activeLessonEditor.lesson}
                  onChange={(updated) =>
                    setActiveLessonEditor({
                      ...activeLessonEditor,
                      lesson: updated,
                    })
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
