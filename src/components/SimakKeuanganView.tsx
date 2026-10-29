"use client";

import React, { useState, useEffect, useMemo } from "react";
import FlatIcon from "./FlatIcon";
import { LmsTransaction, LmsInstructorPayout, LmsMateriFeeShare, LmsAcademicTeam } from "../types/simak";
import { MOCK_TRANSACTIONS, MOCK_PAYOUTS, MOCK_MATERI_FEE_SHARES, MOCK_ACADEMIC_STAFF } from "../data/simakMockData";

const DEFAULT_ACADEMIC_TEAM: LmsAcademicTeam = {
  curriculumTeam: "Tim Kurikulum Akademik Anvieo",
  curriculumAuthor: "Dr. Maya Anggraini",
  curriculumAuthorAvatar: "/alumni/alumni_2.jpg",
  curriculumAuthorRole: "Lead Curriculum Architect",
  instructorName: "Prof. Budi Rahardjo, Ph.D.",
  instructorAvatar: "/alumni/alumni_1.jpg",
  instructorRole: "Lead Academic Instructor",
  reviewerName: "Rian Maulana, M.Kom.",
  reviewerAvatar: "/alumni/alumni_3.jpg",
  reviewerRole: "Principal Code Reviewer",
  qaValidatorName: "Dr. Ir. Hendra Prasetyo",
};

type FinanceTab = "transaksi" | "laporan" | "bagi-hasil-materi" | "payout" | "rekening";

interface SimakKeuanganViewProps {
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function SimakKeuanganView({
  sidebarCollapsed = false,
  onToggleSidebar,
}: SimakKeuanganViewProps) {
  const [activeTab, setActiveTab] = useState<FinanceTab>("transaksi");

  // State collections
  const [transactions, setTransactions] = useState<LmsTransaction[]>(MOCK_TRANSACTIONS);
  const [payouts, setPayouts] = useState<LmsInstructorPayout[]>(MOCK_PAYOUTS);
  const [materiFeeShares, setMateriFeeShares] = useState<LmsMateriFeeShare[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("simak_materi_fee_shares");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return MOCK_MATERI_FEE_SHARES;
  });

  // Filters for Transactions
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Pagination for Transactions Table
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Sliders
  const [selectedInvoiceTrx, setSelectedInvoiceTrx] = useState<LmsTransaction | null>(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<LmsTransaction | null>(null);
  const [approvingTrx, setApprovingTrx] = useState<LmsTransaction | null>(null);
  const [refundingTrx, setRefundingTrx] = useState<LmsTransaction | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [selectedPayoutProof, setSelectedPayoutProof] = useState<LmsInstructorPayout | null>(null);
  const [showCreatePayoutModal, setShowCreatePayoutModal] = useState(false);

  // State for Editing Materi Fee Share (95% Slider Drawer)
  const [editingFeeShare, setEditingFeeShare] = useState<LmsMateriFeeShare | null>(null);
  const [isEditingFeeShareOpen, setIsEditingFeeShareOpen] = useState(false);
  const [feeFilterType, setFeeFilterType] = useState<string>("all");
  const [feeSearch, setFeeSearch] = useState<string>("");
  const [dbNotification, setDbNotification] = useState<string | null>(null);

  // Hover state for charts
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null);

  // New Payout Form
  const [newPayInstructor, setNewPayInstructor] = useState("Prof. Budi Rahardjo, Ph.D.");
  const [newPayPeriod, setNewPayPeriod] = useState("Oktober 2026");
  const [newPaySales, setNewPaySales] = useState(25000000);
  const [newPayRate, setNewPayRate] = useState(70);
  const [newPayBank, setNewPayBank] = useState("BCA 883-091-2811");
  const [newPayHasNpwp, setNewPayHasNpwp] = useState(true);

  // Save fee shares to localStorage whenever changed
  const saveFeeSharesToStorage = (updated: LmsMateriFeeShare[]) => {
    setMateriFeeShares(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("simak_materi_fee_shares", JSON.stringify(updated));
    }
  };

  // Handlers for Transactions
  const handleApproveTransaction = (trxId: string) => {
    const updated = transactions.map((t) =>
      t.id === trxId
        ? { ...t, status: "paid" as const, paidAt: "Hari ini, Baru saja diverifikasi" }
        : t
    );
    setTransactions(updated);
    setApprovingTrx(null);
    alert("Pembayaran berhasil diverifikasi! Hak akses kelas otomatis terbuka untuk siswa.");
  };

  const handleExecuteRefund = () => {
    if (!refundingTrx) return;
    const updated = transactions.map((t) =>
      t.id === refundingTrx.id
        ? { ...t, status: "refunded" as const, refundReason: refundReason || "Pengembalian dana diproses admin." }
        : t
    );
    setTransactions(updated);
    setRefundingTrx(null);
    setRefundReason("");
    alert("Refund dana berhasil diproses. Status order diperbarui menjadi REFUNDED.");
  };

  const handleMarkPayoutPaid = (payoutId: string) => {
    setPayouts(
      payouts.map((p) =>
        p.id === payoutId
          ? { ...p, status: "paid", paidAt: "Hari ini, 18:00 WIB" }
          : p
      )
    );
    alert("Bagi hasil komisi instruktur telah ditandai LUNAS dan bukti transfer dikirimkan.");
  };

  const handleCreatePayout = (e: React.FormEvent) => {
    e.preventDefault();
    const grossShare = (newPaySales * newPayRate) / 100;
    const taxRate = newPayHasNpwp ? 0.025 : 0.05;
    const taxAmount = grossShare * taxRate;
    const netPayable = grossShare - taxAmount;

    const newP: LmsInstructorPayout = {
      id: `pay-${Date.now()}`,
      instructorId: `inst-${Date.now()}`,
      instructorName: newPayInstructor,
      instructorEmail: `${newPayInstructor.toLowerCase().replace(/[^a-z]/g, "")}@anvieo.ac.id`,
      instructorAvatar: "/alumni/alumni_1.jpg",
      period: newPayPeriod,
      totalSales: Number(newPaySales),
      commissionRate: Number(newPayRate),
      payableAmount: Math.round(netPayable),
      bankAccount: newPayBank,
      status: "pending",
    };

    setPayouts([newP, ...payouts]);
    setShowCreatePayoutModal(false);
    alert("Pengajuan payout berhasil dibuat dan masuk antrean transfer keuangan!");
  };

  const handleDeletePayout = (payoutId: string) => {
    if (confirm("Batalkan dan hapus pengajuan payout ini?")) {
      setPayouts(payouts.filter((p) => p.id !== payoutId));
    }
  };

