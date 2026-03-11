import { NextResponse } from "next/server";
import { NEXIT_KNOWLEDGE_BASE } from "@/lib/ai/knowledge-base";

export async function POST(req: Request) {
    try {
        const { message, history, lang } = await req.json();

        const systemPrompt = `
You are NexBot AI, the official and highly intelligent assistant for NexIT Solutions (Nexit).
Your goal is to provide deep insights into our services, solutions, partners, and digital ecosystem.

IMPORTANT CONTEXT:
1. NexIT Solutions is POWERED and SUPPORTED by Pencil Studio (Pencil Agency).
2. If asked about "Pencil Studio", "Pencil Agency", or "بينسل استوديو", explain that they are our strategic partner providing creative and technical support. Mention their website: http://dipencil.com/
3. Use the provided knowledge base and sitemap to guide users. If a user asks for a specific page, tell them the path (e.g., "/about/nexit-land").

Knowledge Base:
${JSON.stringify(NEXIT_KNOWLEDGE_BASE, null, 2)}

Instructions:
1. Respond in the same language as the user (${lang === 'ar' ? 'Arabic' : 'English'}).
2. Be extremely helpful, professional, and knowledgeable about ALL NexIT services.
3. If they ask about services, refer to the specific sub-services in the knowledge base.
4. If they ask about contact info, mention info@nexitsolu.com, sales@nexitsolu.com, or +20 103 162 0990.
5. Provide clear, concise, and technically accurate information.
6. Use the sitemap to suggest relevant pages. ALWAYS provide links in Markdown format [Page Name](path) for ANY project section or service you mention. For example, instead of just saying "Managed IT", say "[Managed IT](/about/tech-support)".
7. Use Markdown links for URLs: [Link Name](URL). For example: [NexIT Land](/about/nexit-land).
8. For WhatsApp contact, always use wa.me links: [WhatsApp](https://wa.me/201031620990).
9. DO NOT use markdown formatting like **bold**, *italics*, or ### headers. Use plain text and simple bullet points (using hyphens -) only. Links are the ONLY exception to the markdown restriction.
        `;

        const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!googleKey) {
            console.warn("No Google AI API key found. Providing mock response.");
            const mockResponse = lang === 'ar' 
                ? "عذراً، لم يتم إعداد مفتاح API للذكاء الاصطناعي بعد. ولكن يمكنني إخبارك أن NexIT تقدم أفضل الحلول التقنية."
                : "Sorry, AI API keys are not configured yet. However, I can tell you that NexIT provides the best technical solutions.";
            return NextResponse.json({ response: mockResponse });
        }

        // Convert history to Gemini format
        const chatHistory = history.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        chatHistory.push({
            role: 'user',
            parts: [{ text: message }],
        });

        const fetchResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${googleKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
                contents: chatHistory,
                generationConfig: {
                    maxOutputTokens: 1000,
                }
            })
        });

        const data = await fetchResponse.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            throw new Error(data.error.message || "Gemini API error");
        }

        if (!data.candidates || data.candidates.length === 0) {
            console.error("Unexpected Gemini response structure:", data);
            throw new Error("No candidates in response");
        }

        const text = data.candidates[0].content.parts[0].text;
        return NextResponse.json({ response: text });

    } catch (error) {
        console.error("AI Chat Error:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
