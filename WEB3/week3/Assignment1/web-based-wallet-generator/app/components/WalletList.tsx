'use client'

import React from 'react'
import WalletCard from './WalletCard'
import { Grid2X2, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Wallet {
    publicKey: string
    privateKey: string
    mnemonic: string
    path: string
}

interface WalletListProps {
    wallets: Wallet[]
    blockchain: 'solana' | 'ethereum'
    visiblePrivateKeys: boolean[]
    onTogglePrivateKey: (index: number) => void
    onCopy: (content: string, label: string) => void
    onDeleteWallet: (index: number) => void
}

const WalletList = ({
    wallets,
    blockchain,
    visiblePrivateKeys,
    onTogglePrivateKey,
    onCopy,
    onDeleteWallet,
}: WalletListProps) => {
    const [gridView, setGridView] = React.useState(false)

    if (wallets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center mb-6",
                    blockchain === 'solana' ? "bg-emerald-50" : "bg-indigo-50"
                )}>
                    <div className={cn(
                        "w-12 h-12 rounded-xl opacity-20",
                        blockchain === 'solana'
                            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                            : "bg-gradient-to-r from-indigo-500 to-purple-600"
                    )} />
                </div>
                <h3 className="text-lg font-semibold mb-2">No {blockchain === 'solana' ? 'Solana' : 'Ethereum'} Wallets</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Generate a new wallet or import an existing one using your secret recovery phrase.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Header with View Toggle */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Your {blockchain === 'solana' ? 'Solana' : 'Ethereum'} Wallets
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({wallets.length})
                    </span>
                </h2>
                <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                    <Button
                        variant={!gridView ? "secondary" : "ghost"}
                        size="icon-sm"
                        onClick={() => setGridView(false)}
                        className={!gridView ? "bg-card shadow-sm" : ""}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={gridView ? "secondary" : "ghost"}
                        size="icon-sm"
                        onClick={() => setGridView(true)}
                        className={gridView ? "bg-card shadow-sm" : ""}
                    >
                        <Grid2X2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Wallet Cards */}
            <div className={cn(
                "gap-4",
                gridView
                    ? "grid grid-cols-1 md:grid-cols-2"
                    : "flex flex-col"
            )}>
                {wallets.map((wallet, index) => (
                    <WalletCard
                        key={`${wallet.publicKey}-${index}`}
                        index={index}
                        publicKey={wallet.publicKey}
                        privateKey={wallet.privateKey}
                        blockchain={blockchain}
                        showPrivateKey={visiblePrivateKeys[index] || false}
                        onTogglePrivateKey={() => onTogglePrivateKey(index)}
                        onCopy={onCopy}
                        onDelete={() => onDeleteWallet(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default WalletList
