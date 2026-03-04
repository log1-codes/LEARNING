import type { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";


import { Commitment } from "@solana/web3.js";

import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";


type MySendOptions = {
    skipPreflight?: boolean;
    preflightCommitment?: Commitment;
  };


type SendTransaction = (
  transaction: Transaction,
  connection: Connection,
  options?: MySendOptions
) => Promise<string>;

interface LaunchTokenWithWalletParams {
  connection: Connection;
  walletPublicKey: PublicKey;
  sendTransaction: SendTransaction;
  decimals: number;
  initialSupply: number;
  enableFreeze: boolean;
}

export async function launchTokenWithWallet({
  connection,
  walletPublicKey,
  sendTransaction,
  decimals,
  initialSupply,
  enableFreeze,
}: LaunchTokenWithWalletParams) {
  const mintKeypair = Keypair.generate();

  const rentExemptionLamports =
    await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

  const mintAuthority = walletPublicKey;
  const freezeAuthority = enableFreeze ? walletPublicKey : null;

  const createMintAccountIx = SystemProgram.createAccount({
    fromPubkey: walletPublicKey,
    newAccountPubkey: mintKeypair.publicKey,
    space: MINT_SIZE,
    lamports: rentExemptionLamports,
    programId: TOKEN_PROGRAM_ID,
  });

  const initMintIx = createInitializeMintInstruction(
    mintKeypair.publicKey,
    decimals,
    mintAuthority,
    freezeAuthority,
    TOKEN_PROGRAM_ID
  );

  const ataAddress = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    walletPublicKey
  );

  const createAtaIx = createAssociatedTokenAccountInstruction(
    walletPublicKey,
    ataAddress,
    walletPublicKey,
    mintKeypair.publicKey
  );

  const amountInBaseUnits =
    BigInt(initialSupply) * BigInt(10) ** BigInt(decimals);

  const mintToIx: TransactionInstruction = createMintToInstruction(
    mintKeypair.publicKey,
    ataAddress,
    walletPublicKey,
    amountInBaseUnits,
    [],
    TOKEN_PROGRAM_ID
  );

  const latestBlockhash = await connection.getLatestBlockhash("confirmed");

  const transaction = new Transaction({
    feePayer: walletPublicKey,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  }).add(createMintAccountIx, initMintIx, createAtaIx, mintToIx);

  transaction.partialSign(mintKeypair);

  const signature = await sendTransaction(transaction, connection, {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  });

  await connection.confirmTransaction(
    {
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    },
    "confirmed"
  );

  return {
    mintAddress: mintKeypair.publicKey.toBase58(),
    tokenAccount: ataAddress.toBase58(),
    signature,
  };
}

/* ------------------------------------------------------------------ */
/*  Direct keypair-based launch (no wallet adapter required)          */
/* ------------------------------------------------------------------ */

interface LaunchTokenParams {
  connection: Connection;
  payer: Keypair;
  decimals: number;
  initialSupply: number;
  enableFreeze: boolean;
}

export async function launchToken({
  connection,
  payer,
  decimals,
  initialSupply,
  enableFreeze,
}: LaunchTokenParams) {
  const mintKeypair = Keypair.generate();

  const rentExemptionLamports =
    await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

  const mintAuthority = payer.publicKey;
  const freezeAuthority = enableFreeze ? payer.publicKey : null;

  const createMintAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mintKeypair.publicKey,
    space: MINT_SIZE,
    lamports: rentExemptionLamports,
    programId: TOKEN_PROGRAM_ID,
  });

  const initMintIx = createInitializeMintInstruction(
    mintKeypair.publicKey,
    decimals,
    mintAuthority,
    freezeAuthority,
    TOKEN_PROGRAM_ID
  );

  const ataAddress = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    payer.publicKey
  );

  const createAtaIx = createAssociatedTokenAccountInstruction(
    payer.publicKey,
    ataAddress,
    payer.publicKey,
    mintKeypair.publicKey
  );

  const amountInBaseUnits =
    BigInt(initialSupply) * BigInt(10) ** BigInt(decimals);

  const mintToIx: TransactionInstruction = createMintToInstruction(
    mintKeypair.publicKey,
    ataAddress,
    payer.publicKey,
    amountInBaseUnits,
    [],
    TOKEN_PROGRAM_ID
  );

  const transaction = new Transaction().add(
    createMintAccountIx,
    initMintIx,
    createAtaIx,
    mintToIx
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, mintKeypair],
    { commitment: "confirmed" }
  );

  return {
    mintAddress: mintKeypair.publicKey.toBase58(),
    tokenAccount: ataAddress.toBase58(),
    signature,
  };
}
