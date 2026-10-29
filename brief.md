# Portal Admin LMS — Mod Portal Admin LMS — Modul Lengkap

Berdasarkan menu siswa yang sudah kamu buat, berikut pemetaan lengkap portal admin yang saling terhubung:

---

## Struktur Menu Admin

```
DASHBOARD
├── Overview
├── Statistik & Analytics
└── Aktivitas Terbaru

USER MANAGEMENT
├── Siswa (Student)
├── Instructor
├── Admin / Staff
└── Role & Permission

MASTER DATA
├── Kategori / Bidang
├── Level (Pemula/Menengah/Advanced)
├── Tag / Skill
├── Bahasa
└── Template Sertifikat

KELAS (Course Management)
├── Daftar Kelas
├── Kelas Baru / Draft
├── Struktur Kurikulum (Module & Lesson)
├── Quiz & Assessment
├── Kelas Terpublikasi
└── Kelas Arsip

LEARNING PATH
├── Daftar Learning Path
├── Buat / Edit Learning Path
├── Urutkan Course dalam Path
└── Pengaturan Akses & Harga

LANGGANAN & Akses
├── Paket Langganan
├── Kode Akses / Voucher
├── Referral Program
└── Beasiswa (Scholarship)

CATALOG & PROGRAM
├── Program Terbaru
└── Kustomisasi Catalog

BLOG & KONTEN
├── Artikel / Berita
├── Kategori Blog
└── Komentar

EVENT & LIVE
├── Daftar Event
├── Live / Webinar
├── Mentoring (Jadwal & Mentor)
└── Pendaftaran Peserta

JOBS & HIRING
├── Lowongan Pekerjaan
├── Partner / Perusahaan
└── Aplikasi Kandidat

PORTOFOLIO & SERTIFIKAT
├── Review Portofolio
├── Sertifikat Terbit
└── Verifikasi Sertifikat

KEUANGAN
├── Transaksi
├── Pembayaran
├── Refund
├── Invoice
└── Revenue Report

KOMUNITAS & DISKUSI
├── Forum Moderation
├── Kelola Diskusi
└── Laporkan Konten

PENGATURAN SISTEM
├── Profil Platform
├── Email Template
├── Integrasi (Payment, Video, dll)
├── Log Aktivitas
└── Backup & Maintenance
```

---

## Detail Per Modul

### 1. Dashboard

```
Overview Cards:
- Total siswa aktif hari ini / bulan ini
- Total kelas terpublikasi
- Revenue bulan berjalan
- Sertifikat terbit bulan ini
- Pendaftar baru hari ini

Charts:
- Grafik pendaftaran siswa (7/30 hari)
- Grafik revenue (bulanan)
- Top 5 kelas paling populer
- Completion rate rata-rata

Aktivitas Terbaru (feed):
- Siswa baru mendaftar
- Kelas baru dipublikasikan
- Sertifikat baru diterbitkan
- Pembayaran masuk
- Event baru dibuat

Quick Actions:
- Buat kelas baru
- Tambah instructor
- Publish event
- Buat pengumuman
```

---

### 2. User Management

#### 2a. Siswa
```
Daftar Siswa:
- Tabel: nama, email, tgl daftar, status (aktif/nonaktif/ banned),
  jumlah kelas diikuti, progres rata-rata, terakhir aktif
- Filter: status, tanggal daftar, kategori yang diikuti
- Search: nama / email
- Sort: terbaru, paling aktif

Detail Siswa (klik nama):
- Profil lengkap + avatar
- Kelas yang diikuti + progres masing-masing
- Sertifikat yang didapat
- Riwayat pembayaran
- Aktivitas forum / diskusi
- Catatan admin (internal notes)

Aksi:
- Aktifkan / nonaktifkan akun
- Ban / unban
- Reset password
- Kirim email manual
- Assign ke kelas / learning path (gratis)
- Assign beasiswa
- Hapus akun (soft delete)
- Export data siswa (CSV)
```

#### 2b. Instructor
```
Daftar Instructor:
- Tabel: nama, email, keahlian/bidang, jumlah kelas,
  rating rata-rata, total siswa, status (aktif/pending/suspended)
- Filter: bidang, status, rating

Detail Instructor:
- Profil & bio
- Kelas yang diajar
- Statistik performa (rating, completion rate siswa)
- Jadwal mentoring
- Riwayat pembayaran / komisi

Tambah Instructor Baru:
- Input data + assign role instructor
- Atau: approve dari pendaftaran (jika ada flow pengajuan)

Aksi:
- Setujui / tolak pengajuan instructor
- Aktifkan / suspend
- Assign ke kategori / bidang tertentu
- Atur komisi / revenue share
- Kirim undangan jadi instructor
```

