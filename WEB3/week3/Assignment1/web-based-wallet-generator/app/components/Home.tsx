'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39'
import { derivePath } from 'ed25519-hd-key'
import nacl from 'tweetnacl'
import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'
import { ethers } from 'ethers'
import { toast } from 'sonner'

import Header from './Header'
import Footer from './Footer'
import MnemonicSection from './MnemonicSection'
import WalletActions from './WalletActions'
import WalletList from './WalletList'

// Types
interface Wallet {
    publicKey: string
    privateKey: string
    mnemonic: string
    path: string
}

interface ChainData {
    mnemonic: string[]
    wallets: Wallet[]
}

type Blockchain = 'solana' | 'ethereum'

// Storage keys
const STORAGE_KEYS = {
    solana: 'solana_wallet_data',
    ethereum: 'ethereum_wallet_data',
}

// Path types for derivation
const PATH_TYPES = {
    solana: '501',
    ethereum: '60',
}

const HomePage = () => {
    const [activeChain, setActiveChain] = useState<Blockchain>('solana')

    // Separate state for each blockchain
    const [solanaData, setSolanaData] = useState<ChainData>({ mnemonic: [], wallets: [] })
    const [ethereumData, setEthereumData] = useState<ChainData>({ mnemonic: [], wallets: [] })

    // UI state
    const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([])

    // Get current chain data
    const currentData = activeChain === 'solana' ? solanaData : ethereumData
    const setCurrentData = activeChain === 'solana' ? setSolanaData : setEthereumData

    // Load data from localStorage on mount
    useEffect(() => {
        const loadChainData = (chain: Blockchain): ChainData => {
            if (typeof window === 'undefined') return { mnemonic: [], wallets: [] }

            const stored = localStorage.getItem(STORAGE_KEYS[chain])
            if (!stored) return { mnemonic: [], wallets: [] }

            try {
                return JSON.parse(stored) as ChainData
            } catch {
                return { mnemonic: [], wallets: [] }
            }
        }

        setSolanaData(loadChainData('solana'))
        setEthereumData(loadChainData('ethereum'))
    }, [])

    // Update visible private keys when switching chains or wallets change
    useEffect(() => {
        setVisiblePrivateKeys(currentData.wallets.map(() => false))
    }, [activeChain, currentData.wallets.length])

    // Save data to localStorage
    const saveChainData = useCallback((chain: Blockchain, data: ChainData) => {
        localStorage.setItem(STORAGE_KEYS[chain], JSON.stringify(data))
    }, [])

    // Generate wallet from mnemonic
    const generateWalletFromMnemonic = useCallback((
        chain: Blockchain,
        mnemonic: string,
        accountIndex: number
    ): Wallet | null => {
        try {
            const seedBuffer = mnemonicToSeedSync(mnemonic)
            const pathType = PATH_TYPES[chain]
            const path = `m/44'/${pathType}'/0'/${accountIndex}'`
            const { key: derivedSeed } = derivePath(path, seedBuffer.toString('hex'))

            let privateKeyEncoded: string
            let publicKeyEncoded: string

            if (chain === 'solana') {
                const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed)
                const keypair = Keypair.fromSecretKey(secretKey)
                privateKeyEncoded = bs58.encode(secretKey)
                publicKeyEncoded = keypair.publicKey.toBase58()
            } else {
                const privateKey = Buffer.from(derivedSeed).toString('hex')
                privateKeyEncoded = privateKey
                const wallet = new ethers.Wallet(privateKey)
                publicKeyEncoded = wallet.address
            }

            return {
                publicKey: publicKeyEncoded,
                privateKey: privateKeyEncoded,
                mnemonic,
                path,
            }
        } catch (error) {
            console.error('Failed to generate wallet:', error)
            return null
        }
    }, [])

    // Handle generate new wallet (creates new mnemonic)
    const handleGenerateWallet = useCallback(() => {
        const mnemonic = generateMnemonic()
        const words = mnemonic.split(' ')

        const wallet = generateWalletFromMnemonic(activeChain, mnemonic, 0)

        if (wallet) {
            const newData: ChainData = {
                mnemonic: words,
                wallets: [wallet],
            }

            if (activeChain === 'solana') {
                setSolanaData(newData)
            } else {
                setEthereumData(newData)
            }

            saveChainData(activeChain, newData)
            toast.success('Wallet generated successfully!')
        } else {
            toast.error('Failed to generate wallet. Please try again.')
        }
    }, [activeChain, generateWalletFromMnemonic, saveChainData])

    // Handle import wallet with existing mnemonic
    const handleImportWallet = useCallback((mnemonicPhrase: string) => {
        if (!validateMnemonic(mnemonicPhrase)) {
            toast.error('Invalid recovery phrase. Please check and try again.')
            return
        }

        const words = mnemonicPhrase.split(' ')
        const wallet = generateWalletFromMnemonic(activeChain, mnemonicPhrase, 0)

        if (wallet) {
            const newData: ChainData = {
                mnemonic: words,
                wallets: [wallet],
            }

            if (activeChain === 'solana') {
                setSolanaData(newData)
            } else {
                setEthereumData(newData)
            }

            saveChainData(activeChain, newData)
            toast.success('Wallet imported successfully!')
        } else {
            toast.error('Failed to import wallet. Please try again.')
        }
    }, [activeChain, generateWalletFromMnemonic, saveChainData])

    // Handle add another wallet from existing mnemonic
    const handleAddWallet = useCallback(() => {
        if (currentData.mnemonic.length === 0) {
            toast.error('No recovery phrase found. Please generate a wallet first.')
            return
        }

        const mnemonic = currentData.mnemonic.join(' ')
        const newIndex = currentData.wallets.length
        const wallet = generateWalletFromMnemonic(activeChain, mnemonic, newIndex)

        if (wallet) {
            const newData: ChainData = {
                mnemonic: currentData.mnemonic,
                wallets: [...currentData.wallets, wallet],
            }

            if (activeChain === 'solana') {
                setSolanaData(newData)
            } else {
                setEthereumData(newData)
            }

            saveChainData(activeChain, newData)
            toast.success(`Wallet ${newIndex + 1} added successfully!`)
        } else {
            toast.error('Failed to add wallet. Please try again.')
        }
    }, [activeChain, currentData, generateWalletFromMnemonic, saveChainData])

    // Handle delete wallet
    const handleDeleteWallet = useCallback((index: number) => {
        const updatedWallets = currentData.wallets.filter((_, i) => i !== index)

        const newData: ChainData = {
            mnemonic: updatedWallets.length > 0 ? currentData.mnemonic : [],
            wallets: updatedWallets,
        }

        if (activeChain === 'solana') {
            setSolanaData(newData)
        } else {
            setEthereumData(newData)
        }

        saveChainData(activeChain, newData)
        setVisiblePrivateKeys(prev => prev.filter((_, i) => i !== index))
        toast.success('Wallet deleted successfully!')
    }, [activeChain, currentData, saveChainData])

    // Handle clear all wallets
    const handleClearWallets = useCallback(() => {
        const emptyData: ChainData = { mnemonic: [], wallets: [] }

        if (activeChain === 'solana') {
            setSolanaData(emptyData)
        } else {
            setEthereumData(emptyData)
        }

        localStorage.removeItem(STORAGE_KEYS[activeChain])
        setVisiblePrivateKeys([])
        toast.success('All wallets cleared!')
    }, [activeChain])

    // Handle copy to clipboard
    const handleCopy = useCallback((content: string, label?: string) => {
        navigator.clipboard.writeText(content)
        toast.success(label ? `${label} copied!` : 'Copied to clipboard!')
    }, [])

    // Handle toggle private key visibility
    const handleTogglePrivateKey = useCallback((index: number) => {
        setVisiblePrivateKeys(prev =>
            prev.map((visible, i) => (i === index ? !visible : visible))
        )
    }, [])

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header
                activeChain={activeChain}
                onChainChange={setActiveChain}
                onClearWallets={handleClearWallets}
                hasWallets={currentData.wallets.length > 0}
            />

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-6 flex-1">
                {/* Mnemonic Section */}
                <MnemonicSection
                    mnemonicWords={currentData.mnemonic}
                    blockchain={activeChain}
                    onCopy={(content) => handleCopy(content, 'Recovery phrase')}
                />

                {/* Wallet Actions */}
                <WalletActions
                    blockchain={activeChain}
                    hasWallets={currentData.wallets.length > 0}
                    hasMnemonic={currentData.mnemonic.length > 0}
                    onGenerateWallet={handleGenerateWallet}
                    onImportWallet={handleImportWallet}
                    onAddWallet={handleAddWallet}
                />

                {/* Wallet List */}
                <WalletList
                    wallets={currentData.wallets}
                    blockchain={activeChain}
                    visiblePrivateKeys={visiblePrivateKeys}
                    onTogglePrivateKey={handleTogglePrivateKey}
                    onCopy={handleCopy}
                    onDeleteWallet={handleDeleteWallet}
                />
            </main>

            <Footer />
        </div>
    )
}

export default HomePage
