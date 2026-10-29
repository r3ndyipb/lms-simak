"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";

export interface StudentGradingRecord {
  id: string;
  nim: string;
  name: string;
  email: string;
  avatar: string;
  learningPathId: string;
  learningPathCode: string;
  learningPathTitle: string;

  // Nilai & Rating Akademik
  gpa: number; // Skala 4.00
  overallScore: number; // 0 - 100
  letterGrade: "A+" | "A" | "A-" | "B+" | "B" | "C";
  tasksScore: number; // Rata-rata tugas submission (40%)
  quizScore: number; // Rata-rata kuis assessment (30%)
  capstoneScore: number; // Proyek akhir / Capstone (30%)
  peerRating: number; // Rating evaluator (1.0 - 5.0)
  completionPercent: number; // Persentase kelulusan materi (%)

  // Status Karir & Pekerjaan
  employmentStatus: "Sudah Bekerja" | "Belum Bekerja" | "Sedang Magang";
  companyName?: string;
  jobRole?: string;
  hiredDate?: string;
  salaryRange?: string;
  hiringPartnerVerified: boolean;

  // Portofolio & Kredensial
  portfolioUrl?: string;
  certificateSerialNumber?: string;
}

export const AVAILABLE_LEARNING_PATHS = [
  {
    id: "lp-01",
    code: "TRACK-AI-01",
    title: "Artificial Intelligence & LLM Engineer",
    category: "AI & Data",
  },
  {
    id: "lp-02",
    code: "TRACK-FS-02",
    title: "Fullstack Web & Cloud Architecture",
    category: "Web & Mobile",
  },
  {
    id: "lp-03",
    code: "TRACK-UX-03",
    title: "Product Designer & UI/UX Specialist",
    category: "UI/UX Design",
  },
  {
    id: "lp-04",
    code: "TRACK-CLOUD-04",
    title: "Cloud-Native Infrastructure & Kubernetes",
    category: "Cloud & DevOps",
  },
  {
    id: "lp-05",
    code: "TRACK-SEC-05",
    title: "Cyber Security & Smart Contract Audit",
    category: "Cyber Security",
  },
];

