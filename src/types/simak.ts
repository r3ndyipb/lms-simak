export type SimakRole =
  | "administrator"
  | "administrasi"
  | "instruktur"
  | "reviewer"
  | "koordinator";

export interface SimakUser {
  id: string;
  nip: string;
  name: string;
  email: string;
  role: SimakRole;
  roleTitle: string;
  department: string;
  avatar: string;
  phone?: string;
  status: "aktif" | "cuti" | "nonaktif";
  lastLogin?: string;
  bio?: string;
  assignedQueueCount?: number;
  activeCoursesCount?: number;
}

export type ReviewStatus = "pending" | "in_review" | "approved" | "revision" | "rejected";

export interface ReviewSubmissionHistoryItem {
  id: string;
  attemptNumber: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewerName?: string;
  status: ReviewStatus;
  score?: number;
  feedbackNotes: string;
  revisionChecklist?: string[];
  changedFilesCount?: number;
}

export interface ReviewSubmission {
  id: string;
  submissionCode: string;
  studentName: string;
  studentNim: string;
  studentAvatar: string;
  trackName: string;
  courseName: string;
  moduleTitle: string;
  submittedAt: string;
  deadlineHoursLeft: number;
  status: ReviewStatus;
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  score?: number;
  rubricScores?: {
    cleanArchitecture: number;
    codeStyle: number;
    testCoverage: number;
    functionality: number;
  };
  notes?: string;
  repoUrl?: string;
  history?: ReviewSubmissionHistoryItem[];
}

export interface AcademicCourse {
  id: string;
  code: string;
  title: string;
  track: string;
  sks: number;
  totalSessions: number;
  completedSessions: number;
  instructorId: string;
  instructorName: string;
  enrolledStudents: number;
  status: "berjalan" | "siap" | "selesai";
  syllabusStatus: "terverifikasi" | "draft" | "perlu_revisi";
  semester: string;
}

export interface ClassSchedule {
  id: string;
  courseCode: string;
  courseTitle: string;
  sessionNumber: number;
  sessionTitle: string;
  date: string;
  time: string;
  instructorName: string;
  room: string;
  type: "online_zoom" | "offline_lab" | "hybrid";
  attendanceCount: number;
  totalStudents: number;
  status: "mendatang" | "berlangsung" | "selesai";
}

export interface StudentEnrollment {
  id: string;
  nim: string;
  name: string;
  email: string;
  track: string;
  semester: number;
  gpa: number;
  progressPercentage: number;
  status: "aktif" | "cuti" | "lulus" | "peringatan";
  avatar: string;
  submissionCount: number;
  approvedCount: number;
}

export interface SimakActivityLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  timestamp: string;
  type: "review" | "grade" | "schedule" | "user" | "system" | "course" | "finance";
}

// Master Data Types
export interface LmsCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  badgeColor: string;
  order: number;
  status: "aktif" | "nonaktif";
  courseCount: number;
}

export interface LmsLevel {
  id: string;
  name: string;
  slug: string;
  description: string;
  badgeColor: string;
  order: number;
}

export interface LmsTag {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  usageCount: number;
}

export interface LmsLanguage {
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
}

export interface LmsCertificateTemplate {
  id: string;
  title: string;
  categoryName: string;
  orientation: "landscape" | "portrait";
  primaryColor: string;
  previewUrl: string;
  components: {
    showLogo: boolean;
    showStudentName: boolean;
    showCourseTitle: boolean;
    showDate: boolean;
    showScore: boolean;
    showQr: boolean;
    showSignature: boolean;
  };
}

// Course Management Types
export interface LmsQuizConfig {
  passingScore: number; // e.g. 75 (%)
  durationMinutes: number; // e.g. 15
  randomizeQuestions: boolean;
  showExplanationImmediately: boolean;
  questions: LmsQuizQuestion[];
}

export interface LmsAssignmentRubric {
  id: string;
  criteria: string;
  weight: number; // percentage (e.g. 30)
  description: string;
}

export interface LmsAssignmentTaskItem {
  id: string;
  order: number;
  title: string;
  description: string;
  acceptanceCriteria?: string;
  studentAnswer?: string;
}

export interface LmsAssignmentConfig {
  intro: string;
  submissionFormat: {
    allowGithub: boolean;
    allowDemoUrl: boolean;
    allowFileUpload: boolean;
    fileTypesAllowed: string; // e.g. ".zip, .rar, .pdf"
    maxFileSizeMb: number; // e.g. 50
  };
  tasks?: LmsAssignmentTaskItem[];
  requiredFiles: string[]; // e.g. ["README.md", "package.json", ".env.example"]
  rubrics: LmsAssignmentRubric[];
  tipsAndTricks: string[];
  starterCodeUrl?: string;
  starterAssetUrl?: string;
  slaReviewHours: number; // e.g. 48
}

