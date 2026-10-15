import React from "react";
import { Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";

export default function AdminConsoleLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-muted-foreground space-y-4">
      <BrandLogo size="md" variant="compact" />
      <div className="flex items-center gap-2.5">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
          Accessing Console Data...
        </span>
      </div>
    </div>
  );
}
