"use client";

import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import DOMPurify from "isomorphic-dompurify";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link as LinkIcon,
  ImageIcon,
  Undo,
  Redo,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TiptapEditor({
  value,
  onChange,
  placeholder = "Write comprehensive lecture notes, key trading rules, and setup checklists...",
  disabled = false,
}: TiptapEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline font-medium cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full my-4 border border-border shadow-xs",
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const rawHtml = editor.getHTML();
      const cleanHtml = DOMPurify.sanitize(rawHtml);
      onChange(cleanHtml);
    },
  });

  // Synchronize when value changes externally (e.g. initial fetch)
  useEffect(() => {
    if (editor && value !== undefined) {
      if (editor.getHTML() !== value) {
        editor.commands.setContent(value || "", { emitUpdate: false });
      }
    }
  }, [value, editor]);

  if (!mounted || !editor) {
    return (
      <div className="w-full h-64 bg-muted/20 border border-border rounded-2xl flex items-center justify-center text-muted-foreground text-xs">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-primary" />
        <span>Initializing Rich Text Editor...</span>
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subfolder", "lecture-images");

    try {
      setIsUploadingImage(true);
      const res = await fetch("/api/admin/uploads/image", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to upload image");

      editor.chain().focus().setImage({ src: json.data.url, alt: file.name }).run();
      toast.success("Image uploaded and inserted");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full rounded-2xl bg-card border border-border shadow-xs overflow-hidden focus-within:border-primary/60 transition-colors">
      {/* Hidden image file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif"
        onChange={handleImageFileChange}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="p-2 bg-muted/40 border-b border-border flex items-center gap-1 flex-wrap text-xs">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-primary text-primary-foreground border-primary"
              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-primary text-primary-foreground border-primary"
              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Inline styles */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
            editor.isActive("bold")
              ? "bg-primary text-primary-foreground border-primary"
              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
            editor.isActive("italic")
              ? "bg-primary text-primary-foreground border-primary"
              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
            editor.isActive("underline")
              ? "bg-primary text-primary-foreground border-primary"
              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
            editor.isActive("strike")
              ? "bg-primary text-primary-foreground border-primary"
              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Lists & formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
            editor.isActive("bulletList")
              ? "bg-primary text-primary-foreground border-primary"
              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
            editor.isActive("orderedList")
              ? "bg-primary text-primary-foreground border-primary"
              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
            editor.isActive("blockquote")
              ? "bg-primary text-primary-foreground border-primary"
              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Blockquote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
            editor.isActive("codeBlock")
              ? "bg-primary text-primary-foreground border-primary"
              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Code Block"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-lg border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          title="Horizontal Rule"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Links & Images */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
            editor.isActive("link")
              ? "bg-primary text-primary-foreground border-primary"
              : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Link"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingImage}
          className="p-1.5 rounded-lg border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1 cursor-pointer disabled:opacity-50"
          title="Insert Image"
        >
          {isUploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
          title="Undo"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
          title="Redo"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 min-h-[220px] prose prose-sm dark:prose-invert max-w-none focus:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
