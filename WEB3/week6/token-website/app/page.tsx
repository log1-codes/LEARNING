"use client";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { AppButton, AppCard, AppSkeleton, motionTokens } from "./components/ui/primitives";
import { TokenCard } from "./components/TokenCard";

interface FetchTokenAccountsProps {
  connection: import("@solana/web3.js").Connection;
  ownerAddress: import("@solana/web3.js").PublicKey;
  setAccounts: React.Dispatch<React.SetStateAction<any[]>>;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

async function fetchTokenAccounts({
  connection,
  ownerAddress,
  setAccounts,
  setCount,
  setError,
  setIsLoading,
}: FetchTokenAccountsProps) {
  try {
    setIsLoading(true);
    setError(null);

    const response = await connection.getParsedTokenAccountsByOwner(
      ownerAddress,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );

    setAccounts(response.value);
    setCount(response.value.length);

    if (!response.value.length) {
      setError("No token accounts found for this wallet on devnet.");
    }
  } catch (error: any) {
    console.error("Failed to fetch token accounts:", error);
    setError(
      error?.message ??
        "Failed to fetch token accounts. Please try again in a moment."
    );
  } finally {
    setIsLoading(false);
  }
}

export default function Home() {
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [accounts, setAccounts] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setAccounts([]);
      setCount(0);
      setError(null);
      return;
    }

    fetchTokenAccounts({
      connection,
      ownerAddress: publicKey,
      setAccounts,
      setCount,
      setError,
      setIsLoading,
    });
  }, [connection, publicKey]);

  const handleRefresh = () => {
    if (!publicKey) {
      setError("Connect your Phantom wallet to view token accounts.");
      return;
    }

    fetchTokenAccounts({
      connection,
      ownerAddress: publicKey,
      setAccounts,
      setCount,
      setError,
      setIsLoading,
    });
  };

  return (
    <div className="min-h-screen bg-[#0D0F14] text-slate-50 flex items-center justify-center px-4 py-10">
      <motion.main
        className="w-full max-w-5xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTokens.pageTransition}
      >
        {/* Top row: wallet */}
        <div className="mb-6 flex items-center justify-end">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-950/80 px-2.5 py-1 shadow-[0_0_24px_rgba(0,0,0,0.95)] backdrop-blur-sm">
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 sm:inline">
              Wallet
            </span>
            <WalletMultiButton className="!h-8 !rounded-full !bg-[#151922] !px-3.5 !text-[11px] !font-medium !text-[rgba(255,255,255,0.9)] !border !border-[rgba(255,255,255,0.08)] hover:!bg-[#1B2130]" />
          </div>
        </div>

        {/* Main header row: title + actions */}
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              Solana Token Studio
            </p>
            <h1 className="mt-1 text-[28px] md:text-[32px] font-semibold bg-gradient-to-r from-slate-100 via-[#66D9EF] to-slate-200 bg-clip-text text-transparent">
              Token accounts overview
            </h1>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-zinc-400">
              Inspect SPL token accounts for your configured devnet wallet. Use
              this as a dashboard after launching new tokens.
            </p>
          </div>

          <div className="flex gap-2.5">
            <AppButton
              type="button"
              variant="secondary"
              onClick={handleRefresh}
              disabled={isLoading || !connected}
              className="px-4 py-2"
            >
              {isLoading ? "Refreshing…" : "Refresh"}
            </AppButton>
            <AppButton
              type="button"
              onClick={() => router.push("/launch")}
              className="px-4 py-2"
            >
              Launch new token
            </AppButton>
          </div>
        </header>

        <AppCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Total token accounts
              </p>
              <p className="mt-1 text-3xl md:text-4xl font-semibold text-[#A6E22E]">
                {count}
              </p>
              <p className="mt-1 text-[11px] text-zinc-500 max-w-sm">
                Each balance is shown both in{" "}
                <span className="text-sky-300">full tokens</span> and in{" "}
                <span className="text-zinc-300">smallest on-chain units</span>{" "}
                (like cents vs. rupees).
              </p>
            </div>

            <div className="text-right text-[11px] text-zinc-500">
              <p>Network: devnet</p>
              {publicKey ? (
                <p className="mt-0.5 truncate max-w-[220px]">
                  Owner:{" "}
                  <span className="font-mono text-[11px] text-zinc-400">
                    {publicKey.toBase58()}
                  </span>
                </p>
              ) : (
                <p className="mt-0.5 max-w-[220px] text-zinc-600">
                  Connect a wallet to view its token accounts.
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-[rgba(249,38,114,0.4)] bg-[rgba(249,38,114,0.06)] px-4 py-3 text-xs text-[#F92672]">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F92672]" />
              <div>
                <p className="font-medium">Unable to load token accounts</p>
                <p className="mt-1 text-[11px] text-[rgba(249,38,114,0.9)]">
                  {error}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3 max-h-[460px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(102,217,239,0.55)]">
            {isLoading && !accounts.length && (
              <div className="space-y-2">
                <AppSkeleton className="h-10 w-40" />
                <AppSkeleton className="h-24 w-full" />
                <AppSkeleton className="h-24 w-full" />
              </div>
            )}

            {!isLoading && !accounts.length && !error && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#151922] px-6 py-10 text-center">
                <div className="mb-3 h-10 w-10 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#0D0F14]/60" />
                <p className="text-md font-medium text-[rgba(255,255,255,0.85)]">
                  No token accounts yet
                </p>
                <p className="mt-1 text-xs text-[rgba(255,255,255,0.6)] max-w-xs">
                  Connect your wallet and use the launch page to create a new
                  token. Your accounts will appear here once created.
                </p>
              </div>
            )}

            {accounts.map((account, index) => {
              const info = account.account.data.parsed.info;
              return <TokenCard key={index} index={index} info={info} />;
            })}
          </div>
        </AppCard>
      </motion.main>
    </div>
  );
}
