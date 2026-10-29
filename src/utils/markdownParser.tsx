"use client";

import React, { useState } from "react";
import FlatIcon from "../components/FlatIcon";

/**
 * Utility to clean and normalize raw markdown copied from external sources
 * (e.g., GitHub, Obsidian, Notion, or ChatGPT), ensuring standardized syntax
 * for headings, horizontal rules, lists, and key-value pairs.
 */
export function cleanAndNormalizeMarkdown(raw: string): string {
  if (!raw) return "";

  let cleaned = raw.replace(/\r\n/g, "\n");

  // 1. Remove accidental YAML frontmatter if pasted from Obsidian/Jekyll
  // e.g. --- title: ... ---
  cleaned = cleaned.replace(/^---\n[\s\S]*?\n---\n+/, "");

  // 2. Normalize horizontal rules (---, ***, ___) to standard --- with clean spacing
  cleaned = cleaned.replace(/\n\s*(\*{3,}|-{3,}|_{3,})\s*\n/g, "\n\n---\n\n");

  // 3. Normalize bullet lists: convert lines starting with `* ` or `+ ` to `- `
  // unless it's a horizontal rule (***) or bold line
  cleaned = cleaned.split("\n").map((line) => {
    // If line starts with `* ` or `+ ` (not bold `**` or italic `*word*`)
    if (/^\s*[\*\+]\s+(?!\*)/.test(line)) {
      return line.replace(/^(\s*)[\*\+]\s+/, "$1- ");
    }
    return line;
  }).join("\n");

  // 4. Normalize key-value bold colon spacing:
  // e.g. `**Status :**` or `**Status:**Aktif` -> `**Status:** Aktif`
  cleaned = cleaned.replace(/\*\*([^*\n]+?)\s*:\s*\*\*\s*/g, "**$1:** ");

  // 5. Ensure space after heading hashes (#Heading -> # Heading)
  cleaned = cleaned.replace(/^(#{1,6})([^#\s])/gm, "$1 $2");

  // 6. Clean consecutive blank lines (max 2)
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  return cleaned.trim();
}

/**
 * Parses and renders inline markdown tokens:
 * - ***bold italic***
 * - **bold** and __bold__
 * - *italic* and _italic_
 * - `inline code`
 * - [link text](url)
 * - ~~strikethrough~~
 */
export function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Regex matching all inline tokens
  const TOKEN_REGEX = /(\*\*\*[^*]+?\*\*\*|___[^_]+?___|\*\*[^*]+?\*\*|__[^_]+?__|`[^`\n]+?`|\[[^\]]+\]\([^)]+\)|~~[^~]+?~~|\*[^*\n]+?\*|_[^_\n]+?_)/g;

  const parts = text.split(TOKEN_REGEX);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold + Italic (***text*** or ___text___)
    if (
      (part.startsWith("***") && part.endsWith("***") && part.length >= 6) ||
      (part.startsWith("___") && part.endsWith("___") && part.length >= 6)
    ) {
      const inner = part.slice(3, -3);
      return (
        <strong key={index} style={{ fontWeight: 800, fontStyle: "italic", color: "var(--brand, #0A2E52)" }}>
          {inner}
        </strong>
      );
    }

    // Bold (**text** or __text__)
    if (
      (part.startsWith("**") && part.endsWith("**") && part.length >= 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length >= 4)
    ) {
      const inner = part.slice(2, -2);
      // Extra polish if it ends with a colon (e.g. Status:)
      const isKeyLabel = inner.endsWith(":");
      return (
        <strong
          key={index}
          style={{
            fontWeight: 750,
            color: isKeyLabel ? "var(--brand, #0A2E52)" : "inherit",
            marginRight: isKeyLabel ? "4px" : "0",
          }}
        >
          {inner}
        </strong>
      );
    }

    // Italic (*text* or _text_)
    if (
      (part.startsWith("*") && part.endsWith("*") && part.length >= 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length >= 2)
    ) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} style={{ fontStyle: "italic" }}>
          {inner}
        </em>
      );
    }

    // Inline Code (`code`)
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <code
          key={index}
          style={{
            background: "rgba(10, 46, 82, 0.08)",
            color: "var(--brand, #0A2E52)",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "0.85em",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            border: "1px solid rgba(10, 46, 82, 0.12)",
          }}
        >
          {inner}
        </code>
      );
    }

    // Strikethrough (~~text~~)
    if (part.startsWith("~~") && part.endsWith("~~") && part.length >= 4) {
      const inner = part.slice(2, -2);
      return (
        <del key={index} style={{ color: "var(--muted, #64748B)", textDecoration: "line-through" }}>
          {inner}
        </del>
      );
    }

    // Links ([text](url))
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--brand, #0A2E52)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            fontWeight: 600,
          }}
        >
          {label}
        </a>
      );
    }

    // Default plain text
    return <span key={index}>{part}</span>;
  });
}

interface MarkdownRendererProps {
  content: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * High-performance, clean Markdown Renderer Component.
 * Supports:
 * - Code blocks (with syntax tag & copy button)
 * - HTML figure / images
 * - Horizontal rules (---, ***, ___)
 * - Headings (H1 to H5)
 * - Callout alerts (> [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT], > [!CAUTION])
 * - Blockquotes (> quote)
 * - Key-Value bullet points (* **Status:** Aktif)
 * - Numbered lists (1. , 2. )
 * - Interactive task lists (- [x], - [ ])
 * - Tables (| Col1 | Col2 |)
 * - Inline formatting (Bold, Italic, Code, Link, Strikethrough)
 */
export default function MarkdownRenderer({ content, style, className }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!content || !content.trim()) {
    return (
      <div style={{ color: "var(--muted, #64748B)", fontStyle: "italic", padding: "40px 10px", textAlign: "center" }}>
        Naskah kosong. Ketik teks naskah atau paste kode Markdown di panel editor.
      </div>
    );
  }

  // 1. Split top-level code blocks and html figures
  const parts = content.split(/(```[\s\S]*?```|<figure[\s\S]*?<\/figure>)/g);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      className={className}
      style={{
        lineHeight: 1.65,
        fontSize: "0.88rem",
        color: "var(--ink, #0F172A)",
        ...style,
      }}
    >
      {parts.map((part, pIdx) => {
        if (!part) return null;

        // A. Code Blocks
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          const lang = (lines[0] || "CODE").trim();
          const code = lines.slice(1).join("\n");

          return (
            <div
              key={pIdx}
              style={{
                margin: "16px 0",
                background: "#0F172A",
                color: "#F8FAFC",
                borderRadius: "6px",
                overflow: "hidden",
                border: "1px solid #1E293B",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: "0.82rem",
              }}
            >
              <div
                style={{
                  background: "#1E293B",
                  padding: "6px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #334155",
                  fontSize: "0.72rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444", display: "inline-block" }} />
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
                  <span style={{ color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", marginLeft: "4px" }}>
                    {lang}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(code, pIdx)}
                  style={{
                    background: "transparent",
                    border: "1px solid #475569",
                    borderRadius: "4px",
                    color: copiedIndex === pIdx ? "#10B981" : "#94A3B8",
                    padding: "2px 8px",
                    fontSize: "0.68rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FlatIcon type={copiedIndex === pIdx ? "check" : "code"} size={12} color={copiedIndex === pIdx ? "#10B981" : "#94A3B8"} />
                  <span>{copiedIndex === pIdx ? "Tersalin!" : "Salin Kode"}</span>
                </button>
              </div>
              <pre style={{ margin: 0, padding: "12px 14px", overflowX: "auto", lineHeight: 1.55 }}>
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // B. Figures / HTML Images
        if (part.startsWith("<figure") && part.endsWith("</figure>")) {
          return <div key={pIdx} dangerouslySetInnerHTML={{ __html: part }} style={{ margin: "18px 0" }} />;
        }

        // C. Standard Markdown Paragraphs & Blocks
        return (
          <div key={pIdx}>
            {part.split("\n\n").map((para, paraIdx) => {
              const p = para.trim();
              if (!p) return null;

              // 1. Horizontal Rules (---, ***, ___)
              if (p === "---" || p === "***" || p === "___" || /^[-*_]{3,}$/.test(p)) {
                return (
                  <hr
                    key={paraIdx}
                    style={{
                      border: "none",
                      borderTop: "1px solid var(--bx-border, #E2E8F0)",
                      margin: "24px 0",
                    }}
                  />
                );
              }

              // 2. Headings
              if (p.startsWith("# ")) {
                return (
                  <h1
                    key={paraIdx}
                    style={{
                      fontSize: "1.35rem",
                      fontFamily: "var(--font-heading)",
                      color: "var(--brand, #0A2E52)",
                      margin: "20px 0 10px",
                      fontWeight: 800,
                      borderBottom: "1px solid var(--bx-border, #E2E8F0)",
                      paddingBottom: "6px",
                    }}
                  >
                    {renderInlineMarkdown(p.slice(2))}
                  </h1>
                );
              }
              if (p.startsWith("## ")) {
                return (
                  <h2
                    key={paraIdx}
                    style={{
                      fontSize: "1.18rem",
                      fontFamily: "var(--font-heading)",
                      color: "var(--brand, #0A2E52)",
                      margin: "18px 0 8px",
                      fontWeight: 750,
                    }}
                  >
                    {renderInlineMarkdown(p.slice(3))}
                  </h2>
                );
              }
              if (p.startsWith("### ")) {
                return (
                  <h3
                    key={paraIdx}
                    style={{
                      fontSize: "1.02rem",
                      fontFamily: "var(--font-heading)",
                      color: "var(--brand, #0A2E52)",
                      margin: "14px 0 6px",
                      fontWeight: 700,
                    }}
                  >
                    {renderInlineMarkdown(p.slice(4))}
                  </h3>
                );
              }
              if (p.startsWith("#### ")) {
                return (
                  <h4
                    key={paraIdx}
                    style={{
                      fontSize: "0.92rem",
                      fontFamily: "var(--font-heading)",
                      color: "var(--brand, #0A2E52)",
                      margin: "12px 0 4px",
                      fontWeight: 700,
                    }}
                  >
                    {renderInlineMarkdown(p.slice(5))}
                  </h4>
                );
              }

              // 3. GitHub / Documentation Callout Alerts
              if (p.startsWith("> [!NOTE]")) {
                return (
                  <div
                    key={paraIdx}
                    style={{
                      margin: "14px 0",
                      padding: "12px 14px",
                      background: "#EFF6FF",
                      borderLeft: "3px solid #2563EB",
                      borderRadius: "0 6px 6px 0",
                      color: "#1E40AF",
                      fontSize: "0.84rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <FlatIcon type="info" size={16} color="#2563EB" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: "block", marginBottom: "2px", color: "#1E3A8A" }}>Catatan Penting (Note)</strong>
                      <span>{renderInlineMarkdown(p.replace("> [!NOTE]", "").trim())}</span>
                    </div>
                  </div>
                );
              }
              if (p.startsWith("> [!TIP]")) {
                return (
                  <div
                    key={paraIdx}
                    style={{
                      margin: "14px 0",
                      padding: "12px 14px",
                      background: "#ECFDF5",
                      borderLeft: "3px solid #059669",
                      borderRadius: "0 6px 6px 0",
                      color: "#065F46",
                      fontSize: "0.84rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <FlatIcon type="star" size={16} color="#059669" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: "block", marginBottom: "2px", color: "#064E3B" }}>Tips &amp; Rekomendasi</strong>
                      <span>{renderInlineMarkdown(p.replace("> [!TIP]", "").trim())}</span>
                    </div>
                  </div>
                );
              }
              if (p.startsWith("> [!WARNING]")) {
                return (
                  <div
                    key={paraIdx}
                    style={{
                      margin: "14px 0",
                      padding: "12px 14px",
                      background: "#FFFBEB",
                      borderLeft: "3px solid #D97706",
                      borderRadius: "0 6px 6px 0",
                      color: "#92400E",
                      fontSize: "0.84rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <FlatIcon type="warning" size={16} color="#D97706" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: "block", marginBottom: "2px", color: "#78350F" }}>Peringatan (Warning)</strong>
                      <span>{renderInlineMarkdown(p.replace("> [!WARNING]", "").trim())}</span>
                    </div>
                  </div>
                );
              }
              if (p.startsWith("> [!IMPORTANT]")) {
                return (
                  <div
                    key={paraIdx}
                    style={{
                      margin: "14px 0",
                      padding: "12px 14px",
                      background: "#F5F3FF",
                      borderLeft: "3px solid #7C3AED",
                      borderRadius: "0 6px 6px 0",
                      color: "#5B21B6",
                      fontSize: "0.84rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <FlatIcon type="info" size={16} color="#7C3AED" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: "block", marginBottom: "2px", color: "#4C1D95" }}>Penting (Important)</strong>
                      <span>{renderInlineMarkdown(p.replace("> [!IMPORTANT]", "").trim())}</span>
                    </div>
                  </div>
                );
              }

              // 4. Standard Blockquote (> quote)
              if (p.startsWith("> ")) {
                return (
                  <blockquote
                    key={paraIdx}
                    style={{
                      margin: "14px 0",
                      padding: "10px 16px",
                      borderLeft: "3px solid var(--gold, #C9962E)",
                      background: "var(--bx-bg-alt, #F8FAFC)",
                      fontStyle: "italic",
                      borderRadius: "0 6px 6px 0",
                      fontSize: "0.86rem",
                      color: "var(--ink, #0F172A)",
                    }}
                  >
                    {renderInlineMarkdown(p.replace(/^>\s*/, ""))}
                  </blockquote>
                );
              }

              // 5. Tables (| col1 | col2 |)
              if (p.includes("|") && p.includes("\n|")) {
                const rows = p.split("\n").filter((r) => r.includes("|"));
                if (rows.length >= 2) {
                  const head = rows[0].split("|").filter((c) => c.trim() !== "");
                  const body = rows.slice(2); // Skip separator row (| :--- |)
                  return (
                    <div key={paraIdx} style={{ margin: "16px 0", overflowX: "auto" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: "0.82rem",
                          border: "1px solid var(--bx-border, #E2E8F0)",
                          borderRadius: "6px",
                          overflow: "hidden",
                        }}
                      >
                        <thead>
                          <tr style={{ background: "var(--bx-bg-alt, #F8FAFC)" }}>
                            {head.map((h, i) => (
                              <th
                                key={i}
                                style={{
                                  padding: "8px 12px",
                                  border: "1px solid var(--bx-border, #E2E8F0)",
                                  textAlign: "left",
                                  fontWeight: 750,
                                  color: "var(--brand, #0A2E52)",
                                }}
                              >
                                {renderInlineMarkdown(h.trim())}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {body.map((row, rI) => (
                            <tr key={rI} style={{ background: rI % 2 === 1 ? "rgba(0,0,0,0.015)" : "transparent" }}>
                              {row
                                .split("|")
                                .filter((c) => c.trim() !== "")
                                .map((c, cI) => (
                                  <td
                                    key={cI}
                                    style={{
                                      padding: "8px 12px",
                                      border: "1px solid var(--bx-border, #E2E8F0)",
                                    }}
                                  >
                                    {renderInlineMarkdown(c.trim())}
                                  </td>
                                ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }

              // 6. Ordered Lists (1. item, 2. item)
              if (/^\d+\.\s+/.test(p)) {
                const items = p.split(/\n(?=\d+\.\s+)/).map((it) => it.replace(/^\d+\.\s+/, "").trim());
                return (
                  <ol
                    key={paraIdx}
                    style={{
                      margin: "10px 0",
                      paddingLeft: "24px",
                      lineHeight: 1.65,
                      fontSize: "0.86rem",
                    }}
                  >
                    {items.map((it, itIdx) => (
                      <li key={itIdx} style={{ marginBottom: "4px" }}>
                        {renderInlineMarkdown(it)}
                      </li>
                    ))}
                  </ol>
                );
              }

              // 7. Unordered Lists and Key-Value bullet points
              // Handles `- `, `* `, `+ ` and task lists `- [ ]`, `- [x]`
              const isListBlock =
                /^\s*[-*+]\s+/.test(p) ||
                p.includes("\n- ") ||
                p.includes("\n* ") ||
                p.includes("\n+ ");

              if (isListBlock) {
                const rawItems = p.split(/\n\s*[-*+]\s+/).map((item) => item.replace(/^\s*[-*+]\s+/, "").trim()).filter(Boolean);

                return (
                  <ul
                    key={paraIdx}
                    style={{
                      margin: "10px 0",
                      paddingLeft: "22px",
                      lineHeight: 1.65,
                      fontSize: "0.86rem",
                      listStyleType: "disc",
                    }}
                  >
                    {rawItems.map((it, itIdx) => {
                      // Check for task checklist: `- [x]` or `- [ ]`
                      if (it.startsWith("[x] ") || it.startsWith("[X] ")) {
                        return (
                          <li
                            key={itIdx}
                            style={{
                              listStyleType: "none",
                              marginLeft: "-18px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "5px",
                            }}
                          >
                            <span
                              style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "3px",
                                background: "#10B981",
                                color: "#FFFFFF",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.65rem",
                                fontWeight: 900,
                              }}
                            >
                              ✓
                            </span>
                            <span style={{ textDecoration: "line-through", color: "var(--muted, #64748B)" }}>
                              {renderInlineMarkdown(it.slice(4))}
                            </span>
                          </li>
                        );
                      }
                      if (it.startsWith("[ ] ")) {
                        return (
                          <li
                            key={itIdx}
                            style={{
                              listStyleType: "none",
                              marginLeft: "-18px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "5px",
                            }}
                          >
                            <span
                              style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "3px",
                                border: "1.5px solid var(--bx-border, #CBD5E1)",
                                background: "var(--bx-surface, #FFFFFF)",
                                display: "inline-block",
                              }}
                            />
                            <span>{renderInlineMarkdown(it.slice(4))}</span>
                          </li>
                        );
                      }

                      return (
                        <li key={itIdx} style={{ marginBottom: "4px" }}>
                          {renderInlineMarkdown(it)}
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              // 8. Default Paragraph with full inline markdown parsing
              return (
                <p
                  key={paraIdx}
                  style={{
                    margin: "12px 0",
                    lineHeight: 1.68,
                    fontSize: "0.88rem",
                    color: "var(--ink, #0F172A)",
                  }}
                >
                  {renderInlineMarkdown(p)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

