import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // 1. Check if an admin already exists
    const adminExists = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    if (adminExists) {
      return NextResponse.json({
        message: "Admin already exists. No action taken.",
        user: adminExists.email,
      });
    }

    // 2. Create the new admin
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    
    const newAdmin = await prisma.user.create({
      data: {
        email: "admin@nexitsolu.com",
        username: "admin",
        password: hashedPassword,
        role: "ADMIN",
        name: "Main Admin",
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      message: "Admin created successfully!",
      credentials: {
        email: "admin@nexitsolu.com",
        password: "Admin@123"
      },
      note: "PLEASE DELETE THIS FILE (/app/api/setup-admin/route.ts) IMMEDIATELY AFTER USE!"
    });
  } catch (error: any) {
    console.error("Setup Error:", error);
    return NextResponse.json({ 
      error: "Something went wrong", 
      details: error.message 
    }, { status: 500 });
  }
}
