'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
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
import {
    type Account,
    type AppState,
    type Wallet,
    type ChainData,
    loadAppState,
    saveAppState,
    createNewAccount,
    createEmptyChainData,
} from '@/lib/Helpers/helper'

type Blockchain = 'solana' | 'ethereum'

const PATH_TYPES = {
    solana: '501',
    ethereum: '60',
}

const HomePage = () => {
    const [appState, setAppState] = useState<AppState | null>(null)
    const [activeChain, setActiveChain] = useState<Blockchain>('solana')
    const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([])

    useEffect(() => {
        setAppState(loadAppState())
    }, [])

    const currentAccount = useMemo(() => {
        if (!appState) return null
        return appState.accounts.find(a => a.id === appState.activeAccountId) || appState.accounts[0]
    }, [appState])

    const currentChainData = useMemo((): ChainData => {
        if (!currentAccount) return createEmptyChainData()
        return activeChain === 'solana' ? currentAccount.solana : currentAccount.ethereum
    }, [currentAccount, activeChain])

    useEffect(() => {
        setVisiblePrivateKeys(currentChainData.wallets.map(() => false))
    }, [appState?.activeAccountId, activeChain, currentChainData.wallets.length])

    const saveState = useCallback((newState: AppState) => {
        setAppState(newState)
        saveAppState(newState)
    }, [])

    const updateCurrentChainData = useCallback((newChainData: ChainData) => {
        if (!appState || !currentAccount) return

        const updatedAccounts = appState.accounts.map(account => {
            if (account.id !== currentAccount.id) return account
            return {
                ...account,
                [activeChain]: newChainData,
            }
        })

        saveState({
            ...appState,
            accounts: updatedAccounts,
        })
    }, [appState, currentAccount, activeChain, saveState])

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

    const handleGenerateWallet = useCallback(() => {
        const mnemonic = generateMnemonic()
        const words = mnemonic.split(' ')
        const wallet = generateWalletFromMnemonic(activeChain, mnemonic, 0)

        if (wallet) {
            updateCurrentChainData({
                mnemonic: words,
                wallets: [wallet],
            })
            toast.success('Wallet generated successfully!')
        } else {
            toast.error('Failed to generate wallet. Please try again.')
        }
    }, [activeChain, generateWalletFromMnemonic, updateCurrentChainData])

    const handleImportWallet = useCallback((mnemonicPhrase: string) => {
        if (!validateMnemonic(mnemonicPhrase)) {
            toast.error('Invalid recovery phrase. Please check and try again.')
            return
        }

        const words = mnemonicPhrase.split(' ')
        const wallet = generateWalletFromMnemonic(activeChain, mnemonicPhrase, 0)

        if (wallet) {
            updateCurrentChainData({
                mnemonic: words,
                wallets: [wallet],
            })
            toast.success('Wallet imported successfully!')
        } else {
            toast.error('Failed to import wallet. Please try again.')
        }
    }, [activeChain, generateWalletFromMnemonic, updateCurrentChainData])

    const handleAddWallet = useCallback(() => {
        if (currentChainData.mnemonic.length === 0) {
            toast.error('No recovery phrase found. Please generate a wallet first.')
            return
        }

        const mnemonic = currentChainData.mnemonic.join(' ')
        const newIndex = currentChainData.wallets.length
        const wallet = generateWalletFromMnemonic(activeChain, mnemonic, newIndex)

        if (wallet) {
            updateCurrentChainData({
                mnemonic: currentChainData.mnemonic,
                wallets: [...currentChainData.wallets, wallet],
            })
            toast.success(`Wallet ${newIndex + 1} added successfully!`)
        } else {
            toast.error('Failed to add wallet. Please try again.')
        }
    }, [activeChain, currentChainData, generateWalletFromMnemonic, updateCurrentChainData])

    const handleDeleteWallet = useCallback((index: number) => {
        const updatedWallets = currentChainData.wallets.filter((_, i) => i !== index)

        updateCurrentChainData({
            mnemonic: updatedWallets.length > 0 ? currentChainData.mnemonic : [],
            wallets: updatedWallets,
        })
        setVisiblePrivateKeys(prev => prev.filter((_, i) => i !== index))
        toast.success('Wallet deleted successfully!')
    }, [currentChainData, updateCurrentChainData])

    const handleClearWallets = useCallback(() => {
        updateCurrentChainData(createEmptyChainData())
        setVisiblePrivateKeys([])
        toast.success('All wallets cleared!')
    }, [updateCurrentChainData])

    const handleCopy = useCallback((content: string, label?: string) => {
        navigator.clipboard.writeText(content)
        toast.success(label ? `${label} copied!` : 'Copied to clipboard!')
    }, [])

    const handleTogglePrivateKey = useCallback((index: number) => {
        setVisiblePrivateKeys(prev =>
            prev.map((visible, i) => (i === index ? !visible : visible))
        )
    }, [])

    const handleSwitchAccount = useCallback((accountId: string) => {
        if (!appState) return
        saveState({
            ...appState,
            activeAccountId: accountId,
        })
        toast.success('Switched account!')
    }, [appState, saveState])

    const handleCreateAccount = useCallback((name: string) => {
        if (!appState) return
        const newAccount = createNewAccount(name)
        saveState({
            ...appState,
            activeAccountId: newAccount.id,
            accounts: [...appState.accounts, newAccount],
        })
        toast.success(`Account "${name}" created!`)
    }, [appState, saveState])

    const handleRenameAccount = useCallback((accountId: string, newName: string) => {
        if (!appState) return
        const updatedAccounts = appState.accounts.map(account =>
            account.id === accountId ? { ...account, name: newName } : account
        )
        saveState({
            ...appState,
            accounts: updatedAccounts,
        })
        toast.success('Account renamed!')
    }, [appState, saveState])

    const handleDeleteAccount = useCallback((accountId: string) => {
        if (!appState || appState.accounts.length <= 1) {
            toast.error('Cannot delete the only account.')
            return
        }

        const updatedAccounts = appState.accounts.filter(a => a.id !== accountId)
        const newActiveId = accountId === appState.activeAccountId
            ? updatedAccounts[0].id
            : appState.activeAccountId

        saveState({
            activeAccountId: newActiveId,
            accounts: updatedAccounts,
        })
        toast.success('Account deleted!')
    }, [appState, saveState])

    if (!appState) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header
                activeChain={activeChain}
                onChainChange={setActiveChain}
                onClearWallets={handleClearWallets}
                hasWallets={currentChainData.wallets.length > 0}
                accounts={appState.accounts}
                activeAccountId={appState.activeAccountId}
                onSwitchAccount={handleSwitchAccount}
                onCreateAccount={handleCreateAccount}
                onRenameAccount={handleRenameAccount}
                onDeleteAccount={handleDeleteAccount}
            />

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-6 flex-1 w-full">
                {/* Mnemonic Section */}
                <MnemonicSection
                    mnemonicWords={currentChainData.mnemonic}
                    blockchain={activeChain}
                    onCopy={(content) => handleCopy(content, 'Recovery phrase')}
                />

                {/* Wallet Actions */}
                <WalletActions
                    blockchain={activeChain}
                    hasWallets={currentChainData.wallets.length > 0}
                    hasMnemonic={currentChainData.mnemonic.length > 0}
                    onGenerateWallet={handleGenerateWallet}
                    onImportWallet={handleImportWallet}
                    onAddWallet={handleAddWallet}
                />

                {/* Wallet List */}
                <WalletList
                    wallets={currentChainData.wallets}
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
