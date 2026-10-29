"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";

interface PermissionRow {
  id: string;
  module: string;
  admin: boolean;
  baak: boolean;
  dosen: boolean;
  reviewer: boolean;
  mahasiswa: boolean;
}

const INITIAL_PERMISSIONS: PermissionRow[] = [
  {
    id: "perm-1",
    module: "Akses Dashboard SIMAK & Metrik Real-time",
    admin: true,
    baak: true,
    dosen: true,
    reviewer: true,
    mahasiswa: false,
  },
  {
    id: "perm-2",
    module: "Manajemen Kurikulum, Silabus & RPS",
    admin: true,
    baak: true,
    dosen: true,
    reviewer: false,
    mahasiswa: false,
  },
  {
    id: "perm-3",
    module: "Jadwal Perkuliahan & Alokasi Ruang Lab",
    admin: true,
    baak: true,
    dosen: false,
    reviewer: false,
    mahasiswa: false,
  },
  {
    id: "perm-4",
    module: "Input & Validasi Presensi Kelas",
    admin: true,
    baak: true,
    dosen: true,
    reviewer: false,
    mahasiswa: false,
  },
  {
    id: "perm-5",
    module: "Evaluasi & Penilaian Submission Tugas (SLA)",
    admin: true,
    baak: false,
    dosen: true,
    reviewer: true,
    mahasiswa: false,
  },
  {
    id: "perm-6",
    module: "Buku Nilai, Transkrip & Yudisium",
    admin: true,
    baak: true,
    dosen: true,
    reviewer: false,
    mahasiswa: false,
  },
  {
    id: "perm-7",
    module: "User Management (Buat Akun Pegawai / Dosen)",
    admin: true,
    baak: true,
    dosen: false,
    reviewer: false,
    mahasiswa: false,
  },
  {
    id: "perm-8",
    module: "Pengaturan Sistem, Kuota Kelas & Batas SLA",
    admin: true,
    baak: false,
    dosen: false,
    reviewer: false,
    mahasiswa: false,
  },
];

export default function SimakRoleManagementView() {
  const [permissions, setPermissions] = useState<PermissionRow[]>(INITIAL_PERMISSIONS);
  const [saved, setSaved] = useState(false);

  const togglePerm = (rowId: string, roleKey: "admin" | "baak" | "dosen" | "reviewer" | "mahasiswa") => {
    setPermissions((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [roleKey]: !r[roleKey] } : r))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          padding: "12px 16px",
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "8px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "0.68rem",
                padding: "2px 6px",
                borderRadius: "4px",
                background: "var(--brand)",
                color: "#ffffff",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Tata Kelola RBAC
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Role-Based Access Control
            </span>
          </div>
          <h2
            style={{
              fontSize: "1.15rem",
              fontFamily: "var(--font-heading)",
              margin: "3px 0 1px",
              color: "var(--brand, #0A2E52)",
            }}
          >
            Matriks Peran &amp; Hak Akses SIMAK
          </h2>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="portal-btn-primary"
          style={{ padding: "8px 16px", fontSize: "0.82rem" }}
        >
          {saved ? "Berhasil Disimpan" : "Simpan Matriks Izin"}
        </button>
      </div>

      {saved && (
        <div
          style={{
            padding: "8px 14px",
            background: "#D1FAE5",
            color: "#065F46",
            borderRadius: "6px",
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          Perubahan hak akses peran telah berhasil diperbarui di seluruh ekosistem SIMAK.
        </div>
      )}

      {/* Matrix Table */}
      <div
        style={{
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "8px",
          padding: "16px",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--bx-border)", textAlign: "left", background: "var(--bx-bg-alt)" }}>
              <th style={{ padding: "10px 12px", color: "var(--muted)", fontWeight: 700 }}>Modul / Fitur Sistem</th>
              <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--muted)", fontWeight: 700 }}>Administrator</th>
              <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--muted)", fontWeight: 700 }}>BAAK / Staf</th>
              <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--muted)", fontWeight: 700 }}>Dosen Pengampu</th>
              <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--muted)", fontWeight: 700 }}>Reviewer Kode</th>
              <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--muted)", fontWeight: 700 }}>Mahasiswa</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm) => (
              <tr key={perm.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--ink)" }}>
                  {perm.module}
                </td>

                {/* Admin */}
                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => togglePerm(perm.id, "admin")}
                    style={{
                      background: perm.admin ? "#D1FAE5" : "var(--bx-bg-alt)",
                      color: perm.admin ? "#065F46" : "var(--muted)",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {perm.admin ? "Aktif" : "—"}
                  </button>
                </td>

                {/* BAAK */}
                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => togglePerm(perm.id, "baak")}
                    style={{
                      background: perm.baak ? "#D1FAE5" : "var(--bx-bg-alt)",
                      color: perm.baak ? "#065F46" : "var(--muted)",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {perm.baak ? "Aktif" : "—"}
                  </button>
                </td>

                {/* Dosen */}
                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => togglePerm(perm.id, "dosen")}
                    style={{
                      background: perm.dosen ? "#D1FAE5" : "var(--bx-bg-alt)",
                      color: perm.dosen ? "#065F46" : "var(--muted)",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {perm.dosen ? "Aktif" : "—"}
                  </button>
                </td>

                {/* Reviewer */}
                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => togglePerm(perm.id, "reviewer")}
                    style={{
                      background: perm.reviewer ? "#D1FAE5" : "var(--bx-bg-alt)",
                      color: perm.reviewer ? "#065F46" : "var(--muted)",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {perm.reviewer ? "Aktif" : "—"}
                  </button>
                </td>

                {/* Mahasiswa */}
                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => togglePerm(perm.id, "mahasiswa")}
                    style={{
                      background: perm.mahasiswa ? "#D1FAE5" : "var(--bx-bg-alt)",
                      color: perm.mahasiswa ? "#065F46" : "var(--muted)",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {perm.mahasiswa ? "Aktif" : "—"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