#### 2c. Admin / Staff
```
Daftar Admin:
- Tabel: nama, email, role (super admin/admin/moderator),
  terakhir login, status

Tambah Admin Baru:
- Input data + pilih role
- Kirim undangan via email

Aksi:
- Edit role / permission
- Aktifkan / nonaktifkan
- Reset password
- Lihat log aktivitas admin tersebut
```

#### 2d. Role & Permission Matrix
```
Permission yang bisa diatur per role:

Module              Admin  Instructor  Moderator  Viewer
─────────────────────────────────────────────────────────
User Management      ✅       ❌          ❌        ❌
Course CRUD          ✅       ✅(own)     ❌        ❌
Course Publish       ✅       ✅(own)     ❌        ❌
Quiz Management      ✅       ✅(own)     ❌        ❌
Learning Path        ✅       ✅(own)     ❌        ❌
Blog CRUD            ✅       ✅(own)     ✅        ❌
Event Management     ✅       ✅(own)     ❌        ❌
Forum Moderation     ✅       ✅(course)  ✅        ❌
Transaction View     ✅       ❌          ❌        ❌
Revenue Report       ✅       ✅(own)     ❌        ❌
System Settings      ✅       ❌          ❌        ❌
Dashboard View       ✅       ✅(own)     ✅        ✅
```

---

### 3. Master Data

#### 3a. Kategori / Bidang
```
Contoh: Web Development, Mobile Development, Data Science,
        UI/UX Design, Cloud Computing, Cybersecurity

CRUD:
- Nama, slug, deskripsi, icon, warna badge
- Urutan tampil (drag & drop)
- Status: aktif / nonaktif
- Jumlah kelas per kategori (auto count)
```

#### 3b. Level
```
- Pemula (Beginner)
- Menengah (Intermediate)
- Advanced
- (bisa tambah custom level)

CRUD: nama, deskripsi, badge color, urutan
```

#### 3c. Tag / Skill
```
Contoh: JavaScript, React, Python, SQL, Docker, Figma

CRUD:
- Nama, slug, kategori terkait
- Digunakan di: course, learning path, portofolio, jobs

Fitur tambahan:
- Merge tag (gabungkan tag duplikat)
- Lihat tag populer
```

#### 3d. Bahasa
```
- Indonesia, English, dll
- CRUD sederhana
```

#### 3e. Template Sertifikat
```
- Buat/edit template sertifikat
- Drag & drop komponen:
  - Logo platform
  - Nama siswa (auto field)
  - Judul kelas (auto field)
  - Tanggal (auto field)
  - Score (auto field)
  - Signature instructor
  - QR code
  - Border / background design
- Preview template
- Set sebagai default untuk kategori tertentu
```

---

### 4. Kelas (Course Management)

#### 4a. Daftar Kelas
```
Filter: status (draft/published/archived), kategori, instructor,
        level, harga (gratis/berbayar), tanggal dibuat
Sort: terbaru, paling populer, rating tertinggi

Tabel: judul, kategori, instructor, level, status,
       total siswa, rating, harga, terakhir diupdate

Aksi massal: publish, archive, delete
```

#### 4b. Kelas Baru / Edit
```
Tab 1 — Info Dasar:
- Judul, slug (auto-generate, bisa edit)
- Deskripsi singkat (untuk card)
- Deskripsi lengkap (rich text editor)
- Thumbnail (upload / pilih dari gallery)
- Preview video (trailer)
- Kategori, level, bahasa
- Durasi estimasi
- Harga (0 = gratis)

Tab 2 — Target Pembelajaran:
- "Apa yang akan dipelajari" (list, bisa tambah/hapus)
- "Persyaratan" (list)
- "Siapa yang cocok untuk kelas ini" (list)

Tab 3 — Struktur Kurikuktur:
- Daftar Module (drag & drop reorder)
- Di dalam Module → daftar Lesson:
  - Judul lesson
  - Tipe konten: Video / Text / Quiz / Assignment / Downloadable
  - Konten sesuai tipe
  - Durasi (video)
  - Free preview? (ya/tidak)
  - Require previous lesson? (ya/tidak)
  - Tambah quiz ke lesson ini

Tab 4 — Harga & Akses:
- Tipe akses: Gratis / Berbayar / Subscription only
- Harga normal
- Harga diskon (opsional)
- Akses ke learning path mana saja

Tab 5 — SEO & Publishing:
- SEO title, meta description, OG image
- Publish / simpan draft / jadwalkan publikasi

Tab 6 — Review & Rating:
- Lihat semua review siswa
- Balas review (opsional)
- Flag review tidak pantas
```

