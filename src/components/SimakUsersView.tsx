"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { LmsStudent, LmsInstructor, SimakUser } from "../types/simak";
import {
  MOCK_LMS_STUDENTS,
  MOCK_LMS_INSTRUCTORS,
  DEMO_USERS,
} from "../data/simakMockData";

type UserTab = "siswa" | "instructor" | "admin";

export default function SimakUsersView() {
  const [activeTab, setActiveTab] = useState<UserTab>("siswa");

  // State collections
  const [students, setStudents] = useState<LmsStudent[]>(MOCK_LMS_STUDENTS);
  const [instructors, setInstructors] = useState<LmsInstructor[]>(MOCK_LMS_INSTRUCTORS);
  const [admins, setAdmins] = useState<SimakUser[]>(DEMO_USERS);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [selectedStudent, setSelectedStudent] = useState<LmsStudent | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<LmsInstructor | null>(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddInstructorModal, setShowAddInstructorModal] = useState(false);

  // New admin form
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("administrasi");

  // New instructor form
  const [newInsName, setNewInsName] = useState("");
  const [newInsEmail, setNewInsEmail] = useState("");
  const [newInsField, setNewInsField] = useState("Web Development");
  const [newInsCommission, setNewInsCommission] = useState(70);

  // Student Actions
  const handleToggleStudentBan = (studentId: string) => {
    setStudents(
      students.map((s) => {
        if (s.id === studentId) {
          const nextStatus = s.status === "banned" ? "aktif" : "banned";
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent({
        ...selectedStudent,
        status: selectedStudent.status === "banned" ? "aktif" : "banned",
      });
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Nama,Email,Status,Jumlah Kelas,Progres,Terakhir Aktif"]
        .concat(
          students.map(
            (s) =>
              `"${s.name}","${s.email}","${s.status}",${s.enrolledCoursesCount},"${s.avgProgress}%","${s.lastActive}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lms_students_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Admin Handler
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;
    const newStaff: SimakUser = {
      id: `usr-admin-${Date.now()}`,
      nip: `199${Math.floor(1000000000000 + Math.random() * 900000000000)}`,
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole as any,
      roleTitle: newAdminRole === "administrator" ? "Administrator Platform" : "Staf Operasional",
      department: "Direktorat Layanan & Teknologi LMS",
      avatar: "/alumni/alumni_1.jpg",
      status: "aktif",
      lastLogin: "Baru dibuat",
    };
    setAdmins([...admins, newStaff]);
    setNewAdminName("");
    setNewAdminEmail("");
    setShowAddAdminModal(false);
  };

  // Add Instructor Handler
  const handleAddInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInsName || !newInsEmail) return;
    const newIns: LmsInstructor = {
      id: `ins-${Date.now()}`,
      name: newInsName,
      email: newInsEmail,
      avatar: "/alumni/alumni_2.jpg",
      field: newInsField,
      totalCourses: 0,
      avgRating: 5.0,
      totalStudents: 0,
      status: "aktif",
      commissionRate: Number(newInsCommission),
      bio: "Instruktur baru yang baru diundang ke platform.",
      joinedAt: "Hari ini",
    };
    setInstructors([...instructors, newIns]);
    setNewInsName("");
    setNewInsEmail("");
    setShowAddInstructorModal(false);
  };

  // Filter logic
  const filteredStudents = students.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  const filteredInstructors = instructors.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.field.toLowerCase().includes(q);
  });

  const filteredAdmins = admins.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
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
              Manajemen Pengguna
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Tata Kelola Siswa, Instruktur &amp; Staf Admin
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
            Direktori Pengguna Platform LMS
          </h2>
        </div>

        {/* 3-Tab Segment Switcher */}
        <div style={{ display: "flex", gap: "6px", background: "var(--bx-bg-alt)", padding: "4px", borderRadius: "8px" }}>
          {[
            { id: "siswa", label: "Siswa (Students)", count: students.length, icon: "users" },
            { id: "instructor", label: "Instruktur", count: instructors.length, icon: "award" },
            { id: "admin", label: "Admin & Staff", count: admins.length, icon: "shield" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as UserTab);
                  setStatusFilter("all");
                }}
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
                <span
                  style={{
                    fontSize: "0.68rem",
                    padding: "1px 6px",
                    borderRadius: "10px",
                    background: isActive ? "rgba(255,255,255,0.25)" : "var(--bx-border)",
                    color: isActive ? "#ffffff" : "var(--muted)",
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Strip: Search & Actions */}
      <div
        style={{
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "8px",
          padding: "12px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, maxWidth: "420px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--bx-bg-alt)",
              border: "1px solid var(--bx-border)",
              borderRadius: "6px",
              padding: "6px 10px",
              width: "100%",
            }}
          >
            <FlatIcon type="search" size={14} color="var(--muted)" />
            <input
              type="text"
              placeholder={`Cari nama atau email ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: "0.82rem", color: "var(--ink)" }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif</option>
            {activeTab === "siswa" && <option value="nonaktif">Nonaktif</option>}
            {activeTab === "siswa" && <option value="banned">Banned</option>}
            {activeTab === "instructor" && <option value="pending">Pending</option>}
            {activeTab === "instructor" && <option value="suspended">Suspended</option>}
          </select>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {activeTab === "siswa" && (
            <button
              type="button"
              onClick={handleExportCSV}
              style={{
                padding: "7px 12px",
                borderRadius: "6px",
                border: "1px solid var(--bx-border)",
                background: "var(--bx-surface)",
                color: "var(--ink)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Export CSV Data
            </button>
          )}

          {activeTab === "instructor" && (
            <button
              type="button"
              onClick={() => setShowAddInstructorModal(true)}
              style={{
                padding: "7px 14px",
                borderRadius: "6px",
                border: "none",
                background: "var(--gold, #C9962E)",
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
              <span>Undang Instruktur</span>
            </button>
          )}

          {activeTab === "admin" && (
            <button
              type="button"
              onClick={() => setShowAddAdminModal(true)}
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
              <span>Tambah Admin / Staff</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: DAFTAR SISWA (STUDENTS) */}
      {/* ============================================================== */}
      {activeTab === "siswa" && (
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
                <th style={{ padding: "10px 14px" }}>Profil Siswa</th>
                <th style={{ padding: "10px 14px" }}>Status</th>
                <th style={{ padding: "10px 14px" }}>Kelas Diikuti</th>
                <th style={{ padding: "10px 14px" }}>Rata-rata Progres</th>
                <th style={{ padding: "10px 14px" }}>Terakhir Aktif</th>
                <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((std) => (
                <tr key={std.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={std.avatar}
                        alt={std.name}
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div
                          onClick={() => setSelectedStudent(std)}
                          style={{ fontWeight: 700, color: "var(--brand)", cursor: "pointer" }}
                        >
                          {std.name}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{std.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background:
                          std.status === "aktif" ? "#D1FAE5" :
                          std.status === "nonaktif" ? "#F3F4F6" : "#FEE2E2",
                        color:
                          std.status === "aktif" ? "#065F46" :
                          std.status === "nonaktif" ? "#4B5563" : "#DC2626",
                      }}
                    >
                      {std.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>
                    {std.enrolledCoursesCount} Kelas
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "60px", height: "6px", background: "var(--bx-bg-alt)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${std.avgProgress}%`, height: "100%", background: "#059669" }} />
                      </div>
                      <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--ink)" }}>
                        {std.avgProgress}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", color: "var(--muted)", fontSize: "0.76rem" }}>
                    {std.lastActive}
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(std)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "1px solid var(--bx-border)",
                          background: "var(--bx-surface)",
                          fontSize: "0.74rem",
                          fontWeight: 600,
                          color: "var(--brand)",
                          cursor: "pointer",
                        }}
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStudentBan(std.id)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "none",
                          background: std.status === "banned" ? "#D1FAE5" : "#FEE2E2",
                          color: std.status === "banned" ? "#065F46" : "#DC2626",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {std.status === "banned" ? "Unban" : "Ban"}
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
      {/* TAB 2: DAFTAR INSTRUCTOR */}
      {/* ============================================================== */}
      {activeTab === "instructor" && (
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
                <th style={{ padding: "10px 14px" }}>Instruktur</th>
                <th style={{ padding: "10px 14px" }}>Spesialisasi Bidang</th>
                <th style={{ padding: "10px 14px" }}>Kelas &amp; Siswa</th>
                <th style={{ padding: "10px 14px" }}>Rating</th>
                <th style={{ padding: "10px 14px" }}>Bagi Hasil (Komisi)</th>
                <th style={{ padding: "10px 14px" }}>Status</th>
                <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstructors.map((ins) => (
                <tr key={ins.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={ins.avatar}
                        alt={ins.name}
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div
                          onClick={() => setSelectedInstructor(ins)}
                          style={{ fontWeight: 700, color: "var(--brand)", cursor: "pointer" }}
                        >
                          {ins.name}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{ins.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", color: "var(--ink)", fontWeight: 600 }}>
                    {ins.field}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <strong>{ins.totalCourses} Kelas</strong>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{ins.totalStudents} Siswa Terdaftar</div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontWeight: 700, color: "#B45309" }}>★ {ins.avgRating}</span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--brand)" }}>
                      {ins.commissionRate}% Pengajar / {100 - ins.commissionRate}% Plat.
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: ins.status === "aktif" ? "#D1FAE5" : "#FEF3C7",
                        color: ins.status === "aktif" ? "#065F46" : "#B45309",
                      }}
                    >
                      {ins.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => setSelectedInstructor(ins)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid var(--bx-border)",
                        background: "var(--bx-surface)",
                        fontSize: "0.74rem",
                        fontWeight: 600,
                        color: "var(--brand)",
                        cursor: "pointer",
                      }}
                    >
                      Atur Komisi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: DAFTAR ADMIN & STAFF */}
      {/* ============================================================== */}
      {activeTab === "admin" && (
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
                <th style={{ padding: "10px 14px" }}>Nama Admin</th>
                <th style={{ padding: "10px 14px" }}>Email &amp; NIP</th>
                <th style={{ padding: "10px 14px" }}>Role Hak Akses</th>
                <th style={{ padding: "10px 14px" }}>Terakhir Login</th>
                <th style={{ padding: "10px 14px" }}>Status</th>
                <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((adm) => (
                <tr key={adm.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={adm.avatar}
                        alt={adm.name}
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--brand)" }}>{adm.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{adm.roleTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div>{adm.email}</div>
                    <code style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{adm.nip}</code>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "var(--bx-bg-alt)",
                        color: "var(--brand)",
                        fontWeight: 700,
                        border: "1px solid var(--bx-border)",
                      }}
                    >
                      {adm.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: "0.76rem", color: "var(--muted)" }}>
                    {adm.lastLogin}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: "0.7rem", padding: "2px 6px", borderRadius: "4px", background: "#D1FAE5", color: "#065F46", fontWeight: 700 }}>
                      AKTIF
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => alert(`Reset password email telah dikirimkan ke ${adm.email}`)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid var(--bx-border)",
                        background: "transparent",
                        fontSize: "0.72rem",
                        color: "var(--brand)",
                        cursor: "pointer",
                      }}
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: DETAIL SISWA */}
      {/* ============================================================== */}
      {selectedStudent && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
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
              maxWidth: "560px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                    {selectedStudent.name}
                  </h3>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                    {selectedStudent.email} • Terdaftar {selectedStudent.registeredAt}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "var(--muted)" }}
              >
                ✕
              </button>
            </div>

            {/* Student Info Sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.82rem" }}>
              <div style={{ padding: "10px", background: "var(--bx-bg-alt)", borderRadius: "6px" }}>
                <strong>Catatan Internal Admin:</strong>
                <p style={{ margin: "4px 0 0", color: "var(--ink)", fontStyle: "italic" }}>
                  {selectedStudent.notes || "Belum ada catatan internal."}
                </p>
              </div>

              <div>
                <strong>Kelas yang Sedang Diikuti:</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
                  {(selectedStudent.enrolledCourses || []).map((c, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "4px" }}>
                      <span>{c.title}</span>
                      <strong style={{ color: "#059669" }}>{c.progress}%</strong>
                    </div>
                  ))}
                  {(!selectedStudent.enrolledCourses || selectedStudent.enrolledCourses.length === 0) && (
                    <span style={{ color: "var(--muted)", fontStyle: "italic" }}>Belum ada kelas terdaftar.</span>
                  )}
                </div>
              </div>

              <div>
                <strong>Riwayat Transaksi:</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }}>
                  {(selectedStudent.paidHistory || []).map((t) => (
                    <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "4px" }}>
                      <span>{t.item} ({t.date})</span>
                      <strong style={{ color: "var(--brand)" }}>Rp {t.amount.toLocaleString("id-ID")}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginTop: "10px", paddingTop: "12px", borderTop: "1px solid var(--bx-border)" }}>
                <button
                  type="button"
                  onClick={() => alert("Kelas gratis berhasil di-assign ke siswa.")}
                  style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontSize: "0.75rem", cursor: "pointer" }}
                >
                  Assign Kelas Gratis
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleStudentBan(selectedStudent.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "none",
                    background: selectedStudent.status === "banned" ? "#059669" : "#DC2626",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  {selectedStudent.status === "banned" ? "Buka Blokir (Unban)" : "Blokir Akun (Ban)"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: DETAIL / ATUR KOMISI INSTRUCTOR */}
      {/* ============================================================== */}
      {selectedInstructor && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
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
              Atur Komisi Instruktur
            </h3>
            <p style={{ margin: "0 0 14px", fontSize: "0.8rem", color: "var(--muted)" }}>
              Atur persentase bagi hasil royalti untuk <strong>{selectedInstructor.name}</strong>.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.82rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>
                  Bagi Hasil untuk Pengajar (%)
                </label>
                <input
                  type="number"
                  min={10}
                  max={90}
                  value={selectedInstructor.commissionRate}
                  onChange={(e) =>
                    setSelectedInstructor({
                      ...selectedInstructor,
                      commissionRate: Number(e.target.value),
                    })
                  }
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.85rem" }}
                />
                <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "4px", display: "block" }}>
                  Platform akan menerima sisa {100 - selectedInstructor.commissionRate}% dari setiap penjualan kelas instruktur ini.
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedInstructor(null)}
                  style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", fontSize: "0.82rem" }}
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInstructors(
                      instructors.map((i) =>
                        i.id === selectedInstructor.id ? selectedInstructor : i
                      )
                    );
                    alert("Persentase komisi berhasil diperbarui.");
                    setSelectedInstructor(null);
                  }}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, fontSize: "0.82rem" }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH ADMIN */}
      {/* ============================================================== */}
      {showAddAdminModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
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
              Tambah Akun Admin / Staff Baru
            </h3>
            <form onSubmit={handleAddAdmin} style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.82rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Nama Lengkap &amp; Gelar</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Andi Susanto, S.Kom."
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Alamat Email</label>
                <input
                  type="email"
                  required
                  placeholder="andi.admin@anvieo.ac.id"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Role Hak Akses</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                >
                  <option value="administrator">Super Administrator</option>
                  <option value="administrasi">Staf Administrasi &amp; Kasir</option>
                  <option value="reviewer">Reviewer Tugas &amp; Evaluator</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700 }}
                >
                  Simpan Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH / UNDANG INSTRUCTOR */}
      {/* ============================================================== */}
      {showAddInstructorModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
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
              Undang Instruktur Baru
            </h3>
            <form onSubmit={handleAddInstructor} style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.82rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Nama Instruktur</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Denny Wahyudi, M.Sc."
                  value={newInsName}
                  onChange={(e) => setNewInsName(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Email Undangan</label>
                <input
                  type="email"
                  required
                  placeholder="denny@instructor.id"
                  value={newInsEmail}
                  onChange={(e) => setNewInsEmail(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Bidang Keahlian</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Cloud DevOps & AWS Solution Architect"
                  value={newInsField}
                  onChange={(e) => setNewInsField(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Persentase Komisi (%)</label>
                <input
                  type="number"
                  min={10}
                  max={90}
                  value={newInsCommission}
                  onChange={(e) => setNewInsCommission(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddInstructorModal(false)}
                  style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "var(--gold)", color: "#ffffff", fontWeight: 700 }}
                >
                  Kirim Undangan Instruktur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
