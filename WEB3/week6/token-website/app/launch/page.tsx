"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import LaunchForm from "../components/LaunchForm";
import { launchTokenWithWallet } from "../lib/solana";

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-slate-900 text-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              Solana Token Studio
            </p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-slate-100 via-sky-300 to-slate-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(56,189,248,0.25)]">
              Launch a new token
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
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
              <WalletMultiButton className="!h-8 !rounded-full !bg-gradient-to-r !from-sky-500 !via-cyan-400 !to-emerald-400 !px-3.5 !text-[11px] !font-semibold !text-slate-950 hover:!shadow-[0_0_18px_rgba(56,189,248,0.7)] hover:!brightness-110" />
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="cursor-pointer inline-flex items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition hover:border-sky-500/60 hover:text-sky-200 hover:shadow-[0_0_18px_rgba(56,189,248,0.35)]"
              >
                View existing tokens
              </button>
              <button
                type="button"
                onClick={scrollToForm}
                className="cursor-pointer inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_26px_rgba(56,189,248,0.6)] transition hover:shadow-[0_0_34px_rgba(56,189,248,0.9)]"
              >
                Create new token
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section
            ref={formSectionRef}
            className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-950 p-[1px] shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
          >
            <div className="relative h-full rounded-[1rem] bg-gradient-to-br from-zinc-950/90 via-slate-950 to-zinc-900/95 px-5 py-6 md:px-7 md:py-7">
              <div
                className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 0% 0%, rgba(56,189,248,0.28) 0, transparent 55%), radial-gradient(circle at 100% 100%, rgba(168,85,247,0.16) 0, transparent 55%)",
                }}
              />

              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400 shadow-inner shadow-zinc-950/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                  Launch token workflow
                </div>

                <h2 className="text-xl md:text-2xl font-semibold text-slate-50">
                  Token launch details
                </h2>
                <p className="mt-1.5 text-sm text-zinc-400">
                  Configure decimals, supply, and freeze authority. When you are
                  ready, launch your token securely on Solana devnet using your
                  connected wallet.
                </p>

                {error && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                    <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
                    <div>
                      <p className="font-medium">Launch failed</p>
                      <p className="mt-1 text-[11px] text-red-200/90">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-5 border-t border-zinc-800/80 pt-5">
                  <LaunchForm
                    onLaunch={handleLaunch}
                    isSubmitting={isLaunching}
                  />
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/90 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.9)]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-100">
                  Launch status
                </h3>

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
                <div className="mt-4 space-y-3 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900/80 p-4">
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
                    className="cursor-pointer mt-2 w-full rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-xs font-medium text-sky-200 transition hover:border-sky-400/80 hover:bg-sky-500/20"
                  >
                    Copy Mint Address
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-slate-950 via-zinc-950 to-zinc-900/90 p-4 text-xs text-zinc-400">
              <p className="mb-1.5 font-medium text-zinc-300">
                Need to manage an existing token?
              </p>
              <p>
                Use your token viewer page to inspect balances, metadata, and
                accounts for tokens you have already created.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}