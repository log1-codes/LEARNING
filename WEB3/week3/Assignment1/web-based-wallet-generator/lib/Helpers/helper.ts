const STORAGE_KEY = "demo_wallet"
import { toast } from "sonner"
type WalletData = {
    blockchain: string
    mnemonic: string
}

export const saveWalletToStorage = (data: WalletData): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const loadWalletFromStorage = (): WalletData | null => {
    if (typeof window === "undefined") return null

    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    try {
        return JSON.parse(raw) as WalletData
    } catch {
        return null
    }
}

export const copyToClipboard = (content: string) => {
  navigator.clipboard.writeText(content)
  toast.success(()=>"copied successfully")
}
