"use client";

import React, { useState, useMemo } from "react";
import FlatIcon from "./FlatIcon";
import { ReviewSubmission, ReviewStatus, ReviewSubmissionHistoryItem } from "../types/simak";

interface ReviewModalProps {
  submission: ReviewSubmission;
  onClose: () => void;
  onSaveReview: (updated: ReviewSubmission) => void;
}

interface SubmittedFileItem {
  id: string;
  name: string;
  path: string;
  folder: string;
  size: string;
  language: string;
  content: string;
}

export type ReviewTab = "penilaian" | "code_explorer" | "ai_assistant" | "riwayat";

interface AiChatMessage {
  id: string;
  sender: "user" | "ai";
  timestamp: string;
  text: string;
  reasoningSteps?: string[];
  codeSnippet?: {
    language: string;
    title: string;
    code: string;
  };
  suggestedRubric?: {
    arch: number;
    style: number;
    test: number;
    func: number;
  };
  canApplyToReview?: boolean;
}

const MOCK_SUBMISSION_FILES: SubmittedFileItem[] = [
  {
    id: "f-1",
    name: "redisLock.ts",
    path: "src/lib/redisLock.ts",
    folder: "src/lib",
    size: "2.4 KB",
    language: "typescript",
    content: `import Redis from "ioredis";

export interface LockResult {
  acquired: boolean;
  lockKey: string;
  lockToken: string;
  expiresAt: number;
}

export class DistributedLockManager {
  private redis: Redis;
  private readonly defaultTTL: number = 5000; // 5 detik

  constructor(redisClient: Redis) {
    this.redis = redisClient;
  }

  /**
   * Mengakuisisi lock atomik dengan implementasi Redlock sederhana
   */
  async acquireLock(resourceId: string, ttlMs: number = this.defaultTTL): Promise<LockResult> {
    const lockKey = \`lock:resource:\${resourceId}\`;
    const lockToken = \`token:\${Date.now()}:\${Math.random().toString(36).substring(2, 9)}\`;

    // SET key value NX PX ttl (Atomik)
    const result = await this.redis.set(lockKey, lockToken, "PX", ttlMs, "NX");

    return {
      acquired: result === "OK",
      lockKey,
      lockToken,
      expiresAt: Date.now() + ttlMs,
    };
  }

  /**
   * Melepas lock menggunakan Lua script agar hanya token pemegang yang berhak merilis
   */
  async releaseLock(lockKey: string, lockToken: string): Promise<boolean> {
    const luaScript = \`
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    \`;

    const res = await this.redis.eval(luaScript, 1, lockKey, lockToken);
    return res === 1;
  }
}`,
  },
  {
    id: "f-2",
    name: "dbPool.ts",
    path: "src/lib/dbPool.ts",
    folder: "src/lib",
    size: "1.8 KB",
    language: "typescript",
    content: `import { Pool, PoolConfig } from "pg";

const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL || "postgres://postgres:secret@localhost:5432/lms_db",
  max: 20, // Max concurrent connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 4000,
};

export const dbPool = new Pool(poolConfig);

/**
 * Eksekusi query dengan proteksi connection leak (Client auto-released in finally block)
 */
export async function executeQuery<T>(sqlText: string, params: any[] = []): Promise<T[]> {
  const client = await dbPool.connect();
  try {
    const res = await client.query(sqlText, params);
    return res.rows as T[];
  } finally {
    // CRITICAL: Wajib dilepas agar connection pool tidak habis
    client.release();
  }
}`,
  },
  {
    id: "f-3",
    name: "page.tsx",
    path: "src/app/page.tsx",
    folder: "src/app",
    size: "3.2 KB",
    language: "typescript",
    content: `import React, { Suspense } from "react";
import { executeQuery } from "@/lib/dbPool";

export const revalidate = 60; // ISR cache revalidation

async function TaskMetricsList() {
  const tasks = await executeQuery<{ id: string; title: string; status: string }>(
    "SELECT id, title, status FROM student_tasks ORDER BY created_at DESC LIMIT 10"
  );

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id} className="p-3 border rounded-lg flex justify-between bg-white">
          <span className="font-semibold text-slate-800">{task.title}</span>
          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded">
            {task.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function DashboardPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Enterprise Task Management</h1>
        <p className="text-sm text-slate-500">Next.js 16 RSC with streaming suspense</p>
      </header>

      <Suspense fallback={<div className="p-4 bg-slate-100 animate-pulse rounded">Memuat metrik tugas...</div>}>
        <TaskMetricsList />
      </Suspense>
    </main>
  );
}`,
  },
  {
    id: "f-4",
    name: "route.ts",
    path: "src/app/api/tasks/route.ts",
    folder: "src/app/api/tasks",
    size: "2.1 KB",
    language: "typescript",
    content: `import { NextRequest, NextResponse } from "next/server";
import { DistributedLockManager } from "@/lib/redisLock";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const lockManager = new DistributedLockManager(redis);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { taskId, action } = body;

  const lock = await lockManager.acquireLock(taskId, 4000);
  if (!lock.acquired) {
    return NextResponse.json(
      { error: "Resource currently locked by another worker process." },
      { status: 423 }
    );
  }

  try {
    // Simulasi transaksi critical section
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({ success: true, taskId, processedAction: action });
  } finally {
    await lockManager.releaseLock(lock.lockKey, lock.lockToken);
  }
}`,
  },
  {
    id: "f-5",
    name: "sharding.test.ts",
    path: "tests/sharding.test.ts",
    folder: "tests",
    size: "2.8 KB",
    language: "typescript",
    content: `import { describe, it, expect, vi } from "vitest";
import { DistributedLockManager } from "../src/lib/redisLock";

describe("DistributedLockManager Unit Tests", () => {
  it("should acquire lock when key is free", async () => {
    const mockRedis = {
      set: vi.fn().mockResolvedValue("OK"),
      eval: vi.fn().mockResolvedValue(1),
    } as any;

    const manager = new DistributedLockManager(mockRedis);
    const result = await manager.acquireLock("task-101", 3000);

    expect(result.acquired).toBe(true);
    expect(result.lockKey).toBe("lock:resource:task-101");
    expect(mockRedis.set).toHaveBeenCalledTimes(1);
  });

  it("should fail to acquire lock when key already exists", async () => {
    const mockRedis = {
      set: vi.fn().mockResolvedValue(null),
    } as any;

    const manager = new DistributedLockManager(mockRedis);
    const result = await manager.acquireLock("task-101");

    expect(result.acquired).toBe(false);
  });
});`,
  },
  {
    id: "f-6",
    name: "package.json",
    path: "package.json",
    folder: "root",
    size: "1.1 KB",
    language: "json",
    content: `{
  "name": "anvieo-student-final-submission",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "test": "vitest run --coverage"
  },
  "dependencies": {
    "ioredis": "^5.4.1",
    "next": "16.4.3",
    "pg": "^8.12.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/pg": "^8.11.6",
    "@types/react": "19.0.0",
    "typescript": "^5.5.0",
    "vitest": "^1.6.0"
  }
}`,
  },
  {
    id: "f-7",
    name: "README.md",
    path: "README.md",
    folder: "root",
    size: "1.9 KB",
    language: "markdown",
    content: `# Tugas Akhir: Distributed Sharding & Memory Locking Architecture

Mahasiswa: Muhammad Farhan (NIM: 202610014)
Jalur Spesialisasi: Fullstack Web & Cloud Architecture
Modul: Kafka Sharding, Redis Locking & High Availability

## Arsitektur & Pola Rekayasa
1. **Clean Architecture**: Pemisahan layer router (\`src/app/api\`), service provider, dan adapter Redis (\`src/lib\`).
2. **Atomic Redlock**: Proteksi mutasi konkurensi data menggunakan SET NX PX dan verifikasi token via Lua script.
3. **Database Pooling**: Penggunaan \`pg.Pool\` dengan auto-release client connection untuk menghindari connection leaks.

## Hasil Pengujian
- Unit Test: 12 tests passed (\`vitest run\`)
- Test Coverage: 88.4% Statements, 92.1% Functions
`,
  },
  {
    id: "f-8",
    name: "Dockerfile",
    path: "Dockerfile",
    folder: "root",
    size: "1.3 KB",
    language: "dockerfile",
    content: `FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]`,
  },
];

