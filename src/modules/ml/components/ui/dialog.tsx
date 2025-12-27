import * as React from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "./button"

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                        onClick={() => onOpenChange(false)}
                    />
                    {/* Content */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg pointer-events-auto"
                        >
                            {children}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export function DialogContent({ className, children, onClose }: { className?: string, children: React.ReactNode, onClose?: () => void }) {
    return (
        <div className={cn("relative rounded-xl border border-glass-border bg-glass-surface backdrop-blur-xl shadow-2xl p-6", className)}>
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
            {children}
        </div>
    )
}

export function DialogHeader({ className, children }: { className?: string, children: React.ReactNode }) {
    return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-6", className)}>{children}</div>
}

export function DialogTitle({ className, children }: { className?: string, children: React.ReactNode }) {
    return <h2 className={cn("text-lg font-semibold leading-none tracking-tight text-white", className)}>{children}</h2>
}

export function DialogDescription({ className, children }: { className?: string, children: React.ReactNode }) {
    return <p className={cn("text-sm text-slate-400 mt-2", className)}>{children}</p>
}

export function DialogFooter({ className, children }: { className?: string, children: React.ReactNode }) {
    return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)}>{children}</div>
}