const INITIAL_STUDENT_RECORDS: StudentGradingRecord[] = [
  {
    id: "std-01",
    nim: "202610014",
    name: "Muhammad Farhan",
    email: "farhan.mhs@anvieo.ac.id",
    avatar: "/alumni/alumni_1.jpg",
    learningPathId: "lp-01",
    learningPathCode: "TRACK-AI-01",
    learningPathTitle: "Artificial Intelligence & LLM Engineer",
    gpa: 3.98,
    overallScore: 98.2,
    letterGrade: "A+",
    tasksScore: 98,
    quizScore: 100,
    capstoneScore: 96,
    peerRating: 4.98,
    completionPercent: 100,
    employmentStatus: "Sudah Bekerja",
    companyName: "PT Pixel Perdana Jaya",
    jobRole: "Lead AI & Autonomous Agent Engineer",
    hiredDate: "Oktober 2026",
    salaryRange: "Rp 18.000.000 - 22.000.000",
    hiringPartnerVerified: true,
    portfolioUrl: "https://github.com/anvieo-student/kafka-sharding-task4",
    certificateSerialNumber: "AUI-2026-AI-00192",
  },
  {
    id: "std-02",
    nim: "202610028",
    name: "Aditya Pratama",
    email: "aditya.pratama@outlook.com",
    avatar: "/alumni/alumni_3.jpg",
    learningPathId: "lp-02",
    learningPathCode: "TRACK-FS-02",
    learningPathTitle: "Fullstack Web & Cloud Architecture",
    gpa: 3.92,
    overallScore: 96.8,
    letterGrade: "A+",
    tasksScore: 96,
    quizScore: 100,
    capstoneScore: 94,
    peerRating: 4.95,
    completionPercent: 100,
    employmentStatus: "Sudah Bekerja",
    companyName: "GoTo Financial / Midtrans",
    jobRole: "Senior Distributed Backend Engineer",
    hiredDate: "September 2026",
    salaryRange: "Rp 16.000.000 - 20.000.000",
    hiringPartnerVerified: true,
    portfolioUrl: "https://github.com/aditya/local-rag-device",
    certificateSerialNumber: "AUI-2026-FS-00214",
  },
  {
    id: "std-03",
    nim: "202610045",
    name: "Nadia Safitri",
    email: "nadia.safitri@anvieo.ac.id",
    avatar: "/alumni/alumni_2.jpg",
    learningPathId: "lp-03",
    learningPathCode: "TRACK-UX-03",
    learningPathTitle: "Product Designer & UI/UX Specialist",
    gpa: 3.94,
    overallScore: 95.5,
    letterGrade: "A",
    tasksScore: 95,
    quizScore: 95,
    capstoneScore: 97,
    peerRating: 4.92,
    completionPercent: 100,
    employmentStatus: "Sudah Bekerja",
    companyName: "Bukalapak Enterprise",
    jobRole: "Product Design System Specialist",
    hiredDate: "Agustus 2026",
    salaryRange: "Rp 14.000.000 - 18.000.000",
    hiringPartnerVerified: true,
    portfolioUrl: "https://figma.com/@nadiadesign",
    certificateSerialNumber: "AUI-2026-UX-00108",
  },
  {
    id: "std-04",
    nim: "202610195",
    name: "Fariz Alkatiri",
    email: "fariz.sec@anvieo.ac.id",
    avatar: "/alumni/alumni_4.jpg",
    learningPathId: "lp-05",
    learningPathCode: "TRACK-SEC-05",
    learningPathTitle: "Cyber Security & Smart Contract Audit",
    gpa: 3.90,
    overallScore: 95.0,
    letterGrade: "A",
    tasksScore: 95,
    quizScore: 95,
    capstoneScore: 95,
    peerRating: 4.9,
    completionPercent: 100,
    employmentStatus: "Sudah Bekerja",
    companyName: "ChainAudit Security Lab",
    jobRole: "Smart Contract Vulnerability Analyst",
    hiredDate: "Agustus 2026",
    salaryRange: "Rp 15.000.000 - 19.000.000",
    hiringPartnerVerified: true,
    portfolioUrl: "https://github.com/fariz/solidity-security-audit",
    certificateSerialNumber: "AUI-2026-SEC-00045",
  },
  {
    id: "std-05",
    nim: "202610072",
    name: "Kevin Christian",
    email: "kevin.christian@gmail.com",
    avatar: "/alumni/alumni_6.jpg",
    learningPathId: "lp-04",
    learningPathCode: "TRACK-CLOUD-04",
    learningPathTitle: "Cloud-Native Infrastructure & Kubernetes",
    gpa: 3.88,
    overallScore: 94.2,
    letterGrade: "A",
    tasksScore: 94,
    quizScore: 100,
    capstoneScore: 89,
    peerRating: 4.88,
    completionPercent: 100,
    employmentStatus: "Sedang Magang",
    companyName: "Google Cloud for Education",
    jobRole: "Cloud Solutions Architect Intern",
    hiredDate: "Oktober 2026",
    salaryRange: "Rp 8.000.000 (Tunjangan Magang)",
    hiringPartnerVerified: true,
    portfolioUrl: "https://github.com/kevin/k8s-terraform-cluster",
    certificateSerialNumber: "AUI-2026-CLOUD-00088",
  },
  {
    id: "std-06",
    nim: "202610088",
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@gmail.com",
    avatar: "/alumni/alumni_2.jpg",
    learningPathId: "lp-01",
    learningPathCode: "TRACK-AI-01",
    learningPathTitle: "Artificial Intelligence & LLM Engineer",
    gpa: 3.85,
    overallScore: 93.6,
    letterGrade: "A",
    tasksScore: 92,
    quizScore: 95,
    capstoneScore: 94,
    peerRating: 4.85,
    completionPercent: 96,
    employmentStatus: "Belum Bekerja",
    jobRole: "Siap Kerja (Open for Hire) • Lulusan Terbaik AI",
    hiringPartnerVerified: false,
    portfolioUrl: "https://github.com/siti/fastmcp-ai-agent",
  },
  {
    id: "std-07",
    nim: "202610114",
    name: "Dewi Ayu Lestari",
    email: "dewi.lestari@techcorp.id",
    avatar: "/alumni/alumni_5.jpg",
    learningPathId: "lp-05",
    learningPathCode: "TRACK-SEC-05",
    learningPathTitle: "Cyber Security & Smart Contract Audit",
    gpa: 3.82,
    overallScore: 92.4,
    letterGrade: "A",
    tasksScore: 90,
    quizScore: 95,
    capstoneScore: 92,
    peerRating: 4.82,
    completionPercent: 92,
    employmentStatus: "Sudah Bekerja",
    companyName: "CyberShield Security Alliance",
    jobRole: "Junior Security Auditor",
    hiredDate: "Oktober 2026",
    salaryRange: "Rp 12.000.000 - 15.000.000",
    hiringPartnerVerified: true,
    portfolioUrl: "https://github.com/dewi/zero-trust-mesh",
    certificateSerialNumber: "AUI-2026-SEC-00078",
  },
  {
    id: "std-08",
    nim: "202610132",
    name: "Budi Santoso",
    email: "budi.santoso@yahoo.com",
    avatar: "/alumni/alumni_4.jpg",
    learningPathId: "lp-02",
    learningPathCode: "TRACK-FS-02",
    learningPathTitle: "Fullstack Web & Cloud Architecture",
    gpa: 3.65,
    overallScore: 87.5,
    letterGrade: "A-",
    tasksScore: 88,
    quizScore: 85,
    capstoneScore: 90,
    peerRating: 4.7,
    completionPercent: 90,
    employmentStatus: "Belum Bekerja",
    jobRole: "Siap Kerja (Open for Hire) • Fullstack Specialist",
    hiringPartnerVerified: false,
    portfolioUrl: "https://github.com/budi/next16-microservices",
  },
  {
    id: "std-09",
    nim: "202610156",
    name: "Gita Gutawa",
    email: "gita.gutawa@anvieo.ac.id",
    avatar: "/alumni/alumni_3.jpg",
    learningPathId: "lp-03",
    learningPathCode: "TRACK-UX-03",
    learningPathTitle: "Product Designer & UI/UX Specialist",
    gpa: 3.60,
    overallScore: 86.0,
    letterGrade: "A-",
    tasksScore: 85,
    quizScore: 88,
    capstoneScore: 85,
    peerRating: 4.65,
    completionPercent: 88,
    employmentStatus: "Sedang Magang",
    companyName: "Bank Mandiri Digital Transformation",
    jobRole: "UI/UX Researcher Intern",
    hiredDate: "September 2026",
    salaryRange: "Rp 7.500.000 (Tunjangan Magang)",
    hiringPartnerVerified: true,
    portfolioUrl: "https://behance.net/gitagutawa",
  },
  {
    id: "std-10",
    nim: "202610178",
    name: "Riko Prasetya",
    email: "riko.prasetya@gmail.com",
    avatar: "/alumni/alumni_1.jpg",
    learningPathId: "lp-04",
    learningPathCode: "TRACK-CLOUD-04",
    learningPathTitle: "Cloud-Native Infrastructure & Kubernetes",
    gpa: 3.42,
    overallScore: 81.5,
    letterGrade: "B+",
    tasksScore: 80,
    quizScore: 80,
    capstoneScore: 85,
    peerRating: 4.5,
    completionPercent: 82,
    employmentStatus: "Belum Bekerja",
    jobRole: "Siap Kerja (Open for Hire) • DevOps Engineer",
    hiringPartnerVerified: false,
    portfolioUrl: "https://github.com/riko/argocd-gitops-pipeline",
  },
];

