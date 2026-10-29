"use client";

import React, { useState, useEffect } from "react";
import FlatIcon from "./FlatIcon";

export interface ProgramSponsor {
  name: string;
  logo: string;
  description: string;
  scholarshipQuota: number; // Jumlah penerima beasiswa
  scholarshipType: "Penuh 100% (Free Tuition)" | "Parsial (50% Subsidi)" | "Tunjangan Komputasi & Living Allowance";
  valuePerStudent: number; // Valuasi beasiswa per siswa (Rp)
  totalCommittedFund: number; // Total komitmen dana (Rp)
  hiringCommitment: string; // Jaminan hiring / magang
}

export interface ProgramDropoutRegulation {
  autoLockEnabled: boolean; // Lock otomatis aktif jika batas waktu habis
  countdownEndDate: string; // Format ISO string YYYY-MM-DDTHH:mm:ss
  minCompletionRequired: number; // Persentase kelulusan wajib (100%)
  lockRecoveryFee: number; // Biaya pembayaran reguler jika terkena Drop Out (Rp)
  dropoutNotice: string; // Pesan / ketentuan regulasi
}

export interface ProgramStudentEnrollment {
  id: string;
  studentName: string;
  studentEmail: string;
  avatar: string;
  enrolledPathTitle: string;
  progressPercent: number;
  status: "Aktif" | "Lulus" | "Terancam Drop Out" | "Drop Out (Locked)" | "Unlocked (Paid)";
  lastActive: string;
}

export interface ProgramItem {
  id: string;
  badge: string;
  title: string;
  category: "bootcamp" | "fellowship" | "incubation" | "scholarship";
  image: string;
  duration: string;
  batch: string;
  quota: string;
  deadline: string;
  status: "Pendaftaran Buka" | "Seleksi Berkas" | "Sedang Berjalan" | "Selesai (Log History)";
  description: string;
  isArchivedHistory: boolean;
  historyCompletionNotes?: string;
  historyCompletedAt?: string;

  // Regulasi Countdown & Drop Out Lock
  dropoutRegulation: ProgramDropoutRegulation;

  // Sponsor & Beasiswa
  sponsor: ProgramSponsor;

  // Kurikulum Learning Paths
  learningPathSelectionMode: "all" | "single_choice" | "ai_recommendation";
  selectedLearningPathIds: string[];

  // Daftar Peserta Batch
  students: ProgramStudentEnrollment[];
}

export const AVAILABLE_LEARNING_PATHS = [
  {
    id: "lp-01",
    code: "TRACK-AI-01",
    title: "Artificial Intelligence & LLM Engineer",
    category: "AI & Data",
    coursesCount: 2,
    hours: 120,
    description: "Pembuatan agen cerdas otonom, fine-tuning LLM, RAG enterprise, dan FastMCP protocol.",
  },
  {
    id: "lp-02",
    code: "TRACK-FS-02",
    title: "Fullstack Web & Cloud Architecture",
    category: "Web & Mobile",
    coursesCount: 2,
    hours: 140,
    description: "Modern fullstack Next.js 16, backend microservices distributed, dan pipeline cloud CI/CD.",
  },
  {
    id: "lp-03",
    code: "TRACK-UX-03",
    title: "Product Designer & UI/UX Specialist",
    category: "UI/UX Design",
    coursesCount: 1,
    hours: 80,
    description: "Figma design system, token typography, usability heuristics, dan user journey modeling.",
  },
  {
    id: "lp-04",
    code: "TRACK-CLOUD-04",
    title: "Cloud-Native Infrastructure & Kubernetes",
    category: "Cloud & DevOps",
    coursesCount: 2,
    hours: 110,
    description: "Container orchestration, Terraform IaC, ArgoCD, observability, dan high availability cluster.",
  },
  {
    id: "lp-05",
    code: "TRACK-SEC-05",
    title: "Cyber Security & Smart Contract Audit",
    category: "Cyber Security",
    coursesCount: 2,
    hours: 100,
    description: "Penetration testing, vulnerability assessment, zero trust security, dan audit smart contract.",
  },
];

export const PRESET_SPONSORS = [
  {
    name: "Kementerian Komunikasi & Informatika RI",
    logo: "/programs/fellowship.jpg",
    type: "Penuh 100% (Free Tuition)" as const,
    defaultDescription: "Program beasiswa talenta digital nasional untuk kedaulatan riset kecerdasan buatan.",
  },
  {
    name: "PT Pixel Perdana Jaya",
    logo: "/jobs/job-1.jpg",
    type: "Penuh 100% (Free Tuition)" as const,
    defaultDescription: "Dukungan penuh riset industri teknologi enterprise, SaaS, dan GPU cluster.",
  },
  {
    name: "Google Cloud for Education",
    logo: "/programs/scholarship.jpg",
    type: "Tunjangan Komputasi & Living Allowance" as const,
    defaultDescription: "Penyedia kredit infrastruktur TPU v5e dan bimbingan sertifikasi profesional.",
  },
  {
    name: "PT Telkom Indonesia (Persero) Tbk",
    logo: "/jobs/job-2.jpg",
    type: "Penuh 100% (Free Tuition)" as const,
    defaultDescription: "Inisiatif beasiswa CSR transformasi digital pemuda Indonesia berstandar global.",
  },
];

const DEFAULT_SAMPLE_STUDENTS: ProgramStudentEnrollment[] = [
  {
    id: "stu-01",
    studentName: "Muhammad Farhan",
    studentEmail: "farhan.mhs@anvieo.ac.id",
    avatar: "/alumni/alumni_1.jpg",
    enrolledPathTitle: "Artificial Intelligence & LLM Engineer",
    progressPercent: 100,
    status: "Lulus",
    lastActive: "1 jam lalu",
  },
  {
    id: "stu-02",
    studentName: "Aditya Pratama",
    studentEmail: "aditya.pratama@outlook.com",
    avatar: "/alumni/alumni_3.jpg",
    enrolledPathTitle: "Artificial Intelligence & LLM Engineer",
    progressPercent: 78,
    status: "Aktif",
    lastActive: "4 jam lalu",
  },
  {
    id: "stu-03",
    studentName: "Siti Nurhaliza",
    studentEmail: "siti.nurhaliza@gmail.com",
    avatar: "/alumni/alumni_2.jpg",
    enrolledPathTitle: "Fullstack Web & Cloud Architecture",
    progressPercent: 35,
    status: "Terancam Drop Out",
    lastActive: "3 hari lalu",
  },
  {
    id: "stu-04",
    studentName: "Budi Santoso",
    studentEmail: "budi.santoso@yahoo.com",
    avatar: "/alumni/alumni_4.jpg",
    enrolledPathTitle: "Artificial Intelligence & LLM Engineer",
    progressPercent: 20,
    status: "Drop Out (Locked)",
    lastActive: "1 minggu lalu",
  },
  {
    id: "stu-05",
    studentName: "Dewi Lestari",
    studentEmail: "dewi.lestari@techcorp.id",
    avatar: "/alumni/alumni_2.jpg",
    enrolledPathTitle: "Product Designer & UI/UX Specialist",
    progressPercent: 60,
    status: "Unlocked (Paid)",
    lastActive: "Kemarin, 14:10",
  },
];

