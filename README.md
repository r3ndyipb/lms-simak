# SIMAK ANVIEO — Sistem Informasi Manajemen Akademik & Reviewer Portal

Template antarmuka **SIMAK (Sistem Informasi Manajemen Akademik)** terpadu berbasis **Node.js (Next.js 16 + React 19 + TypeScript)** dengan mengadopsi penuh sistem desain institusional **`lms-portal`** (AUI Design System: Fraunces, Karla, JetBrains Mono, Dark & Light Mode).

Dikhususkan untuk **jajaran internal**:
- **Administrator (Superadmin / IT)**
- **Administrasi Akademik (BAAK / Tata Usaha)**
- **Dosen & Instruktur Pengampu**
- **Reviewer Kode & Portofolio Industri**
- **Koordinator Kurikulum & Kaprodi**

> **Catatan Penting**: Portal ini **bukan untuk peserta / siswa** dan **tidak menyediakan halaman registrasi mandiri**. Seluruh akun diterbitkan secara internal oleh Biro Administrasi Akademik (BAAK).

---

## 🚀 Fitur Unggulan

### 1. Halaman Login Khusus Staf (Tanpa Registrasi) (`/login`)
- **Dual-Panel Showcase**: Kolom kiri menampilkan ringkasan otoritas institusi, KPI mutu akademik, dan kutipan civitas.
- **Card Autentikasi Pegawai**: Form login NIP / Email dinas dan kata sandi tanpa tab registrasi akun.
- **1-Click Demo Persona Switcher**: Pengujian instan 1-klik untuk 5 profil peran:
  - *Administrator*: Dr. Ir. Hendra Prasetyo, M.T.
  - *Administrasi BAAK*: Siti Nurhaliza, S.Kom.
  - *Dosen Instruktur*: Prof. Budi Rahardjo, Ph.D.
  - *Lead Code Reviewer*: Rian Maulana, S.T.
  - *Koordinator Kurikulum*: Dr. Maya Anggraini, M.Cs.
- **Modal Bantuan Akses & Pemulihan Akun BAAK**: Form pengajuan bantuan bagi staf yang lupa sandi atau membutuhkan perpanjangan hak akses.

### 2. Header & Role Switcher Interaktif
- Header berstandar AUI dengan logo institusi & badge versi.
- **Dropdown Pengganti Peran (Header Role Switcher)**: Memungkinkan peninjauan langsung tampilan dashboard untuk berbagai peran tanpa harus logout.
- **Notifikasi Akademik Real-Time**: Peringatan batas waktu SLA review (< 6 jam), revisi silabus, dan presensi.
- **Toggle Mode Gelap & Terang**: Sesuai preferensi sistem dan penyimpanan lokal.

### 3. Sidebar Khusus SIMAK
Navigasi menu terstruktur khusus kebutuhan tata kelola akademik:
- **UTAMA**: Ringkasan Akademik (Dashboard)
- **AKADEMIK & KELAS**: Kurikulum & Silabus RPS, Jadwal & Ruang Kuliah, Presensi Perkuliahan
- **REVIEWER & EVALUASI**: Antrean Review Tugas (Badge 6 SLA), Buku Nilai & Gradebook
- **PENGGUNA & STAF**: Direktori Mahasiswa, Dosen & Reviewer, Hak Akses RBAC
- **LAPORAN**: Transkrip & Yudisium, Laporan Mutu & CPL
- **SISTEM**: Pengaturan SIMAK & Konfigurasi SLA

### 4. Interactive Reviewer Studio (`#review-queue`)
- Filter tabs: *Semua*, *Menunggu Review*, *Sedang Dinilai*, *Disetujui*, *Perlu Revisi*.
- **Modal Penilaian Interaktif**:
  - Rubrik multi-kriteria (Clean Architecture, Naming/Lint, Unit Testing, Fungsionalitas).
  - Penghitungan skor otomatis berbobot (0-100) dan konversi grade (A, B+, C).
  - Input feedback catatan evaluasi reviewer.
  - Aksi *Minta Revisi* atau *Loloskan & Simpan Nilai* langsung memperbarui status antrean.

---

## 🛠️ Menjalankan Aplikasi

Project ini berjalan di lingkungan **Node.js** mandiri tanpa dependensi backend atau database eksternal:

```bash
# 1. Masuk ke direktori
cd lms-simak

# 2. Jalankan server pengembang (Port 3002)
bun run dev
# atau
npm run dev

# 3. Akses via browser
# Halaman Login: http://localhost:3002/login
# Halaman Utama SIMAK: http://localhost:3002
```
