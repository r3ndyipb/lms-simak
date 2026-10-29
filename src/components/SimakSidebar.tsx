"use client";

import React, { useState, useEffect } from "react";
import FlatIcon from "./FlatIcon";
import { SimakNavId, SimakRole, SimakUser } from "../types/simak";

interface SimakSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeId?: SimakNavId;
  onSelectNav?: (id: SimakNavId) => void;
  currentRole?: SimakRole;
  currentUser?: SimakUser;
  onUserClick?: () => void;
}

interface NavItem {
  id: SimakNavId;
  label: string;
  icon: string;
}

interface NavGroup {
  groupTitle?: string;
  items: NavItem[];
}

const SIMAK_NAV_GROUPS: NavGroup[] = [
  {
    items: [
      {
        id: "dashboard",
        label: "Ringkasan",
        icon: "home",
      },
    ],
  },
  {
    groupTitle: "Akademik & Kelas",
    items: [
      {
        id: "master-data",
        label: "Master Data LMS",
        icon: "layers",
      },
      {
        id: "kurikulum",
        label: "Manajemen Kelas",
        icon: "curriculum",
      },
      {
        id: "learning-paths",
        label: "Learning Path",
        icon: "roadmap",
      },
      {
        id: "programs",
        label: "Program Terbaru",
        icon: "bootcamp",
      },
      {
        id: "mentoring",
        label: "Mentoring & Klinik",
        icon: "consult",
      },
    ],
  },
  {
    groupTitle: "Evaluasi & Review",
    items: [
      {
        id: "quiz-builder",
        label: "Quiz & Assessment",
        icon: "quiz",
      },
      {
        id: "review-queue",
        label: "Review Tugas",
        icon: "code",
      },
      {
        id: "penilaian",
        label: "Grading & Peringkat",
        icon: "award",
      },
    ],
  },
  {
    groupTitle: "Keuangan & Monetisasi",
    items: [
      {
        id: "keuangan",
        label: "Keuangan & Transaksi",
        icon: "bank",
      },
      {
        id: "subscription",
        label: "Langganan & Promo",
        icon: "ticket",
      },
    ],
  },
  {
    groupTitle: "Ekosistem & Karir",
    items: [
      {
        id: "komunitas",
        label: "Komunitas & Forum",
        icon: "forum",
      },
      {
        id: "events",
        label: "Event & Workshop",
        icon: "calendar",
      },
      {
        id: "jobs",
        label: "Jobs & Karir",
        icon: "briefcase",
      },
      {
        id: "blog",
        label: "Blog & Artikel",
        icon: "book",
      },
    ],
  },
  {
    groupTitle: "User Management",
    items: [
      {
        id: "users",
        label: "Manajemen Pengguna",
        icon: "users",
      },
      {
        id: "mahasiswa",
        label: "Data Mahasiswa",
        icon: "students",
      },
      {
        id: "dosen-reviewer",
        label: "Dosen & Reviewer",
        icon: "graduation",
      },
    ],
  },
  {
    groupTitle: "Pengaturan & Role",
    items: [
      {
        id: "pengaturan",
        label: "Pengaturan SIMAK",
        icon: "settings",
      },
      {
        id: "role-management",
        label: "Role & Hak Akses",
        icon: "shield",
      },
      {
        id: "audit-log",
        label: "Log Audit Sistem",
        icon: "history",
      },
    ],
  },
];

interface HoveredTooltipInfo {
  label: string;
  groupTitle?: string;
  top: number;
}

