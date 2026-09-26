"use client";

import { useState } from "react";
import { Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Game } from "@/types/product";

interface Props {
  game: Game;
  userId: string;
  serverId: string;
  onUserIdChange: (v: string) => void;
  onServerIdChange: (v: string) => void;
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  filled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  filled: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "block cursor-text rounded-xl border-2 bg-card px-3.5 py-2.5 transition-colors focus-within:border-ink",
        filled ? "border-ink bg-background" : "border-[#e3d3cb]"
      )}
    >
      <span className="block text-[9.5px] text-[#9c8c84]">{label}</span>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode="numeric"
        className="w-full bg-transparent text-[15px] font-bold text-ink outline-none placeholder:font-medium placeholder:text-[#c3b4ac]"
      />
    </label>
  );
}

export function AccountIdForm({
  game,
  userId,
  serverId,
  onUserIdChange,
  onServerIdChange,
}: Props) {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    message?: string;
    username?: string;
  } | null>(null);

  if (game.idFieldType === "none") return null;

  const needsServerId = game.idFieldType === "user-id-server-id";
  const canCheck =
    game.supportsValidation && userId.length >= 3 && (!needsServerId || serverId.length >= 1);

  async function handleCheck() {
    setChecking(true);
    setResult(null);
    try {
      const res = await fetch("/api/validate-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameCode: game.code,
          accountUserId: userId,
          accountServerId: needsServerId ? serverId : undefined,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ valid: false, message: "Gagal memvalidasi ID. Coba lagi." });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div>
      <div className="font-display text-[15px] font-extrabold text-ink">Siapa yang mau hoki?</div>
      <div className="mb-3 text-[11.5px] text-[#8c7d75]">
        {game.userIdLabel}
        {needsServerId ? ` & ${game.serverIdLabel}` : ""} — bukan email, bukan password.
      </div>

      <div className={cn("grid gap-2.5", needsServerId && "grid-cols-[1.5fr_1fr]")}>
        <Field
          id="userId"
          label={game.userIdLabel}
          value={userId}
          onChange={(v) => {
            onUserIdChange(v);
            setResult(null);
          }}
          placeholder="125 884 702"
          filled={userId.length > 0}
        />
        {needsServerId && (
          <Field
            id="serverId"
            label={game.serverIdLabel ?? "Server ID"}
            value={serverId}
            onChange={(v) => {
              onServerIdChange(v);
              setResult(null);
            }}
            placeholder="2261"
            filled={serverId.length > 0}
          />
        )}
      </div>

      {game.supportsValidation && (
        <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={!canCheck || checking}
            onClick={handleCheck}
            className="ink press flex items-center gap-1.5 rounded-full bg-koban-soft px-4 py-2 font-display text-[12.5px] font-bold text-ink shadow-[2px_2px_0_var(--ink)] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
          >
            {checking && <Loader2 className="size-3.5 animate-spin" />}
            Cek ID
          </button>

          {result?.valid && (
            <span className="flex items-center gap-2 rounded-xl border-[1.5px] border-collar-line bg-collar-soft px-3 py-2">
              <span className="animate-tick flex size-[26px] items-center justify-center rounded-full bg-collar text-xs font-bold text-white">
                ✓
              </span>
              <span className="text-[13px] font-bold text-collar-ink">
                {result.username ?? "ID valid"}
              </span>
              <span className="text-[11.5px] text-[#6f8a55]">· ketemu!</span>
            </span>
          )}

          {result && !result.valid && (
            <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-bell">
              <XCircle className="size-4" />
              {result.message ?? "ID tidak ditemukan"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
