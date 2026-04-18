"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus, Search, Edit, Trash2, Truck,
    X, Loader2, Phone, Mail, MapPin,
    User, Briefcase
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"

export default function SuppliersPage() {
    const { lang } = useLanguage()
    const [suppliers, setSuppliers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null })

    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        email: "",
        phone: "",
        address: ""
    })

    const fetchSuppliers = async () => {
        try {
            const res = await fetch("/api/admin/suppliers")
            if (res.ok) {
                setSuppliers(await res.json())
            }
        } catch (error) {
            toast.error("Failed to load suppliers")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSuppliers()
    }, [])

    useEffect(() => {
        if (editingSupplier) {
            setFormData({
                name: editingSupplier.name || "",
                contact: editingSupplier.contact || "",
                email: editingSupplier.email || "",
                phone: editingSupplier.phone || "",
                address: editingSupplier.address || ""
            })
        } else {
            setFormData({ name: "", contact: "", email: "", phone: "", address: "" })
        }
    }, [editingSupplier])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const method = editingSupplier ? "PUT" : "POST"
            const res = await fetch("/api/admin/suppliers", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingSupplier ? { id: editingSupplier.id, ...formData } : formData)
            })

            if (res.ok) {
                toast.success(editingSupplier ? "Supplier updated" : "Supplier added")
                setIsModalOpen(false)
                setEditingSupplier(null)
                fetchSuppliers()
            }
        } catch (error) {
            toast.error("Error saving supplier")
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/suppliers?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Deleted")
                fetchSuppliers()
            }
        } catch (error) {
            toast.error("Error deleting")
        } finally {
            setConfirmDelete({ isOpen: false, id: null })
        }
    }

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.phone && s.phone.includes(searchTerm))
    )

    return (
        <div className="space-y-8 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? '????????' : 'Suppliers Management'}</h1>
                    <p className="text-muted-foreground">{lang === 'ar' ? '????? ????? ???????? ???????? ???????.' : 'Manage your list of suppliers and partners.'}</p>
                </div>
                <Button
                    onClick={() => { setEditingSupplier(null); setIsModalOpen(true); }}
                    className="bg-[#0066FF] hover:bg-blue-600 text-primary-foreground border-none rounded-2xl h-12 px-6 flex items-center gap-2 group font-black shadow-lg shadow-blue-500/20 transition-all font-inter"
                >
                    <Plus className="w-5 h-5 text-primary-foreground transition-transform group-hover:rotate-90" />
                    {lang === 'ar' ? '????? ????' : 'Add Supplier'}
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-secondary border border-border flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
                        <Truck className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-black">{suppliers.length}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? '?????? ????????' : 'Total Suppliers'}</p>
                    </div>
                </div>
            </div>

            {/* Table/List */}
            <div className="bg-secondary border border-border rounded-3xl overflow-hidden shadow-none w-full">
                <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={lang === 'ar' ? "???? ?? ????..." : "Search suppliers..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-card border-border py-3 pl-12 pr-4 text-sm focus:border-blue-600 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-start">
                        <thead>
                            <tr className="border-b border-border bg-card/50">
                                <th className="px-6 py-4 text-start text-[10px] font-black text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? '??????' : 'Supplier'}</th>
                                <th className="px-6 py-4 text-start text-[10px] font-black text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? '?????? ???????' : 'Contact Info'}</th>
                                <th className="px-6 py-4 text-start text-[10px] font-black text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? '???????' : 'Address'}</th>
                                <th className="px-6 py-4 text-end text-[10px] font-black text-muted-foreground uppercase tracking-widest">{lang === 'ar' ? '???????' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-6 py-8 h-16 bg-white/5" />
                                    </tr>
                                ))
                            ) : filteredSuppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground italic">
                                        {lang === 'ar' ? '?? ???? ?????? ???? ?????' : 'No suppliers found'}
                                    </td>
                                </tr>
                            ) : (
                                filteredSuppliers.map((s) => (
                                    <tr key={s.id} className="hover:bg-accent/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-popover border border-border flex items-center justify-center font-bold text-blue-500 capitalize">
                                                    {s.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground text-sm">{s.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{s.contact || (lang === 'ar' ? '????? ??? ????' : 'No contact person')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {s.phone && (
                                                    <p className="text-xs text-muted-foreground/70 flex items-center gap-2">
                                                        <Phone className="w-3 h-3 text-muted-foreground/60" /> {s.phone}
                                                    </p>
                                                )}
                                                {s.email && (
                                                    <p className="text-xs text-muted-foreground/70 flex items-center gap-2">
                                                        <Mail className="w-3 h-3 text-muted-foreground/60" /> {s.email}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-muted-foreground max-w-[200px] truncate flex items-center gap-2">
                                                <MapPin className="w-3 h-3" /> {s.address || (lang === 'ar' ? '??? ????' : 'N/A')}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-end">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingSupplier(s); setIsModalOpen(true); }}
                                                    className="p-2 rounded-xl bg-popover border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete({ isOpen: true, id: s.id })}
                                                    className="p-2 rounded-xl bg-popover border border-border text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 font-inter">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-xl bg-popover border border-border rounded-4xl shadow-none overflow-hidden"
                        >
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-black">{editingSupplier ? (lang === 'ar' ? '????? ????' : 'Edit Supplier') : (lang === 'ar' ? '????? ???? ????' : 'Add New Supplier')}</h2>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-accent/50 rounded-xl transition-all">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                            <Briefcase className="w-3 h-3" /> {lang === 'ar' ? '??? ?????? / ??????' : 'Supplier Name'}
                                        </label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-blue-600 outline-none transition-all text-sm"
                                            placeholder={lang === 'ar' ? "????: ???? ????? ?????????" : "e.g., Al-Nasr Trading"}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <User className="w-3 h-3" /> {lang === 'ar' ? '??? ???????' : 'Contact Person'}
                                            </label>
                                            <input
                                                value={formData.contact}
                                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                                className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-blue-600 outline-none transition-all text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                <Phone className="w-3 h-3" /> {lang === 'ar' ? '??? ??????' : 'Phone'}
                                            </label>
                                            <input
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-blue-600 outline-none transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                            <Mail className="w-3 h-3" /> {lang === 'ar' ? '?????? ??????????' : 'Email'}
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-blue-600 outline-none transition-all text-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                            <MapPin className="w-3 h-3" /> {lang === 'ar' ? '???????' : 'Address'}
                                        </label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={2}
                                            className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:border-blue-600 outline-none transition-all text-sm resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-14 font-black"
                                    >
                                        {lang === 'ar' ? '??? ????????' : 'Save Supplier'}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-8 rounded-2xl bg-secondary text-muted-foreground/70 hover:text-white transition-all font-bold"
                                    >
                                        {lang === 'ar' ? '?????' : 'Cancel'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Confirm Delete */}
            <ConfirmDialog
                isOpen={confirmDelete.isOpen}
                title={lang === 'ar' ? '??? ??? ???????' : 'Delete this supplier?'}
                message={lang === 'ar' ? '???? ??? ?????? ??????? ?? ??????. ?? ??? ??????' : 'This will permanently remove the supplier. Are you sure?'}
                confirmText={lang === 'ar' ? '???? ????' : 'Yes, Delete'}
                cancelText={lang === 'ar' ? '?????' : 'Cancel'}
                onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
                onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
            />
        </div>
    )
}
