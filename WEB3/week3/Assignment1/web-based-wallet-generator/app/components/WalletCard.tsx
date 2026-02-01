'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
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
    const truncateAddress = (address: string, chars = 8) => {
        if (address.length <= chars * 2) return address
        return `${address.slice(0, chars)}...${address.slice(-chars)}`
    }

    return (
        <Card
            className={cn(
                "card-hover overflow-hidden",
                blockchain === 'solana' ? "border-solana-accent" : "border-ethereum-accent"
            )}
        >
            <CardContent className="p-0">
                {/* Header */}
                <div className={cn(
                    "px-4 py-3 flex items-center justify-between",
                    blockchain === 'solana' ? "bg-emerald-50" : "bg-indigo-50"
                )}>
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
                            blockchain === 'solana'
                                ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                                : "bg-gradient-to-r from-indigo-500 to-purple-600"
                        )}>
                            {index + 1}
                        </div>
                        <span className="font-semibold text-sm">
                            Wallet {index + 1}
                        </span>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Wallet {index + 1}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will remove this wallet from your browser storage.
                                    Make sure you have backed up the private key if needed.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={onDelete}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Public Key */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Public Address
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                            <code className="address-truncate flex-1 break-all text-foreground">
                                {publicKey}
                            </code>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => onCopy(publicKey, 'Public address')}
                                className="shrink-0"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    {/* Private Key */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Private Key
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                            <code className="address-truncate flex-1 break-all text-foreground">
                                {showPrivateKey ? privateKey : '•'.repeat(Math.min(privateKey.length, 48))}
                            </code>
                            <div className="flex items-center gap-1 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={onTogglePrivateKey}
                                >
                                    {showPrivateKey ? (
                                        <EyeOff className="w-3.5 h-3.5" />
                                    ) : (
                                        <Eye className="w-3.5 h-3.5" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => onCopy(privateKey, 'Private key')}
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default WalletCard
