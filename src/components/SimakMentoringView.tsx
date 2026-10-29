"use client";

import React, { useState, useMemo } from "react";
import FlatIcon from "./FlatIcon";
import { MOCK_LMS_COURSES } from "../data/simakMockData";

export interface MentorPricing {
  hourlyRate: number; // Biaya sesi 1 jam (60 menit), e.g. Rp 175.000
  twoHourRate: number; // Biaya paket 2 jam intensif (120 menit), e.g. Rp 300.000
  groupClinicRate: number; // Biaya per siswa untuk klinik grup (max 5 org), e.g. Rp 120.000
  freeForSubscriberPro: boolean; // Gratis 1 sesi/bulan bagi siswa paket Pro / Enterprise
  masterSchemeId?: string; // ID master skema biaya acuan
}

export interface MasterPricingScheme {
  id: string; // e.g. "sch-01"
  code: string; // e.g. "TIER-STANDARD"
  name: string; // e.g. "Skema Standar Reviewer & Asesor"
  targetRole: string; // e.g. "Senior Reviewer Kode & Evaluator Asesmen"
  hourlyRate: number; // Tarif standar 1 jam (60m)
  twoHourRate: number; // Tarif standar 2 jam (120m)
  groupClinicRate: number; // Tarif klinik grup per siswa
  mentorSharePct: number; // Persentase honor mentor (e.g. 75%)
  platformSharePct: number; // Persentase kas platform LMS (e.g. 25%)
  freeForSubscriberPro: boolean; // Apakah gratis untuk subscriber Pro
  description: string; // Penjelasan benefit & ketentuan
  status: "Aktif" | "Non-Aktif";
  updatedAt: string;
}

export interface MenteeStudentStats {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  studentNim: string;
  mentorId: string;
  mentorName: string;
  learningPathTitle: string;
  totalSessionsAttended: number;
  status: "sukses" | "lama" | "gagal";
  statusLabel: string;
  startedDate: string;
  completionDate?: string;
  durationDays: number;
  finalGrade?: string;
  careerOutcome?: string;
  notes: string;
}

export interface MentorFeedback {
  id: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentNim: string;
  sessionId?: string;
  sessionTopic: string;
  rating: number; // 1 - 5 bintang
  aspectRatings: {
    clarity: number; // Kejelasan Materi (1-5)
    punctuality: number; // Ketepatan Waktu Sesi (1-5)
    technicalDepth: number; // Kedalaman Solusi Teknis (1-5)
  };
  critiqueAndSuggestions: string; // Teks kritik dan saran konstruktif
  testimonial: string; // Testimoni apresiasi siswa
  mentorReply?: string; // Tanggapan resmi dari mentor
  mentorReplyDate?: string;
  createdAt: string;
  status: "published" | "pinned" | "archived";
}

export interface AcademicPersonnel {
  id: string;
  name: string;
  nipOrNidn: string;
  officialTitle: string;
  personnelType: "Dosen" | "Reviewer" | "Karyawan Akademik";
  department: string;
  institution: string;
  avatar: string;
  email: string;
  phone: string;
  defaultBio: string;
  suggestedSpecialties: string[];
}

export const MOCK_PERSONNEL_DIRECTORY: AcademicPersonnel[] = [
  {
    id: "stf-01",
    name: "Prof. Budi Rahardjo, Ph.D.",
    nipOrNidn: "NIDN: 0418027501",
    officialTitle: "Guru Besar & Master Instructor Cloud AI",
    personnelType: "Dosen",
    department: "Fakultas Rekayasa Sistem Cerdas & STEI",
    institution: "Institut Teknologi Anvieo",
    avatar: "/alumni/alumni_1.jpg",
    email: "budi.dosen@anvieo.ac.id",
    phone: "+62 811-9988-7766",
    defaultBio: "Pakar arsitektur komputasi awan, distributed memory locking, dan rekayasa agen otonom AI skala enterprise.",
    suggestedSpecialties: ["Autonomous Agents", "FastMCP Protocol", "Distributed Systems", "Cloud AI Architecture"],
  },
  {
    id: "stf-02",
    name: "Dr. Maya Anggraini, M.Cs.",
    nipOrNidn: "NIDN: 0422058102",
    officialTitle: "Lead Curriculum Designer & Dosen Tetap UX/AI",
    personnelType: "Dosen",
    department: "Departemen Desain Antarmuka & Interaksi Manusia",
    institution: "Institut Teknologi Anvieo / Design Lab",
    avatar: "/alumni/alumni_5.jpg",
    email: "maya.design@anvieo.ac.id",
    phone: "+62 813-8899-7711",
    defaultBio: "Membantu desainer produk menguasai token design system, prototype interaktif Figma, dan portfolio review untuk unicorn.",
    suggestedSpecialties: ["Figma Design Token", "Design System Architecture", "Portfolio Critique", "UX Heuristics"],
  },
  {
    id: "stf-03",
    name: "Rian Maulana, S.T.",
    nipOrNidn: "NIP: REV-2024-008",
    officialTitle: "Principal Code Reviewer & Evaluator Proyek",
    personnelType: "Reviewer",
    department: "Divisi Evaluasi Praktik & Reviewer Kode",
    institution: "PT Pixel Perdana Jaya / Anvieo",
    avatar: "/alumni/alumni_4.jpg",
    email: "rian.reviewer@anvieo.ac.id",
    phone: "+62 878-5544-3322",
    defaultBio: "Praktisi Senior DevOps & Backend Distributed Microservices. Spesialisasi system design interview & live code review.",
    suggestedSpecialties: ["Next.js 16 Microservices", "PostgreSQL Sharding", "Kubernetes High Availability", "System Design"],
  },
  {
    id: "stf-04",
    name: "Siti Nurhaliza, S.Kom.",
    nipOrNidn: "NIP: REV-2025-014",
    officialTitle: "Senior Assessment Reviewer & Penguji Asesmen",
    personnelType: "Reviewer",
    department: "Biro Standarisasi Asesmen & BAAK",
    institution: "Institut Teknologi Anvieo",
    avatar: "/alumni/alumni_2.jpg",
    email: "siti.asesmen@anvieo.ac.id",
    phone: "+62 821-3344-5566",
    defaultBio: "Fokus pada pengujian unit test frontend React/Next.js, validasi rubrik penilaian, dan simulasi teknikal live coding.",
    suggestedSpecialties: ["React Testing Library", "Frontend Assessment", "Code Quality Standards", "Accessibility Audit"],
  },
  {
    id: "stf-05",
    name: "Dr. Ir. Hendra Prasetyo, M.T.",
    nipOrNidn: "NIDN: 0411037201",
    officialTitle: "Dosen SRE & Kepala Penjaminan Mutu LPMA",
    personnelType: "Dosen",
    department: "Direktorat Penjaminan Mutu Akademik (LPMA)",
    institution: "Institut Teknologi Anvieo",
    avatar: "/alumni/alumni_3.jpg",
    email: "hendra.qa@anvieo.ac.id",
    phone: "+62 812-7788-9900",
    defaultBio: "Auditor arsitektur cloud tingkat lanjut, observabilitas distributed tracing Prometheus/Grafana, dan reliability engineering.",
    suggestedSpecialties: ["Site Reliability Engineering", "Kubernetes Multi-Cluster", "Chaos Engineering", "Observability"],
  },
  {
    id: "stf-06",
    name: "Fariz Alkatiri, S.Kom., CISSP",
    nipOrNidn: "NIP: SEC-2023-003",
    officialTitle: "Senior Cyber Security & Smart Contract Auditor",
    personnelType: "Reviewer",
    department: "Divisi Keamanan Siber & Audit Smart Contract",
    institution: "CyberShield Security Alliance",
    avatar: "/alumni/alumni_3.jpg",
    email: "fariz.sec@anvieo.ac.id",
    phone: "+62 819-2233-4455",
    defaultBio: "Pemeriksa kerentanan kode backend, pengujian penetrasi zero-trust, dan audit keamanan smart contract Solidity.",
    suggestedSpecialties: ["Smart Contract Audit", "Zero Trust Architecture", "Penetration Testing", "API Security Hardening"],
  },
  {
    id: "stf-07",
    name: "Kevin Sanjaya, M.T.",
    nipOrNidn: "NIP: KRY-2025-029",
    officialTitle: "Staff Pengembang Platform & Lead Mobile Engineer",
    personnelType: "Karyawan Akademik",
    department: "Divisi Rekayasa Aplikasi Mobile & Integrasi SIMAK",
    institution: "Institut Teknologi Anvieo",
    avatar: "/alumni/alumni_2.jpg",
    email: "kevin.mobile@anvieo.ac.id",
    phone: "+62 856-7788-1122",
    defaultBio: "Membimbing pembuatan aplikasi mobile production-ready dengan Flutter & iOS Native serta integrasi API GraphQL/REST.",
    suggestedSpecialties: ["Flutter 3 Enterprise", "iOS Swift Native", "Offline-First Sync", "Mobile Security"],
  },
];

export interface CheckSwitchProps {
  checked: boolean;
  onChange: () => void;
  labelActive?: string;
  labelInactive?: string;
  disabled?: boolean;
}

export function CheckSwitch({
  checked,
  onChange,
  labelActive = "Aktif",
  labelInactive = "Non-Aktif",
  disabled = false,
}: CheckSwitchProps) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none",
      }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={onChange}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "12px",
          background: checked ? "#059669" : "#D1D5DB",
          position: "relative",
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          padding: "2px",
          transition: "background 0.2s ease",
          display: "inline-flex",
          alignItems: "center",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
            transform: checked ? "translateX(20px)" : "translateX(0px)",
            transition: "transform 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {checked ? (
            <span style={{ fontSize: "11px", color: "#059669", fontWeight: 900 }}>✓</span>
          ) : (
            <span style={{ fontSize: "10px", color: "#9CA3AF" }}>○</span>
          )}
        </div>
      </button>
      <span
        style={{
          fontSize: "0.76rem",
          fontWeight: 700,
          color: checked ? "#065F46" : "#6B7280",
        }}
      >
        {checked ? labelActive : labelInactive}
      </span>
    </label>
  );
}

export interface MentorProfile {
  id: string;
  staffId?: string;
  nipOrNidn?: string;
  personnelType?: "Dosen" | "Reviewer" | "Karyawan Akademik";
  name: string;
  title: string;
  institution: string;
  avatar: string;
  email: string;
  phone: string;
  bio: string;
  status: "Aktif" | "Non-Aktif" | "Penuh";
  rating: number;
  totalSessionsCompleted: number;
  pricing: MentorPricing;
  handledLearningPathIds: string[]; // Learning Paths yang bisa di-handling mentor
  handledCourseIds?: string[]; // Kurikulum/Kursus Single yang bisa di-handling mentor
  specialties: string[]; // Tag keahlian teknis spesifik
  availableDays: string; // Jadwal ketersediaan
  sessionDurationOptions: ("1_hour" | "2_hours" | "group_clinic")[];
  virtualRoomUrl: string; // Link template Google Meet / Zoom
}

export interface MentoringSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorTitle: string;
  mentorAvatar: string;
  studentName: string;
  studentEmail: string;
  learningPathTitle: string;
  topic: string;
  durationOption: "1_hour" | "2_hours" | "group_clinic";
  durationMinutes: number; // 60 atau 120
  fee: number;
  date: string;
  time: string;
  room: string;
  meetingLink: string;
  status: "berlangsung" | "mendatang" | "selesai" | "dibatalkan";
  notes?: string;
  studentFeedbackRating?: number;
}

export const AVAILABLE_LEARNING_PATHS = [
  {
    id: "lp-01",
    code: "TRACK-AI-01",
    title: "Artificial Intelligence & LLM Engineer",
    category: "AI & Data",
    coursesCount: 2,
    hours: 120,
  },
  {
    id: "lp-02",
    code: "TRACK-FS-02",
    title: "Fullstack Web & Cloud Architecture",
    category: "Web & Mobile",
    coursesCount: 2,
    hours: 140,
  },
  {
    id: "lp-03",
    code: "TRACK-UX-03",
    title: "Product Designer & UI/UX Specialist",
    category: "UI/UX Design",
    coursesCount: 1,
    hours: 80,
  },
  {
    id: "lp-04",
    code: "TRACK-CLOUD-04",
    title: "Cloud-Native Infrastructure & Kubernetes",
    category: "Cloud & DevOps",
    coursesCount: 2,
    hours: 110,
  },
  {
    id: "lp-05",
    code: "TRACK-SEC-05",
    title: "Cyber Security & Smart Contract Audit",
    category: "Cyber Security",
    coursesCount: 2,
    hours: 100,
  },
  {
    id: "lp-06",
    code: "TRACK-DATA-06",
    title: "Data Science, Analytics & BI Dashboard",
    category: "AI & Data",
    coursesCount: 3,
    hours: 130,
  },
  {
    id: "lp-07",
    code: "TRACK-MOB-07",
    title: "Cross-Platform Mobile Engineering (Flutter)",
    category: "Web & Mobile",
    coursesCount: 2,
    hours: 95,
  },
];

const INITIAL_MENTORS: MentorProfile[] = [
  {
    id: "mnt-prof-01",
    staffId: "stf-01",
    nipOrNidn: "NIDN: 0418027501",
    personnelType: "Dosen",
    name: "Prof. Budi Rahardjo, Ph.D.",
    title: "Guru Besar & Master Instructor Cloud AI",
    institution: "Institut Teknologi Anvieo / STEI",
    avatar: "/alumni/alumni_1.jpg",
    email: "budi.dosen@anvieo.ac.id",
    phone: "+62 811-9988-7766",
    bio: "Pakar arsitektur komputasi awan, distributed memory locking, dan rekayasa agen otonom AI skala enterprise.",
    status: "Aktif",
    rating: 4.95,
    totalSessionsCompleted: 148,
    pricing: {
      hourlyRate: 200000,
      twoHourRate: 350000,
      groupClinicRate: 150000,
      freeForSubscriberPro: true,
    },
    handledLearningPathIds: ["lp-01", "lp-04"],
    handledCourseIds: ["crs-01", "crs-03"],
    specialties: ["Autonomous Agents", "FastMCP Protocol", "Distributed Systems", "Cloud AI Architecture"],
    availableDays: "Setiap Senin & Rabu 14:00 - 17:00 WIB",
    sessionDurationOptions: ["1_hour", "2_hours"],
    virtualRoomUrl: "https://meet.google.com/anvieo-ai-room",
  },
  {
    id: "mnt-prof-02",
    staffId: "stf-03",
    nipOrNidn: "NIP: REV-2024-008",
    personnelType: "Reviewer",
    name: "Rian Maulana, S.T.",
    title: "Principal Code Reviewer & Evaluator Proyek",
    institution: "PT Pixel Perdana Jaya",
    avatar: "/alumni/alumni_4.jpg",
    email: "rian.reviewer@anvieo.ac.id",
    phone: "+62 878-5544-3322",
    bio: "Praktisi Senior DevOps & Backend Distributed Microservices. Spesialisasi system design interview & live code review.",
    status: "Aktif",
    rating: 4.9,
    totalSessionsCompleted: 112,
    pricing: {
      hourlyRate: 175000,
      twoHourRate: 300000,
      groupClinicRate: 120000,
      freeForSubscriberPro: true,
    },
    handledLearningPathIds: ["lp-02", "lp-04"],
    handledCourseIds: ["crs-01", "crs-02"],
    specialties: ["Next.js 16 Microservices", "PostgreSQL Sharding", "Kubernetes High Availability", "System Design"],
    availableDays: "Setiap Selasa & Kamis 19:00 - 21:00 WIB",
    sessionDurationOptions: ["1_hour", "2_hours", "group_clinic"],
    virtualRoomUrl: "https://meet.google.com/anvieo-cloud-clinic",
  },
  {
    id: "mnt-prof-03",
    staffId: "stf-02",
    nipOrNidn: "NIDN: 0422058102",
    personnelType: "Dosen",
    name: "Dr. Maya Anggraini, M.Cs.",
    title: "Lead Curriculum Designer & Dosen Tetap UX/AI",
    institution: "Anvieo Design Lab",
    avatar: "/alumni/alumni_2.jpg",
    email: "maya.design@anvieo.ac.id",
    phone: "+62 813-8899-7711",
    bio: "Membantu desainer produk menguasai token design system, prototype interaktif Figma, dan portfolio review untuk unicorn.",
    status: "Aktif",
    rating: 4.88,
    totalSessionsCompleted: 94,
    pricing: {
      hourlyRate: 150000,
      twoHourRate: 260000,
      groupClinicRate: 100000,
      freeForSubscriberPro: true,
    },
    handledLearningPathIds: ["lp-03"],
    handledCourseIds: ["crs-04"],
    specialties: ["Figma Design Token", "Design System Architecture", "Portfolio Critique", "UX Heuristics"],
    availableDays: "Setiap Jumat 15:00 - 18:00 WIB",
    sessionDurationOptions: ["1_hour", "2_hours"],
    virtualRoomUrl: "https://meet.google.com/anvieo-ux-studio",
  },
  {
    id: "mnt-prof-04",
    staffId: "stf-06",
    nipOrNidn: "NIP: SEC-2023-003",
    personnelType: "Reviewer",
    name: "Fariz Alkatiri, S.Kom., CISSP",
    title: "Senior Cyber Security & Smart Contract Auditor",
    institution: "CyberShield Security Alliance",
    avatar: "/alumni/alumni_3.jpg",
    email: "fariz.sec@anvieo.ac.id",
    phone: "+62 819-2233-4455",
    bio: "Pemeriksa kerentanan kode backend, pengujian penetrasi zero-trust, dan audit keamanan smart contract Solidity.",
    status: "Non-Aktif",
    rating: 4.92,
    totalSessionsCompleted: 67,
    pricing: {
      hourlyRate: 220000,
      twoHourRate: 400000,
      groupClinicRate: 160000,
      freeForSubscriberPro: false,
    },
    handledLearningPathIds: ["lp-05"],
    handledCourseIds: ["crs-05"],
    specialties: ["Smart Contract Audit", "Zero Trust Architecture", "Penetration Testing", "API Security Hardening"],
    availableDays: "Setiap Sabtu 10:00 - 14:00 WIB (Cuti Sementara)",
    sessionDurationOptions: ["1_hour", "2_hours"],
    virtualRoomUrl: "https://meet.google.com/anvieo-security-lab",
  },
];

const INITIAL_SESSIONS: MentoringSession[] = [
  {
    id: "mnt-ses-01",
    mentorId: "mnt-prof-01",
    mentorName: "Prof. Budi Rahardjo, Ph.D.",
    mentorTitle: "Master Instructor Cloud AI",
    mentorAvatar: "/alumni/alumni_1.jpg",
    studentName: "Muhammad Farhan",
    studentEmail: "farhan.mhs@anvieo.ac.id",
    learningPathTitle: "Artificial Intelligence & LLM Engineer",
    topic: "Optimasi Distributed Memory Locking & Redlock Implementation pada FastMCP",
    durationOption: "2_hours",
    durationMinutes: 120,
    fee: 350000,
    date: "Hari ini",
    time: "10:30 - 12:30 WIB",
    room: "Virtual Room A-1",
    meetingLink: "https://meet.google.com/anvieo-ai-room",
    status: "berlangsung",
    notes: "Mahasiswa memahami arsitektur Redis cluster, disarankan benchmark network latency.",
  },
  {
    id: "mnt-ses-02",
    mentorId: "mnt-prof-02",
    mentorName: "Rian Maulana, S.T.",
    mentorTitle: "Lead Technical Assessor",
    mentorAvatar: "/alumni/alumni_4.jpg",
    studentName: "Aditya Pratama",
    studentEmail: "aditya.pratama@outlook.com",
    learningPathTitle: "Fullstack Web & Cloud Architecture",
    topic: "System Design Mock Interview: Sharded PostgreSQL with pgvector & Next.js 16",
    durationOption: "1_hour",
    durationMinutes: 60,
    fee: 175000,
    date: "Hari ini",
    time: "13:00 - 14:00 WIB",
    room: "Virtual Room B-2",
    meetingLink: "https://meet.google.com/anvieo-cloud-clinic",
    status: "mendatang",
  },
  {
    id: "mnt-ses-03",
    mentorId: "mnt-prof-03",
    mentorName: "Dr. Maya Anggraini, M.Cs.",
    mentorTitle: "Head of Product Design",
    mentorAvatar: "/alumni/alumni_2.jpg",
    studentName: "Siti Nurhaliza",
    studentEmail: "siti.nurhaliza@gmail.com",
    learningPathTitle: "Product Designer & UI/UX Specialist",
    topic: "Review Portofolio Proyek Akhir Figma Design Token & Usability Testing",
    durationOption: "2_hours",
    durationMinutes: 120,
    fee: 260000,
    date: "Kemarin",
    time: "15:00 - 17:00 WIB",
    room: "Virtual Room C-3",
    meetingLink: "https://meet.google.com/anvieo-ux-studio",
    status: "selesai",
    notes: "Desain token sangat rapi dan siap dipresentasikan ke hiring partner industri.",
    studentFeedbackRating: 5,
  },
];