const INITIAL_PROGRAMS: ProgramItem[] = [
  {
    id: "prog-01",
    badge: "Intensive Bootcamp",
    title: "Fast-Track AI Specialist & LLM Engineering Intensive Bootcamp",
    category: "bootcamp",
    image: "/programs/fasttrack.jpg",
    duration: "12 Minggu Intensif",
    batch: "Batch 8 (Ganjil 2026)",
    quota: "45 / 50 Kursi",
    deadline: "15 November 2026",
    status: "Sedang Berjalan",
    isArchivedHistory: false,
    description: "Program akselerasi kompetensi praktis membangun agen kecerdasan artifisial, evaluasi penalaran model, dan arsitektur LLM enterprise.",
    dropoutRegulation: {
      autoLockEnabled: true,
      countdownEndDate: "2026-11-20T23:59:59",
      minCompletionRequired: 100,
      lockRecoveryFee: 1499000,
      dropoutNotice: "Siswa wajib menuntaskan 100% modul kurikulum dan proyek akhir sebelum hitung mundur berakhir. Jika timer habis dan materi belum selesai, sistem otomatis menerapkan Drop Out, akses kelas terkunci, dan re-admission dikenakan biaya reguler.",
    },
    sponsor: {
      name: "Kementerian Komunikasi & Informatika RI",
      logo: "/programs/fellowship.jpg",
      description: "Penyedia beasiswa talenta digital nasional untuk akselerasi kedaulatan AI dan model fondasi lokal.",
      scholarshipQuota: 50,
      scholarshipType: "Penuh 100% (Free Tuition)",
      valuePerStudent: 3500000,
      totalCommittedFund: 175000000,
      hiringCommitment: "Rekomendasi penempatan kerja prioritas di 20 hiring partner BUMN & unicorn teknologi.",
    },
    learningPathSelectionMode: "single_choice",
    selectedLearningPathIds: ["lp-01", "lp-02"],
    students: DEFAULT_SAMPLE_STUDENTS,
  },
  {
    id: "prog-02",
    badge: "Academic Fellowship",
    title: "Anvieo AI Research Fellowship & Paper Publication",
    category: "fellowship",
    image: "/programs/fellowship.jpg",
    duration: "6 Bulan Mentoring",
    batch: "Cohort 4",
    quota: "18 / 20 Peneliti",
    deadline: "30 November 2026",
    status: "Seleksi Berkas",
    isArchivedHistory: false,
    description: "Program riset bersama laboratorium kecerdasan buatan, pendampingan penulisan paper bereputasi Scopus/IEEE, dan komputasi GPU cluster.",
    dropoutRegulation: {
      autoLockEnabled: true,
      countdownEndDate: "2026-12-15T23:59:59",
      minCompletionRequired: 100,
      lockRecoveryFee: 1999000,
      dropoutNotice: "Peserta fellowship wajib submit naskah manuskrip tepat waktu sebelum periode program ditutup.",
    },
    sponsor: {
      name: "Google Cloud for Education",
      logo: "/programs/scholarship.jpg",
      description: "Dukungan kuota GPU Cluster TPU v5e dan bimbingan mentor riset AI internasional.",
      scholarshipQuota: 20,
      scholarshipType: "Tunjangan Komputasi & Living Allowance",
      valuePerStudent: 5000000,
      totalCommittedFund: 100000000,
      hiringCommitment: "Direct interview jalur peneliti AI di pusat riset global.",
    },
    learningPathSelectionMode: "all",
    selectedLearningPathIds: ["lp-01", "lp-04"],
    students: DEFAULT_SAMPLE_STUDENTS.slice(0, 3),
  },
  {
    id: "prog-03",
    badge: "Venture Incubation",
    title: "AI Startup Venture Studio & Founder Clinic",
    category: "incubation",
    image: "/programs/incubation.jpg",
    duration: "16 Minggu",
    batch: "Spring 2027",
    quota: "12 Tim Terpilih",
    deadline: "10 Desember 2026",
    status: "Pendaftaran Buka",
    isArchivedHistory: false,
    description: "Inkubasi ide produk tugas akhir mahasiswa menjadi startup SaaS komersial dengan bimbingan venture capitalist dan grant pra-pendanaan.",
    dropoutRegulation: {
      autoLockEnabled: true,
      countdownEndDate: "2026-12-30T23:59:59",
      minCompletionRequired: 100,
      lockRecoveryFee: 2499000,
      dropoutNotice: "Tim wajib meluncurkan MVP terverifikasi pengguna aktif sebelum tanggal evaluasi akhir.",
    },
    sponsor: {
      name: "PT Pixel Perdana Jaya",
      logo: "/jobs/job-1.jpg",
      description: "Venture builder dan penyedia seed funding untuk 5 tim inovasi software enterprise terbaik.",
      scholarshipQuota: 12,
      scholarshipType: "Penuh 100% (Free Tuition)",
      valuePerStudent: 7500000,
      totalCommittedFund: 90000000,
      hiringCommitment: "Akses permodalan awal dan inkubasi legalitas PT gratis.",
    },
    learningPathSelectionMode: "ai_recommendation",
    selectedLearningPathIds: ["lp-01", "lp-02", "lp-03"],
    students: DEFAULT_SAMPLE_STUDENTS.slice(0, 2),
  },
  {
    id: "prog-04",
    badge: "Full Scholarship",
    title: "Beasiswa Unggulan Talenta Digital Masa Depan Batch 7",
    category: "scholarship",
    image: "/programs/scholarship.jpg",
    duration: "1 Tahun Akademik",
    batch: "Batch 7 (Genap 2025/2026)",
    quota: "100 Penerima",
    deadline: "10 Oktober 2026",
    status: "Selesai (Log History)",
    isArchivedHistory: true,
    historyCompletedAt: "10 Oktober 2026",
    historyCompletionNotes: "Event Beasiswa Batch 7 telah selesai secara resmi. Dari total 100 penerima beasiswa, 88 siswa berhasil lulus 100% dan memperoleh sertifikat kompetensi. 12 siswa terkena Drop Out akibat batas waktu berakhir. Total dana sponsor terserap Rp 350.000.000.",
    description: "Pembiayaan penuh biaya kuliah, tunjangan sertifikasi cloud internasional, dan akses magang langsung di jaringan hiring partner ANVIEO.",
    dropoutRegulation: {
      autoLockEnabled: true,
      countdownEndDate: "2026-10-10T23:59:59",
      minCompletionRequired: 100,
      lockRecoveryFee: 1499000,
      dropoutNotice: "Program ini telah berakhir dan seluruh data peserta telah dipindahkan ke arsip log history.",
    },
    sponsor: {
      name: "PT Telkom Indonesia (Persero) Tbk",
      logo: "/jobs/job-2.jpg",
      description: "Corporate Social Responsibility untuk percepatan talenta digital Nusantara.",
      scholarshipQuota: 100,
      scholarshipType: "Penuh 100% (Free Tuition)",
      valuePerStudent: 3500000,
      totalCommittedFund: 350000000,
      hiringCommitment: "Program magang bersertifikat di Telkom Digital Group.",
    },
    learningPathSelectionMode: "single_choice",
    selectedLearningPathIds: ["lp-02", "lp-04"],
    students: DEFAULT_SAMPLE_STUDENTS,
  },
];