export default function SimakSidebar({
  collapsed,
  onToggle,
  activeId = "dashboard",
  onSelectNav,
  currentUser,
  onUserClick,
}: SimakSidebarProps) {
  const [currentActive, setCurrentActive] = useState<SimakNavId>(activeId);
  const [hoveredTooltip, setHoveredTooltip] = useState<HoveredTooltipInfo | null>(null);

  useEffect(() => {
    if (activeId) {
      setCurrentActive(activeId);
    }
  }, [activeId]);

  // Bersihkan tooltip saat sidebar toggle atau unmount
  useEffect(() => {
    setHoveredTooltip(null);
  }, [collapsed]);

  const handleItemClick = (e: React.MouseEvent, item: NavItem) => {
    e.preventDefault();
    setHoveredTooltip(null);
    setCurrentActive(item.id);
    if (typeof window !== "undefined") {
      window.location.hash = item.id;
    }
    if (onSelectNav) {
      onSelectNav(item.id);
    }
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLButtonElement>,
    label: string,
    groupTitle?: string
  ) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredTooltip({
      label,
      groupTitle,
      top: rect.top + rect.height / 2,
    });
  };

  const handleMouseLeave = () => {
    setHoveredTooltip(null);
  };

  return (
    <>
      <aside
        className={`portal-sidebar ${collapsed ? "collapsed" : "expanded"}`}
        aria-label="Navigasi Samping SIMAK"
      >
        {/* Top User Profile Bar (Clickable Avatar) */}
        <div
          style={{
            padding: collapsed ? "12px 0 10px" : "12px 14px 10px",
            borderBottom: "1px solid var(--bx-border)",
            background: "var(--bx-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            flexShrink: 0,
            transition: "all 0.2s ease",
          }}
        >
          <button
            type="button"
            onClick={onUserClick || (() => {})}
            onMouseEnter={(e) =>
              handleMouseEnter(
                e,
                currentUser?.name || "Profil Admin",
                `Role: ${currentUser?.role?.toUpperCase() || "SUPERADMIN"}`
              )
            }
            onMouseLeave={handleMouseLeave}
            title={collapsed ? `${currentUser?.name || "Profil"} (${currentUser?.role || "Admin"})` : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: collapsed ? "0" : "10px",
              background: "transparent",
              border: "none",
              padding: collapsed ? "2px" : "4px 6px",
              borderRadius: "8px",
              cursor: "pointer",
              width: collapsed ? "auto" : "100%",
              textAlign: "left",
              transition: "background 0.15s ease",
            }}
          >
            <div style={{ position: "relative", flexShrink: 0, width: "38px", height: "38px" }}>
              <img
                src={currentUser?.avatar || "/alumni/alumni_1.jpg"}
                alt={currentUser?.name || "Avatar"}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--gold, #C9962E)",
                  boxShadow: "0 2px 6px rgba(201, 150, 46, 0.25)",
                  display: "block",
                }}
              />
              {/* Online Status Dot */}
              <span
                style={{
                  position: "absolute",
                  bottom: "0px",
                  right: "0px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#10B981",
                  border: "2px solid var(--bx-surface, #ffffff)",
                  boxShadow: "0 0 0 1px rgba(16, 185, 129, 0.4)",
                }}
              />
            </div>

            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--brand, #0A2E52)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentUser?.name || "Dr. Budi Santoso"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                  <span
                    style={{
                      fontSize: "0.625rem",
                      fontWeight: 800,
                      padding: "1px 6px",
                      borderRadius: "4px",
                      background: "rgba(201, 150, 46, 0.15)",
                      color: "var(--gold-2, #966C12)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {currentUser?.role || "Superadmin"}
                  </span>
                  <span style={{ fontSize: "0.65rem", color: "var(--muted)" }}>Aktif</span>
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="portal-sidebar-nav-wrap">
          {SIMAK_NAV_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx} className="portal-sidebar-group">
              {/* Collapsed Divider between groups */}
              {collapsed && groupIdx > 0 && (
                <div className="portal-sidebar-collapsed-divider" />
              )}

              {/* Group Title in Expanded mode */}
              {!collapsed && group.groupTitle && (
                <div className="portal-sidebar-group-title">{group.groupTitle}</div>
              )}

              <ul className="portal-sidebar-menu">
                {group.items.map((item) => {
                  const isActive = currentActive === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={(e) => handleItemClick(e, item)}
                        onMouseEnter={(e) => handleMouseEnter(e, item.label, group.groupTitle)}
                        onMouseLeave={handleMouseLeave}
                        className={`portal-sidebar-item ${isActive ? "active" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="portal-sidebar-item-icon">
                          <FlatIcon type={item.icon} size={collapsed ? 20 : 18} />
                        </span>

                        {!collapsed && (
                          <span className="portal-sidebar-item-label">{item.label}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Toggle Action */}
        <div className="portal-sidebar-footer">
          <button
            type="button"
            onClick={onToggle}
            onMouseEnter={(e) =>
              handleMouseEnter(
                e,
                collapsed ? "Perluas Menu Samping" : "Kecilkan Menu Samping",
                "Navigasi"
              )
            }
            onMouseLeave={handleMouseLeave}
            className="portal-sidebar-toggle-action"
            title={collapsed ? "Perluas menu samping" : "Kecilkan menu samping"}
            aria-label={collapsed ? "Perluas Menu Samping" : "Kecilkan Menu Samping"}
          >
            <span className="portal-sidebar-toggle-icon">
              <FlatIcon type={collapsed ? "chevron-right" : "chevron-left"} size={16} />
            </span>
            {!collapsed && (
              <span className="portal-sidebar-toggle-text">Kecilkan Menu</span>
            )}
          </button>
        </div>
      </aside>

      {/* Floating Flyout Tooltip when Collapsed */}
      {collapsed && hoveredTooltip && (
        <div
          style={{
            position: "fixed",
            left: "76px",
            top: `${hoveredTooltip.top}px`,
            transform: "translateY(-50%)",
            background: "var(--brand, #0A2E52)",
            color: "#ffffff",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "0.78rem",
            fontWeight: 600,
            boxShadow: "0 6px 20px rgba(10, 46, 82, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            zIndex: 99999,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {hoveredTooltip.groupTitle && (
            <span
              style={{
                fontSize: "0.62rem",
                color: "var(--gold, #C9962E)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 700,
              }}
            >
              {hoveredTooltip.groupTitle}
            </span>
          )}
          <span>{hoveredTooltip.label}</span>
          {/* Arrow pointing to icon */}
          <div
            style={{
              position: "absolute",
              left: "-5px",
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              borderRight: "5px solid var(--brand, #0A2E52)",
            }}
          />
        </div>
      )}
    </>
  );
}
