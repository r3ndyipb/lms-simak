# Fase 1: Core Admin LMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Mengimplementasikan modul **Fase 1 (Wajib)** sesuai spesifikasi `brief.md`:
1. **Master Data** (Kategori, Level, Tag/Skill, Bahasa, Template Sertifikat)
2. **Dashboard Overview** (Kartu KPI komersial, Grafik tren, Quick actions, Feed aktivitas)
3. **User Management** (Pemisahan tab Siswa, Instructor, Admin/Staff, modal detail, aksi ban/assign/export)
4. **Course Management** (Filter draft/published, list tabel/grid, 6-tab course editor modal dengan modul & lesson)
5. **Pengaturan Sistem** (Profil platform, integrasi pihak ketiga: payment, video, email, storage, maintenance mode)

---

### Task 1: Type Definitions & Mock Data Enrichment
- [ ] Update `src/types/simak.ts` to add `"master-data"` in `SimakNavId`, plus interfaces for `LmsCategory`, `LmsLevel`, `LmsTag`, `LmsCertificateTemplate`, `LmsCourse`, `LmsLesson`, `LmsModule`, and extended user metadata.
- [ ] Enrich `src/data/simakMockData.ts` with mock records for Categories, Levels, Tags, Languages, Certificate Templates, full 6-tab Courses with curriculum lessons, and enriched student/instructor data.

### Task 2: Master Data Module Implementation
- [ ] Create `src/components/SimakMasterDataView.tsx` with tabs:
  - Tab 1: Kategori / Bidang (CRUD form, color, icon, auto course count)
  - Tab 2: Level Pembelajaran (Pemula, Menengah, Advanced)
  - Tab 3: Tag / Skill (search, add, merge tag)
  - Tab 4: Bahasa (Indonesia, English, dll)
  - Tab 5: Template Sertifikat (pengaturan elemen + modal preview)
- [ ] Connect `SimakSidebar.tsx` and `SimakShell.tsx` to include `master-data`.

### Task 3: Upgrade Dashboard Overview to Modern LMS Metrics
- [ ] Refactor `src/components/SimakDashboardOverview.tsx`:
  - 5 KPI Cards: Siswa Aktif, Kelas Terpublikasi, Omset Bulan Ini, Sertifikat Terbit, Pendaftar Baru.
  - Interactive SVG/Canvas Trend Charts: Pendaftaran Siswa (7/30 Hari) & Tren Revenue Bulanan.
  - Top 5 Kelas Populer with completion rate bars.
  - Quick Actions toolbar (Buat Kelas Baru, Tambah Instructor, Buat Event, Pengumuman).
  - Recent Activities feed matching brief.md.

### Task 4: Upgrade User Management (Siswa, Instructor, Admin/Staff)
- [ ] Update `src/components/SimakUsersView.tsx` to feature 3 tabs:
  - Tab 1: **Siswa** (search, filter, status, total kelas, modal detail dengan kelas + riwayat transaksi + internal notes + aksi ban/reset/assign/export).
  - Tab 2: **Instructor** (bidang, total siswa, rating, status approval, modal detail dengan komisi/bagi hasil 70:30, performa kelas).
  - Tab 3: **Admin & Staff** (role Super Admin / Admin / Moderator / Viewer, status, reset password).

### Task 5: Upgrade Course Management (6-Tab Course Builder)
- [ ] Update `src/components/SimakKurikulumView.tsx` into a modern Course Manager:
  - Status tabs: Semua, Terpublikasi, Draft, Arsip, Gratis, Berbayar.
  - Course Card / Table View with quick status toggles.
  - 6-Tab Course Builder Modal:
    - Tab 1: Info Dasar (judul, slug, deskripsi, thumbnail, trailer video, durasi, harga)
    - Tab 2: Target Pembelajaran (apa yang dipelajari, syarat, target audience)
    - Tab 3: Struktur Kurikulum (Modules & Lessons: Video, Text, Quiz, Assignment, free preview toggle)
    - Tab 4: Harga & Akses (Free / One-time / Subscription)
    - Tab 5: SEO & Publishing (meta title, OG preview, scheduled publish)
    - Tab 6: Review & Rating siswa
- [ ] Add ability to save, create, and edit courses.

### Task 6: Upgrade Pengaturan Sistem (Platform & Integrasi)
- [ ] Update `src/components/SimakSettingsView.tsx` with 4 full tabs:
  - Tab 1: **Profil Platform** (Nama, Logo, Tagline, Favicon, Social links, Deskripsi)
  - Tab 2: **Integrasi Pihak Ketiga** (Payment Gateway: Midtrans/Xendit, Video Hosting: Mux/Bunny, Email: Resend, Storage: S3, Google OAuth)
  - Tab 3: **Email Templates** (Welcome email, Purchase invoice, Certificate issued)
  - Tab 4: **Maintenance & Pengumuman** (Toggle maintenance mode, announcement banner)

### Task 7: Verification & Build Check
- [ ] Run `npm run build` and ensure clean compilation with zero TypeScript or React hydration errors.
- [ ] Test navigation transitions between all views.

