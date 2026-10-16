"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Camera,
  Upload,
  Trash2,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { UPLOAD_LIMITS, getFileExtension } from "@/lib/upload-limits";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userName?: string | null;
  role: "admin" | "student";
  onAvatarUpdated?: (newUrl: string | null) => void;
  className?: string;
}

export function AvatarUpload({
  currentAvatarUrl,
  userName,
  role,
  onAvatarUpdated,
  className = "",
}: AvatarUploadProps) {
  const { data: session, update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effective avatar URL priority: prop > session > null
  const effectiveAvatarUrl =
    currentAvatarUrl !== undefined
      ? currentAvatarUrl
      : session?.user?.avatar || null;

  const [avatarPreview, setAvatarPreview] = useState<string | null>(effectiveAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Cropper Modal State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (effectiveAvatarUrl !== undefined) {
      setAvatarPreview(effectiveAvatarUrl);
    }
  }, [effectiveAvatarUrl]);

  // Compute initials fallback
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : role === "admin"
    ? "AD"
    : "ST";

  const handleFileSelected = (file: File) => {
    // 1. Validate file size
    if (file.size > UPLOAD_LIMITS.IMAGE.MAX_SIZE_BYTES) {
      toast.error(
        `Selected file exceeds maximum allowed size of ${UPLOAD_LIMITS.IMAGE.MAX_SIZE_LABEL}`
      );
      return;
    }

    // 2. Validate file extension
    const ext = getFileExtension(file.name);
    const validExts = [".jpg", ".jpeg", ".png", ".webp"];
    if (!validExts.includes(ext)) {
      toast.error("Only JPG, JPEG, PNG, or WebP images are supported.");
      return;
    }

    // 3. Load image for square cropping modal
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setRawImageSrc(e.target.result as string);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
    // Reset input value so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  // Panning inside cropper
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Perform square crop on canvas and upload
  const applyCropAndUpload = useCallback(async () => {
    if (!rawImageSrc || !imageRef.current) return;

    try {
      setIsUploading(true);
      const img = imageRef.current;

      const canvasSize = 512;
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to initialize canvas context");
      }

      // Fill background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // The crop preview area in UI is 280x280 px
      const cropAreaSize = 280;
      const scaleToCanvas = canvasSize / cropAreaSize;

      ctx.save();
      ctx.translate(canvasSize / 2, canvasSize / 2);
      ctx.scale(zoom * scaleToCanvas, zoom * scaleToCanvas);
      ctx.translate(pan.x / zoom, pan.y / zoom);

      // Draw image centered
      const drawWidth = img.naturalWidth;
      const drawHeight = img.naturalHeight;
      const baseScale = Math.max(cropAreaSize / drawWidth, cropAreaSize / drawHeight);

      ctx.drawImage(
        img,
        (-drawWidth * baseScale) / 2,
        (-drawHeight * baseScale) / 2,
        drawWidth * baseScale,
        drawHeight * baseScale
      );
      ctx.restore();

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/webp", 0.95)
      );

      if (!blob) {
        throw new Error("Failed to process cropped image data");
      }

      // Upload via role-specific endpoint
      const formData = new FormData();
      formData.append("file", blob, "avatar.webp");

      const endpoint = role === "admin" ? "/api/admin/me/avatar" : "/api/student/me/avatar";
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to upload avatar");
      }

      const newAvatarUrl = json.data?.url || null;
      setAvatarPreview(newAvatarUrl);
      setCropModalOpen(false);
      setRawImageSrc(null);

      // Synchronize with NextAuth session
      await updateSession({ avatar: newAvatarUrl });

      if (onAvatarUpdated) {
        onAvatarUpdated(newAvatarUrl);
      }

      toast.success("Profile avatar updated successfully");
    } catch (err: any) {
      console.error("[Avatar Upload Error]:", err);
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  }, [rawImageSrc, zoom, pan, role, updateSession, onAvatarUpdated]);

  // Remove avatar handler
  const handleRemoveAvatar = async () => {
    try {
      setIsRemoving(true);
      const endpoint = role === "admin" ? "/api/admin/me/avatar" : "/api/student/me/avatar";
      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to remove avatar");
      }

      setAvatarPreview(null);

      // Synchronize with NextAuth session
      await updateSession({ avatar: null });

      if (onAvatarUpdated) {
        onAvatarUpdated(null);
      }

      toast.success("Avatar removed");
    } catch (err: any) {
      console.error("[Avatar Remove Error]:", err);
      toast.error(err.message || "Failed to remove avatar");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* Interactive Avatar Area */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-card border border-border">
        {/* Avatar Preview Ring */}
        <div
          className={`relative group w-24 h-24 rounded-full border-2 transition-all overflow-hidden shrink-0 flex items-center justify-center select-none shadow-xs ${
            isDragging
              ? "border-primary ring-4 ring-primary/20 scale-105"
              : "border-border hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarPreview}
              alt={userName || "Profile avatar"}
              className="w-full h-full object-cover"
              onError={() => setAvatarPreview(null)}
            />
          ) : (
            <div className="w-full h-full bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center">
              {initials}
            </div>
          )}

          {/* Hover overlay with Camera trigger */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isRemoving}
            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer disabled:pointer-events-none"
            title="Upload or change profile photo"
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">Change</span>
          </button>
        </div>

        {/* Action Controls & Information */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Profile Photo & Avatar
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              JPG, PNG or WebP. Square aspect ratio recommended, max 5 MB.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isRemoving}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{avatarPreview ? "Change Photo" : "Upload Photo"}</span>
            </button>

            {avatarPreview && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={isUploading || isRemoving}
                className="px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-xs font-medium hover:bg-destructive/15 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isRemoving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
          Square Cropping & Positioning Modal
          ==================================================================== */}
      {cropModalOpen && rawImageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div
            className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5"
            onMouseUp={handleMouseUp}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Crop & Align Profile Photo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCropModalOpen(false);
                  setRawImageSrc(null);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cropping Viewport Container (280x280) */}
            <div className="flex justify-center">
              <div
                className="relative w-[280px] h-[280px] rounded-2xl overflow-hidden bg-black/90 border border-border flex items-center justify-center cursor-move select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
              >
                {/* Image Under Test */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={rawImageSrc}
                  alt="Crop preview"
                  draggable={false}
                  className="max-w-none transition-transform duration-75 origin-center pointer-events-none"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  }}
                />

                {/* Circular Crop Guide Mask */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-full border-2 border-primary/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]"
                  style={{
                    width: "240px",
                    height: "240px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>

            {/* Zoom Slider Control */}
            <div className="space-y-1.5 px-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>Zoom</span>
                </span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <ZoomIn className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setCropModalOpen(false);
                  setRawImageSrc(null);
                }}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-medium hover:bg-muted/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={applyCropAndUpload}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing & Uploading...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply & Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvatarUpload;
