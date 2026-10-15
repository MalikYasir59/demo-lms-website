"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Save,
  Plus,
  Video,
  Clock,
  Layers,
  Settings,
  Users,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit2,
  ShieldCheck,
  Loader2,
  X,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import { ICourse, IModule, ILecture, ICategory, IAuthor } from "@/types/lms";

export default function CourseBuilderPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const courseId = params.id as string;

  const [activeTab, setActiveTab] = useState<"details" | "curriculum" | "settings" | "students" | "publish">("curriculum");

  // Modals state
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [isAddLectureOpen, setIsAddLectureOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // New module state
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");

  // New lecture state
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDesc, setLectureDesc] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [validatedVideo, setValidatedVideo] = useState<{
    videoId: string;
    title: string;
    thumbnailUrl: string;
    durationSec: number;
    isDuplicate: boolean;
    duplicateIn?: any;
  } | null>(null);
  const [validatingVideo, setValidatingVideo] = useState(false);

  // Students tab state
  const [isEnrollStudentOpen, setIsEnrollStudentOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [enrollStudentForm, setEnrollStudentForm] = useState({
    studentId: "",
    startsAt: new Date().toISOString().split("T")[0],
    expiresAt: "",
    isLifetime: true,
    note: "",
  });
  const [editingCourseEnrollment, setEditingCourseEnrollment] = useState<any | null>(null);
  const [editCourseExpiresAt, setEditCourseExpiresAt] = useState("");
  const [editCourseStatus, setEditCourseStatus] = useState("active");

  // Fetch Course Tree
  const { data: course, isLoading } = useQuery<ICourse & { modules: (IModule & { lectures: ILecture[] })[] }>({
    queryKey: ["admin_course_builder", courseId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/courses/${courseId}`);
      if (!res.ok) throw new Error("Failed to load course");
      const json = await res.json();
      return json.data;
    },
  });

  // Fetch Categories & Authors for Details tab
  const { data: categories = [] } = useQuery<ICategory[]>({
    queryKey: ["admin_categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      return json.data || [];
    },
  });

  const { data: authors = [] } = useQuery<IAuthor[]>({
    queryKey: ["admin_authors"],
    queryFn: async () => {
      const res = await fetch("/api/admin/authors");
      const json = await res.json();
      return json.data || [];
    },
  });

  // Details form state
  const [detailsForm, setDetailsForm] = useState({
    title: "",
    subtitle: "",
    slug: "",
    description: "",
    difficulty: "all",
    categoryId: "",
    authorId: "",
  });

  // Populate details form when course loads
  React.useEffect(() => {
    if (course) {
      setDetailsForm({
        title: course.title || "",
        subtitle: course.subtitle || "",
        slug: course.slug || "",
        description: course.description || "",
        difficulty: course.difficulty || "all",
        categoryId: (course.categoryIds?.[0] as any)?._id || (course.categoryIds?.[0] as any) || "",
        authorId: (course.authorId as any)?._id || (course.authorId as any) || "",
      });
    }
  }, [course]);

  // Update Course Details Mutation
  const updateDetailsMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: detailsForm.title,
          subtitle: detailsForm.subtitle,
          slug: detailsForm.slug,
          description: detailsForm.description,
          difficulty: detailsForm.difficulty,
          categoryIds: detailsForm.categoryId ? [detailsForm.categoryId] : [],
          authorId: detailsForm.authorId || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to update details");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Course Details Saved");
      queryClient.invalidateQueries({ queryKey: ["admin_course_builder", courseId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Create Module Mutation
  const createModuleMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: moduleTitle.trim(),
          description: moduleDesc.trim(),
          status: "published",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to create module");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Module Added");
      setIsAddModuleOpen(false);
      setModuleTitle("");
      setModuleDesc("");
      queryClient.invalidateQueries({ queryKey: ["admin_course_builder", courseId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Delete Module Mutation
  const deleteModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const res = await fetch(`/api/admin/modules/${moduleId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to delete module");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Module Deleted");
      queryClient.invalidateQueries({ queryKey: ["admin_course_builder", courseId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Reorder Modules Mutation
  const reorderModulesMutation = useMutation({
    mutationFn: async (items: Array<{ id: string; order: number }>) => {
      const res = await fetch(`/api/admin/courses/${courseId}/modules/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Reorder failed");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_course_builder", courseId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Validate Video Function
  const handleValidateVideo = async (input: string) => {
    if (!input.trim()) return;
    setValidatingVideo(true);
    try {
      const res = await fetch("/api/admin/video/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrlOrId: input.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Invalid video");

      setValidatedVideo({
        videoId: json.data.videoId,
        title: json.data.meta.title,
        thumbnailUrl: json.data.meta.thumbnailUrl,
        durationSec: json.data.meta.durationSec,
        isDuplicate: json.data.isDuplicate,
        duplicateIn: json.data.duplicateIn,
      });

      if (!lectureTitle) {
        setLectureTitle(json.data.meta.title);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Validation error";
      toast.error(msg);
      setValidatedVideo(null);
    } finally {
      setValidatingVideo(false);
    }
  };

  // Create Lecture Mutation
  const createLectureMutation = useMutation({
    mutationFn: async () => {
      if (!activeModuleId) throw new Error("No module selected");
      const res = await fetch(`/api/admin/courses/${courseId}/lectures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: activeModuleId,
          title: lectureTitle.trim(),
          description: lectureDesc.trim(),
          videoUrlOrId: videoInput.trim(),
          durationSec: validatedVideo?.durationSec || 0,
          status: "published",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to create lecture");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Lecture Added with Encrypted Reference");
      setIsAddLectureOpen(false);
      setLectureTitle("");
      setLectureDesc("");
      setVideoInput("");
      setValidatedVideo(null);
      queryClient.invalidateQueries({ queryKey: ["admin_course_builder", courseId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Delete Lecture Mutation
  const deleteLectureMutation = useMutation({
    mutationFn: async (lectureId: string) => {
      const res = await fetch(`/api/admin/lectures/${lectureId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to delete lecture");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Lecture Deleted");
      queryClient.invalidateQueries({ queryKey: ["admin_course_builder", courseId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Reorder Lectures Mutation
  const reorderLecturesMutation = useMutation({
    mutationFn: async ({ moduleId, items }: { moduleId: string; items: Array<{ id: string; order: number }> }) => {
      const res = await fetch(`/api/admin/courses/${courseId}/lectures/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, items }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Lecture reorder failed");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_course_builder", courseId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Publish Mutation
  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/courses/${courseId}/publish`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Publish failed");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Course Successfully Published!");
      queryClient.invalidateQueries({ queryKey: ["admin_course_builder", courseId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Fetch Enrolled Students for this Course
  const { data: courseEnrollmentsData, isLoading: enrollmentsLoading } = useQuery<{
    enrollments: any[];
    pagination: { total: number; page: number; limit: number; pages: number };
  }>({
    queryKey: ["admin_course_students", courseId, studentSearchQuery],
    queryFn: async () => {
      const q = studentSearchQuery ? `&search=${encodeURIComponent(studentSearchQuery)}` : "";
      const res = await fetch(`/api/admin/courses/${courseId}/students?limit=50${q}`);
      if (!res.ok) throw new Error("Failed to load enrolled students");
      const json = await res.json();
      return json.data;
    },
    enabled: activeTab === "students",
  });

  // Fetch All Students for Enrollment Select
  const { data: allStudentsData } = useQuery<{ students: any[] }>({
    queryKey: ["admin_all_students_select"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/students?limit=100`);
      if (!res.ok) return { students: [] };
      const json = await res.json();
      return json.data;
    },
    enabled: isEnrollStudentOpen,
  });

  // Enroll Student Mutation
  const enrollStudentMutation = useMutation({
    mutationFn: async (data: { studentId: string; startsAt?: string; expiresAt?: string | null; note?: string }) => {
      const res = await fetch(`/api/admin/courses/${courseId}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to enroll student");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Student Enrolled in Course");
      setIsEnrollStudentOpen(false);
      setEnrollStudentForm({
        studentId: "",
        startsAt: new Date().toISOString().split("T")[0],
        expiresAt: "",
        isLifetime: true,
        note: "",
      });
      queryClient.invalidateQueries({ queryKey: ["admin_course_students", courseId] });
      queryClient.invalidateQueries({ queryKey: ["admin_course_builder", courseId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Revoke Course Enrollment Mutation
  const revokeCourseEnrollmentMutation = useMutation({
    mutationFn: async ({ enrollmentId, reason }: { enrollmentId: string; reason: string }) => {
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to revoke enrollment");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Enrollment Revoked");
      queryClient.invalidateQueries({ queryKey: ["admin_course_students", courseId] });
      queryClient.invalidateQueries({ queryKey: ["admin_course_builder", courseId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Update Course Enrollment Mutation
  const updateCourseEnrollmentMutation = useMutation({
    mutationFn: async ({
      enrollmentId,
      expiresAt,
      status,
    }: {
      enrollmentId: string;
      expiresAt?: string | null;
      status?: string;
    }) => {
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiresAt, status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to update enrollment");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Enrollment Updated");
      setEditingCourseEnrollment(null);
      queryClient.invalidateQueries({ queryKey: ["admin_course_students", courseId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });


  // Reorder handlers
  const moveModule = (index: number, direction: "up" | "down") => {
    if (!course?.modules) return;
    const modules = [...course.modules];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    const temp = modules[index];
    modules[index] = modules[targetIndex];
    modules[targetIndex] = temp;

    const items = modules.map((m, idx) => ({ id: m._id.toString(), order: idx }));
    reorderModulesMutation.mutate(items);
  };

  const moveLecture = (moduleId: string, lectures: ILecture[], index: number, direction: "up" | "down") => {
    const list = [...lectures];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const items = list.map((l, idx) => ({ id: l._id.toString(), order: idx }));
    reorderLecturesMutation.mutate({ moduleId, items });
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
        <p className="text-xs">Loading course builder...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        <AlertCircle className="w-8 h-8 text-warning mx-auto mb-2" />
        <h2 className="text-lg font-bold text-foreground">Course Not Found</h2>
        <Link href="/admin/courses" className="mt-4 inline-block px-4 py-2 bg-card border border-border rounded-xl text-xs text-foreground hover:bg-muted transition-colors shadow-xs">
          Back to Courses
        </Link>
      </div>
    );
  }

  // Calculate readiness status
  const publishedModules = course.modules?.filter((m) => m.status === "published") || [];
  const publishedLectures = course.modules?.flatMap((m) => m.lectures?.filter((l) => l.status === "published") || []) || [];
  const hasEmptyModule = publishedModules.some((m) => !m.lectures || m.lectures.length === 0);
  const isReadyToPublish = publishedModules.length > 0 && publishedLectures.length > 0 && !hasEmptyModule;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Courses</span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${
              course.status === "published"
                ? "bg-success/10 text-success border-success/30"
                : "bg-warning/10 text-warning border-warning/30"
            }`}
          >
            {course.status}
          </span>
        </div>
      </div>

      {/* Course Builder Header */}
      <div className="p-6 rounded-2xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{course.title}</h1>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
            <span className="font-mono text-muted-foreground/80">/{course.slug}</span>
            <span className="text-muted-foreground/40">&bull;</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>{course.stats?.moduleCount || 0} Modules</span>
            </span>
            <span className="text-muted-foreground/40">&bull;</span>
            <span className="flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-success" />
              <span>{course.stats?.lectureCount || 0} Lectures</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {course.status !== "published" ? (
            <button
              onClick={() => publishMutation.mutate()}
              disabled={!isReadyToPublish || publishMutation.isPending}
              className="px-4 py-2 rounded-xl bg-success text-success-foreground text-xs font-semibold hover:bg-success/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {publishMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Publish Course</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success/15 border border-success/30 text-xs font-semibold text-success">
              <CheckCircle2 className="w-4 h-4" />
              <span>Live & Published</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1 text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setActiveTab("curriculum")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "curriculum" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Curriculum ({course.stats?.moduleCount || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("details")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "details" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Course Details</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "settings" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Playback & Drip</span>
        </button>

        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "students" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Students ({course.stats?.enrolledCount || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("publish")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "publish" ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Publish Readiness</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CURRICULUM TREE */}
      {/* ========================================================================= */}
      {activeTab === "curriculum" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Course Curriculum Modules</h2>
            <button
              onClick={() => setIsAddModuleOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Module</span>
            </button>
          </div>

          {!course.modules || course.modules.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-card border border-border shadow-xs">
              <Layers className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-foreground">No Modules Yet</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Organize your course into structured chapters (e.g. Market Structure, Order Blocks, Liquidity).
              </p>
              <button
                onClick={() => setIsAddModuleOpen(true)}
                className="px-4 py-2 bg-card border border-border rounded-xl text-xs text-foreground hover:bg-muted transition-colors shadow-xs cursor-pointer"
              >
                Create First Module
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {course.modules.map((module, mIdx) => (
                <div
                  key={module._id.toString()}
                  className="rounded-2xl bg-card border border-border overflow-hidden shadow-xs"
                >
                  {/* Module Header */}
                  <div className="p-4 bg-muted/40 border-b border-border flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center text-xs font-mono font-bold text-primary shadow-xs">
                        {mIdx + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{module.title}</h3>
                        {module.description && (
                          <p className="text-[11px] text-muted-foreground">{module.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Reorder Module */}
                      <button
                        onClick={() => moveModule(mIdx, "up")}
                        disabled={mIdx === 0}
                        title="Move Up"
                        className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveModule(mIdx, "down")}
                        disabled={mIdx === course.modules.length - 1}
                        title="Move Down"
                        className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      <div className="h-4 w-px bg-border mx-1" />

                      <button
                        onClick={() => {
                          setActiveModuleId(module._id.toString());
                          setIsAddLectureOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-success/15 text-success hover:bg-success/25 border border-success/20 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Lecture</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete module '${module.title}' and all its lectures?`)) {
                            deleteModuleMutation.mutate(module._id.toString());
                          }
                        }}
                        className="p-1 text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Delete Module"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Lectures List */}
                  <div className="p-3 divide-y divide-border/60">
                    {!module.lectures || module.lectures.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground">
                        No lectures in this module. Click &quot;Add Lecture&quot; to ingest a video.
                      </div>
                    ) : (
                      module.lectures.map((lecture, lIdx) => (
                        <div
                          key={lecture._id.toString()}
                          className="py-2.5 px-3 flex items-center justify-between gap-3 hover:bg-muted/40 rounded-xl transition-colors text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono text-muted-foreground w-5 text-right">
                              {lIdx + 1}.
                            </span>
                            <Video className="w-4 h-4 text-success shrink-0" />
                            <div>
                              <div className="font-medium text-foreground">{lecture.title}</div>
                              <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-2 mt-0.5">
                                <span>{Math.floor((lecture.video?.durationSec || 0) / 60)}m {((lecture.video?.durationSec || 0) % 60)}s</span>
                                <span>&bull;</span>
                                <span className="text-success">Encrypted Ref AES-256</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => moveLecture(module._id.toString(), module.lectures, lIdx, "up")}
                              disabled={lIdx === 0}
                              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveLecture(module._id.toString(), module.lectures, lIdx, "down")}
                              disabled={lIdx === module.lectures.length - 1}
                              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Delete lecture '${lecture.title}'?`)) {
                                  deleteLectureMutation.mutate(lecture._id.toString());
                                }
                              }}
                              className="p-1 text-muted-foreground hover:text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COURSE DETAILS */}
      {/* ========================================================================= */}
      {activeTab === "details" && (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-5 text-xs shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-base font-bold text-foreground">Course Metadata & Overview</h2>
            <button
              onClick={() => updateDetailsMutation.mutate()}
              disabled={updateDetailsMutation.isPending}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-1.5 hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-foreground font-medium mb-1">Course Title</label>
              <input
                type="text"
                value={detailsForm.title}
                onChange={(e) => setDetailsForm({ ...detailsForm, title: e.target.value })}
                className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground font-medium mb-1">URL Slug</label>
                <input
                  type="text"
                  value={detailsForm.slug}
                  onChange={(e) => setDetailsForm({ ...detailsForm, slug: e.target.value })}
                  className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-foreground font-medium mb-1">Difficulty Level</label>
                <select
                  value={detailsForm.difficulty}
                  onChange={(e) => setDetailsForm({ ...detailsForm, difficulty: e.target.value })}
                  className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground font-medium mb-1">Category</label>
                <select
                  value={detailsForm.categoryId}
                  onChange={(e) => setDetailsForm({ ...detailsForm, categoryId: e.target.value })}
                  className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="">Unassigned</option>
                  {categories.map((c) => (
                    <option key={c._id.toString()} value={c._id.toString()}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-foreground font-medium mb-1">Instructor / Author</label>
                <select
                  value={detailsForm.authorId}
                  onChange={(e) => setDetailsForm({ ...detailsForm, authorId: e.target.value })}
                  className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="">None</option>
                  {authors.map((a) => (
                    <option key={a._id.toString()} value={a._id.toString()}>
                      {a.name} ({a.title})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-foreground font-medium mb-1">Course Description</label>
              <textarea
                rows={5}
                value={detailsForm.description}
                onChange={(e) => setDetailsForm({ ...detailsForm, description: e.target.value })}
                className="w-full bg-muted/40 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SETTINGS & DRIP */}
      {/* ========================================================================= */}
      {activeTab === "settings" && (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-6 text-xs shadow-xs">
          <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
            Security, Playback & Drip Settings
          </h2>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-foreground font-medium mb-1">Content Drip Engine</label>
              <select
                defaultValue={course.settings?.drip?.mode || "none"}
                className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
              >
                <option value="none">None — Immediate access to all lectures</option>
                <option value="sequential">Sequential — Must complete previous lecture to unlock next</option>
                <option value="daysAfterEnroll">Days After Enrollment — Unlocks per schedule</option>
              </select>
            </div>

            <div>
              <label className="block text-foreground font-medium mb-1">Completion Threshold</label>
              <p className="text-muted-foreground text-[11px] mb-2">
                Percent of unique video seconds a student must watch before marking complete.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="100"
                  defaultValue={course.settings?.completionThreshold || 90}
                  className="flex-1 accent-primary"
                />
                <span className="font-mono text-foreground font-bold">{course.settings?.completionThreshold || 90}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PUBLISH READINESS */}
      {/* ========================================================================= */}
      {activeTab === "publish" && (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-6 text-xs shadow-xs">
          <h2 className="text-base font-bold text-foreground border-b border-border pb-3">
            Publish Readiness Checklist
          </h2>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground">At least 1 Published Module</div>
                <div className="text-[11px] text-muted-foreground">{publishedModules.length} published module(s) found</div>
              </div>
              {publishedModules.length > 0 ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive" />
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground">Lectures within Modules</div>
                <div className="text-[11px] text-muted-foreground">
                  {hasEmptyModule ? "Some modules have no lectures" : "All modules have lectures"}
                </div>
              </div>
              {!hasEmptyModule && publishedLectures.length > 0 ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive" />
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground">Video References Encrypted (AES-256-GCM)</div>
                <div className="text-[11px] text-muted-foreground">All video URLs converted to ciphertext</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ENROLLED STUDENTS & CAPACITY */}
      {/* ========================================================================= */}
      {activeTab === "students" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Enrolled Students</span>
              </h2>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                <span>
                  Active Enrolled: <strong className="text-foreground">{course.stats?.enrolledCount || 0}</strong>
                </span>
                <span>&bull;</span>
                <span>
                  Capacity Cap:{" "}
                  <strong className="text-foreground">
                    {course.settings?.maxStudents ? `${course.settings.maxStudents} max` : "Unlimited"}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <input
                type="text"
                placeholder="Search students..."
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="bg-muted/40 border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary w-48"
              />
              <button
                onClick={() => setIsEnrollStudentOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enroll Student</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-mono">
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Access Window</th>
                    <th className="p-3.5">Progress</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {enrollmentsLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
                        Loading enrolled students...
                      </td>
                    </tr>
                  ) : !courseEnrollmentsData?.enrollments || courseEnrollmentsData.enrollments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No students enrolled in this course yet. Click &quot;Enroll Student&quot; to assign access.
                      </td>
                    </tr>
                  ) : (
                    courseEnrollmentsData.enrollments.map((en: any) => {
                      const st = en.studentId;
                      const isExpired = en.expiresAt && new Date(en.expiresAt) <= new Date();
                      const statusText = isExpired && en.status === "active" ? "expired" : en.status;

                      return (
                        <tr key={en._id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-3.5">
                            <div className="font-semibold text-foreground">{st?.name || "Unknown"}</div>
                            <div className="text-[11px] font-mono text-muted-foreground">
                              <span>{st?.studentCode || "No Code"} &bull; </span>
                              <span>{st?.email}</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${
                                statusText === "active"
                                  ? "bg-success/10 text-success border-success/30"
                                  : statusText === "expired"
                                  ? "bg-warning/10 text-warning border-warning/30"
                                  : "bg-destructive/10 text-destructive border-destructive/30"
                              }`}
                            >
                              {statusText}
                            </span>
                          </td>
                          <td className="p-3.5 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>
                                {en.expiresAt
                                  ? `Expires: ${new Date(en.expiresAt).toLocaleDateString()}`
                                  : "Lifetime Access"}
                              </span>
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              Enrolled: {new Date(en.startsAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="w-32">
                              <div className="flex items-center justify-between text-[11px] mb-1">
                                <span className="font-semibold text-foreground">{en.progress?.percent || 0}%</span>
                                <span className="text-muted-foreground">
                                  {en.progress?.completedLectures || 0}/{en.progress?.totalLectures || course.stats?.lectureCount || 0}
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-success h-1.5 rounded-full transition-all"
                                  style={{ width: `${Math.min(100, en.progress?.percent || 0)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingCourseEnrollment(en);
                                setEditCourseExpiresAt(
                                  en.expiresAt ? new Date(en.expiresAt).toISOString().split("T")[0] : ""
                                );
                                setEditCourseStatus(en.status);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-card border border-border text-foreground hover:bg-muted text-[11px] font-medium transition-colors shadow-xs cursor-pointer"
                            >
                              Edit Access
                            </button>
                            {en.status !== "revoked" && (
                              <button
                                onClick={() => {
                                  const reason = prompt("Enter revocation reason (logged to audit trail):", "Admin discretion");
                                  if (reason) {
                                    revokeCourseEnrollmentMutation.mutate({ enrollmentId: en._id, reason });
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD MODULE MODAL */}
      {/* ========================================================================= */}
      {isAddModuleOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button onClick={() => setIsAddModuleOpen(false)} className="absolute top-5 right-5 text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-1">Add Curriculum Module</h2>
            <p className="text-xs text-muted-foreground mb-4">Creates a chapter container for video lectures</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createModuleMutation.mutate();
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-foreground font-medium mb-1">Module Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 1: Market Structure & Order Flow"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-foreground font-medium mb-1">Description (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Core concepts covered in this module..."
                  value={moduleDesc}
                  onChange={(e) => setModuleDesc(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button type="button" onClick={() => setIsAddModuleOpen(false)} className="px-3 py-1.5 text-muted-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createModuleMutation.isPending || !moduleTitle.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-xs"
                >
                  {createModuleMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Module</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD LECTURE MODAL (With Live Video Validation & oEmbed metadata) */}
      {/* ========================================================================= */}
      {isAddLectureOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button onClick={() => setIsAddLectureOpen(false)} className="absolute top-5 right-5 text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-1">Add Video Lecture</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Ingest an unlisted YouTube video with AES-256-GCM encryption at rest
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createLectureMutation.mutate();
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-foreground font-medium mb-1">YouTube URL or Video ID *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="https://www.youtube.com/watch?v=... or ID"
                    value={videoInput}
                    onChange={(e) => {
                      setVideoInput(e.target.value);
                      setValidatedVideo(null);
                    }}
                    className="flex-1 bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handleValidateVideo(videoInput)}
                    disabled={validatingVideo || !videoInput.trim()}
                    className="px-3 py-2 rounded-xl bg-card border border-border text-success hover:bg-muted font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40 shadow-xs"
                  >
                    {validatingVideo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    <span>Validate</span>
                  </button>
                </div>
              </div>

              {/* Validation Result Preview Card */}
              {validatedVideo && (
                <div className="p-3 rounded-xl bg-muted/40 border border-success/30 flex items-center gap-3">
                  <img
                    src={validatedVideo.thumbnailUrl}
                    alt="Preview"
                    className="w-20 h-12 object-cover rounded-lg border border-border shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="text-foreground font-semibold truncate">{validatedVideo.title}</div>
                    <div className="text-[10px] text-success font-mono mt-0.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Valid Video ID ({validatedVideo.videoId})</span>
                      {validatedVideo.durationSec > 0 && (
                        <span>&bull; {Math.floor(validatedVideo.durationSec / 60)}m</span>
                      )}
                    </div>
                    {validatedVideo.isDuplicate && (
                      <div className="text-[10px] text-warning mt-1 flex items-center gap-1.5 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Note: Used in {validatedVideo.duplicateIn?.courseTitle}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-foreground font-medium mb-1">Lecture Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Identifying Institutional Liquidity Pools"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-foreground font-medium mb-1">Lecture Notes / Summary</label>
                <textarea
                  rows={2}
                  placeholder="Key concepts, indicators, and charts referenced..."
                  value={lectureDesc}
                  onChange={(e) => setLectureDesc(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button type="button" onClick={() => setIsAddLectureOpen(false)} className="px-3 py-1.5 text-muted-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLectureMutation.isPending || !lectureTitle.trim() || !videoInput.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-xs"
                >
                  {createLectureMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Lecture</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENROLL STUDENT MODAL */}
      {isEnrollStudentOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsEnrollStudentOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1 text-primary">
              <Users className="w-5 h-5" />
              <h2 className="text-lg font-bold text-foreground">Enroll Student in this Course</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-5">
              Select a student to grant active access to &quot;{course.title}&quot;
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!enrollStudentForm.studentId) {
                  toast.error("Please select a student");
                  return;
                }
                enrollStudentMutation.mutate({
                  studentId: enrollStudentForm.studentId,
                  startsAt: enrollStudentForm.startsAt || undefined,
                  expiresAt: enrollStudentForm.isLifetime ? null : enrollStudentForm.expiresAt || null,
                  note: enrollStudentForm.note || undefined,
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-foreground font-medium mb-1">Select Student *</label>
                <select
                  required
                  value={enrollStudentForm.studentId}
                  onChange={(e) => setEnrollStudentForm({ ...enrollStudentForm, studentId: e.target.value })}
                  className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="">-- Choose Student --</option>
                  {allStudentsData?.students?.map((s) => (
                    <option key={s._id.toString()} value={s._id.toString()}>
                      {s.name} ({s.studentCode || s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={enrollStudentForm.startsAt}
                    onChange={(e) => setEnrollStudentForm({ ...enrollStudentForm, startsAt: e.target.value })}
                    className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-1">Expiry Date</label>
                  <input
                    type="date"
                    disabled={enrollStudentForm.isLifetime}
                    value={enrollStudentForm.expiresAt}
                    onChange={(e) => setEnrollStudentForm({ ...enrollStudentForm, expiresAt: e.target.value })}
                    className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary disabled:opacity-30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="courseLifetimeCheckbox"
                  checked={enrollStudentForm.isLifetime}
                  onChange={(e) => setEnrollStudentForm({ ...enrollStudentForm, isLifetime: e.target.checked })}
                  className="rounded border-border bg-muted text-primary focus:ring-0"
                />
                <label htmlFor="courseLifetimeCheckbox" className="text-xs text-foreground cursor-pointer">
                  Lifetime Access (No Expiry Date)
                </label>
              </div>

              <div>
                <label className="block text-foreground font-medium mb-1">Administrative Note</label>
                <input
                  type="text"
                  placeholder="e.g. Granted direct access by Admin"
                  value={enrollStudentForm.note}
                  onChange={(e) => setEnrollStudentForm({ ...enrollStudentForm, note: e.target.value })}
                  className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEnrollStudentOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrollStudentMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-40 shadow-xs cursor-pointer"
                >
                  {enrollStudentMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Enrollment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COURSE ENROLLMENT ACCESS MODAL */}
      {editingCourseEnrollment && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setEditingCourseEnrollment(null)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-1">Edit Student Access</h2>
            <p className="text-xs text-muted-foreground mb-5">
              {editingCourseEnrollment.studentId?.name} ({editingCourseEnrollment.studentId?.studentCode})
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateCourseEnrollmentMutation.mutate({
                  enrollmentId: editingCourseEnrollment._id,
                  expiresAt: editCourseExpiresAt ? new Date(editCourseExpiresAt).toISOString() : null,
                  status: editCourseStatus,
                });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-foreground font-medium mb-1">Status</label>
                <select
                  value={editCourseStatus}
                  onChange={(e) => setEditCourseStatus(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="suspended">Suspended</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>

              <div>
                <label className="block text-foreground font-medium mb-1">
                  Expiration Date (leave empty for Lifetime)
                </label>
                <input
                  type="date"
                  value={editCourseExpiresAt}
                  onChange={(e) => setEditCourseExpiresAt(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingCourseEnrollment(null)}
                  className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateCourseEnrollmentMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-2 hover:bg-primary/90 shadow-xs cursor-pointer"
                >
                  {updateCourseEnrollmentMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
