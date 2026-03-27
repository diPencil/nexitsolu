"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
    Layers,
    Plus,
    Loader2,
    Pencil,
    Trash2,
    X,
    ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"

type Row = {
    id: string
    key: string
    nameEn: string
    nameAr: string
    sortOrder: number
    active: boolean
}

export default function AdminSubscriptionServicesPage() {
    const { lang } = useLanguage()
    const [rows, setRows] = useState<Row[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteLabels, setDeleteLabels] = useState<{
        ar: string
        en: string
    } | null>(null)
    const pendingDeleteRow = useRef<Row | null>(null)

    const [form, setForm] = useState({
        key: "",
        nameEn: "",
        nameAr: "",
        sortOrder: "0",
        active: true,
    })

    const load = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/admin/subscription-services")
            if (res.ok) {
                const data = await res.json()
                setRows(Array.isArray(data) ? data : [])
            } else {
                toast.error(lang === "ar" ? "فشل التحميل" : "Failed to load")
            }
        } catch {
            toast.error(lang === "ar" ? "فشل التحميل" : "Failed to load")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const openCreate = () => {
        setEditingId(null)
        setForm({
            key: "",
            nameEn: "",
            nameAr: "",
            sortOrder: String(rows.length),
            active: true,
        })
        setIsModalOpen(true)
    }

    const openEdit = (r: Row) => {
        setEditingId(r.id)
        setForm({
            key: r.key,
            nameEn: r.nameEn,
            nameAr: r.nameAr,
            sortOrder: String(r.sortOrder),
            active: r.active,
        })
        setIsModalOpen(true)
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        const nameEn = form.nameEn.trim()
        const nameAr = form.nameAr.trim()
        if (!nameEn || !nameAr) {
            toast.error(
                lang === "ar"
                    ? "أدخل الاسم بالعربي والإنجليزي"
                    : "Enter Arabic and English names"
            )
            return
        }
        const sortOrder = parseInt(form.sortOrder, 10)
        setIsSaving(true)
        try {
            if (editingId) {
                const res = await fetch(
                    `/api/admin/subscription-services/${editingId}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            nameEn,
                            nameAr,
                            sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
                            active: form.active,
                        }),
                    }
                )
                const err = await res.json().catch(() => ({}))
                if (!res.ok) {
                    toast.error(err.error || "Error")
                    return
                }
                toast.success(lang === "ar" ? "تم التحديث" : "Updated")
            } else {
                const res = await fetch("/api/admin/subscription-services", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        key: form.key.trim() || undefined,
                        nameEn,
                        nameAr,
                        sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
                        active: form.active,
                    }),
                })
                const err = await res.json().catch(() => ({}))
                if (!res.ok) {
                    toast.error(err.error || "Error")
                    return
                }
                toast.success(lang === "ar" ? "تمت الإضافة" : "Added")
            }
            setIsModalOpen(false)
            load()
        } catch {
            toast.error("Error")
        } finally {
            setIsSaving(false)
        }
    }

    const openDeleteDialog = (r: Row) => {
        pendingDeleteRow.current = r
        setDeleteLabels({ ar: r.nameAr, en: r.nameEn })
        setDeleteDialogOpen(true)
    }

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setDeleteLabels(null)
        pendingDeleteRow.current = null
    }

    const executeConfirmedDelete = async () => {
        const r = pendingDeleteRow.current
        pendingDeleteRow.current = null
        setDeleteDialogOpen(false)
        setDeleteLabels(null)
        if (!r) return
        try {
            const res = await fetch(`/api/admin/subscription-services/${r.id}`, {
                method: "DELETE",
            })
            if (res.status === 204) {
                toast.success(lang === "ar" ? "تم الحذف" : "Deleted")
                load()
                return
            }
            const err = await res.json().catch(() => ({}))
            if (err.error === "SERVICE_IN_USE") {
                toast.error(
                    lang === "ar"
                        ? "لا يمكن الحذف: توجد اشتراكات تستخدم هذه الخدمة."
                        : "Cannot delete: subscriptions still use this service."
                )
                return
            }
            toast.error(err.message || err.error || "Error")
        } catch {
            toast.error("Error")
        }
    }

    return (
        <div className="space-y-8 w-full pb-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <Link
                        href="/admin/subscriptions"
                        className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-[#0066FF] mb-3"
                    >
                        <ArrowLeft
                            className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`}
                        />
                        {lang === "ar" ? "الاشتراكات" : "Subscriptions"}
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Layers className="w-8 h-8 text-[#0066FF]" />
                        {lang === "ar" ? "خدمات الاشتراك" : "Subscription services"}
                    </h1>
                    <p className="text-zinc-500 mt-2 text-sm">
                        {lang === "ar"
                            ? "أضف أو عدّل أنواع الخدمات التي تظهر في قائمة الاشتراك. المفتاح الداخلي يُنشأ تلقائياً إن تركته فارغاً."
                            : "Add or edit service types shown in the subscription form. Leave key empty to auto-generate."}
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={openCreate}
                    className="rounded-2xl h-12 bg-[#0066FF] hover:bg-blue-600 text-white gap-2 [&_svg]:text-white"
                >
                    <Plus className="w-5 h-5" />
                    {lang === "ar" ? "خدمة جديدة" : "New service"}
                </Button>
            </div>

            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
                </div>
            ) : rows.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 border border-white/5 rounded-3xl">
                    {lang === "ar" ? "لا توجد خدمات بعد" : "No services yet"}
                </div>
            ) : (
                <div className="space-y-2">
                    {rows.map((r, i) => (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-zinc-950 border border-white/10"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-white">
                                    {lang === "ar" ? r.nameAr : r.nameEn}
                                </p>
                                <p className="text-xs text-zinc-500 mt-1 font-mono truncate">
                                    {r.key}
                                </p>
                                {!r.active && (
                                    <span className="text-[10px] text-amber-500 font-black uppercase mt-1 inline-block">
                                        {lang === "ar" ? "موقوفة" : "Inactive"}
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-zinc-500">
                                {lang === "ar" ? "ترتيب" : "Order"}: {r.sortOrder}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEdit(r)}
                                    className="border-white/15 rounded-xl"
                                    title={lang === "ar" ? "تعديل" : "Edit"}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openDeleteDialog(r)}
                                    className="border-white/15 rounded-xl text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10"
                                    title={lang === "ar" ? "حذف" : "Delete"}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-101 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                    <motion.div
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                            <h2 className="font-bold">
                                {editingId
                                    ? lang === "ar"
                                        ? "تعديل خدمة"
                                        : "Edit service"
                                    : lang === "ar"
                                      ? "خدمة جديدة"
                                      : "New service"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-white/5"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-4 space-y-3">
                            {!editingId && (
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                        {lang === "ar"
                                            ? "المفتاح (اختياري)"
                                            : "Key (optional)"}
                                    </label>
                                    <input
                                        className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 px-3 text-sm font-mono text-white outline-none focus:border-[#0066FF]"
                                        placeholder="MANAGED_IT"
                                        value={form.key}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                key: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            )}
                            {editingId && (
                                <p className="text-xs text-zinc-500 font-mono bg-zinc-900/50 rounded-lg px-3 py-2">
                                    {form.key}
                                </p>
                            )}
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                    EN
                                </label>
                                <input
                                    required
                                    className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-[#0066FF]"
                                    value={form.nameEn}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            nameEn: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                    عربي
                                </label>
                                <input
                                    required
                                    className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-[#0066FF]"
                                    dir="rtl"
                                    value={form.nameAr}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            nameAr: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                        {lang === "ar" ? "ترتيب" : "Sort"}
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-[#0066FF]"
                                        value={form.sortOrder}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                sortOrder: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-1 flex flex-col justify-end">
                                    <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.active}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    active: e.target.checked,
                                                }))
                                            }
                                            className="rounded border-white/20"
                                        />
                                        {lang === "ar" ? "نشطة" : "Active"}
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 rounded-xl border-white/15"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    {lang === "ar" ? "إلغاء" : "Cancel"}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white [&_svg]:text-white"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : editingId ? (
                                        lang === "ar" ? "حفظ" : "Save"
                                    ) : (
                                        lang === "ar" ? "إضافة" : "Add"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onCancel={closeDeleteDialog}
                onConfirm={() => void executeConfirmedDelete()}
                title={lang === "ar" ? "حذف الخدمة؟" : "Delete service?"}
                message={
                    deleteLabels
                        ? lang === "ar"
                          ? `سيتم حذف «${deleteLabels.ar}» نهائياً. لا يمكن التراجع.`
                          : `"${deleteLabels.en}" will be permanently removed. This cannot be undone.`
                        : ""
                }
                confirmText={lang === "ar" ? "حذف" : "Delete"}
                cancelText={lang === "ar" ? "إلغاء" : "Cancel"}
                danger
            />
        </div>
    )
}
