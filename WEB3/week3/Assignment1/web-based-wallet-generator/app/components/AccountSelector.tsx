'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    ChevronDown,
    Check,
    Plus,
    Pencil,
    Trash2,
    User
} from 'lucide-react'
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
import type { Account } from '@/lib/Helpers/helper'

interface AccountSelectorProps {
    accounts: Account[]
    activeAccountId: string
    onSwitchAccount: (accountId: string) => void
    onCreateAccount: (name: string) => void
    onRenameAccount: (accountId: string, newName: string) => void
    onDeleteAccount: (accountId: string) => void
}

const AccountSelector = ({
    accounts,
    activeAccountId,
    onSwitchAccount,
    onCreateAccount,
    onRenameAccount,
    onDeleteAccount,
}: AccountSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showRenameDialog, setShowRenameDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [newAccountName, setNewAccountName] = useState('')
    const [editingAccountId, setEditingAccountId] = useState<string | null>(null)
    const [renameValue, setRenameValue] = useState('')

    const activeAccount = accounts.find(a => a.id === activeAccountId)

    const handleCreateAccount = () => {
        const name = newAccountName.trim() || `Account ${accounts.length + 1}`
        onCreateAccount(name)
        setNewAccountName('')
        setShowCreateDialog(false)
        setIsOpen(false)
    }

    const handleRenameAccount = () => {
        if (editingAccountId && renameValue.trim()) {
            onRenameAccount(editingAccountId, renameValue.trim())
            setEditingAccountId(null)
            setRenameValue('')
            setShowRenameDialog(false)
        }
    }

    const handleDeleteAccount = () => {
        if (editingAccountId) {
            onDeleteAccount(editingAccountId)
            setEditingAccountId(null)
            setShowDeleteDialog(false)
            setIsOpen(false)
        }
    }

    const openRenameDialog = (account: Account, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingAccountId(account.id)
        setRenameValue(account.name)
        setShowRenameDialog(true)
    }

    const openDeleteDialog = (accountId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingAccountId(accountId)
        setShowDeleteDialog(true)
    }

    return (
        <div className="relative">
            {/* Trigger Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="gap-2 min-w-[140px] justify-between"
            >
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate max-w-[100px]">{activeAccount?.name || 'Account'}</span>
                </div>
                <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    isOpen && "rotate-180"
                )} />
            </Button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Content */}
                    <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                        {/* Account List */}
                        <div className="max-h-[240px] overflow-y-auto">
                            {accounts.map((account) => (
                                <div
                                    key={account.id}
                                    onClick={() => {
                                        onSwitchAccount(account.id)
                                        setIsOpen(false)
                                    }}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors",
                                        account.id === activeAccountId
                                            ? "bg-primary/5"
                                            : "hover:bg-secondary/50"
                                    )}
                                >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {account.id === activeAccountId ? (
                                            <Check className="w-4 h-4 text-primary shrink-0" />
                                        ) : (
                                            <div className="w-4 h-4 shrink-0" />
                                        )}
                                        <span className="text-sm font-medium truncate">{account.name}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={(e) => openRenameDialog(account, e)}
                                            className="p-1 rounded hover:bg-secondary transition-colors"
                                        >
                                            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                                        </button>
                                        {accounts.length > 1 && (
                                            <button
                                                onClick={(e) => openDeleteDialog(account.id, e)}
                                                className="p-1 rounded hover:bg-destructive/10 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border" />

                        {/* Create Account Button */}
                        <button
                            onClick={() => setShowCreateDialog(true)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-primary hover:bg-secondary/50 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create New Account
                        </button>
                    </div>
                </>
            )}

            {/* Create Account Dialog */}
            <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Create New Account</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter a name for your new account. Each account has its own recovery phrase and wallets.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Input
                            value={newAccountName}
                            onChange={(e) => setNewAccountName(e.target.value)}
                            placeholder={`Account ${accounts.length + 1}`}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount()}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setNewAccountName('')}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCreateAccount}>
                            Create Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Rename Account Dialog */}
            <AlertDialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Rename Account</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter a new name for this account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Input
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            placeholder="Account name"
                            onKeyDown={(e) => e.key === 'Enter' && handleRenameAccount()}
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRenameAccount}>
                            Save
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Account Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this account and all its wallets.
                            Make sure you have backed up your recovery phrases.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            Delete Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default AccountSelector
