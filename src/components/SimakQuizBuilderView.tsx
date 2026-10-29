"use client";

import React, { useState, useMemo } from "react";
import FlatIcon from "./FlatIcon";
import { LmsQuiz, LmsQuizQuestion, LmsAcademicTeam } from "../types/simak";
import { MOCK_QUIZZES, MOCK_ACADEMIC_STAFF, MOCK_LMS_COURSES } from "../data/simakMockData";

export interface QuizStudentAttempt {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  courseTitle: string;
  score: number; // Nilai akhir, e.g. 100, 95, 80, 60
  passed: boolean; // True jika score >= passingScore
  durationSeconds: number; // Total durasi pengerjaan dalam detik
  attemptCount: number; // Percobaan ke berapa
  failedAttemptsBeforePass: number; // Berapa kali gagal sebelum lulus (0 = tanpa gagal)
  submittedAt: string; // Waktu submit
  correctAnswersCount: number;
  totalQuestionsCount: number;
}

const DEFAULT_QUIZ_ATTEMPTS: QuizStudentAttempt[] = [
  {
    id: "att-01",
    studentId: "stu-01",
    studentName: "Muhammad Farhan",
    studentEmail: "farhan.mhs@anvieo.ac.id",
    studentAvatar: "/alumni/alumni_1.jpg",
    courseTitle: "Fullstack Next.js 16, Turbopack & Cloud Microservices",
    score: 100,
    passed: true,
    durationSeconds: 194, // 03m 14s (Tercepat & Sempurna)
    attemptCount: 1,
    failedAttemptsBeforePass: 0,
    submittedAt: "Hari ini, 09:15 WIB",
    correctAnswersCount: 4,
    totalQuestionsCount: 4,
  },
  {
    id: "att-02",
    studentId: "stu-02",
    studentName: "Aditya Pratama",
    studentEmail: "aditya.pratama@outlook.com",
    studentAvatar: "/alumni/alumni_3.jpg",
    courseTitle: "Fullstack Next.js 16, Turbopack & Cloud Microservices",
    score: 100,
    passed: true,
    durationSeconds: 245, // 04m 05s
    attemptCount: 1,
    failedAttemptsBeforePass: 0,
    submittedAt: "Hari ini, 09:40 WIB",
    correctAnswersCount: 4,
    totalQuestionsCount: 4,
  },
  {
    id: "att-03",
    studentId: "stu-03",
    studentName: "Kevin Sanjaya",
    studentEmail: "kevin.sanjaya@gmail.com",
    studentAvatar: "/alumni/alumni_4.jpg",
    courseTitle: "Fullstack Next.js 16, Turbopack & Cloud Microservices",
    score: 100,
    passed: true,
    durationSeconds: 310, // 05m 10s
    attemptCount: 1,
    failedAttemptsBeforePass: 0,
    submittedAt: "Kemarin, 20:10 WIB",
    correctAnswersCount: 4,
    totalQuestionsCount: 4,
  },
  {
    id: "att-04",
    studentId: "stu-04",
    studentName: "Siti Nurhaliza",
    studentEmail: "siti.nurhaliza@gmail.com",
    studentAvatar: "/alumni/alumni_2.jpg",
    courseTitle: "Fullstack Next.js 16, Turbopack & Cloud Microservices",
    score: 95,
    passed: true,
    durationSeconds: 220, // 03m 40s
    attemptCount: 1,
    failedAttemptsBeforePass: 0,
    submittedAt: "Kemarin, 14:22 WIB",
    correctAnswersCount: 4,
    totalQuestionsCount: 4,
  },
  {
    id: "att-05",
    studentId: "stu-05",
    studentName: "Nadia Paramita",
    studentEmail: "nadia.paramita@tech.co.id",
    studentAvatar: "/alumni/alumni_5.jpg",
    courseTitle: "Fullstack Next.js 16, Turbopack & Cloud Microservices",
    score: 90,
    passed: true,
    durationSeconds: 280, // 04m 40s
    attemptCount: 1,
    failedAttemptsBeforePass: 0,
    submittedAt: "2 hari lalu",
    correctAnswersCount: 4,
    totalQuestionsCount: 4,
  },
  {
    id: "att-06",
    studentId: "stu-06",
    studentName: "Dewi Lestari",
    studentEmail: "dewi.lestari@techcorp.id",
    studentAvatar: "/alumni/alumni_2.jpg",
    courseTitle: "Fullstack Next.js 16, Turbopack & Cloud Microservices",
    score: 85,
    passed: true,
    durationSeconds: 390, // 06m 30s
    attemptCount: 2,
    failedAttemptsBeforePass: 1, // 1x gagal lalu lulus
    submittedAt: "Hari ini, 11:05 WIB",
    correctAnswersCount: 3,
    totalQuestionsCount: 4,
  },
  {
    id: "att-07",
    studentId: "stu-07",
    studentName: "Gita Gutawa",
    studentEmail: "gita.gutawa@anvieo.ac.id",
    studentAvatar: "/alumni/alumni_3.jpg",
    courseTitle: "Fullstack Next.js 16, Turbopack & Cloud Microservices",
    score: 80,
    passed: true,
    durationSeconds: 480, // 08m 00s
    attemptCount: 2,
    failedAttemptsBeforePass: 1,
    submittedAt: "3 hari lalu",
    correctAnswersCount: 3,
    totalQuestionsCount: 4,
  },
  {
    id: "att-08",
    studentId: "stu-08",
    studentName: "Budi Santoso",
    studentEmail: "budi.santoso@yahoo.com",
    studentAvatar: "/alumni/alumni_4.jpg",
    courseTitle: "Fullstack Next.js 16, Turbopack & Cloud Microservices",
    score: 60,
    passed: false, // Di bawah 75%
    durationSeconds: 550, // 09m 10s
    attemptCount: 2,
    failedAttemptsBeforePass: 2, // 2x gagal
    submittedAt: "Kemarin, 16:45 WIB",
    correctAnswersCount: 2,
    totalQuestionsCount: 4,
  },
  {
    id: "att-09",
    studentId: "stu-09",
    studentName: "Riko Prasetya",
    studentEmail: "riko.prasetya@gmail.com",
    studentAvatar: "/alumni/alumni_1.jpg",
    courseTitle: "Fullstack Next.js 16, Turbopack & Cloud Microservices",
    score: 45,
    passed: false,
    durationSeconds: 720, // 12m 00s
    attemptCount: 3,
    failedAttemptsBeforePass: 3, // 3x gagal (Habis kuota attempt)
    submittedAt: "Hari ini, 08:30 WIB",
    correctAnswersCount: 1,
    totalQuestionsCount: 4,
  },
];

export type QuizSliderTab = "setup" | "soal" | "tim-soal" | "dashboard";

export const ASSESSMENT_TYPE_MAP: Record<
  string,
  { label: string; badgeColor: string; bg: string; icon: string; desc: string }
> = {
  formatif_modul: {
    label: "Kuis Formatif Modul",
    badgeColor: "var(--brand, #0A2E52)",
    bg: "rgba(10, 46, 82, 0.08)",
    icon: "book",
    desc: "Uji pemahaman berkala di akhir bab untuk mengukur penguasaan konsep spesifik.",
  },
  uts_mid: {
    label: "Ujian Tengah Jalur (UTS)",
    badgeColor: "var(--gold-2, #996D13)",
    bg: "rgba(201, 150, 46, 0.12)",
    icon: "clock",
    desc: "Evaluasi komprehensif paruh semester untuk menguji pencapaian setengah kurikulum kelas.",
  },
  uas_final: {
    label: "Ujian Akhir Proyek (UAS)",
    badgeColor: "#065F46",
    bg: "#D1FAE5",
    icon: "check",
    desc: "Asesmen akhir penentu kelulusan kelas dan syarat utama penerbitan sertifikat kompetensi.",
  },
  sertifikasi: {
    label: "Try Out Sertifikasi Industri",
    badgeColor: "#6D28D9",
    bg: "#EDE9FE",
    icon: "star",
    desc: "Simulasi ujian sertifikasi profesional dengan standar industri dan durasi ketat.",
  },
  diagnostic: {
    label: "Diagnostic Pre-Test",
    badgeColor: "#B45309",
    bg: "#FEF3C7",
    icon: "filter",
    desc: "Uji kemampuan awal siswa sebelum pembelajaran untuk pemetaan kompetensi dasar.",
  },
};

const INITIAL_QUIZ_ATTEMPTS: Record<string, QuizStudentAttempt[]> = {
  "quiz-01": DEFAULT_QUIZ_ATTEMPTS,
  "quiz-02": [
    {
      id: "att-q2-01",
      studentId: "stu-03",
      studentName: "Kevin Sanjaya",
      studentEmail: "kevin.sanjaya@gmail.com",
      studentAvatar: "/alumni/alumni_4.jpg",
      courseTitle: "Engineering Autonomous Multi-Agent AI & FastMCP",
      score: 100,
      passed: true,
      durationSeconds: 260,
      attemptCount: 1,
      failedAttemptsBeforePass: 0,
      submittedAt: "Hari ini, 09:30 WIB",
      correctAnswersCount: 4,
      totalQuestionsCount: 4,
    },
    {
      id: "att-q2-02",
      studentId: "stu-04",
      studentName: "Siti Nurhaliza",
      studentEmail: "siti.nurhaliza@gmail.com",
      studentAvatar: "/alumni/alumni_2.jpg",
      courseTitle: "Engineering Autonomous Multi-Agent AI & FastMCP",
      score: 95,
      passed: true,
      durationSeconds: 320,
      attemptCount: 1,
      failedAttemptsBeforePass: 0,
      submittedAt: "Hari ini, 08:45 WIB",
      correctAnswersCount: 4,
      totalQuestionsCount: 4,
    },
  ],
};

const DEFAULT_ACADEMIC_TEAM: LmsAcademicTeam = {
  curriculumTeam: "Biro Standarisasi Asesmen & Ujian Anvieo",
  curriculumAuthor: "Dr. Maya Anggraini, M.Cs.",
  curriculumAuthorAvatar: "/alumni/alumni_5.jpg",
  curriculumAuthorRole: "Penyusun Bank Soal & Kisi-Kisi Ujian",
  instructorName: "Prof. Budi Rahardjo, Ph.D.",
  instructorAvatar: "/alumni/alumni_1.jpg",
  instructorRole: "Instruktur Penanggung Jawab Materi",
  reviewerName: "Siti Nurhaliza, S.Kom.",
  reviewerAvatar: "/alumni/alumni_2.jpg",
  reviewerRole: "Reviewer Validitas Kunci Jawaban & Rubrik",
  qaValidatorName: "Dr. Ir. Hendra Prasetyo, M.T. (LPMA)",
};

