"use client";

import React, { useState } from "react";
import FlatIcon from "./FlatIcon";

interface AcademicEvent {
  id: string;
  title: string;
  type: "Webinar" | "Hackathon" | "Workshop" | "Seminar";
  image: string;
  speaker: string;
  speakerRole: string;
  date: string;
  time: string;
  location: string;
  attendeesCount: number;
  quota: number;
  status: "Live" | "Registrasi Buka" | "Selesai";
  description: string;
  meetingUrl?: string;
  recordingUrl?: string;
}

interface EventAttendee {
  id: string;
  eventId: string;
  studentName: string;
  studentEmail: string;
  ticketCode: string;
  status: "hadir" | "terdaftar";
  registeredAt: string;
}

const INITIAL_EVENTS: AcademicEvent[] = [
  {
    id: "evt-01",
    title: "International AI Hackathon & Multi-Agent Challenge 2026",
    type: "Hackathon",
    image: "/events/event-1.jpg",
    speaker: "Google DeepMind & Anvieo Research Team",
    speakerRole: "Keynote Jury & Lead Evaluator",
    date: "12-14 November 2026",
    time: "48 Jam Non-stop",
    location: "Hybrid (Auditorium Lt. 3 & Discord Virtual)",
    attendeesCount: 340,
    quota: 500,
    status: "Registrasi Buka",
    description: "Kompetisi perebutan pendanaan riset dan fast-track hiring dengan memecahkan problem engineering real-world menggunakan agen otonom.",
    meetingUrl: "https://zoom.us/j/991829102",
  },
  {
    id: "evt-02",
    title: "Masterclass: High-Performance Next.js 16 & Server Actions",
    type: "Workshop",
    image: "/events/event-2.jpg",
    speaker: "Rian Maulana, S.T.",
    speakerRole: "Lead Technical Assessor",
    date: "Hari ini, 28 Oktober 2026",
    time: "14:00 - 17:00 WIB",
    location: "Zoom Interactive & Cloud Lab",
    attendeesCount: 185,
    quota: 200,
    status: "Live",
    description: "Praktik langsung optimasi Core Web Vitals, partial prefetching, dan arsitektur tokenized UI/UX enterprise.",
    meetingUrl: "https://zoom.us/j/883910291",
    recordingUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  },
];

const INITIAL_ATTENDEES: EventAttendee[] = [
  { id: "att-1", eventId: "evt-02", studentName: "Muhammad Farhan", studentEmail: "farhan.mhs@anvieo.ac.id", ticketCode: "TCK-ANV-8812", status: "hadir", registeredAt: "26 Okt 2026" },
  { id: "att-2", eventId: "evt-02", studentName: "Siti Nurhaliza", studentEmail: "siti.nurhaliza@gmail.com", ticketCode: "TCK-ANV-8813", status: "hadir", registeredAt: "26 Okt 2026" },
  { id: "att-3", eventId: "evt-02", studentName: "Aditya Pratama", studentEmail: "aditya.pratama@outlook.com", ticketCode: "TCK-ANV-8814", status: "terdaftar", registeredAt: "27 Okt 2026" },
];

