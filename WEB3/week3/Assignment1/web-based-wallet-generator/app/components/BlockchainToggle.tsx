'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface BlockchainToggleProps {
    activeChain: 'solana' | 'ethereum'
    onChainChange: (chain: 'solana' | 'ethereum') => void
}

const BlockchainToggle = ({ activeChain, onChainChange }: BlockchainToggleProps) => {
    return (
        <div className="relative flex items-center bg-secondary rounded-full p-1 gap-1">
            {/* Animated Background Slider */}
            <div
                className={cn(
                    "absolute h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-out shadow-md",
                    activeChain === 'solana'
                        ? "left-1 bg-gradient-to-r from-emerald-400 to-teal-500"
                        : "left-[calc(50%+2px)] bg-gradient-to-r from-indigo-500 to-purple-600"
                )}
            />

            {/* Solana Button */}
            <button
                onClick={() => onChainChange('solana')}
                className={cn(
                    "relative z-10 flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300",
                    activeChain === 'solana'
                        ? "text-white drop-shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                )}
            >
                <SolanaIcon className="w-4 h-4" />
                <span>Solana</span>
            </button>

            {/* Ethereum Button */}
            <button
                onClick={() => onChainChange('ethereum')}
                className={cn(
                    "relative z-10 flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300",
                    activeChain === 'ethereum'
                        ? "text-white drop-shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                )}
            >
                <EthereumIcon className="w-4 h-4" />
                <span>Ethereum</span>
            </button>
        </div>
    )
}

const SolanaIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 397 311"
        className={className}
        fill="currentColor"
    >
        <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
        <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
        <path d="M332.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H5.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
    </svg>
)

const EthereumIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 256 417"
        className={className}
        fill="currentColor"
    >
        <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" opacity="0.6" />
        <path d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
        <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" opacity="0.6" />
        <path d="M127.962 416.905v-104.72L0 236.585z" />
        <path d="M127.961 287.958l127.96-75.637-127.96-58.162z" opacity="0.2" />
        <path d="M0 212.32l127.96 75.638v-133.8z" opacity="0.6" />
    </svg>
)

export default BlockchainToggle
