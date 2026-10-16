"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Plus, X, Loader2, Search } from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
  sublabel?: string;
}

export interface CreatableComboboxProps {
  label?: string;
  options: ComboboxOption[];
  value: string | string[];
  onChange: (value: any) => void;
  placeholder?: string;
  createPlaceholderText?: string;
  onCreate?: (name: string) => Promise<ComboboxOption | null>;
  multiple?: boolean;
  disabled?: boolean;
}

export function CreatableCombobox({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option...",
  createPlaceholderText = "Create",
  onCreate,
  multiple = false,
  disabled = false,
}: CreatableComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search query
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(search.toLowerCase()))
  );

  // Check if search query matches an existing option exactly
  const exactMatch = options.some(
    (opt) => opt.label.trim().toLowerCase() === search.trim().toLowerCase()
  );

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (val: string) => {
    if (multiple) {
      const next = selectedValues.includes(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val];
      onChange(next);
    } else {
      onChange(val);
      setIsOpen(false);
    }
    setSearch("");
  };

  const handleRemove = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    if (multiple) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange("");
    }
  };

  const handleCreate = async () => {
    const trimmed = search.trim();
    if (!trimmed || !onCreate) return;

    try {
      setIsCreating(true);
      const newOption = await onCreate(trimmed);
      if (newOption) {
        if (multiple) {
          onChange([...selectedValues, newOption.value]);
        } else {
          onChange(newOption.value);
          setIsOpen(false);
        }
        setSearch("");
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative text-xs w-full" ref={containerRef}>
      {label && <label className="block text-foreground font-medium mb-1">{label}</label>}

      {/* Trigger Box */}
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => inputRef.current?.focus(), 50);
            }
          }
        }}
        className={`w-full min-h-[38px] bg-muted/40 border border-border rounded-xl px-3 py-1.5 flex items-center justify-between gap-2 cursor-pointer transition-colors ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50"
        } ${isOpen ? "border-primary ring-1 ring-primary/20" : ""}`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedValues.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : multiple ? (
            selectedValues.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span
                  key={val}
                  className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium flex items-center gap-1"
                >
                  <span>{opt?.label || val}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemove(e, val)}
                      className="hover:text-destructive cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              );
            })
          ) : (
            <span className="text-foreground font-medium truncate">
              {options.find((o) => o.value === selectedValues[0])?.label || selectedValues[0]}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-muted-foreground shrink-0">
          {!multiple && selectedValues.length > 0 && !disabled && (
            <button
              type="button"
              onClick={(e) => handleRemove(e, selectedValues[0])}
              className="p-0.5 hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronsUpDown className="w-3.5 h-3.5 opacity-60" />
        </div>
      </div>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
          {/* Search Field */}
          <div className="p-2 border-b border-border/60 flex items-center gap-2 bg-muted/20">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!exactMatch && search.trim() && onCreate) {
                    handleCreate();
                  } else if (filteredOptions.length > 0) {
                    handleSelect(filteredOptions[0].value);
                  }
                }
              }}
              placeholder="Search or type to create..."
              className="w-full bg-transparent border-0 p-0 text-xs text-foreground focus:outline-none"
            />
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1 space-y-0.5">
            {filteredOptions.length === 0 && !search.trim() && (
              <div className="p-3 text-center text-muted-foreground text-xs italic">
                No items available.
              </div>
            )}

            {filteredOptions.map((opt) => {
              const isSelected = selectedValues.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`p-2 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted/60"
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="text-[10px] text-muted-foreground font-normal truncate">
                        {opt.sublabel}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </div>
              );
            })}

            {/* Inline Creation Button */}
            {!exactMatch && search.trim().length >= 2 && onCreate && (
              <button
                type="button"
                onClick={handleCreate}
                disabled={isCreating}
                className="w-full p-2 mt-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors flex items-center justify-between cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {createPlaceholderText} &quot;<strong>{search.trim()}</strong>&quot;
                  </span>
                </div>
                {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
