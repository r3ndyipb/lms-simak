"use client";

import React, { useState, useMemo } from "react";
import FlatIcon from "./FlatIcon";
import {
  LmsSubscriptionPlan,
  LmsVoucher,
  LmsReferralItem,
  LmsScholarship,
  LmsScholarshipApplicant,
  SubscriptionAccessMode,
  LmsCourse,
} from "../types/simak";
import {
  MOCK_SUBSCRIPTION_PLANS,
  MOCK_VOUCHERS,
  MOCK_REFERRALS,
  MOCK_SCHOLARSHIPS,
  MOCK_SCHOLARSHIP_APPLICANTS,
  MOCK_LMS_COURSES,
} from "../data/simakMockData";

type SubsTab = "paket" | "voucher" | "referral" | "beasiswa";
type PlanSliderTab = "info" | "access" | "simulator";

export default function SimakSubscriptionView() {
  const [activeTab, setActiveTab] = useState<SubsTab>("paket");

  // State collections
  const [plans, setPlans] = useState<LmsSubscriptionPlan[]>(MOCK_SUBSCRIPTION_PLANS);
  const [vouchers, setVouchers] = useState<LmsVoucher[]>(MOCK_VOUCHERS);
  const [referrals, setReferrals] = useState<LmsReferralItem[]>(MOCK_REFERRALS);
  const [scholarships, setScholarships] = useState<LmsScholarship[]>(MOCK_SCHOLARSHIPS);
  const [scholarshipApplicants, setScholarshipApplicants] = useState<LmsScholarshipApplicant[]>(MOCK_SCHOLARSHIP_APPLICANTS);

  // 90% Slider Drawer State for Subscription Plans
  const [isPlanSliderOpen, setIsPlanSliderOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planSliderTab, setPlanSliderTab] = useState<PlanSliderTab>("info");

  // Plan Form State
  const [planFormName, setPlanFormName] = useState("");
  const [planFormBadge, setPlanFormBadge] = useState("");
  const [planFormDescription, setPlanFormDescription] = useState("");
  const [planFormMonthly, setPlanFormMonthly] = useState(149000);
  const [planFormYearly, setPlanFormYearly] = useState(1490000);
  const [planFormStatus, setPlanFormStatus] = useState<"aktif" | "nonaktif">("aktif");
  const [planFormFeatures, setPlanFormFeatures] = useState<string[]>([]);
  const [planFormNewFeature, setPlanFormNewFeature] = useState("");

  // Material & Quota Access Setup
  const [planFormAccessMode, setPlanFormAccessMode] = useState<SubscriptionAccessMode>("quota_limited");
  const [planFormCuratedCourseIds, setPlanFormCuratedCourseIds] = useState<string[]>([]);
  const [planFormQuotaLimit, setPlanFormQuotaLimit] = useState<number>(5);
  const [planFormEnforceLock, setPlanFormEnforceLock] = useState<boolean>(true);

  // Student Perspective Simulator State (Inside 90% Slider)
  const [simulatedPickedCourseIds, setSimulatedPickedCourseIds] = useState<string[]>([]);
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [courseCategoryFilter, setCourseCategoryFilter] = useState("all");

  // Notification Banner
  const [planNotification, setPlanNotification] = useState<string | null>(null);

  // Other Modals
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [showBulkGenModal, setShowBulkGenModal] = useState(false);
  const [showAddScholarshipModal, setShowAddScholarshipModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<LmsScholarship | null>(null);

  const [newVoucherCode, setNewVoucherCode] = useState("");
  const [newVoucherDesc, setNewVoucherDesc] = useState("");
  const [newVoucherType, setNewVoucherType] = useState<"percent" | "fixed" | "free">("percent");
  const [newVoucherVal, setNewVoucherVal] = useState(25);
  const [newVoucherQuota, setNewVoucherQuota] = useState(100);

  const [newSchTitle, setNewSchTitle] = useState("");
  const [newSchSponsor, setNewSchSponsor] = useState("");
  const [newSchQuota, setNewSchQuota] = useState(30);

  // Handlers for Opening 90% Slider Drawer
  const openCreatePlanSlider = () => {
    setEditingPlanId(null);
    setPlanFormName("AUI Flexi-5 Learner Baru");
    setPlanFormBadge("Bebas Pilih 5 Materi");
    setPlanFormDescription("Siswa bebas memilih hingga 5 materi/kelas dari katalog, dilengkapi sistem counter kuota & proteksi auto-lock.");
    setPlanFormMonthly(129000);
    setPlanFormYearly(1190000);
    setPlanFormStatus("aktif");
    setPlanFormFeatures([
      "Bebas memilih hingga 5 kelas dari katalog aktif",
      "Sistem pembatas & kunci otomatis saat kuota 5/5 habis",
      "Kuis latihan & evaluasi terstruktur",
      "Sertifikat digital kelulusan per kelas terpilih",
      "Dukungan forum komunitas mahasiswa",
    ]);
    setPlanFormNewFeature("");
    setPlanFormAccessMode("quota_limited");
    setPlanFormCuratedCourseIds(["crs-01", "crs-02", "crs-04"]);
    setPlanFormQuotaLimit(5);
    setPlanFormEnforceLock(true);
    setSimulatedPickedCourseIds(["crs-01", "crs-02", "crs-04"]);
    setCourseSearchQuery("");
    setCourseCategoryFilter("all");
    setPlanSliderTab("info");
    setIsPlanSliderOpen(true);
  };

  const openEditPlanSlider = (plan: LmsSubscriptionPlan) => {
    setEditingPlanId(plan.id);
    setPlanFormName(plan.name);
    setPlanFormBadge(plan.badge);
    setPlanFormDescription(plan.description || "");
    setPlanFormMonthly(plan.priceMonthly);
    setPlanFormYearly(plan.priceYearly);
    setPlanFormStatus(plan.status);
    setPlanFormFeatures([...plan.features]);
    setPlanFormNewFeature("");
    setPlanFormAccessMode(plan.accessMode || "all");
    setPlanFormCuratedCourseIds(plan.curatedCourseIds ? [...plan.curatedCourseIds] : ["crs-01", "crs-02", "crs-04"]);
    setPlanFormQuotaLimit(plan.quotaLimit || 5);
    setPlanFormEnforceLock(true);
    setSimulatedPickedCourseIds(
      plan.simulatedSelectedCourses
        ? [...plan.simulatedSelectedCourses]
        : (plan.curatedCourseIds && plan.curatedCourseIds.length > 0
            ? [...plan.curatedCourseIds]
            : ["crs-01", "crs-02", "crs-04"])
    );
    setCourseSearchQuery("");
    setCourseCategoryFilter("all");
    setPlanSliderTab("info");
    setIsPlanSliderOpen(true);
  };

  // Save Plan from 90% Slider
  const handleSavePlanSlider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planFormName.trim()) {
      alert("Nama paket wajib diisi!");
      return;
    }
    if (planFormAccessMode === "curated" && planFormCuratedCourseIds.length === 0) {
      alert("Pilih minimal 1 materi kelas untuk paket dengan mode kurikulum ditentukan admin!");
      setPlanSliderTab("access");
      return;
    }
    if (planFormAccessMode === "quota_limited" && planFormQuotaLimit < 1) {
      alert("Batas kuota materi minimal 1 materi!");
      setPlanSliderTab("access");
      return;
    }

    const curatedTitles = MOCK_LMS_COURSES
      .filter((c) => planFormCuratedCourseIds.includes(c.id))
      .map((c) => c.title);

    const updatedPlan: LmsSubscriptionPlan = {
      id: editingPlanId || `sub-${Date.now()}`,
      name: planFormName.trim(),
      badge: planFormBadge.trim() || (planFormAccessMode === "quota_limited" ? `Bebas Pilih ${planFormQuotaLimit} Materi` : planFormAccessMode === "curated" ? "Kurikulum Ditentukan" : "Akses Penuh"),
      description: planFormDescription.trim(),
      priceMonthly: Number(planFormMonthly),
      priceYearly: Number(planFormYearly),
      features: planFormFeatures.length > 0 ? planFormFeatures : [
        planFormAccessMode === "quota_limited" ? `Bebas memilih hingga ${planFormQuotaLimit} kelas` : planFormAccessMode === "curated" ? `Akses ${planFormCuratedCourseIds.length} materi kurikulum pilihan` : "Akses seluruh materi tanpa batas",
        "Sertifikat digital kelulusan",
        "Forum komunitas",
      ],
      activeSubscribersCount: editingPlanId ? (plans.find((p) => p.id === editingPlanId)?.activeSubscribersCount || 0) : 0,
      status: planFormStatus,
      accessMode: planFormAccessMode,
      curatedCourseIds: planFormCuratedCourseIds,
      curatedCourseTitles: curatedTitles,
      quotaLimit: planFormAccessMode === "quota_limited" ? Number(planFormQuotaLimit) : undefined,
      simulatedSelectedCourses: simulatedPickedCourseIds,
    };

    if (editingPlanId) {
      setPlans(plans.map((p) => (p.id === editingPlanId ? updatedPlan : p)));
      setPlanNotification(`Paket langganan "${updatedPlan.name}" berhasil diperbarui dengan mode akses: ${updatedPlan.accessMode === "quota_limited" ? `Bebas Pilih Kuota Maksimal ${updatedPlan.quotaLimit} Materi` : updatedPlan.accessMode === "curated" ? "Materi Ditentukan Admin" : "Akses Penuh Seluruh Katalog"}`);
    } else {
      setPlans([updatedPlan, ...plans]);
      setPlanNotification(`Paket langganan baru "${updatedPlan.name}" berhasil dibuat dan diaktifkan di platform!`);
    }

    setIsPlanSliderOpen(false);
    setTimeout(() => setPlanNotification(null), 6000);
  };

  const handleAddFeature = () => {
    if (!planFormNewFeature.trim()) return;
    setPlanFormFeatures([...planFormFeatures, planFormNewFeature.trim()]);
    setPlanFormNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    setPlanFormFeatures(planFormFeatures.filter((_, idx) => idx !== index));
  };

  const handleToggleCuratedCourse = (courseId: string) => {
    if (planFormCuratedCourseIds.includes(courseId)) {
      setPlanFormCuratedCourseIds(planFormCuratedCourseIds.filter((id) => id !== courseId));
    } else {
      setPlanFormCuratedCourseIds([...planFormCuratedCourseIds, courseId]);
    }
  };

  const handleToggleSimulatedPick = (courseId: string) => {
    if (simulatedPickedCourseIds.includes(courseId)) {
      // Remove course, freed up 1 quota slot
      setSimulatedPickedCourseIds(simulatedPickedCourseIds.filter((id) => id !== courseId));
    } else {
      // Check quota restriction
      if (planFormAccessMode === "quota_limited" && simulatedPickedCourseIds.length >= planFormQuotaLimit) {
        alert(`Batas kuota tercapai! Paket ini hanya mengizinkan maksimal ${planFormQuotaLimit} materi. Semua kelas lain otomatis terkunci (LOCKED). Lepas salah satu kelas aktif untuk memilih kelas ini, atau upgrade ke paket Pro All-Access!`);
        return;
      }
      setSimulatedPickedCourseIds([...simulatedPickedCourseIds, courseId]);
    }
  };

  // Filtered courses for selector / simulator
  const filteredCourses = useMemo(() => {
    return MOCK_LMS_COURSES.filter((c) => {
      if (courseCategoryFilter !== "all" && c.category !== courseCategoryFilter) return false;
      if (!courseSearchQuery) return true;
      const q = courseSearchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructorName.toLowerCase().includes(q)
      );
    });
  }, [courseSearchQuery, courseCategoryFilter]);

  // Categories list
  const courseCategories = useMemo(() => {
    const setCat = new Set(MOCK_LMS_COURSES.map((c) => c.category));
    return ["all", ...Array.from(setCat)];
  }, []);

  // Handlers
  const handleTogglePlan = (planId: string) => {
    setPlans(
      plans.map((p) =>
        p.id === planId
          ? { ...p, status: p.status === "aktif" ? "nonaktif" : "aktif" }
          : p
      )
    );
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket langganan ini?")) {
      setPlans(plans.filter((p) => p.id !== planId));
    }
  };

  const handleDeleteScholarship = (schId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus program beasiswa ini?")) {
      setScholarships(scholarships.filter((s) => s.id !== schId));
    }
  };

  const handleApproveScholarshipApplicant = (appId: string) => {
    setScholarshipApplicants(
      scholarshipApplicants.map((app) =>
        app.id === appId ? { ...app, status: "approved" } : app
      )
    );
    if (selectedScholarship) {
      setScholarships(
        scholarships.map((s) =>
          s.id === selectedScholarship.id
            ? { ...s, approvedCount: s.approvedCount + 1 }
            : s
        )
      );
    }
    alert("Pendaftar disetujui! Sistem otomatis meng-enroll mahasiswa ke kelas beasiswa.");
  };

  const handleRejectScholarshipApplicant = (appId: string) => {
    setScholarshipApplicants(
      scholarshipApplicants.map((app) =>
        app.id === appId ? { ...app, status: "rejected" } : app
      )
    );
    alert("Berkas pendaftar beasiswa ditandai Ditolak.");
  };

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherCode) return;
    const newV: LmsVoucher = {
      id: `vch-${Date.now()}`,
      code: newVoucherCode.toUpperCase().replace(/\s+/g, ""),
      description: newVoucherDesc,
      discountType: newVoucherType,
      discountValue: Number(newVoucherVal),
      quota: Number(newVoucherQuota),
      usedCount: 0,
      validUntil: "31 Desember 2026",
      status: "aktif",
    };
    setVouchers([newV, ...vouchers]);
    setNewVoucherCode("");
    setNewVoucherDesc("");
    setShowAddVoucherModal(false);
  };

  const handleBulkGenerate = (count: number) => {
    const generated: LmsVoucher[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: `vch-bulk-${Date.now()}-${i}`,
        code: `PROMO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        description: "Kode voucher otomatis hasil bulk generator",
        discountType: "percent",
        discountValue: 20,
        quota: 1,
        usedCount: 0,
        validUntil: "31 Desember 2026",
        status: "aktif",
      });
    }
    setVouchers([...generated, ...vouchers]);
    setShowBulkGenModal(false);
    alert(`Berhasil membuat ${count} kode voucher unik sekaligus!`);
  };

  const handleApproveReferralBonus = (refId: string) => {
    setReferrals(
      referrals.map((r) => (r.id === refId ? { ...r, status: "approved" } : r))
    );
    alert("Bonus komisi referral disetujui dan ditransfer ke saldo dompet user!");
  };

  const handleAddScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchTitle) return;
    const newSch: LmsScholarship = {
      id: `sch-${Date.now()}`,
      title: newSchTitle,
      sponsor: newSchSponsor || "Internal AUI Grant",
      quota: Number(newSchQuota),
      applicantsCount: 0,
      approvedCount: 0,
      status: "buka",
      coveredCourse: "Artificial Intelligence & LLM Engineer",
      deadline: "30 November 2026",
    };
    setScholarships([...scholarships, newSch]);
    setNewSchTitle("");
    setNewSchSponsor("");
    setShowAddScholarshipModal(false);
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
              Subscription &amp; Growth
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              Paket Langganan, Kode Voucher, Referral &amp; Beasiswa
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
            Akses, Langganan &amp; Pertumbuhan Pengguna
          </h2>
        </div>

        {/* 4 Tabs Switcher */}
        <div style={{ display: "flex", gap: "6px", background: "var(--bx-bg-alt)", padding: "4px", borderRadius: "8px" }}>
          {[
            { id: "paket", label: "Paket Langganan", icon: "award" },
            { id: "voucher", label: "Kode Voucher", icon: "clipboard" },
            { id: "referral", label: "Program Referral", icon: "users" },
            { id: "beasiswa", label: "Beasiswa", icon: "certificate" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SubsTab)}
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
      </div>

      {/* ============================================================== */}
      {/* TAB 1: PAKET LANGGANAN */}
      {/* ============================================================== */}
      {activeTab === "paket" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Notification Banner */}
          {planNotification && (
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                background: "#ECFDF5",
                border: "1px solid #10B981",
                color: "#065F46",
                fontSize: "0.82rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation: "fadeIn 0.2s ease-in-out",
              }}
            >
              <FlatIcon type="check" size={16} color="#059669" />
              <span>{planNotification}</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                Kelola tingkatan tier langganan berulang (recurring subscription) siswa &amp; aturan pembatas akses materi.
              </span>
              <div style={{ fontSize: "0.74rem", color: "var(--brand)", marginTop: "2px", fontWeight: 600 }}>
                💡 Mendukung 3 mode akses materi: <strong>Akses Penuh</strong>, <strong>Materi Ditentukan Admin</strong>, dan <strong>Bebas Pilih dengan Kuota Batas &amp; Auto-Lock</strong>.
              </div>
            </div>
            <button
              type="button"
              onClick={openCreatePlanSlider}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: "var(--brand, #0A2E52)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 6px rgba(10, 46, 82, 0.15)",
              }}
            >
              <FlatIcon type="plus" size={14} color="#ffffff" />
              <span>Buat Paket Baru (Slider 90%)</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {plans.map((p) => {
              const accessMode = p.accessMode || "all";
              const isQuotaLimited = accessMode === "quota_limited";
              const isCurated = accessMode === "curated";
              const quotaLimit = p.quotaLimit || 5;

              return (
                <div
                  key={p.id}
                  style={{
                    background: "var(--bx-surface, #FFFFFF)",
                    border: isQuotaLimited ? "1px solid var(--gold)" : "1px solid var(--bx-border)",
                    borderRadius: "10px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 8px rgba(10, 46, 82, 0.05)",
                    position: "relative",
                  }}
                >
                  <div>
                    {/* Header badge & status */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          background: isQuotaLimited ? "rgba(201, 150, 46, 0.15)" : isCurated ? "rgba(10, 46, 82, 0.1)" : "var(--bx-bg-alt)",
                          color: isQuotaLimited ? "var(--gold-2)" : isCurated ? "var(--brand)" : "var(--ink)",
                        }}
                      >
                        {p.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTogglePlan(p.id)}
                        style={{
                          padding: "2px 8px",
                          borderRadius: "10px",
                          border: "none",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          background: p.status === "aktif" ? "#D1FAE5" : "#FEE2E2",
                          color: p.status === "aktif" ? "#065F46" : "#DC2626",
                        }}
                      >
                        {p.status.toUpperCase()}
                      </button>
                    </div>

                    <h3 style={{ margin: "4px 0 6px", fontSize: "1.15rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                      {p.name}
                    </h3>

                    {p.description && (
                      <p style={{ fontSize: "0.76rem", color: "var(--muted)", margin: "0 0 10px", lineHeight: 1.4 }}>
                        {p.description}
                      </p>
                    )}

                    {/* Access Mode Banner */}
                    <div
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        marginBottom: "12px",
                        background: isQuotaLimited ? "rgba(201, 150, 46, 0.08)" : isCurated ? "rgba(10, 46, 82, 0.06)" : "rgba(5, 150, 105, 0.07)",
                        border: isQuotaLimited ? "1px solid rgba(201, 150, 46, 0.35)" : isCurated ? "1px solid rgba(10, 46, 82, 0.25)" : "1px solid rgba(5, 150, 105, 0.25)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: isQuotaLimited ? "var(--gold-2)" : isCurated ? "var(--brand)" : "#065F46", display: "flex", alignItems: "center", gap: "5px" }}>
                          <FlatIcon type={isQuotaLimited ? "target" : isCurated ? "book" : "shield"} size={13} />
                          <span>
                            {isQuotaLimited ? `Mode: Bebas Pilih (Maks ${quotaLimit} Materi)` : isCurated ? `Mode: Ditentukan Admin (${p.curatedCourseIds?.length || 3} Materi)` : "Mode: Akses Penuh (All-Access)"}
                          </span>
                        </span>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            padding: "1px 6px",
                            borderRadius: "4px",
                            background: "var(--bx-surface)",
                            color: isQuotaLimited ? "var(--gold-2)" : isCurated ? "var(--brand)" : "#059669",
                          }}
                        >
                          {isQuotaLimited ? "AUTO-LOCK AKTIF" : isCurated ? "FIXED LIST" : "UNLIMITED"}
                        </span>
                      </div>

                      {isQuotaLimited && (
                        <div>
                          <div style={{ fontSize: "0.69rem", color: "var(--muted)", marginBottom: "4px" }}>
                            Siswa bebas memilih hingga <strong>{quotaLimit} materi</strong> dari katalog. Jika kuota penuh, kelas lain terkunci otomatis (lock).
                          </div>
                          {/* Mini Progress Simulator Bar */}
                          <div style={{ height: "6px", width: "100%", background: "var(--bx-border)", borderRadius: "3px", overflow: "hidden" }}>
                            <div
                              style={{
                                width: `${Math.min(100, ((p.simulatedSelectedCourses?.length || 3) / quotaLimit) * 100)}%`,
                                height: "100%",
                                background: (p.simulatedSelectedCourses?.length || 3) >= quotaLimit ? "#DC2626" : "var(--gold)",
                              }}
                            />
                          </div>
                          <div style={{ fontSize: "0.66rem", color: "var(--muted)", display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
                            <span>Terpilih: {p.simulatedSelectedCourses?.length || 3} dari {quotaLimit} materi</span>
                            <span>Sisa: {Math.max(0, quotaLimit - (p.simulatedSelectedCourses?.length || 3))} kuota</span>
                          </div>
                        </div>
                      )}

                      {isCurated && (
                        <div style={{ fontSize: "0.69rem", color: "var(--muted)" }}>
                          Materi kurikulum telah ditentukan oleh tim prodi: {p.curatedCourseTitles?.slice(0, 2).join(", ") || "3 Kelas Pilihan"}
                          {p.curatedCourseTitles && p.curatedCourseTitles.length > 2 && ` (+${p.curatedCourseTitles.length - 2} lainnya)`}
                        </div>
                      )}

                      {!isQuotaLimited && !isCurated && (
                        <div style={{ fontSize: "0.69rem", color: "#065F46" }}>
                          Siswa mendapatkan akses bebas tanpa batasan kuota ke seluruh 42+ materi di katalog kelas SIMAK.
                        </div>
                      )}
                    </div>

                    {/* Price Section */}
                    <div style={{ margin: "10px 0" }}>
                      <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--brand)" }}>
                        Rp {p.priceMonthly.toLocaleString("id-ID")}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}> / bulan</span>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "2px" }}>
                        atau Rp {p.priceYearly.toLocaleString("id-ID")} / tahun
                      </div>
                    </div>

                    {/* Features List */}
                    <div style={{ margin: "14px 0 12px", fontSize: "0.78rem" }}>
                      <strong style={{ display: "block", marginBottom: "6px", color: "var(--brand)" }}>Benefit Termasuk:</strong>
                      {p.features.map((feat, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px", color: "var(--ink)" }}>
                          <FlatIcon type="check" size={12} color="#059669" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div style={{ paddingTop: "14px", borderTop: "1px solid var(--bx-border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                    <span>Pelanggan Aktif: <strong>{p.activeSubscribersCount} Siswa</strong></span>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleDeletePlan(p.id)}
                        style={{ background: "none", border: "none", color: "#DC2626", fontWeight: 700, cursor: "pointer", fontSize: "0.72rem" }}
                      >
                        Hapus
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditPlanSlider(p)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "5px",
                          border: "1px solid var(--bx-border)",
                          background: "var(--bx-bg-alt)",
                          color: "var(--brand)",
                          fontWeight: 700,
                          fontSize: "0.74rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <FlatIcon type="settings" size={13} color="var(--brand)" />
                        <span>Edit Paket &amp; Aturan Akses</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: KODE VOUCHER & AKSES */}
      {/* ============================================================== */}
      {activeTab === "voucher" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Kelola voucher potongan harga dan kode akses gratis promosi.
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setShowBulkGenModal(true)}
                style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-surface)", color: "var(--ink)", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
              >
                Bulk Generate (50 Kode)
              </button>
              <button
                type="button"
                onClick={() => setShowAddVoucherModal(true)}
                style={{ padding: "7px 14px", borderRadius: "6px", border: "none", background: "var(--brand, #0A2E52)", color: "#ffffff", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <FlatIcon type="plus" size={13} color="#ffffff" />
                <span>Buat Voucher Baru</span>
              </button>
            </div>
          </div>

          <div style={{ background: "var(--bx-surface, #FFFFFF)", border: "1px solid var(--bx-border)", borderRadius: "8px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px" }}>Kode Voucher</th>
                  <th style={{ padding: "10px 14px" }}>Deskripsi Promo</th>
                  <th style={{ padding: "10px 14px" }}>Tipe &amp; Diskon</th>
                  <th style={{ padding: "10px 14px" }}>Pemakaian / Kuota</th>
                  <th style={{ padding: "10px 14px" }}>Masa Berlaku</th>
                  <th style={{ padding: "10px 14px" }}>Status</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((v) => (
                  <tr key={v.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--brand)", fontSize: "0.88rem", padding: "2px 6px", background: "var(--bx-bg-alt)", borderRadius: "4px" }}>
                        {v.code}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px" }}>{v.description}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "#059669" }}>
                      {v.discountType === "percent" ? `${v.discountValue}% Diskon` :
                       v.discountType === "fixed" ? `Rp ${v.discountValue.toLocaleString("id-ID")}` : "Gratis 100%"}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      {v.usedCount} / {v.quota} terpakai
                    </td>
                    <td style={{ padding: "10px 14px", color: "var(--muted)" }}>{v.validUntil}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: v.status === "aktif" ? "#D1FAE5" : "#FEE2E2",
                          color: v.status === "aktif" ? "#065F46" : "#DC2626",
                        }}
                      >
                        {v.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus voucher ${v.code}?`)) {
                            setVouchers(vouchers.filter((item) => item.id !== v.id));
                          }
                        }}
                        style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontSize: "0.75rem" }}
                      >
                        Hapus
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
      {/* TAB 3: PROGRAM REFERRAL */}
      {/* ============================================================== */}
      {activeTab === "referral" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "0.82rem" }}>
            <div style={{ padding: "14px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <h3 style={{ margin: "0 0 10px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                Aturan Skema Komisi Referral
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div>Bonus untuk Referrer: <strong>Rp 100.000 per siswa terdaftar</strong></div>
                <div>Bonus untuk Referee (Siswa baru): <strong>Diskon 20% pembelian pertama</strong></div>
                <div style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "6px" }}>
                  Status komisi akan otomatis masuk ke antrean approval sebelum ditransfer ke rekening penarik dana.
                </div>
              </div>
            </div>

            <div style={{ padding: "14px", background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px" }}>
              <h3 style={{ margin: "0 0 10px", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                Total Komisi Referral Terbayar
              </h3>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#065F46" }}>
                Rp 2.100.000
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "4px" }}>
                Dari total 32 referral yang berhasil dikonversi ke siswa berbayar.
              </div>
            </div>
          </div>

          <div style={{ background: "var(--bx-surface, #FFFFFF)", border: "1px solid var(--bx-border)", borderRadius: "8px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                  <th style={{ padding: "10px 14px" }}>Nama User Referrer</th>
                  <th style={{ padding: "10px 14px" }}>Kode Unik</th>
                  <th style={{ padding: "10px 14px" }}>Jumlah Klik / Konversi</th>
                  <th style={{ padding: "10px 14px" }}>Total Bonus Terkumpul</th>
                  <th style={{ padding: "10px 14px" }}>Status Pencairan</th>
                  <th style={{ padding: "10px 14px", textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref) => (
                  <tr key={ref.id} style={{ borderBottom: "1px solid var(--bx-border)" }}>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontWeight: 700, color: "var(--brand)" }}>{ref.userName}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{ref.userEmail}</div>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <code style={{ fontWeight: 700, background: "var(--bx-bg-alt)", padding: "2px 6px", borderRadius: "4px" }}>
                        {ref.referralCode}
                      </code>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      {ref.referredCount} klik / <strong>{ref.convertedCount} transaksi</strong>
                    </td>
                    <td style={{ padding: "10px 14px", fontWeight: 800, color: "#065F46" }}>
                      Rp {ref.totalBonus.toLocaleString("id-ID")}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: ref.status === "approved" ? "#D1FAE5" : "#FEF3C7",
                          color: ref.status === "approved" ? "#065F46" : "#B45309",
                          textTransform: "uppercase",
                        }}
                      >
                        {ref.status}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right" }}>
                      {ref.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleApproveReferralBonus(ref.id)}
                          style={{ padding: "4px 8px", borderRadius: "4px", border: "none", background: "#059669", color: "#ffffff", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}
                        >
                          Approve Bonus
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: BEASISWA (SCHOLARSHIP) */}
      {/* ============================================================== */}
      {activeTab === "beasiswa" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Kelola program beasiswa kemitraan, seleksi esai pendaftar &amp; auto-enrollment kelas.
            </span>
            <button
              type="button"
              onClick={() => setShowAddScholarshipModal(true)}
              style={{ padding: "8px 14px", borderRadius: "6px", border: "none", background: "var(--brand, #0A2E52)", color: "#ffffff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <FlatIcon type="plus" size={14} color="#ffffff" />
              <span>Buka Beasiswa Baru</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
            {scholarships.map((sch) => (
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
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "var(--bx-bg-alt)", color: "var(--gold-2)" }}>
                      {sch.sponsor}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: sch.status === "seleksi" ? "#FEF3C7" : sch.status === "buka" ? "#D1FAE5" : "#F3F4F6",
                        color: sch.status === "seleksi" ? "#B45309" : sch.status === "buka" ? "#065F46" : "#4B5563",
                      }}
                    >
                      {sch.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 style={{ margin: "4px 0 6px", fontSize: "1.05rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                    {sch.title}
                  </h3>

                  <div style={{ fontSize: "0.78rem", color: "var(--ink)", marginBottom: "8px" }}>
                    Kelas Dicover: <strong>{sch.coveredCourse}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: "var(--muted)", margin: "8px 0" }}>
                    <span>Pendaftar: <strong>{sch.applicantsCount} Siswa</strong></span>
                    <span>Diterima: <strong>{sch.approvedCount} / {sch.quota}</strong></span>
                  </div>
                </div>

                <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--bx-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Batas: {sch.deadline}</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => handleDeleteScholarship(sch.id)}
                      style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #FCA5A5", background: "transparent", color: "#DC2626", fontSize: "0.72rem", cursor: "pointer" }}
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedScholarship(sch)}
                      style={{ padding: "5px 12px", borderRadius: "4px", border: "none", background: "var(--brand)", color: "#ffffff", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer" }}
                    >
                      Review Pendaftar ({sch.applicantsCount})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 90% CANVAS SLIDER STUDIO: TAMBAH & EDIT PAKET LANGGANAN */}
      {/* ============================================================== */}
      {isPlanSliderOpen && (
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
              width: "90vw",
              maxWidth: "90vw",
              height: "100vh",
              background: "var(--bx-surface, #FFFFFF)",
              boxShadow: "-12px 0 35px rgba(0, 0, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Top Header of 90% Slider */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--bx-border)",
                background: "var(--bx-bg-alt)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "var(--brand)",
                      color: "#ffffff",
                      textTransform: "uppercase",
                    }}
                  >
                    90% Canvas Slider Studio
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background:
                        planFormAccessMode === "quota_limited"
                          ? "rgba(201,150,46,0.15)"
                          : planFormAccessMode === "curated"
                          ? "rgba(10,46,82,0.1)"
                          : "rgba(5,150,105,0.15)",
                      color:
                        planFormAccessMode === "quota_limited"
                          ? "var(--gold-2)"
                          : planFormAccessMode === "curated"
                          ? "var(--brand)"
                          : "#065F46",
                    }}
                  >
                    {planFormAccessMode === "quota_limited"
                      ? `Mode: Bebas Pilih (Maks ${planFormQuotaLimit} Materi - Auto Lock)`
                      : planFormAccessMode === "curated"
                      ? `Mode: Ditentukan Admin (${planFormCuratedCourseIds.length} Kelas)`
                      : "Mode: Akses Penuh (All-Access)"}
                  </span>
                </div>
                <h3 style={{ margin: "2px 0 1px", fontSize: "1.2rem", fontFamily: "var(--font-heading)", color: "var(--brand)" }}>
                  {editingPlanId ? `Edit Paket Langganan: ${planFormName}` : "Buat Paket Langganan & Aturan Akses Materi Baru"}
                </h3>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted)" }}>
                  Atur harga langganan, mode pemilihan materi (Bebas / Terkurasi), sistem batas kuota, dan aturan proteksi auto-lock kelas.
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setIsPlanSliderOpen(false)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "5px",
                    border: "1px solid var(--bx-border)",
                    background: "var(--bx-surface)",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSavePlanSlider}
                  className="portal-btn-primary"
                  style={{
                    padding: "7px 18px",
                    borderRadius: "5px",
                    background: "var(--brand, #0A2E52)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FlatIcon type="check" size={14} color="#ffffff" />
                  <span>Simpan Konfigurasi Paket</span>
                </button>
              </div>
            </div>

            {/* Slider 3 Tabs Navigation */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                padding: "8px 24px",
                background: "var(--bx-surface)",
                borderBottom: "1px solid var(--bx-border)",
                flexShrink: 0,
              }}
            >
              {[
                { id: "info", label: "1. Informasi Dasar & Harga", icon: "settings" },
                { id: "access", label: "2. Setup Akses Materi & Pembatas Kuota", icon: "target" },
                { id: "simulator", label: "3. Live Simulator Kuota & Auto-Lock Siswa", icon: "eye" },
              ].map((tab) => {
                const isActive = planSliderTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPlanSliderTab(tab.id as PlanSliderTab)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: "6px",
                      border: isActive ? "1px solid var(--brand)" : "1px solid var(--bx-border)",
                      background: isActive ? "var(--brand)" : "var(--bx-bg-alt)",
                      color: isActive ? "#ffffff" : "var(--ink)",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <FlatIcon type={tab.icon} size={14} color={isActive ? "#ffffff" : "var(--muted)"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Slider Body Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              {/* ======================================================== */}
              {/* TAB 1: INFORMASI DASAR & HARGA */}
              {/* ======================================================== */}
              {planSliderTab === "info" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
                    {/* Left Form: Basic Data */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px" }}>
                          Nama Paket Langganan
                        </label>
                        <input
                          type="text"
                          required
                          value={planFormName}
                          onChange={(e) => setPlanFormName(e.target.value)}
                          placeholder="Misal: AUI Flexi-5 Learner"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--bx-border)",
                            background: "var(--bx-bg-alt)",
                            fontSize: "0.82rem",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px" }}>
                            Badge / Label Tier
                          </label>
                          <input
                            type="text"
                            value={planFormBadge}
                            onChange={(e) => setPlanFormBadge(e.target.value)}
                            placeholder="Misal: Bebas Pilih 5 Materi"
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-bg-alt)",
                              fontSize: "0.82rem",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px" }}>
                            Status Paket
                          </label>
                          <select
                            value={planFormStatus}
                            onChange={(e) => setPlanFormStatus(e.target.value as "aktif" | "nonaktif")}
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-bg-alt)",
                              fontSize: "0.82rem",
                              boxSizing: "border-box",
                            }}
                          >
                            <option value="aktif">Aktif (Tampil di Checkout Siswa)</option>
                            <option value="nonaktif">Nonaktif (Diarsipkan)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px" }}>
                          Deskripsi Paket
                        </label>
                        <textarea
                          rows={3}
                          value={planFormDescription}
                          onChange={(e) => setPlanFormDescription(e.target.value)}
                          placeholder="Jelaskan ringkasan paket ini kepada calon pelanggan..."
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--bx-border)",
                            background: "var(--bx-bg-alt)",
                            fontSize: "0.82rem",
                            boxSizing: "border-box",
                            resize: "vertical",
                          }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "var(--bx-bg-alt)", padding: "14px", borderRadius: "8px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px" }}>
                            Harga Bulanan (Rp / Bulan)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="5000"
                            value={planFormMonthly}
                            onChange={(e) => setPlanFormMonthly(Number(e.target.value))}
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-surface)",
                              fontSize: "0.82rem",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px" }}>
                            Harga Tahunan (Rp / Tahun)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="10000"
                            value={planFormYearly}
                            onChange={(e) => setPlanFormYearly(Number(e.target.value))}
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid var(--bx-border)",
                              background: "var(--bx-surface)",
                              fontSize: "0.82rem",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Form: Features / Benefits Manager */}
                    <div style={{ background: "var(--bx-surface)", border: "1px solid var(--bx-border)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div>
                        <h4 style={{ margin: "0 0 4px", fontSize: "0.95rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                          Daftar Benefit &amp; Fitur Paket
                        </h4>
                        <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--muted)" }}>
                          Poin-poin ini akan ditampilkan sebagai checklist centang di kartu penawaran paket langganan.
                        </p>
                      </div>

                      {/* Add New Feature Row */}
                      <div style={{ display: "flex", gap: "6px" }}>
                        <input
                          type="text"
                          value={planFormNewFeature}
                          onChange={(e) => setPlanFormNewFeature(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddFeature();
                            }
                          }}
                          placeholder="Tambah poin benefit (tekan Enter)..."
                          style={{
                            flex: 1,
                            padding: "6px 10px",
                            borderRadius: "5px",
                            border: "1px solid var(--bx-border)",
                            background: "var(--bx-bg-alt)",
                            fontSize: "0.78rem",
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddFeature}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "5px",
                            border: "none",
                            background: "var(--brand)",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.76rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FlatIcon type="plus" size={13} color="#ffffff" />
                          <span>Tambah</span>
                        </button>
                      </div>

                      {/* Feature Items List */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "260px", overflowY: "auto" }}>
                        {planFormFeatures.map((feat, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "6px 10px",
                              borderRadius: "5px",
                              background: "var(--bx-bg-alt)",
                              border: "1px solid var(--bx-border)",
                              fontSize: "0.76rem",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <FlatIcon type="check" size={12} color="#059669" />
                              <span>{feat}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(idx)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#DC2626",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                              }}
                            >
                              Hapus
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: SETUP AKSES MATERI & PEMBATAS KUOTA */}
              {/* ======================================================== */}
              {planSliderTab === "access" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <h4 style={{ margin: "0 0 6px", fontSize: "1rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                      Pilih Mode Akses Materi untuk Siswa Berlangganan
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)" }}>
                      Tentukan apakah materi sudah dipaketkan oleh admin, atau siswa diberikan kebebasan memilih materi sendiri dengan batasan kuota tertentu.
                    </p>
                  </div>

                  {/* 3 Interactive Cards to Pick Access Mode */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                    {/* Mode 1: quota_limited */}
                    <div
                      onClick={() => setPlanFormAccessMode("quota_limited")}
                      style={{
                        padding: "16px",
                        borderRadius: "8px",
                        border: planFormAccessMode === "quota_limited" ? "2px solid var(--gold)" : "1px solid var(--bx-border)",
                        background: planFormAccessMode === "quota_limited" ? "rgba(201,150,46,0.06)" : "var(--bx-surface)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "1.1rem" }}>🎯</span>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background: planFormAccessMode === "quota_limited" ? "var(--gold)" : "var(--bx-bg-alt)",
                            color: planFormAccessMode === "quota_limited" ? "#ffffff" : "var(--muted)",
                          }}
                        >
                          {planFormAccessMode === "quota_limited" ? "PILIHAN TERPILIH" : "PILIH MODE INI"}
                        </span>
                      </div>
                      <strong style={{ fontSize: "0.92rem", color: "var(--brand)" }}>
                        Bebas Pilih Siswa (Dengan Batas Kuota)
                      </strong>
                      <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0, lineHeight: 1.4 }}>
                        Siswa bebas memilih materi apa saja dari katalog, namun dibatasi kuota maksimal (misal: <strong>{planFormQuotaLimit} materi</strong>). Begitu kuota habis, kelas lain otomatis <strong>TERKUNCI (LOCK)</strong>.
                      </p>
                    </div>

                    {/* Mode 2: curated */}
                    <div
                      onClick={() => setPlanFormAccessMode("curated")}
                      style={{
                        padding: "16px",
                        borderRadius: "8px",
                        border: planFormAccessMode === "curated" ? "2px solid var(--brand)" : "1px solid var(--bx-border)",
                        background: planFormAccessMode === "curated" ? "rgba(10,46,82,0.06)" : "var(--bx-surface)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "1.1rem" }}>📚</span>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background: planFormAccessMode === "curated" ? "var(--brand)" : "var(--bx-bg-alt)",
                            color: planFormAccessMode === "curated" ? "#ffffff" : "var(--muted)",
                          }}
                        >
                          {planFormAccessMode === "curated" ? "PILIHAN TERPILIH" : "PILIH MODE INI"}
                        </span>
                      </div>
                      <strong style={{ fontSize: "0.92rem", color: "var(--brand)" }}>
                        Materi Ditentukan Admin (Curated List)
                      </strong>
                      <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0, lineHeight: 1.4 }}>
                        Admin memilih secara spesifik kelas-kelas yang termasuk dalam paket ini. Siswa hanya dapat mengakses materi yang telah ditentukan dalam kurikulum tersebut.
                      </p>
                    </div>

                    {/* Mode 3: all */}
                    <div
                      onClick={() => setPlanFormAccessMode("all")}
                      style={{
                        padding: "16px",
                        borderRadius: "8px",
                        border: planFormAccessMode === "all" ? "2px solid #059669" : "1px solid var(--bx-border)",
                        background: planFormAccessMode === "all" ? "rgba(5,150,105,0.06)" : "var(--bx-surface)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "1.1rem" }}>🌐</span>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background: planFormAccessMode === "all" ? "#059669" : "var(--bx-bg-alt)",
                            color: planFormAccessMode === "all" ? "#ffffff" : "var(--muted)",
                          }}
                        >
                          {planFormAccessMode === "all" ? "PILIHAN TERPILIH" : "PILIH MODE INI"}
                        </span>
                      </div>
                      <strong style={{ fontSize: "0.92rem", color: "var(--brand)" }}>
                        Akses Penuh Seluruh Materi (All-Access)
                      </strong>
                      <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0, lineHeight: 1.4 }}>
                        Siswa mendapatkan hak akses tanpa batasan ke seluruh 42+ kelas, workshop, dan learning paths di SIMAK tanpa sistem batas kuota.
                      </p>
                    </div>
                  </div>

                  {/* DETAIL CONFIGURATION BASED ON CHOSEN MODE */}
                  {planFormAccessMode === "quota_limited" && (
                    <div
                      style={{
                        background: "var(--bx-surface)",
                        border: "1px solid var(--gold)",
                        borderRadius: "8px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <h4 style={{ margin: "0 0 4px", fontSize: "0.98rem", color: "var(--brand)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <FlatIcon type="target" size={16} color="var(--gold-2)" />
                          <span>Konfigurasi Batas Kuota &amp; Proteksi Kunci Otomatis (Auto-Lock)</span>
                        </h4>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted)" }}>
                          Tentukan berapa materi yang boleh dipilih siswa secara bebas, dan pastikan sistem pembatas otomatis mengunci kelas lain saat kuota tercapai.
                        </p>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", alignItems: "flex-start" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "6px" }}>
                            Batas Maksimal Materi Terpilih (Kuota Limit Siswa)
                          </label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="number"
                              min="1"
                              max="30"
                              value={planFormQuotaLimit}
                              onChange={(e) => setPlanFormQuotaLimit(Number(e.target.value))}
                              style={{
                                width: "120px",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "2px solid var(--gold)",
                                background: "var(--bx-bg-alt)",
                                fontWeight: 800,
                                fontSize: "1.1rem",
                                color: "var(--brand)",
                              }}
                            />
                            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--brand)" }}>
                              Materi / Kelas
                            </span>
                          </div>

                          {/* Quick selection shortcuts */}
                          <div style={{ display: "flex", gap: "6px", marginTop: "10px", alignItems: "center" }}>
                            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Pilihan Cepat:</span>
                            {[3, 5, 7, 10].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setPlanFormQuotaLimit(num)}
                                style={{
                                  padding: "3px 10px",
                                  borderRadius: "4px",
                                  border: planFormQuotaLimit === num ? "1px solid var(--gold)" : "1px solid var(--bx-border)",
                                  background: planFormQuotaLimit === num ? "rgba(201,150,46,0.15)" : "var(--bx-surface)",
                                  color: planFormQuotaLimit === num ? "var(--gold-2)" : "var(--ink)",
                                  fontWeight: 700,
                                  fontSize: "0.74rem",
                                  cursor: "pointer",
                                }}
                              >
                                {num} Materi {num === 5 ? "(Rekomendasi)" : ""}
                              </button>
                            ))}
                          </div>

                          <div style={{ marginTop: "16px", padding: "12px", borderRadius: "6px", background: "var(--bx-bg-alt)", border: "1px solid var(--bx-border)" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
                              <input
                                type="checkbox"
                                checked={planFormEnforceLock}
                                onChange={(e) => setPlanFormEnforceLock(e.target.checked)}
                                style={{ width: "16px", height: "16px" }}
                              />
                              <span>Aktifkan Proteksi Kunci Otomatis (Auto-Locking Enforcement)</span>
                            </label>
                            <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "4px", paddingLeft: "24px" }}>
                              Jika dicentang, ketika siswa telah memilih {planFormQuotaLimit} materi (kuota {planFormQuotaLimit}/{planFormQuotaLimit} penuh), semua kelas lain di katalog SIMAK otomatis berstatus <strong>TERKUNCI (LOCKED)</strong> dan tombol akses tidak dapat diklik.
                            </div>
                          </div>
                        </div>

                        {/* Explaination Box */}
                        <div style={{ padding: "14px", borderRadius: "8px", background: "rgba(201,150,46,0.08)", border: "1px solid rgba(201,150,46,0.3)" }}>
                          <strong style={{ display: "block", fontSize: "0.82rem", color: "var(--brand)", marginBottom: "8px" }}>
                            Cara Kerja Counting &amp; Pembatas:
                          </strong>
                          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.74rem", color: "var(--ink)", lineHeight: 1.5 }}>
                            <li>Siswa menelusuri katalog kelas bebas memilih minat.</li>
                            <li>Setiap kali siswa mengklik &quot;Ambil Kelas Ini&quot;, counter bertambah (misal 1/{planFormQuotaLimit}, 2/{planFormQuotaLimit}).</li>
                            <li>Begitu mencapai {planFormQuotaLimit}/{planFormQuotaLimit}, sisa materi lain otomatis <strong>TERKUNCI</strong>.</li>
                            <li>Siswa yang mencoba mengklik kelas ke-{planFormQuotaLimit + 1} akan melihat peringatan: <em>&quot;Batas {planFormQuotaLimit} materi tercapai. Lepas kelas aktif untuk menukar, atau upgrade ke paket Pro!&quot;</em></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {planFormAccessMode === "curated" && (
                    <div
                      style={{
                        background: "var(--bx-surface)",
                        border: "1px solid var(--brand)",
                        borderRadius: "8px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                        <div>
                          <h4 style={{ margin: "0 0 2px", fontSize: "0.98rem", color: "var(--brand)", fontFamily: "var(--font-heading)" }}>
                            Pilih Daftar Materi Kurikulum yang Ditentukan Admin
                          </h4>
                          <p style={{ margin: 0, fontSize: "0.74rem", color: "var(--muted)" }}>
                            Centang kelas-kelas yang termasuk dalam paket ini ({planFormCuratedCourseIds.length} materi terpilih).
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input
                            type="text"
                            placeholder="Cari nama kelas atau instruktur..."
                            value={courseSearchQuery}
                            onChange={(e) => setCourseSearchQuery(e.target.value)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: "5px",
                              border: "1px solid var(--bx-border)",
                              fontSize: "0.76rem",
                              background: "var(--bx-bg-alt)",
                              width: "220px",
                            }}
                          />
                        </div>
                      </div>

                      {/* Course Selector Checklist Table */}
                      <div style={{ border: "1px solid var(--bx-border)", borderRadius: "6px", maxHeight: "320px", overflowY: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                          <thead>
                            <tr style={{ background: "var(--bx-bg-alt)", borderBottom: "1px solid var(--bx-border)", textAlign: "left" }}>
                              <th style={{ padding: "8px 12px", width: "40px" }}>Pilih</th>
                              <th style={{ padding: "8px 12px" }}>Materi Kelas</th>
                              <th style={{ padding: "8px 12px" }}>Kategori</th>
                              <th style={{ padding: "8px 12px" }}>Instruktur</th>
                              <th style={{ padding: "8px 12px" }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCourses.map((c) => {
                              const isChecked = planFormCuratedCourseIds.includes(c.id);
                              return (
                                <tr
                                  key={c.id}
                                  onClick={() => handleToggleCuratedCourse(c.id)}
                                  style={{
                                    borderBottom: "1px solid var(--bx-border)",
                                    background: isChecked ? "rgba(10,46,82,0.04)" : "transparent",
                                    cursor: "pointer",
                                  }}
                                >
                                  <td style={{ padding: "8px 12px", textAlign: "center" }}>
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {}} // handled by tr click
                                      style={{ width: "15px", height: "15px" }}
                                    />
                                  </td>
                                  <td style={{ padding: "8px 12px" }}>
                                    <strong style={{ color: "var(--brand)", fontSize: "0.8rem" }}>{c.title}</strong>
                                    <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{c.modules.length} Modul Pembelajaran • Level: {c.level}</div>
                                  </td>
                                  <td style={{ padding: "8px 12px" }}>
                                    <span style={{ fontSize: "0.7rem", padding: "2px 6px", borderRadius: "3px", background: "var(--bx-bg-alt)" }}>
                                      {c.category}
                                    </span>
                                  </td>
                                  <td style={{ padding: "8px 12px", color: "var(--muted)" }}>{c.instructorName}</td>
                                  <td style={{ padding: "8px 12px" }}>
                                    {isChecked ? (
                                      <span style={{ color: "#059669", fontWeight: 700, fontSize: "0.72rem", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                        <FlatIcon type="check" size={12} color="#059669" />
                                        <span>Termasuk</span>
                                      </span>
                                    ) : (
                                      <span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>Tidak Termasuk</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {planFormAccessMode === "all" && (
                    <div style={{ background: "rgba(5, 150, 105, 0.08)", border: "1px solid #059669", borderRadius: "8px", padding: "18px" }}>
                      <h4 style={{ margin: "0 0 6px", fontSize: "0.95rem", color: "#065F46", fontFamily: "var(--font-heading)" }}>
                        Akses Penuh Seluruh Katalog (All-Access Unrestricted)
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.76rem", color: "var(--ink)", lineHeight: 1.4 }}>
                        Semua siswa yang berlangganan paket ini otomatis memiliki hak akses penuh ke seluruh 42+ kelas, kuis, dan submission tugas di platform SIMAK tanpa kuota pembatas.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: LIVE SIMULATOR KUOTA & AUTO-LOCK SISWA */}
              {/* ======================================================== */}
              {planSliderTab === "simulator" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {/* Simulation Banner */}
                  <div
                    style={{
                      background: "var(--bx-bg-alt)",
                      border: "1px solid var(--bx-border)",
                      borderRadius: "10px",
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "14px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src="/alumni/alumni_1.jpg"
                        alt="Simulated Student"
                        style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--brand)" }}
                      />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <strong style={{ fontSize: "0.92rem", color: "var(--brand)" }}>
                            Ahmad Rizky (Simulasi Sudut Pandang Siswa)
                          </strong>
                          <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "4px", background: "var(--brand)", color: "#ffffff", fontWeight: 700 }}>
                            {planFormName}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "2px" }}>
                          Mode: <strong>{planFormAccessMode.toUpperCase()}</strong> • Batas Kuota: <strong>{planFormAccessMode === "quota_limited" ? `${planFormQuotaLimit} Materi` : planFormAccessMode === "curated" ? `${planFormCuratedCourseIds.length} Materi Terpilih` : "Unlimited"}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Reset Simulation */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => setSimulatedPickedCourseIds([])}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "5px",
                          border: "1px solid var(--bx-border)",
                          background: "var(--bx-surface)",
                          color: "var(--muted)",
                          fontSize: "0.74rem",
                          cursor: "pointer",
                        }}
                      >
                        Reset Semua Pilihan (0 Kuota)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const firstN = MOCK_LMS_COURSES.slice(0, planFormQuotaLimit).map((c) => c.id);
                          setSimulatedPickedCourseIds(firstN);
                        }}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "5px",
                          border: "1px solid var(--gold)",
                          background: "rgba(201,150,46,0.15)",
                          color: "var(--gold-2)",
                          fontWeight: 700,
                          fontSize: "0.74rem",
                          cursor: "pointer",
                        }}
                      >
                        Simulasikan Kuota Penuh ({planFormQuotaLimit}/{planFormQuotaLimit})
                      </button>
                    </div>
                  </div>

                  {/* Quota Progress Meter & Lock Alert */}
                  {planFormAccessMode === "quota_limited" && (
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: "8px",
                        background:
                          simulatedPickedCourseIds.length >= planFormQuotaLimit
                            ? "#FEF2F2"
                            : "var(--bx-surface)",
                        border:
                          simulatedPickedCourseIds.length >= planFormQuotaLimit
                            ? "2px solid #DC2626"
                            : "1px solid var(--bx-border)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: simulatedPickedCourseIds.length >= planFormQuotaLimit ? "#991B1B" : "var(--brand)" }}>
                          Status Penggunaan Kuota Siswa:
                        </span>
                        <span style={{ fontSize: "0.86rem", fontWeight: 800, color: simulatedPickedCourseIds.length >= planFormQuotaLimit ? "#DC2626" : "var(--gold-2)" }}>
                          {simulatedPickedCourseIds.length} / {planFormQuotaLimit} Materi ({Math.min(100, Math.round((simulatedPickedCourseIds.length / planFormQuotaLimit) * 100))}%)
                        </span>
                      </div>

                      {/* Bar indicator */}
                      <div style={{ height: "10px", width: "100%", background: "var(--bx-border)", borderRadius: "5px", overflow: "hidden", marginBottom: "8px" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(100, (simulatedPickedCourseIds.length / planFormQuotaLimit) * 100)}%`,
                            background: simulatedPickedCourseIds.length >= planFormQuotaLimit ? "#DC2626" : "var(--gold)",
                            transition: "width 0.25s ease",
                          }}
                        />
                      </div>

                      {/* Alert status text */}
                      {simulatedPickedCourseIds.length >= planFormQuotaLimit ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#991B1B", fontSize: "0.78rem", fontWeight: 700 }}>
                          <FlatIcon type="shield" size={16} color="#DC2626" />
                          <span>
                            🔒 BATAS KUOTA {planFormQuotaLimit}/{planFormQuotaLimit} TERCAPAI! Seluruh kelas lain di katalog SIMAK otomatis TERKUNCI (LOCK). Siswa tidak dapat mengakses kelas baru kecuali melepas salah satu kelas aktif.
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#065F46", fontSize: "0.78rem" }}>
                          <FlatIcon type="check" size={14} color="#059669" />
                          <span>
                            Siswa masih memiliki <strong>{planFormQuotaLimit - simulatedPickedCourseIds.length} kuota materi</strong> yang bebas dipilih dari katalog kelas.
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Course Cards Catalog Simulation */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                      <strong style={{ fontSize: "0.88rem", color: "var(--brand)" }}>
                        Katalog Kelas SIMAK (Uji Coba Klik &amp; Lock)
                      </strong>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <select
                          value={courseCategoryFilter}
                          onChange={(e) => setCourseCategoryFilter(e.target.value)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "5px",
                            border: "1px solid var(--bx-border)",
                            background: "var(--bx-bg-alt)",
                            fontSize: "0.75rem",
                          }}
                        >
                          {courseCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat === "all" ? "Semua Kategori" : cat}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Cari kelas..."
                          value={courseSearchQuery}
                          onChange={(e) => setCourseSearchQuery(e.target.value)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "5px",
                            border: "1px solid var(--bx-border)",
                            background: "var(--bx-bg-alt)",
                            fontSize: "0.75rem",
                            width: "180px",
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                      {filteredCourses.map((c) => {
                        const isPicked = simulatedPickedCourseIds.includes(c.id);
                        const isCuratedAllowed = planFormAccessMode === "curated" ? planFormCuratedCourseIds.includes(c.id) : true;
                        const isQuotaFull = planFormAccessMode === "quota_limited" && simulatedPickedCourseIds.length >= planFormQuotaLimit;
                        const isLocked = (planFormAccessMode === "quota_limited" && isQuotaFull && !isPicked) || (planFormAccessMode === "curated" && !isCuratedAllowed);

                        return (
                          <div
                            key={c.id}
                            style={{
                              border: isPicked
                                ? "2px solid #059669"
                                : isLocked
                                ? "1px dashed #D1D5DB"
                                : "1px solid var(--bx-border)",
                              borderRadius: "8px",
                              padding: "14px",
                              background: isPicked
                                ? "#F0FDF4"
                                : isLocked
                                ? "#F9FAFB"
                                : "var(--bx-surface)",
                              opacity: isLocked ? 0.75 : 1,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              boxShadow: isPicked ? "0 2px 8px rgba(5,150,105,0.12)" : "none",
                              position: "relative",
                            }}
                          >
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                <span style={{ fontSize: "0.68rem", padding: "1px 6px", borderRadius: "3px", background: "var(--bx-bg-alt)", color: "var(--muted)" }}>
                                  {c.category}
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    background: isPicked
                                      ? "#D1FAE5"
                                      : isLocked
                                      ? "#FEE2E2"
                                      : "var(--bx-bg-alt)",
                                    color: isPicked
                                      ? "#065F46"
                                      : isLocked
                                      ? "#DC2626"
                                      : "var(--ink)",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  {isPicked && <FlatIcon type="check" size={11} color="#065F46" />}
                                  {isLocked && <FlatIcon type="shield" size={11} color="#DC2626" />}
                                  <span>
                                    {isPicked ? "TERPILIH & AKTIF" : isLocked ? "TERKUNCI (LOCKED)" : "TERSEDIA"}
                                  </span>
                                </span>
                              </div>

                              <strong style={{ fontSize: "0.85rem", color: isLocked ? "var(--muted)" : "var(--brand)", display: "block", marginBottom: "4px" }}>
                                {c.title}
                              </strong>
                              <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                                Instruktur: {c.instructorName} • {c.modules.length} Modul
                              </div>
                            </div>

                            <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--bx-border)" }}>
                              {isPicked ? (
                                <button
                                  type="button"
                                  onClick={() => handleToggleSimulatedPick(c.id)}
                                  style={{
                                    width: "100%",
                                    padding: "6px 10px",
                                    borderRadius: "5px",
                                    border: "1px solid #DC2626",
                                    background: "#FEE2E2",
                                    color: "#DC2626",
                                    fontWeight: 700,
                                    fontSize: "0.74rem",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <span>Lepas Akses (Bebaskan 1 Kuota)</span>
                                </button>
                              ) : isLocked ? (
                                <button
                                  type="button"
                                  disabled
                                  style={{
                                    width: "100%",
                                    padding: "6px 10px",
                                    borderRadius: "5px",
                                    border: "1px solid #D1D5DB",
                                    background: "#E5E7EB",
                                    color: "#6B7280",
                                    fontWeight: 700,
                                    fontSize: "0.72rem",
                                    cursor: "not-allowed",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <FlatIcon type="shield" size={12} color="#6B7280" />
                                  <span>Terkunci ({simulatedPickedCourseIds.length}/{planFormQuotaLimit} Kuota Habis)</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleSimulatedPick(c.id)}
                                  style={{
                                    width: "100%",
                                    padding: "6px 10px",
                                    borderRadius: "5px",
                                    border: "none",
                                    background: "var(--brand)",
                                    color: "#ffffff",
                                    fontWeight: 700,
                                    fontSize: "0.74rem",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <FlatIcon type="plus" size={12} color="#ffffff" />
                                  <span>Pilih Kelas Ini (+1 Kuota)</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH VOUCHER */}
      {/* ============================================================== */}
      {showAddVoucherModal && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "rgba(10,46,82,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "10px", padding: "24px", maxWidth: "440px", width: "100%", fontSize: "0.82rem" }}>
            <h3 style={{ margin: "0 0 12px", color: "var(--brand)" }}>Buat Kode Voucher Baru</h3>
            <form onSubmit={handleAddVoucher} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Kode Promo (Huruf Kapital)</label>
                <input type="text" required value={newVoucherCode} onChange={(e) => setNewVoucherCode(e.target.value)} placeholder="Misal: DISKONSPESIAL25" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)", fontFamily: "var(--font-mono)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Tipe Diskon</label>
                <select value={newVoucherType} onChange={(e) => setNewVoucherType(e.target.value as any)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }}>
                  <option value="percent">Persentase (%)</option>
                  <option value="fixed">Potongan Nominal Tetap (Rp)</option>
                  <option value="free">Gratis Penuh 100%</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Nilai Diskon (% atau Rp)</label>
                <input type="number" value={newVoucherVal} onChange={(e) => setNewVoucherVal(Number(e.target.value))} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowAddVoucherModal(false)} style={{ padding: "8px 14px", border: "1px solid var(--bx-border)", background: "transparent", borderRadius: "6px" }}>Batal</button>
                <button type="submit" style={{ padding: "8px 16px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, borderRadius: "6px" }}>Simpan Voucher</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: BULK GENERATE */}
      {/* ============================================================== */}
      {showBulkGenModal && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "rgba(10,46,82,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "10px", padding: "24px", maxWidth: "420px", width: "100%", fontSize: "0.82rem" }}>
            <h3 style={{ margin: "0 0 8px", color: "var(--brand)" }}>Bulk Voucher Generator</h3>
            <p style={{ margin: "0 0 14px", color: "var(--muted)", fontSize: "0.78rem" }}>
              Buat puluhan kode promo sekali pakai secara instan untuk event atau promosi broadcast.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button type="button" onClick={() => setShowBulkGenModal(false)} style={{ padding: "8px 14px", border: "1px solid var(--bx-border)", background: "transparent", borderRadius: "6px" }}>Batal</button>
              <button type="button" onClick={() => handleBulkGenerate(50)} style={{ padding: "8px 16px", border: "none", background: "var(--gold)", color: "#ffffff", fontWeight: 700, borderRadius: "6px" }}>Generate 50 Kode Unik</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TAMBAH BEASISWA */}
      {/* ============================================================== */}
      {showAddScholarshipModal && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "rgba(10,46,82,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "10px", padding: "24px", maxWidth: "440px", width: "100%", fontSize: "0.82rem" }}>
            <h3 style={{ margin: "0 0 12px", color: "var(--brand)" }}>Buka Program Beasiswa Baru</h3>
            <form onSubmit={handleAddScholarship} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Nama Program Beasiswa</label>
                <input type="text" required value={newSchTitle} onChange={(e) => setNewSchTitle(e.target.value)} placeholder="Misal: Beasiswa AI Fellowship 2026" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Sponsor / Partner Pendana</label>
                <input type="text" value={newSchSponsor} onChange={(e) => setNewSchSponsor(e.target.value)} placeholder="Misal: Google Cloud Indonesia" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>Kuota Penerima (Orang)</label>
                <input type="number" value={newSchQuota} onChange={(e) => setNewSchQuota(Number(e.target.value))} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--bx-border)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button type="button" onClick={() => setShowAddScholarshipModal(false)} style={{ padding: "8px 14px", border: "1px solid var(--bx-border)", background: "transparent", borderRadius: "6px" }}>Batal</button>
                <button type="submit" style={{ padding: "8px 16px", border: "none", background: "var(--brand)", color: "#ffffff", fontWeight: 700, borderRadius: "6px" }}>Publikasikan Beasiswa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: REVIEW PENDAFTAR BEASISWA */}
      {/* ============================================================== */}
      {selectedScholarship && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "rgba(10,46,82,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", borderRadius: "10px", padding: "24px", maxWidth: "700px", width: "100%", maxHeight: "90vh", overflowY: "auto", fontSize: "0.82rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", borderBottom: "1px solid var(--bx-border)", paddingBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "var(--bx-bg-alt)", color: "var(--gold-2)" }}>
                  {selectedScholarship.sponsor}
                </span>
                <h3 style={{ margin: "4px 0 2px", color: "var(--brand)", fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>
                  Seleksi Pendaftar: {selectedScholarship.title}
                </h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.78rem" }}>
                  Kelas Target: <strong>{selectedScholarship.coveredCourse}</strong> • Kuota: <strong>{selectedScholarship.approvedCount} / {selectedScholarship.quota} Terisi</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScholarship(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--muted)" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {scholarshipApplicants.filter((app) => app.scholarshipId === selectedScholarship.id).length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>
                  Belum ada berkas pendaftaran yang masuk untuk program beasiswa ini.
                </div>
              ) : (
                scholarshipApplicants
                  .filter((app) => app.scholarshipId === selectedScholarship.id)
                  .map((app) => (
                    <div
                      key={app.id}
                      style={{
                        border: "1px solid var(--bx-border)",
                        borderRadius: "8px",
                        padding: "14px",
                        background: "var(--bx-surface)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img
                            src={app.studentAvatar}
                            alt={app.studentName}
                            style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div>
                            <strong style={{ fontSize: "0.88rem", color: "var(--brand)" }}>{app.studentName}</strong>
                            <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                              {app.university} • {app.major} (IPK: <strong style={{ color: "var(--gold-2)" }}>{app.gpa}</strong>)
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background:
                              app.status === "approved" ? "#D1FAE5" :
                              app.status === "rejected" ? "#FEE2E2" : "#FEF3C7",
                            color:
                              app.status === "approved" ? "#065F46" :
                              app.status === "rejected" ? "#DC2626" : "#B45309",
                            textTransform: "uppercase",
                          }}
                        >
                          {app.status === "approved" ? "Diterima & Enrolled" : app.status === "rejected" ? "Ditolak" : "Menunggu Seleksi"}
                        </span>
                      </div>

                      <div style={{ background: "var(--bx-bg-alt)", padding: "10px", borderRadius: "6px", fontSize: "0.76rem", color: "var(--ink)" }}>
                        <strong style={{ display: "block", marginBottom: "4px", color: "var(--brand)" }}>Esai Motivasi &amp; Komitmen:</strong>
                        &quot;{app.essay}&quot;
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px" }}>
                        <div>
                          {app.portfolioUrl ? (
                            <a
                              href={app.portfolioUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: "0.74rem", color: "var(--brand)", textDecoration: "none", fontWeight: 600 }}
                            >
                              🔗 Buka Portofolio Pelamar ↗
                            </a>
                          ) : (
                            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Tidak melampirkan link</span>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: "6px" }}>
                          {app.status !== "approved" && (
                            <button
                              type="button"
                              onClick={() => handleApproveScholarshipApplicant(app.id)}
                              style={{
                                padding: "5px 12px",
                                borderRadius: "4px",
                                border: "none",
                                background: "#059669",
                                color: "#ffffff",
                                fontSize: "0.74rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Terima &amp; Auto-Enroll
                            </button>
                          )}
                          {app.status !== "rejected" && (
                            <button
                              type="button"
                              onClick={() => handleRejectScholarshipApplicant(app.id)}
                              style={{
                                padding: "5px 10px",
                                borderRadius: "4px",
                                border: "1px solid #FCA5A5",
                                background: "transparent",
                                color: "#DC2626",
                                fontSize: "0.74rem",
                                cursor: "pointer",
                              }}
                            >
                              Tolak
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--bx-border)" }}>
              <button
                type="button"
                onClick={() => setSelectedScholarship(null)}
                style={{ padding: "8px 18px", borderRadius: "6px", border: "1px solid var(--bx-border)", background: "var(--bx-bg-alt)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
              >
                Tutup Panel Seleksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