// Hook untuk menghitung hitung mundur waktu (Countdown)
function useBootcampCountdown(targetDateStr: string) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const updateCountdown = () => {
      const targetTime = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0 || isNaN(diff)) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  return timeLeft;
}

// Komponen Badge Hitung Mundur Live
function LiveCountdownBadge({ targetDate, isArchived }: { targetDate: string; isArchived?: boolean }) {
  const { days, hours, minutes, seconds, isExpired } = useBootcampCountdown(targetDate);

  if (isArchived || isExpired) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 8px",
          borderRadius: "4px",
          background: isArchived ? "var(--bx-bg-alt)" : "#FEF2F2",
          border: isArchived ? "1px solid var(--bx-border)" : "1px solid #FCA5A5",
          color: isArchived ? "var(--muted)" : "#DC2626",
          fontSize: "0.72rem",
          fontWeight: 700,
        }}
      >
        <span>{isArchived ? "📜" : "⚠️"}</span>
        <span>{isArchived ? "Event Selesai (Arsip History)" : "WAKTU HABIS • KELAS DI-LOCK / DROP OUT"}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 8px",
        borderRadius: "4px",
        background: "rgba(10, 46, 82, 0.06)",
        border: "1px solid rgba(10, 46, 82, 0.15)",
        color: "var(--brand, #0A2E52)",
        fontSize: "0.72rem",
        fontWeight: 700,
      }}
    >
      <FlatIcon type="clock" size={13} color="var(--brand)" />
      <span>
        Sisa Waktu: {days}h {String(hours).padStart(2, "0")}j {String(minutes).padStart(2, "0")}m {String(seconds).padStart(2, "0")}d
      </span>
    </div>
  );
}

type SliderTab = "info" | "dropout" | "sponsor" | "paths" | "students" | "history";

