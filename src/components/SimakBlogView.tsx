"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { LmsBlogComment, LmsBlogCategory } from "../types/simak";
import { MOCK_BLOG_CATEGORIES, MOCK_BLOG_COMMENTS } from "../data/simakMockData";
import LmsRichContentEditor from "./LmsRichContentEditor";
import MarkdownRenderer from "../utils/markdownParser";

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  viewCount: number;
  readTime: string;
  status: "Publikasi" | "Draft";
  excerpt: string;
  bodyContent?: string;
  seoTitle?: string;
  seoDescription?: string;
}

const INITIAL_ARTICLES: BlogPostItem[] = [
  {
    id: "blog-01",
    title: "Panduan Arsitektur Autonomous Multi-Agent Menggunakan Google Antigravity & FastMCP",
    slug: "panduan-arsitektur-autonomous-multi-agent",
    category: "Tutorial & Engineering",
    image: "/blog/blog-1.jpg",
    author: "Prof. Budi Rahardjo, Ph.D.",
    authorRole: "Master Instructor Cloud AI",
    publishedAt: "26 Oktober 2026",
    viewCount: 4280,
    readTime: "7 menit baca",
    status: "Publikasi",
    excerpt: "Membahas orkestrasi agen kecerdasan artifisial otonom, integrasi tools MCP terdistribusi, dan strategi state caching berbasis SQLite di environment produksi.",
    bodyContent: `# Panduan Arsitektur Autonomous Multi-Agent

Membahas orkestrasi agen kecerdasan artifisial otonom dengan FastMCP dan state caching SQLite di lingkungan produksi.

---

### Informasi Rilis & Ringkasan Modul
* **Status:** Siap Produksi (Production Ready)
* **Kategori:** Tutorial & Rekayasa Sistem
* **Versi Agen:** v2.4.1-LTS
* **Target Infrastruktur:** Multi-tenant VPS & Container

---

## 1. Konsep Dasar Desain Multi-Agent

Dalam ekosistem kecerdasan artifisial modern, agen tidak lagi bekerja secara monolithic. Setiap worker agen didelegasikan sub-tugas independen dengan batasan wewenang yang tegas.

> [!NOTE]
> Pastikan setiap sub-agen memiliki batas waktu eksekusi (timeout) dan isolasi context agar tidak membebani memory heap container server.

\`\`\`typescript
// Registrasi FastMCP Tool pada Agen Penilai
export const assessmentServer = new FastMCPServer({
  name: "lms-evaluator",
  version: "1.0.0",
});

assessmentServer.addTool({
  name: "evaluateCodeSubmission",
  description: "Evaluasi submission kode mahasiswa secara otomatis",
  parameters: z.object({ code: z.string(), language: z.string() }),
  execute: async ({ code, language }) => {
    // AST Analysis & Execution
    return { score: 95, status: "PASSED" };
  },
});
\`\`\`

---

## 2. Checklist Kesiapan Uji Coba

- [x] Konfigurasi environment variables (.env.production)
- [x] Migrasi schema SQLite state tracking
- [ ] Implementasi failover circuit breaker
- [ ] Pengujian beban 10.000 concurrent requests

| Modul Agen | Peran Utama | Latensi Rata-rata |
| :--- | :--- | :--- |
| Orchestrator | Router & Task Planner | ~120ms |
| Code Assessor | Evaluasi Sintaks & AST | ~450ms |
| Feedback Writer | Analisis Rubrik Penilaian | ~380ms |
`,
  },
  {
    id: "blog-02",
    title: "Penerapan Kurikulum Outcome-Based Education (OBE) pada Program Studi Rekayasa Perangkat Lunak",
    slug: "penerapan-kurikulum-obe-rpl",
    category: "Riset Akademik & AI",
    image: "/blog/blog-2.jpg",
    author: "Dr. Maya Anggraini, M.Cs.",
    authorRole: "Koordinator Kurikulum BAAK",
    publishedAt: "24 Oktober 2026",
    viewCount: 2840,
    readTime: "10 menit baca",
    status: "Publikasi",
    excerpt: "Metodologi pemetaan Capaian Pembelajaran Lulusan (CPL), integrasi tugas industri dalam SKS, dan evaluasi berkelanjutan sesuai standar LAM-INFOKOM.",
    bodyContent: `# Penerapan Kurikulum Outcome-Based Education (OBE)

Metodologi pemetaan Capaian Pembelajaran Lulusan (CPL), integrasi tugas industri dalam SKS, dan evaluasi berkelanjutan sesuai standar LAM-INFOKOM.

---

### Parameter Kurikulum
* **Status:** Terakreditasi Unggul
* **Standar:** LAM-INFOKOM & IABEE
* **Tahun Berlaku:** 2026/2027

> [!TIP]
> Evaluasi berkala setiap semester dapat meningkatkan serapan lulusan hingga 35% pada industri teknologi global.
`,
  },
  {
    id: "blog-03",
    title: "Benchmark Performa PostgreSQL 16 & HNSW Vector Indexing untuk 1.000.000 Embedding",
    slug: "benchmark-postgresql-16-hnsw-vector",
    category: "Tutorial & Engineering",
    image: "/blog/blog-3.jpg",
    author: "Rian Maulana, S.T.",
    authorRole: "Lead Technical Assessor",
    publishedAt: "21 Oktober 2026",
    viewCount: 5120,
    readTime: "8 menit baca",
    status: "Publikasi",
    excerpt: "Eksperimen komparatif cosine distance vs L2 distance, tuning parameter m dan ef_construction, serta evaluasi latency query pencarian kemiripan.",
  },
];

