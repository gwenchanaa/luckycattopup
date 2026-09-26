"use client";

import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Cari game favoritmu…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="ink drop-ink flex items-center gap-2.5 rounded-full bg-card px-5 py-3">
      <Search className="size-4 shrink-0 text-[#b4a49c]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Cari game"
        className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-[#9c8c84]"
      />
    </div>
  );
}
