"use client";

import React, { useState, useRef } from "react";
import {
  FileText,
  FileArchive,
  FileSpreadsheet,
  File,
  Upload,
  Trash2,
  ExternalLink,
  Loader2,
  Edit2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { ILectureResource } from "@/types/lms";
import { UPLOAD_LIMITS, getFileExtension } from "@/lib/upload-limits";

export interface ResourceUploaderProps {
  resources: ILectureResource[];
  onChange: (resources: ILectureResource[]) => void;
  lectureId?: string;
  maxResources?: number;
  disabled?: boolean;
}

export function ResourceUploader({
  resources,
  onChange,
  lectureId,
  maxResources = UPLOAD_LIMITS.RESOURCE.MAX_PER_LECTURE,
  disabled = false,
}: ResourceUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (mime: string, name: string) => {
    const ext = getFileExtension(name);
    if (ext === ".pdf" || mime === "application/pdf") {
      return <FileText className="w-5 h-5 text-destructive" />;
    }
    if (ext === ".zip" || mime.includes("zip")) {
      return <FileArchive className="w-5 h-5 text-warning" />;
    }
    if ([".xlsx", ".xls", ".csv"].includes(ext) || mime.includes("spreadsheet") || mime.includes("excel")) {
      return <FileSpreadsheet className="w-5 h-5 text-success" />;
    }
    return <File className="w-5 h-5 text-primary" />;
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (resources.length + files.length > maxResources) {
      toast.error(`Maximum of ${maxResources} resources allowed per lecture.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    const newResources: ILectureResource[] = [...resources];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > UPLOAD_LIMITS.RESOURCE.MAX_SIZE_BYTES) {
        toast.error(`File "${file.name}" exceeds the maximum size limit of ${UPLOAD_LIMITS.RESOURCE.MAX_SIZE_LABEL}`);
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);
      if (lectureId) formData.append("lectureId", lectureId);

      try {
        const res = await fetch("/api/admin/uploads/file", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error?.message || `Failed to upload ${file.name}`);

        newResources.push({
          title: file.name.replace(/\.[^/.]+$/, ""), // remove extension for title
          originalName: json.data.originalName || file.name,
          storedName: json.data.storedName,
          fileKey: json.data.fileKey,
          mime: json.data.mime || file.type || "application/octet-stream",
          size: json.data.size || file.size,
          uploadedAt: new Date(),
        });
        toast.success(`Uploaded: ${file.name}`);
      } catch (err: any) {
        toast.error(err.message);
      }
    }

    onChange(newResources);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    const next = resources.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleSaveTitle = (index: number) => {
    if (!editingTitle.trim()) return;
    const next = [...resources];
    next[index] = { ...next[index], title: editingTitle.trim() };
    onChange(next);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload button & drop banner */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf, .zip, .txt, .csv, .xls, .xlsx, .doc, .docx"
        onChange={handleFileUpload}
        className="hidden"
        disabled={disabled || isUploading || resources.length >= maxResources}
      />

      <div
        onClick={() => {
          if (!disabled && !isUploading && resources.length < maxResources) {
            fileInputRef.current?.click();
          }
        }}
        className={`p-6 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
          resources.length >= maxResources || disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-primary/50 hover:bg-muted/20"
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2">
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
        </div>
        <p className="text-xs font-semibold text-foreground">
          {isUploading
            ? "Uploading lecture attachments..."
            : "Click to upload lecture resources & worksheets"}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          Supported: PDF, ZIP, Excel, Word, Text, CSV &bull; Max {UPLOAD_LIMITS.RESOURCE.MAX_SIZE_LABEL} per file &bull; Up to{" "}
          {maxResources} resources ({resources.length}/{maxResources} used)
        </p>
      </div>

      {/* Resource items list */}
      {resources.length > 0 && (
        <div className="rounded-xl border border-border divide-y divide-border/60 overflow-hidden bg-card text-xs">
          {resources.map((res, idx) => (
            <div key={res.fileKey || idx} className="p-3.5 flex items-center justify-between gap-3 hover:bg-muted/30">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-muted/60 border border-border/40 shrink-0">
                  {getFileIcon(res.mime, res.originalName || res.title)}
                </div>

                <div className="min-w-0">
                  {editingIndex === idx ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="bg-muted border border-border rounded-lg px-2 py-0.5 text-xs text-foreground focus:outline-none focus:border-primary"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveTitle(idx)}
                        className="p-1 text-success hover:text-success/80 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground truncate">{res.title}</span>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingIndex(idx);
                            setEditingTitle(res.title);
                          }}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-2">
                    <span className="truncate">{res.originalName || res.fileKey}</span>
                    <span>&bull;</span>
                    <span>{formatSize(res.size)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`/api/files/resources/${encodeURIComponent(res.fileKey)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  title="Download / View"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Remove attachment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
