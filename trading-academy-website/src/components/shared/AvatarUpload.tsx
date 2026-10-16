"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Camera,
  Upload,
  Trash2,
  ZoomOut,
  Check,
  X,
  Loader2,
  ImageIcon,
  RotateCcw,
  Plus,
  Minus,
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

// Fixed dimensions for crop geometry (in px)
const VIEWPORT_SIZE = 280;
const CROP_DIAMETER = 240;
const CROP_RADIUS = CROP_DIAMETER / 2;
const EXPORT_CANVAS_SIZE = 512;

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
  const [imageMeta, setImageMeta] = useState<{
    naturalWidth: number;
    naturalHeight: number;
    fitScale: number;
    isSmall: boolean;
  } | null>(null);

  // Zoom is 1.0 (100% natural fit) up to 3.5 (350%)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Touch pinch-to-zoom tracking
  const pinchRef = useRef<{ initialDist: number; initialZoom: number } | null>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);

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

  // Calculate pan boundaries so the image cannot be dragged completely outside the crop frame
  const clampPan = useCallback(
    (newX: number, newY: number, currentZoom: number, meta = imageMeta) => {
      if (!meta) return { x: 0, y: 0 };

      const renderedW = meta.naturalWidth * meta.fitScale * currentZoom;
      const renderedH = meta.naturalHeight * meta.fitScale * currentZoom;

      // Allow dragging with a margin so any edge can reach the circle center,
      // but the image can never disappear from the aperture.
      const maxPanX = Math.max(0, (renderedW - CROP_DIAMETER) / 2) + CROP_RADIUS * 0.75;
      const maxPanY = Math.max(0, (renderedH - CROP_DIAMETER) / 2) + CROP_RADIUS * 0.75;

      return {
        x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
      };
    },
    [imageMeta]
  );

  const handleFileSelected = (file: File) => {
    // 1. Validate file size (max 5 MB)
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

    // 3. Load image & compute initial natural containment scale
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const dataUrl = e.target.result as string;
        const img = new Image();
        img.onload = () => {
          const nw = img.naturalWidth;
          const nh = img.naturalHeight;

          // Natural fit scale: scale so entire image fits completely inside the crop circle
          const scaleToFitCircle = Math.min(CROP_DIAMETER / nw, CROP_DIAMETER / nh);
          const isSmall = nw < CROP_DIAMETER && nh < CROP_DIAMETER;

          setImageMeta({
            naturalWidth: nw,
            naturalHeight: nh,
            fitScale: scaleToFitCircle,
            isSmall,
          });

          setRawImageSrc(dataUrl);
          setZoom(1); // 100% of contained fit
          setPan({ x: 0, y: 0 }); // Centered
          setCropModalOpen(true);
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and drop into avatar circle
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

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPanning(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const nextPan = clampPan(e.clientX - dragStart.x, e.clientY - dragStart.y, zoom);
    setPan(nextPan);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch pan & pinch-zoom handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPanning(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    } else if (e.touches.length === 2) {
      setIsPanning(false);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      pinchRef.current = { initialDist: dist, initialZoom: zoom };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      const touch = e.touches[0];
      const nextPan = clampPan(touch.clientX - dragStart.x, touch.clientY - dragStart.y, zoom);
      setPan(nextPan);
    } else if (e.touches.length === 2 && pinchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = dist / pinchRef.current.initialDist;
      const newZoom = Math.min(3.5, Math.max(1, pinchRef.current.initialZoom * factor));
      setZoom(newZoom);
      setPan((prev) => clampPan(prev.x, prev.y, newZoom));
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    pinchRef.current = null;
  };

  // Scroll wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.05 : -0.05;
    setZoom((prevZoom) => {
      const nextZoom = Math.min(3.5, Math.max(1, Number((prevZoom + zoomDelta).toFixed(2))));
      setPan((prevPan) => clampPan(prevPan.x, prevPan.y, nextZoom));
      return nextZoom;
    });
  };

  // Zoom button steppers
  const handleStepZoom = (delta: number) => {
    setZoom((prev) => {
      const next = Math.min(3.5, Math.max(1, Number((prev + delta).toFixed(2))));
      setPan((prevPan) => clampPan(prevPan.x, prevPan.y, next));
      return next;
    });
  };

  // Reset to natural contain fit
  const handleResetCrop = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mathematical WYSIWYG Canvas Export
  const applyCropAndUpload = useCallback(async () => {
    if (!rawImageSrc || !imageMeta || !imageElementRef.current) return;

    try {
      setIsUploading(true);
      const img = imageElementRef.current;

      const canvas = document.createElement("canvas");
      canvas.width = EXPORT_CANVAS_SIZE;
      canvas.height = EXPORT_CANVAS_SIZE;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to initialize canvas context");
      }

      // Neutral background (white default before WebP encoding)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, EXPORT_CANVAS_SIZE, EXPORT_CANVAS_SIZE);

      // Multiplier from UI crop diameter to export canvas diameter:
      // M = 512 / 240
      const M = EXPORT_CANVAS_SIZE / CROP_DIAMETER;

      // In UI, rendered size is: (naturalWidth * fitScale * zoom)
      // On canvas, rendered size is: (renderedW * M)
      const canvasRenderedW = imageMeta.naturalWidth * imageMeta.fitScale * zoom * M;
      const canvasRenderedH = imageMeta.naturalHeight * imageMeta.fitScale * zoom * M;

      // In UI, the crop circle center is (VIEWPORT_SIZE / 2, VIEWPORT_SIZE / 2)
      // and the image center is offset by (pan.x, pan.y).
      // On canvas, the crop center is (EXPORT_CANVAS_SIZE / 2, EXPORT_CANVAS_SIZE / 2).
      const canvasCenterX = EXPORT_CANVAS_SIZE / 2 + pan.x * M;
      const canvasCenterY = EXPORT_CANVAS_SIZE / 2 + pan.y * M;

      const drawX = canvasCenterX - canvasRenderedW / 2;
      const drawY = canvasCenterY - canvasRenderedH / 2;

      ctx.save();
      // Anti-aliasing quality settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, drawX, drawY, canvasRenderedW, canvasRenderedH);
      ctx.restore();

      // Convert canvas to blob (WebP format)
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
      setImageMeta(null);

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
  }, [rawImageSrc, imageMeta, zoom, pan, role, updateSession, onAvatarUpdated]);

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

  // Rendered dimensions in preview viewport
  const renderedW = imageMeta ? imageMeta.naturalWidth * imageMeta.fitScale * zoom : 0;
  const renderedH = imageMeta ? imageMeta.naturalHeight * imageMeta.fitScale * zoom : 0;

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
            aria-label="Upload or change profile photo"
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
          Square Cropping & Positioning Modal (Zero-Zoom Contained)
          ==================================================================== */}
      {cropModalOpen && rawImageSrc && imageMeta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in-0 duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="crop-modal-title"
        >
          <div
            className="w-full max-w-md bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto"
            onMouseUp={handleMouseUp}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <h3 id="crop-modal-title" className="text-sm font-bold text-foreground">
                  Crop & Align Profile Photo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCropModalOpen(false);
                  setRawImageSrc(null);
                  setImageMeta(null);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instruction Tip */}
            <p className="text-xs text-muted-foreground text-center">
              Drag to center your face inside the circle. The whole image is visible at 100%.
            </p>

            {/* Cropping Viewport Container (280x280) */}
            <div className="flex justify-center">
              <div
                className="relative rounded-2xl overflow-hidden bg-muted/60 border border-border flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none shadow-inner"
                style={{
                  width: `${VIEWPORT_SIZE}px`,
                  height: `${VIEWPORT_SIZE}px`,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
              >
                {/* Image Element positioned and sized proportionally */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageElementRef}
                  src={rawImageSrc}
                  alt="Crop preview"
                  draggable={false}
                  className="max-w-none pointer-events-none transition-transform duration-75 origin-center select-none"
                  style={{
                    width: `${renderedW}px`,
                    height: `${renderedH}px`,
                    transform: `translate(${pan.x}px, ${pan.y}px)`,
                  }}
                />

                {/* SVG Dimmed Cutout Mask with Crisp Circular Guide Ring */}
                <svg
                  className="absolute inset-0 pointer-events-none"
                  width={VIEWPORT_SIZE}
                  height={VIEWPORT_SIZE}
                  viewBox={`0 0 ${VIEWPORT_SIZE} ${VIEWPORT_SIZE}`}
                >
                  <defs>
                    <mask id="itt-circle-cutout">
                      {/* White reveals the dark mask */}
                      <rect width="100%" height="100%" fill="white" />
                      {/* Black punches the transparent hole */}
                      <circle
                        cx={VIEWPORT_SIZE / 2}
                        cy={VIEWPORT_SIZE / 2}
                        r={CROP_RADIUS}
                        fill="black"
                      />
                    </mask>
                  </defs>

                  {/* Dimmed background overlay outside circle */}
                  <rect
                    width="100%"
                    height="100%"
                    fill="black"
                    fillOpacity="0.65"
                    mask="url(#itt-circle-cutout)"
                  />

                  {/* Circular guide border */}
                  <circle
                    cx={VIEWPORT_SIZE / 2}
                    cy={VIEWPORT_SIZE / 2}
                    r={CROP_RADIUS}
                    fill="none"
                    stroke="var(--color-primary, #10b981)"
                    strokeWidth="2"
                    strokeDasharray="none"
                    opacity="0.9"
                  />
                </svg>
              </div>
            </div>

            {/* Zoom Controls Bar */}
            <div className="space-y-2 px-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>Zoom Scale</span>
                </span>
                <span className="font-semibold text-foreground">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Step Out Button */}
                <button
                  type="button"
                  onClick={() => handleStepZoom(-0.1)}
                  disabled={zoom <= 1}
                  className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  title="Zoom out"
                  aria-label="Zoom out"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Smooth Slider */}
                <input
                  type="range"
                  min="1"
                  max="3.5"
                  step="0.02"
                  value={zoom}
                  onChange={(e) => {
                    const nextZoom = parseFloat(e.target.value);
                    setZoom(nextZoom);
                    setPan((prev) => clampPan(prev.x, prev.y, nextZoom));
                  }}
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Zoom scale"
                />

                {/* Step In Button */}
                <button
                  type="button"
                  onClick={() => handleStepZoom(0.1)}
                  disabled={zoom >= 3.5}
                  className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  title="Zoom in"
                  aria-label="Zoom in"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={handleResetCrop}
                  className="px-2.5 h-8 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer shrink-0"
                  title="Reset to 100% full view"
                  aria-label="Reset zoom and position"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {imageMeta.isSmall && (
                <p className="text-[11px] text-muted-foreground text-center italic pt-0.5">
                  Notice: Image dimensions are smaller than frame. Zoom in if you wish to enlarge.
                </p>
              )}
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setCropModalOpen(false);
                  setRawImageSrc(null);
                  setImageMeta(null);
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