#### 4c. Quiz Builder (per kelas)
```
Daftar Quiz per kelas:
- Judul quiz, attached ke lesson mana, passing score,
  jumlah soal, jumlah attempt, status

Buat/Edit Quiz:
- Info: judul, deskripsi, passing score, max attempts,
        time limit, shuffle questions, show answers after submit

Editor Soal:
- Tambah soal → pilih tipe:
  - Multiple Choice (1 jawaban benar)
  - Multiple Select (multi jawaban benar)
  - True/False
  - Short Answer
- Input teks soal
- Tambah opsi jawaban
- Centang jawaban benar
- Input pembahasan (muncul setelah submit)
- Set points per soal
- Drag & drop reorder soal

Tab Hasil:
- Statistik: rata-rata skor, % lulus, soal paling sering salah
- Export hasil siswa
```

---

### 5. Learning Path

```
Daftar Learning Path:
- Judul, jumlah course, level, harga, status,
  total siswa, completion rate

Buat / Edit Learning Path:
Tab 1 — Info:
- Judul, slug, deskripsi, thumbnail
- Level, target karir ("Frontend Developer")
- Harga (atau gratis untuk subscriber)

Tab 2 — Pilih Course:
- Pilih course dari daftar (search & select)
- Drag & drop urutkan
- Set sequential (harus urut) atau flexible (bebas pilih)
- Set required / optional per course

Tab 3 — Sertifikat:
- Aktifkan sertifikat learning path?
- Template sertifikat (pilih dari master)
- Passing criteria: semua course wajib selesai

Tab 4 — Publishing:
- Preview halaman publik
- Publish / draft
```

---

### 6. Langganan & Akses

#### 6a. Paket Langganan
```
Daftar paket:
- Nama (Basic, Pro, Premium)
- Harga bulanan / tahunan
- Benefit (akses kelas apa saja)
- Jumlah aktif subscriber

Buat / Edit Paket:
- Nama, deskripsi
- Harga (bulan / tahun / custom)
- Pilih kelas / kategori yang diakses
- Pilih learning path yang diakses
- Kuota download / mentoring (opsional)
- Status: aktif / nonaktif

Tab Subscriber:
- Daftar subscriber aktif
- Riwayat pembayaran per subscriber
- Cancel / pause subscription
```

#### 6b. Kode Akses / Voucher
```
Daftar kode:
- Kode, deskripsi, tipe (potongan harga / akses gratis /
  free subscription periode), kuota pakai, terpakai,
  berlaku s/d, status

Buat kode baru:
- Generate random atau input manual
- Tipe: discount % / discount amount / free access
- Target: kelas spesifik / learning path / subscription
- Kuota pemakaian
- Masa berlaku
- Bulk generate (buat 100 kode sekaligus)

Aksi:
- Aktifkan / nonaktifkan
- Lihat daftar pemakai
- Export kode
```

#### 6c. Referral Program
```
Pengaturan referral:
- Aktifkan / nonaktifkan program
- Bonus untuk referrer (poin / diskon / uang)
- Bonus untuk referee (diskon / free trial)
- Syarat & ketentuan

Daftar referral:
- User yang berhasil mereferensikan
- Kode referral unik per user
- Jumlah referral, konversi, bonus terkumpul

Aksi:
- Approve / manual credit bonus
- Export laporan referral
```

#### 6d. Beasiswa (Scholarship)
```
Daftar beasiswa:
- Nama program, sponsor, kuota, periode pendaftaran,
  kelas / learning path yang dicover, jumlah pendaftar,
  jumlah diterima, status

Buat beasiswa baru:
- Nama program
- Deskripsi & syarat
- Sponsornya (partner / internal)
- Kuota penerima
- Periode pendaftaran (buka / tutup)
- Kelas / LP yang dicover (gratis)
- Form pendaftaran (apa yang harus diisi siswa)
- Deadline pengumuman

Tab Pendaftar:
- Daftar pendaftar + status (pending / diterima / ditolak)
- Review jawaban / esai pendaftar
- Approve / reject + kirim email notifikasi
- Auto-assign kelas ke yang diterima

Tab Laporan:
- Jumlah pendaftar vs diterima
- Tingkat penyelesaian kelas oleh penerima beasiswa
```

---

### 7. Blog