  const handleExportAccountingCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["No Faktur,Tanggal,Nama Siswa,Email,Item,Tipe,Nominal,Metode,Status"]
        .concat(
          transactions.map(
            (t) =>
              `"${t.orderNumber}","${t.createdAt}","${t.studentName}","${t.studentEmail}","${t.itemName}","${t.itemType}",${t.amount},"${t.paymentMethod}","${t.status}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_keuangan_lms_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler for Saving Fee Share
  const handleSaveFeeShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeeShare) return;

    // Validate percentage sum
    const totalPct =
      editingFeeShare.instructorSharePct +
      editingFeeShare.reviewerSharePct +
      editingFeeShare.infrastructureSharePct +
      editingFeeShare.platformOpsSharePct;

    if (totalPct !== 100) {
      alert(`Total persentase harus 100%! Saat ini: ${totalPct}%`);
      return;
    }

    const calculatedInstructorFee = Math.round((editingFeeShare.unitPrice * editingFeeShare.instructorSharePct) / 100);
    const calculatedReviewerFee = Math.round((editingFeeShare.unitPrice * editingFeeShare.reviewerSharePct) / 100);
    const calculatedInfraFee = Math.round((editingFeeShare.unitPrice * editingFeeShare.infrastructureSharePct) / 100);
    const calculatedOpsFee = Math.round((editingFeeShare.unitPrice * editingFeeShare.platformOpsSharePct) / 100);
    const totalEstimatedPool = editingFeeShare.unitPrice * editingFeeShare.targetQuestionsOrSubmissions;

    const updatedRecord: LmsMateriFeeShare = {
      ...editingFeeShare,
      calculatedInstructorFee,
      calculatedReviewerFee,
      calculatedInfraFee,
      calculatedOpsFee,
      totalEstimatedPool,
      lastUpdated: "Hari ini (Tersimpan di DB)",
      dbSyncStatus: "synced",
    };

    const exists = materiFeeShares.some((m) => m.id === updatedRecord.id);
    let updatedList: LmsMateriFeeShare[];
    if (exists) {
      updatedList = materiFeeShares.map((m) => (m.id === updatedRecord.id ? updatedRecord : m));
    } else {
      updatedList = [updatedRecord, ...materiFeeShares];
    }

    saveFeeSharesToStorage(updatedList);
    setIsEditingFeeShareOpen(false);
    setEditingFeeShare(null);

    // Show temporary notification
    setDbNotification("Skema bagi hasil materi & fee tiap soal berhasil disimpan ke database PostgreSQL (`simak_materi_revenue_sharing`)!");
    setTimeout(() => setDbNotification(null), 5000);
  };

  // Filter logic for Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.orderNumber.toLowerCase().includes(q) ||
        t.studentName.toLowerCase().includes(q) ||
        t.itemName.toLowerCase().includes(q)
      );
    });
  }, [transactions, statusFilter, search]);

  // Paginated Transactions
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;

  const totalGrossRevenue = transactions
    .filter((t) => t.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPendingRevenue = transactions
    .filter((t) => t.status === "pending")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalRefundedAmount = transactions
    .filter((t) => t.status === "refunded")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const subtotalVisiblePaid = paginatedTransactions
    .filter((t) => t.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Filtered Fee Shares
  const filteredFeeShares = useMemo(() => {
    return materiFeeShares.filter((m) => {
      if (feeFilterType !== "all" && m.materiType !== feeFilterType) return false;
      if (!feeSearch) return true;
      const q = feeSearch.toLowerCase();
      return (
        m.materiTitle.toLowerCase().includes(q) ||
        m.courseTitle.toLowerCase().includes(q)
      );
    });
  }, [materiFeeShares, feeFilterType, feeSearch]);

  // Total pool calculation for Fee Shares
  const totalPoolFeeShares = useMemo(() => {
    return materiFeeShares.reduce((acc, curr) => acc + curr.totalEstimatedPool, 0);
  }, [materiFeeShares]);

  // Bar Chart Data for Laporan Omset
  const monthlyRevenueData = [
    { month: "Mei 2026", amount: 18400000, target: 20000000, trxCount: 22, growth: "+14.2%" },
    { month: "Juni 2026", amount: 22100000, target: 22000000, trxCount: 27, growth: "+20.1%" },
    { month: "Juli 2026", amount: 26800000, target: 25000000, trxCount: 34, growth: "+21.3%" },
    { month: "Agustus 2026", amount: 29500000, target: 28000000, trxCount: 37, growth: "+10.1%" },
    { month: "September 2026", amount: 31200000, target: 30000000, trxCount: 39, growth: "+5.8%" },
    { month: "Oktober 2026", amount: 34850000, target: 35000000, trxCount: 42, growth: "+11.7%" },
  ];
  const maxBarAmount = 40000000;

  // Pie Chart Data for Distribusi Pendapatan per Kategori
  const categoryRevenueData = [
    { name: "Web Development & Fullstack", amount: 54200000, pct: 42, color: "#0A2E52", students: 142 },
    { name: "Artificial Intelligence & Data", amount: 44800000, pct: 35, color: "#C9962E", students: 118 },
    { name: "Cloud & DevOps Engineering", amount: 18600000, pct: 15, color: "#059669", students: 64 },
    { name: "UI/UX & Product Design", amount: 10850000, pct: 8, color: "#7C3AED", students: 38 },
  ];
  const totalCategoryRevenue = categoryRevenueData.reduce((acc, curr) => acc + curr.amount, 0);

  // Helper for generating SVG Donut / Pie paths
  const pieSlices = useMemo(() => {
    let cumulativeAngle = -Math.PI / 2; // start at top (12 o'clock)
    const centerX = 120;
    const centerY = 120;
    const outerRadius = 100;
    const innerRadius = 55;

    return categoryRevenueData.map((cat, idx) => {
      const sliceAngle = (cat.pct / 100) * 2 * Math.PI;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + sliceAngle;
      cumulativeAngle = endAngle;

      const x1 = centerX + outerRadius * Math.cos(startAngle);
      const y1 = centerY + outerRadius * Math.sin(startAngle);
      const x2 = centerX + outerRadius * Math.cos(endAngle);
      const y2 = centerY + outerRadius * Math.sin(endAngle);

      const x3 = centerX + innerRadius * Math.cos(endAngle);
      const y3 = centerY + innerRadius * Math.sin(endAngle);
      const x4 = centerX + innerRadius * Math.cos(startAngle);
      const y4 = centerY + innerRadius * Math.sin(startAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        "Z",
      ].join(" ");

      return {
        ...cat,
        pathData,
        idx,
      };
    });
  }, [categoryRevenueData]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* DB Sync Notification Toast */}
      {dbNotification && (
        <div
          style={{
            padding: "10px 16px",
            background: "#ECFDF5",
            border: "1px solid #059669",
            borderRadius: "8px",
            color: "#065F46",
            fontSize: "0.82rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(5, 150, 105, 0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FlatIcon type="check" size={16} color="#059669" />
            <span>{dbNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setDbNotification(null)}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#065F46", fontSize: "0.8rem", fontWeight: 700 }}
          >
            Tutup
          </button>
        </div>
      )}

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
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "0.7rem",
                padding: "2px 8px",
                borderRadius: "4px",
                background: "#059669",
                color: "#ffffff",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Kasir &amp; Finansial
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Payment Gateway Midtrans / Xendit &amp; Bagi Hasil Instruktur, Reviewer &amp; Infrastruktur
            </span>
            {sidebarCollapsed && (
              <span
                style={{
                  fontSize: "0.68rem",
                  padding: "1px 6px",
                  borderRadius: "3px",
                  background: "rgba(201, 150, 46, 0.12)",
                  color: "var(--gold-2)",
                  fontWeight: 700,
                }}
              >
                Sidebar Minimalis Aktif (68px)
              </span>
            )}
          </div>
          <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-heading)", margin: "4px 0 1px", color: "var(--brand)" }}>
            Manajemen Keuangan, Transaksi &amp; Revenue Sharing
          </h2>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
            Pantau arus kas masuk dari pendaftaran kelas/langganan, proses refund garansi, dan kelola skema bagi hasil biaya per materi/soal.
          </p>
        </div>

        {/* Tab & Action Controls */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Minimalist Sidebar Toggle Button */}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              title={sidebarCollapsed ? "Perluas menu samping" : "Kecilkan menu samping jadi mode minimalis"}
              style={{
                padding: "6px 10px",
                borderRadius: "5px",
                border: "1px solid var(--bx-border)",
                background: sidebarCollapsed ? "var(--bx-bg-alt)" : "var(--bx-surface)",
                fontSize: "0.74rem",
                fontWeight: 600,
                color: sidebarCollapsed ? "var(--brand)" : "var(--ink)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FlatIcon type={sidebarCollapsed ? "chevron-right" : "chevron-left"} size={14} />
              <span>{sidebarCollapsed ? "Perluas Menu Samping" : "Menu Samping Minimalis"}</span>
            </button>
          )}

          {/* Tab Navigation */}
          <div
            style={{
              display: "flex",
              background: "var(--bx-bg-alt, #f4f6f8)",
              padding: "3px",
              borderRadius: "6px",
              border: "1px solid var(--bx-border)",
              gap: "4px",
            }}
          >
            {[
              { id: "transaksi", label: `Transaksi (${transactions.length})` },
              { id: "laporan", label: "Laporan Omset & Distribusi" },
              { id: "bagi-hasil-materi", label: `Bagi Hasil Materi & Fee Soal (${materiFeeShares.length})` },
              { id: "payout", label: `Bagi Hasil Instruktur (${payouts.length})` },
              { id: "rekening", label: "Rekening & Gateway" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as FinanceTab)}
                style={{
                  padding: "6px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  background: activeTab === tab.id ? "var(--brand)" : "transparent",
                  color: activeTab === tab.id ? "#ffffff" : "var(--ink)",
                  transition: "all 0.15s ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportAccountingCSV}
            style={{
              padding: "7px 12px",
              borderRadius: "6px",
              border: "1px solid var(--bx-border)",
              background: "var(--bx-surface)",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FlatIcon type="clipboard" size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: TRANSAKSI SISWA (DENGAN AVATAR & STICKY FOOTER) */}
      {/* ============================================================== */}
      {activeTab === "transaksi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Summary Metric Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
            <div style={{ padding: "12px 16px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Total Omset Diterima</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#065F46", margin: "2px 0" }}>
                Rp {totalGrossRevenue.toLocaleString("id-ID")}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Dari seluruh transaksi berstatus PAID</div>
            </div>

            <div style={{ padding: "12px 16px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Menunggu Pembayaran</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#B45309", margin: "2px 0" }}>
                Rp {totalPendingRevenue.toLocaleString("id-ID")}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Menunggu transfer / webhook gateway</div>
            </div>

            <div style={{ padding: "12px 16px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Total Dana Di-Refund</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#DC2626", margin: "2px 0" }}>
                Rp {totalRefundedAmount.toLocaleString("id-ID")}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Garansi kepuasan 7 hari</div>
            </div>
          </div>

          {/* Filters Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              padding: "10px 14px",
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Cari faktur, nama siswa, item..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "6px 10px 6px 30px",
                    borderRadius: "5px",
                    border: "1px solid var(--bx-border)",
                    fontSize: "0.76rem",
                    width: "240px",
                    background: "var(--bx-bg-alt)",
                  }}
                />
                <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>
                  <FlatIcon type="search" size={14} />
                </span>
              </div>

              <div style={{ display: "flex", gap: "4px" }}>
                {[
                  { id: "all", label: "Semua" },
                  { id: "paid", label: "Paid" },
                  { id: "pending", label: "Pending" },
                  { id: "refunded", label: "Refunded" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setStatusFilter(s.id);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      border: statusFilter === s.id ? "1px solid var(--gold)" : "1px solid var(--bx-border)",
                      background: statusFilter === s.id ? "var(--bx-bg-alt)" : "transparent",
                      color: statusFilter === s.id ? "var(--brand)" : "var(--muted)",
                      fontWeight: statusFilter === s.id ? 700 : 500,
                      fontSize: "0.72rem",
                      cursor: "pointer",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Menampilkan <strong>{filteredTransactions.length}</strong> transaksi (Klik avatar siswa untuk detail keuangan)
            </div>
          </div>

          {/* Transactions Table with Sticky Footer Container */}
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Scrollable Table Area */}
            <div style={{ overflowX: "auto", maxHeight: "560px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left", position: "sticky", top: 0, zIndex: 10 }}>
                    <th style={{ padding: "10px 14px" }}>No. Faktur</th>
                    <th style={{ padding: "10px 14px" }}>Siswa / Pembeli (Avatar)</th>
                    <th style={{ padding: "10px 14px" }}>Item / Layanan</th>
                    <th style={{ padding: "10px 14px" }}>Nominal</th>
                    <th style={{ padding: "10px 14px" }}>Metode Bayar</th>
                    <th style={{ padding: "10px 14px" }}>Status</th>
                    <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((trx) => (
                    <tr key={trx.id} style={{ borderBottom: "1px solid var(--bx-border)", transition: "background 0.1s ease" }}>
                      <td style={{ padding: "10px 14px" }}>
                        <code style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--brand)" }}>
                          {trx.orderNumber}
                        </code>
                        <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{trx.createdAt}</div>
                      </td>

                      {/* Clickable Student Avatar & Information */}
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedStudentDetail(trx)}
                            title={`Lihat profil keuangan ${trx.studentName}`}
                            style={{
                              padding: 0,
                              background: "none",
                              border: "2px solid var(--bx-border)",
                              borderRadius: "50%",
                              width: "38px",
                              height: "38px",
                              overflow: "hidden",
                              cursor: "pointer",
                              position: "relative",
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={trx.studentAvatar || "/alumni/alumni_1.jpg"}
                              alt={trx.studentName}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/alumni/alumni_1.jpg";
                              }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                bottom: "0px",
                                right: "0px",
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#10B981",
                                border: "1.5px solid #ffffff",
                              }}
                            />
                          </button>
                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedStudentDetail(trx)}
                              style={{
                                padding: 0,
                                background: "none",
                                border: "none",
                                fontWeight: 700,
                                color: "var(--brand)",
                                fontSize: "0.82rem",
                                textAlign: "left",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <span>{trx.studentName}</span>
                              <span style={{ fontSize: "0.62rem", padding: "1px 4px", borderRadius: "3px", background: "rgba(10,46,82,0.08)", color: "var(--brand)" }}>
                                Siswa
                              </span>
                            </button>
                            <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{trx.studentEmail}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ fontWeight: 600 }}>{trx.itemName}</div>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            padding: "1px 6px",
                            borderRadius: "3px",
                            background: "var(--bx-bg-alt)",
                            color: "var(--gold-2)",
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          {trx.itemType}
                        </span>
                      </td>

                      <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--brand)" }}>
                        Rp {trx.amount.toLocaleString("id-ID")}
                      </td>

                      <td style={{ padding: "10px 14px", fontSize: "0.76rem" }}>
                        {trx.paymentMethod}
                      </td>

                      <td style={{ padding: "10px 14px" }}>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background:
                              trx.status === "paid" ? "#D1FAE5" :
                              trx.status === "pending" ? "#FEF3C7" : "#FEE2E2",
                            color:
                              trx.status === "paid" ? "#065F46" :
                              trx.status === "pending" ? "#B45309" : "#DC2626",
                            textTransform: "uppercase",
                          }}
                        >
                          {trx.status}
                        </span>
                      </td>

                      <td style={{ padding: "10px 14px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "4px" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceTrx(trx)}
                            title="Lihat Invoice Resmi"
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-bg-alt)",
                              fontSize: "0.72rem",
                              cursor: "pointer",
                              color: "var(--brand)",
                            }}
                          >
                            Invoice
                          </button>

                          {trx.status === "pending" && (
                            <button
                              type="button"
                              onClick={() => setApprovingTrx(trx)}
                              title="Verifikasi Manual"
                              style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                border: "none",
                                background: "#059669",
                                color: "#ffffff",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Approve
                            </button>
                          )}

                          {trx.status === "paid" && (
                            <button
                              type="button"
                              onClick={() => setRefundingTrx(trx)}
                              title="Proses Refund"
                              style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                border: "1px solid #FCA5A5",
                                background: "transparent",
                                color: "#DC2626",
                                fontSize: "0.72rem",
                                cursor: "pointer",
                              }}
                            >
                              Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedTransactions.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>
                        Tidak ada transaksi yang cocok dengan kriteria pencarian/filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Sticky Table Footer Navigation Bar */}
            <div
              style={{
                position: "sticky",
                bottom: 0,
                zIndex: 15,
                background: "var(--bx-surface, #FFFFFF)",
                borderTop: "2px solid var(--bx-border)",
                padding: "10px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                boxShadow: "0 -3px 10px rgba(10, 46, 82, 0.05)",
              }}
            >
              {/* Left: Summary Count & Subtotal */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.78rem" }}>
                <span style={{ color: "var(--muted)" }}>
                  Menampilkan <strong>{(currentPage - 1) * pageSize + 1}</strong> - <strong>{Math.min(currentPage * pageSize, filteredTransactions.length)}</strong> dari <strong>{filteredTransactions.length}</strong> transaksi
                </span>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: "#ECFDF5",
                    color: "#065F46",
                    fontWeight: 700,
                    fontSize: "0.74rem",
                  }}
                >
                  Subtotal Paid Halaman Ini: Rp {subtotalVisiblePaid.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Center: Pagination Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    border: "1px solid var(--bx-border)",
                    background: currentPage <= 1 ? "var(--bx-bg-alt)" : "var(--bx-surface)",
                    color: currentPage <= 1 ? "var(--muted)" : "var(--ink)",
                    fontSize: "0.74rem",
                    cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                    fontWeight: 600,
                  }}
                >
                  Sebelumnya
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    style={{
                      padding: "4px 9px",
                      borderRadius: "4px",
                      border: currentPage === p ? "1px solid var(--brand)" : "1px solid var(--bx-border)",
                      background: currentPage === p ? "var(--brand)" : "var(--bx-surface)",
                      color: currentPage === p ? "#FFFFFF" : "var(--ink)",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    border: "1px solid var(--bx-border)",
                    background: currentPage >= totalPages ? "var(--bx-bg-alt)" : "var(--bx-surface)",
                    color: currentPage >= totalPages ? "var(--muted)" : "var(--ink)",
                    fontSize: "0.74rem",
                    cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                    fontWeight: 600,
                  }}
                >
                  Selanjutnya
                </button>

                {/* Per Page Dropdown */}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid var(--bx-border)",
                    fontSize: "0.74rem",
                    background: "var(--bx-bg-alt)",
                    color: "var(--ink)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <option value={5}>5 / halaman</option>
                  <option value={10}>10 / halaman</option>
                  <option value={20}>20 / halaman</option>
                  <option value={50}>50 / halaman</option>
                </select>
              </div>

              {/* Right: Quick Table Actions */}
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => alert("Menyinkronkan status webhook payment gateway Midtrans...")}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "4px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-surface)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FlatIcon type="settings" size={12} />
                  <span>Sinkronisasi Webhook</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportAccountingCSV}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "4px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-surface)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FlatIcon type="clipboard" size={12} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: LAPORAN OMSET (BAR CHART) & DISTRIBUSI PENDAPATAN (PIE CHART) */}
      {/* ============================================================== */}
      {activeTab === "laporan" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Top KPI Cards for Laporan */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
            <div style={{ padding: "12px 16px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Total Omset Semester 2</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--brand)", margin: "2px 0" }}>
                Rp {monthlyRevenueData.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString("id-ID")}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 700 }}>+89.4% sejak Mei 2026</div>
            </div>

            <div style={{ padding: "12px 16px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Rata-rata Omset Bulanan</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--gold-2)", margin: "2px 0" }}>
                Rp {Math.round(monthlyRevenueData.reduce((acc, curr) => acc + curr.amount, 0) / monthlyRevenueData.length).toLocaleString("id-ID")}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Konsisten meningkat tiap bulan</div>
            </div>

            <div style={{ padding: "12px 16px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Omset Tertinggi (Oktober 2026)</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#059669", margin: "2px 0" }}>
                Rp 34.850.000
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>42 Transaksi sukses terverifikasi</div>
            </div>

            <div style={{ padding: "12px 16px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Kategori Kontributor Utama</div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--brand)", margin: "4px 0" }}>
                Web Dev (42%)
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Rp 54.200.000 dari 142 pendaftar</div>
            </div>
          </div>

          {/* Grid Layout: Bar Chart (Left) & Pie Chart (Right) */}
          <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: "16px" }}>
            {/* 1. BAR CHART: Tren Pendapatan Bulanan */}
            <div
              style={{
                background: "var(--bx-surface, #FFFFFF)",
                border: "1px solid var(--bx-border)",
                borderRadius: "10px",
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                    Laporan Omset Bulanan (Bar Chart)
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "0.74rem", color: "var(--muted)" }}>
                    Visualisasi grafik batang pendapatan aktual vs target (Mei – Oktober 2026).
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.72rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--brand)" }} />
                    <span>Realisasi Omset</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--gold)" }} />
                    <span>Bulan Berjalan</span>
                  </div>
                </div>
              </div>

              {/* Interactive SVG Bar Chart */}
              <div style={{ position: "relative", width: "100%", height: "260px", background: "var(--bx-bg-alt)", borderRadius: "8px", padding: "12px 14px 6px" }}>
                <svg
                  viewBox="0 0 620 230"
                  style={{ width: "100%", height: "100%", overflow: "visible" }}
                >
                  <defs>
                    <linearGradient id="brandBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0A2E52" />
                      <stop offset="100%" stopColor="#1E4E79" />
                    </linearGradient>
                    <linearGradient id="goldBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E5B246" />
                      <stop offset="100%" stopColor="#C9962E" />
                    </linearGradient>
                  </defs>

                  {/* Y-Axis Grid Lines & Labels */}
                  {[0, 10000000, 20000000, 30000000, 40000000].map((val) => {
                    const y = 190 - (val / maxBarAmount) * 160;
                    return (
                      <g key={val}>
                        <line
                          x1="45"
                          y1={y}
                          x2="610"
                          y2={y}
                          stroke="rgba(10, 46, 82, 0.1)"
                          strokeDasharray={val === 0 ? "none" : "3 3"}
                        />
                        <text
                          x="40"
                          y={y + 4}
                          textAnchor="end"
                          fontSize="9"
                          fill="var(--muted)"
                          fontWeight="600"
                        >
                          {val === 0 ? "Rp 0" : `${val / 1000000}Jt`}
                        </text>
                      </g>
                    );
                  })}

                  {/* Vertical Bars */}
                  {monthlyRevenueData.map((d, idx) => {
                    const barWidth = 46;
                    const barSpacing = 92;
                    const x = 70 + idx * barSpacing;
                    const barHeight = (d.amount / maxBarAmount) * 160;
                    const y = 190 - barHeight;
                    const isCurrentMonth = idx === monthlyRevenueData.length - 1;
                    const isHovered = hoveredBarIndex === idx;

                    return (
                      <g
                        key={d.month}
                        onMouseEnter={() => setHoveredBarIndex(idx)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Target Line marker */}
                        <line
                          x1={x - 4}
                          y1={190 - (d.target / maxBarAmount) * 160}
                          x2={x + barWidth + 4}
                          y2={190 - (d.target / maxBarAmount) * 160}
                          stroke="#EF4444"
                          strokeWidth="2"
                          strokeDasharray="2 2"
                        />

                        {/* Bar Rect */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          rx="5"
                          ry="5"
                          fill={isCurrentMonth ? "url(#goldBarGradient)" : "url(#brandBarGradient)"}
                          opacity={isHovered ? 1 : 0.9}
                          filter={isHovered ? "drop-shadow(0px 4px 8px rgba(10,46,82,0.3))" : "none"}
                          style={{ transition: "all 0.2s ease" }}
                        />

                        {/* Value Label on Top of Bar */}
                        <text
                          x={x + barWidth / 2}
                          y={y - 8}
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="800"
                          fill={isCurrentMonth ? "#92400E" : "var(--brand)"}
                        >
                          {(d.amount / 1000000).toFixed(1)}Jt
                        </text>

                        {/* X-Axis Month Label */}
                        <text
                          x={x + barWidth / 2}
                          y="208"
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight={isCurrentMonth ? "800" : "600"}
                          fill={isCurrentMonth ? "var(--brand)" : "var(--muted)"}
                        >
                          {d.month.replace(" 2026", "")}
                        </text>

                        {/* Growth % Tag */}
                        <text
                          x={x + barWidth / 2}
                          y="220"
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="700"
                          fill="#059669"
                        >
                          {d.growth}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Tooltip when hovering a bar */}
                {hoveredBarIndex !== null && (
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      background: "rgba(10, 46, 82, 0.95)",
                      color: "#FFFFFF",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      pointerEvents: "none",
                      zIndex: 20,
                    }}
                  >
                    <div style={{ fontWeight: 800, color: "var(--gold)" }}>
                      {monthlyRevenueData[hoveredBarIndex].month}
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, margin: "2px 0" }}>
                      Rp {monthlyRevenueData[hoveredBarIndex].amount.toLocaleString("id-ID")}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#E2E8F0" }}>
                      Transaksi Berhasil: {monthlyRevenueData[hoveredBarIndex].trxCount} kali | Pertumbuhan: {monthlyRevenueData[hoveredBarIndex].growth}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. PIE CHART: Distribusi Pendapatan per Kategori */}
            <div
              style={{
                background: "var(--bx-surface, #FFFFFF)",
                border: "1px solid var(--bx-border)",
                borderRadius: "10px",
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                  Distribusi Pendapatan per Kategori (Pie Chart)
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.74rem", color: "var(--muted)" }}>
                  Porsi omset berdasarkan bidang ilmu kursus &amp; learning path.
                </p>
              </div>

              {/* SVG Donut / Pie Chart Container */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <div style={{ position: "relative", width: "240px", height: "240px" }}>
                  <svg
                    viewBox="0 0 240 240"
                    style={{ width: "100%", height: "100%", overflow: "visible" }}
                  >
                    {pieSlices.map((slice) => {
                      const isHovered = hoveredPieIndex === slice.idx;
                      return (
                        <path
                          key={slice.name}
                          d={slice.pathData}
                          fill={slice.color}
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                          opacity={hoveredPieIndex === null || isHovered ? 1 : 0.6}
                          transform={isHovered ? "scale(1.04)" : "scale(1)"}
                          transform-origin="120 120"
                          onMouseEnter={() => setHoveredPieIndex(slice.idx)}
                          onMouseLeave={() => setHoveredPieIndex(null)}
                          style={{
                            cursor: "pointer",
                            transition: "all 0.18s ease-in-out",
                          }}
                        />
                      );
                    })}

                    {/* Donut Hole Center Summary */}
                    <circle cx="120" cy="120" r="52" fill="var(--bx-surface, #FFFFFF)" />
                    <text
                      x="120"
                      y="112"
                      textAnchor="middle"
                      fontSize="9"
                      fill="var(--muted)"
                      fontWeight="600"
                    >
                      {hoveredPieIndex !== null ? pieSlices[hoveredPieIndex].name.split("&")[0] : "Total Omset"}
                    </text>
                    <text
                      x="120"
                      y="128"
                      textAnchor="middle"
                      fontSize="12"
                      fill="var(--brand)"
                      fontWeight="800"
                    >
                      {hoveredPieIndex !== null
                        ? `${pieSlices[hoveredPieIndex].pct}%`
                        : "128,45 Jt"}
                    </text>
                    <text
                      x="120"
                      y="140"
                      textAnchor="middle"
                      fontSize="8"
                      fill={hoveredPieIndex !== null ? pieSlices[hoveredPieIndex].color : "#059669"}
                      fontWeight="700"
                    >
                      {hoveredPieIndex !== null
                        ? `Rp ${(pieSlices[hoveredPieIndex].amount / 1000000).toFixed(1)} Jt`
                        : "100% Porsi"}
                    </text>
                  </svg>
                </div>

                {/* Pie Chart Legend Breakdown */}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {categoryRevenueData.map((cat, idx) => (
                    <div
                      key={cat.name}
                      onMouseEnter={() => setHoveredPieIndex(idx)}
                      onMouseLeave={() => setHoveredPieIndex(null)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "5px 8px",
                        borderRadius: "5px",
                        background: hoveredPieIndex === idx ? "var(--bx-bg-alt)" : "transparent",
                        fontSize: "0.74rem",
                        cursor: "pointer",
                        transition: "background 0.1s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 800, color: "var(--brand)" }}>
                          Rp {(cat.amount / 1000000).toFixed(1)} Jt
                        </span>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            padding: "1px 6px",
                            borderRadius: "10px",
                            background: cat.color,
                            color: "#ffffff",
                            fontWeight: 700,
                          }}
                        >
                          {cat.pct}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: BAGI HASIL MATERI & FEE SOAL (DATABASE PERSISTENCE) */}
      {/* ============================================================== */}
      {activeTab === "bagi-hasil-materi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Header & KPI Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
            <div style={{ padding: "12px 16px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Total Estimasi Pool Biaya Materi</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--brand)", margin: "2px 0" }}>
                Rp {totalPoolFeeShares.toLocaleString("id-ID")}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Berdasarkan target submission materi aktif</div>
            </div>

            <div style={{ padding: "12px 16px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Rata-rata Fee Instruktur</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--gold-2)", margin: "2px 0" }}>
                50.8%
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Hak cipta modul &amp; penyusun materi</div>
            </div>

            <div style={{ padding: "12px 16px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Rata-rata Fee Reviewer / Korektor</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#059669", margin: "2px 0" }}>
                30.0%
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Honor per review kode &amp; feedback soal</div>
            </div>

            <div style={{ padding: "12px 16px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Infrastruktur &amp; Cloud Platform</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#7C3AED", margin: "2px 0" }}>
                15.0%
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Server VPS, AI Token, Storage &amp; DB</div>
            </div>
          </div>

          {/* Action & Filter Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              padding: "10px 14px",
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Cari materi, soal, kursus..."
                  value={feeSearch}
                  onChange={(e) => setFeeSearch(e.target.value)}
                  style={{
                    padding: "6px 10px 6px 30px",
                    borderRadius: "5px",
                    border: "1px solid var(--bx-border)",
                    fontSize: "0.76rem",
                    width: "240px",
                    background: "var(--bx-bg-alt)",
                  }}
                />
                <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>
                  <FlatIcon type="search" size={14} />
                </span>
              </div>

              <div style={{ display: "flex", gap: "4px" }}>
                {[
                  { id: "all", label: "Semua Tipe" },
                  { id: "assignment", label: "Tugas Praktik" },
                  { id: "quiz", label: "Kuis Soal" },
                  { id: "capstone", label: "Capstone" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFeeFilterType(f.id)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      border: feeFilterType === f.id ? "1px solid var(--gold)" : "1px solid var(--bx-border)",
                      background: feeFilterType === f.id ? "var(--bx-bg-alt)" : "transparent",
                      color: feeFilterType === f.id ? "var(--brand)" : "var(--muted)",
                      fontWeight: feeFilterType === f.id ? 700 : 500,
                      fontSize: "0.72rem",
                      cursor: "pointer",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "0.74rem", color: "#059669", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#059669", display: "inline-block" }} />
                PostgreSQL Synced (`simak_materi_revenue_sharing`)
              </span>

              <button
                type="button"
                onClick={() => {
                  const newShare: LmsMateriFeeShare = {
                    id: `fee-${Date.now()}`,
                    materiId: `mat-${Date.now()}`,
                    materiTitle: "Tugas Praktik Baru: Implementasi Modul",
                    materiType: "assignment",
                    courseId: "CRS-AI-01",
                    courseTitle: "Engineering Autonomous Multi-Agent AI & FastMCP",
                    unitPrice: 50000,
                    instructorSharePct: 50,
                    reviewerSharePct: 30,
                    infrastructureSharePct: 15,
                    platformOpsSharePct: 5,
                    targetQuestionsOrSubmissions: 100,
                    calculatedInstructorFee: 25000,
                    calculatedReviewerFee: 15000,
                    calculatedInfraFee: 7500,
                    calculatedOpsFee: 2500,
                    totalEstimatedPool: 5000000,
                    lastUpdated: "Hari ini",
                    dbSyncStatus: "synced",
                    academicTeam: DEFAULT_ACADEMIC_TEAM,
                  };
                  setEditingFeeShare(newShare);
                  setIsEditingFeeShareOpen(true);
                }}
                className="portal-btn-primary"
                style={{ padding: "6px 14px", fontSize: "0.75rem", fontWeight: 700, borderRadius: "5px", display: "flex", alignItems: "center", gap: "5px" }}
              >
                <FlatIcon type="plus" size={14} />
                <span>Tambah Skema Fee Materi</span>
              </button>
            </div>
          </div>

          {/* Table of Materi Fee Shares */}
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
              overflowX: "auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px" }}>Materi &amp; Tipe Soal</th>
                  <th style={{ padding: "10px 14px" }}>Tim Kurikulum / Penulis</th>
                  <th style={{ padding: "10px 14px" }}>Instruktur PJ &amp; Fee</th>
                  <th style={{ padding: "10px 14px" }}>Reviewer PJ &amp; Fee</th>
                  <th style={{ padding: "10px 14px" }}>Infrastruktur (%)</th>
                  <th style={{ padding: "10px 14px" }}>Estimasi Total Pool</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi &amp; Simulasi</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeeShares.map((m) => (
                  <tr key={m.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontWeight: 700, color: "var(--brand)" }}>{m.materiTitle}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            padding: "1px 6px",
                            borderRadius: "3px",
                            background: m.materiType === "assignment" ? "rgba(10,46,82,0.1)" : m.materiType === "quiz" ? "rgba(201,150,46,0.15)" : "rgba(5,150,105,0.15)",
                            color: m.materiType === "assignment" ? "var(--brand)" : m.materiType === "quiz" ? "var(--gold-2)" : "#065F46",
                            fontWeight: 700,
                            textTransform: "uppercase",
                          }}
                        >
                          {m.materiType}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                          Target: {m.targetQuestionsOrSubmissions} siswa • Rp {m.unitPrice.toLocaleString("id-ID")}/soal
                        </span>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "2px" }}>
                        {m.courseTitle}
                      </div>
                    </td>

                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.78rem", color: "var(--brand)" }}>
                        {m.academicTeam?.curriculumTeam || "Tim Kurikulum Akademik"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                        <img
                          src={m.academicTeam?.curriculumAuthorAvatar || "/alumni/alumni_2.jpg"}
                          alt={m.academicTeam?.curriculumAuthor || "Author"}
                          style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--gold)" }}
                        />
                        <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                          {m.academicTeam?.curriculumAuthor || "Tim Penyusun"}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <img
                          src={m.academicTeam?.instructorAvatar || "/alumni/alumni_1.jpg"}
                          alt={m.academicTeam?.instructorName || "Instruktur"}
                          style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--gold)" }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.78rem", color: "var(--brand)" }}>
                            {m.academicTeam?.instructorName || "Prof. Budi Rahardjo, Ph.D."}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--gold-2)", fontWeight: 700 }}>
                            {m.instructorSharePct}% (Rp {m.calculatedInstructorFee.toLocaleString("id-ID")}/soal)
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <img
                          src={m.academicTeam?.reviewerAvatar || "/alumni/alumni_3.jpg"}
                          alt={m.academicTeam?.reviewerName || "Reviewer"}
                          style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover", border: "1px solid #059669" }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.78rem", color: "var(--brand)" }}>
                            {m.academicTeam?.reviewerName || "Rian Maulana, M.Kom."}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 700 }}>
                            {m.reviewerSharePct}% (Rp {m.calculatedReviewerFee.toLocaleString("id-ID")}/review)
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontWeight: 800, color: "#7C3AED", fontSize: "0.82rem" }}>{m.infrastructureSharePct}%</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                        Rp {m.calculatedInfraFee.toLocaleString("id-ID")} (Server VPS)
                      </div>
                    </td>

                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontWeight: 800, color: "var(--brand)", fontSize: "0.86rem" }}>
                        Rp {m.totalEstimatedPool.toLocaleString("id-ID")}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "#059669" }}>● {m.dbSyncStatus.toUpperCase()} DB</div>
                    </td>

                    <td style={{ padding: "10px 14px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingFeeShare(m);
                          setIsEditingFeeShareOpen(true);
                        }}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "4px",
                          border: "1px solid var(--bx-border)",
                          background: "var(--bx-bg-alt)",
                          color: "var(--brand)",
                          fontWeight: 700,
                          fontSize: "0.74rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <FlatIcon type="settings" size={13} />
                        <span>Edit Fee &amp; Tim</span>
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
      {/* TAB 4: BAGI HASIL INSTRUKTUR (PAYOUTS) */}
      {/* ============================================================== */}
      {activeTab === "payout" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              padding: "10px 14px",
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
            }}
          >
            <div>
              <strong style={{ fontSize: "0.85rem", color: "var(--brand)" }}>
                Rekapitulasi Bagi Hasil &amp; Pemotongan Pajak PPh 21
              </strong>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                Total <strong>{payouts.length}</strong> pengajuan komisi instruktur terdata.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCreatePayoutModal(true)}
              className="portal-btn-primary"
              style={{ padding: "6px 14px", fontSize: "0.75rem", fontWeight: 700, borderRadius: "5px" }}
            >
              Ajukan Payout Baru
            </button>
          </div>

          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(10, 46, 82, 0.03)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px" }}>Instruktur</th>
                  <th style={{ padding: "10px 14px" }}>Periode</th>
                  <th style={{ padding: "10px 14px" }}>Total Penjualan Kelas</th>
                  <th style={{ padding: "10px 14px" }}>Rate Komisi</th>
                  <th style={{ padding: "10px 14px" }}>Nominal Bersih (Net)</th>
                  <th style={{ padding: "10px 14px" }}>Rekening Transfer</th>
                  <th style={{ padding: "10px 14px" }}>Status</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((pay) => (
                  <tr key={pay.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <img
                          src={pay.instructorAvatar || "/alumni/alumni_1.jpg"}
                          alt={pay.instructorName}
                          style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--brand)" }}>{pay.instructorName}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{pay.instructorEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px", fontWeight: 600 }}>{pay.period}</td>
                    <td style={{ padding: "10px 14px" }}>Rp {pay.totalSales.toLocaleString("id-ID")}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 700 }}>{pay.commissionRate}%</td>
                    <td style={{ padding: "10px 14px", fontWeight: 800, color: "#065F46" }}>
                      Rp {pay.payableAmount.toLocaleString("id-ID")}
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: "0.76rem" }}>
                      <code>{pay.bankAccount}</code>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: pay.status === "paid" ? "#D1FAE5" : "#FEF3C7",
                          color: pay.status === "paid" ? "#065F46" : "#B45309",
                          textTransform: "uppercase",
                        }}
                      >
                        {pay.status === "paid" ? "Sudah Ditransfer" : "Menunggu Transfer"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedPayoutProof(pay)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid var(--bx-border)",
                            background: "var(--bx-bg-alt)",
                            fontSize: "0.72rem",
                            cursor: "pointer",
                            color: "var(--brand)",
                          }}
                        >
                          Bukti / Faktur
                        </button>
                        {pay.status === "pending" ? (
                          <button
                            type="button"
                            onClick={() => handleMarkPayoutPaid(pay.id)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              border: "none",
                              background: "var(--brand)",
                              color: "#ffffff",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Transfer
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleDeletePayout(pay.id)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid #FCA5A5",
                            background: "transparent",
                            color: "#DC2626",
                            fontSize: "0.72rem",
                            cursor: "pointer",
                          }}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: REKENING & GATEWAY */}
      {/* ============================================================== */}
      {activeTab === "rekening" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "0.82rem" }}>
          <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ margin: "0 0 10px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Rekening Bank Penampung Resmi LMS
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ padding: "10px", background: "var(--bx-bg-alt)", borderRadius: "6px" }}>
                <div style={{ fontWeight: 700, color: "var(--brand)" }}>Bank Central Asia (BCA)</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", marginTop: "2px" }}>883-091-2891</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>a.n. PT Anvieo Teknologi Edukasi</div>
              </div>

              <div style={{ padding: "10px", background: "var(--bx-bg-alt)", borderRadius: "6px" }}>
                <div style={{ fontWeight: 700, color: "var(--brand)" }}>Bank Mandiri</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", marginTop: "2px" }}>137-00-9981-229</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>a.n. PT Anvieo Teknologi Edukasi</div>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
            <h3 style={{ margin: "0 0 10px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Status Payment Gateway Otomatis
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--bx-border)" }}>
                <span>Midtrans Snap API</span>
                <strong style={{ color: "#059669" }}>● Terhubung (Production)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--bx-border)" }}>
                <span>BCA Virtual Account</span>
                <strong style={{ color: "#059669" }}>● Aktif Otomatis</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--bx-border)" }}>
                <span>QRIS Dinamis 0.7%</span>
                <strong style={{ color: "#059669" }}>● Aktif Otomatis</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SLIDER DRAWER 95%: DETAIL SISWA & RIWAYAT KEUANGAN (CLICK AVATAR) */}
      {/* ============================================================== */}
      {selectedStudentDetail && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "95vw",
              maxWidth: "95vw",
              height: "100vh",
              background: "var(--bx-surface, #FFFFFF)",
              boxShadow: "-10px 0 30px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bx-bg-alt)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={selectedStudentDetail.studentAvatar || "/alumni/alumni_1.jpg"}
                  alt={selectedStudentDetail.studentName}
                  style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--brand)" }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.15rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                    Profil Finansial &amp; Transaksi Siswa: {selectedStudentDetail.studentName}
                  </h3>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "2px" }}>
                    Email: <strong>{selectedStudentDetail.studentEmail}</strong> | Order Referensi: <code>{selectedStudentDetail.orderNumber}</code>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => alert(`Mengirimkan rekap invoice lengkap ke email ${selectedStudentDetail.studentEmail}...`)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "5px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-surface)",
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Kirim Faktur Email
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudentDetail(null)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "5px",
                    border: "none",
                    background: "var(--brand)",
                    color: "#FFFFFF",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Tutup Drawer
                </button>
              </div>
            </div>

            {/* Drawer Body Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Financial Snapshot */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Total Pembelian (LTV)</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#065F46", margin: "3px 0" }}>
                    Rp {transactions.filter((t) => t.studentEmail === selectedStudentDetail.studentEmail && t.status === "paid").reduce((acc, curr) => acc + curr.amount, 0).toLocaleString("id-ID")}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Nilai akumulasi transaksi sukses</div>
                </div>

                <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Frekuensi Transaksi</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--brand)", margin: "3px 0" }}>
                    {transactions.filter((t) => t.studentEmail === selectedStudentDetail.studentEmail).length} Pesanan
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Riwayat order di portal LMS</div>
                </div>

                <div style={{ padding: "14px", background: "var(--bx-bg-alt)", borderRadius: "8px", border: "1px solid var(--bx-border)" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>Metode Bayar Favorit</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gold-2)", margin: "3px 0" }}>
                    {selectedStudentDetail.paymentMethod}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Terakhir digunakan pada order ini</div>
                </div>
              </div>

              {/* Transaction History for this Student */}
              <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", fontWeight: 700, color: "var(--brand)" }}>
                  Riwayat Transaksi Siswa Ini
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                  <thead>
                    <tr style={{ background: "var(--bx-surface)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                      <th style={{ padding: "10px 14px" }}>No. Faktur</th>
                      <th style={{ padding: "10px 14px" }}>Item / Kursus</th>
                      <th style={{ padding: "10px 14px" }}>Tipe</th>
                      <th style={{ padding: "10px 14px" }}>Nominal</th>
                      <th style={{ padding: "10px 14px" }}>Tanggal</th>
                      <th style={{ padding: "10px 14px" }}>Status</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter((t) => t.studentEmail === selectedStudentDetail.studentEmail)
                      .map((t) => (
                        <tr key={t.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                          <td style={{ padding: "10px 14px" }}>
                            <code>{t.orderNumber}</code>
                          </td>
                          <td style={{ padding: "10px 14px", fontWeight: 600 }}>{t.itemName}</td>
                          <td style={{ padding: "10px 14px", textTransform: "uppercase", fontSize: "0.7rem" }}>{t.itemType}</td>
                          <td style={{ padding: "10px 14px", fontWeight: 700 }}>Rp {t.amount.toLocaleString("id-ID")}</td>
                          <td style={{ padding: "10px 14px", color: "var(--muted)", fontSize: "0.74rem" }}>{t.createdAt}</td>
                          <td style={{ padding: "10px 14px" }}>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: "10px",
                                background: t.status === "paid" ? "#D1FAE5" : "#FEF3C7",
                                color: t.status === "paid" ? "#065F46" : "#B45309",
                              }}
                            >
                              {t.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: "10px 14px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => setSelectedInvoiceTrx(t)}
                              style={{
                                padding: "3px 8px",
                                borderRadius: "4px",
                                border: "1px solid var(--bx-border)",
                                background: "var(--bx-bg-alt)",
                                fontSize: "0.72rem",
                                cursor: "pointer",
                              }}
                            >
                              Buka Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SLIDER DRAWER 95%: EDITOR SKEMA BAGI HASIL MATERI & FEE SOAL */}
      {/* ============================================================== */}
      {isEditingFeeShareOpen && editingFeeShare && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "95vw",
              maxWidth: "95vw",
              height: "100vh",
              background: "var(--bx-surface, #FFFFFF)",
              boxShadow: "-10px 0 30px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header Drawer */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--bx-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bx-bg-alt)",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                  Editor Skema Bagi Hasil Materi &amp; Alokasi Fee per Soal
                </h3>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "2px" }}>
                  Materi: <strong>{editingFeeShare.materiTitle}</strong> | Terhubung langsung dengan skema database PostgreSQL
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditingFeeShareOpen(false)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "5px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-surface)",
                    fontSize: "0.76rem",
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>
              </div>
            </div>

            {/* Drawer Body Form */}
            <form onSubmit={handleSaveFeeShare} style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Basic Materi Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Judul Materi / Tugas / Kuis
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFeeShare.materiTitle}
                    onChange={(e) => setEditingFeeShare({ ...editingFeeShare, materiTitle: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Tipe Materi
                  </label>
                  <select
                    value={editingFeeShare.materiType}
                    onChange={(e) => setEditingFeeShare({ ...editingFeeShare, materiType: e.target.value as any })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  >
                    <option value="assignment">Tugas Praktik Code</option>
                    <option value="quiz">Kuis Pilihan Ganda / Soal</option>
                    <option value="capstone">Capstone Project Akhir</option>
                    <option value="video">Video Pembelajaran Teori</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Kursus / Learning Path
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFeeShare.courseTitle}
                    onChange={(e) => setEditingFeeShare({ ...editingFeeShare, courseTitle: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Pricing & Target Assumptions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", background: "var(--bx-bg-alt)", padding: "16px", borderRadius: "8px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Biaya Alokasi per Soal / Submission Siswa (Rp)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={editingFeeShare.unitPrice}
                    onChange={(e) => setEditingFeeShare({ ...editingFeeShare, unitPrice: Number(e.target.value) })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  />
                  <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                    Nilai pembebanan per submission tugas atau pengerjaan soal
                  </span>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                    Target Siswa / Volume Submission
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingFeeShare.targetQuestionsOrSubmissions}
                    onChange={(e) => setEditingFeeShare({ ...editingFeeShare, targetQuestionsOrSubmissions: Number(e.target.value) })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  />
                  <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                    Estimasi total siswa yang mengerjakan materi ini
                  </span>
                </div>
              </div>

              {/* Academic Attribution & Team Responsible */}
              <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
                <h4 style={{ margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--brand)", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FlatIcon type="users" size={16} />
                  <span>Tim Akademik, Instruktur &amp; Reviewer Penanggung Jawab Materi</span>
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      Tim Kurikulum / Departemen
                    </label>
                    <input
                      type="text"
                      value={editingFeeShare.academicTeam?.curriculumTeam || ""}
                      onChange={(e) =>
                        setEditingFeeShare({
                          ...editingFeeShare,
                          academicTeam: {
                            ...(editingFeeShare.academicTeam || DEFAULT_ACADEMIC_TEAM),
                            curriculumTeam: e.target.value,
                          },
                        })
                      }
                      placeholder="Contoh: Tim Kurikulum AI & Sistem Otonom"
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      Pembuat Kurikulum / Author Modul
                    </label>
                    <select
                      value={editingFeeShare.academicTeam?.curriculumAuthor || ""}
                      onChange={(e) => {
                        const staff = MOCK_ACADEMIC_STAFF.find((s) => s.name === e.target.value);
                        setEditingFeeShare({
                          ...editingFeeShare,
                          academicTeam: {
                            ...(editingFeeShare.academicTeam || DEFAULT_ACADEMIC_TEAM),
                            curriculumAuthor: e.target.value,
                            curriculumAuthorRole: staff?.role || "Curriculum Specialist",
                            curriculumAuthorAvatar: staff?.avatar || "/alumni/alumni_2.jpg",
                          },
                        });
                      }}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                    >
                      <option value="">-- Pilih Pembuat Kurikulum --</option>
                      {MOCK_ACADEMIC_STAFF.map((staff) => (
                        <option key={staff.id} value={staff.name}>
                          {staff.name} ({staff.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      Instruktur Penanggung Jawab (Penerima Fee {editingFeeShare.instructorSharePct}%)
                    </label>
                    <select
                      value={editingFeeShare.academicTeam?.instructorName || ""}
                      onChange={(e) => {
                        const staff = MOCK_ACADEMIC_STAFF.find((s) => s.name === e.target.value);
                        setEditingFeeShare({
                          ...editingFeeShare,
                          academicTeam: {
                            ...(editingFeeShare.academicTeam || DEFAULT_ACADEMIC_TEAM),
                            instructorName: e.target.value,
                            instructorRole: staff?.role || "Lead Instructor",
                            instructorAvatar: staff?.avatar || "/alumni/alumni_1.jpg",
                          },
                        });
                      }}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                    >
                      <option value="">-- Pilih Instruktur Penanggung Jawab --</option>
                      {MOCK_ACADEMIC_STAFF.map((staff) => (
                        <option key={staff.id} value={staff.name}>
                          {staff.name} ({staff.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      Reviewer / Korektor Tugas (Penerima Fee {editingFeeShare.reviewerSharePct}%)
                    </label>
                    <select
                      value={editingFeeShare.academicTeam?.reviewerName || ""}
                      onChange={(e) => {
                        const staff = MOCK_ACADEMIC_STAFF.find((s) => s.name === e.target.value);
                        setEditingFeeShare({
                          ...editingFeeShare,
                          academicTeam: {
                            ...(editingFeeShare.academicTeam || DEFAULT_ACADEMIC_TEAM),
                            reviewerName: e.target.value,
                            reviewerRole: staff?.role || "Code Reviewer",
                            reviewerAvatar: staff?.avatar || "/alumni/alumni_3.jpg",
                          },
                        });
                      }}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                    >
                      <option value="">-- Pilih Reviewer Penanggung Jawab --</option>
                      {MOCK_ACADEMIC_STAFF.map((staff) => (
                        <option key={staff.id} value={staff.name}>
                          {staff.name} ({staff.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                      Penjamin Mutu Akademik (QA Validator)
                    </label>
                    <select
                      value={editingFeeShare.academicTeam?.qaValidatorName || ""}
                      onChange={(e) =>
                        setEditingFeeShare({
                          ...editingFeeShare,
                          academicTeam: {
                            ...(editingFeeShare.academicTeam || DEFAULT_ACADEMIC_TEAM),
                            qaValidatorName: e.target.value,
                          },
                        })
                      }
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                    >
                      <option value="">-- Pilih Penjamin Mutu --</option>
                      {MOCK_ACADEMIC_STAFF.map((staff) => (
                        <option key={staff.id} value={staff.name}>
                          {staff.name} ({staff.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Percentage Revenue Share Sliders */}
              <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                    Konfigurasi Persentase Bagi Hasil (Harus Berjumlah 100%)
                  </h4>
                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      background:
                        editingFeeShare.instructorSharePct +
                        editingFeeShare.reviewerSharePct +
                        editingFeeShare.infrastructureSharePct +
                        editingFeeShare.platformOpsSharePct ===
                        100
                          ? "#D1FAE5"
                          : "#FEE2E2",
                      color:
                        editingFeeShare.instructorSharePct +
                        editingFeeShare.reviewerSharePct +
                        editingFeeShare.infrastructureSharePct +
                        editingFeeShare.platformOpsSharePct ===
                        100
                          ? "#065F46"
                          : "#DC2626",
                      fontWeight: 800,
                      fontSize: "0.76rem",
                    }}
                  >
                    Total:{" "}
                    {editingFeeShare.instructorSharePct +
                      editingFeeShare.reviewerSharePct +
                      editingFeeShare.infrastructureSharePct +
                      editingFeeShare.platformOpsSharePct}
                    %{" "}
                    {editingFeeShare.instructorSharePct +
                    editingFeeShare.reviewerSharePct +
                    editingFeeShare.infrastructureSharePct +
                    editingFeeShare.platformOpsSharePct ===
                    100
                      ? "(Valid)"
                      : "(Tidak Valid - Harus 100%)"}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {/* Instruktur Share */}
                  <div style={{ padding: "12px", background: "var(--bx-bg-alt)", borderRadius: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <strong style={{ color: "var(--brand)", fontSize: "0.82rem" }}>Fee Instruktur / Pembuat Modul</strong>
                      <span style={{ fontWeight: 800, color: "var(--gold-2)" }}>{editingFeeShare.instructorSharePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      value={editingFeeShare.instructorSharePct}
                      onChange={(e) => setEditingFeeShare({ ...editingFeeShare, instructorSharePct: Number(e.target.value) })}
                      style={{ width: "100%" }}
                    />
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "4px" }}>
                      Nominal per soal/submission: <strong>Rp {Math.round((editingFeeShare.unitPrice * editingFeeShare.instructorSharePct) / 100).toLocaleString("id-ID")}</strong>
                    </div>
                  </div>

                  {/* Reviewer Share */}
                  <div style={{ padding: "12px", background: "var(--bx-bg-alt)", borderRadius: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <strong style={{ color: "var(--brand)", fontSize: "0.82rem" }}>Fee Reviewer / Korektor Tugas</strong>
                      <span style={{ fontWeight: 800, color: "#059669" }}>{editingFeeShare.reviewerSharePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      value={editingFeeShare.reviewerSharePct}
                      onChange={(e) => setEditingFeeShare({ ...editingFeeShare, reviewerSharePct: Number(e.target.value) })}
                      style={{ width: "100%" }}
                    />
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "4px" }}>
                      Nominal per soal/submission: <strong>Rp {Math.round((editingFeeShare.unitPrice * editingFeeShare.reviewerSharePct) / 100).toLocaleString("id-ID")}</strong>
                    </div>
                  </div>

                  {/* Infrastruktur Platform Share */}
                  <div style={{ padding: "12px", background: "var(--bx-bg-alt)", borderRadius: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <strong style={{ color: "var(--brand)", fontSize: "0.82rem" }}>Infrastruktur &amp; Cloud Server Platform</strong>
                      <span style={{ fontWeight: 800, color: "#7C3AED" }}>{editingFeeShare.infrastructureSharePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={editingFeeShare.infrastructureSharePct}
                      onChange={(e) => setEditingFeeShare({ ...editingFeeShare, infrastructureSharePct: Number(e.target.value) })}
                      style={{ width: "100%" }}
                    />
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "4px" }}>
                      Alokasi Server VPS Hermes, AI Token API &amp; Database: <strong>Rp {Math.round((editingFeeShare.unitPrice * editingFeeShare.infrastructureSharePct) / 100).toLocaleString("id-ID")}</strong>
                    </div>
                  </div>

                  {/* Platform Ops & Gateway Share */}
                  <div style={{ padding: "12px", background: "var(--bx-bg-alt)", borderRadius: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <strong style={{ color: "var(--brand)", fontSize: "0.82rem" }}>Operasional, Pajak &amp; Payment Gateway</strong>
                      <span style={{ fontWeight: 800, color: "var(--brand)" }}>{editingFeeShare.platformOpsSharePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={editingFeeShare.platformOpsSharePct}
                      onChange={(e) => setEditingFeeShare({ ...editingFeeShare, platformOpsSharePct: Number(e.target.value) })}
                      style={{ width: "100%" }}
                    />
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "4px" }}>
                      Alokasi Midtrans/Xendit &amp; PPh: <strong>Rp {Math.round((editingFeeShare.unitPrice * editingFeeShare.platformOpsSharePct) / 100).toLocaleString("id-ID")}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Calculation Result */}
              <div style={{ background: "var(--cream, #FBF8F1)", border: "1px solid var(--gold)", borderRadius: "8px", padding: "16px" }}>
                <h4 style={{ margin: "0 0 10px", color: "var(--brand)", fontSize: "0.92rem", fontFamily: "var(--font-heading)" }}>
                  Hasil Simulasi Proyeksi Kas ({editingFeeShare.targetQuestionsOrSubmissions} Submission):
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", fontSize: "0.78rem" }}>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Total Pool Omset:</span>
                    <strong style={{ display: "block", fontSize: "1rem", color: "var(--brand)" }}>
                      Rp {(editingFeeShare.unitPrice * editingFeeShare.targetQuestionsOrSubmissions).toLocaleString("id-ID")}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Pool Instruktur ({editingFeeShare.instructorSharePct}%):</span>
                    <strong style={{ display: "block", fontSize: "1rem", color: "var(--gold-2)" }}>
                      Rp {Math.round((editingFeeShare.unitPrice * editingFeeShare.targetQuestionsOrSubmissions * editingFeeShare.instructorSharePct) / 100).toLocaleString("id-ID")}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Pool Reviewer ({editingFeeShare.reviewerSharePct}%):</span>
                    <strong style={{ display: "block", fontSize: "1rem", color: "#059669" }}>
                      Rp {Math.round((editingFeeShare.unitPrice * editingFeeShare.targetQuestionsOrSubmissions * editingFeeShare.reviewerSharePct) / 100).toLocaleString("id-ID")}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Pool Infrastruktur ({editingFeeShare.infrastructureSharePct}%):</span>
                    <strong style={{ display: "block", fontSize: "1rem", color: "#7C3AED" }}>
                      Rp {Math.round((editingFeeShare.unitPrice * editingFeeShare.targetQuestionsOrSubmissions * editingFeeShare.infrastructureSharePct) / 100).toLocaleString("id-ID")}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Database Schema Reference Snippet */}
              <div style={{ background: "#0F172A", color: "#E2E8F0", padding: "14px", borderRadius: "8px", fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>
                <div style={{ color: "#38BDF8", fontWeight: 700, marginBottom: "4px" }}>
                  -- Skema Database PostgreSQL: `simak_materi_revenue_sharing`
                </div>
                <div>
                  UPDATE simak_materi_revenue_sharing SET unit_price = {editingFeeShare.unitPrice}, pct_instruktur = {editingFeeShare.instructorSharePct}, pct_reviewer = {editingFeeShare.reviewerSharePct}, pct_infrastruktur = {editingFeeShare.infrastructureSharePct}, pct_operasional = {editingFeeShare.platformOpsSharePct}, updated_at = NOW() WHERE materi_id = &apos;{editingFeeShare.materiId}&apos;;
                </div>
              </div>

              {/* Drawer Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditingFeeShareOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", cursor: "pointer" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="portal-btn-primary"
                  style={{ padding: "8px 24px", borderRadius: "6px", fontWeight: 700, fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FlatIcon type="check" size={14} />
                  <span>Simpan ke Database PostgreSQL</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: PREVIEW INVOICE RESMI PDF */}
      {/* ============================================================== */}
      {selectedInvoiceTrx && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              fontSize: "0.82rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid var(--brand)", paddingBottom: "12px", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: "0 0 2px", fontFamily: "var(--font-heading)", color: "var(--brand)", fontSize: "1.2rem" }}>
                  FAKTUR PEMBAYARAN RESMI
                </h3>
                <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                  No: <code>{selectedInvoiceTrx.orderNumber}</code>
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  padding: "4px 10px",
                  borderRadius: "12px",
                  background: selectedInvoiceTrx.status === "paid" ? "#D1FAE5" : "#FEF3C7",
                  color: selectedInvoiceTrx.status === "paid" ? "#065F46" : "#B45309",
                  textTransform: "uppercase",
                }}
              >
                {selectedInvoiceTrx.status}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Nama Siswa:</span>
                <strong style={{ color: "var(--brand)" }}>{selectedInvoiceTrx.studentName}</strong>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{selectedInvoiceTrx.studentEmail}</div>
              </div>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Metode Pembayaran:</span>
                <strong>{selectedInvoiceTrx.paymentMethod}</strong>
              </div>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Waktu Pembelian:</span>
                <strong>{selectedInvoiceTrx.createdAt}</strong>
              </div>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Status Akses:</span>
                <strong style={{ color: "#065F46" }}>Aktif Seumur Hidup</strong>
              </div>
            </div>

            <div style={{ border: "1px solid var(--bx-border)", borderRadius: "6px", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "var(--bx-bg-alt)", fontWeight: 700 }}>
                <span>Deskripsi Item</span>
                <span>Subtotal</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderTop: "1px solid var(--bx-border)" }}>
                <div>
                  <strong>{selectedInvoiceTrx.itemName}</strong>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Tipe: {selectedInvoiceTrx.itemType}</div>
                </div>
                <strong style={{ color: "var(--brand)" }}>Rp {selectedInvoiceTrx.amount.toLocaleString("id-ID")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "var(--bx-bg-alt)", borderTop: "2px solid var(--bx-border)", fontSize: "0.95rem", fontWeight: 800 }}>
                <span>Total Tagihan Lunas</span>
                <span style={{ color: "#065F46" }}>Rp {selectedInvoiceTrx.amount.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setSelectedInvoiceTrx(null)}
                style={{ padding: "6px 14px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "transparent" }}
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => alert(`Mengunduh dokumen PDF Invoice ${selectedInvoiceTrx.orderNumber}...`)}
                className="portal-btn-primary"
                style={{ padding: "6px 16px", borderRadius: "5px", fontWeight: 700 }}
              >
                Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: VERIFIKASI PEMBAYARAN MANUAL */}
      {/* ============================================================== */}
      {approvingTrx && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "440px",
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 10px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
              Verifikasi Pembayaran Manual
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: "0.82rem", color: "var(--muted)" }}>
              Apakah Anda telah menerima konfirmasi transfer rekening sebesar <strong>Rp {approvingTrx.amount.toLocaleString("id-ID")}</strong> dari <strong>{approvingTrx.studentName}</strong>?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setApprovingTrx(null)}
                style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", fontSize: "0.82rem" }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleApproveTransaction(approvingTrx.id)}
                style={{ padding: "8px 18px", borderRadius: "6px", border: "none", background: "#059669", color: "#ffffff", fontWeight: 700, fontSize: "0.82rem" }}
              >
                Verifikasi &amp; Buka Akses Kelas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: REFUND DANA */}
      {/* ============================================================== */}
      {refundingTrx && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "460px",
              width: "100%",
            }}
          >
            <h3 style={{ margin: "0 0 10px", fontFamily: "var(--font-heading)", color: "#DC2626" }}>
              Proses Refund / Pengembalian Dana
            </h3>
            <p style={{ margin: "0 0 14px", fontSize: "0.8rem", color: "var(--muted)" }}>
              Apakah Anda yakin ingin membatalkan transaksi <strong>{refundingTrx.orderNumber}</strong> sebesar Rp {refundingTrx.amount.toLocaleString("id-ID")}? Akses siswa ke materi kelas akan dinonaktifkan.
            </p>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
                Alasan Refund
              </label>
              <textarea
                rows={3}
                placeholder="Misal: Pembatalan oleh siswa dalam kurun waktu garansi 7 hari..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontSize: "0.82rem" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setRefundingTrx(null)}
                style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "transparent", fontSize: "0.82rem" }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteRefund}
                style={{ padding: "8px 18px", borderRadius: "6px", border: "none", background: "#DC2626", color: "#ffffff", fontWeight: 700, fontSize: "0.82rem" }}
              >
                Konfirmasi Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: AJUKAN PAYOUT BARU */}
      {/* ============================================================== */}
      {showCreatePayoutModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "var(--bx-surface, #FFFFFF)",
              border: "1px solid var(--bx-border)",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "500px",
              width: "100%",
              fontSize: "0.82rem",
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontFamily: "var(--font-heading)", color: "var(--brand)", fontSize: "1.15rem" }}>
              Ajukan Bagi Hasil &amp; Payout Instruktur
            </h3>

            <form onSubmit={handleCreatePayout} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Nama Instruktur</label>
                <input
                  type="text"
                  required
                  value={newPayInstructor}
                  onChange={(e) => setNewPayInstructor(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Periode Payout</label>
                  <input
                    type="text"
                    required
                    value={newPayPeriod}
                    onChange={(e) => setNewPayPeriod(e.target.value)}
                    placeholder="Misal: Oktober 2026"
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Total Penjualan Kursus</label>
                  <input
                    type="number"
                    required
                    value={newPaySales}
                    onChange={(e) => setNewPaySales(Number(e.target.value))}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Rate Bagi Hasil (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="90"
                    value={newPayRate}
                    onChange={(e) => setNewPayRate(Number(e.target.value))}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Rekening Tujuan</label>
                  <input
                    type="text"
                    required
                    value={newPayBank}
                    onChange={(e) => setNewPayBank(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "5px", border: "1px solid var(--bx-border)", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ padding: "8px 10px", background: "var(--bx-bg-alt)", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  id="npwpCheck"
                  checked={newPayHasNpwp}
                  onChange={(e) => setNewPayHasNpwp(e.target.checked)}
                />
                <label htmlFor="npwpCheck" style={{ fontSize: "0.76rem", cursor: "pointer" }}>
                  Instruktur Memiliki NPWP (PPh 21 tarif efektif 2.5%, jika tidak 5%)
                </label>
              </div>

              {/* Live Calculation Meter */}
              <div style={{ background: "var(--cream, #FBF8F1)", border: "1px solid var(--gold)", padding: "10px", borderRadius: "6px", fontSize: "0.76rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span>Komisi Kotor ({newPayRate}%):</span>
                  <strong>Rp {Math.round((newPaySales * newPayRate) / 100).toLocaleString("id-ID")}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", color: "#DC2626" }}>
                  <span>Potongan PPh 21 ({newPayHasNpwp ? "2.5%" : "5%"}):</span>
                  <strong>- Rp {Math.round(((newPaySales * newPayRate) / 100) * (newPayHasNpwp ? 0.025 : 0.05)).toLocaleString("id-ID")}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed var(--gold)", paddingTop: "6px", color: "#065F46", fontSize: "0.86rem", fontWeight: 800 }}>
                  <span>Net Payout yang Ditransfer:</span>
                  <span>Rp {Math.round(((newPaySales * newPayRate) / 100) * (1 - (newPayHasNpwp ? 0.025 : 0.05))).toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowCreatePayoutModal(false)}
                  style={{ padding: "8px 14px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "transparent" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="portal-btn-primary"
                  style={{ padding: "8px 18px", borderRadius: "5px", fontWeight: 700 }}
                >
                  Ajukan Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: BUKTI TRANSFER & FAKTUR PAJAK PAYOUT */}
      {/* ============================================================== */}
      {selectedPayoutProof && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 46, 82, 0.65)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "560px",
              width: "100%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              fontSize: "0.82rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid var(--brand)", paddingBottom: "12px", marginBottom: "14px" }}>
              <div>
                <h3 style={{ margin: "0 0 2px", fontFamily: "var(--font-heading)", color: "var(--brand)", fontSize: "1.2rem" }}>
                  BUKTI POTONG PAJAK &amp; TRANSFER BAGI HASIL
                </h3>
                <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                  No. Dokumen: <code>PO-TRF-{selectedPayoutProof.id.toUpperCase()}</code>
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: "12px",
                  background: selectedPayoutProof.status === "paid" ? "#D1FAE5" : "#FEF3C7",
                  color: selectedPayoutProof.status === "paid" ? "#065F46" : "#B45309",
                  textTransform: "uppercase",
                }}
              >
                {selectedPayoutProof.status === "paid" ? "Lunas Ditransfer" : "Menunggu Transfer"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px", background: "var(--bx-bg-alt)", padding: "12px", borderRadius: "6px" }}>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Nama Instruktur:</span>
                <strong style={{ color: "var(--brand)" }}>{selectedPayoutProof.instructorName}</strong>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{selectedPayoutProof.instructorEmail}</div>
              </div>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Rekening Tujuan:</span>
                <code>{selectedPayoutProof.bankAccount}</code>
              </div>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Periode Penjualan:</span>
                <strong>{selectedPayoutProof.period}</strong>
              </div>
              <div>
                <span style={{ color: "var(--muted)", display: "block" }}>Waktu Transfer:</span>
                <strong>{selectedPayoutProof.paidAt || "Dalam Antrean Kasir"}</strong>
              </div>
            </div>

            <div style={{ border: "1px solid var(--bx-border)", borderRadius: "6px", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid var(--bx-border)" }}>
                <span>Total Omset Penjualan Kelas</span>
                <strong>Rp {selectedPayoutProof.totalSales.toLocaleString("id-ID")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid var(--bx-border)" }}>
                <span>Bagi Hasil Instruktur ({selectedPayoutProof.commissionRate}%)</span>
                <strong>Rp {Math.round((selectedPayoutProof.totalSales * selectedPayoutProof.commissionRate) / 100).toLocaleString("id-ID")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderBottom: "1px solid var(--bx-border)", color: "#DC2626" }}>
                <span>Pemotongan Pajak PPh Pasal 21 (2.5%)</span>
                <strong>- Rp {Math.round(((selectedPayoutProof.totalSales * selectedPayoutProof.commissionRate) / 100) - selectedPayoutProof.payableAmount).toLocaleString("id-ID")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "var(--bx-bg-alt)", fontSize: "0.95rem", fontWeight: 800, color: "#065F46" }}>
                <span>Jumlah Bersih Yang Ditransfer</span>
                <span>Rp {selectedPayoutProof.payableAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setSelectedPayoutProof(null)}
                style={{ padding: "6px 14px", borderRadius: "5px", border: "1px solid var(--bx-border)", background: "transparent" }}
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => alert(`Mengunduh dokumen PDF Bukti Transfer Payout untuk ${selectedPayoutProof.instructorName}...`)}
                className="portal-btn-primary"
                style={{ padding: "6px 16px", borderRadius: "5px", fontWeight: 700 }}
              >
                Unduh Bukti PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
