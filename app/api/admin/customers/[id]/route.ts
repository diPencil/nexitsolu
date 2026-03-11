import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
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
                favorites: {
                    select: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                nameAr: true,
                                image: true,
                                price: true
                            }
                        }
                    }
                },
                wishlist: {
                    select: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                nameAr: true,
                                image: true,
                                price: true
                            }
                        }
                    }
                },
                orders: {
                    select: {
                        id: true,
                        total: true,
                        status: true,
                        createdAt: true,
                        orderNumber: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                invoices: {
                    select: {
                        id: true,
                        invoiceNo: true,
                        amount: true,
                        status: true,
                        createdAt: true,
                        dueDate: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                subscriptions: {
                    select: {
                        id: true,
                        planName: true,
                        amount: true,
                        status: true,
                        startDate: true,
                        endDate: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                managedITRequests: {
                    select: {
                        id: true,
                        companyName: true,
                        industry: true,
                        services: true,
                        status: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Flatten the data for easier consumption
        const flattenedUser = {
            ...user,
            favorites: user.favorites.map(f => f.product),
            wishlist: user.wishlist.map(w => w.product)
        };

        return NextResponse.json(flattenedUser);
    } catch (error: any) {
        console.error("GET user error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Perform cascading deletion manually
        // We delete order-related items first
        await prisma.orderItem.deleteMany({ where: { order: { userId: id } } });
        await prisma.invoice.deleteMany({ where: { userId: id } });
        await prisma.order.deleteMany({ where: { userId: id } });

        // Then other relations
        await prisma.reviewMessage.deleteMany({ where: { userId: id } });
        await prisma.review.deleteMany({ where: { userId: id } });
        await prisma.message.deleteMany({
            where: {
                OR: [
                    { senderId: id },
                    { receiverId: id }
                ]
            }
        });
        await prisma.notification.deleteMany({ where: { userId: id } });
        await prisma.favorite.deleteMany({ where: { userId: id } });
        await prisma.wishlist.deleteMany({ where: { userId: id } });
        await prisma.managedITRequest.deleteMany({ where: { userId: id } });
        await prisma.subscription.deleteMany({ where: { userId: id } });
        await prisma.conversation.deleteMany({ where: { userId: id } });

        // Finally, delete the user
        await prisma.user.delete({
            where: { id }
        });

        return new NextResponse("User deleted", { status: 200 });
    } catch (error: any) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const body = await req.json();

        // If password is provided, hash it
        if (body.password) {
            body.password = await bcrypt.hash(body.password, 10);
        } else {
            delete body.password;
        }

        const user = await prisma.user.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
                username: body.username,
                password: body.password,
                role: body.role,
                phone: body.phone,
                whatsapp: body.whatsapp,
                position: body.position,
                governorate: body.governorate,
                status: body.status,
            } as any
        });

        return NextResponse.json(user);
    } catch (error: any) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
