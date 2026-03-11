"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
    Plus, Search, Filter, Edit, Trash2, Package,
    X, Loader2, Truck, MapPin, DollarSign, CheckSquare,
    Square, ChevronDown, Globe, Eye, Star, Share2,
    Heart, List, ShoppingBag, BarChart3, TrendingUp, Banknote,
    Tags
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"
import Link from "next/link"
import { Save } from "lucide-react"

// ─── Egyptian Governorates (default seed) ───────────────────────────────────
const EG_GOVERNORATES = [
    { name: "cairo",           nameAr: "القاهرة",         nameEn: "Cairo",            price: 0 },
    { name: "giza",            nameAr: "الجيزة",          nameEn: "Giza",             price: 0 },
    { name: "alexandria",      nameAr: "الإسكندرية",      nameEn: "Alexandria",       price: 0 },
    { name: "qalyubia",        nameAr: "القليوبية",       nameEn: "Qalyubia",         price: 0 },
    { name: "sharqia",         nameAr: "الشرقية",         nameEn: "Sharqia",          price: 0 },
    { name: "dakahlia",        nameAr: "الدقهلية",        nameEn: "Dakahlia",         price: 0 },
    { name: "gharbia",         nameAr: "الغربية",         nameEn: "Gharbia",          price: 0 },
    { name: "menofia",         nameAr: "المنوفية",        nameEn: "Menofia",          price: 0 },
    { name: "beheira",         nameAr: "البحيرة",         nameEn: "Beheira",          price: 0 },
    { name: "kafr_elsheikh",   nameAr: "كفر الشيخ",       nameEn: "Kafr El-Sheikh",   price: 0 },
    { name: "ismailia",        nameAr: "الإسماعيلية",     nameEn: "Ismailia",         price: 0 },
    { name: "port_said",       nameAr: "بورسعيد",         nameEn: "Port Said",        price: 0 },
    { name: "suez",            nameAr: "السويس",          nameEn: "Suez",             price: 0 },
    { name: "damietta",        nameAr: "دمياط",           nameEn: "Damietta",         price: 0 },
    { name: "fayoum",          nameAr: "الفيوم",          nameEn: "Fayoum",           price: 0 },
    { name: "beni_suef",       nameAr: "بني سويف",        nameEn: "Beni Suef",        price: 0 },
    { name: "minya",           nameAr: "المنيا",          nameEn: "Minya",            price: 0 },
    { name: "asyut",           nameAr: "أسيوط",           nameEn: "Asyut",            price: 0 },
    { name: "sohag",           nameAr: "سوهاج",           nameEn: "Sohag",            price: 0 },
    { name: "qena",            nameAr: "قنا",             nameEn: "Qena",             price: 0 },
    { name: "luxor",           nameAr: "الأقصر",          nameEn: "Luxor",            price: 0 },
    { name: "aswan",           nameAr: "أسوان",           nameEn: "Aswan",            price: 0 },
    // ── البحر الأحمر (المحافظة + المدن السياحية) ──
    { name: "red_sea",         nameAr: "البحر الأحمر",    nameEn: "Red Sea",          price: 0 },
    { name: "hurghada",        nameAr: "الغردقة",         nameEn: "Hurghada",         price: 0 },
    { name: "el_gouna",        nameAr: "الجونة",          nameEn: "El Gouna",         price: 0 },
    { name: "safaga",          nameAr: "سفاجا",           nameEn: "Safaga",           price: 0 },
    { name: "marsa_alam",      nameAr: "مرسى علم",        nameEn: "Marsa Alam",       price: 0 },
    { name: "el_quseir",       nameAr: "القصير",          nameEn: "El Quseir",        price: 0 },
    // ── جنوب سيناء ──
    { name: "south_sinai",     nameAr: "جنوب سيناء",      nameEn: "South Sinai",      price: 0 },
    { name: "sharm_el_sheikh", nameAr: "شرم الشيخ",       nameEn: "Sharm El-Sheikh",  price: 0 },
    { name: "dahab",           nameAr: "دهب",             nameEn: "Dahab",            price: 0 },
    { name: "nuweiba",         nameAr: "نويبع",           nameEn: "Nuweiba",          price: 0 },
    { name: "taba",            nameAr: "طابا",            nameEn: "Taba",             price: 0 },
    // ── باقي المحافظات ──
    { name: "north_sinai",     nameAr: "شمال سيناء",      nameEn: "North Sinai",      price: 0 },
    { name: "matrouh",         nameAr: "مطروح",           nameEn: "Matrouh",          price: 0 },
    { name: "new_valley",      nameAr: "الوادي الجديد",   nameEn: "New Valley",       price: 0 },
]

