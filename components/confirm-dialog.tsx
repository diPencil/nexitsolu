"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Trash2, X } from "lucide-react"

interface ConfirmDialogProps {
    isOpen: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    danger?: boolean
    icon?: React.ReactNode
    onConfirm: () => void
    onCancel: () => void
}

export function ConfirmDialog({
    isOpen,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    danger = true,
    icon,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onCancel}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="relative w-full max-w-sm bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Glow */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 blur-[60px] pointer-events-none ${danger ? 'bg-red-500/20' : 'bg-[#0066FF]/20'}`} />

                        {/* Close X */}
                        <button
                            onClick={onCancel}
                            className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-600 hover:text-white hover:bg-white/5 transition-all z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="p-6 pt-8 text-center relative z-20">
                            {/* Icon */}
                            <div className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center ${danger ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#0066FF]/10 border border-[#0066FF]/20'}`}>
                                {icon || (danger
                                    ? <Trash2 className="w-7 h-7 text-red-400" />
                                    : <AlertTriangle className="w-7 h-7 text-[#0066FF]" />
                                )}
                            </div>

                            {/* Title */}
                            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>

                            {/* Message */}
                            <p className="text-sm text-zinc-400 leading-relaxed mb-8">{message}</p>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={onCancel}
                                    className="h-12 rounded-2xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all font-bold text-sm"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => { onConfirm(); }}
                                    className={`h-12 rounded-2xl font-bold text-sm text-white transition-all ${danger
                                        ? 'bg-red-500 hover:bg-red-400 shadow-[0_0_25px_rgba(239,68,68,0.3)] hover:shadow-[0_0_35px_rgba(239,68,68,0.4)]'
                                        : 'bg-[#0066FF] hover:bg-blue-500 shadow-[0_0_25px_rgba(0,102,255,0.3)]'
                                    }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
