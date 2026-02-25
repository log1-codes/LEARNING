async function assignOwner() {
    const account = Keypair.generate();
    const newOwner = new PublicKey("NewOwnerProgramIdHere");
  
    // Fund the account first
    const fundTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: account.publicKey,
        lamports: 0.01 * LAMPORTS_PER_SOL,
      })
    );
    await sendAndConfirmTransaction(connection, fundTx, [payer]);
    console.log("Funded account:", account.publicKey.toBase58());
  
    // Assign ownership to a new program
    const assignTx = new Transaction().add(
      SystemProgram.assign({
        accountPubkey: account.publicKey,
        programId: newOwner,
      })
    );
  
    // The account itself must sign
    const signature = await sendAndConfirmTransaction(connection, assignTx, [
      account,
    ]);
    console.log("Assign signature:", signature);
  }