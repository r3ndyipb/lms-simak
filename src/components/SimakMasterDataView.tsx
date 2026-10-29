"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import {
  LmsCategory,
  LmsLevel,
  LmsTag,
  LmsLanguage,
  LmsCertificateTemplate,
} from "../types/simak";
import {
  MOCK_CATEGORIES,
  MOCK_LEVELS,
  MOCK_TAGS,
  MOCK_LANGUAGES,
  MOCK_CERT_TEMPLATES,
} from "../data/simakMockData";

type MasterDataTab = "kategori" | "level" | "tag" | "bahasa" | "sertifikat";

export default function SimakMasterDataView() {
  const [activeTab, setActiveTab] = useState<MasterDataTab>("kategori");

  // State collections
  const [categories, setCategories] = useState<LmsCategory[]>(MOCK_CATEGORIES);
  const [levels, setLevels] = useState<LmsLevel[]>(MOCK_LEVELS);
  const [tags, setTags] = useState<LmsTag[]>(MOCK_TAGS);
  const [languages, setLanguages] = useState<LmsLanguage[]>(MOCK_LANGUAGES);
  const [certTemplates, setCertTemplates] = useState<LmsCertificateTemplate[]>(MOCK_CERT_TEMPLATES);

  // Modals state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [showMergeTagModal, setShowMergeTagModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<LmsCertificateTemplate | null>(null);

  // Edit Modals state
  const [editingCategory, setEditingCategory] = useState<LmsCategory | null>(null);
  const [editingLevel, setEditingLevel] = useState<LmsLevel | null>(null);
  const [editingTag, setEditingTag] = useState<LmsTag | null>(null);

  // Forms
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatColor, setNewCatColor] = useState("#0A2E52");

  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelDesc, setNewLevelDesc] = useState("");
  const [newLevelColor, setNewLevelColor] = useState("#059669");

  const [newTagName, setNewTagName] = useState("");
  const [newTagCat, setNewTagCat] = useState("Web Development");

  const [tagSearch, setTagSearch] = useState("");

  // Handlers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: LmsCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, "-"),
      description: newCatDesc,
      icon: "layers",
      badgeColor: newCatColor,
      order: categories.length + 1,
      status: "aktif",
      courseCount: 0,
    };
    setCategories([...categories, newCat]);
    setNewCatName("");
    setNewCatDesc("");
    setShowAddCategoryModal(false);
  };

  const handleToggleCategoryStatus = (id: string) => {
    setCategories(
      categories.map((c) =>
        c.id === id ? { ...c, status: c.status === "aktif" ? "nonaktif" : "aktif" } : c
      )
    );
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Hapus kategori ini?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const handleAddLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLevelName.trim()) return;
    const newLvl: LmsLevel = {
      id: `lvl-${Date.now()}`,
      name: newLevelName,
      slug: newLevelName.toLowerCase().replace(/\s+/g, "-"),
      description: newLevelDesc,
      badgeColor: newLevelColor,
      order: levels.length + 1,
    };
    setLevels([...levels, newLvl]);
    setNewLevelName("");
    setNewLevelDesc("");
    setShowAddLevelModal(false);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    const newTag: LmsTag = {
      id: `tag-${Date.now()}`,
      name: newTagName,
      slug: newTagName.toLowerCase().replace(/\s+/g, "-"),
      categoryName: newTagCat,
      usageCount: 1,
    };
    setTags([...tags, newTag]);
    setNewTagName("");
    setShowAddTagModal(false);
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setCategories(
      categories.map((c) => (c.id === editingCategory.id ? editingCategory : c))
    );
    setEditingCategory(null);
    alert("Kategori berhasil diperbarui!");
  };

  const handleUpdateLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLevel) return;
    setLevels(
      levels.map((l) => (l.id === editingLevel.id ? editingLevel : l))
    );
    setEditingLevel(null);
    alert("Level pembelajaran berhasil diperbarui!");
  };

  const handleUpdateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    setTags(
      tags.map((t) => (t.id === editingTag.id ? editingTag : t))
    );
    setEditingTag(null);
    alert("Tag skill berhasil diperbarui!");
  };

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(tagSearch.toLowerCase()) ||
    t.categoryName.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          padding: "16px 20px",
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
              Master Data Platform
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Taksonomi, Atribut &amp; Standar Sertifikasi LMS
            </span>
          </div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontFamily: "var(--font-heading)",
              margin: "4px 0 2px",
              color: "var(--brand)",
            }}
          >
            Pusat Pengelolaan Master Data
          </h2>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
            Kelola kategori bidang keilmuan, level kemahiran, skill tag, bahasa pengantar, dan template sertifikat.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div style={{ display: "flex", gap: "6px", background: "var(--bx-bg-alt)", padding: "4px", borderRadius: "8px" }}>
          {[
            { id: "kategori", label: "Kategori", icon: "layers" },
            { id: "level", label: "Level", icon: "target" },
            { id: "tag", label: "Tag & Skill", icon: "code" },
            { id: "bahasa", label: "Bahasa", icon: "globe" },
            { id: "sertifikat", label: "Template Sertifikat", icon: "certificate" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as MasterDataTab)}
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
      {/* TAB 1: KATEGORI / BIDANG */}
      {/* ============================================================== */}
      {activeTab === "kategori" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Total Kategori Aktif: <strong>{categories.filter((c) => c.status === "aktif").length}</strong> dari {categories.length}
            </span>
            <button
              type="button"
              onClick={() => setShowAddCategoryModal(true)}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "none",
                background: "var(--gold, #C9962E)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FlatIcon type="plus" size={14} color="#ffffff" />
              <span>Tambah Kategori Baru</span>
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "14px",
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  background: "var(--bx-surface, #FFFFFF)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "3px",
                          backgroundColor: cat.badgeColor,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: "var(--bx-bg-alt)",
                          color: "var(--brand)",
                        }}
                      >
                        Urutan #{cat.order}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleCategoryStatus(cat.id)}
                      style={{
                        padding: "2px 8px",
                        borderRadius: "12px",
                        border: "none",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        background: cat.status === "aktif" ? "#D1FAE5" : "#FEE2E2",
                        color: cat.status === "aktif" ? "#065F46" : "#DC2626",
                      }}
                    >
                      {cat.status === "aktif" ? "● Aktif" : "○ Nonaktif"}
                    </button>
                  </div>

                  <h3 style={{ margin: "4px 0 6px", fontSize: "1rem", color: "var(--brand)" }}>
                    {cat.name}
                  </h3>
                  <p style={{ margin: "0 0 12px", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.4 }}>
                    {cat.description}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: "10px",
                    borderTop: "1px solid var(--bx-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.78rem",
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>
                    Kelas Terdaftar: <strong style={{ color: "var(--brand)" }}>{cat.courseCount} Kelas</strong>
                  </span>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(cat)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        border: "1px solid var(--bx-border)",
                        background: "var(--bx-bg-alt)",
                        color: "var(--brand)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id)}
                      title="Hapus Kategori"
                      style={{
                        padding: "3px 6px",
                        borderRadius: "4px",
                        background: "transparent",
                        border: "1px solid #FCA5A5",
                        color: "#DC2626",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FlatIcon type="trash" size={13} color="#DC2626" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: LEVEL PEMBELAJARAN */}
      {/* ============================================================== */}
      {activeTab === "level" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Jenjang kemahiran pembelajaran untuk filter katalog dan kurikulum.
            </span>
            <button
              type="button"
              onClick={() => setShowAddLevelModal(true)}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "none",
                background: "var(--brand, #0A2E52)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FlatIcon type="plus" size={14} color="#ffffff" />
              <span>Tambah Level</span>
            </button>
          </div>

          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px" }}>Urutan</th>
                  <th style={{ padding: "10px 14px" }}>Nama Level</th>
                  <th style={{ padding: "10px 14px" }}>Slug</th>
                  <th style={{ padding: "10px 14px" }}>Warna Badge</th>
                  <th style={{ padding: "10px 14px" }}>Deskripsi</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((lvl) => (
                  <tr key={lvl.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--brand)" }}>
                      #{lvl.order}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 700 }}>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "4px",
                          color: "#ffffff",
                          backgroundColor: lvl.badgeColor,
                          fontSize: "0.75rem",
                        }}
                      >
                        {lvl.name}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                      {lvl.slug}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "14px", height: "14px", borderRadius: "3px", backgroundColor: lvl.badgeColor }} />
                        <code style={{ fontSize: "0.72rem" }}>{lvl.badgeColor}</code>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--muted)" }}>
                      {lvl.description}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => setEditingLevel(lvl)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid var(--bx-border)",
                            background: "var(--bx-bg-alt)",
                            color: "var(--brand)",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Hapus level ini?")) {
                              setLevels(levels.filter((l) => l.id !== lvl.id));
                            }
                          }}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid #FCA5A5",
                            background: "transparent",
                            color: "#DC2626",
                            fontSize: "0.72rem",
                            cursor: "pointer",
                          }}
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
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: TAG & SKILL */}
      {/* ============================================================== */}
      {activeTab === "tag" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, maxWidth: "380px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--bx-surface)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  width: "100%",
                }}
              >
                <FlatIcon type="search" size={14} color="var(--muted)" />
                <input
                  type="text"
                  placeholder="Cari skill atau kategori..."
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: "0.82rem", color: "var(--ink)" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setShowMergeTagModal(true)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-surface)",
                  color: "var(--ink)",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                Merge / Gabung Tag
              </button>
              <button
                type="button"
                onClick={() => setShowAddTagModal(true)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: "var(--brand, #0A2E52)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FlatIcon type="plus" size={14} color="#ffffff" />
                <span>Tambah Skill Tag</span>
              </button>
            </div>
          </div>

          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {filteredTags.map((tag) => (
              <div
                key={tag.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  background: "var(--bx-bg-alt)",
                  border: "1px solid var(--bx-border)",
                  fontSize: "0.8rem",
                }}
              >
                <span style={{ fontWeight: 700, color: "var(--brand)" }}>#{tag.name}</span>
                <span style={{ fontSize: "0.7rem", color: "var(--muted)", background: "var(--bx-surface)", padding: "1px 6px", borderRadius: "4px" }}>
                  {tag.categoryName}
                </span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    padding: "1px 5px",
                    borderRadius: "4px",
                    background: "var(--gold)",
                    color: "#ffffff",
                    fontWeight: 700,
                  }}
                  title="Dipakai di kelas"
                >
                  {tag.usageCount}x
                </span>
                <button
                  type="button"
                  onClick={() => setEditingTag(tag)}
                  title="Edit Tag"
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--brand)",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    padding: "0 2px",
                  }}
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Hapus tag #${tag.name}?`)) {
                      setTags(tags.filter((t) => t.id !== tag.id));
                    }
                  }}
                  title="Hapus Tag"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#DC2626",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    padding: "0 2px",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: BAHASA PENGANTAR */}
      {/* ============================================================== */}
      {activeTab === "bahasa" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Bahasa pengantar audio, teks modul, dan subtitle video materi kelas.
            </span>
          </div>

          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px" }}>Kode</th>
                  <th style={{ padding: "10px 14px" }}>Nama Bahasa</th>
                  <th style={{ padding: "10px 14px" }}>Status Default</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {languages.map((lang) => (
                  <tr key={lang.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                    <td style={{ padding: "12px 14px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)" }}>
                      {lang.code.toUpperCase()}
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>{lang.name}</td>
                    <td style={{ padding: "12px 14px" }}>
                      {lang.isDefault ? (
                        <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "4px", background: "#D1FAE5", color: "#065F46", fontWeight: 700 }}>
                          Default Sistem
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Opsional</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      {!lang.isDefault && (
                        <button
                          type="button"
                          onClick={() => {
                            setLanguages(
                              languages.map((l) => ({ ...l, isDefault: l.id === lang.id }))
                            );
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--gold-2)",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: "0.78rem",
                          }}
                        >
                          Jadikan Default
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: TEMPLATE SERTIFIKAT */}
      {/* ============================================================== */}
      {activeTab === "sertifikat" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Kustomisasi template sertifikat digital yang otomatis terbit ketika siswa menyelesaikan kelas atau quiz.
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "16px",
            }}
          >
            {certTemplates.map((tpl) => (
              <div
                key={tpl.id}
                style={{
                  background: "var(--bx-surface, #FFFFFF)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 6px rgba(10, 46, 82, 0.04)",
                }}
              >
                {/* Visual Banner Preview */}
                <div
                  style={{
                    height: "120px",
                    background: `linear-gradient(135deg, ${tpl.primaryColor} 0%, #12467A 100%)`,
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    color: "#ffffff",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.68rem", background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                      AUI ACADEMIC VERIFIED
                    </span>
                    <span style={{ fontSize: "0.68rem", opacity: 0.9 }}>
                      {tpl.orientation.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.68rem", opacity: 0.8 }}>Sertifikat Kelulusan</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
                      {tpl.title}
                    </div>
                  </div>
                </div>

                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                    Kategori Target: <strong style={{ color: "var(--brand)" }}>{tpl.categoryName}</strong>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "0.72rem" }}>
                    <span style={{ color: tpl.components.showLogo ? "#059669" : "#DC2626" }}>
                      {tpl.components.showLogo ? "✓ Logo Lembaga" : "✕ Tanpa Logo"}
                    </span>
                    <span style={{ color: tpl.components.showQr ? "#059669" : "#DC2626" }}>
                      {tpl.components.showQr ? "✓ QR Verifikasi" : "✕ Tanpa QR"}
                    </span>
                    <span style={{ color: tpl.components.showSignature ? "#059669" : "#DC2626" }}>
                      {tpl.components.showSignature ? "✓ Tanda Tangan" : "✕ Tanpa TTD"}
                    </span>
                    <span style={{ color: tpl.components.showScore ? "#059669" : "#DC2626" }}>
                      {tpl.components.showScore ? "✓ Nilai Akhir" : "✕ Tanpa Nilai"}
                    </span>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--bx-border)", display: "flex", justifyContent: "space-between" }}>
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tpl)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--bx-border)",
                        background: "var(--bx-bg-alt)",
                        color: "var(--brand)",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                      }}
                    >
                      Preview Sertifikat
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Pengaturan template tersimpan.")}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background: "var(--brand)",
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                      }}
                    >
                      Edit Layout
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: PREVIEW SERTIFIKAT */}
      {/* ============================================================== */}
      {previewTemplate && (
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
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FBF8F1",
              border: "8px double #C9962E",
              borderRadius: "8px",
              padding: "40px",
              maxWidth: "680px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => setPreviewTemplate(null)}
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                background: "transparent",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: "var(--brand)",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>

            <div style={{ letterSpacing: "3px", textTransform: "uppercase", fontSize: "0.75rem", color: "#C9962E", fontWeight: 800 }}>
              ASEAN UNIVERSITY INTERNATIONAL
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", color: "#0A2E52", fontSize: "1.8rem", margin: "10px 0 4px" }}>
              Sertifikat Kompetensi &amp; Kelulusan
            </h1>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: "0 0 24px" }}>
              Diberikan secara sah atas dedikasi dan pencapaian akademik kepada:
            </p>

            <div
              style={{
                fontSize: "1.5rem",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                color: "#0A2E52",
                borderBottom: "2px solid #C9962E",
                display: "inline-block",
                padding: "0 30px 6px",
                marginBottom: "16px",
              }}
            >
              Muhammad Farhan
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--ink)", maxWidth: "480px", margin: "0 auto 24px", lineHeight: 1.5 }}>
              Telah berhasil menyelesaikan seluruh kurikulum materi, ujian praktik berbasis proyek industri, dan uji kompetensi pada kelas:
            </p>

            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#C9962E", marginBottom: "24px" }}>
              Fullstack Next.js 16, Turbopack &amp; Cloud Microservices
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "30px", borderTop: "1px solid rgba(10,46,82,0.15)", paddingTop: "18px" }}>
              <div style={{ textAlign: "left", fontSize: "0.75rem" }}>
                <div style={{ color: "var(--muted)" }}>Kode Verifikasi:</div>
                <strong style={{ fontFamily: "var(--font-mono)", color: "#0A2E52" }}>ANV-2026-CERT-9912</strong>
                <div style={{ color: "var(--muted)", marginTop: "4px" }}>Terbit: 28 Oktober 2026</div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ width: "60px", height: "60px", background: "#0A2E52", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px", fontSize: "0.6rem", borderRadius: "4px" }}>
                  QR CODE
                </div>
                <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>Scan Validitas</span>
              </div>

              <div style={{ textAlign: "right", fontSize: "0.75rem" }}>
                <div style={{ fontStyle: "italic", fontFamily: "var(--font-heading)", fontSize: "0.95rem", color: "#0A2E52" }}>
                  Prof. Budi Rahardjo, Ph.D.
                </div>
                <div style={{ color: "var(--muted)" }}>Lead Instructor &amp; Master Assessor</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH KATEGORI */}
      {/* ============================================================== */}
      {showAddCategoryModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.6)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "460px",
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Tambah Kategori Baru
            </h3>
            <form onSubmit={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Blockchain & Smart Contract"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi ruang lingkup materi..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Warna Identitas Badge
                </label>
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  style={{ width: "60px", height: "34px", padding: 0, border: "none", cursor: "pointer" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", fontSize: "0.82rem" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, fontSize: "0.82rem" }}
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH LEVEL */}
      {/* ============================================================== */}
      {showAddLevelModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.6)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "440px",
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Tambah Level Baru
            </h3>
            <form onSubmit={handleAddLevel} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Nama Level
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Spesialisasi Industri"
                  value={newLevelName}
                  onChange={(e) => setNewLevelName(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Deskripsi Level
                </label>
                <textarea
                  rows={2}
                  placeholder="Kriteria pengalaman peserta..."
                  value={newLevelDesc}
                  onChange={(e) => setNewLevelDesc(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Warna Badge
                </label>
                <input
                  type="color"
                  value={newLevelColor}
                  onChange={(e) => setNewLevelColor(e.target.value)}
                  style={{ width: "60px", height: "34px", padding: 0, border: "none", cursor: "pointer" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddLevelModal(false)}
                  style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", fontSize: "0.82rem" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, fontSize: "0.82rem" }}
                >
                  Simpan Level
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH TAG */}
      {/* ============================================================== */}
      {showAddTagModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.6)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "420px",
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Tambah Skill Tag Baru
            </h3>
            <form onSubmit={handleAddTag} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Nama Skill / Tag
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: PyTorch / GraphQL / Golang"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Kategori Terkait
                </label>
                <select
                  value={newTagCat}
                  onChange={(e) => setNewTagCat(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddTagModal(false)}
                  style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", fontSize: "0.82rem" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, fontSize: "0.82rem" }}
                >
                  Tambah Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: MERGE TAG */}
      {/* ============================================================== */}
      {showMergeTagModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.6)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "440px",
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Gabungkan Tag Duplikat
            </h3>
            <p style={{ margin: "0 0 14px", fontSize: "0.78rem", color: "var(--muted)" }}>
              Pindahkan semua relasi kelas dari tag sumber ke tag tujuan.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  Tag Sumber (yang akan dihapus):
                </label>
                <select style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}>
                  <option>Next.js 16 (12 kelas)</option>
                  <option>TypeScript Strict (14 kelas)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                  Gabungkan ke Tag Tujuan:
                </label>
                <select style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}>
                  <option>Next.js (Utama)</option>
                  <option>TypeScript (Utama)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
              <button
                type="button"
                onClick={() => setShowMergeTagModal(false)}
                style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", fontSize: "0.82rem" }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Tag berhasil digabungkan.");
                  setShowMergeTagModal(false);
                }}
                style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "var(--gold)", color: "#ffffff", fontWeight: 700, fontSize: "0.82rem" }}
              >
                Eksekusi Merge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT KATEGORI */}
      {/* ============================================================== */}
      {editingCategory && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.6)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "460px",
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Edit Kategori Bidang
            </h3>
            <form onSubmit={handleUpdateCategory} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Deskripsi Kategori
                </label>
                <textarea
                  rows={3}
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Warna Badge
                  </label>
                  <input
                    type="color"
                    value={editingCategory.badgeColor}
                    onChange={(e) => setEditingCategory({ ...editingCategory, badgeColor: e.target.value })}
                    style={{ width: "100%", height: "38px", padding: "2px", borderRadius: "6px", border: "1px solid var(--bx-border)", cursor: "pointer" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    value={editingCategory.order}
                    onChange={(e) => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", fontSize: "0.82rem" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="portal-btn-primary"
                  style={{ padding: "8px 16px", borderRadius: "6px", fontWeight: 700, fontSize: "0.82rem" }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT LEVEL */}
      {/* ============================================================== */}
      {editingLevel && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.6)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "460px",
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Edit Jenjang Level Kemahiran
            </h3>
            <form onSubmit={handleUpdateLevel} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Nama Level
                </label>
                <input
                  type="text"
                  required
                  value={editingLevel.name}
                  onChange={(e) =>
                    setEditingLevel({
                      ...editingLevel,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Deskripsi Level
                </label>
                <textarea
                  rows={3}
                  value={editingLevel.description}
                  onChange={(e) => setEditingLevel({ ...editingLevel, description: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Warna Badge
                  </label>
                  <input
                    type="color"
                    value={editingLevel.badgeColor}
                    onChange={(e) => setEditingLevel({ ...editingLevel, badgeColor: e.target.value })}
                    style={{ width: "100%", height: "38px", padding: "2px", borderRadius: "6px", border: "1px solid var(--bx-border)", cursor: "pointer" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Urutan Tingkat
                  </label>
                  <input
                    type="number"
                    value={editingLevel.order}
                    onChange={(e) => setEditingLevel({ ...editingLevel, order: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setEditingLevel(null)}
                  style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", fontSize: "0.82rem" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="portal-btn-primary"
                  style={{ padding: "8px 16px", borderRadius: "6px", fontWeight: 700, fontSize: "0.82rem" }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT TAG & SKILL */}
      {/* ============================================================== */}
      {editingTag && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.6)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "420px",
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Edit Skill Tag
            </h3>
            <form onSubmit={handleUpdateTag} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Nama Skill Tag
                </label>
                <input
                  type="text"
                  required
                  value={editingTag.name}
                  onChange={(e) =>
                    setEditingTag({
                      ...editingTag,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                  Kategori Terkait
                </label>
                <select
                  value={editingTag.categoryName}
                  onChange={(e) => setEditingTag({ ...editingTag, categoryName: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem", boxSizing: "border-box" }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setEditingTag(null)}
                  style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", fontSize: "0.82rem" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="portal-btn-primary"
                  style={{ padding: "8px 16px", borderRadius: "6px", fontWeight: 700, fontSize: "0.82rem" }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