export const INITIAL_PRICING_SCHEMES: MasterPricingScheme[] = [
  {
    id: "sch-01",
    code: "TIER-STANDARD",
    name: "Skema Standar Reviewer & Asesor",
    targetRole: "Senior Reviewer Kode & Evaluator Asesmen",
    hourlyRate: 150000,
    twoHourRate: 260000,
    groupClinicRate: 100000,
    mentorSharePct: 70,
    platformSharePct: 30,
    freeForSubscriberPro: true,
    description: "Untuk sesi konsultasi perbaikan kode submission, unit testing, dan evaluasi portofolio standar.",
    status: "Aktif",
    updatedAt: "25 Oktober 2026",
  },
  {
    id: "sch-02",
    code: "TIER-SENIOR",
    name: "Skema Senior Praktisi & Dosen Tetap",
    targetRole: "Dosen Pengampu & Principal Reviewer",
    hourlyRate: 175000,
    twoHourRate: 300000,
    groupClinicRate: 120000,
    mentorSharePct: 75,
    platformSharePct: 25,
    freeForSubscriberPro: true,
    description: "Bimbingan perancangan sistem, microservices architecture, dan review portofolio tingkat menengah ke atas.",
    status: "Aktif",
    updatedAt: "26 Oktober 2026",
  },
  {
    id: "sch-03",
    code: "TIER-MASTER",
    name: "Skema Master Lead & Solution Architect",
    targetRole: "Master Instructor & Cyber Security Auditor",
    hourlyRate: 200000,
    twoHourRate: 350000,
    groupClinicRate: 150000,
    mentorSharePct: 80,
    platformSharePct: 20,
    freeForSubscriberPro: true,
    description: "Konsultasi mendalam deep-dive AI Agent, Smart Contract Audit, dan high-throughput database sharding.",
    status: "Aktif",
    updatedAt: "28 Oktober 2026",
  },
  {
    id: "sch-04",
    code: "TIER-EXECUTIVE",
    name: "Skema Executive & Guru Besar STEI",
    targetRole: "Guru Besar (Profesor) & Dewan Penjamin Mutu",
    hourlyRate: 250000,
    twoHourRate: 450000,
    groupClinicRate: 180000,
    mentorSharePct: 85,
    platformSharePct: 15,
    freeForSubscriberPro: false,
    description: "Sesi bimbingan eksklusif riset doktoral, tata kelola AI enterprise, dan konsultasi strategis C-Level.",
    status: "Aktif",
    updatedAt: "28 Oktober 2026",
  },
];

export const INITIAL_MENTEES: MenteeStudentStats[] = [
  // Prof. Budi Rahardjo, Ph.D. (mnt-prof-01)
  {
    id: "mte-01",
    studentId: "std-01",
    studentName: "Muhammad Farhan",
    studentEmail: "farhan.mhs@anvieo.ac.id",
    studentAvatar: "/alumni/alumni_1.jpg",
    studentNim: "NIM: 2024-AI-019",
    mentorId: "mnt-prof-01",
    mentorName: "Prof. Budi Rahardjo, Ph.D.",
    learningPathTitle: "Artificial Intelligence & LLM Engineer",
    totalSessionsAttended: 6,
    status: "sukses",
    statusLabel: "Lulus Cum Laude • Hired",
    startedDate: "10 Jan 2026",
    completionDate: "21 Feb 2026",
    durationDays: 42,
    finalGrade: "A (98.0)",
    careerOutcome: "Diterima sebagai AI Platform Engineer di Tokopedia",
    notes: "Memahami arsitektur FastMCP dan distributed redis locking dengan sangat mendalam. Proyek akhir diimplementasikan secara optimal.",
  },
  {
    id: "mte-02",
    studentId: "std-02",
    studentName: "Siti Nurhaliza",
    studentEmail: "siti.nurhaliza@gmail.com",
    studentAvatar: "/alumni/alumni_2.jpg",
    studentNim: "NIM: 2024-AI-044",
    mentorId: "mnt-prof-01",
    mentorName: "Prof. Budi Rahardjo, Ph.D.",
    learningPathTitle: "Artificial Intelligence & LLM Engineer",
    totalSessionsAttended: 4,
    status: "sukses",
    statusLabel: "Lulus Sangat Memuaskan",
    startedDate: "15 Jan 2026",
    completionDate: "19 Feb 2026",
    durationDays: 35,
    finalGrade: "A (94.5)",
    careerOutcome: "Promosi ke Lead Autonomous AI Developer",
    notes: "Desain pipeline multi-agent orchestration sangat rapi dan lolos benchmark latency.",
  },
  {
    id: "mte-03",
    studentId: "std-03",
    studentName: "Aditya Pratama",
    studentEmail: "aditya.pratama@outlook.com",
    studentAvatar: "/alumni/alumni_3.jpg",
    studentNim: "NIM: 2024-AI-088",
    mentorId: "mnt-prof-01",
    mentorName: "Prof. Budi Rahardjo, Ph.D.",
    learningPathTitle: "Cloud-Native Infrastructure & Kubernetes",
    totalSessionsAttended: 7,
    status: "lama",
    statusLabel: "Bimbingan Berkelanjutan (>55 Hari)",
    startedDate: "05 Jan 2026",
    durationDays: 58,
    finalGrade: "In Progress (Revisi Modul 4)",
    careerOutcome: "Persiapan Sertifikasi CKA Kubernetes",
    notes: "Membutuhkan waktu tambahan untuk konfigurasi dynamic volume provisioning Ceph dan cluster federation.",
  },
  {
    id: "mte-04",
    studentId: "std-06",
    studentName: "Rizky Ramadhan",
    studentEmail: "rizky.ramadhan@tech.id",
    studentAvatar: "/alumni/alumni_4.jpg",
    studentNim: "NIM: 2024-AI-102",
    mentorId: "mnt-prof-01",
    mentorName: "Prof. Budi Rahardjo, Ph.D.",
    learningPathTitle: "Artificial Intelligence & LLM Engineer",
    totalSessionsAttended: 5,
    status: "sukses",
    statusLabel: "Lulus Memuaskan",
    startedDate: "12 Jan 2026",
    completionDate: "21 Feb 2026",
    durationDays: 40,
    finalGrade: "A- (91.0)",
    careerOutcome: "Diterima Magang AI di DCI Indonesia",
    notes: "Penyelesaian modul evaluasi rag evaluation & fine tuning Llama 3.",
  },
  {
    id: "mte-05",
    studentId: "std-07",
    studentName: "Kevin Anggara",
    studentEmail: "kevin.anggara@student.org",
    studentAvatar: "/alumni/alumni_5.jpg",
    studentNim: "NIM: 2024-AI-133",
    mentorId: "mnt-prof-01",
    mentorName: "Prof. Budi Rahardjo, Ph.D.",
    learningPathTitle: "Artificial Intelligence & LLM Engineer",
    totalSessionsAttended: 2,
    status: "gagal",
    statusLabel: "Gagal / Diskualifikasi",
    startedDate: "02 Jan 2026",
    completionDate: "03 Mar 2026",
    durationDays: 60,
    finalGrade: "D (45.0)",
    careerOutcome: "Drop Out dari Program Akselerasi",
    notes: "Tidak menyelesaikan submission proyek akhir melewati batas maksimal toleransi waktu dan tidak hadir di evaluasi verifikasi mandiri.",
  },

  // Rian Maulana, S.T. (mnt-prof-02)
  {
    id: "mte-06",
    studentId: "std-03",
    studentName: "Aditya Pratama",
    studentEmail: "aditya.pratama@outlook.com",
    studentAvatar: "/alumni/alumni_3.jpg",
    studentNim: "NIM: 2024-FS-011",
    mentorId: "mnt-prof-02",
    mentorName: "Rian Maulana, S.T.",
    learningPathTitle: "Fullstack Web & Cloud Architecture",
    totalSessionsAttended: 5,
    status: "sukses",
    statusLabel: "Lulus Mock Interview • Hired",
    startedDate: "18 Jan 2026",
    completionDate: "25 Feb 2026",
    durationDays: 38,
    finalGrade: "A (95.0)",
    careerOutcome: "Diterima Senior Backend Engineer di Traveloka",
    notes: "Lolos simulasi live coding Next.js 16 Server Actions dan perancangan sharded PostgreSQL dengan pgvector.",
  },
  {
    id: "mte-07",
    studentId: "std-08",
    studentName: "Dewi Sartika",
    studentEmail: "dewi.sartika@gmail.com",
    studentAvatar: "/alumni/alumni_5.jpg",
    studentNim: "NIM: 2024-FS-027",
    mentorId: "mnt-prof-02",
    mentorName: "Rian Maulana, S.T.",
    learningPathTitle: "Fullstack Web & Cloud Architecture",
    totalSessionsAttended: 4,
    status: "sukses",
    statusLabel: "Lulus Sangat Memuaskan",
    startedDate: "20 Jan 2026",
    completionDate: "19 Feb 2026",
    durationDays: 30,
    finalGrade: "A (93.0)",
    careerOutcome: "Fullstack Developer di Pixel Perdana Jaya",
    notes: "Arsitektur frontend micro-frontends dan backend event bus dieksekusi dengan standar industri.",
  },
  {
    id: "mte-08",
    studentId: "std-09",
    studentName: "Fajar Nugraha",
    studentEmail: "fajar.nugraha@univ.ac.id",
    studentAvatar: "/alumni/alumni_1.jpg",
    studentNim: "NIM: 2024-FS-073",
    mentorId: "mnt-prof-02",
    mentorName: "Rian Maulana, S.T.",
    learningPathTitle: "Fullstack Web & Cloud Architecture",
    totalSessionsAttended: 6,
    status: "lama",
    statusLabel: "Bimbingan Berkelanjutan (>50 Hari)",
    startedDate: "08 Jan 2026",
    durationDays: 52,
    finalGrade: "In Progress (Revisi Sharding DB)",
    careerOutcome: "Mempersiapkan Portofolio Skala Besar",
    notes: "Masih memperbaiki handling failover database replica dan deadlock concurrent booking.",
  },
  {
    id: "mte-09",
    studentId: "std-10",
    studentName: "Ilham Saputra",
    studentEmail: "ilham.saputra@student.ac.id",
    studentAvatar: "/alumni/alumni_4.jpg",
    studentNim: "NIM: 2024-FS-099",
    mentorId: "mnt-prof-02",
    mentorName: "Rian Maulana, S.T.",
    learningPathTitle: "Fullstack Web & Cloud Architecture",
    totalSessionsAttended: 1,
    status: "gagal",
    statusLabel: "Drop Out / Tidak Hadir",
    startedDate: "10 Jan 2026",
    completionDate: "24 Feb 2026",
    durationDays: 45,
    finalGrade: "F (0.0)",
    careerOutcome: "Status Dibatalkan Otomatis",
    notes: "Tidak hadir pada 3 jadwal sesi berturut-turut tanpa konfirmasi dan repository kode kosong.",
  },

  // Dr. Maya Anggraini, M.Cs. (mnt-prof-03)
  {
    id: "mte-10",
    studentId: "std-02",
    studentName: "Siti Nurhaliza",
    studentEmail: "siti.nurhaliza@gmail.com",
    studentAvatar: "/alumni/alumni_2.jpg",
    studentNim: "NIM: 2024-UX-004",
    mentorId: "mnt-prof-03",
    mentorName: "Dr. Maya Anggraini, M.Cs.",
    learningPathTitle: "Product Designer & UI/UX Specialist",
    totalSessionsAttended: 6,
    status: "sukses",
    statusLabel: "Lulus Cum Laude • Hired",
    startedDate: "22 Jan 2026",
    completionDate: "19 Feb 2026",
    durationDays: 28,
    finalGrade: "A+ (99.0)",
    careerOutcome: "Diterima Lead UI/UX di Flip Indonesia",
    notes: "Design token Figma terstruktur sempurna, komponen reusable lengkap dengan WCAG AAA contrast ratio.",
  },
  {
    id: "mte-11",
    studentId: "std-04",
    studentName: "Anisa Rahmawati",
    studentEmail: "anisa.rahma@student.ac.id",
    studentAvatar: "/alumni/alumni_4.jpg",
    studentNim: "NIM: 2024-UX-032",
    mentorId: "mnt-prof-03",
    mentorName: "Dr. Maya Anggraini, M.Cs.",
    learningPathTitle: "Product Designer & UI/UX Specialist",
    totalSessionsAttended: 5,
    status: "lama",
    statusLabel: "Bimbingan Berkelanjutan (>40 Hari)",
    startedDate: "15 Jan 2026",
    durationDays: 44,
    finalGrade: "In Progress (Revisi Heuristik)",
    careerOutcome: "Penyempurnaan Studi Kasus Usability",
    notes: "Sedang melakukan iterasi user testing kedua terhadap responden disabilitas untuk asesmen aksesibilitas.",
  },
  {
    id: "mte-12",
    studentId: "std-11",
    studentName: "Naufal Pratama",
    studentEmail: "naufal.pratama@agency.id",
    studentAvatar: "/alumni/alumni_3.jpg",
    studentNim: "NIM: 2024-UX-051",
    mentorId: "mnt-prof-03",
    mentorName: "Dr. Maya Anggraini, M.Cs.",
    learningPathTitle: "Product Designer & UI/UX Specialist",
    totalSessionsAttended: 3,
    status: "sukses",
    statusLabel: "Lulus Sangat Memuaskan",
    startedDate: "28 Jan 2026",
    completionDate: "22 Feb 2026",
    durationDays: 25,
    finalGrade: "A (92.0)",
    careerOutcome: "Product Designer di PT Inovasi Solusi",
    notes: "Studi kasus mobile banking diuji dengan 12 pengguna dan hasil prototype interaktif sangat lancar.",
  },
  {
    id: "mte-13",
    studentId: "std-12",
    studentName: "Budi Setiawan",
    studentEmail: "budi.setiawan@outlook.com",
    studentAvatar: "/alumni/alumni_1.jpg",
    studentNim: "NIM: 2024-UX-088",
    mentorId: "mnt-prof-03",
    mentorName: "Dr. Maya Anggraini, M.Cs.",
    learningPathTitle: "Product Designer & UI/UX Specialist",
    totalSessionsAttended: 4,
    status: "sukses",
    statusLabel: "Lulus Memuaskan",
    startedDate: "25 Jan 2026",
    completionDate: "24 Feb 2026",
    durationDays: 30,
    finalGrade: "A- (90.0)",
    careerOutcome: "Associate UX Researcher di Bukalapak",
    notes: "Analisis riset kualitatif komprehensif, affinity map tertata baik.",
  },

  // Fariz Alkatiri, S.Kom., CISSP (mnt-prof-04)
  {
    id: "mte-14",
    studentId: "std-13",
    studentName: "Bagas Wicaksono",
    studentEmail: "bagas.wicaksono@sec.id",
    studentAvatar: "/alumni/alumni_1.jpg",
    studentNim: "NIM: 2024-SEC-012",
    mentorId: "mnt-prof-04",
    mentorName: "Fariz Alkatiri, S.Kom., CISSP",
    learningPathTitle: "Cyber Security & Smart Contract Audit",
    totalSessionsAttended: 5,
    status: "sukses",
    statusLabel: "Lulus Cum Laude • Hired",
    startedDate: "15 Jan 2026",
    completionDate: "19 Feb 2026",
    durationDays: 35,
    finalGrade: "A (97.0)",
    careerOutcome: "Web3 Security Auditor di CyberShield",
    notes: "Berhasil menemukan 4 celah kerentanan reentrancy dan overflow pada smart contract DeFi simulasi.",
  },
  {
    id: "mte-15",
    studentId: "std-14",
    studentName: "Hendro Kusumo",
    studentEmail: "hendro.k@student.ac.id",
    studentAvatar: "/alumni/alumni_5.jpg",
    studentNim: "NIM: 2024-SEC-034",
    mentorId: "mnt-prof-04",
    mentorName: "Fariz Alkatiri, S.Kom., CISSP",
    learningPathTitle: "Cyber Security & Smart Contract Audit",
    totalSessionsAttended: 2,
    status: "gagal",
    statusLabel: "Gagal / Pelanggaran Uji",
    startedDate: "20 Jan 2026",
    completionDate: "19 Feb 2026",
    durationDays: 30,
    finalGrade: "F (0.0)",
    careerOutcome: "Diskualifikasi Etika Keamanan Siber",
    notes: "Melakukan pengujian penetrasi di luar domain sandbox tanpa otorisasi dan gagal pada ujian etika hacking.",
  },
  {
    id: "mte-16",
    studentId: "std-15",
    studentName: "Diana Putri",
    studentEmail: "diana.putri@crypto.com",
    studentAvatar: "/alumni/alumni_2.jpg",
    studentNim: "NIM: 2024-SEC-071",
    mentorId: "mnt-prof-04",
    mentorName: "Fariz Alkatiri, S.Kom., CISSP",
    learningPathTitle: "Cyber Security & Smart Contract Audit",
    totalSessionsAttended: 4,
    status: "lama",
    statusLabel: "Bimbingan Berkelanjutan (>50 Hari)",
    startedDate: "05 Jan 2026",
    durationDays: 54,
    finalGrade: "In Progress (Remidial Fuzzing)",
    careerOutcome: "Persiapan Uji Sertifikasi CEH",
    notes: "Sedang menyelesaikan implementasi fuzzing automated testing menggunakan Foundry & Echidna.",
  },
];

