"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";
import { LmsHiringPartner, LmsJobApplicant } from "../types/simak";
import {
  MOCK_HIRING_PARTNERS,
  MOCK_JOB_APPLICANTS,
} from "../data/simakMockData";

export interface JobOpening {
  id: string;
  roleTitle: string;
  companyName: string;
  companyLogo: string;
  type: "Full-Time" | "Internship" | "Contract" | "Freelance";
  location: string;
  workModel: "Remote" | "Hybrid" | "On-Site";
  salaryRange: string;
  applicantsCount: number;
  minGpa: number;
  trackPreference: string;
  postedDate: string;
  status: "Aktif Rekrutmen" | "Review Berkas" | "Ditutup";
}

const INITIAL_JOBS: JobOpening[] = [
  {
    id: "job-01",
    roleTitle: "Lead AI & Autonomous Agent Engineer",
    companyName: "PT Pixel Perdana Jaya",
    companyLogo: "/jobs/job-1.jpg",
    type: "Full-Time",
    location: "Jakarta Selatan",
    workModel: "Hybrid",
    salaryRange: "Rp 18.000.000 - Rp 28.000.000",
    applicantsCount: 38,
    minGpa: 3.5,
    trackPreference: "Artificial Intelligence & LLM Engineer",
    postedDate: "2 hari lalu",
    status: "Aktif Rekrutmen",
  },
  {
    id: "job-02",
    roleTitle: "Senior Cloud & DevOps Infrastructure Architect",
    companyName: "Anvieo Cloud Enterprise",
    companyLogo: "/jobs/job-2.jpg",
    type: "Full-Time",
    location: "Bandung",
    workModel: "Remote",
    salaryRange: "Rp 16.000.000 - Rp 25.000.000",
    applicantsCount: 24,
    minGpa: 3.4,
    trackPreference: "Cloud Infrastructure & DevOps",
    postedDate: "3 hari lalu",
    status: "Aktif Rekrutmen",
  },
  {
    id: "job-03",
    roleTitle: "Fullstack Next.js 16 & TypeScript Developer",
    companyName: "Bank Neo Finansial Digital",
    companyLogo: "/jobs/job-3.jpg",
    type: "Full-Time",
    location: "Jakarta Pusat",
    workModel: "Hybrid",
    salaryRange: "Rp 12.000.000 - Rp 20.000.000",
    applicantsCount: 52,
    minGpa: 3.25,
    trackPreference: "Fullstack Web & AI Architecture",
    postedDate: "Hari ini",
    status: "Aktif Rekrutmen",
  },
  {
    id: "job-04",
    roleTitle: "AI Research & MLOps Intern (Fast-Track)",
    companyName: "PT Pixel Perdana Jaya",
    companyLogo: "/jobs/job-1.jpg",
    type: "Internship",
    location: "Jakarta",
    workModel: "Remote",
    salaryRange: "Rp 6.000.000 / bln",
    applicantsCount: 84,
    minGpa: 3.6,
    trackPreference: "MLOps & Autonomous Agent Deployment",
    postedDate: "Kemarin",
    status: "Review Berkas",
  },
  {
    id: "job-05",
    roleTitle: "Cybersecurity Analyst & Penetration Tester",
    companyName: "SecureVault Technologies",
    companyLogo: "/jobs/job-2.jpg",
    type: "Full-Time",
    location: "Surabaya",
    workModel: "On-Site",
    salaryRange: "Rp 14.000.000 - Rp 22.000.000",
    applicantsCount: 19,
    minGpa: 3.3,
    trackPreference: "Cybersecurity & Secure Coding",
    postedDate: "5 hari lalu",
    status: "Aktif Rekrutmen",
  },
];

type JobTab = "lowongan" | "pelamar" | "mitra";