```
Daftar Artikel:
- Judul, penulis, kategori, status (draft/published),
  view count, tanggal publikasi, terakhir diedit

Buat / Edit Artikel:
- Judul, slug
- Cover image (upload / URL eksternal)
- Ringkasan (excerpt)
- Body (rich text editor dengan support code block)
- Kategori, tags
- SEO: meta title, meta description, OG image
- Penulis (pilih dari admin / instructor)
- Status: draft / published
- Jadwalkan publikasi

Tab Komentar:
- Daftar komentar per artikel
- Moderasi: approve / reject / delete
- Filter: semua / belum dimoderasi

Tab Kategori Blog:
- CRUD kategori blog (berita, tutorial, tips, pengumuman)
```

---

### 8. Event & Live

#### 8a. Event
```
Daftar Event:
- Judul, tanggal, tipe (offline/online), kuota,
  jumlah pendaftar, status (upcoming/ongoing/completed/cancelled)

Buat / Edit Event:
- Judul, deskripsi
- Tanggal & waktu (mulai, selesai, timezone)
- Tipe: online / offline
- Link meeting (Zoom/Google Meet) — untuk online
- Lokasi (alamat) — untuk offline
- Kuota peserta
- Speaker / pembicara (nama, bio, foto)
- Thumbnail
- Harga (gratis / berbayar)
- Kelas / LP terkait (opsional)

Tab Pendaftar:
- Daftar peserta + status (pending / confirmed / attended)
- Export CSV
- Kirim email massal ke peserta
- Check-in peserta (scan QR code untuk offline)
```

#### 8b. Live / Webinar
```
Daftar Live:
- Sama seperti event, tapi:
- Link streaming (YouTube Live / platform lain)
- Recording URL (diisi setelah selesai)
- Tambahkan recording ke library kelas (opsional)

Pengaturan:
- Reminder otomatis (H-1, H-1 jam sebelum)
- Auto-publish recording setelah live selesai
```

#### 8c. Mentoring
```
Daftar Mentor:
- Nama, bidang, rating, jumlah sesi, harga per sesi,
  jadwal tersedia

Atur Jadwal Mentoring:
- Pilih mentor
- Atur slot waktu (senin 14:00-16:00, dst)
- Jenis: 1-on-1 / group (kuota berapa orang)
- Harga per sesi (atau gratis untuk subscriber tier tertentu)
- Kelas / LP terkait (mentor ini untuk topik apa)

Tab Booking:
- Daftar sesi mentoring yang sudah dibooking
- Status: upcoming / ongoing / completed / cancelled
- Catatan sesi (oleh mentor)
- Rating & review (oleh siswa)

Aksi:
- Reschedule sesi
- Assign mentor baru
- Export laporan mentoring
```

---

### 9. Jobs & Hiring

```
Daftar Lowongan:
- Posisi, perusahaan, lokasi, tipe (remote/onsite/hybrid),
  gaji range, kategori bidang, status (aktif/closed/expired),
  jumlah pelamar

Buat Lowongan:
- Posisi, deskripsi pekerjaan
- Perusahaan (dari daftar partner)
- Lokasi, tipe kerja
- Gaji range (opsional)
- Kategori bidang / skill yang dibutuhkan
- Link apply eksternal (JobStreet, dll) atau internal apply
- Deadline
- Kelas / LP terkait ("Lowongan ini untuk lulusan path X")

Tab Pelamar:
- Daftar pelamar + status
  (applied / screening / interview / offered / hired / rejected)
- Resume / portofolio link
- Aksi: update status, catatan internal, kirim email

Tab Partner / Perusahaan:
- CRUD perusahaan partner
- Nama, logo, deskripsi, website, industri
- Kontak person
- Jumlah lowongan aktif
```

---

### 10. Portofolio & Sertifikat

#### 10a. Review Portofolio
```
Daftar Portofolio (belum di-endorse):
- Nama siswa, judul project, kelas asal, tanggal submit

Review:
- Preview project (screenshot, demo link, repo link)
- Approve → endorse (muncul badge "Terverifikasi")
- Reject + alasan
- Request revisi
```

#### 10b. Sertifikat
```
Daftar Sertifikat Terbit:
- Kode sertifikat, nama siswa, judul kelas / LP,
  skor, tanggal terbit, status

Tab Template:
- Kelola template sertifikat (seperti di Master Data)

Tab Verifikasi:
- Input kode → tampilkan detail sertifikat
- Untuk publik: halaman verifikasi

Tab Bulk Issue:
- Terbitkan sertifikat massal (misal: semua siswa
  yang lulus path X sebelum tanggal Y)
```

---

### 11. Keuangan

