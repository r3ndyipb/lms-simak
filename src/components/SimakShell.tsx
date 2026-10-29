"use client";

import React, { useState, useEffect } from "react";
import SimakHeader from "./SimakHeader";
import SimakSidebar from "./SimakSidebar";
import SimakDashboardOverview from "./SimakDashboardOverview";
import SimakReviewQueueView from "./SimakReviewQueueView";
import SimakKurikulumView from "./SimakKurikulumView";
import SimakMasterDataView from "./SimakMasterDataView";
import SimakLearningPathsView from "./SimakLearningPathsView";
import SimakProgramsView from "./SimakProgramsView";
import SimakMentoringView from "./SimakMentoringView";
import SimakEventsView from "./SimakEventsView";
import SimakJobsView from "./SimakJobsView";
import SimakBlogView from "./SimakBlogView";
import SimakUsersView from "./SimakUsersView";
import SimakGradebookView from "./SimakGradebookView";
import SimakSettingsView from "./SimakSettingsView";
import SimakRoleManagementView from "./SimakRoleManagementView";
import SimakAuditLogView from "./SimakAuditLogView";
import SimakKeuanganView from "./SimakKeuanganView";
import SimakQuizBuilderView from "./SimakQuizBuilderView";
import SimakSubscriptionView from "./SimakSubscriptionView";
import SimakCommunityView from "./SimakCommunityView";
import ReviewModal from "./ReviewModal";
import { SimakNavId, SimakUser, ReviewSubmission } from "../types/simak";
import { DEMO_USERS, MOCK_SUBMISSIONS, getStoredUser, saveStoredUser } from "../data/simakMockData";

interface SimakShellProps {
  initialNav?: SimakNavId;
}

export default function SimakShell({ initialNav = "dashboard" }: SimakShellProps) {
  const [activeNav, setActiveNav] = useState<SimakNavId>(initialNav);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<SimakUser>(DEMO_USERS[0]);
  const [submissions, setSubmissions] = useState<ReviewSubmission[]>(MOCK_SUBMISSIONS);
  const [activeReviewModalSub, setActiveReviewModalSub] = useState<ReviewSubmission | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCollapse = localStorage.getItem("simak_sidebar_collapsed");
      if (storedCollapse !== null) {
        setSidebarCollapsed(storedCollapse === "true");
      }

      const user = getStoredUser();
      setCurrentUser(user);

      const hash = window.location.hash.replace("#", "") as SimakNavId;
      if (hash) {
        setActiveNav(hash);
        if (hash === "keuangan") {
          setSidebarCollapsed(true);
        }
      }
    }
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("simak_sidebar_collapsed", String(next));
      }
      return next;
    });
  };

  const handleSelectNav = (navId: SimakNavId) => {
    setActiveNav(navId);
    // Menu Keuangan & Transaksi otomatis mengaktifkan sidebar mode minimalis
    if (navId === "keuangan") {
      setSidebarCollapsed(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("simak_sidebar_collapsed", "true");
      }
    }
    if (typeof window !== "undefined") {
      window.location.hash = navId;
    }
  };

  const handleUserChange = (user: SimakUser) => {
    setCurrentUser(user);
    saveStoredUser(user);
  };

  const handleSaveReview = (updated: ReviewSubmission) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  return (
    <div
      className="portal-app-layout"
      style={{
        height: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "var(--bx-bg, #FBF8F1)",
      }}
    >
      {/* Top Header */}
      <SimakHeader
        currentPage="dashboard"
        onToggleSidebar={handleToggleSidebar}
        isSidebarCollapsed={sidebarCollapsed}
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />

      {/* Main App Body: Sidebar + Stage */}
      <div
        className="portal-app-body"
        style={{
          flex: 1,
          height: "calc(100vh - 58px)",
          maxHeight: "calc(100vh - 58px)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <SimakSidebar
          collapsed={sidebarCollapsed}
          onToggle={handleToggleSidebar}
          activeId={activeNav}
          onSelectNav={handleSelectNav}
          currentRole={currentUser.role}
          currentUser={currentUser}
          onUserClick={() => handleSelectNav("users")}
        />

        {/* Main Stage (offset by 240px / 68px with full clipping protection) */}
        <div
          className={`portal-main-stage ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
          style={{
            height: "100%",
            maxHeight: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            marginLeft: sidebarCollapsed ? "68px" : "240px",
            width: sidebarCollapsed ? "calc(100% - 68px)" : "calc(100% - 240px)",
            maxWidth: sidebarCollapsed ? "calc(100% - 68px)" : "calc(100% - 240px)",
            transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Main Stage Content Container with proper padding */}
          <div
            style={{
              flex: 1,
              width: "100%",
              maxWidth: "100%",
              height: "100%",
              maxHeight: "100%",
              boxSizing: "border-box",
              padding: "10px 16px",
              overflow: activeNav === "dashboard" ? "hidden" : "auto",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              minWidth: 0,
            }}
          >
            {activeNav === "dashboard" && (
              <SimakDashboardOverview
                currentUser={currentUser}
                onNavigate={handleSelectNav}
                onOpenReviewModal={(sub) => setActiveReviewModalSub(sub)}
              />
            )}

            {activeNav === "master-data" && <SimakMasterDataView />}

            {activeNav === "kurikulum" && <SimakKurikulumView />}

            {activeNav === "quiz-builder" && <SimakQuizBuilderView />}

            {activeNav === "learning-paths" && <SimakLearningPathsView />}

            {activeNav === "subscription" && <SimakSubscriptionView />}

            {activeNav === "keuangan" && (
              <SimakKeuanganView
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={handleToggleSidebar}
              />
            )}

            {activeNav === "komunitas" && <SimakCommunityView />}

            {activeNav === "programs" && <SimakProgramsView />}

            {activeNav === "mentoring" && <SimakMentoringView />}

            {activeNav === "review-queue" && (
              <SimakReviewQueueView
                submissions={submissions}
                onOpenReviewModal={(sub) => setActiveReviewModalSub(sub)}
              />
            )}

            {activeNav === "penilaian" && <SimakGradebookView />}

            {activeNav === "events" && <SimakEventsView />}

            {activeNav === "jobs" && <SimakJobsView />}

            {activeNav === "blog" && <SimakBlogView />}

            {(activeNav === "users" ||
              activeNav === "mahasiswa" ||
              activeNav === "dosen-reviewer") && <SimakUsersView />}

            {activeNav === "pengaturan" && <SimakSettingsView />}

            {(activeNav === "role-management" || activeNav === "staf-rbac") && (
              <SimakRoleManagementView />
            )}

            {activeNav === "audit-log" && <SimakAuditLogView />}
          </div>
        </div>
      </div>

      {/* Interactive Review Modal */}
      {activeReviewModalSub && (
        <ReviewModal
          submission={activeReviewModalSub}
          onClose={() => setActiveReviewModalSub(null)}
          onSaveReview={handleSaveReview}
        />
      )}
    </div>
  );
}
