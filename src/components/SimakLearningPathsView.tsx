"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { MOCK_LMS_COURSES, MOCK_CERT_TEMPLATES } from "../data/simakMockData";

interface LearningPathCourseItem {
  courseId: string;
  courseTitle: string;
  isRequired: boolean;
  order: number;
}

interface LearningPathItem {
  id: string;
  code: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  careerTarget: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  price: number;
  freeForSubscriber: boolean;
  isSequential: boolean;
  status: "Terpublikasi" | "Draft";
  activeStudents: number;
  completionRate: number;
  description: string;
  courses: LearningPathCourseItem[];
  enableCertificate: boolean;
  certificateTemplateId: string;
}

const INITIAL_PATHS: LearningPathItem[] = [
  {
    id: "lp-01",
    code: "TRACK-AI-01",
    title: "Artificial Intelligence & LLM Engineer",
    slug: "ai-llm-engineer",
    category: "AI & Data",
    image: "/paths/ai-engineer.jpg",
    careerTarget: "Senior AI Engineer / LLM Architect",
    level: "Lanjutan",
    price: 1999000,
    freeForSubscriber: true,
    isSequential: true,
    status: "Terpublikasi",
    activeStudents: 642,
    completionRate: 74,
    description: "Jalur spesialisasi pembuatan agen cerdas, fine-tuning LLM, RAG enterprise, dan evaluasi penalaran model.",
    enableCertificate: true,
    certificateTemplateId: "tpl-02",
    courses: [
      { courseId: "crs-01", courseTitle: "Fullstack Next.js 16, Turbopack & Cloud Microservices", isRequired: true, order: 1 },
      { courseId: "crs-02", courseTitle: "Engineering Autonomous Multi-Agent AI & FastMCP", isRequired: true, order: 2 },
    ],
  },
  {
    id: "lp-02",
    code: "TRACK-FS-02",
    title: "Fullstack Web & Cloud Architecture",
    slug: "fullstack-cloud-architecture",
    category: "Web & Mobile",
    image: "/paths/fullstack.jpg",
    careerTarget: "Fullstack Principal Engineer",
    level: "Menengah",
    price: 1499000,
    freeForSubscriber: true,
    isSequential: false,
    status: "Terpublikasi",
    activeStudents: 814,
    completionRate: 82,
    description: "Pengembangan web modern Next.js 16, backend distributed microservices, dan integrasi cloud CI/CD.",
    enableCertificate: true,
    certificateTemplateId: "tpl-01",
    courses: [
      { courseId: "crs-01", courseTitle: "Fullstack Next.js 16, Turbopack & Cloud Microservices", isRequired: true, order: 1 },
      { courseId: "crs-03", courseTitle: "Cloud-Native Infrastructure, Kubernetes & CI/CD", isRequired: true, order: 2 },
    ],
  },
  {
    id: "lp-03",
    code: "TRACK-UX-03",
    title: "Product Designer & UI/UX Specialist",
    slug: "product-designer-ui-ux",
    category: "UI/UX Design",
    image: "/paths/fullstack.jpg",
    careerTarget: "Lead Product Designer",
    level: "Pemula",
    price: 899000,
    freeForSubscriber: true,
    isSequential: true,
    status: "Terpublikasi",
    activeStudents: 520,
    completionRate: 88,
    description: "Kuasai Figma design token, usability heuristics, dan integrasi prototype interaktif.",
    enableCertificate: true,
    certificateTemplateId: "tpl-03",
    courses: [
      { courseId: "crs-04", courseTitle: "Fundamental UI/UX Design System & Prototyping Figma", isRequired: true, order: 1 },
    ],
  },
];

type PathBuilderTab = "info" | "courses" | "certificate" | "preview";

