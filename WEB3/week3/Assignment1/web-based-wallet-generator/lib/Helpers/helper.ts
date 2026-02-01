import { toast } from "sonner"

// Storage key for multi-account data
const STORAGE_KEY = "wallet_generator_data"

// Types
export interface Wallet {
    publicKey: string
    privateKey: string
    mnemonic: string
    path: string
}

export interface ChainData {
    mnemonic: string[]
    wallets: Wallet[]
}

export interface Account {
    id: string
    name: string
    createdAt: number
    solana: ChainData
    ethereum: ChainData
}

export interface AppState {
    activeAccountId: string
    accounts: Account[]
}

// Generate unique account ID
export const generateAccountId = (): string => {
    return `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Create empty chain data
export const createEmptyChainData = (): ChainData => ({
    mnemonic: [],
    wallets: []
})

// Create new account
export const createNewAccount = (name: string): Account => ({
    id: generateAccountId(),
    name,
    createdAt: Date.now(),
    solana: createEmptyChainData(),
    ethereum: createEmptyChainData()
})

// Get default app state
export const getDefaultAppState = (): AppState => {
    const defaultAccount = createNewAccount("Account 1")
    return {
        activeAccountId: defaultAccount.id,
        accounts: [defaultAccount]
    }
}

// Load app state from storage
export const loadAppState = (): AppState => {
    if (typeof window === "undefined") return getDefaultAppState()

    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
        // Check for legacy data and migrate
        const legacyData = migrateLegacyData()
        if (legacyData) {
            saveAppState(legacyData)
            return legacyData
        }
        return getDefaultAppState()
    }

    try {
        return JSON.parse(raw) as AppState
    } catch {
        return getDefaultAppState()
    }
}

// Save app state to storage
export const saveAppState = (state: AppState): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// Migrate legacy single-account data to new format
const migrateLegacyData = (): AppState | null => {
    const solanaData = localStorage.getItem("solana_wallet_data")
    const ethereumData = localStorage.getItem("ethereum_wallet_data")

    if (!solanaData && !ethereumData) return null

    const account = createNewAccount("Account 1")

    if (solanaData) {
        try {
            account.solana = JSON.parse(solanaData)
        } catch { /* ignore */ }
    }

    if (ethereumData) {
        try {
            account.ethereum = JSON.parse(ethereumData)
        } catch { /* ignore */ }
    }

    // Clean up legacy keys
    localStorage.removeItem("solana_wallet_data")
    localStorage.removeItem("ethereum_wallet_data")

    return {
        activeAccountId: account.id,
        accounts: [account]
    }
}

// Copy to clipboard utility
export const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Copied to clipboard!")
}