#### 11a. Transaksi
```
Daftar Transaksi:
- ID transaksi, tanggal, nama siswa, item (kelas / LP /
  subscription), jumlah, metode pembayaran, status
  (pending / paid / failed / refunded)

Filter: tanggal, status, metode, item
Sort: terbaru, nominal terbesar

Detail Transaksi:
- Info pembelian lengkap
- Bukti pembayaran
- Info refund (kalau ada)
- Invoice (download PDF)

Aksi:
- Manual approve (untuk transfer manual)
- Refund (full / partial)
- Kirim ulang invoice / email konfirmasi
```

#### 11b. Paket Pembelian (One-time)
```
- Kelas per-kelas (purchase satuan)
- Learning Path bundle
- Bebedakan dengan subscription (recurring)
```

#### 11c. Revenue Report
```
Dashboard Revenue:
- Total revenue bulan ini vs bulan lalu
- Revenue per kategori
- Revenue per kelas terlaris
- Revenue per sumber (direct / referral / beasiswa)
- Chart tren revenue (bulanan / tahunan)

Export:
- Export ke CSV / Excel
- Export laporan keuangan bulanan (format akuntansi)
```

#### 11d. Instructor Payout
```
Daftar instructor + komisi terutang:
- Nama instructor
- Total penjualan kelasnya
- Komisi yang harus dibayar
- Status pembayaran (belum dibayar / sudah dibayar)

Aksi:
- Tandai sudah dibayar
- Export laporan payout
- Kirim notifikasi ke instructor
```

---

### 12. Komunitas & Diskusi

```
Tab Forum Moderation:
- Daftar thread terbaru
- Filter: belum dimoderasi, flagged, locked, solved
- Aksi: pin, lock, unlock, delete, warn user

Tab Flagged Content:
- Konten yang dilaporkan user
- Review → approve / delete
- Ban user jika melanggar berulang

Tab Leaderboard:
- Top contributors (berdasarkan jawaban diterima, upvotes)
- Top asker
- Export

Tab Pengaturan Forum:
- Atur kategori diskusi
- Set moderator per kategori
- Auto-close thread setelah X hari tanpa aktivitas
```

---

### 13. Pengaturan Sistem

```
Tab Profil Platform:
- Nama platform, logo, tagline
- URL, deskripsi
- Social media links
- Favicon, OG image default

Tab Email Template:
- Daftar template: welcome, verification, reset password,
  course purchase, certificate earned, event reminder,
  forum reply, newsletter
- Edit: subject, body (HTML / rich text)
- Preview

Tab Integrasi:
- Payment Gateway (Midtrans / Xendit)
  → API keys, webhook URL, test mode toggle
- Video Hosting (Mux / Bunny)
  → API keys, webhook
- Email Service (SES / Resend)
  → API keys, sender email
- Storage (S3 / Cloudinary)
  → bucket, keys, region
- Analytics (GA4 / Mixpanel)
  → tracking ID
- Social Login (Google OAuth)
  → client ID, secret

Tab Log Aktivitas:
- Audit log: siapa, apa, kapan
- Filter: user, aksi, tanggal
- Export

Tab Backup:
- Backup database (manual / terjadwal)
- Restore backup
- Backup files (uploads, certificates)

Tab Maintenance:
- Maintenance mode on/off
- Announcements banner
```

---

## Prioritas Pengembangan Admin Portal

```
FASE 1 (WAJIB) ─── Mulai dari sini
├── Dashboard (overview dasar)
├── User Management (siswa + admin)
├── Master Data (kategori, level, tag)
├── Course Management (CRUD + kurikulum)
└── Pengaturan Sistem (profil + integrasi dasar)

FASE 2 (PENTING)
├── Instructor Management
├── Quiz Builder
├── Learning Path Management
├── Blog Management
└── Keuangan (transaksi + revenue)

FASE 3 (ENGAGEMENT)
├── Event & Live
├── Mentoring
├── Forum Moderation
├── Langganan & Voucher
└── Referral Program

FASE 4 (GROWTH)
├── Beasiswa
├── Jobs & Hiring
├── Portofolio Review
├── Instructor Payout
└── Advanced Analytics
```

---

Mau saya lanjutkan dengan:

1. **Buat wireframe / layout** untuk halaman-halaman admin utama (HTML prototype)
2. **Buat database schema** khusus untuk modul admin
3. **Mulai coding** — scaffold project admin (Next.js + FastAPI)
4. **Deep dive** satu modul tertentu (misal: Course Management + Quiz Builder)

Pilih mana yang paling kamu butuhkan sekarang?