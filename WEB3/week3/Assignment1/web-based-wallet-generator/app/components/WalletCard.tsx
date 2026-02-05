'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Eye, EyeOff, Trash2, RefreshCw, Loader2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js'
import { toast } from 'sonner'
import bs58 from 'bs58'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle ,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface WalletCardProps {
  index: number
  publicKey: string
  privateKey: string
  blockchain: 'solana' | 'ethereum'
  showPrivateKey: boolean
  onTogglePrivateKey: () => void
  onCopy: (content: string, label: string) => void
  onDelete: () => void
}

const WalletCard = ({
  index,
  publicKey,
  privateKey,
  blockchain,
  showPrivateKey,
  onTogglePrivateKey,
  onCopy,
  onDelete,
}: WalletCardProps) => {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [isTransferring, setIsTransferring] = useState(false)

  const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY 
  const SOLANA_RPC_ENDPOINT = `https://solana-devnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  
  // Fallback to public endpoint if Alchemy key is not set
  const RPC_ENDPOINT = ALCHEMY_API_KEY && ALCHEMY_API_KEY !== "YOUR_ALCHEMY_API_KEY_HERE" 
    ? SOLANA_RPC_ENDPOINT 
    : "https://api.devnet.solana.com"

  const truncateAddress = (address: string, chars = 8) => {
    if (address.length <= chars * 2) return address
    return `${address.slice(0, chars)}...${address.slice(-chars)}`
  }

  const fetchBalance = async (forceRefresh = false) => {
    if (blockchain !== 'solana') return

    setIsLoadingBalance(true)
    try {
      const connection = new Connection(RPC_ENDPOINT, 'confirmed')
      const publicKeyObj = new PublicKey(publicKey)
      
      const balanceInLamports = await connection.getBalance(
        publicKeyObj,
        forceRefresh ? 'confirmed' : 'confirmed'
      )
      const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL
      setBalance(balanceInSol)
      console.log(`Balance fetched: ${balanceInSol} SOL`)
    } catch (error) {
      console.error('Error fetching balance:', error)
      setBalance(null)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  useEffect(() => {
    if (blockchain === 'solana') {
      fetchBalance()
    }
  }, [publicKey, blockchain])

  const handleTransferSol = async () => {
    if (blockchain !== 'solana') {
      toast.error('SOL transfer is only available for Solana wallets')
      return
    }

    // Validation
    if (!recipientAddress.trim()) {
      toast.error('Please enter recipient address')
      return
    }

    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    const amountInSol = parseFloat(transferAmount)
    if (balance !== null && amountInSol > balance) {
      toast.error(`Insufficient balance. You have ${balance.toFixed(4)} SOL`)
      return
    }

    setIsTransferring(true)
    const toastId = toast.loading('Processing transfer...')

    try {
      // Validate recipient address
      let recipientPublicKey
      try {
        recipientPublicKey = new PublicKey(recipientAddress)
      } catch {
        toast.error('Invalid recipient address', { id: toastId })
        setIsTransferring(false)
        return
      }

      // Create connection
      const connection = new Connection(RPC_ENDPOINT, 'confirmed')

      // Decode private key from base58
      const senderKeypair = (() => {
        const { Keypair } = require('@solana/web3.js')
        try {
          const decoded = bs58.decode(privateKey)
          return Keypair.fromSecretKey(decoded)
        } catch {
          throw new Error('Invalid private key format')
        }
      })()

      // Create transfer instruction
      const lamports = Math.floor(amountInSol * LAMPORTS_PER_SOL)
      const instruction = SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPublicKey,
        lamports,
      })

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

      // Create and sign transaction
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: senderKeypair.publicKey,
      }).add(instruction)

      transaction.sign(senderKeypair)

      // Send transaction
      const signature = await connection.sendRawTransaction(transaction.serialize())
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        'confirmed'
      )

      if (confirmation.value.err) {
        toast.error('Transaction failed', { id: toastId })
      } else {
        toast.success(`✓ Transferred ${amountInSol} SOL successfully!`, { id: toastId })
        setRecipientAddress('')
        setTransferAmount('')
        setIsTransferDialogOpen(false)
        
        // Refresh balance
        setTimeout(() => fetchBalance(true), 2000)
      }
    } catch (error: any) {
      console.error('Transfer error:', error)
      toast.error(error.message || 'Transfer failed', { id: toastId })
    } finally {
      setIsTransferring(false)
    }
  }

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
            {index + 1}
          </div>
          <div>
            <h3 className="font-semibold text-lg">Wallet {index + 1}</h3>
            <p className="text-xs text-muted-foreground capitalize">{blockchain} Devnet</p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Wallet {index + 1}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove this wallet from your browser storage. Make sure you have backed up the private key if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Content */}
      <CardContent className="p-6 space-y-4">
        {/* Balance Display - Solana Only */}
        {blockchain === 'solana' && (
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Balance</p>
                <p className="text-2xl font-bold">
                  {isLoadingBalance ? (
                    <Loader2 className="h-6 w-6 animate-spin inline" />
                  ) : balance !== null ? (
                    `${balance.toFixed(4)} SOL`
                  ) : (
                    '-- SOL'
                  )}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchBalance(true)}
                disabled={isLoadingBalance}
                className="shrink-0"
                title="Refresh balance"
              >
                <RefreshCw className={cn("h-4 w-4", isLoadingBalance && "animate-spin")} />
              </Button>
            </div>
          </div>
        )}

        {/* Public Key */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Public Address</label>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm break-all">
            <span className="flex-1">{publicKey}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCopy(publicKey, 'Public address')}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Private Key */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Private Key</label>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm break-all">
            <span className="flex-1">
              {showPrivateKey ? privateKey : '•'.repeat(Math.min(privateKey.length, 48))}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onTogglePrivateKey}
              className="shrink-0"
            >
              {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCopy(privateKey, 'Private key')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Web Faucet Button - Solana Only */}
        {blockchain === 'solana' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open('https://faucet.solana.com', '_blank')}
              className="flex-1"
            >
              Get SOL from Web Faucet
            </Button>

            <AlertDialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button className="flex-1" variant="default">
                  <Send className="h-4 w-4 mr-2" />
                  Transfer SOL
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Transfer SOL</AlertDialogTitle>
                  <AlertDialogDescription>
                    Send SOL to another wallet address
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recipient Address</label>
                    <Input
                      placeholder="Enter recipient's public key"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      disabled={isTransferring}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount (SOL)</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="0.0"
                        type="number"
                        step="0.01"
                        min="0"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        disabled={isTransferring}
                      />
                      {balance !== null && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTransferAmount(Math.max(0, balance - 0.00005).toString())}
                          disabled={isTransferring}
                        >
                          Max
                        </Button>
                      )}
                    </div>
                    {balance !== null && (
                      <p className="text-xs text-muted-foreground">
                        Available: {balance.toFixed(4)} SOL
                      </p>
                    )}
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isTransferring}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleTransferSol}
                    disabled={isTransferring}
                    className="bg-primary"
                  >
                    {isTransferring ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Transferring...
                      </>
                    ) : (
                      'Transfer'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WalletCard