type BlogTab = "artikel" | "komentar" | "kategori";

export default function SimakBlogView() {
  const [activeTab, setActiveTab] = useState<BlogTab>("artikel");
  const [articles, setArticles] = useState<BlogPostItem[]>(INITIAL_ARTICLES);
  const [comments, setComments] = useState<LmsBlogComment[]>(MOCK_BLOG_COMMENTS);
  const [categories, setCategories] = useState<LmsBlogCategory[]>(MOCK_BLOG_CATEGORIES);

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // Editor & Preview Modal
  const [editingArticle, setEditingArticle] = useState<BlogPostItem | null>(null);
  const [previewArticle, setPreviewArticle] = useState<BlogPostItem | null>(null);

  // New Category Form
  const [newCatName, setNewCatName] = useState("");

  const handleOpenNewArticle = () => {
    const newArt: BlogPostItem = {
      id: `blog-${Date.now()}`,
      title: "",
      slug: "",
      category: "Tutorial & Engineering",
      image: "/blog/blog-1.jpg",
      author: "Prof. Budi Rahardjo, Ph.D.",
      authorRole: "Master Instructor Cloud AI",
      publishedAt: "Hari ini",
      viewCount: 0,
      readTime: "5 menit baca",
      status: "Draft",
      excerpt: "",
      bodyContent: "",
      seoTitle: "",
      seoDescription: "",
    };
    setEditingArticle(newArt);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    const exists = articles.some((a) => a.id === editingArticle.id);
    if (exists) {
      setArticles(articles.map((a) => (a.id === editingArticle.id ? editingArticle : a)));
    } else {
      setArticles([editingArticle, ...articles]);
    }
    alert("Artikel blog berhasil disimpan!");
    setEditingArticle(null);
  };

  const handleDeleteArticle = (artId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      setArticles(articles.filter((a) => a.id !== artId));
    }
  };

  const handleModerateComment = (commentId: string, newStatus: "approved" | "rejected") => {
    setComments(
      comments.map((c) => (c.id === commentId ? { ...c, status: newStatus } : c))
    );
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm("Hapus komentar ini?")) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: LmsBlogCategory = {
      id: `bcat-${Date.now()}`,
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, "-"),
      articleCount: 0,
    };
    setCategories([...categories, newCat]);
    setNewCatName("");
  };

  const filteredArticles = articles.filter((b) => {
    if (filterCategory !== "all" && b.category !== filterCategory) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
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
              Content Management
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Artikel, Publikasi Riset &amp; Moderasi Komunitas
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
            Blog &amp; Konten Edukasi
          </h2>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "6px", background: "var(--bx-bg-alt)", padding: "4px", borderRadius: "8px" }}>
          {[
            { id: "artikel", label: "Daftar Artikel", icon: "book" },
            { id: "komentar", label: `Moderasi Komentar (${comments.filter((c) => c.status === "pending").length})`, icon: "clipboard" },
            { id: "kategori", label: "Kategori Blog", icon: "layers" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as BlogTab)}
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
      {/* TAB 1: DAFTAR ARTIKEL */}
      {/* ============================================================== */}
      {activeTab === "artikel" && (
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
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--bx-bg-alt)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "6px",
                  padding: "6px 10px",
                }}
              >
                <FlatIcon type="search" size={13} color="var(--muted)" />
                <input
                  type="text"
                  placeholder="Cari judul artikel / penulis..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.8rem", width: "200px", color: "var(--ink)" }}
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-surface)",
                  color: "var(--ink)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                <option value="all">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleOpenNewArticle}
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
              <span>Tulis Artikel Baru</span>
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
              gap: "14px",
            }}
          >
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                style={{
                  background: "var(--bx-surface, #FFFFFF)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 6px rgba(10, 46, 82, 0.04)",
                }}
              >
                <div style={{ padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "var(--bx-bg-alt)", color: "var(--brand)" }}>
                      {art.category}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
                      👁 {art.viewCount.toLocaleString("id-ID")} views
                    </span>
                  </div>

                  <h3 style={{ margin: "4px 0 8px", fontSize: "1.02rem", color: "var(--brand)", fontFamily: "var(--font-heading)", lineHeight: 1.35 }}>
                    {art.title}
                  </h3>

                  <p style={{ margin: "0 0 12px", fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.4 }}>
                    {art.excerpt}
                  </p>
                </div>

                <div
                  style={{
                    padding: "10px 16px",
                    background: "var(--bx-bg-alt)",
                    borderTop: "1px solid var(--bx-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  <div>
                    <strong>{art.author}</strong>
                    <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>{art.publishedAt}</div>
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => setPreviewArticle(art)}
                      title="Lihat Tampilan Preview Artikel Lengkap"
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        border: "1px solid var(--bx-border)",
                        background: "var(--bx-surface)",
                        color: "var(--brand)",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(art.id)}
                      title="Hapus Artikel"
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
                      onClick={() => setEditingArticle(art)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "4px",
                        border: "none",
                        background: "var(--brand)",
                        color: "#ffffff",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Edit Artikel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MODERASI KOMENTAR */}
      {/* ============================================================== */}
      {activeTab === "komentar" && (
        <div
          style={{
            background: "var(--bx-surface, #FFFFFF)",
            border: "1px solid var(--bx-border)",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                <th style={{ padding: "10px 14px" }}>Pengirim Komentar</th>
                <th style={{ padding: "10px 14px" }}>Artikel Terkait</th>
                <th style={{ padding: "10px 14px" }}>Isi Komentar</th>
                <th style={{ padding: "10px 14px" }}>Status</th>
                <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi Moderasi</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((com) => (
                <tr key={com.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ fontWeight: 700, color: "var(--brand)" }}>{com.authorName}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{com.authorEmail}</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>{com.createdAt}</div>
                  </td>
                  <td style={{ padding: "10px 14px", maxWidth: "200px" }}>
                    <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {com.articleTitle}
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", maxWidth: "340px", color: "var(--ink)", lineHeight: 1.4 }}>
                    {com.content}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontWeight: 700,
                        background:
                          com.status === "approved" ? "#D1FAE5" :
                          com.status === "pending" ? "#FEF3C7" : "#FEE2E2",
                        color:
                          com.status === "approved" ? "#065F46" :
                          com.status === "pending" ? "#B45309" : "#DC2626",
                        textTransform: "uppercase",
                      }}
                    >
                      {com.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                      {com.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => handleModerateComment(com.id, "approved")}
                          style={{ padding: "4px 8px", borderRadius: "4px", border: "none", background: "#059669", color: "#ffffff", fontSize: "0.72rem", cursor: "pointer", fontWeight: 700 }}
                        >
                          Approve
                        </button>
                      )}
                      {com.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => handleModerateComment(com.id, "rejected")}
                          style={{ padding: "4px 8px", borderRadius: "4px", border: "none", background: "#D97706", color: "#ffffff", fontSize: "0.72rem", cursor: "pointer" }}
                        >
                          Tolak
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(com.id)}
                        style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "transparent", color: "#DC2626", fontSize: "0.72rem", cursor: "pointer" }}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: KATEGORI BLOG */}
      {/* ============================================================== */}
      {activeTab === "kategori" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", fontSize: "0.82rem" }}>
          <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Daftar Kategori Artikel Blog
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    background: "var(--bx-bg-alt)",
                    borderRadius: "6px",
                  }}
                >
                  <div>
                    <strong>{cat.name}</strong>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                      slug: {cat.slug}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--brand)" }}>
                    {cat.articleCount} Artikel
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Tambah Kategori Blog Baru
            </h3>
            <form onSubmit={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Nama Kategori</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Info Karir & Internship"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                />
              </div>
              <button
                type="submit"
                style={{ padding: "8px 14px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}
              >
                Tambah Kategori
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDITOR ARTIKEL */}
      {/* ============================================================== */}
      {editingArticle && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "12px",
              width: "95vw",
              maxWidth: "1160px",
              height: "92vh",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bx-bg-alt)",
              }}
            >
              <div>
                <span style={{ fontSize: "0.7rem", color: "var(--gold-2)", fontWeight: 700, textTransform: "uppercase" }}>
                  Article Studio Editor
                </span>
                <h3 style={{ margin: "2px 0 0", fontFamily: "var(--font-heading)", color: "var(--brand)", fontSize: "1.15rem" }}>
                  {editingArticle.title || "Tulis Artikel Baru"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--muted)" }}
              >
                ✕
              </button>
            </div>

            {/* Body Form */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.82rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="Misal: Menguasai Antigravity SDK & Distributed Agent Swarm"
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.9rem", fontWeight: 700 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Kategori</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Penulis (Author)</label>
                  <select
                    value={editingArticle.author}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                  >
                    <option value="Prof. Budi Rahardjo, Ph.D.">Prof. Budi Rahardjo, Ph.D.</option>
                    <option value="Rian Maulana, S.T.">Rian Maulana, S.T.</option>
                    <option value="Dr. Maya Anggraini, M.Cs.">Dr. Maya Anggraini, M.Cs.</option>
                    <option value="Tim Redaksi ANVIEO">Tim Redaksi ANVIEO</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Ringkasan Excerpt</label>
                <textarea
                  rows={2}
                  value={editingArticle.excerpt}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  placeholder="Tuliskan 1-2 kalimat ringkasan untuk feed publik..."
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ display: "block", fontWeight: 750, color: "var(--brand)" }}>
                    Naskah Artikel Lengkap (Split Markdown &amp; Visual WYSIWYG):
                  </label>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                    Mendukung paste dari file .md (Kode, Tabel, * **Status:**, ---, dll)
                  </span>
                </div>
                <div
                  style={{
                    height: "440px",
                    border: "1px solid var(--bx-border)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <LmsRichContentEditor
                    value={editingArticle.bodyContent || ""}
                    onChange={(val) => setEditingArticle({ ...editingArticle, bodyContent: val })}
                    placeholder="Tulis naskah artikel atau paste kode dari file .md di sini... Gunakan 'Rapikan MD' untuk standarisasi format otomatis."
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>SEO Meta Title</label>
                  <input
                    type="text"
                    value={editingArticle.seoTitle || editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, seoTitle: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Status Publikasi</label>
                  <select
                    value={editingArticle.status}
                    onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as any })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                  >
                    <option value="Draft">Draft Internal</option>
                    <option value="Publikasi">Publikasi Sekarang (Live)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                background: "var(--bx-bg-alt)",
              }}
            >
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", fontSize: "0.82rem" }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveArticle}
                style={{ padding: "8px 18px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
              >
                Simpan &amp; Publikasikan Artikel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: PREVIEW ARTIKEL LENGKAP DENGAN FORMAT MARKDOWN RAPI */}
      {/* ============================================================== */}
      {previewArticle && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "880px",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "14px 22px",
                borderBottom: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bx-bg-alt)",
              }}
            >
              <div>
                <span style={{ fontSize: "0.7rem", color: "var(--gold-2)", fontWeight: 750, textTransform: "uppercase" }}>
                  Preview Naskah Publikasi
                </span>
                <h3 style={{ margin: "2px 0 0", fontFamily: "var(--font-heading)", color: "var(--brand)", fontSize: "1.15rem" }}>
                  {previewArticle.title}
                </h3>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = previewArticle;
                    setPreviewArticle(null);
                    setEditingArticle(toEdit);
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "none",
                    background: "var(--brand)",
                    color: "#FFFFFF",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Edit Naskah
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewArticle(null)}
                  style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--muted)" }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Meta Strip */}
            <div
              style={{
                padding: "10px 22px",
                background: "rgba(10, 46, 82, 0.03)",
                borderBottom: "1px solid var(--bx-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
                fontSize: "0.76rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ padding: "2px 8px", borderRadius: "3px", background: "var(--brand)", color: "#FFFFFF", fontWeight: 700 }}>
                  {previewArticle.category}
                </span>
                <span style={{ color: "var(--muted)" }}>
                  Penulis: <strong>{previewArticle.author}</strong> ({previewArticle.authorRole})
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--muted)" }}>
                <span>{previewArticle.publishedAt}</span>
                <span>•</span>
                <span>{previewArticle.readTime}</span>
                <span>•</span>
                <span>
                  Status:{" "}
                  <strong style={{ color: previewArticle.status === "Publikasi" ? "#16A34A" : "#D97706" }}>
                    {previewArticle.status}
                  </strong>
                </span>
              </div>
            </div>

            {/* Article Content Rendered */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", background: "var(--bx-surface)" }}>
              {previewArticle.excerpt && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--bx-bg-alt)",
                    borderLeft: "3px solid var(--gold)",
                    borderRadius: "0 6px 6px 0",
                    marginBottom: "20px",
                    fontSize: "0.86rem",
                    fontStyle: "italic",
                    color: "var(--ink)",
                  }}
                >
                  {previewArticle.excerpt}
                </div>
              )}
              <MarkdownRenderer content={previewArticle.bodyContent || ""} />
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "10px 22px",
                borderTop: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "flex-end",
                background: "var(--bx-bg-alt)",
              }}
            >
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "4px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-surface)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
