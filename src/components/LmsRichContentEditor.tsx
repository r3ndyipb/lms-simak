"use client";

import React, { useState, useRef } from "react";
import { FlatIcon } from "./FlatIcon";
import MarkdownRenderer, { cleanAndNormalizeMarkdown } from "../utils/markdownParser";

interface LmsRichContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  onTitleChange?: (title: string) => void;
  summary?: string;
  onSummaryChange?: (summary: string) => void;
}

export default function LmsRichContentEditor({
  value,
  onChange,
  placeholder = "Ketik naskah materi di sini...",
  title,
  onTitleChange,
  summary,
  onSummaryChange,
}: LmsRichContentEditorProps) {
  const [editorMode, setEditorMode] = useState<"split" | "visual" | "source">("split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active Tool Panel (Inline, Slim, No Popups)
  const [activeTool, setActiveTool] = useState<"image" | "code" | "callout" | "table" | "link" | null>(null);

  // Tool states
  const [imgUrl, setImgUrl] = useState("");
  const [imgCaption, setImgCaption] = useState("");
  const [imgWidth, setImgWidth] = useState("100%");

  const [codeLang, setCodeLang] = useState("typescript");
  const [codeSnippet, setCodeSnippet] = useState("");

  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // Notification for Markdown cleanup
  const [cleanNotice, setCleanNotice] = useState<string | null>(null);

  const handleCleanMarkdown = () => {
    if (!value) return;
    const cleaned = cleanAndNormalizeMarkdown(value);
    onChange(cleaned);
    setCleanNotice("✨ Kode Markdown berhasil distandarkan & dirapikan!");
    setTimeout(() => setCleanNotice(null), 3000);
  };

  // Insert helper
  const insertText = (before: string, after: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange((value || "") + before + defaultText + after);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selectedText = currentVal.substring(start, end) || defaultText;

    const nextVal = currentVal.substring(0, start) + before + selectedText + after + currentVal.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 10);
  };

  const handleInsertImage = () => {
    if (!imgUrl) return;
    const imageMarkdown = `\n\n<figure style="text-align: center; margin: 20px 0;">\n  <img src="${imgUrl}" alt="Ilustrasi" style="max-width: ${imgWidth}; width: 100%; border-radius: 6px; border: 1px solid #E2E8F0;" />\n  ${imgCaption ? `<figcaption style="font-size: 0.78rem; color: #64748B; margin-top: 6px; font-style: italic;">Gambar: ${imgCaption}</figcaption>` : ""}\n</figure>\n\n`;
    insertText(imageMarkdown);
    setActiveTool(null);
    setImgUrl("");
    setImgCaption("");
  };

  const handleInsertCode = () => {
    if (!codeSnippet) return;
    const codeMarkdown = `\n\n\`\`\`${codeLang}\n${codeSnippet}\n\`\`\`\n\n`;
    insertText(codeMarkdown);
    setActiveTool(null);
    setCodeSnippet("");
  };

  const handleInsertLink = () => {
    if (!linkUrl) return;
    insertText(`[${linkText || linkUrl}](${linkUrl})`);
    setActiveTool(null);
    setLinkUrl("");
    setLinkText("");
  };

  const handleInsertTable = () => {
    insertText("\n\n| Kolom 1 | Kolom 2 | Kolom 3 |\n| :--- | :--- | :--- |\n| Data A | Data B | Data C |\n| Data X | Data Y | Data Z |\n\n");
    setActiveTool(null);
  };

  // Stats
  const wordCount = (value || "").trim().split(/\s+/).filter(Boolean).length;
  const charCount = (value || "").length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  // Visual Renderer using robust MarkdownRenderer
  const renderVisual = (raw: string) => {
    return <MarkdownRenderer content={raw} />;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        flex: 1,
        overflow: "hidden",
        background: "var(--bx-surface, #FFFFFF)",
      }}
    >
      {/* ============================================================== */}
      {/* COMPACT TOP TOOLBAR (ICON-BASED, NO BLOATED WORDING) */}
      {/* ============================================================== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 14px",
          background: "var(--bx-bg-alt, #F8FAFC)",
          borderBottom: "1px solid var(--bx-border)",
          flexShrink: 0,
          gap: "8px",
          overflowX: "auto",
        }}
      >
        {/* Left: Quick Icon Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {/* Headings */}
          <button
            type="button"
            title="Heading 1"
            onClick={() => insertText("\n\n# ", "\n\n", "Judul")}
            style={{ width: "28px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", borderRadius: "4px", fontWeight: 800, fontSize: "0.74rem", cursor: "pointer" }}
          >
            H1
          </button>
          <button
            type="button"
            title="Heading 2"
            onClick={() => insertText("\n\n## ", "\n\n", "Sub-judul")}
            style={{ width: "28px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontWeight: 700, fontSize: "0.74rem", cursor: "pointer" }}
          >
            H2
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => insertText("\n\n### ", "\n\n", "Topik")}
            style={{ width: "28px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontWeight: 600, fontSize: "0.74rem", cursor: "pointer" }}
          >
            H3
          </button>

          <span style={{ width: "1px", height: "16px", background: "var(--bx-border)", margin: "0 3px" }} />

          {/* Styles */}
          <button
            type="button"
            title="Tebal (Bold)"
            onClick={() => insertText("**", "**", "teks")}
            style={{ width: "28px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", borderRadius: "4px", fontWeight: 800, fontSize: "0.78rem", cursor: "pointer" }}
          >
            B
          </button>
          <button
            type="button"
            title="Miring (Italic)"
            onClick={() => insertText("*", "*", "teks")}
            style={{ width: "28px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", borderRadius: "4px", fontStyle: "italic", fontSize: "0.78rem", cursor: "pointer" }}
          >
            I
          </button>
          <button
            type="button"
            title="Inline Code Tag"
            onClick={() => insertText("`", "`", "code()")}
            style={{ padding: "0 6px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", borderRadius: "4px", fontFamily: "monospace", fontSize: "0.72rem", color: "#DC2626", cursor: "pointer" }}
          >
            &lt;/&gt;
          </button>

          <span style={{ width: "1px", height: "16px", background: "var(--bx-border)", margin: "0 3px" }} />

          {/* Lists & Quotes */}
          <button
            type="button"
            title="Bullet List"
            onClick={() => insertText("\n- ", "\n", "Poin")}
            style={{ width: "28px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", borderRadius: "4px", fontSize: "0.78rem", cursor: "pointer" }}
          >
            •
          </button>
          <button
            type="button"
            title="Numbered List"
            onClick={() => insertText("\n1. ", "\n", "Langkah")}
            style={{ width: "28px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", borderRadius: "4px", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer" }}
          >
            1.
          </button>
          <button
            type="button"
            title="Garis Pemisah (Horizontal Rule ---)"
            onClick={() => insertText("\n\n---\n\n", "", "")}
            style={{ width: "28px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", borderRadius: "4px", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer" }}
          >
            —
          </button>
          <button
            type="button"
            title="Format Status / Poin Kunci (* **Status:** Nilai)"
            onClick={() => insertText("\n* **Status:** ", "\n", "Aktif")}
            style={{ padding: "0 6px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 750, color: "var(--brand)", cursor: "pointer" }}
          >
            **Key:**
          </button>
          <button
            type="button"
            title="Kutipan"
            onClick={() => insertText("\n> ", "\n", "Kutipan")}
            style={{ width: "28px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", borderRadius: "4px", fontSize: "0.78rem", cursor: "pointer" }}
          >
            &rdquo;
          </button>

          <span style={{ width: "1px", height: "16px", background: "var(--bx-border)", margin: "0 3px" }} />

          {/* Media & Rich Insertions (Flat Icons) */}
          <button
            type="button"
            title="Sisipkan Gambar"
            onClick={() => setActiveTool(activeTool === "image" ? null : "image")}
            style={{
              padding: "0 8px",
              height: "28px",
              border: activeTool === "image" ? "1px solid var(--gold)" : "1px solid var(--bx-border)",
              background: activeTool === "image" ? "rgba(201, 150, 46, 0.15)" : "var(--bx-surface)",
              borderRadius: "4px",
              color: "#92400E",
              fontSize: "0.76rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FlatIcon type="image" size={14} color="#92400E" />
            <span>Gambar</span>
          </button>

          <button
            type="button"
            title="Sisipkan Blok Kode (Syntax Tag)"
            onClick={() => setActiveTool(activeTool === "code" ? null : "code")}
            style={{
              padding: "0 8px",
              height: "28px",
              border: activeTool === "code" ? "1px solid var(--brand)" : "1px solid var(--bx-border)",
              background: activeTool === "code" ? "rgba(10, 46, 82, 0.12)" : "var(--bx-surface)",
              borderRadius: "4px",
              color: "var(--brand)",
              fontSize: "0.76rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FlatIcon type="code" size={14} color="var(--brand)" />
            <span>Kode</span>
          </button>

          <button
            type="button"
            title="Callout Note"
            onClick={() => setActiveTool(activeTool === "callout" ? null : "callout")}
            style={{
              padding: "0 8px",
              height: "28px",
              border: activeTool === "callout" ? "1px solid #2563EB" : "1px solid var(--bx-border)",
              background: activeTool === "callout" ? "#EFF6FF" : "var(--bx-surface)",
              borderRadius: "4px",
              color: "#1E40AF",
              fontSize: "0.76rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FlatIcon type="info" size={14} color="#1E40AF" />
            <span>Note</span>
          </button>

          <button
            type="button"
            title="Tabel"
            onClick={handleInsertTable}
            style={{ width: "28px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <FlatIcon type="table" size={14} color="var(--ink)" />
          </button>

          <button
            type="button"
            title="Link"
            onClick={() => setActiveTool(activeTool === "link" ? null : "link")}
            style={{ width: "28px", height: "28px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <FlatIcon type="link" size={14} color="var(--ink)" />
          </button>

          <span style={{ width: "1px", height: "16px", background: "var(--bx-border)", margin: "0 4px" }} />

          {/* Quick Clean / Format Markdown Button */}
          <button
            type="button"
            title="Rapikan & Standarkan Simbol Markdown (Hapus YAML, normalkan simbol *, perbaiki format key-value & spasi)"
            onClick={handleCleanMarkdown}
            style={{
              padding: "0 10px",
              height: "28px",
              border: "1px solid #10B981",
              background: "#ECFDF5",
              borderRadius: "4px",
              color: "#065F46",
              fontSize: "0.74rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FlatIcon type="check" size={13} color="#059669" />
            <span>Rapikan MD</span>
          </button>
        </div>

        {/* Right: View Mode (Icons / Compact Pills) */}
        <div style={{ display: "flex", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "4px", padding: "1px" }}>
          {[
            { id: "split", label: "Split" },
            { id: "visual", label: "Visual" },
            { id: "source", label: "MD" },
          ].map((mode) => {
            const isActive = editorMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setEditorMode(mode.id as any)}
                style={{
                  padding: "3px 8px",
                  borderRadius: "3px",
                  border: "none",
                  background: isActive ? "var(--brand)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--ink)",
                  fontSize: "0.72rem",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                }}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SLIM INLINE TOOL PANELS (NO BULKY MODALS) */}
      {/* ============================================================== */}
      {activeTool === "image" && (
        <div style={{ background: "#FFFBEB", borderBottom: "1px solid #FDE68A", padding: "8px 14px", display: "flex", gap: "8px", alignItems: "center", flexShrink: 0, fontSize: "0.8rem" }}>
          <input
            type="text"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            placeholder="URL Gambar (CDN/lokal)..."
            style={{ flex: 2, padding: "5px 8px", borderRadius: "4px", border: "1px solid #FCD34D", fontSize: "0.8rem" }}
          />
          <input
            type="text"
            value={imgCaption}
            onChange={(e) => setImgCaption(e.target.value)}
            placeholder="Caption (opsional)..."
            style={{ flex: 1, padding: "5px 8px", borderRadius: "4px", border: "1px solid #FCD34D", fontSize: "0.8rem" }}
          />
          <select
            value={imgWidth}
            onChange={(e) => setImgWidth(e.target.value)}
            style={{ padding: "5px 8px", borderRadius: "4px", border: "1px solid #FCD34D", fontSize: "0.8rem" }}
          >
            <option value="100%">100%</option>
            <option value="80%">80%</option>
            <option value="60%">60%</option>
          </select>
          <button
            type="button"
            onClick={handleInsertImage}
            style={{ padding: "5px 12px", borderRadius: "4px", border: "none", background: "#D97706", color: "#FFFFFF", fontWeight: 700, cursor: "pointer", fontSize: "0.78rem" }}
          >
            Pasang
          </button>
          <button
            type="button"
            onClick={() => setActiveTool(null)}
            style={{ background: "none", border: "none", color: "#92400E", cursor: "pointer", fontSize: "0.8rem" }}
          >
            ✕
          </button>
        </div>
      )}

      {activeTool === "code" && (
        <div style={{ background: "#0F172A", borderBottom: "1px solid #1E293B", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0, color: "#F8FAFC" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <select
              value={codeLang}
              onChange={(e) => setCodeLang(e.target.value)}
              style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #334155", background: "#1E293B", color: "#FFFFFF", fontSize: "0.78rem" }}
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="bash">Bash</option>
              <option value="json">JSON</option>
            </select>
            <button
              type="button"
              onClick={handleInsertCode}
              style={{ padding: "4px 12px", borderRadius: "4px", border: "none", background: "#2563EB", color: "#FFFFFF", fontWeight: 700, cursor: "pointer", fontSize: "0.78rem" }}
            >
              Pasang Kode
            </button>
            <button
              type="button"
              onClick={() => setActiveTool(null)}
              style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "0.8rem", marginLeft: "auto" }}
            >
              Tutup
            </button>
          </div>
          <textarea
            rows={4}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="// Tempel kode sumber di sini..."
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #334155", background: "#090D16", color: "#FFFFFF", fontFamily: "monospace", fontSize: "0.8rem" }}
          />
        </div>
      )}

      {activeTool === "callout" && (
        <div style={{ background: "#F1F5F9", borderBottom: "1px solid var(--bx-border)", padding: "6px 14px", display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => {
              insertText("\n\n> [!NOTE]\n> ", "\n\n", "Catatan penting...");
              setActiveTool(null);
            }}
            style={{ padding: "3px 8px", borderRadius: "3px", border: "1px solid #BFDBFE", background: "#EFF6FF", color: "#1E40AF", fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >
            <FlatIcon type="info" size={13} color="#1E40AF" />
            <span>Info Note</span>
          </button>
          <button
            type="button"
            onClick={() => {
              insertText("\n\n> [!TIP]\n> ", "\n\n", "Tips trik...");
              setActiveTool(null);
            }}
            style={{ padding: "3px 8px", borderRadius: "3px", border: "1px solid #A7F3D0", background: "#ECFDF5", color: "#065F46", fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >
            <FlatIcon type="star" size={13} color="#065F46" />
            <span>Tip</span>
          </button>
          <button
            type="button"
            onClick={() => {
              insertText("\n\n> [!WARNING]\n> ", "\n\n", "Peringatan...");
              setActiveTool(null);
            }}
            style={{ padding: "3px 8px", borderRadius: "3px", border: "1px solid #FDE68A", background: "#FFFBEB", color: "#92400E", fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >
            <FlatIcon type="warning" size={13} color="#92400E" />
            <span>Warning</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTool(null)}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.74rem", marginLeft: "auto" }}
          >
            ✕
          </button>
        </div>
      )}

      {activeTool === "link" && (
        <div style={{ background: "#F1F5F9", borderBottom: "1px solid var(--bx-border)", padding: "6px 14px", display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="URL (https://...)"
            style={{ padding: "4px 8px", borderRadius: "3px", border: "1px solid var(--bx-border)", fontSize: "0.78rem", flex: 2 }}
          />
          <input
            type="text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Teks link..."
            style={{ padding: "4px 8px", borderRadius: "3px", border: "1px solid var(--bx-border)", fontSize: "0.78rem", flex: 1 }}
          />
          <button
            type="button"
            onClick={handleInsertLink}
            style={{ padding: "4px 10px", borderRadius: "3px", border: "none", background: "var(--brand)", color: "#FFFFFF", fontSize: "0.76rem", cursor: "pointer" }}
          >
            Pasang
          </button>
          <button
            type="button"
            onClick={() => setActiveTool(null)}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.74rem" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* COMPACT TITLE & SYNOPSIS STRIP */}
      {/* ============================================================== */}
      {(onTitleChange || onSummaryChange) && (
        <div style={{ padding: "8px 18px", borderBottom: "1px solid var(--bx-border)", background: "var(--bx-surface)", display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 }}>
          {onTitleChange && (
            <input
              type="text"
              value={title || ""}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Judul Materi Pembelajaran..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontFamily: "var(--font-heading)",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--brand)",
                padding: "2px 0",
              }}
            />
          )}
          {onSummaryChange && (
            <input
              type="text"
              value={summary || ""}
              onChange={(e) => onSummaryChange(e.target.value)}
              placeholder="Ringkasan singkat materi..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "0.82rem",
                color: "var(--muted)",
                padding: "1px 0",
              }}
            />
          )}
        </div>
      )}

      {/* Clean Notification Banner */}
      {cleanNotice && (
        <div
          style={{
            padding: "6px 18px",
            background: "#ECFDF5",
            borderBottom: "1px solid #A7F3D0",
            color: "#065F46",
            fontSize: "0.76rem",
            fontWeight: 650,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <FlatIcon type="check" size={14} color="#059669" />
          <span>{cleanNotice}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* WORKSPACE CANVAS (FIT WIDTH & FIT HEIGHT 100%) */}
      {/* ============================================================== */}
      <div style={{ flex: 1, width: "100%", height: "100%", display: "flex", overflow: "hidden" }}>
        {/* MODE: SPLIT 50:50 */}
        {editorMode === "split" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", width: "100%", height: "100%", overflow: "hidden" }}>
            {/* Left: Textarea (Fit Width & Height) */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%", borderRight: "1px solid var(--bx-border)", overflow: "hidden" }}>
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                  width: "100%",
                  height: "100%",
                  flex: 1,
                  padding: "14px 18px",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: "0.86rem",
                  lineHeight: 1.6,
                  color: "var(--ink)",
                  background: "transparent",
                  overflowY: "auto",
                }}
              />
            </div>

            {/* Right: Live Preview (Fit Width & Height) */}
            <div style={{ height: "100%", overflowY: "auto", padding: "14px 22px", background: "var(--bx-bg-alt, #F8FAFC)" }}>
              {renderVisual(value)}
            </div>
          </div>
        )}

        {/* MODE: VISUAL ONLY (FIT WIDTH & HEIGHT) */}
        {editorMode === "visual" && (
          <div style={{ width: "100%", height: "100%", overflowY: "auto", padding: "20px 32px" }}>
            {renderVisual(value)}
          </div>
        )}

        {/* MODE: SOURCE ONLY (FIT WIDTH & HEIGHT) */}
        {editorMode === "source" && (
          <div style={{ width: "100%", height: "100%", display: "flex" }}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              style={{
                width: "100%",
                height: "100%",
                flex: 1,
                padding: "16px 22px",
                border: "none",
                outline: "none",
                resize: "none",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: "0.88rem",
                lineHeight: 1.6,
                color: "var(--ink)",
                background: "transparent",
                overflowY: "auto",
              }}
            />
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MINIMAL FOOTER STATUS BAR */}
      {/* ============================================================== */}
      <div
        style={{
          padding: "4px 14px",
          background: "var(--bx-bg-alt)",
          borderTop: "1px solid var(--bx-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.7rem",
          color: "var(--muted)",
          flexShrink: 0,
        }}
      >
        <span>
          {wordCount} kata • {charCount} karakter • ~{readingTimeMin} min baca
        </span>
        <span>Fit Width &amp; Height • WYSIWYG Markdown</span>
      </div>
    </div>
  );
}
