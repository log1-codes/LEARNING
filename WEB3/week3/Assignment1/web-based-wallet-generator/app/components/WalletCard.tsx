'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Eye, EyeOff, Trash2, RefreshCw , Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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

  // Alchemy RPC endpoint - replace with your API key
  // You can also use environment variable: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "YOUR_ALCHEMY_API_KEY_HERE"
  const SOLANA_RPC_ENDPOINT = `https://solana-devnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  
  // Fallback to public endpoint if Alchemy key is not set
  const RPC_ENDPOINT = ALCHEMY_API_KEY && ALCHEMY_API_KEY !== "YOUR_ALCHEMY_API_KEY_HERE" 
    ? SOLANA_RPC_ENDPOINT 
    : "https://api.devnet.solana.com"

  const truncateAddress = (address: string, chars = 8) => {
    if (address.length <= chars * 2) return address
    return `${address.slice(0, chars)}...${address.slice(-chars)}`
  }

  // Fetch balance
  const fetchBalance = async (forceRefresh = false) => {
    if (blockchain !== 'solana') return

    setIsLoadingBalance(true)
    try {
      // Use Alchemy RPC for better reliability
      const connection = new Connection(RPC_ENDPOINT, 'confirmed')
      const publicKeyObj = new PublicKey(publicKey)
      
      // Force a fresh fetch
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

  // Fetch balance on mount and when publicKey changes
  useEffect(() => {
    if (blockchain === 'solana') {
      fetchBalance()
    }
  }, [publicKey, blockchain])

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
          <Button
            variant="outline"
            onClick={() => window.open('https://faucet.solana.com', '_blank')}
            className="w-full"
          >
            Get SOL from Web Faucet
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default WalletCard