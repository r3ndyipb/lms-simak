"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import FlatIcon from "./FlatIcon";
import { SimakUser, SimakRole } from "../types/simak";
import { DEMO_USERS, getStoredUser, saveStoredUser } from "../data/simakMockData";

interface SimakHeaderProps {
  currentPage?: "login" | "dashboard";
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  currentUser?: SimakUser;
  onUserChange?: (user: SimakUser) => void;
}

export default function SimakHeader({
  currentPage = "dashboard",
  onToggleSidebar,
  isSidebarCollapsed = false,
  currentUser,
  onUserChange,
}: SimakHeaderProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<SimakUser>(currentUser || DEMO_USERS[0]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const roleSwitcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const updateThemeState = () => {
      const current = document.documentElement.getAttribute("data-theme") as "light" | "dark" | null;
      setTheme(current === "dark" ? "dark" : "light");
    };

    updateThemeState();
    const observer = new MutationObserver(updateThemeState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    if (!currentUser && typeof window !== "undefined") {
      const stored = getStoredUser();
      setUser(stored);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(event.target as Node)) {
        setShowRoleSwitcher(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      observer.disconnect();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentUser]);

  const handleRoleSwitch = (newRole: SimakRole) => {
    const target = DEMO_USERS.find((u) => u.role === newRole) || DEMO_USERS[0];
    setUser(target);
    saveStoredUser(target);
    setShowRoleSwitcher(false);
    if (onUserChange) {
      onUserChange(target);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("simak_logged_in");
      localStorage.removeItem("simak_current_user");
    }
    setShowUserDropdown(false);
    router.push("/login");
  };

  const isAuthPage = currentPage === "login";

  return (
    <header className="portal-auth-header">
      <div className={isAuthPage ? "blackbox-frame" : "portal-header-fluid"}>
        <div className="portal-auth-header-inner">
          {/* Side Menu Toggle & Brand Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {!isAuthPage && onToggleSidebar && (
              <button
                type="button"
                className="portal-header-sidebar-toggle"
                onClick={onToggleSidebar}
                title={isSidebarCollapsed ? "Perluas Menu Samping" : "Kecilkan Menu Samping"}
                aria-label="Toggle Side Menu"
              >
                <FlatIcon type="menu" size={17} />
              </button>
            )}

            <Link href="/" className="portal-auth-brand-group">
              <img
                src={theme === "light" ? "/logo-dark.png" : "/logo-light.png"}
                alt="ANVIEO SIMAK"
                width={34}
                height={34}
                style={{ objectFit: "contain", display: "block" }}
              />
              <div>
                <span className="portal-brand-title">ANVIEO</span>
                <div className="portal-brand-subtitle">
                  {"ACADEMY".split("").map((c, i) => (
                    <span key={i}>{c}</span>
                  ))}
                </div>
              </div>
              <span className="portal-brand-divider" aria-hidden="true" />
              <span className="portal-header-plain-title">Sistem Informasi Manajemen Akademik</span>
              <span className="portal-badge-portal">SIMAK</span>
            </Link>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="portal-header-actions">
            {!isAuthPage && (
              <>
                {/* Role Switcher Pill */}
                <div style={{ position: "relative" }} ref={roleSwitcherRef}>
                  <button
                    type="button"
                    onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                    className="portal-demo-pill"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "var(--brand)",
                      background: "var(--bx-surface)",
                      border: "1px solid var(--bx-border-bright)",
                      borderRadius: "6px",
                    }}
                    title="Ganti Peran Tampilan (Demo Switcher)"
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background:
                          user.role === "administrator"
                            ? "#C9962E"
                            : user.role === "instruktur"
                            ? "#12467A"
                            : user.role === "reviewer"
                            ? "#10B981"
                            : "#8B5CF6",
                      }}
                    />
                    <span style={{ textTransform: "capitalize" }}>Peran: {user.role}</span>
                    <FlatIcon type="chevron-down" size={12} color="var(--muted)" />
                  </button>

                  {showRoleSwitcher && (
                    <div
                      className="portal-user-dropdown-card"
                      style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        right: 0,
                        width: "250px",
                        padding: "8px",
                        zIndex: 100,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          color: "var(--muted)",
                          padding: "4px 8px 6px",
                          borderBottom: "1px solid var(--bx-border)",
                        }}
                      >
                        Pilih Peran Tampilan
                      </div>
                      {DEMO_USERS.map((demo) => (
                        <button
                          key={demo.id}
                          type="button"
                          onClick={() => handleRoleSwitch(demo.role)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px",
                            background: user.role === demo.role ? "var(--bx-bg-alt)" : "transparent",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <img
                            src={demo.avatar}
                            alt={demo.name}
                            style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--ink)" }}>
                              {demo.name.split(",")[0]}
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "capitalize" }}>
                              {demo.roleTitle}
                            </div>
                          </div>
                          {user.role === demo.role && (
                            <span style={{ color: "var(--gold)" }}>
                              <FlatIcon type="check" size={14} />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <ThemeToggle />

                <span className="portal-header-action-divider" aria-hidden="true" />

                {/* User Avatar + Profile Button */}
                <div className="portal-user-container" ref={userDropdownRef} style={{ position: "relative" }}>
                  <button
                    type="button"
                    className={`portal-header-user-btn ${showUserDropdown ? "active" : ""}`}
                    onClick={() => {
                      setShowUserDropdown(!showUserDropdown);
                      setShowRoleSwitcher(false);
                    }}
                    aria-expanded={showUserDropdown}
                    aria-label={`Menu profil ${user.name}`}
                  >
                    <div className="portal-header-avatar-wrap">
                      <img src={user.avatar} alt={user.name} className="portal-header-avatar" />
                      <span className="portal-avatar-status-dot" title="Status: Online" />
                    </div>

                    <div className="portal-header-user-text">
                      <span className="portal-header-user-name">{user.name.split(",")[0]}</span>
                      <div className="portal-header-user-id-email">
                        <span className="portal-user-badge-id">{user.nip}</span>
                        <span className="portal-sep">·</span>
                        <span className="portal-user-email-text" style={{ textTransform: "capitalize" }}>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <span className={`portal-header-chevron ${showUserDropdown ? "open" : ""}`} aria-hidden="true">
                      <FlatIcon type="chevron-down" size={13} />
                    </span>
                  </button>

                  {/* Profile Dropdown Card */}
                  {showUserDropdown && (
                    <div className="portal-user-dropdown-card">
                      <div className="portal-dropdown-profile-header">
                        <div className="portal-dropdown-avatar-wrap">
                          <img src={user.avatar} alt={user.name} className="portal-dropdown-avatar" />
                          <span className="portal-avatar-status-dot-large" />
                        </div>
                        <div className="portal-dropdown-profile-meta">
                          <h4 className="portal-dropdown-name">{user.name}</h4>
                          <p className="portal-dropdown-email">{user.email}</p>
                          <div className="portal-dropdown-badges">
                            <span className="portal-dropdown-id-chip">NIP: {user.nip}</span>
                            <span className="portal-dropdown-status-chip" style={{ textTransform: "capitalize" }}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="portal-dropdown-divider" />

                      <div className="portal-dropdown-footer">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="portal-dropdown-logout-btn"
                        >
                          <FlatIcon type="logout" size={15} color="#EF4444" />
                          <span>Keluar dari SIMAK</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {isAuthPage && (
              <>
                <a
                  href="http://localhost:3000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-back-link"
                  title="Kunjungi website publik LMS"
                >
                  <FlatIcon type="globe" size={14} />
                  <span>Halaman Utama</span>
                </a>

                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-back-link"
                  style={{ fontWeight: 700, color: "var(--gold)" }}
                  title="Buka Portal Siswa"
                >
                  <FlatIcon type="user" size={14} />
                  <span>Portal Siswa</span>
                </a>

                <ThemeToggle />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