export default function SimakGradebookView() {
  const [students, setStudents] = useState<StudentGradingRecord[]>(INITIAL_STUDENT_RECORDS);

  // Filters & Search
  const [selectedPathFilter, setSelectedPathFilter] = useState<string>("all");
  const [employmentFilter, setEmploymentFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Student Detail Drawer (Slider 95%)
  const [inspectingStudent, setInspectingStudent] = useState<StudentGradingRecord | null>(null);
  const [inspectTab, setInspectTab] = useState<"transcript" | "career" | "cert">("transcript");

  // Editable Employment Form State inside Drawer
  const [editStatus, setEditStatus] = useState<"Sudah Bekerja" | "Belum Bekerja" | "Sedang Magang">("Belum Bekerja");
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editHiredDate, setEditHiredDate] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editVerified, setEditVerified] = useState(false);

  const handleOpenStudentDrawer = (std: StudentGradingRecord) => {
    setInspectingStudent({ ...std });
    setEditStatus(std.employmentStatus);
    setEditCompany(std.companyName || "");
    setEditRole(std.jobRole || "");
    setEditHiredDate(std.hiredDate || "");
    setEditSalary(std.salaryRange || "");
    setEditVerified(std.hiringPartnerVerified || false);
    setInspectTab("transcript");
  };

  const handleSaveStudentCareer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingStudent) return;

    const updated: StudentGradingRecord = {
      ...inspectingStudent,
      employmentStatus: editStatus,
      companyName: editStatus === "Belum Bekerja" ? undefined : editCompany,
      jobRole: editRole || (editStatus === "Belum Bekerja" ? "Siap Kerja (Open for Hire)" : undefined),
      hiredDate: editStatus === "Belum Bekerja" ? undefined : editHiredDate,
      salaryRange: editStatus === "Belum Bekerja" ? undefined : editSalary,
      hiringPartnerVerified: editVerified,
    };

    setStudents(students.map((s) => (s.id === updated.id ? updated : s)));
    setInspectingStudent(updated);
    alert(`Status karir & pekerjaan mahasiswa "${updated.name}" berhasil diperbarui!`);
  };

  // Sorting: Leaderboard Peringkat Tertinggi (Overall Score > GPA > Capstone)
  const sortedStudents = [...students].sort((a, b) => {
    if (b.overallScore !== a.overallScore) return b.overallScore - a.overallScore;
    if (b.gpa !== a.gpa) return b.gpa - a.gpa;
    return b.capstoneScore - a.capstoneScore;
  });

  // Filtered List based on Learning Path & Employment Status
  const filteredStudents = sortedStudents.filter((std) => {
    if (selectedPathFilter !== "all" && std.learningPathId !== selectedPathFilter) return false;
    if (employmentFilter !== "all" && std.employmentStatus !== employmentFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      std.name.toLowerCase().includes(q) ||
      std.nim.toLowerCase().includes(q) ||
      std.learningPathTitle.toLowerCase().includes(q) ||
      (std.companyName && std.companyName.toLowerCase().includes(q)) ||
      (std.jobRole && std.jobRole.toLowerCase().includes(q))
    );
  });

  // Analytics Metrics
  const totalStudents = students.length;
  const hiredCount = students.filter((s) => s.employmentStatus === "Sudah Bekerja").length;
  const internCount = students.filter((s) => s.employmentStatus === "Sedang Magang").length;
  const openCount = students.filter((s) => s.employmentStatus === "Belum Bekerja").length;
  const avgGpa = (students.reduce((acc, s) => acc + s.gpa, 0) / totalStudents).toFixed(2);
  const avgScore = (students.reduce((acc, s) => acc + s.overallScore, 0) / totalStudents).toFixed(1);

  // Top 3 Podium Winners
  const top3Podium = filteredStudents.slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Top Header Card */}
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
              Grading &amp; Career Leaderboard
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Peringkat Tertinggi Mahasiswa &amp; Keterserapan Kerja Industri
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
            Peringkat Prestasi &amp; Status Karir Siswa
          </h2>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
            Pemeringkatan nilai tugas, kuis, proyek akhir, dan pelacakan status pekerjaan alumni secara keseluruhan maupun per learning path.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => alert("Rekap nilai dan tracer status kerja berhasil diexport ke format Excel/CSV.")}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "1px solid var(--bx-border)",
              background: "var(--bx-surface)",
              color: "var(--ink)",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FlatIcon type="download" size={14} color="var(--ink)" />
            <span>Ekspor Tracer Excel</span>
          </button>
        </div>
      </div>

      {/* Analytics Statistics Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
        <div style={{ padding: "12px 14px", background: "var(--bx-surface)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Total Mahasiswa Terdata</div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--brand)", marginTop: "2px" }}>
            {totalStudents} Siswa
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>Rata-rata IPK: <strong>{avgGpa}</strong> / 4.00</div>
        </div>

        <div style={{ padding: "12px 14px", background: "var(--bx-surface)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Sudah Bekerja (Hired)</div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#065F46", marginTop: "2px" }}>
            {hiredCount} Siswa ({Math.round((hiredCount / totalStudents) * 100)}%)
          </div>
          <div style={{ fontSize: "0.68rem", color: "#065F46", fontWeight: 700 }}>Diterima di Perusahaan Mitra</div>
        </div>

        <div style={{ padding: "12px 14px", background: "var(--bx-surface)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Sedang Magang Industri</div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--gold-2)", marginTop: "2px" }}>
            {internCount} Siswa ({Math.round((internCount / totalStudents) * 100)}%)
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--gold-2)", fontWeight: 600 }}>Internship Bersertifikat</div>
        </div>

        <div style={{ padding: "12px 14px", background: "var(--bx-surface)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Belum Bekerja (Siap Kerja)</div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#2563EB", marginTop: "2px" }}>
            {openCount} Siswa ({Math.round((openCount / totalStudents) * 100)}%)
          </div>
          <div style={{ fontSize: "0.68rem", color: "#2563EB", fontWeight: 700 }}>Open for Hire • Siap Direkrut</div>
        </div>

        <div style={{ padding: "12px 14px", background: "var(--bx-surface)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Rata-rata Skor Keseluruhan</div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--brand)", marginTop: "2px" }}>
            {avgScore} / 100
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>Grade Rata-rata: <strong>A</strong></div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div
        style={{
          background: "rgba(201, 150, 46, 0.05)",
          border: "1px solid var(--gold)",
          borderRadius: "10px",
          padding: "16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "0.98rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
              Podium 3 Lulusan Terbaik (Top Ranked Students)
            </h3>
            <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
              {selectedPathFilter === "all" ? "Peringkat Keseluruhan Seluruh Jalur" : `Peringkat Jalur: ${AVAILABLE_LEARNING_PATHS.find(p => p.id === selectedPathFilter)?.title}`}
            </div>
          </div>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "var(--gold)", color: "#ffffff" }}>
            Leaderboard Prestasi
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
          {top3Podium.map((std, idx) => {
            const rankTitle = idx === 0 ? "🥇 PERINGKAT 1 (Top Honor)" : idx === 1 ? "🥈 PERINGKAT 2 (Runner-Up)" : "🥉 PERINGKAT 3 (Third Place)";
            const rankBorder = idx === 0 ? "var(--gold)" : idx === 1 ? "#94A3B8" : "#D97706";
            const rankBg = idx === 0 ? "rgba(201, 150, 46, 0.12)" : idx === 1 ? "rgba(148, 163, 184, 0.12)" : "rgba(217, 119, 6, 0.08)";

            return (
              <div
                key={std.id}
                onClick={() => handleOpenStudentDrawer(std)}
                style={{
                  background: rankBg,
                  border: `1.5px solid ${rankBorder}`,
                  borderRadius: "8px",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                }}
              >
                <img
                  src={std.avatar}
                  alt={std.name}
                  style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ffffff", boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 800, color: idx === 0 ? "var(--gold-2)" : "var(--brand)", textTransform: "uppercase" }}>
                    {rankTitle}
                  </div>
                  <strong style={{ fontSize: "0.92rem", color: "var(--brand)" }}>{std.name}</strong>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{std.learningPathCode} • IPK: <strong>{std.gpa}</strong></div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                    <span
                      style={{
                        fontSize: "0.66rem",
                        padding: "1px 6px",
                        borderRadius: "3px",
                        fontWeight: 700,
                        background: std.employmentStatus === "Sudah Bekerja" ? "#D1FAE5" : std.employmentStatus === "Sedang Magang" ? "#FEF3C7" : "#DBEAFE",
                        color: std.employmentStatus === "Sudah Bekerja" ? "#065F46" : std.employmentStatus === "Sedang Magang" ? "#92400E" : "#1E40AF",
                      }}
                    >
                      {std.employmentStatus}
                    </span>
                    {std.companyName && (
                      <span style={{ fontSize: "0.7rem", color: "var(--ink)", fontWeight: 600 }}>
                        @ {std.companyName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
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
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Filter Learning Path */}
          <div>
            <select
              value={selectedPathFilter}
              onChange={(e) => setSelectedPathFilter(e.target.value)}
              style={{ padding: "6px 12px", fontSize: "0.8rem", minWidth: "220px" }}
            >
              <option value="all">Semua Jalur (Peringkat Keseluruhan)</option>
              {AVAILABLE_LEARNING_PATHS.map((lp) => (
                <option key={lp.id} value={lp.id}>
                  {lp.code}: {lp.title}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status Pekerjaan */}
          <div>
            <select
              value={employmentFilter}
              onChange={(e) => setEmploymentFilter(e.target.value)}
              style={{ padding: "6px 12px", fontSize: "0.8rem" }}
            >
              <option value="all">Semua Status Karir</option>
              <option value="Sudah Bekerja">Sudah Bekerja (Hired)</option>
              <option value="Sedang Magang">Sedang Magang (Internship)</option>
              <option value="Belum Bekerja">Belum Bekerja (Open for Hire)</option>
            </select>
          </div>
        </div>

        {/* Search Box */}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIM, perusahaan..."
            style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.78rem", width: "200px", color: "var(--ink)" }}
          />
        </div>
      </div>

      {/* Main Table: Ranking, Grading & Status Karir */}
      <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1.5px solid var(--bx-border)", textAlign: "left" }}>
                <th style={{ padding: "12px 14px", width: "65px" }}>Rank</th>
                <th style={{ padding: "12px 14px" }}>Mahasiswa &amp; NIM</th>
                <th style={{ padding: "12px 14px" }}>Spesialisasi Learning Path</th>
                <th style={{ padding: "12px 14px" }}>Nilai Akhir &amp; Grade</th>
                <th style={{ padding: "12px 14px" }}>IPK / Rating</th>
                <th style={{ padding: "12px 14px" }}>Rincian (Tugas / Kuis / Proyek)</th>
                <th style={{ padding: "12px 14px" }}>Status Karir &amp; Pekerjaan</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((std, idx) => {
                const isTop1 = idx === 0;
                return (
                  <tr
                    key={std.id}
                    style={{
                      borderBottom: "1px solid var(--bx-border)",
                      background: isTop1 ? "rgba(201, 150, 46, 0.04)" : "transparent",
                    }}
                  >
                    {/* Rank Badge */}
                    <td style={{ padding: "12px 14px", fontWeight: 800, color: isTop1 ? "var(--gold-2)" : "var(--brand)" }}>
                      {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                    </td>

                    {/* Student Info with Avatar */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={std.avatar}
                          alt={std.name}
                          style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--bx-border)" }}
                        />
                        <div>
                          <strong style={{ color: "var(--ink)", display: "block" }}>{std.name}</strong>
                          <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>NIM: {std.nim}</span>
                        </div>
                      </div>
                    </td>

                    {/* Learning Path */}
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: "var(--bx-bg-alt)",
                          border: "1px solid var(--bx-border)",
                          color: "var(--brand)",
                          display: "inline-block",
                          marginBottom: "2px",
                        }}
                      >
                        {std.learningPathCode}
                      </span>
                      <div style={{ fontSize: "0.74rem", color: "var(--ink)", fontWeight: 600 }}>
                        {std.learningPathTitle}
                      </div>
                    </td>

                    {/* Nilai Akhir & Grade */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <strong style={{ fontSize: "0.95rem", color: "var(--brand)" }}>{std.overallScore}</strong>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: std.letterGrade.startsWith("A") ? "#D1FAE5" : "#DBEAFE",
                            color: std.letterGrade.startsWith("A") ? "#065F46" : "#1E40AF",
                          }}
                        >
                          {std.letterGrade}
                        </span>
                      </div>
                    </td>

                    {/* IPK / Rating */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 800, color: "var(--gold-2)" }}>IPK {std.gpa}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>⭐ {std.peerRating} / 5.0</div>
                    </td>

                    {/* Breakdown Scores */}
                    <td style={{ padding: "12px 14px", fontSize: "0.74rem", color: "var(--muted)" }}>
                      <div>Tugas: <strong>{std.tasksScore}</strong> | Kuis: <strong>{std.quizScore}</strong></div>
                      <div>Capstone: <strong>{std.capstoneScore}</strong> ({std.completionPercent}% tuntas)</div>
                    </td>

                    {/* Status Karir & Pekerjaan */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            width: "fit-content",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background:
                              std.employmentStatus === "Sudah Bekerja"
                                ? "#D1FAE5"
                                : std.employmentStatus === "Sedang Magang"
                                ? "#FEF3C7"
                                : "#DBEAFE",
                            color:
                              std.employmentStatus === "Sudah Bekerja"
                                ? "#065F46"
                                : std.employmentStatus === "Sedang Magang"
                                ? "#92400E"
                                : "#1E40AF",
                          }}
                        >
                          {std.employmentStatus}
                        </span>

                        {std.employmentStatus === "Sudah Bekerja" && (
                          <div style={{ fontSize: "0.75rem", color: "var(--ink)", fontWeight: 600 }}>
                            🏢 {std.companyName}
                            <span style={{ display: "block", fontSize: "0.68rem", color: "var(--muted)" }}>
                              {std.jobRole}
                            </span>
                          </div>
                        )}

                        {std.employmentStatus === "Sedang Magang" && (
                          <div style={{ fontSize: "0.75rem", color: "var(--ink)" }}>
                            🏢 {std.companyName} ({std.jobRole})
                          </div>
                        )}

                        {std.employmentStatus === "Belum Bekerja" && (
                          <div style={{ fontSize: "0.72rem", color: "#2563EB", fontWeight: 600 }}>
                            🚀 Siap Direkrut (Open for Hire)
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => handleOpenStudentDrawer(std)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "5px",
                          border: "1px solid var(--bx-border)",
                          background: "var(--bx-surface)",
                          color: "var(--brand)",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Detail &amp; Karir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SLIDER 95% DRAWER: DETAIL MAHASISWA & PEMBARUAN STATUS KERJA   */}
      {/* ============================================================== */}
      {inspectingStudent && (
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
            if (e.target === e.currentTarget) setInspectingStudent(null);
          }}
        >
          <div
            className="student-detail-slider-95"
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
            {/* Top Bar of Student Detail */}
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
                  SLIDER 95% • STUDENT PERFORMANCE &amp; TRACER STUDY
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
                  {inspectingStudent.name}
                </h3>
                <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                  (NIM: {inspectingStudent.nim} • {inspectingStudent.learningPathTitle})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setInspectingStudent(null)}
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

            {/* Slider Tabs */}
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
                { id: "transcript", label: "1. Transkrip Nilai Akademik & Capstone" },
                { id: "career", label: "2. Status Karir & Pembaruan Pekerjaan" },
                { id: "cert", label: "3. Sertifikat & Portofolio Industri" },
              ].map((tab) => {
                const isActive = inspectTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setInspectTab(tab.id as any)}
                    style={{
                      padding: "12px 18px",
                      border: "none",
                      borderBottom: isActive ? "3px solid var(--gold, #C9962E)" : "3px solid transparent",
                      background: "transparent",
                      color: isActive ? "var(--brand, #0A2E52)" : "var(--muted)",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.84rem",
                      cursor: "pointer",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Slider Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              {/* TAB 1: TRANSKRIP NILAI LENGKAP */}
              {inspectTab === "transcript" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1200px" }}>
                  {/* Summary Profile Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px",
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "8px",
                    }}
                  >
                    <img
                      src={inspectingStudent.avatar}
                      alt={inspectingStudent.name}
                      style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--brand)" }}
                    />
                    <div>
                      <h3 style={{ margin: 0, color: "var(--brand)", fontSize: "1.2rem" }}>{inspectingStudent.name}</h3>
                      <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                        NIM: {inspectingStudent.nim} • Email: {inspectingStudent.email}
                      </div>
                      <div style={{ color: "var(--gold-2)", fontWeight: 700, fontSize: "0.8rem", marginTop: "2px" }}>
                        Spesialisasi: {inspectingStudent.learningPathTitle}
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                    <div style={{ padding: "14px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Nilai Akhir Keseluruhan</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--brand)" }}>{inspectingStudent.overallScore}</div>
                      <span style={{ fontSize: "0.72rem", padding: "2px 8px", background: "#D1FAE5", color: "#065F46", borderRadius: "4px", fontWeight: 700 }}>
                        Grade {inspectingStudent.letterGrade}
                      </span>
                    </div>

                    <div style={{ padding: "14px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Indeks Prestasi Kumulatif</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--gold-2)" }}>{inspectingStudent.gpa}</div>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Skala 4.00</span>
                    </div>

                    <div style={{ padding: "14px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Review Tugas (Bobot 40%)</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--ink)" }}>{inspectingStudent.tasksScore}</div>
                      <span style={{ fontSize: "0.72rem", color: "#065F46" }}>Terverifikasi Reviewer</span>
                    </div>

                    <div style={{ padding: "14px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Kuis Assessment (30%)</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--ink)" }}>{inspectingStudent.quizScore}</div>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Uji Pemahaman Modul</span>
                    </div>

                    <div style={{ padding: "14px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Proyek Akhir Capstone (30%)</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--brand)" }}>{inspectingStudent.capstoneScore}</div>
                      <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700 }}>Siap Produksi</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: KARIR & PEMBARUAN STATUS PEKERJAAN */}
              {inspectTab === "career" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "900px" }}>
                  <div
                    style={{
                      background: "rgba(10, 46, 82, 0.05)",
                      border: "1px solid rgba(10, 46, 82, 0.12)",
                      borderRadius: "8px",
                      padding: "14px 18px",
                    }}
                  >
                    <div style={{ fontWeight: 800, color: "var(--brand)", marginBottom: "4px" }}>
                      Pembaruan Status Tracer Study &amp; Keterserapan Industri:
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "var(--muted)", lineHeight: 1.4 }}>
                      Perbarui data apakah mahasiswa ini sudah mendapatkan tawaran pekerjaan, sedang magang, atau masih siap direkrut oleh hiring partner.
                    </div>
                  </div>

                  <form onSubmit={handleSaveStudentCareer} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Status Pekerjaan Saat Ini
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      >
                        <option value="Belum Bekerja">Belum Bekerja (Open for Hire / Siap Kerja)</option>
                        <option value="Sudah Bekerja">Sudah Bekerja (Hired / Karyawan Tetap/Kontrak)</option>
                        <option value="Sedang Magang">Sedang Magang Industri (Internship)</option>
                      </select>
                    </div>

                    {editStatus !== "Belum Bekerja" && (
                      <>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                          <div>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                              Nama Perusahaan / Startup / Instansi
                            </label>
                            <input
                              type="text"
                              required
                              value={editCompany}
                              onChange={(e) => setEditCompany(e.target.value)}
                              placeholder="Misal: PT Pixel Perdana Jaya, GoTo, Bank Mandiri..."
                              style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                              Posisi / Jabatan Pekerjaan
                            </label>
                            <input
                              type="text"
                              required
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                              placeholder="Misal: Lead AI Engineer, Fullstack Developer..."
                              style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                            />
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                          <div>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                              Bulan &amp; Tahun Diterima Kerja
                            </label>
                            <input
                              type="text"
                              value={editHiredDate}
                              onChange={(e) => setEditHiredDate(e.target.value)}
                              placeholder="Misal: Oktober 2026"
                              style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                              Rentang Gaji Awal (Tracer Study)
                            </label>
                            <input
                              type="text"
                              value={editSalary}
                              onChange={(e) => setEditSalary(e.target.value)}
                              placeholder="Misal: Rp 15.000.000 - 20.000.000"
                              style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                            />
                          </div>
                        </div>

                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={editVerified}
                            onChange={(e) => setEditVerified(e.target.checked)}
                          />
                          <span>Ditempatkan melalui Hiring Partner Resmi Platform</span>
                        </label>
                      </>
                    )}

                    <button
                      type="submit"
                      style={{
                        alignSelf: "flex-start",
                        padding: "9px 20px",
                        borderRadius: "6px",
                        border: "none",
                        background: "var(--brand, #0A2E52)",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "0.84rem",
                        cursor: "pointer",
                        marginTop: "8px",
                      }}
                    >
                      Simpan Pembaruan Status Karir
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: SERTIFIKAT & PORTOFOLIO */}
              {inspectTab === "cert" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "900px" }}>
                  <div style={{ background: "var(--bx-bg-alt)", padding: "16px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                    <div style={{ fontWeight: 700, color: "var(--brand)", fontSize: "0.9rem", marginBottom: "6px" }}>
                      Sertifikat Kelulusan Resmi:
                    </div>
                    <div>Nomor Seri: <strong>{inspectingStudent.certificateSerialNumber || "AUI-2026-PENDING"}</strong></div>
                    <div style={{ color: "var(--muted)", fontSize: "0.74rem", marginTop: "4px" }}>
                      Terverifikasi secara kriptografis dan terhubung ke profil yudisium BAAK.
                    </div>
                  </div>

                  {inspectingStudent.portfolioUrl && (
                    <div style={{ background: "var(--bx-bg-alt)", padding: "16px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                      <div style={{ fontWeight: 700, color: "var(--brand)", fontSize: "0.9rem", marginBottom: "6px" }}>
                        Tautan Portofolio Proyek Terverifikasi:
                      </div>
                      <a href={inspectingStudent.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: "var(--brand)", textDecoration: "underline", fontWeight: 600 }}>
                        {inspectingStudent.portfolioUrl} ↗
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Footer */}
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
                Mahasiswa: <strong style={{ color: "var(--brand)" }}>{inspectingStudent.name}</strong> • Nilai: <strong>{inspectingStudent.overallScore} (Grade {inspectingStudent.letterGrade})</strong> • Status: <strong>{inspectingStudent.employmentStatus}</strong>
              </div>

              <button
                type="button"
                onClick={() => setInspectingStudent(null)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "6px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-surface)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "var(--ink)",
                }}
              >
                Tutup Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
