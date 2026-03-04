"use client";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

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
      // Clear any previous data when wallet disconnects
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-slate-900 text-slate-50 flex items-center justify-center px-4 py-10">
      <main className="w-full max-w-5xl">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              Solana Token Studio
            </p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-slate-100 via-sky-300 to-slate-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(56,189,248,0.25)]">
              Token accounts overview
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              Inspect SPL token accounts for your configured devnet wallet. Use
              this as a dashboard after launching new tokens.
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
                onClick={handleRefresh}
                className="cursor-pointer inline-flex items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition hover:border-sky-500/60 hover:text-sky-200 hover:shadow-[0_0_18px_rgba(56,189,248,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading || !connected}
              >
                {isLoading ? "Refreshing…" : "Refresh"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/launch")}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_26px_rgba(56,189,248,0.6)] transition hover:shadow-[0_0_34px_rgba(56,189,248,0.9)]"
              >
                Launch new token
              </button>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-zinc-800/80 bg-zinc-950/90 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.9)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Total token accounts
              </p>
              <p className="mt-1 text-3xl md:text-4xl font-semibold text-sky-300">
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
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-xs text-red-200">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
              <div>
                <p className="font-medium">Unable to load token accounts</p>
                <p className="mt-1 text-[11px] text-red-200/90">{error}</p>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3 max-h-[460px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-sky-500/40">
            {isLoading && !accounts.length && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-xs text-zinc-400">
                Fetching token accounts from Solana devnet…
              </div>
            )}

            {!isLoading && !accounts.length && !error && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-xs text-zinc-400">
                No accounts loaded yet. Try refreshing or launching a new token.
              </div>
            )}

            {accounts.map((account, index) => {
              const info = account.account.data.parsed.info;

              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-950 border border-zinc-800/90 rounded-xl px-4 py-3.5 shadow-lg hover:border-sky-500/40 hover:shadow-[0_0_22px_rgba(56,189,248,0.35)] transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm md:text-[15px] font-semibold text-slate-100">
                      Token account {index + 1}
                    </h2>
                    <span className="rounded-full border border-zinc-700/70 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                      {info.state}
                    </span>
                  </div>

                  <div className="mt-2.5 grid gap-2.5 text-[11px] text-zinc-300 md:grid-cols-2">
                    <div>
                      <p className="text-zinc-500">Mint</p>
                      <p className="mt-1 break-all font-mono text-[11px] text-sky-300/90">
                        {info.mint}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Owner</p>
                      <p className="mt-1 break-all font-mono text-[11px] text-zinc-200/90">
                        {info.owner}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Token balance (user view)</p>
                      <p className="mt-1 font-mono text-xs">
                        {info.tokenAmount.uiAmount}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">
                        Smallest units (on-chain)
                      </p>
                      <p className="mt-1 font-mono text-xs">
                        {info.tokenAmount.amount}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Decimals (precision)</p>
                      <p className="mt-1 font-mono text-xs">
                        {info.tokenAmount.decimals}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
