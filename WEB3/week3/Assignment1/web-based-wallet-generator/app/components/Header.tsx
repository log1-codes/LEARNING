'use client'

import React from 'react'
import BlockchainToggle from './BlockchainToggle'
import { Button } from '@/components/ui/button'
import { Trash2, Wallet } from 'lucide-react'
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

interface HeaderProps {
    activeChain: 'solana' | 'ethereum'
    onChainChange: (chain: 'solana' | 'ethereum') => void
    onClearWallets: () => void
    hasWallets: boolean
}

const Header = ({ activeChain, onChainChange, onClearWallets, hasWallets }: HeaderProps) => {
    return (
        <header className="w-full border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                        <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">Web3 Wallet</h1>
                        <p className="text-xs text-muted-foreground">Generate & manage your wallets</p>
                    </div>
                </div>

                {/* Blockchain Toggle */}
                <BlockchainToggle
                    activeChain={activeChain}
                    onChainChange={onChainChange}
                />

                {/* Clear All Action */}
                <div className="flex items-center gap-2">
                    {hasWallets && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Clear All
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Clear All Wallets?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete all your {activeChain === 'solana' ? 'Solana' : 'Ethereum'} wallets
                                        and secret phrases from this browser. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={onClearWallets}
                                        className="bg-destructive text-white hover:bg-destructive/90"
                                    >
                                        Yes, Clear All
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
