"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n-context"
import { Star, Send, User, MessageCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { format } from "date-fns"

export default function ReviewsSection({ productId }: { productId: string }) {
    const { lang } = useLanguage()
    const { data: session } = useSession()
    const [reviews, setReviews] = useState<any[]>([])
    const [rating, setRating] = useState(5)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [customerReplyText, setCustomerReplyText] = useState<{ [key: string]: string }>({})
    const [isSubmittingReply, setIsSubmittingReply] = useState<{ [key: string]: boolean }>({})

    useEffect(() => {
        fetchReviews()
    }, [productId])

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?productId=${productId}`)
            if (res.ok) {
                const data = await res.json()
                // Show approved reviews OR pending reviews that belong to the current user
                const relevantReviews = data.filter((r: any) => 
                    r.status === 'APPROVED' || (session?.user && r.userId === (session.user as any).id)
                )
                setReviews(relevantReviews)
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session) {
            alert(lang === 'ar' ? 'يجب تسجيل الدخول لإضافة تقييم' : 'You must be logged in to review')
            return
        }
        if (!comment.trim()) return

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, rating, comment })
            })

            if (res.ok) {
                const newReview = await res.json()
                setReviews(prev => [newReview, ...prev])
                setComment("")
                setRating(5)
            }
        } catch (error) {
            console.error("Failed to submit review", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSubmitCustomerReply = async (reviewId: string) => {
        const text = customerReplyText[reviewId]
        if (!text?.trim()) return

        setIsSubmittingReply(prev => ({ ...prev, [reviewId]: true }))
        try {
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerReply: text })
            })

            if (res.ok) {
                const updatedReview = await res.json()
                setReviews(prev => prev.map(r => r.id === reviewId ? { 
                    ...r, 
                    messages: updatedReview.messages,
                    customerReply: updatedReview.customerReply, 
                    customerReplyAt: updatedReview.customerReplyAt 
                } : r))
                setCustomerReplyText(prev => ({ ...prev, [reviewId]: "" }))
            }
        } catch (error) {
            console.error("Failed to submit customer reply", error)
        } finally {
            setIsSubmittingReply(prev => ({ ...prev, [reviewId]: false }))
        }
    }

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0"

    return (
        <div className={`mt-20 border-t border-white/5 pt-12 ${lang === 'ar' ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                {lang === 'ar' ? 'تقييمات العملاء' : 'Customer Reviews'}
                <span className="text-lg text-zinc-500 ml-2 font-mono">({reviews.length})</span>
            </h2>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Stats & Add Review */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Overall Rating */}
                    <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 text-center">
                        <div className="text-5xl font-black text-white mb-2">{averageRating}</div>
                        <div className="flex justify-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star 
                                    key={star} 
                                    className={`w-5 h-5 ${star <= Math.round(Number(averageRating)) ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-700'}`} 
                                />
                            ))}
                        </div>
                        <p className="text-xs text-zinc-500">
                            {lang === 'ar' ? `بناءً على ${reviews.length} تقييم` : `Based on ${reviews.length} reviews`}
                        </p>
                    </div>

                    {/* Write Review Form */}
                    <div className="bg-[#111111] border border-white/5 rounded-3xl p-6">
                        <h3 className="font-bold mb-4">{lang === 'ar' ? 'أضف تقييمك' : 'Write a Review'}</h3>
                        {session ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex gap-2 justify-center mb-6">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star 
                                                className={`w-8 h-8 ${(hoverRating || rating) >= star ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-700'}`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder={lang === 'ar' ? 'شاركنا رأيك في هذا المنتج...' : 'Share your thoughts on this product...'}
                                    className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-[#0066FF] focus:outline-none min-h-[120px] resize-y"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !comment.trim()}
                                    className="w-full bg-[#0066FF] hover:bg-white hover:text-[#0066FF] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                    {isSubmitting 
                                        ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') 
                                        : (lang === 'ar' ? 'نشر التقييم' : 'Post Review')}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-sm text-zinc-400 mb-4">
                                    {lang === 'ar' ? 'يجب تسجيل الدخول لإضافة تقييم' : 'Please login to write a review'}
                                </p>
                                <a href="/login" className="text-[#0066FF] font-bold hover:underline">
                                    {lang === 'ar' ? 'تسجيل الدخول' : 'Login Now'}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                    {isLoading ? (
                        <div className="text-center text-zinc-500 py-12">{lang === 'ar' ? 'جاري تحميل التقييمات...' : 'Loading reviews...'}</div>
                    ) : reviews.length === 0 ? (
                        <div className="bg-[#111111] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                            <MessageCircle className="w-12 h-12 text-zinc-700 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">{lang === 'ar' ? 'كن أول من يقيم!' : 'Be the first to review!'}</h3>
                            <p className="text-sm text-zinc-500">{lang === 'ar' ? 'لم يقم أحد بتقييم هذا المنتج بعد.' : 'No one has reviewed this product yet.'}</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-[#111111] border border-white/5 rounded-3xl p-6 transition-all hover:bg-white/2">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-400 shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{review.user.name || review.user.username || 'User'}</h4>
                                            <div className="flex items-center gap-1 mt-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star 
                                                        key={star} 
                                                        className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-700'}`} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-zinc-500 font-mono">
                                            {format(new Date(review.createdAt), 'dd MMM yyyy')}
                                        </span>
                                        {review.status === 'PENDING' && (
                                            <span className="bg-yellow-500/10 text-yellow-500 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-yellow-500/20">
                                                {lang === 'ar' ? 'بانتظار الموافقة' : 'Pending Approval'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                                    {review.comment}
                                </p>

                                {/* Threaded Conversation */}
                                {(review.reply || (review.messages && review.messages.length > 0)) && (
                                    <div className="mt-6 space-y-4 border-t border-white/5 pt-6">
                                        <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-[#0066FF]">
                                            <MessageCircle className="w-3 h-3" />
                                            {lang === 'ar' ? 'المحادثة' : 'Conversation'}
                                        </div>
                                        
                                        {/* Map through the messages thread */}
                                        {review.messages?.map((msg: any) => (
                                            <div 
                                                key={msg.id} 
                                                className="w-full"
                                            >
                                                <div className={`w-full rounded-2xl p-5 text-sm border ${
                                                    msg.role === 'ADMIN' 
                                                        ? 'bg-[#0066FF]/5 border-[#0066FF]/20 text-white' 
                                                        : 'bg-zinc-800/30 border-white/5 text-zinc-100'
                                                }`}>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            {msg.role === 'ADMIN' ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center">
                                                                        <Star className="w-3 h-3 fill-white text-white" />
                                                                    </div>
                                                                    <span className="font-black text-[10px] uppercase tracking-widest text-[#0066FF]">Nexit Team</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                                                                        <User className="w-3 h-3 text-zinc-400" />
                                                                    </div>
                                                                    <span className="font-black text-[10px] uppercase tracking-widest text-zinc-300">{review.user.name || 'Customer'}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] font-mono opacity-40">
                                                            {format(new Date(msg.createdAt), 'dd/MM/yyyy HH:mm')}
                                                        </div>
                                                    </div>
                                                    <p className="leading-relaxed font-medium italic">"{msg.content}"</p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Input for customer to reply back */}
                                        {session?.user && (session.user as any).id === review.userId && review.status === 'APPROVED' && (
                                            <div className="mt-6 flex gap-2">
                                                <div className="flex-1 relative group">
                                                    <input 
                                                        type="text"
                                                        value={customerReplyText[review.id] || ""}
                                                        onChange={(e) => setCustomerReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
                                                        placeholder={lang === 'ar' ? 'أضف رداً جديداً...' : 'Add a follow-up reply...'}
                                                        className="w-full bg-black border border-white/5 rounded-2xl px-5 py-3 text-xs text-white focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/20 outline-none transition-all pr-12"
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSubmitCustomerReply(review.id)}
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                                                        <Send className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleSubmitCustomerReply(review.id)}
                                                    disabled={isSubmittingReply[review.id] || !customerReplyText[review.id]?.trim()}
                                                    className="bg-[#0066FF] hover:bg-white hover:text-[#0066FF] text-white px-6 rounded-2xl text-[10px] font-black transition-all disabled:opacity-50 shadow-lg shadow-blue-500/10 active:scale-95"
                                                >
                                                    {isSubmittingReply[review.id] ? "..." : (lang === 'ar' ? 'إرسال' : 'Send')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
