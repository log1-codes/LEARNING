solana-keygen new --outfile new-account.json --no-bip39-passphrase

solana transfer $(solana-keygen pubkey new-account.json) 0.1 --allow-unfunded-recipient