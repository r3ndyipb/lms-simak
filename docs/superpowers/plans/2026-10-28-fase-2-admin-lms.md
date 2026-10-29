# Fase 2: Monetisasi, Evaluasi & Kurikulum Interaktif Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Mengimplementasikan modul **Fase 2 (Penting)** sesuai spesifikasi `brief.md`:
1. **Modul Keuangan (`/keuangan`)** (Transaksi, Manual Approve, Refund, Invoice PDF, Revenue Report, Instructor Payout)
2. **Quiz Builder & Assessment (`/quiz-builder`)** (Editor 4 tipe soal, pembahasan, passing grade, statistik kelulusan siswa)
3. **Upgrade Learning Path Management (`/learning-paths`)** (Path Builder modal, urutan kelas drag & drop, sequential/flexible, sertifikat path)
4. **Upgrade Blog & Konten (`/blog`)** (Rich content editor, code block support, SEO metadata, moderasi komentar, kategori blog)

---

### Task 1: Data Models & Mock Data Enrichment for Fase 2
- [ ] Add types to `src/types/simak.ts`: `LmsTransaction`, `LmsInstructorPayout`, `LmsQuiz`, `LmsQuizQuestion`, `LmsBlogComment`, `LmsBlogCategory`.
- [ ] Update `SimakNavId` in `src/types/simak.ts` to include `"keuangan"` and `"quiz-builder"`.
- [ ] Add mock data in `src/data/simakMockData.ts` for transactions, payouts, quizzes with full question items, blog comments, and blog categories.

### Task 2: Create Modul Keuangan (`SimakKeuanganView.tsx`)
- [ ] Create `src/components/SimakKeuanganView.tsx` with 4 tabs:
  - Tab 1: **Transaksi**: Filter status (Paid, Pending, Refunded), bukti transfer modal, aksi Manual Approve, Refund dialog, Cetak Invoice PDF interaktif.
  - Tab 2: **Revenue Report**: KPI summary, grafik tren omset bulanan, breakdown revenue per kategori kelas, ekspor CSV/Excel format akuntansi.
  - Tab 3: **Instructor Payout**: Rekap komisi bagi hasil pengajar, status lunas/pending, tombol Tandai Lunas Transfer & notifikasi payout.
  - Tab 4: **Metode & Rekening**: Pengaturan rekening bank penampung & instruksi transfer manual.

### Task 3: Create Quiz Builder & Assessment (`SimakQuizBuilderView.tsx`)
- [ ] Create `src/components/SimakQuizBuilderView.tsx`:
  - List kuis per kelas dengan passing score, waktu pengerjaan, dan statistik attempt.
  - Quiz Creator & Question Editor Modal:
    - Multiple Choice (1 jawaban benar)
    - Multiple Select (jawaban ganda)
    - True / False
    - Short Answer
    - Input kunci jawaban, poin, dan teks pembahasan/solusi.
  - Tab Hasil Ujian Siswa (% lulus, soal paling sering salah, tombol ekspor rekap nilai).

### Task 4: Upgrade Learning Path Management (`SimakLearningPathsView.tsx`)
- [ ] Enhance `src/components/SimakLearningPathsView.tsx`:
  - Add Path Builder Modal:
    - Tab 1: Info Jalur (judul, target karir, level, harga/gratis).
    - Tab 2: Susunan Kelas (pilih course, atur urutan, toggle sequential vs flexible, toggle required vs optional).
    - Tab 3: Sertifikat Kelulusan Jalur (pilih template sertifikat AUI).
    - Tab 4: Publikasi & Pratinjau.

### Task 5: Upgrade Blog & Konten (`SimakBlogView.tsx`)
- [ ] Upgrade `src/components/SimakBlogView.tsx`:
  - Tab 1: Daftar Artikel Blog (status, view count, aksi edit).
  - Tab 2: Editor Artikel (modal/drawer dengan formatting code block, SEO title, slug, excerpt, cover image, jadwal publikasi).
  - Tab 3: Moderasi Komentar (approve, reject, delete, filter belum dimoderasi).
  - Tab 4: Kategori Blog CRUD.

### Task 6: Sidebar & Shell Routing Integration
- [ ] Update `src/components/SimakSidebar.tsx` to include "Keuangan & Transaksi" and "Quiz Builder & Ujian".
- [ ] Update `src/components/SimakShell.tsx` to mount `SimakKeuanganView` and `SimakQuizBuilderView`.

### Task 7: Build Verification
- [ ] Execute `npm run build` and ensure error-free compilation.

