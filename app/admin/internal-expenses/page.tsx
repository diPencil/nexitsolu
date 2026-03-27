"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
    Wallet,
    Plus,
    Loader2,
    Trash2,
    Pencil,
    X,
    Calendar,
    Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"

const CATEGORIES = [
    { value: "", en: "— None —", ar: "— بدون —" },
    { value: "WAREHOUSE", en: "Warehouse / storage", ar: "مستودع / تخزين" },
    { value: "TRANSPORT", en: "Transport / delivery", ar: "نقل / توصيل" },
    { value: "SHARED", en: "Shared / partners", ar: "مشترك / شركاء" },
    { value: "OTHER", en: "Other", ar: "أخرى" },
]

type ExpenseRow = {
    id: string
    title: string
    amount: number
    spentAt: string
    category: string | null
    notes: string | null
    createdBy: { name: string | null; email: string | null } | null
}

export default function InternalExpensesPage() {
    const { lang } = useLanguage()
    const [rows, setRows] = useState<ExpenseRow[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [form, setForm] = useState({
        title: "",
        amount: "",
        spentAt: new Date().toISOString().slice(0, 10),
        category: "",
        notes: "",
    })

    const load = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/admin/internal-expenses")
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

    const totalRecorded = useMemo(
        () => rows.reduce((s, r) => s + Number(r.amount || 0), 0),
        [rows]
    )

    const openCreate = () => {
        setEditingId(null)
        setForm({
            title: "",
            amount: "",
            spentAt: new Date().toISOString().slice(0, 10),
            category: "",
            notes: "",
        })
        setIsModalOpen(true)
    }

    const openEdit = (r: ExpenseRow) => {
        setEditingId(r.id)
        setForm({
            title: r.title,
            amount: String(r.amount),
            spentAt: new Date(r.spentAt).toISOString().slice(0, 10),
            category: r.category || "",
            notes: r.notes || "",
        })
        setIsModalOpen(true)
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        const title = form.title.trim()
        const amount = parseFloat(form.amount)
        if (!title || !Number.isFinite(amount) || amount <= 0) {
            toast.error(
                lang === "ar"
                    ? "أدخل عنوانًا ومبلغًا صحيحًا"
                    : "Enter title and valid amount"
            )
            return
        }
        setIsSaving(true)
        try {
            const payload = {
                title,
                amount,
                spentAt: form.spentAt
                    ? new Date(form.spentAt + "T12:00:00").toISOString()
                    : undefined,
                category: form.category || null,
                notes: form.notes.trim() || null,
            }
            const res = editingId
                ? await fetch("/api/admin/internal-expenses", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: editingId, ...payload }),
                  })
                : await fetch("/api/admin/internal-expenses", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                  })
            const errBody = await res.json().catch(() => ({}))
            if (!res.ok) {
                toast.error(errBody.error || "Error")
                return
            }
            toast.success(
                lang === "ar"
                    ? editingId
                        ? "تم التحديث"
                        : "تم الحفظ"
                    : editingId
                      ? "Updated"
                      : "Saved"
            )
            setIsModalOpen(false)
            load()
        } catch {
            toast.error("Error")
        } finally {
            setIsSaving(false)
        }
    }

    const remove = async (id: string) => {
        if (
            !confirm(
                lang === "ar"
                    ? "حذف هذا المصروف؟"
                    : "Delete this expense record?"
            )
        )
            return
        try {
            const res = await fetch(
                `/api/admin/internal-expenses?id=${encodeURIComponent(id)}`,
                { method: "DELETE" }
            )
            if (res.ok) {
                toast.success(lang === "ar" ? "تم الحذف" : "Deleted")
                load()
            } else {
                const err = await res.json().catch(() => ({}))
                toast.error(err.error || "Error")
            }
        } catch {
            toast.error("Error")
        }
    }

    const categoryLabel = (code: string | null) => {
        if (!code) return "—"
        const c = CATEGORIES.find((x) => x.value === code)
        if (!c) return code
        return lang === "ar" ? c.ar : c.en
    }

    return (
        <div className="space-y-8 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-[#0066FF]" />
                        {lang === "ar" ? "مصروفات خاصة" : "Internal expenses"}
                    </h1>
                    <p className="text-zinc-500 mt-2 max-w-xl text-sm leading-relaxed">
                        {lang === "ar"
                            ? "مصروفات تشغيلية أو مشتركة بينكم (مستودع، نقل، …) — سجل مالي منفصل؛ لا تغيّر مخزون المنتجات ولا تستبدل «المشتريات» من الموردين."
                            : "Shared or operational costs (warehouse, transport, etc.). Separate ledger — does not change product stock; not a substitute for Purchases from suppliers."}
                    </p>
                </div>
                <Button
                    onClick={openCreate}
                    className="bg-[#0066FF] hover:bg-blue-600 rounded-2xl h-12 px-6 gap-2"
                >
                    <Plus className="w-5 h-5" />
                    {lang === "ar" ? "مصروف جديد" : "New expense"}
                </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {lang === "ar" ? "إجمالي المسجّل" : "Total recorded"}
                    </p>
                    <p className="text-2xl font-black text-white mt-2">
                        {totalRecorded.toLocaleString(
                            lang === "ar" ? "ar-EG" : "en-US",
                            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        )}{" "}
                        EGP
                    </p>
                </div>
                <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {lang === "ar" ? "عدد السجلات" : "Entries"}
                    </p>
                    <p className="text-2xl font-black text-[#0066FF] mt-2">
                        {rows.length}
                    </p>
                </div>
            </div>

            <div className="bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
                    </div>
                ) : rows.length === 0 ? (
                    <div className="py-16 text-center text-zinc-600 text-sm">
                        {lang === "ar"
                            ? "لا توجد مصروفات بعد."
                            : "No internal expenses yet."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5 bg-zinc-900/40 text-[10px] uppercase tracking-wider text-zinc-500">
                                    <th className="text-start px-4 py-3">
                                        {lang === "ar" ? "التاريخ" : "Date"}
                                    </th>
                                    <th className="text-start px-4 py-3">
                                        {lang === "ar" ? "البيان" : "Title"}
                                    </th>
                                    <th className="text-start px-4 py-3">
                                        {lang === "ar" ? "التصنيف" : "Category"}
                                    </th>
                                    <th className="text-end px-4 py-3">
                                        {lang === "ar" ? "المبلغ" : "Amount"}
                                    </th>
                                    <th className="text-end px-4 py-3 w-24">
                                        {lang === "ar" ? "إجراءات" : "Actions"}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rows.map((r, i) => (
                                    <motion.tr
                                        key={r.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="hover:bg-white/2"
                                    >
                                        <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
                                            {new Date(
                                                r.spentAt
                                            ).toLocaleDateString(
                                                lang === "ar" ? "ar-EG" : "en-US"
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-white">
                                                {r.title}
                                            </span>
                                            {r.notes && (
                                                <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                                                    {r.notes}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-400">
                                            {categoryLabel(r.category)}
                                        </td>
                                        <td className="px-4 py-3 text-end font-bold text-emerald-400 whitespace-nowrap">
                                            {Number(r.amount).toFixed(2)} EGP
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(r)}
                                                    className="p-2 rounded-lg border border-white/10 text-zinc-500 hover:text-white hover:bg-white/5"
                                                    title={lang === "ar" ? "تعديل" : "Edit"}
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(r.id)}
                                                    className="p-2 rounded-lg border border-white/10 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                                                    title={lang === "ar" ? "حذف" : "Delete"}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-[#0066FF]" />
                                {editingId
                                    ? lang === "ar"
                                        ? "تعديل مصروف"
                                        : "Edit expense"
                                    : lang === "ar"
                                      ? "مصروف جديد"
                                      : "New expense"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-lg hover:bg-white/5"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-5 space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    {lang === "ar" ? "البيان" : "Title"}
                                </label>
                                <input
                                    required
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            title: e.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0066FF]"
                                    placeholder={
                                        lang === "ar"
                                            ? "مثال: تأمين الشحن الداخلي"
                                            : "e.g. Internal delivery insurance"
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        {lang === "ar" ? "المبلغ (EGP)" : "Amount (EGP)"}
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={form.amount}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                amount: e.target.value,
                                            }))
                                        }
                                        className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0066FF]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {lang === "ar" ? "التاريخ" : "Date"}
                                    </label>
                                    <input
                                        type="date"
                                        value={form.spentAt}
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                spentAt: e.target.value,
                                            }))
                                        }
                                        className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0066FF]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    {lang === "ar" ? "التصنيف" : "Category"}
                                </label>
                                <select
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            category: e.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0066FF]"
                                >
                                    {CATEGORIES.map((c) => (
                                        <option key={c.value || "none"} value={c.value}>
                                            {lang === "ar" ? c.ar : c.en}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    {lang === "ar" ? "ملاحظات" : "Notes"}
                                </label>
                                <textarea
                                    value={form.notes}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            notes: e.target.value,
                                        }))
                                    }
                                    rows={3}
                                    className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0066FF] resize-none"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="w-full h-12 rounded-xl bg-[#0066FF] hover:bg-blue-600 font-bold"
                            >
                                {isSaving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : editingId ? (
                                    lang === "ar" ? "حفظ التعديل" : "Save changes"
                                ) : (
                                    lang === "ar" ? "حفظ" : "Save"
                                )}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
