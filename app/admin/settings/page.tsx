"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Shield, User, Mail, Globe, Edit2, Loader2, Save, X, Phone, MessageSquare, Briefcase, MapPin, AtSign, Bell } from "lucide-react"
import { useLanguage } from "@/lib/i18n-context"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function AdminSettings() {
    const { data: session, update } = useSession()
    const { lang } = useLanguage()
    
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [userData, setUserData] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        phone: "",
        whatsapp: "",
        position: "",
        governorate: "",
        role: "ADMIN"
    })

    const [admins, setAdmins] = useState<any[]>([])
    const [isAdminLoading, setIsAdminLoading] = useState(false)

    const fetchAdmins = async () => {
        setIsAdminLoading(true)
        try {
            const res = await fetch("/api/admin/customers?role=ADMIN")
            if (res.ok) {
                const data = await res.json()
                setAdmins(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error("Failed to fetch admins")
        } finally {
            setIsAdminLoading(false)
        }
    }

    const fetchUserData = async () => {
        const userId = (session?.user as any)?.id
        if (!userId) return

        try {
            const res = await fetch(`/api/admin/customers/${userId}`)
            if (res.ok) {
                const data = await res.json()
                setUserData(data)
                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    username: data.username || "",
                    password: "",
                    phone: data.phone || "",
                    whatsapp: data.whatsapp || "",
                    position: data.position || "",
                    governorate: data.governorate || "",
                    role: data.role || "ADMIN"
                })
            }
        } catch (error) {
            console.error("Failed to fetch user data")
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        if ((session?.user as any)?.id) {
            fetchUserData()
        }
    }, [(session?.user as any)?.id])

    useEffect(() => {
        if (!isEditing) {
            fetchAdmins()
        }
    }, [isEditing])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const userId = (session?.user as any)?.id
        if (!userId) return

        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/customers/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success(lang === 'ar' ? "تم تحديث الإعدادات بنجاح" : "Settings updated successfully")
                setIsEditing(false)
                setFormData(prev => ({ ...prev, password: "" })) 
                
                await fetchUserData()
                
                await update({
                    name: formData.name,
                    email: formData.email,
                    username: formData.username,
                    phone: formData.phone,
                    whatsapp: formData.whatsapp,
                    position: formData.position,
                    governorate: formData.governorate
                })
            } else {
                const err = await res.json()
                toast.error(err.error || (lang === 'ar' ? "حدث خطأ ما" : "Something went wrong"))
            }
        } catch (error) {
            toast.error(lang === 'ar' ? "فشل التحديث" : "Failed to update")
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching && !userData) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#0066FF]" />
                <p className="text-zinc-500 animate-pulse">{lang === 'ar' ? 'جاري تحميل الإعدادات...' : 'Loading settings...'}</p>
            </div>
        )
    }

    const governorates = [
        "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", 
        "Gharbia", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", 
        "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", 
        "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"
    ]

    return (
        <div className="space-y-6 max-w-4xl pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'الإعدادات' : 'Settings'}</h1>
                    <p className="text-zinc-500">{lang === 'ar' ? 'إعدادات حسابك والبيانات الشخصية.' : 'Manage your account and personal info.'}</p>
                </div>
                <div className="flex items-center gap-4">
                    {!isEditing && (
                        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                            <Shield className="w-4 h-4 text-[#0066FF]" />
                            <span className="text-sm font-bold">{admins.length}</span>
                            <span className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'مدير' : 'admins'}</span>
                        </div>
                    )}
                    {!isEditing && (
                        <Button onClick={() => setIsEditing(true)} className="bg-[#0066FF] hover:bg-blue-600 rounded-2xl h-12 px-6 flex items-center gap-2 group shadow-lg text-white shadow-blue-500/20">
                            <Edit2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                            {lang === 'ar' ? 'تعديل الحساب' : 'Edit Account'}
                        </Button>
                    )}
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-3xl bg-zinc-950 border border-white/5 overflow-hidden p-8 space-y-8 shadow-2xl">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                            <div className="p-2.5 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20">
                                <User className="w-5 h-5 text-[#0066FF]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">{lang === 'ar' ? 'تحديث البيانات الشخصية' : 'Update Personal Information'}</h2>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{lang === 'ar' ? 'قم بتحديث بياناتك لتظهر بشكل صحيح في النظام' : 'Update your details to appear correctly in the system'}</p>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                                <input 
                                    required 
                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all shadow-inner" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                                <input 
                                    required 
                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all shadow-inner" 
                                    value={formData.username} 
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                                <input 
                                    required 
                                    type="email" 
                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all shadow-inner" 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                                <input 
                                    type="password" 
                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all shadow-inner" 
                                    value={formData.password} 
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                    placeholder={lang === 'ar' ? "اتركه فارغاً دون تغيير" : "Leave blank to keep unchanged"} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                                <input 
                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all shadow-inner" 
                                    value={formData.phone} 
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</label>
                                <input 
                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all shadow-inner" 
                                    value={formData.whatsapp} 
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'المسمى الوظيفي' : 'Job Position'}</label>
                                <input 
                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all shadow-inner" 
                                    value={formData.position} 
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{lang === 'ar' ? 'المحافظة' : 'Governorate'}</label>
                                <select 
                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 px-6 focus:border-[#0066FF] outline-none text-white transition-all appearance-none"
                                    value={formData.governorate}
                                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                                >
                                    <option value="">{lang === 'ar' ? 'اختر الموقع' : 'Select Location'}</option>
                                    {governorates.map(gov => (
                                        <option key={gov} value={gov}>{gov}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <Button type="button" onClick={() => setIsEditing(false)} className="flex-1 h-16 rounded-3xl border border-white/5 bg-zinc-900 text-white hover:bg-zinc-800 font-bold uppercase tracking-widest text-xs">
                                <X className="w-5 h-5 mr-2" />
                                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                            </Button>
                            <Button type="submit" disabled={isLoading} className="flex-1 h-16 rounded-3xl bg-[#0066FF] hover:bg-blue-600 text-white font-black text-sm shadow-2xl shadow-blue-500/30 uppercase tracking-[0.2em]">
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" />
                                        {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <>
                    {/* Profile Section */}
                    <div className="rounded-3xl bg-zinc-950 border border-white/5 overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-zinc-500" />
                                <h2 className="text-sm font-bold">{lang === 'ar' ? 'معلومات الحساب' : 'Account Information'}</h2>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-black bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                                <Shield className="w-3 h-3" />
                                {lang === 'ar' ? 'مدير النظام' : 'SYSTEM ADMIN'}
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-[#0066FF] to-purple-600 flex items-center justify-center font-black text-4xl text-white border-2 border-white/10 shadow-2xl shadow-[#0066FF]/20 shrink-0">
                                    {userData?.name?.[0]?.toUpperCase() || 'A'}
                                </div>
                                <div className="flex-1 text-center md:text-start space-y-4">
                                    <div>
                                        <h3 className="font-black text-3xl mb-1 text-white">{userData?.name || 'Admin'}</h3>
                                        <p className="text-zinc-500 font-medium flex items-center justify-center md:justify-start gap-2">
                                            <AtSign className="w-4 h-4 text-[#0066FF]" />
                                            {userData?.username || 'ghost_admin'}
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/2 border border-white/5">
                                            <Mail className="w-4 h-4 text-zinc-500" />
                                            <span className="text-zinc-400 font-medium">{userData?.email}</span>
                                        </div>
                                        {userData?.phone && (
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/2 border border-white/5">
                                                <Phone className="w-4 h-4 text-zinc-500" />
                                                <span className="text-zinc-400 font-medium">{userData?.phone}</span>
                                            </div>
                                        )}
                                        {userData?.whatsapp && (
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/2 border border-white/5">
                                                <MessageSquare className="w-4 h-4 text-emerald-500" />
                                                <span className="text-zinc-400 font-medium">{userData?.whatsapp}</span>
                                            </div>
                                        )}
                                        {userData?.position && (
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/2 border border-white/5">
                                                <Briefcase className="w-4 h-4 text-purple-500" />
                                                <span className="text-zinc-400 font-medium">{userData?.position}</span>
                                            </div>
                                        )}
                                        {userData?.governorate && (
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/2 border border-white/5">
                                                <MapPin className="w-4 h-4 text-rose-500" />
                                                <span className="text-zinc-400 font-medium">{userData?.governorate}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/5 hover:border-[#0066FF]/30 transition-all group overflow-hidden relative shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066FF]/5 blur-3xl rounded-full" />
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5">
                                    <Globe className="w-5 h-5 text-zinc-400 group-hover:text-[#0066FF] transition-colors" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#0066FF] bg-[#0066FF]/10 px-3 py-1 rounded-full">{lang === 'ar' ? 'النظام' : 'System'}</span>
                            </div>
                            <h4 className="text-lg font-bold mb-1">{lang === 'ar' ? 'اللغة الافتراضية' : 'Default Language'}</h4>
                            <p className="text-sm text-zinc-500 mb-6">{lang === 'ar' ? 'تغيير لغة لوحة التحكم' : 'Change dashboard display language'}</p>
                            <div className="p-4 rounded-2xl bg-white/2 border border-white/5 font-black text-sm">
                                {lang === 'ar' ? 'العربية' : 'English (United States)'}
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-zinc-950 border border-white/5 hover:border-purple-500/30 transition-all group overflow-hidden relative shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5">
                                    <Bell className="w-5 h-5 text-zinc-400 group-hover:text-purple-500 transition-colors" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 bg-purple-500/10 px-3 py-1 rounded-full">{lang === 'ar' ? 'تنبيه' : 'Alert'}</span>
                            </div>
                            <h4 className="text-lg font-bold mb-1">{lang === 'ar' ? 'إشعارات النظام' : 'System Notifications'}</h4>
                            <p className="text-sm text-zinc-500 mb-6">{lang === 'ar' ? 'استلام تنبيهات العمليات الجديدة' : 'Receive alerts for new operations'}</p>
                            <div className="p-4 rounded-2xl bg-white/2 border border-white/5 font-black text-sm text-emerald-500">
                                {lang === 'ar' ? 'مفعلة' : 'Active & Enabled'}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-zinc-950 border border-white/5 overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-[#0066FF]" />
                                <h2 className="text-sm font-bold">{lang === 'ar' ? 'حسابات الأدمن المفعلة' : 'Active Admin Accounts'}</h2>
                            </div>
                            <div className="text-[10px] text-zinc-500 font-black bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest">
                                {admins.length} {lang === 'ar' ? 'حساب' : 'Accounts'}
                            </div>
                        </div>
                        <div className="p-6">
                            {isAdminLoading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-[#0066FF]" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {admins.map((admin) => (
                                        <div key={admin.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-[#0066FF]/20 transition-all">
                                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0066FF]/20 to-purple-600/20 flex items-center justify-center font-bold text-white border border-white/5 shrink-0">
                                                {admin.name?.[0]?.toUpperCase() || 'A'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white truncate">{admin.name}</p>
                                                <p className="text-[10px] text-zinc-500 truncate">@{admin.username || 'admin'}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-500">{lang === 'ar' ? 'نشط' : 'Active'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
