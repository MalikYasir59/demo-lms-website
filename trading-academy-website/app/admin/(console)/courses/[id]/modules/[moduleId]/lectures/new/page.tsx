"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Video,
  Clock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import { ICourse, IModule, ILectureResource } from "@/types/lms";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import { ResourceUploader } from "@/components/admin/ResourceUploader";

export default function NewLecturePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const courseId = params.id as string;
  const moduleId = params.moduleId as string;

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrlOrId, setVideoUrlOrId] = useState("");
  const [notesHtml, setNotesHtml] = useState("");
  const [resources, setResources] = useState<ILectureResource[]>([]);
  const [unlockAfterDays, setUnlockAfterDays] = useState<string>("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  // Video validation state
  const [isValidatingVideo, setIsValidatingVideo] = useState(false);
  const [validatedVideo, setValidatedVideo] = useState<{
    videoId: string;
    title: string;
    thumbnailUrl: string;
    durationSec: number;
    isDuplicate: boolean;
    duplicateIn?: any;
  } | null>(null);

  // Fetch course & module info for breadcrumbs & context
  const { data: course, isLoading: courseLoading } = useQuery<
    ICourse & { modules: (IModule & { lectures: any[] })[] }
  >({
    queryKey: ["admin_course_builder", courseId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/courses/${courseId}`);
      if (!res.ok) throw new Error("Failed to load course");
      const json = await res.json();
      return json.data;
    },
  });

  const currentModule = course?.modules?.find((m) => m._id.toString() === moduleId);

  // Validate YouTube Video
  const handleValidateVideo = async (inputUrl: string) => {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setValidatedVideo(null);
      return;
    }

    try {
      setIsValidatingVideo(true);
      const res = await fetch("/api/admin/video/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrlOrId: trimmed }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Invalid YouTube video link");

      setValidatedVideo(json.data);
      if (!title) {
        setTitle(json.data.title || "");
      }
    } catch (err: any) {
      setValidatedVideo(null);
      toast.error(err.message);
    } finally {
      setIsValidatingVideo(false);
    }
  };

  // Create Lecture Mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Lecture title is required");
      if (!videoUrlOrId.trim()) throw new Error("YouTube video reference is required");

      const payload = {
        moduleId,
        title: title.trim(),
        description: description.trim(),
        notesHtml,
        status,
        videoUrlOrId: videoUrlOrId.trim(),
        durationSec: validatedVideo?.durationSec || 0,
        resources,
        drip: unlockAfterDays ? { unlockAfterDays: parseInt(unlockAfterDays, 10) } : undefined,
      };

      const res = await fetch(`/api/admin/courses/${courseId}/lectures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to create lecture");
      return json.data;
    },
    onSuccess: () => {
      toast.success("Lecture Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["admin_course_builder", courseId] });
      router.push(`/admin/courses/${courseId}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins}m ${remainingSec}s`;
  };

  if (courseLoading) {
    return (
      <div className="p-16 text-center text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
        <p className="text-xs">Loading course curriculum...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Breadcrumb Navigation */}
      <div>
        <Link
          href={`/admin/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Course Builder: {course?.title || "Course"}</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>{currentModule?.title || "Module"}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Add New Lecture</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure encrypted video stream, curriculum notes, and student resources
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/admin/courses/${courseId}`}
            className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending || !title.trim() || !videoUrlOrId.trim()}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <Save className="w-3.5 h-3.5" />
            <span>Save Lecture</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Left Column: Title, Video, Rich Notes, Resources */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lecture Metadata Card */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-foreground">Lecture Information</h3>

            <div>
              <label className="block text-foreground font-medium mb-1">Lecture Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Identifying High Probability Liquidity Pools"
                className="w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-foreground font-medium mb-1">Brief Description / Executive Summary</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Quick 1-2 sentence overview shown in course curriculum cards..."
                className="w-full bg-muted/40 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Video Configuration Card */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Video className="w-4 h-4 text-primary" />
              <span>YouTube Video Reference</span>
            </h3>

            <div>
              <label className="block text-foreground font-medium mb-1">
                YouTube URL or Unlisted Video ID *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={videoUrlOrId}
                  onChange={(e) => setVideoUrlOrId(e.target.value)}
                  onBlur={() => handleValidateVideo(videoUrlOrId)}
                  placeholder="https://www.youtube.com/watch?v=... or unlisted video ID"
                  className="flex-1 bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-foreground font-mono focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => handleValidateVideo(videoUrlOrId)}
                  disabled={isValidatingVideo || !videoUrlOrId.trim()}
                  className="px-4 py-2 rounded-xl bg-card border border-border font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isValidatingVideo ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  )}
                  <span>Verify</span>
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Stored as AES-256-GCM encrypted ciphertext at rest. Never exposed to unauthorized clients.
              </p>
            </div>

            {/* Video Validation Result Preview */}
            {validatedVideo && (
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/80 flex items-center gap-4">
                {validatedVideo.thumbnailUrl && (
                  <img
                    src={validatedVideo.thumbnailUrl}
                    alt={validatedVideo.title}
                    className="w-24 h-16 object-cover rounded-lg border border-border shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground truncate">{validatedVideo.title}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-primary">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(validatedVideo.durationSec)}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Stream</span>
                    </span>
                  </div>

                  {validatedVideo.isDuplicate && (
                    <div className="mt-2 text-[11px] text-warning flex items-center gap-1 bg-warning/10 p-1.5 rounded-md border border-warning/20">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>Warning: Video is already assigned in another lecture.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Rich Lecture Notes (Tiptap) */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Lecture Notes & Strategy Guide</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Formatted curriculum notes, trading setups, charts, and rules rendered directly to students
                </p>
              </div>
            </div>

            <TiptapEditor
              value={notesHtml}
              onChange={setNotesHtml}
              placeholder="Detail the core market mechanics, institutional order blocks, and session checklists..."
            />
          </div>

          {/* Attached Lecture Resources */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-primary" />
                <span>Downloadable Lecture Resources</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Worksheets, cheat sheets, indicators, and PDFs protected by enrollment verification
              </p>
            </div>

            <ResourceUploader
              resources={resources}
              onChange={setResources}
            />
          </div>
        </div>

        {/* Sidebar Column: Settings & Publishing Controls */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-foreground">Publishing & Drip Controls</h3>

            <div>
              <label className="block text-foreground font-medium mb-1">Lecture Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary capitalize"
              >
                <option value="draft">Draft (Hidden from students)</option>
                <option value="published">Published (Visible in course)</option>
              </select>
            </div>

            <div>
              <label className="block text-foreground font-medium mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Drip Unlock Schedule</span>
              </label>
              <input
                type="number"
                min="0"
                value={unlockAfterDays}
                onChange={(e) => setUnlockAfterDays(e.target.value)}
                placeholder="Days after student enrollment (e.g. 7)"
                className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Leave empty for immediate access based on course-level drip rules.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs text-xs space-y-2">
            <h4 className="font-bold text-foreground">Curriculum Placement</h4>
            <div className="text-muted-foreground space-y-1">
              <div>Course: <span className="text-foreground font-medium">{course?.title}</span></div>
              <div>Module: <span className="text-foreground font-medium">{currentModule?.title}</span></div>
              <div>Current Lectures: <span className="text-foreground font-mono">{currentModule?.lectures?.length || 0}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