export interface LmsDownloadConfig {
  fileTitle: string;
  fileType: "pdf" | "zip" | "pptx" | "code" | "other";
  fileSizeMb: number;
  version: string;
  downloadUrl: string;
  studyInstructions: string;
}

export interface LmsVideoConfig {
  provider: "youtube" | "vimeo" | "mp4" | "other";
  videoUrl: string;
  durationMinutes: number;
  chapters?: { timeSeconds: number; title: string }[];
}

export interface LmsAcademicTeam {
  curriculumTeam?: string;
  curriculumAuthor: string;
  curriculumAuthorAvatar?: string;
  curriculumAuthorRole?: string;
  instructorName: string;
  instructorAvatar?: string;
  instructorRole?: string;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewerRole?: string;
  qaValidatorName?: string;
}

export interface LmsLessonFeeShare {
  unitPrice: number;
  instructorPct: number;
  reviewerPct: number;
  infraPct: number;
  opsPct: number;
}

export interface LmsLesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | "assignment" | "download";
  durationMinutes?: number;
  freePreview: boolean;
  requiresPrev: boolean;
  contentUrl?: string;
  textContent?: string;
  attachmentUrl?: string;
  summary?: string;
  quizConfig?: LmsQuizConfig;
  assignmentConfig?: LmsAssignmentConfig;
  downloadConfig?: LmsDownloadConfig;
  videoConfig?: LmsVideoConfig;
  feeShareConfig?: LmsLessonFeeShare;
  academicTeam?: LmsAcademicTeam;
}

export interface LmsModule {
  id: string;
  title: string;
  order: number;
  lessons: LmsLesson[];
}

export interface LmsCourseReview {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  date: string;
  comment: string;
  reply?: string;
}

export interface LmsCourse {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  thumbnail: string;
  trailerVideoUrl?: string;
  category: string;
  level: string;
  language: string;
  durationHours: number;
  normalPrice: number;
  discountPrice?: number;
  accessType: "gratis" | "berbayar" | "langganan";
  status: "draft" | "terpublikasi" | "arsip";
  instructorId: string;
  instructorName: string;
  instructorAvatar?: string;
  enrolledStudents: number;
  rating: number;
  reviewCount: number;
  updatedAt: string;
  learningTargets: string[];
  prerequisites: string[];
  targetAudience: string[];
  modules: LmsModule[];
  seoTitle?: string;
  seoDescription?: string;
  scheduledAt?: string;
  reviews?: LmsCourseReview[];
  academicTeam?: LmsAcademicTeam;
}

// User Management Extended Types
export interface LmsStudent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  registeredAt: string;
  status: "aktif" | "nonaktif" | "banned";
  enrolledCoursesCount: number;
  avgProgress: number;
  lastActive: string;
  notes?: string;
  category?: string;
  paidHistory?: {
    id: string;
    item: string;
    date: string;
    amount: number;
    status: "sukses" | "menunggu" | "refund";
  }[];
  enrolledCourses?: {
    courseId: string;
    title: string;
    progress: number;
  }[];
}

export interface LmsInstructor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  field: string;
  totalCourses: number;
  avgRating: number;
  totalStudents: number;
  status: "aktif" | "pending" | "suspended";
  commissionRate: number; // e.g. 70 means 70%
  bio: string;
  joinedAt: string;
}

// ==========================================
// FASE 2: KEUANGAN, QUIZ & BLOG TYPES
// ==========================================
export interface LmsTransaction {
  id: string;
  orderNumber: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  itemName: string;
  itemType: "kelas" | "learning-path" | "langganan";
  amount: number;
  paymentMethod: string;
  status: "paid" | "pending" | "failed" | "refunded";
  createdAt: string;
  paidAt?: string;
  proofUrl?: string;
  refundReason?: string;
}

export interface LmsInstructorPayout {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorEmail: string;
  instructorAvatar: string;
  totalSales: number;
  commissionRate: number;
  payableAmount: number;
  status: "pending" | "paid";
  bankAccount: string;
  period: string;
  paidAt?: string;
}

export interface LmsMateriFeeShare {
  id: string;
  materiId: string;
  materiTitle: string;
  materiType: "assignment" | "quiz" | "capstone" | "video";
  courseId: string;
  courseTitle: string;
  unitPrice: number;
  instructorSharePct: number;
  reviewerSharePct: number;
  infrastructureSharePct: number;
  platformOpsSharePct: number;
  targetQuestionsOrSubmissions: number;
  calculatedInstructorFee: number;
  calculatedReviewerFee: number;
  calculatedInfraFee: number;
  calculatedOpsFee: number;
  totalEstimatedPool: number;
  lastUpdated: string;
  dbSyncStatus: "synced" | "pending" | "migrated";
  academicTeam?: LmsAcademicTeam;
}

