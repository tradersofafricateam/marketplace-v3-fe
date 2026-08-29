"use client";

import { Loader2 } from "lucide-react";

import GoogleGlyph from "@/features/auth/components/atoms/GoogleGlyph/GoogleGlyph";

const GoogleAuthButton = ({
  onClick,
  loading,
  label = "Continue with Google",
}: {
  onClick: () => void;
  loading?: boolean;
  label?: string;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-foreground transition-all duration-200 hover:border-(--orange)/40 hover:bg-(--orange-light) disabled:pointer-events-none disabled:opacity-60"
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin text-(--orange)" />
      ) : (
        <GoogleGlyph />
      )}
      {label}
    </button>
  );
};

export default GoogleAuthButton;
