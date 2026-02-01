'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Download, Plus, Sparkles, AlertCircle } from 'lucide-react'

interface WalletActionsProps {
    blockchain: 'solana' | 'ethereum'
    hasWallets: boolean
    hasMnemonic: boolean
    onGenerateWallet: () => void
    onImportWallet: (mnemonic: string) => void
    onAddWallet: () => void
}

const WalletActions = ({
    blockchain,
    hasWallets,
    hasMnemonic,
    onGenerateWallet,
    onImportWallet,
    onAddWallet,
}: WalletActionsProps) => {
    const [importDialogOpen, setImportDialogOpen] = useState(false)
    const [mnemonicInput, setMnemonicInput] = useState('')
    const [error, setError] = useState('')

    const handleImport = () => {
        const words = mnemonicInput.trim().split(/\s+/)
        if (words.length !== 12 && words.length !== 24) {
            setError('Please enter a valid 12 or 24 word recovery phrase')
            return
        }
        onImportWallet(mnemonicInput.trim())
        setMnemonicInput('')
        setError('')
        setImportDialogOpen(false)
    }

    const buttonGradient = blockchain === 'solana'
        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600'
        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Generate New Wallet - Show when no mnemonic exists */}
            {!hasMnemonic && (
                <Button
                    onClick={onGenerateWallet}
                    className={cn("text-white gap-2 shadow-md", buttonGradient)}
                >
                    <Sparkles className="w-4 h-4" />
                    Generate New Wallet
                </Button>
            )}

            {/* Add Another Wallet - Show when mnemonic exists */}
            {hasMnemonic && (
                <Button
                    onClick={onAddWallet}
                    className={cn("text-white gap-2 shadow-md", buttonGradient)}
                >
                    <Plus className="w-4 h-4" />
                    Add Wallet
                </Button>
            )}

            {/* Import Wallet - Always visible */}
            <Button
                variant="outline"
                onClick={() => setImportDialogOpen(true)}
                className="gap-2"
            >
                <Download className="w-4 h-4" />
                Import Wallet
            </Button>

            {/* Import Dialog */}
            <AlertDialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Import Wallet</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter your 12 or 24 word secret recovery phrase to import an existing {blockchain === 'solana' ? 'Solana' : 'Ethereum'} wallet.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="py-4 space-y-3">
                        <textarea
                            value={mnemonicInput}
                            onChange={(e) => {
                                setMnemonicInput(e.target.value)
                                setError('')
                            }}
                            placeholder="Enter your secret recovery phrase (12 or 24 words separated by spaces)"
                            className="w-full min-h-[120px] p-3 rounded-lg border border-input bg-secondary/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        />

                        {error && (
                            <div className="flex items-center gap-2 text-destructive text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                            This will replace any existing wallet data for {blockchain === 'solana' ? 'Solana' : 'Ethereum'} in this browser.
                        </p>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setMnemonicInput('')
                            setError('')
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleImport}
                            className={cn("text-white shadow-md", buttonGradient)}
                        >
                            Import Wallet
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default WalletActions