export default function SimakQuizBuilderView() {
  const [quizzes, setQuizzes] = useState<LmsQuiz[]>(MOCK_QUIZZES);
  const [search, setSearch] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<LmsQuiz | null>(null);
  const [sliderTab, setSliderTab] = useState<QuizSliderTab>("setup");
  const [attemptsStore, setAttemptsStore] = useState<Record<string, QuizStudentAttempt[]>>(INITIAL_QUIZ_ATTEMPTS);

  // Dynamic Attempts for the Currently Selected Quiz
  const currentAttempts = useMemo(() => {
    if (!selectedQuiz) return [];
    return attemptsStore[selectedQuiz.id] || [];
  }, [attemptsStore, selectedQuiz?.id]);

  // Dashboard filter mode: "all" | "leaderboard" | "passed" | "failed"
  const [dashboardFilter, setDashboardFilter] = useState<"all" | "leaderboard" | "passed" | "failed">("leaderboard");
  const [studentSearch, setStudentSearch] = useState("");

  // New Question Form state
  const [newQuestionType, setNewQuestionType] = useState<
    "multiple_choice" | "multiple_select" | "true_false" | "short_answer"
  >("multiple_choice");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionPoints, setNewQuestionPoints] = useState(25);
  const [newQuestionExplanation, setNewQuestionExplanation] = useState("");
  const [newQuestionOptions, setNewQuestionOptions] = useState([
    { id: "opt-1", text: "Opsi Jawaban A", isCorrect: true },
    { id: "opt-2", text: "Opsi Jawaban B", isCorrect: false },
    { id: "opt-3", text: "Opsi Jawaban C", isCorrect: false },
  ]);
  const [shortAnswerKey, setShortAnswerKey] = useState("");

  // Edit Question State
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editQuestionType, setEditQuestionType] = useState<
    "multiple_choice" | "multiple_select" | "true_false" | "short_answer"
  >("multiple_choice");
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editQuestionPoints, setEditQuestionPoints] = useState(25);
  const [editQuestionExplanation, setEditQuestionExplanation] = useState("");
  const [editQuestionOptions, setEditQuestionOptions] = useState<
    { id: string; text: string; isCorrect: boolean }[]
  >([]);
  const [editShortAnswerKey, setEditShortAnswerKey] = useState("");

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m > 0 ? `${m}m ` : ""}${String(s).padStart(2, "0")}s`;
  };

  const handleOpenQuizEditor = (quiz: LmsQuiz, initialTab: QuizSliderTab = "soal") => {
    setSelectedQuiz({ ...quiz });
    setSliderTab(initialTab);
    setEditingQuestionId(null);
  };

  const handleCreateNewQuiz = () => {
    const defaultCourse = MOCK_LMS_COURSES[0];
    const firstModule = defaultCourse.modules?.[0];
    const newQ: LmsQuiz = {
      id: `quiz-${Date.now()}`,
      courseId: defaultCourse.id,
      courseTitle: defaultCourse.title,
      moduleId: firstModule?.id || "mod-1",
      moduleTitle: firstModule ? `Modul ${firstModule.order}: ${firstModule.title}` : "Modul 1: Fondasi & Pengenalan",
      lessonTitle: firstModule?.lessons?.[0]?.title || "Kuis Evaluasi Modul",
      assessmentType: "formatif_modul",
      title: "Kuis Baru: Evaluasi Capaian Pembelajaran",
      description: "Asesmen uji pemahaman materi untuk mengevaluasi penguasaan konsep spesifik siswa.",
      passingScore: 75,
      maxAttempts: 3,
      timeLimitMinutes: 15,
      shuffleQuestions: true,
      showAnswersAfterSubmit: true,
      status: "draft",
      academicTeam: { ...DEFAULT_ACADEMIC_TEAM },
      questions: [],
      resultsStats: {
        avgScore: 0,
        passRate: 0,
        totalAttempts: 0,
      },
    };
    setSelectedQuiz(newQ);
    // Explicitly open the Setup tab so the user configures Course, Module, and Assessment Purpose first!
    setSliderTab("setup");
    setEditingQuestionId(null);
  };

  const handleAddOption = () => {
    setNewQuestionOptions([
      ...newQuestionOptions,
      { id: `opt-${Date.now()}`, text: `Opsi Jawaban Baru`, isCorrect: false },
    ]);
  };

  const handleSaveQuestion = () => {
    if (!selectedQuiz || !newQuestionText.trim()) return;
    const newQues: LmsQuizQuestion = {
      id: `q-${Date.now()}`,
      type: newQuestionType,
      questionText: newQuestionText,
      points: Number(newQuestionPoints),
      explanation: newQuestionExplanation,
      options: newQuestionType === "short_answer" ? [] : newQuestionOptions,
      correctAnswerText: newQuestionType === "short_answer" ? shortAnswerKey : undefined,
    };
    const updatedQuiz = {
      ...selectedQuiz,
      questions: [...selectedQuiz.questions, newQues],
    };
    setSelectedQuiz(updatedQuiz);
    setQuizzes(quizzes.map((item) => (item.id === updatedQuiz.id ? updatedQuiz : item)));
    setNewQuestionText("");
    setNewQuestionExplanation("");
    alert("Soal berhasil ditambahkan ke dalam kuis!");
  };

  // Edit Question Handlers
  const handleStartEditQuestion = (q: LmsQuizQuestion) => {
    setEditingQuestionId(q.id);
    setEditQuestionType(q.type);
    setEditQuestionText(q.questionText || q.prompt || "");
    setEditQuestionPoints(q.points || 25);
    setEditQuestionExplanation(q.explanation || "");
    setEditQuestionOptions(
      q.options && q.options.length > 0
        ? q.options.map((opt) => ({ ...opt }))
        : [
            { id: `opt-${Date.now()}-1`, text: "Opsi Jawaban A", isCorrect: true },
            { id: `opt-${Date.now()}-2`, text: "Opsi Jawaban B", isCorrect: false },
          ]
    );
    setEditShortAnswerKey(q.correctAnswerText || "");
  };

  const handleCancelEditQuestion = () => {
    setEditingQuestionId(null);
  };

  const handleAddEditOption = () => {
    setEditQuestionOptions([
      ...editQuestionOptions,
      { id: `opt-${Date.now()}`, text: `Opsi Jawaban Baru`, isCorrect: false },
    ]);
  };

  const handleRemoveEditOption = (index: number) => {
    if (editQuestionOptions.length <= 2) {
      alert("Soal pilihan ganda minimal membutuhkan 2 opsi pilihan!");
      return;
    }
    setEditQuestionOptions(editQuestionOptions.filter((_, i) => i !== index));
  };

  const handleToggleEditOptionCorrect = (index: number) => {
    if (editQuestionType === "multiple_choice" || editQuestionType === "true_false") {
      setEditQuestionOptions(
        editQuestionOptions.map((opt, i) => ({
          ...opt,
          isCorrect: i === index,
        }))
      );
    } else {
      setEditQuestionOptions(
        editQuestionOptions.map((opt, i) =>
          i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt
        )
      );
    }
  };

  const handleSaveEditedQuestion = () => {
    if (!selectedQuiz || !editingQuestionId) return;
    if (!editQuestionText.trim()) {
      alert("Teks pertanyaan tidak boleh kosong!");
      return;
    }
    if (editQuestionType !== "short_answer") {
      const hasCorrect = editQuestionOptions.some((opt) => opt.isCorrect);
      if (!hasCorrect) {
        alert("Wajib menentukan minimal 1 opsi jawaban yang benar!");
        return;
      }
    } else if (!editShortAnswerKey.trim()) {
      alert("Kunci isian jawaban singkat wajib diisi!");
      return;
    }

    const updatedQuestions = selectedQuiz.questions.map((q) => {
      if (q.id !== editingQuestionId) return q;
      return {
        ...q,
        type: editQuestionType,
        questionText: editQuestionText.trim(),
        points: Number(editQuestionPoints),
        explanation: editQuestionExplanation.trim(),
        options: editQuestionType === "short_answer" ? [] : editQuestionOptions,
        correctAnswerText: editQuestionType === "short_answer" ? editShortAnswerKey.trim() : undefined,
      };
    });

    const updatedQuiz: LmsQuiz = {
      ...selectedQuiz,
      questions: updatedQuestions,
    };
    setSelectedQuiz(updatedQuiz);
    setQuizzes(quizzes.map((item) => (item.id === updatedQuiz.id ? updatedQuiz : item)));
    setEditingQuestionId(null);
    alert("Perubahan butir soal berhasil disimpan!");
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!selectedQuiz) return;
    if (confirm("Apakah Anda yakin ingin menghapus butir soal ini?")) {
      const updatedQuestions = selectedQuiz.questions.filter((q) => q.id !== qId);
      const updatedQuiz = {
        ...selectedQuiz,
        questions: updatedQuestions,
      };
      setSelectedQuiz(updatedQuiz);
      setQuizzes(quizzes.map((item) => (item.id === updatedQuiz.id ? updatedQuiz : item)));
      if (editingQuestionId === qId) {
        setEditingQuestionId(null);
      }
    }
  };

  const handleSaveQuiz = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!selectedQuiz) return;
    const exists = quizzes.some((q) => q.id === selectedQuiz.id);
    if (exists) {
      setQuizzes(quizzes.map((q) => (q.id === selectedQuiz.id ? selectedQuiz : q)));
    } else {
      setQuizzes([selectedQuiz, ...quizzes]);
    }
    alert(`Kuis "${selectedQuiz.title}" berhasil disimpan ke kurikulum kelas!`);
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kuis evaluasi ini?")) {
      setQuizzes(quizzes.filter((q) => q.id !== quizId));
    }
  };

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  // Active Course & Available Modules for Quiz Association
  const activeCourse = useMemo(() => {
    if (!selectedQuiz) return MOCK_LMS_COURSES[0];
    return (
      MOCK_LMS_COURSES.find((c) => c.id === selectedQuiz.courseId) ||
      MOCK_LMS_COURSES.find((c) => c.title === selectedQuiz.courseTitle) ||
      MOCK_LMS_COURSES[0]
    );
  }, [selectedQuiz?.courseId, selectedQuiz?.courseTitle]);

  const availableModules = useMemo(() => {
    return activeCourse?.modules || [];
  }, [activeCourse]);

  const handleCourseChange = (newCourseId: string) => {
    const newCourse = MOCK_LMS_COURSES.find((c) => c.id === newCourseId);
    if (!newCourse || !selectedQuiz) return;
    const firstMod = newCourse.modules?.[0];
    const firstLesson = firstMod?.lessons?.[0];
    const updated: LmsQuiz = {
      ...selectedQuiz,
      courseId: newCourse.id,
      courseTitle: newCourse.title,
      moduleId: firstMod?.id || "mod-1",
      moduleTitle: firstMod ? `Modul ${firstMod.order}: ${firstMod.title}` : "Modul 1: Fondasi & Pengenalan",
      lessonTitle: firstLesson?.title || "Kuis Evaluasi Modul",
      academicTeam: {
        ...(selectedQuiz.academicTeam || DEFAULT_ACADEMIC_TEAM),
        instructorName: newCourse.instructorName,
        instructorAvatar: newCourse.instructorAvatar,
      },
    };
    setSelectedQuiz(updated);
  };

  const handleModuleChange = (newModuleId: string) => {
    if (!selectedQuiz) return;
    const foundMod = availableModules.find((m) => m.id === newModuleId);
    if (!foundMod) return;
    const firstLesson = foundMod.lessons?.[0];
    const updated: LmsQuiz = {
      ...selectedQuiz,
      moduleId: foundMod.id,
      moduleTitle: `Modul ${foundMod.order}: ${foundMod.title}`,
      lessonTitle: firstLesson?.title || selectedQuiz.lessonTitle,
    };
    setSelectedQuiz(updated);
  };

  // Sorting Leaderboard: Prioritaskan Lulus -> Skor Tertinggi -> Tanpa Gagal (0 Gagal) -> Waktu Tercepat
  const sortedLeaderboard = useMemo(() => {
    return [...currentAttempts].sort((a, b) => {
      // 1. Yang lulus di atas yang gagal
      if (a.passed !== b.passed) return a.passed ? -1 : 1;
      // 2. Skor tertinggi lebih atas
      if (b.score !== a.score) return b.score - a.score;
      // 3. Tanpa gagal (0 kali gagal) lebih atas daripada yang pernah gagal
      if (a.failedAttemptsBeforePass !== b.failedAttemptsBeforePass) {
        return a.failedAttemptsBeforePass - b.failedAttemptsBeforePass;
      }
      // 4. Durasi tercepat lebih atas
      return a.durationSeconds - b.durationSeconds;
    });
  }, [currentAttempts]);

  // Filtered Attempts for Table
  const displayedAttempts = useMemo(() => {
    return sortedLeaderboard.filter((att) => {
      if (dashboardFilter === "passed" && !att.passed) return false;
      if (dashboardFilter === "failed" && att.passed) return false;
      if (dashboardFilter === "leaderboard" && !att.passed) return false;
      if (!studentSearch) return true;
      const q = studentSearch.toLowerCase();
      return att.studentName.toLowerCase().includes(q) || att.studentEmail.toLowerCase().includes(q);
    });
  }, [sortedLeaderboard, dashboardFilter, studentSearch]);

  // Top 3 Podium Winners
  const top3Winners = useMemo(() => {
    return sortedLeaderboard.filter((a) => a.passed).slice(0, 3);
  }, [sortedLeaderboard]);

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
              Assessment Studio
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Editor Soal, Dashboard Hasil Siswa &amp; Papan Peringkat Kecepatan
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
            Quiz Builder &amp; Ujian Siswa
          </h2>
        </div>

        <button
          type="button"
          onClick={handleCreateNewQuiz}
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
          <span>Buat Kuis Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        style={{
          background: "var(--bx-surface, #FFFFFF)",
          border: "1px solid var(--bx-border)",
          borderRadius: "8px",
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "var(--bx-bg-alt)",
            border: "1px solid var(--bx-border)",
            borderRadius: "6px",
            padding: "6px 10px",
            width: "320px",
          }}
        >
          <FlatIcon type="search" size={13} color="var(--muted)" />
          <input
            type="text"
            placeholder="Cari kuis atau kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.8rem", width: "100%", color: "var(--ink)" }}
          />
        </div>

        <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
          Total Kuis Aktif: <strong>{quizzes.length} Kuis</strong>
        </span>
      </div>

      {/* Quiz Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "14px",
        }}
      >
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 2px 6px rgba(10, 46, 82, 0.04)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "var(--bx-bg-alt)",
                      color: "var(--brand)",
                      fontWeight: 700,
                    }}
                  >
                    {quiz.questions.length} Butir Soal
                  </span>
                  {(() => {
                    const at = ASSESSMENT_TYPE_MAP[quiz.assessmentType || "formatif_modul"] || ASSESSMENT_TYPE_MAP.formatif_modul;
                    return (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: at.bg,
                          color: at.badgeColor,
                          fontWeight: 700,
                        }}
                      >
                        {at.label}
                      </span>
                    );
                  })()}
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    background: "#D1FAE5",
                    color: "#065F46",
                    fontWeight: 700,
                  }}
                >
                  Passing: {quiz.passingScore}%
                </span>
              </div>

              <h3 style={{ margin: "4px 0 4px", fontSize: "1.02rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                {quiz.title}
              </h3>
              <div style={{ fontSize: "0.74rem", color: "var(--gold-2)", fontWeight: 700, marginBottom: "4px" }}>
                Kelas: {quiz.courseTitle}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                <span style={{ padding: "1px 6px", borderRadius: "3px", background: "rgba(10, 46, 82, 0.06)", color: "var(--brand)" }}>
                  Target: <strong>{quiz.moduleTitle || "Modul 1: Fondasi"}</strong>
                </span>
                {quiz.lessonTitle && (
                  <span>• {quiz.lessonTitle}</span>
                )}
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.4 }}>
                {quiz.description}
              </p>

              {/* Academic Team Attribution on Quiz Card */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "12px", fontSize: "0.68rem" }}>
                <span
                  title={`Penyusun Soal: ${quiz.academicTeam?.curriculumAuthor || "Dr. Maya Anggraini"}`}
                  style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(10,46,82,0.08)", color: "var(--brand)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <img src={quiz.academicTeam?.curriculumAuthorAvatar || "/alumni/alumni_5.jpg"} alt="" style={{ width: "13px", height: "13px", borderRadius: "50%", objectFit: "cover" }} />
                  <span>Pembuat: <strong>{(quiz.academicTeam?.curriculumAuthor || "Dr. Maya Anggraini").split(",")[0]}</strong></span>
                </span>
                <span
                  title={`Instruktur: ${quiz.academicTeam?.instructorName || "Prof. Budi Rahardjo"}`}
                  style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(201,150,46,0.12)", color: "var(--gold-2)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <img src={quiz.academicTeam?.instructorAvatar || "/alumni/alumni_1.jpg"} alt="" style={{ width: "13px", height: "13px", borderRadius: "50%", objectFit: "cover" }} />
                  <span>Instruktur: <strong>{(quiz.academicTeam?.instructorName || "Prof. Budi Rahardjo").split(",")[0]}</strong></span>
                </span>
                <span
                  title={`Reviewer Kunci Jawaban: ${quiz.academicTeam?.reviewerName || "Siti Nurhaliza"}`}
                  style={{ padding: "2px 6px", borderRadius: "4px", background: "rgba(5,150,105,0.1)", color: "#065F46", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <img src={quiz.academicTeam?.reviewerAvatar || "/alumni/alumni_2.jpg"} alt="" style={{ width: "13px", height: "13px", borderRadius: "50%", objectFit: "cover" }} />
                  <span>Reviewer: <strong>{(quiz.academicTeam?.reviewerName || "Siti Nurhaliza").split(",")[0]}</strong></span>
                </span>
              </div>
            </div>

            <div
              style={{
                paddingTop: "12px",
                borderTop: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.75rem",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div>
                <span style={{ color: "var(--muted)" }}>Lulus: </span>
                <strong style={{ color: "#065F46" }}>{quiz.resultsStats.passRate}%</strong> ({attemptsStore[quiz.id]?.length || 0} attempts)
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  title="Hapus Kuis"
                  style={{
                    padding: "5px 8px",
                    borderRadius: "4px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-surface)",
                    color: "#DC2626",
                    fontSize: "0.74rem",
                    cursor: "pointer",
                  }}
                >
                  Hapus
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenQuizEditor(quiz, (attemptsStore[quiz.id]?.length || 0) > 0 ? "dashboard" : "soal")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "5px",
                    border: "none",
                    background: "var(--brand)",
                    color: "#ffffff",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Buka Editor Soal (Slider 95%)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* SLIDER 95% DRAWER: QUIZ EDITOR, DASHBOARD HASIL & LEADERBOARD */}
      {/* ============================================================== */}
      {selectedQuiz && (
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
            if (e.target === e.currentTarget) setSelectedQuiz(null);
          }}
        >
          <div
            className="quiz-studio-slider-95"
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
            {/* Compact Top Bar of Quiz Studio */}
            <div
              style={{
                padding: "8px 18px",
                borderBottom: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bx-bg-alt)",
                flexShrink: 0,
                minHeight: "52px",
                gap: "14px",
                boxSizing: "border-box",
              }}
            >
              {/* Left Column: Compact Meta Row & Clean Non-Overlapping Title */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0, flex: 1 }}>
                {/* Meta Row: Micro Badges */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                      padding: "1px 6px",
                      borderRadius: "3px",
                      background: "var(--brand, #0A2E52)",
                      color: "#ffffff",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Quiz Studio
                  </span>

                  <span
                    title={selectedQuiz.courseTitle}
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "var(--gold-2)",
                      background: "rgba(201, 150, 46, 0.1)",
                      border: "1px solid rgba(201, 150, 46, 0.25)",
                      padding: "1px 6px",
                      borderRadius: "3px",
                      maxWidth: "280px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                    }}
                  >
                    {selectedQuiz.courseTitle}
                  </span>

                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#065F46",
                      background: "#D1FAE5",
                      padding: "1px 6px",
                      borderRadius: "3px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Passing: {selectedQuiz.passingScore}%
                  </span>

                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "var(--brand)",
                      background: "rgba(10, 46, 82, 0.08)",
                      padding: "1px 6px",
                      borderRadius: "3px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {selectedQuiz.questions.length} Butir Soal
                  </span>

                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Waktu: {selectedQuiz.timeLimitMinutes} Menit
                  </span>
                </div>

                {/* Title Row: Compact & Ellipsis Protected */}
                <h3
                  title={selectedQuiz.title}
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-heading)",
                    color: "var(--brand)",
                    fontSize: "0.94rem",
                    fontWeight: 700,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineHeight: 1.3,
                  }}
                >
                  {selectedQuiz.title}
                </h3>
              </div>

              {/* Right Column: Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={handleSaveQuiz}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "var(--brand, #0A2E52)",
                    border: "none",
                    borderRadius: "5px",
                    padding: "6px 12px",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: "#ffffff",
                    boxShadow: "0 1px 3px rgba(10, 46, 82, 0.15)",
                  }}
                >
                  <FlatIcon type="check" size={13} color="#ffffff" />
                  <span>Simpan Kuis</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedQuiz(null)}
                  title="Tutup Panel Slider"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "var(--bx-surface)",
                    border: "1px solid var(--bx-border)",
                    borderRadius: "5px",
                    padding: "6px 12px",
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    color: "var(--ink)",
                  }}
                >
                  <FlatIcon type="close" size={13} color="var(--ink)" />
                  <span>Tutup</span>
                </button>
              </div>
            </div>

            {/* Compact Slider Tabs Navigation */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid var(--bx-border)",
                background: "var(--bx-surface)",
                flexShrink: 0,
                padding: "0 18px",
                gap: "4px",
                overflowX: "auto",
              }}
            >
              {[
                { id: "setup", label: "1. Sasaran Modul & Regulasi" },
                { id: "soal", label: `2. Editor & Butir Soal (${selectedQuiz.questions.length})` },
                { id: "tim-soal", label: "3. Tim Akademik & Reviewer" },
                { id: "dashboard", label: `4. Dashboard Hasil & Ranking (${currentAttempts.length})` },
              ].map((tab) => {
                const isActive = sliderTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSliderTab(tab.id as QuizSliderTab)}
                    style={{
                      padding: "9px 14px",
                      border: "none",
                      borderBottom: isActive ? "3px solid var(--gold, #C9962E)" : "3px solid transparent",
                      background: "transparent",
                      color: isActive ? "var(--brand, #0A2E52)" : "var(--muted)",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Slider Body Form */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              {/* ============================================================== */}
              {/* TAB 1: SASARAN MODUL & REGULASI ASESMEN */}
              {/* ============================================================== */}
              {sliderTab === "setup" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px", fontSize: "0.82rem", maxWidth: "1050px" }}>
                  {/* Tab 1 Header Banner */}
                  <div
                    style={{
                      padding: "16px 20px",
                      background: "rgba(10, 46, 82, 0.04)",
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
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "3px",
                            background: "var(--brand)",
                            color: "#ffffff",
                            textTransform: "uppercase",
                          }}
                        >
                          Langkah 1 dari 4
                        </span>
                        <h3 style={{ margin: 0, fontSize: "1.05rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                          Sasaran Modul, Kelas &amp; Regulasi Asesmen
                        </h3>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)", maxWidth: "720px", lineHeight: 1.4 }}>
                        Tentukan dengan jelas untuk kursus apa, modul bab pembelajaran mana, dan apa tujuan evaluasi kuis ini dibuat agar siswa mengetahui capaian kompetensi yang diuji.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSliderTab("soal")}
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
                        boxShadow: "0 2px 6px rgba(10, 46, 82, 0.2)",
                      }}
                    >
                      <span>Lanjut ke Butir Soal</span>
                      <FlatIcon type="arrow-right" size={13} color="#ffffff" />
                    </button>
                  </div>

                  {/* Section 1: Sasaran Kelas & Modul Bab */}
                  <div
                    style={{
                      background: "var(--bx-surface)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "8px",
                      padding: "18px 20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--bx-border)", paddingBottom: "10px" }}>
                      <FlatIcon type="book" size={16} color="var(--brand)" />
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.92rem", color: "var(--brand)", fontWeight: 700 }}>
                          1. Sasaran Kursus &amp; Modul Pembelajaran
                        </h4>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                          Pilih mata kuliah dan bab modul spesifik tempat kuis ini akan diujikan kepada siswa.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "14px" }}>
                      {/* Course Selector */}
                      <div>
                        <label style={{ display: "block", fontWeight: 700, fontSize: "0.78rem", marginBottom: "5px", color: "var(--ink)" }}>
                          Pilih Kursus / Mata Kuliah Target <span style={{ color: "#DC2626" }}>*</span>
                        </label>
                        <select
                          value={selectedQuiz.courseId}
                          onChange={(e) => handleCourseChange(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--bx-border)",
                            background: "var(--bx-surface)",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "var(--ink)",
                          }}
                        >
                          {MOCK_LMS_COURSES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title} ({c.level})
                            </option>
                          ))}
                        </select>
                        <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "4px" }}>
                          Pengampu Utama: <strong>{activeCourse.instructorName}</strong>
                        </div>
                      </div>

                      {/* Module Selector */}
                      <div>
                        <label style={{ display: "block", fontWeight: 700, fontSize: "0.78rem", marginBottom: "5px", color: "var(--ink)" }}>
                          Target Modul / Bab Pembelajaran <span style={{ color: "#DC2626" }}>*</span>
                        </label>
                        <select
                          value={selectedQuiz.moduleId || "mod-1"}
                          onChange={(e) => handleModuleChange(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--bx-border)",
                            background: "var(--bx-surface)",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "var(--ink)",
                          }}
                        >
                          {availableModules.map((m) => (
                            <option key={m.id} value={m.id}>
                              Modul {m.order}: {m.title}
                            </option>
                          ))}
                        </select>
                        <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "4px" }}>
                          Total Materi di Modul Ini: {availableModules.find((m) => m.id === selectedQuiz.moduleId)?.lessons.length || 0} Aktivitas
                        </div>
                      </div>
                    </div>

                    {/* Lesson / Sub-Materi Topic */}
                    <div>
                      <label style={{ display: "block", fontWeight: 700, fontSize: "0.78rem", marginBottom: "5px", color: "var(--ink)" }}>
                        Sub-Materi / Topik Pelajaran Spesifik (Opsional)
                      </label>
                      <input
                        type="text"
                        value={selectedQuiz.lessonTitle || ""}
                        onChange={(e) => setSelectedQuiz({ ...selectedQuiz, lessonTitle: e.target.value })}
                        placeholder="Misal: Kuis Evaluasi Server Actions & Mutasi Data"
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid var(--bx-border)",
                          background: "var(--bx-surface)",
                          fontSize: "0.8rem",
                          color: "var(--ink)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Section 2: Klasifikasi & Tujuan Asesmen */}
                  <div
                    style={{
                      background: "var(--bx-surface)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "8px",
                      padding: "18px 20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--bx-border)", paddingBottom: "10px" }}>
                      <FlatIcon type="target" size={16} color="var(--brand)" />
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.92rem", color: "var(--brand)", fontWeight: 700 }}>
                          2. Klasifikasi &amp; Tujuan Asesmen (Assessment Purpose)
                        </h4>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                          Tentukan bobot dan fungsi instrumen evaluasi ini dalam kurikulum siswa.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
                      {Object.entries(ASSESSMENT_TYPE_MAP).map(([key, item]) => {
                        const isSelected = (selectedQuiz.assessmentType || "formatif_modul") === key;
                        return (
                          <div
                            key={key}
                            onClick={() => setSelectedQuiz({ ...selectedQuiz, assessmentType: key as any })}
                            style={{
                              padding: "12px 14px",
                              borderRadius: "8px",
                              border: isSelected ? `2px solid ${item.badgeColor}` : "1px solid var(--bx-border)",
                              background: isSelected ? item.bg : "var(--bx-bg-alt)",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span
                                style={{
                                  fontSize: "0.72rem",
                                  fontWeight: 800,
                                  color: item.badgeColor,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.03em",
                                }}
                              >
                                {item.label}
                              </span>
                              <span
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  border: isSelected ? `5px solid ${item.badgeColor}` : "2px solid var(--muted)",
                                  background: "#ffffff",
                                  boxSizing: "border-box",
                                }}
                              />
                            </div>
                            <p style={{ margin: 0, fontSize: "0.74rem", color: isSelected ? "var(--ink)" : "var(--muted)", lineHeight: 1.35 }}>
                              {item.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 3: Identitas & Capaian Pembelajaran */}
                  <div
                    style={{
                      background: "var(--bx-surface)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "8px",
                      padding: "18px 20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--bx-border)", paddingBottom: "10px" }}>
                      <FlatIcon type="edit" size={16} color="var(--brand)" />
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.92rem", color: "var(--brand)", fontWeight: 700 }}>
                          3. Identitas Judul Kuis &amp; Capaian Pembelajaran (CP)
                        </h4>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                          Judul yang menarik dan deskripsi indikator keberhasilan yang diharapkan dari siswa.
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, fontSize: "0.78rem", marginBottom: "5px", color: "var(--ink)" }}>
                        Judul Kuis / Asesmen <span style={{ color: "#DC2626" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={selectedQuiz.title}
                        onChange={(e) => setSelectedQuiz({ ...selectedQuiz, title: e.target.value })}
                        placeholder="Misal: Evaluasi Mandiri: Turbopack vs Webpack Bundling"
                        style={{
                          width: "100%",
                          padding: "9px 12px",
                          borderRadius: "6px",
                          border: "1px solid var(--bx-border)",
                          background: "var(--bx-surface)",
                          fontSize: "0.84rem",
                          fontWeight: 700,
                          color: "var(--brand)",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, fontSize: "0.78rem", marginBottom: "5px", color: "var(--ink)" }}>
                        Deskripsi Capaian / Kisi-Kisi Singkat
                      </label>
                      <textarea
                        rows={2}
                        value={selectedQuiz.description}
                        onChange={(e) => setSelectedQuiz({ ...selectedQuiz, description: e.target.value })}
                        placeholder="Tuliskan indikator capaian pembelajaran materi ini..."
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid var(--bx-border)",
                          background: "var(--bx-surface)",
                          fontSize: "0.78rem",
                          color: "var(--ink)",
                          lineHeight: 1.4,
                        }}
                      />
                    </div>
                  </div>

                  {/* Section 4: Regulasi & Parameter Pelaksanaan Ujian */}
                  <div
                    style={{
                      background: "var(--bx-surface)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "8px",
                      padding: "18px 20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--bx-border)", paddingBottom: "10px" }}>
                      <FlatIcon type="settings" size={16} color="var(--brand)" />
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.92rem", color: "var(--brand)", fontWeight: 700 }}>
                          4. Regulasi &amp; Parameter Pelaksanaan Ujian
                        </h4>
                        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                          Batas kelulusan, batasan waktu pengerjaan, dan kuota repetisi kuis.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontWeight: 700, fontSize: "0.76rem", marginBottom: "4px" }}>
                          Passing Grade (%) <span style={{ color: "#DC2626" }}>*</span>
                        </label>
                        <input
                          type="number"
                          min={50}
                          max={100}
                          value={selectedQuiz.passingScore}
                          onChange={(e) => setSelectedQuiz({ ...selectedQuiz, passingScore: Number(e.target.value) })}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.8rem", fontWeight: 700 }}
                        />
                        <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "3px" }}>Standar kurikulum: 75%</div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontWeight: 700, fontSize: "0.76rem", marginBottom: "4px" }}>
                          Batas Waktu (Menit) <span style={{ color: "#DC2626" }}>*</span>
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={180}
                          value={selectedQuiz.timeLimitMinutes}
                          onChange={(e) => setSelectedQuiz({ ...selectedQuiz, timeLimitMinutes: Number(e.target.value) })}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.8rem", fontWeight: 700 }}
                        />
                        <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "3px" }}>Timer otomatis countdown</div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontWeight: 700, fontSize: "0.76rem", marginBottom: "4px" }}>
                          Maksimal Percobaan (Attempts)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={selectedQuiz.maxAttempts}
                          onChange={(e) => setSelectedQuiz({ ...selectedQuiz, maxAttempts: Number(e.target.value) })}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.8rem", fontWeight: 700 }}
                        />
                        <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "3px" }}>Default 3x kesempatan remedial</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", paddingTop: "8px", borderTop: "1px solid var(--bx-border)" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem" }}>
                        <input
                          type="checkbox"
                          checked={selectedQuiz.shuffleQuestions}
                          onChange={(e) => setSelectedQuiz({ ...selectedQuiz, shuffleQuestions: e.target.checked })}
                        />
                        <span>Acak Urutan Butir Soal (Anti-Cheat Randomizer)</span>
                      </label>

                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem" }}>
                        <input
                          type="checkbox"
                          checked={selectedQuiz.showAnswersAfterSubmit}
                          onChange={(e) => setSelectedQuiz({ ...selectedQuiz, showAnswersAfterSubmit: e.target.checked })}
                        />
                        <span>Tampilkan Kunci Jawaban &amp; Pembahasan Setelah Submit</span>
                      </label>
                    </div>
                  </div>

                  {/* Action to proceed */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
                    <button
                      type="button"
                      onClick={() => setSliderTab("soal")}
                      style={{
                        padding: "10px 22px",
                        borderRadius: "6px",
                        border: "none",
                        background: "var(--brand, #0A2E52)",
                        color: "#ffffff",
                        fontSize: "0.84rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 2px 8px rgba(10, 46, 82, 0.25)",
                      }}
                    >
                      <span>Simpan Sasaran &amp; Lanjut ke Editor Soal</span>
                      <FlatIcon type="arrow-right" size={14} color="#ffffff" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: EDITOR & BUTIR SOAL */}
              {/* ============================================================== */}
              {sliderTab === "soal" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.82rem", maxWidth: "1200px" }}>
                  {/* Context Banner: Sasaran Modul & Klasifikasi Asesmen */}
                  {(() => {
                    const currentAssType = ASSESSMENT_TYPE_MAP[selectedQuiz.assessmentType || "formatif_modul"] || ASSESSMENT_TYPE_MAP.formatif_modul;
                    return (
                      <div
                        style={{
                          padding: "12px 16px",
                          background: "var(--bx-bg-alt)",
                          border: "1px solid var(--bx-border)",
                          borderRadius: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "12px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              padding: "3px 10px",
                              borderRadius: "4px",
                              background: currentAssType.bg,
                              color: currentAssType.badgeColor,
                              border: `1px solid ${currentAssType.badgeColor}33`,
                              textTransform: "uppercase",
                              letterSpacing: "0.03em",
                            }}
                          >
                            {currentAssType.label}
                          </span>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--brand)" }}>
                              {selectedQuiz.courseTitle}
                            </div>
                            <div style={{ fontSize: "0.74rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                              <span>Target: <strong>{selectedQuiz.moduleTitle || "Modul Belum Ditentukan"}</strong></span>
                              {selectedQuiz.lessonTitle && (
                                <>
                                  <span>•</span>
                                  <span>Sub-Materi: {selectedQuiz.lessonTitle}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "0.72rem", color: "var(--muted)", background: "var(--bx-surface)", padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)" }}>
                            Passing: <strong>{selectedQuiz.passingScore}%</strong> | Waktu: <strong>{selectedQuiz.timeLimitMinutes} Menit</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => setSliderTab("setup")}
                            style={{
                              padding: "5px 10px",
                              borderRadius: "5px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-surface)",
                              color: "var(--brand)",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <FlatIcon type="edit" size={11} color="var(--brand)" />
                            <span>Ubah Sasaran Modul</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                  {/* Academic Team Attribution Bar for this Quiz */}
                  <div
                    style={{
                      padding: "10px 14px",
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", fontSize: "0.74rem" }}>
                      <strong style={{ color: "var(--brand)" }}>Tim Penanggung Jawab Kuis &amp; Soal:</strong>
                      <span style={{ padding: "2px 8px", borderRadius: "10px", background: "rgba(10,46,82,0.08)", color: "var(--brand)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <img src={selectedQuiz.academicTeam?.curriculumAuthorAvatar || "/alumni/alumni_5.jpg"} alt="" style={{ width: "14px", height: "14px", borderRadius: "50%", objectFit: "cover" }} />
                        <span>Pembuat: <strong>{(selectedQuiz.academicTeam?.curriculumAuthor || "Dr. Maya Anggraini").split(",")[0]}</strong></span>
                      </span>
                      <span style={{ padding: "2px 8px", borderRadius: "10px", background: "rgba(201,150,46,0.12)", color: "var(--gold-2)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <img src={selectedQuiz.academicTeam?.instructorAvatar || "/alumni/alumni_1.jpg"} alt="" style={{ width: "14px", height: "14px", borderRadius: "50%", objectFit: "cover" }} />
                        <span>Instruktur: <strong>{(selectedQuiz.academicTeam?.instructorName || "Prof. Budi Rahardjo").split(",")[0]}</strong></span>
                      </span>
                      <span style={{ padding: "2px 8px", borderRadius: "10px", background: "rgba(5,150,105,0.1)", color: "#065F46", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <img src={selectedQuiz.academicTeam?.reviewerAvatar || "/alumni/alumni_2.jpg"} alt="" style={{ width: "14px", height: "14px", borderRadius: "50%", objectFit: "cover" }} />
                        <span>Reviewer: <strong>{(selectedQuiz.academicTeam?.reviewerName || "Siti Nurhaliza").split(",")[0]}</strong></span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSliderTab("tim-soal")}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid var(--brand)",
                        background: "var(--bx-surface)",
                        color: "var(--brand)",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        cursor: "pointer",
                      }}
                    >
                      Kelola Tim Soal
                    </button>
                  </div>

                  {/* List of existing questions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <strong style={{ color: "var(--brand)", fontSize: "0.88rem" }}>
                      Daftar Soal Tersimpan ({selectedQuiz.questions.length} Butir Soal):
                    </strong>
                    {selectedQuiz.questions.map((q, idx) => {
                      const isEditing = editingQuestionId === q.id;

                      if (isEditing) {
                        return (
                          <div
                            key={q.id}
                            style={{
                              padding: "16px 18px",
                              background: "var(--bx-surface, #FFFFFF)",
                              border: "2px solid var(--brand, #0A2E52)",
                              borderRadius: "8px",
                              boxShadow: "0 4px 14px rgba(10, 46, 82, 0.08)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                            }}
                          >
                            {/* Edit Mode Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--bx-border)", paddingBottom: "8px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "4px", background: "var(--brand, #0A2E52)", color: "#ffffff", fontWeight: 700 }}>
                                  Mode Edit Butir Soal #{idx + 1}
                                </span>
                                <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                                  Perbarui teks soal, bobot skor, opsi jawaban, atau pembahasan.
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={handleCancelEditQuestion}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "var(--muted)",
                                  fontSize: "0.74rem",
                                  cursor: "pointer",
                                  fontWeight: 600,
                                }}
                              >
                                Batal Edit
                              </button>
                            </div>

                            {/* Tipe Soal & Bobot Poin */}
                            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
                              <div>
                                <label style={{ display: "block", fontWeight: 700, fontSize: "0.76rem", marginBottom: "3px", color: "var(--brand)" }}>
                                  Tipe Soal
                                </label>
                                <select
                                  value={editQuestionType}
                                  onChange={(e) => setEditQuestionType(e.target.value as any)}
                                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.8rem", fontWeight: 600 }}
                                >
                                  <option value="multiple_choice">Multiple Choice (Pilihan Ganda 1 Benar)</option>
                                  <option value="multiple_select">Multiple Select (Pilihan Multi Jawaban)</option>
                                  <option value="true_false">True / False (Benar atau Salah)</option>
                                  <option value="short_answer">Short Answer (Isian Singkat)</option>
                                </select>
                              </div>

                              <div>
                                <label style={{ display: "block", fontWeight: 700, fontSize: "0.76rem", marginBottom: "3px", color: "var(--brand)" }}>
                                  Bobot Poin
                                </label>
                                <input
                                  type="number"
                                  min={1}
                                  max={100}
                                  value={editQuestionPoints}
                                  onChange={(e) => setEditQuestionPoints(Number(e.target.value))}
                                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.8rem", fontWeight: 700 }}
                                />
                              </div>
                            </div>

                            {/* Question Text */}
                            <div>
                              <label style={{ display: "block", fontWeight: 700, fontSize: "0.76rem", marginBottom: "3px", color: "var(--brand)" }}>
                                Teks Pertanyaan / Soal:
                              </label>
                              <textarea
                                rows={3}
                                value={editQuestionText}
                                onChange={(e) => setEditQuestionText(e.target.value)}
                                placeholder="Tuliskan butir pertanyaan kuis..."
                                style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem", lineHeight: 1.4 }}
                              />
                            </div>

                            {/* Options Editor (for non-short_answer) */}
                            {editQuestionType !== "short_answer" && (
                              <div style={{ background: "var(--bx-bg-alt)", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                  <label style={{ fontWeight: 700, fontSize: "0.76rem", color: "var(--brand)" }}>
                                    Opsi Pilihan (Centang opsi kunci jawaban yang benar):
                                  </label>
                                  <button
                                    type="button"
                                    onClick={handleAddEditOption}
                                    style={{ padding: "3px 8px", fontSize: "0.72rem", border: "1px solid var(--brand)", background: "var(--bx-surface)", color: "var(--brand)", cursor: "pointer", borderRadius: "4px", fontWeight: 700 }}
                                  >
                                    Tambah Opsi Pilihan
                                  </button>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                  {editQuestionOptions.map((opt, optIdx) => (
                                    <div key={opt.id || optIdx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                      <input
                                        type="checkbox"
                                        checked={opt.isCorrect}
                                        onChange={() => handleToggleEditOptionCorrect(optIdx)}
                                        title="Tandai sebagai kunci jawaban benar"
                                        style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#059669" }}
                                      />
                                      <span style={{ fontSize: "0.72rem", fontWeight: 700, width: "55px", color: opt.isCorrect ? "#059669" : "var(--muted)" }}>
                                        {opt.isCorrect ? "✓ Benar" : "Opsi"}
                                      </span>
                                      <input
                                        type="text"
                                        value={opt.text}
                                        onChange={(e) => {
                                          const nextOpts = [...editQuestionOptions];
                                          nextOpts[optIdx].text = e.target.value;
                                          setEditQuestionOptions(nextOpts);
                                        }}
                                        placeholder={`Teks pilihan jawaban ${optIdx + 1}...`}
                                        style={{ flex: 1, padding: "6px 10px", borderRadius: "4px", border: opt.isCorrect ? "1px solid #10B981" : "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.8rem" }}
                                      />
                                      {editQuestionOptions.length > 2 && (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveEditOption(optIdx)}
                                          title="Hapus opsi ini"
                                          style={{ background: "transparent", border: "none", color: "#DC2626", cursor: "pointer", fontSize: "0.75rem", padding: "4px" }}
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Short Answer Key */}
                            {editQuestionType === "short_answer" && (
                              <div>
                                <label style={{ display: "block", fontWeight: 700, fontSize: "0.76rem", marginBottom: "3px", color: "var(--brand)" }}>
                                  Kunci Jawaban Singkat
                                </label>
                                <input
                                  type="text"
                                  value={editShortAnswerKey}
                                  onChange={(e) => setEditShortAnswerKey(e.target.value)}
                                  placeholder="Misal: useActionState"
                                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.82rem", fontWeight: 700 }}
                                />
                              </div>
                            )}

                            {/* Explanation */}
                            <div>
                              <label style={{ display: "block", fontWeight: 700, fontSize: "0.76rem", marginBottom: "3px", color: "var(--brand)" }}>
                                Penjelasan &amp; Pembahasan Soal
                              </label>
                              <textarea
                                rows={2}
                                value={editQuestionExplanation}
                                onChange={(e) => setEditQuestionExplanation(e.target.value)}
                                placeholder="Penjelasan pembahasan soal yang akan tampil bagi siswa setelah asesmen..."
                                style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontSize: "0.8rem", lineHeight: 1.4 }}
                              />
                            </div>

                            {/* Footer Buttons */}
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                              <button
                                type="button"
                                onClick={handleCancelEditQuestion}
                                style={{
                                  padding: "6px 14px",
                                  borderRadius: "5px",
                                  border: "1px solid var(--bx-border)",
                                  background: "transparent",
                                  color: "var(--ink)",
                                  fontSize: "0.78rem",
                                  cursor: "pointer",
                                  fontWeight: 600,
                                }}
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveEditedQuestion}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  padding: "6px 16px",
                                  borderRadius: "5px",
                                  border: "none",
                                  background: "var(--brand)",
                                  color: "#ffffff",
                                  fontSize: "0.78rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                <FlatIcon type="check" size={13} color="#ffffff" />
                                <span>Simpan Perubahan Soal #{idx + 1}</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={q.id}
                          style={{
                            padding: "14px 16px",
                            background: "var(--bx-bg-alt)",
                            border: "1px solid var(--bx-border)",
                            borderRadius: "8px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                            <span style={{ fontWeight: 700, color: "var(--brand)", fontSize: "0.84rem" }}>
                              Soal #{idx + 1} • {q.type.replace("_", " ").toUpperCase()} ({q.points} Poin)
                            </span>
                            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                              <button
                                type="button"
                                onClick={() => handleStartEditQuestion(q)}
                                title="Edit teks soal, bobot, opsi & pembahasan"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  background: "var(--bx-surface)",
                                  border: "1px solid var(--bx-border)",
                                  borderRadius: "4px",
                                  padding: "4px 9px",
                                  fontSize: "0.74rem",
                                  fontWeight: 700,
                                  color: "var(--brand)",
                                  cursor: "pointer",
                                }}
                              >
                                <FlatIcon type="edit" size={12} color="var(--brand)" />
                                <span>Edit Soal</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteQuestion(q.id)}
                                title="Hapus butir soal ini dari kuis"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  background: "transparent",
                                  border: "1px solid #FCA5A5",
                                  borderRadius: "4px",
                                  padding: "4px 9px",
                                  fontSize: "0.74rem",
                                  fontWeight: 600,
                                  color: "#DC2626",
                                  cursor: "pointer",
                                }}
                              >
                                <FlatIcon type="trash" size={12} color="#DC2626" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>

                          <p style={{ margin: "2px 0 6px", fontWeight: 600, fontSize: "0.84rem", color: "var(--ink)", lineHeight: 1.4 }}>
                            {q.questionText}
                          </p>

                          {/* Options */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {q.options.map((opt) => (
                              <div
                                key={opt.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "6px 10px",
                                  borderRadius: "4px",
                                  background: opt.isCorrect ? "#D1FAE5" : "var(--bx-surface)",
                                  border: opt.isCorrect ? "1px solid #10B981" : "1px solid var(--bx-border)",
                                  fontSize: "0.76rem",
                                  color: opt.isCorrect ? "#065F46" : "var(--ink)",
                                  fontWeight: opt.isCorrect ? 700 : 400,
                                }}
                              >
                                <span>{opt.isCorrect ? "✓ (Kunci Benar)" : "○"}</span>
                                <span>{opt.text}</span>
                              </div>
                            ))}
                          </div>

                          {q.correctAnswerText && (
                            <div style={{ fontSize: "0.75rem", color: "#065F46", fontWeight: 700, marginTop: "4px" }}>
                              Kunci Jawaban Singkat: <strong>{q.correctAnswerText}</strong>
                            </div>
                          )}

                          <div style={{ marginTop: "6px", paddingTop: "8px", borderTop: "1px dashed var(--bx-border)", fontSize: "0.74rem", color: "var(--muted)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                            <div>
                              <strong>Pembahasan:</strong> {q.explanation}
                            </div>
                            <div style={{ fontSize: "0.68rem", color: "var(--brand)", display: "flex", gap: "8px" }}>
                              <span>Disusun: <strong>{(selectedQuiz.academicTeam?.curriculumAuthor || "Dr. Maya").split(",")[0]}</strong></span>
                              <span>•</span>
                              <span>Reviewer: <strong>{(selectedQuiz.academicTeam?.reviewerName || "Siti N.").split(",")[0]}</strong></span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {selectedQuiz.questions.length === 0 && (
                      <div style={{ color: "var(--muted)", fontStyle: "italic", padding: "20px", textAlign: "center", background: "var(--bx-bg-alt)", borderRadius: "8px" }}>
                        Belum ada soal pada kuis ini. Tambahkan soal baru menggunakan form di bawah.
                      </div>
                    )}
                  </div>

                  {/* Form Add New Question */}
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "16px",
                      border: "2px dashed var(--bx-border)",
                      borderRadius: "8px",
                      background: "var(--bx-surface)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <strong style={{ color: "var(--brand)", fontSize: "0.9rem" }}>Tambah Butir Soal Baru</strong>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Tipe Soal</label>
                        <select
                          value={newQuestionType}
                          onChange={(e) => setNewQuestionType(e.target.value as any)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                        >
                          <option value="multiple_choice">Multiple Choice (Pilihan Ganda 1 Benar)</option>
                          <option value="multiple_select">Multiple Select (Pilihan Multi Jawaban)</option>
                          <option value="true_false">True / False (Benar atau Salah)</option>
                          <option value="short_answer">Short Answer (Isian Singkat)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Bobot Poin</label>
                        <input
                          type="number"
                          value={newQuestionPoints}
                          onChange={(e) => setNewQuestionPoints(Number(e.target.value))}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Teks Pertanyaan / Soal</label>
                      <textarea
                        rows={3}
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                        placeholder="Tuliskan teks pertanyaan soal..."
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                      />
                    </div>

                    {/* Options Editor */}
                    {newQuestionType !== "short_answer" && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <label style={{ fontWeight: 700 }}>Opsi Pilihan (Centang jawaban yang benar):</label>
                          <button
                            type="button"
                            onClick={handleAddOption}
                            style={{ padding: "4px 10px", fontSize: "0.72rem", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)", cursor: "pointer", borderRadius: "4px", fontWeight: 600 }}
                          >
                            Tambah Opsi
                          </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {newQuestionOptions.map((opt, i) => (
                            <div key={opt.id} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <input
                                type="checkbox"
                                checked={opt.isCorrect}
                                onChange={(e) => {
                                  const updated = [...newQuestionOptions];
                                  updated[i].isCorrect = e.target.checked;
                                  setNewQuestionOptions(updated);
                                }}
                                style={{ width: "16px", height: "16px" }}
                              />
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => {
                                  const updated = [...newQuestionOptions];
                                  updated[i].text = e.target.value;
                                  setNewQuestionOptions(updated);
                                }}
                                style={{ flex: 1, padding: "6px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)" }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {newQuestionType === "short_answer" && (
                      <div>
                        <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Kunci Jawaban Singkat</label>
                        <input
                          type="text"
                          value={shortAnswerKey}
                          onChange={(e) => setShortAnswerKey(e.target.value)}
                          placeholder="Misal: useActionState"
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                        />
                      </div>
                    )}

                    <div>
                      <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Penjelasan &amp; Pembahasan Soal</label>
                      <textarea
                        rows={2}
                        value={newQuestionExplanation}
                        onChange={(e) => setNewQuestionExplanation(e.target.value)}
                        placeholder="Penjelasan ini akan muncul bagi siswa setelah menyelesaikan kuis..."
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveQuestion}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "none",
                        background: "var(--brand)",
                        color: "#ffffff",
                        fontWeight: 700,
                        cursor: "pointer",
                        alignSelf: "flex-end",
                      }}
                    >
                      Tambahkan Soal ke Kuis
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: TIM AKADEMIK & REVIEWER SOAL (OBE & BLOOM STANDAR) */}
              {/* ============================================================== */}
              {sliderTab === "tim-soal" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px", fontSize: "0.82rem", maxWidth: "1150px" }}>
                  {/* Header Banner */}
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
                      gap: "14px",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "3px",
                            background: "var(--gold-2)",
                            color: "#ffffff",
                            textTransform: "uppercase",
                          }}
                        >
                          Tata Kelola OBE &amp; LPMA
                        </span>
                        <h3 style={{ margin: 0, fontSize: "1.05rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                          Struktur Tim Akademik, Penanggung Jawab &amp; Auditor Mutu Soal
                        </h3>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)", maxWidth: "780px", lineHeight: 1.4 }}>
                        Sesuai regulasi akreditasi kurikulum LMS, setiap butir soal dan kuis wajib mencatat penyusun bank naskah, instruktur pengampu materi, reviewer validitas kunci jawaban, serta auditor penjamin mutu akademik (LPMA).
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.72rem", padding: "4px 10px", borderRadius: "4px", background: "#D1FAE5", color: "#065F46", fontWeight: 700 }}>
                        ● 4 Peran Terpetakan
                      </span>
                      <span style={{ fontSize: "0.72rem", padding: "4px 10px", borderRadius: "4px", background: "rgba(201, 150, 46, 0.15)", color: "var(--gold-2)", fontWeight: 700 }}>
                        ● Standar Bloom C4–C6
                      </span>
                    </div>
                  </div>

                  {/* Symmetrical 4-Card Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "16px" }}>
                    {/* 1. Pembuat Soal / Tim Kurikulum */}
                    <div
                      style={{
                        background: "var(--bx-surface)",
                        border: "1px solid var(--bx-border)",
                        borderRadius: "8px",
                        padding: "16px 18px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "14px",
                        boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid var(--bx-border)" }}>
                          <img
                            src={selectedQuiz.academicTeam?.curriculumAuthorAvatar || "/alumni/alumni_5.jpg"}
                            alt=""
                            style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--brand)", flexShrink: 0 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                              1. PENYUSUN BANK SOAL
                            </span>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {selectedQuiz.academicTeam?.curriculumAuthor || "Dr. Maya Anggraini, M.Cs."}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Penulis naskah soal &amp; kisi-kisi evaluasi</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px", color: "var(--ink)" }}>
                              Pilih Penulis Naskah Soal Utama
                            </label>
                            <select
                              value={selectedQuiz.academicTeam?.curriculumAuthor || "Dr. Maya Anggraini, M.Cs."}
                              onChange={(e) => {
                                const found = MOCK_ACADEMIC_STAFF.find((s) => s.name === e.target.value);
                                const curr = selectedQuiz.academicTeam || DEFAULT_ACADEMIC_TEAM;
                                setSelectedQuiz({
                                  ...selectedQuiz,
                                  academicTeam: {
                                    ...curr,
                                    curriculumAuthor: e.target.value,
                                    curriculumAuthorAvatar: found?.avatar || "/alumni/alumni_5.jpg",
                                    curriculumAuthorRole: found?.role || "Penyusun Bank Soal & Kisi-Kisi Ujian",
                                  },
                                });
                              }}
                              style={{ width: "100%", padding: "8px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontSize: "0.78rem", color: "var(--ink)" }}
                            >
                              {MOCK_ACADEMIC_STAFF.map((st) => (
                                <option key={st.id} value={st.name}>{st.name} — {st.role}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px", color: "var(--ink)" }}>
                              Divisi / Unit Kurikulum
                            </label>
                            <input
                              type="text"
                              value={selectedQuiz.academicTeam?.curriculumTeam || "Biro Standarisasi Asesmen & Ujian Anvieo"}
                              onChange={(e) => {
                                const curr = selectedQuiz.academicTeam || DEFAULT_ACADEMIC_TEAM;
                                setSelectedQuiz({
                                  ...selectedQuiz,
                                  academicTeam: { ...curr, curriculumTeam: e.target.value },
                                });
                              }}
                              style={{ width: "100%", padding: "8px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontSize: "0.78rem", color: "var(--ink)" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px dashed var(--bx-border)", fontSize: "0.72rem" }}>
                        <span style={{ padding: "2px 8px", borderRadius: "4px", background: "rgba(10, 46, 82, 0.08)", color: "var(--brand)", fontWeight: 700 }}>
                          Fee Royalti Soal: 25% Alokasi Konten
                        </span>
                        <span style={{ color: "#065F46", fontWeight: 700 }}>● Terverifikasi Aktif</span>
                      </div>
                    </div>

                    {/* 2. Instruktur Penanggung Jawab Materi */}
                    <div
                      style={{
                        background: "var(--bx-surface)",
                        border: "1px solid var(--bx-border)",
                        borderRadius: "8px",
                        padding: "16px 18px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "14px",
                        boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid var(--bx-border)" }}>
                          <img
                            src={selectedQuiz.academicTeam?.instructorAvatar || "/alumni/alumni_1.jpg"}
                            alt=""
                            style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--gold)", flexShrink: 0 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--gold-2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                              2. INSTRUKTUR PENGAMPU
                            </span>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {selectedQuiz.academicTeam?.instructorName || "Prof. Budi Rahardjo, Ph.D."}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Dosen penanggung jawab materi kuis ini</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px", color: "var(--ink)" }}>
                              Pilih Dosen / Instruktur Pengampu
                            </label>
                            <select
                              value={selectedQuiz.academicTeam?.instructorName || "Prof. Budi Rahardjo, Ph.D."}
                              onChange={(e) => {
                                const found = MOCK_ACADEMIC_STAFF.find((s) => s.name === e.target.value);
                                const curr = selectedQuiz.academicTeam || DEFAULT_ACADEMIC_TEAM;
                                setSelectedQuiz({
                                  ...selectedQuiz,
                                  academicTeam: {
                                    ...curr,
                                    instructorName: e.target.value,
                                    instructorAvatar: found?.avatar || "/alumni/alumni_1.jpg",
                                    instructorRole: found?.role || "Master Instructor & Dosen Pengampu",
                                  },
                                });
                              }}
                              style={{ width: "100%", padding: "8px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontSize: "0.78rem", color: "var(--ink)" }}
                            >
                              {MOCK_ACADEMIC_STAFF.map((st) => (
                                <option key={st.id} value={st.name}>{st.name} — {st.role}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px", color: "var(--ink)" }}>
                              Spesialisasi Pengampu
                            </label>
                            <input
                              type="text"
                              value={selectedQuiz.academicTeam?.instructorRole || "Master Instructor & Dosen Spesialis Cloud AI"}
                              onChange={(e) => {
                                const curr = selectedQuiz.academicTeam || DEFAULT_ACADEMIC_TEAM;
                                setSelectedQuiz({
                                  ...selectedQuiz,
                                  academicTeam: { ...curr, instructorRole: e.target.value },
                                });
                              }}
                              style={{ width: "100%", padding: "8px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontSize: "0.78rem", color: "var(--ink)" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px dashed var(--bx-border)", fontSize: "0.72rem" }}>
                        <span style={{ padding: "2px 8px", borderRadius: "4px", background: "rgba(201, 150, 46, 0.12)", color: "var(--gold-2)", fontWeight: 700 }}>
                          Fee Instruktur: 45% Bagi Hasil
                        </span>
                        <span style={{ color: "#065F46", fontWeight: 700 }}>● Terverifikasi Aktif</span>
                      </div>
                    </div>

                    {/* 3. Reviewer Penilai & Validasi Jawaban */}
                    <div
                      style={{
                        background: "var(--bx-surface)",
                        border: "1px solid var(--bx-border)",
                        borderRadius: "8px",
                        padding: "16px 18px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "14px",
                        boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid var(--bx-border)" }}>
                          <img
                            src={selectedQuiz.academicTeam?.reviewerAvatar || "/alumni/alumni_2.jpg"}
                            alt=""
                            style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid #059669", flexShrink: 0 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#065F46", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                              3. REVIEWER KUNCI JAWABAN
                            </span>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {selectedQuiz.academicTeam?.reviewerName || "Siti Nurhaliza, S.Kom."}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Penguji rubrik &amp; pengecekan kunci soal</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px", color: "var(--ink)" }}>
                              Pilih Reviewer Validator
                            </label>
                            <select
                              value={selectedQuiz.academicTeam?.reviewerName || "Siti Nurhaliza, S.Kom."}
                              onChange={(e) => {
                                const found = MOCK_ACADEMIC_STAFF.find((s) => s.name === e.target.value);
                                const curr = selectedQuiz.academicTeam || DEFAULT_ACADEMIC_TEAM;
                                setSelectedQuiz({
                                  ...selectedQuiz,
                                  academicTeam: {
                                    ...curr,
                                    reviewerName: e.target.value,
                                    reviewerAvatar: found?.avatar || "/alumni/alumni_2.jpg",
                                    reviewerRole: found?.role || "Senior Assessment Reviewer",
                                  },
                                });
                              }}
                              style={{ width: "100%", padding: "8px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontSize: "0.78rem", color: "var(--ink)" }}
                            >
                              {MOCK_ACADEMIC_STAFF.map((st) => (
                                <option key={st.id} value={st.name}>{st.name} — {st.role}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px", color: "var(--ink)" }}>
                              Fungsi &amp; Lingkup Review
                            </label>
                            <input
                              type="text"
                              value={selectedQuiz.academicTeam?.reviewerRole || "Reviewer Validitas Kunci Jawaban & Rubrik Penilaian"}
                              onChange={(e) => {
                                const curr = selectedQuiz.academicTeam || DEFAULT_ACADEMIC_TEAM;
                                setSelectedQuiz({
                                  ...selectedQuiz,
                                  academicTeam: { ...curr, reviewerRole: e.target.value },
                                });
                              }}
                              style={{ width: "100%", padding: "8px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontSize: "0.78rem", color: "var(--ink)" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px dashed var(--bx-border)", fontSize: "0.72rem" }}>
                        <span style={{ padding: "2px 8px", borderRadius: "4px", background: "rgba(5, 150, 105, 0.1)", color: "#065F46", fontWeight: 700 }}>
                          Fee Reviewer: 15% Alokasi Asesmen
                        </span>
                        <span style={{ color: "#065F46", fontWeight: 700 }}>● Terverifikasi Aktif</span>
                      </div>
                    </div>

                    {/* 4. QA Penjamin Mutu LPMA */}
                    <div
                      style={{
                        background: "var(--bx-surface)",
                        border: "1px solid var(--bx-border)",
                        borderRadius: "8px",
                        padding: "16px 18px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "14px",
                        boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid var(--bx-border)" }}>
                          <img
                            src="/alumni/alumni_3.jpg"
                            alt=""
                            style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid #7C3AED", flexShrink: 0 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                              4. PENJAMIN MUTU AKADEMIK (QA)
                            </span>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {selectedQuiz.academicTeam?.qaValidatorName || "Dr. Ir. Hendra Prasetyo, M.T. (LPMA)"}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Validasi tingkat kesulitan &amp; standar Bloom</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px", color: "var(--ink)" }}>
                              Auditor Mutu Asesmen (LPMA)
                            </label>
                            <input
                              type="text"
                              value={selectedQuiz.academicTeam?.qaValidatorName || "Dr. Ir. Hendra Prasetyo, M.T. (LPMA)"}
                              onChange={(e) => {
                                const curr = selectedQuiz.academicTeam || DEFAULT_ACADEMIC_TEAM;
                                setSelectedQuiz({
                                  ...selectedQuiz,
                                  academicTeam: { ...curr, qaValidatorName: e.target.value },
                                });
                              }}
                              style={{ width: "100%", padding: "8px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontSize: "0.78rem", color: "var(--ink)" }}
                            />
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px", color: "var(--ink)" }}>
                              Status Akreditasi &amp; Taksonomi
                            </label>
                            <div style={{ padding: "8px 10px", background: "var(--bx-bg-alt)", border: "1px solid var(--bx-border)", borderRadius: "5px", fontSize: "0.74rem", color: "#065F46", fontWeight: 600 }}>
                              ✓ Butir soal lolos audit Taksonomi Bloom Level C4 (Menganalisis) hingga C6 (Mencipta)
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px dashed var(--bx-border)", fontSize: "0.72rem" }}>
                        <span style={{ padding: "2px 8px", borderRadius: "4px", background: "rgba(124, 58, 237, 0.1)", color: "#7C3AED", fontWeight: 700 }}>
                          Badan Penjamin Mutu LPMA
                        </span>
                        <span style={{ color: "#065F46", fontWeight: 700 }}>● Lulus Audit</span>
                      </div>
                    </div>
                  </div>

                  {/* Pakta Integritas Soal */}
                  <div
                    style={{
                      background: "rgba(10, 46, 82, 0.03)",
                      border: "1px dashed var(--bx-border)",
                      borderRadius: "8px",
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <FlatIcon type="shield" size={24} color="var(--brand)" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--brand)" }}>
                          Pakta Integritas &amp; Validitas Kunci Jawaban
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "var(--muted)", maxWidth: "700px" }}>
                          Tim penyusun dan reviewer menjamin bahwa seluruh butir soal terbebas dari plagiarisme, kunci jawaban telah diuji keakuratannya, dan bobot penilaian telah diverifikasi secara objektif.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", fontWeight: 700, color: "#065F46", background: "#D1FAE5", padding: "6px 12px", borderRadius: "6px" }}>
                      <FlatIcon type="check" size={13} color="#065F46" />
                      <span>Ditandatangani Digital oleh Tim Akademik</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 4: DASHBOARD ANALISIS HASIL & RANKING KECEPATAN */}
              {/* ============================================================== */}
              {sliderTab === "dashboard" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px", fontSize: "0.82rem", maxWidth: "1300px" }}>
                  {currentAttempts.length === 0 ? (
                    /* Clean Informative Empty State for Brand New Quizzes */
                    <div
                      style={{
                        padding: "54px 24px",
                        background: "var(--bx-bg-alt)",
                        border: "1.5px dashed var(--bx-border)",
                        borderRadius: "10px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "14px",
                        maxWidth: "760px",
                        margin: "30px auto",
                      }}
                    >
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          background: "rgba(201, 150, 46, 0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FlatIcon type="users" size={30} color="var(--gold-2)" />
                      </div>

                      <div>
                        <h3 style={{ margin: "0 0 6px", fontSize: "1.1rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                          Belum Ada Siswa yang Mengerjakan Kuis Ini
                        </h3>
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)", maxWidth: "540px", lineHeight: 1.45 }}>
                          Kuis <strong>&quot;{selectedQuiz.title}&quot;</strong> pada <strong>{selectedQuiz.moduleTitle || selectedQuiz.courseTitle}</strong> baru dibuat atau belum ada pengiriman lembar jawaban oleh siswa. Data kecepatan pengerjaan, skor kelulusan, dan papan peringkat (leaderboard) akan terakumulasi otomatis saat siswa mulai mengerjakan.
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: "10px", marginTop: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                        <button
                          type="button"
                          onClick={() => setSliderTab("setup")}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "1px solid var(--bx-border)",
                            background: "var(--bx-surface)",
                            color: "var(--brand)",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FlatIcon type="settings" size={13} color="var(--brand)" />
                          <span>1. Atur Sasaran Modul &amp; Regulasi</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSliderTab("soal")}
                          style={{
                            padding: "8px 16px",
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
                            boxShadow: "0 2px 6px rgba(10, 46, 82, 0.2)",
                          }}
                        >
                          <FlatIcon type="edit" size={13} color="#ffffff" />
                          <span>2. Tambah / Kelola Butir Soal ({selectedQuiz.questions.length})</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Top Metric Cards Bar */}
                      {(() => {
                        const statsTotal = currentAttempts.length;
                        const statsPassed = currentAttempts.filter((a) => a.passed).length;
                        const statsPassRate = statsTotal > 0 ? Math.round((statsPassed / statsTotal) * 100) : 0;
                        const statsAvgScore = statsTotal > 0 ? Math.round(currentAttempts.reduce((acc, a) => acc + a.score, 0) / statsTotal) : 0;
                        const statsCleanRun = currentAttempts.filter((a) => a.passed && a.failedAttemptsBeforePass === 0).length;
                        const statsFailed = currentAttempts.filter((a) => !a.passed).length;

                        return (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                            <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                              <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>Total Peserta Mengerjakan</div>
                              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--brand)", marginTop: "4px" }}>
                                {statsTotal} Siswa
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 600 }}>100% Tercatat Otomatis</div>
                            </div>

                            <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                              <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>Tingkat Kelulusan (Pass Rate)</div>
                              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#065F46", marginTop: "4px" }}>
                                {statsPassRate}%
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Passing Grade Minimal {selectedQuiz.passingScore}%</div>
                            </div>

                            <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                              <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>Rata-rata Skor Kuis</div>
                              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--brand)", marginTop: "4px" }}>
                                {statsAvgScore}
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Dari skala maksimal 100</div>
                            </div>

                            <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                              <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>Waktu Tercepat (Speed Record)</div>
                              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--gold-2)", marginTop: "4px" }}>
                                {top3Winners[0] ? formatDuration(top3Winners[0].durationSeconds) : "-"}
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                                {top3Winners[0] ? `Oleh ${top3Winners[0].studentName}` : "Belum ada record"}
                              </div>
                            </div>

                            <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                              <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>Lulus Tanpa Gagal (Clean Run)</div>
                              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#047857", marginTop: "4px" }}>
                                {statsCleanRun} Siswa
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "#047857" }}>Selesai Percobaan Pertama</div>
                            </div>

                            <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                              <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>Perlu Remedial / Gagal</div>
                              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#DC2626", marginTop: "4px" }}>
                                {statsFailed} Siswa
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "#DC2626" }}>Skor di bawah batas kelulusan</div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Podium 3 Juara Teratas (Leaderboard Speed & Accuracy) */}
                      {top3Winners.length > 0 && (
                        <div
                          style={{
                            background: "rgba(201, 150, 46, 0.05)",
                            border: "1px solid var(--gold)",
                            borderRadius: "10px",
                            padding: "16px 20px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <div>
                              <h4 style={{ margin: 0, color: "var(--brand)", fontSize: "1rem", fontFamily: "var(--font-heading)" }}>
                                Podium Juara Kecepatan &amp; Akurasi Tertinggi (Speedrun Leaderboard)
                              </h4>
                              <div style={{ fontSize: "0.76rem", color: "var(--muted)" }}>
                                Peringkat otomatis berdasarkan: Skor 100 Sempurna &gt; Tanpa Gagal (1x Attempt) &gt; Waktu Selesai Tercepat.
                              </div>
                            </div>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                padding: "3px 10px",
                                borderRadius: "12px",
                                background: "var(--gold)",
                                color: "#ffffff",
                              }}
                            >
                              Official Ranking
                            </span>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
                            {top3Winners.map((winner, idx) => {
                              const rankLabel = idx === 0 ? "🥇 JUARA 1 (Speed Master)" : idx === 1 ? "🥈 JUARA 2 (Flawless Runner)" : "🥉 JUARA 3 (Top Performer)";
                              const rankBg = idx === 0 ? "rgba(201, 150, 46, 0.15)" : idx === 1 ? "rgba(100, 116, 139, 0.1)" : "rgba(180, 83, 9, 0.08)";
                              const rankBorder = idx === 0 ? "var(--gold)" : idx === 1 ? "var(--bx-border)" : "rgba(180, 83, 9, 0.4)";

                              return (
                                <div
                                  key={winner.id}
                                  style={{
                                    background: rankBg,
                                    border: `1.5px solid ${rankBorder}`,
                                    borderRadius: "8px",
                                    padding: "12px 14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    position: "relative",
                                  }}
                                >
                                  <img
                                    src={winner.studentAvatar}
                                    alt={winner.studentName}
                                    style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ffffff", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
                                  />
                                  <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: idx === 0 ? "var(--gold-2)" : "var(--brand)", textTransform: "uppercase" }}>
                                      {rankLabel}
                                    </span>
                                    <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--brand)" }}>
                                      {winner.studentName}
                                    </div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{winner.studentEmail}</div>

                                    <div style={{ display: "flex", gap: "8px", marginTop: "6px", fontSize: "0.74rem" }}>
                                      <span style={{ fontWeight: 800, color: "#065F46" }}>Skor: {winner.score}/100</span>
                                      <span>•</span>
                                      <span style={{ fontWeight: 800, color: "var(--brand)" }}>⏱️ {formatDuration(winner.durationSeconds)}</span>
                                      <span>•</span>
                                      <span style={{ color: "#059669", fontWeight: 700 }}>0x Gagal</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Filter & Search Bar untuk Tabel Peserta */}
                      <div
                        style={{
                          background: "var(--bx-bg-alt)",
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
                        <div style={{ display: "flex", gap: "6px" }}>
                          {[
                            { id: "leaderboard", label: "🏆 Papan Peringkat (Leaderboard)" },
                            { id: "all", label: "Semua Siswa" },
                            { id: "passed", label: "Lulus" },
                            { id: "failed", label: "Gagal / Remedial" },
                          ].map((btn) => (
                            <button
                              key={btn.id}
                              type="button"
                              onClick={() => setDashboardFilter(btn.id as any)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "5px",
                                border: dashboardFilter === btn.id ? "1px solid var(--brand)" : "1px solid var(--bx-border)",
                                background: dashboardFilter === btn.id ? "var(--brand)" : "var(--bx-surface)",
                                color: dashboardFilter === btn.id ? "#ffffff" : "var(--ink)",
                                fontSize: "0.76rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              {btn.label}
                            </button>
                          ))}
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
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            placeholder="Cari nama / email siswa..."
                            style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.78rem", width: "180px", color: "var(--ink)" }}
                          />
                        </div>
                      </div>

                      {/* Tabel Analisis Siswa & Peringkat */}
                      <div style={{ border: "1px solid var(--bx-border)", borderRadius: "8px", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                          <thead>
                            <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                              <th style={{ padding: "10px 12px", width: "70px" }}>Rangking</th>
                              <th style={{ padding: "10px 12px" }}>Nama Siswa &amp; Profil</th>
                              <th style={{ padding: "10px 12px" }}>Status Hasil</th>
                              <th style={{ padding: "10px 12px" }}>Skor Akhir</th>
                              <th style={{ padding: "10px 12px" }}>Durasi Pengerjaan</th>
                              <th style={{ padding: "10px 12px" }}>Riwayat Gagal / Attempt</th>
                              <th style={{ padding: "10px 12px" }}>Detail Jawaban</th>
                              <th style={{ padding: "10px 12px" }}>Waktu Submit</th>
                              <th style={{ padding: "10px 12px", textAlign: "right" }}>Tindakan</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedAttempts.map((att, idx) => {
                              const isTopRank = idx === 0 && att.passed;
                              return (
                                <tr
                                  key={att.id}
                                  style={{
                                    borderBottom: "1px solid var(--bx-border)",
                                    background: isTopRank ? "rgba(201, 150, 46, 0.05)" : "transparent",
                                  }}
                                >
                                  <td style={{ padding: "10px 12px", fontWeight: 800, color: isTopRank ? "var(--gold-2)" : "var(--brand)" }}>
                                    {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                                  </td>

                                  <td style={{ padding: "10px 12px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                      <img
                                        src={att.studentAvatar}
                                        alt={att.studentName}
                                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--bx-border)" }}
                                      />
                                      <div>
                                        <div style={{ fontWeight: 700, color: "var(--ink)" }}>{att.studentName}</div>
                                        <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{att.studentEmail}</div>
                                      </div>
                                    </div>
                                  </td>

                                  <td style={{ padding: "10px 12px" }}>
                                    <span
                                      style={{
                                        fontSize: "0.7rem",
                                        fontWeight: 800,
                                        padding: "3px 8px",
                                        borderRadius: "4px",
                                        background: att.passed ? "#D1FAE5" : "#FEE2E2",
                                        color: att.passed ? "#065F46" : "#991B1B",
                                      }}
                                    >
                                      {att.passed ? "LULUS" : "GAGAL"}
                                    </span>
                                  </td>

                                  <td style={{ padding: "10px 12px" }}>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: att.passed ? "#065F46" : "#DC2626" }}>
                                      {att.score}/100
                                    </span>
                                  </td>

                                  <td style={{ padding: "10px 12px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                      <span style={{ fontWeight: 700, color: "var(--brand)" }}>
                                        ⏱️ {formatDuration(att.durationSeconds)}
                                      </span>
                                      {att.durationSeconds <= 240 && att.passed && (
                                        <span style={{ fontSize: "0.65rem", padding: "1px 5px", borderRadius: "3px", background: "#FEF3C7", color: "#B45309", fontWeight: 700 }}>
                                          Cepat
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  <td style={{ padding: "10px 12px" }}>
                                    {att.failedAttemptsBeforePass === 0 ? (
                                      <span style={{ fontSize: "0.72rem", padding: "2px 6px", borderRadius: "4px", background: "#D1FAE5", color: "#065F46", fontWeight: 700 }}>
                                        Tanpa Gagal (1x Attempt)
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: "0.72rem", padding: "2px 6px", borderRadius: "4px", background: "#FEE2E2", color: "#991B1B", fontWeight: 600 }}>
                                        {att.failedAttemptsBeforePass}x Pernah Gagal (Percobaan {att.attemptCount})
                                      </span>
                                    )}
                                  </td>

                                  <td style={{ padding: "10px 12px", color: "var(--muted)", fontSize: "0.74rem" }}>
                                    {att.correctAnswersCount}/{att.totalQuestionsCount} Benar
                                  </td>

                                  <td style={{ padding: "10px 12px", color: "var(--muted)", fontSize: "0.72rem" }}>
                                    {att.submittedAt}
                                  </td>

                                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                                    {!att.passed ? (
                                      <button
                                        type="button"
                                        onClick={() => alert(`Kirimkan notifikasi arahan remedial ke ${att.studentName} (${att.studentEmail}).`)}
                                        style={{
                                          padding: "4px 8px",
                                          borderRadius: "4px",
                                          border: "1px solid #FCA5A5",
                                          background: "#FEF2F2",
                                          color: "#DC2626",
                                          fontSize: "0.7rem",
                                          cursor: "pointer",
                                          fontWeight: 600,
                                        }}
                                      >
                                        Remedial
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => alert(`Hasil evaluasi ${att.studentName} telah divalidasi masuk ke transkrip nilai.`)}
                                        style={{
                                          padding: "4px 8px",
                                          borderRadius: "4px",
                                          border: "1px solid var(--bx-border)",
                                          background: "var(--bx-bg-alt)",
                                          color: "var(--brand)",
                                          fontSize: "0.7rem",
                                          cursor: "pointer",
                                          fontWeight: 600,
                                        }}
                                      >
                                        Transkrip
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
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
                Total: <strong style={{ color: "var(--brand)" }}>{selectedQuiz.questions.length} Butir Soal</strong> • Passing: <strong>{selectedQuiz.passingScore}%</strong> • Total Peserta: <strong>{currentAttempts.length} Siswa</strong>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setSelectedQuiz(null)}
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
                  onClick={handleSaveQuiz}
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
                  <span>Simpan Seluruh Soal &amp; Kuis</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