// ─── Zone picker component inside product form ────────────────────────────────
function ZonePicker({ selected, onChange, allZones }: { selected: string[], onChange: (ids: string[]) => void, allZones: any[] }) {
    const { lang } = useLanguage()
    const [open, setOpen] = useState(false)
    const toggle = (name: string) => {
        onChange(selected.includes(name) ? selected.filter(s => s !== name) : [...selected, name])
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 text-start flex items-center justify-between focus:border-[#0066FF] outline-none transition-all"
            >
                <span className="text-sm">
                    {selected.length === 0
                        ? <span className="text-zinc-500">{lang === 'ar' ? 'كل المحافظات (شحن لكل مكان)' : 'All Governorates (Ship Everywhere)'}</span>
                        : <span className="text-white font-bold">{selected.length} {lang === 'ar' ? 'محافظة محددة' : 'Zones Selected'}</span>}
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Select All / Clear */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-zinc-900/50">
                        <button type="button" onClick={() => onChange(allZones.map(z => z.name))}
                            className="text-xs font-bold text-[#0066FF] hover:underline">
                            {lang === 'ar' ? 'تحديد الكل' : 'Select All'}
                        </button>
                        <span className="text-xs text-zinc-600">{selected.length} / {allZones.length}</span>
                        <button type="button" onClick={() => onChange([])}
                            className="text-xs font-bold text-red-400 hover:underline">
                            {lang === 'ar' ? 'مسح الكل' : 'Clear All'}
                        </button>
                    </div>
                    {/* Grid of zones */}
                    <div className="max-h-64 overflow-y-auto p-3 grid grid-cols-2 gap-1.5">
                        {allZones.map(z => {
                            const isSelected = selected.includes(z.name)
                            return (
                                <button
                                    key={z.name}
                                    type="button"
                                    onClick={() => toggle(z.name)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all text-start ${isSelected ? 'bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/30' : 'text-zinc-400 hover:bg-white/5 border border-transparent'}`}
                                >
                                    {isSelected
                                        ? <CheckSquare className="w-4 h-4 shrink-0" />
                                        : <Square className="w-4 h-4 shrink-0 text-zinc-700" />}
                                    <div className="min-w-0">
                                        <p className="font-bold truncate">{lang === 'ar' ? z.nameAr : z.nameEn || z.name}</p>
                                        {z.price > 0 && <p className="text-[10px] text-zinc-500">{z.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                    <div className="px-4 py-3 border-t border-white/5 bg-zinc-900/30">
                        <button type="button" onClick={() => setOpen(false)}
                            className="w-full text-sm font-bold text-white bg-[#0066FF] hover:bg-blue-500 py-2 rounded-xl transition-all">
                            {lang === 'ar' ? 'تم ✓' : 'Done ✓'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Shipping Modal ────────────────────────────────────────────────────────────
function ShippingModal({ onClose }: { onClose: () => void }) {
    const { lang } = useLanguage()
    const [zones, setZones] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editId, setEditId] = useState<string | null>(null)
    const [editPrice, setEditPrice] = useState("")
    const [editActive, setEditActive] = useState(true)
    const [seeding, setSeeding] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null })

    const fetchZones = async () => {
        const res = await fetch("/api/admin/shipping")
        setZones(await res.json())
        setLoading(false)
    }

    useEffect(() => { fetchZones() }, [])

    const handleSeed = async () => {
        setSeeding(true)
        for (const g of EG_GOVERNORATES) {
            // skip if already exists
            if (zones.find(z => z.name === g.name)) continue
            await fetch("/api/admin/shipping", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(g)
            })
        }
        await fetchZones()
        setSeeding(false)
        toast.success(lang === 'ar' ? "تم إضافة جميع المحافظات!" : "All governorates added!")
    }

    const handleSaveZone = async (zoneId: string) => {
        const res = await fetch("/api/admin/shipping", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: zoneId, price: parseFloat(editPrice), isActive: editActive })
        })
        if (res.ok) {
            toast.success(lang === 'ar' ? "تم الحفظ" : "Saved")
            setEditId(null)
            fetchZones()
        }
    }

    const handleDelete = async (zoneId: string) => {
        await fetch(`/api/admin/shipping?id=${zoneId}`, { method: "DELETE" })
        fetchZones()
        toast.success(lang === 'ar' ? "تم الحذف" : "Deleted")
        setConfirmDelete({ isOpen: false, id: null })
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Truck className="w-5 h-5 text-[#0066FF]" /> {lang === 'ar' ? 'إدارة مناطق الشحن' : 'Shipping Management'}
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">{lang === 'ar' ? 'حدد سعر الشحن لكل محافظة' : 'Set shipping price for each governorate'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {zones.length < EG_GOVERNORATES.length && (
                            <button
                                onClick={handleSeed}
                                disabled={seeding}
                                className="text-xs font-bold px-4 py-2 rounded-xl bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 hover:bg-[#0066FF]/20 transition-all flex items-center gap-2"
                            >
                                {seeding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
                                {lang === 'ar' ? 'إضافة كل محافظات مصر' : 'Add All Egypt Zones'}
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
                        </div>
                    ) : zones.length === 0 ? (
                        <div className="text-center py-20">
                            <MapPin className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500 mb-4">{lang === 'ar' ? 'لا توجد مناطق شحن. أضف محافظات مصر بضغطة واحدة!' : 'No shipping zones found. Add Egypt governorates with one click!'}</p>
                            <button
                                onClick={handleSeed}
                                disabled={seeding}
                                className="px-6 py-3 rounded-2xl bg-[#0066FF] text-white font-bold text-sm hover:bg-blue-500 transition-all flex items-center gap-2 mx-auto"
                            >
                                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                                {lang === 'ar' ? 'إضافة 27 محافظة دفعة واحدة' : 'Add 27 Zones At Once'}
                            </button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-3">
                            {zones.map(z => (
                                <div key={z.id} className={`p-4 rounded-2xl border transition-all ${z.isActive ? 'bg-zinc-900 border-white/5' : 'bg-zinc-950 border-white/5 opacity-50'}`}>
                                    {editId === z.id ? (
                                        <div className="space-y-3">
                                            <p className="font-bold text-white text-sm">{lang === 'ar' ? z.nameAr : z.nameEn} — {lang === 'ar' ? z.nameEn : z.nameAr}</p>
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex-1">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                    <input
                                                        type="number"
                                                        value={editPrice}
                                                        onChange={e => setEditPrice(e.target.value)}
                                                        placeholder={lang === 'ar' ? "سعر الشحن (ج.م)" : "Shipping Price (EGP)"}
                                                        className="w-full bg-zinc-800 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:border-[#0066FF] outline-none"
                                                    />
                                                </div>
                                                <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={editActive}
                                                        onChange={e => setEditActive(e.target.checked)}
                                                        className="w-4 h-4 accent-[#0066FF]"
                                                    />
                                                    {lang === 'ar' ? 'نشط' : 'Active'}
                                                </label>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleSaveZone(z.id)}
                                                    className="flex-1 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-bold hover:bg-blue-500">
                                                    {lang === 'ar' ? 'حفظ' : 'Save'}
                                                </button>
                                                <button onClick={() => setEditId(null)}
                                                    className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-xs hover:text-white">
                                                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-white text-sm">{lang === 'ar' ? z.nameAr : z.nameEn}</p>
                                                <p className="text-xs text-zinc-500">{lang === 'ar' ? z.nameEn : z.nameAr}</p>
                                                <p className={`text-sm font-black mt-1 ${z.price > 0 ? 'text-[#0066FF]' : 'text-green-400'}`}>
                                                    {z.price > 0 ? `${z.price} ${lang === 'ar' ? 'ج.م' : 'EGP'}` : (lang === 'ar' ? 'مجاني' : 'Free')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => { setEditId(z.id); setEditPrice(z.price.toString()); setEditActive(z.isActive) }}
                                                    className="p-2 rounded-xl bg-zinc-800 border border-white/5 text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete({ isOpen: true, id: z.id })}
                                                    className="p-2 rounded-xl bg-zinc-800 border border-white/5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <ConfirmDialog
                    isOpen={confirmDelete.isOpen}
                    title={lang === 'ar' ? 'حذف المنطقة؟' : 'Delete Zone?'}
                    message={lang === 'ar' ? 'هل أنت متأكد من رغبتك في حذف منطقة الشحن هذه؟' : 'Are you sure you want to delete this shipping zone?'}
                    confirmText={lang === 'ar' ? 'حذف' : 'Delete'}
                    cancelText={lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
                    onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
                />
            </motion.div>
        </div>
    )
}

function ProductDetailModal({ product: initialProduct, onClose, lang }: { product: any, onClose: () => void, lang: string }) {
    const [product, setProduct] = useState(initialProduct)
    const [loading, setLoading] = useState(true)
    const [activeImage, setActiveImage] = useState(initialProduct.image)

    useEffect(() => {
        const fetchLiveDetails = async () => {
            try {
                const res = await fetch(`/api/products/${initialProduct.id}`)
                if (res.ok) {
                    const liveData = await res.json()
                    setProduct(liveData)
                    if (!activeImage) setActiveImage(liveData.image)
                }
            } catch (error) {
                console.error("Failed to fetch live details", error)
            } finally {
                setLoading(false)
            }
        }
        fetchLiveDetails()
    }, [initialProduct.id])

    const gallery = product.gallery ? product.gallery.split(',').map((s: string) => s.trim()).filter(Boolean) : []
    const allImages = [product.image, ...gallery].filter(Boolean)

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center border border-[#0066FF]/20">
                            <BarChart3 className="w-6 h-6 text-[#0066FF]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black">{lang === 'ar' ? 'تفاصيل المنتج والتحليلات' : 'Product Insights & Details'}</h2>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{product.category} • ID: {product.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left: Images & Gallery */}
                        <div className="space-y-6">
                            <div className="aspect-4/3 rounded-3xl bg-zinc-900 border border-white/5 overflow-hidden group relative">
                                <img src={activeImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#0066FF]">
                                    {product.tag || 'NexIT Premium'}
                                </div>
                            </div>
                            
                            {allImages.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {allImages.map((img, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setActiveImage(img)}
                                            className={`w-20 h-20 rounded-2xl border-2 transition-all shrink-0 overflow-hidden ${activeImage === img ? 'border-[#0066FF] scale-105 shadow-lg shadow-[#0066FF]/20' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="p-5 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-center text-center group hover:border-[#0066FF]/30 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3">
                                        <Eye className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <p className="text-2xl font-black text-white">{product.views || 0}</p>
                                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">{lang === 'ar' ? 'مشاهدة' : 'Views'}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-center text-center group hover:border-[#0066FF]/30 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
                                        <Share2 className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="text-2xl font-black text-white">{product.shares || 0}</p>
                                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">{lang === 'ar' ? 'مشاركة' : 'Shares'}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-center text-center group hover:border-[#0066FF]/30 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                                        <ShoppingBag className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <p className="text-2xl font-black text-white">{product.salesCount || 0}</p>
                                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">{lang === 'ar' ? 'طلب' : 'Orders'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Info & Deeper Analytics */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-3xl font-black text-white mb-2">{lang === 'ar' ? product.nameAr || product.name : product.name}</h3>
                                <div className="flex items-center gap-4">
                                    <p className="text-2xl font-black text-[#0066FF]">{product.discountPrice || product.price} EGP</p>
                                    {product.discountPrice && <p className="text-lg text-zinc-600 line-through">{product.price} EGP</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-zinc-900/30 border border-white/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'إجمالي المبيعات' : 'Total Units Sold'}</p>
                                    </div>
                                    <p className="text-xl font-black">{product.totalUnitsSold || 0} {lang === 'ar' ? 'قطعة' : 'Units'}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-zinc-900/30 border border-white/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Package className="w-4 h-4 text-orange-500" />
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'المخزون المتوفر' : 'Current Stock'}</p>
                                    </div>
                                    <p className="text-xl font-black">{product.stock} {lang === 'ar' ? 'وحدة' : 'Units'}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/20 col-span-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Banknote className="w-4 h-4 text-[#0066FF]" />
                                        <p className="text-[10px] font-black text-[#0066FF] uppercase tracking-widest">{lang === 'ar' ? 'إجمالي الأرباح الفعلية' : 'Total Actual Revenue'}</p>
                                    </div>
                                    <p className="text-2xl font-black text-white">{product.revenue || 0} <span className="text-xs text-zinc-500">EGP</span></p>
                                    <p className="text-[9px] text-zinc-500 mt-1 italic">{lang === 'ar' ? '* تعتمد على الطلبات المستلمة (Delivered) فقط' : '* Based on Delivered orders only'}</p>
                                </div>
                            </div>

                            {/* Retention & Interest */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp className="w-3 h-3" /> User Interest Tracking
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col items-center">
                                        <Heart className="w-5 h-5 text-red-500 mb-2" />
                                        <p className="text-lg font-black">{product.favoriteCount || 0}</p>
                                        <p className="text-[8px] text-zinc-600 uppercase">{lang === 'ar' ? 'مفضلة' : 'Favorites'}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col items-center">
                                        <List className="w-5 h-5 text-purple-500 mb-2" />
                                        <p className="text-lg font-black">{product.wishlistCount || 0}</p>
                                        <p className="text-[8px] text-zinc-600 uppercase">{lang === 'ar' ? 'قائمة الأمنيات' : 'Wishlist'}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 flex flex-col items-center">
                                        <Star className="w-5 h-5 text-yellow-500 mb-2" />
                                        <p className="text-lg font-black">{product.reviewCount || 0}</p>
                                        <p className="text-[8px] text-zinc-600 uppercase">{lang === 'ar' ? 'تقييم' : 'Reviews'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{lang === 'ar' ? 'وصف المنتج' : 'Description'}</h4>
                                <div className={`p-6 rounded-3xl bg-zinc-900/50 border border-white/5 text-sm text-zinc-400 leading-relaxed max-h-[200px] overflow-y-auto ${lang === 'ar' ? 'text-end' : 'text-start'}`}>
                                    {lang === 'ar' ? product.descriptionAr || product.description : product.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-zinc-900/50 flex justify-end shrink-0">
                    <Button onClick={onClose} className="px-8 h-12 rounded-2xl bg-zinc-800 text-white font-bold hover:bg-zinc-700">
                        {lang === 'ar' ? 'إغلاق' : 'Close'}
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}

function CategoriesModal({ onClose }: { onClose: () => void }) {
    const { lang } = useLanguage()
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editId, setEditId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ name: "", nameAr: "", nameEn: "" })
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null })

    const fetchCategories = async () => {
        const res = await fetch("/api/admin/categories")
        setCategories(await res.json())
        setLoading(false)
    }

    useEffect(() => { fetchCategories() }, [])

    const handleSave = async () => {
        if (!formData.name || !formData.nameAr || !formData.nameEn) {
            toast.error(lang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields')
            return
        }
        const method = editId ? "PUT" : "POST"
        const payload = editId ? { id: editId, ...formData } : formData
        const res = await fetch("/api/admin/categories", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        if (res.ok) {
            toast.success(lang === 'ar' ? 'تم الحفظ' : 'Saved')
            setEditId(null)
            setIsAddOpen(false)
            setFormData({ name: "", nameAr: "", nameEn: "" })
            fetchCategories()
        } else {
            const error = await res.json()
            toast.error(error.error || "Failed to save category")
        }
    }

    const handleDelete = async (id: string) => {
        await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" })
        fetchCategories()
        toast.success(lang === 'ar' ? "تم الحذف" : "Deleted")
        setConfirmDelete({ isOpen: false, id: null })
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Tags className="w-5 h-5 text-purple-500" /> {lang === 'ar' ? 'إدارة الفئات' : 'Categories Management'}
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">{lang === 'ar' ? 'أضف أو عدل فئات المنتجات في المتجر' : 'Add or edit product categories'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setIsAddOpen(true); setEditId(null); setFormData({ name: "", nameAr: "", nameEn: "" }) }}
                            className="bg-[#0066FF] text-white p-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-6">
                    {(isAddOpen || editId) && (
                        <div className="mb-6 p-4 rounded-2xl bg-zinc-900/50 border border-white/10 space-y-4">
                            <h3 className="text-sm font-bold">{editId ? (lang === 'ar' ? 'تعديل قائمة' : 'Edit Category') : (lang === 'ar' ? 'إضافة قائمة جديدة' : 'Add New Category')}</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-zinc-500 mb-1 block">Slug (e.g. workstations)</label>
                                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2 px-3 text-sm focus:border-[#0066FF] outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-zinc-500 mb-1 block">Name (EN)</label>
                                        <input value={formData.nameEn} onChange={e => setFormData({ ...formData, nameEn: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2 px-3 text-sm focus:border-[#0066FF] outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-500 mb-1 block">الاسم (AR)</label>
                                        <input value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2 px-3 text-sm focus:border-[#0066FF] outline-none text-end" />
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button onClick={handleSave} className="flex-1 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-bold hover:bg-blue-500">
                                        {lang === 'ar' ? 'حفظ' : 'Save'}
                                    </button>
                                    <button onClick={() => { setIsAddOpen(false); setEditId(null) }} className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-xs hover:text-white">
                                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
                        </div>
                    ) : categories.length === 0 && !isAddOpen ? (
                        <div className="text-center py-20">
                            <Tags className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500">{lang === 'ar' ? 'لا توجد فئات حالياً.' : 'No categories found.'}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {categories.map(c => (
                                <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-white/5">
                                    <div>
                                        <p className="font-bold text-white text-sm">{lang === 'ar' ? c.nameAr : c.nameEn}</p>
                                        <p className="text-xs text-zinc-500 font-mono mt-1">/{c.name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditId(c.id); setFormData({ name: c.name, nameAr: c.nameAr, nameEn: c.nameEn }); setIsAddOpen(false); }} className="p-2 rounded-xl bg-zinc-800 border border-white/5 text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all">
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => setConfirmDelete({ isOpen: true, id: c.id })} className="p-2 rounded-xl bg-zinc-800 border border-white/5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <ConfirmDialog
                    isOpen={confirmDelete.isOpen}
                    title={lang === 'ar' ? 'حذف الفئة؟' : 'Delete Category?'}
                    message={lang === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذه الفئة؟' : 'Are you sure you want to delete this category?'}
                    confirmText={lang === 'ar' ? 'حذف' : 'Delete'}
                    cancelText={lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
                    onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
                />
            </motion.div>
        </div>
    )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminProducts() {
    const { lang } = useLanguage()
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
    const [isShippingOpen, setIsShippingOpen] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [viewingProduct, setViewingProduct] = useState<any>(null)
    const [allZones, setAllZones] = useState<any[]>([])
    const [selectedZones, setSelectedZones] = useState<string[]>([])
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null })
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    const [formData, setFormData] = useState({
        name: "", nameAr: "", description: "", descriptionAr: "",
        price: "", discountPrice: "", category: "workstations",
        stock: "10", tag: "NEW", image: "", gallery: ""
    })

    useEffect(() => {
        fetchProducts()
        fetch("/api/admin/shipping").then(r => r.json()).then(setAllZones)
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/admin/categories")
            setCategories(await res.json())
        } catch { toast.error("Failed to load categories") }
    }

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name || "",
                nameAr: editingProduct.nameAr || "",
                description: editingProduct.description || "",
                descriptionAr: editingProduct.descriptionAr || "",
                price: editingProduct.price?.toString() || "",
                discountPrice: editingProduct.discountPrice?.toString() || "",
                category: editingProduct.category || "workstations",
                stock: editingProduct.stock?.toString() || "10",
                tag: editingProduct.tag || "NEW",
                image: editingProduct.image || "",
                gallery: editingProduct.gallery || ""
            })
            setSelectedZones(editingProduct.shippingZones ? JSON.parse(editingProduct.shippingZones) : [])
        } else {
            setFormData({ name: "", nameAr: "", description: "", descriptionAr: "", price: "", discountPrice: "", category: "workstations", stock: "10", tag: "NEW", image: "", gallery: "" })
            setSelectedZones([])
        }
    }, [editingProduct])

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products")
            setProducts(await res.json())
        } catch { toast.error("Failed to load products") }
        finally { setIsLoading(false) }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const method = editingProduct ? "PUT" : "POST"
            const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
                    stock: parseInt(formData.stock),
                    shippingZones: selectedZones.length > 0 ? JSON.stringify(selectedZones) : null
                })
            })
            if (res.ok) {
                toast.success(editingProduct ? "Product updated!" : "Product added!")
                setIsAddModalOpen(false)
                setEditingProduct(null)
                fetchProducts()
            }
        } catch { toast.error("Error saving product") }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Deleted");
                fetchProducts();
                setConfirmDelete({ isOpen: false, id: null });
            }
        } catch { toast.error("Error deleting") }
    }

    const filteredProducts = products.filter((p: any) => {
        const nameMatch = (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (p.nameAr || "").toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = selectedCategory === "all" || p.category === selectedCategory || (p.tag === selectedCategory);
        return nameMatch && categoryMatch;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'المنتجات' : 'Products Management'}</h1>
                    <p className="text-zinc-500">{lang === 'ar' ? 'أضف أو عدل منتجات المتجر.' : 'Add or edit store products.'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <Package className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-sm font-bold">{products.length}</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'منتج' : 'products'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Categories Button */}
                        <Button
                            onClick={() => setIsCategoriesOpen(true)}
                            className="bg-[#0066FF] hover:bg-blue-600 text-white border-none rounded-2xl h-12 px-5 flex items-center gap-2 font-black shadow-lg shadow-blue-500/20 transition-all"
                        >
                            <Tags className="w-4 h-4 text-white" />
                            {lang === 'ar' ? 'الفئات' : 'Categories'}
                        </Button>
                        {/* Shipping Button */}
                        <Button
                            onClick={() => setIsShippingOpen(true)}
                            className="bg-[#0066FF] hover:bg-blue-600 text-white border-none rounded-2xl h-12 px-5 flex items-center gap-2 font-black shadow-lg shadow-blue-500/20 transition-all"
                        >
                            <Truck className="w-4 h-4 text-white" />
                            {lang === 'ar' ? 'الشحن' : 'Shipping'}
                        </Button>
                        {/* Add Product Button */}
                        <Link href="/admin/products/new">
                            <Button
                                className="bg-[#0066FF] hover:bg-blue-600 text-white border-none rounded-2xl h-12 px-6 flex items-center gap-2 group font-black shadow-lg shadow-blue-500/20 transition-all"
                            >
                                <Plus className="w-5 h-5 text-white transition-transform group-hover:rotate-90" />
                                {lang === 'ar' ? 'إضافة منتج' : 'Add Product'}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className={`absolute top-3.5 ${lang === 'ar' ? 'right-4' : 'left-4'} w-5 h-5 text-zinc-600`} />
                    <input
                        type="text"
                        placeholder={lang === 'ar' ? 'ابحث عن منتج...' : 'Search products...'}
                        className={`w-full bg-zinc-950 border border-white/5 rounded-2xl py-3.5 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-sm focus:border-[#0066FF] outline-none transition-all`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className={`absolute top-3.5 ${lang === 'ar' ? 'right-4' : 'left-4'} w-4 h-4 text-zinc-600`} />
                    <select
                        className={`bg-zinc-950 border border-white/5 rounded-2xl py-3.5 ${lang === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} text-sm focus:border-[#0066FF] outline-none transition-all appearance-none min-w-[160px] text-zinc-400 cursor-pointer`}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">{lang === 'ar' ? 'كل الفئات' : 'All Categories'}</option>
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.name}>
                                {lang === 'ar' ? cat.nameAr : cat.nameEn}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className={`absolute top-4 ${lang === 'ar' ? 'left-4' : 'right-4'} w-4 h-4 text-zinc-600 pointer-events-none`} />
                </div>
            </div>

            {/* Products table */}
            <div className="bg-zinc-950 border border-white/5 rounded-4xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-start">
                        <thead>
                            <tr className="border-b border-white/5 bg-zinc-900/50">
                                <th className="px-6 py-5 text-zinc-500 text-xs font-bold uppercase tracking-widest text-start">{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                                <th className="px-6 py-5 text-zinc-500 text-xs font-bold uppercase tracking-widest text-start">{lang === 'ar' ? 'الفئة' : 'Category'}</th>
                                <th className="px-6 py-5 text-zinc-500 text-xs font-bold uppercase tracking-widest text-start">{lang === 'ar' ? 'السعر' : 'Price'}</th>
                                <th className="px-6 py-5 text-zinc-500 text-xs font-bold uppercase tracking-widest text-start">{lang === 'ar' ? 'الشحن' : 'Shipping'}</th>
                                <th className="px-6 py-5 text-zinc-500 text-xs font-bold uppercase tracking-widest text-start">{lang === 'ar' ? 'المخزون' : 'Stock'}</th>
                                <th className="px-6 py-5 text-zinc-500 text-xs font-bold uppercase tracking-widest text-end">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr><td colSpan={6} className="px-6 py-20 text-center">
                                    <Loader2 className="w-10 h-10 animate-spin text-[#0066FF] mx-auto" />
                                </td></tr>
                            ) : filteredProducts.length > 0 ? filteredProducts.map((p: any) => {
                                const zones = p.shippingZones ? JSON.parse(p.shippingZones) : []
                                return (
                                    <tr key={p.id} className="hover:bg-white/5 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                    {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-zinc-700" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm truncate max-w-[200px]">{lang === 'ar' ? p.nameAr || p.name : p.name}</p>
                                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{p.tag || p.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-400 capitalize">{p.category}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                {p.discountPrice ? (
                                                    <><span className="text-emerald-500 font-bold text-sm">{p.discountPrice} EGP</span>
                                                      <span className="text-[10px] text-zinc-500 line-through">{p.price} EGP</span></>
                                                ) : <span className="font-bold text-sm">{p.price} EGP</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {zones.length === 0
                                                ? <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-400 font-bold">{lang === 'ar' ? 'كل مصر' : 'All Egypt'}</span>
                                                : <span className="text-[10px] px-2 py-1 rounded-full bg-[#0066FF]/10 text-[#0066FF] font-bold">{zones.length} {lang === 'ar' ? 'محافظة' : 'Zones'}</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <span className="text-sm font-medium">{p.stock} {lang === 'ar' ? 'وحدة' : 'units'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-end">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setViewingProduct(p)}
                                                    className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-500 hover:text-[#0066FF] hover:bg-[#0066FF]/10 transition-all"
                                                    title={lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => { setEditingProduct(p); setIsAddModalOpen(true) }}
                                                    className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setConfirmDelete({ isOpen: true, id: p.id })}
                                                    className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-zinc-500 font-medium">
                                        {lang === 'ar' ? 'لا توجد منتجات تطابق البحث' : 'No products found matching your search'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Edit Modal (kept for editing, but adding is now on a new page) */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 overflow-y-auto pt-20 pb-20">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-4xl shadow-2xl overflow-hidden my-auto"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                                <div>
                                    <h2 className="text-2xl font-bold">{editingProduct ? (lang === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}</h2>
                                    <p className="text-xs text-zinc-500 mt-1">{lang === 'ar' ? 'أكمل بيانات المنتج بدقة.' : 'Fill in the product details correctly.'}</p>
                                </div>
                                <button onClick={() => { setIsAddModalOpen(false); setEditingProduct(null) }} className="p-3 hover:bg-white/5 rounded-2xl transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10">
                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Product Name (EN)</label>
                                            <input required className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white font-medium" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Product Name (AR)</label>
                                            <input required className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-end text-white font-medium" value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? "السعر (ج.م)" : "Price (EGP)"}</label>
                                                <input type="number" step="0.01" required className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? "سعر الخصم (ج.م)" : "Discount Price (EGP)"}</label>
                                                <input type="number" step="0.01" className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none" value={formData.discountPrice} onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Category</label>
                                            <div className="relative">
                                                <select className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none appearance-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                    {categories.map(cat => <option key={cat.id} value={cat.name}>{lang === 'ar' ? cat.nameAr : cat.nameEn}</option>)}
                                                </select>
                                                <ChevronDown className="absolute top-5 right-6 w-4 h-4 text-zinc-500 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Stock</label>
                                                <input type="number" required className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Tag</label>
                                                <input className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none" value={formData.tag} placeholder="NEW, SALE, etc." onChange={e => setFormData({ ...formData, tag: e.target.value })} />
                                            </div>
                                        </div>

                                        {/* ── Shipping Zones ── */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                <Truck className="w-3.5 h-3.5 text-[#0066FF]" />
                                                Shipping Zones
                                            </label>
                                            {allZones.length === 0 ? (
                                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900 border border-white/5 text-sm text-zinc-500">
                                                    <Truck className="w-4 h-4 text-zinc-700" />
                                                    أضف مناطق الشحن أولاً من زر "Shipping"
                                                </div>
                                            ) : (
                                                <ZonePicker allZones={allZones} selected={selectedZones} onChange={setSelectedZones} />
                                            )}
                                            <p className="text-[10px] text-zinc-600">
                                                {selectedZones.length === 0 ? '⚡ فارغ = يشحن لجميع المحافظات تلقائياً' : `✓ ${selectedZones.length} محافظة محددة`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Main Image URL</label>
                                            <div className="flex gap-4 items-center">
                                                <input className="flex-1 bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none" value={formData.image} placeholder="https://..." onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                                {formData.image && <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden shrink-0"><img src={formData.image} className="w-full h-full object-cover" /></div>}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Gallery URLs (comma separated)</label>
                                            <textarea className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none min-h-[80px]" value={formData.gallery} placeholder="url1, url2, url3..." onChange={e => setFormData({ ...formData, gallery: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Description (EN)</label>
                                            <textarea className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none min-h-[100px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Description (AR)</label>
                                            <textarea className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-end min-h-[100px]" value={formData.descriptionAr} onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-white/5">
                                    <Button type="button" onClick={() => { setIsAddModalOpen(false); setEditingProduct(null) }}
                                        className="flex-1 h-16 rounded-4xl border border-zinc-800 text-zinc-500 hover:text-white transition-all bg-transparent font-bold">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1 h-16 rounded-4xl bg-[#0066FF] hover:bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-500/20 uppercase tracking-widest">
                                        {editingProduct ? 'Save Changes' : 'Create Product'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Shipping Modal */}
            <AnimatePresence>
                {isShippingOpen && <ShippingModal onClose={() => setIsShippingOpen(false)} />}
            </AnimatePresence>

            {/* Categories Modal */}
            <AnimatePresence>
                {isCategoriesOpen && <CategoriesModal onClose={() => setIsCategoriesOpen(false)} />}
            </AnimatePresence>

            {/* Product Detail Modal */}
            <AnimatePresence>
                {viewingProduct && (
                    <ProductDetailModal 
                        product={viewingProduct} 
                        lang={lang} 
                        onClose={() => setViewingProduct(null)} 
                    />
                )}
            </AnimatePresence>

            {/* Final deletion confirm */}
            <ConfirmDialog 
                isOpen={confirmDelete.isOpen}
                onConfirm={() => confirmDelete.id && handleDelete(confirmDelete.id)}
                onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
                title={lang === 'ar' ? 'حذف المنتج؟' : 'Delete Product?'}
                message={lang === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً؟' : 'Are you sure you want to permanently delete this product?'}
                confirmText={lang === 'ar' ? 'حذف' : 'Delete'}
                cancelText={lang === 'ar' ? 'إلغاء' : 'Cancel'}
            />
        </div>
    )
}
