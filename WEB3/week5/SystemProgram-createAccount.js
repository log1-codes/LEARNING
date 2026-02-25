import { Keypair, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "finalized");

async function createAccount() {
    const payer = Keypair.fromSecretKey(new Uint8Array([.......]));
    // First create and fund a new account with no space
    const newAccount = Keypair.generate();
    console.log(payer.publicKey.toBase58())
    const fundTx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: newAccount.publicKey,
        lamports: 0.1 * LAMPORTS_PER_SOL,
        space: 0,
        programId: SystemProgram.programId,
      })
    );
    await sendAndConfirmTransaction(connection, fundTx, [payer, newAccount]);
    console.log("Funded account:", newAccount.publicKey.toBase58());
  }
  
  createAccount()