export default function SimakProgramsView() {
  const [programs, setPrograms] = useState<ProgramItem[]>(INITIAL_PROGRAMS);
  const [viewMode, setViewMode] = useState<"active" | "history">("active");
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // Drawer Slider 95% State
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);
  const [activeTab, setActiveTab] = useState<SliderTab>("info");

  // Filter list berdasarkan active vs history & search
  const filtered = programs.filter((p) => {
    if (viewMode === "active" && p.isArchivedHistory) return false;
    if (viewMode === "history" && !p.isArchivedHistory) return false;
    if (filter !== "all" && p.category !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.badge.toLowerCase().includes(q) ||
      p.batch.toLowerCase().includes(q) ||
      p.sponsor.name.toLowerCase().includes(q)
    );
  });

  const activeProgramsCount = programs.filter((p) => !p.isArchivedHistory).length;
  const historyProgramsCount = programs.filter((p) => p.isArchivedHistory).length;

  const handleOpenNewProgram = () => {
    const newProg: ProgramItem = {
      id: `prog-${Date.now()}`,
      badge: "Intensive Bootcamp",
      title: "",
      category: "bootcamp",
      image: "/programs/fasttrack.jpg",
      duration: "12 Minggu Intensif",
      batch: `Batch ${programs.length + 1} (2026/2027)`,
      quota: "50 Kursi",
      deadline: "20 Desember 2026",
      status: "Pendaftaran Buka",
      isArchivedHistory: false,
      description: "",
      dropoutRegulation: {
        autoLockEnabled: true,
        countdownEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19),
        minCompletionRequired: 100,
        lockRecoveryFee: 1499000,
        dropoutNotice: "Peserta beasiswa wajib menuntaskan 100% materi sebelum waktu countdown berakhir. Jika gagal, kelas di-lock otomatis dan status menjadi Drop Out.",
      },
      sponsor: {
        name: "Kementerian Komunikasi & Informatika RI",
        logo: "/programs/fellowship.jpg",
        description: "Beasiswa penuh industri teknologi untuk percepatan talenta AI digital nasional.",
        scholarshipQuota: 50,
        scholarshipType: "Penuh 100% (Free Tuition)",
        valuePerStudent: 3500000,
        totalCommittedFund: 175000000,
        hiringCommitment: "Fasilitas penyaluran kerja di ekosistem partner.",
      },
      learningPathSelectionMode: "single_choice",
      selectedLearningPathIds: ["lp-01"],
      students: DEFAULT_SAMPLE_STUDENTS,
    };
    setEditingProgram(newProg);
    setActiveTab("info");
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;

    // Recalculate total committed fund
    const updatedSponsor = {
      ...editingProgram.sponsor,
      totalCommittedFund: editingProgram.sponsor.scholarshipQuota * editingProgram.sponsor.valuePerStudent,
    };

    const finalProg: ProgramItem = {
      ...editingProgram,
      sponsor: updatedSponsor,
    };

    const exists = programs.some((p) => p.id === finalProg.id);
    if (exists) {
      setPrograms(programs.map((p) => (p.id === finalProg.id ? finalProg : p)));
    } else {
      setPrograms([finalProg, ...programs]);
    }

    alert("Program berhasil disimpan beserta regulasi countdown, sponsor, dan alur learning path!");
    setEditingProgram(null);
  };

  const handleDeleteProgram = (progId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus program ini secara permanen?")) {
      setPrograms(programs.filter((p) => p.id !== progId));
      if (editingProgram?.id === progId) {
        setEditingProgram(null);
      }
    }
  };

  const handleArchiveToHistory = (prog: ProgramItem) => {
    const notes = prompt(
      "Masukkan Catatan Penyelesaian Event untuk Log History (misal: Total kelulusan, evaluasi sponsor, drop out):",
      `Event selesai pada ${new Date().toLocaleDateString("id-ID")}. Seluruh modul telah ditutup.`
    );
    if (notes === null) return;

    const updated: ProgramItem = {
      ...prog,
      status: "Selesai (Log History)",
      isArchivedHistory: true,
      historyCompletedAt: new Date().toLocaleDateString("id-ID"),
      historyCompletionNotes: notes,
    };

    setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
    alert(`Program "${prog.title}" berhasil diarsipkan ke Log History!`);
    if (editingProgram?.id === prog.id) {
      setEditingProgram(null);
    }
  };

  const handleRestoreFromHistory = (prog: ProgramItem) => {
    if (confirm("Kembalikan program ini ke status Aktif / Sedang Berjalan?")) {
      const updated: ProgramItem = {
        ...prog,
        status: "Sedang Berjalan",
        isArchivedHistory: false,
      };
      setPrograms(programs.map((p) => (p.id === prog.id ? updated : p)));
      alert(`Program "${prog.title}" kini kembali aktif.`);
      if (editingProgram?.id === prog.id) {
        setEditingProgram(null);
      }
    }
  };

  // Toggle multi-select Learning Path
  const handleTogglePath = (pathId: string) => {
    if (!editingProgram) return;
    const current = editingProgram.selectedLearningPathIds;
    const exists = current.includes(pathId);
    let next: string[];
    if (exists) {
      if (current.length === 1) {
        alert("Program wajib memiliki minimal 1 Learning Path terpilih!");
        return;
      }
      next = current.filter((id) => id !== pathId);
    } else {
      next = [...current, pathId];
    }
    setEditingProgram({ ...editingProgram, selectedLearningPathIds: next });
  };

  // Simulasi Eksekusi Regulasi Lock & Drop Out Masal
  const handleExecuteDropoutAudit = () => {
    if (!editingProgram) return;
    const minPercent = editingProgram.dropoutRegulation.minCompletionRequired || 100;
    let lockedCount = 0;

    const auditedStudents = editingProgram.students.map((stu) => {
      if (stu.progressPercent < minPercent && stu.status !== "Unlocked (Paid)" && stu.status !== "Lulus") {
        lockedCount++;
        return {
          ...stu,
          status: "Drop Out (Locked)" as const,
        };
      }
      return stu;
    });

    setEditingProgram({
      ...editingProgram,
      students: auditedStudents,
    });

    alert(
      `Eksekusi Regulasi Selesai!\n${lockedCount} peserta yang belum mencapai ${minPercent}% materi kini berstatus "Drop Out (Locked)".\nAkses kelas dikunci sampai siswa membayar biaya reguler Rp ${editingProgram.dropoutRegulation.lockRecoveryFee.toLocaleString("id-ID")}.`
    );
  };

  // Buka lock siswa setelah pembayaran
  const handleUnlockStudent = (stuId: string) => {
    if (!editingProgram) return;
    const updated = editingProgram.students.map((s) =>
      s.id === stuId ? { ...s, status: "Unlocked (Paid)" as const } : s
    );
    setEditingProgram({ ...editingProgram, students: updated });
    alert("Akses kelas peserta berhasil dibuka kembali (Status: Unlocked Paid).");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Top Header Card */}
      <div
        style={{
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "10px",
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
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
              Program Unggulan &amp; Beasiswa
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              Bootcamp Intensif, Kemitraan Sponsor &amp; Regulasi Auto-Lock
            </span>
          </div>
          <h2 style={{ fontSize: "1.25rem", fontFamily: "var(--font-heading)", margin: "4px 0 2px", color: "var(--brand)" }}>
            Manajemen Program &amp; Pelatihan Terbaru
          </h2>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
            Pengelolaan bootcamp beasiswa, sistem hitung mundur (countdown), penalti drop out otomatis, dan arsip riwayat event.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNewProgram}
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
          <span>Tambah Program Baru</span>
        </button>
      </div>

      {/* View Mode & Filter Controls */}
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
        {/* Toggle Mode: Aktif vs Log History */}
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={() => setViewMode("active")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              border: viewMode === "active" ? "1px solid var(--brand)" : "1px solid var(--bx-border)",
              background: viewMode === "active" ? "var(--brand)" : "var(--bx-bg-alt)",
              color: viewMode === "active" ? "#ffffff" : "var(--ink)",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>Program Aktif &amp; Berjalan</span>
            <span
              style={{
                fontSize: "0.7rem",
                padding: "1px 6px",
                borderRadius: "10px",
                background: viewMode === "active" ? "rgba(255,255,255,0.25)" : "var(--bx-border)",
              }}
            >
              {activeProgramsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("history")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              border: viewMode === "history" ? "1px solid var(--gold)" : "1px solid var(--bx-border)",
              background: viewMode === "history" ? "var(--gold)" : "var(--bx-bg-alt)",
              color: viewMode === "history" ? "#ffffff" : "var(--ink)",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>Log History &amp; Arsip Selesai</span>
            <span
              style={{
                fontSize: "0.7rem",
                padding: "1px 6px",
                borderRadius: "10px",
                background: viewMode === "history" ? "rgba(255,255,255,0.25)" : "var(--bx-border)",
              }}
            >
              {historyProgramsCount}
            </span>
          </button>
        </div>

        {/* Filter Category & Search */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {[
              { id: "all", label: "Semua Kategori" },
              { id: "bootcamp", label: "Bootcamp" },
              { id: "fellowship", label: "Fellowship" },
              { id: "incubation", label: "Inkubasi" },
              { id: "scholarship", label: "Beasiswa" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: "4px 8px",
                  fontSize: "0.74rem",
                  fontWeight: filter === tab.id ? 700 : 500,
                  borderRadius: "5px",
                  border: filter === tab.id ? "1px solid var(--gold)" : "1px solid var(--bx-border)",
                  background: filter === tab.id ? "var(--bx-bg-alt)" : "transparent",
                  color: filter === tab.id ? "var(--brand)" : "var(--muted)",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

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
              placeholder="Cari program / sponsor..."
              style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.78rem", width: "160px", color: "var(--ink)" }}
            />
          </div>
        </div>
      </div>

      {/* Grid Program Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: "14px",
        }}
      >
        {filtered.map((prog) => (
          <div
            key={prog.id}
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 2px 6px rgba(10, 46, 82, 0.04)",
              position: "relative",
            }}
          >
            {/* Image Banner */}
            <div style={{ position: "relative", height: "140px", width: "100%", background: "var(--bx-bg-alt)" }}>
              <img
                src={prog.image}
                alt={prog.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background: "rgba(10, 46, 82, 0.9)",
                  color: "#ffffff",
                  backdropFilter: "blur(4px)",
                }}
              >
                {prog.badge}
              </span>
              <span
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background:
                    prog.status === "Sedang Berjalan"
                      ? "#059669"
                      : prog.status === "Selesai (Log History)"
                      ? "#64748B"
                      : "#C9962E",
                  color: "#ffffff",
                }}
              >
                {prog.status}
              </span>
            </div>

            {/* Card Body */}
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", flex: 1, gap: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.02rem", fontFamily: "var(--font-heading)", color: "var(--brand)", lineHeight: 1.3 }}>
                {prog.title}
              </h3>

              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.4 }}>
                {prog.description}
              </p>

              {/* Countdown Timer Badge */}
              <LiveCountdownBadge
                targetDate={prog.dropoutRegulation.countdownEndDate}
                isArchived={prog.isArchivedHistory}
              />

              {/* Sponsor & Scholarship Info */}
              <div
                style={{
                  background: "var(--bx-bg-alt)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.74rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <img
                    src={prog.sponsor.logo}
                    alt={prog.sponsor.name}
                    style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--brand)" }}>{prog.sponsor.name}</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
                      Beasiswa: {prog.sponsor.scholarshipQuota} Siswa ({prog.sponsor.scholarshipType.split(" ")[0]})
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: "var(--gold-2)" }}>
                    Rp {(prog.sponsor.totalCommittedFund / 1000000).toFixed(0)} Juta
                  </div>
                  <div style={{ fontSize: "0.66rem", color: "var(--muted)" }}>Komitmen Dana</div>
                </div>
              </div>

              {/* Multi Learning Path Badges */}
              <div style={{ fontSize: "0.74rem" }}>
                <span style={{ color: "var(--muted)", display: "block", marginBottom: "4px" }}>
                  Jalur Pembelajaran ({prog.selectedLearningPathIds.length} Jalur • {prog.learningPathSelectionMode === "all" ? "Dapat Semua" : "Pilihan Siswa"}):
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {prog.selectedLearningPathIds.map((pId) => {
                    const found = AVAILABLE_LEARNING_PATHS.find((lp) => lp.id === pId);
                    return (
                      <span
                        key={pId}
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: "var(--bx-bg-alt)",
                          border: "1px solid var(--bx-border)",
                          color: "var(--brand)",
                        }}
                      >
                        {found ? found.code : pId}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Drop Out Rule Notice */}
              <div
                style={{
                  fontSize: "0.72rem",
                  padding: "6px 8px",
                  borderRadius: "5px",
                  background: "#FEF2F2",
                  border: "1px solid #FCA5A5",
                  color: "#991B1B",
                  lineHeight: 1.35,
                }}
              >
                <strong>Regulasi Drop Out:</strong> Wajib 100% selesai sebelum timer habis. Jika gagal, kelas terkunci dan re-admission dikenakan biaya reguler <strong>Rp {prog.dropoutRegulation.lockRecoveryFee.toLocaleString("id-ID")}</strong>.
              </div>

              {/* Log History Notes if Archived */}
              {prog.isArchivedHistory && prog.historyCompletionNotes && (
                <div
                  style={{
                    fontSize: "0.72rem",
                    padding: "6px 8px",
                    borderRadius: "5px",
                    background: "var(--bx-bg-alt)",
                    border: "1px solid var(--bx-border)",
                    color: "var(--muted)",
                  }}
                >
                  <strong>Catatan Arsip:</strong> {prog.historyCompletionNotes}
                </div>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "10px",
                  borderTop: "1px solid var(--bx-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => handleDeleteProgram(prog.id)}
                    title="Hapus Program"
                    style={{
                      padding: "5px 10px",
                      borderRadius: "4px",
                      border: "1px solid #FCA5A5",
                      background: "transparent",
                      color: "#DC2626",
                      fontSize: "0.74rem",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Hapus
                  </button>

                  {!prog.isArchivedHistory ? (
                    <button
                      type="button"
                      onClick={() => handleArchiveToHistory(prog)}
                      title="Selesaikan dan simpan ke Log History"
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        border: "1px solid var(--bx-border)",
                        background: "var(--bx-bg-alt)",
                        color: "var(--ink)",
                        fontSize: "0.74rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Arsipkan History
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRestoreFromHistory(prog)}
                      title="Kembalikan ke program aktif"
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        border: "1px solid var(--bx-border)",
                        background: "var(--bx-bg-alt)",
                        color: "var(--brand)",
                        fontSize: "0.74rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Aktifkan Kembali
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProgram(prog);
                    setActiveTab("info");
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

        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "40px",
              textAlign: "center",
              background: "var(--bx-surface)",
              borderRadius: "10px",
              border: "1px dashed var(--bx-border)",
              color: "var(--muted)",
            }}
          >
            Tidak ada program yang sesuai dengan kriteria filter saat ini.
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* SLIDER 95% DRAWER: PROGRAM, SPONSOR, COUNTDOWN & PATHS STUDIO */}
      {/* ============================================================== */}
      {editingProgram && (
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
            if (e.target === e.currentTarget) setEditingProgram(null);
          }}
        >
          <div
            className="program-studio-slider-95"
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
            {/* Top Bar */}
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
                  SLIDER 95% • PROGRAM &amp; BOOTCAMP STUDIO
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
                  {editingProgram.title || "Tambah Program Baru"}
                </h3>
                <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                  ({editingProgram.batch} • Sponsor: {editingProgram.sponsor.name})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setEditingProgram(null)}
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

            {/* Tabs Navigation */}
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
                { id: "info", label: "1. Informasi & Periode" },
                { id: "dropout", label: "2. Countdown & Regulasi Drop Out" },
                { id: "sponsor", label: "3. Sponsor & Kuota Beasiswa" },
                { id: "paths", label: `4. Pilihan Learning Path (${editingProgram.selectedLearningPathIds.length})` },
                { id: "students", label: `5. Peserta & Lock Management (${editingProgram.students.length})` },
                { id: "history", label: "6. Arsip Log History" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as SliderTab)}
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
              {/* TAB 1: INFORMASI PROGRAM */}
              {activeTab === "info" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1200px" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                      Judul Program / Bootcamp
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProgram.title}
                      onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                      placeholder="Misal: Fast-Track AI Specialist & LLM Engineering Intensive Bootcamp"
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Kategori Program
                      </label>
                      <select
                        value={editingProgram.category}
                        onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value as any })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      >
                        <option value="bootcamp">Intensive Bootcamp</option>
                        <option value="fellowship">Academic Fellowship</option>
                        <option value="incubation">Venture Incubation</option>
                        <option value="scholarship">Full Scholarship</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Badge Label
                      </label>
                      <input
                        type="text"
                        value={editingProgram.badge}
                        onChange={(e) => setEditingProgram({ ...editingProgram, badge: e.target.value })}
                        placeholder="Misal: Intensive Bootcamp"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Batch / Cohort
                      </label>
                      <input
                        type="text"
                        value={editingProgram.batch}
                        onChange={(e) => setEditingProgram({ ...editingProgram, batch: e.target.value })}
                        placeholder="Misal: Batch 8 (Ganjil 2026)"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Durasi Program
                      </label>
                      <input
                        type="text"
                        value={editingProgram.duration}
                        onChange={(e) => setEditingProgram({ ...editingProgram, duration: e.target.value })}
                        placeholder="Misal: 12 Minggu Intensif"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Total Kuota Peserta Umum
                      </label>
                      <input
                        type="text"
                        value={editingProgram.quota}
                        onChange={(e) => setEditingProgram({ ...editingProgram, quota: e.target.value })}
                        placeholder="Misal: 50 Kursi"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Batas Akhir Pendaftaran (Deadline)
                      </label>
                      <input
                        type="text"
                        value={editingProgram.deadline}
                        onChange={(e) => setEditingProgram({ ...editingProgram, deadline: e.target.value })}
                        placeholder="Misal: 15 November 2026"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Gambar Banner Cover (URL)
                      </label>
                      <input
                        type="text"
                        value={editingProgram.image}
                        onChange={(e) => setEditingProgram({ ...editingProgram, image: e.target.value })}
                        placeholder="/programs/fasttrack.jpg"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Status Penerimaan
                      </label>
                      <select
                        value={editingProgram.status}
                        onChange={(e) => setEditingProgram({ ...editingProgram, status: e.target.value as any })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      >
                        <option value="Pendaftaran Buka">Pendaftaran Buka</option>
                        <option value="Seleksi Berkas">Seleksi Berkas</option>
                        <option value="Sedang Berjalan">Sedang Berjalan (Active Batch)</option>
                        <option value="Selesai (Log History)">Selesai (Arsipkan ke Log History)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                      Deskripsi Lengkap Program &amp; Silabus
                    </label>
                    <textarea
                      rows={4}
                      value={editingProgram.description}
                      onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                      placeholder="Jelaskan tujuan bootcamp, sasaran kompetensi, dan persyaratan akademik..."
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem", lineHeight: 1.5 }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: TIMER COUNTDOWN & REGULASI DROP OUT */}
              {activeTab === "dropout" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1200px" }}>
                  {/* Alert Regulasi */}
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: "8px",
                      background: "#FEF2F2",
                      border: "1px solid #FCA5A5",
                      color: "#991B1B",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>⚠️</span>
                      <span>Sistem Penalti Drop Out &amp; Auto-Lock Otomatis</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.78rem", lineHeight: 1.45 }}>
                      Setiap peserta beasiswa bootcamp memiliki tenggat waktu terhitung mundur secara otomatis. Jika waktu habis dan peserta belum mencapai 100% kelulusan modul, status otomatis dialihkan menjadi <strong>Drop Out</strong> dan akses kelas di-<strong>LOCK (Terkunci)</strong>. Untuk melanjutkan dan membuka kembali akses materi, siswa diwajibkan membayar tarif normal.
                    </p>
                  </div>

                  {/* Pengaturan Timer */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{ background: "var(--bx-bg-alt)", padding: "16px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 700, marginBottom: "12px", color: "var(--brand)" }}>
                        <input
                          type="checkbox"
                          checked={editingProgram.dropoutRegulation.autoLockEnabled}
                          onChange={(e) =>
                            setEditingProgram({
                              ...editingProgram,
                              dropoutRegulation: {
                                ...editingProgram.dropoutRegulation,
                                autoLockEnabled: e.target.checked,
                              },
                            })
                          }
                        />
                        <span>Aktifkan Eksekusi Auto-Lock &amp; Drop Out saat Waktu Habis</span>
                      </label>

                      <div>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                          Waktu Berakhir Bootcamp (Tanggal &amp; Jam Cutoff)
                        </label>
                        <input
                          type="datetime-local"
                          value={editingProgram.dropoutRegulation.countdownEndDate.slice(0, 16)}
                          onChange={(e) =>
                            setEditingProgram({
                              ...editingProgram,
                              dropoutRegulation: {
                                ...editingProgram.dropoutRegulation,
                                countdownEndDate: `${e.target.value}:00`,
                              },
                            })
                          }
                          style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                        />
                      </div>

                      <div style={{ marginTop: "12px" }}>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                          Target Minimal Kelulusan (%)
                        </label>
                        <input
                          type="number"
                          min={50}
                          max={100}
                          value={editingProgram.dropoutRegulation.minCompletionRequired}
                          onChange={(e) =>
                            setEditingProgram({
                              ...editingProgram,
                              dropoutRegulation: {
                                ...editingProgram.dropoutRegulation,
                                minCompletionRequired: Number(e.target.value),
                              },
                            })
                          }
                          style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                        />
                        <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                          Default 100%: Siswa wajib menuntaskan seluruh bab, kuis, dan tugas akhir.
                        </span>
                      </div>
                    </div>

                    <div style={{ background: "var(--bx-bg-alt)", padding: "16px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                      <div>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                          Biaya Buka Lock / Pembayaran Reguler Siswa (Rp)
                        </label>
                        <input
                          type="number"
                          value={editingProgram.dropoutRegulation.lockRecoveryFee}
                          onChange={(e) =>
                            setEditingProgram({
                              ...editingProgram,
                              dropoutRegulation: {
                                ...editingProgram.dropoutRegulation,
                                lockRecoveryFee: Number(e.target.value),
                              },
                            })
                          }
                          placeholder="1499000"
                          style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                        />
                        <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                          Biaya re-admission yang harus dibayar siswa di portal bila terkena sanksi Drop Out.
                        </span>
                      </div>

                      <div style={{ marginTop: "14px" }}>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                          Peringatan Regulasi untuk Peserta
                        </label>
                        <textarea
                          rows={3}
                          value={editingProgram.dropoutRegulation.dropoutNotice}
                          onChange={(e) =>
                            setEditingProgram({
                              ...editingProgram,
                              dropoutRegulation: {
                                ...editingProgram.dropoutRegulation,
                                dropoutNotice: e.target.value,
                              },
                            })
                          }
                          style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.78rem" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status Hitung Mundur Real-Time Saat Ini */}
                  <div style={{ padding: "14px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
                    <div style={{ fontWeight: 700, color: "var(--brand)", marginBottom: "6px" }}>
                      Pratinjau Hitung Mundur Waktu Bootcamp:
                    </div>
                    <LiveCountdownBadge targetDate={editingProgram.dropoutRegulation.countdownEndDate} />
                  </div>
                </div>
              )}

              {/* TAB 3: SPONSOR & KUOTA BEASISWA */}
              {activeTab === "sponsor" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1200px" }}>
                  {/* Preset Sponsor Selector */}
                  <div style={{ background: "var(--bx-bg-alt)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                    <span style={{ fontWeight: 700, color: "var(--brand)", display: "block", marginBottom: "8px" }}>
                      Pilih Cepat Partner Sponsor Industri:
                    </span>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {PRESET_SPONSORS.map((sp) => (
                        <button
                          key={sp.name}
                          type="button"
                          onClick={() => {
                            setEditingProgram({
                              ...editingProgram,
                              sponsor: {
                                ...editingProgram.sponsor,
                                name: sp.name,
                                logo: sp.logo,
                                scholarshipType: sp.type,
                                description: sp.defaultDescription,
                              },
                            });
                          }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: editingProgram.sponsor.name === sp.name ? "1px solid var(--brand)" : "1px solid var(--bx-border)",
                            background: editingProgram.sponsor.name === sp.name ? "var(--brand)" : "var(--bx-surface)",
                            color: editingProgram.sponsor.name === sp.name ? "#ffffff" : "var(--ink)",
                            fontSize: "0.76rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <img src={sp.logo} alt={sp.name} style={{ width: "16px", height: "16px", borderRadius: "50%" }} />
                          <span>{sp.name.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Nama Instansi / Perusahaan Sponsor
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProgram.sponsor.name}
                        onChange={(e) =>
                          setEditingProgram({
                            ...editingProgram,
                            sponsor: { ...editingProgram.sponsor, name: e.target.value },
                          })
                        }
                        placeholder="Misal: Kementerian Komunikasi & Informatika RI"
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        URL Logo Sponsor
                      </label>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                          type="text"
                          value={editingProgram.sponsor.logo}
                          onChange={(e) =>
                            setEditingProgram({
                              ...editingProgram,
                              sponsor: { ...editingProgram.sponsor, logo: e.target.value },
                            })
                          }
                          placeholder="/programs/fellowship.jpg"
                          style={{ flex: 1, padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                        />
                        <img
                          src={editingProgram.sponsor.logo}
                          alt="Preview"
                          style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover", border: "1px solid var(--bx-border)" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Total Siswa Penerima Beasiswa
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={editingProgram.sponsor.scholarshipQuota}
                        onChange={(e) =>
                          setEditingProgram({
                            ...editingProgram,
                            sponsor: {
                              ...editingProgram.sponsor,
                              scholarshipQuota: Number(e.target.value),
                            },
                          })
                        }
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Tipe / Skema Beasiswa
                      </label>
                      <select
                        value={editingProgram.sponsor.scholarshipType}
                        onChange={(e) =>
                          setEditingProgram({
                            ...editingProgram,
                            sponsor: { ...editingProgram.sponsor, scholarshipType: e.target.value as any },
                          })
                        }
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      >
                        <option value="Penuh 100% (Free Tuition)">Penuh 100% (Free Tuition)</option>
                        <option value="Parsial (50% Subsidi)">Parsial (50% Subsidi)</option>
                        <option value="Tunjangan Komputasi & Living Allowance">Tunjangan Komputasi &amp; Living Allowance</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Valuasi per Siswa (Rp)
                      </label>
                      <input
                        type="number"
                        value={editingProgram.sponsor.valuePerStudent}
                        onChange={(e) =>
                          setEditingProgram({
                            ...editingProgram,
                            sponsor: {
                              ...editingProgram.sponsor,
                              valuePerStudent: Number(e.target.value),
                            },
                          })
                        }
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                      />
                    </div>
                  </div>

                  {/* Kalkulasi Total Komitmen Dana */}
                  <div
                    style={{
                      background: "rgba(201, 150, 46, 0.08)",
                      border: "1px solid var(--gold)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--brand)" }}>Total Nilai Komitmen Beasiswa Sponsor:</div>
                      <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                        {editingProgram.sponsor.scholarshipQuota} Siswa × Rp {editingProgram.sponsor.valuePerStudent.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--gold-2)" }}>
                      Rp {(editingProgram.sponsor.scholarshipQuota * editingProgram.sponsor.valuePerStudent).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                      Keterangan Sponsor &amp; Ruang Lingkup Kemitraan
                    </label>
                    <textarea
                      rows={3}
                      value={editingProgram.sponsor.description}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          sponsor: { ...editingProgram.sponsor, description: e.target.value },
                        })
                      }
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                      Komitmen Penyaluran Kerja / Hiring Partner
                    </label>
                    <input
                      type="text"
                      value={editingProgram.sponsor.hiringCommitment}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          sponsor: { ...editingProgram.sponsor, hiringCommitment: e.target.value },
                        })
                      }
                      placeholder="Misal: Jaminan prioritas interview bagi 10 lulusan terbaik di jaringan holding."
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.84rem" }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: PILIHAN MULTI LEARNING PATH */}
              {activeTab === "paths" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1200px" }}>
                  {/* Mode Distribusi Jalur */}
                  <div>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: "8px", color: "var(--brand)", fontSize: "0.88rem" }}>
                      Aturan Distribusi Learning Path untuk Siswa:
                    </label>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                      {[
                        {
                          id: "all",
                          title: "Siswa Mendapatkan Semua Jalur Sekaligus",
                          desc: "Siswa otomatis di-enroll ke seluruh learning path yang terpilih dalam paket beasiswa ini.",
                        },
                        {
                          id: "single_choice",
                          title: "Siswa Memilih Salah Satu Jalur",
                          desc: "Siswa penerima beasiswa memilih salah satu spesialisasi saat registrasi atau orientasi.",
                        },
                        {
                          id: "ai_recommendation",
                          title: "Rekomendasi AI Otomatis",
                          desc: "AI menganalisis profil dan tes diagnostik awal untuk menempatkan siswa di jalur terbaik.",
                        },
                      ].map((mode) => {
                        const isSelected = editingProgram.learningPathSelectionMode === mode.id;
                        return (
                          <div
                            key={mode.id}
                            onClick={() =>
                              setEditingProgram({
                                ...editingProgram,
                                learningPathSelectionMode: mode.id as any,
                              })
                            }
                            style={{
                              padding: "12px 14px",
                              borderRadius: "8px",
                              border: isSelected ? "2px solid var(--gold)" : "1px solid var(--bx-border)",
                              background: isSelected ? "rgba(201, 150, 46, 0.08)" : "var(--bx-surface)",
                              cursor: "pointer",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <div style={{ fontWeight: 700, color: "var(--brand)", fontSize: "0.82rem" }}>
                              {mode.title}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.35 }}>
                              {mode.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Multi-Select Daftar Learning Paths */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <strong style={{ color: "var(--brand)", fontSize: "0.86rem" }}>
                        Pilih Learning Path yang Diikutsertakan ({editingProgram.selectedLearningPathIds.length} Terpilih):
                      </strong>
                      <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                        Centang minimal 1 atau lebih jalur pembelajaran
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {AVAILABLE_LEARNING_PATHS.map((lp) => {
                        const isChecked = editingProgram.selectedLearningPathIds.includes(lp.id);
                        return (
                          <div
                            key={lp.id}
                            onClick={() => handleTogglePath(lp.id)}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "12px 16px",
                              borderRadius: "8px",
                              border: isChecked ? "1px solid var(--brand)" : "1px solid var(--bx-border)",
                              background: isChecked ? "rgba(10, 46, 82, 0.04)" : "var(--bx-surface)",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}} // handled by parent onClick
                                style={{ width: "16px", height: "16px", cursor: "pointer" }}
                              />
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                                  <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>({lp.category})</span>
                                </div>
                                <div style={{ fontSize: "0.74rem", color: "var(--muted)", marginTop: "2px" }}>
                                  {lp.description}
                                </div>
                              </div>
                            </div>

                            <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--brand)" }}>
                                {lp.coursesCount} Kelas Rangkaian
                              </span>
                              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>~{lp.hours} Jam Belajar</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PESERTA & LOCK MANAGEMENT */}
              {activeTab === "students" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1200px" }}>
                  {/* Action Bar Simulasi Lock */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "8px",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--brand)" }}>
                        Simulasi Eksekusi Drop Out Otomatis
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                        Siswa dengan kemajuan di bawah {editingProgram.dropoutRegulation.minCompletionRequired}% saat timer habis akan di-lock secara masal.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleExecuteDropoutAudit}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#DC2626",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                      }}
                    >
                      Jalankan Audit Lock &amp; Drop Out Masal
                    </button>
                  </div>

                  {/* Tabel Peserta */}
                  <div style={{ border: "1px solid var(--bx-border)", borderRadius: "8px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                      <thead>
                        <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                          <th style={{ padding: "10px 12px" }}>Nama Peserta</th>
                          <th style={{ padding: "10px 12px" }}>Jalur Spesialisasi</th>
                          <th style={{ padding: "10px 12px" }}>Progress Materi</th>
                          <th style={{ padding: "10px 12px" }}>Status Akses</th>
                          <th style={{ padding: "10px 12px", textAlign: "right" }}>Tindakan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editingProgram.students.map((stu) => (
                          <tr key={stu.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                            <td style={{ padding: "10px 12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <img
                                  src={stu.avatar}
                                  alt={stu.studentName}
                                  style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                                />
                                <div>
                                  <div style={{ fontWeight: 700, color: "var(--ink)" }}>{stu.studentName}</div>
                                  <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{stu.studentEmail}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "10px 12px", color: "var(--brand)", fontWeight: 600 }}>
                              {stu.enrolledPathTitle}
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ flex: 1, background: "var(--bx-bg-alt)", height: "6px", borderRadius: "3px", overflow: "hidden", width: "80px" }}>
                                  <div
                                    style={{
                                      width: `${stu.progressPercent}%`,
                                      background:
                                        stu.progressPercent === 100
                                          ? "#059669"
                                          : stu.progressPercent < 40
                                          ? "#DC2626"
                                          : "var(--gold)",
                                      height: "100%",
                                    }}
                                  />
                                </div>
                                <span style={{ fontWeight: 700 }}>{stu.progressPercent}%</span>
                              </div>
                            </td>
                            <td style={{ padding: "10px 12px" }}>
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  padding: "3px 8px",
                                  borderRadius: "4px",
                                  background:
                                    stu.status === "Lulus"
                                      ? "#D1FAE5"
                                      : stu.status === "Drop Out (Locked)"
                                      ? "#FEE2E2"
                                      : stu.status === "Unlocked (Paid)"
                                      ? "#E0E7FF"
                                      : stu.status === "Terancam Drop Out"
                                      ? "#FEF3C7"
                                      : "var(--bx-bg-alt)",
                                  color:
                                    stu.status === "Lulus"
                                      ? "#065F46"
                                      : stu.status === "Drop Out (Locked)"
                                      ? "#991B1B"
                                      : stu.status === "Unlocked (Paid)"
                                      ? "#3730A3"
                                      : stu.status === "Terancam Drop Out"
                                      ? "#92400E"
                                      : "var(--brand)",
                                }}
                              >
                                {stu.status}
                              </span>
                            </td>
                            <td style={{ padding: "10px 12px", textAlign: "right" }}>
                              {stu.status === "Drop Out (Locked)" ? (
                                <button
                                  type="button"
                                  onClick={() => handleUnlockStudent(stu.id)}
                                  style={{
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    border: "1px solid #10B981",
                                    background: "#ECFDF5",
                                    color: "#047857",
                                    fontSize: "0.72rem",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                  }}
                                >
                                  Buka Lock (Bayar Reguler)
                                </button>
                              ) : (
                                <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Aktif Normal</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: ARSIP LOG HISTORY */}
              {activeTab === "history" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "900px" }}>
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      background: editingProgram.isArchivedHistory ? "rgba(100, 116, 139, 0.1)" : "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.86rem", color: "var(--brand)" }}>
                      <input
                        type="checkbox"
                        checked={editingProgram.isArchivedHistory}
                        onChange={(e) =>
                          setEditingProgram({
                            ...editingProgram,
                            isArchivedHistory: e.target.checked,
                            status: e.target.checked ? "Selesai (Log History)" : "Sedang Berjalan",
                            historyCompletedAt: e.target.checked ? new Date().toLocaleDateString("id-ID") : undefined,
                          })
                        }
                      />
                      <span>Tandai Event Telah Selesai &amp; Arsipkan ke Log History</span>
                    </label>

                    <p style={{ margin: "6px 0 12px", fontSize: "0.76rem", color: "var(--muted)", lineHeight: 1.4 }}>
                      Program yang diarsipkan akan dipindahkan dari daftar utama ke tab "Log History". Seluruh modul akan terkunci untuk pendaftar baru namun catatan kinerja dan penyerapan dana sponsor tetap tersimpan permanen.
                    </p>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", color: "var(--brand)" }}>
                        Catatan Evaluasi / Ringkasan Event Selesai
                      </label>
                      <textarea
                        rows={4}
                        value={editingProgram.historyCompletionNotes || ""}
                        onChange={(e) =>
                          setEditingProgram({
                            ...editingProgram,
                            historyCompletionNotes: e.target.value,
                          })
                        }
                        placeholder="Tuliskan total peserta lulus, tingkat penyelesaian, evaluasi sponsor, atau kendala lapangan..."
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem", lineHeight: 1.45 }}
                      />
                    </div>
                  </div>
                </div>
              )}
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
                Sponsor: <strong style={{ color: "var(--brand)" }}>{editingProgram.sponsor.name}</strong> • Beasiswa: <strong>{editingProgram.sponsor.scholarshipQuota} Siswa</strong> • Status: <strong>{editingProgram.status}</strong>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setEditingProgram(null)}
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
                  onClick={handleSaveProgram}
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
                  <span>Simpan Program &amp; Regulasi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
