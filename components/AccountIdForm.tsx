"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Game } from "@/types/product";

interface Props {
  game: Game;
  userId: string;
  serverId: string;
  onUserIdChange: (v: string) => void;
  onServerIdChange: (v: string) => void;
}

export function AccountIdForm({ game, userId, serverId, onUserIdChange, onServerIdChange }: Props) {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; message?: string; username?: string } | null>(
    null
  );

  if (game.idFieldType === "none") return null;

  const needsServerId = game.idFieldType === "user-id-server-id";
  const canCheck = game.supportsValidation && userId.length >= 3 && (!needsServerId || serverId.length >= 1);

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
    <div className="space-y-3">
      <div className={needsServerId ? "grid grid-cols-2 gap-3" : ""}>
        <div className="space-y-1.5">
          <Label htmlFor="userId">{game.userIdLabel}</Label>
          <Input
            id="userId"
            value={userId}
            onChange={(e) => {
              onUserIdChange(e.target.value);
              setResult(null);
            }}
            placeholder={`Masukkan ${game.userIdLabel}`}
          />
        </div>
        {needsServerId && (
          <div className="space-y-1.5">
            <Label htmlFor="serverId">{game.serverIdLabel}</Label>
            <Input
              id="serverId"
              value={serverId}
              onChange={(e) => {
                onServerIdChange(e.target.value);
                setResult(null);
              }}
              placeholder={`Masukkan ${game.serverIdLabel}`}
            />
          </div>
        )}
      </div>

      {game.supportsValidation && (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canCheck || checking}
            onClick={handleCheck}
          >
            {checking && <Loader2 className="h-4 w-4 animate-spin" />}
            Cek ID
          </Button>
          {result && (
            <span
              className={
                "flex items-center gap-1.5 text-sm " +
                (result.valid ? "text-emerald-600" : "text-destructive")
              }
            >
              {result.valid ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {result.valid ? result.username ?? "ID valid" : result.message ?? "ID tidak ditemukan"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