export const INITIAL_FEEDBACKS: MentorFeedback[] = [
  {
    id: "fb-01",
    mentorId: "mnt-prof-01",
    mentorName: "Prof. Dr. Ir. Budi Rahardjo, M.Sc.",
    studentId: "std-01",
    studentName: "Aditya Pratama Putra",
    studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AdityaPratama",
    studentNim: "20230801045",
    sessionId: "ses-01",
    sessionTopic: "Review Arsitektur Microservices FinTech & Audit Keamanan",
    rating: 5,
    aspectRatings: {
      clarity: 5,
      punctuality: 5,
      technicalDepth: 5,
    },
    critiqueAndSuggestions: "Materi dan bedah arsitektur sangat mendalam! Saran saya untuk sesi mendatang, rangkuman diagram arsitektur Excalidraw atau catatan whiteboard bisa diexport ke PDF dan diupload langsung ke portal bimbingan agar bisa diulas kembali secara offline.",
    testimonial: "Prof. Budi memberikan insight level enterprise yang tidak ada di textbook. Berkat sesi ini, arsitektur event-driven saya tembus review di kantor!",
    mentorReply: "Terima kasih atas saran konstruktifnya Aditya! Mulai sesi berikutnya, tautan live canvas & ringkasan arsitektur otomatis dilampirkan di rekam jejak siswa.",
    mentorReplyDate: "18 Feb 2026",
    createdAt: "16 Feb 2026",
    status: "pinned",
  },
  {
    id: "fb-02",
    mentorId: "mnt-prof-01",
    mentorName: "Prof. Dr. Ir. Budi Rahardjo, M.Sc.",
    studentId: "std-03",
    studentName: "Bagas Wicaksono",
    studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BagasWicaksono",
    studentNim: "20230801089",
    sessionId: "ses-03",
    sessionTopic: "Troubleshooting Concurrency & Database Locking PostgreSQL",
    rating: 5,
    aspectRatings: {
      clarity: 5,
      punctuality: 5,
      technicalDepth: 5,
    },
    critiqueAndSuggestions: "Sesi 2 jam terasa sangat cepat karena materinya sangat padat. Kritik kecil: mohon audio mikrofon di awal sesi bisa distandarisasi volumenya agar tidak terlalu kecil di 10 menit pertama.",
    testimonial: "Solusi pg_stat_activity dan optimistic locking yang disarankan Prof. Budi langsung menyelesaikan bottleneck transaksi 10.000 TPS di backend kami.",
    mentorReply: "Catatan volume mic sudah saya kalibrasi dengan headset studio baru. Terima kasih atas feedback-nya Bagas!",
    mentorReplyDate: "21 Feb 2026",
    createdAt: "20 Feb 2026",
    status: "published",
  },
  {
    id: "fb-03",
    mentorId: "mnt-prof-02",
    mentorName: "Rian Maulana, S.Kom., M.T.",
    studentId: "std-02",
    studentName: "Siti Nurhaliza",
    studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SitiNurhaliza",
    studentNim: "20230801112",
    sessionId: "ses-02",
    sessionTopic: "Optimasi State Management & Render Tree React 19 / Next.js",
    rating: 5,
    aspectRatings: {
      clarity: 5,
      punctuality: 5,
      technicalDepth: 5,
    },
    critiqueAndSuggestions: "Penjelasannya runut dan mudah dipahami bagi pemula Next.js. Saran: jika memungkinkan, berikan rekomendasi repo starter boilerplate clean architecture untuk referensi tugas akhir.",
    testimonial: "Pak Rian sangat sabar dan teliti melihat bug render berulang di Next.js 16 saya. Code review-nya sangat mengedukasi!",
    mentorReply: "Sama-sama Siti! Boilerplate Clean Architecture dengan TanStack Query sudah saya pin di tab materi bimbingan.",
    mentorReplyDate: "23 Feb 2026",
    createdAt: "22 Feb 2026",
    status: "pinned",
  },
  {
    id: "fb-04",
    mentorId: "mnt-prof-02",
    mentorName: "Rian Maulana, S.Kom., M.T.",
    studentId: "std-05",
    studentName: "Rian Hidayat",
    studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RianHidayat",
    studentNim: "20230801021",
    sessionId: "ses-05",
    sessionTopic: "Pair Programming: Migrasi Form Handling ke Zod & Server Actions",
    rating: 4,
    aspectRatings: {
      clarity: 4,
      punctuality: 4,
      technicalDepth: 5,
    },
    critiqueAndSuggestions: "Materi live-coding sangat seru, namun sesi sempat mundur 10 menit karena jadwal mentor sebelumnya bertabrakan. Mohon interval antar sesi bimbingan diberi jeda buffer 15 menit agar tepat waktu.",
    testimonial: "Pemahaman saya tentang Server Actions dan Zod validation meningkat pesat. Pak Rian mentor yang sangat ramah dan suportif.",
    mentorReply: "Mohon maaf atas keterlambatan 10 menit tersebut Rian. Sistem buffer slot otomatis 15 menit sudah kami aktifkan di kalender bimbingan.",
    mentorReplyDate: "25 Feb 2026",
    createdAt: "24 Feb 2026",
    status: "published",
  },
  {
    id: "fb-05",
    mentorId: "mnt-prof-03",
    mentorName: "Dr. Eng. Maya Anggraini, S.T., M.Cs.",
    studentId: "std-04",
    studentName: "Dewi Lestari",
    studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DewiLestari",
    studentNim: "20230801198",
    sessionId: "ses-04",
    sessionTopic: "Fine-Tuning Llama 3 & RAG Semantic Search dengan Qdrant",
    rating: 5,
    aspectRatings: {
      clarity: 5,
      punctuality: 5,
      technicalDepth: 5,
    },
    critiqueAndSuggestions: "Penjelasan Bu Maya tentang chunking strategy dan hybrid search sangat visioner! Saran: alangkah baiknya ada sesi lanjutan khusus benchmarking GPU memory & quantization 4-bit (QLoRA).",
    testimonial: "Satu-satunya bimbingan AI engineering yang mengajarkan sampai tahap deploy production vLLM. Luar biasa menginspirasi!",
    mentorReply: "Terima kasih Dewi! Topik QLoRA dan vLLM akan kita agendakan di klinik grup intensif minggu depan.",
    mentorReplyDate: "26 Feb 2026",
    createdAt: "25 Feb 2026",
    status: "pinned",
  },
  {
    id: "fb-06",
    mentorId: "mnt-prof-03",
    mentorName: "Dr. Eng. Maya Anggraini, S.T., M.Cs.",
    studentId: "std-08",
    studentName: "Alya Maharani",
    studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlyaMaharani",
    studentNim: "20230801067",
    sessionId: "ses-08",
    sessionTopic: "Evaluasi Prompt Engineering & Agentic Workflow LangGraph",
    rating: 4,
    aspectRatings: {
      clarity: 4,
      punctuality: 5,
      technicalDepth: 5,
    },
    critiqueAndSuggestions: "Pembahasannya sangat mendalam sampai ke source code, tapi bagi yang matematika dasarnya belum kuat agak lumayan berat. Saran: mungkin perlu dibuatkan pre-reading slide sebelum sesi 2 jam dimulai.",
    testimonial: "Bu Maya sangat menguasai seluk beluk LLM Agent. Hasil review beliau membuat proyek akhir saya diapresiasi dosen penguji.",
    mentorReply: "Saran yang bagus Alya! Slide prasyarat konsep graph-state sudah kami jadikan modul bacaan sebelum sesi dimulai.",
    mentorReplyDate: "27 Feb 2026",
    createdAt: "26 Feb 2026",
    status: "published",
  },
  {
    id: "fb-07",
    mentorId: "mnt-prof-04",
    mentorName: "Fariz Alkatiri, S.Kom., CISSP",
    studentId: "std-07",
    studentName: "Dimas Setiawan",
    studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DimasSetiawan",
    studentNim: "20230801156",
    sessionId: "ses-07",
    sessionTopic: "Penetration Testing Web API & Simulasi Eksploitasi OWASP Top 10",
    rating: 5,
    aspectRatings: {
      clarity: 5,
      punctuality: 5,
      technicalDepth: 5,
    },
    critiqueAndSuggestions: "Hands-on lab CTF yang dibimbing Mas Fariz sangat menantang! Saran: sediakan link VM / Docker image lab yang sudah dipre-configured agar siswa tidak menghabiskan waktu setting environment.",
    testimonial: "Mas Fariz membagikan pengalaman nyata sebagai auditor cybersecurity. Saya belajar cara berpikir attacker dan defender sekaligus!",
    mentorReply: "Mantap Dimas! Docker container lab sekarang sudah tersedia di template sandbox LMS SIMAK.",
    mentorReplyDate: "28 Feb 2026",
    createdAt: "27 Feb 2026",
    status: "published",
  },
  {
    id: "fb-08",
    mentorId: "mnt-prof-04",
    mentorName: "Fariz Alkatiri, S.Kom., CISSP",
    studentId: "std-10",
    studentName: "Zahra Amalia",
    studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZahraAmalia",
    studentNim: "20230801201",
    sessionId: "ses-10",
    sessionTopic: "Audit Smart Contract Solidity & Deteksi Kerentanan Reentrancy",
    rating: 3,
    aspectRatings: {
      clarity: 3,
      punctuality: 4,
      technicalDepth: 4,
    },
    critiqueAndSuggestions: "Kritik konstruktif: Mas Fariz menerangkan materi terlalu cepat dan banyak menggunakan istilah teknis tanpa penjelasan konteks awal. Saya yang masih dasar sempat bingung pada materi Slither dan Echidna. Mohon tempo penjelasan disesuaikan dengan level pemula.",
    testimonial: "Meskipun materinya sangat menantang dan tempo cepat, feedback dari Mas Fariz membuka mata saya mengenai pentingnya security audit sebelum deploy mainnet.",
    mentorReply: "Terima kasih atas kritik jujurnya Zahra. Saya akan memperlambat tempo dan memberikan analogi bertahap untuk konsep bytecode analysis.",
    mentorReplyDate: "01 Mar 2026",
    createdAt: "28 Feb 2026",
    status: "published",
  },
  {
    id: "fb-09",
    mentorId: "mnt-prof-01",
    mentorName: "Prof. Dr. Ir. Budi Rahardjo, M.Sc.",
    studentId: "std-09",
    studentName: "Fajar Nugraha",
    studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FajarNugraha",
    studentNim: "20230801140",
    sessionId: "ses-09",
    sessionTopic: "Konsultasi Karir: Persiapan Technical Interview Staff Engineer",
    rating: 5,
    aspectRatings: {
      clarity: 5,
      punctuality: 5,
      technicalDepth: 5,
    },
    critiqueAndSuggestions: "Simulasi mock interview sangat realistis dan pertanyaan studi kasusnya benar-benar melatih problem-solving. Saran: tambahkan sesi mock negotiating offer letter bagi lulusan.",
    testimonial: "Sesi mock interview bersama Prof. Budi membuat saya 100% siap dan alhamdulillah diterima sebagai Backend Engineer!",
    mentorReply: "Selamat atas diterimanya Fajar! Semoga sukses berkarier di industri.",
    mentorReplyDate: "02 Mar 2026",
    createdAt: "01 Mar 2026",
    status: "pinned",
  },
  {
    id: "fb-10",
    mentorId: "mnt-prof-02",
    mentorName: "Rian Maulana, S.Kom., M.T.",
    studentId: "std-06",
    studentName: "Nadia Safitri",
    studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NadiaSafitri",
    studentNim: "20230801178",
    sessionId: "ses-06",
    sessionTopic: "Implementasi Responsive Design System & Tailwind CSS Tokens",
    rating: 4,
    aspectRatings: {
      clarity: 5,
      punctuality: 4,
      technicalDepth: 4,
    },
    critiqueAndSuggestions: "Bimbingan CSS Grid dan Container Queries sangat detail. Saran: mohon ditambahkan studi kasus penanganan dark mode contrast ratio yang sesuai standar WCAG AAA.",
    testimonial: "Portofolio UI saya terlihat jauh lebih profesional setelah direview oleh Mas Rian. Terima kasih banyak!",
    mentorReply: "Terima kasih sarannya Nadia! Modul audit accessibility (a11y) dan WCAG contrast tester akan saya demonstrasikan di sesi berikutnya.",
    mentorReplyDate: "02 Mar 2026",
    createdAt: "01 Mar 2026",
    status: "published",
  },
];

export type MainMentoringTab = "mentors" | "sessions" | "history" | "pricing_master" | "statistics" | "feedbacks";
export type MentorSliderTab = "profile" | "paths" | "pricing" | "schedule" | "status" | "statistics" | "feedbacks";

