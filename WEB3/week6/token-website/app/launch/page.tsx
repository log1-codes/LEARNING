"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import LaunchForm from "../components/LaunchForm";
import { launchTokenWithWallet } from "../lib/solana";
import { AppBadge, AppButton, AppCard, motionTokens } from "../components/ui/primitives";

export default function LaunchPage() {
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const formSectionRef = useRef<HTMLDivElement | null>(null);

  const handleLaunch = async (data: {
    decimals: number;
    initialSupply: number;
    enableFreeze: boolean;
  }) => {
    if (!connected || !publicKey || !sendTransaction) {
      setError("Connect your Phantom wallet first, then try again.");
      setResult(null);
      return;
    }

    if (
      !Number.isInteger(data.decimals) ||
      data.decimals < 0 ||
      data.decimals > 9
    ) {
      setError("Decimals must be an integer between 0 and 9.");
      setResult(null);
      return;
    }

    if (!Number.isFinite(data.initialSupply) || data.initialSupply <= 0) {
      setError("Initial supply must be a positive number.");
      setResult(null);
      return;
    }

    try {
      setIsLaunching(true);
      setError(null);
      setResult(null);

      const res = await launchTokenWithWallet({
        connection,
        walletPublicKey: publicKey,
        sendTransaction,
        decimals: data.decimals,
        initialSupply: data.initialSupply,
        enableFreeze: data.enableFreeze,
      });

      setResult(res);
    } catch (err: any) {
      console.error("Failed to launch token:", err);
      const message = err?.message ?? "Failed to launch token on devnet.";

      if (
        message.toLowerCase().includes("user rejected") ||
        message.toLowerCase().includes("decline")
      ) {
        setError("Transaction was rejected in your wallet.");
      } else {
        setError(
          message + " Please check your wallet connection and try again."
        );
      }
    } finally {
      setIsLaunching(false);
    }
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-[#0D0F14] text-slate-50 flex items-center justify-center px-4 py-10">
      <motion.div
        className="w-full max-w-5xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTokens.pageTransition}
      >
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              Solana Token Studio
            </p>
            <h1 className="mt-1 text-[28px] md:text-[32px] font-semibold bg-gradient-to-r from-slate-100 via-[#66D9EF] to-slate-200 bg-clip-text text-transparent">
              Launch a new token
            </h1>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-zinc-400">
              Create and configure a new SPL token with custom decimals, initial
              supply, and optional freeze authority. Your connected wallet will
              be used as the mint authority.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-950/80 px-2.5 py-1 shadow-[0_0_24px_rgba(0,0,0,0.95)] backdrop-blur-sm">
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 sm:inline">
                Wallet
              </span>
              <WalletMultiButton className="!h-8 !rounded-full !bg-[#151922] !px-3.5 !text-[11px] !font-medium !text-[rgba(255,255,255,0.9)] !border !border-[rgba(255,255,255,0.08)] hover:!bg-[#1B2130]" />
            </div>

            <div className="flex gap-2.5">
              <AppButton
                type="button"
                variant="secondary"
                onClick={() => router.push("/")}
                className="px-4 py-2"
              >
                View existing tokens
              </AppButton>
              <AppButton
                type="button"
                onClick={scrollToForm}
                className="px-4 py-2"
              >
                Create new token
              </AppButton>
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section ref={formSectionRef}>
            <AppCard className="p-6 space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    Launch token
                  </p>
                  <h2 className="mt-1 text-[18px] md:text-[20px] font-semibold text-slate-50">
                    Token launch details
                  </h2>
                </div>
                <AppBadge>
                  {connected && publicKey ? "Wallet connected" : "Wallet idle"}
                </AppBadge>
              </div>

              <p className="text-[15px] text-[rgba(255,255,255,0.7)] leading-relaxed">
                Configure decimals, supply, and optional freeze authority. Your
                connected wallet will be the mint authority and fund the
                transaction on Solana devnet.
              </p>

              {error && (
                <div className="mt-1 flex items-start gap-3 rounded-xl border border-[rgba(249,38,114,0.4)] bg-[rgba(249,38,114,0.06)] px-4 py-3 text-xs text-[#F92672]">
                  <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F92672]" />
                  <div>
                    <p className="font-medium">Launch failed</p>
                    <p className="mt-1 text-[11px] text-[rgba(249,38,114,0.9)]">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[rgba(255,255,255,0.06)]">
                <LaunchForm
                  onLaunch={handleLaunch}
                  isSubmitting={isLaunching}
                />
              </div>
            </AppCard>
          </section>

          <aside className="space-y-4">
            <AppCard className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-md font-semibold text-slate-100">Status</h3>

                {isLaunching ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/60 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                    Launching…
                  </span>
                ) : result ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    Success
                  </span>
                ) : (
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Waiting to launch
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-zinc-400">
                After a successful launch we will show your mint address and
                primary token account here.
              </p>

              {result && (
                <div className="mt-4 space-y-3 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#151922] p-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                      Mint address
                    </p>
                    <p className="mt-1 break-all font-mono text-xs text-sky-300/90">
                      {result.mintAddress}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                      Token account
                    </p>
                    <p className="mt-1 break-all font-mono text-xs text-sky-200/90">
                      {result.tokenAccount}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${result.mintAddress}\n${result.tokenAccount}`
                      )
                    }
                    className="cursor-pointer mt-2 w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1B2130] px-3 py-2 text-xs font-medium text-[rgba(255,255,255,0.9)] transition hover:bg-[#20273A]"
                  >
                    Copy Mint Address
                  </button>
                </div>
              )}
            </AppCard>

            <AppCard className="p-4 text-xs text-[rgba(255,255,255,0.7)] space-y-2">
              <p className="mb-1.5 font-medium text-zinc-300">
                Need to manage an existing token?
              </p>
              <p>
                Use your token viewer page to inspect balances, metadata, and
                accounts for tokens you have already created.
              </p>
            </AppCard>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}