import {
    Connection,
    Keypair, 
    PublicKey, 
    clusterApiUrl
} from "@solana/web3.js"


import { 
        createMint ,
        getOrCreateAssociatedTokenAccount ,
        mintTo,
}  from "@solana/spl-token"
import { connect } from "http2";


export const connection = new Connection(clusterApiUrl("devnet"),"confirmed")

interface LaunchTokenParams  {
    payer : Keypair; 
    decimals :number;
    initialSupply : number; 
    enableFreeze : boolean;
}

export async function launchToken({
    payer ,
    decimals,
    initialSupply ,
    enableFreeze 
} : LaunchTokenParams){


    //create mint 

    const mint  = await createMint(connection, payer, payer.publicKey ,enableFreeze ? payer.publicKey : null , decimals )

    //create ATA 

    const tokenAccount = await getOrCreateAssociatedTokenAccount(connection,payer, mint, payer.publicKey)

    // mint initial supply 

    await mintTo(connection , payer , mint, tokenAccount.address ,payer,  initialSupply * Math.pow(10, decimals))

    return {
        mintAddress: mint.toBase58(),
        tokenAccount: tokenAccount.address.toBase58(),
      };
}