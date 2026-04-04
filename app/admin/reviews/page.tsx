"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n-context"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Star, Trash2, CheckCircle, EyeOff, MessageSquare, RotateCcw, ShieldAlert, CircleSlash, XCircle, User } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useSession } from "next-auth/react"

type ReviewStatus = "APPROVED" | "HIDDEN" | "TRASHED"

export default function AdminReviews() {
    const { lang } = useLanguage()
    const { data: session } = useSession()
    const [reviews, setReviews] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [replyText, setReplyText] = useState<{ [key: string]: string }>({})
    const [activeTab, setActiveTab] = useState<string>("active")
    const [editingCommentIds, setEditingCommentIds] = useState<Set<string>>(new Set())
    const [editingReplyIds, setEditingReplyIds] = useState<Set<string>>(new Set())
    const [commentText, setCommentText] = useState<{ [key: string]: string }>({})
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
    const [editingMessageText, setEditingMessageText] = useState<{ [key: string]: string }>({})
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        confirmText: string;
        cancelText: string;
        onConfirm: () => void;
        danger?: boolean;
        icon?: React.ReactNode;
    }>({
        isOpen: false,
        title: "",
        message: "",
        confirmText: "",
        cancelText: "",
        onConfirm: () => {}
    })

    const fetchReviews = async () => {
        try {
            setIsLoading(true)
            const res = await fetch("/api/admin/reviews")
            if (res.ok) {
                const data = await res.json()
                setReviews(data)
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error)
            toast.error(lang === 'ar' ? 'فشل تحميل التقييمات' : 'Failed to load reviews')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    const handleUpdateStatus = async (id: string, status: ReviewStatus) => {
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))
                
                let message = ""
                if (status === "APPROVED") message = lang === 'ar' ? 'تمت الموافقة على التقييم' : 'Review approved'
                if (status === "HIDDEN") message = lang === 'ar' ? 'تم إخفاء التقييم' : 'Review hidden'
                if (status === "TRASHED") message = lang === 'ar' ? 'تم نقل التقييم إلى السلة' : 'Review moved to trash'
                
                toast.success(message)
            }
        } catch (error) {
            toast.error(lang === 'ar' ? 'حدث خطأ ما' : 'Something went wrong')
        }
    }

    const handleDeletePermanently = async (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: lang === 'ar' ? 'حذف نهائي؟' : 'Hard Delete?',
            message: lang === 'ar' ? 'هل أنت متأكد من حذف هذا التقييم نهائياً من قاعدة البيانات؟ لا يمكن التراجع!' : 'Are you sure you want to delete this permanently? This cannot be undone!',
            confirmText: lang === 'ar' ? 'حذف' : 'Delete',
            cancelText: lang === 'ar' ? 'تراجع' : 'Cancel',
            danger: true,
            icon: <Trash2 className="w-8 h-8 text-red-500" />,
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" })
                    if (res.ok) {
                        setReviews(prev => prev.filter(r => r.id !== id))
                        toast.success(lang === 'ar' ? 'تم الحذف نهائياً' : 'Deleted permanently')
                    }
                } catch (error) {
                    toast.error(lang === 'ar' ? 'فشل الحذف' : 'Failed to delete')
                } finally {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }))
                }
            }
        })
    }

    const confirmStatusUpdate = (id: string, status: ReviewStatus) => {
        let title = ""
        let message = ""
        let confirmText = ""
        let icon: React.ReactNode = null
        let danger = false

        if (status === 'HIDDEN') {
            title = lang === 'ar' ? 'إخفاء التقييم؟' : 'Hide Review?'
            message = lang === 'ar' ? 'هل تريد إخفاء هذا التقييم عن العملاء؟' : 'Do you want to hide this review from customers?'
            confirmText = lang === 'ar' ? 'إخفاء' : 'Hide'
            icon = <EyeOff className="w-8 h-8 text-yellow-500" />
            danger = false
        } else if (status === 'TRASHED') {
            title = lang === 'ar' ? 'نقل للسلة؟' : 'Move to Trash?'
            message = lang === 'ar' ? 'سيتم نقل التقييم إلى سلة المهملات.' : 'Review will be moved to the trash section.'
            confirmText = lang === 'ar' ? 'نقل' : 'Move'
            icon = <Trash2 className="w-8 h-8 text-red-500" />
            danger = true
        } else if (status === 'APPROVED') {
            title = lang === 'ar' ? 'استعادة التقييم؟' : 'Restore Review?'
            message = lang === 'ar' ? 'هل تريد إعادة هذا التقييم إلى القسم النشط؟' : 'Do you want to restore this review to the active section?'
            confirmText = lang === 'ar' ? 'استعادة' : 'Restore'
            icon = <RotateCcw className="w-8 h-8 text-blue-500" />
            danger = false
        }

        setConfirmModal({
            isOpen: true,
            title,
            message,
            confirmText,
            cancelText: lang === 'ar' ? 'إلغاء' : 'Cancel',
            danger,
            icon,
            onConfirm: () => {
                handleUpdateStatus(id, status)
                setConfirmModal(prev => ({ ...prev, isOpen: false }))
            }
        })
    }

    const handleReply = async (id: string) => {
        const text = replyText[id]
        if (!text?.trim()) return

        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reply: text })
            })
            if (res.ok) {
                const updatedReview = await res.json()
                setReviews(prev => prev.map(r => r.id === id ? { 
                    ...r, 
                    reply: updatedReview.reply,
                    messages: updatedReview.messages 
                } : r))
                setReplyText(prev => ({ ...prev, [id]: "" }))
                setEditingReplyIds(prev => {
                    const next = new Set(prev)
                    next.delete(id)
                    return next
                })
                toast.success(lang === 'ar' ? 'تم حفظ الرد بنجاح' : 'Reply saved successfully')
            }
        } catch (error) {
            toast.error(lang === 'ar' ? 'فشل حفظ الرد' : 'Failed to save reply')
        }
    }

    const handleUpdateComment = async (id: string) => {
        const text = commentText[id]
        if (!text?.trim()) return

        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment: text })
            })
            if (res.ok) {
                const updatedReview = await res.json()
                setReviews(prev => prev.map(r => r.id === id ? { ...r, comment: updatedReview.comment } : r))
                setEditingCommentIds(prev => {
                    const next = new Set(prev)
                    next.delete(id)
                    return next
                })
                toast.success(lang === 'ar' ? 'تم تحديث التعليق بنجاح' : 'Comment updated successfully')
            }
        } catch (error) {
            toast.error(lang === 'ar' ? 'فشل تحديث التعليق' : 'Failed to update comment')
        }
    }

    const handleUpdateMessageContent = async (messageId: string, reviewId: string) => {
        try {
            const content = editingMessageText[messageId]
            if (!content?.trim()) return

            const res = await fetch(`/api/admin/reviews/messages/${messageId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content })
            })

            if (res.ok) {
                const updatedMessage = await res.json()
                setReviews(prev => prev.map(r => r.id === reviewId ? {
                    ...r,
                    messages: r.messages.map((m: any) => m.id === messageId ? updatedMessage : m)
                } : r))
                setEditingMessageId(null)
                toast.success(lang === 'ar' ? 'تم تحديث الرسالة' : 'Message updated')
            }
        } catch (error) {
            toast.error(lang === 'ar' ? 'فشل تحديث الرسالة' : 'Failed to update message')
        }
    }

    const handleDeleteMessage = async (messageId: string, reviewId: string) => {
        setConfirmModal({
            isOpen: true,
            title: lang === 'ar' ? 'حذف الرسالة؟' : 'Delete message?',
            message: lang === 'ar' ? 'هل أنت متأكد من حذف هذه الرسالة من المحادثة؟' : 'Are you sure you want to delete this message from conversation?',
            confirmText: lang === 'ar' ? 'حذف' : 'Delete',
            cancelText: lang === 'ar' ? 'إلغاء' : 'Cancel',
            danger: true,
            icon: <Trash2 className="w-8 h-8 text-red-500" />,
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin/reviews/messages/${messageId}`, { method: "DELETE" })
                    if (res.ok) {
                        setReviews(prev => prev.map(r => r.id === reviewId ? {
                            ...r,
                            messages: r.messages.filter((m: any) => m.id !== messageId)
                        } : r))
                        toast.success(lang === 'ar' ? 'تم حذف الرسالة' : 'Message deleted')
                    }
                } catch (error) {
                    toast.error(lang === 'ar' ? 'فشل حذف الرسالة' : 'Failed to delete message')
                }
            }
        })
    }

    const filteredReviews = (status: string) => {
        if (status === "active") return reviews.filter(r => r.status === "APPROVED")
        if (status === "pending") return reviews.filter(r => r.status === "PENDING")
        if (status === "hidden") return reviews.filter(r => r.status === "HIDDEN")
        if (status === "trash") return reviews.filter(r => r.status === "TRASHED")
        return reviews
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20 min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground font-medium">{lang === 'ar' ? 'جاري التحميل...' : 'Fetching reviews...'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {lang === 'ar' ? 'إدارة التقييمات' : 'Reviews Management'}
                    </h1>
                    <p className="text-muted-foreground">
                        {lang === 'ar' ? 'تحكم في ما يكتبه العملاء بضغطة واحدة' : 'Monitor and moderate customer feedback in real-time.'}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-border px-4 py-2 rounded-2xl">
                        <Star className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-sm font-bold">{reviews.length}</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'تقييم' : 'reviews'}</span>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-muted border border-border p-1 rounded-2xl h-auto w-full flex flex-wrap gap-2">
                    <TabsTrigger value="active" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-xs font-black">
                        {lang === 'ar' ? 'النشطة' : 'Active'}
                        <span className="ml-2 bg-background/10 px-2 py-0.5 rounded-full text-[10px]">{reviews.filter(r => r.status === 'APPROVED').length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all text-xs font-black">
                        {lang === 'ar' ? 'المعلقة' : 'Pending'}
                        <span className="ml-2 bg-background/10 px-2 py-0.5 rounded-full text-[10px]">{reviews.filter(r => r.status === 'PENDING').length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="hidden" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-yellow-500 data-[state=active]:text-black transition-all text-xs font-black">
                        {lang === 'ar' ? 'المخفية' : 'Hidden'}
                        <span className="ml-2 bg-black/20 px-2 py-0.5 rounded-full text-[10px]">{reviews.filter(r => r.status === 'HIDDEN').length}</span>
                    </TabsTrigger>
                    <TabsTrigger value="trash" className="px-6 py-2.5 rounded-xl data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all text-xs font-black">
                        {lang === 'ar' ? 'السلة' : 'Trash'}
                        <span className="ml-2 bg-background/10 px-2 py-0.5 rounded-full text-[10px]">{reviews.filter(r => r.status === 'TRASHED').length}</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                    <ReviewList 
                        list={filteredReviews("active")} 
                        lang={lang} 
                        replyText={replyText} 
                        setReplyText={setReplyText} 
                        handleReply={handleReply} 
                        confirmStatusUpdate={confirmStatusUpdate} 
                        handleDeletePermanently={handleDeletePermanently}
                        commentText={commentText}
                        setCommentText={setCommentText}
                        editingCommentIds={editingCommentIds}
                        setEditingCommentIds={setEditingCommentIds}
                        editingReplyIds={editingReplyIds}
                        setEditingReplyIds={setEditingReplyIds}
                        handleUpdateComment={handleUpdateComment}
                        editingMessageId={editingMessageId}
                        setEditingMessageId={setEditingMessageId}
                        editingMessageText={editingMessageText}
                        setEditingMessageText={setEditingMessageText}
                        handleUpdateMessageContent={handleUpdateMessageContent}
                        handleDeleteMessage={handleDeleteMessage}
                    />
                </TabsContent>
                <TabsContent value="pending">
                    <ReviewList 
                        list={filteredReviews("pending")} 
                        lang={lang} 
                        replyText={replyText} 
                        setReplyText={setReplyText} 
                        handleReply={handleReply} 
                        confirmStatusUpdate={confirmStatusUpdate} 
                        handleDeletePermanently={handleDeletePermanently}
                        commentText={commentText}
                        setCommentText={setCommentText}
                        editingCommentIds={editingCommentIds}
                        setEditingCommentIds={setEditingCommentIds}
                        editingReplyIds={editingReplyIds}
                        setEditingReplyIds={setEditingReplyIds}
                        handleUpdateComment={handleUpdateComment}
                        editingMessageId={editingMessageId}
                        setEditingMessageId={setEditingMessageId}
                        editingMessageText={editingMessageText}
                        setEditingMessageText={setEditingMessageText}
                        handleUpdateMessageContent={handleUpdateMessageContent}
                        handleDeleteMessage={handleDeleteMessage}
                    />
                </TabsContent>
                <TabsContent value="hidden">
                    <ReviewList 
                        list={filteredReviews("hidden")} 
                        lang={lang} 
                        replyText={replyText} 
                        setReplyText={setReplyText} 
                        handleReply={handleReply} 
                        confirmStatusUpdate={confirmStatusUpdate} 
                        handleDeletePermanently={handleDeletePermanently}
                        commentText={commentText}
                        setCommentText={setCommentText}
                        editingCommentIds={editingCommentIds}
                        setEditingCommentIds={setEditingCommentIds}
                        editingReplyIds={editingReplyIds}
                        setEditingReplyIds={setEditingReplyIds}
                        handleUpdateComment={handleUpdateComment}
                        editingMessageId={editingMessageId}
                        setEditingMessageId={setEditingMessageId}
                        editingMessageText={editingMessageText}
                        setEditingMessageText={setEditingMessageText}
                        handleUpdateMessageContent={handleUpdateMessageContent}
                        handleDeleteMessage={handleDeleteMessage}
                    />
                </TabsContent>
                <TabsContent value="trash">
                    <ReviewList 
                        list={filteredReviews("trash")} 
                        lang={lang} 
                        replyText={replyText} 
                        setReplyText={setReplyText} 
                        handleReply={handleReply} 
                        confirmStatusUpdate={confirmStatusUpdate} 
                        handleDeletePermanently={handleDeletePermanently}
                        commentText={commentText}
                        setCommentText={setCommentText}
                        editingCommentIds={editingCommentIds}
                        setEditingCommentIds={setEditingCommentIds}
                        editingReplyIds={editingReplyIds}
                        setEditingReplyIds={setEditingReplyIds}
                        handleUpdateComment={handleUpdateComment}
                        editingMessageId={editingMessageId}
                        setEditingMessageId={setEditingMessageId}
                        editingMessageText={editingMessageText}
                        setEditingMessageText={setEditingMessageText}
                        handleUpdateMessageContent={handleUpdateMessageContent}
                        handleDeleteMessage={handleDeleteMessage}
                    />
                </TabsContent>
            </Tabs>

            <ConfirmDialog 
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                danger={confirmModal.danger}
                icon={confirmModal.icon}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    )
}

function ReviewList({ 
    list, 
    lang, 
    replyText, 
    setReplyText, 
    handleReply, 
    confirmStatusUpdate, 
    handleDeletePermanently,
    commentText,
    setCommentText,
    editingCommentIds,
    setEditingCommentIds,
    editingReplyIds,
    setEditingReplyIds,
    handleUpdateComment,
    editingMessageId,
    setEditingMessageId,
    editingMessageText,
    setEditingMessageText,
    handleUpdateMessageContent,
    handleDeleteMessage
}: { 
    list: any[], 
    lang: string, 
    replyText: { [key: string]: string }, 
    setReplyText: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>, 
    handleReply: (id: string) => void, 
    confirmStatusUpdate: (id: string, status: ReviewStatus) => void, 
    handleDeletePermanently: (id: string) => void,
    commentText: { [key: string]: string },
    setCommentText: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    editingCommentIds: Set<string>,
    setEditingCommentIds: React.Dispatch<React.SetStateAction<Set<string>>>,
    editingReplyIds: Set<string>,
    setEditingReplyIds: React.Dispatch<React.SetStateAction<Set<string>>>,
    handleUpdateComment: (id: string) => void,
    editingMessageId: string | null,
    setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>,
    editingMessageText: { [key: string]: string },
    setEditingMessageText: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    handleUpdateMessageContent: (messageId: string, reviewId: string) => void,
    handleDeleteMessage: (messageId: string, reviewId: string) => void
}) {
    return (
        <div className="grid gap-4 mt-6">
            {list.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border border-border space-y-4">
                    <ShieldAlert className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground text-sm">{lang === 'ar' ? 'لا توجد تقييمات في هذا القسم' : 'No reviews found in this section'}</p>
                </div>
            ) : (
                list.map(review => (
                    <Card key={review.id} className="bg-card border-border hover:border-primary/20 transition-all overflow-hidden group shadow-none">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm">
                                                {review.user?.name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground">{review.user?.name}</h3>
                                                <span className="text-[10px] text-muted-foreground">{review.user?.email}</span>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                                            {format(new Date(review.createdAt), 'dd/MM/yyyy')}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4 mt-3">
                                        <Link href={`/store/${review.productId}`} target="_blank" className="text-xs text-[#0066FF] hover:underline flex items-center gap-1 font-bold group/link">
                                            {lang === 'ar' ? (review.product?.nameAr || review.product?.name) : review.product?.name}
                                            <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                        </Link>
                                        <div className="flex bg-muted px-2 py-1 rounded-lg gap-0.5">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-800'}`} />
                                            ))}
                                        </div>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                                            review.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' : 
                                            review.status === 'HIDDEN' ? 'bg-yellow-500/10 text-yellow-500' : 
                                            'bg-red-500/10 text-red-500'
                                        }`}>
                                            {review.status}
                                        </span>
                                    </div>

                                    <div className="relative group/comment mt-3">
                                        {editingCommentIds.has(review.id) ? (
                                            <div className="flex gap-2">
                                                <textarea
                                                    value={commentText[review.id] || ""}
                                                    onChange={(e) => setCommentText(prev => ({ ...prev, [review.id]: e.target.value }))}
                                                    className="flex-1 bg-background border border-primary/30 rounded-2xl p-4 text-[13px] text-foreground focus:outline-none min-h-[80px]"
                                                />
                                                <div className="flex flex-col gap-2">
                                                    <button 
                                                        onClick={() => handleUpdateComment(review.id)}
                                                        className="p-2 bg-emerald-500 rounded-xl text-primary-foreground transition-all hover:scale-105"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingCommentIds(prev => {
                                                            const next = new Set(prev)
                                                            next.delete(review.id)
                                                            return next
                                                        })}
                                                        className="p-2 bg-muted rounded-xl text-primary-foreground transition-all hover:scale-105"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative group/content">
                                                <p className="text-foreground bg-muted/40 p-4 rounded-2xl text-[13px] leading-relaxed border border-border">
                                                    "{review.comment}"
                                                </p>
                                                <button 
                                                    onClick={() => {
                                                        setCommentText(prev => ({ ...prev, [review.id]: review.comment }))
                                                        setEditingCommentIds(prev => new Set(prev).add(review.id))
                                                    }}
                                                    className="absolute top-2 right-2 p-1.5 bg-muted rounded-lg text-muted-foreground opacity-0 group-hover/content:opacity-100 transition-all hover:text-foreground"
                                                >
                                                    <MessageSquare className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 border-r-2 md:border-r-0 md:border-l-2 border-[#0066FF]/20 pr-4 md:pr-0 md:pl-4 transition-all space-y-4">
                                        {/* Threaded View for Admin */}
                                        {review.messages && review.messages.length > 0 && (
                                            <div className="space-y-3 bg-muted/20 p-4 rounded-2xl border border-border">
                                                <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    <MessageSquare className="w-3 h-3" />
                                                    {lang === 'ar' ? 'سجل المحادثة' : 'Conversation History'}
                                                </div>
                                                {review.messages.map((msg: any) => (
                                                    <div 
                                                        key={msg.id} 
                                                        className="w-full relative group/msg"
                                                    >
                                                        {editingMessageId === msg.id ? (
                                                            <div className="flex gap-2 w-full p-2 bg-background border border-primary/30 rounded-xl">
                                                                <input 
                                                                    className="flex-1 bg-transparent px-2 text-[13px] text-foreground outline-none"
                                                                    value={editingMessageText[msg.id] || ''}
                                                                    onChange={(e) => setEditingMessageText(prev => ({ ...prev, [msg.id]: e.target.value }))}
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateMessageContent(msg.id, review.id)}
                                                                    autoFocus
                                                                />
                                                                <button onClick={() => handleUpdateMessageContent(msg.id, review.id)} className="p-1 px-3 bg-[#0066FF] rounded-lg text-primary-foreground font-bold text-[10px]">Save</button>
                                                                <button onClick={() => setEditingMessageId(null)} className="p-1 px-3 bg-muted rounded-lg text-primary-foreground font-bold text-[10px]">Cancel</button>
                                                            </div>
                                                        ) : (
                                                            <div className={`w-full p-4 rounded-xl text-[13px] border relative ${
                                                                msg.role === 'ADMIN' 
                                                                    ? 'bg-[#0066FF]/5 text-[#0066FF] border-[#0066FF]/20' 
                                                                    : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20'
                                                            }`}>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${msg.role === 'ADMIN' ? 'bg-[#0066FF]' : 'bg-emerald-500'}`}>
                                                                            {msg.role === 'ADMIN' ? <Star className="w-2.5 h-2.5 fill-white text-white" /> : <User className="w-2.5 h-2.5 text-white" />}
                                                                        </div>
                                                                        <span className="font-bold text-[10px] uppercase tracking-widest">
                                                                            {msg.role === 'ADMIN' ? (lang === 'ar' ? 'الإدارة' : 'Admin') : (lang === 'ar' ? 'العميل' : 'Customer')}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        {/* Tooltips or actions on hover */}
                                                                        <div className="flex gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                                                                            <button 
                                                                                onClick={() => {
                                                                                    setEditingMessageText(prev => ({ ...prev, [msg.id]: msg.content }))
                                                                                    setEditingMessageId(msg.id)
                                                                                }}
                                                                                className="p-1 hover:bg-accent rounded-lg text-zinc-500 hover:text-white"
                                                                            >
                                                                                <MessageSquare className="w-3 h-3" />
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => handleDeleteMessage(msg.id, review.id)}
                                                                                className="p-1 hover:bg-accent rounded-lg text-zinc-500 hover:text-red-500"
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                        <div className="text-[10px] opacity-40 font-mono">
                                                                            {format(new Date(msg.createdAt), 'dd/MM/yyyy HH:mm')}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <p className="font-medium">"{msg.content}"</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* New Reply Input (Always visible for approved reviews) */}
                                        {review.status === 'APPROVED' && !editingReplyIds.has(review.id) && (
                                            <div className="flex gap-2 bg-muted/40 p-2 rounded-2xl border border-border">
                                                <input 
                                                    type="text" 
                                                    placeholder={lang === 'ar' ? "أضف رداً جديداً هنا..." : "Add a new reply to discussion..."}
                                                    className="flex-1 bg-transparent px-3 py-2 text-xs text-foreground focus:outline-none"
                                                    value={replyText[review.id] || ''}
                                                    onChange={(e) => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleReply(review.id)}
                                                />
                                                <button 
                                                    onClick={() => handleReply(review.id)}
                                                    className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-[10px] font-black transition-all shadow-none active:scale-95"
                                                >
                                                    {lang === 'ar' ? 'إرسال' : 'Send'}
                                                </button>
                                            </div>
                                        )}

                                        {/* Legacy/Edit Mode Toggle */}
                                        {review.reply && !editingReplyIds.has(review.id) ? (
                                            <div className="hidden"> {/* Hidden because we use threaded view now, but keep logic if needed */}
                                                <button 
                                                    onClick={() => {
                                                        setReplyText(prev => ({ ...prev, [review.id]: review.reply }))
                                                        setEditingReplyIds(prev => new Set(prev).add(review.id))
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        ) : editingReplyIds.has(review.id) && (
                                            /* This part handles editing an existing admin reply if we want to keep that feature */
                                            <div className="flex gap-2 bg-muted/40 p-2 rounded-2xl border border-[#0066FF]/30">
                                                <input 
                                                    type="text" 
                                                    className="flex-1 bg-transparent px-3 py-2 text-xs text-foreground focus:outline-none"
                                                    value={replyText[review.id] || ''}
                                                    onChange={(e) => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
                                                />
                                                <div className="flex gap-1">
                                                    <button 
                                                        onClick={() => handleReply(review.id)}
                                                        className="px-4 bg-emerald-500 text-primary-foreground rounded-xl text-[10px] font-black"
                                                    >
                                                        {lang === 'ar' ? 'حفظ' : 'Save'}
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingReplyIds(prev => {
                                                            const next = new Set(prev)
                                                            next.delete(review.id)
                                                            return next
                                                        })}
                                                        className="px-4 bg-muted text-primary-foreground rounded-xl text-[10px] font-black"
                                                    >
                                                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sidebar Actions */}
                                <div className="flex flex-row md:flex-col gap-2 shrink-0 md:border-l border-border/10 pt-4 md:pt-0 md:pl-6 justify-center">
                                    {review.status === 'PENDING' ? (
                                        <div className="flex flex-row md:flex-col gap-2 w-full">
                                            <button 
                                                onClick={() => confirmStatusUpdate(review.id, 'APPROVED')}
                                                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-2xl text-[11px] font-black transition-all"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                {lang === 'ar' ? 'قبول' : 'Approve'}
                                            </button>
                                            <button 
                                                onClick={() => confirmStatusUpdate(review.id, 'TRASHED')}
                                                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[11px] font-black transition-all"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                {lang === 'ar' ? 'رفض' : 'Reject'}
                                            </button>
                                        </div>
                                    ) : review.status === 'APPROVED' ? (
                                        <button 
                                            onClick={() => confirmStatusUpdate(review.id, 'HIDDEN')}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-background border border-border text-yellow-500 hover:bg-yellow-500 hover:text-primary-foreground rounded-2xl text-[11px] font-black transition-all group/btn"
                                            title={lang === 'ar' ? 'إخفاء عن العامة' : 'Hide from public'}
                                        >
                                            <EyeOff className="w-4 h-4" />
                                            {lang === 'ar' ? 'إخفاء' : 'Hide'}
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => confirmStatusUpdate(review.id, 'APPROVED')}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-background border border-border text-emerald-500 hover:bg-emerald-500 hover:text-primary-foreground rounded-2xl text-[11px] font-black transition-all"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            {lang === 'ar' ? 'موافقة' : 'Approve'}
                                        </button>
                                    )}

                                    {review.status !== 'TRASHED' && review.status !== 'PENDING' && (
                                        <button 
                                            onClick={() => confirmStatusUpdate(review.id, 'TRASHED')}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-background border border-border text-red-400 hover:bg-red-500 hover:text-primary-foreground rounded-2xl text-[11px] font-black transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            {lang === 'ar' ? 'سلة المهملات' : 'Trash'}
                                        </button>
                                    )}
                                    
                                    {review.status === 'TRASHED' && (
                                        <div className="flex flex-row md:flex-col gap-2 w-full">
                                            <button 
                                                onClick={() => confirmStatusUpdate(review.id, 'APPROVED')}
                                                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-background border border-border text-blue-400 hover:bg-blue-500 hover:text-primary-foreground rounded-2xl text-[11px] font-black transition-all"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                                {lang === 'ar' ? 'استعادة' : 'Restore'}
                                            </button>
                                            <button 
                                                onClick={() => handleDeletePermanently(review.id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[11px] font-black transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {lang === 'ar' ? 'حذف نهائي' : 'Hard Delete'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    )
}