export interface LmsQuizOption {
  id: string;
  label?: string;
  text: string;
  isCorrect: boolean;
}

export interface LmsQuizQuestion {
  id: string;
  type: "multiple_choice" | "multiple_select" | "true_false" | "short_answer";
  questionText?: string;
  prompt?: string;
  options: LmsQuizOption[];
  correctAnswerText?: string;
  correctOptionId?: string;
  correctOptionIds?: string[];
  explanation: string;
  points: number;
  academicTeam?: LmsAcademicTeam;
}

export interface LmsQuiz {
  id: string;
  courseId: string;
  courseTitle: string;
  lessonTitle: string;
  moduleId?: string;
  moduleTitle?: string;
  assessmentType?: "formatif_modul" | "uts_mid" | "uas_final" | "sertifikasi" | "diagnostic";
  title: string;
  description: string;
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes: number;
  shuffleQuestions: boolean;
  showAnswersAfterSubmit: boolean;
  status: "aktif" | "draft";
  questions: LmsQuizQuestion[];
  resultsStats: {
    avgScore: number;
    passRate: number;
    totalAttempts: number;
  };
  academicTeam?: LmsAcademicTeam;
}

export interface LmsBlogComment {
  id: string;
  articleId: string;
  articleTitle: string;
  authorName: string;
  authorEmail: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface LmsBlogCategory {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

// ==========================================
// FASE 3 & 4: LANGGANAN, FORUM & HIRING TYPES
// ==========================================
export type SubscriptionAccessMode = "all" | "curated" | "quota_limited";

export interface LmsSubscriptionPlan {
  id: string;
  name: string;
  badge: string;
  description?: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  activeSubscribersCount: number;
  status: "aktif" | "nonaktif";
  accessMode?: SubscriptionAccessMode;
  curatedCourseIds?: string[];
  curatedCourseTitles?: string[];
  quotaLimit?: number;
  simulatedSelectedCourses?: string[];
}

export interface LmsVoucher {
  id: string;
  code: string;
  description: string;
  discountType: "percent" | "fixed" | "free";
  discountValue: number;
  quota: number;
  usedCount: number;
  validUntil: string;
  status: "aktif" | "expired";
}

export interface LmsReferralItem {
  id: string;
  userName: string;
  userEmail: string;
  referralCode: string;
  referredCount: number;
  convertedCount: number;
  totalBonus: number;
  status: "pending" | "approved";
}

export interface LmsScholarship {
  id: string;
  title: string;
  sponsor: string;
  quota: number;
  applicantsCount: number;
  approvedCount: number;
  status: "buka" | "seleksi" | "tutup";
  coveredCourse: string;
  deadline: string;
}

export interface LmsForumThread {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  repliesCount: number;
  upvotes: number;
  isPinned: boolean;
  isLocked: boolean;
  status: "active" | "flagged" | "solved";
  createdAt: string;
  excerpt: string;
}

export interface LmsHiringPartner {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website: string;
  contactPerson: string;
  activeJobsCount: number;
}

export interface LmsJobApplicant {
  id: string;
  jobId: string;
  jobTitle: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  appliedDate: string;
  resumeUrl: string;
  portfolioUrl: string;
  status: "applied" | "screening" | "interview" | "offered" | "hired" | "rejected";
  notes?: string;
}

export interface LmsStudentPortfolio {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  projectTitle: string;
  projectExcerpt: string;
  trackName: string;
  completionDate: string;
  liveDemoUrl: string;
  githubRepoUrl: string;
  isFeatured: boolean;
  isIndustryVerified: boolean;
  reviewStatus: "approved" | "pending" | "needs_revision";
  reviewerNotes?: string;
}

export interface LmsIssuedCertificate {
  id: string;
  serialNumber: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  courseName: string;
  courseId: string;
  instructorName: string;
  issueDate: string;
  expiryDate?: string;
  gradeScore: number;
  gradeLetter: string;
  status: "aktif" | "revoked";
  verificationUrl: string;
  skillsAcquired: string[];
}

export interface LmsScholarshipApplicant {
  id: string;
  scholarshipId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  university: string;
  major: string;
  gpa: number;
  essay: string;
  portfolioUrl?: string;
  appliedDate: string;
  status: "pending" | "approved" | "rejected";
}

export type SimakNavId =
  | "dashboard"
  | "master-data"
  | "kurikulum"
  | "quiz-builder"
  | "learning-paths"
  | "subscription"
  | "keuangan"
  | "komunitas"
  | "programs"
  | "mentoring"
  | "review-queue"
  | "penilaian"
  | "events"
  | "jobs"
  | "blog"
  | "users"
  | "mahasiswa"
  | "dosen-reviewer"
  | "staf-rbac"
  | "role-management"
  | "transkrip"
  | "akreditasi"
  | "pengaturan"
  | "audit-log";
