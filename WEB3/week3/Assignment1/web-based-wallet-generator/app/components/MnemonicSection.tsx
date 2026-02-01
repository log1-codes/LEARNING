'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MnemonicSectionProps {
    mnemonicWords: string[]
    blockchain: 'solana' | 'ethereum'
    onCopy: (content: string) => void
}

const MnemonicSection = ({ mnemonicWords, blockchain, onCopy }: MnemonicSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    if (!mnemonicWords || mnemonicWords.length === 0 || mnemonicWords.every(w => !w.trim())) {
        return null
    }

    return (
        <Card className={cn(
            "overflow-hidden transition-all duration-300",
            blockchain === 'solana' ? "border-solana-accent" : "border-ethereum-accent"
        )}>
            <CardContent className="p-0">
                <div className="w-full px-5 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                    <div
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className={cn(
                            "p-2 rounded-lg",
                            blockchain === 'solana' ? "bg-emerald-50" : "bg-indigo-50"
                        )}>
                            <AlertTriangle className={cn(
                                "w-4 h-4",
                                blockchain === 'solana' ? "text-emerald-600" : "text-indigo-600"
                            )} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-semibold">Secret Recovery Phrase</h3>
                            <p className="text-xs text-muted-foreground">
                                Click to {isExpanded ? 'hide' : 'reveal'} your 12-word phrase
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isExpanded && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onCopy(mnemonicWords.join(' '))}
                                className="text-muted-foreground"
                            >
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                            </Button>
                        )}
                        <div
                            className="p-1 cursor-pointer"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                        </div>
                    </div>
                </div>

                <div className={cn(
                    "grid transition-all duration-300 overflow-hidden",
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}>
                    <div className="overflow-hidden">
                        <div className="mx-4 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-xs text-amber-800">
                                <strong>Warning:</strong> Never share your secret phrase. Anyone with these words can access your funds.
                            </p>
                        </div>

                        <div
                            className="mx-4 mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 cursor-pointer"
                            onClick={() => onCopy(mnemonicWords.join(' '))}
                        >
                            {mnemonicWords.map((word, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex items-center gap-2 p-3 rounded-lg transition-colors",
                                        blockchain === 'solana'
                                            ? "bg-emerald-50 hover:bg-emerald-100"
                                            : "bg-indigo-50 hover:bg-indigo-100"
                                    )}
                                >
                                    <span className="text-xs text-muted-foreground font-mono w-5">
                                        {index + 1}.
                                    </span>
                                    <span className="font-medium text-sm">{word}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mx-4 mb-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <Copy className="w-3 h-3" />
                            <span>Click anywhere on the grid to copy all words</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MnemonicSection