export default function SimakEventsView() {
  const [activeTab, setActiveTab] = useState<"daftar" | "peserta" | "live">("daftar");
  const [events, setEvents] = useState<AcademicEvent[]>(INITIAL_EVENTS);
  const [attendees, setAttendees] = useState<EventAttendee[]>(INITIAL_ATTENDEES);

  // Modal
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventSpeaker, setNewEventSpeaker] = useState("");
  const [newEventType, setNewEventType] = useState<any>("Webinar");
  const [newEventDate, setNewEventDate] = useState("10 November 2026");

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;
    const newEvt: AcademicEvent = {
      id: `evt-${Date.now()}`,
      title: newEventTitle,
      type: newEventType,
      image: "/events/event-1.jpg",
      speaker: newEventSpeaker || "Instruktur Tamu",
      speakerRole: "Guest Speaker",
      date: newEventDate,
      time: "19:00 - 21:00 WIB",
      location: "Zoom Interactive Webinar",
      attendeesCount: 0,
      quota: 300,
      status: "Registrasi Buka",
      description: "Deskripsi sesi webinar dan workshop teknologi.",
    };
    setEvents([...events, newEvt]);
    setNewEventTitle("");
    setShowAddEventModal(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Hapus event ini?")) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  const handleToggleCheckin = (attId: string) => {
    setAttendees(
      attendees.map((a) =>
        a.id === attId
          ? { ...a, status: a.status === "hadir" ? "terdaftar" : "hadir" }
          : a
      )
    );
  };

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
              Event &amp; Live Studio
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Webinar, Workshop, Hackathon &amp; Presensi QR
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
            Manajemen Event &amp; Webinar Live
          </h2>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "6px", background: "var(--bx-bg-alt)", padding: "4px", borderRadius: "8px" }}>
          {[
            { id: "daftar", label: "Daftar Event", icon: "calendar" },
            { id: "peserta", label: "Pendaftar & Presensi QR", icon: "users" },
            { id: "live", label: "Live & Arsip Video", icon: "video" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: isActive ? "var(--brand, #0A2E52)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--ink)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: DAFTAR EVENT */}
      {/* ============================================================== */}
      {activeTab === "daftar" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Total Event: <strong>{events.length} Sesi Terjadwal</strong>
            </span>
            <button
              type="button"
              onClick={() => setShowAddEventModal(true)}
              style={{ padding: "8px 14px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <FlatIcon type="plus" size={14} color="#ffffff" />
              <span>Publikasikan Event Baru</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: "14px" }}>
            {events.map((evt) => (
              <div
                key={evt.id}
                style={{
                  background: "var(--bx-surface, #FFFFFF)",
                  border: "1px solid var(--bx-border)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 6px rgba(10, 46, 82, 0.04)",
                }}
              >
                <div style={{ padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", background: "var(--bx-bg-alt)", borderRadius: "4px", color: "var(--brand)" }}>
                      {evt.type}
                    </span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", background: evt.status === "Live" ? "#FEE2E2" : "#D1FAE5", color: evt.status === "Live" ? "#DC2626" : "#065F46", borderRadius: "10px" }}>
                      {evt.status}
                    </span>
                  </div>

                  <h3 style={{ margin: "4px 0 6px", fontSize: "1.05rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                    {evt.title}
                  </h3>

                  <div style={{ fontSize: "0.78rem", color: "var(--ink)", marginBottom: "4px" }}>
                    Speaker: <strong>{evt.speaker}</strong>
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "var(--muted)", marginBottom: "10px" }}>
                    📅 {evt.date} • ⏰ {evt.time}
                  </div>

                  <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.4 }}>
                    {evt.description}
                  </p>
                </div>

                <div style={{ padding: "10px 16px", background: "var(--bx-bg-alt)", borderTop: "1px solid var(--bx-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem" }}>
                    Peserta: <strong>{evt.attendeesCount} / {evt.quota}</strong>
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(evt.id)}
                      style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "#DC2626", fontSize: "0.72rem", cursor: "pointer" }}
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Link meeting: ${evt.meetingUrl || "Belum ada link"}`)}
                      style={{ padding: "4px 10px", borderRadius: "4px", border: "none", background: "var(--brand)", color: "#ffffff", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer" }}
                    >
                      Buka Link
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PENDAFTAR & PRESENSI QR */}
      {/* ============================================================== */}
      {activeTab === "peserta" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Presensi kehadiran peserta event menggunakan scan tiket QR code atau verifikasi manual.
            </span>
            <button
              type="button"
              onClick={() => alert("Email broadcast pengingat H-1 berhasil dikirimkan ke seluruh pendaftar!")}
              style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
            >
              Broadcast Email Pengingat
            </button>
          </div>

          <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px" }}>Nama Peserta</th>
                  <th style={{ padding: "10px 14px" }}>Email</th>
                  <th style={{ padding: "10px 14px" }}>Kode Tiket</th>
                  <th style={{ padding: "10px 14px" }}>Status Kehadiran</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi Presensi</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((att) => (
                  <tr key={att.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--brand)" }}>{att.studentName}</td>
                    <td style={{ padding: "10px 14px", color: "var(--muted)" }}>{att.studentEmail}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <code style={{ background: "var(--bx-bg-alt)", padding: "2px 6px", borderRadius: "4px" }}>{att.ticketCode}</code>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: att.status === "hadir" ? "#D1FAE5" : "#FEF3C7",
                          color: att.status === "hadir" ? "#065F46" : "#B45309",
                          textTransform: "uppercase",
                        }}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => handleToggleCheckin(att.id)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "4px",
                          border: "none",
                          background: att.status === "hadir" ? "var(--bx-bg-alt)" : "#059669",
                          color: att.status === "hadir" ? "var(--ink)" : "#ffffff",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {att.status === "hadir" ? "Batal Hadir" : "Check-in Hadir"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LIVE & ARSIP RECORDING */}
      {/* ============================================================== */}
      {activeTab === "live" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "0.82rem" }}>
          <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ margin: "0 0 10px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Streaming Studio &amp; Webinar Live
            </h3>
            <p style={{ color: "var(--muted)", margin: "0 0 12px" }}>
              Sesi live streaming otomatis dihubungkan ke player browser siswa tanpa perlu install aplikasi eksternal.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ padding: "8px 10px", background: "var(--bx-bg-alt)", borderRadius: "6px" }}>
                <div>Status Studio: <strong style={{ color: "#DC2626" }}>● On Air (Live)</strong></div>
                <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>Masterclass Next.js 16 (185 pemirsa aktif)</div>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ margin: "0 0 10px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Arsip Rekaman Selesai
            </h3>
            <p style={{ color: "var(--muted)", margin: "0 0 12px" }}>
              Publikasikan rekaman sesi webinar yang telah rampung ke dalam library kelas agar dapat ditonton ulang siswa.
            </p>
            <button
              type="button"
              onClick={() => alert("Rekaman webinar berhasil diunggah ke katalog materi kelas!")}
              style={{ padding: "8px 14px", borderRadius: "6px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}
            >
              Masukkan Rekaman ke Library Kelas
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH EVENT */}
      {/* ============================================================== */}
      {showAddEventModal && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "rgba(10,46,82,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "10px", padding: "24px", maxWidth: "460px", width: "100%", fontSize: "0.82rem" }}>
            <h3 style={{ margin: "0 0 12px", color: "var(--brand)" }}>Publikasikan Event / Webinar Baru</h3>
            <form onSubmit={handleAddEvent} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Judul Event</label>
                <input type="text" required value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} placeholder="Misal: Workshop Hands-on AI Agent" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Tipe Event</label>
                  <select value={newEventType} onChange={(e) => setNewEventType(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}>
                    <option value="Webinar">Webinar Online</option>
                    <option value="Workshop">Workshop Praktik</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Pembicara (Speaker)</label>
                  <input type="text" value={newEventSpeaker} onChange={(e) => setNewEventSpeaker(e.target.value)} placeholder="Misal: Rian Maulana, S.T." style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Tanggal Pelaksanaan</label>
                <input type="text" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowAddEventModal(false)} style={{ padding: "8px 14px", border: "1px solid var(--bx-border)", background: "transparent", borderRadius: "6px" }}>Batal</button>
                <button type="submit" style={{ padding: "8px 16px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, borderRadius: "6px" }}>Simpan &amp; Publikasikan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
