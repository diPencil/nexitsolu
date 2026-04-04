"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/lib/i18n-context";
import {
    Loader2,
    RefreshCw,
    Search,
    ScrollText,
    User,
    Globe,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Row = {
    id: string;
    createdAt: string;
    userEmail: string | null;
    username: string | null;
    userRole: string | null;
    action: string;
    category: string;
    summary: string;
    path: string | null;
    method: string | null;
    ip: string | null;
    userAgent: string | null;
};

export default function AdminActivityPage() {
    const { lang } = useLanguage();
    const [items, setItems] = useState<Row[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [limit] = useState(40);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [category, setCategory] = useState("");
    const [queryInput, setQueryInput] = useState("");
    const [catInput, setCatInput] = useState("");

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
            });
            if (q) params.set("q", q);
            if (category) params.set("category", category);
            const res = await fetch(`/api/admin/activity-logs/?${params}`);
            if (!res.ok) throw new Error("fetch failed");
            const data = await res.json();
            setItems(data.items ?? []);
            setTotal(data.total ?? 0);
            setTotalPages(data.totalPages ?? 1);
        } catch {
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit, q, category]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const applyFilters = () => {
        setPage(0);
        setQ(queryInput.trim());
        setCategory(catInput.trim());
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <ScrollText className="w-5 h-5 text-violet-400" />
                        </div>
                        <h1 className="text-2xl font-black text-foreground">
                            {lang === "ar"
                                ? "سجل النشاط"
                                : "Activity log"}
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xl">
                        {lang === "ar"
                            ? "تسجيل دخول/خروج؛ أحداث مهمة (حسابات، منتجات، طلبات، فواتير، عروض أسعار، توريد، موردين، رسائل، تواصل). باقي طلبات الـ API تظهر تحت تصنيف api إن وُجد ACTIVITY_LOG_INTERNAL_SECRET."
                            : "Sign-in/out; key business events (accounts, products, orders, invoices, quotations, purchases, suppliers, chat, contact). Other API writes also appear as “api” if ACTIVITY_LOG_INTERNAL_SECRET is set."}
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fetchLogs()}
                    className="border-border text-zinc-300 hover:bg-accent/50"
                >
                    <RefreshCw
                        className={`w-4 h-4 me-2 ${loading ? "animate-spin" : ""}`}
                    />
                    {lang === "ar" ? "تحديث" : "Refresh"}
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
                <div className="flex-1 relative">
                    <Search className="absolute top-3 inset-s-3 w-4 h-4 text-muted-foreground" />
                    <input
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                        placeholder={
                            lang === "ar"
                                ? "بحث في الملخص، المسار، البريد..."
                                : "Search summary, path, email..."
                        }
                        className="w-full bg-background border border-input rounded-xl py-2.5 ps-10 pe-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                    />
                </div>
                <input
                    value={catInput}
                    onChange={(e) => setCatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                    placeholder={
                        lang === "ar"
                            ? "تصنيف (auth, api...)"
                            : "Category (auth, api...)"
                    }
                    className="lg:w-48 bg-background border border-input rounded-xl py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                />
                <Button
                    onClick={applyFilters}
                >
                    {lang === "ar" ? "تصفية" : "Filter"}
                </Button>
            </div>

            <div className="text-xs text-muted-foreground">
                {lang === "ar" ? "إجمالي السجلات:" : "Total entries:"}{" "}
                <span className="text-foreground font-bold">{total}</span>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                {loading && items.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : items.length === 0 ? (
                    <p className="text-center text-muted-foreground py-16 text-sm">
                        {lang === "ar" ? "لا توجد سجلات." : "No activity yet."}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-sm">
                            <thead>
                                <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                                    <th className="px-4 py-3 font-black whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {lang === "ar" ? "الوقت" : "When"}
                                        </span>
                                    </th>
                                    <th className="px-4 py-3 font-black whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {lang === "ar" ? "المستخدم" : "User"}
                                        </span>
                                    </th>
                                    <th className="px-4 py-3 font-black">
                                        {lang === "ar" ? "الدور" : "Role"}
                                    </th>
                                    <th className="px-4 py-3 font-black">
                                        {lang === "ar" ? "الإجراء" : "Action"}
                                    </th>
                                    <th className="px-4 py-3 font-black min-w-[200px]">
                                        {lang === "ar" ? "التفاصيل" : "Summary"}
                                    </th>
                                    <th className="px-4 py-3 font-black min-w-[180px]">
                                        <span className="inline-flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            {lang === "ar" ? "مسار / IP" : "Path / IP"}
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-border hover:bg-muted/50"
                                    >
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap align-top text-xs">
                                            {new Date(
                                                row.createdAt
                                            ).toLocaleString(
                                                lang === "ar" ? "ar-EG" : "en-GB"
                                            )}
                                        </td>
                                        <td className="px-4 py-3 align-top">
                                            <div className="text-foreground text-xs font-medium">
                                                {row.userEmail ||
                                                    row.username ||
                                                    (lang === "ar"
                                                        ? "— زائر —"
                                                        : "— guest —")}
                                            </div>
                                            {row.username && row.userEmail && (
                                                <div className="text-[10px] text-muted-foreground">
                                                    @{row.username}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 align-top">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                                                {row.userRole || "—"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 align-top">
                                            <span
                                                className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                                                    row.category === "auth"
                                                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                        : row.category === "business"
                                                          ? "bg-primary/10 text-primary border-primary/20"
                                                          : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                                }`}
                                            >
                                                {row.action}
                                            </span>
                                            <div className="text-[9px] text-muted-foreground mt-0.5">
                                                {row.category}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-foreground text-xs align-top max-w-md">
                                            {row.summary}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground align-top font-mono break-all max-w-xs">
                                            {row.path && (
                                                <div className="text-primary mb-1">
                                                    {row.method}{" "}
                                                    <span className="text-muted-foreground">
                                                        {row.path}
                                                    </span>
                                                </div>
                                            )}
                                            {row.ip && (
                                                <p className="text-muted-foreground">{lang === 'ar' ? 'سجل تتبع العمليات والأنشطة على النظام.' : 'System-wide activity and audit logs.'}</p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 0 || loading}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        className="border-border"
                    >
                        {lang === "ar" ? "السابق" : "Prev"}
                    </Button>
                    <span className="text-xs text-muted-foreground px-2">
                        {page + 1} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages - 1 || loading}
                        onClick={() =>
                            setPage((p) => Math.min(totalPages - 1, p + 1))
                        }
                        className="border-border"
                    >
                        {lang === "ar" ? "التالي" : "Next"}
                    </Button>
                </div>
            )}
        </div>
    );
}
