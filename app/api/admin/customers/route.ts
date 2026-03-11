import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");
        const id = searchParams.get("id");

        if (id) {
            const customer = await prisma.user.findUnique({
                where: { id },
                include: {
                    orders: {
                        include: {
                            items: {
                                include: { product: true }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    },
                    favorites: true,
                    wishlist: true,
                    invoices: {
                        orderBy: { createdAt: 'desc' }
                    },
                    subscriptions: {
                        orderBy: { createdAt: 'desc' }
                    },
                    managedITRequests: {
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });
            return NextResponse.json(customer);
        }

        const where = role ? { role: role.toUpperCase() as any } : {};

        const customers = await prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
                phone: true,
                whatsapp: true,
                position: true,
                governorate: true,
                createdAt: true,
                status: true,
                _count: {
                    select: { 
                        orders: true,
                        favorites: true,
                        wishlist: true,
                        invoices: true,
                        subscriptions: true,
                        managedITRequests: true
                    }
                }
            }
        });
        return NextResponse.json(customers);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { name, email, username, password, role, phone, whatsapp, position, governorate, status } = await req.json();

        // Check if user exists
        const existing = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });

        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password || "Nexit123!", 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                username,
                password: hashedPassword,
                role: role || "CUSTOMER",
                phone,
                whatsapp,
                position,
                governorate,
                status: status || "ACTIVE"
            } as any
        });

        return NextResponse.json(user);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
