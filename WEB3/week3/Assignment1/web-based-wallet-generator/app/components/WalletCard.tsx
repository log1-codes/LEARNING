'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Eye, EyeOff, Trash2, RefreshCw, Loader2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { toast } from 'sonner'
import bs58 from 'bs58'
import { ethers } from 'ethers'
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
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [isTransferring, setIsTransferring] = useState(false)
  const [estimatedGasFee, setEstimatedGasFee] = useState<string | null>(null)
  const [isEstimatingGas, setIsEstimatingGas] = useState(false)

  const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  const SOLANA_RPC_ENDPOINT = `https://solana-devnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  const ETH_RPC_ENDPOINT = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`


  // Fallback to public endpoint if Alchemy key is not set
  const RPC_ENDPOINT = ALCHEMY_API_KEY && ALCHEMY_API_KEY !== "YOUR_ALCHEMY_API_KEY_HERE"
    ? SOLANA_RPC_ENDPOINT
    : "https://api.devnet.solana.com"

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
      // console.log(`Balance fetched: ${balanceInSol} SOL`)
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


  const fetchEthBalance = async (forceRefresh = false) => {
    setIsLoadingBalance(true)
    try {
      const provider = new ethers.JsonRpcProvider(ETH_RPC_ENDPOINT)
      const balanceWei = await provider.getBalance(publicKey)
      const balanceEth = ethers.formatEther(balanceWei)
      setBalance(parseFloat(balanceEth))
      // console.log(`Balance fetched: ${balanceEth} ETH`)
    } catch (err) {
      console.error('Error fetching balance:', err)
      setBalance(null)
    } finally {
      setIsLoadingBalance(false)
    }
  }


  useEffect(() => {
    if (blockchain === 'ethereum') {
      fetchEthBalance()
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
  const estimateEthGasFee = async () => {
    if (!recipientAddress.trim() || !transferAmount) {
      setEstimatedGasFee(null)
      return
    }

    if (!ethers.isAddress(recipientAddress)) {
      setEstimatedGasFee(null)
      return
    }

    setIsEstimatingGas(true)
    try {
      const provider = new ethers.JsonRpcProvider(ETH_RPC_ENDPOINT)
      const wallet = new ethers.Wallet(privateKey, provider)

      const tx = {
        to: recipientAddress,
        value: ethers.parseEther(transferAmount),
        from: wallet.address,
      }

      // Estimate gas
      const gasEstimate = await provider.estimateGas(tx)
      const feeData = await provider.getFeeData()
      
      if (feeData.gasPrice) {
        const gasCostWei = gasEstimate * feeData.gasPrice
        const gasCostEth = ethers.formatEther(gasCostWei)
        setEstimatedGasFee(gasCostEth)
      } else {
        setEstimatedGasFee(null)
      }
    } catch (error: any) {
      console.error('Gas estimation error:', error)
      setEstimatedGasFee(null)
    } finally {
      setIsEstimatingGas(false)
    }
  }

  // Estimate gas when transfer amount or recipient changes
  useEffect(() => {
    if (blockchain === 'ethereum' && isTransferDialogOpen && recipientAddress && transferAmount) {
      const timer = setTimeout(() => {
        estimateEthGasFee()
      }, 500) // Debounce to avoid too many requests
      return () => clearTimeout(timer)
    } else {
      setEstimatedGasFee(null)
    }
  }, [recipientAddress, transferAmount, blockchain, isTransferDialogOpen])

  const handleTransferEth = async () => {
    if (blockchain !== 'ethereum') {
      toast.error("Eth transfer is only available for Ethereum wallets")
      return;
    }
    if (!recipientAddress.trim()) {
      toast.error("Please Enter recipient adress")
      return;
    }
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast.error("Please Enter a valid amount")
      return;
    }
    const amountInEth = parseFloat(transferAmount)
    if (balance !== null && amountInEth > balance) {
      toast.error(`Insufficient balance, You have ${balance.toFixed(4)} Eth `)
      return;
    }

    // Check if balance covers amount + gas fee
    if (estimatedGasFee !== null && balance !== null) {
      const totalRequired = amountInEth + parseFloat(estimatedGasFee)
      if (totalRequired > balance) {
        toast.error(`Insufficient balance for transfer + gas. Need ${totalRequired.toFixed(6)} ETH, have ${balance.toFixed(4)} ETH`)
        return
      }
    }

    setIsTransferring(true)
    const toastId = toast.loading('processing transfer...')

    try {
      if (!ethers.isAddress(recipientAddress)) {
        toast.error('Invalid recipient address', { id: toastId })
        setIsTransferring(false)
        return
      }
      const provider = new ethers.JsonRpcProvider(ETH_RPC_ENDPOINT)
      const wallet = new ethers.Wallet(privateKey, provider)

      const tx = await wallet.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(transferAmount)
      })

      await tx.wait();

      toast.success(`✓ Transferred ${amountInEth} Eth successfully!`, { id: toastId })
      setRecipientAddress('')
      setTransferAmount('')
      setEstimatedGasFee(null)
      setIsTransferDialogOpen(false)

      // Refresh balance
      setTimeout(() => fetchEthBalance(true), 2000)
    } catch (error: any) {
      // console.log("Eth transfer error:", error)
      toast.error(error.message || "Eth transfer failed", { id: toastId })
    } finally {
      setIsTransferring(false)
    }
  }

  const [isAirdropping, setIsAirdropping] = useState(false)

  const handleRequestSolAirdrop = async () => {
    if (blockchain !== 'solana') {
      toast.error('Airdrop is only available for Solana wallets')
      return
    }

    setIsAirdropping(true)
    const toastId = toast.loading('Requesting SOL airdrop...')

    try {
      const connection = new Connection(RPC_ENDPOINT, 'confirmed')
      const publicKeyObj = new PublicKey(publicKey)

      // Request 1 SOL (in lamports)
      const lamports = LAMPORTS_PER_SOL
      const signature = await connection.requestAirdrop(publicKeyObj, lamports)

      // Wait for confirmation (best-effort)
      try {
        await connection.confirmTransaction(signature, 'confirmed')
      } catch (err) {
        console.warn('confirmTransaction fallback', err)
      }

      toast.success('✓ Airdrop successful — 1 SOL credited', { id: toastId })
      // Refresh balance
      setTimeout(() => fetchBalance(true), 2000)
    } catch (error: any) {
      console.error('Airdrop error:', error)
      toast.error(error?.message || 'Airdrop failed', { id: toastId })
    } finally {
      setIsAirdropping(false)
    }
  }

  const handleRequestEthFaucet = async () => {
    if (blockchain !== 'ethereum') {
      toast.error('Faucet is only available for Ethereum wallets')
      return
    }

    try {
      await navigator.clipboard.writeText(publicKey)
    } catch (err) {
      // ignore clipboard errors
    }

    const faucetUrl = `https://sepolia-faucet.pk910.de/#/`
    window.open(faucetUrl, '_blank')
    toast.success('Address copied to clipboard — opened faucet page')
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
        {/* Balance Display - Solana */}
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

        {/* Balance Display - Ethereum */}
        {blockchain === 'ethereum' && (
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Balance</p>
                <p className="text-2xl font-bold">
                  {isLoadingBalance ? (
                    <Loader2 className="h-6 w-6 animate-spin inline" />
                  ) : balance !== null ? (
                    `${balance.toFixed(4)} ETH`
                  ) : (
                    '-- ETH'
                  )}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setIsLoadingBalance(true)
                  fetchEthBalance(true)
                }}
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
              onClick={handleRequestSolAirdrop}
              className="flex-1 cursor-pointer"
              disabled={isAirdropping}
            >
              {isAirdropping ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                  Requesting...
                </>
              ) : (
                'Get SOL from Faucet'
              )}
            </Button>

            <AlertDialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button className="flex-1 cursor-pointer" variant="default">
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
        {
          blockchain === "ethereum" && (
            <div className='flex gap-2'>
              <Button
                className='cursor-pointer flex-1'
                variant="outline"
                onClick={handleRequestEthFaucet}
              >
                Get ETH from Faucet
              </Button>
              <AlertDialog
                open={isTransferDialogOpen}
                onOpenChange={setIsTransferDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    className='flex-1 cursor-pointer'
                    variant="default"
                  >
                    <Send className='size-4 mr-2' />
                    Transfer Eth
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='max-w-md'>
                  <AlertDialogHeader>

                    <AlertDialogTitle>Transfer ETH</AlertDialogTitle>
                    <AlertDialogDescription>
                      Send ETH to another wallet address
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className='space-y-4 py-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>Recipient Adress</label>
                      <Input
                        placeholder="Enter recipient's public key"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        disabled={isTransferring}
                      />
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>Amount (ETH)</label>
                      <div className='flex gap-2'>
                        <Input
                          placeholder='0.0'
                          type="number"
                          step="0.01"
                          min="0"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          disabled={isTransferring}
                        />
                        {
                          balance !== null && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setTransferAmount(Math.max(0, balance - 0.00005).toString())}
                              disabled={isTransferring}
                            >
                              Max
                            </Button>
                          )
                        }
                      </div>
                      {balance !== null && (
                        <p className="text-xs text-muted-foreground">
                          Available: {balance.toFixed(4)} ETH
                        </p>
                      )}
                    </div>

                    {/* Gas Fee Estimation */}
                    {estimatedGasFee !== null && (
                      <div className='bg-blue-50 dark:bg-blue-950 rounded-lg p-3 border border-blue-200 dark:border-blue-800'>
                        <div className='space-y-1'>
                          <p className='text-xs font-medium text-blue-900 dark:text-blue-100'>Estimated Gas Fee</p>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm font-semibold text-blue-900 dark:text-blue-100'>{parseFloat(estimatedGasFee).toFixed(6)} ETH</p>
                            {isEstimatingGas && (
                              <Loader2 className='h-4 w-4 animate-spin text-blue-600 dark:text-blue-400' />
                            )}
                          </div>
                          {transferAmount && estimatedGasFee && (
                            <p className='text-xs text-blue-700 dark:text-blue-300 mt-2'>
                              Total: {(parseFloat(transferAmount) + parseFloat(estimatedGasFee)).toFixed(6)} ETH
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel className='cursor-pointer' disabled={isTransferring}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleTransferEth}
                      disabled={isTransferring}
                      className="bg-primary cursor-pointer"
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
          )
        }
      </CardContent>
    </Card>
  )
}

export default WalletCard