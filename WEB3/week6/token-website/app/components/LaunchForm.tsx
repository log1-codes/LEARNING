"use client";

import { useState } from "react";

interface LaunchFormProps {
  onLaunch: (data: {
    decimals: number;
    initialSupply: number;
    enableFreeze: boolean;
  }) => void;
  isSubmitting?: boolean;
}

export default function LaunchForm({
  onLaunch,
  isSubmitting = false,
}: LaunchFormProps) {
  const [decimals, setDecimals] = useState(9);
  const [initialSupply, setInitialSupply] = useState(1000);
  const [enableFreeze, setEnableFreeze] = useState(false);

  const handleSubmit = () => {
    onLaunch({
      decimals,
      initialSupply,
      enableFreeze,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">
            Decimals
          </label>
          <input
            type="number"
            min={0}
            max={9}
            value={decimals}
            onChange={(e) => setDecimals(Number(e.target.value))}
            placeholder="Decimals (0–9)"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
          <p className="text-[11px] text-zinc-500">
            Common SPL tokens use 6 or 9 decimals.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">
            Initial supply
          </label>
          <input
            type="number"
            min={1}
            value={initialSupply}
            onChange={(e) => setInitialSupply(Number(e.target.value))}
            placeholder="Initial supply"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
          <p className="text-[11px] text-zinc-500">
            Actual minted amount will be supply × 10^decimals.
          </p>
        </div>
      </div>

      <label className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-200">
        <input
          type="checkbox"
          checked={enableFreeze}
          onChange={() => setEnableFreeze(!enableFreeze)}
          className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-950"
        />
        <span>Enable freeze authority for this mint</span>
      </label>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="cursor-pointer w-full rounded-lg bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 px-3 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.65)] transition hover:shadow-[0_0_34px_rgba(56,189,248,0.9)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        {isSubmitting ? "Launching token…" : "Launch token"}
      </button>
    </div>
  );
}