export default function SimakJobsView() {
  const [activeTab, setActiveTab] = useState<JobTab>("lowongan");

  // State
  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOBS);
  const [applicants, setApplicants] = useState<LmsJobApplicant[]>(MOCK_JOB_APPLICANTS);
  const [partners, setPartners] = useState<LmsHiringPartner[]>(MOCK_HIRING_PARTNERS);

  // Filters
  const [jobSearch, setJobSearch] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [applicantFilterStage, setApplicantFilterStage] = useState("all");
  const [applicantFilterJob, setApplicantFilterJob] = useState("all");

  // Modals
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<LmsJobApplicant | null>(null);
  const [applicantNotesInput, setApplicantNotesInput] = useState("");

  // Job Form States
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState(partners[0]?.name || "");
  const [newType, setNewType] = useState<JobOpening["type"]>("Full-Time");
  const [newWorkModel, setNewWorkModel] = useState<JobOpening["workModel"]>("Hybrid");
  const [newLocation, setNewLocation] = useState("Jakarta");
  const [newSalary, setNewSalary] = useState("Rp 15.000.000 - Rp 22.000.000");
  const [newMinGpa, setNewMinGpa] = useState(3.25);
  const [newTrack, setNewTrack] = useState("Fullstack Web & AI Architecture");

  // Partner Form States
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerIndustry, setNewPartnerIndustry] = useState("Fintech & AI");
  const [newPartnerWebsite, setNewPartnerWebsite] = useState("https://");
  const [newPartnerContact, setNewPartnerContact] = useState("");

  // Handlers - Jobs
  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;
    const newJ: JobOpening = {
      id: `job-${Date.now()}`,
      roleTitle: newTitle,
      companyName: newCompany,
      companyLogo: "/jobs/job-1.jpg",
      type: newType,
      location: newLocation,
      workModel: newWorkModel,
      salaryRange: newSalary,
      applicantsCount: 0,
      minGpa: Number(newMinGpa),
      trackPreference: newTrack,
      postedDate: "Hari ini",
      status: "Aktif Rekrutmen",
    };
    setJobs([newJ, ...jobs]);
    setNewTitle("");
    setShowAddJobModal(false);
  };

  const handleDeleteJob = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus lowongan karir ini?")) {
      setJobs(jobs.filter((j) => j.id !== id));
    }
  };

  const handleToggleJobStatus = (id: string) => {
    setJobs(
      jobs.map((j) => {
        if (j.id !== id) return j;
        const nextStatus = j.status === "Aktif Rekrutmen" ? "Ditutup" : "Aktif Rekrutmen";
        return { ...j, status: nextStatus };
      })
    );
  };

  // Handlers - Applicants
  const handleUpdateApplicantStage = (applicantId: string, newStage: LmsJobApplicant["status"]) => {
    setApplicants(
      applicants.map((a) => (a.id === applicantId ? { ...a, status: newStage } : a))
    );
  };

  const handleOpenNotes = (applicant: LmsJobApplicant) => {
    setSelectedApplicant(applicant);
    setApplicantNotesInput(applicant.notes || "");
  };

  const handleSaveNotes = () => {
    if (!selectedApplicant) return;
    setApplicants(
      applicants.map((a) =>
        a.id === selectedApplicant.id ? { ...a, notes: applicantNotesInput } : a
      )
    );
    setSelectedApplicant(null);
  };

  const handleDeleteApplicant = (id: string) => {
    if (confirm("Hapus berkas pelamar ini dari pipeline rekrutmen?")) {
      setApplicants(applicants.filter((a) => a.id !== id));
    }
  };

  // Handlers - Partners
  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName) return;
    const newP: LmsHiringPartner = {
      id: `prt-${Date.now()}`,
      name: newPartnerName,
      logo: "/jobs/job-1.jpg",
      industry: newPartnerIndustry,
      website: newPartnerWebsite,
      contactPerson: newPartnerContact || "HR Tech Recruiter",
      activeJobsCount: 0,
    };
    setPartners([...partners, newP]);
    setNewPartnerName("");
    setNewPartnerWebsite("https://");
    setNewPartnerContact("");
    setShowAddPartnerModal(false);
  };

  const handleDeletePartner = (id: string) => {
    if (confirm("Hapus data mitra perusahaan hiring partner ini?")) {
      setPartners(partners.filter((p) => p.id !== id));
    }
  };

  // Filtered Lists
  const filteredJobs = jobs.filter((j) => {
    if (jobTypeFilter !== "all" && j.type !== jobTypeFilter) return false;
    if (!jobSearch) return true;
    const q = jobSearch.toLowerCase();
    return (
      j.roleTitle.toLowerCase().includes(q) ||
      j.companyName.toLowerCase().includes(q) ||
      j.trackPreference.toLowerCase().includes(q)
    );
  });

  const filteredApplicants = applicants.filter((a) => {
    if (applicantFilterStage !== "all" && a.status !== applicantFilterStage) return false;
    if (applicantFilterJob !== "all" && a.jobId !== applicantFilterJob) return false;
    return true;
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
              Career &amp; Talent Hub
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Penyaluran Kerja Lulusan &amp; Mitra Industri
            </span>
          </div>
          <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-heading)", margin: "4px 0 1px", color: "var(--brand)" }}>
            Bursa Karir &amp; Pipeline Rekrutmen Mahasiswa
          </h2>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
            Kelola katalog lowongan kerja, tracking status pelamar mahasiswa berdasar IPK &amp; portfolio, serta direktori mitra industri.
          </p>
        </div>

        {/* Tab Switcher & Action */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              background: "var(--bx-bg-alt, #f4f6f8)",
              padding: "3px",
              borderRadius: "6px",
              border: "1px solid var(--bx-border)",
              gap: "4px",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("lowongan")}
              style={{
                padding: "5px 12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: activeTab === "lowongan" ? "var(--brand)" : "transparent",
                color: activeTab === "lowongan" ? "#ffffff" : "var(--ink)",
              }}
            >
              Lowongan Karir ({jobs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pelamar")}
              style={{
                padding: "5px 12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: activeTab === "pelamar" ? "var(--brand)" : "transparent",
                color: activeTab === "pelamar" ? "#ffffff" : "var(--ink)",
              }}
            >
              Pipeline Pelamar ({applicants.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mitra")}
              style={{
                padding: "5px 12px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: activeTab === "mitra" ? "var(--brand)" : "transparent",
                color: activeTab === "mitra" ? "#ffffff" : "var(--ink)",
              }}
            >
              Mitra Perusahaan ({partners.length})
            </button>
          </div>

          {activeTab === "lowongan" && (
            <button
              type="button"
              onClick={() => setShowAddJobModal(true)}
              className="portal-btn-primary"
              style={{ padding: "6px 14px", fontSize: "0.75rem", fontWeight: 700, borderRadius: "5px" }}
            >
              Tambah Lowongan
            </button>
          )}

          {activeTab === "mitra" && (
            <button
              type="button"
              onClick={() => setShowAddPartnerModal(true)}
              className="portal-btn-primary"
              style={{ padding: "6px 14px", fontSize: "0.75rem", fontWeight: 700, borderRadius: "5px" }}
            >
              Tambah Mitra Perusahaan
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: LOWONGAN KARIR */}
      {activeTab === "lowongan" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Controls Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              padding: "10px 14px",
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder="Cari lowongan, perusahaan, track..."
                  style={{
                    padding: "6px 10px 6px 28px",
                    fontSize: "0.76rem",
                    borderRadius: "5px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-bg-alt)",
                    color: "var(--ink)",
                    width: "220px",
                  }}
                />
                <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>
                  <FlatIcon type="search" size={13} />
                </span>
              </div>

              <div style={{ display: "flex", gap: "4px" }}>
                {[
                  { id: "all", label: "Semua" },
                  { id: "Full-Time", label: "Full-Time" },
                  { id: "Internship", label: "Magang" },
                  { id: "Contract", label: "Kontrak" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setJobTypeFilter(t.id)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "0.72rem",
                      fontWeight: jobTypeFilter === t.id ? 700 : 500,
                      borderRadius: "5px",
                      border: jobTypeFilter === t.id ? "1px solid var(--gold)" : "1px solid var(--bx-border)",
                      background: jobTypeFilter === t.id ? "var(--bx-bg-alt)" : "transparent",
                      color: jobTypeFilter === t.id ? "var(--brand)" : "var(--muted)",
                      cursor: "pointer",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Menampilkan <strong>{filteredJobs.length}</strong> posisi lowongan
            </div>
          </div>

          {/* Jobs Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "12px",
            }}
          >
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                style={{
                  background: "var(--bx-surface, #FFFFFF)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "8px",
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  boxShadow: "0 1px 3px rgba(10, 46, 82, 0.04)",
                }}
              >
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover", border: "1px solid var(--bx-border)" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--gold-2)" }}>
                        {job.companyName}
                      </span>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "3px",
                          background: job.type === "Full-Time" ? "#DC2626" : "var(--brand)",
                          color: "#ffffff",
                        }}
                      >
                        {job.type}
                      </span>
                    </div>
                    <h3 style={{ margin: "3px 0 0", fontSize: "0.92rem", fontFamily: "var(--font-heading)", color: "var(--brand)", lineHeight: "1.3" }}>
                      {job.roleTitle}
                    </h3>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                    padding: "8px 0",
                    borderTop: "1px solid var(--bx-border)",
                    borderBottom: "1px solid var(--bx-border)",
                    fontSize: "0.74rem",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--muted)" }}>Lokasi: </span>
                    <strong>{job.location} ({job.workModel})</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Min. IPK: </span>
                    <strong style={{ color: "var(--gold-2)" }}>≥ {job.minGpa}</strong>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <span style={{ color: "var(--muted)" }}>Gaji: </span>
                    <strong style={{ color: "#16A34A" }}>{job.salaryRange}</strong>
                  </div>
                </div>

                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                  Track: <strong>{job.trackPreference}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => handleToggleJobStatus(job.id)}
                      style={{
                        padding: "2px 8px",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        borderRadius: "12px",
                        border: "none",
                        cursor: "pointer",
                        background: job.status === "Aktif Rekrutmen" ? "#DCFCE7" : "#FEE2E2",
                        color: job.status === "Aktif Rekrutmen" ? "#166534" : "#991B1B",
                      }}
                    >
                      ● {job.status}
                    </button>
                    <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                      <strong>{job.applicantsCount}</strong> pelamar
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setApplicantFilterJob(job.id);
                        setActiveTab("pelamar");
                      }}
                      className="portal-btn-primary"
                      style={{ padding: "4px 8px", fontSize: "0.7rem", fontWeight: 700, borderRadius: "4px" }}
                    >
                      Pipeline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteJob(job.id)}
                      title="Hapus Lowongan"
                      style={{
                        padding: "4px 8px",
                        fontSize: "0.7rem",
                        color: "#DC2626",
                        background: "transparent",
                        border: "1px solid #FCA5A5",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PIPELINE PELAMAR */}
      {activeTab === "pelamar" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Filter Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              padding: "10px 14px",
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--brand)" }}>Filter Posisi:</span>
              <select
                value={applicantFilterJob}
                onChange={(e) => setApplicantFilterJob(e.target.value)}
                style={{
                  padding: "5px 8px",
                  fontSize: "0.74rem",
                  borderRadius: "5px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-bg-alt)",
                }}
              >
                <option value="all">Semua Posisi Lowongan</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.roleTitle} ({j.companyName})</option>
                ))}
              </select>

              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--brand)", marginLeft: "8px" }}>Tahapan:</span>
              <div style={{ display: "flex", gap: "4px" }}>
                {[
                  { id: "all", label: "Semua" },
                  { id: "applied", label: "Applied" },
                  { id: "screening", label: "Screening" },
                  { id: "interview", label: "Interview" },
                  { id: "offered", label: "Offered" },
                  { id: "hired", label: "Hired" },
                  { id: "rejected", label: "Rejected" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setApplicantFilterStage(s.id)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "0.7rem",
                      fontWeight: applicantFilterStage === s.id ? 700 : 500,
                      borderRadius: "4px",
                      border: applicantFilterStage === s.id ? "1px solid var(--gold)" : "1px solid var(--bx-border)",
                      background: applicantFilterStage === s.id ? "var(--bx-bg-alt)" : "transparent",
                      color: applicantFilterStage === s.id ? "var(--brand)" : "var(--muted)",
                      cursor: "pointer",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Total <strong>{filteredApplicants.length}</strong> berkas pelamar
            </div>
          </div>

          {/* Applicants Table */}
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.76rem" }}>
              <thead>
                <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left", color: "var(--muted)" }}>
                  <th style={{ padding: "10px 14px" }}>Mahasiswa Pelamar</th>
                  <th style={{ padding: "10px 14px" }}>Posisi Lowongan</th>
                  <th style={{ padding: "10px 14px" }}>Tanggal Lamar</th>
                  <th style={{ padding: "10px 14px" }}>Berkas &amp; Portfolio</th>
                  <th style={{ padding: "10px 14px" }}>Status Tahapan</th>
                  <th style={{ padding: "10px 14px" }}>Catatan Asesor</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>
                      Tidak ada pelamar yang cocok dengan kriteria filter saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map((app) => (
                    <tr key={app.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <img
                            src={app.studentAvatar}
                            alt={app.studentName}
                            style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <strong style={{ color: "var(--brand)", display: "block" }}>{app.studentName}</strong>
                            <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>{app.studentEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <strong style={{ color: "var(--ink)" }}>{app.jobTitle}</strong>
                      </td>
                      <td style={{ padding: "10px 14px", color: "var(--muted)" }}>
                        {app.appliedDate}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: "3px 7px",
                              fontSize: "0.68rem",
                              borderRadius: "4px",
                              background: "#EFF6FF",
                              color: "#1D4ED8",
                              textDecoration: "none",
                              fontWeight: 600,
                              border: "1px solid #BFDBFE",
                            }}
                          >
                            📄 CV PDF
                          </a>
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: "3px 7px",
                              fontSize: "0.68rem",
                              borderRadius: "4px",
                              background: "#F3F4F6",
                              color: "#374151",
                              textDecoration: "none",
                              fontWeight: 600,
                              border: "1px solid #D1D5DB",
                            }}
                          >
                            🔗 GitHub Repo
                          </a>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateApplicantStage(app.id, e.target.value as LmsJobApplicant["status"])}
                          style={{
                            padding: "4px 8px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            borderRadius: "4px",
                            border: "1px solid var(--bx-border)",
                            background:
                              app.status === "hired" ? "#DCFCE7" :
                              app.status === "offered" ? "#FEF3C7" :
                              app.status === "interview" ? "#E0E7FF" :
                              app.status === "screening" ? "#F3E8FF" :
                              app.status === "rejected" ? "#FEE2E2" : "#F3F4F6",
                            color:
                              app.status === "hired" ? "#166534" :
                              app.status === "offered" ? "#92400E" :
                              app.status === "interview" ? "#3730A3" :
                              app.status === "screening" ? "#6B21A8" :
                              app.status === "rejected" ? "#991B1B" : "#374151",
                          }}
                        >
                          <option value="applied">Applied (Baru)</option>
                          <option value="screening">Screening</option>
                          <option value="interview">Interview</option>
                          <option value="offered">Offered</option>
                          <option value="hired">Hired (Diterima)</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td style={{ padding: "10px 14px", maxWidth: "200px" }}>
                        <span style={{ fontSize: "0.7rem", color: app.notes ? "var(--ink)" : "var(--muted)", fontStyle: app.notes ? "normal" : "italic" }}>
                          {app.notes || "Belum ada catatan internal."}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "4px" }}>
                          <button
                            type="button"
                            onClick={() => handleOpenNotes(app)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "0.68rem",
                              borderRadius: "4px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-bg-alt)",
                              color: "var(--brand)",
                              cursor: "pointer",
                            }}
                          >
                            Catatan
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteApplicant(app.id)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "0.68rem",
                              borderRadius: "4px",
                              border: "1px solid #FCA5A5",
                              background: "transparent",
                              color: "#DC2626",
                              cursor: "pointer",
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MITRA PERUSAHAAN (HIRING PARTNER) */}
      {activeTab === "mitra" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "12px",
            }}
          >
            {partners.map((partner) => (
              <div
                key={partner.id}
                style={{
                  background: "var(--bx-surface, #FFFFFF)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  boxShadow: "0 1px 3px rgba(10, 46, 82, 0.04)",
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={{ width: "46px", height: "46px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--bx-border)" }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: "0.96rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                      {partner.name}
                    </h3>
                    <span style={{ fontSize: "0.72rem", color: "var(--gold-2)", fontWeight: 600 }}>
                      {partner.industry}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: "0.74rem", borderTop: "1px solid var(--bx-border)", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Website: </span>
                    <a href={partner.website} target="_blank" rel="noreferrer" style={{ color: "var(--brand)", textDecoration: "none" }}>
                      {partner.website}
                    </a>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>PIC Rekrutmen: </span>
                    <strong>{partner.contactPerson}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Lowongan Aktif: </span>
                    <strong style={{ color: "#16A34A" }}>{partner.activeJobsCount} posisi</strong>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", paddingTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setJobSearch(partner.name);
                      setActiveTab("lowongan");
                    }}
                    style={{
                      padding: "4px 8px",
                      fontSize: "0.7rem",
                      borderRadius: "4px",
                      border: "1px solid var(--bx-border)",
                      background: "var(--bx-bg-alt)",
                      color: "var(--brand)",
                      cursor: "pointer",
                    }}
                  >
                    Lihat Lowongan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePartner(partner.id)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "0.7rem",
                      borderRadius: "4px",
                      border: "1px solid #FCA5A5",
                      background: "transparent",
                      color: "#DC2626",
                      cursor: "pointer",
                    }}
                  >
                    Hapus Mitra
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH LOWONGAN */}
      {showAddJobModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.4)",
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
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "20px",
              width: "100%",
              maxWidth: "520px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontSize: "1.1rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Tambah Lowongan Pekerjaan Baru
            </h3>
            <form onSubmit={handleAddJob} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Posisi / Judul Role</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Mis: Senior Backend Engineer"
                  style={{ width: "100%", padding: "7px 10px", fontSize: "0.78rem", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Perusahaan Mitra</label>
                  <select
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", fontSize: "0.78rem", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  >
                    {partners.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Tipe Pekerjaan</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as JobOpening["type"])}
                    style={{ width: "100%", padding: "7px 10px", fontSize: "0.78rem", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship (Magang)</option>
                    <option value="Contract">Kontrak</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Model Kerja</label>
                  <select
                    value={newWorkModel}
                    onChange={(e) => setNewWorkModel(e.target.value as JobOpening["workModel"])}
                    style={{ width: "100%", padding: "7px 10px", fontSize: "0.78rem", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-Site">On-Site</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Lokasi</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", fontSize: "0.78rem", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Range Gaji</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", fontSize: "0.78rem", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Min. IPK</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newMinGpa}
                    onChange={(e) => setNewMinGpa(Number(e.target.value))}
                    style={{ width: "100%", padding: "7px 10px", fontSize: "0.78rem", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Kesesuaian Track Kompetensi</label>
                <input
                  type="text"
                  value={newTrack}
                  onChange={(e) => setNewTrack(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", fontSize: "0.78rem", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  style={{ padding: "6px 12px", fontSize: "0.75rem", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "transparent" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="portal-btn-primary"
                  style={{ padding: "6px 16px", fontSize: "0.75rem", fontWeight: 700, borderRadius: "4px" }}
                >
                  Simpan Lowongan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH MITRA PERUSAHAAN */}
      {showAddPartnerModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.4)",
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
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "20px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontSize: "1.1rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Tambah Mitra Industri Baru
            </h3>
            <form onSubmit={handleAddPartner} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Nama Perusahaan</label>
                <input
                  type="text"
                  required
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  placeholder="Mis: PT Fintek Nusantara Jaya"
                  style={{ width: "100%", padding: "7px 10px", fontSize: "0.78rem", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Sektor Industri</label>
                <input
                  type="text"
                  required
                  value={newPartnerIndustry}
                  onChange={(e) => setNewPartnerIndustry(e.target.value)}
                  placeholder="Mis: Cloud SaaS & Big Data"
                  style={{ width: "100%", padding: "7px 10px", fontSize: "0.78rem", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Website Resmi</label>
                <input
                  type="url"
                  value={newPartnerWebsite}
                  onChange={(e) => setNewPartnerWebsite(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", fontSize: "0.78rem", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Kontak PIC / Talent Lead</label>
                <input
                  type="text"
                  value={newPartnerContact}
                  onChange={(e) => setNewPartnerContact(e.target.value)}
                  placeholder="Nama PIC (Jabatan)"
                  style={{ width: "100%", padding: "7px 10px", fontSize: "0.78rem", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddPartnerModal(false)}
                  style={{ padding: "6px 12px", fontSize: "0.75rem", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "transparent" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="portal-btn-primary"
                  style={{ padding: "6px 16px", fontSize: "0.75rem", fontWeight: 700, borderRadius: "4px" }}
                >
                  Simpan Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CATATAN REKRUITER */}
      {selectedApplicant && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.4)",
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
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "20px",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ margin: "0 0 6px", fontSize: "1.05rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Catatan Asesor / Recruiter
            </h3>
            <p style={{ margin: "0 0 12px", fontSize: "0.74rem", color: "var(--muted)" }}>
              Pelamar: <strong>{selectedApplicant.studentName}</strong> ({selectedApplicant.jobTitle})
            </p>
            <textarea
              rows={4}
              value={applicantNotesInput}
              onChange={(e) => setApplicantNotesInput(e.target.value)}
              placeholder="Tuliskan catatan teknis hasil wawancara, kelebihan portofolio, atau pertimbangan gaji..."
              style={{
                width: "100%",
                padding: "8px 10px",
                fontSize: "0.76rem",
                borderRadius: "5px",
                border: "1px solid var(--bx-border)",
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                style={{ padding: "6px 12px", fontSize: "0.74rem", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "transparent" }}
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="portal-btn-primary"
                style={{ padding: "6px 16px", fontSize: "0.74rem", fontWeight: 700, borderRadius: "4px" }}
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