export default function SimakLearningPathsView() {
  const [paths, setPaths] = useState<LearningPathItem[]>(INITIAL_PATHS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  // Modal & Slider 95% State
  const [editingPath, setEditingPath] = useState<LearningPathItem | null>(null);
  const [activeTab, setActiveTab] = useState<PathBuilderTab>("info");

  // Drag & drop state for course reordering
  const [draggedCourseIndex, setDraggedCourseIndex] = useState<number | null>(null);
  const [dragOverCourseIndex, setDragOverCourseIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedCourseIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCourseIndex !== index) {
      setDragOverCourseIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedCourseIndex !== null && draggedCourseIndex !== targetIndex) {
      handleReorderCourses(draggedCourseIndex, targetIndex);
    }
    setDraggedCourseIndex(null);
    setDragOverCourseIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedCourseIndex(null);
    setDragOverCourseIndex(null);
  };

  const handleReorderCourses = (fromIndex: number, toIndex: number) => {
    if (!editingPath || fromIndex === toIndex) return;
    const updated = [...editingPath.courses];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    const reindexed = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    setEditingPath({ ...editingPath, courses: reindexed });
  };

  const handleMoveCourse = (index: number, direction: "up" | "down") => {
    if (!editingPath) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editingPath.courses.length) return;
    handleReorderCourses(index, targetIndex);
  };

  const handleOpenNewPath = () => {
    const newPath: LearningPathItem = {
      id: `lp-${Date.now()}`,
      code: `TRACK-NEW-${paths.length + 1}`,
      title: "",
      slug: "",
      category: "Web & Mobile",
      image: "/paths/fullstack.jpg",
      careerTarget: "Software Specialist",
      level: "Pemula",
      price: 990000,
      freeForSubscriber: true,
      isSequential: true,
      status: "Draft",
      activeStudents: 0,
      completionRate: 0,
      description: "",
      courses: [],
      enableCertificate: true,
      certificateTemplateId: "tpl-01",
    };
    setEditingPath(newPath);
    setActiveTab("info");
  };

  const handleSavePath = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPath) return;
    const exists = paths.some((p) => p.id === editingPath.id);
    if (exists) {
      setPaths(paths.map((p) => (p.id === editingPath.id ? editingPath : p)));
    } else {
      setPaths([editingPath, ...paths]);
    }
    alert("Learning Path berhasil disimpan!");
    setEditingPath(null);
  };

  const handleDeletePath = (pathId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus Learning Path ini?")) {
      setPaths(paths.filter((p) => p.id !== pathId));
    }
  };

  const handleAddCourseToPath = (courseId: string) => {
    if (!editingPath) return;
    const courseObj = MOCK_LMS_COURSES.find((c) => c.id === courseId);
    if (!courseObj) return;

    const alreadyAdded = editingPath.courses.some((c) => c.courseId === courseId);
    if (alreadyAdded) {
      alert("Kelas ini sudah ada di dalam jalur pembelajaran.");
      return;
    }

    const newItem: LearningPathCourseItem = {
      courseId: courseObj.id,
      courseTitle: courseObj.title,
      isRequired: true,
      order: editingPath.courses.length + 1,
    };

    setEditingPath({
      ...editingPath,
      courses: [...editingPath.courses, newItem],
    });
  };

  const handleRemoveCourseFromPath = (courseId: string) => {
    if (!editingPath) return;
    const remaining = editingPath.courses
      .filter((c) => c.courseId !== courseId)
      .map((item, idx) => ({ ...item, order: idx + 1 }));
    setEditingPath({
      ...editingPath,
      courses: remaining,
    });
  };

  const filteredPaths = paths.filter((p) => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.careerTarget.toLowerCase().includes(q);
  });

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
              Career Learning Path
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Spesialisasi Karir, Rangkaian Kelas &amp; Sertifikat Jalur
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
            Manajemen Learning Path &amp; Spesialisasi
          </h2>
        </div>

        <button
          type="button"
          onClick={handleOpenNewPath}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "var(--brand, #0A2E52)",
            color: "#ffffff",
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <FlatIcon type="plus" size={14} color="#ffffff" />
          <span>Buat Learning Path Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
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
        <div style={{ display: "flex", gap: "6px" }}>
          {["all", "AI & Data", "Web & Mobile", "UI/UX Design"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "4px 10px",
                borderRadius: "4px",
                border: "none",
                background: selectedCategory === cat ? "var(--brand)" : "var(--bx-bg-alt)",
                color: selectedCategory === cat ? "#ffffff" : "var(--ink)",
                fontSize: "0.76rem",
                fontWeight: selectedCategory === cat ? 700 : 500,
                cursor: "pointer",
              }}
            >
              {cat === "all" ? "Semua Kategori" : cat}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "var(--bx-bg-alt)",
            border: "1px solid var(--bx-border)",
            borderRadius: "6px",
            padding: "5px 10px",
          }}
        >
          <FlatIcon type="search" size={13} color="var(--muted)" />
          <input
            type="text"
            placeholder="Cari learning path..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.78rem", width: "180px", color: "var(--ink)" }}
          />
        </div>
      </div>

      {/* Path Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "14px",
        }}
      >
        {filteredPaths.map((path) => (
          <div
            key={path.id}
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 2px 6px rgba(10, 46, 82, 0.04)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "var(--bx-bg-alt)", color: "var(--brand)" }}>
                  {path.code} • {path.level}
                </span>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "#D1FAE5", color: "#065F46" }}>
                  {path.status}
                </span>
              </div>

              <h3 style={{ margin: "4px 0 6px", fontSize: "1.08rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                {path.title}
              </h3>

              <div style={{ fontSize: "0.76rem", color: "var(--gold-2)", fontWeight: 700, marginBottom: "8px" }}>
                Target: {path.careerTarget}
              </div>

              <p style={{ margin: "0 0 12px", fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.4 }}>
                {path.description}
              </p>

              <div style={{ padding: "8px 10px", background: "var(--bx-bg-alt)", borderRadius: "6px", fontSize: "0.74rem", display: "flex", justifyContent: "space-between" }}>
                <span>Jumlah Rangkaian: <strong>{path.courses.length} Kelas</strong></span>
                <span>Alur: <strong>{path.isSequential ? "Sequential (Harus Urut)" : "Flexible"}</strong></span>
              </div>
            </div>

            <div
              style={{
                marginTop: "14px",
                paddingTop: "12px",
                borderTop: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--brand)" }}>
                  Rp {path.price.toLocaleString("id-ID")}
                </span>
                {path.freeForSubscriber && (
                  <div style={{ fontSize: "0.68rem", color: "#059669", fontWeight: 700 }}>
                    Gratis Subscriber Pro
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => handleDeletePath(path.id)}
                  title="Hapus Path"
                  style={{
                    padding: "5px 8px",
                    borderRadius: "4px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-surface)",
                    color: "#DC2626",
                    fontSize: "0.74rem",
                    cursor: "pointer",
                  }}
                >
                  Hapus
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPath(path);
                    setActiveTab("info");
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "5px",
                    border: "none",
                    background: "var(--brand)",
                    color: "#ffffff",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Atur Jalur &amp; Kelas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* PATH BUILDER SLIDER 95% DRAWER (4 TAB) */}
      {/* ============================================================== */}
      {editingPath && (
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
            if (e.target === e.currentTarget) setEditingPath(null);
          }}
        >
          <div
            className="learning-path-slider-95"
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
              boxShadow: "-12px 0 40px rgba(0,0,0,0.3)",
            }}
          >
            {/* Top Bar of Learning Path Studio */}
            <div
              style={{
                padding: "10px 20px",
                borderBottom: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bx-bg-alt)",
                flexShrink: 0,
                height: "50px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: "var(--brand, #0A2E52)",
                    color: "#ffffff",
                    textTransform: "uppercase",
                  }}
                >
                  SLIDER 95% • LEARNING PATH STUDIO
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-heading)",
                    color: "var(--brand)",
                    fontSize: "1.08rem",
                    fontWeight: 700,
                  }}
                >
                  {editingPath.title || "Learning Path Baru"}
                </h3>
                <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                  ({editingPath.code || "NEW-TRACK"} • {editingPath.category} • {editingPath.level})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setEditingPath(null)}
                title="Tutup Panel Slider"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--bx-surface)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "var(--ink)",
                }}
              >
                <FlatIcon type="close" size={14} color="var(--ink)" />
                <span>Tutup</span>
              </button>
            </div>

            {/* Tabs Navigation */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid var(--bx-border)",
                background: "var(--bx-surface)",
                flexShrink: 0,
                padding: "0 20px",
                gap: "6px",
              }}
            >
              {[
                { id: "info", label: "1. Informasi Jalur" },
                { id: "courses", label: `2. Rangkaian Kelas (${editingPath.courses.length})` },
                { id: "certificate", label: "3. Sertifikat Kelulusan" },
                { id: "preview", label: "4. Publikasi & Akses" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as PathBuilderTab)}
                    style={{
                      padding: "12px 18px",
                      border: "none",
                      borderBottom: isActive ? "3px solid var(--gold, #C9962E)" : "3px solid transparent",
                      background: "transparent",
                      color: isActive ? "var(--brand, #0A2E52)" : "var(--muted)",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.84rem",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              {/* TAB 1: INFO JALUR */}
              {activeTab === "info" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1200px" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                      Judul Learning Path
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPath.title}
                      onChange={(e) => setEditingPath({ ...editingPath, title: e.target.value })}
                      placeholder="Misal: Artificial Intelligence & Autonomous Agent Architect"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Target Profesi / Karir
                      </label>
                      <input
                        type="text"
                        value={editingPath.careerTarget}
                        onChange={(e) => setEditingPath({ ...editingPath, careerTarget: e.target.value })}
                        placeholder="Misal: Senior AI Engineer"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Kategori Jalur
                      </label>
                      <select
                        value={editingPath.category}
                        onChange={(e) => setEditingPath({ ...editingPath, category: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      >
                        <option value="AI & Data">AI &amp; Data</option>
                        <option value="Web & Mobile">Web &amp; Mobile</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Cloud & DevOps">Cloud &amp; DevOps</option>
                        <option value="Cyber Security">Cyber Security</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Jenjang Level
                      </label>
                      <select
                        value={editingPath.level}
                        onChange={(e) => setEditingPath({ ...editingPath, level: e.target.value as any })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      >
                        <option value="Pemula">Pemula (Beginner)</option>
                        <option value="Menengah">Menengah (Intermediate)</option>
                        <option value="Lanjutan">Lanjutan (Advanced)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Kode Jalur (Track Code)
                      </label>
                      <input
                        type="text"
                        value={editingPath.code}
                        onChange={(e) => setEditingPath({ ...editingPath, code: e.target.value })}
                        placeholder="TRACK-AI-01"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Slug URL
                      </label>
                      <input
                        type="text"
                        value={editingPath.slug}
                        onChange={(e) => setEditingPath({ ...editingPath, slug: e.target.value })}
                        placeholder="ai-llm-engineer"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                      Deskripsi Lengkap Jalur &amp; Silabus Karir
                    </label>
                    <textarea
                      rows={5}
                      value={editingPath.description}
                      onChange={(e) => setEditingPath({ ...editingPath, description: e.target.value })}
                      placeholder="Jelaskan kompetensi apa saja yang akan dikuasai setelah menyelesaikan alur spesialisasi ini..."
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem", lineHeight: 1.5 }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: SUSUNAN KELAS & DRAG-AND-DROP REORDER */}
              {activeTab === "courses" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1200px" }}>
                  {/* Options Bar */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "8px",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={editingPath.isSequential}
                        onChange={(e) => setEditingPath({ ...editingPath, isSequential: e.target.checked })}
                      />
                      <span>Urutan Sequential (Siswa wajib menyelesaikan kelas bertahap dari tahap pertama ke selanjutnya)</span>
                    </label>

                    <div style={{ fontSize: "0.76rem", color: "var(--brand)", fontWeight: 700 }}>
                      {editingPath.courses.length} Kelas Terdaftar
                    </div>
                  </div>

                  {/* Drag and Drop Instruction Callout */}
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "6px",
                      background: "rgba(10, 46, 82, 0.05)",
                      border: "1px solid rgba(10, 46, 82, 0.12)",
                      fontSize: "0.78rem",
                      color: "var(--brand)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>💡</span>
                    <div>
                      <strong>Petunjuk Pengurutan Alur:</strong> Tahan dan geser (<strong>drag &amp; drop</strong>) kotak kelas ke atas atau ke bawah untuk mengatur urutan tahap pembelajaran siswa. Anda juga bisa menekan tombol panah <strong>▲ / ▼</strong> untuk menaikkan/menurunkan posisi.
                    </div>
                  </div>

                  {/* Registered Draggable Courses */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <strong style={{ color: "var(--brand)", fontSize: "0.86rem" }}>
                        Kelas Terdaftar Dalam Jalur Ini ({editingPath.courses.length}):
                      </strong>
                      <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                        Tahap 1 adalah kelas pembuka yang harus diselesaikan siswa terlebih dahulu
                      </span>
                    </div>

                    {editingPath.courses.map((item, idx) => {
                      const isDragging = draggedCourseIndex === idx;
                      const isOver = dragOverCourseIndex === idx && draggedCourseIndex !== idx;

                      return (
                        <div
                          key={item.courseId}
                          draggable
                          onDragStart={(e) => handleDragStart(e, idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDrop={(e) => handleDrop(e, idx)}
                          onDragEnd={handleDragEnd}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 16px",
                            background: isOver
                              ? "rgba(201, 150, 46, 0.08)"
                              : "var(--bx-surface, #FFFFFF)",
                            border: isOver
                              ? "2px dashed var(--gold, #C9962E)"
                              : isDragging
                              ? "1px dashed var(--brand, #0A2E52)"
                              : "1px solid var(--bx-border)",
                            borderRadius: "8px",
                            opacity: isDragging ? 0.45 : 1,
                            cursor: "grab",
                            transition: "border 0.15s ease, background-color 0.15s ease, transform 0.15s ease",
                            boxShadow: isOver ? "0 4px 12px rgba(201, 150, 46, 0.2)" : "0 1px 3px rgba(10, 46, 82, 0.04)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                            {/* Drag Grip Handle */}
                            <div
                              title="Tahan dan geser untuk mengubah urutan"
                              style={{
                                cursor: "grab",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--muted)",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                background: "var(--bx-bg-alt)",
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="9" cy="5" r="1.8" />
                                <circle cx="9" cy="12" r="1.8" />
                                <circle cx="9" cy="19" r="1.8" />
                                <circle cx="15" cy="5" r="1.8" />
                                <circle cx="15" cy="12" r="1.8" />
                                <circle cx="15" cy="19" r="1.8" />
                              </svg>
                            </div>

                            {/* Stage Badge */}
                            <span
                              style={{
                                fontSize: "0.74rem",
                                fontWeight: 800,
                                padding: "3px 8px",
                                borderRadius: "4px",
                                background: "var(--brand, #0A2E52)",
                                color: "#ffffff",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Tahap #{idx + 1}
                            </span>

                            {/* Course Title and Info */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ fontWeight: 700, fontSize: "0.86rem", color: "var(--ink)" }}>
                                {item.courseTitle}
                              </span>
                              <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                                ID: {item.courseId} • Urutan kurikulum ke-{idx + 1}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                padding: "3px 8px",
                                background: "#D1FAE5",
                                color: "#065F46",
                                borderRadius: "4px",
                                fontWeight: 700,
                              }}
                            >
                              Wajib Selesai
                            </span>

                            {/* Manual Move Arrow Buttons */}
                            <div style={{ display: "flex", gap: "3px" }}>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveCourse(idx, "up");
                                }}
                                title="Pindahkan ke atas (Tahap sebelumnya)"
                                style={{
                                  width: "26px",
                                  height: "26px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.72rem",
                                  background: "var(--bx-bg-alt)",
                                  border: "1px solid var(--bx-border)",
                                  borderRadius: "4px",
                                  cursor: idx === 0 ? "not-allowed" : "pointer",
                                  opacity: idx === 0 ? 0.35 : 1,
                                  color: "var(--ink)",
                                }}
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                disabled={idx === editingPath.courses.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveCourse(idx, "down");
                                }}
                                title="Pindahkan ke bawah (Tahap berikutnya)"
                                style={{
                                  width: "26px",
                                  height: "26px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.72rem",
                                  background: "var(--bx-bg-alt)",
                                  border: "1px solid var(--bx-border)",
                                  borderRadius: "4px",
                                  cursor: idx === editingPath.courses.length - 1 ? "not-allowed" : "pointer",
                                  opacity: idx === editingPath.courses.length - 1 ? 0.35 : 1,
                                  color: "var(--ink)",
                                }}
                              >
                                ▼
                              </button>
                            </div>

                            {/* Remove Course Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveCourseFromPath(item.courseId)}
                              title="Hapus dari Jalur"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                border: "1px solid #FCA5A5",
                                background: "#FEF2F2",
                                color: "#DC2626",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              <FlatIcon type="trash" size={13} color="#DC2626" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {editingPath.courses.length === 0 && (
                      <div
                        style={{
                          color: "var(--muted)",
                          fontStyle: "italic",
                          padding: "24px",
                          textAlign: "center",
                          background: "var(--bx-bg-alt)",
                          border: "1px dashed var(--bx-border)",
                          borderRadius: "8px",
                        }}
                      >
                        Belum ada kelas yang didaftarkan ke dalam alur ini. Silakan pilih kelas dari katalog master di bawah.
                      </div>
                    )}
                  </div>

                  {/* Add Available Courses from Catalog */}
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--bx-border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <strong style={{ color: "var(--brand)", fontSize: "0.86rem" }}>
                        Katalog Kelas Tersedia (Klik untuk Menambahkan ke Jalur):
                      </strong>
                      <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                        Total {MOCK_LMS_COURSES.length} kelas di database
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {MOCK_LMS_COURSES.map((crs) => {
                        const isAdded = editingPath.courses.some((c) => c.courseId === crs.id);
                        return (
                          <div
                            key={crs.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "10px 14px",
                              background: isAdded ? "var(--bx-bg-alt)" : "var(--bx-surface)",
                              border: "1px solid var(--bx-border)",
                              borderRadius: "6px",
                              opacity: isAdded ? 0.65 : 1,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  padding: "2px 6px",
                                  borderRadius: "3px",
                                  background: "var(--bx-bg-alt)",
                                  border: "1px solid var(--bx-border)",
                                  fontWeight: 600,
                                }}
                              >
                                {crs.category}
                              </span>
                              <span style={{ fontWeight: 600, fontSize: "0.82rem" }}>{crs.title}</span>
                            </div>

                            <button
                              type="button"
                              disabled={isAdded}
                              onClick={() => handleAddCourseToPath(crs.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "5px 12px",
                                borderRadius: "5px",
                                border: "none",
                                background: isAdded ? "var(--bx-border)" : "var(--brand)",
                                color: "#ffffff",
                                fontSize: "0.75rem",
                                cursor: isAdded ? "default" : "pointer",
                                fontWeight: 600,
                              }}
                            >
                              {isAdded ? (
                                <>
                                  <FlatIcon type="check" size={13} color="#ffffff" />
                                  <span>Terdaftar</span>
                                </>
                              ) : (
                                <>
                                  <FlatIcon type="plus" size={13} color="#ffffff" />
                                  <span>Tambah ke Path</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SERTIFIKAT JALUR */}
              {activeTab === "certificate" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "900px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.86rem" }}>
                    <input
                      type="checkbox"
                      checked={editingPath.enableCertificate}
                      onChange={(e) => setEditingPath({ ...editingPath, enableCertificate: e.target.checked })}
                    />
                    <span>Terbitkan Sertifikat Khusus Kelulusan Learning Path</span>
                  </label>

                  {editingPath.enableCertificate && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "var(--bx-bg-alt)", padding: "16px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                      <div>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                          Pilih Desain Template Sertifikat:
                        </label>
                        <select
                          value={editingPath.certificateTemplateId}
                          onChange={(e) => setEditingPath({ ...editingPath, certificateTemplateId: e.target.value })}
                          style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                        >
                          {MOCK_CERT_TEMPLATES.map((tpl) => (
                            <option key={tpl.id} value={tpl.id}>{tpl.title} ({tpl.categoryName})</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ fontSize: "0.76rem", color: "var(--muted)", lineHeight: 1.5 }}>
                        Sertifikat kredensial otomatis diterbitkan dan dikirimkan ke profil siswa setelah mereka menyelesaikan 100% kelas wajib dan tugas kelulusan dalam rangkaian jalur ini.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PUBLIKASI & PREVIEW */}
              {activeTab === "preview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "900px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Harga Paket Bundle (Rp)
                      </label>
                      <input
                        type="number"
                        value={editingPath.price}
                        onChange={(e) => setEditingPath({ ...editingPath, price: Number(e.target.value) })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Status Publikasi
                      </label>
                      <select
                        value={editingPath.status}
                        onChange={(e) => setEditingPath({ ...editingPath, status: e.target.value as any })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      >
                        <option value="Draft">Draft Internal</option>
                        <option value="Terpublikasi">Terpublikasi ke Katalog Siswa</option>
                      </select>
                    </div>
                  </div>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={editingPath.freeForSubscriber}
                      onChange={(e) => setEditingPath({ ...editingPath, freeForSubscriber: e.target.checked })}
                    />
                    <span>Gratis untuk seluruh siswa yang memiliki Paket Langganan Pro / Enterprise</span>
                  </label>

                  <div style={{ padding: "14px", borderRadius: "8px", background: "var(--bx-bg-alt)", border: "1px solid var(--bx-border)" }}>
                    <div style={{ fontWeight: 700, color: "var(--brand)", marginBottom: "4px" }}>
                      Ringkasan Jalur Spesialisasi:
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                      Jalur ini mencakup {editingPath.courses.length} kelas terdaftar dengan target karir <strong>{editingPath.careerTarget || "N/A"}</strong>, jenjang <strong>{editingPath.level}</strong>, dan alur kurikulum <strong>{editingPath.isSequential ? "Sequential (Wajib Urut)" : "Fleksibel"}</strong>.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Footer Bar */}
            <div
              style={{
                padding: "12px 24px",
                borderTop: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bx-bg-alt)",
                flexShrink: 0,
                height: "56px",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                Total: <strong style={{ color: "var(--brand)" }}>{editingPath.courses.length} Kelas</strong> terdaftar dalam alur ini • Status: <strong>{editingPath.status}</strong>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setEditingPath(null)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-surface)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    color: "var(--ink)",
                  }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSavePath}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 20px",
                    borderRadius: "6px",
                    border: "none",
                    background: "var(--brand, #0A2E52)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(10, 46, 82, 0.2)",
                  }}
                >
                  <FlatIcon type="check" size={14} color="#ffffff" />
                  <span>Simpan Learning Path</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
