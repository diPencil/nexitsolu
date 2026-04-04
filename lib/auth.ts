import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const identifier = credentials?.identifier?.trim();
                const password = credentials?.password;

                if (!identifier || !password) {
                    throw new Error("Invalid credentials");
                }

                // Try to find user by email or username
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: identifier },
                            { username: identifier }
                        ]
                    },
                });

                if (!user || !user?.password) {
                    console.warn("[auth] user not found for identifier:", identifier);
                    throw new Error("Invalid credentials");
                }

                const isPasswordCorrect = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isPasswordCorrect) {
                    console.warn("[auth] password mismatch for:", identifier);
                    throw new Error("Invalid credentials");
                }

                if ((user as any).status === "BLOCKED") {
                    throw new Error("ACCOUNT_BLOCKED");
                }

                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
                token.email = (user as any).email;
                token.name = user.name;
                token.username = (user as any).username;
                token.phone = (user as any).phone;
                token.whatsapp = (user as any).whatsapp;
                token.position = (user as any).position;
                token.governorate = (user as any).governorate;
                token.status = (user as any).status;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
                (session.user as any).username = token.username;
                (session.user as any).phone = token.phone;
                (session.user as any).whatsapp = token.whatsapp;
                (session.user as any).position = token.position;
                (session.user as any).governorate = token.governorate;
                (session.user as any).status = token.status;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    events: {
        async signIn({ user, isNewUser }) {
            const { recordActivity } = await import("@/lib/activity-log");
            await recordActivity({
                userId: user.id,
                userEmail: user.email ?? null,
                userRole: String((user as { role?: string }).role ?? ""),
                username: (user as { username?: string | null }).username ?? null,
                action: "AUTH_SIGN_IN",
                category: "auth",
                summary: isNewUser
                    ? "Signed in (new user)"
                    : "Signed in",
            });
        },
        async signOut({ token }) {
            const t = token as {
                sub?: string;
                email?: string | null;
                role?: string;
                username?: string | null;
            };
            if (!t?.sub) return;
            const { recordActivity } = await import("@/lib/activity-log");
            await recordActivity({
                userId: t.sub,
                userEmail: t.email ?? null,
                userRole: t.role ? String(t.role) : null,
                username: t.username ?? null,
                action: "AUTH_SIGN_OUT",
                category: "auth",
                summary: "Signed out",
            });
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
