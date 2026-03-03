"use client"

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect , useState } from "react";

interface FetchTokenAccountsProps {
  setAccounts: React.Dispatch<React.SetStateAction<any[]>>;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}



async function fetchTokenAccounts({
  setAccounts , 
  setCount} : FetchTokenAccountsProps) {


  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const ownerAddress = new PublicKey("Brt7BqTE3uRB85Smwm4yzfHkNUGD8W8mz1aCZdBT7Z1W");

  try {
    const response = await connection.getParsedTokenAccountsByOwner(
      ownerAddress,
      {
        programId: TOKEN_PROGRAM_ID,
      },
    );

    // console.log("Found", response.value.length, "token accounts.");
    //   console.log(response.value[0].account.data.parsed.info);

    console.log(
      response.value.forEach((account, index) => {
        console.log(
          `Token Account ${index + 1} `,
          account.account.data.parsed.info
        )
      })



    )
    setAccounts(response.value);
    setCount(response.value.length);
    

  } catch (error) {
    console.error("Failed to fetch token accounts:", error);
  }
}


export default function Home() {

  const [ accounts, setAccounts] = useState<any[]>([]);
  const [count , setCount ]  = useState<number>(0);


  useEffect(() => {
    fetchTokenAccounts({setAccounts , setCount});
  }, [])



  return (
    <div className="min-h-screen bg-black text-white p-10">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-400">
          Token Accounts Overview
        </h1>

        <p className="mb-6 text-lg">
          Total Token Accounts:{" "}
          <span className="text-green-400 font-semibold">{count}</span>
        </p>

        <div className="space-y-6">
          {accounts.map((account, index) => {
            const info = account.account.data.parsed.info;

            return (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg hover:shadow-green-500/20 transition"
              >
                <h2 className="text-xl font-semibold mb-4 text-green-400">
                  Token Account {index + 1}
                </h2>

                <div className="space-y-2 text-sm break-all">
                  <p>
                    <span className="text-zinc-400">Mint:</span> {info.mint}
                  </p>

                  <p>
                    <span className="text-zinc-400">Owner:</span> {info.owner}
                  </p>

                  <p>
                    <span className="text-zinc-400">State:</span> {info.state}
                  </p>

                  <p>
                    <span className="text-zinc-400">Raw Amount:</span>{" "}
                    {info.tokenAmount.amount}
                  </p>

                  <p>
                    <span className="text-zinc-400">Decimals:</span>{" "}
                    {info.tokenAmount.decimals}
                  </p>

                  <p>
                    <span className="text-zinc-400">UI Amount:</span>{" "}
                    {info.tokenAmount.uiAmount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
