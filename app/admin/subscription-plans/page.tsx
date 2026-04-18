"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
    ListOrdered,
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

type ServiceRow = {
    id: string
    key: string
    nameEn: string
    nameAr: string
    active: boolean
}

type PlanRow = {
    id: string
    serviceKey: string | null
    nameEn: string
    nameAr: string
    suggestedAmount: number | null
    sortOrder: number
    active: boolean
}

export default function AdminSubscriptionPlansPage() {
    const { lang } = useLanguage()
    const [rows, setRows] = useState<PlanRow[]>([])
    const [services, setServices] = useState<ServiceRow[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteLabels, setDeleteLabels] = useState<{
        ar: string
        en: string
    } | null>(null)
    const pendingDeletePlan = useRef<PlanRow | null>(null)

    const [form, setForm] = useState({
        serviceKey: "",
        nameEn: "",
        nameAr: "",
        suggestedAmount: "",
        sortOrder: "0",
        active: true,
    })

    const load = async () => {
        setIsLoading(true)
        try {
            const [resPlans, resSvc] = await Promise.all([
                fetch("/api/admin/subscription-plans"),
                fetch("/api/admin/subscription-services"),
            ])
            if (resPlans.ok) {
                const data = await resPlans.json()
                setRows(Array.isArray(data) ? data : [])
            } else {
                toast.error(lang === "ar" ? "??? ????? ?????" : "Failed to load plans")
            }
            if (resSvc.ok) {
                const data = await resSvc.json()
                setServices(Array.isArray(data) ? data : [])
            }
        } catch {
            toast.error(lang === "ar" ? "??? ???????" : "Failed to load")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const serviceLabel = (key: string | null) => {
        if (!key)
            return lang === "ar" ? "?? ???????" : "All services"
        const s = services.find((x) => x.key === key)
        if (!s) return key
        return lang === "ar" ? s.nameAr : s.nameEn
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({
            serviceKey: "",
            nameEn: "",
            nameAr: "",
            suggestedAmount: "",
            sortOrder: String(rows.length),
            active: true,
        })
        setIsModalOpen(true)
    }

    const openEdit = (r: PlanRow) => {
        setEditingId(r.id)
        setForm({
            serviceKey: r.serviceKey || "",
            nameEn: r.nameEn,
            nameAr: r.nameAr,
            suggestedAmount:
                r.suggestedAmount != null ? String(r.suggestedAmount) : "",
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
                    ? "???? ????? ??????? ??????????"
                    : "Enter Arabic and English names"
            )
            return
        }
        const sortOrder = parseInt(form.sortOrder, 10)
        setIsSaving(true)
        try {
            if (editingId) {
                const res = await fetch(
                    `/api/admin/subscription-plans/${editingId}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            nameEn,
                            nameAr,
                            serviceKey: form.serviceKey || null,
                            suggestedAmount: form.suggestedAmount.trim() || null,
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
                toast.success(lang === "ar" ? "?? ???????" : "Updated")
            } else {
                const res = await fetch("/api/admin/subscription-plans", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nameEn,
                        nameAr,
                        serviceKey: form.serviceKey || null,
                        suggestedAmount: form.suggestedAmount.trim() || null,
                        sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
                        active: form.active,
                    }),
                })
                const err = await res.json().catch(() => ({}))
                if (!res.ok) {
                    toast.error(err.error || "Error")
                    return
                }
                toast.success(lang === "ar" ? "??? ???????" : "Added")
            }
            setIsModalOpen(false)
            load()
        } catch {
            toast.error("Error")
        } finally {
            setIsSaving(false)
        }
    }

    const openDeleteDialog = (r: PlanRow) => {
        pendingDeletePlan.current = r
        setDeleteLabels({ ar: r.nameAr, en: r.nameEn })
        setDeleteDialogOpen(true)
    }

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setDeleteLabels(null)
        pendingDeletePlan.current = null
    }

    const executeConfirmedDelete = async () => {
        const r = pendingDeletePlan.current
        pendingDeletePlan.current = null
        setDeleteDialogOpen(false)
        setDeleteLabels(null)
        if (!r) return
        try {
            const res = await fetch(`/api/admin/subscription-plans/${r.id}`, {
                method: "DELETE",
            })
            if (res.status === 204) {
                toast.success(lang === "ar" ? "?? ?????" : "Deleted")
                load()
                return
            }
            const err = await res.json().catch(() => ({}))
            if (err.error === "PLAN_IN_USE") {
                toast.error(
                    lang === "ar"
                        ? "?? ???? ?????: ???? ???????? ???? ??? ?????."
                        : "Cannot delete: subscriptions still use this plan name."
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
                        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-[#0066FF] mb-3"
                    >
                        <ArrowLeft
                            className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`}
                        />
                        {lang === "ar" ? "??????????" : "Subscriptions"}
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ListOrdered className="w-8 h-8 text-[#0066FF]" />
                        {lang === "ar" ? "??? ????????" : "Subscription plans"}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        {lang === "ar"
                            ? "???? ??????? (?????? ???? ???????…). ???? ??? ????? ????? ????? ?? ????? ????? ??? ???????."
                            : "Define tiers (Bronze, Gold, Premium…). Tie a plan to one service or leave “all services”."}
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={openCreate}
                    className="rounded-2xl h-12 bg-[#0066FF] hover:bg-blue-600 text-white gap-2 [&_svg]:text-white"
                >
                    <Plus className="w-5 h-5" />
                    {lang === "ar" ? "??? ?????" : "New plan"}
                </Button>
            </div>

            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
                </div>
            ) : rows.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground border border-border rounded-3xl">
                    {lang === "ar" ? "?? ???? ??? ???" : "No plans yet"}
                </div>
            ) : (
                <div className="space-y-2">
                    {rows.map((r, i) => (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-card border border-border"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-foreground">
                                    {lang === "ar" ? r.nameAr : r.nameEn}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {serviceLabel(r.serviceKey)}
                                    {r.suggestedAmount != null
                                        ? ` · ${r.suggestedAmount} EGP`
                                        : ""}
                                </p>
                                {!r.active && (
                                    <span className="text-[10px] text-amber-500 font-black uppercase mt-1 inline-block">
                                        {lang === "ar" ? "??????" : "Inactive"}
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                #{r.sortOrder}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEdit(r)}
                                    className="border-border rounded-xl"
                                    title={lang === "ar" ? "?????" : "Edit"}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openDeleteDialog(r)}
                                    className="border-border rounded-xl text-muted-foreground hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10"
                                    title={lang === "ar" ? "???" : "Delete"}
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
                        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-none overflow-hidden max-h-[92vh] overflow-y-auto"
                    >
                        <div className="px-4 py-3 border-b border-border flex items-center justify-between sticky top-0 bg-card">
                            <h2 className="font-bold">
                                {editingId
                                    ? lang === "ar"
                                        ? "????? ???"
                                        : "Edit plan"
                                    : lang === "ar"
                                      ? "??? ?????"
                                      : "New plan"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-accent/50"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-4 space-y-3">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                    {lang === "ar" ? "?????? (???????)" : "Service (optional)"}
                                </label>
                                <select
                                    className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground outline-none focus:border-[#0066FF]"
                                    value={form.serviceKey}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            serviceKey: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="">
                                        {lang === "ar"
                                            ? "— ?? ??????? —"
                                            : "— All services —"}
                                    </option>
                                    {services
                                        .filter((s) => s.active)
                                        .map((s) => (
                                            <option key={s.id} value={s.key}>
                                                {lang === "ar"
                                                    ? s.nameAr
                                                    : s.nameEn}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                    EN
                                </label>
                                <input
                                    required
                                    className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground outline-none focus:border-[#0066FF]"
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
                                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                    ????
                                </label>
                                <input
                                    required
                                    className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground outline-none focus:border-[#0066FF]"
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
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                    {lang === "ar"
                                        ? "???? ????? (?.?? ???????)"
                                        : "Suggested amount (EGP, optional)"}
                                </label>
                                <input
                                    type="number"
                                    className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground outline-none focus:border-[#0066FF]"
                                    value={form.suggestedAmount}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            suggestedAmount: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                        {lang === "ar" ? "?????" : "Sort"}
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-secondary border border-border rounded-xl py-2.5 px-3 text-sm text-foreground outline-none focus:border-[#0066FF]"
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
                                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.active}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    active: e.target.checked,
                                                }))
                                            }
                                            className="rounded border-border"
                                        />
                                        {lang === "ar" ? "????" : "Active"}
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 rounded-xl border-border"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    {lang === "ar" ? "?????" : "Cancel"}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white [&_svg]:text-white"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : editingId ? (
                                        lang === "ar" ? "???" : "Save"
                                    ) : (
                                        lang === "ar" ? "?????" : "Add"
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
                title={lang === "ar" ? "??? ??????" : "Delete plan?"}
                message={
                    deleteLabels
                        ? lang === "ar"
                          ? `???? ??? «${deleteLabels.ar}» ???????. ?? ???? ???????.`
                          : `"${deleteLabels.en}" will be permanently removed. This cannot be undone.`
                        : ""
                }
                confirmText={lang === "ar" ? "???" : "Delete"}
                cancelText={lang === "ar" ? "?????" : "Cancel"}
                danger
            />
        </div>
    )
}
