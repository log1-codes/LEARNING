"use client";

import { motion } from "framer-motion";
import { AppBadge } from "./ui/primitives";

interface TokenCardProps {
  index: number;
  info: any;
}

export function TokenCard({ index, info }: TokenCardProps) {
  const uiAmount = info.tokenAmount.uiAmount;
  const rawAmount = info.tokenAmount.amount;
  const decimals = info.tokenAmount.decimals;

  const handleCopyMint = () => {
    navigator.clipboard.writeText(info.mint);
  };

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#151922] px-4 py-4 shadow-[0_14px_32px_rgba(0,0,0,0.65)]"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-[#F5F7FF]">
            Token account {index + 1}
          </h2>
          <button
            type="button"
            onClick={handleCopyMint}
            className="group flex items-center gap-1 text-xs text-[rgba(255,255,255,0.7)]"
          >
            <span className="truncate font-mono max-w-[260px] group-hover:text-[#66D9EF]">
              {info.mint}
            </span>
            <span className="rounded-md border border-transparent px-1.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.5)] group-hover:border-[rgba(255,255,255,0.16)]">
              Copy
            </span>
          </button>
        </div>

        <AppBadge>{info.state}</AppBadge>
      </header>

      <div className="mt-4 grid gap-4 text-xs text-[rgba(255,255,255,0.78)] md:grid-cols-2">
        <div className="space-y-2">
          <div>
            <p className="text-[rgba(255,255,255,0.55)]">Owner</p>
            <p className="mt-1 break-all font-mono text-md text-[rgba(255,255,255,0.9)]">
              {info.owner}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-right md:text-left">
          <div>
            <p className="text-[rgba(255,255,255,0.55)]">Balance</p>
            <p className="mt-1 text-xl font-semibold text-[#A6E22E]">
              {uiAmount}
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 md:justify-start">
            <p className="text-[rgba(255,255,255,0.5)]">
              Units:{" "}
              <span className="font-mono text-[rgba(255,255,255,0.75)]">
                {rawAmount}
              </span>
            </p>
            <p className="text-[rgba(255,255,255,0.5)]">
              Decimals:{" "}
              <span className="font-mono text-[rgba(255,255,255,0.75)]">
                {decimals}
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

