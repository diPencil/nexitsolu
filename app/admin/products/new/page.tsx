"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
    Plus, Search, Filter, Edit, Trash2, Package,
    X, Loader2, Truck, MapPin, DollarSign, CheckSquare,
    Square, ChevronDown, Globe, Save, ArrowLeft
} from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// --- Reuse ZonePicker and EG_GOVERNORATES ---
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
    { name: "red_sea",         nameAr: "البحر الأحمر",    nameEn: "Red Sea",          price: 0 },
    { name: "sharm_el_sheikh", nameAr: "شرم الشيخ",       nameEn: "Sharm El-Sheikh",  price: 0 },
    { name: "matrouh",         nameAr: "مطروح",           nameEn: "Matrouh",          price: 0 },
]

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
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-zinc-900/50">
                        <button type="button" onClick={() => onChange(allZones.map(z => z.name))} className="text-xs font-bold text-[#0066FF] hover:underline">Select All</button>
                        <button type="button" onClick={() => onChange([])} className="text-xs font-bold text-red-400 hover:underline">Clear All</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {allZones.map(z => (
                            <button key={z.name} type="button" onClick={() => toggle(z.name)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all text-start ${selected.includes(z.name) ? 'bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/30' : 'text-zinc-400 hover:bg-white/5 border border-transparent'}`}>
                                {selected.includes(z.name) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-zinc-700" />}
                                <span className="font-bold truncate">{lang === 'ar' ? z.nameAr : z.nameEn}</span>
                            </button>
                        ))}
                    </div>
                    <div className="px-4 py-3 border-t border-white/5 bg-zinc-900/30">
                        <button type="button" onClick={() => setOpen(false)} className="w-full text-sm font-bold text-white bg-[#0066FF] hover:bg-blue-500 py-2 rounded-xl">Done ✓</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function NewProductPage() {
    const { lang } = useLanguage()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [allZones, setAllZones] = useState<any[]>([])
    const [selectedZones, setSelectedZones] = useState<string[]>([])
    const [categories, setCategories] = useState<any[]>([])
    
    const [formData, setFormData] = useState({
        name: "", nameAr: "", description: "", descriptionAr: "",
        longDescription: "", longDescriptionAr: "",
        price: "", discountPrice: "", category: "",
        stock: "10", tag: "NEW", image: "", gallery: ""
    })

    useEffect(() => {
        fetch("/api/admin/shipping").then(r => r.json()).then(setAllZones)
        fetch("/api/admin/categories").then(r => r.json()).then(setCategories)
    }, [])

    useEffect(() => {
        if (!categories.length) return
        setFormData((fd) => {
            if (fd.category && categories.some((c: any) => c.name === fd.category)) return fd
            return { ...fd, category: categories[0].name }
        })
    }, [categories])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch("/api/products", {
                method: "POST",
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
                toast.success(lang === 'ar' ? "تم إضافة المنتج!" : "Product added!")
                router.push("/admin/products")
            }
        } catch { toast.error("Error saving product") }
        finally { setIsLoading(false) }
    }

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" className="rounded-2xl gap-2 text-zinc-500 hover:text-white" onClick={() => router.push("/admin/products")}>
                    <ArrowLeft className="w-4 h-4" />
                    {lang === 'ar' ? "رجوع" : "Back"}
                </Button>
                <div>
                   <h1 className="text-3xl font-black text-center">{lang === 'ar' ? "إضافة منتج جديد" : "Add New Product"}</h1>
                   <p className="text-zinc-500 text-sm text-center mt-1">Create a fresh product listing for NexIT Store</p>
                </div>
                <div className="w-20" /> {/* Spacer */}
            </div>

            <form onSubmit={handleSubmit} className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                {/* Glow behind */}
                <div className="absolute -right-32 -top-32 w-96 h-96 bg-[#0066FF]/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="grid lg:grid-cols-2 gap-10 relative z-10">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Product Title (English)</label>
                            <input required className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 focus:border-[#0066FF] outline-none text-white font-bold transition-all shadow-inner" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Arabic Title</label>
                            <input required className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 focus:border-[#0066FF] outline-none text-end text-white font-bold transition-all shadow-inner" value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Base Price (EGP)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0066FF]" />
                                    <input type="number" step="0.01" required className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 focus:border-[#0066FF] outline-none font-black text-emerald-500" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Special Price</label>
                                <input type="number" step="0.01" className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 focus:border-[#0066FF] outline-none font-bold text-zinc-400" value={formData.discountPrice} onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Category</label>
                                <select className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 focus:border-[#0066FF] outline-none appearance-none font-bold" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    {categories.length > 0 ? (
                                        categories.map(cat => <option key={cat.id} value={cat.name}>{lang === 'ar' ? cat.nameAr : cat.nameEn}</option>)
                                    ) : (
                                        <option value="">{lang === 'ar' ? 'أضف فئة من لوحة المنتجات أولاً' : 'Add a category from Products admin first'}</option>
                                    )}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Inventory Stock</label>
                                <input type="number" required className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 focus:border-[#0066FF] outline-none font-bold" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                <Truck className="w-3.5 h-3.5 text-[#0066FF]" />
                                Shipping Coverage
                            </label>
                            <ZonePicker allZones={allZones} selected={selectedZones} onChange={setSelectedZones} />
                            <p className="text-[9px] text-zinc-600 px-2">Leave empty to enable nationwide shipping.</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Main Cover Image</label>
                            <div className="group/img relative">
                                <input className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 focus:border-[#0066FF] outline-none transition-all" value={formData.image} placeholder="Paste direct image link..." onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                {formData.image && (
                                    <div className="mt-4 aspect-video rounded-3xl bg-zinc-900 border border-white/5 overflow-hidden shadow-2xl">
                                        <img src={formData.image} className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Image Gallery (Comma Separated)</label>
                            <textarea className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 focus:border-[#0066FF] outline-none min-h-[100px] text-sm" value={formData.gallery} placeholder="url1, url2, url3..." onChange={e => setFormData({ ...formData, gallery: e.target.value })} />
                        </div>
                        <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Short description (EN)</label>
                                <textarea className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 focus:border-[#0066FF] outline-none min-h-[120px] text-sm" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 text-end block">وصف قصير (AR)</label>
                                <textarea className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 focus:border-[#0066FF] outline-none min-h-[120px] text-sm text-end" value={formData.descriptionAr} onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Long description (EN)</label>
                                    <textarea className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 focus:border-[#0066FF] outline-none min-h-[200px] text-sm" value={formData.longDescription} placeholder="Full specs, details for the product page..." onChange={e => setFormData({ ...formData, longDescription: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 text-end block lg:text-start">وصف طويل (AR)</label>
                                    <textarea className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 px-6 focus:border-[#0066FF] outline-none min-h-[200px] text-sm text-end" value={formData.longDescriptionAr} onChange={e => setFormData({ ...formData, longDescriptionAr: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                    <Button type="button" variant="ghost" className="h-16 flex-1 rounded-3xl border border-white/5 bg-transparent text-zinc-500 hover:text-white" onClick={() => router.push("/admin/products")}>
                        Discard
                    </Button>
                    <Button disabled={isLoading} type="submit" className="h-16 flex-2 rounded-3xl bg-[#0066FF] hover:bg-blue-600 text-white font-black text-lg gap-3">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                        {"Publish Product"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