export default function SimakMentoringView() {
  const [mentors, setMentors] = useState<MentorProfile[]>(INITIAL_MENTORS);
  const [sessions, setSessions] = useState<MentoringSession[]>(INITIAL_SESSIONS);
  const [activeTab, setActiveTab] = useState<MainMentoringTab>("mentors");

  // Master Skema Biaya State
  const [pricingSchemes, setPricingSchemes] = useState<MasterPricingScheme[]>(INITIAL_PRICING_SCHEMES);
  const [editingPricingScheme, setEditingPricingScheme] = useState<MasterPricingScheme | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingSchemeSearch, setPricingSchemeSearch] = useState("");

  // Mentee Student Stats State
  const [mentees, setMentees] = useState<MenteeStudentStats[]>(INITIAL_MENTEES);
  const [viewingMentorStats, setViewingMentorStats] = useState<MentorProfile | null>(null);
  const [statMentorFilter, setStatMentorFilter] = useState("all");
  const [statOutcomeFilter, setStatOutcomeFilter] = useState("all");
  const [statSearchQuery, setStatSearchQuery] = useState("");

  // Filter & Search for Mentors
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pathFilter, setPathFilter] = useState<string>("all");

  // Slider 95% State
  const [editingMentor, setEditingMentor] = useState<MentorProfile | null>(null);
  const [sliderTab, setSliderTab] = useState<MentorSliderTab>("profile");
  const [newSpecialtyInput, setNewSpecialtyInput] = useState("");

  // Sub-tab & Filter for Learning Path & Single Courses inside Slider 95%
  const [mentorPathSubTab, setMentorPathSubTab] = useState<"paths" | "courses">("paths");
  const [pathSearchQuery, setPathSearchQuery] = useState("");
  const [pathCategoryFilter, setPathCategoryFilter] = useState("all");
  const [singleCourseSearchQuery, setSingleCourseSearchQuery] = useState("");
  const [singleCourseCategoryFilter, setSingleCourseCategoryFilter] = useState("all");

  // Modals for Sessions
  const [reschedulingSession, setReschedulingSession] = useState<MentoringSession | null>(null);
  const [newTime, setNewTime] = useState("");

  const [notingSession, setNotingSession] = useState<MentoringSession | null>(null);
  const [mentorNotes, setMentorNotes] = useState("");

  // Feedback & Rating States
  const [feedbacks, setFeedbacks] = useState<MentorFeedback[]>(INITIAL_FEEDBACKS);
  const [isNewFeedbackModalOpen, setIsNewFeedbackModalOpen] = useState(false);
  const [replyingFeedback, setReplyingFeedback] = useState<MentorFeedback | null>(null);
  const [replyText, setReplyText] = useState("");
  const [viewingMentorFeedbacks, setViewingMentorFeedbacks] = useState<MentorProfile | null>(null);
  const [feedbackMentorFilter, setFeedbackMentorFilter] = useState("all");
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState("all");
  const [feedbackSearchQuery, setFeedbackSearchQuery] = useState("");

  const [newFeedbackForm, setNewFeedbackForm] = useState({
    mentorId: "mnt-prof-01",
    studentName: "",
    studentNim: "",
    sessionTopic: "",
    rating: 5,
    clarity: 5,
    punctuality: 5,
    technicalDepth: 5,
    critiqueAndSuggestions: "",
    testimonial: "",
  });

  // Categories extracted for filters
  const availablePathCategories = useMemo(() => {
    return Array.from(new Set(AVAILABLE_LEARNING_PATHS.map((p) => p.category).filter(Boolean)));
  }, []);

  const availableCourseCategories = useMemo(() => {
    return Array.from(new Set(MOCK_LMS_COURSES.map((c) => c.category).filter(Boolean)));
  }, []);

  // Filtered lists inside Slider 95%
  const filteredAvailablePaths = useMemo(() => {
    return AVAILABLE_LEARNING_PATHS.filter((lp) => {
      if (pathCategoryFilter !== "all" && lp.category !== pathCategoryFilter) return false;
      if (!pathSearchQuery.trim()) return true;
      const q = pathSearchQuery.toLowerCase();
      return (
        lp.title.toLowerCase().includes(q) ||
        lp.code.toLowerCase().includes(q) ||
        lp.category.toLowerCase().includes(q)
      );
    });
  }, [pathCategoryFilter, pathSearchQuery]);

  const filteredAvailableCourses = useMemo(() => {
    return MOCK_LMS_COURSES.filter((crs) => {
      if (singleCourseCategoryFilter !== "all" && crs.category !== singleCourseCategoryFilter) return false;
      if (!singleCourseSearchQuery.trim()) return true;
      const q = singleCourseSearchQuery.toLowerCase();
      return (
        crs.title.toLowerCase().includes(q) ||
        crs.category.toLowerCase().includes(q) ||
        (crs.instructorName && crs.instructorName.toLowerCase().includes(q))
      );
    });
  }, [singleCourseCategoryFilter, singleCourseSearchQuery]);

  // Helper for computing single mentor statistics
  const getMentorStats = (mentorId: string) => {
    const list = mentees.filter((m) => m.mentorId === mentorId);
    const total = list.length;
    const sukses = list.filter((m) => m.status === "sukses").length;
    const lama = list.filter((m) => m.status === "lama").length;
    const gagal = list.filter((m) => m.status === "gagal").length;
    const successRate = total > 0 ? Math.round((sukses / total) * 100) : 0;
    return { list, total, sukses, lama, gagal, successRate };
  };

  // Overall platform statistics
  const overallStats = useMemo(() => {
    const total = mentees.length;
    const sukses = mentees.filter((m) => m.status === "sukses").length;
    const lama = mentees.filter((m) => m.status === "lama").length;
    const gagal = mentees.filter((m) => m.status === "gagal").length;
    const successRate = total > 0 ? Math.round((sukses / total) * 100) : 0;
    return { total, sukses, lama, gagal, successRate };
  }, [mentees]);

  // Filtered mentees for Statistics tab
  const filteredMentees = useMemo(() => {
    return mentees.filter((m) => {
      if (statMentorFilter !== "all" && m.mentorId !== statMentorFilter) return false;
      if (statOutcomeFilter !== "all" && m.status !== statOutcomeFilter) return false;
      if (!statSearchQuery.trim()) return true;
      const q = statSearchQuery.toLowerCase();
      return (
        m.studentName.toLowerCase().includes(q) ||
        m.studentNim.toLowerCase().includes(q) ||
        m.studentEmail.toLowerCase().includes(q) ||
        m.mentorName.toLowerCase().includes(q) ||
        m.learningPathTitle.toLowerCase().includes(q) ||
        m.statusLabel.toLowerCase().includes(q)
      );
    });
  }, [mentees, statMentorFilter, statOutcomeFilter, statSearchQuery]);

  // Filtered pricing schemes
  const filteredPricingSchemes = useMemo(() => {
    if (!pricingSchemeSearch.trim()) return pricingSchemes;
    const q = pricingSchemeSearch.toLowerCase();
    return pricingSchemes.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.targetRole.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [pricingSchemes, pricingSchemeSearch]);

  // Helper for computing single mentor rating & review summary
  const getMentorRatingSummary = (mentorId: string) => {
    const list = feedbacks.filter((f) => f.mentorId === mentorId);
    const count = list.length;
    if (count === 0) {
      return {
        avgRating: "5.0",
        numericAvg: 5.0,
        count: 0,
        clarityAvg: "5.0",
        punctualityAvg: "5.0",
        technicalDepthAvg: "5.0",
        dist: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
        list: [] as MentorFeedback[],
      };
    }
    const sumRating = list.reduce((acc, f) => acc + f.rating, 0);
    const sumClarity = list.reduce((acc, f) => acc + f.aspectRatings.clarity, 0);
    const sumPunctuality = list.reduce((acc, f) => acc + f.aspectRatings.punctuality, 0);
    const sumDepth = list.reduce((acc, f) => acc + f.aspectRatings.technicalDepth, 0);

    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach((f) => {
      const r = Math.round(f.rating);
      if (dist[r] !== undefined) dist[r]++;
    });

    return {
      avgRating: (sumRating / count).toFixed(1),
      numericAvg: sumRating / count,
      count,
      clarityAvg: (sumClarity / count).toFixed(1),
      punctualityAvg: (sumPunctuality / count).toFixed(1),
      technicalDepthAvg: (sumDepth / count).toFixed(1),
      dist,
      list,
    };
  };

  // Overall platform rating summary
  const overallRatingSummary = useMemo(() => {
    const count = feedbacks.length;
    if (count === 0) {
      return {
        avgRating: "5.0",
        count: 0,
        clarityAvg: "5.0",
        punctualityAvg: "5.0",
        technicalDepthAvg: "5.0",
        dist: {
          5: { count: 0, pct: 0 },
          4: { count: 0, pct: 0 },
          3: { count: 0, pct: 0 },
          2: { count: 0, pct: 0 },
          1: { count: 0, pct: 0 },
        },
      };
    }
    const sumRating = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    const sumClarity = feedbacks.reduce((acc, f) => acc + f.aspectRatings.clarity, 0);
    const sumPunctuality = feedbacks.reduce((acc, f) => acc + f.aspectRatings.punctuality, 0);
    const sumDepth = feedbacks.reduce((acc, f) => acc + f.aspectRatings.technicalDepth, 0);

    const rawDist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbacks.forEach((f) => {
      const r = Math.round(f.rating);
      if (rawDist[r] !== undefined) rawDist[r]++;
    });

    const dist: Record<number, { count: number; pct: number }> = {
      5: { count: rawDist[5], pct: Math.round((rawDist[5] / count) * 100) },
      4: { count: rawDist[4], pct: Math.round((rawDist[4] / count) * 100) },
      3: { count: rawDist[3], pct: Math.round((rawDist[3] / count) * 100) },
      2: { count: rawDist[2], pct: Math.round((rawDist[2] / count) * 100) },
      1: { count: rawDist[1], pct: Math.round((rawDist[1] / count) * 100) },
    };

    return {
      avgRating: (sumRating / count).toFixed(1),
      count,
      clarityAvg: (sumClarity / count).toFixed(1),
      punctualityAvg: (sumPunctuality / count).toFixed(1),
      technicalDepthAvg: (sumDepth / count).toFixed(1),
      dist,
    };
  }, [feedbacks]);

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      if (feedbackMentorFilter !== "all" && f.mentorId !== feedbackMentorFilter) return false;
      if (feedbackRatingFilter !== "all" && String(Math.round(f.rating)) !== feedbackRatingFilter) return false;
      if (!feedbackSearchQuery.trim()) return true;
      const q = feedbackSearchQuery.toLowerCase();
      return (
        f.studentName.toLowerCase().includes(q) ||
        f.studentNim.toLowerCase().includes(q) ||
        f.sessionTopic.toLowerCase().includes(q) ||
        f.critiqueAndSuggestions.toLowerCase().includes(q) ||
        f.testimonial.toLowerCase().includes(q) ||
        (f.mentorReply && f.mentorReply.toLowerCase().includes(q))
      );
    });
  }, [feedbacks, feedbackMentorFilter, feedbackRatingFilter, feedbackSearchQuery]);

  // Handlers for Feedbacks
  const handleOpenNewFeedbackModal = () => {
    setNewFeedbackForm({
      mentorId: mentors[0]?.id || "mnt-prof-01",
      studentName: "",
      studentNim: "",
      sessionTopic: "",
      rating: 5,
      clarity: 5,
      punctuality: 5,
      technicalDepth: 5,
      critiqueAndSuggestions: "",
      testimonial: "",
    });
    setIsNewFeedbackModalOpen(true);
  };

  const handleSaveNewFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackForm.studentName.trim() || !newFeedbackForm.critiqueAndSuggestions.trim()) {
      alert("Nama mahasiswa dan saran/kritik wajib diisi!");
      return;
    }
    const targetMentor = mentors.find((m) => m.id === newFeedbackForm.mentorId) || mentors[0];
    const newFb: MentorFeedback = {
      id: `fb-${Date.now()}`,
      mentorId: targetMentor.id,
      mentorName: targetMentor.name,
      studentId: `std-${Date.now()}`,
      studentName: newFeedbackForm.studentName.trim(),
      studentAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newFeedbackForm.studentName.trim())}`,
      studentNim: newFeedbackForm.studentNim.trim() || `20240801${Math.floor(100 + Math.random() * 900)}`,
      sessionTopic: newFeedbackForm.sessionTopic.trim() || "Sesi Bimbingan & Konsultasi Karir",
      rating: newFeedbackForm.rating,
      aspectRatings: {
        clarity: newFeedbackForm.clarity,
        punctuality: newFeedbackForm.punctuality,
        technicalDepth: newFeedbackForm.technicalDepth,
      },
      critiqueAndSuggestions: newFeedbackForm.critiqueAndSuggestions.trim(),
      testimonial: newFeedbackForm.testimonial.trim() || "Bimbingan sangat membantu akselerasi pemahaman materi.",
      createdAt: "Hari ini",
      status: "published",
    };
    setFeedbacks([newFb, ...feedbacks]);
    setIsNewFeedbackModalOpen(false);
    alert(`Rating & saran kritik untuk ${targetMentor.name} berhasil dikirim!`);
  };

  const handleOpenReplyModal = (feedback: MentorFeedback) => {
    setReplyingFeedback(feedback);
    setReplyText(feedback.mentorReply || "");
  };

  const handleSaveMentorReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingFeedback) return;
    setFeedbacks(
      feedbacks.map((f) =>
        f.id === replyingFeedback.id
          ? {
              ...f,
              mentorReply: replyText.trim(),
              mentorReplyDate: "Hari ini",
            }
          : f
      )
    );
    alert("Tanggapan resmi mentor berhasil disimpan!");
    setReplyingFeedback(null);
  };

  const handleTogglePinFeedback = (feedbackId: string) => {
    setFeedbacks(
      feedbacks.map((f) => {
        if (f.id !== feedbackId) return f;
        const nextStatus = f.status === "pinned" ? "published" : "pinned";
        return { ...f, status: nextStatus };
      })
    );
  };

  // Handlers for Master Skema Biaya
  const handleOpenNewPricingScheme = () => {
    const newScheme: MasterPricingScheme = {
      id: `sch-${Date.now()}`,
      code: `TIER-CUSTOM-${pricingSchemes.length + 1}`,
      name: "",
      targetRole: "Instruktur / Mentor Terverifikasi",
      hourlyRate: 175000,
      twoHourRate: 300000,
      groupClinicRate: 120000,
      mentorSharePct: 75,
      platformSharePct: 25,
      freeForSubscriberPro: true,
      description: "",
      status: "Aktif",
      updatedAt: "Hari ini",
    };
    setEditingPricingScheme(newScheme);
    setIsPricingModalOpen(true);
  };

  const handleEditPricingScheme = (scheme: MasterPricingScheme) => {
    setEditingPricingScheme({ ...scheme });
    setIsPricingModalOpen(true);
  };

  const handleSavePricingScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPricingScheme) return;
    if (!editingPricingScheme.name.trim() || !editingPricingScheme.code.trim()) {
      alert("Nama skema dan kode skema wajib diisi!");
      return;
    }
    const exists = pricingSchemes.some((s) => s.id === editingPricingScheme.id);
    if (exists) {
      setPricingSchemes(
        pricingSchemes.map((s) => (s.id === editingPricingScheme.id ? { ...editingPricingScheme, updatedAt: "Hari ini" } : s))
      );
    } else {
      setPricingSchemes([...pricingSchemes, { ...editingPricingScheme, updatedAt: "Hari ini" }]);
    }
    setIsPricingModalOpen(false);
    setEditingPricingScheme(null);
    alert(`Master skema biaya "${editingPricingScheme.name}" berhasil disimpan!`);
  };

  const handleDeletePricingScheme = (schemeId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus master skema biaya ini?")) {
      setPricingSchemes(pricingSchemes.filter((s) => s.id !== schemeId));
    }
  };

  const handleTogglePricingSchemeStatus = (schemeId: string) => {
    setPricingSchemes(
      pricingSchemes.map((s) => {
        if (s.id !== schemeId) return s;
        const nextStatus = s.status === "Aktif" ? "Non-Aktif" : "Aktif";
        return { ...s, status: nextStatus, updatedAt: "Hari ini" };
      })
    );
  };

  const handleApplyPricingSchemeToMentor = (schemeId: string) => {
    const scheme = pricingSchemes.find((s) => s.id === schemeId);
    if (!scheme || !editingMentor) return;
    setEditingMentor({
      ...editingMentor,
      pricing: {
        hourlyRate: scheme.hourlyRate,
        twoHourRate: scheme.twoHourRate,
        groupClinicRate: scheme.groupClinicRate,
        freeForSubscriberPro: scheme.freeForSubscriberPro,
        masterSchemeId: scheme.id,
      },
    });
  };

  // Handlers for Mentor Management
  const handleOpenNewMentor = () => {
    const defaultStaff = MOCK_PERSONNEL_DIRECTORY[0];
    const newMentor: MentorProfile = {
      id: `mnt-prof-${Date.now()}`,
      staffId: defaultStaff.id,
      nipOrNidn: defaultStaff.nipOrNidn,
      personnelType: defaultStaff.personnelType,
      name: defaultStaff.name,
      title: defaultStaff.officialTitle,
      institution: defaultStaff.institution,
      avatar: defaultStaff.avatar,
      email: defaultStaff.email,
      phone: defaultStaff.phone,
      bio: defaultStaff.defaultBio,
      status: "Aktif",
      rating: 5.0,
      totalSessionsCompleted: 0,
      pricing: {
        hourlyRate: 175000,
        twoHourRate: 300000,
        groupClinicRate: 120000,
        freeForSubscriberPro: true,
      },
      handledLearningPathIds: ["lp-01"],
      handledCourseIds: ["crs-01"],
      specialties: [...defaultStaff.suggestedSpecialties],
      availableDays: "Setiap Senin & Kamis, 14:00 - 18:00 WIB",
      sessionDurationOptions: ["1_hour", "2_hours"],
      virtualRoomUrl: "https://meet.google.com/anvieo-mentor-room",
    };
    setEditingMentor(newMentor);
    setSliderTab("profile");
  };

  const handleSelectPersonnel = (staffId: string) => {
    const staff = MOCK_PERSONNEL_DIRECTORY.find((s) => s.id === staffId);
    if (!staff || !editingMentor) return;
    setEditingMentor({
      ...editingMentor,
      staffId: staff.id,
      nipOrNidn: staff.nipOrNidn,
      personnelType: staff.personnelType,
      name: staff.name,
      title: staff.officialTitle,
      institution: staff.institution,
      avatar: staff.avatar,
      email: staff.email,
      phone: staff.phone,
      bio: staff.defaultBio,
      specialties: staff.suggestedSpecialties.length > 0 ? [...staff.suggestedSpecialties] : editingMentor.specialties,
    });
  };

  const handleSaveMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMentor) return;

    if (!editingMentor.name.trim()) {
      alert("Nama mentor tidak boleh kosong!");
      return;
    }
    const hasPath = editingMentor.handledLearningPathIds.length > 0;
    const hasCourse = (editingMentor.handledCourseIds || []).length > 0;
    if (!hasPath && !hasCourse) {
      alert("Mentor wajib memiliki minimal 1 Learning Path atau 1 Kurikulum Single yang ditangani!");
      return;
    }

    const exists = mentors.some((m) => m.id === editingMentor.id);
    if (exists) {
      setMentors(mentors.map((m) => (m.id === editingMentor.id ? editingMentor : m)));
    } else {
      setMentors([editingMentor, ...mentors]);
    }

    alert(`Profil mentor "${editingMentor.name}" berhasil disimpan!`);
    setEditingMentor(null);
  };

  const handleToggleMentorStatus = (mentorId: string) => {
    setMentors(
      mentors.map((m) => {
        if (m.id !== mentorId) return m;
        const nextStatus = m.status === "Aktif" ? "Non-Aktif" : "Aktif";
        return { ...m, status: nextStatus };
      })
    );
  };

  const handleDeleteMentor = (mentorId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus mentor ini secara permanen dari sistem?")) {
      setMentors(mentors.filter((m) => m.id !== mentorId));
      if (editingMentor?.id === mentorId) {
        setEditingMentor(null);
      }
    }
  };

  const handleToggleHandledPath = (pathId: string) => {
    if (!editingMentor) return;
    const current = editingMentor.handledLearningPathIds;
    const exists = current.includes(pathId);
    let updated: string[];
    if (exists) {
      updated = current.filter((id) => id !== pathId);
    } else {
      updated = [...current, pathId];
    }
    setEditingMentor({ ...editingMentor, handledLearningPathIds: updated });
  };

  const handleToggleHandledCourse = (courseId: string) => {
    if (!editingMentor) return;
    const current = editingMentor.handledCourseIds || [];
    const exists = current.includes(courseId);
    let updated: string[];
    if (exists) {
      updated = current.filter((id) => id !== courseId);
    } else {
      updated = [...current, courseId];
    }
    setEditingMentor({ ...editingMentor, handledCourseIds: updated });
  };

  const handleSelectAllFilteredPaths = () => {
    if (!editingMentor) return;
    const idsToAdd = filteredAvailablePaths.map((p) => p.id);
    const combined = Array.from(new Set([...editingMentor.handledLearningPathIds, ...idsToAdd]));
    setEditingMentor({ ...editingMentor, handledLearningPathIds: combined });
  };

  const handleDeselectAllFilteredPaths = () => {
    if (!editingMentor) return;
    const idsToRemove = new Set(filteredAvailablePaths.map((p) => p.id));
    const remaining = editingMentor.handledLearningPathIds.filter((id) => !idsToRemove.has(id));
    setEditingMentor({ ...editingMentor, handledLearningPathIds: remaining });
  };

  const handleSelectAllFilteredCourses = () => {
    if (!editingMentor) return;
    const idsToAdd = filteredAvailableCourses.map((c) => c.id);
    const combined = Array.from(new Set([...(editingMentor.handledCourseIds || []), ...idsToAdd]));
    setEditingMentor({ ...editingMentor, handledCourseIds: combined });
  };

  const handleDeselectAllFilteredCourses = () => {
    if (!editingMentor) return;
    const idsToRemove = new Set(filteredAvailableCourses.map((c) => c.id));
    const remaining = (editingMentor.handledCourseIds || []).filter((id) => !idsToRemove.has(id));
    setEditingMentor({ ...editingMentor, handledCourseIds: remaining });
  };

  const handleAddSpecialty = () => {
    if (!editingMentor || !newSpecialtyInput.trim()) return;
    if (editingMentor.specialties.includes(newSpecialtyInput.trim())) return;
    setEditingMentor({
      ...editingMentor,
      specialties: [...editingMentor.specialties, newSpecialtyInput.trim()],
    });
    setNewSpecialtyInput("");
  };

  const handleRemoveSpecialty = (item: string) => {
    if (!editingMentor) return;
    setEditingMentor({
      ...editingMentor,
      specialties: editingMentor.specialties.filter((s) => s !== item),
    });
  };

  // Handlers for Sessions
  const handleExecuteReschedule = () => {
    if (!reschedulingSession || !newTime) return;
    setSessions(
      sessions.map((s) =>
        s.id === reschedulingSession.id ? { ...s, time: newTime } : s
      )
    );
    setReschedulingSession(null);
    alert("Jadwal sesi mentoring berhasil di-reschedule!");
  };

  const handleSaveNotes = () => {
    if (!notingSession) return;
    setSessions(
      sessions.map((s) =>
        s.id === notingSession.id ? { ...s, notes: mentorNotes } : s
      )
    );
    setNotingSession(null);
    alert("Catatan sesi mentoring berhasil disimpan ke rekam jejak siswa!");
  };

  const handleCancelSession = (sessionId: string) => {
    if (confirm("Apakah Anda yakin ingin membatalkan sesi mentoring ini?")) {
      setSessions(
        sessions.map((s) =>
          s.id === sessionId ? { ...s, status: "dibatalkan" as const } : s
        )
      );
    }
  };

  // Filtered Mentors
  const filteredMentors = mentors.filter((m) => {
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (pathFilter !== "all" && !m.handledLearningPathIds.includes(pathFilter)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      m.institution.toLowerCase().includes(q) ||
      (m.nipOrNidn && m.nipOrNidn.toLowerCase().includes(q)) ||
      (m.personnelType && m.personnelType.toLowerCase().includes(q)) ||
      m.specialties.some((s) => s.toLowerCase().includes(q))
    );
  });

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
              Mentoring &amp; Clinic
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              Bimbingan 1-on-1, Paket 2 Jam, Mock Interview &amp; Spesialisasi Learning Path
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
            Pusat Mentoring &amp; Konsultasi Karir
          </h2>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
            Kelola profil mentor, tarif bimbingan 1 jam &amp; 2 jam, alokasi alur belajar yang ditangani, dan pantau sesi bimbingan siswa.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {activeTab === "pricing_master" ? (
            <button
              type="button"
              onClick={handleOpenNewPricingScheme}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: "var(--brand, #0A2E52)",
                color: "#ffffff",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 6px rgba(10, 46, 82, 0.2)",
              }}
            >
              <FlatIcon type="plus" size={14} color="#ffffff" />
              <span>Tambah Skema Biaya Baru</span>
            </button>
          ) : activeTab === "feedbacks" ? (
            <button
              type="button"
              onClick={handleOpenNewFeedbackModal}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: "var(--brand, #0A2E52)",
                color: "#ffffff",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 6px rgba(10, 46, 82, 0.2)",
              }}
            >
              <FlatIcon type="plus" size={14} color="#ffffff" />
              <span>Beri Rating &amp; Saran Baru</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenNewMentor}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: "var(--brand, #0A2E52)",
                color: "#ffffff",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 6px rgba(10, 46, 82, 0.2)",
              }}
            >
              <FlatIcon type="plus" size={14} color="#ffffff" />
              <span>Tambah Mentor Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Switcher & Filters */}
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
        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "6px", background: "var(--bx-bg-alt)", padding: "4px", borderRadius: "8px", flexWrap: "wrap" }}>
          {[
            { id: "mentors", label: `Katalog Master Mentor (${mentors.length})`, icon: "users" },
            { id: "sessions", label: `Sesi Terjadwal (${sessions.filter(s => s.status !== "selesai").length})`, icon: "calendar" },
            { id: "history", label: "Rekam Jejak Selesai", icon: "clock" },
            { id: "pricing_master", label: `Master Skema Biaya (${pricingSchemes.length})`, icon: "briefcase" },
            { id: "statistics", label: `Statistik Mentoring & Siswa (${mentees.length})`, icon: "chart" },
            { id: "feedbacks", label: `Rating & Saran Kritik (${feedbacks.length})`, icon: "star" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as MainMentoringTab)}
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

        {/* Filter Controls for Mentors */}
        {activeTab === "mentors" && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "6px 12px",
                fontSize: "0.78rem",
                borderRadius: "6px",
                border: "1px solid var(--bx-border)",
                background: "var(--bx-surface)",
                color: "var(--ink)",
                outline: "none",
                fontWeight: 600,
              }}
            >
              <option value="all">Semua Status</option>
              <option value="Aktif">Status Aktif</option>
              <option value="Non-Aktif">Status Non-Aktif</option>
            </select>

            <select
              value={pathFilter}
              onChange={(e) => setPathFilter(e.target.value)}
              style={{
                padding: "6px 12px",
                fontSize: "0.78rem",
                borderRadius: "6px",
                border: "1px solid var(--bx-border)",
                background: "var(--bx-surface)",
                color: "var(--ink)",
                outline: "none",
                fontWeight: 600,
              }}
            >
              <option value="all">Semua Learning Path</option>
              {AVAILABLE_LEARNING_PATHS.map((lp) => (
                <option key={lp.id} value={lp.id}>{lp.code}: {lp.title}</option>
              ))}
            </select>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "var(--bx-surface)",
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
                placeholder="Cari nama, spesialisasi, NIDN..."
                style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.78rem", width: "170px", color: "var(--ink)" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: KATALOG MASTER MENTOR & TARIF 1 JAM / 2 JAM */}
      {/* ============================================================== */}
      {activeTab === "mentors" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "14px",
          }}
        >
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              style={{
                background: "var(--bx-surface, #FFFFFF)",
                border: "1px solid var(--bx-border)",
                borderRadius: "10px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 2px 6px rgba(10, 46, 82, 0.04)",
                opacity: mentor.status === "Non-Aktif" ? 0.75 : 1,
              }}
            >
              <div>
                {/* Header Profile Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--bx-border)" }}
                    />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <h3 style={{ margin: 0, fontSize: "0.98rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                          {mentor.name}
                        </h3>
                        {mentor.personnelType && (
                          <span
                            style={{
                              fontSize: "0.64rem",
                              fontWeight: 800,
                              padding: "1px 6px",
                              borderRadius: "3px",
                              background:
                                mentor.personnelType === "Dosen"
                                  ? "#EDE9FE"
                                  : mentor.personnelType === "Reviewer"
                                  ? "#E0F2FE"
                                  : "#FEF3C7",
                              color:
                                mentor.personnelType === "Dosen"
                                  ? "#6D28D9"
                                  : mentor.personnelType === "Reviewer"
                                  ? "#0369A1"
                                  : "#B45309",
                            }}
                          >
                            {mentor.personnelType}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                        {mentor.title} {mentor.nipOrNidn && <span style={{ opacity: 0.85 }}>({mentor.nipOrNidn})</span>}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--gold-2)", fontWeight: 700 }}>
                        {mentor.institution}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "10px",
                      background: mentor.status === "Aktif" ? "#D1FAE5" : "#FEE2E2",
                      color: mentor.status === "Aktif" ? "#065F46" : "#991B1B",
                    }}
                  >
                    {mentor.status}
                  </span>
                </div>

                {/* Bio Snippet */}
                <p style={{ margin: "0 0 10px", fontSize: "0.76rem", color: "var(--muted)", lineHeight: 1.4 }}>
                  {mentor.bio}
                </p>

                {/* Pricing Box (1 Jam, 2 Jam & Group Clinic) */}
                <div
                  style={{
                    background: "var(--bx-bg-alt)",
                    border: "1px solid var(--bx-border)",
                    borderRadius: "6px",
                    padding: "8px 10px",
                    marginBottom: "10px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                    fontSize: "0.74rem",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--muted)" }}>Sesi 1 Jam: </span>
                    <strong style={{ color: "var(--brand)" }}>
                      Rp {mentor.pricing.hourlyRate.toLocaleString("id-ID")}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: "var(--muted)" }}>Paket 2 Jam: </span>
                    <strong style={{ color: "var(--gold-2)" }}>
                      Rp {mentor.pricing.twoHourRate.toLocaleString("id-ID")}
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: "var(--muted)" }}>Klinik Grup: </span>
                    <strong>Rp {mentor.pricing.groupClinicRate.toLocaleString("id-ID")}/org</strong>
                  </div>

                  <div>
                    {mentor.pricing.freeForSubscriberPro ? (
                      <span style={{ color: "#059669", fontWeight: 700 }}>Gratis Subscriber Pro</span>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>Khusus Berbayar</span>
                    )}
                  </div>
                </div>

                {/* Handled Learning Paths & Single Courses Badges */}
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>
                      Alur &amp; Kurikulum yang Ditangani:
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--gold-2)", fontWeight: 700 }}>
                      {mentor.handledLearningPathIds.length} Path • {(mentor.handledCourseIds || []).length} Single
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {mentor.handledLearningPathIds.map((pId) => {
                      const lp = AVAILABLE_LEARNING_PATHS.find((item) => item.id === pId);
                      return (
                        <span
                          key={pId}
                          title={lp ? `${lp.code}: ${lp.title}` : pId}
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: "rgba(10, 46, 82, 0.08)",
                            color: "var(--brand)",
                            border: "1px solid rgba(10, 46, 82, 0.15)",
                          }}
                        >
                          🛤️ {lp ? lp.code : pId}
                        </span>
                      );
                    })}

                    {(mentor.handledCourseIds || []).map((cId) => {
                      const crs = MOCK_LMS_COURSES.find((item) => item.id === cId);
                      return (
                        <span
                          key={cId}
                          title={crs ? crs.title : cId}
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: "rgba(201, 150, 46, 0.1)",
                            color: "var(--gold-2)",
                            border: "1px solid rgba(201, 150, 46, 0.25)",
                          }}
                        >
                          📘 {crs ? (crs.title.length > 18 ? crs.title.slice(0, 18) + "..." : crs.title) : cId}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Mentoring Statistics Strip for This Mentor */}
                {(() => {
                  const stats = getMentorStats(mentor.id);
                  return (
                    <div
                      style={{
                        background: "var(--bx-bg-alt)",
                        border: "1px solid var(--bx-border)",
                        borderRadius: "8px",
                        padding: "9px 11px",
                        marginBottom: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--brand)", fontWeight: 800 }}>
                          Statistik Siswa &amp; Rekam Jejak Mentee:
                        </span>
                        <button
                          type="button"
                          onClick={() => setViewingMentorStats(mentor)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--gold-2)",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            cursor: "pointer",
                            padding: 0,
                            textDecoration: "underline",
                          }}
                        >
                          Lihat Roster Siswa ({stats.total}) →
                        </button>
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", fontSize: "0.7rem" }}>
                        <span
                          style={{
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: "rgba(10, 46, 82, 0.08)",
                            color: "var(--brand)",
                            fontWeight: 700,
                          }}
                        >
                          👥 {stats.total} Pengguna Layanan
                        </span>

                        <span
                          style={{
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: "#D1FAE5",
                            color: "#065F46",
                            fontWeight: 700,
                          }}
                        >
                          ✅ {stats.sukses} Lulus ({stats.successRate}%)
                        </span>

                        <span
                          style={{
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: "#FEF3C7",
                            color: "#B45309",
                            fontWeight: 700,
                          }}
                        >
                          ⏳ {stats.lama} Lama/Tertunda
                        </span>

                        <span
                          style={{
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: "#FEE2E2",
                            color: "#991B1B",
                            fontWeight: 700,
                          }}
                        >
                          ❌ {stats.gagal} Gagal
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Schedule & Rating Info */}
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Jadwal: <strong>{mentor.availableDays}</strong></span>
                  <button
                    type="button"
                    onClick={() => setViewingMentorFeedbacks(mentor)}
                    title="Klik untuk melihat detail rating dan saran kritik"
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: "0.72rem",
                      color: "var(--brand)",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      fontWeight: 700,
                    }}
                  >
                    <span>⭐</span>
                    <span>{getMentorRatingSummary(mentor.id).avgRating}</span>
                    <span style={{ color: "var(--muted)", fontWeight: 500 }}>
                      ({getMentorRatingSummary(mentor.id).count} ulasan)
                    </span>
                  </button>
                </div>
              </div>

              {/* Actions Footer */}
              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "10px",
                  borderTop: "1px solid var(--bx-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {/* Check Switch for Aktif / Non-Aktif */}
                  <CheckSwitch
                    checked={mentor.status === "Aktif"}
                    onChange={() => handleToggleMentorStatus(mentor.id)}
                    labelActive="Aktif"
                    labelInactive="Non-Aktif"
                  />

                  <button
                    type="button"
                    onClick={() => handleDeleteMentor(mentor.id)}
                    title="Hapus mentor dari sistem"
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid #FCA5A5",
                      background: "transparent",
                      color: "#DC2626",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Hapus
                  </button>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setViewingMentorStats(mentor)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "5px",
                      border: "1px solid var(--bx-border)",
                      background: "var(--bx-bg-alt)",
                      color: "var(--brand)",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Roster Siswa
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewingMentorFeedbacks(mentor)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "5px",
                      border: "1px solid rgba(201, 150, 46, 0.4)",
                      background: "rgba(201, 150, 46, 0.08)",
                      color: "var(--gold-2)",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Ulasan &amp; Saran ({getMentorRatingSummary(mentor.id).count})
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingMentor(mentor);
                      setSliderTab("profile");
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "5px",
                      border: "none",
                      background: "var(--brand)",
                      color: "#ffffff",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Kelola &amp; Edit (Slider 95%)
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredMentors.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                padding: "36px",
                textAlign: "center",
                background: "var(--bx-surface)",
                borderRadius: "8px",
                border: "1px dashed var(--bx-border)",
                color: "var(--muted)",
              }}
            >
              Tidak ditemukan mentor dengan filter yang dipilih.
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: DAFTAR SESI BOOKING SISWA */}
      {/* ============================================================== */}
      {activeTab === "sessions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {sessions.map((ses) => (
            <div
              key={ses.id}
              style={{
                background: "var(--bx-surface, #FFFFFF)",
                border: "1px solid var(--bx-border)",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background:
                        ses.status === "berlangsung" ? "#FEE2E2" :
                        ses.status === "mendatang" ? "#FEF3C7" :
                        ses.status === "selesai" ? "#D1FAE5" : "var(--bx-bg-alt)",
                      color:
                        ses.status === "berlangsung" ? "#DC2626" :
                        ses.status === "mendatang" ? "#B45309" :
                        ses.status === "selesai" ? "#065F46" : "var(--muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    {ses.status}
                  </span>

                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: ses.durationOption === "2_hours" ? "var(--gold)" : "var(--brand)",
                      color: "#ffffff",
                    }}
                  >
                    {ses.durationOption === "2_hours" ? "Paket 2 Jam (120m)" : "Sesi 1 Jam (60m)"}
                  </span>

                  <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                    📅 {ses.date} • ⏰ {ses.time} ({ses.room})
                  </span>
                </div>

                <h3 style={{ margin: "2px 0 4px", fontSize: "1rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                  {ses.topic}
                </h3>

                <div style={{ fontSize: "0.78rem", color: "var(--ink)" }}>
                  Mentor: <strong>{ses.mentorName}</strong> • Siswa: <strong>{ses.studentName}</strong> • Jalur: <strong>{ses.learningPathTitle}</strong>
                </div>

                <div style={{ fontSize: "0.72rem", color: "var(--gold-2)", fontWeight: 700, marginTop: "2px" }}>
                  Tarif Sesi: Rp {ses.fee.toLocaleString("id-ID")} • Ruang: <a href={ses.meetingLink} target="_blank" rel="noreferrer" style={{ color: "var(--brand)", textDecoration: "underline" }}>Buka Google Meet</a>
                </div>

                {ses.notes && (
                  <div style={{ marginTop: "6px", fontSize: "0.74rem", color: "var(--muted)", fontStyle: "italic" }}>
                    Catatan Mentor: &quot;{ses.notes}&quot;
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setNotingSession(ses);
                    setMentorNotes(ses.notes || "");
                  }}
                  style={{ padding: "6px 12px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)", fontSize: "0.76rem", cursor: "pointer", fontWeight: 600 }}
                >
                  Catatan Sesi
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setReschedulingSession(ses);
                    setNewTime(ses.time);
                  }}
                  style={{ padding: "6px 12px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontSize: "0.76rem", cursor: "pointer", color: "var(--brand)", fontWeight: 600 }}
                >
                  Reschedule Sesi
                </button>

                {ses.status !== "dibatalkan" && (
                  <button
                    type="button"
                    onClick={() => handleCancelSession(ses.id)}
                    style={{ padding: "6px 12px", borderRadius: "5px", border: "1px solid #FCA5A5", background: "transparent", fontSize: "0.76rem", cursor: "pointer", color: "#DC2626", fontWeight: 600 }}
                  >
                    Batalkan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: REKAM JEJAK MENTORING SELESAI */}
      {/* ============================================================== */}
      {activeTab === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {sessions.filter((s) => s.status === "selesai").map((ses) => (
            <div
              key={ses.id}
              style={{
                background: "var(--bx-surface)",
                border: "1px solid var(--bx-border)",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "#D1FAE5", color: "#065F46" }}>
                    Selesai
                  </span>
                  <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                    {ses.date} • {ses.time} ({ses.durationMinutes} menit)
                  </span>
                </div>
                <h4 style={{ margin: "2px 0", color: "var(--brand)" }}>{ses.topic}</h4>
                <div style={{ fontSize: "0.76rem", color: "var(--muted)" }}>
                  Mentor: <strong>{ses.mentorName}</strong> | Siswa: <strong>{ses.studentName}</strong> ({ses.learningPathTitle})
                </div>
                {ses.notes && (
                  <div style={{ marginTop: "6px", fontSize: "0.74rem", color: "var(--ink)", background: "var(--bx-bg-alt)", padding: "6px 10px", borderRadius: "4px" }}>
                    Hasil &amp; Arahan: {ses.notes}
                  </div>
                )}
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, color: "var(--brand)", fontSize: "0.88rem" }}>
                  Rp {ses.fee.toLocaleString("id-ID")}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--gold-2)", fontWeight: 700 }}>
                  Rating Siswa: ⭐ {ses.studentFeedbackRating || 5}/5
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: MASTER SKEMA BIAYA & REVENUE SHARE MENTORING */}
      {/* ============================================================== */}
      {activeTab === "pricing_master" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Top Control Bar for Master Pricing */}
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 2px", fontSize: "0.98rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                Master Standar Tarif &amp; Skema Bagi Hasil Mentoring
              </h3>
              <p style={{ margin: 0, fontSize: "0.76rem", color: "var(--muted)" }}>
                Data master acuan tarif sesi 1 jam, paket 2 jam intensif, pembagian honor mentor vs kas platform, serta batas klinik grup.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--bx-surface)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
              >
                <FlatIcon type="search" size={13} color="var(--muted)" />
                <input
                  type="text"
                  value={pricingSchemeSearch}
                  onChange={(e) => setPricingSchemeSearch(e.target.value)}
                  placeholder="Cari kode / nama skema..."
                  style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.78rem", width: "170px", color: "var(--ink)" }}
                />
              </div>

              <button
                type="button"
                onClick={handleOpenNewPricingScheme}
                style={{
                  padding: "7px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: "var(--brand)",
                  color: "#ffffff",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FlatIcon type="plus" size={13} color="#ffffff" />
                <span>Tambah Skema Biaya</span>
              </button>
            </div>
          </div>

          {/* Grid of Pricing Schemes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "14px",
            }}
          >
            {filteredPricingSchemes.map((sch) => (
              <div
                key={sch.id}
                style={{
                  background: "var(--bx-surface, #FFFFFF)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "10px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 6px rgba(10, 46, 82, 0.04)",
                  opacity: sch.status === "Non-Aktif" ? 0.75 : 1,
                }}
              >
                <div>
                  {/* Header Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: "var(--brand)",
                            color: "#ffffff",
                          }}
                        >
                          {sch.code}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>
                          {sch.targetRole}
                        </span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: "0.96rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                        {sch.name}
                      </h4>
                    </div>

                    <CheckSwitch
                      checked={sch.status === "Aktif"}
                      onChange={() => handleTogglePricingSchemeStatus(sch.id)}
                      labelActive="Aktif"
                      labelInactive="Non-Aktif"
                    />
                  </div>

                  {/* Description */}
                  <p style={{ margin: "0 0 12px", fontSize: "0.76rem", color: "var(--muted)", lineHeight: 1.4 }}>
                    {sch.description}
                  </p>

                  {/* Tarif Grid */}
                  <div
                    style={{
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "6px",
                      padding: "10px",
                      marginBottom: "12px",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      fontSize: "0.75rem",
                    }}
                  >
                    <div>
                      <span style={{ color: "var(--muted)" }}>Sesi 1 Jam (60m): </span>
                      <strong style={{ color: "var(--brand)", display: "block", fontSize: "0.85rem" }}>
                        Rp {sch.hourlyRate.toLocaleString("id-ID")}
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: "var(--muted)" }}>Paket 2 Jam (120m): </span>
                      <strong style={{ color: "var(--gold-2)", display: "block", fontSize: "0.85rem" }}>
                        Rp {sch.twoHourRate.toLocaleString("id-ID")}
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: "var(--muted)" }}>Klinik Grup: </span>
                      <strong style={{ display: "block" }}>
                        Rp {sch.groupClinicRate.toLocaleString("id-ID")}/mentee
                      </strong>
                    </div>

                    <div>
                      <span style={{ color: "var(--muted)" }}>Fasilitas Pro: </span>
                      <strong style={{ color: sch.freeForSubscriberPro ? "#059669" : "var(--muted)", display: "block" }}>
                        {sch.freeForSubscriberPro ? "Gratis Subscriber Pro" : "Khusus Berbayar"}
                      </strong>
                    </div>
                  </div>

                  {/* Bagi Hasil / Revenue Share Visual */}
                  <div style={{ background: "rgba(10, 46, 82, 0.04)", padding: "8px 10px", borderRadius: "6px", border: "1px solid rgba(10, 46, 82, 0.1)", marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: "4px" }}>
                      <span>Honor Mentor: <strong>{sch.mentorSharePct}%</strong></span>
                      <span>Kas Platform LMS: <strong>{sch.platformSharePct}%</strong></span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "var(--bx-border)", borderRadius: "3px", overflow: "hidden", display: "flex" }}>
                      <div style={{ width: `${sch.mentorSharePct}%`, height: "100%", background: "var(--brand)" }} />
                      <div style={{ width: `${sch.platformSharePct}%`, height: "100%", background: "var(--gold)" }} />
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div
                  style={{
                    paddingTop: "10px",
                    borderTop: "1px solid var(--bx-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "6px",
                  }}
                >
                  <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                    Update: {sch.updatedAt}
                  </span>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => handleEditPricingScheme(sch)}
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
                      Edit / Update
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePricingScheme(sch.id)}
                      style={{
                        padding: "5px 8px",
                        borderRadius: "5px",
                        border: "1px solid #FCA5A5",
                        background: "transparent",
                        color: "#DC2626",
                        fontSize: "0.74rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPricingSchemes.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: "36px",
                  textAlign: "center",
                  background: "var(--bx-surface)",
                  borderRadius: "8px",
                  border: "1px dashed var(--bx-border)",
                  color: "var(--muted)",
                }}
              >
                Tidak ada master skema biaya yang cocok dengan kata kunci pencarian.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: STATISTIK MENTORING & SISWA MENTEE (DENGAN AVATAR) */}
      {/* ============================================================== */}
      {activeTab === "statistics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* 4 Summary KPI Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            <div
              style={{
                background: "var(--bx-surface, #FFFFFF)",
                border: "1px solid var(--bx-border)",
                borderRadius: "8px",
                padding: "14px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: "0.74rem", color: "var(--muted)", fontWeight: 600 }}>Total Siswa Pengguna Layanan</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--brand)", margin: "4px 0" }}>
                {overallStats.total} Siswa
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                Tersebar di {mentors.length} mentor resmi
              </div>
            </div>

            <div
              style={{
                background: "var(--bx-surface, #FFFFFF)",
                border: "1px solid var(--bx-border)",
                borderRadius: "8px",
                padding: "14px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: "0.74rem", color: "#065F46", fontWeight: 700 }}>Siswa Sukses / Lulus (Lulusan)</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669", margin: "4px 0" }}>
                {overallStats.sukses} Siswa ({overallStats.successRate}%)
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                Lulus proyek akhir &amp; hired di industri
              </div>
            </div>

            <div
              style={{
                background: "var(--bx-surface, #FFFFFF)",
                border: "1px solid var(--bx-border)",
                borderRadius: "8px",
                padding: "14px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: "0.74rem", color: "#B45309", fontWeight: 700 }}>Proses Bimbingan Lama (&gt;40 Hari)</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#D97706", margin: "4px 0" }}>
                {overallStats.lama} Siswa
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                Perlu asistensi remidial &amp; perbaikan kode
              </div>
            </div>

            <div
              style={{
                background: "var(--bx-surface, #FFFFFF)",
                border: "1px solid var(--bx-border)",
                borderRadius: "8px",
                padding: "14px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ fontSize: "0.74rem", color: "#991B1B", fontWeight: 700 }}>Siswa Gagal / Drop Out</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#DC2626", margin: "4px 0" }}>
                {overallStats.gagal} Siswa
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                Tidak menyelesaikan uji verifikasi mandiri
              </div>
            </div>
          </div>

          {/* Filter Bar for Statistics */}
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
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <select
                value={statMentorFilter}
                onChange={(e) => setStatMentorFilter(e.target.value)}
                style={{
                  padding: "6px 12px",
                  fontSize: "0.78rem",
                  borderRadius: "6px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-surface)",
                  color: "var(--ink)",
                  outline: "none",
                  fontWeight: 600,
                }}
              >
                <option value="all">Semua Pembimbing / Mentor</option>
                {mentors.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.title})</option>
                ))}
              </select>

              <select
                value={statOutcomeFilter}
                onChange={(e) => setStatOutcomeFilter(e.target.value)}
                style={{
                  padding: "6px 12px",
                  fontSize: "0.78rem",
                  borderRadius: "6px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-surface)",
                  color: "var(--ink)",
                  outline: "none",
                  fontWeight: 600,
                }}
              >
                <option value="all">Semua Status Kelulusan</option>
                <option value="sukses">Sukses / Lulus Saja</option>
                <option value="lama">Proses Bimbingan Lama Saja</option>
                <option value="gagal">Gagal / Drop Out Saja</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "var(--bx-surface)",
                border: "1px solid var(--bx-border)",
                borderRadius: "6px",
                padding: "5px 10px",
              }}
            >
              <FlatIcon type="search" size={13} color="var(--muted)" />
              <input
                type="text"
                value={statSearchQuery}
                onChange={(e) => setStatSearchQuery(e.target.value)}
                placeholder="Cari nama siswa, NIM, email, alur..."
                style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.78rem", width: "190px", color: "var(--ink)" }}
              />
            </div>
          </div>

          {/* Mentee List Table with AVATARS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredMentees.map((mte) => (
              <div
                key={mte.id}
                style={{
                  background: "var(--bx-surface, #FFFFFF)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "8px",
                  padding: "14px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "14px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <div style={{ display: "flex", gap: "14px", alignItems: "center", flex: 1, minWidth: "280px" }}>
                  {/* Student Avatar */}
                  <div style={{ position: "relative" }}>
                    <img
                      src={mte.studentAvatar}
                      alt={mte.studentName}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border:
                          mte.status === "sukses"
                            ? "2px solid #059669"
                            : mte.status === "lama"
                            ? "2px solid #D97706"
                            : "2px solid #DC2626",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-2px",
                        right: "-2px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background:
                          mte.status === "sukses" ? "#059669" : mte.status === "lama" ? "#D97706" : "#DC2626",
                        color: "#ffffff",
                        fontSize: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                      }}
                    >
                      {mte.status === "sukses" ? "✓" : mte.status === "lama" ? "⏳" : "✕"}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", color: "var(--brand)" }}>
                        {mte.studentName}
                      </h4>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                        ({mte.studentNim})
                      </span>
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--ink)", marginTop: "2px" }}>
                      {mte.studentEmail} • Jalur: <strong>{mte.learningPathTitle}</strong>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--gold-2)", marginTop: "2px" }}>
                      Mentor Pembimbing: <strong>{mte.mentorName}</strong> ({mte.totalSessionsAttended} Sesi • {mte.durationDays} Hari Bimbingan)
                    </div>
                    {mte.notes && (
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontStyle: "italic", marginTop: "4px" }}>
                        &quot;{mte.notes}&quot;
                      </div>
                    )}
                  </div>
                </div>

                {/* Outcome & Grade Right Column */}
                <div style={{ textAlign: "right", minWidth: "180px" }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "3px 10px",
                      borderRadius: "12px",
                      background:
                        mte.status === "sukses"
                          ? "#D1FAE5"
                          : mte.status === "lama"
                          ? "#FEF3C7"
                          : "#FEE2E2",
                      color:
                        mte.status === "sukses"
                          ? "#065F46"
                          : mte.status === "lama"
                          ? "#B45309"
                          : "#991B1B",
                      display: "inline-block",
                      marginBottom: "4px",
                    }}
                  >
                    {mte.statusLabel}
                  </span>

                  {mte.finalGrade && (
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink)" }}>
                      Nilai: <span style={{ color: "var(--brand)" }}>{mte.finalGrade}</span>
                    </div>
                  )}

                  {mte.careerOutcome && (
                    <div style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700, marginTop: "2px" }}>
                      🎯 {mte.careerOutcome}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredMentees.length === 0 && (
              <div
                style={{
                  padding: "36px",
                  textAlign: "center",
                  background: "var(--bx-surface)",
                  borderRadius: "8px",
                  border: "1px dashed var(--bx-border)",
                  color: "var(--muted)",
                }}
              >
                Tidak ditemukan data mentee yang sesuai dengan filter yang dipilih.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: RATING, REVIEW & SARAN KRITIK (DENGAN AVATAR & RESPONSE) */}
      {/* ============================================================== */}
      {activeTab === "feedbacks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Header Benchmark & Aspect Breakdown Card */}
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "20px 24px",
              boxShadow: "0 2px 8px rgba(10, 46, 82, 0.04)",
              display: "grid",
              gridTemplateColumns: "1fr 1.3fr 1.3fr",
              gap: "24px",
              alignItems: "center",
            }}
          >
            {/* Left: Overall Rating Big Number */}
            <div style={{ borderRight: "1px solid var(--bx-border)", paddingRight: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Rata-Rata Rating Platform
              </div>
              <div style={{ fontSize: "3.2rem", fontWeight: 900, color: "var(--brand)", lineHeight: 1.1, margin: "6px 0" }}>
                {overallRatingSummary.avgRating}
                <span style={{ fontSize: "1.2rem", color: "var(--muted)", fontWeight: 500 }}>/5.0</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "3px", marginBottom: "6px" }}>
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <span key={starIdx} style={{ fontSize: "1.2rem", color: "#F59E0B" }}>
                    ⭐
                  </span>
                ))}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                Berdasarkan <strong>{overallRatingSummary.count}</strong> ulasan &amp; saran terverifikasi mentee
              </div>
            </div>

            {/* Middle: Breakdown 3 Aspek Penilaian */}
            <div style={{ borderRight: "1px solid var(--bx-border)", paddingRight: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--brand)" }}>
                Metrik Aspek Kualitas Bimbingan:
              </div>

              {/* Aspek 1: Kejelasan Materi */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", fontWeight: 600, marginBottom: "3px" }}>
                  <span>🎯 Kejelasan Materi &amp; Solusi</span>
                  <strong style={{ color: "var(--brand)" }}>{overallRatingSummary.clarityAvg} / 5.0</strong>
                </div>
                <div style={{ height: "7px", background: "var(--bx-bg-alt)", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(parseFloat(overallRatingSummary.clarityAvg) / 5) * 100}%`,
                      height: "100%",
                      background: "var(--brand)",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>

              {/* Aspek 2: Ketepatan Waktu */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", fontWeight: 600, marginBottom: "3px" }}>
                  <span>⏱️ Ketepatan Waktu Sesi (On-Time)</span>
                  <strong style={{ color: "var(--gold-2)" }}>{overallRatingSummary.punctualityAvg} / 5.0</strong>
                </div>
                <div style={{ height: "7px", background: "var(--bx-bg-alt)", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(parseFloat(overallRatingSummary.punctualityAvg) / 5) * 100}%`,
                      height: "100%",
                      background: "var(--gold, #C9962E)",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>

              {/* Aspek 3: Kedalaman Solusi Teknis */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", fontWeight: 600, marginBottom: "3px" }}>
                  <span>💡 Kedalaman Solusi Teknis &amp; Industri</span>
                  <strong style={{ color: "#059669" }}>{overallRatingSummary.technicalDepthAvg} / 5.0</strong>
                </div>
                <div style={{ height: "7px", background: "var(--bx-bg-alt)", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(parseFloat(overallRatingSummary.technicalDepthAvg) / 5) * 100}%`,
                      height: "100%",
                      background: "#059669",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Star Histogram 5★ to 1★ */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--brand)", marginBottom: "2px" }}>
                Distribusi Rating Bintang:
              </div>

              {[5, 4, 3, 2, 1].map((stars) => {
                const item = overallRatingSummary.dist[stars];
                return (
                  <div key={stars} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.72rem" }}>
                    <span style={{ width: "55px", fontWeight: 700, color: "var(--ink)", display: "flex", alignItems: "center", gap: "3px" }}>
                      <span>{stars}</span>
                      <span style={{ color: "#F59E0B" }}>⭐</span>
                    </span>
                    <div style={{ flex: 1, height: "7px", background: "var(--bx-bg-alt)", borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${item.pct}%`,
                          height: "100%",
                          background: stars >= 4 ? "#059669" : stars === 3 ? "#D97706" : "#DC2626",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <span style={{ width: "50px", textAlign: "right", color: "var(--muted)", fontWeight: 600 }}>
                      {item.count} ({item.pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Toolbar */}
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
              {/* Mentor Filter */}
              <select
                value={feedbackMentorFilter}
                onChange={(e) => setFeedbackMentorFilter(e.target.value)}
                style={{
                  padding: "7px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-surface)",
                  color: "var(--ink)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  outline: "none",
                }}
              >
                <option value="all">Semua Mentor ({mentors.length})</option>
                {mentors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({getMentorRatingSummary(m.id).count} ulasan)
                  </option>
                ))}
              </select>

              {/* Rating Star Filter */}
              <select
                value={feedbackRatingFilter}
                onChange={(e) => setFeedbackRatingFilter(e.target.value)}
                style={{
                  padding: "7px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-surface)",
                  color: "var(--ink)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  outline: "none",
                }}
              >
                <option value="all">Semua Rating Bintang</option>
                <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
                <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
                <option value="3">⭐⭐⭐ (3 Bintang)</option>
                <option value="2">⭐⭐ (2 Bintang)</option>
                <option value="1">⭐ (1 Bintang)</option>
              </select>

              {/* Search input */}
              <div style={{ flex: 1, minWidth: "220px" }}>
                <input
                  type="text"
                  value={feedbackSearchQuery}
                  onChange={(e) => setFeedbackSearchQuery(e.target.value)}
                  placeholder="Cari nama siswa, NIM, topik, saran atau kritik..."
                  style={{
                    width: "100%",
                    padding: "7px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-surface)",
                    color: "var(--ink)",
                    fontSize: "0.8rem",
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenNewFeedbackModal}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: "var(--brand)",
                color: "#ffffff",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FlatIcon type="plus" size={14} color="#ffffff" />
              <span>Tulis Rating &amp; Saran Baru</span>
            </button>
          </div>

          {/* Feedback & Critique Cards List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredFeedbacks.map((fb) => (
              <div
                key={fb.id}
                style={{
                  background: "var(--bx-surface, #FFFFFF)",
                  border: fb.status === "pinned" ? "2px solid var(--gold, #C9962E)" : "1px solid var(--bx-border)",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  boxShadow: "0 2px 6px rgba(10, 46, 82, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Header Row: Student Avatar, Name, Mentor, Topic, Date & Pinned Badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <img
                      src={fb.studentAvatar}
                      alt={fb.studentName}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid var(--brand)",
                        background: "var(--bx-bg-alt)",
                      }}
                    />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--brand)" }}>
                          {fb.studentName}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 500 }}>
                          ({fb.studentNim})
                        </span>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "10px",
                            background: "#D1FAE5",
                            color: "#065F46",
                          }}
                        >
                          Mentee Terverifikasi
                        </span>
                        {fb.status === "pinned" && (
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              padding: "2px 8px",
                              borderRadius: "10px",
                              background: "#FEF3C7",
                              color: "#B45309",
                              border: "1px solid #FCD34D",
                            }}
                          >
                            📌 Ulasan Unggulan
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "3px", fontSize: "0.76rem", color: "var(--ink)", flexWrap: "wrap" }}>
                        <span>
                          Menilai Mentor: <strong>{fb.mentorName}</strong>
                        </span>
                        <span>•</span>
                        <span style={{ color: "var(--muted)" }}>
                          Sesi: <strong>{fb.sessionTopic}</strong>
                        </span>
                        <span>•</span>
                        <span style={{ color: "var(--muted)" }}>{fb.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars & Badges */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "flex-end" }}>
                      <span style={{ fontSize: "1rem", color: "#F59E0B" }}>
                        {"⭐".repeat(Math.round(fb.rating))}
                      </span>
                      <strong style={{ fontSize: "1.1rem", color: "var(--brand)" }}>{fb.rating}.0</strong>
                    </div>

                    <div style={{ display: "flex", gap: "6px", marginTop: "4px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: "rgba(10, 46, 82, 0.08)",
                          color: "var(--brand)",
                        }}
                      >
                        Kejelasan: {fb.aspectRatings.clarity}/5
                      </span>
                      <span
                        style={{
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: "rgba(201, 150, 46, 0.12)",
                          color: "var(--gold-2)",
                        }}
                      >
                        Ketepatan: {fb.aspectRatings.punctuality}/5
                      </span>
                      <span
                        style={{
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: "#D1FAE5",
                          color: "#065F46",
                        }}
                      >
                        Solusi: {fb.aspectRatings.technicalDepth}/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* SARAN DAN KRITIK KONSTRUKTIF CALLOUT BOX */}
                <div
                  style={{
                    background: "rgba(245, 158, 11, 0.06)",
                    borderLeft: "4px solid #F59E0B",
                    borderRadius: "0 6px 6px 0",
                    padding: "10px 14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.85rem" }}>💡</span>
                    <strong style={{ fontSize: "0.78rem", color: "#B45309" }}>
                      Saran &amp; Kritik Konstruktif Siswa:
                    </strong>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--ink)", lineHeight: 1.5, fontStyle: "italic" }}>
                    &quot;{fb.critiqueAndSuggestions}&quot;
                  </div>
                </div>

                {/* TESTIMONI PENGALAMAN MAHASISWA */}
                {fb.testimonial && (
                  <div
                    style={{
                      background: "rgba(5, 150, 105, 0.05)",
                      borderLeft: "4px solid #059669",
                      borderRadius: "0 6px 6px 0",
                      padding: "8px 14px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                      <span style={{ fontSize: "0.85rem" }}>💬</span>
                      <strong style={{ fontSize: "0.76rem", color: "#065F46" }}>
                        Testimoni Mahasiswa:
                      </strong>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--ink)", lineHeight: 1.4 }}>
                      &quot;{fb.testimonial}&quot;
                    </div>
                  </div>
                )}

                {/* TANGGAPAN RESMI DARI MENTOR */}
                {fb.mentorReply ? (
                  <div
                    style={{
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      marginLeft: "18px",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "0.8rem" }}>🛡️</span>
                        <strong style={{ fontSize: "0.76rem", color: "var(--brand)" }}>
                          Tanggapan Resmi {fb.mentorName}:
                        </strong>
                      </div>
                      <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                        {fb.mentorReplyDate || "Baru saja"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--ink)", lineHeight: 1.45 }}>
                      {fb.mentorReply}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: "var(--bx-bg-alt)",
                      border: "1px dashed var(--bx-border)",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      marginLeft: "18px",
                      fontSize: "0.74rem",
                      color: "var(--muted)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Belum ada balasan tanggapan resmi dari mentor untuk kritik ini.</span>
                    <button
                      type="button"
                      onClick={() => handleOpenReplyModal(fb)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--brand)",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "0.74rem",
                        textDecoration: "underline",
                      }}
                    >
                      Beri Tanggapan Sekarang →
                    </button>
                  </div>
                )}

                {/* Footer Review Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                    paddingTop: "6px",
                    borderTop: "1px solid var(--bx-border)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleTogglePinFeedback(fb.id)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      border: "1px solid var(--bx-border)",
                      background: "transparent",
                      color: fb.status === "pinned" ? "#B45309" : "var(--muted)",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {fb.status === "pinned" ? "Lepas Pin Ulasan" : "Pin Sebagai Unggulan"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenReplyModal(fb)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "5px",
                      border: "1px solid var(--bx-border)",
                      background: "var(--bx-bg-alt)",
                      color: "var(--brand)",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {fb.mentorReply ? "Edit Tanggapan Mentor" : "Balas Saran &amp; Kritik"}
                  </button>
                </div>
              </div>
            ))}

            {filteredFeedbacks.length === 0 && (
              <div
                style={{
                  padding: "36px",
                  textAlign: "center",
                  background: "var(--bx-surface)",
                  borderRadius: "8px",
                  border: "1px dashed var(--bx-border)",
                  color: "var(--muted)",
                }}
              >
                Tidak ditemukan ulasan atau saran kritik yang sesuai dengan filter yang dipilih.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SLIDER 95% DRAWER: MENTOR STUDIO & PRICING CONFIG */}
      {/* ============================================================== */}
      {editingMentor && (
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
            if (e.target === e.currentTarget) setEditingMentor(null);
          }}
        >
          <div
            className="mentor-studio-slider-95"
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
            {/* Top Bar of Mentor Studio */}
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
                  SLIDER 95% • MENTOR STUDIO &amp; PRICING
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
                  {editingMentor.name || "Mentor Baru"}
                </h3>
                <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                  ({editingMentor.title} • Status: {editingMentor.status})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setEditingMentor(null)}
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

            {/* Slider Tabs Navigation */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid var(--bx-border)",
                background: "var(--bx-surface)",
                flexShrink: 0,
                padding: "0 20px",
                gap: "6px",
                overflowX: "auto",
              }}
            >
              {[
                { id: "profile", label: "1. Profil & Identitas SIM-SDM" },
                { id: "paths", label: `2. Alokasi Learning Path (${editingMentor.handledLearningPathIds.length}) & Kurikulum Single (${(editingMentor.handledCourseIds || []).length})` },
                { id: "pricing", label: "3. Tarif Sesi (1 Jam & 2 Jam)" },
                { id: "schedule", label: "4. Jadwal & Ruang Virtual" },
                { id: "status", label: "5. Status Layanan & Kuota" },
                { id: "statistics", label: `6. Statistik & Mentee Siswa (${getMentorStats(editingMentor.id).total})` },
                { id: "feedbacks", label: `7. Rating & Saran Kritik (${getMentorRatingSummary(editingMentor.id).count})` },
              ].map((tab) => {
                const isActive = sliderTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSliderTab(tab.id as MentorSliderTab)}
                    style={{
                      padding: "12px 16px",
                      border: "none",
                      borderBottom: isActive ? "3px solid var(--gold, #C9962E)" : "3px solid transparent",
                      background: "transparent",
                      color: isActive ? "var(--brand, #0A2E52)" : "var(--muted)",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Slider Body Form */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              {/* TAB 1: PROFIL & IDENTITAS SIM-SDM (STATIS KECUALI KETERANGAN TAMBAHAN) */}
              {sliderTab === "profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1200px" }}>
                  {/* Sourcing Dropdown from Mock Personnel Directory */}
                  <div
                    style={{
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      padding: "14px 16px",
                      borderRadius: "8px",
                    }}
                  >
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                      Hubungkan Data Profil dari Direktori Kepegawaian Akademik (Dosen / Reviewer / Karyawan SIM-SDM)
                    </label>
                    <select
                      value={editingMentor.staffId || ""}
                      onChange={(e) => handleSelectPersonnel(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--bx-border)",
                        background: "var(--bx-surface)",
                        color: "var(--ink)",
                        fontSize: "0.84rem",
                        fontWeight: 600,
                        outline: "none",
                      }}
                    >
                      <option value="" disabled>-- Pilih Karyawan / Dosen / Reviewer Resmi --</option>
                      {MOCK_PERSONNEL_DIRECTORY.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name} — [{staff.personnelType}] {staff.nipOrNidn} ({staff.officialTitle})
                        </option>
                      ))}
                    </select>
                    <div style={{ fontSize: "0.73rem", color: "var(--muted)", marginTop: "6px" }}>
                      Pilih tenaga pendidik atau evaluator terverifikasi. Data resmi (nama, gelar, NIDN/NIP, institusi, foto) otomatis dimuat dan terkunci secara statis sesuai arsip SIM-SDM.
                    </div>
                  </div>

                  {/* Official Static Profile Card (Terkunci SIM-SDM) */}
                  <div
                    style={{
                      border: "1px solid var(--bx-border)",
                      borderRadius: "8px",
                      background: "var(--bx-surface)",
                      padding: "18px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "14px",
                        borderBottom: "1px solid var(--bx-border)",
                        paddingBottom: "10px",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: "4px",
                            background: "#059669",
                            color: "#FFFFFF",
                          }}
                        >
                          Data Kepegawaian Resmi Terverifikasi (Terkunci SIM-SDM)
                        </span>
                        <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                          Profil statis dan tidak dapat diubah manual untuk menjaga keaslian data civitas.
                        </span>
                      </div>

                      {editingMentor.personnelType && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: "12px",
                            background:
                              editingMentor.personnelType === "Dosen"
                                ? "#EDE9FE"
                                : editingMentor.personnelType === "Reviewer"
                                ? "#E0F2FE"
                                : "#FEF3C7",
                            color:
                              editingMentor.personnelType === "Dosen"
                                ? "#6D28D9"
                                : editingMentor.personnelType === "Reviewer"
                                ? "#0369A1"
                                : "#B45309",
                          }}
                        >
                          {editingMentor.personnelType}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "18px", alignItems: "flex-start" }}>
                      {/* Avatar Static Preview */}
                      <div style={{ textAlign: "center" }}>
                        <img
                          src={editingMentor.avatar}
                          alt={editingMentor.name}
                          style={{
                            width: "96px",
                            height: "96px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "3px solid var(--brand)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                          }}
                        />
                        <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "6px", fontWeight: 600 }}>
                          Foto Resmi SIM-SDM
                        </div>
                      </div>

                      {/* Static Detail Grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.8rem" }}>
                        <div>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Nama Lengkap &amp; Gelar Resmi (Statis):</div>
                          <strong style={{ fontSize: "0.96rem", color: "var(--brand)" }}>{editingMentor.name}</strong>
                        </div>

                        <div>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Nomor Induk Pegawai / Dosen (Statis):</div>
                          <strong style={{ color: "var(--ink)" }}>{editingMentor.nipOrNidn || "NIDN / NIP Terverifikasi"}</strong>
                        </div>

                        <div>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Jabatan Fungsional / Posisi (Statis):</div>
                          <div style={{ color: "var(--ink)", fontWeight: 600 }}>{editingMentor.title}</div>
                        </div>

                        <div>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Institusi / Fakultas (Statis):</div>
                          <div style={{ color: "var(--gold-2)", fontWeight: 700 }}>{editingMentor.institution}</div>
                        </div>

                        <div>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Email Resmi Institusi (Statis):</div>
                          <div style={{ color: "var(--ink)", fontWeight: 500 }}>{editingMentor.email}</div>
                        </div>

                        <div>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Nomor Kontak Resmi (Statis):</div>
                          <div style={{ color: "var(--ink)", fontWeight: 500 }}>{editingMentor.phone}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keterangan Tambahan yang Dapat Diedit */}
                  <div
                    style={{
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      padding: "16px",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "2px 8px", borderRadius: "4px", background: "var(--brand)", color: "#ffffff" }}>
                        KETERANGAN TAMBAHAN (DAPAT DIUPDATE)
                      </span>
                      <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                        Anda dapat memperbarui bio pendekatan konsultasi, ketentuan konsultasi, dan catatan khusus.
                      </span>
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Keterangan Tambahan &amp; Bio Pendekatan Mentoring
                      </label>
                      <textarea
                        rows={4}
                        value={editingMentor.bio}
                        onChange={(e) => setEditingMentor({ ...editingMentor, bio: e.target.value })}
                        placeholder="Tuliskan keterangan tambahan mengenai metode konsultasi, panduan persiapan tugas akhir, atau studi kasus industri..."
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "6px",
                          border: "1px solid var(--bx-border)",
                          background: "var(--bx-surface)",
                          color: "var(--ink)",
                          fontSize: "0.84rem",
                          lineHeight: 1.5,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ALOKASI LEARNING PATH & KURIKULUM SINGLE */}
              {sliderTab === "paths" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1200px" }}>
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      background: "rgba(10, 46, 82, 0.05)",
                      border: "1px solid rgba(10, 46, 82, 0.12)",
                      fontSize: "0.78rem",
                      color: "var(--brand)",
                    }}
                  >
                    <strong>Kualifikasi Pengajaran &amp; Handling Materi:</strong> Tentukan alur pembelajaran yang ditangani mentor. Mentor dapat menangani seluruh <strong>Learning Path (Jalur Belajar)</strong> maupun <strong>Kurikulum / Kursus Single</strong> satuan.
                  </div>

                  {/* Sub-Tabs: Learning Path vs Kurikulum Single */}
                  <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--bx-border)", paddingBottom: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setMentorPathSubTab("paths")}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: mentorPathSubTab === "paths" ? "var(--brand)" : "var(--bx-border)",
                        background: mentorPathSubTab === "paths" ? "var(--brand)" : "var(--bx-surface)",
                        color: mentorPathSubTab === "paths" ? "#ffffff" : "var(--ink)",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>Jalur Belajar / Learning Path</span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "1px 6px",
                          borderRadius: "10px",
                          background: mentorPathSubTab === "paths" ? "rgba(255,255,255,0.25)" : "var(--bx-bg-alt)",
                          color: mentorPathSubTab === "paths" ? "#ffffff" : "var(--brand)",
                        }}
                      >
                        {editingMentor.handledLearningPathIds.length} Dipilih
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMentorPathSubTab("courses")}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: mentorPathSubTab === "courses" ? "var(--gold)" : "var(--bx-border)",
                        background: mentorPathSubTab === "courses" ? "var(--gold)" : "var(--bx-surface)",
                        color: mentorPathSubTab === "courses" ? "#ffffff" : "var(--ink)",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>Kurikulum / Kursus Single</span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "1px 6px",
                          borderRadius: "10px",
                          background: mentorPathSubTab === "courses" ? "rgba(255,255,255,0.25)" : "var(--bx-bg-alt)",
                          color: mentorPathSubTab === "courses" ? "#ffffff" : "var(--gold-2)",
                        }}
                      >
                        {(editingMentor.handledCourseIds || []).length} Dipilih
                      </span>
                    </button>
                  </div>

                  {/* SUB-TAB 1: LEARNING PATHS WITH FORM FILTER */}
                  {mentorPathSubTab === "paths" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {/* Form Filter for Learning Paths */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "10px",
                          background: "var(--bx-bg-alt)",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid var(--bx-border)",
                        }}
                      >
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
                          <input
                            type="text"
                            value={pathSearchQuery}
                            onChange={(e) => setPathSearchQuery(e.target.value)}
                            placeholder="Cari kode atau judul jalur belajar..."
                            style={{
                              padding: "7px 12px",
                              borderRadius: "6px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-surface)",
                              color: "var(--ink)",
                              fontSize: "0.8rem",
                              minWidth: "220px",
                              flex: 1,
                            }}
                          />

                          <select
                            value={pathCategoryFilter}
                            onChange={(e) => setPathCategoryFilter(e.target.value)}
                            style={{
                              padding: "7px 12px",
                              borderRadius: "6px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-surface)",
                              color: "var(--ink)",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              outline: "none",
                            }}
                          >
                            <option value="all">Semua Kategori Path</option>
                            {availablePathCategories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={handleSelectAllFilteredPaths}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "5px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-surface)",
                              fontSize: "0.74rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              color: "var(--brand)",
                            }}
                          >
                            Pilih Semua ({filteredAvailablePaths.length})
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAllFilteredPaths}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "5px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-surface)",
                              fontSize: "0.74rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              color: "var(--muted)",
                            }}
                          >
                            Batal Pilih
                          </button>
                        </div>
                      </div>

                      {/* List of Learning Paths */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {filteredAvailablePaths.map((lp) => {
                          const isHandled = editingMentor.handledLearningPathIds.includes(lp.id);
                          return (
                            <div
                              key={lp.id}
                              onClick={() => handleToggleHandledPath(lp.id)}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                border: isHandled ? "2px solid var(--brand)" : "1px solid var(--bx-border)",
                                background: isHandled ? "rgba(10, 46, 82, 0.05)" : "var(--bx-surface)",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <input
                                  type="checkbox"
                                  checked={isHandled}
                                  onChange={() => {}} // handled by parent onClick
                                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                />
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                    <span
                                      style={{
                                        fontSize: "0.7rem",
                                        fontWeight: 800,
                                        padding: "2px 6px",
                                        borderRadius: "3px",
                                        background: "var(--brand)",
                                        color: "#ffffff",
                                      }}
                                    >
                                      {lp.code}
                                    </span>
                                    <strong style={{ fontSize: "0.86rem", color: "var(--ink)" }}>{lp.title}</strong>
                                    <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>• {lp.category}</span>
                                    <span style={{ fontSize: "0.7rem", color: "var(--gold-2)", fontWeight: 600 }}>({lp.coursesCount} Kursus, {lp.hours} Jam)</span>
                                  </div>
                                </div>
                              </div>

                              <span
                                style={{
                                  fontSize: "0.74rem",
                                  fontWeight: 700,
                                  padding: "3px 8px",
                                  borderRadius: "4px",
                                  background: isHandled ? "#D1FAE5" : "var(--bx-bg-alt)",
                                  color: isHandled ? "#065F46" : "var(--muted)",
                                }}
                              >
                                {isHandled ? "Ditangani Mentor" : "Tidak Ditangani"}
                              </span>
                            </div>
                          );
                        })}

                        {filteredAvailablePaths.length === 0 && (
                          <div style={{ textAlign: "center", padding: "20px", color: "var(--muted)" }}>
                            Tidak ada Jalur Belajar yang cocok dengan filter pencarian.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 2: KURIKULUM / KURSUS SINGLE WITH FORM FILTER */}
                  {mentorPathSubTab === "courses" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {/* Form Filter for Single Courses */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "10px",
                          background: "var(--bx-bg-alt)",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid var(--bx-border)",
                        }}
                      >
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
                          <input
                            type="text"
                            value={singleCourseSearchQuery}
                            onChange={(e) => setSingleCourseSearchQuery(e.target.value)}
                            placeholder="Cari kode, mata kuliah single, atau instruktur..."
                            style={{
                              padding: "7px 12px",
                              borderRadius: "6px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-surface)",
                              color: "var(--ink)",
                              fontSize: "0.8rem",
                              minWidth: "220px",
                              flex: 1,
                            }}
                          />

                          <select
                            value={singleCourseCategoryFilter}
                            onChange={(e) => setSingleCourseCategoryFilter(e.target.value)}
                            style={{
                              padding: "7px 12px",
                              borderRadius: "6px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-surface)",
                              color: "var(--ink)",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              outline: "none",
                            }}
                          >
                            <option value="all">Semua Kategori Kurikulum</option>
                            {availableCourseCategories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={handleSelectAllFilteredCourses}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "5px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-surface)",
                              fontSize: "0.74rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              color: "var(--gold-2)",
                            }}
                          >
                            Pilih Semua ({filteredAvailableCourses.length})
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAllFilteredCourses}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "5px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-surface)",
                              fontSize: "0.74rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              color: "var(--muted)",
                            }}
                          >
                            Batal Pilih
                          </button>
                        </div>
                      </div>

                      {/* List of Single Courses */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {filteredAvailableCourses.map((crs) => {
                          const isHandled = (editingMentor.handledCourseIds || []).includes(crs.id);
                          return (
                            <div
                              key={crs.id}
                              onClick={() => handleToggleHandledCourse(crs.id)}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                border: isHandled ? "2px solid var(--gold)" : "1px solid var(--bx-border)",
                                background: isHandled ? "rgba(201, 150, 46, 0.08)" : "var(--bx-surface)",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <input
                                  type="checkbox"
                                  checked={isHandled}
                                  onChange={() => {}} // handled by parent onClick
                                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                />
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                    <span
                                      style={{
                                        fontSize: "0.7rem",
                                        fontWeight: 800,
                                        padding: "2px 6px",
                                        borderRadius: "3px",
                                        background: "var(--gold)",
                                        color: "#ffffff",
                                      }}
                                    >
                                      {crs.id}
                                    </span>
                                    <strong style={{ fontSize: "0.86rem", color: "var(--ink)" }}>{crs.title}</strong>
                                    <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>• {crs.category}</span>
                                    <span
                                      style={{
                                        fontSize: "0.68rem",
                                        padding: "1px 6px",
                                        borderRadius: "3px",
                                        background: "var(--bx-bg-alt)",
                                        color: "var(--brand)",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {crs.level}
                                    </span>
                                    {crs.instructorName && (
                                      <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                                        (Instruktur: {crs.instructorName})
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <span
                                style={{
                                  fontSize: "0.74rem",
                                  fontWeight: 700,
                                  padding: "3px 8px",
                                  borderRadius: "4px",
                                  background: isHandled ? "#D1FAE5" : "var(--bx-bg-alt)",
                                  color: isHandled ? "#065F46" : "var(--muted)",
                                }}
                              >
                                {isHandled ? "Ditangani Mentor" : "Tidak Ditangani"}
                              </span>
                            </div>
                          );
                        })}

                        {filteredAvailableCourses.length === 0 && (
                          <div style={{ textAlign: "center", padding: "20px", color: "var(--muted)" }}>
                            Tidak ada Kurikulum Single yang cocok dengan filter pencarian.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Topik Keahlian Teknis Tambahan (Tags) */}
                  <div style={{ marginTop: "10px", background: "var(--bx-bg-alt)", padding: "16px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "8px", color: "var(--brand)" }}>
                      Topik Spesialisasi Khusus Tambahan (Tags):
                    </label>

                    <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                      <input
                        type="text"
                        value={newSpecialtyInput}
                        onChange={(e) => setNewSpecialtyInput(e.target.value)}
                        placeholder="Misal: LLM Fine-Tuning, Redis Sharding, Figma Tokens..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSpecialty();
                          }
                        }}
                        style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem" }}
                      />
                      <button
                        type="button"
                        onClick={handleAddSpecialty}
                        style={{ padding: "8px 14px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                      >
                        Tambah Tag
                      </button>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {editingMentor.specialties.map((spec) => (
                        <span
                          key={spec}
                          style={{
                            fontSize: "0.75rem",
                            padding: "4px 10px",
                            borderRadius: "15px",
                            background: "var(--bx-surface)",
                            border: "1px solid var(--bx-border)",
                            color: "var(--brand)",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span>{spec}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecialty(spec)}
                            style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", padding: 0, fontSize: "0.85rem" }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TARIF SESI (1 JAM & 2 JAM) */}
              {sliderTab === "pricing" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "900px" }}>
                  <div
                    style={{
                      background: "rgba(201, 150, 46, 0.08)",
                      border: "1px solid var(--gold)",
                      borderRadius: "8px",
                      padding: "14px 18px",
                    }}
                  >
                    <div style={{ fontWeight: 800, color: "var(--brand)", marginBottom: "4px" }}>
                      Skema Biaya &amp; Paket Durasi Mentoring:
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "var(--muted)", lineHeight: 1.4 }}>
                      Tentukan tarif fleksibel untuk sesi reguler 1 jam (60 menit) dan paket intensif 2 jam (120 menit). Siswa dapat memilih durasi sesuai kedalaman pembahasan tugas akhir atau simulasi wawancara kerja.
                    </div>
                  </div>

                  {/* Selector to apply from Master Pricing Scheme */}
                  <div
                    style={{
                      background: "rgba(10, 46, 82, 0.04)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label style={{ fontWeight: 800, color: "var(--brand)", fontSize: "0.82rem" }}>
                      Terapkan Standar Tarif dari Master Skema Biaya:
                    </label>
                    <select
                      value={editingMentor.pricing.masterSchemeId || ""}
                      onChange={(e) => handleApplyPricingSchemeToMentor(e.target.value)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--bx-border)",
                        background: "var(--bx-surface)",
                        color: "var(--ink)",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        outline: "none",
                      }}
                    >
                      <option value="">-- Pilih Master Skema Biaya Acuan --</option>
                      {pricingSchemes.map((sch) => (
                        <option key={sch.id} value={sch.id}>
                          {sch.name} ({sch.code}) • 1 Jam: Rp {sch.hourlyRate.toLocaleString("id-ID")} • 2 Jam: Rp {sch.twoHourRate.toLocaleString("id-ID")} • Bagi Hasil: {sch.mentorSharePct}% Mentor
                        </option>
                      ))}
                    </select>
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                      Memilih master skema biaya akan otomatis menyesuaikan tarif sesi 1 jam, paket 2 jam, tarif grup, dan hak akses subscriber Pro.
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{ background: "var(--bx-bg-alt)", padding: "16px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Tarif Sesi 1 Jam (60 Menit) - Rp
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={10000}
                        value={editingMentor.pricing.hourlyRate}
                        onChange={(e) =>
                          setEditingMentor({
                            ...editingMentor,
                            pricing: {
                              ...editingMentor.pricing,
                              hourlyRate: Number(e.target.value),
                            },
                          })
                        }
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.88rem", fontWeight: 700 }}
                      />
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                        Tarif standar untuk konsultasi ringkas, Q&amp;A kode, atau perbaikan bug terfokus.
                      </span>
                    </div>

                    <div style={{ background: "var(--bx-bg-alt)", padding: "16px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Tarif Paket 2 Jam Intensif (120 Menit) - Rp
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={10000}
                        value={editingMentor.pricing.twoHourRate}
                        onChange={(e) =>
                          setEditingMentor({
                            ...editingMentor,
                            pricing: {
                              ...editingMentor.pricing,
                              twoHourRate: Number(e.target.value),
                            },
                          })
                        }
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.88rem", fontWeight: 700 }}
                      />
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                        Paket hemat untuk mock interview lengkap, bedah arsitektur tugas akhir, atau deep design review.
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{ background: "var(--bx-bg-alt)", padding: "16px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Tarif Klinik Grup (Per Siswa / Max 5 Orang) - Rp
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={5000}
                        value={editingMentor.pricing.groupClinicRate}
                        onChange={(e) =>
                          setEditingMentor({
                            ...editingMentor,
                            pricing: {
                              ...editingMentor.pricing,
                              groupClinicRate: Number(e.target.value),
                            },
                          })
                        }
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.88rem", fontWeight: 700 }}
                      />
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                        Tarif terjangkau untuk sesi bimbingan bersama rekan sekelas dalam topik yang sama.
                      </span>
                    </div>

                    <div style={{ background: "var(--bx-bg-alt)", padding: "16px", borderRadius: "8px", border: "1px solid var(--bx-border)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 700, color: "var(--brand)" }}>
                        <input
                          type="checkbox"
                          checked={editingMentor.pricing.freeForSubscriberPro}
                          onChange={(e) =>
                            setEditingMentor({
                              ...editingMentor,
                              pricing: {
                                ...editingMentor.pricing,
                                freeForSubscriberPro: e.target.checked,
                              },
                            })
                          }
                        />
                        <span>Gratis untuk Siswa Berlangganan Pro / Enterprise</span>
                      </label>
                      <span style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "6px" }}>
                        Siswa Pro mendapatkan kuota bimbingan 1 jam/bulan yang biaya honor mentornya diganti platform.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: JADWAL & RUANG VIRTUAL */}
              {sliderTab === "schedule" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "900px" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                      Jadwal Ketersediaan Mentor (Hari &amp; Jam Booking)
                    </label>
                    <input
                      type="text"
                      value={editingMentor.availableDays}
                      onChange={(e) => setEditingMentor({ ...editingMentor, availableDays: e.target.value })}
                      placeholder="Misal: Setiap Senin & Rabu 14:00 - 18:00 WIB"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                    />
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                      Jadwal ini akan muncul di kalender booking siswa saat memilih slot waktu.
                    </span>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                      URL Template Ruang Virtual (Google Meet / Zoom Meeting)
                    </label>
                    <input
                      type="text"
                      value={editingMentor.virtualRoomUrl}
                      onChange={(e) => setEditingMentor({ ...editingMentor, virtualRoomUrl: e.target.value })}
                      placeholder="https://meet.google.com/anvieo-room-id"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                    />
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                      Link ini otomatis terlampir di email konfirmasi dan ruang kelas virtual siswa.
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 5: STATUS LAYANAN & KUOTA */}
              {sliderTab === "status" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "900px" }}>
                  {/* Prominent Check Switch Card */}
                  <div
                    style={{
                      background: "var(--bx-bg-alt)",
                      padding: "16px 20px",
                      borderRadius: "8px",
                      border: "1px solid var(--bx-border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)", fontSize: "0.88rem" }}>
                        Sakelar Aktif / Non-Aktif Layanan Mentor
                      </label>
                      <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                        Gunakan check switch untuk membuka atau menutup ketersediaan booking mentor secara instan.
                      </div>
                    </div>

                    <div style={{ background: "var(--bx-surface)", padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                      <CheckSwitch
                        checked={editingMentor.status === "Aktif"}
                        onChange={() =>
                          setEditingMentor({
                            ...editingMentor,
                            status: editingMentor.status === "Aktif" ? "Non-Aktif" : "Aktif",
                          })
                        }
                        labelActive="Layanan Aktif (Buka Booking)"
                        labelInactive="Layanan Non-Aktif (Cuti / Tutup)"
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Status Layanan Mentoring (Detail Mode)
                      </label>
                      <select
                        value={editingMentor.status}
                        onChange={(e) => setEditingMentor({ ...editingMentor, status: e.target.value as any })}
                        style={{
                          width: "100%",
                          padding: "9px 12px",
                          borderRadius: "6px",
                          border: "1px solid var(--bx-border)",
                          background: "var(--bx-surface)",
                          color: "var(--ink)",
                          fontSize: "0.84rem",
                          fontWeight: 600,
                          outline: "none",
                        }}
                      >
                        <option value="Aktif">Aktif (Buka Booking Siswa)</option>
                        <option value="Non-Aktif">Non-Aktif (Tutup Sementara / Cuti)</option>
                        <option value="Penuh">Penuh (Full Booked Bulan Ini)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Total Rekam Jejak Sesi Selesai
                      </label>
                      <input
                        type="number"
                        value={editingMentor.totalSessionsCompleted}
                        onChange={(e) => setEditingMentor({ ...editingMentor, totalSessionsCompleted: Number(e.target.value) })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ background: "var(--bx-bg-alt)", padding: "16px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                    <div style={{ fontWeight: 700, color: "var(--brand)", marginBottom: "4px" }}>
                      Ringkasan Status:
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                      Mentor ini berstatus <strong>{editingMentor.status}</strong> dengan {editingMentor.handledLearningPathIds.length} jalur pembelajaran dan {(editingMentor.handledCourseIds || []).length} kurikulum single yang siap ditangani. Tarif sesi 1 jam: <strong>Rp {editingMentor.pricing.hourlyRate.toLocaleString("id-ID")}</strong>, paket 2 jam: <strong>Rp {editingMentor.pricing.twoHourRate.toLocaleString("id-ID")}</strong>.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: STATISTIK & REKAM MENTEE SISWA */}
              {sliderTab === "statistics" && (() => {
                const stats = getMentorStats(editingMentor.id);
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1000px" }}>
                    {/* Header Statistics Card */}
                    <div
                      style={{
                        background: "var(--bx-bg-alt)",
                        border: "1px solid var(--bx-border)",
                        padding: "16px",
                        borderRadius: "8px",
                      }}
                    >
                      <div style={{ fontWeight: 800, color: "var(--brand)", marginBottom: "4px", fontSize: "0.92rem" }}>
                        Performa Bimbingan &amp; Rasio Kelulusan Mentor Ini
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--muted)" }}>
                        Ringkasan hasil bimbingan siswa yang pernah ditangani oleh {editingMentor.name}.
                      </div>

                      {/* 4 KPI Metrics */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginTop: "12px" }}>
                        <div style={{ background: "var(--bx-surface)", padding: "12px", borderRadius: "6px", border: "1px solid var(--bx-border)", textAlign: "center" }}>
                          <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Total Siswa Mentee</div>
                          <strong style={{ fontSize: "1.3rem", color: "var(--brand)" }}>{stats.total}</strong>
                        </div>

                        <div style={{ background: "var(--bx-surface)", padding: "12px", borderRadius: "6px", border: "1px solid var(--bx-border)", textAlign: "center" }}>
                          <div style={{ fontSize: "0.7rem", color: "#065F46" }}>Sukses / Lulus</div>
                          <strong style={{ fontSize: "1.3rem", color: "#059669" }}>{stats.sukses} ({stats.successRate}%)</strong>
                        </div>

                        <div style={{ background: "var(--bx-surface)", padding: "12px", borderRadius: "6px", border: "1px solid var(--bx-border)", textAlign: "center" }}>
                          <div style={{ fontSize: "0.7rem", color: "#B45309" }}>Proses Lama</div>
                          <strong style={{ fontSize: "1.3rem", color: "#D97706" }}>{stats.lama}</strong>
                        </div>

                        <div style={{ background: "var(--bx-surface)", padding: "12px", borderRadius: "6px", border: "1px solid var(--bx-border)", textAlign: "center" }}>
                          <div style={{ fontSize: "0.7rem", color: "#991B1B" }}>Gagal / Drop Out</div>
                          <strong style={{ fontSize: "1.3rem", color: "#DC2626" }}>{stats.gagal}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Mentee Student Cards with AVATARS */}
                    <div>
                      <h4 style={{ margin: "0 0 10px", color: "var(--brand)" }}>
                        Daftar Mentee Siswa Terdaftar ({stats.list.length} Siswa):
                      </h4>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {stats.list.map((mte) => (
                          <div
                            key={mte.id}
                            style={{
                              background: "var(--bx-surface)",
                              border: "1px solid var(--bx-border)",
                              borderRadius: "8px",
                              padding: "14px 18px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "14px",
                              flexWrap: "wrap",
                            }}
                          >
                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                              <img
                                src={mte.studentAvatar}
                                alt={mte.studentName}
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border:
                                    mte.status === "sukses"
                                      ? "2px solid #059669"
                                      : mte.status === "lama"
                                      ? "2px solid #D97706"
                                      : "2px solid #DC2626",
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--brand)" }}>
                                  {mte.studentName} <span style={{ fontSize: "0.74rem", color: "var(--muted)", fontWeight: 500 }}>({mte.studentNim})</span>
                                </div>
                                <div style={{ fontSize: "0.76rem", color: "var(--ink)", marginTop: "2px" }}>
                                  {mte.studentEmail} • Jalur: <strong>{mte.learningPathTitle}</strong>
                                </div>
                                <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "2px" }}>
                                  Total {mte.totalSessionsAttended} Sesi Bimbingan • {mte.durationDays} Hari Bimbingan
                                </div>
                                {mte.notes && (
                                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontStyle: "italic", marginTop: "4px" }}>
                                    Catatan: &quot;{mte.notes}&quot;
                                  </div>
                                )}
                              </div>
                            </div>

                            <div style={{ textAlign: "right" }}>
                              <span
                                style={{
                                  fontSize: "0.72rem",
                                  fontWeight: 800,
                                  padding: "3px 10px",
                                  borderRadius: "12px",
                                  background:
                                    mte.status === "sukses" ? "#D1FAE5" : mte.status === "lama" ? "#FEF3C7" : "#FEE2E2",
                                  color:
                                    mte.status === "sukses" ? "#065F46" : mte.status === "lama" ? "#B45309" : "#991B1B",
                                  display: "inline-block",
                                  marginBottom: "4px",
                                }}
                              >
                                {mte.statusLabel}
                              </span>
                              {mte.finalGrade && (
                                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink)" }}>
                                  Nilai Akhir: <span style={{ color: "var(--brand)" }}>{mte.finalGrade}</span>
                                </div>
                              )}
                              {mte.careerOutcome && (
                                <div style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700, marginTop: "2px" }}>
                                  🎯 {mte.careerOutcome}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {stats.list.length === 0 && (
                          <div style={{ textAlign: "center", padding: "24px", color: "var(--muted)" }}>
                            Belum ada riwayat mentee terdaftar untuk mentor ini.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 7: RATING & SARAN KRITIK UNTUK MENTOR INI */}
              {sliderTab === "feedbacks" && (() => {
                const summary = getMentorRatingSummary(editingMentor.id);
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1000px" }}>
                    {/* Header Score Card */}
                    <div
                      style={{
                        background: "var(--bx-bg-alt)",
                        border: "1px solid var(--bx-border)",
                        padding: "16px",
                        borderRadius: "8px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1.5fr",
                        gap: "16px",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ textAlign: "center", borderRight: "1px solid var(--bx-border)", paddingRight: "16px" }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>
                          Rata-Rata Rating Mentor
                        </div>
                        <div style={{ fontSize: "2.8rem", fontWeight: 900, color: "var(--brand)", lineHeight: 1.1, margin: "4px 0" }}>
                          {summary.avgRating}
                          <span style={{ fontSize: "1.1rem", color: "var(--muted)", fontWeight: 500 }}>/5.0</span>
                        </div>
                        <div style={{ fontSize: "1.1rem", color: "#F59E0B", marginBottom: "4px" }}>
                          {"⭐".repeat(Math.round(summary.numericAvg))}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                          Total <strong>{summary.count}</strong> ulasan &amp; saran dari mentee
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ fontWeight: 800, color: "var(--brand)", fontSize: "0.84rem" }}>
                          Evaluasi Aspek Bimbingan Siswa:
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", fontWeight: 600, marginBottom: "2px" }}>
                            <span>🎯 Kejelasan Materi</span>
                            <strong>{summary.clarityAvg} / 5.0</strong>
                          </div>
                          <div style={{ height: "6px", background: "var(--bx-surface)", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${(parseFloat(summary.clarityAvg) / 5) * 100}%`, height: "100%", background: "var(--brand)" }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", fontWeight: 600, marginBottom: "2px" }}>
                            <span>⏱️ Ketepatan Waktu Sesi</span>
                            <strong>{summary.punctualityAvg} / 5.0</strong>
                          </div>
                          <div style={{ height: "6px", background: "var(--bx-surface)", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${(parseFloat(summary.punctualityAvg) / 5) * 100}%`, height: "100%", background: "var(--gold-2)" }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", fontWeight: 600, marginBottom: "2px" }}>
                            <span>💡 Kedalaman Solusi Teknis</span>
                            <strong>{summary.technicalDepthAvg} / 5.0</strong>
                          </div>
                          <div style={{ height: "6px", background: "var(--bx-surface)", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${(parseFloat(summary.technicalDepthAvg) / 5) * 100}%`, height: "100%", background: "#059669" }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feedbacks List for this Mentor */}
                    <div>
                      <h4 style={{ margin: "0 0 10px", color: "var(--brand)" }}>
                        Daftar Ulasan &amp; Saran Siswa untuk {editingMentor.name} ({summary.list.length}):
                      </h4>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {summary.list.map((fb) => (
                          <div
                            key={fb.id}
                            style={{
                              background: "var(--bx-surface)",
                              border: "1px solid var(--bx-border)",
                              borderRadius: "8px",
                              padding: "14px 16px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <img
                                  src={fb.studentAvatar}
                                  alt={fb.studentName}
                                  style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--brand)" }}
                                />
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "var(--brand)" }}>
                                    {fb.studentName} <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 500 }}>({fb.studentNim})</span>
                                  </div>
                                  <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                                    Sesi: {fb.sessionTopic} • {fb.createdAt}
                                  </div>
                                </div>
                              </div>

                              <div style={{ textAlign: "right" }}>
                                <span style={{ fontSize: "0.92rem", color: "#F59E0B" }}>
                                  {"⭐".repeat(Math.round(fb.rating))}
                                </span>
                                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--brand)", marginLeft: "4px" }}>
                                  {fb.rating}.0
                                </span>
                              </div>
                            </div>

                            {/* Critique Callout */}
                            <div
                              style={{
                                background: "rgba(245, 158, 11, 0.06)",
                                borderLeft: "3px solid #F59E0B",
                                padding: "8px 12px",
                                borderRadius: "0 6px 6px 0",
                              }}
                            >
                              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#B45309", marginBottom: "2px" }}>
                                💡 Saran &amp; Kritik Konstruktif:
                              </div>
                              <div style={{ fontSize: "0.78rem", color: "var(--ink)", fontStyle: "italic" }}>
                                &quot;{fb.critiqueAndSuggestions}&quot;
                              </div>
                            </div>

                            {/* Testimonial */}
                            {fb.testimonial && (
                              <div
                                style={{
                                  background: "rgba(5, 150, 105, 0.05)",
                                  borderLeft: "3px solid #059669",
                                  padding: "6px 12px",
                                  borderRadius: "0 6px 6px 0",
                                }}
                              >
                                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#065F46", marginBottom: "2px" }}>
                                  💬 Testimoni Siswa:
                                </div>
                                <div style={{ fontSize: "0.76rem", color: "var(--ink)" }}>
                                  &quot;{fb.testimonial}&quot;
                                </div>
                              </div>
                            )}

                            {/* Mentor Reply */}
                            {fb.mentorReply ? (
                              <div
                                style={{
                                  background: "var(--bx-bg-alt)",
                                  border: "1px solid var(--bx-border)",
                                  borderRadius: "6px",
                                  padding: "8px 12px",
                                  marginLeft: "14px",
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--brand)" }}>
                                    🛡️ Tanggapan Anda ({fb.mentorReplyDate}):
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenReplyModal(fb)}
                                    style={{ background: "transparent", border: "none", color: "var(--gold-2)", cursor: "pointer", fontSize: "0.7rem", fontWeight: 700 }}
                                  >
                                    Edit
                                  </button>
                                </div>
                                <div style={{ fontSize: "0.76rem", color: "var(--ink)" }}>
                                  {fb.mentorReply}
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenReplyModal(fb)}
                                  style={{
                                    padding: "5px 12px",
                                    borderRadius: "5px",
                                    border: "1px solid var(--bx-border)",
                                    background: "var(--brand)",
                                    color: "#ffffff",
                                    fontSize: "0.74rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  Balas Saran &amp; Kritik Ini
                                </button>
                              </div>
                            )}
                          </div>
                        ))}

                        {summary.list.length === 0 && (
                          <div style={{ textAlign: "center", padding: "24px", color: "var(--muted)" }}>
                            Belum ada ulasan atau saran kritik untuk mentor ini.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom Action Footer Bar */}
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
                Tarif 1 Jam: <strong style={{ color: "var(--brand)" }}>Rp {editingMentor.pricing.hourlyRate.toLocaleString("id-ID")}</strong> • Paket 2 Jam: <strong style={{ color: "var(--gold-2)" }}>Rp {editingMentor.pricing.twoHourRate.toLocaleString("id-ID")}</strong> • Status: <strong>{editingMentor.status}</strong>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setEditingMentor(null)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-surface)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    color: "var(--ink)",
                  }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveMentor}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 20px",
                    borderRadius: "6px",
                    border: "none",
                    background: "var(--brand, #0A2E52)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(10, 46, 82, 0.2)",
                  }}
                >
                  <FlatIcon type="check" size={14} color="#ffffff" />
                  <span>Simpan Data Mentor &amp; Tarif</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: RESCHEDULE SESI BOOKING */}
      {/* ============================================================== */}
      {reschedulingSession && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "rgba(10,46,82,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "var(--bx-surface, #FFFFFF)", borderRadius: "10px", padding: "24px", maxWidth: "420px", width: "100%", fontSize: "0.82rem", border: "1px solid var(--bx-border)" }}>
            <h3 style={{ margin: "0 0 8px", color: "var(--brand)" }}>Reschedule Sesi Mentoring</h3>
            <p style={{ margin: "0 0 12px", color: "var(--muted)" }}>Topik: {reschedulingSession.topic}</p>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Waktu Sesi Baru</label>
              <input type="text" value={newTime} onChange={(e) => setNewTime(e.target.value)} placeholder="Misal: Besok, 14:00 - 16:00 WIB" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" onClick={() => setReschedulingSession(null)} style={{ padding: "8px 14px", border: "1px solid var(--bx-border)", background: "transparent", borderRadius: "6px" }}>Batal</button>
              <button type="button" onClick={handleExecuteReschedule} style={{ padding: "8px 16px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, borderRadius: "6px" }}>Simpan Jadwal Baru</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CATATAN MENTOR & EVALUASI */}
      {/* ============================================================== */}
      {notingSession && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "rgba(10,46,82,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "var(--bx-surface, #FFFFFF)", borderRadius: "10px", padding: "24px", maxWidth: "460px", width: "100%", fontSize: "0.82rem", border: "1px solid var(--bx-border)" }}>
            <h3 style={{ margin: "0 0 8px", color: "var(--brand)" }}>Catatan Evaluasi Mentoring</h3>
            <p style={{ margin: "0 0 12px", color: "var(--muted)" }}>Bimbingan untuk <strong>{notingSession.studentName}</strong> ({notingSession.learningPathTitle})</p>
            <textarea rows={4} value={mentorNotes} onChange={(e) => setMentorNotes(e.target.value)} placeholder="Tuliskan catatan teknis dan arahan perbaikan siswa..." style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)", marginBottom: "12px" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" onClick={() => setNotingSession(null)} style={{ padding: "8px 14px", border: "1px solid var(--bx-border)", background: "transparent", borderRadius: "6px" }}>Batal</button>
              <button type="button" onClick={handleSaveNotes} style={{ padding: "8px 16px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, borderRadius: "6px" }}>Simpan Catatan</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: DAFTAR MENTEE & STATISTIK SISWA PER MENTOR (AVATAR) */}
      {/* ============================================================== */}
      {viewingMentorStats && (() => {
        const stats = getMentorStats(viewingMentorStats.id);
        return (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(10,46,82,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setViewingMentorStats(null);
            }}
          >
            <div
              style={{
                background: "var(--bx-surface, #FFFFFF)",
                borderRadius: "10px",
                padding: "20px 24px",
                maxWidth: "760px",
                width: "100%",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: "1px solid var(--bx-border)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--bx-border)", paddingBottom: "12px", marginBottom: "14px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img
                    src={viewingMentorStats.avatar}
                    alt={viewingMentorStats.name}
                    style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--brand)" }}
                  />
                  <div>
                    <h3 style={{ margin: 0, color: "var(--brand)", fontSize: "1.05rem", fontFamily: "var(--font-heading)" }}>
                      Statistik &amp; Siswa Mentee: {viewingMentorStats.name}
                    </h3>
                    <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                      {viewingMentorStats.title} • {viewingMentorStats.institution}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingMentorStats(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "var(--ink)",
                  }}
                >
                  <FlatIcon type="close" size={16} color="var(--ink)" />
                </button>
              </div>

              {/* 4 Mini KPI Strip */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                <div style={{ background: "rgba(10, 46, 82, 0.06)", padding: "10px", borderRadius: "6px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Total Mentee</div>
                  <strong style={{ fontSize: "1.2rem", color: "var(--brand)" }}>{stats.total}</strong>
                </div>

                <div style={{ background: "#D1FAE5", padding: "10px", borderRadius: "6px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.7rem", color: "#065F46" }}>Sukses / Lulus</div>
                  <strong style={{ fontSize: "1.2rem", color: "#059669" }}>{stats.sukses} ({stats.successRate}%)</strong>
                </div>

                <div style={{ background: "#FEF3C7", padding: "10px", borderRadius: "6px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.7rem", color: "#B45309" }}>Proses Lama</div>
                  <strong style={{ fontSize: "1.2rem", color: "#D97706" }}>{stats.lama}</strong>
                </div>

                <div style={{ background: "#FEE2E2", padding: "10px", borderRadius: "6px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.7rem", color: "#991B1B" }}>Gagal / Drop Out</div>
                  <strong style={{ fontSize: "1.2rem", color: "#DC2626" }}>{stats.gagal}</strong>
                </div>
              </div>

              {/* Mentee List with AVATARS */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingRight: "4px" }}>
                <span style={{ fontSize: "0.76rem", color: "var(--muted)", fontWeight: 700 }}>
                  Daftar Siswa yang Menggunakan Layanan Bimbingan ({stats.list.length} Siswa):
                </span>

                {stats.list.map((mte) => (
                  <div
                    key={mte.id}
                    style={{
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <img
                        src={mte.studentAvatar}
                        alt={mte.studentName}
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border:
                            mte.status === "sukses"
                              ? "2px solid #059669"
                              : mte.status === "lama"
                              ? "2px solid #D97706"
                              : "2px solid #DC2626",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "var(--brand)" }}>
                          {mte.studentName} <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 500 }}>({mte.studentNim})</span>
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "var(--ink)" }}>
                          Jalur: {mte.learningPathTitle} • {mte.totalSessionsAttended} Sesi ({mte.durationDays} hari)
                        </div>
                        {mte.notes && (
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontStyle: "italic", marginTop: "2px" }}>
                            Catatan: {mte.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background:
                            mte.status === "sukses" ? "#D1FAE5" : mte.status === "lama" ? "#FEF3C7" : "#FEE2E2",
                          color:
                            mte.status === "sukses" ? "#065F46" : mte.status === "lama" ? "#B45309" : "#991B1B",
                        }}
                      >
                        {mte.statusLabel}
                      </span>
                      {mte.finalGrade && (
                        <div style={{ fontSize: "0.74rem", fontWeight: 700, marginTop: "2px", color: "var(--ink)" }}>
                          Nilai: {mte.finalGrade}
                        </div>
                      )}
                      {mte.careerOutcome && (
                        <div style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 700 }}>
                          {mte.careerOutcome}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {stats.list.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px", color: "var(--muted)", fontSize: "0.8rem" }}>
                    Belum ada data mentee terdaftar untuk mentor ini.
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid var(--bx-border)", textAlign: "right" }}>
                <button
                  type="button"
                  onClick={() => setViewingMentorStats(null)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "6px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-bg-alt)",
                    color: "var(--ink)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ============================================================== */}
      {/* MODAL: INPUT / UPDATE MASTER SKEMA BIAYA */}
      {/* ============================================================== */}
      {isPricingModalOpen && editingPricingScheme && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,46,82,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPricingModalOpen(false);
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              borderRadius: "10px",
              padding: "22px 26px",
              maxWidth: "620px",
              width: "100%",
              fontSize: "0.82rem",
              border: "1px solid var(--bx-border)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--bx-border)", paddingBottom: "10px", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, color: "var(--brand)", fontSize: "1.05rem", fontFamily: "var(--font-heading)" }}>
                {pricingSchemes.some((s) => s.id === editingPricingScheme.id) ? "Update Master Skema Biaya Mentoring" : "Tambah Master Skema Biaya Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setIsPricingModalOpen(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px" }}
              >
                <FlatIcon type="close" size={16} color="var(--ink)" />
              </button>
            </div>

            <form onSubmit={handleSavePricingScheme} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                    Kode Skema
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPricingScheme.code}
                    onChange={(e) => setEditingPricingScheme({ ...editingPricingScheme, code: e.target.value })}
                    placeholder="Misal: TIER-EXPERT"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                    Nama Skema Biaya
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPricingScheme.name}
                    onChange={(e) => setEditingPricingScheme({ ...editingPricingScheme, name: e.target.value })}
                    placeholder="Misal: Skema Master Lead & Solution Architect"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                  Target Peruntukan Civitas / Role
                </label>
                <input
                  type="text"
                  required
                  value={editingPricingScheme.targetRole}
                  onChange={(e) => setEditingPricingScheme({ ...editingPricingScheme, targetRole: e.target.value })}
                  placeholder="Misal: Master Instructor Cloud & Cyber Security Auditor"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                    Tarif 1 Jam (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    required
                    value={editingPricingScheme.hourlyRate}
                    onChange={(e) => setEditingPricingScheme({ ...editingPricingScheme, hourlyRate: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem", fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                    Tarif Paket 2 Jam (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    required
                    value={editingPricingScheme.twoHourRate}
                    onChange={(e) => setEditingPricingScheme({ ...editingPricingScheme, twoHourRate: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem", fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                    Klinik Grup (Rp/Siswa)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    required
                    value={editingPricingScheme.groupClinicRate}
                    onChange={(e) => setEditingPricingScheme({ ...editingPricingScheme, groupClinicRate: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem", fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                    Bagi Hasil Honor Mentor (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={editingPricingScheme.mentorSharePct}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEditingPricingScheme({
                        ...editingPricingScheme,
                        mentorSharePct: val,
                        platformSharePct: 100 - val,
                      });
                    }}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem", fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                    Kas Platform LMS (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    disabled
                    value={editingPricingScheme.platformSharePct}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)", color: "var(--muted)", fontSize: "0.84rem", fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "var(--bx-bg-alt)", padding: "10px 14px", borderRadius: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={editingPricingScheme.freeForSubscriberPro}
                    onChange={(e) => setEditingPricingScheme({ ...editingPricingScheme, freeForSubscriberPro: e.target.checked })}
                  />
                  <span>Gratis 1 Sesi/Bulan Siswa Berlangganan Pro</span>
                </label>

                <div style={{ marginLeft: "auto" }}>
                  <CheckSwitch
                    checked={editingPricingScheme.status === "Aktif"}
                    onChange={() =>
                      setEditingPricingScheme({
                        ...editingPricingScheme,
                        status: editingPricingScheme.status === "Aktif" ? "Non-Aktif" : "Aktif",
                      })
                    }
                    labelActive="Skema Aktif"
                    labelInactive="Skema Non-Aktif"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                  Deskripsi Benefit &amp; Standar Layanan
                </label>
                <textarea
                  rows={3}
                  value={editingPricingScheme.description}
                  onChange={(e) => setEditingPricingScheme({ ...editingPricingScheme, description: e.target.value })}
                  placeholder="Jelaskan cakupan bimbingan dan standar pelayanan skema biaya ini..."
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem", lineHeight: 1.4 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", color: "var(--ink)", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 20px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Simpan Master Skema Biaya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: BERI RATING & KIRIM SARAN/KRITIK BARU */}
      {/* ============================================================== */}
      {isNewFeedbackModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,46,82,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsNewFeedbackModalOpen(false);
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              borderRadius: "10px",
              padding: "22px 26px",
              maxWidth: "600px",
              width: "100%",
              fontSize: "0.82rem",
              border: "1px solid var(--bx-border)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--bx-border)", paddingBottom: "10px", marginBottom: "14px" }}>
              <div>
                <h3 style={{ margin: 0, color: "var(--brand)", fontSize: "1.05rem", fontFamily: "var(--font-heading)" }}>
                  Beri Rating &amp; Kirim Saran/Kritik Mentoring
                </h3>
                <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                  Ulasan objektif dan masukan konstruktif untuk meningkatkan mutu bimbingan.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsNewFeedbackModalOpen(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px" }}
              >
                <FlatIcon type="close" size={16} color="var(--ink)" />
              </button>
            </div>

            <form onSubmit={handleSaveNewFeedback} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Select Mentor */}
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                  Pilih Mentor yang Dinilai:
                </label>
                <select
                  required
                  value={newFeedbackForm.mentorId}
                  onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, mentorId: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem", fontWeight: 600 }}
                >
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.title})
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Name & NIM */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                    Nama Lengkap Mahasiswa:
                  </label>
                  <input
                    type="text"
                    required
                    value={newFeedbackForm.studentName}
                    onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, studentName: e.target.value })}
                    placeholder="Contoh: Rendy Aria Windana"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                    NIM Mahasiswa:
                  </label>
                  <input
                    type="text"
                    value={newFeedbackForm.studentNim}
                    onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, studentNim: e.target.value })}
                    placeholder="20240801001"
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem" }}
                  />
                </div>
              </div>

              {/* Topic of Mentoring Session */}
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                  Topik Sesi Bimbingan:
                </label>
                <input
                  type="text"
                  value={newFeedbackForm.sessionTopic}
                  onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, sessionTopic: e.target.value })}
                  placeholder="Contoh: Review Arsitektur &amp; Optimasi High Concurrency"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem" }}
                />
              </div>

              {/* Overall Star Rating */}
              <div style={{ background: "var(--bx-bg-alt)", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontWeight: 700, color: "var(--brand)", fontSize: "0.82rem" }}>
                    Rating Keseluruhan Mentor:
                  </label>
                  <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--brand)" }}>
                    {"⭐".repeat(newFeedbackForm.rating)} {newFeedbackForm.rating}.0
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setNewFeedbackForm({ ...newFeedbackForm, rating: starVal })}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        border: newFeedbackForm.rating === starVal ? "2px solid var(--brand)" : "1px solid var(--bx-border)",
                        background: newFeedbackForm.rating === starVal ? "var(--brand)" : "var(--bx-surface)",
                        color: newFeedbackForm.rating === starVal ? "#ffffff" : "var(--ink)",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      {starVal} Bintang
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Aspect Ratings */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)", fontSize: "0.74rem" }}>
                    🎯 Kejelasan: ({newFeedbackForm.clarity}/5)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={newFeedbackForm.clarity}
                    onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, clarity: Number(e.target.value) })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--gold-2)", fontSize: "0.74rem" }}>
                    ⏱️ Ketepatan: ({newFeedbackForm.punctuality}/5)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={newFeedbackForm.punctuality}
                    onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, punctuality: Number(e.target.value) })}
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "#059669", fontSize: "0.74rem" }}>
                    💡 Solusi: ({newFeedbackForm.technicalDepth}/5)
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={newFeedbackForm.technicalDepth}
                    onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, technicalDepth: Number(e.target.value) })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              {/* Saran dan Kritik Konstruktif */}
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "#B45309" }}>
                  💡 Saran &amp; Kritik Konstruktif untuk Mentor (Wajib):
                </label>
                <textarea
                  required
                  rows={3}
                  value={newFeedbackForm.critiqueAndSuggestions}
                  onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, critiqueAndSuggestions: e.target.value })}
                  placeholder="Tuliskan masukan atau kritik membangun terkait tempo bimbingan, penjelasan materi, atau fasilitas lab..."
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem", lineHeight: 1.4 }}
                />
              </div>

              {/* Testimoni Apresiasi */}
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "#065F46" }}>
                  💬 Testimoni Apresiasi Siswa:
                </label>
                <textarea
                  rows={2}
                  value={newFeedbackForm.testimonial}
                  onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, testimonial: e.target.value })}
                  placeholder="Ceritakan hal positif yang Anda dapatkan setelah mengikuti bimbingan..."
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem", lineHeight: 1.4 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setIsNewFeedbackModalOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", color: "var(--ink)", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 20px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Kirim Rating &amp; Saran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: BALAS SARAN & KRITIK MAHASISWA */}
      {/* ============================================================== */}
      {replyingFeedback && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,46,82,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setReplyingFeedback(null);
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              borderRadius: "10px",
              padding: "22px 26px",
              maxWidth: "580px",
              width: "100%",
              fontSize: "0.82rem",
              border: "1px solid var(--bx-border)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--bx-border)", paddingBottom: "10px", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, color: "var(--brand)", fontSize: "1.05rem", fontFamily: "var(--font-heading)" }}>
                Tanggapi Saran &amp; Kritik Mahasiswa
              </h3>
              <button
                type="button"
                onClick={() => setReplyingFeedback(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px" }}
              >
                <FlatIcon type="close" size={16} color="var(--ink)" />
              </button>
            </div>

            {/* Critique Snapshot */}
            <div style={{ background: "var(--bx-bg-alt)", padding: "12px 14px", borderRadius: "8px", marginBottom: "14px", border: "1px solid var(--bx-border)" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "6px" }}>
                <img
                  src={replyingFeedback.studentAvatar}
                  alt={replyingFeedback.studentName}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: "var(--brand)" }}>
                    {replyingFeedback.studentName} ({replyingFeedback.studentNim})
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                    Rating: {"⭐".repeat(Math.round(replyingFeedback.rating))} ({replyingFeedback.rating}.0) • {replyingFeedback.sessionTopic}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "0.8rem", color: "var(--ink)", fontStyle: "italic", borderLeft: "3px solid #F59E0B", paddingLeft: "8px", marginTop: "6px" }}>
                &quot;{replyingFeedback.critiqueAndSuggestions}&quot;
              </div>
            </div>

            <form onSubmit={handleSaveMentorReply} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px", color: "var(--brand)" }}>
                  Tulis Tanggapan Resmi Mentor:
                </label>
                <textarea
                  required
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tuliskan respon resmi, apresiasi, atau tindak lanjut perbaikan materi untuk mahasiswa ini..."
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem", lineHeight: 1.45 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setReplyingFeedback(null)}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", color: "var(--ink)", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 20px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Simpan Tanggapan Resmi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: ULASAN & SARAN KHUSUS MENTOR */}
      {/* ============================================================== */}
      {viewingMentorFeedbacks && (() => {
        const summary = getMentorRatingSummary(viewingMentorFeedbacks.id);
        return (
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(10,46,82,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setViewingMentorFeedbacks(null);
            }}
          >
            <div
              style={{
                background: "var(--bx-surface, #FFFFFF)",
                borderRadius: "10px",
                padding: "22px 26px",
                maxWidth: "750px",
                width: "100%",
                fontSize: "0.82rem",
                border: "1px solid var(--bx-border)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--bx-border)", paddingBottom: "12px", marginBottom: "14px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img
                    src={viewingMentorFeedbacks.avatar}
                    alt={viewingMentorFeedbacks.name}
                    style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--brand)" }}
                  />
                  <div>
                    <h3 style={{ margin: 0, color: "var(--brand)", fontSize: "1.05rem", fontFamily: "var(--font-heading)" }}>
                      {viewingMentorFeedbacks.name}
                    </h3>
                    <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                      {viewingMentorFeedbacks.title} • {viewingMentorFeedbacks.institution}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingMentorFeedbacks(null)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px" }}
                >
                  <FlatIcon type="close" size={16} color="var(--ink)" />
                </button>
              </div>

              {/* Rating Summary Strip */}
              <div
                style={{
                  background: "var(--bx-bg-alt)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 700 }}>Rata-Rata Rating:</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--brand)" }}>
                    ⭐ {summary.avgRating} <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 500 }}>({summary.count} ulasan)</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", fontSize: "0.72rem" }}>
                  <div style={{ background: "var(--bx-surface)", padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}>
                    <span style={{ color: "var(--muted)" }}>Kejelasan: </span>
                    <strong style={{ color: "var(--brand)" }}>{summary.clarityAvg}/5</strong>
                  </div>
                  <div style={{ background: "var(--bx-surface)", padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}>
                    <span style={{ color: "var(--muted)" }}>Ketepatan: </span>
                    <strong style={{ color: "var(--gold-2)" }}>{summary.punctualityAvg}/5</strong>
                  </div>
                  <div style={{ background: "var(--bx-surface)", padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}>
                    <span style={{ color: "var(--muted)" }}>Solusi: </span>
                    <strong style={{ color: "#059669" }}>{summary.technicalDepthAvg}/5</strong>
                  </div>
                </div>
              </div>

              {/* Feedbacks list */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {summary.list.map((fb) => (
                  <div
                    key={fb.id}
                    style={{
                      background: "var(--bx-surface)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <img
                          src={fb.studentAvatar}
                          alt={fb.studentName}
                          style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div>
                          <strong style={{ color: "var(--brand)", fontSize: "0.84rem" }}>{fb.studentName}</strong>
                          <span style={{ fontSize: "0.7rem", color: "var(--muted)", marginLeft: "4px" }}>({fb.studentNim})</span>
                          <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{fb.sessionTopic} • {fb.createdAt}</div>
                        </div>
                      </div>

                      <div style={{ fontWeight: 800, color: "var(--brand)", fontSize: "0.86rem" }}>
                        {"⭐".repeat(Math.round(fb.rating))} {fb.rating}.0
                      </div>
                    </div>

                    <div style={{ background: "rgba(245, 158, 11, 0.06)", borderLeft: "3px solid #F59E0B", padding: "6px 10px", borderRadius: "0 4px 4px 0", fontSize: "0.78rem", fontStyle: "italic" }}>
                      &quot;{fb.critiqueAndSuggestions}&quot;
                    </div>

                    {fb.mentorReply && (
                      <div style={{ background: "var(--bx-bg-alt)", border: "1px solid var(--bx-border)", borderRadius: "6px", padding: "6px 10px", fontSize: "0.74rem", marginLeft: "12px" }}>
                        <span style={{ fontWeight: 700, color: "var(--brand)" }}>Tanggapan Mentor: </span>
                        {fb.mentorReply}
                      </div>
                    )}
                  </div>
                ))}

                {summary.list.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px", color: "var(--muted)" }}>
                    Belum ada ulasan untuk mentor ini.
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "14px" }}>
                <button
                  type="button"
                  onClick={() => setViewingMentorFeedbacks(null)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "6px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-bg-alt)",
                    color: "var(--ink)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