export default function ReviewModal({
  submission,
  onClose,
  onSaveReview,
}: ReviewModalProps) {
  // Main Slider Tabs: "penilaian" | "code_explorer" | "ai_assistant" | "riwayat"
  const [activeTab, setActiveTab] = useState<ReviewTab>("penilaian");

  // Decision State: "approved" | "revision" | "rejected"
  const [decisionStatus, setDecisionStatus] = useState<"approved" | "revision" | "rejected">(
    submission.status === "rejected"
      ? "rejected"
      : submission.status === "revision"
      ? "revision"
      : "approved"
  );

  // Rubric Scores State
  const [archScore, setArchScore] = useState<number>(
    submission.rubricScores?.cleanArchitecture || 92
  );
  const [styleScore, setStyleScore] = useState<number>(
    submission.rubricScores?.codeStyle || 90
  );
  const [testScore, setTestScore] = useState<number>(
    submission.rubricScores?.testCoverage || 88
  );
  const [funcScore, setFuncScore] = useState<number>(
    submission.rubricScores?.functionality || 94
  );

  const [feedback, setFeedback] = useState<string>(
    submission.notes ||
      "Pemisahan layer presentation dan business logic sudah sangat baik. Pelepasan koneksi pool pada dbPool.ts dengan blok try...finally berhasil menuntaskan masalah connection leak pada Attempt #2."
  );

  // Revision / Rejection Structured Feedback Checklist
  const [revisionChecklist, setRevisionChecklist] = useState<string[]>([
    "Bungkus pemanggilan database dengan try ... finally { client.release() }",
    "Tingkatkan unit test coverage Vitest hingga minimal 80%",
    "Tambahkan validasi schema request body menggunakan Zod",
  ]);
  const [newChecklistText, setNewChecklistText] = useState("");
  const [revisionDeadlineDays, setRevisionDeadlineDays] = useState(7);

  // File Explorer & In-App IDE State (Tab 2)
  const [activeFile, setActiveFile] = useState<SubmittedFileItem>(MOCK_SUBMISSION_FILES[0]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [fileSearch, setFileSearch] = useState("");

  // Historical Submissions State (Tab 4)
  const [historyList, setHistoryList] = useState<ReviewSubmissionHistoryItem[]>(
    submission.history && submission.history.length > 0
      ? submission.history
      : [
          {
            id: `hist-${submission.id}-1`,
            attemptNumber: 1,
            submittedAt: "14 Okt 2026, 11:20 WIB",
            reviewedAt: "14 Okt 2026, 16:45 WIB",
            reviewerName: "Rian Maulana, S.T. (Reviewer)",
            status: "rejected",
            score: 52,
            feedbackNotes:
              "Endpoint POST /api/tasks belum menerapkan Distributed Lock. Terjadi race condition data duplikat saat diuji stres 50 concurrent workers. Selain itu, belum ada unit test vitest.",
            revisionChecklist: [
              "Implementasikan Redis atomic lock menggunakan SET NX PX",
              "Tambahkan script release token lock via Lua script di redisLock.ts",
              "Buat unit test vitest minimal 70% coverage",
            ],
            changedFilesCount: 2,
          },
          {
            id: `hist-${submission.id}-2`,
            attemptNumber: 2,
            submittedAt: "18 Okt 2026, 14:10 WIB",
            reviewedAt: "19 Okt 2026, 09:30 WIB",
            reviewerName: "Rian Maulana, S.T. (Reviewer)",
            status: "revision",
            score: 72,
            feedbackNotes:
              "Implementasi Redis Lock di redisLock.ts sudah baik. Namun koneksi dbPool.ts tidak melepaskan client kembali ke connection pool jika terjadi exception error. Tolong bungkus pemanggilan query dalam blok try...finally dengan client.release().",
            revisionChecklist: [
              "Perbaiki connection leak pada dbPool.ts dengan try ... finally { client.release() }",
              "Pastikan unit test menguji skenario failure ketika lock gagal diakuisisi",
            ],
            changedFilesCount: 4,
          },
          {
            id: `hist-${submission.id}-3`,
            attemptNumber: 3,
            submittedAt: submission.submittedAt || "Hari ini, 08:45 WIB",
            status: submission.status,
            score: submission.score || 94,
            feedbackNotes:
              "Pelepasan koneksi dbPool dengan auto-release client sudah diperbaiki, test case Vitest mencapai 88.4% coverage, dan konfigurasi Dockerfile multi-stage production siap ditinjau.",
            revisionChecklist: [
              "Perbaikan dbPool auto-release connection (Selesai)",
              "Vitest test case sharding (Selesai)",
              "Dokumentasi README.md arsitektur (Selesai)",
            ],
            changedFilesCount: 8,
          },
        ]
  );

  // AI Code Review Assistant State (Tab 3)
  const [aiChatMessages, setAiChatMessages] = useState<AiChatMessage[]>([
    {
      id: "msg-ai-init",
      sender: "ai",
      timestamp: "Baru saja",
      text: `Halo Reviewer! Saya telah melakukan analisis statis dan evaluasi arsitektur terhadap seluruh berkas tugas ${submission.studentName}. Berikut ringkasan temuan dan pertimbangan deduktif saya:`,
      reasoningSteps: [
        "1. AST Parsing & Dependency Tree: Mengecek dependensi 'ioredis', 'pg', 'react 19', dan 'vitest' pada package.json.",
        "2. Resource Leak Verification: Memastikan 'client.release()' selalu dipanggil di blok finally dbPool.ts (Memperbaiki kegagalan Attempt #2).",
        "3. Concurrency Safety Audit: Mengevaluasi atomisitas Redis SET NX PX dan token matching di Lua script redisLock.ts.",
        "4. Test Suite Coverage: Memverifikasi 12 unit test pada tests/sharding.test.ts dengan coverage 88.4%.",
        "5. Rubric Synthesis: Menghitung skor terbobot 94/100 (Grade A - Sangat Memuaskan).",
      ],
      codeSnippet: {
        language: "typescript",
        title: "src/lib/dbPool.ts - Try-Finally Auto-Release",
        code: `const client = await dbPool.connect();\ntry {\n  const res = await client.query(sqlText, params);\n  return res.rows as T[];\n} finally {\n  client.release(); // Mencegah connection leak\n}`,
      },
      suggestedRubric: {
        arch: 96,
        style: 92,
        test: 90,
        func: 96,
      },
      canApplyToReview: true,
    },
  ]);
  const [aiInputPrompt, setAiInputPrompt] = useState("");
  const [aiIsTyping, setAiIsTyping] = useState(false);

  // Weighted total score calculation
  const totalScore = Math.round(
    archScore * 0.3 + styleScore * 0.2 + testScore * 0.25 + funcScore * 0.25
  );

  // Filtered files for Code Explorer
  const filteredFiles = useMemo(() => {
    if (!fileSearch.trim()) return MOCK_SUBMISSION_FILES;
    const q = fileSearch.toLowerCase();
    return MOCK_SUBMISSION_FILES.filter(
      (f) => f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q)
    );
  }, [fileSearch]);

  // Handler: Unduh Berkas ZIP Submission
  const handleDownloadZip = () => {
    const filename = `submission-${submission.submissionCode.toLowerCase()}-${submission.studentName.toLowerCase().replace(/\s+/g, "-")}.zip`;
    const blob = new Blob(
      [
        `=== ANVIEO LMS SUBMISSION ARCHIVE ===\n` +
          `Submission Code: ${submission.submissionCode}\n` +
          `Student: ${submission.studentName} (${submission.studentNim})\n` +
          `Track: ${submission.trackName}\n` +
          `Module: ${submission.moduleTitle}\n` +
          `Submitted: ${submission.submittedAt}\n\n` +
          `File Manifest:\n` +
          MOCK_SUBMISSION_FILES.map((f) => `- ${f.path} (${f.size})`).join("\n") +
          `\n\n=== SOURCE CODE EXPORTS ===\n\n` +
          MOCK_SUBMISSION_FILES.map(
            (f) => `--- FILE: ${f.path} ---\n${f.content}\n\n`
          ).join("\n"),
      ],
      { type: "application/zip" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`File zip "${filename}" (14.8 MB) berhasil diunduh ke komputer Anda!`);
  };

  // Handler: Salin Kode
  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Handler: Unduh File Tunggal
  const handleDownloadSingleFile = (file: SubmittedFileItem) => {
    const blob = new Blob([file.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handler: Tambah Item Checklist Revisi
  const handleAddChecklist = () => {
    if (!newChecklistText.trim()) return;
    setRevisionChecklist([...revisionChecklist, newChecklistText.trim()]);
    setNewChecklistText("");
  };

  const handleRemoveChecklist = (idx: number) => {
    setRevisionChecklist(revisionChecklist.filter((_, i) => i !== idx));
  };

  // Handler: AI Chat Submission
  const handleSendAiMessage = (promptText?: string) => {
    const query = (promptText || aiInputPrompt).trim();
    if (!query) return;

    const userMsg: AiChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      timestamp: "Baru saja",
      text: query,
    };

    setAiChatMessages((prev) => [...prev, userMsg]);
    setAiInputPrompt("");
    setAiIsTyping(true);

    setTimeout(() => {
      setAiIsTyping(false);
      let aiResponseText = "";
      let reasoning: string[] = [];
      let codeSnip: { language: string; title: string; code: string } | undefined;

      if (query.toLowerCase().includes("leak") || query.toLowerCase().includes("connection")) {
        reasoning = [
          "1. Menelusuri seluruh penggunaan pg.Pool di folder src/lib/dbPool.ts.",
          "2. Memeriksa blok try...finally: 'client.release()' dijamin berjalan pada baris 26.",
          "3. Membandingkan dengan riwayat Attempt #2 di mana client.release() terlewatkan saat query melempar timeout.",
          "4. Kesimpulan: Bebas dari risiko connection leak.",
        ];
        aiResponseText =
          "Berdasarkan analisis static AST pada `src/lib/dbPool.ts`, implementasi saat ini SUDAH 100% AMAN dari connection leak. Client PostgreSQL selalu dilepas kembali ke connection pool di dalam blok `finally`. Ini menuntaskan catatan kegagalan pada Attempt #2.";
        codeSnip = {
          language: "typescript",
          title: "Audit Connection Release - dbPool.ts",
          code: `// Verified: Aman dari pool starvation\nexport async function executeQuery<T>(sqlText: string, params: any[] = []): Promise<T[]> {\n  const client = await dbPool.connect();\n  try {\n    return (await client.query(sqlText, params)).rows as T[];\n  } finally {\n    client.release(); // Selalu dieksekusi baik sukses maupun throw\n  }\n}`,
        };
      } else if (query.toLowerCase().includes("lock") || query.toLowerCase().includes("race")) {
        reasoning = [
          "1. Menguji atomic primitive SET NX PX di redisLock.ts.",
          "2. Evaluasi Lua script release: Menggunakan token comparison untuk menghindari split-brain lock release.",
          "3. Simulasi konkurensi: Menjamin hanya satu worker yang dapat mengeksekusi critical section.",
        ];
        aiResponseText =
          "Implementasi Distributed Lock pada `redisLock.ts` sudah sesuai standar Redlock RFC. Token acak yang unik memastikan bahwa proses worker yang mengalami timeout tidak akan me-release lock milik worker lain. Sangat aman dari race condition.";
      } else if (query.toLowerCase().includes("test") || query.toLowerCase().includes("vitest")) {
        reasoning = [
          "1. Memeriksa file tests/sharding.test.ts.",
          "2. Memverifikasi mock Redis client menggunakan Vitest vi.fn().",
          "3. Menemukan skenario edge case: lock failure sudah teruji dengan baik.",
        ];
        aiResponseText =
          "Unit test pada `tests/sharding.test.ts` sudah mencakup pengujian akuisisi lock dan penanganan kegagalan jika resource sedang sibuk. Saran peningkatan minor: Tambahkan 1 skenario pengujian jika koneksi Redis terputus mendadak (Network Partition Error).";
      } else {
        reasoning = [
          "1. Menganalisis konteks pertanyaan reviewer terhadap codebase submission.",
          "2. Mengevaluasi keselarasan dengan silabus kurikulum dan rubrik kelulusan.",
          "3. Menyusun rekomendasi teknis dan draf masukan.",
        ];
        aiResponseText =
          `Berikut hasil analisis mendalam mengenai "${query}": Kode tugas akhir ${submission.studentName} memiliki arsitektur yang solid, modular, dan siap digunakan di skala produksi. Seluruh catatan revisi dari Attempt sebelumnya telah diselesaikan secara tuntas.`;
      }

      const aiMsg: AiChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: "ai",
        timestamp: "Baru saja",
        text: aiResponseText,
        reasoningSteps: reasoning,
        codeSnippet: codeSnip,
      };

      setAiChatMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  // Handler: Terapkan Rekomendasi AI ke Form Penilaian (Tab 1)
  const handleApplyAiFeedback = (rubric?: { arch: number; style: number; test: number; func: number }) => {
    if (rubric) {
      setArchScore(rubric.arch);
      setStyleScore(rubric.style);
      setTestScore(rubric.test);
      setFuncScore(rubric.func);
    } else {
      setArchScore(96);
      setStyleScore(92);
      setTestScore(90);
      setFuncScore(96);
    }
    setFeedback(
      `Hasil evaluasi komprehensif tugas ${submission.studentName}:\n` +
        `- Clean Architecture & Database Pool: Sangat baik. Penggunaan try...finally pada dbPool.ts menuntaskan masalah connection leak Attempt #2.\n` +
        `- Concurrency Safety: Atomic Redlock dengan Lua script token release di redisLock.ts sudah sesuai standar industri.\n` +
        `- Unit Testing: Vitest mencapai 88.4% coverage dan lulus semua skenario pengujian.\n\n` +
        `Keputusan: Lulus & Direkomendasikan untuk portofolio siap kerja!`
    );
    setActiveTab("penilaian");
    alert("Nilai rubrik dan catatan umpan balik AI berhasil diterapkan ke Form Penilaian (Tab 1)!");
  };

  // Handler: Simpan Keputusan Reviewer
  const handleFinalSubmitReview = () => {
    if (decisionStatus === "approved" && totalScore < 75) {
      if (
        !confirm(
          `Skor saat ini (${totalScore}/100) di bawah passing grade 75. Apakah Anda yakin ingin tetap meloloskan submission ini?`
        )
      ) {
        return;
      }
    }

    if ((decisionStatus === "revision" || decisionStatus === "rejected") && !feedback.trim()) {
      alert("Wajib menuliskan catatan saran dan masukan untuk mahasiswa sebelum menyimpan!");
      return;
    }

    // New Attempt History Item
    const newAttemptNumber = historyList.length + 1;
    const newHistoryItem: ReviewSubmissionHistoryItem = {
      id: `hist-${submission.id}-${newAttemptNumber}`,
      attemptNumber: newAttemptNumber,
      submittedAt: "Hari ini, Baru saja",
      reviewedAt: "Hari ini, Baru saja",
      reviewerName: "Rian Maulana, S.T. (Reviewer)",
      status: decisionStatus,
      score: totalScore,
      feedbackNotes: feedback,
      revisionChecklist: decisionStatus !== "approved" ? revisionChecklist : undefined,
      changedFilesCount: MOCK_SUBMISSION_FILES.length,
    };

    const updatedHistory = [...historyList, newHistoryItem];
    setHistoryList(updatedHistory);

    const updatedSubmission: ReviewSubmission = {
      ...submission,
      status: decisionStatus,
      score: totalScore,
      notes: feedback,
      rubricScores: {
        cleanArchitecture: archScore,
        codeStyle: styleScore,
        testCoverage: testScore,
        functionality: funcScore,
      },
      history: updatedHistory,
    };

    onSaveReview(updatedSubmission);

    const statusLabel =
      decisionStatus === "approved"
        ? "LULUS (APPROVED)"
        : decisionStatus === "revision"
        ? "PERLU REVISI (REVISION)"
        : "DITOLAK (REJECTED)";

    alert(
      `Keputusan reviewer berhasil disimpan!\nStatus: ${statusLabel}\nSkor Akhir: ${totalScore}/100\nRiwayat Attempt #${newAttemptNumber} telah direkam ke log submission.`
    );
    onClose();
  };

  return (
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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="review-studio-slider-95"
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
        {/* ============================================================== */}
        {/* COMPACT TOP BAR: METADATA, 2 OPTIONS & CLOSE                  */}
        {/* ============================================================== */}
        <div
          style={{
            padding: "8px 20px",
            borderBottom: "1px solid var(--bx-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--bx-bg-alt)",
            flexShrink: 0,
            minHeight: "52px",
            gap: "12px",
            boxSizing: "border-box",
          }}
        >
          {/* Left Column: Student Meta & Submission Details */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                padding: "2px 8px",
                borderRadius: "3px",
                background: "var(--brand, #0A2E52)",
                color: "#ffffff",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Review Studio (95%)
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
              <img
                src={submission.studentAvatar || "/alumni/alumni_1.jpg"}
                alt={submission.studentName}
                style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--brand)", flexShrink: 0 }}
              />
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <strong style={{ color: "var(--brand)", fontSize: "0.92rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {submission.studentName}
                  </strong>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                    ({submission.studentNim})
                  </span>
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {submission.trackName} • {submission.moduleTitle}
                </div>
              </div>
            </div>

            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: "10px",
                background:
                  submission.status === "approved"
                    ? "#D1FAE5"
                    : submission.status === "revision"
                    ? "#FEF3C7"
                    : submission.status === "rejected"
                    ? "#FEE2E2"
                    : "rgba(10,46,82,0.08)",
                color:
                  submission.status === "approved"
                    ? "#065F46"
                    : submission.status === "revision"
                    ? "#B45309"
                    : submission.status === "rejected"
                    ? "#991B1B"
                    : "var(--brand)",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Status: {submission.status}
            </span>
          </div>

          {/* Right Column: Actions (Download ZIP + GitHub + Tutup) */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleDownloadZip}
              title="Unduh seluruh file tugas siswa dalam format ZIP (14.8 MB)"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "5px",
                border: "1px solid var(--bx-border)",
                background: "var(--bx-surface)",
                color: "var(--brand)",
                fontSize: "0.76rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(10, 46, 82, 0.05)",
              }}
            >
              <FlatIcon type="download" size={13} color="var(--brand)" />
              <span>Unduh ZIP (14.8 MB)</span>
            </button>

            {submission.repoUrl && (
              <a
                href={submission.repoUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 10px",
                  borderRadius: "5px",
                  border: "1px solid var(--bx-border)",
                  background: "var(--bx-surface)",
                  color: "var(--ink)",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <span>GitHub</span>
                <span>↗</span>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              title="Tutup Panel Reviewer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
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

        {/* ============================================================== */}
        {/* SLIDER TABS NAVIGATION: 4 DEDICATED WORKSPACES                 */}
        {/* ============================================================== */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--bx-border)",
            background: "var(--bx-surface)",
            flexShrink: 0,
            padding: "0 20px",
            gap: "4px",
            overflowX: "auto",
          }}
        >
          {[
            { id: "penilaian", label: "1. Form Penilaian & Keputusan", count: undefined },
            { id: "code_explorer", label: "2. Berkas & Code Explorer IDE", count: `${MOCK_SUBMISSION_FILES.length} File` },
            { id: "ai_assistant", label: "3. AI Co-Reviewer & Debugger", count: "Chat Reasoning" },
            { id: "riwayat", label: "4. Riwayat Submission & Remedial", count: `${historyList.length} Attempt` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ReviewTab)}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderBottom: isActive ? "3px solid var(--gold, #C9962E)" : "3px solid transparent",
                  background: "transparent",
                  color: isActive ? "var(--brand, #0A2E52)" : "var(--muted)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      background: isActive ? "rgba(201,150,46,0.15)" : "var(--bx-bg-alt)",
                      color: isActive ? "var(--gold-2)" : "var(--muted)",
                      fontWeight: 700,
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* SLIDER BODY: DEDICATED VIEWS PER TAB                           */}
        {/* ============================================================== */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* ============================================================== */}
          {/* TAB 1: FORM PENILAIAN, RUBRIK & KEPUTUSAN REVIEWER            */}
          {/* ============================================================== */}
          {activeTab === "penilaian" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px", fontSize: "0.82rem" }}>
                {/* Quick Navigation Context Banner */}
                <div
                  style={{
                    padding: "14px 18px",
                    background: "var(--bx-bg-alt)",
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
                    <h3 style={{ margin: "0 0 4px", fontSize: "1.02rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                      Lembar Penilaian &amp; Keputusan Akhir Submission
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)" }}>
                      Periksa rubrik kompetensi, tentukan status kelulusan, dan berikan masukan perbaikan yang konstruktif bagi mahasiswa.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab("code_explorer")}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "5px",
                        border: "1px solid var(--brand)",
                        background: "var(--bx-surface)",
                        color: "var(--brand)",
                        fontWeight: 700,
                        fontSize: "0.74rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <FlatIcon type="code" size={12} color="var(--brand)" />
                      <span>Buka Code Explorer IDE (Tab 2)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("ai_assistant")}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "5px",
                        border: "1px solid var(--gold)",
                        background: "rgba(201, 150, 46, 0.12)",
                        color: "var(--brand)",
                        fontWeight: 700,
                        fontSize: "0.74rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span>🤖 Buka AI Co-Reviewer (Tab 3)</span>
                    </button>
                  </div>
                </div>

                {/* 2-Column Main Grading Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: "20px" }}>
                  {/* Left Column: Keputusan & Rubrik & Feedback */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* 1. Status Keputusan Reviewer */}
                    <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", borderBottom: "1px solid var(--bx-border)", paddingBottom: "8px" }}>
                        <FlatIcon type="target" size={15} color="var(--brand)" />
                        <strong style={{ color: "var(--brand)", fontSize: "0.86rem" }}>
                          1. Keputusan Status Submission <span style={{ color: "#DC2626" }}>*</span>
                        </strong>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                        {[
                          {
                            id: "approved",
                            label: "Luluskan (Approved)",
                            desc: "Memenuhi seluruh capaian kompetensi minimal 75%",
                            color: "#065F46",
                            bg: "#D1FAE5",
                            border: "#10B981",
                          },
                          {
                            id: "revision",
                            label: "Minta Revisi",
                            desc: "Perlu perbaikan kode spesifik sebelum dinilai ulang",
                            color: "#B45309",
                            bg: "#FEF3C7",
                            border: "#F59E0B",
                          },
                          {
                            id: "rejected",
                            label: "Tolak (Rejected)",
                            desc: "Tidak memenuhi standar minimum / perlu mengulang modul",
                            color: "#991B1B",
                            bg: "#FEE2E2",
                            border: "#EF4444",
                          },
                        ].map((item) => {
                          const isSelected = decisionStatus === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => setDecisionStatus(item.id as any)}
                              style={{
                                padding: "12px 14px",
                                borderRadius: "8px",
                                border: isSelected ? `2px solid ${item.border}` : "1px solid var(--bx-border)",
                                background: isSelected ? item.bg : "var(--bx-bg-alt)",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <strong style={{ color: item.color, fontSize: "0.8rem" }}>{item.label}</strong>
                                <span
                                  style={{
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "50%",
                                    border: isSelected ? `5px solid ${item.color}` : "2px solid var(--muted)",
                                    background: "#ffffff",
                                  }}
                                />
                              </div>
                              <p style={{ margin: 0, fontSize: "0.72rem", color: isSelected ? item.color : "var(--muted)", lineHeight: 1.3 }}>
                                {item.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* If Revision or Rejected: Mandatory Improvement Checklist */}
                      {(decisionStatus === "revision" || decisionStatus === "rejected") && (
                        <div
                          style={{
                            marginTop: "14px",
                            padding: "14px",
                            borderRadius: "6px",
                            background: decisionStatus === "revision" ? "rgba(245, 158, 11, 0.08)" : "rgba(239, 68, 68, 0.08)",
                            border: decisionStatus === "revision" ? "1px solid #F59E0B" : "1px solid #EF4444",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ color: decisionStatus === "revision" ? "#B45309" : "#991B1B", fontSize: "0.82rem" }}>
                              {decisionStatus === "revision" ? "Daftar Poin yang Wajib Direvisi Mahasiswa:" : "Penyebab Penolakan & Alasan Mengulang Modul:"}
                            </strong>
                            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                              Batas Waktu Resubmit: <strong>{revisionDeadlineDays} Hari Kalender</strong>
                            </span>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {revisionChecklist.map((item, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "6px 10px",
                                  borderRadius: "4px",
                                  background: "var(--bx-surface)",
                                  border: "1px solid var(--bx-border)",
                                  fontSize: "0.76rem",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ color: "#DC2626", fontWeight: 700 }}>✕</span>
                                  <span>{item}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveChecklist(idx)}
                                  style={{ border: "none", background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: "0.75rem" }}
                                >
                                  Hapus
                                </button>
                              </div>
                            ))}
                          </div>

                          <div style={{ display: "flex", gap: "8px" }}>
                            <input
                              type="text"
                              value={newChecklistText}
                              onChange={(e) => setNewChecklistText(e.target.value)}
                              placeholder="Tambah poin instruksi perbaikan baru..."
                              style={{ flex: 1, padding: "6px 10px", borderRadius: "4px", border: "1px solid var(--bx-border)", fontSize: "0.76rem" }}
                            />
                            <button
                              type="button"
                              onClick={handleAddChecklist}
                              style={{ padding: "6px 12px", borderRadius: "4px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, fontSize: "0.74rem", cursor: "pointer" }}
                            >
                              Tambah Poin
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. Rubrik Penilaian Standar Industri */}
                    <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid var(--bx-border)", paddingBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FlatIcon type="chart" size={15} color="var(--brand)" />
                          <strong style={{ color: "var(--brand)", fontSize: "0.86rem" }}>
                            2. Rubrik Evaluasi Teknis Berbobot
                          </strong>
                        </div>
                        <span style={{ fontSize: "0.74rem", fontWeight: 800, color: totalScore >= 75 ? "#065F46" : "#991B1B" }}>
                          Skor Total: {totalScore} / 100 ({totalScore >= 75 ? "LULUS" : "BELUM LULUS"})
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {/* Rubrik 1 */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "3px" }}>
                            <span style={{ fontWeight: 600 }}>Clean Architecture &amp; Pemisahan Layer (30%)</span>
                            <strong style={{ color: "var(--brand)" }}>{archScore}/100</strong>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={archScore}
                            onChange={(e) => setArchScore(Number(e.target.value))}
                            style={{ width: "100%", accentColor: "var(--gold)" }}
                          />
                        </div>

                        {/* Rubrik 2 */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "3px" }}>
                            <span style={{ fontWeight: 600 }}>Kerapian Kode, Naming &amp; Linter (20%)</span>
                            <strong style={{ color: "var(--brand)" }}>{styleScore}/100</strong>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={styleScore}
                            onChange={(e) => setStyleScore(Number(e.target.value))}
                            style={{ width: "100%", accentColor: "var(--gold)" }}
                          />
                        </div>

                        {/* Rubrik 3 */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "3px" }}>
                            <span style={{ fontWeight: 600 }}>Unit Testing &amp; Exception Handling (25%)</span>
                            <strong style={{ color: "var(--brand)" }}>{testScore}/100</strong>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={testScore}
                            onChange={(e) => setTestScore(Number(e.target.value))}
                            style={{ width: "100%", accentColor: "var(--gold)" }}
                          />
                        </div>

                        {/* Rubrik 4 */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "3px" }}>
                            <span style={{ fontWeight: 600 }}>Fungsionalitas Spesifikasi &amp; Performa (25%)</span>
                            <strong style={{ color: "var(--brand)" }}>{funcScore}/100</strong>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={funcScore}
                            onChange={(e) => setFuncScore(Number(e.target.value))}
                            style={{ width: "100%", accentColor: "var(--gold)" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Catatan Evaluasi & Umpan Balik */}
                    <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <label style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--brand)" }}>
                          3. Catatan Evaluasi &amp; Umpan Balik (Tampil pada Mahasiswa):
                        </label>
                        <button
                          type="button"
                          onClick={() => handleApplyAiFeedback()}
                          style={{
                            padding: "3px 8px",
                            borderRadius: "4px",
                            border: "1px solid var(--gold)",
                            background: "rgba(201,150,46,0.1)",
                            color: "var(--brand)",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Muat Draf AI
                        </button>
                      </div>

                      <textarea
                        rows={5}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Tuliskan ulasan detail mengenai kualitas arsitektur kode, bug yang ditemukan, dan instruksi perbaikan..."
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "6px",
                          border: "1px solid var(--bx-border)",
                          background: "var(--bx-surface)",
                          color: "var(--ink)",
                          fontSize: "0.8rem",
                          lineHeight: 1.5,
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Column: Context Cards, AI Recommendation & History Snippet */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Card 1: Berkas Proyek & Opsi Pemeriksaan */}
                    <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <strong style={{ color: "var(--brand)", fontSize: "0.84rem" }}>
                          Berkas Tugas Mahasiswa
                        </strong>
                        <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                          {MOCK_SUBMISSION_FILES.length} File • 14.8 MB
                        </span>
                      </div>

                      <p style={{ margin: "0 0 12px", fontSize: "0.74rem", color: "var(--muted)", lineHeight: 1.4 }}>
                        Tugas ini diserahkan dalam bentuk arsip ZIP dan repository Git. Anda dapat mengunduh arsip secara langsung atau memeriksanya di Code Explorer IDE bawaan.
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => setActiveTab("code_explorer")}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "none",
                            background: "var(--brand, #0A2E52)",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          <FlatIcon type="code" size={13} color="#ffffff" />
                          <span>Buka Code Explorer IDE (Tab 2)</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadZip}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--bx-border)",
                            background: "var(--bx-bg-alt)",
                            color: "var(--brand)",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          <FlatIcon type="download" size={13} color="var(--brand)" />
                          <span>Unduh Arsip .ZIP (14.8 MB)</span>
                        </button>
                      </div>
                    </div>

                    {/* Card 2: AI Co-Reviewer Preview */}
                    <div
                      style={{
                        background: "linear-gradient(135deg, rgba(10, 46, 82, 0.04) 0%, rgba(201, 150, 46, 0.08) 100%)",
                        border: "1.5px solid var(--gold)",
                        borderRadius: "8px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "1.1rem" }}>🤖</span>
                          <div>
                            <strong style={{ color: "var(--brand)", fontSize: "0.84rem" }}>
                              AI Co-Reviewer Assistant
                            </strong>
                            <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
                              Evaluasi reasoning &amp; deteksi kebocoran memori
                            </div>
                          </div>
                        </div>

                        <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#065F46" }}>
                          Skor AI: 94/100 (A)
                        </span>
                      </div>

                      <p style={{ margin: 0, fontSize: "0.74rem", color: "var(--ink)", lineHeight: 1.35 }}>
                        AI telah memverifikasi bahwa masalah <em>connection leak</em> pada Attempt #2 telah diperbaiki di <code>dbPool.ts</code> menggunakan try-finally block.
                      </p>

                      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                        <button
                          type="button"
                          onClick={() => setActiveTab("ai_assistant")}
                          style={{
                            flex: 1,
                            padding: "6px 10px",
                            borderRadius: "5px",
                            border: "none",
                            background: "var(--brand)",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.74rem",
                            cursor: "pointer",
                          }}
                        >
                          Buka AI Chat &amp; Reasoning
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplyAiFeedback()}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "5px",
                            border: "1px solid var(--gold)",
                            background: "var(--bx-surface)",
                            color: "var(--brand)",
                            fontWeight: 700,
                            fontSize: "0.74rem",
                            cursor: "pointer",
                          }}
                        >
                          Terapkan Nilai
                        </button>
                      </div>
                    </div>

                    {/* Card 3: Ringkasan Riwayat Pengajuan (Audit Trail Snippet) */}
                    <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <strong style={{ color: "var(--brand)", fontSize: "0.84rem" }}>
                          Riwayat Attempt &amp; Remedial
                        </strong>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold-2)" }}>
                          Percobaan #{historyList.length}
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {historyList.map((h) => {
                          const isSuccess = h.status === "approved";
                          const isRevision = h.status === "revision";
                          return (
                            <div
                              key={h.id}
                              style={{
                                padding: "8px 10px",
                                borderRadius: "6px",
                                background: isSuccess ? "#D1FAE5" : isRevision ? "#FEF3C7" : "#FEE2E2",
                                border: isSuccess ? "1px solid #10B981" : isRevision ? "1px solid #F59E0B" : "1px solid #EF4444",
                                fontSize: "0.72rem",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <strong style={{ color: isSuccess ? "#065F46" : isRevision ? "#B45309" : "#991B1B" }}>
                                  Attempt #{h.attemptNumber} ({h.status.toUpperCase()})
                                </strong>
                                <div style={{ color: "var(--muted)", fontSize: "0.68rem" }}>{h.submittedAt}</div>
                              </div>
                              <span style={{ fontWeight: 800, color: isSuccess ? "#065F46" : isRevision ? "#B45309" : "#991B1B" }}>
                                {h.score !== undefined ? `${h.score}/100` : "-"}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab("riwayat")}
                        style={{
                          width: "100%",
                          marginTop: "10px",
                          padding: "6px",
                          borderRadius: "4px",
                          border: "1px solid var(--bx-border)",
                          background: "var(--bx-bg-alt)",
                          color: "var(--brand)",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Lihat Timeline &amp; Catatan Lengkap (Tab 4) ➔
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: BERKAS & CODE EXPLORER IN-APP IDE                        */}
          {/* ============================================================== */}
          {activeTab === "code_explorer" && (
            <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
              {/* Left Pane: File Tree Explorer (260px) */}
              <div
                style={{
                  width: "260px",
                  minWidth: "240px",
                  borderRight: "1px solid var(--bx-border)",
                  background: "var(--bx-bg-alt)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Explorer Header */}
                <div
                  style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid var(--bx-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--bx-surface)",
                  }}
                >
                  <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    File Tree Explorer
                  </span>
                  <span style={{ fontSize: "0.68rem", color: "var(--muted)", fontWeight: 600 }}>
                    {MOCK_SUBMISSION_FILES.length} Files
                  </span>
                </div>

                {/* Search File */}
                <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--bx-border)", background: "var(--bx-surface)" }}>
                  <input
                    type="text"
                    value={fileSearch}
                    onChange={(e) => setFileSearch(e.target.value)}
                    placeholder="Cari file..."
                    style={{
                      width: "100%",
                      padding: "5px 8px",
                      fontSize: "0.74rem",
                      borderRadius: "4px",
                      border: "1px solid var(--bx-border)",
                      background: "var(--bx-bg-alt)",
                      color: "var(--ink)",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Tree List */}
                <div style={{ flex: 1, overflowY: "auto", padding: "6px" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", padding: "4px 8px", fontWeight: 700 }}>
                    📁 {submission.submissionCode.toLowerCase()}-repo/
                  </div>

                  {filteredFiles.map((f) => {
                    const isSelected = activeFile.id === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setActiveFile(f)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 10px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          marginBottom: "2px",
                          background: isSelected ? "var(--brand, #0A2E52)" : "transparent",
                          color: isSelected ? "#ffffff" : "var(--ink)",
                          fontSize: "0.76rem",
                          fontWeight: isSelected ? 700 : 500,
                          transition: "all 0.12s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <span>{f.name.endsWith(".ts") || f.name.endsWith(".tsx") ? "📄" : f.name.endsWith(".json") ? "📦" : f.name.endsWith(".md") ? "📝" : "🐳"}</span>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
                        </div>

                        <span style={{ fontSize: "0.66rem", opacity: isSelected ? 0.9 : 0.6, whiteSpace: "nowrap" }}>
                          {f.size}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Explorer */}
                <div style={{ padding: "10px 12px", borderTop: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontSize: "0.7rem", color: "var(--muted)" }}>
                  <div>Modul: <strong>{submission.moduleTitle}</strong></div>
                  <div>Tersimpan: <strong>ZIP &amp; Cloud IDE</strong></div>
                </div>
              </div>

              {/* Right Pane: Full-Width Monaco-Style Code Viewer */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  background: "#0D1117",
                  color: "#E6EDF3",
                  overflow: "hidden",
                }}
              >
                {/* Code Viewer Top Bar */}
                <div
                  style={{
                    height: "42px",
                    background: "#161B22",
                    borderBottom: "1px solid #30363D",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 16px",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#58A6FF" }}>
                      {activeFile.path}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "#8B949E", padding: "2px 6px", borderRadius: "3px", background: "#21262D" }}>
                      {activeFile.language.toUpperCase()} • {activeFile.size}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        handleSendAiMessage(`Tolong periksa dan debug file ${activeFile.path} ini apakah ada potensi bug, memory leak, atau performa yang kurang optimal.`);
                        setActiveTab("ai_assistant");
                      }}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid #388BFD",
                        background: "rgba(56, 139, 253, 0.15)",
                        color: "#58A6FF",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Minta AI Debug File Ini 🤖
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadSingleFile(activeFile)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid #30363D",
                        background: "#21262D",
                        color: "#C9D1D9",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Unduh Berkas Ini
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid #30363D",
                        background: "#21262D",
                        color: copiedCode ? "#3FB950" : "#C9D1D9",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {copiedCode ? "Tersalin!" : "Salin Kode"}
                    </button>
                  </div>
                </div>

                {/* Code Content with Line Numbers */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    fontSize: "0.84rem",
                    lineHeight: 1.6,
                    padding: "16px 20px",
                    display: "flex",
                  }}
                >
                  <pre style={{ margin: 0, width: "100%", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {activeFile.content.split("\n").map((line, i) => (
                      <div key={i} style={{ display: "flex" }}>
                        <span
                          style={{
                            width: "42px",
                            textAlign: "right",
                            paddingRight: "16px",
                            userSelect: "none",
                            color: "#484F58",
                            fontSize: "0.76rem",
                          }}
                        >
                          {i + 1}
                        </span>
                        <span style={{ flex: 1, color: line.trim().startsWith("//") || line.trim().startsWith("/*") || line.trim().startsWith("*") ? "#8B949E" : line.includes("import") || line.includes("export") || line.includes("return") ? "#FF7B72" : line.includes("const ") || line.includes("async ") || line.includes("function") ? "#79C0FF" : "#E6EDF3" }}>
                          {line || " "}
                        </span>
                      </div>
                    ))}
                  </pre>
                </div>

                {/* Bottom Status Bar */}
                <div
                  style={{
                    height: "26px",
                    background: "#161B22",
                    borderTop: "1px solid #30363D",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 16px",
                    fontSize: "0.68rem",
                    color: "#8B949E",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span>UTF-8</span>
                    <span>TypeScript 5.5</span>
                    <span>Next.js 16.4 Turbopack</span>
                    <span>Vitest 1.6</span>
                  </div>
                  <div>Baris: {activeFile.content.split("\n").length} baris</div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: AI CO-REVIEWER & CODE DEBUGGER WITH REASONING CHAT      */}
          {/* ============================================================== */}
          {activeTab === "ai_assistant" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bx-bg)" }}>
              {/* Header & Quick Action Prompt Chips */}
              <div
                style={{
                  padding: "12px 20px",
                  background: "var(--bx-surface)",
                  borderBottom: "1px solid var(--bx-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "1.2rem" }}>🤖</span>
                    <div>
                      <strong style={{ color: "var(--brand)", fontSize: "0.9rem" }}>
                        AI Co-Reviewer &amp; Debugger (Reasoning Engine)
                      </strong>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                        Menganalisis kode, melacak kebocoran memori, membedah test failure &amp; menyusun rekomendasi rubrik.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyAiFeedback()}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "5px",
                      border: "none",
                      background: "var(--brand)",
                      color: "#ffffff",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span>Terapkan Rekomendasi ke Form Penilaian (Tab 1)</span>
                  </button>
                </div>

                {/* Prompt Chips */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    "🔍 Cek Connection Leak di dbPool",
                    "🛡️ Audit Distributed Lock & Race Condition",
                    "🧪 Debug Test Case tests/sharding.test.ts",
                    "💡 Buat Rekomendasi Refactoring Clean Code",
                    "📝 Rangkum Masukan Ramah Mahasiswa",
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendAiMessage(chip)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "14px",
                        border: "1px solid var(--bx-border)",
                        background: "var(--bx-bg-alt)",
                        color: "var(--brand)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.12s ease",
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {aiChatMessages.map((msg) => {
                  const isAi = msg.sender === "ai";
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isAi ? "flex-start" : "flex-end",
                        maxWidth: isAi ? "880px" : "650px",
                        alignSelf: isAi ? "flex-start" : "flex-end",
                        gap: "6px",
                      }}
                    >
                      <div style={{ fontSize: "0.7rem", color: "var(--muted)", display: "flex", gap: "6px" }}>
                        <span>{isAi ? "🤖 AI Co-Reviewer" : "👤 Reviewer (Anda)"}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        style={{
                          padding: "14px 16px",
                          borderRadius: isAi ? "8px 8px 8px 0" : "8px 8px 0 8px",
                          background: isAi ? "var(--bx-surface)" : "var(--brand)",
                          color: isAi ? "var(--ink)" : "#ffffff",
                          border: isAi ? "1px solid var(--bx-border)" : "none",
                          boxShadow: "0 1px 3px rgba(10, 46, 82, 0.05)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontSize: "0.8rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {/* Expandable Reasoning Steps (Chain-of-Thought) */}
                        {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                          <div
                            style={{
                              padding: "10px 12px",
                              borderRadius: "6px",
                              background: "rgba(10, 46, 82, 0.04)",
                              border: "1px solid rgba(10, 46, 82, 0.12)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--brand)", fontWeight: 700, fontSize: "0.74rem" }}>
                              <span>🧠 Proses Penalaran Deduktif AI (Chain-of-Thought Reasoning):</span>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.45 }}>
                              {msg.reasoningSteps.map((step, sIdx) => (
                                <li key={sIdx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Main Message Text */}
                        <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>

                        {/* Optional Code Snippet Fix */}
                        {msg.codeSnippet && (
                          <div style={{ marginTop: "4px", borderRadius: "6px", overflow: "hidden", border: "1px solid #30363D", background: "#0D1117" }}>
                            <div style={{ padding: "4px 10px", background: "#161B22", fontSize: "0.68rem", color: "#58A6FF", borderBottom: "1px solid #30363D", fontWeight: 700 }}>
                              {msg.codeSnippet.title}
                            </div>
                            <pre style={{ margin: 0, padding: "10px 12px", fontSize: "0.76rem", color: "#E6EDF3", overflowX: "auto", fontFamily: "monospace" }}>
                              {msg.codeSnippet.code}
                            </pre>
                          </div>
                        )}

                        {/* Apply Button */}
                        {msg.canApplyToReview && (
                          <button
                            type="button"
                            onClick={() => handleApplyAiFeedback(msg.suggestedRubric)}
                            style={{
                              alignSelf: "flex-start",
                              padding: "5px 12px",
                              borderRadius: "4px",
                              border: "1px solid var(--gold)",
                              background: "rgba(201,150,46,0.12)",
                              color: "var(--brand)",
                              fontWeight: 700,
                              fontSize: "0.72rem",
                              cursor: "pointer",
                            }}
                          >
                            Terapkan Rekomendasi Ini ke Form Penilaian (Tab 1)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {aiIsTyping && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--muted)", fontSize: "0.76rem" }}>
                    <span>🤖 AI sedang menganalisis AST dan menjalankan reasoning...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div
                style={{
                  padding: "12px 20px",
                  background: "var(--bx-surface)",
                  borderTop: "1px solid var(--bx-border)",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={aiInputPrompt}
                  onChange={(e) => setAiInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendAiMessage();
                  }}
                  placeholder="Ketik instruksi analisis, debugging, atau pertanyaan teknis untuk AI..."
                  style={{
                    flex: 1,
                    padding: "9px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-bg-alt)",
                    color: "var(--ink)",
                    fontSize: "0.8rem",
                    outline: "none",
                  }}
                />

                <button
                  type="button"
                  onClick={() => handleSendAiMessage()}
                  style={{
                    padding: "9px 18px",
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
                  <FlatIcon type="check" size={13} color="#ffffff" />
                  <span>Kirim ke AI</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: RIWAYAT SUBMISSION & LOG REMEDIAL (AUDIT TRAIL)          */}
          {/* ============================================================== */}
          {activeTab === "riwayat" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              <div style={{ maxWidth: "1050px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "18px", fontSize: "0.82rem" }}>
                {/* Header Banner */}
                <div
                  style={{
                    padding: "14px 18px",
                    background: "var(--bx-bg-alt)",
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
                    <h3 style={{ margin: "0 0 4px", fontSize: "1.02rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                      Riwayat Pengajuan &amp; Historical Remedial Mahasiswa
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)" }}>
                      Merekam kronologi lengkap pengajuan: kapan ditolak/gagal, apa catatan dan masukan reviewer pada setiap attempt, hingga perbaikan berhasil.
                    </p>
                  </div>

                  <span style={{ fontSize: "0.74rem", padding: "4px 10px", borderRadius: "12px", background: "rgba(10,46,82,0.08)", color: "var(--brand)", fontWeight: 700 }}>
                    Total: {historyList.length} Percobaan
                  </span>
                </div>

                {/* Policy Alert Banner */}
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "6px",
                    background: "rgba(201, 150, 46, 0.08)",
                    border: "1px solid var(--gold)",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <FlatIcon type="shield" size={18} color="var(--gold-2)" />
                  <div style={{ fontSize: "0.76rem", color: "var(--ink)", lineHeight: 1.4 }}>
                    <strong>Regulasi Akreditasi Remedial OBE:</strong> Mahasiswa berhak melakukan revisi dan penyerahan ulang submission maksimal 3 kali. Jika pada Attempt ke-3 tetap dinyatakan <em>Rejected</em>, mahasiswa wajib mengulang materi bab modul.
                  </div>
                </div>

                {/* Timeline Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", position: "relative" }}>
                  {historyList.map((item, idx) => {
                    const isSuccess = item.status === "approved";
                    const isRevision = item.status === "revision";
                    const isRejected = item.status === "rejected";

                    const badgeColor = isSuccess ? "#065F46" : isRevision ? "#B45309" : "#991B1B";
                    const badgeBg = isSuccess ? "#D1FAE5" : isRevision ? "#FEF3C7" : "#FEE2E2";
                    const borderColor = isSuccess ? "#10B981" : isRevision ? "#F59E0B" : "#EF4444";

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: "var(--bx-surface)",
                          border: `1.5px solid ${borderColor}`,
                          borderRadius: "8px",
                          padding: "16px 18px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          boxShadow: "0 2px 5px rgba(10, 46, 82, 0.04)",
                        }}
                      >
                        {/* Timeline Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", borderBottom: "1px solid var(--bx-border)", paddingBottom: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                padding: "3px 10px",
                                borderRadius: "4px",
                                background: badgeBg,
                                color: badgeColor,
                                textTransform: "uppercase",
                              }}
                            >
                              Attempt #{item.attemptNumber} • {item.status.toUpperCase()}
                            </span>
                            <strong style={{ fontSize: "0.88rem", color: "var(--brand)" }}>
                              Diajukan: {item.submittedAt}
                            </strong>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.76rem" }}>
                            {item.reviewedAt && (
                              <span style={{ color: "var(--muted)" }}>
                                Dinilai: <strong>{item.reviewedAt}</strong>
                              </span>
                            )}
                            {item.reviewerName && (
                              <span style={{ color: "var(--brand)", fontWeight: 600 }}>
                                Reviewer: {item.reviewerName}
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: "0.88rem",
                                fontWeight: 800,
                                padding: "2px 8px",
                                borderRadius: "4px",
                                background: isSuccess ? "#D1FAE5" : isRevision ? "#FEF3C7" : "#FEE2E2",
                                color: badgeColor,
                              }}
                            >
                              {item.score !== undefined ? `${item.score} / 100` : "Dalam Penilaian"}
                            </span>
                          </div>
                        </div>

                        {/* Catatan Evaluasi & Penyebab Gagal/Lulus */}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.76rem", color: "var(--brand)", marginBottom: "4px" }}>
                            Catatan Evaluasi &amp; Ulasan Reviewer:
                          </div>
                          <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--ink)", lineHeight: 1.45, background: "var(--bx-bg-alt)", padding: "10px 12px", borderRadius: "6px" }}>
                            {item.feedbackNotes}
                          </p>
                        </div>

                        {/* Checklist Poin yang Pernah Diminta Direvisi */}
                        {item.revisionChecklist && item.revisionChecklist.length > 0 && (
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.75rem", color: isRejected ? "#991B1B" : "#B45309", marginBottom: "4px" }}>
                              {isRejected ? "Penyebab Kegagalan pada Attempt Ini:" : "Poin Instruksi Perbaikan yang Diberikan:"}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              {item.revisionChecklist.map((chk, cIdx) => (
                                <div key={cIdx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.74rem", color: "var(--ink)" }}>
                                  <span style={{ color: isSuccess ? "#059669" : "#DC2626", fontWeight: 700 }}>
                                    {isSuccess ? "✓" : "●"}
                                  </span>
                                  <span>{chk}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Changed Files Count */}
                        {item.changedFilesCount && (
                          <div style={{ fontSize: "0.7rem", color: "var(--muted)", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "6px", borderTop: "1px dashed var(--bx-border)" }}>
                            <span>Berkas diuji: <strong>{item.changedFilesCount} file kode</strong></span>
                            <span>Audit Log ID: {item.id}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* BOTTOM ACTION FOOTER BAR: KEPUTUSAN & SIMPAN HASIL            */}
        {/* ============================================================== */}
        <div
          style={{
            padding: "10px 24px",
            borderTop: "1px solid var(--bx-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--bx-bg-alt)",
            flexShrink: 0,
            height: "56px",
          }}
        >
          <div style={{ fontSize: "0.78rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>
              Mahasiswa: <strong style={{ color: "var(--brand)" }}>{submission.studentName}</strong>
            </span>
            <span>•</span>
            <span>
              Skor Terbobot: <strong style={{ color: totalScore >= 75 ? "#065F46" : "#DC2626" }}>{totalScore}/100</strong>
            </span>
            <span>•</span>
            <span style={{ fontWeight: 700, color: decisionStatus === "approved" ? "#065F46" : decisionStatus === "revision" ? "#B45309" : "#991B1B" }}>
              Keputusan: {decisionStatus.toUpperCase()}
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
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

            {decisionStatus === "revision" && (
              <button
                type="button"
                onClick={handleFinalSubmitReview}
                style={{
                  padding: "8px 20px",
                  borderRadius: "6px",
                  border: "1px solid #F59E0B",
                  background: "#FEF3C7",
                  color: "#B45309",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FlatIcon type="edit" size={14} color="#B45309" />
                <span>Kirim Instruksi Revisi ke Mahasiswa</span>
              </button>
            )}

            {decisionStatus === "rejected" && (
              <button
                type="button"
                onClick={handleFinalSubmitReview}
                style={{
                  padding: "8px 20px",
                  borderRadius: "6px",
                  border: "1px solid #EF4444",
                  background: "#FEE2E2",
                  color: "#991B1B",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FlatIcon type="trash" size={14} color="#991B1B" />
                <span>Tolak Submission &amp; Rekam ke Riwayat</span>
              </button>
            )}

            {decisionStatus === "approved" && (
              <button
                type="button"
                onClick={handleFinalSubmitReview}
                style={{
                  padding: "8px 22px",
                  borderRadius: "6px",
                  border: "none",
                  background: "var(--brand, #0A2E52)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(10, 46, 82, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FlatIcon type="check" size={14} color="#ffffff" />
                <span>Loloskan &amp; Simpan Nilai ({totalScore})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
